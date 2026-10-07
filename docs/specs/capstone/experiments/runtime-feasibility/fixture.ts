// Isolated synthetic research fixture. This is not capstone product code.
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import express from "express";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { getMigrations } from "better-auth/db/migration";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";

process.env["BETTER_AUTH_TELEMETRY"] = "false";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
await mkdir(path.join(root, "runs"), { recursive: true });
const runDir = await mkdtemp(path.join(root, "runs", "run-"));
const dbFile = path.join(runDir, "synthetic.sqlite");
const secret = randomBytes(48).toString("base64url");
const password = randomBytes(24).toString("base64url");
const checks: { check: string; passed: boolean; detail: unknown }[] = [];
function check(name: string, condition: unknown, detail: unknown = null): asserts condition {
  checks.push({ check: name, passed: Boolean(condition), detail });
  assert.ok(condition, name);
}
let server: Server | undefined;
let database: Database.Database | undefined;
let baseURL = "";
let auth: ReturnType<typeof betterAuth>;
async function stop(): Promise<void> {
  if (server) {
    const running = server;
    server = undefined;
    running.closeAllConnections();
    await new Promise<void>((resolve, reject) => running.close(error => error ? reject(error) : resolve()));
  }
  database?.close();
  database = undefined;
}
async function start(): Promise<void> {
  database = new Database(dbFile);
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  const app = express();
  server = createServer(app);
  const running = server;
  await new Promise<void>((resolve, reject) => {
    running.once("error", reject);
    running.listen(0, "127.0.0.1", resolve);
  });
  const address = running.address();
  assert.ok(address && typeof address === "object");
  baseURL = `http://127.0.0.1:${address.port}`;
  const options: BetterAuthOptions = {
    appName: "Isolated capstone research",
    database,
    baseURL,
    secret,
    trustedOrigins: [baseURL],
    telemetry: { enabled: false },
    emailAndPassword: { enabled: true, autoSignIn: false, requireEmailVerification: false },
    // No logging of secrets, passwords, cookies, sessions or synthetic account details.
    logger: { disabled: true },
  };
  const migration = await getMigrations(options);
  check("migration_has_no_unsafe_changes", migration.unsafeChanges.length === 0, { count: migration.unsafeChanges.length });
  await migration.runMigrations();
  const migrated = await getMigrations(options);
  check("migration_idempotent", migrated.toBeCreated.length === 0 && migrated.toBeAdded.length === 0 && migrated.toBeAddedIndexes.length === 0);
  auth = betterAuth(options);
  app.all("/api/auth/*splat", toNodeHandler(auth));
  app.use(express.json());
  app.get("/research/private", async (request, response) => {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(request.headers) });
    if (!session) return void response.status(401).json({ error: "unauthenticated" });
    response.json({ userId: session.user.id });
  });
}
async function request(endpoint: string, options: { method?: string; body?: unknown; cookie?: string; origin?: string } = {}): Promise<Response> {
  const headers = new Headers();
  if (options.body !== undefined) headers.set("content-type", "application/json");
  if (options.cookie) headers.set("cookie", options.cookie);
  if (options.origin) headers.set("origin", options.origin);
  return fetch(`${baseURL}${endpoint}`, {
    method: options.method ?? "GET", headers,
    ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
    redirect: "manual", signal: AbortSignal.timeout(10000),
  });
}
function sessionCookie(response: Response): string {
  const headers = response.headers.getSetCookie();
  const cookie = headers.find(item => item.startsWith("better-auth.session_token="));
  assert.ok(cookie, "session cookie received");
  check("cookie_http_only_and_lax", /;\s*HttpOnly/i.test(cookie) && /;\s*SameSite=Lax/i.test(cookie));
  const value = cookie.split(";", 1)[0];
  assert.ok(value);
  return value;
}
async function json(response: Response): Promise<Record<string, unknown>> {
  return await response.json() as Record<string, unknown>;
}
let failure: string | null = null;
try {
  await start();
  assert.ok(database);
  check("sqlite_native_driver_load", true, database.prepare("SELECT sqlite_version() AS version").get());
  check("sqlite_wal_enabled", database.pragma("journal_mode", { simple: true }) === "wal");
  database.exec("CREATE TABLE research_note (id INTEGER PRIMARY KEY, value TEXT NOT NULL)");
  database.transaction(() => database!.prepare("INSERT INTO research_note VALUES (?, ?)").run(1, "retained synthetic note"))();
  check("sqlite_transaction_committed", (database.prepare("SELECT COUNT(*) AS count FROM research_note").get() as { count: number }).count === 1);
  try {
    database.transaction(() => {
      database!.prepare("INSERT INTO research_note VALUES (?, ?)").run(2, "must roll back");
      throw new Error("Intentional rollback sentinel");
    })();
  } catch (error) {
    assert.equal((error as Error).message, "Intentional rollback sentinel");
  }
  check("sqlite_transaction_rolled_back", (database.prepare("SELECT COUNT(*) AS count FROM research_note").get() as { count: number }).count === 1);
  check("auth_handler_ok", (await request("/api/auth/ok")).status === 200);
  check("anonymous_private_rejected", (await request("/research/private")).status === 401);
  const weak = await request("/api/auth/sign-up/email", { method: "POST", origin: baseURL, body: { name: "Synthetic weak", email: "weak@example.invalid", password: "short" } });
  check("short_password_rejected", weak.status === 400, { status: weak.status });
  const attacker = await request("/api/auth/sign-up/email", { method: "POST", origin: "https://untrusted.example.invalid", body: { name: "Synthetic blocked", email: "blocked@example.invalid", password } });
  check("untrusted_signup_origin_rejected", attacker.status === 403, { status: attacker.status });
  const cookies: string[] = [];
  const userIds: string[] = [];
  for (const label of ["alpha", "bravo"]) {
    const email = `${label}@example.invalid`;
    const signup = await request("/api/auth/sign-up/email", { method: "POST", origin: baseURL, body: { name: `Synthetic ${label}`, email, password } });
    check(`signup_${label}`, signup.status === 200, { status: signup.status });
    const signin = await request("/api/auth/sign-in/email", { method: "POST", origin: baseURL, body: { email, password } });
    check(`signin_${label}`, signin.status === 200, { status: signin.status });
    const cookie = sessionCookie(signin);
    cookies.push(cookie);
    const session = await request("/api/auth/get-session", { cookie });
    const sessionData = await json(session);
    const user = sessionData["user"] as { id: string; emailVerified: boolean };
    check(`session_${label}`, session.status === 200 && typeof user.id === "string");
    check(`email_unverified_${label}`, user.emailVerified === false);
    userIds.push(user.id);
    const privateResponse = await request("/research/private", { cookie });
    check(`authenticated_private_${label}`, privateResponse.status === 200 && (await json(privateResponse))["userId"] === user.id);
  }
  const cookieAlpha = cookies[0];
  const cookieBravo = cookies[1];
  assert.ok(cookieAlpha && cookieBravo);
  check("two_distinct_account_sessions", userIds[0] !== userIds[1] && cookieAlpha !== cookieBravo);
  const wrong = await request("/api/auth/sign-in/email", { method: "POST", origin: baseURL, body: { email: "alpha@example.invalid", password: randomBytes(24).toString("base64url") } });
  check("wrong_password_rejected", wrong.status === 401, { status: wrong.status });
  const badRedirect = await request("/api/auth/sign-in/email", { method: "POST", origin: baseURL, body: { email: "alpha@example.invalid", password, callbackURL: "https://untrusted.example.invalid" } });
  check("untrusted_callback_rejected", badRedirect.status === 403, { status: badRedirect.status });
  const evilLogout = await request("/api/auth/sign-out", { method: "POST", origin: "https://untrusted.example.invalid", cookie: cookieAlpha, body: {} });
  check("untrusted_authenticated_origin_rejected", evilLogout.status === 403, { status: evilLogout.status });
  check("rejected_logout_preserves_session", (await request("/research/private", { cookie: cookieAlpha })).status === 200);
  await stop();
  await start();
  assert.ok(database);
  const note = database.prepare("SELECT value FROM research_note WHERE id = 1").get() as { value: string };
  check("sqlite_close_reopen_persistence", note.value === "retained synthetic note");
  for (const [index, cookie] of cookies.entries()) {
    const response = await request("/research/private", { cookie });
    check(`auth_session_after_server_restart_${index + 1}`, response.status === 200 && (await json(response))["userId"] === userIds[index]);
  }
  const logout = await request("/api/auth/sign-out", { method: "POST", origin: baseURL, cookie: cookieAlpha, body: {} });
  check("logout_succeeds", logout.status === 200, { status: logout.status });
  check("logout_revokes_original_cookie", (await request("/research/private", { cookie: cookieAlpha })).status === 401);
  check("logout_does_not_revoke_other_user", (await request("/research/private", { cookie: cookieBravo })).status === 200);
} catch (error) {
  // Only assertion label or error type; do not log HTTP bodies or credential-bearing values.
  failure = error instanceof assert.AssertionError ? error.message : error instanceof Error ? error.name : "Unknown error";
  process.exitCode = 1;
} finally {
  await stop();
  const result = {
    kind: "isolated_runtime_research_not_product_verification",
    recordedAt: new Date().toISOString(),
    environment: { node: process.version, platform: process.platform, arch: process.arch },
    checks, failure, serverStopped: server === undefined, databaseClosed: database === undefined,
    limitations: ["HTTP-client fixture only; no browser UI, product data model, application authorization or learner outcomes verified", "No email verification or delivery; both synthetic accounts remain unverified", "SQLite close/reopen and server restart in one process, not a machine restart", "Ephemeral auth secret is not persisted; product secret storage still needs implementation"],
  };
  const output = JSON.stringify(result, null, 2);
  await writeFile(path.join(runDir, "result.json"), output);
  await writeFile(path.join(root, "latest-result.json"), output);
  console.log(output);
}
