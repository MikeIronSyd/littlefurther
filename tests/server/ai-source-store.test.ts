import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import Database from "better-sqlite3";
import { createPlanInput, DomainError, updatePlanInput } from "../../src/domain/validation.js";
import { AiSourceStore } from "../../src/server/ai-sources.js";
import { JourneyStore, migrate } from "../../src/server/store.js";
import type { LearningSource, PlanDetail } from "../../src/shared/contracts.js";

const initial = "2026-10-13T09:00:00.000Z";
function fixture() {
  const database = new Database(":memory:");
  database.pragma("foreign_keys=ON");
  database.exec("CREATE TABLE user(id TEXT PRIMARY KEY,name TEXT NOT NULL)");
  for (let index = 0; index < 12; index++)
    database.prepare("INSERT INTO user VALUES(?,?)").run(`u${index}`, `Synthetic ${index}`);
  migrate(database);
  let now = new Date(initial);
  const clock = () => now;
  const journey = new JourneyStore(database, clock);
  journey.saveProfile("u0", { locale: "fr", timezone: "Africa/Lagos" });
  journey.saveProfile("u1", { locale: "en", timezone: "UTC" });
  return {
    database,
    journey,
    sources: new AiSourceStore(database, clock),
    clock,
    advance: (hours: number) => {
      now = new Date(now.getTime() + hours * 60 * 60 * 1000);
    },
  };
}
const source = (): LearningSource => ({
  id: randomUUID(),
  kind: "web_search",
  url: "https://developer.mozilla.org/fr/docs/Web/HTML",
  title: "HTML",
  publisher: "developer.mozilla.org",
  languageHint: "fr",
  observedAt: initial,
  evidence: ["listed", "cited"],
});
function input(sources: LearningSource[] = []) {
  return createPlanInput({
    requestId: randomUUID(),
    goal: "Read HTML",
    templateId: null,
    availabilityDates: ["2026-10-13"],
    targetDate: null,
    references: sources.map((source) => source.url),
    steps: [
      {
        title: "Read one page",
        scheduledDate: "2026-10-13",
        estimatedMinutes: 5,
        ...(sources.length ? { sourceIds: sources.map((source) => source.id) } : {}),
      },
    ],
    ...(sources.length ? { sourceIds: sources.map((source) => source.id) } : {}),
  });
}
function update(detail: PlanDetail) {
  return updatePlanInput({
    requestId: randomUUID(),
    revision: detail.plan.revision,
    goal: detail.plan.goal,
    availabilityDates: detail.plan.availabilityDates,
    targetDate: detail.plan.targetDate,
    references: detail.plan.references,
    steps: detail.plan.steps.map((step) => ({
      id: step.id,
      title: step.title,
      scheduledDate: step.scheduledDate,
      estimatedMinutes: step.estimatedMinutes,
    })),
  });
}
function code(action: () => unknown, expected: string): void {
  assert.throws(
    action,
    (error: unknown) => error instanceof DomainError && error.code === expected,
  );
}
function count(database: Database.Database): number {
  return (database.prepare("SELECT count(*) AS n FROM ai_source_draft").get() as { n: number }).n;
}
function dropV3(database: Database.Database): void {
  database.exec("DROP TABLE ai_source_draft; DELETE FROM app_schema WHERE version=3;");
}
const legacyTables = [
  "learner_profile",
  "learning_plan",
  "study_activity",
  "step_completion",
  "scope_event",
  "request_receipt",
];
function snapshot(database: Database.Database): unknown[] {
  return legacyTables.map((table) => database.prepare(`SELECT * FROM ${table}`).all());
}

test("populated v1/v2 additive migration preserves JSON, history, receipts and repeated startup", () => {
  for (const version of [1, 2]) {
    const { database, journey, clock } = fixture();
    try {
      const create = input();
      let detail = journey.create("u0", create);
      const stepId = detail.plan.steps[0]?.id ?? "";
      detail = journey.activity("u0", detail.plan.id, {
        requestId: randomUUID(),
        stepId,
        minutes: 5,
        reflection: "Private note",
      });
      detail = journey.complete("u0", detail.plan.id, {
        requestId: randomUUID(),
        stepId,
        revision: detail.plan.revision,
      });
      detail = journey.update("u0", detail.plan.id, { ...update(detail), steps: [] });
      dropV3(database);
      if (version === 1)
        database.exec(
          "DROP TABLE circle_receipt; DROP TABLE circle_encouragement; DROP TABLE circle_item; DROP TABLE circle_invite; DROP TABLE circle_member; DROP TABLE study_circle; DELETE FROM app_schema WHERE version=2;",
        );
      const before = snapshot(database);
      migrate(database);
      migrate(database);
      const rebooted = new JourneyStore(database, clock);
      assert.deepEqual(snapshot(database), before);
      assert.deepEqual(database.prepare("SELECT version FROM app_schema ORDER BY version").all(), [
        { version: 1 },
        { version: 2 },
        { version: 3 },
      ]);
      assert.equal("sources" in rebooted.detail("u0", detail.plan.id).plan, false);
      assert.equal(rebooted.detail("u0", detail.plan.id).completions.length, 1);
      assert.equal(rebooted.detail("u0", detail.plan.id).activities[0]?.reflection, "Private note");
      // A pre-upgrade receipt still hashes the same absent optional fields and replays its original JSON.
      const replay = rebooted.create("u0", createPlanInput(create));
      assert.equal(replay.plan.revision, 1);
      assert.equal("sources" in replay.plan, false);
      assert.equal(count(database), 0);
    } finally {
      database.close();
    }
  }
});

test("failed v3 upgrade rolls back its new table/indexes/version and rejects unsupported sequences", () => {
  const { database, journey } = fixture();
  try {
    journey.create("u0", input());
    dropV3(database);
    const before = snapshot(database);
    database.exec("CREATE TABLE ai_source_draft_expiry(dummy TEXT)");
    assert.throws(() => migrate(database));
    assert.equal(
      database.prepare("SELECT name FROM sqlite_master WHERE name='ai_source_draft'").get(),
      undefined,
    );
    assert.equal(
      database.prepare("SELECT name FROM sqlite_master WHERE name='ai_source_draft_owner'").get(),
      undefined,
    );
    assert.deepEqual(snapshot(database), before);
    assert.deepEqual(database.prepare("SELECT version FROM app_schema ORDER BY version").all(), [
      { version: 1 },
      { version: 2 },
    ]);
    database.exec("DROP TABLE ai_source_draft_expiry");
    migrate(database);
    database.exec("DELETE FROM app_schema WHERE version=2");
    assert.throws(() => migrate(database), /Unsupported/u);
  } finally {
    database.close();
  }
});

test("staged sources have bounded metadata, exact TTL and owner-scoped availability", () => {
  const { database, sources, advance, clock } = fixture();
  try {
    const known = source();
    assert.deepEqual(sources.stage("u0", [known]), [known]);
    const row = database
      .prepare("SELECT created_at,expires_at,body FROM ai_source_draft WHERE id=?")
      .get(known.id) as { created_at: string; expires_at: string; body: string };
    assert.equal(row.created_at, initial);
    assert.equal(row.expires_at, "2026-10-14T09:00:00.000Z");
    assert.deepEqual(JSON.parse(row.body), known);
    assert.deepEqual(sources.resolve("u0", [known.id]), [known]);
    code(() => sources.resolve("u1", [known.id]), "source_unavailable");
    code(() => sources.resolve("u0", [randomUUID()]), "source_unavailable");
    advance(24);
    code(() => sources.resolve("u0", [known.id]), "source_unavailable");
    new AiSourceStore(database, clock);
    assert.equal(count(database), 0);
    const oversized = {
      ...source(),
      url: `https://example.org/?q=${"😀".repeat(1000)}`,
      publisher: "example.org",
      languageHint: "unknown" as const,
    };
    code(() => sources.stage("u0", [oversized]), "invalid_input");
    assert.equal(count(database), 0);
  } finally {
    database.close();
  }
});

test("owner/global source quotas are atomic without eviction and expiry permits new staging", () => {
  const { database, sources, advance } = fixture();
  try {
    for (let index = 0; index < 10; index++)
      sources.stage("u0", Array.from({ length: 10 }, source));
    assert.equal(count(database), 100);
    code(() => sources.stage("u0", [source()]), "source_limit");
    assert.equal(count(database), 100);
    for (let owner = 1; owner < 10; owner++)
      for (let index = 0; index < 10; index++)
        sources.stage(`u${owner}`, Array.from({ length: 10 }, source));
    assert.equal(count(database), 1000);
    code(() => sources.stage("u10", [source()]), "source_limit");
    assert.equal(count(database), 1000);
    advance(24);
    sources.stage("u10", [source()]);
    assert.equal(count(database), 1);
  } finally {
    database.close();
  }
});

test("save resolves only owner-issued IDs, snapshots metadata and replays after consumption/expiry", () => {
  const { database, journey, sources, advance, clock } = fixture();
  try {
    const known = source();
    sources.stage("u0", [known]);
    const create = input([known]);
    code(() => journey.create("u1", create), "source_unavailable");
    assert.equal(count(database), 1);
    const saved = journey.create("u0", create);
    assert.deepEqual(saved.plan.sources, [known]);
    assert.deepEqual(saved.plan.steps[0]?.sourceIds, [known.id]);
    assert.equal(count(database), 0);
    advance(25);
    const rebooted = new JourneyStore(database, clock);
    assert.deepEqual(rebooted.create("u0", create), saved);
    code(() => rebooted.create("u0", { ...create, goal: "Changed" }), "idempotency_conflict");
    assert.deepEqual(rebooted.detail("u0", saved.plan.id).plan.sources, [known]);
    const edited = rebooted.update("u0", saved.plan.id, update(saved));
    assert.deepEqual(edited.plan.sources, [known]);
    assert.deepEqual(edited.plan.steps[0]?.sourceIds, [known.id]);
    code(
      () => rebooted.update("u0", saved.plan.id, { ...update(edited), references: [] }),
      "source_unavailable",
    );
    code(
      () => rebooted.update("u0", saved.plan.id, { ...update(edited), sourceIds: [randomUUID()] }),
      "source_unavailable",
    );
  } finally {
    database.close();
  }
});

test("failed saves roll back source consumption and unrelated plan/history writes", () => {
  const { database, journey, sources } = fixture();
  try {
    const known = source();
    sources.stage("u0", [known]);
    const create = input([known]);
    const first = create.steps[0];
    assert.ok(first);
    code(
      () => journey.create("u0", { ...create, references: ["https://example.org/different"] }),
      "source_unavailable",
    );
    code(
      () =>
        journey.create("u0", {
          ...create,
          steps: [{ ...first, sourceIds: [randomUUID()] }],
        }),
      "source_unavailable",
    );
    assert.equal(count(database), 1);
    assert.equal(journey.list("u0").length, 0);
    database.exec(
      "CREATE TRIGGER fail_ai_receipt BEFORE INSERT ON request_receipt BEGIN SELECT RAISE(ABORT,'synthetic receipt failure'); END;",
    );
    assert.throws(() => journey.create("u0", create), /synthetic receipt failure/u);
    assert.equal(count(database), 1);
    assert.equal(journey.list("u0").length, 0);
    database.exec("DROP TRIGGER fail_ai_receipt");
    assert.equal(journey.create("u0", create).plan.sources?.length, 1);
    assert.equal(count(database), 0);
  } finally {
    database.close();
  }
});

test("completed associations stay immutable and removed source snapshots remain in scope history", () => {
  const { database, journey, sources } = fixture();
  try {
    const known = source();
    sources.stage("u0", [known]);
    let detail = journey.create("u0", input([known]));
    const stepId = detail.plan.steps[0]?.id ?? "";
    detail = journey.activity("u0", detail.plan.id, {
      requestId: randomUUID(),
      stepId,
      minutes: 5,
      reflection: "Remember this",
    });
    detail = journey.complete("u0", detail.plan.id, {
      requestId: randomUUID(),
      revision: detail.plan.revision,
      stepId,
    });
    const edit = update(detail);
    const first = edit.steps[0];
    assert.ok(first);
    code(
      () =>
        journey.update("u0", detail.plan.id, {
          ...edit,
          steps: [{ ...first, sourceIds: [] }],
        }),
      "completed_step_immutable",
    );
    const preserved = journey.update("u0", detail.plan.id, update(detail));
    assert.deepEqual(preserved.plan.steps[0]?.sourceIds, [known.id]);
    const removed = journey.update("u0", detail.plan.id, {
      ...update(preserved),
      references: [],
      sourceIds: [],
      steps: [],
    });
    assert.deepEqual(removed.plan.sources, []);
    assert.equal(removed.activities.length, 1);
    assert.equal(removed.completions.length, 1);
    const before = database
      .prepare("SELECT before_json FROM scope_event WHERE plan_id=? ORDER BY rowid DESC LIMIT 1")
      .get(detail.plan.id) as { before_json: string };
    assert.deepEqual(JSON.parse(before.before_json).sources, [known]);
    assert.deepEqual(JSON.parse(before.before_json).steps[0].sourceIds, [known.id]);
  } finally {
    database.close();
  }
});

test("source/reference comparison normalizes tracking and fragments but preserves original strings", () => {
  const { database, journey, sources } = fixture();
  try {
    const known = {
      ...source(),
      url: "https://developer.mozilla.org/fr/docs/Web/HTML?mode=learn&utm_source=search#intro",
    };
    sources.stage("u0", [known]);
    const create = input([known]);
    create.references = [
      "https://developer.mozilla.org/fr/docs/Web/HTML?mode=learn&utm_campaign=user#page",
    ];
    const saved = journey.create("u0", create);
    assert.deepEqual(saved.plan.references, create.references);
    assert.deepEqual(saved.plan.sources, [known]);
    code(
      () =>
        journey.update("u0", saved.plan.id, {
          ...update(saved),
          references: ["https://developer.mozilla.org/fr/docs/Web/HTML?mode=other"],
        }),
      "source_unavailable",
    );
  } finally {
    database.close();
  }
});
