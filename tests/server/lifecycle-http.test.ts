import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import test, { type TestContext } from "node:test";
import type express from "express";
import { createApp } from "../../src/server/app.js";
import { AI_MODEL, type AiProviderOptions } from "../../src/server/ai-provider.js";
import type { PlanDetail, RemovedStep } from "../../src/shared/contracts.js";

async function fixture(t: TestContext, ai?: AiProviderOptions) {
  const parent = path.resolve(".local/server-tests");
  await mkdir(parent, { recursive: true });
  const directory = await mkdtemp(path.join(parent, "lifecycle-http-"));
  let app: express.Express | undefined;
  const server = createServer((request, response) => {
    if (app) app(request, response);
    else response.end();
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const origin = `http://127.0.0.1:${address.port}`;
  const running = await createApp({
    origin,
    dataDirectory: directory,
    clock: () => new Date("2026-10-15T10:00:00.000Z"),
    ...(ai ? { ai } : {}),
  });
  app = running.app;
  t.after(async () => {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    running.close();
    assert.ok(directory.startsWith(`${parent}${path.sep}lifecycle-http-`));
    await rm(directory, { recursive: true, force: true });
  });
  async function request(
    endpoint: string,
    cookie = "",
    body?: unknown,
    method?: string,
  ): Promise<Response> {
    return fetch(`${origin}${endpoint}`, {
      method: method ?? (body === undefined ? "GET" : "POST"),
      headers: {
        ...(cookie ? { cookie } : {}),
        ...(body === undefined ? {} : { "content-type": "application/json", origin }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(15000),
    });
  }
  async function account(): Promise<string> {
    const email = `${randomUUID()}@example.invalid`,
      password = "synthetic-lifecycle-123";
    for (const [endpoint, body] of [
      ["sign-up/email", { name: "Synthetic lifecycle", email, password }],
      ["sign-in/email", { email, password }],
    ] as const) {
      let response = await request(`/api/auth/${endpoint}`, "", body);
      if (response.status === 429) {
        const seconds = Number(response.headers.get("x-retry-after"));
        assert.ok(seconds > 0 && seconds <= 60);
        await new Promise<void>((resolve) => setTimeout(resolve, seconds * 1000 + 25));
        response = await request(`/api/auth/${endpoint}`, "", body);
      }
      assert.equal(response.status, 200);
      if (endpoint === "sign-in/email") {
        const cookie = response.headers
          .getSetCookie()
          .map((value) => value.split(";")[0])
          .join("; ");
        assert.ok(cookie);
        assert.equal(
          (await request("/api/me", cookie, { locale: "en", timezone: "Africa/Lagos" }, "PUT"))
            .status,
          200,
        );
        return cookie;
      }
    }
    throw new Error("Session missing");
  }
  async function create(cookie: string): Promise<PlanDetail> {
    const response = await request("/api/plans", cookie, {
      requestId: randomUUID(),
      goal: "Synthetic lifecycle plan",
      templateId: null,
      availabilityDates: ["2026-10-15"],
      targetDate: null,
      references: [],
      steps: [{ title: "Read one page", scheduledDate: "2026-10-15", estimatedMinutes: 5 }],
    });
    assert.equal(response.status, 201);
    return (await response.json()) as PlanDetail;
  }
  return { request, account, create };
}
async function error(response: Response, status: number, code: string): Promise<void> {
  assert.equal(response.status, status);
  assert.equal(((await response.json()) as { error: { code: string } }).error.code, code);
}
async function detail(response: Response): Promise<PlanDetail> {
  assert.equal(response.status, 200);
  return (await response.json()) as PlanDetail;
}
const action = (value: PlanDetail) => ({ requestId: randomUUID(), revision: value.plan.revision });

test("lifecycle HTTP routes enforce owner/revision/strict contracts and preserve archived read-only history", async (t) => {
  const f = await fixture(t);
  const owner = await f.account(),
    other = await f.account();
  let current = await f.create(owner);
  const id = current.plan.id,
    stepId = current.plan.steps[0]?.id ?? "";
  await error(await f.request("/api/plans?status=all", owner), 400, "invalid_input");
  await error(
    await f.request(`/api/plans/${id}/archive`, "", action(current)),
    401,
    "unauthenticated",
  );
  await error(
    await f.request(`/api/plans/${id}/archive`, other, action(current)),
    404,
    "not_found",
  );
  await error(
    await f.request(`/api/plans/${id}/archive`, owner, { ...action(current), ownerId: "other" }),
    400,
    "invalid_input",
  );
  await error(
    await f.request(`/api/plans/${id}/activities`, owner, {
      requestId: randomUUID(),
      stepId,
      minutes: 5,
    }),
    400,
    "invalid_input",
  );
  current = await detail(
    await f.request(`/api/plans/${id}/activities`, owner, {
      ...action(current),
      stepId,
      minutes: 5,
      reflection: "Private HTTP reflection",
    }),
  );
  const activityId = current.activities[0]?.id ?? "";
  await error(
    await f.request(`/api/plans/${id}/activities/${activityId}/delete`, other, action(current)),
    404,
    "not_found",
  );
  await error(
    await f.request(`/api/plans/${id}/activities/${randomUUID()}/delete`, owner, action(current)),
    404,
    "not_found",
  );
  current = await detail(
    await f.request(
      `/api/plans/${id}/activities/${activityId}/reflection/remove`,
      owner,
      action(current),
    ),
  );
  assert.equal(current.activities[0]?.reflection, null);
  assert.equal(current.progress.studiedMinutes, 5);
  current = await detail(
    await f.request(`/api/plans/${id}/completions`, owner, { ...action(current), stepId }),
  );
  const completionId = current.completions[0]?.id ?? "";
  current = await detail(
    await f.request(`/api/plans/${id}/completions/${completionId}/correct`, owner, action(current)),
  );
  assert.equal(current.progress.completed, 0);
  assert.ok(current.completions[0]?.correctedAt);
  const fields = {
    goal: current.plan.goal,
    availabilityDates: current.plan.availabilityDates,
    targetDate: current.plan.targetDate,
    references: current.plan.references,
    steps: [],
  };
  current = await detail(
    await f.request(`/api/plans/${id}`, owner, { ...fields, ...action(current) }, "PUT"),
  );
  await error(await f.request(`/api/plans/${id}/removed-steps`, other), 404, "not_found");
  const removedResponse = await f.request(`/api/plans/${id}/removed-steps`, owner);
  assert.equal(removedResponse.status, 200);
  const candidate = ((await removedResponse.json()) as { steps: RemovedStep[] }).steps[0];
  assert.ok(candidate);
  current = await detail(
    await f.request(`/api/plans/${id}/steps/${stepId}/restore`, owner, {
      ...action(current),
      scopeEventId: candidate.scopeEventId,
      references: [],
      acknowledgeConflicts: false,
    }),
  );
  assert.equal(current.plan.steps[0]?.id, stepId);
  current = await detail(await f.request(`/api/plans/${id}/archive`, owner, action(current)));
  assert.ok(current.plan.archivedAt);
  assert.deepEqual(await (await f.request("/api/plans", owner)).json(), { plans: [] });
  const archives = (await (await f.request("/api/plans?status=archived", owner)).json()) as {
    plans: { id: string }[];
  };
  assert.equal(archives.plans[0]?.id, id);
  assert.equal((await f.request(`/api/plans/${id}`, owner)).status, 200);
  for (const [endpoint, body] of [
    [`activities/${activityId}/delete`, action(current)],
    [`activities/${activityId}/reflection/remove`, action(current)],
    [`completions/${completionId}/correct`, action(current)],
    [`activities`, { ...action(current), stepId, minutes: 5 }],
    [`completions`, { ...action(current), stepId }],
    [`comeback/preview`, { revision: current.plan.revision, restartDate: "2026-10-20" }],
    [`comeback/confirm`, { ...action(current), restartDate: "2026-10-20" }],
  ] as const)
    await error(await f.request(`/api/plans/${id}/${endpoint}`, owner, body), 409, "plan_archived");
  current = await detail(await f.request(`/api/plans/${id}/restore`, owner, action(current)));
  current = await detail(
    await f.request(`/api/plans/${id}/activities/${activityId}/delete`, owner, action(current)),
  );
  assert.equal(current.progress.activityCount, 0);
  const deletion = action(current);
  assert.deepEqual(await (await f.request(`/api/plans/${id}/delete`, owner, deletion)).json(), {
    deletedPlanId: id,
  });
  await error(await f.request(`/api/plans/${id}`, owner), 404, "not_found");
  assert.deepEqual(await (await f.request(`/api/plans/${id}/delete`, owner, deletion)).json(), {
    deletedPlanId: id,
  });
  assert.deepEqual(await (await f.request("/api/plans", owner)).json(), { plans: [] });
});

test("concurrent learning writes advance once and equal-count replacement still invalidates old deletion confirmation", async (t) => {
  const f = await fixture(t);
  const owner = await f.account();
  for (const sameKey of [true, false]) {
    let current = await f.create(owner);
    const id = current.plan.id;
    const stepId = current.plan.steps[0]?.id ?? "";
    const study = { ...action(current), stepId, minutes: 5 };
    const responses = await Promise.all([
      f.request(`/api/plans/${id}/activities`, owner, study),
      f.request(`/api/plans/${id}/activities`, owner, {
        ...study,
        requestId: sameKey ? study.requestId : randomUUID(),
      }),
    ]);
    assert.deepEqual(
      responses.map((response) => response.status).sort(),
      sameKey ? [200, 200] : [200, 409],
    );
    current = await detail(await f.request(`/api/plans/${id}`, owner));
    assert.equal(current.plan.revision, 2);
    assert.equal(current.activities.length, 1);
    const staleDelete = action(current);
    current = await detail(
      await f.request(
        `/api/plans/${id}/activities/${current.activities[0]?.id}/delete`,
        owner,
        action(current),
      ),
    );
    current = await detail(
      await f.request(`/api/plans/${id}/activities`, owner, {
        ...action(current),
        stepId,
        minutes: 5,
      }),
    );
    assert.equal(current.activities.length, 1);
    assert.equal(current.plan.revision, 4);
    await error(
      await f.request(`/api/plans/${id}/delete`, owner, staleDelete),
      409,
      "stale_revision",
    );
    assert.equal((await f.request(`/api/plans/${id}`, owner)).status, 200);
  }
});

test("saved-plan AI rejects archived/deleted or changed learning data after delayed mocked generation", async (t) => {
  let started = () => {};
  let release = () => {};
  let calls = 0;
  const f = await fixture(t, {
    apiKey: "synthetic-lifecycle-key",
    fetch: async (_url, init) => {
      calls++;
      const body = JSON.parse(String(init?.body));
      const schema = body.text.format.schema;
      started();
      await new Promise<void>((resolve) => {
        release = resolve;
      });
      return Response.json({
        model: AI_MODEL,
        store: false,
        status: "completed",
        error: null,
        output: [
          {
            type: "message",
            role: "assistant",
            status: "completed",
            content: [
              {
                type: "output_text",
                annotations: [],
                text: JSON.stringify({
                  action: schema.properties.action.enum[0],
                  locale: schema.properties.locale.enum[0],
                  result: {
                    kind: "guidance",
                    title: "Small step",
                    summary: "Review your own plan.",
                    nextAction: "Read one page.",
                    microActions: ["Open the lesson."],
                  },
                }),
              },
            ],
          },
        ],
      });
    },
  });
  const owner = await f.account();
  for (const change of [
    "archive",
    "delete",
    "study",
    "reflection",
    "session",
    "correction",
  ] as const) {
    let current = await f.create(owner);
    const id = current.plan.id,
      stepId = current.plan.steps[0]?.id ?? "";
    if (change === "reflection" || change === "session")
      current = await detail(
        await f.request(`/api/plans/${id}/activities`, owner, {
          ...action(current),
          stepId,
          minutes: 5,
          reflection: "Synthetic private note",
        }),
      );
    if (change === "correction")
      current = await detail(
        await f.request(`/api/plans/${id}/completions`, owner, { ...action(current), stepId }),
      );
    const ready = new Promise<void>((resolve) => {
      started = resolve;
    });
    const pending = f.request("/api/ai/assist", owner, {
      action: "progress_recap",
      locale: "en",
      planId: id,
      revision: current.plan.revision,
    });
    await ready;
    const endpoint =
      change === "reflection"
        ? `activities/${current.activities[0]?.id}/reflection/remove`
        : change === "session"
          ? `activities/${current.activities[0]?.id}/delete`
          : change === "correction"
            ? `completions/${current.completions[0]?.id}/correct`
            : change === "study"
              ? "activities"
              : change;
    const changed = await f.request(`/api/plans/${id}/${endpoint}`, owner, {
      ...action(current),
      ...(change === "study" ? { stepId, minutes: 5 } : {}),
    });
    assert.equal(changed.status, 200);
    release();
    await error(
      await pending,
      change === "delete" ? 404 : 409,
      change === "archive" ? "plan_archived" : change === "delete" ? "not_found" : "stale_revision",
    );
    if (change === "archive") {
      const archived = await detail(await f.request(`/api/plans/${id}`, owner));
      const before = calls;
      await error(
        await f.request("/api/ai/assist", owner, {
          action: "progress_recap",
          locale: "en",
          planId: id,
          revision: archived.plan.revision,
        }),
        409,
        "plan_archived",
      );
      assert.equal(calls, before);
    }
  }
});
