import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import {
  aiAssistInput,
  aiCircleResult,
  aiGuidanceResult,
  aiInsufficientResult,
  aiPlanResult,
  eligibleSearchSource,
  learningSource,
  normalizedSourceUrl,
  sourceLanguageHint,
  sourceUrl,
} from "../../src/domain/ai-validation.js";
import { createPlanInput, DomainError, updatePlanInput } from "../../src/domain/validation.js";
import type { LearningSource } from "../../src/shared/contracts.js";

const source = (): LearningSource => ({
  id: randomUUID(),
  kind: "web_search",
  url: "https://developer.mozilla.org/fr/docs/Web/HTML",
  title: "HTML : langage de balisage",
  publisher: "developer.mozilla.org",
  languageHint: "fr",
  observedAt: "2026-10-13T09:00:00.000Z",
  evidence: ["listed", "cited"],
});
function code(action: () => unknown, expected: string): void {
  assert.throws(
    action,
    (error: unknown) => error instanceof DomainError && error.code === expected,
  );
}

test("strict six-action requests permit explicit reflection selection and no client provider/context", () => {
  const planId = randomUUID();
  const stepId = randomUUID();
  const base = { planId, revision: 1, locale: "fr" };
  const requests = [
    { action: "plan_draft", locale: "en", goal: " Learn HTML ", links: [], search: true },
    { action: "step_help", ...base, stepId, minutes: 5 },
    { action: "study_reflection", ...base, stepId },
    { action: "comeback_help", ...base, minutes: 5 },
    { action: "progress_recap", ...base },
    {
      action: "circle_draft",
      locale: "en",
      circleId: randomUUID(),
      kind: "check_in",
      draft: "I read a page",
    },
  ];
  for (const request of requests) assert.equal(aiAssistInput(request).action, request.action);
  const unselected = aiAssistInput(requests[2]);
  assert.equal("reflection" in unselected, false);
  const selected = aiAssistInput({ ...requests[2], reflection: "My selected note" });
  assert.ok(selected.action === "study_reflection");
  assert.equal(selected.reflection, "My selected note");
  for (const extra of [
    { apiKey: "fake" },
    { model: "other" },
    { provider: "other" },
    { owner: "other" },
    { search: true },
    { peers: ["private"] },
  ])
    code(() => aiAssistInput({ ...requests[5], ...extra }), "invalid_input");
  code(() => aiAssistInput({ ...requests[1], minutes: 0 }), "invalid_input");
  code(() => aiAssistInput({ ...requests[0], locale: "de" }), "invalid_input");
  code(() => aiAssistInput({ ...requests[0], search: "yes" }), "invalid_input");
});

test("input limits reject oversized UTF8 contexts before provider calls", () => {
  const request = { action: "plan_draft", locale: "en", goal: "Read", links: [], search: false };
  code(() => aiAssistInput({ ...request, material: "a".repeat(2001) }), "invalid_input");
  code(
    () =>
      aiAssistInput({ ...request, links: Array.from({ length: 11 }, () => "https://example.org") }),
    "invalid_input",
  );
  const unicode = Array.from(
    { length: 10 },
    (_, index) => `https://example.org/${index}?q=${"é".repeat(1000)}`,
  );
  code(() => aiAssistInput({ ...request, links: unicode }), "invalid_input");
  code(
    () =>
      aiAssistInput({
        action: "circle_draft",
        locale: "en",
        circleId: randomUUID(),
        kind: "commitment",
        draft: "a".repeat(281),
      }),
    "invalid_input",
  );
});

test("source URLs reject unsafe local destinations without changing manual reference policy", () => {
  for (const url of [
    "http://localhost:4317",
    "http://127.1",
    "http://2130706433",
    "http://10.0.0.1",
    "http://192.168.1.2",
    "http://172.31.0.1",
    "http://169.254.169.254",
    "http://100.64.0.1",
    "http://[::1]",
    "https://notes.local",
    "https://x.internal",
    "https://u:p@example.org",
    "javascript:alert(1)",
  ])
    code(() => sourceUrl(url), "invalid_input");
  assert.equal(
    sourceUrl("https://example.org/notes?lang=fr#one"),
    "https://example.org/notes?lang=fr#one",
  );
  assert.equal(
    normalizedSourceUrl("https://EXAMPLE.org:443/notes?lang=fr&utm_source=x#one"),
    "https://example.org/notes?lang=fr",
  );
  assert.notEqual(
    normalizedSourceUrl("https://example.org/?lang=fr"),
    normalizedSourceUrl("https://example.org/?lang=en"),
  );
});

test("source metadata is exact, byte-bounded and evidence/language honest", () => {
  const original = source();
  assert.deepEqual(learningSource(original), original);
  assert.equal(sourceLanguageHint("https://developer.mozilla.org/en-US/docs/Web/HTML"), "en");
  assert.equal(sourceLanguageHint("https://w3.org/fr/tutorial"), "unknown");
  for (const change of [
    { owner: "other" },
    { publisher: "trusted school" },
    { languageHint: "en" },
    { evidence: ["supplied"] },
    { evidence: ["cited", "cited"] },
    { observedAt: "2026-10-13" },
    { title: "<script>alert(1)</script>" },
  ])
    code(() => learningSource({ ...original, ...change }), "invalid_input");
  code(
    () =>
      learningSource({
        ...original,
        url: `https://example.org/?q=${"😀".repeat(1000)}`,
        publisher: "example.org",
        languageHint: "unknown",
        title: "x",
      }),
    "invalid_input",
  );
  const supplied = { ...original, kind: "user_supplied", evidence: ["supplied"] };
  assert.equal(learningSource(supplied).kind, "user_supplied");
  code(() => learningSource({ ...supplied, evidence: ["supplied", "opened"] }), "invalid_input");
});

test("search candidate filter excludes observed outdated and download resources", () => {
  assert.equal(
    eligibleSearchSource(
      "https://developer.mozilla.org/en-US/docs/Learn_web_development",
      "Learning",
    ),
    true,
  );
  for (const [url, title] of [
    ["https://w3.org/TR/WCAG10/wai-pageauth.pdf", "Web Content Accessibility Guidelines"],
    ["https://w3.org/TR/WCAG10/", "Old guidelines"],
    ["https://example.org/archives/lesson", "Lesson"],
    ["https://example.org/lesson?download=1", "Lesson"],
    ["https://example.org/current", "Working draft"],
  ])
    assert.equal(eligibleSearchSource(url ?? "", title ?? ""), false);
});

test("strict plan outputs cannot forge sources or detach generated actions", () => {
  const known = source();
  const result = {
    kind: "plan",
    goal: "Read HTML",
    outcome: "Build a page",
    prerequisites: "",
    steps: [{ title: "Read elements", estimatedMinutes: 10, sourceIds: [known.id] }],
  };
  assert.deepEqual(aiPlanResult(result, [known]).sources, [known]);
  for (const change of [
    { sources: [{ ...known, evidence: ["opened"] }] },
    { steps: [{ ...result.steps[0], sourceIds: [] }] },
    { steps: [{ ...result.steps[0], sourceIds: [randomUUID()] }] },
    { steps: [{ ...result.steps[0], title: "<img src=x onerror=alert(1)>" }] },
    { steps: Array.from({ length: 11 }, () => result.steps[0]) },
  ])
    code(() => aiPlanResult({ ...result, ...change }, [known]), "ai_invalid_output");
});

test("bounded guidance/circle/insufficient prose remains plain and action-specific", () => {
  const guidance = {
    kind: "guidance",
    title: "Try one thing",
    summary: "Read an example",
    nextAction: "Open your notes",
    microActions: ["Read one paragraph"],
  };
  assert.deepEqual(aiGuidanceResult(guidance), guidance);
  code(
    () => aiGuidanceResult({ ...guidance, microActions: Array.from({ length: 6 }, () => "x") }),
    "ai_invalid_output",
  );
  code(() => aiGuidanceResult({ ...guidance, summary: "x".repeat(1999) }), "ai_invalid_output");
  code(() => aiGuidanceResult({ ...guidance, completed: true }), "ai_invalid_output");
  assert.deepEqual(aiCircleResult({ kind: "circle", text: "I will study one page." }), {
    kind: "circle",
    text: "I will study one page.",
  });
  code(() => aiCircleResult({ kind: "circle", text: "x".repeat(281) }), "ai_invalid_output");
  code(() => aiCircleResult({ kind: "circle", text: "<script>x</script>" }), "ai_invalid_output");
  assert.equal(
    aiInsufficientResult({ kind: "insufficient", reason: "Please supply a relevant source." }).kind,
    "insufficient",
  );
});

test("legacy plan validator omissions remain absent and client metadata is rejected", () => {
  const input = {
    requestId: randomUUID(),
    goal: "Read",
    templateId: null,
    availabilityDates: ["2026-10-13"],
    targetDate: null,
    references: [],
    steps: [{ title: "Read a page", scheduledDate: "2026-10-13", estimatedMinutes: 5 }],
  };
  const parsed = createPlanInput(input);
  assert.equal("sourceIds" in parsed, false);
  assert.equal("sourceIds" in (parsed.steps[0] ?? {}), false);
  code(() => createPlanInput({ ...input, sources: [source()] }), "invalid_input");
  const id = randomUUID();
  assert.deepEqual(
    createPlanInput({ ...input, sourceIds: [id], steps: [{ ...input.steps[0], sourceIds: [id] }] })
      .sourceIds,
    [id],
  );
  code(() => createPlanInput({ ...input, sourceIds: [id, id] }), "invalid_input");
  const { templateId: _template, ...update } = input;
  assert.equal("sourceIds" in updatePlanInput({ ...update, revision: 1 }), false);
});
