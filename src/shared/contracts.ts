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
  sourceIds?: string[];
}
export interface PlanFields {
  goal: string;
  availabilityDates: string[];
  targetDate: string | null;
  references: string[];
  steps: StepInput[];
  sourceIds?: string[];
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
  sourceIds?: string[];
}
export type SourceEvidence = "supplied" | "listed" | "cited" | "opened";
export interface LearningSource {
  id: string;
  kind: "user_supplied" | "web_search";
  url: string;
  title: string | null;
  publisher: string;
  languageHint: Locale | "unknown";
  observedAt: string;
  evidence: SourceEvidence[];
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
  sources?: LearningSource[];
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
export type CircleRole = "owner" | "member";
export type CircleItemKind = "commitment" | "check_in";
export type EncouragementPreset = "keep_going" | "small_steps_count" | "glad_you_returned";
export type CircleInviteStatus = "active" | "expired" | "revoked" | "redeemed";
export interface CircleSummary {
  id: string;
  name: string;
  role: CircleRole;
  memberCount: number;
  createdAt: string;
}
export interface CircleMember {
  id: string;
  displayName: string;
  role: CircleRole;
  isSelf: boolean;
  joinedAt: string;
}
export interface CircleEncouragement {
  id: string;
  senderMemberId: string;
  senderName: string;
  preset: EncouragementPreset;
  createdAt: string;
}
export interface CircleItem {
  id: string;
  authorMemberId: string;
  authorName: string;
  kind: CircleItemKind;
  text: string;
  createdAt: string;
  encouragements: CircleEncouragement[];
}
export interface CircleDetail {
  circle: CircleSummary;
  members: CircleMember[];
  items: CircleItem[];
}
export interface CircleInvite {
  id: string;
  createdAt: string;
  expiresAt: string;
  status: CircleInviteStatus;
}
export interface CircleInviteCreated {
  invite: CircleInvite;
  token: string | null;
}
export interface CircleRequestInput {
  requestId: string;
}
export interface CreateCircleInput extends CircleRequestInput {
  name: string;
}
export interface RedeemCircleInviteInput extends CircleRequestInput {
  token: string;
}
export interface ShareCircleItemInput extends CircleRequestInput {
  kind: CircleItemKind;
  text: string;
}
export interface CircleEncouragementInput extends CircleRequestInput {
  preset: EncouragementPreset;
}
export const CIRCLE_LIMITS = {
  name: 80,
  text: 280,
  circles: 5,
  members: 10,
  items: 100,
  invites: 10,
  inviteHours: 24,
} as const;
export const ENCOURAGEMENT_PRESETS: readonly EncouragementPreset[] = [
  "keep_going",
  "small_steps_count",
  "glad_you_returned",
];
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
