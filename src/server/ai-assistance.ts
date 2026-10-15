import {
  aiCircleResult,
  aiGuidanceResult,
  aiInsufficientResult,
  aiPlanResult,
} from "../domain/ai-validation.js";
import { DomainError } from "../domain/validation.js";
import type { AiAssistInput, AiAssistResponse, AiStatus } from "../shared/ai-contracts.js";
import type { LearningSource, PlanDetail } from "../shared/contracts.js";
import {
  AI_MODEL,
  OpenAiProvider,
  suppliedSources,
  type AiProviderOptions,
} from "./ai-provider.js";
import type { JourneyStore } from "./store.js";
import type { CircleStore } from "./circles.js";
import type { AiSourceStore } from "./ai-sources.js";

const string = { type: "string" };
function cancelled(signal: AbortSignal): never {
  const timed = signal.reason instanceof DOMException && signal.reason.name === "TimeoutError";
  throw new DomainError(timed ? "ai_timeout" : "ai_cancelled", timed ? 504 : 499);
}
function variant(properties: Record<string, unknown>): Record<string, unknown> {
  return {
    type: "object",
    additionalProperties: false,
    properties,
    required: Object.keys(properties),
  };
}
export function resultSchema(
  action: AiAssistInput["action"],
  sources: readonly LearningSource[],
  locale: "en" | "fr",
): Record<string, unknown> {
  const insufficient = variant({
    kind: { type: "string", enum: ["insufficient"] },
    reason: string,
  });
  let result: Record<string, unknown>;
  if (action === "plan_draft") {
    result = variant({
      kind: { type: "string", enum: ["plan"] },
      goal: string,
      outcome: string,
      prerequisites: string,
      steps: {
        type: "array",
        items: variant({
          title: string,
          estimatedMinutes: { type: "integer" },
          sourceIds: {
            type: "array",
            items: { type: "string", enum: sources.map((source) => source.id) },
          },
        }),
      },
    });
  } else if (action === "circle_draft")
    result = variant({ kind: { type: "string", enum: ["circle"] }, text: string });
  else
    result = variant({
      kind: { type: "string", enum: ["guidance"] },
      title: string,
      summary: string,
      nextAction: string,
      microActions: { type: "array", items: string },
    });
  return variant({
    action: { type: "string", enum: [action] },
    locale: { type: "string", enum: [locale] },
    result: { anyOf: [result, insufficient] },
  });
}
export interface AiAssistanceOptions extends AiProviderOptions {
  operationTimeoutMs?: number;
}

export class AiAssistance {
  private readonly provider: OpenAiProvider;
  private readonly active = new Map<string, AbortController>();
  constructor(
    private readonly store: JourneyStore,
    private readonly circles: CircleStore,
    private readonly sourceStore: AiSourceStore,
    private readonly clock: () => Date,
    private readonly options: AiAssistanceOptions = {},
  ) {
    this.provider = new OpenAiProvider(options);
  }

  status(): AiStatus {
    return {
      available: this.provider.configured,
      reason: this.provider.configured ? null : "not_configured",
      model: AI_MODEL,
    };
  }
  close(): void {
    for (const controller of this.active.values()) controller.abort();
  }

  private saved(
    owner: string,
    input: Exclude<AiAssistInput, { action: "plan_draft" | "circle_draft" }>,
  ): PlanDetail {
    const detail = this.store.detail(owner, input.planId);
    if (detail.plan.archivedAt) throw new DomainError("plan_archived", 409);
    if (detail.plan.revision !== input.revision) throw new DomainError("stale_revision", 409);
    return detail;
  }
  private context(owner: string, input: AiAssistInput): unknown {
    if (input.action === "plan_draft")
      return {
        goal: input.goal,
        startingPoint: input.startingPoint ?? "",
        material: input.material ?? "",
      };
    if (input.action === "circle_draft") {
      this.circles.detail(owner, input.circleId);
      return { draft: input.draft, kind: input.kind, locale: input.locale };
    }
    const detail = this.saved(owner, input);
    const { plan, progress } = detail;
    if (input.action === "step_help" || input.action === "study_reflection") {
      const step = plan.steps.find((candidate) => candidate.id === input.stepId);
      if (!step) throw new DomainError("invalid_step", 400, "stepId");
      if (step.completedAt) throw new DomainError("already_complete", 409);
      const resources = (plan.sources ?? [])
        .filter((source) => step.sourceIds?.includes(source.id))
        .map(({ id: _id, ...source }) => source);
      return {
        goal: plan.goal,
        step: { title: step.title, estimatedMinutes: step.estimatedMinutes },
        resources,
        references: plan.references,
        ...(input.action === "step_help"
          ? { availableMinutes: input.minutes }
          : input.reflection === undefined
            ? {}
            : { selectedReflection: input.reflection }),
      };
    }
    if (input.action === "comeback_help") {
      const unfinished = plan.steps.filter((step) => !step.completedAt);
      if (!unfinished.length) throw new DomainError("no_unfinished_work", 409);
      return {
        goal: plan.goal,
        availableMinutes: input.minutes,
        unfinished: unfinished.slice(0, 5).map((step) => ({
          title: step.title,
          scheduledDate: step.scheduledDate,
          estimatedMinutes: step.estimatedMinutes,
        })),
        totalUnfinished: unfinished.length,
        targetDate: plan.targetDate,
        conflictCount: detail.conflicts.length,
        completedSteps: progress.completed,
      };
    }
    return {
      goal: plan.goal,
      period: { start: progress.rangeStart, end: progress.rangeEnd, timezone: progress.timezone },
      recorded: {
        completed: progress.completed,
        total: progress.total,
        cumulativeCompletions: progress.cumulativeCompletions,
        activityCount: progress.activityCount,
        studiedMinutes: progress.studiedMinutes,
        studyDayCount: progress.studyDayCount,
      },
      recentActivity: detail.activities.slice(0, 10).map((item, index) => ({
        evidenceId: `activity_${index + 1}`,
        stepTitle: item.stepTitle,
        minutes: item.minutes,
        date: item.createdAt,
      })),
      scopeHistory: detail.scopeEvents.slice(0, 10).map((item, index) => ({
        evidenceId: `scope_${index + 1}`,
        previousCount: item.previousCount,
        currentCount: item.currentCount,
        date: item.createdAt,
      })),
      finished: progress.total > 0 && progress.completed === progress.total,
      empty: progress.total === 0,
    };
  }

  async run(
    owner: string,
    input: AiAssistInput,
    callerSignal: AbortSignal,
    sessionValid: () => Promise<boolean>,
  ): Promise<AiAssistResponse> {
    if (callerSignal.aborted) cancelled(callerSignal);
    if (!this.provider.configured) throw new DomainError("ai_unavailable", 503);
    if (this.active.has(owner) || this.active.size >= 2) throw new DomainError("ai_busy", 429);
    const context = this.context(owner, input);
    const fingerprint = JSON.stringify(context);
    if (Buffer.byteLength(fingerprint, "utf8") > 16_384)
      throw new DomainError("invalid_input", 400, "body");
    const member =
      input.action === "circle_draft"
        ? this.circles.detail(owner, input.circleId).members.find((item) => item.isSelf)?.id
        : null;
    const controller = new AbortController();
    const signal = AbortSignal.any([
      callerSignal,
      controller.signal,
      AbortSignal.timeout(this.options.operationTimeoutMs ?? 90_000),
    ]);
    this.active.set(owner, controller);
    const recheck = async (): Promise<void> => {
      if (signal.aborted) cancelled(signal);
      if (!(await sessionValid())) throw new DomainError("unauthenticated", 401);
      if (signal.aborted) cancelled(signal);
      if (JSON.stringify(this.context(owner, input)) !== fingerprint)
        throw new DomainError("stale_revision", 409);
      if (
        input.action === "circle_draft" &&
        this.circles.detail(owner, input.circleId).members.find((item) => item.isSelf)?.id !==
          member
      )
        throw new DomainError("not_found", 404);
    };
    try {
      let sources: LearningSource[] = [];
      if (input.action === "plan_draft") {
        sources = suppliedSources(input.links, this.clock().toISOString());
        if (Buffer.byteLength(JSON.stringify({ ...(context as object), sources }), "utf8") > 16_384)
          throw new DomainError("invalid_input", 400, "body");
        if (input.search) {
          const found = await this.provider.search(
            input.goal,
            input.locale,
            this.clock().toISOString(),
            signal,
          );
          await recheck();
          const existing = new Map(sources.map((source) => [source.url, source]));
          for (const source of found) {
            // Actual search evidence replaces a supplied-only snapshot for the same normalized URL.
            existing.set(source.url, source);
          }
          sources = [...existing.values()].slice(0, 10);
          while (
            sources.length &&
            Buffer.byteLength(JSON.stringify({ ...(context as object), sources }), "utf8") > 16_384
          )
            sources.pop();
        }
        if (!sources.length)
          return {
            kind: "insufficient",
            reason:
              input.locale === "fr"
                ? "Ajoutez un lien de référence ou recherchez des ressources adaptées. Vous pouvez continuer avec le plan manuel."
                : "Add a source link or search for suitable resources. You can continue with the manual plan.",
          };
      }
      const outbound =
        input.action === "plan_draft" ? { ...(context as object), sources } : context;
      if (Buffer.byteLength(JSON.stringify(outbound), "utf8") > 16_384)
        throw new DomainError("invalid_input", 400, "body");
      const raw = await this.provider.generate({
        action: input.action,
        locale: input.locale,
        context: outbound,
        schema: resultSchema(input.action, sources, input.locale),
        signal,
      });
      await recheck();
      if (raw !== null && typeof raw === "object" && "kind" in raw && raw.kind === "insufficient")
        return aiInsufficientResult(raw);
      if (input.action === "plan_draft") {
        const result = aiPlanResult(raw, sources);
        const selected = new Set(result.steps.flatMap((step) => step.sourceIds));
        result.sources = this.sourceStore.stage(
          owner,
          sources.filter((source) => selected.has(source.id)),
        );
        return result;
      }
      if (input.action === "circle_draft") return aiCircleResult(raw);
      return aiGuidanceResult(raw);
    } finally {
      this.active.delete(owner);
    }
  }
}
