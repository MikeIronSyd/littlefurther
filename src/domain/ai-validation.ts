import {
  AI_LIMITS,
  type AiAssistInput,
  type AiCircleResult,
  type AiGuidanceResult,
  type AiInsufficientResult,
  type AiPlanResult,
} from "../shared/ai-contracts.js";
import {
  CIRCLE_LIMITS,
  LIMITS,
  type LearningSource,
  type Locale,
  type SourceEvidence,
} from "../shared/contracts.js";
import { DomainError, identifier, integer, record, safeUrl, text } from "./validation.js";

function invalid(field: string): never {
  throw new DomainError("invalid_input", 400, field);
}
function exact(value: Record<string, unknown>, allowed: readonly string[]): void {
  for (const key of Object.keys(value)) if (!allowed.includes(key)) invalid(key);
}
export function sourceIds(value: unknown, field = "sourceIds"): string[] {
  if (!Array.isArray(value) || value.length > LIMITS.references) invalid(field);
  const ids = value.map((id) => identifier(id, field));
  if (new Set(ids).size !== ids.length) invalid(field);
  return ids;
}
export function sourceUrl(value: unknown): string {
  const raw = safeUrl(value);
  const url = new URL(raw);
  const host = url.hostname.toLowerCase().replace(/\.$/u, "");
  if (
    !host.includes(".") ||
    /(?:^|\.)(?:localhost|local|internal|test|invalid)$/u.test(host) ||
    host === "metadata.google.internal" ||
    host.startsWith("[") ||
    /^(?:0|10|127|169\.254|192\.168|172\.(?:1[6-9]|2\d|3[01])|100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7]))(?:\.|$)/u.test(
      host,
    ) ||
    /^(?:22[4-9]|23\d|24\d|25[0-5])\./u.test(host)
  )
    invalid("references");
  return raw;
}
export function normalizedSourceUrl(value: string): string {
  const url = new URL(value);
  url.hash = "";
  for (const key of [...url.searchParams.keys()])
    if (/^utm_/iu.test(key)) url.searchParams.delete(key);
  return url.href;
}
export function sourceLanguageHint(url: string): LearningSource["languageHint"] {
  const parsed = new URL(url);
  if (parsed.hostname.toLowerCase() === "developer.mozilla.org") {
    if (/^\/en-US(?:\/|$)/iu.test(parsed.pathname)) return "en";
    if (/^\/fr(?:\/|$)/iu.test(parsed.pathname)) return "fr";
  }
  return "unknown";
}
export function eligibleSearchSource(url: string, title: string | null): boolean {
  try {
    sourceUrl(url);
  } catch {
    return false;
  }
  const parsed = new URL(url);
  return !(
    /\.(?:pdf|zip|docx?|pptx?|xlsx?|exe|dmg)(?:$|\/)/iu.test(parsed.pathname) ||
    /(?:^|\/)(?:archive|archives|archived|draft|drafts|obsolete|deprecated|WCAG10)(?:\/|$|\.)/iu.test(
      parsed.pathname,
    ) ||
    /(?:obsolete|deprecated|archived|working draft|WCAG\s*1\.0)/iu.test(title ?? "") ||
    parsed.searchParams.has("download")
  );
}
export function learningSource(value: unknown): LearningSource {
  const item = record(value);
  exact(item, [
    "id",
    "kind",
    "url",
    "title",
    "publisher",
    "languageHint",
    "observedAt",
    "evidence",
  ]);
  if (item.kind !== "user_supplied" && item.kind !== "web_search") invalid("kind");
  const url = sourceUrl(item.url);
  const publisher = text(item.publisher, "publisher", 255);
  if (publisher !== new URL(url).hostname.toLowerCase()) invalid("publisher");
  if (item.languageHint !== "en" && item.languageHint !== "fr" && item.languageHint !== "unknown")
    invalid("languageHint");
  if (item.languageHint !== sourceLanguageHint(url)) invalid("languageHint");
  if (typeof item.observedAt !== "string") invalid("observedAt");
  const observed = new Date(item.observedAt);
  if (!Number.isFinite(observed.getTime()) || observed.toISOString() !== item.observedAt)
    invalid("observedAt");
  const evidence = item.evidence;
  if (!Array.isArray(evidence) || evidence.length === 0 || evidence.length > 3) invalid("evidence");
  const permitted = item.kind === "user_supplied" ? ["supplied"] : ["listed", "cited", "opened"];
  if (
    evidence.some((entry) => typeof entry !== "string" || !permitted.includes(entry)) ||
    new Set(evidence).size !== evidence.length ||
    (item.kind === "user_supplied" && evidence.length !== 1)
  )
    invalid("evidence");
  const result: LearningSource = {
    id: identifier(item.id, "sourceIds"),
    kind: item.kind,
    url,
    title: item.title === null ? null : plainText(item.title, "title", LIMITS.stepTitle),
    publisher,
    languageHint: item.languageHint,
    observedAt: item.observedAt,
    evidence: evidence as SourceEvidence[],
  };
  if (new TextEncoder().encode(JSON.stringify(result)).length > AI_LIMITS.sourceBytes)
    invalid("sources");
  return result;
}
export function plainText(value: unknown, field: string, max: number, allowEmpty = false): string {
  const result = text(value, field, max, allowEmpty);
  if (/<\/?[a-z!][^>]*>/iu.test(result)) invalid(field);
  return result;
}
export function aiAssistInput(value: unknown): AiAssistInput {
  let encoded: string;
  try {
    encoded = JSON.stringify(value);
  } catch {
    invalid("body");
  }
  if (encoded === undefined || new TextEncoder().encode(encoded).length > AI_LIMITS.contextBytes)
    invalid("body");
  const input = record(value);
  if (input.locale !== "en" && input.locale !== "fr") invalid("locale");
  const locale = input.locale;
  if (input.action === "plan_draft") {
    exact(input, ["action", "goal", "startingPoint", "material", "links", "search", "locale"]);
    if (!Array.isArray(input.links) || input.links.length > LIMITS.references) invalid("links");
    if (typeof input.search !== "boolean") invalid("search");
    return {
      action: "plan_draft",
      locale,
      goal: text(input.goal, "goal", LIMITS.goal),
      ...(input.startingPoint === undefined
        ? {}
        : { startingPoint: text(input.startingPoint, "startingPoint", AI_LIMITS.notes, true) }),
      ...(input.material === undefined
        ? {}
        : { material: text(input.material, "material", AI_LIMITS.notes, true) }),
      links: input.links.map(sourceUrl),
      search: input.search,
    };
  }
  if (input.action === "circle_draft") {
    exact(input, ["action", "circleId", "kind", "draft", "locale"]);
    if (input.kind !== "commitment" && input.kind !== "check_in") invalid("kind");
    return {
      action: "circle_draft",
      locale,
      circleId: identifier(input.circleId, "circleId"),
      kind: input.kind,
      draft: text(input.draft, "draft", CIRCLE_LIMITS.text),
    };
  }
  const base: { locale: Locale; planId: string; revision: number } = {
    locale,
    planId: identifier(input.planId, "planId"),
    revision: integer(input.revision, "revision", 1, Number.MAX_SAFE_INTEGER),
  };
  if (input.action === "step_help") {
    exact(input, ["action", "planId", "revision", "stepId", "minutes", "locale"]);
    return {
      ...base,
      action: "step_help",
      stepId: identifier(input.stepId, "stepId"),
      minutes: integer(input.minutes, "minutes", 1, LIMITS.minutes),
    };
  }
  if (input.action === "study_reflection") {
    exact(input, ["action", "planId", "revision", "stepId", "reflection", "locale"]);
    return {
      ...base,
      action: "study_reflection",
      stepId: identifier(input.stepId, "stepId"),
      ...(input.reflection === undefined
        ? {}
        : { reflection: text(input.reflection, "reflection", LIMITS.reflection, true) }),
    };
  }
  if (input.action === "comeback_help") {
    exact(input, ["action", "planId", "revision", "minutes", "locale"]);
    return {
      ...base,
      action: "comeback_help",
      minutes: integer(input.minutes, "minutes", 1, LIMITS.minutes),
    };
  }
  if (input.action === "progress_recap") {
    exact(input, ["action", "planId", "revision", "locale"]);
    return { ...base, action: "progress_recap" };
  }
  invalid("action");
}
function output<T>(action: () => T): T {
  try {
    return action();
  } catch {
    throw new DomainError("ai_invalid_output", 502);
  }
}
export function aiPlanResult(value: unknown, sources: readonly LearningSource[]): AiPlanResult {
  return output(() => {
    sourceIds(sources.map((source) => source.id));
    const result = record(value);
    exact(result, ["kind", "goal", "outcome", "prerequisites", "steps"]);
    if (result.kind !== "plan") invalid("kind");
    if (
      !Array.isArray(result.steps) ||
      result.steps.length < 1 ||
      result.steps.length > AI_LIMITS.steps
    )
      invalid("steps");
    const permitted = new Set(sources.map((source) => source.id));
    const steps = result.steps.map((value) => {
      const step = record(value);
      exact(step, ["title", "estimatedMinutes", "sourceIds"]);
      const ids = sourceIds(step.sourceIds);
      if (!ids.length || ids.some((id) => !permitted.has(id))) invalid("sourceIds");
      return {
        title: plainText(step.title, "title", LIMITS.stepTitle),
        estimatedMinutes: integer(step.estimatedMinutes, "estimatedMinutes", 1, LIMITS.minutes),
        sourceIds: ids,
      };
    });
    return {
      kind: "plan",
      goal: plainText(result.goal, "goal", LIMITS.goal),
      outcome: plainText(result.outcome, "outcome", AI_LIMITS.notes),
      prerequisites: plainText(result.prerequisites, "prerequisites", AI_LIMITS.notes, true),
      steps,
      sources: sources.map(learningSource),
    };
  });
}
export function aiGuidanceResult(value: unknown): AiGuidanceResult {
  return output(() => {
    const result = record(value);
    exact(result, ["kind", "title", "summary", "nextAction", "microActions"]);
    if (result.kind !== "guidance") invalid("kind");
    if (!Array.isArray(result.microActions) || result.microActions.length > AI_LIMITS.microActions)
      invalid("microActions");
    const title = plainText(result.title, "title", LIMITS.stepTitle);
    const summary = plainText(result.summary, "summary", AI_LIMITS.prose);
    const nextAction = plainText(result.nextAction, "nextAction", AI_LIMITS.prose);
    const microActions = result.microActions.map((item) =>
      plainText(item, "microActions", AI_LIMITS.prose),
    );
    if ([title, summary, nextAction, ...microActions].join("").length > AI_LIMITS.prose)
      invalid("summary");
    return { kind: "guidance", title, summary, nextAction, microActions };
  });
}
export function aiCircleResult(value: unknown): AiCircleResult {
  return output(() => {
    const result = record(value);
    exact(result, ["kind", "text"]);
    if (result.kind !== "circle") invalid("kind");
    return { kind: "circle", text: plainText(result.text, "text", CIRCLE_LIMITS.text) };
  });
}
export function aiInsufficientResult(value: unknown): AiInsufficientResult {
  return output(() => {
    const result = record(value);
    exact(result, ["kind", "reason"]);
    if (result.kind !== "insufficient") invalid("kind");
    return { kind: "insufficient", reason: plainText(result.reason, "reason", AI_LIMITS.prose) };
  });
}
