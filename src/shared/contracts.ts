export type Locale = "en" | "fr";
export interface Profile {
  locale: Locale;
  timezone: string;
}
export interface MeResponse {
  user: { id: string; name: string; email: string };
  profile: Profile | null;
}
export interface SourceReference {
  label: string;
  url: string;
  checkedOn: string;
}
export interface TemplateText {
  title: string;
  outcome: string;
  prerequisites: string;
  steps: { title: string; estimatedMinutes: number }[];
}
export interface GoalTemplate {
  id: string;
  version: number;
  sources: Record<Locale, SourceReference[]>;
  text: Record<Locale, TemplateText>;
}
export interface StepInput {
  id?: string;
  title: string;
  scheduledDate: string;
  estimatedMinutes: number;
}
export interface PlanFields {
  goal: string;
  availabilityDates: string[];
  targetDate: string | null;
  references: string[];
  steps: StepInput[];
}
export interface CreatePlanInput extends PlanFields {
  requestId: string;
  templateId: string | null;
}
export interface UpdatePlanInput extends PlanFields {
  requestId: string;
  revision: number;
}
export interface LearningStep {
  id: string;
  title: string;
  scheduledDate: string;
  estimatedMinutes: number;
  completedAt: string | null;
}
export interface LearningPlan {
  id: string;
  goal: string;
  templateId: string | null;
  templateVersion: number | null;
  revision: number;
  timezone: string;
  locale: Locale;
  availabilityDates: string[];
  targetDate: string | null;
  references: string[];
  steps: LearningStep[];
  createdAt: string;
  updatedAt: string;
}
export interface StudyActivity {
  id: string;
  stepId: string;
  stepTitle: string;
  minutes: number;
  reflection: string | null;
  createdAt: string;
}
export interface CompletionEvent {
  id: string;
  stepId: string;
  stepTitle: string;
  scheduledDate: string;
  createdAt: string;
}
export interface ScopeEvent {
  id: string;
  previousCount: number;
  currentCount: number;
  createdAt: string;
}
export interface PlanConflict {
  stepId: string;
  kind: "unavailable_date" | "after_target";
  date: string;
}
export interface Progress {
  completed: number;
  total: number;
  cumulativeCompletions: number;
  activityCount: number;
  studiedMinutes: number;
  studyDayCount: number;
  studyDates: string[];
  rangeStart: string;
  rangeEnd: string;
  timezone: string;
}
export interface PlanDetail {
  plan: LearningPlan;
  activities: StudyActivity[];
  completions: CompletionEvent[];
  scopeEvents: ScopeEvent[];
  progress: Progress;
  nextStepId: string | null;
  conflicts: PlanConflict[];
}
export interface ActivityInput {
  requestId: string;
  stepId: string;
  minutes: number;
  reflection?: string;
}
export interface CompletionInput {
  requestId: string;
  revision: number;
  stepId: string;
}
export interface ComebackPreviewInput {
  revision: number;
  restartDate: string;
}
export interface ComebackConfirmInput extends ComebackPreviewInput {
  requestId: string;
}
export interface ComebackDateChange {
  stepId: string;
  title: string;
  previousDate: string;
  proposedDate: string;
}
export interface ComebackPreview {
  planId: string;
  revision: number;
  restartDate: string;
  shiftDays: number;
  changes: ComebackDateChange[];
  conflicts: PlanConflict[];
}
export interface ApiError {
  error: { code: string; field?: string };
}
export const LIMITS = {
  goal: 160,
  stepTitle: 240,
  steps: 50,
  minutes: 480,
  availability: 366,
  references: 10,
  url: 2048,
  reflection: 2000,
} as const;
