import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import {
  circleEncouragementInput,
  circleRequestInput,
  createCircleInput,
  redeemCircleInviteInput,
  shareCircleItemInput,
} from "../../src/domain/circle-validation.js";
import { DomainError } from "../../src/domain/validation.js";

test("circle input normalizes approved text and rejects hidden private fields", () => {
  const requestId = randomUUID();
  assert.deepEqual(createCircleInput({ requestId, name: "  Study circle  " }), {
    requestId,
    name: "Study circle",
  });
  assert.deepEqual(
    shareCircleItemInput({ requestId, kind: "check_in", text: "  <script>literal</script>  " }),
    { requestId, kind: "check_in", text: "<script>literal</script>" },
  );
  for (const extra of ["userId", "planId", "stepId", "reflection", "references", "createdAt"])
    assert.throws(
      () =>
        shareCircleItemInput({
          requestId,
          kind: "commitment",
          text: "Approved",
          [extra]: "private",
        }),
      DomainError,
    );
  for (const value of [null, [], "text", 123])
    assert.throws(() => circleRequestInput(value), DomainError);
});

test("circle bounds, token syntax, UUIDs and preset enum are strict", () => {
  const requestId = randomUUID();
  for (const name of ["", " ", "x".repeat(81), "control\u0001"])
    assert.throws(() => createCircleInput({ requestId, name }), DomainError);
  assert.equal(createCircleInput({ requestId, name: "x".repeat(80) }).name.length, 80);
  for (const text of ["", "x".repeat(281), "control\u0000"])
    assert.throws(() => shareCircleItemInput({ requestId, kind: "commitment", text }), DomainError);
  assert.equal(
    shareCircleItemInput({ requestId, kind: "commitment", text: "x".repeat(280) }).text.length,
    280,
  );
  assert.throws(
    () => shareCircleItemInput({ requestId, kind: "chat", text: "Hello" }),
    DomainError,
  );
  for (const token of [
    "",
    "a".repeat(42),
    "a".repeat(44),
    `${"a".repeat(42)}!`,
    ` ${"a".repeat(43)}`,
  ])
    assert.throws(() => redeemCircleInviteInput({ requestId, token }), DomainError);
  assert.equal(redeemCircleInviteInput({ requestId, token: "a".repeat(43) }).token.length, 43);
  for (const preset of ["keep_going", "small_steps_count", "glad_you_returned"])
    assert.equal(circleEncouragementInput({ requestId, preset }).preset, preset);
  for (const preset of [null, "", "free chat", 1])
    assert.throws(() => circleEncouragementInput({ requestId, preset }), DomainError);
  assert.throws(() => circleRequestInput({ requestId: "user-id" }), DomainError);
  assert.throws(
    () => circleEncouragementInput({ requestId, preset: "keep_going", text: "extra" }),
    DomainError,
  );
});
