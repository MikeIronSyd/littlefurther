import type {
  CompletionEvent,
  LearningPlan,
  PlanConflict,
  Progress,
  StudyActivity,
} from "../shared/contracts.js";

export function localDate(timestamp: string | Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(timestamp));
  const part = (type: string) => parts.find((value) => value.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}
export function addCalendarDays(date: string, days: number): string {
  const value = new Date(`${date}T12:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
export function progressFor(
  plan: LearningPlan,
  activities: StudyActivity[],
  completions: CompletionEvent[],
  now: Date,
): Progress {
  const rangeEnd = localDate(now, plan.timezone);
  const rangeStart = addCalendarDays(rangeEnd, -6);
  const studyDates = [
    ...new Set(
      activities
        .map((activity) => localDate(activity.createdAt, plan.timezone))
        .filter((date) => date >= rangeStart && date <= rangeEnd),
    ),
  ].sort();
  return {
    completed: plan.steps.filter((step) => step.completedAt !== null).length,
    total: plan.steps.length,
    cumulativeCompletions: completions.filter((event) => !event.correctedAt).length,
    activityCount: activities.length,
    studiedMinutes: activities.reduce((total, activity) => total + activity.minutes, 0),
    studyDayCount: studyDates.length,
    studyDates,
    rangeStart,
    rangeEnd,
    timezone: plan.timezone,
  };
}
export function conflictsFor(plan: LearningPlan): PlanConflict[] {
  return plan.steps.flatMap((step) => {
    const conflicts: PlanConflict[] = [];
    if (!plan.availabilityDates.includes(step.scheduledDate))
      conflicts.push({ stepId: step.id, kind: "unavailable_date", date: step.scheduledDate });
    if (plan.targetDate !== null && step.scheduledDate > plan.targetDate)
      conflicts.push({ stepId: step.id, kind: "after_target", date: step.scheduledDate });
    return conflicts;
  });
}
