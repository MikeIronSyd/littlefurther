import {
  LIMITS,
  type ActivityInput,
  type ComebackConfirmInput,
  type ComebackPreviewInput,
  type CompletionInput,
  type CreatePlanInput,
  type PlanFields,
  type Profile,
  type StepInput,
  type UpdatePlanInput,
} from "../shared/contracts.js";

export class DomainError extends Error {
  constructor(
    public readonly code: string,
    public readonly status = 400,
    public readonly field?: string,
  ) {
    super(code);
    this.name = "DomainError";
  }
}
function bad(field: string): never {
  throw new DomainError("invalid_input", 400, field);
}
export function record(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) bad("body");
  return value as Record<string, unknown>;
}
function keys(value: Record<string, unknown>, allowed: string[]): void {
  for (const key of Object.keys(value)) if (!allowed.includes(key)) bad(key);
}
export function text(value: unknown, field: string, max: number, allowEmpty = false): string {
  if (typeof value !== "string") bad(field);
  const trimmed = value.trim();
  if (
    (!allowEmpty && trimmed.length === 0) ||
    trimmed.length > max ||
    [...trimmed].some((character) => {
      const code = character.charCodeAt(0);
      return code < 32 && code !== 9 && code !== 10 && code !== 13;
    })
  )
    bad(field);
  return trimmed;
}
export function integer(value: unknown, field: string, min: number, max: number): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < min || value > max)
    bad(field);
  return value;
}
export function identifier(value: unknown, field = "id"): string {
  if (
    typeof value !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(value)
  )
    bad(field);
  return value.toLowerCase();
}
export function calendarDate(value: unknown, field = "date"): string {
  if (typeof value !== "string" || !/^20\d\d-\d\d-\d\d$|^2100-\d\d-\d\d$/u.test(value)) bad(field);
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) bad(field);
  return value;
}
export function timezone(value: unknown): string {
  const zone = text(value, "timezone", 100);
  if (/^[+-]|\s/u.test(zone)) bad("timezone");
  try {
    new Intl.DateTimeFormat("en", { timeZone: zone }).format();
  } catch {
    bad("timezone");
  }
  return zone;
}
export function safeUrl(value: unknown): string {
  const url = text(value, "references", LIMITS.url);
  try {
    const parsed = new URL(url);
    if (
      !/^https?:\/\//iu.test(url) ||
      !["http:", "https:"].includes(parsed.protocol) ||
      parsed.username ||
      parsed.password
    )
      bad("references");
  } catch {
    bad("references");
  }
  return url;
}
export function profileInput(value: unknown): Profile {
  const input = record(value);
  keys(input, ["locale", "timezone"]);
  if (input.locale !== "en" && input.locale !== "fr") bad("locale");
  return { locale: input.locale, timezone: timezone(input.timezone) };
}
function fields(input: Record<string, unknown>, creation: boolean): PlanFields {
  const dates = input.availabilityDates;
  if (!Array.isArray(dates) || dates.length < 1 || dates.length > LIMITS.availability)
    bad("availabilityDates");
  const availabilityDates = dates.map((value) => calendarDate(value, "availabilityDates"));
  if (new Set(availabilityDates).size !== availabilityDates.length) bad("availabilityDates");
  const refs = input.references;
  if (!Array.isArray(refs) || refs.length > LIMITS.references) bad("references");
  const items = input.steps;
  if (!Array.isArray(items) || items.length > LIMITS.steps || (creation && items.length === 0))
    bad("steps");
  const steps: StepInput[] = items.map((value) => {
    const step = record(value);
    keys(step, ["id", "title", "scheduledDate", "estimatedMinutes", "sourceIds"]);
    if (creation && step.id !== undefined) bad("stepId");
    return {
      ...(step.id === undefined ? {} : { id: identifier(step.id, "stepId") }),
      title: text(step.title, "stepTitle", LIMITS.stepTitle),
      scheduledDate: calendarDate(step.scheduledDate, "scheduledDate"),
      estimatedMinutes: integer(step.estimatedMinutes, "estimatedMinutes", 1, LIMITS.minutes),
      ...(step.sourceIds === undefined ? {} : { sourceIds: sourceIdentifiers(step.sourceIds) }),
    };
  });
  const ids = steps.flatMap((step) => (step.id ? [step.id] : []));
  if (new Set(ids).size !== ids.length) bad("stepId");
  return {
    goal: text(input.goal, "goal", LIMITS.goal),
    availabilityDates: availabilityDates.sort(),
    targetDate: input.targetDate === null ? null : calendarDate(input.targetDate, "targetDate"),
    references: refs.map(safeUrl),
    steps,
    ...(input.sourceIds === undefined ? {} : { sourceIds: sourceIdentifiers(input.sourceIds) }),
  };
}
function sourceIdentifiers(value: unknown): string[] {
  if (!Array.isArray(value) || value.length > LIMITS.references) bad("sourceIds");
  const ids = value.map((id) => identifier(id, "sourceIds"));
  if (new Set(ids).size !== ids.length) bad("sourceIds");
  return ids;
}
const planKeys = [
  "requestId",
  "goal",
  "availabilityDates",
  "targetDate",
  "references",
  "steps",
  "sourceIds",
];
export function createPlanInput(value: unknown): CreatePlanInput {
  const input = record(value);
  keys(input, [...planKeys, "templateId"]);
  if (input.templateId !== null && input.templateId !== "html-first-page@1")
    throw new DomainError("unsupported_template", 400, "templateId");
  return {
    ...fields(input, true),
    requestId: identifier(input.requestId, "requestId"),
    templateId: input.templateId,
  };
}
export function updatePlanInput(value: unknown): UpdatePlanInput {
  const input = record(value);
  keys(input, [...planKeys, "revision"]);
  return {
    ...fields(input, false),
    requestId: identifier(input.requestId, "requestId"),
    revision: integer(input.revision, "revision", 1, Number.MAX_SAFE_INTEGER),
  };
}
export function activityInput(value: unknown): ActivityInput {
  const input = record(value);
  keys(input, ["requestId", "stepId", "minutes", "reflection"]);
  return {
    requestId: identifier(input.requestId, "requestId"),
    stepId: identifier(input.stepId, "stepId"),
    minutes: integer(input.minutes, "minutes", 1, LIMITS.minutes),
    ...(input.reflection === undefined
      ? {}
      : { reflection: text(input.reflection, "reflection", LIMITS.reflection, true) }),
  };
}
export function completionInput(value: unknown): CompletionInput {
  const input = record(value);
  keys(input, ["requestId", "stepId", "revision"]);
  return {
    requestId: identifier(input.requestId, "requestId"),
    stepId: identifier(input.stepId, "stepId"),
    revision: integer(input.revision, "revision", 1, Number.MAX_SAFE_INTEGER),
  };
}
export function comebackPreviewInput(value: unknown): ComebackPreviewInput {
  const input = record(value);
  keys(input, ["revision", "restartDate"]);
  return {
    revision: integer(input.revision, "revision", 1, Number.MAX_SAFE_INTEGER),
    restartDate: calendarDate(input.restartDate, "restartDate"),
  };
}
export function comebackConfirmInput(value: unknown): ComebackConfirmInput {
  const input = record(value);
  keys(input, ["requestId", "revision", "restartDate"]);
  return {
    requestId: identifier(input.requestId, "requestId"),
    revision: integer(input.revision, "revision", 1, Number.MAX_SAFE_INTEGER),
    restartDate: calendarDate(input.restartDate, "restartDate"),
  };
}
