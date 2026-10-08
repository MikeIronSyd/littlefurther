# P06 Comeback backend research

8 October 2026, Africa/Lagos. Read-only production inspection against `e3a682f`; no application implementation or passing product acceptance is claimed by this report.

## Goal

Define the smallest backend/domain change for a revision-bound Comeback preview and atomic confirmation, retaining all completed work and the existing private learning journey.

## Context Pointers

- [Specification F06/F07 and AC06](../spec.md), [research R05](../research.md), and [first-journey contract](../increments/first-journey.md).
- [Shared contracts](../../../../src/shared/contracts.ts), [validation](../../../../src/domain/validation.ts), [calendar/progress functions](../../../../src/domain/progress.ts).
- [HTTP adapter](../../../../src/server/app.ts), [store/schema/receipt transactions](../../../../src/server/store.ts), [domain tests](../../../../tests/domain/journey.test.ts), [HTTP tests](../../../../tests/server/journey.test.ts).
- `project-context.json` confirms P04/P05 delivered and P06/P07 next. No requirement to add an AI service, different persistence engine or peer subsystem was found.

### Required research and actual findings

| Need | Status | Evidence and finding | Unresolved factual question |
| --- | --- | --- | --- |
| Exact schedule semantics | Satisfied | F06 selects unfinished active steps in learner order, anchors on the first such step rather than the earliest date, and applies one signed calendar-day offset. Nonchronological dates, same-day steps and their original relative spacing/order must be preserved. | None. |
| Date bounds and DST | Satisfied | `calendarDate` allows valid ISO dates from 2000-01-01 through 2100-12-31. Existing `addCalendarDays` uses UTC-noon calendar arithmetic. It does not validate its output bounds, so the new domain function must validate all proposed dates before returning success. | None. |
| Actual arithmetic feasibility | Satisfied | A one-off Node assertion experiment passed six cases: spring/fall DST calendar dates, leap day, backward year crossing, and both boundary overflows. Differences between UTC-noon date representations yield whole-day offsets. The last two deliberately produced 2101-01-01/1999-12-31, proving output validation is necessary. No production file or database changed. | None. |
| Preview/confirmation versioning | Satisfied | Plan changes and completions increment `revision`; activity does not. Profile locale/timezone updates do not change date strings or revision. Thus revision binds all fields that affect shift/conflicts. Preview can be stateless and re-derived from the stored plan at confirmation, without trusting client old/new dates. | None. |
| Ownership and atomicity | Satisfied | `plan(owner,id)` performs an owner-qualified read returning 404. `write` executes receipt lookup, action and receipt insertion in one SQLite immediate transaction. Confirmation can re-read owner-qualified plan and validate revision within this transaction. HTTP already requires session, same Host/Origin and JSON. | None. |
| Persistence/migration | Satisfied | The plan is versioned JSON in `learning_plan`; existing receipts persist saved `PlanDetail` responses. Schedule changes need no schema migration or persistent preview table. Existing activity/completion tables need no write. Scope events record scope changes, so a pure reschedule should not manufacture a scope event. | None. |
| Retry/conflict semantics | Satisfied | Existing receipt identity is `(owner_id,request_id)` plus operation and canonical parsed-input digest. Confirmation must use a new `comeback:<planId>` operation. Exact retries return the original saved result; changed content or operation returns 409. A fresh request against an older revision returns 409. | None. |
| Five-minute restart | Satisfied | Existing `/activities` accepts bounded integer minutes, snapshots optional private reflection and does not complete a step or increment plan revision. The new UI can use this existing endpoint with minutes 5 after explicit learner action; no special backend inference or coupled schedule write is required. | None. |

All backend research needs are satisfied for the scoped increment. The contract choices below incorporate root's explicit routine implementation decisions, not missing external facts. Production remains unchanged until the root closes the combined research gate and assigns implementation.

## Constraints

### Proposed exact contract and boundaries

Add shared serializable types:

```ts
interface ComebackPreviewInput { revision: number; restartDate: string }
interface ComebackConfirmInput extends ComebackPreviewInput { requestId: string }
interface ComebackDateChange {
  stepId: string;
  title: string;
  previousDate: string;
  proposedDate: string;
}
interface ComebackPreview {
  planId: string;
  revision: number;
  restartDate: string;
  shiftDays: number;
  changes: ComebackDateChange[];
  conflicts: PlanConflict[];
}
```

The client already holds plan detail, so no owner ID, private activity or reflection belongs in preview output. Use the server's current plan title/date snapshots. Root may choose fuller display metadata in the final contract; do not duplicate learner history in a receipt unnecessarily.

- `POST /api/plans/:id/comeback/preview`: strict `{revision,restartDate}`; owner-qualified read, reject stale revision, return `ComebackPreview`; no mutation, receipt or reservation. Reject all-complete/empty plans with 409 `no_unfinished_steps`. Preview is read-only despite POST, so the date does not enter the URL.
- `POST /api/plans/:id/comeback/confirm`: strict `{requestId,revision,restartDate}`; exact same owner check and existing idempotent write helper; inside the transaction re-read plan, validate revision, regenerate proposed changes and validate every resulting date, update only unfinished `scheduledDate` fields and increment revision/update timestamp once; return `PlanDetail`. Do not accept client-supplied changes or conflicts.
- New pure domain module `src/domain/comeback.ts` computes offset and proposed dates without imports from DOM, Express, SQLite or authentication.
- Validation additions reuse strict keys, UUID, positive revision and `calendarDate`. Proposed out-of-range date: 400 `schedule_out_of_range`, field `restartDate`; show an actionable error rather than clamp or partially apply.
- Root decision: preview zero shift as normal (all old/new dates equal), disable Apply in the UI, and let a direct confirmation return unchanged `PlanDetail`, saving only an idempotency receipt. No revision, timestamp or event changes. This permits a harmless no-op while preventing meaningless revision increments; it is consistent with F06/F07.
- Root decision: preview `conflicts` only for proposed unfinished rows, using unchanged availability/target values. Current detail may still show pre-existing conflicts on completed steps separately. The UI requires an explicit conflict acknowledgement checkbox before confirming visible conflicts; the server need not receive an extra acknowledgement field because revision/restart determines the proposal exactly. A conflict does not silently move availability or the fixed target. This is consistent with existing editable-plan acceptance.
- Root decision: stale confirmation returns 409; the client fetches current detail and requires a new preview. It never automatically confirms against the new revision.
- No migration, dependency/package change, auth change, separate five-minute route or new event table is necessary. Existing completed snapshots, activity, scope events and current total remain byte-for-byte unchanged by rescheduling.

### Cases that must not be lost

- Empty/all-complete plans; completed steps before/between/after unfinished ones; archived step history; exact zero shift; negative shift; unchanged order even when learner dates are unsorted.
- Leap/month/year changes; DST spring/fall dates; multiple timezones do not affect date-only shift. Validate each proposed date against the existing 2000–2100 bound, including a valid restart that would push another step outside it.
- Fixed-target and availability conflicts can both apply to one step. Preserve both warnings and do not compact or skip unavailable dates.
- Preview has no state mutation. Cancel means no confirmation request. Repeated previews do not consume a request ID or increment revision.
- A plan edit/completion after preview invalidates confirmation. Activity and language/timezone changes leave schedule revision valid. At confirmation re-read current plan to avoid overwriting newer profile preferences or activities.
- Two concurrent confirmations with distinct request IDs and the same revision yield one success and one stale conflict. Same request ID and same body yields one mutation and repeatable result. New request ID is required after intentional date/revision changes; retried network failures retain the original body/key.
- A saved receipt contains its original response even if later changes occur; this is existing behavior. Client should refresh detail after resolving an uncertain retry rather than treat the replay as a new schedule write.
- Cross-owner preview/confirmation returns 404 before any receipt disclosure; anonymous callers return 401. Invalid dates/unknown keys/forged dates or ownership fields fail validation. Host/Origin/content-type defenses remain enabled.

## Done When

Research is ready for root consolidation. Implementation completion requires actual evidence, not this report:

1. Pure domain tests cover exact offsets/order/spacing, completed immutability, input immutability, both conflict kinds, empty/all-complete/zero shift, positive/negative/leap/DST-date shifts, and both overflow directions.
2. HTTP tests verify preview/cancel nonmutation, atomic confirmation, original history/count/target/availability preservation, private ownership, stale-after-edit/completion, concurrent confirmation, exact replay/conflicting replay, invalid fields and output overflow with no partial writes.
3. Existing five-minute path is exercised after Comeback: adds 5 learner-reported minutes, preserves schedule revision and completion count, remains private and idempotent.
4. Persisted readback after close/reopen confirms only intended dates/revision changed. Root's separate process/browser checks provide broader evidence; an in-process reopen is not called a process restart.
5. Scoped compiler/tests/lint/format pass before root aggregation. Exact commands: `pnpm exec tsc -p tsconfig.tests.json`, `node --test .local/test-build/tests/domain/comeback.test.js .local/test-build/tests/server/comeback.test.js`, and `pnpm exec biome lint --error-on-warnings src/shared src/domain src/server tests/domain tests/server`. Root runs canonical full checks and meaningful browser behavior.
