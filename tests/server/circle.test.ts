import assert from "node:assert/strict";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import path from "node:path";
import test from "node:test";
import { setTimeout } from "node:timers/promises";
import Database from "better-sqlite3";
import type express from "express";
import { createApp } from "../../src/server/app.js";
import type {
  CircleDetail,
  CircleInviteCreated,
  CircleSummary,
  PlanDetail,
} from "../../src/shared/contracts.js";

test("real-session circles enforce private copies, one-use invitations and lifecycle authorization", async (t) => {
  const parent = path.resolve(".local/server-tests");
  await mkdir(parent, { recursive: true });
  const directory = await mkdtemp(path.join(parent, "circle-"));
  let app: express.Express | undefined;
  let close: (() => void) | undefined;
  let server: Server | undefined;
  let origin = "";
  let now = "2026-10-08T10:00:00.000Z";
  const cookies: Record<string, string> = {};
  const key = () => ({ requestId: randomUUID() });
  async function boot(port = 0): Promise<void> {
    server = createServer((request, response) => {
      if (app) app(request, response);
      else {
        response.statusCode = 503;
        response.end();
      }
    });
    await new Promise<void>((resolve, reject) => {
      server?.once("error", reject);
      server?.listen(port, "127.0.0.1", resolve);
    });
    const address = server.address();
    assert.ok(address && typeof address === "object");
    origin = `http://127.0.0.1:${address.port}`;
    const running = await createApp({
      dataDirectory: directory,
      origin,
      clock: () => new Date(now),
    });
    app = running.app;
    close = running.close;
  }
  async function stop(): Promise<void> {
    if (server) {
      server.closeAllConnections();
      const running = server;
      await new Promise<void>((resolve, reject) =>
        running.close((error) => (error ? reject(error) : resolve())),
      );
      server = undefined;
    }
    close?.();
    close = undefined;
    app = undefined;
  }
  async function request(
    endpoint: string,
    user = "alpha",
    body?: unknown,
    method = body === undefined ? "GET" : "POST",
  ): Promise<Response> {
    return fetch(`${origin}${endpoint}`, {
      method,
      headers: {
        ...(cookies[user] ? { cookie: cookies[user] } : {}),
        ...(body === undefined ? {} : { origin, "content-type": "application/json" }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(15000),
      redirect: "manual",
    });
  }
  async function json<T>(response: Response, status = 200): Promise<T> {
    const data: unknown = await response.json();
    assert.equal(response.status, status, JSON.stringify(data));
    return data as T;
  }
  async function error(response: Response, status: number, code: string): Promise<void> {
    assert.equal((await json<{ error: { code: string } }>(response, status)).error.code, code);
  }
  const createInput = { ...key(), name: "Learning together" };
  let id = "";
  let privateDetail: PlanDetail;
  let joinInput = { ...key(), token: "" };
  let ownerItem = "";
  let peerItem = "";
  const shareInput = {
    ...key(),
    kind: "check_in",
    text: "I returned <script>literal text</script>",
  };
  const encouragementInput = { ...key(), preset: "keep_going" };
  const tokens: string[] = [];
  async function invite(circleId = id): Promise<CircleInviteCreated & { token: string }> {
    const result = await json<CircleInviteCreated>(
      await request(`/api/circles/${circleId}/invites`, "alpha", key()),
      201,
    );
    assert.ok(result.token);
    tokens.push(result.token);
    return { ...result, token: result.token };
  }
  async function detail(user = "alpha"): Promise<CircleDetail> {
    return json(await request(`/api/circles/${id}`, user));
  }
  function inspection(): Database.Database {
    return new Database(path.join(directory, "capstone.sqlite"), { readonly: true });
  }
  try {
    await boot();
    await t.test(
      "four real identities retain private plans and create bounded circle DTOs",
      async () => {
        for (const user of ["alpha", "bravo", "charlie", "delta"]) {
          // Better Auth intentionally limits each signup/signin path to three requests per 10s.
          if (user === "delta") await setTimeout(10100);
          const password = randomBytes(18).toString("base64url");
          const email = `${user}@example.invalid`;
          await json(
            await request("/api/auth/sign-up/email", "", {
              name: `Synthetic ${user}`,
              email,
              password,
            }),
          );
          const response = await request("/api/auth/sign-in/email", "", { email, password });
          assert.equal(response.status, 200);
          const cookie = response.headers
            .getSetCookie()
            .find((value) => value.startsWith("better-auth.session_token="));
          assert.ok(cookie);
          cookies[user] = cookie.split(";", 1)[0] ?? "";
        }
        assert.equal(new Set(Object.values(cookies)).size, 4);
        await json(
          await request("/api/me", "alpha", { locale: "en", timezone: "Africa/Lagos" }, "PUT"),
        );
        privateDetail = await json<PlanDetail>(
          await request("/api/plans", "alpha", {
            ...key(),
            goal: "NEVER SHARED PRIVATE GOAL",
            templateId: null,
            availabilityDates: ["2026-10-08"],
            targetDate: null,
            references: ["https://example.org/never-shared-reference"],
            steps: [{ title: "PRIVATE STEP", scheduledDate: "2026-10-08", estimatedMinutes: 5 }],
          }),
          201,
        );
        privateDetail = await json<PlanDetail>(
          await request(`/api/plans/${privateDetail.plan.id}/activities`, "alpha", {
            ...key(),
            revision: privateDetail.plan.revision,
            stepId: privateDetail.plan.steps[0]?.id,
            minutes: 5,
            reflection: "NEVER SHARED REFLECTION",
          }),
        );
        id = (
          await json<{ circleId: string }>(await request("/api/circles", "alpha", createInput), 201)
        ).circleId;
        assert.deepEqual(await json(await request("/api/circles", "alpha", createInput), 201), {
          circleId: id,
        });
        await error(
          await request("/api/circles", "alpha", { ...createInput, name: "Different" }),
          409,
          "idempotency_conflict",
        );
        const current = await detail();
        assert.deepEqual(Object.keys(current).sort(), ["circle", "items", "members"]);
        assert.deepEqual(Object.keys(current.circle).sort(), [
          "createdAt",
          "id",
          "memberCount",
          "name",
          "role",
        ]);
        assert.deepEqual(Object.keys(current.members[0] ?? {}).sort(), [
          "displayName",
          "id",
          "isSelf",
          "joinedAt",
          "role",
        ]);
        assert.equal(current.circle.role, "owner");
        assert.equal(current.members[0]?.isSelf, true);
        assert.deepEqual(await json(await request("/api/circles", "bravo")), { circles: [] });
      },
    );
    await t.test(
      "invitations return the token once, join a separate account and reject retries safely",
      async () => {
        const input = key();
        const created = await json<CircleInviteCreated>(
          await request(`/api/circles/${id}/invites`, "alpha", input),
          201,
        );
        assert.ok(created.token);
        tokens.push(created.token);
        assert.match(created.token, /^[A-Za-z0-9_-]{43}$/u);
        assert.equal(
          Date.parse(created.invite.expiresAt) - Date.parse(created.invite.createdAt),
          86400000,
        );
        assert.deepEqual(
          await json(await request(`/api/circles/${id}/invites`, "alpha", input), 201),
          { invite: created.invite, token: null },
        );
        const db = inspection();
        try {
          assert.equal(
            (
              db
                .prepare("SELECT token_hash FROM circle_invite WHERE id=?")
                .get(created.invite.id) as { token_hash: string }
            ).token_hash,
            createHash("sha256").update(created.token).digest("hex"),
          );
          assert.ok(
            !(db.prepare("PRAGMA table_info(circle_invite)").all() as { name: string }[]).some(
              (column) => column.name === "token",
            ),
          );
        } finally {
          db.close();
        }
        await error(
          await request("/api/circle-invites/redeem", "alpha", { ...key(), token: created.token }),
          409,
          "already_member",
        );
        joinInput = { ...key(), token: created.token };
        assert.deepEqual(
          await json(await request("/api/circle-invites/redeem", "bravo", joinInput)),
          { circleId: id },
        );
        assert.deepEqual(
          await json(await request("/api/circle-invites/redeem", "bravo", joinInput)),
          { circleId: id },
        );
        await error(
          await request("/api/circle-invites/redeem", "bravo", { ...key(), token: created.token }),
          410,
          "invite_unavailable",
        );
        await error(
          await request("/api/circle-invites/redeem", "charlie", {
            ...key(),
            token: created.token,
          }),
          410,
          "invite_unavailable",
        );
        await error(
          await request("/api/circle-invites/redeem", "bravo", {
            ...joinInput,
            token: "a".repeat(43),
          }),
          409,
          "idempotency_conflict",
        );
        assert.equal((await detail("bravo")).circle.role, "member");
      },
    );
    await t.test(
      "every resource group denies anonymous/nonmember and enforces owner controls",
      async () => {
        const member = (await detail("bravo")).members.find((item) => item.isSelf);
        assert.ok(member);
        const active = await invite();
        const itemId = (
          await json<{ itemId: string }>(
            await request(`/api/circles/${id}/items`, "alpha", {
              ...key(),
              kind: "commitment",
              text: "A small action",
            }),
            201,
          )
        ).itemId;
        ownerItem = itemId;
        const routes: [string, unknown?][] = [
          [`/api/circles/${id}`],
          [`/api/circles/${id}/invites`],
          [`/api/circles/${id}/invites`, key()],
          [`/api/circles/${id}/invites/${active.invite.id}/revoke`, key()],
          [`/api/circles/${id}/items`, { ...key(), kind: "check_in", text: "Test" }],
          [`/api/circles/${id}/items/${itemId}/delete`, key()],
          [`/api/circles/${id}/items/${itemId}/encouragement`, { ...key(), preset: "keep_going" }],
          [`/api/circles/${id}/leave`, key()],
          [`/api/circles/${id}/members/${member.id}/remove`, key()],
          [`/api/circles/${id}/close`, key()],
          [
            `/api/circles/${id}/items/${itemId}/encouragement/withdraw`,
            { ...key(), encouragementId: randomUUID() },
          ],
        ];
        for (const [route, body] of routes) {
          await error(await request(route, "", body), 401, "unauthenticated");
          await error(await request(route, "charlie", body), 404, "not_found");
        }
        await error(await request("/api/circles", ""), 401, "unauthenticated");
        await error(
          await request("/api/circles", "", { ...key(), name: "Denied" }),
          401,
          "unauthenticated",
        );
        await error(
          await request("/api/circle-invites/redeem", "", { ...key(), token: active.token }),
          401,
          "unauthenticated",
        );
        for (const [route, body] of [routes[1], routes[2], routes[3], routes[8], routes[9]] as [
          string,
          unknown?,
        ][])
          await error(await request(route, "bravo", body), 403, "owner_required");
        await error(
          await request(`/api/circles/${id}/items/${itemId}/delete`, "bravo", key()),
          403,
          "shared_item_owner_required",
        );
        await error(
          await request(`/api/circles/${id}/items/${itemId}/encouragement`, "alpha", {
            ...key(),
            preset: "keep_going",
          }),
          403,
          "not_allowed",
        );
        await error(
          await request(`/api/circles/${id}/leave`, "alpha", key()),
          409,
          "owner_must_close",
        );
        const ownerMember = (await detail()).members.find((item) => item.isSelf);
        assert.ok(ownerMember);
        await error(
          await request(`/api/circles/${id}/members/${ownerMember.id}/remove`, "alpha", key()),
          409,
          "owner_must_close",
        );
      },
    );
    await t.test(
      "copies and encouragement expose only approved fields and repeats do not regress presets",
      async () => {
        peerItem = (
          await json<{ itemId: string }>(
            await request(`/api/circles/${id}/items`, "bravo", shareInput),
            201,
          )
        ).itemId;
        assert.deepEqual(
          await json(await request(`/api/circles/${id}/items`, "bravo", shareInput), 201),
          { itemId: peerItem },
        );
        await json(
          await request(
            `/api/circles/${id}/items/${ownerItem}/encouragement`,
            "bravo",
            encouragementInput,
          ),
        );
        await json(
          await request(`/api/circles/${id}/items/${ownerItem}/encouragement`, "bravo", {
            ...key(),
            preset: "small_steps_count",
          }),
        );
        await json(
          await request(
            `/api/circles/${id}/items/${ownerItem}/encouragement`,
            "bravo",
            encouragementInput,
          ),
        );
        await json(
          await request(`/api/circles/${id}/items/${peerItem}/encouragement`, "alpha", {
            ...key(),
            preset: "glad_you_returned",
          }),
        );
        const current = await detail();
        const shared = current.items.find((item) => item.id === peerItem);
        assert.ok(shared);
        assert.equal(shared.text, shareInput.text);
        assert.deepEqual(Object.keys(shared).sort(), [
          "authorMemberId",
          "authorName",
          "createdAt",
          "encouragements",
          "id",
          "kind",
          "text",
        ]);
        assert.deepEqual(Object.keys(shared.encouragements[0] ?? {}).sort(), [
          "createdAt",
          "id",
          "preset",
          "senderMemberId",
          "senderName",
        ]);
        const owner = current.items.find((item) => item.id === ownerItem);
        assert.equal(owner?.encouragements.length, 1);
        assert.equal(owner?.encouragements[0]?.preset, "small_steps_count");
        const encoded = JSON.stringify(current);
        for (const secret of [
          "NEVER SHARED",
          "PRIVATE STEP",
          "never-shared-reference",
          "@example.invalid",
          "token_hash",
          "owner_id",
          "user_id",
        ])
          assert.ok(!encoded.includes(secret), secret);
        await error(
          await request(`/api/plans/${privateDetail.plan.id}`, "bravo"),
          404,
          "not_found",
        );
        await error(
          await request(`/api/circles/${id}/items`, "bravo", {
            ...key(),
            kind: "check_in",
            text: "x",
            reflection: "Leak",
          }),
          400,
          "invalid_input",
        );
        await error(
          await request(`/api/circles/${id}/items/${ownerItem}/encouragement`, "bravo", {
            ...key(),
            preset: "free reply",
          }),
          400,
          "invalid_input",
        );
        await error(
          await request(`/api/circles/${id}/items`, "bravo", { ...shareInput, text: "Different" }),
          409,
          "idempotency_conflict",
        );
        const db = inspection();
        try {
          const receipts = JSON.stringify(db.prepare("SELECT * FROM circle_receipt").all());
          for (const secret of [
            ...tokens,
            shareInput.text,
            "Learning together",
            "Synthetic",
            "NEVER SHARED",
          ])
            assert.ok(!receipts.includes(secret));
        } finally {
          db.close();
        }
      },
    );
    await t.test(
      "withdrawal validates current own identity and cannot remove a fresh re-add on retry",
      async () => {
        const route = `/api/circles/${id}/items/${ownerItem}/encouragement/withdraw`;
        const original = (await detail("bravo")).items.find((item) => item.id === ownerItem)
          ?.encouragements[0];
        assert.ok(original);
        await error(
          await request(route, "bravo", {
            ...key(),
            encouragementId: original.id,
            preset: "keep_going",
          }),
          400,
          "invalid_input",
        );
        await error(
          await request(route, "bravo", { ...key(), encouragementId: "invalid" }),
          400,
          "invalid_input",
        );
        await error(
          await request(route, "alpha", { ...key(), encouragementId: original.id }),
          404,
          "not_found",
        );
        const withdrawal = { ...key(), encouragementId: original.id };
        assert.deepEqual(await json(await request(route, "bravo", withdrawal)), { ok: true });
        assert.deepEqual(
          (await detail()).items.find((item) => item.id === ownerItem)?.encouragements,
          [],
        );
        assert.deepEqual(await json(await request(route, "bravo", withdrawal)), { ok: true });
        await json(
          await request(
            `/api/circles/${id}/items/${ownerItem}/encouragement`,
            "bravo",
            encouragementInput,
          ),
        );
        assert.deepEqual(
          (await detail()).items.find((item) => item.id === ownerItem)?.encouragements,
          [],
        );
        await json(
          await request(`/api/circles/${id}/items/${ownerItem}/encouragement`, "bravo", {
            ...key(),
            preset: "glad_you_returned",
          }),
        );
        const fresh = (await detail()).items.find((item) => item.id === ownerItem)
          ?.encouragements[0];
        assert.ok(fresh);
        assert.notEqual(fresh.id, original.id);
        assert.deepEqual(await json(await request(route, "bravo", withdrawal)), { ok: true });
        assert.deepEqual(
          (await detail()).items.find((item) => item.id === ownerItem)?.encouragements,
          [fresh],
        );
        await error(
          await request(route, "bravo", { ...key(), encouragementId: original.id }),
          409,
          "encouragement_changed",
        );
        await error(
          await request(route, "bravo", { ...withdrawal, encouragementId: fresh.id }),
          409,
          "idempotency_conflict",
        );
      },
    );
    await t.test("nested resources from another circle cannot be acted on", async () => {
      const otherId = (
        await json<{ circleId: string }>(
          await request("/api/circles", "alpha", { ...key(), name: "Other circle" }),
          201,
        )
      ).circleId;
      const otherInvite = await invite(otherId);
      const other = await json<CircleDetail>(await request(`/api/circles/${otherId}`));
      const otherItem = (
        await json<{ itemId: string }>(
          await request(`/api/circles/${otherId}/items`, "alpha", {
            ...key(),
            kind: "check_in",
            text: "Other",
          }),
          201,
        )
      ).itemId;
      await error(
        await request(`/api/circles/${id}/invites/${otherInvite.invite.id}/revoke`, "alpha", key()),
        404,
        "not_found",
      );
      await error(
        await request(`/api/circles/${id}/items/${otherItem}/delete`, "alpha", key()),
        404,
        "not_found",
      );
      await error(
        await request(`/api/circles/${id}/items/${otherItem}/encouragement`, "bravo", {
          ...key(),
          preset: "keep_going",
        }),
        404,
        "not_found",
      );
      await error(
        await request(`/api/circles/${id}/members/${other.members[0]?.id}/remove`, "alpha", key()),
        404,
        "not_found",
      );
    });
    await t.test(
      "revoked, altered, expired and concurrent invitations obey one-use atomicity",
      async () => {
        const revoked = await invite();
        const revokeInput = key();
        await json(
          await request(
            `/api/circles/${id}/invites/${revoked.invite.id}/revoke`,
            "alpha",
            revokeInput,
          ),
        );
        await json(
          await request(
            `/api/circles/${id}/invites/${revoked.invite.id}/revoke`,
            "alpha",
            revokeInput,
          ),
        );
        await error(
          await request("/api/circle-invites/redeem", "charlie", {
            ...key(),
            token: revoked.token,
          }),
          410,
          "invite_unavailable",
        );
        await error(
          await request("/api/circle-invites/redeem", "charlie", {
            ...key(),
            token: "a".repeat(43),
          }),
          410,
          "invite_unavailable",
        );
        await error(
          await request("/api/circle-invites/redeem", "charlie", { ...key(), token: "short" }),
          400,
          "invalid_input",
        );
        const expired = await invite();
        now = expired.invite.expiresAt;
        await error(
          await request("/api/circle-invites/redeem", "charlie", {
            ...key(),
            token: expired.token,
          }),
          410,
          "invite_unavailable",
        );
        const concurrent = await invite();
        const responses = await Promise.all(
          ["charlie", "delta"].map((user) =>
            request("/api/circle-invites/redeem", user, { ...key(), token: concurrent.token }),
          ),
        );
        assert.deepEqual(responses.map((response) => response.status).sort(), [200, 410]);
        for (const response of responses) await response.json();
        assert.equal((await detail()).members.length, 3);
        await error(
          await request(
            `/api/circles/${id}/invites/${concurrent.invite.id}/revoke`,
            "alpha",
            key(),
          ),
          410,
          "invite_unavailable",
        );
      },
    );
    await t.test("active circles and sessions persist across server/database reopen", async () => {
      const before = await detail();
      const currentPrivate = await json<PlanDetail>(
        await request(`/api/plans/${privateDetail.plan.id}`),
      );
      assert.deepEqual(currentPrivate.plan, privateDetail.plan);
      assert.deepEqual(currentPrivate.activities, privateDetail.activities);
      assert.deepEqual(currentPrivate.completions, privateDetail.completions);
      assert.deepEqual(currentPrivate.scopeEvents, privateDetail.scopeEvents);
      // Expiry testing advanced the injected day; derived seven-day progress changes accordingly.
      privateDetail = currentPrivate;
      const port = Number(new URL(origin).port);
      await stop();
      await boot(port);
      assert.deepEqual(await detail(), before);
      assert.deepEqual(
        await json(await request(`/api/plans/${privateDetail.plan.id}`)),
        privateDetail,
      );
      const db = inspection();
      try {
        assert.deepEqual(db.pragma("foreign_key_check"), []);
      } finally {
        db.close();
      }
    });
    await t.test(
      "own deletion and member removal erase shared content and deny stale receipts after rejoin",
      async () => {
        const temporaryInput = { ...key(), kind: "commitment", text: "Delete my copy" };
        const temporary = (
          await json<{ itemId: string }>(
            await request(`/api/circles/${id}/items`, "alpha", temporaryInput),
            201,
          )
        ).itemId;
        await json(
          await request(`/api/circles/${id}/items/${temporary}/encouragement`, "bravo", {
            ...key(),
            preset: "keep_going",
          }),
        );
        await json(await request(`/api/circles/${id}/items/${temporary}/delete`, "alpha", key()));
        await error(
          await request(`/api/circles/${id}/items`, "alpha", temporaryInput),
          404,
          "not_found",
        );
        const member = (await detail("bravo")).members.find((item) => item.isSelf);
        assert.ok(member);
        await json(await request(`/api/circles/${id}/members/${member.id}/remove`, "alpha", key()));
        await error(await request(`/api/circles/${id}`, "bravo"), 404, "not_found");
        await error(
          await request(`/api/circles/${id}/items`, "bravo", shareInput),
          404,
          "not_found",
        );
        await error(
          await request("/api/circle-invites/redeem", "bravo", joinInput),
          404,
          "not_found",
        );
        const after = await detail();
        assert.ok(!after.items.some((item) => item.id === peerItem || item.id === temporary));
        assert.deepEqual(after.items.find((item) => item.id === ownerItem)?.encouragements, []);
        const fresh = await invite();
        await json(
          await request("/api/circle-invites/redeem", "bravo", { ...key(), token: fresh.token }),
        );
        const newMember = (await detail("bravo")).members.find((item) => item.isSelf);
        assert.ok(newMember);
        assert.notEqual(newMember.id, member.id);
        await error(
          await request(`/api/circles/${id}/items`, "bravo", shareInput),
          404,
          "not_found",
        );
        await error(
          await request(
            `/api/circles/${id}/items/${ownerItem}/encouragement`,
            "bravo",
            encouragementInput,
          ),
          404,
          "not_found",
        );
        await error(
          await request("/api/circle-invites/redeem", "bravo", joinInput),
          404,
          "not_found",
        );
        const freshShare = { ...key(), kind: "check_in", text: "Fresh membership copy" };
        await json(await request(`/api/circles/${id}/items`, "bravo", freshShare), 201);
        await json(await request(`/api/circles/${id}/leave`, "bravo", key()));
        await error(await request(`/api/circles/${id}`, "bravo"), 404, "not_found");
        assert.ok(!(await detail()).items.some((item) => item.text === freshShare.text));
        assert.deepEqual(
          await json(await request(`/api/plans/${privateDetail.plan.id}`)),
          privateDetail,
        );
      },
    );
    await t.test(
      "closure invalidates invites and receipt access while preserving private history; sign-out revokes access",
      async () => {
        const pending = await invite();
        await json(await request(`/api/circles/${id}/close`, "alpha", key()));
        await error(await request(`/api/circles/${id}`), 404, "not_found");
        await error(await request("/api/circles", "alpha", createInput), 404, "not_found");
        await error(
          await request("/api/circle-invites/redeem", "bravo", { ...key(), token: pending.token }),
          410,
          "invite_unavailable",
        );
        const list = await json<{ circles: CircleSummary[] }>(await request("/api/circles"));
        assert.ok(!list.circles.some((circle) => circle.id === id));
        const db = inspection();
        try {
          for (const table of ["circle_member", "circle_item", "circle_encouragement"])
            assert.equal(
              (
                db.prepare(`SELECT count(*) AS count FROM ${table} WHERE circle_id=?`).get(id) as {
                  count: number;
                }
              ).count,
              0,
            );
          assert.ok(
            (
              db
                .prepare("SELECT revoked_at FROM circle_invite WHERE id=?")
                .get(pending.invite.id) as { revoked_at: string }
            ).revoked_at,
          );
          assert.deepEqual(db.pragma("foreign_key_check"), []);
        } finally {
          db.close();
        }
        assert.deepEqual(
          await json(await request(`/api/plans/${privateDetail.plan.id}`)),
          privateDetail,
        );
        await json(await request("/api/auth/sign-out", "alpha", {}));
        await error(await request("/api/circles"), 401, "unauthenticated");
        await error(await request(`/api/circles/${id}`), 401, "unauthenticated");
      },
    );
  } finally {
    await stop();
    const resolved = path.resolve(directory);
    assert.ok(resolved.startsWith(`${parent}${path.sep}`));
    await rm(resolved, { recursive: true, force: true });
  }
});
