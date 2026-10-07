import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { once } from "node:events";
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";

// This check restarts the actual executable; factory-level reopen tests live separately.
const parent = path.resolve(".local/process-tests");
await mkdir(parent, { recursive: true });
const directory = await mkdtemp(path.join(parent, "restart-"));
const probe = createServer();
probe.listen(0, "127.0.0.1");
await once(probe, "listening");
const address = probe.address();
assert.ok(address && typeof address === "object");
const port = address.port;
probe.close();
await once(probe, "close");
const origin = `http://127.0.0.1:${port}`;
let child;
async function start() {
  child = spawn(process.execPath, ["dist/server/index.js"], {
    cwd: process.cwd(),
    env: { ...process.env, CAPSTONE_PORT: String(port), CAPSTONE_DATA_DIR: directory },
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const running = child;
  await new Promise((resolve, reject) => {
    let output = "";
    const timer = setTimeout(() => reject(new Error("Server startup timed out")), 15000);
    running.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    running.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Server exited before startup: ${code}`));
    });
    running.stdout.on("data", (chunk) => {
      output += chunk.toString();
      if (output.includes(`Local learning demo: ${origin}`)) {
        clearTimeout(timer);
        resolve();
      }
    });
    // Consume errors without printing configuration, account data or credentials.
    running.stderr.resume();
  });
  assert.equal((await fetch(`${origin}/api/health`)).status, 200);
  return running.pid;
}
async function stop() {
  if (!child || child.exitCode !== null) return;
  const exited = once(child, "exit");
  child.kill("SIGTERM");
  await exited;
  child = undefined;
}
let cookie = "";
async function request(endpoint, method = "GET", body) {
  const response = await fetch(`${origin}${endpoint}`, {
    method,
    headers: {
      ...(cookie ? { cookie } : {}),
      ...(body === undefined ? {} : { origin, "content-type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(15000),
  });
  assert.ok(response.ok, `${method} ${endpoint} returned ${response.status}`);
  return response;
}
try {
  const firstPid = await start();
  const password = randomBytes(24).toString("base64url");
  const account = { email: "restart-check@example.invalid", password };
  await request("/api/auth/sign-up/email", "POST", { ...account, name: "Synthetic restart check" });
  const signedIn = await request("/api/auth/sign-in/email", "POST", account);
  cookie =
    signedIn.headers
      .getSetCookie()
      .find((value) => value.startsWith("better-auth.session_token="))
      ?.split(";", 1)[0] ?? "";
  assert.ok(cookie);
  await request("/api/me", "PUT", { locale: "en", timezone: "Africa/Lagos" });
  const created = await (
    await request("/api/plans", "POST", {
      requestId: randomUUID(),
      goal: "Verify saved progress",
      templateId: null,
      availabilityDates: ["2026-10-07"],
      targetDate: null,
      references: [],
      steps: [{ title: "Read one section", scheduledDate: "2026-10-07", estimatedMinutes: 10 }],
    })
  ).json();
  const endpoint = `/api/plans/${created.plan.id}`;
  await request(`${endpoint}/activities`, "POST", {
    requestId: randomUUID(),
    stepId: created.plan.steps[0].id,
    minutes: 5,
    reflection: "Synthetic private note retained across process restart",
  });
  await request(`${endpoint}/completions`, "POST", {
    requestId: randomUUID(),
    revision: created.plan.revision,
    stepId: created.plan.steps[0].id,
  });
  const before = await (await request(endpoint)).json();
  const secretHash = createHash("sha256")
    .update(await readFile(path.join(directory, "auth-secret")))
    .digest("hex");
  await stop();
  const secondPid = await start();
  assert.notEqual(firstPid, secondPid);
  const after = await (await request(endpoint)).json();
  assert.deepEqual(after.plan, before.plan);
  assert.deepEqual(after.activities, before.activities);
  assert.deepEqual(after.completions, before.completions);
  assert.equal(after.progress.completed, 1);
  assert.equal(after.progress.studiedMinutes, 5);
  assert.equal(
    createHash("sha256")
      .update(await readFile(path.join(directory, "auth-secret")))
      .digest("hex"),
    secretHash,
  );
  console.log(
    "PASS: distinct Node processes retained session, secret, plan, private reflection, study time and explicit completion.",
  );
  console.log(
    "Condition: local child-process termination/restart; no machine reboot or physical network-disconnection claim.",
  );
} finally {
  await stop();
  assert.ok(directory.startsWith(`${parent}${path.sep}restart-`));
  await rm(directory, { recursive: true, force: true });
}
