import type { ComebackPreview, LearningPlan } from "../shared/contracts.js";
import { addCalendarDays, conflictsFor } from "./progress.js";
import { calendarDate, DomainError } from "./validation.js";

export function comebackPreview(plan: LearningPlan, restartDate: string): ComebackPreview {
  calendarDate(restartDate, "restartDate");
  const unfinished = plan.steps.filter((step) => step.completedAt === null);
  const first = unfinished[0];
  if (!first) throw new DomainError("no_unfinished_steps", 409);
  // Scheduled values are calendar dates, so offset arithmetic must not use local DST hours.
  const shiftDays =
    (Date.parse(`${restartDate}T12:00:00.000Z`) -
      Date.parse(`${first.scheduledDate}T12:00:00.000Z`)) /
    86_400_000;
  const proposed = unfinished.map((step) => {
    const scheduledDate = addCalendarDays(step.scheduledDate, shiftDays);
    try {
      calendarDate(scheduledDate, "restartDate");
    } catch (error) {
      if (error instanceof DomainError)
        throw new DomainError("schedule_out_of_range", 400, "restartDate");
      throw error;
    }
    return { ...step, scheduledDate };
  });
  return {
    planId: plan.id,
    revision: plan.revision,
    restartDate,
    shiftDays,
    changes: proposed.map((step, index) => ({
      stepId: step.id,
      title: step.title,
      previousDate: unfinished[index]?.scheduledDate ?? step.scheduledDate,
      proposedDate: step.scheduledDate,
    })),
    conflicts: conflictsFor({ ...plan, steps: proposed }),
  };
}
