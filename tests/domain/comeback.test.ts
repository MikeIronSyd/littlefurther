import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { comebackPreview } from "../../src/domain/comeback.js";
import {
  comebackConfirmInput,
  comebackPreviewInput,
  DomainError,
} from "../../src/domain/validation.js";
import type { LearningPlan } from "../../src/shared/contracts.js";

function plan(dates: string[]): LearningPlan {
  return {
    id: randomUUID(),
    goal: "Return to learning",
    templateId: null,
    templateVersion: null,
    revision: 3,
    locale: "en",
    timezone: "America/New_York",
    availabilityDates: dates,
    targetDate: null,
    references: [],
    steps: dates.map((scheduledDate, index) => ({
      id: randomUUID(),
      title: `Action ${index + 1}`,
      scheduledDate,
      estimatedMinutes: 15,
      completedAt: null,
    })),
    createdAt: "2026-10-07T10:00:00.000Z",
    updatedAt: "2026-10-07T10:00:00.000Z",
  };
}
function errorCode(code: string, status: number, field?: string) {
  return (error: unknown): boolean =>
    error instanceof DomainError &&
    error.code === code &&
    error.status === status &&
    error.field === field;
}

test("Comeback shifts unfinished dates only, preserving learner order and input", () => {
  const current = plan(["2026-10-01", "2026-10-05", "2026-10-03", "2026-10-03", "2026-10-09"]);
  const first = current.steps[0];
  const last = current.steps[4];
  assert.ok(first && last);
  first.completedAt = "2026-10-01T12:00:00.000Z";
  last.completedAt = "2026-10-09T12:00:00.000Z";
  const before = structuredClone(current);
  const preview = comebackPreview(current, "2026-10-08");
  assert.equal(preview.shiftDays, 3);
  assert.deepEqual(
    preview.changes.map((change) => change.stepId),
    current.steps.slice(1, 4).map((step) => step.id),
  );
  assert.deepEqual(
    preview.changes.map((change) => change.previousDate),
    ["2026-10-05", "2026-10-03", "2026-10-03"],
  );
  assert.deepEqual(
    preview.changes.map((change) => change.proposedDate),
    ["2026-10-08", "2026-10-06", "2026-10-06"],
  );
  assert.equal(preview.planId, current.id);
  assert.equal(preview.revision, 3);
  assert.deepEqual(current, before);
});

test("Comeback supports negative shifts across year boundaries and zero-day previews", () => {
  const current = plan(["2026-01-02", "2026-01-05"]);
  const backward = comebackPreview(current, "2025-12-31");
  assert.equal(backward.shiftDays, -2);
  assert.deepEqual(
    backward.changes.map((change) => change.proposedDate),
    ["2025-12-31", "2026-01-03"],
  );
  const unchanged = comebackPreview(current, "2026-01-02");
  assert.equal(unchanged.shiftDays, 0);
  assert.ok(unchanged.changes.every((change) => change.previousDate === change.proposedDate));
});

test("Comeback uses calendar dates through leap day and both DST transitions", () => {
  for (const [dates, restartDate, expected] of [
    [["2028-02-28", "2028-02-29"], "2028-03-01", ["2028-03-01", "2028-03-02"]],
    [["2026-03-07", "2026-03-08"], "2026-03-09", ["2026-03-09", "2026-03-10"]],
    [["2026-10-31", "2026-11-01"], "2026-11-02", ["2026-11-02", "2026-11-03"]],
  ] as const) {
    const current = plan([...dates]);
    assert.deepEqual(
      comebackPreview(current, restartDate).changes.map((change) => change.proposedDate),
      expected,
    );
    current.timezone = "Africa/Lagos";
    assert.deepEqual(
      comebackPreview(current, restartDate).changes.map((change) => change.proposedDate),
      expected,
    );
  }
});

test("Comeback preserves both conflicts for unfinished rows without moving target or availability", () => {
  const current = plan(["2026-10-01", "2026-10-03", "2026-10-04"]);
  const completed = current.steps[0];
  assert.ok(completed);
  completed.completedAt = "2026-10-01T12:00:00.000Z";
  current.availabilityDates = ["2026-10-05"];
  current.targetDate = "2026-10-05";
  const preview = comebackPreview(current, "2026-10-05");
  const last = current.steps[2];
  assert.ok(last);
  assert.deepEqual(preview.conflicts, [
    { stepId: last.id, kind: "unavailable_date", date: "2026-10-06" },
    { stepId: last.id, kind: "after_target", date: "2026-10-06" },
  ]);
  assert.deepEqual(current.availabilityDates, ["2026-10-05"]);
  assert.equal(current.targetDate, "2026-10-05");
});

test("Comeback reports no schedule for empty and all-complete scopes", () => {
  assert.throws(
    () => comebackPreview(plan([]), "2026-10-08"),
    errorCode("no_unfinished_steps", 409),
  );
  const current = plan(["2026-10-01"]);
  for (const step of current.steps) step.completedAt = "2026-10-01T12:00:00.000Z";
  assert.throws(
    () => comebackPreview(current, "2026-10-08"),
    errorCode("no_unfinished_steps", 409),
  );
});

test("Comeback rejects every out-of-range proposed date before returning a partial proposal", () => {
  for (const [dates, restartDate] of [
    [["2100-12-30", "2100-12-31"], "2100-12-31"],
    [["2000-01-02", "2000-01-01"], "2000-01-01"],
  ] as const) {
    const current = plan([...dates]);
    const before = structuredClone(current);
    assert.throws(
      () => comebackPreview(current, restartDate),
      errorCode("schedule_out_of_range", 400, "restartDate"),
    );
    assert.deepEqual(current, before);
  }
  assert.equal(
    comebackPreview(plan(["2000-01-01"]), "2100-12-31").changes[0]?.proposedDate,
    "2100-12-31",
  );
});

test("Comeback validates dates and rejects forged or malformed preview/confirmation input", () => {
  const input = { revision: 1, restartDate: "2026-10-08" };
  assert.deepEqual(comebackPreviewInput(input), input);
  const confirm = { requestId: randomUUID(), ...input };
  assert.deepEqual(comebackConfirmInput(confirm), confirm);
  for (const invalid of [
    { ...input, revision: 0 },
    { ...input, revision: 1.5 },
    { ...input, restartDate: "2026-02-29" },
    { ...input, restartDate: "2101-01-01" },
    { ...input, ownerId: randomUUID() },
    { ...input, changes: [] },
    { ...input, conflicts: [] },
    { ...input, requestId: randomUUID() },
  ])
    assert.throws(() => comebackPreviewInput(invalid), DomainError);
  for (const invalid of [
    { ...confirm, requestId: "not-a-uuid" },
    { ...confirm, dates: [] },
    { ...confirm, restartDate: null },
  ])
    assert.throws(() => comebackConfirmInput(invalid), DomainError);
  assert.throws(
    () => comebackPreview(plan(["2026-10-08"]), "bad-date"),
    errorCode("invalid_input", 400, "restartDate"),
  );
});
