import type { CircleItemKind, LearningSource, Locale } from "./contracts.js";

interface SavedPlanRequest {
  planId: string;
  revision: number;
  locale: Locale;
}
export type AiAssistInput =
  | {
      action: "plan_draft";
      goal: string;
      startingPoint?: string;
      material?: string;
      links: string[];
      search: boolean;
      locale: Locale;
    }
  | (SavedPlanRequest & {
      action: "step_help";
      stepId: string;
      minutes: number;
    })
  | (SavedPlanRequest & {
      action: "study_reflection";
      stepId: string;
      reflection?: string;
    })
  | (SavedPlanRequest & { action: "comeback_help"; minutes: number })
  | (SavedPlanRequest & { action: "progress_recap" })
  | {
      action: "circle_draft";
      circleId: string;
      kind: CircleItemKind;
      draft: string;
      locale: Locale;
    };
export interface AiPlanResult {
  kind: "plan";
  goal: string;
  outcome: string;
  prerequisites: string;
  steps: { title: string; estimatedMinutes: number; sourceIds: string[] }[];
  sources: LearningSource[];
}
export interface AiGuidanceResult {
  kind: "guidance";
  title: string;
  summary: string;
  nextAction: string;
  microActions: string[];
}
export interface AiCircleResult {
  kind: "circle";
  text: string;
}
export interface AiInsufficientResult {
  kind: "insufficient";
  reason: string;
}
export type AiAssistResponse =
  | AiPlanResult
  | AiGuidanceResult
  | AiCircleResult
  | AiInsufficientResult;
export interface AiStatus {
  available: boolean;
  reason: "not_configured" | null;
  model: string;
}
export const AI_LIMITS = {
  contextBytes: 16_384,
  notes: 2000,
  steps: 10,
  prose: 2000,
  microActions: 5,
  sourceBytes: 4096,
  sourceHours: 24,
  ownerSources: 100,
  totalSources: 1000,
} as const;
