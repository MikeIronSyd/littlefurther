# Learning lifecycle controls

## Goal

Implement Michael's 15 October 2026 combined plan: plan archive/view/restore/delete; study-session deletion and reflection-only removal; visible completion corrections; removed-step recovery with selected historical links; own encouragement withdrawal. All are one coordinated increment. Keep the earlier uncommitted planning-calendar work intact.

## Context Pointers

Sources inspected in Plan Mode and before implementation: `src/server/store.ts`, `circles.ts`, `ai-assistance.ts`, `ai-sources.ts`, `src/domain/progress.ts`, validation/contracts, client main/journey/plan-editor/circle, existing server/browser tests and USER_GUIDE. User selected full learning controls, correction history retained, and preview-and-choose historical links. Incumbent Amber, English/French and Impeccable/accessibility guidance apply.

### R44 research ledger — complete before production edits

| Need | Finding/evidence | State |
| --- | --- | --- |
| Ownership/data relationships | Plan JSON plus activity/completion/scope children; FKs do not cascade. Scope before_json includes step/resource snapshots, not study reflections. Circle copies are independent. Source and two read-only agent inventories inspected | Complete |
| Privacy/retry copies | request_receipt stores full PlanDetail; old create retries could resurrect if keys were erased. New receipts become content-free plan references; privacy removal converts matching legacy snapshots in the same transaction | Complete |
| Concurrency | Existing activity writes do not increment revision. A count is unsafe after delete+add. Advance/check revision on all learner-content writes, including study recording | Complete |
| Restore feasibility | Newest-first scope snapshots identify latest removed IDs. Reconstruct only step/resource data; current completion ledger controls completed state. No historical activities/reflections are replayed | Complete |
| Resource provenance/limits | Associated source snapshots are trusted owner history; expired AI staging is irrelevant. Manual links are plan-wide. User chose associated sources plus optional initially-unselected historical links. Existing 50-step/10-link/source limits remain | Complete |
| Completion policy | User chose visible corrections excluded from totals. Old events remain; recompletion creates a new event. Correcting older events must not clear newer completion | Complete |
| Circle withdrawal | Existing metadata receipts prevent duplicate reapplication. Own encouragement ID must rotate on a fresh update so stale withdrawal cannot remove newer encouragement | Complete |
| Legacy/platform | Existing JSON columns permit backward-compatible metadata with no new table. Isolated installed SQLite 3.53.4 json_extract experiment passed during planning. No provider call or ordinary learner mutation | Complete |
| UX/lifecycle | Existing inline circle confirmations, 44px targets, focus/session/dirty guards and localizable bindings are reusable. Desktop/mobile reference must be rendered/inspected before frontend edits | Resolved design; reference gate precedes frontend edits |

No unresolved consequential choice remains. No account deletion or reversible circle archive is included; existing closed-circle content was already deleted.

## Constraints and quality contract

### Interfaces and data

- LearningPlan gains optional stored `archivedAt`; missing means null/active. CompletionEvent gains optional `correctedAt`; missing means effective. ScopeEvent gains optional kind `edit|restore` and restoredStepId. Normalize legacy reads.
- `PlanActionInput={requestId,revision}`. All new plan actions use this; ActivityInput also requires revision. `RestoreStepInput` additionally carries `scopeEventId`, selected `references:string[]`, `acknowledgeConflicts:boolean`.
- `RemovedStep={step,scopeEventId,removedAt,sources,references,conflicts}`; `GET /api/plans/:id/removed-steps` returns `{steps:RemovedStep[]}`. No client-supplied title/source/completion snapshot is trusted.
- `GET /api/plans?status=active|archived`, active default; internal all-plan enumeration preserves profile locale/timezone sync.
- POST plan actions `/archive`, `/restore`, `/delete`; first two return current PlanDetail, deletion returns `{deletedPlanId}`.
- POST `/api/plans/:id/activities/:activityId/delete`, `/activities/:activityId/reflection/remove`, `/completions/:completionId/correct`, `/steps/:stepId/restore` return current PlanDetail.
- POST `/api/circles/:id/items/:itemId/encouragement/withdraw` accepts `{requestId,encouragementId}` and returns `{ok:true}`.
- Authenticate and owner-scope every read/write. Existing Host/Origin/strict JSON guards remain. Archived plan details/history/removed-step candidates are readable but all content writes and saved-plan AI are blocked until restore. Missing/foreign resources404, stale/lifecycle conflicts409, invalid input400.
- Archive/restore and every learner-content/history mutation advance revision once, including saved sessions; retries do not advance it. Profile presentation updates keep their existing behavior.
- New journey receipts store minimal plan references, not snapshots; exact replay checks owner/current lifecycle and returns current authorized detail without rerunning actions. Legacy snapshots are read compatibly by extracting their plan ID. Before session/reflection/whole-plan deletion, convert every matching legacy receipt to content-free metadata atomically. Whole-plan retry tombstones prevent old creation from recreating data; exact delete retry returns the acknowledgement. Conflicting keys409.
- Whole-plan deletion removes plan, study_activity, step_completion and scope_event rows in one immediate transaction. Preserve unrelated plans/profile/source drafts and circle data. No secure-erasure/provider-recall/backup-purge claim.
- Completion correction targets an exact uncorrected event, sets correctedAt and clears active completedAt only if that event is the current completion. Retained removed-step completions can be corrected without restoring the step. Cumulative totals omit corrected events; study totals do not change.
- Removed candidates: newest-first scope snapshots, exclude active IDs, deduplicate IDs. Restore validates latest scopeEventId and revision, appends the original ID/title/date/estimate, derives completion from the current uncorrected ledger, merges associated historical sources plus chosen candidate links, and records a restore scope event. No fetching/staging or recreation of deleted sessions/reflections. Keep current links/metadata, deduplicate normalized URLs, reject inconsistent source IDs or limits without partial changes. Present and acknowledge current availability/target conflicts; do not reschedule.
- Encouragement withdrawal is current-member/sender-only and targets the current ID. Fresh preset updates rotate ID. Replays neither re-add withdrawn encouragement nor remove deliberate re-additions.

### UI and failure handling

Journeys has Active/Archived selection even with zero active plans. Active entries Open/Archive/Delete permanently; archived View/Restore/Delete permanently. Archived view shows step/resources/progress/history read-only. Restore opens My learning preserving dates. Archive/delete use inline contextual confirmations; deletion fetches current details, shows name and counts, and requires unchecked acknowledgement. Activity session/reflection removals and completion corrections have contextual confirmations. Corrected events are explicitly labelled; removed-step correction does not put the step back in the path.

Removed steps appear per plan with restoration preview and optional historical-link checkboxes initially unchecked. Mark schedule conflicts visibly and require acknowledgement. Own encouragement removal is a labelled action with status; re-add remains possible. Preserve existing circle lifecycle controls.

Use native controls,44px targets, visible focus, English/French bindings and the incumbent secondary hover-border treatment. Cancel restores trigger focus; success focuses next logical row/heading. Lock against duplicate writes, retain confirmation/draft state on failure, offer same-key retry and saved-state refresh for uncertain results; never let late responses overwrite a changed view/session. Selecting/removing the final plan must clear stale selection. Respect dirty-state guards, cancel competing AI on accepted navigation/mutations and handle401 through existing auth cleanup.

### Verification and boundaries

Required: `pnpm --pm-on-fail=download run verify`, focused lifecycle server/browser tests, bounded desktop/mobile EN/FR/light/dark/enlarged keyboard review, and independent learning-journey-review. Isolated synthetic data and mocked AI only; no ordinary learner records or live provider requests. No dependency/table/hosting change. Do not commit, amend, push or write shared trackers without Michael's explicit approval of concrete content/destinations. Preserve existing unrelated AGENTS.md changes and ignored video material.

## Acceptance and implementation sequence

| ID | Observable acceptance |
| --- | --- |
| LC01 | Active/archived listing, readonly archive view, restore and last-plan deletion work with correct selection/focus and legacy plans |
| LC02 | Session deletion recalculates study totals only; reflection removal preserves all other fields; no private plaintext survives matching receipt snapshots/replays |
| LC03 | Correction history remains visible, totals exclude corrected completions, newer completion cannot be cleared, removed corrected step restores unfinished |
| LC04 | Latest removed step restores once with identity/date/source provenance, chosen links, conflict acknowledgement and existing limits; removed study text never returns |
| LC05 | Own encouragement withdraw/update/re-add and retries respect sender/current membership/current ID; existing circle lifecycle remains intact |
| LC06 | Ownership, strict input, revision races, rollback/restart, archived guards, safe retry and delayed mocked AI are verified |
| LC07 | Precode references, actual UI review, required checks and independent review have honest evidence; shared publication remains separately approval-gated |

1. Save this contract/R44 and render/inspect scoped light/dark desktop/320px references before frontend edits.
2. Implement contract/store/privacy/revision/API and domain checks; independently implement circle withdrawal under shared interfaces.
3. Integrate native localized UI actions and archived/removed views with existing lifecycle guards.
4. Add meaningful success/failure/concurrency/replay tests; migrate prior activity-revision/replay expectations to the new explicit contract.
5. Run focused and required checks, bounded actual UI review and independent review; fix blockers and record results.
6. Update guide/spec/context/design evidence and prepare local tracker/publication drafts for later approval.

## Done When

LC01–LC07 have actual results or explicitly reported unresolved checks. This record is implementation authorization, not approval for a commit, push, shared write, real learner deletion or a claim of learning effectiveness.
