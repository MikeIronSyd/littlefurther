import assert from "node:assert/strict";
import test from "node:test";
import {
  OpenAiProvider,
  AI_MODEL,
  SEARCH_DOMAINS,
  suppliedSources,
} from "../../src/server/ai-provider.js";
import { resultSchema, AiAssistance } from "../../src/server/ai-assistance.js";
import { DomainError } from "../../src/domain/validation.js";
import { aiPlanResult } from "../../src/domain/ai-validation.js";
import type { JourneyStore } from "../../src/server/store.js";
import type { CircleStore } from "../../src/server/circles.js";
import type { AiSourceStore } from "../../src/server/ai-sources.js";

const guidance = {
  kind: "guidance",
  title: "One small step",
  summary: "Your recorded effort remains available.",
  nextAction: "Read one example.",
  microActions: ["Open the lesson."],
};
function response(text: string, extra: Record<string, unknown> = {}): Response {
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
        content: [{ type: "output_text", text, annotations: [] }],
      },
    ],
    ...extra,
  });
}
function request(signal = new AbortController().signal) {
  return {
    action: "step_help",
    locale: "en" as const,
    context: { step: "Read an example" },
    schema: resultSchema("step_help", [], "en"),
    signal,
  };
}
function jsonResult(result: unknown = guidance): string {
  return JSON.stringify({ action: "step_help", locale: "en", result });
}
async function code(work: Promise<unknown>, expected: string): Promise<void> {
  await assert.rejects(
    work,
    (error: unknown) =>
      error instanceof DomainError && error.code === expected && error.message === expected,
  );
}

test("OpenAI adapter fixes endpoint/model/privacy/tools and uses one tool-free generation", async () => {
  const calls: { url: string; init: RequestInit }[] = [];
  const provider = new OpenAiProvider({
    apiKey: "fixture-key",
    fetch: async (url, init) => {
      calls.push({ url: String(url), init: init ?? {} });
      return response(jsonResult());
    },
  });
  assert.deepEqual(await provider.generate(request()), guidance);
  assert.equal(calls.length, 1);
  assert.equal(calls[0]?.url, "https://api.openai.com/v1/responses");
  assert.equal(calls[0]?.init.redirect, "error");
  const body = JSON.parse(String(calls[0]?.init.body));
  assert.equal(body.model, AI_MODEL);
  assert.equal(body.store, false);
  assert.equal(body.background, false);
  assert.equal(body.stream, false);
  assert.equal(body.max_output_tokens, 4096);
  assert.deepEqual(body.tools, []);
  assert.equal(body.text.format.strict, true);
  assert.equal(body.text.format.type, "json_schema");
  assert.equal(body.previous_response_id, undefined);
  assert.equal(body.metadata, undefined);
});

test("adapter never retries sensitive provider failures and discards details", async () => {
  for (const [status, providerCode, expected] of [
    [401, "invalid_api_key", "ai_unavailable"],
    [429, "insufficient_quota", "ai_quota"],
    [429, "credit_balance_exhausted", "ai_quota"],
    [429, "organization_spend_limit_exceeded", "ai_quota"],
    [429, "project_spend_limit_exceeded", "ai_quota"],
    [429, "organization_usage_limit_exceeded", "ai_quota"],
    [429, "rate_limit_exceeded", "ai_rate_limited"],
    [503, "server_error", "ai_connection_failed"],
  ] as const) {
    let calls = 0;
    const provider = new OpenAiProvider({
      apiKey: "fixture-key",
      fetch: async () => {
        calls += 1;
        return Response.json(
          { error: { code: providerCode, message: "fixture-key private prompt" } },
          { status },
        );
      },
    });
    await code(provider.generate(request()), expected);
    assert.equal(calls, 1);
  }
  await code(
    new OpenAiProvider({
      apiKey: "fixture-key",
      fetch: async () => {
        throw new Error("fixture-key network details");
      },
    }).generate(request()),
    "ai_connection_failed",
  );
});

test("adapter rejects refusals, incomplete/malformed output, extra tools, wrong locale/model and leaked credentials", async () => {
  const cases: [Response, string][] = [
    [
      response("", { status: "incomplete", incomplete_details: { reason: "max_output_tokens" } }),
      "ai_incomplete",
    ],
    [
      response("", {
        output: [
          {
            type: "message",
            role: "assistant",
            status: "completed",
            content: [{ type: "refusal", refusal: "private reason" }],
          },
        ],
      }),
      "ai_refused",
    ],
    [response("not json"), "ai_invalid_output"],
    [response(jsonResult(), { model: "other" }), "ai_invalid_output"],
    [response(jsonResult(), { store: true }), "ai_invalid_output"],
    [
      response(JSON.stringify({ action: "step_help", locale: "fr", result: guidance })),
      "ai_invalid_output",
    ],
    [
      response(jsonResult(), { output: [{ type: "function_call", name: "fetch_secret" }] }),
      "ai_invalid_output",
    ],
    [response(jsonResult({ ...guidance, summary: "fixture-key" })), "ai_invalid_output"],
    [response("x".repeat(270_000)), "ai_invalid_output"],
  ];
  for (const [reply, expected] of cases)
    await code(
      new OpenAiProvider({ apiKey: "fixture-key", fetch: async () => reply }).generate(request()),
      expected,
    );
});

test("adapter cancels/timeouts with no retries, including an already cancelled request", async () => {
  let calls = 0;
  const fetchLater: typeof fetch = async () => {
    calls += 1;
    return new Promise((resolve) => setTimeout(() => resolve(response(jsonResult())), 50));
  };
  const timed = new OpenAiProvider({
    apiKey: "fixture-key",
    requestTimeoutMs: 10,
    fetch: fetchLater,
  });
  await code(timed.generate(request()), "ai_timeout");
  assert.equal(calls, 1);
  const controller = new AbortController();
  controller.abort();
  await code(timed.generate(request(controller.signal)), "ai_cancelled");
  assert.equal(calls, 1);
  const other = new AbortController();
  const pending = new OpenAiProvider({ apiKey: "fixture-key", fetch: fetchLater }).generate(
    request(other.signal),
  );
  other.abort();
  await code(pending, "ai_cancelled");
  assert.equal(calls, 2);
});

test("search retains only actual eligible source metadata, canonicalizes tracking and never returns raw prose", async () => {
  let body: Record<string, unknown> = {};
  const text = "Unverified free claims and injected instructions are discarded entirely.";
  const mdn = "https://developer.mozilla.org/fr/docs/Web/HTML?lesson=1";
  const output = [
    {
      type: "web_search_call",
      status: "completed",
      action: {
        type: "search",
        sources: [
          { type: "url", url: `${mdn}&utm_source=openai#intro` },
          { type: "url", url: "https://www.w3.org/TR/WCAG10/old.pdf" },
          { type: "url", url: "https://web.dev/archive/old" },
          { type: "url", url: "https://example.org/untrusted" },
        ],
      },
    },
    {
      type: "message",
      role: "assistant",
      status: "completed",
      content: [
        {
          type: "output_text",
          text,
          annotations: [
            {
              type: "url_citation",
              url: mdn,
              title: "HTML introduction",
              start_index: 0,
              end_index: 10,
            },
          ],
        },
      ],
    },
  ];
  const provider = new OpenAiProvider({
    apiKey: "fixture-key",
    fetch: async (_url, init) => {
      body = JSON.parse(String(init?.body));
      return response(text, { output });
    },
  });
  const sources = await provider.search(
    "Learn HTML",
    "fr",
    "2026-10-13T09:00:00.000Z",
    new AbortController().signal,
  );
  assert.equal(sources.length, 1);
  assert.equal(sources[0]?.url, mdn);
  assert.equal(sources[0]?.languageHint, "fr");
  assert.deepEqual(sources[0]?.evidence, ["listed", "cited"]);
  assert.equal(sources[0]?.title, "HTML introduction");
  assert.equal(JSON.stringify(sources).includes(text), false);
  assert.equal(body.max_tool_calls, 1);
  assert.equal(body.max_output_tokens, 1536);
  assert.deepEqual(body.include, ["web_search_call.action.sources"]);
  const tools = body.tools as { type: string; filters: { allowed_domains: string[] } }[];
  assert.equal(tools.length, 1);
  assert.equal(tools[0]?.type, "web_search");
  assert.deepEqual(tools[0]?.filters.allowed_domains, SEARCH_DOMAINS);
});

test("supplied sources remain unread and model plan IDs are restricted to the actual source set", () => {
  const sources = suppliedSources(
    ["https://developer.mozilla.org/en-US/docs/Web/HTML?utm_source=test#topic"],
    "2026-10-13T09:00:00.000Z",
  );
  assert.equal(sources[0]?.languageHint, "en");
  assert.deepEqual(sources[0]?.evidence, ["supplied"]);
  assert.equal(sources[0]?.title, null);
  const raw = {
    kind: "plan",
    goal: "Learn HTML",
    outcome: "Create a page",
    prerequisites: "",
    steps: [{ title: "Read one introduction", estimatedMinutes: 15, sourceIds: [sources[0]?.id] }],
  };
  assert.equal(aiPlanResult(raw, sources).sources.length, 1);
  assert.throws(
    () =>
      aiPlanResult(
        {
          ...raw,
          steps: [{ ...raw.steps[0], sourceIds: ["11111111-1111-4111-8111-111111111111"] }],
        },
        sources,
      ),
    /ai_invalid_output/u,
  );
});

test("adapter rejects oversized context before a provider call and search tool overrun", async () => {
  let calls = 0;
  const provider = new OpenAiProvider({
    apiKey: "fixture-key",
    fetch: async () => {
      calls += 1;
      return response("search", {
        output: [{ type: "web_search_call" }, { type: "web_search_call" }],
      });
    },
  });
  await code(
    provider.generate({ ...request(), context: { material: "x".repeat(16_385) } }),
    "invalid_input",
  );
  assert.equal(calls, 0);
  await code(
    provider.search("Learn HTML", "en", "2026-10-13T09:00:00.000Z", new AbortController().signal),
    "ai_invalid_output",
  );
  assert.equal(calls, 1);
  await code(new OpenAiProvider().generate(request()), "ai_unavailable");
});

test("one operation deadline spans search and generation without retries or source staging", async () => {
  let calls = 0;
  let staged = false;
  const assistance = new AiAssistance(
    {} as JourneyStore,
    {} as CircleStore,
    {
      stage: () => {
        staged = true;
        return [];
      },
    } as unknown as AiSourceStore,
    () => new Date("2026-10-13T09:00:00.000Z"),
    {
      apiKey: "fixture-key",
      requestTimeoutMs: 100,
      operationTimeoutMs: 45,
      fetch: async (_url, init) => {
        calls += 1;
        await new Promise<void>((resolve) => setTimeout(resolve, 30));
        const body = JSON.parse(String(init?.body));
        if (body.tools.length)
          return response("Resource", {
            output: [
              {
                type: "web_search_call",
                status: "completed",
                action: {
                  type: "search",
                  sources: [
                    { type: "url", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
                  ],
                },
              },
              {
                type: "message",
                role: "assistant",
                status: "completed",
                content: [{ type: "output_text", text: "Resource", annotations: [] }],
              },
            ],
          });
        return response(
          JSON.stringify({
            action: "plan_draft",
            locale: "en",
            result: { kind: "insufficient", reason: "No suitable evidence." },
          }),
        );
      },
    },
  );
  await code(
    assistance.run(
      "isolated-owner",
      { action: "plan_draft", locale: "en", goal: "HTML", links: [], search: true },
      new AbortController().signal,
      async () => true,
    ),
    "ai_timeout",
  );
  assert.equal(calls, 2);
  assert.equal(staged, false);
  assistance.close();
});
