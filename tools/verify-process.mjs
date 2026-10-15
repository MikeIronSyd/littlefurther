import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { once } from "node:events";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";
import { pathToFileURL } from "node:url";

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
    env: {
      ...process.env,
      CAPSTONE_BIND_HOST: "127.0.0.1",
      CAPSTONE_PORT: String(port),
      CAPSTONE_DATA_DIR: directory,
      CAPSTONE_AI_DISABLED: "1",
    },
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
async function rejectInvalidBindHosts() {
  const preload = path.join(directory, "guard-credential-read.mjs");
  const marker = path.join(directory, "credential-read-attempted");
  await writeFile(
    preload,
    `import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import path from "node:path";
const original = fs.promises.readFile;
fs.promises.readFile = async function(filename, ...options) {
  if (path.basename(String(filename)) === "ai-provider.env") {
    fs.writeFileSync(${JSON.stringify(marker)}, "attempted");
    throw new Error("Credential access is forbidden by this check");
  }
  return original.call(this, filename, ...options);
};
syncBuiltinESMExports();
`,
  );
  for (const [index, value] of ["", "localhost", "192.0.2.1", " 127.0.0.1"].entries()) {
    const dataDirectory = path.join(directory, `invalid-bind-${index}`);
    const env = {
      ...process.env,
      CAPSTONE_BIND_HOST: value,
      CAPSTONE_PORT: String(port),
      CAPSTONE_DATA_DIR: dataDirectory,
      CAPSTONE_AI_DISABLED: "0",
    };
    delete env.OPENAI_API_KEY;
    const rejected = spawn(
      process.execPath,
      ["--import", pathToFileURL(preload).href, "dist/server/index.js"],
      { cwd: process.cwd(), env, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] },
    );
    let errorOutput = "";
    rejected.stdout.resume();
    rejected.stderr.on("data", (chunk) => {
      errorOutput += chunk.toString();
    });
    const timeout = setTimeout(() => rejected.kill("SIGTERM"), 15_000);
    let code;
    try {
      [code] = await once(rejected, "exit");
    } finally {
      clearTimeout(timeout);
    }
    assert.equal(code, 1);
    assert.ok(errorOutput.includes("CAPSTONE_BIND_HOST must be 127.0.0.1 or 0.0.0.0"));
    await assert.rejects(access(dataDirectory), { code: "ENOENT" });
    await assert.rejects(access(marker), { code: "ENOENT" });
  }
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
  await rejectInvalidBindHosts();
  console.log("PASS: invalid bind hosts reject before data creation or credential-file access.");
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
      availabilityDates: ["2026-10-07", "2026-10-09", "2026-10-12"],
      targetDate: null,
      references: [],
      steps: [
        { title: "Read one section", scheduledDate: "2026-10-07", estimatedMinutes: 10 },
        { title: "Try the next example", scheduledDate: "2026-10-09", estimatedMinutes: 15 },
      ],
    })
  ).json();
  const endpoint = `/api/plans/${created.plan.id}`;
  const studied = await (
    await request(`${endpoint}/activities`, "POST", {
      requestId: randomUUID(),
      revision: created.plan.revision,
      stepId: created.plan.steps[0].id,
      minutes: 5,
      reflection: "Synthetic private note retained across process restart",
    })
  ).json();
  await request(`${endpoint}/completions`, "POST", {
    requestId: randomUUID(),
    revision: studied.plan.revision,
    stepId: created.plan.steps[0].id,
  });
  const completed = await (await request(endpoint)).json();
  const restart = { revision: completed.plan.revision, restartDate: "2026-10-12" };
  const preview = await (await request(`${endpoint}/comeback/preview`, "POST", restart)).json();
  assert.equal(preview.shiftDays, 3);
  assert.equal(preview.changes.length, 1);
  assert.equal(preview.changes[0].previousDate, "2026-10-09");
  assert.equal(preview.changes[0].proposedDate, "2026-10-12");
  const confirmation = { ...restart, requestId: randomUUID() };
  const before = await (await request(`${endpoint}/comeback/confirm`, "POST", confirmation)).json();
  assert.equal(before.plan.revision, completed.plan.revision + 1);
  assert.deepEqual(before.plan.steps[0], completed.plan.steps[0]);
  assert.deepEqual(before.activities, completed.activities);
  assert.deepEqual(before.completions, completed.completions);
  assert.equal(before.plan.steps[1].scheduledDate, "2026-10-12");
  const ownerCookie = cookie;
  const circle = await (
    await request("/api/circles", "POST", { requestId: randomUUID(), name: "Restart circle" })
  ).json();
  const circleEndpoint = `/api/circles/${circle.circleId}`;
  const inviteRequest = { requestId: randomUUID() };
  const invitation = await (
    await request(`${circleEndpoint}/invites`, "POST", inviteRequest)
  ).json();
  assert.equal(typeof invitation.token, "string");
  const shared = await (
    await request(`${circleEndpoint}/items`, "POST", {
      requestId: randomUUID(),
      kind: "commitment",
      text: "I will read one section this week.",
    })
  ).json();
  cookie = "";
  const peerAccount = {
    email: "restart-peer@example.invalid",
    password: randomBytes(24).toString("base64url"),
  };
  await request("/api/auth/sign-up/email", "POST", {
    ...peerAccount,
    name: "Synthetic restart peer",
  });
  const peerSession = await request("/api/auth/sign-in/email", "POST", peerAccount);
  cookie =
    peerSession.headers
      .getSetCookie()
      .find((value) => value.startsWith("better-auth.session_token="))
      ?.split(";", 1)[0] ?? "";
  assert.ok(cookie);
  const peerCookie = cookie;
  await request("/api/circle-invites/redeem", "POST", {
    requestId: randomUUID(),
    token: invitation.token,
  });
  await request(`${circleEndpoint}/items/${shared.itemId}/encouragement`, "POST", {
    requestId: randomUUID(),
    preset: "small_steps_count",
  });
  const circleBefore = await (await request(circleEndpoint)).json();
  assert.equal(circleBefore.circle.memberCount, 2);
  assert.equal(circleBefore.items[0].encouragements[0].preset, "small_steps_count");
  assert.equal(JSON.stringify(circleBefore).includes(before.activities[0].reflection), false);
  cookie = ownerCookie;
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
  const retried = await (
    await request(`${endpoint}/comeback/confirm`, "POST", confirmation)
  ).json();
  assert.deepEqual(retried, before);
  assert.deepEqual((await (await request(endpoint)).json()).plan, before.plan);
  const inviteRetry = await (
    await request(`${circleEndpoint}/invites`, "POST", inviteRequest)
  ).json();
  assert.equal(inviteRetry.token, null);
  assert.equal(inviteRetry.invite.id, invitation.invite.id);
  const ownerAfter = await (await request(circleEndpoint)).json();
  assert.equal(ownerAfter.circle.role, "owner");
  assert.deepEqual(ownerAfter.items, circleBefore.items);
  cookie = peerCookie;
  const peerAfter = await (await request(circleEndpoint)).json();
  assert.deepEqual(peerAfter, circleBefore);
  assert.equal(
    createHash("sha256")
      .update(await readFile(path.join(directory, "auth-secret")))
      .digest("hex"),
    secretHash,
  );
  console.log(
    "PASS: distinct Node processes retained both sessions, secret, Comeback dates/receipt, private study history, circle membership, explicit shared copy, preset encouragement and an invitation retry without the raw token.",
  );
  console.log(
    "Condition: local child-process termination/restart; no machine reboot or physical network-disconnection claim.",
  );
} finally {
  await stop();
  assert.ok(directory.startsWith(`${parent}${path.sep}restart-`));
  await rm(directory, { recursive: true, force: true });
}
