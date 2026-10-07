import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import {
  addCalendarDays,
  conflictsFor,
  localDate,
  progressFor,
} from "../../src/domain/progress.js";
import {
  activityInput,
  calendarDate,
  createPlanInput,
  DomainError,
  profileInput,
  safeUrl,
  timezone,
  updatePlanInput,
} from "../../src/domain/validation.js";
import type { LearningPlan, StudyActivity } from "../../src/shared/contracts.js";

const plan: LearningPlan = {
  id: randomUUID(),
  goal: "Study",
  templateId: null,
  templateVersion: null,
  revision: 1,
  locale: "en",
  timezone: "America/New_York",
  targetDate: "2026-03-10",
  availabilityDates: ["2026-03-04", "2026-03-10"],
  references: [],
  steps: [
    {
      id: randomUUID(),
      title: "Read",
      scheduledDate: "2026-03-10",
      estimatedMinutes: 10,
      completedAt: null,
    },
  ],
  createdAt: "2026-03-04T12:00:00.000Z",
  updatedAt: "2026-03-04T12:00:00.000Z",
};
function activity(at: string, minutes = 5): StudyActivity {
  return {
    id: randomUUID(),
    stepId: plan.steps[0]?.id ?? "",
    stepTitle: "Read",
    minutes,
    reflection: null,
    createdAt: at,
  };
}
function input() {
  return {
    requestId: randomUUID(),
    goal: "My supplied topics",
    templateId: null,
    availabilityDates: ["2026-10-07"],
    targetDate: null,
    references: [],
    steps: [{ title: "Read my first section", estimatedMinutes: 10, scheduledDate: "2026-10-07" }],
  };
}

test("calendar validation rejects normalization and accepts leap days", () => {
  assert.equal(calendarDate("2028-02-29"), "2028-02-29");
  for (const value of [
    "2026-02-29",
    "2026-04-31",
    "2026-13-01",
    "2026-1-02",
    "1999-12-31",
    "2101-01-01",
  ])
    assert.throws(() => calendarDate(value), DomainError);
  assert.equal(addCalendarDays("2026-03-01", -1), "2026-02-28");
});
test("timezone requires a real named zone, with explicit profile locale", () => {
  assert.equal(timezone("Africa/Lagos"), "Africa/Lagos");
  assert.equal(timezone("UTC"), "UTC");
  for (const value of ["Moon/Sea", "+01:00", ""]) assert.throws(() => timezone(value), DomainError);
  assert.throws(() => profileInput({ locale: "de", timezone: "UTC" }), DomainError);
  assert.throws(() => profileInput({ locale: "fr", timezone: "UTC", owner: "other" }), DomainError);
});
test("reference URLs exclude scripts, relative addresses and credentials", () => {
  assert.equal(safeUrl("https://example.org/notes?q=one"), "https://example.org/notes?q=one");
  for (const value of [
    "javascript:alert(1)",
    "data:text/html,hello",
    "/notes",
    "//example.org",
    "https://name:password@example.org",
    "file:///notes",
    "https://",
  ])
    assert.throws(() => safeUrl(value), DomainError);
});
test("unsupported goals retain supplied topics without an invented template", () => {
  const parsed = createPlanInput(input());
  assert.equal(parsed.templateId, null);
  assert.equal(parsed.steps[0]?.title, "Read my first section");
  assert.throws(
    () => createPlanInput({ ...input(), templateId: "universal-curriculum" }),
    DomainError,
  );
  assert.throws(() => createPlanInput({ ...input(), steps: [] }), DomainError);
  assert.throws(
    () => createPlanInput({ ...input(), availabilityDates: ["2026-10-07", "2026-10-07"] }),
    DomainError,
  );
  assert.throws(() => createPlanInput({ ...input(), ownerId: "other" }), DomainError);
});
test("limits and explicit IDs protect mutation contracts", () => {
  assert.throws(
    () => activityInput({ requestId: randomUUID(), stepId: randomUUID(), minutes: 0 }),
    DomainError,
  );
  assert.throws(
    () => activityInput({ requestId: randomUUID(), stepId: randomUUID(), minutes: 1.5 }),
    DomainError,
  );
  assert.throws(
    () =>
      activityInput({ requestId: randomUUID(), stepId: randomUUID(), minutes: 5, completed: true }),
    DomainError,
  );
  assert.throws(
    () =>
      activityInput({
        requestId: randomUUID(),
        stepId: randomUUID(),
        minutes: 5,
        reflection: "a".repeat(2001),
      }),
    DomainError,
  );
  assert.throws(
    () => activityInput({ requestId: "retry", stepId: randomUUID(), minutes: 5 }),
    DomainError,
  );
  const { templateId: _templateId, ...edit } = input();
  assert.equal(updatePlanInput({ ...edit, revision: 1, steps: [] }).steps.length, 0);
});
test("UTC activity crosses local midnight without assuming UTC calendar day", () => {
  assert.equal(localDate("2026-10-07T23:30:00.000Z", "Africa/Lagos"), "2026-10-08");
  assert.equal(localDate("2026-10-07T01:00:00.000Z", "America/New_York"), "2026-10-06");
});
test("seven calendar dates include DST boundary and deduplicate repeated days", () => {
  const activities = [
    activity("2026-03-04T05:05:00.000Z"),
    activity("2026-03-04T23:00:00.000Z"),
    activity("2026-03-08T06:30:00.000Z"),
    activity("2026-03-08T07:30:00.000Z"),
    activity("2026-03-11T03:30:00.000Z"),
    activity("2026-03-04T04:59:00.000Z"),
    activity("2026-03-11T04:00:00.000Z"),
  ];
  const progress = progressFor(plan, activities, [], new Date("2026-03-11T03:45:00.000Z"));
  assert.equal(progress.rangeStart, "2026-03-04");
  assert.equal(progress.rangeEnd, "2026-03-10");
  assert.deepEqual(progress.studyDates, ["2026-03-04", "2026-03-08", "2026-03-10"]);
  assert.equal(progress.studyDayCount, 3);
  assert.equal(progress.activityCount, 7);
  assert.equal(progress.studiedMinutes, 35);
  assert.equal(progress.completed, 0);
});
test("fall-back repeated hour is one day; missing days retain cumulative work", () => {
  const activities = [
    activity("2026-11-01T05:30:00.000Z", 4),
    activity("2026-11-01T06:30:00.000Z", 6),
  ];
  assert.equal(
    progressFor(plan, activities, [], new Date("2026-11-02T12:00:00.000Z")).studyDayCount,
    1,
  );
  const later = progressFor(plan, activities, [], new Date("2026-12-02T12:00:00.000Z"));
  assert.equal(later.studyDayCount, 0);
  assert.equal(later.studiedMinutes, 10);
  assert.equal(later.activityCount, 2);
});
test("empty current scope keeps historical completions and reports zero active steps", () => {
  const progress = progressFor(
    { ...plan, steps: [] },
    [activity("2026-03-08T12:00:00.000Z")],
    [
      {
        id: randomUUID(),
        stepId: "archived",
        stepTitle: "Finished earlier",
        scheduledDate: "2026-03-07",
        createdAt: "2026-03-08T12:00:00.000Z",
      },
    ],
    new Date("2026-03-10T12:00:00.000Z"),
  );
  assert.equal(progress.total, 0);
  assert.equal(progress.completed, 0);
  assert.equal(progress.cumulativeCompletions, 1);
  assert.equal(progress.studiedMinutes, 5);
});
test("conflicts expose unavailable dates and fixed target without moving dates", () => {
  const step = plan.steps[0];
  assert.ok(step);
  const changed = { ...plan, steps: [{ ...step, scheduledDate: "2026-03-12" }] };
  assert.deepEqual(
    conflictsFor(changed).map((item) => item.kind),
    ["unavailable_date", "after_target"],
  );
  assert.equal(changed.steps[0]?.scheduledDate, "2026-03-12");
  assert.equal(changed.targetDate, "2026-03-10");
});
