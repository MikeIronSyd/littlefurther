import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import Database from "better-sqlite3";
import { createPlanInput, DomainError, updatePlanInput } from "../../src/domain/validation.js";
import { AiSourceStore } from "../../src/server/ai-sources.js";
import { JourneyStore, migrate } from "../../src/server/store.js";
import type {
  CreatePlanInput,
  LearningSource,
  PlanDetail,
  RestoreStepInput,
} from "../../src/shared/contracts.js";

function fixture(file = ":memory:") {
  const database = new Database(file);
  database.pragma("foreign_keys=ON");
  database.exec("CREATE TABLE IF NOT EXISTS user(id TEXT PRIMARY KEY,name TEXT NOT NULL)");
  database.exec(
    "INSERT OR IGNORE INTO user VALUES('owner','Synthetic owner'),('other','Synthetic other')",
  );
  migrate(database);
  let now = new Date("2026-10-15T10:00:00.000Z");
  const clock = () => now;
  const store = new JourneyStore(database, clock);
  store.saveProfile("owner", { locale: "en", timezone: "Africa/Lagos" });
  store.saveProfile("other", { locale: "fr", timezone: "UTC" });
  return {
    database,
    store,
    clock,
    sources: new AiSourceStore(database, clock),
    advance: () => {
      now = new Date(now.getTime() + 86_400_000);
    },
  };
}
function input(): CreatePlanInput {
  return createPlanInput({
    requestId: randomUUID(),
    goal: "Synthetic lifecycle goal",
    templateId: null,
    availabilityDates: ["2026-10-15", "2026-10-17"],
    targetDate: null,
    references: [],
    steps: [
      { title: "First step", scheduledDate: "2026-10-15", estimatedMinutes: 10 },
      { title: "Second step", scheduledDate: "2026-10-17", estimatedMinutes: 15 },
    ],
  });
}
const action = (detail: PlanDetail) => ({
  requestId: randomUUID(),
  revision: detail.plan.revision,
});
const edit = (detail: PlanDetail) =>
  updatePlanInput({
    ...action(detail),
    goal: detail.plan.goal,
    availabilityDates: detail.plan.availabilityDates,
    targetDate: detail.plan.targetDate,
    references: detail.plan.references,
    steps: detail.plan.steps.map(({ completedAt: _completedAt, ...step }) => step),
  });
function failure(run: () => unknown, code: string, status?: number): void {
  assert.throws(
    run,
    (error: unknown) =>
      error instanceof DomainError &&
      error.code === code &&
      (status === undefined || error.status === status),
  );
}
function receiptBodies(database: Database.Database): string {
  return JSON.stringify(database.prepare("SELECT response FROM request_receipt").all());
}
function legacyReceipt(
  database: Database.Database,
  owner: string,
  requestId: string,
  detail: PlanDetail,
): void {
  database
    .prepare("UPDATE request_receipt SET response = ? WHERE owner_id = ? AND request_id = ?")
    .run(JSON.stringify(detail), owner, requestId);
}

test("lifecycle archive is reversible/read-only, legacy fields normalize, and profile presentation reaches archives", () => {
  const { database, store } = fixture();
  try {
    const creation = input();
    let detail = store.create("owner", creation);
    const id = detail.plan.id;
    const raw = { ...detail.plan };
    delete raw.archivedAt;
    database.prepare("UPDATE learning_plan SET body=? WHERE id=?").run(JSON.stringify(raw), id);
    assert.equal(store.detail("owner", id).plan.archivedAt, null);
    const archive = action(detail);
    const originalDates = detail.plan.steps.map((step) => step.scheduledDate);
    detail = store.archive("owner", id, archive);
    assert.ok(detail.plan.archivedAt);
    assert.equal(detail.plan.revision, 2);
    assert.equal(store.list("owner").length, 0);
    assert.equal(store.list("owner", "archived").length, 1);
    assert.deepEqual(store.archive("owner", id, archive), detail);
    const stepId = detail.plan.steps[0]?.id ?? "";
    for (const run of [
      () => store.activity("owner", id, { ...action(detail), stepId, minutes: 5 }),
      () => store.complete("owner", id, { ...action(detail), stepId }),
      () => store.update("owner", id, edit(detail)),
      () =>
        store.previewComeback("owner", id, {
          revision: detail.plan.revision,
          restartDate: "2026-10-20",
        }),
      () => store.confirmComeback("owner", id, { ...action(detail), restartDate: "2026-10-20" }),
      () => store.create("owner", creation),
    ])
      failure(run, "plan_archived", 409);
    failure(() => store.restore("other", id, action(detail)), "not_found", 404);
    store.saveProfile("owner", { locale: "fr", timezone: "America/New_York" });
    detail = store.detail("owner", id);
    assert.equal(detail.plan.locale, "fr");
    assert.equal(detail.plan.timezone, "America/New_York");
    const restore = action(detail);
    detail = store.restore("owner", id, restore);
    assert.equal(detail.plan.archivedAt, null);
    assert.deepEqual(
      detail.plan.steps.map((step) => step.scheduledDate),
      originalDates,
    );
    assert.equal(detail.plan.revision, 3);
    assert.deepEqual(store.restore("owner", id, restore), detail);
    assert.equal(store.list("owner").length, 1);
    assert.equal(store.list("owner", "archived").length, 0);
    failure(() => store.restore("owner", id, action(detail)), "not_archived", 409);
    failure(
      () => store.archive("owner", id, { ...action(detail), revision: 1 }),
      "stale_revision",
      409,
    );
  } finally {
    database.close();
  }
});

test("private record removal scrubs legacy copies and retries read current state without resurrecting work", () => {
  const { database, store, advance } = fixture();
  try {
    const creation = input();
    let detail = store.create("owner", creation);
    const id = detail.plan.id;
    const stepId = detail.plan.steps[0]?.id ?? "";
    const study = { ...action(detail), stepId, minutes: 5, reflection: "PRIVATE FIRST REFLECTION" };
    detail = store.activity("owner", id, study);
    assert.equal(detail.plan.revision, 2);
    const first = detail.activities[0];
    assert.ok(first);
    legacyReceipt(database, "owner", creation.requestId, detail);
    legacyReceipt(database, "owner", study.requestId, detail);
    assert.ok(receiptBodies(database).includes(study.reflection));
    const remove = action(detail);
    detail = store.removeReflection("owner", id, first.id, remove);
    assert.deepEqual(detail.activities[0], { ...first, reflection: null });
    assert.equal(detail.progress.studiedMinutes, 5);
    assert.equal(detail.progress.studyDayCount, 1);
    assert.equal(receiptBodies(database).includes(study.reflection), false);
    assert.deepEqual(store.activity("owner", id, study), detail);
    assert.deepEqual(store.create("owner", creation), detail);
    const complete = { ...action(detail), stepId };
    detail = store.complete("owner", id, complete);
    const completedAt = detail.plan.steps[0]?.completedAt;
    advance();
    detail = store.activity("owner", id, {
      ...action(detail),
      stepId,
      minutes: 7,
      reflection: "PRIVATE SECOND SESSION",
    });
    assert.equal(detail.progress.studyDayCount, 2);
    const second = detail.activities[0];
    assert.ok(second);
    legacyReceipt(database, "owner", study.requestId, detail);
    const deletion = action(detail);
    detail = store.deleteActivity("owner", id, second.id, deletion);
    assert.equal(detail.progress.activityCount, 1);
    assert.equal(detail.progress.studiedMinutes, 5);
    assert.equal(detail.progress.studyDayCount, 1);
    assert.equal(detail.plan.steps[0]?.completedAt, completedAt);
    assert.equal(detail.progress.completed, 1);
    assert.equal(receiptBodies(database).includes("PRIVATE SECOND SESSION"), false);
    assert.deepEqual(store.deleteActivity("owner", id, second.id, deletion), detail);
    assert.deepEqual(store.complete("owner", id, complete), detail);
    failure(() => store.deleteActivity("other", id, first.id, action(detail)), "not_found", 404);
    failure(
      () => store.removeReflection("owner", id, first.id, action(detail)),
      "reflection_unavailable",
      409,
    );
    failure(
      () => store.deleteActivity("owner", id, first.id, { ...action(detail), revision: 1 }),
      "stale_revision",
      409,
    );
    const stale = action(detail);
    detail = store.activity("owner", id, { ...action(detail), stepId, minutes: 1 });
    failure(() => store.delete("owner", id, stale), "stale_revision", 409);
    const archive = action(detail);
    detail = store.archive("owner", id, archive);
    failure(
      () => store.removeReflection("owner", id, first.id, action(detail)),
      "plan_archived",
      409,
    );
    failure(
      () => store.deleteActivity("owner", id, first.id, action(detail)),
      "plan_archived",
      409,
    );
    failure(
      () => store.correctCompletion("owner", id, detail.completions[0]?.id ?? "", action(detail)),
      "plan_archived",
      409,
    );
  } finally {
    database.close();
  }
});

test("correction history excludes corrected totals and older retries cannot clear a new completion", () => {
  const { database, store } = fixture();
  try {
    let detail = store.create("owner", input());
    const id = detail.plan.id;
    const stepId = detail.plan.steps[0]?.id ?? "";
    detail = store.activity("owner", id, {
      ...action(detail),
      stepId,
      minutes: 6,
      reflection: "Retained",
    });
    detail = store.complete("owner", id, { ...action(detail), stepId });
    const old = detail.completions[0];
    assert.ok(old);
    const correction = action(detail);
    detail = store.correctCompletion("owner", id, old.id, correction);
    assert.equal(detail.progress.completed, 0);
    assert.equal(detail.progress.cumulativeCompletions, 0);
    assert.ok(detail.completions[0]?.correctedAt);
    assert.equal(detail.plan.steps[0]?.completedAt, null);
    assert.equal(detail.progress.studiedMinutes, 6);
    detail = store.complete("owner", id, { ...action(detail), stepId });
    const current = detail.completions[0];
    assert.ok(current && current.id !== old.id);
    assert.equal(detail.progress.cumulativeCompletions, 1);
    assert.equal(detail.completions.length, 2);
    assert.deepEqual(store.correctCompletion("owner", id, old.id, correction), detail);
    failure(
      () => store.correctCompletion("owner", id, old.id, action(detail)),
      "already_corrected",
      409,
    );
    assert.equal(store.detail("owner", id).plan.steps[0]?.completedAt, current.createdAt);
    detail = store.update("owner", id, { ...edit(detail), steps: detail.plan.steps.slice(1) });
    detail = store.correctCompletion("owner", id, current.id, action(detail));
    assert.equal(detail.progress.cumulativeCompletions, 0);
    const candidate = store.removedSteps("owner", id)[0];
    assert.ok(candidate);
    assert.equal(candidate.step.completedAt, null);
    detail = store.restoreStep("owner", id, stepId, {
      ...action(detail),
      scopeEventId: candidate.scopeEventId,
      references: [],
      acknowledgeConflicts: true,
    });
    assert.equal(detail.plan.steps.at(-1)?.completedAt, null);
    assert.equal(detail.progress.completed, 0);
    assert.equal(detail.activities.length, 1);
  } finally {
    database.close();
  }
});

test("removed steps recover latest identity and trusted source history after staging expires, with explicit link/conflict choices", () => {
  const { database, store, sources, advance } = fixture();
  try {
    const source: LearningSource = {
      id: randomUUID(),
      kind: "web_search",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
      title: "HTML",
      publisher: "developer.mozilla.org",
      languageHint: "en",
      observedAt: "2026-10-15T10:00:00.000Z",
      evidence: ["listed", "cited"],
    };
    sources.stage("owner", [source]);
    let detail = store.create("owner", {
      ...input(),
      references: [source.url, "https://example.org/optional#section"],
      sourceIds: [source.id],
      steps: [
        {
          title: "Original source step",
          scheduledDate: "2026-10-15",
          estimatedMinutes: 5,
          sourceIds: [source.id],
        },
      ],
    });
    const id = detail.plan.id;
    const stepId = detail.plan.steps[0]?.id ?? "";
    detail = store.update("owner", id, {
      ...edit(detail),
      steps: detail.plan.steps.map((step) => ({ ...step, title: "Latest source step" })),
    });
    detail = store.update("owner", id, {
      ...edit(detail),
      references: ["https://example.org/current"],
      sourceIds: [],
      steps: [],
    });
    detail = store.update("owner", id, {
      ...edit(detail),
      availabilityDates: ["2026-10-17"],
      targetDate: "2026-10-14",
    });
    advance();
    advance();
    sources.cleanup();
    const candidate = store.removedSteps("owner", id)[0];
    assert.ok(candidate);
    assert.equal(candidate.step.title, "Latest source step");
    assert.equal(candidate.step.id, stepId);
    assert.deepEqual(candidate.sources, [source]);
    assert.deepEqual(candidate.references, ["https://example.org/optional#section"]);
    assert.equal(candidate.conflicts.length, 2);
    const restore: RestoreStepInput = {
      ...action(detail),
      scopeEventId: candidate.scopeEventId,
      references: candidate.references,
      acknowledgeConflicts: false,
    };
    failure(() => store.restoreStep("other", id, stepId, restore), "not_found", 404);
    failure(() => store.restoreStep("owner", id, stepId, restore), "restore_conflicts", 409);
    failure(
      () =>
        store.restoreStep("owner", id, stepId, {
          ...restore,
          scopeEventId: randomUUID(),
          acknowledgeConflicts: true,
        }),
      "stale_revision",
      409,
    );
    failure(
      () =>
        store.restoreStep("owner", id, stepId, {
          ...restore,
          references: ["https://example.org/unoffered"],
          acknowledgeConflicts: true,
        }),
      "invalid_input",
      400,
    );
    restore.acknowledgeConflicts = true;
    detail = store.restoreStep("owner", id, stepId, restore);
    assert.equal(detail.plan.steps[0]?.id, stepId);
    assert.equal(detail.plan.steps[0]?.scheduledDate, "2026-10-15");
    assert.deepEqual(detail.plan.sources, [source]);
    assert.deepEqual(detail.plan.references, [
      "https://example.org/current",
      source.url,
      "https://example.org/optional#section",
    ]);
    assert.equal(detail.scopeEvents[0]?.kind, "restore");
    assert.equal(detail.scopeEvents[0]?.restoredStepId, stepId);
    assert.equal(store.removedSteps("owner", id).length, 0);
    assert.deepEqual(store.restoreStep("owner", id, stepId, restore), detail);
    failure(
      () => store.restoreStep("owner", id, stepId, { ...restore, ...action(detail) }),
      "step_already_present",
      409,
    );
    detail = store.update("owner", id, { ...edit(detail), steps: [] });
    const latest = store.removedSteps("owner", id)[0];
    assert.ok(latest);
    assert.notEqual(latest.scopeEventId, candidate.scopeEventId);
    detail = store.restoreStep("owner", id, stepId, {
      ...action(detail),
      scopeEventId: latest.scopeEventId,
      references: [],
      acknowledgeConflicts: true,
    });
    assert.equal(detail.plan.steps.length, 1);
    assert.equal(detail.activities.length, 0);
  } finally {
    database.close();
  }
});

test("recovery preserves current resources, respects limits and rejects inconsistent source snapshots atomically", () => {
  const { database, store, sources } = fixture();
  try {
    const source: LearningSource = {
      id: randomUUID(),
      kind: "web_search",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
      title: "HTML",
      publisher: "developer.mozilla.org",
      languageHint: "en",
      observedAt: "2026-10-15T10:00:00.000Z",
      evidence: ["listed"],
    };
    sources.stage("owner", [source]);
    let detail = store.create("owner", {
      ...input(),
      references: [source.url],
      sourceIds: [source.id],
      steps: [
        {
          title: "Removed",
          scheduledDate: "2026-10-15",
          estimatedMinutes: 5,
          sourceIds: [source.id],
        },
      ],
    });
    const id = detail.plan.id;
    const stepId = detail.plan.steps[0]?.id ?? "";
    detail = store.update("owner", id, {
      ...edit(detail),
      sourceIds: [],
      references: Array.from({ length: 10 }, (_, i) => `https://example.org/${i}`),
      steps: [],
    });
    const candidate = store.removedSteps("owner", id)[0];
    assert.ok(candidate);
    const restore = {
      ...action(detail),
      scopeEventId: candidate.scopeEventId,
      references: [],
      acknowledgeConflicts: true,
    };
    failure(() => store.restoreStep("owner", id, stepId, restore), "restore_limit", 409);
    assert.deepEqual(store.detail("owner", id), detail);
    detail = store.update("owner", id, {
      ...edit(detail),
      references: [],
      steps: Array.from({ length: 50 }, (_, i) => ({
        title: `Step ${i}`,
        scheduledDate: "2026-10-15",
        estimatedMinutes: 5,
      })),
    });
    failure(
      () => store.restoreStep("owner", id, stepId, { ...restore, ...action(detail) }),
      "restore_limit",
      409,
    );
    detail = store.update("owner", id, { ...edit(detail), steps: [] });
    const collision = {
      ...detail.plan,
      references: [source.url],
      sources: [{ ...source, title: "Conflicting metadata" }],
    };
    database
      .prepare("UPDATE learning_plan SET body=? WHERE id=?")
      .run(JSON.stringify(collision), id);
    const collisionCandidate = store
      .removedSteps("owner", id)
      .find((item) => item.step.id === stepId);
    assert.ok(collisionCandidate);
    failure(
      () =>
        store.restoreStep("owner", id, stepId, {
          ...action(detail),
          scopeEventId: collisionCandidate.scopeEventId,
          references: [],
          acknowledgeConflicts: true,
        }),
      "source_unavailable",
      409,
    );
    database
      .prepare("UPDATE learning_plan SET body=? WHERE id=?")
      .run(JSON.stringify(detail.plan), id);
    // Corrupt only isolated synthetic history: a source association with missing metadata must fail.
    const rows = database
      .prepare("SELECT id,before_json FROM scope_event WHERE plan_id=?")
      .all(id) as { id: string; before_json: string }[];
    for (const row of rows) {
      const before = JSON.parse(row.before_json) as PlanDetail["plan"];
      if (before.steps.some((step) => step.id === stepId)) {
        before.sources = [];
        database
          .prepare("UPDATE scope_event SET before_json=? WHERE id=?")
          .run(JSON.stringify(before), row.id);
      }
    }
    const changed = store.removedSteps("owner", id).find((item) => item.step.id === stepId);
    assert.ok(changed);
    failure(
      () =>
        store.restoreStep("owner", id, stepId, {
          ...action(detail),
          scopeEventId: changed.scopeEventId,
          references: [],
          acknowledgeConflicts: true,
        }),
      "source_unavailable",
      409,
    );
    assert.deepEqual(store.detail("owner", id), detail);
  } finally {
    database.close();
  }
});

test("whole-plan deletion removes all private copies, preserves independent data, survives restart, and exact retries are safe", async () => {
  const parent = path.resolve(".local/server-tests");
  await mkdir(parent, { recursive: true });
  const directory = await mkdtemp(path.join(parent, "lifecycle-"));
  const file = path.join(directory, "synthetic.sqlite");
  const { database, store, sources } = fixture(file);
  let deletion: ReturnType<typeof action>;
  let id = "";
  let creation: CreatePlanInput;
  try {
    creation = input();
    let detail = store.create("owner", creation);
    id = detail.plan.id;
    const stepId = detail.plan.steps[0]?.id ?? "";
    const study = { ...action(detail), stepId, minutes: 5, reflection: "DELETE PRIVATE NOTE" };
    detail = store.activity("owner", id, study);
    detail = store.complete("owner", id, { ...action(detail), stepId });
    detail = store.update("owner", id, { ...edit(detail), steps: [] });
    legacyReceipt(database, "owner", creation.requestId, detail);
    const unrelated = store.create("owner", { ...input(), goal: "Other goal retained" });
    const other = store.create("other", input());
    const draft: LearningSource = {
      id: randomUUID(),
      kind: "user_supplied",
      url: "https://example.org/independent",
      title: null,
      publisher: "example.org",
      languageHint: "unknown",
      observedAt: "2026-10-15T10:00:00.000Z",
      evidence: ["supplied"],
    };
    sources.stage("owner", [draft]);
    const circleId = randomUUID(),
      memberId = randomUUID(),
      itemId = randomUUID();
    database
      .prepare("INSERT INTO study_circle VALUES(?,?,?,?,NULL)")
      .run(circleId, "owner", "Private circle", "2026-10-15T10:00:00.000Z");
    database
      .prepare("INSERT INTO circle_member VALUES(?,?,?,?)")
      .run(memberId, circleId, "owner", "2026-10-15T10:00:00.000Z");
    database
      .prepare("INSERT INTO circle_item VALUES(?,?,?,?,?,?)")
      .run(
        itemId,
        circleId,
        memberId,
        "commitment",
        "Deliberately shared copy",
        "2026-10-15T10:00:00.000Z",
      );
    failure(() => store.delete("other", id, action(detail)), "not_found", 404);
    deletion = action(detail);
    assert.deepEqual(store.delete("owner", id, deletion), { deletedPlanId: id });
    for (const table of ["study_activity", "step_completion", "scope_event"])
      assert.equal(
        (
          database.prepare(`SELECT count(*) AS n FROM ${table} WHERE plan_id=?`).get(id) as {
            n: number;
          }
        ).n,
        0,
      );
    failure(() => store.detail("owner", id), "not_found", 404);
    failure(() => store.create("owner", creation), "not_found", 404);
    failure(() => store.activity("owner", id, study), "not_found", 404);
    assert.deepEqual(store.delete("owner", id, deletion), { deletedPlanId: id });
    failure(
      () => store.delete("owner", id, { ...deletion, revision: deletion.revision + 1 }),
      "idempotency_conflict",
      409,
    );
    assert.equal(receiptBodies(database).includes("DELETE PRIVATE NOTE"), false);
    assert.equal(receiptBodies(database).includes("Synthetic lifecycle goal"), false);
    assert.equal(store.detail("owner", unrelated.plan.id).plan.goal, "Other goal retained");
    assert.equal(store.detail("other", other.plan.id).plan.id, other.plan.id);
    assert.equal(
      (database.prepare("SELECT text FROM circle_item WHERE id=?").get(itemId) as { text: string })
        .text,
      "Deliberately shared copy",
    );
    assert.equal(sources.resolve("owner", [draft.id]).length, 1);
    assert.ok(store.profile("owner"));
  } finally {
    database.close();
  }
  const reopened = new Database(file);
  reopened.pragma("foreign_keys=ON");
  try {
    const restarted = new JourneyStore(reopened, () => new Date("2026-10-16T10:00:00.000Z"));
    assert.ok(deletion && creation);
    assert.deepEqual(restarted.delete("owner", id, deletion), { deletedPlanId: id });
    failure(() => restarted.create("owner", creation), "not_found", 404);
  } finally {
    reopened.close();
    assert.ok(directory.startsWith(`${parent}${path.sep}lifecycle-`));
    await rm(directory, { recursive: true, force: true });
  }
});

test("privacy deletions and receipt conversion roll back together on SQLite failure", () => {
  const { database, store } = fixture();
  try {
    const creation = input();
    let detail = store.create("owner", creation);
    const id = detail.plan.id;
    const stepId = detail.plan.steps[0]?.id ?? "";
    detail = store.activity("owner", id, {
      ...action(detail),
      stepId,
      minutes: 5,
      reflection: "ROLLBACK NOTE",
    });
    legacyReceipt(database, "owner", creation.requestId, detail);
    const receipts = receiptBodies(database);
    database.exec(
      "CREATE TRIGGER fail_plan_delete BEFORE DELETE ON learning_plan BEGIN SELECT RAISE(ABORT,'synthetic failure'); END;",
    );
    assert.throws(() => store.delete("owner", id, action(detail)), /synthetic failure/u);
    assert.deepEqual(store.detail("owner", id), detail);
    assert.equal(receiptBodies(database), receipts);
    database.exec(
      "DROP TRIGGER fail_plan_delete; CREATE TRIGGER fail_plan_update BEFORE UPDATE ON learning_plan BEGIN SELECT RAISE(ABORT,'synthetic update failure'); END;",
    );
    assert.throws(
      () => store.removeReflection("owner", id, detail.activities[0]?.id ?? "", action(detail)),
      /synthetic update failure/u,
    );
    assert.throws(
      () => store.deleteActivity("owner", id, detail.activities[0]?.id ?? "", action(detail)),
      /synthetic update failure/u,
    );
    assert.deepEqual(store.detail("owner", id), detail);
    assert.equal(receiptBodies(database), receipts);
  } finally {
    database.close();
  }
});
