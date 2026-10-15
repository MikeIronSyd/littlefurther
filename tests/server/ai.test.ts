import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import test, { type TestContext } from "node:test";
import type express from "express";
import Database from "better-sqlite3";
import { createApp } from "../../src/server/app.js";
import { AI_MODEL, type AiProviderOptions } from "../../src/server/ai-provider.js";
import type { PlanDetail } from "../../src/shared/contracts.js";
import type { AiPlanResult } from "../../src/shared/ai-contracts.js";

interface Capture {
  body: Record<string, unknown>;
  context: Record<string, unknown>;
  action: string;
  locale: string;
}
function capture(init?: RequestInit): Capture {
  const body = JSON.parse(String(init?.body));
  const schema = body.text?.format?.schema;
  const context = schema
    ? JSON.parse(body.input.split("Context Pointers: ")[1].split("\nConstraints:")[0])
    : {};
  return {
    body,
    context,
    action: schema?.properties.action.enum[0] ?? "search",
    locale: schema?.properties.locale.enum[0] ?? "en",
  };
}
function result(reply: Capture, override?: unknown): Response {
  const sources = reply.context.sources as { id: string }[] | undefined;
  const value =
    override ??
    (reply.action === "plan_draft"
      ? {
          kind: "plan",
          goal: "Learn HTML",
          outcome: "Make a page",
          prerequisites: "",
          steps: [
            { title: "Read one introduction", estimatedMinutes: 15, sourceIds: [sources?.[0]?.id] },
          ],
        }
      : reply.action === "circle_draft"
        ? { kind: "circle", text: "I will read one page when I have time." }
        : {
            kind: "guidance",
            title: "One small step",
            summary: "Your earlier work remains recorded.",
            nextAction: "Read one example.",
            microActions: ["Open your lesson."],
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
            text: JSON.stringify({ action: reply.action, locale: reply.locale, result: value }),
            annotations: [],
          },
        ],
      },
    ],
  });
}
function searchResult(): Response {
  return Response.json({
    model: AI_MODEL,
    store: false,
    status: "completed",
    error: null,
    output: [
      {
        type: "web_search_call",
        status: "completed",
        action: {
          type: "search",
          sources: [{ type: "url", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" }],
        },
      },
      {
        type: "message",
        role: "assistant",
        status: "completed",
        content: [
          {
            type: "output_text",
            text: "RAW SEARCH CLAIM MUST NOT REACH GENERATION",
            annotations: [
              {
                type: "url_citation",
                url: "https://developer.mozilla.org/en-US/docs/Web/HTML?utm_source=openai",
                title: "HTML reference",
                start_index: 0,
                end_index: 3,
              },
            ],
          },
        ],
      },
    ],
  });
}
async function fixture(t: TestContext, ai?: AiProviderOptions & { operationTimeoutMs?: number }) {
  const parent = path.resolve(".local/server-tests");
  await mkdir(parent, { recursive: true });
  const directory = await mkdtemp(path.join(parent, "ai-"));
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
    clock: () => new Date("2026-10-13T09:00:00.000Z"),
    ...(ai ? { ai } : {}),
  });
  app = running.app;
  t.after(async () => {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    running.close();
    await rm(directory, { recursive: true, force: true });
  });
  async function request(
    endpoint: string,
    cookie = "",
    body?: unknown,
    method?: string,
    signal?: AbortSignal,
  ): Promise<Response> {
    return fetch(`${origin}${endpoint}`, {
      method: method ?? (body === undefined ? "GET" : "POST"),
      headers: {
        ...(cookie ? { cookie } : {}),
        ...(body === undefined ? {} : { "content-type": "application/json", origin }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      ...(signal ? { signal } : {}),
      redirect: "manual",
    });
  }
  async function account(name: string): Promise<string> {
    const email = `${randomUUID()}@example.org`;
    const password = "isolated-password-123";
    async function authenticate(endpoint: string, body: unknown): Promise<Response> {
      const first = await request(endpoint, "", body);
      if (first.status !== 429) return first;
      // Better Auth's in-memory sensitive-path limiter is shared across fixtures in this process.
      // Respect its real retry window rather than weakening production authentication for tests.
      const seconds = Number(first.headers.get("x-retry-after"));
      assert.ok(Number.isFinite(seconds) && seconds > 0 && seconds <= 60);
      await new Promise<void>((resolve) => setTimeout(resolve, seconds * 1000 + 25));
      return request(endpoint, "", body);
    }
    assert.equal(
      (await authenticate("/api/auth/sign-up/email", { name, email, password })).status,
      200,
    );
    const login = await authenticate("/api/auth/sign-in/email", { email, password });
    assert.equal(login.status, 200);
    const cookie = login.headers
      .getSetCookie()
      .map((value) => value.split(";")[0])
      .join("; ");
    assert.ok(cookie);
    assert.equal(
      (await request("/api/me", cookie, { locale: "en", timezone: "Africa/Lagos" }, "PUT")).status,
      200,
    );
    return cookie;
  }
  return { request, account, directory, origin };
}
async function error(response: Response, status: number, expected: string): Promise<void> {
  assert.equal(response.status, status);
  assert.deepEqual(((await response.json()) as { error: { code: string } }).error.code, expected);
}
const planDraft = {
  action: "plan_draft",
  locale: "en",
  goal: "Learn HTML",
  links: ["https://developer.mozilla.org/en-US/docs/Web/HTML"],
  search: false,
};
async function plan(
  request: Awaited<ReturnType<typeof fixture>>["request"],
  cookie: string,
): Promise<PlanDetail> {
  const response = await request("/api/plans", cookie, {
    requestId: randomUUID(),
    templateId: null,
    goal: "PRIVATE learning goal",
    availabilityDates: ["2026-10-13"],
    targetDate: null,
    references: ["https://developer.mozilla.org/en-US/docs/Web/HTML"],
    steps: [{ title: "Read an introduction", scheduledDate: "2026-10-13", estimatedMinutes: 15 }],
  });
  assert.equal(response.status, 201);
  return (await response.json()) as PlanDetail;
}

test("AI routes retain real auth, manual startup and same-origin defenses", async (t) => {
  const f = await fixture(t);
  const cookie = await f.account("Isolated learner");
  await error(await f.request("/api/ai/status"), 401, "unauthenticated");
  const status = await f.request("/api/ai/status", cookie);
  assert.deepEqual(await status.json(), {
    available: false,
    reason: "not_configured",
    model: AI_MODEL,
  });
  assert.match(status.headers.get("content-security-policy") ?? "", /connect-src 'self'/u);
  await error(
    await fetch(`${f.origin}/api/ai/assist`, {
      method: "POST",
      headers: {
        cookie,
        origin: "https://untrusted.example.org",
        "content-type": "application/json",
      },
      body: JSON.stringify(planDraft),
    }),
    403,
    "invalid_origin",
  );
  await error(await f.request("/api/ai/assist", cookie, planDraft), 503, "ai_unavailable");
  assert.equal((await f.request("/api/health")).status, 200);
  await plan(f.request, cookie);
  const invalid = await f.request("/api/ai/assist", cookie, {
    ...planDraft,
    provider: "https://untrusted.example.org",
    apiKey: "fixture-key",
  });
  await error(invalid, 400, "invalid_input");
});

test("six actions use bounded owner context, preserve records and keep circle/reflection privacy", async (t) => {
  const sent: Capture[] = [];
  const f = await fixture(t, {
    apiKey: "fixture-key",
    fetch: async (_url, init) => {
      const parsed = capture(init);
      sent.push(parsed);
      return parsed.action === "search" ? searchResult() : result(parsed);
    },
  });
  const cookie = await f.account("DO NOT SEND ACCOUNT NAME");
  const stranger = await f.account("OTHER ACCOUNT");
  let detail = await plan(f.request, cookie);
  const stepId = detail.plan.steps[0]?.id;
  assert.ok(stepId);
  assert.equal(
    (
      await f.request(`/api/plans/${detail.plan.id}/activities`, cookie, {
        requestId: randomUUID(),
        stepId,
        revision: detail.plan.revision,
        minutes: 5,
        reflection: "SAVED REFLECTION MUST STAY LOCAL",
      })
    ).status,
    200,
  );
  detail = (await (await f.request(`/api/plans/${detail.plan.id}`, cookie)).json()) as PlanDetail;
  const base = { locale: "en", planId: detail.plan.id, revision: detail.plan.revision };
  const before = await (await f.request(`/api/plans/${detail.plan.id}`, cookie)).json();
  for (const input of [
    planDraft,
    { ...base, action: "step_help", stepId, minutes: 5 },
    { ...base, action: "study_reflection", stepId },
    { ...base, action: "comeback_help", minutes: 5 },
    { ...base, action: "progress_recap" },
  ]) {
    assert.equal((await f.request("/api/ai/assist", cookie, input)).status, 200);
  }
  const circleResponse = await f.request("/api/circles", cookie, {
    requestId: randomUUID(),
    name: "PRIVATE CIRCLE NAME",
  });
  const circle = (await circleResponse.json()) as { circleId: string };
  const circleInput = {
    action: "circle_draft",
    locale: "fr",
    circleId: circle.circleId,
    kind: "commitment",
    draft: "My own typed promise",
  };
  assert.equal((await f.request("/api/ai/assist", cookie, circleInput)).status, 200);
  assert.equal(sent.length, 6);
  assert.deepEqual(sent[5]?.context, {
    draft: "My own typed promise",
    kind: "commitment",
    locale: "fr",
  });
  const all = JSON.stringify(sent.map((item) => item.body));
  for (const secret of [
    "DO NOT SEND ACCOUNT NAME",
    "OTHER ACCOUNT",
    "SAVED REFLECTION MUST STAY LOCAL",
    "PRIVATE CIRCLE NAME",
    detail.plan.id,
    circle.circleId,
    stepId,
  ])
    assert.equal(all.includes(secret), false, secret);
  assert.equal(sent.filter((item) => item.action === "search").length, 0);
  const tooLarge = {
    ...planDraft,
    search: true,
    material: "x".repeat(2000),
    links: Array.from(
      { length: 8 },
      (_unused, index) => `https://example.org/${index}/${"a".repeat(1600)}`,
    ),
  };
  await error(await f.request("/api/ai/assist", cookie, tooLarge), 400, "invalid_input");
  assert.equal(sent.length, 6);
  assert.ok(sent.every((item) => (item.body.tools as unknown[]).length === 0));
  assert.deepEqual(await (await f.request(`/api/plans/${detail.plan.id}`, cookie)).json(), before);
  assert.equal(
    (
      (await (await f.request(`/api/circles/${circle.circleId}`, cookie)).json()) as {
        items: unknown[];
      }
    ).items.length,
    0,
  );
  const searchedResponse = await f.request("/api/ai/assist", cookie, {
    ...planDraft,
    search: true,
  });
  assert.equal(searchedResponse.status, 200);
  const searched = (await searchedResponse.json()) as AiPlanResult;
  assert.equal(searched.kind, "plan");
  assert.equal(searched.sources[0]?.kind, "web_search");
  assert.deepEqual(searched.sources[0]?.evidence, ["listed", "cited"]);
  assert.deepEqual(
    sent.slice(-2).map((item) => item.action),
    ["search", "plan_draft"],
  );
  assert.equal(JSON.stringify(sent.at(-1)?.context).includes("RAW SEARCH CLAIM"), false);
  const savedAi = await f.request("/api/plans", cookie, {
    requestId: randomUUID(),
    templateId: null,
    goal: searched.goal,
    availabilityDates: ["2026-10-13"],
    targetDate: null,
    references: searched.sources.map((source) => source.url),
    sourceIds: searched.sources.map((source) => source.id),
    steps: searched.steps.map((step) => ({ ...step, scheduledDate: "2026-10-13" })),
  });
  assert.equal(savedAi.status, 201);
  const savedDetail = (await savedAi.json()) as PlanDetail;
  assert.deepEqual(savedDetail.plan.sources, searched.sources);
  assert.deepEqual(
    ((await (await f.request(`/api/plans/${savedDetail.plan.id}`, cookie)).json()) as PlanDetail)
      .plan.sources,
    searched.sources,
  );
  const selected = await f.request("/api/ai/assist", cookie, {
    ...base,
    action: "study_reflection",
    stepId,
    reflection: "EXPLICIT selected reflection",
  });
  assert.equal(selected.status, 200);
  assert.equal(JSON.stringify(sent.at(-1)?.context).includes("EXPLICIT selected reflection"), true);
  await error(
    await f.request("/api/ai/assist", stranger, {
      ...base,
      action: "step_help",
      stepId,
      minutes: 5,
    }),
    404,
    "not_found",
  );
  await error(await f.request("/api/ai/assist", stranger, circleInput), 404, "not_found");
  detail = (await (
    await f.request(`/api/plans/${detail.plan.id}/completions`, cookie, {
      requestId: randomUUID(),
      revision: detail.plan.revision,
      stepId,
    })
  ).json()) as PlanDetail;
  assert.equal(
    (
      await f.request("/api/ai/assist", cookie, {
        ...base,
        revision: detail.plan.revision,
        action: "progress_recap",
      })
    ).status,
    200,
  );
  assert.equal(sent.at(-1)?.context.finished, true);
  assert.equal(sent.at(-1)?.context.empty, false);
  await error(
    await f.request("/api/ai/assist", cookie, {
      ...base,
      revision: detail.plan.revision,
      action: "step_help",
      stepId,
      minutes: 5,
    }),
    409,
    "already_complete",
  );
  await error(
    await f.request("/api/ai/assist", cookie, {
      ...base,
      revision: detail.plan.revision,
      action: "comeback_help",
      minutes: 5,
    }),
    409,
    "no_unfinished_work",
  );
  const emptied = await f.request(
    `/api/plans/${detail.plan.id}`,
    cookie,
    {
      requestId: randomUUID(),
      revision: detail.plan.revision,
      goal: detail.plan.goal,
      availabilityDates: detail.plan.availabilityDates,
      targetDate: detail.plan.targetDate,
      references: detail.plan.references,
      steps: [],
    },
    "PUT",
  );
  assert.equal(emptied.status, 200);
  detail = (await emptied.json()) as PlanDetail;
  assert.equal(
    (
      await f.request("/api/ai/assist", cookie, {
        ...base,
        revision: detail.plan.revision,
        action: "progress_recap",
      })
    ).status,
    200,
  );
  assert.equal(sent.at(-1)?.context.empty, true);
  assert.equal(sent.at(-1)?.context.finished, false);
  const emptyRecap = sent.at(-1);
  assert.ok(emptyRecap);
  assert.equal(
    (emptyRecap.context.recorded as { cumulativeCompletions: number }).cumulativeCompletions,
    1,
  );
});

test("AI rechecks session, revision and membership after delayed provider work without staging", async (t) => {
  let wait: (() => void) | undefined;
  let started: (() => void) | undefined;
  let nextStarted = new Promise<void>((resolve) => {
    started = resolve;
  });
  let latest: Capture | undefined;
  const f = await fixture(t, {
    apiKey: "fixture-key",
    fetch: async (_url, init) => {
      latest = capture(init);
      started?.();
      await new Promise<void>((resolve) => {
        wait = resolve;
      });
      return result(latest);
    },
  });
  let cookie = await f.account("Isolated session learner");
  const pending = f.request("/api/ai/assist", cookie, planDraft);
  await nextStarted;
  assert.equal((await f.request("/api/auth/sign-out", cookie, {})).status, 200);
  wait?.();
  await error(await pending, 401, "unauthenticated");
  const database = new Database(path.join(f.directory, "capstone.sqlite"));
  assert.equal(
    (database.prepare("SELECT count(*) AS n FROM ai_source_draft").get() as { n: number }).n,
    0,
  );
  cookie = await f.account("Other isolated learner");
  const detail = await plan(f.request, cookie);
  const stepId = detail.plan.steps[0]?.id;
  assert.ok(stepId);
  nextStarted = new Promise<void>((resolve) => {
    started = resolve;
  });
  const stale = f.request("/api/ai/assist", cookie, {
    action: "step_help",
    locale: "en",
    planId: detail.plan.id,
    revision: detail.plan.revision,
    stepId,
    minutes: 5,
  });
  await nextStarted;
  assert.equal(
    (
      await f.request(`/api/plans/${detail.plan.id}/completions`, cookie, {
        requestId: randomUUID(),
        revision: detail.plan.revision,
        stepId,
      })
    ).status,
    200,
  );
  wait?.();
  await error(await stale, 409, "stale_revision");
  const circle = (await (
    await f.request("/api/circles", cookie, { requestId: randomUUID(), name: "Isolated group" })
  ).json()) as { circleId: string };
  nextStarted = new Promise<void>((resolve) => {
    started = resolve;
  });
  const membership = f.request("/api/ai/assist", cookie, {
    action: "circle_draft",
    locale: "en",
    circleId: circle.circleId,
    kind: "commitment",
    draft: "My own promise",
  });
  await nextStarted;
  assert.equal(
    (await f.request(`/api/circles/${circle.circleId}/close`, cookie, { requestId: randomUUID() }))
      .status,
    200,
  );
  wait?.();
  await error(await membership, 404, "not_found");
  nextStarted = new Promise<void>((resolve) => {
    started = resolve;
  });
  const expired = f.request("/api/ai/assist", cookie, planDraft);
  await nextStarted;
  database.prepare("UPDATE session SET expiresAt=?").run(new Date(0).getTime());
  wait?.();
  await error(await expired, 401, "unauthenticated");
  assert.equal(
    (database.prepare("SELECT count(*) AS n FROM ai_source_draft").get() as { n: number }).n,
    0,
  );
  database.close();
});

test("AI rejects duplicate/concurrent operations and client cancellation aborts provider work", async (t) => {
  const waiting: (() => void)[] = [];
  let seen = 0;
  let notify: (() => void) | undefined;
  let aborted: (() => void) | undefined;
  const cancelled = new Promise<void>((resolve) => {
    aborted = resolve;
  });
  const f = await fixture(t, {
    apiKey: "fixture-key",
    fetch: async (_url, init) => {
      const parsed = capture(init);
      seen += 1;
      notify?.();
      await new Promise<void>((resolve, reject) => {
        waiting.push(resolve);
        init?.signal?.addEventListener(
          "abort",
          () => {
            aborted?.();
            reject(new Error("aborted fixture"));
          },
          { once: true },
        );
      });
      return result(parsed);
    },
  });
  const alpha = await f.account("Alpha");
  const beta = await f.account("Beta");
  const gamma = await f.account("Gamma");
  let ready = new Promise<void>((resolve) => {
    notify = resolve;
  });
  const first = f.request("/api/ai/assist", alpha, planDraft);
  await ready;
  await error(await f.request("/api/ai/assist", alpha, planDraft), 429, "ai_busy");
  ready = new Promise<void>((resolve) => {
    notify = resolve;
  });
  const second = f.request("/api/ai/assist", beta, planDraft);
  await ready;
  await error(await f.request("/api/ai/assist", gamma, planDraft), 429, "ai_busy");
  assert.equal(seen, 2);
  waiting.splice(0).forEach((resolve) => {
    resolve();
  });
  assert.equal((await first).status, 200);
  assert.equal((await second).status, 200);
  ready = new Promise<void>((resolve) => {
    notify = resolve;
  });
  const controller = new AbortController();
  const cancel = f.request("/api/ai/assist", alpha, planDraft, undefined, controller.signal);
  await ready;
  controller.abort();
  await assert.rejects(cancel);
  await cancelled;
  assert.equal(seen, 3);
});

test("search-only insufficient results still recheck session, and generated unknown IDs never stage", async (t) => {
  let release: (() => void) | undefined;
  let started: (() => void) | undefined;
  const begun = new Promise<void>((resolve) => {
    started = resolve;
  });
  let mode = "empty-search";
  const f = await fixture(t, {
    apiKey: "fixture-key",
    fetch: async (_url, init) => {
      const parsed = capture(init);
      if (mode === "bad-plan")
        return result(parsed, {
          kind: "plan",
          goal: "HTML",
          outcome: "Page",
          prerequisites: "",
          steps: [{ title: "Read", estimatedMinutes: 10, sourceIds: [randomUUID()] }],
        });
      started?.();
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
            type: "web_search_call",
            status: "completed",
            action: {
              type: "search",
              sources: [{ type: "url", url: "https://www.w3.org/TR/WCAG10/obsolete.pdf" }],
            },
          },
          {
            type: "message",
            role: "assistant",
            status: "completed",
            content: [{ type: "output_text", text: "Old unsupported PDF", annotations: [] }],
          },
        ],
      });
    },
  });
  const cookie = await f.account("Search learner");
  const pending = f.request("/api/ai/assist", cookie, { ...planDraft, search: true, links: [] });
  await begun;
  assert.equal((await f.request("/api/auth/sign-out", cookie, {})).status, 200);
  release?.();
  await error(await pending, 401, "unauthenticated");
  mode = "bad-plan";
  const next = await f.account("New isolated learner");
  await error(await f.request("/api/ai/assist", next, planDraft), 502, "ai_invalid_output");
  const database = new Database(path.join(f.directory, "capstone.sqlite"));
  assert.equal(
    (database.prepare("SELECT count(*) AS n FROM ai_source_draft").get() as { n: number }).n,
    0,
  );
  database.close();
});
