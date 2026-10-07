import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer, request as httpRequest, type Server } from "node:http";
import path from "node:path";
import test from "node:test";
import type express from "express";
import { createApp } from "../../src/server/app.js";
import type { CreatePlanInput, PlanDetail } from "../../src/shared/contracts.js";

test("private persisted journey enforces real sessions, mutation contracts and retained work", async (t) => {
  const parent = path.resolve(".local/server-tests");
  await mkdir(parent, { recursive: true });
  const directory = await mkdtemp(path.join(parent, "journey-"));
  let app: express.Express | undefined;
  let close: (() => void) | undefined;
  let server: Server | undefined;
  let origin = "";
  const clock = () => new Date("2026-10-07T23:30:00.000Z");
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
    const running = await createApp({ dataDirectory: directory, origin, clock });
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
    options: {
      method?: string;
      body?: unknown;
      raw?: string;
      cookie?: string;
      headers?: Record<string, string>;
    } = {},
  ): Promise<Response> {
    return fetch(`${origin}${endpoint}`, {
      method: options.method ?? "GET",
      headers: {
        ...(options.body !== undefined || options.raw !== undefined
          ? { "content-type": "application/json", origin }
          : {}),
        ...(options.cookie ? { cookie: options.cookie } : {}),
        ...options.headers,
      },
      ...(options.raw !== undefined
        ? { body: options.raw }
        : options.body === undefined
          ? {}
          : { body: JSON.stringify(options.body) }),
      signal: AbortSignal.timeout(15000),
      redirect: "manual",
    });
  }
  async function data(response: Response, expected = 200): Promise<PlanDetail> {
    assert.equal(response.status, expected);
    return (await response.json()) as PlanDetail;
  }
  async function error(response: Response, status: number, code: string): Promise<void> {
    assert.equal(response.status, status);
    assert.equal(((await response.json()) as { error: { code: string } }).error.code, code);
  }
  let alpha = "";
  let bravo = "";
  let detail: PlanDetail;
  const create: CreatePlanInput = {
    requestId: randomUUID(),
    goal: "My private goal",
    templateId: null,
    availabilityDates: ["2026-10-07", "2026-10-09"],
    targetDate: "2026-10-08",
    references: ["https://example.org/my-reference"],
    steps: [
      { title: "Read my first section", scheduledDate: "2026-10-07", estimatedMinutes: 10 },
      { title: "Try the example", scheduledDate: "2026-10-09", estimatedMinutes: 15 },
    ],
  };
  try {
    await boot();
    await t.test("real account registration/session cookies and anonymous boundary", async () => {
      assert.equal((await request("/api/health")).status, 200);
      await error(await request("/api/plans"), 401, "unauthenticated");
      const cookies: string[] = [];
      for (const label of ["alpha", "bravo"]) {
        const password = randomBytes(18).toString("base64url");
        const email = `${label}@example.invalid`;
        assert.equal(
          (
            await request("/api/auth/sign-up/email", {
              method: "POST",
              body: { name: `Synthetic ${label}`, email, password },
            })
          ).status,
          200,
        );
        const signedIn = await request("/api/auth/sign-in/email", {
          method: "POST",
          body: { email, password },
        });
        assert.equal(signedIn.status, 200);
        const cookie = signedIn.headers
          .getSetCookie()
          .find((value) => value.startsWith("better-auth.session_token="));
        assert.ok(cookie);
        assert.match(cookie, /HttpOnly/iu);
        assert.match(cookie, /SameSite=Lax/iu);
        cookies.push(cookie.split(";", 1)[0] ?? "");
      }
      alpha = cookies[0] ?? "";
      bravo = cookies[1] ?? "";
      assert.ok(alpha && bravo && alpha !== bravo);
      const me = await request("/api/me", { cookie: alpha });
      assert.equal(me.status, 200);
      assert.equal(((await me.json()) as { profile: unknown }).profile, null);
      await error(
        await request("/api/plans", { method: "POST", cookie: alpha, body: create }),
        409,
        "profile_required",
      );
      await error(
        await request("/api/me", {
          method: "PUT",
          cookie: alpha,
          body: { locale: "en", timezone: "Not/AZone" },
        }),
        400,
        "invalid_input",
      );
      assert.equal(
        (
          await request("/api/me", {
            method: "PUT",
            cookie: alpha,
            body: { locale: "en", timezone: "Africa/Lagos" },
          })
        ).status,
        200,
      );
    });
    await t.test("explicit plan confirmation, source traceability and creation retry", async () => {
      detail = await data(
        await request("/api/plans", { method: "POST", cookie: alpha, body: create }),
        201,
      );
      assert.equal(detail.plan.revision, 1);
      assert.equal(detail.progress.total, 2);
      assert.equal(detail.progress.completed, 0);
      assert.equal(detail.conflicts[0]?.kind, "after_target");
      assert.equal(detail.plan.targetDate, "2026-10-08");
      assert.deepEqual(
        await data(
          await request("/api/plans", { method: "POST", cookie: alpha, body: create }),
          201,
        ),
        detail,
      );
      await error(
        await request("/api/plans", {
          method: "POST",
          cookie: alpha,
          body: { ...create, goal: "Different" },
        }),
        409,
        "idempotency_conflict",
      );
      const list = await request("/api/plans", { cookie: alpha });
      assert.equal(((await list.json()) as { plans: unknown[] }).plans.length, 1);
      const templates = await request("/api/templates", { cookie: alpha });
      const body = (await templates.json()) as {
        templates: { version: number; sources: { en: { checkedOn: string }[]; fr: unknown[] } }[];
      };
      assert.equal(body.templates[0]?.version, 1);
      assert.equal(body.templates[0]?.sources.en[0]?.checkedOn, "2026-10-07");
      assert.equal(body.templates[0]?.sources.fr.length, 2);
    });
    await t.test("another signed-in account cannot read or write private resources", async () => {
      const id = detail.plan.id;
      const step = detail.plan.steps[0];
      assert.ok(step);
      await error(await request(`/api/plans/${id}`, { cookie: bravo }), 404, "not_found");
      await error(
        await request(`/api/plans/${id}/activities`, {
          method: "POST",
          cookie: bravo,
          body: { requestId: randomUUID(), stepId: step.id, minutes: 5 },
        }),
        404,
        "not_found",
      );
      await error(
        await request(`/api/plans/${id}/completions`, {
          method: "POST",
          cookie: bravo,
          body: { requestId: randomUUID(), stepId: step.id, revision: 1 },
        }),
        404,
        "not_found",
      );
      const { templateId: _templateId, ...fields } = create;
      await error(
        await request(`/api/plans/${id}`, {
          method: "PUT",
          cookie: bravo,
          body: { ...fields, requestId: randomUUID(), revision: 1 },
        }),
        404,
        "not_found",
      );
      const list = await request("/api/plans", { cookie: bravo });
      assert.deepEqual(await list.json(), { plans: [] });
    });
    await t.test(
      "five-minute activity and optional reflection do not complete a step",
      async () => {
        const step = detail.plan.steps[0];
        assert.ok(step);
        const body = {
          requestId: randomUUID(),
          stepId: step.id,
          minutes: 5,
          reflection: "My private note <script>plain text</script>",
        };
        detail = await data(
          await request(`/api/plans/${detail.plan.id}/activities`, {
            method: "POST",
            cookie: alpha,
            body,
          }),
        );
        assert.equal(detail.progress.completed, 0);
        assert.equal(detail.plan.revision, 1);
        assert.equal(detail.progress.studiedMinutes, 5);
        assert.equal(detail.progress.studyDayCount, 1);
        assert.deepEqual(detail.progress.studyDates, ["2026-10-08"]);
        assert.equal(detail.activities[0]?.reflection, body.reflection);
        assert.deepEqual(
          await data(
            await request(`/api/plans/${detail.plan.id}/activities`, {
              method: "POST",
              cookie: alpha,
              body,
            }),
          ),
          detail,
        );
        await error(
          await request(`/api/plans/${detail.plan.id}/activities`, {
            method: "POST",
            cookie: alpha,
            body: { ...body, minutes: 6 },
          }),
          409,
          "idempotency_conflict",
        );
        detail = await data(
          await request(`/api/plans/${detail.plan.id}/activities`, {
            method: "POST",
            cookie: alpha,
            body: { requestId: randomUUID(), stepId: step.id, minutes: 2 },
          }),
        );
        assert.equal(detail.activities[0]?.reflection, null);
        assert.equal(detail.progress.studyDayCount, 1);
        assert.equal(detail.progress.activityCount, 2);
        assert.equal(detail.progress.studiedMinutes, 7);
      },
    );
    await t.test("explicit completion is revision-bound and independently idempotent", async () => {
      const step = detail.plan.steps[0];
      assert.ok(step);
      const body = { requestId: randomUUID(), stepId: step.id, revision: detail.plan.revision };
      detail = await data(
        await request(`/api/plans/${detail.plan.id}/completions`, {
          method: "POST",
          cookie: alpha,
          body,
        }),
      );
      assert.equal(detail.plan.revision, 2);
      assert.equal(detail.progress.completed, 1);
      assert.equal(detail.progress.activityCount, 2);
      assert.equal(detail.progress.studiedMinutes, 7);
      assert.deepEqual(
        await data(
          await request(`/api/plans/${detail.plan.id}/completions`, {
            method: "POST",
            cookie: alpha,
            body,
          }),
        ),
        detail,
      );
      await error(
        await request(`/api/plans/${detail.plan.id}/completions`, {
          method: "POST",
          cookie: alpha,
          body: { ...body, requestId: randomUUID(), revision: 2 },
        }),
        409,
        "already_complete",
      );
      const edit = {
        requestId: randomUUID(),
        revision: 1,
        goal: detail.plan.goal,
        availabilityDates: detail.plan.availabilityDates,
        targetDate: detail.plan.targetDate,
        references: detail.plan.references,
        steps: detail.plan.steps.map(({ completedAt: _completedAt, ...step }) => step),
      };
      await error(
        await request(`/api/plans/${detail.plan.id}`, { method: "PUT", cookie: alpha, body: edit }),
        409,
        "stale_revision",
      );
      const completed = edit.steps[0];
      assert.ok(completed);
      await error(
        await request(`/api/plans/${detail.plan.id}`, {
          method: "PUT",
          cookie: alpha,
          body: {
            ...edit,
            requestId: randomUUID(),
            revision: 2,
            steps: [{ ...completed, title: "Rewritten history" }],
          },
        }),
        409,
        "completed_step_immutable",
      );
    });
    await t.test("scope removal and empty state preserve historical effort", async () => {
      const last = detail.plan.steps[1];
      assert.ok(last);
      const { completedAt: _completedAt, ...step } = last;
      const edit = {
        requestId: randomUUID(),
        revision: detail.plan.revision,
        goal: detail.plan.goal,
        availabilityDates: detail.plan.availabilityDates,
        targetDate: detail.plan.targetDate,
        references: detail.plan.references,
        steps: [step],
      };
      detail = await data(
        await request(`/api/plans/${detail.plan.id}`, { method: "PUT", cookie: alpha, body: edit }),
      );
      assert.equal(detail.progress.completed, 0);
      assert.equal(detail.progress.total, 1);
      assert.equal(detail.progress.cumulativeCompletions, 1);
      assert.equal(detail.progress.studiedMinutes, 7);
      assert.equal(detail.completions[0]?.stepTitle, "Read my first section");
      assert.equal(detail.scopeEvents[0]?.previousCount, 2);
      detail = await data(
        await request(`/api/plans/${detail.plan.id}`, {
          method: "PUT",
          cookie: alpha,
          body: { ...edit, requestId: randomUUID(), revision: detail.plan.revision, steps: [] },
        }),
      );
      assert.equal(detail.progress.total, 0);
      assert.equal(detail.progress.completed, 0);
      assert.equal(detail.nextStepId, null);
      assert.equal(detail.progress.cumulativeCompletions, 1);
      assert.equal(detail.activities.length, 2);
      await error(
        await request(`/api/plans/${detail.plan.id}/activities`, {
          method: "POST",
          cookie: alpha,
          body: { requestId: randomUUID(), stepId: last.id, minutes: 5 },
        }),
        400,
        "invalid_step",
      );
    });
    await t.test(
      "profile presentation changes preserve revision and historical timestamps",
      async () => {
        const revision = detail.plan.revision;
        const timestamp = detail.activities[0]?.createdAt;
        assert.equal(
          (
            await request("/api/me", {
              method: "PUT",
              cookie: alpha,
              body: { locale: "fr", timezone: "America/New_York" },
            })
          ).status,
          200,
        );
        detail = await data(await request(`/api/plans/${detail.plan.id}`, { cookie: alpha }));
        assert.equal(detail.plan.revision, revision);
        assert.equal(detail.plan.goal, "My private goal");
        assert.equal(detail.activities[0]?.createdAt, timestamp);
        assert.deepEqual(detail.progress.studyDates, ["2026-10-07"]);
      },
    );
    await t.test("bad inputs, payloads and cross-origin writes fail visibly", async () => {
      await error(
        await request("/api/plans", {
          method: "POST",
          cookie: alpha,
          body: { ...create, requestId: randomUUID(), references: ["javascript:alert(1)"] },
        }),
        400,
        "invalid_input",
      );
      await error(
        await request("/api/plans", {
          method: "POST",
          cookie: alpha,
          body: { ...create, requestId: randomUUID(), userId: "other" },
        }),
        400,
        "invalid_input",
      );
      await error(
        await request("/api/plans", { method: "POST", cookie: alpha, raw: "{" }),
        400,
        "invalid_json",
      );
      await error(
        await request("/api/plans", {
          method: "POST",
          cookie: alpha,
          raw: JSON.stringify({ data: "a".repeat(70000) }),
        }),
        413,
        "payload_too_large",
      );
      await error(
        await request("/api/me", {
          method: "PUT",
          cookie: alpha,
          body: { locale: "en", timezone: "UTC" },
          headers: { origin: "https://untrusted.example.invalid" },
        }),
        403,
        "invalid_origin",
      );
      await error(
        await request("/api/auth/sign-out", {
          method: "POST",
          cookie: alpha,
          body: {},
          headers: { origin: "https://untrusted.example.invalid" },
        }),
        403,
        "invalid_origin",
      );
      // Fetch normalizes Host. A raw HTTP request exercises the actual hostile header.
      const hostileHost = await new Promise<number | undefined>((resolve, reject) => {
        const outgoing = httpRequest(
          `${origin}/api/health`,
          { headers: { host: "untrusted.example.invalid" } },
          (incoming) => {
            incoming.resume();
            resolve(incoming.statusCode);
          },
        );
        outgoing.on("error", reject);
        outgoing.end();
      });
      assert.equal(hostileHost, 403);
      assert.equal((await request("/api/me", { cookie: alpha })).status, 200);
    });
    await t.test(
      "server/database close and reopen retains secret, accounts and private history",
      async () => {
        const secretBefore = await readFile(path.join(directory, "auth-secret"), "utf8");
        const id = detail.plan.id;
        const expected = detail;
        const port = Number(new URL(origin).port);
        await stop();
        await boot(port);
        assert.equal(await readFile(path.join(directory, "auth-secret"), "utf8"), secretBefore);
        assert.deepEqual(
          await data(await request(`/api/plans/${id}`, { cookie: alpha })),
          expected,
        );
        assert.equal((await request("/api/me", { cookie: bravo })).status, 200);
        assert.equal(
          (await request("/api/auth/sign-out", { method: "POST", cookie: alpha, body: {} })).status,
          200,
        );
        await error(await request(`/api/plans/${id}`, { cookie: alpha }), 401, "unauthenticated");
        assert.equal((await request("/api/me", { cookie: bravo })).status, 200);
      },
    );
  } finally {
    await stop();
    assert.ok(directory.startsWith(`${parent}${path.sep}journey-`));
    await rm(directory, { recursive: true, force: true });
  }
});
