import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import path from "node:path";
import Database from "better-sqlite3";
import type express from "express";
import test from "node:test";
import { createApp } from "../../src/server/app.js";
import type {
  ComebackPreview,
  CreatePlanInput,
  PlanDetail,
  UpdatePlanInput,
} from "../../src/shared/contracts.js";

test("Comeback HTTP preserves private history and applies exact revision-bound date shifts", async (t) => {
  const parent = path.resolve(".local/server-tests");
  await mkdir(parent, { recursive: true });
  const directory = await mkdtemp(path.join(parent, "comeback-"));
  let app: express.Express | undefined;
  let close: (() => void) | undefined;
  let server: Server | undefined;
  let origin = "";
  let now = "2026-10-08T08:00:00.000Z";
  let ownerCookie = "";
  let otherCookie = "";
  let retained: PlanDetail | undefined;
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
    options: {
      body?: unknown;
      method?: string;
      cookie?: string;
      headers?: Record<string, string>;
    } = {},
  ): Promise<Response> {
    return fetch(`${origin}${endpoint}`, {
      method: options.method ?? (options.body === undefined ? "GET" : "POST"),
      headers: {
        ...(options.body === undefined ? {} : { "content-type": "application/json", origin }),
        ...(options.cookie === "" ? {} : { cookie: options.cookie ?? ownerCookie }),
        ...options.headers,
      },
      ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
      signal: AbortSignal.timeout(15000),
      redirect: "manual",
    });
  }
  async function json<T>(response: Response, status = 200): Promise<T> {
    assert.equal(response.status, status);
    return (await response.json()) as T;
  }
  async function error(
    response: Response,
    status: number,
    code: string,
    field?: string,
  ): Promise<void> {
    const body = await json<{ error: { code: string; field?: string } }>(response, status);
    assert.equal(body.error.code, code);
    if (field !== undefined) assert.equal(body.error.field, field);
  }
  async function create(
    dates = ["2026-10-01", "2026-10-03", "2026-10-05"],
    overrides: Partial<CreatePlanInput> = {},
  ): Promise<PlanDetail> {
    return json<PlanDetail>(
      await request("/api/plans", {
        body: {
          requestId: randomUUID(),
          goal: "Return to my private learning",
          templateId: null,
          availabilityDates: dates,
          targetDate: "2026-10-07",
          references: ["https://example.org/private-reference"],
          steps: dates.map((scheduledDate, index) => ({
            title: `Private action ${index + 1}`,
            scheduledDate,
            estimatedMinutes: 20,
          })),
          ...overrides,
        } satisfies CreatePlanInput,
      }),
      201,
    );
  }
  function fields(detail: PlanDetail): UpdatePlanInput {
    const current = detail.plan;
    return {
      requestId: randomUUID(),
      revision: current.revision,
      goal: current.goal,
      availabilityDates: current.availabilityDates,
      targetDate: current.targetDate,
      references: current.references,
      steps: current.steps.map(({ completedAt: _completedAt, ...step }) => step),
    };
  }
  async function current(id: string): Promise<PlanDetail> {
    return json<PlanDetail>(await request(`/api/plans/${id}`));
  }
  function previewRoute(detail: PlanDetail): string {
    return `/api/plans/${detail.plan.id}/comeback/preview`;
  }
  function confirmRoute(detail: PlanDetail): string {
    return `/api/plans/${detail.plan.id}/comeback/confirm`;
  }
  function snapshot(): unknown {
    const database = new Database(path.join(directory, "capstone.sqlite"), { readonly: true });
    try {
      return Object.fromEntries(
        [
          "learning_plan",
          "study_activity",
          "step_completion",
          "scope_event",
          "request_receipt",
        ].map((table) => [table, database.prepare(`SELECT * FROM ${table} ORDER BY rowid`).all()]),
      );
    } finally {
      database.close();
    }
  }
  function receiptCount(): number {
    const database = new Database(path.join(directory, "capstone.sqlite"), { readonly: true });
    try {
      return (
        database.prepare("SELECT COUNT(*) AS count FROM request_receipt").get() as { count: number }
      ).count;
    } finally {
      database.close();
    }
  }
  try {
    await boot();
    const cookies: string[] = [];
    for (const name of ["owner", "other"]) {
      const email = `${name}@example.invalid`;
      const password = randomBytes(18).toString("base64url");
      assert.equal(
        (
          await request("/api/auth/sign-up/email", {
            cookie: "",
            body: { name: `Synthetic ${name}`, email, password },
          })
        ).status,
        200,
      );
      const signedIn = await request("/api/auth/sign-in/email", {
        cookie: "",
        body: { email, password },
      });
      assert.equal(signedIn.status, 200);
      const cookie = signedIn.headers
        .getSetCookie()
        .find((value) => value.startsWith("better-auth.session_token="))
        ?.split(";", 1)[0];
      assert.ok(cookie);
      cookies.push(cookie);
    }
    ownerCookie = cookies[0] ?? "";
    otherCookie = cookies[1] ?? "";
    assert.ok(ownerCookie && otherCookie);
    assert.equal(
      (
        await request("/api/me", {
          method: "PUT",
          body: { locale: "en", timezone: "Africa/Lagos" },
        })
      ).status,
      200,
    );

    await t.test(
      "preview/cancel is read-only and confirmation preserves completed and archived history",
      async () => {
        let detail = await create(["2026-10-01", "2026-10-03", "2026-10-05", "2026-10-06"]);
        const first = detail.plan.steps[0];
        const last = detail.plan.steps[3];
        assert.ok(first && last);
        detail = await json<PlanDetail>(
          await request(`/api/plans/${detail.plan.id}/activities`, {
            body: {
              requestId: randomUUID(),
              stepId: first.id,
              minutes: 7,
              reflection: "Private reflection stays private",
            },
          }),
        );
        for (const step of [first, last])
          detail = await json<PlanDetail>(
            await request(`/api/plans/${detail.plan.id}/completions`, {
              body: { requestId: randomUUID(), revision: detail.plan.revision, stepId: step.id },
            }),
          );
        detail = await json<PlanDetail>(
          await request(`/api/plans/${detail.plan.id}`, {
            method: "PUT",
            body: { ...fields(detail), steps: fields(detail).steps.slice(0, 3) },
          }),
        );
        const before = structuredClone(detail);
        const databaseBefore = snapshot();
        const previewBody = { revision: detail.plan.revision, restartDate: "2026-10-08" };
        const preview = await json<ComebackPreview>(
          await request(previewRoute(detail), { body: previewBody }),
        );
        assert.equal(preview.shiftDays, 5);
        assert.deepEqual(
          preview.changes.map((change) => change.proposedDate),
          ["2026-10-08", "2026-10-10"],
        );
        assert.equal(preview.conflicts.length, 4);
        assert.ok(preview.conflicts.every((conflict) => conflict.stepId !== first.id));
        assert.deepEqual(
          await json<ComebackPreview>(await request(previewRoute(detail), { body: previewBody })),
          preview,
        );
        assert.deepEqual(snapshot(), databaseBefore);
        assert.deepEqual(await current(detail.plan.id), before);
        now = "2026-10-08T09:00:00.000Z";
        detail = await json<PlanDetail>(
          await request(confirmRoute(detail), {
            body: { requestId: randomUUID(), ...previewBody },
          }),
        );
        assert.equal(detail.plan.revision, before.plan.revision + 1);
        assert.equal(detail.plan.updatedAt, now);
        assert.deepEqual(detail.plan.steps[0], before.plan.steps[0]);
        assert.deepEqual(
          detail.plan.steps.slice(1).map((step) => step.scheduledDate),
          ["2026-10-08", "2026-10-10"],
        );
        assert.deepEqual(detail.activities, before.activities);
        assert.deepEqual(detail.completions, before.completions);
        assert.deepEqual(detail.scopeEvents, before.scopeEvents);
        assert.deepEqual(detail.plan.availabilityDates, before.plan.availabilityDates);
        assert.equal(detail.plan.targetDate, before.plan.targetDate);
        assert.deepEqual(detail.progress, before.progress);
        retained = detail;
      },
    );

    await t.test(
      "zero-day confirmation changes only its receipt and exact replay is harmless",
      async () => {
        const detail = await create();
        const body = {
          requestId: randomUUID(),
          revision: detail.plan.revision,
          restartDate: "2026-10-01",
        };
        const beforeReceipts = receiptCount();
        now = "2026-10-08T10:00:00.000Z";
        assert.deepEqual(
          await json<PlanDetail>(await request(confirmRoute(detail), { body })),
          detail,
        );
        assert.equal(receiptCount(), beforeReceipts + 1);
        assert.deepEqual(await current(detail.plan.id), detail);
        assert.deepEqual(
          await json<PlanDetail>(await request(confirmRoute(detail), { body })),
          detail,
        );
        assert.equal(receiptCount(), beforeReceipts + 1);
      },
    );

    await t.test(
      "exact retry returns saved response while conflicting keys and stale fresh keys reject",
      async () => {
        const detail = await create();
        const body = {
          requestId: randomUUID(),
          revision: detail.plan.revision,
          restartDate: "2026-10-08",
        };
        const applied = await json<PlanDetail>(await request(confirmRoute(detail), { body }));
        assert.deepEqual(
          await json<PlanDetail>(await request(confirmRoute(detail), { body })),
          applied,
        );
        await error(
          await request(confirmRoute(detail), { body: { ...body, restartDate: "2026-10-09" } }),
          409,
          "idempotency_conflict",
        );
        await error(
          await request(confirmRoute(detail), { body: { ...body, requestId: randomUUID() } }),
          409,
          "stale_revision",
        );
        const step = applied.plan.steps[0];
        assert.ok(step);
        await error(
          await request(`/api/plans/${detail.plan.id}/activities`, {
            body: { requestId: body.requestId, stepId: step.id, minutes: 5 },
          }),
          409,
          "idempotency_conflict",
        );
        const later = await json<PlanDetail>(
          await request(`/api/plans/${detail.plan.id}/activities`, {
            body: { requestId: randomUUID(), stepId: step.id, minutes: 5 },
          }),
        );
        assert.deepEqual(
          await json<PlanDetail>(await request(confirmRoute(detail), { body })),
          applied,
        );
        assert.equal((await current(detail.plan.id)).activities.length, later.activities.length);
        assert.equal(later.plan.revision, applied.plan.revision);
      },
    );

    await t.test(
      "concurrent confirmations commit once for both identical and distinct request keys",
      async () => {
        for (const sameKey of [true, false]) {
          const detail = await create();
          const body = {
            requestId: randomUUID(),
            revision: detail.plan.revision,
            restartDate: "2026-10-08",
          };
          const responses = await Promise.all([
            request(confirmRoute(detail), { body }),
            request(confirmRoute(detail), {
              body: { ...body, requestId: sameKey ? body.requestId : randomUUID() },
            }),
          ]);
          if (sameKey)
            assert.deepEqual(
              await json<PlanDetail>(responses[0] as Response),
              await json<PlanDetail>(responses[1] as Response),
            );
          else {
            assert.deepEqual(responses.map((response) => response.status).sort(), [200, 409]);
            for (const response of responses)
              if (response.status === 409) await error(response, 409, "stale_revision");
          }
          const saved = await current(detail.plan.id);
          assert.equal(saved.plan.revision, detail.plan.revision + 1);
          assert.deepEqual(
            saved.plan.steps.map((step) => step.scheduledDate),
            ["2026-10-08", "2026-10-10", "2026-10-12"],
          );
        }
      },
    );

    await t.test("plan edits and completion make preview and confirmation stale", async () => {
      for (const operation of ["edit", "complete"]) {
        const detail = await create();
        const body = { revision: detail.plan.revision, restartDate: "2026-10-08" };
        await json<ComebackPreview>(await request(previewRoute(detail), { body }));
        const step = detail.plan.steps[0];
        assert.ok(step);
        const changed =
          operation === "edit"
            ? await json<PlanDetail>(
                await request(`/api/plans/${detail.plan.id}`, {
                  method: "PUT",
                  body: { ...fields(detail), goal: "Updated private goal" },
                }),
              )
            : await json<PlanDetail>(
                await request(`/api/plans/${detail.plan.id}/completions`, {
                  body: {
                    requestId: randomUUID(),
                    revision: detail.plan.revision,
                    stepId: step.id,
                  },
                }),
              );
        await error(
          await request(confirmRoute(detail), { body: { requestId: randomUUID(), ...body } }),
          409,
          "stale_revision",
        );
        await error(await request(previewRoute(detail), { body }), 409, "stale_revision");
        assert.deepEqual(await current(detail.plan.id), changed);
        const regenerated = await json<ComebackPreview>(
          await request(previewRoute(detail), {
            body: { ...body, revision: changed.plan.revision },
          }),
        );
        assert.equal(regenerated.revision, changed.plan.revision);
        assert.equal(regenerated.changes.length, operation === "edit" ? 3 : 2);
      }
    });

    await t.test(
      "activity and profile changes preserve preview validity and survive confirmation",
      async () => {
        const detail = await create();
        const body = { revision: detail.plan.revision, restartDate: "2026-10-08" };
        await json<ComebackPreview>(await request(previewRoute(detail), { body }));
        const step = detail.plan.steps[0];
        assert.ok(step);
        const activity = await json<PlanDetail>(
          await request(`/api/plans/${detail.plan.id}/activities`, {
            body: {
              requestId: randomUUID(),
              stepId: step.id,
              minutes: 5,
              reflection: "Still private after rescheduling",
            },
          }),
        );
        assert.equal(
          (
            await request("/api/me", {
              method: "PUT",
              body: { locale: "fr", timezone: "America/New_York" },
            })
          ).status,
          200,
        );
        const applied = await json<PlanDetail>(
          await request(confirmRoute(detail), { body: { requestId: randomUUID(), ...body } }),
        );
        assert.equal(applied.plan.locale, "fr");
        assert.equal(applied.plan.timezone, "America/New_York");
        assert.deepEqual(applied.activities, activity.activities);
        assert.equal(applied.progress.studiedMinutes, 5);
        assert.equal(applied.progress.completed, 0);
        assert.equal(
          (
            await request("/api/me", {
              method: "PUT",
              body: { locale: "en", timezone: "Africa/Lagos" },
            })
          ).status,
          200,
        );
      },
    );

    await t.test(
      "empty and all-complete plans reject preview/confirmation without a receipt",
      async () => {
        for (const empty of [true, false]) {
          let detail = await create(["2026-10-01"]);
          const step = detail.plan.steps[0];
          assert.ok(step);
          detail = empty
            ? await json<PlanDetail>(
                await request(`/api/plans/${detail.plan.id}`, {
                  method: "PUT",
                  body: { ...fields(detail), steps: [] },
                }),
              )
            : await json<PlanDetail>(
                await request(`/api/plans/${detail.plan.id}/completions`, {
                  body: {
                    requestId: randomUUID(),
                    revision: detail.plan.revision,
                    stepId: step.id,
                  },
                }),
              );
          const before = snapshot();
          const body = { revision: detail.plan.revision, restartDate: "2026-10-08" };
          await error(await request(previewRoute(detail), { body }), 409, "no_unfinished_steps");
          await error(
            await request(confirmRoute(detail), { body: { requestId: randomUUID(), ...body } }),
            409,
            "no_unfinished_steps",
          );
          assert.deepEqual(snapshot(), before);
        }
      },
    );

    await t.test(
      "overflow in either direction leaves the whole plan and receipt table unchanged",
      async () => {
        for (const [dates, restartDate] of [
          [["2100-12-30", "2100-12-31"], "2100-12-31"],
          [["2000-01-02", "2000-01-01"], "2000-01-01"],
        ] as const) {
          const detail = await create([...dates]);
          const before = snapshot();
          const body = { revision: detail.plan.revision, restartDate };
          await error(
            await request(previewRoute(detail), { body }),
            400,
            "schedule_out_of_range",
            "restartDate",
          );
          await error(
            await request(confirmRoute(detail), { body: { requestId: randomUUID(), ...body } }),
            400,
            "schedule_out_of_range",
            "restartDate",
          );
          assert.deepEqual(snapshot(), before);
        }
      },
    );

    await t.test(
      "anonymous and other-account calls cannot view, mutate or replay private Comeback",
      async () => {
        const detail = await create();
        const body = { revision: detail.plan.revision, restartDate: "2026-10-08" };
        const confirmation = { requestId: randomUUID(), ...body };
        const saved = await json<PlanDetail>(
          await request(confirmRoute(detail), { body: confirmation }),
        );
        for (const cookie of ["", otherCookie]) {
          const status = cookie ? 404 : 401;
          const code = cookie ? "not_found" : "unauthenticated";
          await error(await request(previewRoute(detail), { cookie, body }), status, code);
          await error(
            await request(confirmRoute(detail), { cookie, body: confirmation }),
            status,
            code,
          );
        }
        assert.deepEqual(await current(detail.plan.id), saved);
      },
    );

    await t.test(
      "forged fields, invalid dates and cross-origin requests retain validation defenses",
      async () => {
        const detail = await create();
        const body = { revision: detail.plan.revision, restartDate: "2026-10-08" };
        const before = snapshot();
        for (const additional of [
          { ownerId: randomUUID() },
          { changes: [] },
          { conflicts: [] },
          { restartDate: "2026-02-29" },
          { revision: 0 },
        ]) {
          await error(
            await request(previewRoute(detail), { body: { ...body, ...additional } }),
            400,
            "invalid_input",
          );
          await error(
            await request(confirmRoute(detail), {
              body: { requestId: randomUUID(), ...body, ...additional },
            }),
            400,
            "invalid_input",
          );
        }
        await error(
          await request(confirmRoute(detail), { body: { requestId: "retry", ...body } }),
          400,
          "invalid_input",
          "requestId",
        );
        await error(
          await request(confirmRoute(detail), {
            body: { requestId: randomUUID(), ...body },
            headers: { origin: "https://untrusted.example.invalid" },
          }),
          403,
          "invalid_origin",
        );
        assert.deepEqual(snapshot(), before);
      },
    );

    await t.test(
      "five-minute restart after schedule confirmation never auto-completes",
      async () => {
        const detail = await create();
        const applied = await json<PlanDetail>(
          await request(confirmRoute(detail), {
            body: {
              requestId: randomUUID(),
              revision: detail.plan.revision,
              restartDate: "2026-10-08",
            },
          }),
        );
        const step = applied.plan.steps[0];
        assert.ok(step);
        const body = { requestId: randomUUID(), stepId: step.id, minutes: 5 };
        const studied = await json<PlanDetail>(
          await request(`/api/plans/${detail.plan.id}/activities`, { body }),
        );
        assert.equal(studied.plan.revision, applied.plan.revision);
        assert.equal(studied.progress.studiedMinutes, 5);
        assert.equal(studied.progress.activityCount, 1);
        assert.equal(studied.progress.completed, 0);
        assert.equal(studied.plan.steps[0]?.completedAt, null);
        assert.deepEqual(
          studied.plan.steps.map((item) => item.scheduledDate),
          applied.plan.steps.map((item) => item.scheduledDate),
        );
        assert.deepEqual(
          await json<PlanDetail>(
            await request(`/api/plans/${detail.plan.id}/activities`, { body }),
          ),
          studied,
        );
      },
    );

    await t.test(
      "confirmed dates and retained private history survive server/database reopen",
      async () => {
        assert.ok(retained);
        const expected = await current(retained.plan.id);
        const port = Number(new URL(origin).port);
        await stop();
        await boot(port);
        assert.deepEqual(await current(retained.plan.id), expected);
        assert.deepEqual(
          expected.plan.steps.map((step) => step.scheduledDate),
          ["2026-10-01", "2026-10-08", "2026-10-10"],
        );
        assert.equal(expected.progress.cumulativeCompletions, 2);
        assert.equal(expected.activities[0]?.reflection, "Private reflection stays private");
      },
    );
  } finally {
    await stop();
    assert.ok(directory.startsWith(`${parent}${path.sep}comeback-`));
    await rm(directory, { recursive: true, force: true });
  }
});
