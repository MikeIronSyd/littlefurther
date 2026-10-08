# P06 — Comeback schedule recovery

8 October 2026, Africa/Lagos. Written before production edits. Root baseline strict compilation and all 20 domain/HTTP tests passed. Research R16 is closed for this increment using the two linked source-inspection reports; no open factual or consequential decision remains for P06.

## Goal

Extend the delivered private learning journey with an explicit, reversible-before-confirmation restart preview. A learner chooses a new start date, sees exactly which unfinished dates would move and any conflicts, then cancels or confirms. Preserve completed work, private reflection, cumulative effort, plan order, availability and the fixed target. Five-minute study remains a separate action and never marks the whole step complete.

This implements F06/F07 and AC06 of the [parent specification](../spec.md). P07 private peer circles remains the next separate increment; all five capabilities remain required.

## Context Pointers

- Parent [plan](../plan.md), [research](../research.md), [first-journey contract](first-journey.md), and [first-journey verification](first-journey-verification.md). Baseline source is commit `e3a682f14f6e9172efe2ec8ef91fc671e77163ba`.
- [Backend research](../reviews/2026-10-08-comeback-backend-research.md) establishes calendar arithmetic, revision/receipt transactions, ownership and existing persistence boundaries. Its six isolated arithmetic assertions are feasibility evidence, not product acceptance.
- [UI research](../reviews/2026-10-08-comeback-ui-research.md) establishes the current entry point, responsive/date/localization patterns and failure handling needs.
- The existing [Comeback reference](../../../../.impeccable/mocks/amber/comeback-preview.png) precedes frontend work. Its sidecar remains approved:false; the user's selected Amber world and existing authorization remain settled. This is an extension of the current Operate surface, with no identity/design-choice round.
- [Shared contracts](../../../../src/shared/contracts.ts), [store](../../../../src/server/store.ts), [HTTP adapter](../../../../src/server/app.ts), [current client](../../../../src/client/main.ts). Keep the selected stack and current schema.

## Constraints

### Research closure and settled choices

R16 covers actual source integration, calendar bounds, revision/receipt semantics, UI state lifecycle, reference availability, verification tooling and migration needs. Both source research reports have no unresolved factual blocker. Existing R01–R15 decisions still apply. Root resolved routine choices below from the existing behavior; no new user answer or approval is needed. Reopen research if implementation reveals a consequential unknown.

### Contract and algorithm

```ts
interface ComebackPreviewInput { revision: number; restartDate: string }
interface ComebackConfirmInput extends ComebackPreviewInput { requestId: string }
interface ComebackDateChange {
  stepId: string; title: string; previousDate: string; proposedDate: string;
}
interface ComebackPreview {
  planId: string; revision: number; restartDate: string; shiftDays: number;
  changes: ComebackDateChange[]; conflicts: PlanConflict[];
}
```

`comebackPreview(plan,restartDate)` is a pure domain function. Select only unfinished active steps in existing learner order; anchor on the first such step, not the earliest date. Compute the signed difference between UTC representations of those calendar dates and add that same number of calendar days to every selected step. Preserve relative spacing, including same-day and nonchronological order. Validate every resulting date against the existing 2000-01-01–2100-12-31 range before returning a result. No timezone/DST hour arithmetic is applied to date-only schedules.

Preview conflicts concern only proposed unfinished dates: `unavailable_date` when absent from the unchanged availability list and `after_target` when later than the unchanged fixed target. Preserve both conflicts when applicable; do not compress, skip dates, expand availability or move a real deadline.

| Route | Input/output and behavior |
| --- | --- |
| POST `/api/plans/:id/comeback/preview` | Strict `ComebackPreviewInput`; authenticated owner read; matching revision required; returns `ComebackPreview`. No mutation, receipt or reservation. |
| POST `/api/plans/:id/comeback/confirm` | Strict `ComebackConfirmInput`; owner qualification before receipt disclosure; existing receipt transaction using `comeback:<planId>` operation. Re-read current plan/revision and rederive dates inside the immediate transaction. Return `PlanDetail`. |

Unknown fields, forged dates/conflicts/owner IDs, invalid UUID/revision/date and existing request-size/origin/Host constraints remain rejected. Error codes: existing `invalid_input`400, `stale_revision`409, `idempotency_conflict`409, `not_found`404, `unauthenticated`401 and persistence errors; new `no_unfinished_steps`409 and `schedule_out_of_range`400 (`restartDate` field). Client must distinguish these states instead of mapping every409 to stale.

On nonzero confirmation update only unfinished scheduled dates, increment revision once and update timestamp. Do not manufacture a scope event. Completed step fields and all activity/completion/scope history remain unchanged. Re-read current profile preferences to preserve locale/timezone changes that did not alter schedule revision. Activities remain compatible with a preview, while plan edits/completion invalidate it.

Zero-day preview is valid with unchanged date rows; UI explains and disables confirmation. A direct zero-day confirmation returns unchanged plan detail without changing revision/timestamp/history, with only its idempotency receipt persisted. Exact retries return the saved response and never reapply the shift; reuse with different content/operation fails409. A fresh confirmation at an old revision fails409. After an uncertain successful retry the client refreshes current detail, because receipt responses represent the original operation, not necessarily the latest plan state.

No dependency, authentication setting, schema migration, new event table or remote service is needed. Profile/account/private database boundaries remain unchanged.

### Interface and failure states

Extend `.return-support` with **Review restart dates** when unfinished steps exist. Retain the existing five-minute action. Open a `comeback.ts` subview within the learning route, using the existing Amber shell and semantic tokens. No new navigation destination. Use the existing input/button/focus/notice helpers and safe text rendering; no new visual world or stock assets.

Initial restart date is today's calendar date in the learner's selected timezone, obtained from `PlanDetail.progress.rangeEnd`. It is a suggestion in an editable native date input, never an automatically applied schedule. Explicit preview is required. Display plan goal, timezone, retained completion/history summary, then ordered step/title/current/proposed date rows and conflicts. Use an ordered list with semantic date descriptions that aligns on desktop and stacks at320px. Render actual values, not the mock's synthetic counts.

Preview success focuses its heading; errors focus a named status. Editing restart date immediately invalidates the old preview and conflict acknowledgement. Confirmation requires a nonzero current preview; when conflicts exist, an explicit acknowledgement checkbox is required. It is a client confirmation of visible information, not a new authorization mechanism. Allow return to the existing plan editor to revise availability/target manually. Cancel never calls the confirmation endpoint.

Keep native keyboard controls, EN/FR labels/errors/date formatting, dark/light tokens, top brand and exact sidebar icons. Locale/theme changes retain input and preview. Freeze form controls during a request; prevent repeated submission; guard callbacks when their root view has been detached by navigation. Do not replace another screen with a late result.

Transport/uncertain confirmation failure preserves the exact body/request ID and preview. Explain that the result may have saved; offer a safe same-request retry or return/refresh. Do not falsely promise that no mutation occurred after a lost response. Stale confirmation clears applicability and requires an explicit refresh/re-preview against the latest plan; never auto-apply. If all work becomes complete, show the resulting no-schedule state. Bounds errors retain the date for correction. Normal cancel/return may discard a non-mutating preview without a separate confirmation gate.

### Quality contract, ownership and ordered work

1. Root closes research and writes this contract before edits; backend agent owns shared types/domain/validation/store/routes and its domain/HTTP tests.
2. Frontend agent owns `comeback.ts`, narrow main/journey integration, EN/FR keys and scoped CSS after contract/type agreement. Preserve unrelated state and layout.
3. Root owns new browser acceptance tests and full aggregate checks. Add tests for learner outcomes/failure paths, not DOM implementation trivia. Existing suite remains regression coverage.
4. Independent agent applies `learning-journey-review`; fresh visual review checks desktop/light-dark/mobile captures in one batch, with one correction/confirmation batch if needed. No fake formal Impeccable receipts; retain the earlier unfinished phase boundary. Documentation comparison preserves the incumbent design system.
5. Use `capstone-evidence-update` for actual results, normal Git publication/readback on both private repositories, and saved readback in Miva Sheets/Kaneo. E008 uniqueness must be checked before writing. No global recovery action, paid service, external message or capstone submission.

Exact aggregate commands: `pnpm run check`, `pnpm run lint`, `pnpm run format:check`, `pnpm run build`, `pnpm test`, `pnpm run verify:process`, `pnpm run test:e2e`, `pnpm run audit`. Baseline check/test passed before edits; new checks remain pending. Capture actual failed/skipped checks as well as corrected results. Run the browser suite on installed Edge with synthetic isolated accounts, preserving auth rate limits and real learner data.

## Done When

| ID | Observable acceptance evidence |
| --- | --- |
| CB01 | Exact signed shift preserves order/spacing; completed/archived history, availability and target remain unchanged. Pure tests cover positive/negative/zero shifts, leap/DST dates, unsorted/same-day rows, empty/all-complete and both output bounds. |
| CB02 | Preview and cancel do not mutate. Confirm atomically applies current revision once; stale plan/completion, exact/conflicting retry, owner/anonymous and concurrent confirmation cases are checked. Invalid output leaves the whole plan unchanged. |
| CB03 | EN/FR UI presents exact dates, retained effort and both conflict types; explicit acknowledgement, zero-shift and unavailable states work.320px reflow, light/dark, keyboard/focus and locale/unsaved input preservation are inspected. |
| CB04 | Failed/uncertain saves retain retry identity and honest copy; changed input invalidates preview; stale data requires regeneration; navigation during pending results does not overwrite a new view. |
| CB05 | Confirmed schedule survives reload and persistence checks; five-minute study adds activity without completing a step. Existing private journey remains passing. |
| CB06 | Actual review/checks and limits recorded, both remote heads verified, tracker writes compared with saved state. Full peer system, learner benefit/adoption and timed video remain separate outstanding milestones. |

Verification and remaining limitations will be recorded in `comeback-verification.md` after actual execution. This document is a contract, not a claim of implementation or acceptance.
