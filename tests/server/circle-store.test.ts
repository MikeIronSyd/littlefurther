import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import Database from "better-sqlite3";
import { DomainError } from "../../src/domain/validation.js";
import { CircleStore } from "../../src/server/circles.js";
import { JourneyStore, migrate } from "../../src/server/store.js";

const now = () => new Date("2026-10-08T10:00:00.000Z");
const request = () => ({ requestId: randomUUID() });
function fixture(): { database: Database.Database; circles: CircleStore } {
  const database = new Database(":memory:");
  database.pragma("foreign_keys=ON");
  database.exec("CREATE TABLE user(id TEXT PRIMARY KEY,name TEXT NOT NULL)");
  for (let i = 0; i < 14; i++)
    database.prepare("INSERT INTO user VALUES(?,?)").run(`u${i}`, `User ${i}`);
  migrate(database);
  return { database, circles: new CircleStore(database, now) };
}
function expectCode(action: () => unknown, code: string): void {
  assert.throws(action, (error: unknown) => error instanceof DomainError && error.code === code);
}
function v1(database: Database.Database): void {
  database.exec(
    "DROP TABLE ai_source_draft; DROP TABLE circle_receipt; DROP TABLE circle_encouragement; DROP TABLE circle_item; DROP TABLE circle_invite; DROP TABLE circle_member; DROP TABLE study_circle; DELETE FROM app_schema WHERE version IN (2,3);",
  );
}

test("fresh/repeated current migration and populated v1 upgrade preserve every private row", () => {
  const { database } = fixture();
  try {
    assert.deepEqual(database.prepare("SELECT version FROM app_schema ORDER BY version").all(), [
      { version: 1 },
      { version: 2 },
      { version: 3 },
    ]);
    const journey = new JourneyStore(database, now);
    journey.saveProfile("u0", { locale: "en", timezone: "Africa/Lagos" });
    let detail = journey.create("u0", {
      ...request(),
      goal: "Private goal",
      templateId: null,
      references: ["https://example.org/private"],
      availabilityDates: ["2026-10-08"],
      targetDate: null,
      steps: [{ title: "Private step", scheduledDate: "2026-10-08", estimatedMinutes: 5 }],
    });
    const stepId = detail.plan.steps[0]?.id;
    assert.ok(stepId);
    detail = journey.activity("u0", detail.plan.id, {
      ...request(),
      stepId,
      minutes: 5,
      reflection: "Private reflection",
    });
    detail = journey.complete("u0", detail.plan.id, { ...request(), stepId, revision: 1 });
    detail = journey.update("u0", detail.plan.id, {
      ...request(),
      revision: detail.plan.revision,
      goal: detail.plan.goal,
      references: detail.plan.references,
      availabilityDates: detail.plan.availabilityDates,
      targetDate: detail.plan.targetDate,
      steps: [],
    });
    const tables = [
      "learner_profile",
      "learning_plan",
      "study_activity",
      "step_completion",
      "scope_event",
      "request_receipt",
    ];
    const before = tables.map((table) => database.prepare(`SELECT * FROM ${table}`).all());
    // Seed using the current writer, then remove only synthetic newer tables to
    // exercise an actual populated legacy schema without a current-store constructor.
    v1(database);
    migrate(database);
    migrate(database);
    assert.deepEqual(
      tables.map((table) => database.prepare(`SELECT * FROM ${table}`).all()),
      before,
    );
    assert.deepEqual(journey.detail("u0", detail.plan.id), detail);
    assert.deepEqual(database.pragma("foreign_key_check"), []);
  } finally {
    database.close();
  }
});

test("failed additive migration rolls back and unsupported/noncontiguous schemas fail", () => {
  const { database } = fixture();
  try {
    const journey = new JourneyStore(database, now);
    journey.saveProfile("u0", { locale: "en", timezone: "UTC" });
    journey.create("u0", {
      ...request(),
      goal: "Retain during migration failure",
      templateId: null,
      references: [],
      availabilityDates: ["2026-10-08"],
      targetDate: null,
      steps: [{ title: "Retained step", scheduledDate: "2026-10-08", estimatedMinutes: 5 }],
    });
    const tables = ["learner_profile", "learning_plan", "request_receipt"];
    const before = tables.map((table) => database.prepare(`SELECT * FROM ${table}`).all());
    v1(database);
    database.exec("CREATE TABLE circle_member(marker TEXT)");
    assert.throws(() => migrate(database));
    assert.equal(
      database.prepare("SELECT name FROM sqlite_master WHERE name='study_circle'").get(),
      undefined,
    );
    assert.deepEqual(database.prepare("SELECT version FROM app_schema").all(), [{ version: 1 }]);
    assert.deepEqual(
      tables.map((table) => database.prepare(`SELECT * FROM ${table}`).all()),
      before,
    );
    database.exec("DROP TABLE circle_member; INSERT INTO app_schema VALUES(3)");
    assert.throws(() => migrate(database), /Unsupported application schema/u);
    database.exec("DELETE FROM app_schema; INSERT INTO app_schema VALUES(2)");
    assert.throws(() => migrate(database), /Unsupported application schema/u);
  } finally {
    database.close();
  }
});

test("capacities and failed redemption preserve an invitation for a valid later join", () => {
  const { database, circles } = fixture();
  try {
    const id = circles.create("u0", { ...request(), name: "Primary" }).circleId;
    for (let i = 0; i < 4; i++) circles.create("u0", { ...request(), name: `Extra ${i}` });
    expectCode(() => circles.create("u0", { ...request(), name: "Too many" }), "circle_limit");
    const limitedInvite = circles.createInvite("u0", id, request());
    assert.ok(limitedInvite.token);
    for (let i = 0; i < 5; i++) circles.create("u1", { ...request(), name: `Peer ${i}` });
    expectCode(
      () => circles.redeem("u1", { ...request(), token: limitedInvite.token ?? "" }),
      "circle_limit",
    );
    assert.equal(circles.invites("u0", id)[0]?.status, "active");
    for (let i = 2; i <= 10; i++) {
      const invite = circles.createInvite("u0", id, request());
      assert.ok(invite.token);
      circles.redeem(`u${i}`, { ...request(), token: invite.token });
    }
    expectCode(
      () => circles.redeem("u11", { ...request(), token: limitedInvite.token ?? "" }),
      "member_limit",
    );
    const remove = circles
      .detail("u0", id)
      .members.find((member) => member.displayName === "User 2");
    assert.ok(remove);
    circles.remove("u0", id, remove.id, request());
    circles.redeem("u11", { ...request(), token: limitedInvite.token });
    assert.equal(circles.detail("u0", id).members.length, 10);
    for (let i = 0; i < 10; i++) circles.createInvite("u0", id, request());
    expectCode(() => circles.createInvite("u0", id, request()), "invite_limit");
    const active = circles.invites("u0", id)[0];
    assert.ok(active);
    circles.revokeInvite("u0", id, active.id, request());
    assert.ok(circles.createInvite("u0", id, request()).token);
    for (let i = 0; i < 100; i++)
      circles.share("u0", id, { ...request(), kind: "commitment", text: `Copy ${i}` });
    expectCode(
      () => circles.share("u0", id, { ...request(), kind: "check_in", text: "Full" }),
      "shared_item_limit",
    );
    const item = circles.detail("u0", id).items[0];
    assert.ok(item);
    circles.deleteItem("u0", id, item.id, request());
    circles.share("u0", id, { ...request(), kind: "check_in", text: "Freed capacity" });
    assert.equal(circles.detail("u0", id).items.length, 100);
    assert.deepEqual(database.pragma("foreign_key_check"), []);
  } finally {
    database.close();
  }
});

test("database failure after joining rolls back membership, token consumption and receipt", () => {
  const { database, circles } = fixture();
  try {
    const id = circles.create("u0", { ...request(), name: "Atomic join" }).circleId;
    const invite = circles.createInvite("u0", id, request());
    assert.ok(invite.token);
    const join = { ...request(), token: invite.token };
    database.exec(`CREATE TRIGGER fail_join_receipt BEFORE INSERT ON circle_receipt
      BEGIN SELECT RAISE(ABORT, 'synthetic receipt write failure'); END;`);
    assert.throws(() => circles.redeem("u1", join), /synthetic receipt write failure/u);
    assert.equal(circles.detail("u0", id).circle.memberCount, 1);
    assert.equal(circles.invites("u0", id)[0]?.status, "active");
    assert.deepEqual(
      database
        .prepare("SELECT count(*) AS count FROM circle_receipt WHERE request_id=?")
        .get(join.requestId),
      { count: 0 },
    );
    database.exec("DROP TRIGGER fail_join_receipt");
    assert.equal(circles.redeem("u1", join).circleId, id);
    assert.equal(circles.detail("u0", id).circle.memberCount, 2);
    assert.deepEqual(database.pragma("foreign_key_check"), []);
  } finally {
    database.close();
  }
});
