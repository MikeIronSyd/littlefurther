# P06 Comeback interface research

Recorded 8 October 2026, Africa/Lagos. This is source and image inspection before implementation; no new browser checks, learner validation, or visual approval is claimed.

## Goal

Extend the existing Amber learning journey with a nonpunitive schedule preview: select a restart date, compare unfinished-step dates, understand retained work and conflicts, then cancel or explicitly apply. Preserve the existing five-minute study action and its separate completion control.

## Context Pointers

Read the current `AGENTS.md`, `project-context.json`, `PRODUCT.md`, `DESIGN.md`, [parent specification](../spec.md) F06/F07/AC06 and [design record](../design.md), plus `src/client/{main,journey,plan-editor,api,i18n,ui,shell}.ts`, `src/client/styles.css`, and `src/shared/contracts.ts`. Read Impeccable `SKILL.md` and `reference/new-work.md`; root owns this turn's single context invocation. Craft-floor will be read immediately before UI edits.

Inspected actual pixels and provenance for `.impeccable/mocks/amber/comeback-preview.png` and its `.png.json` sidecar. The 1536×1024 image places a restart-date control above a current/proposed-date comparison, with retained completed work alongside, a target conflict below, and a final preview/cancel/apply row. Its values are illustrative. Its detailed-state `approved: false` remains intact; the user's Amber direction is settled. This extends an existing surface and does not call for another identity or concept selection.

## Constraints

- Retain shell, theme tokens, language switch, top-left brand placeholder and exact PanelLeftClose/PanelLeftOpen icons. No new nav destination, branding, peer UI or runtime AI.
- F06 defines one exact calendar-day shift from the first unfinished active step to the restart date; preserve existing order and date spacing. Completed dates/history and fixed target/availability stay unchanged. The backend owns calculation and atomic confirmation.
- F07 requires preview without mutation, cancel without mutation, stale revision rejection and regeneration, and no recovery operation for empty/all-complete plans.
- Reuse safe DOM `textContent` construction and shared request/error helpers. Keep learner goal/step text verbatim across locale changes.
- Existing detailed mock is a visual starting reference, not proof that behavior works or that this rendering received separate approval. Open Impeccable phase limitations must not be fabricated away.

## Findings and proposed implementation boundary

| Need | Status and evidence | Narrow integration decision |
| --- | --- | --- |
| Entry point | Verified: `showLearning` in `journey.ts` has `.return-support` with `returnTitle`, `returnCopy`, `futureDates`. On mobile this real DOM block is moved immediately below the primary study action. | Replace only the future-dates sentence with a real “Review restart dates” button for a plan with unfinished steps. Keep five-minute restart in the next-step band. No misleading enabled operation for empty/all-complete plans. |
| Screen routing | Verified: `main.ts` renders editor/study subviews directly into `shell.main`; public shell routes are learning/journeys/activity. | Add a similarly scoped `showComeback` subview in its own `comeback.ts`; a callback from `showLearning` opens it. Return to the selected learning plan after cancel/apply. Do not add a fourth main route. |
| Date semantics | Verified: `dateLabel` formats ISO calendar dates with UTC at noon, avoiding browser timezone drift. `LearningPlan` carries explicit timezone, target and availability. `input('date',…)` has established bounds 2000–2100. | Use a labeled native restart-date field, timezone text, a separate preview action and locale-bound rendered dates. Let the server validate all calculated dates. Initial suggested date is a UI decision root must settle in the increment contract. |
| Comparison at 320px | Verified: current CSS has 799px mobile breakpoint, minmax(0,1fr) columns, wrap-safe notices and semantic form controls. Image comparison is desktop only. | Use an ordered list of step rows with a title and explicit current/proposed date labels (a `dl` per row). Desktop CSS aligns columns to the reference; mobile stacks each row without horizontal scrolling or duplicated interactive controls. No color-only meaning. |
| Retained work | Verified: `PlanDetail` has active completed steps, immutable activity/completion snapshots and derived progress. | Show current completion count and completed step dates; make clear historical effort remains. Render all values from the preview's associated saved plan, never copy the image's 3/8 data. |
| Conflict wording | Verified: `conflictTarget`, `conflictAvailability`, `conflictNote` are EN/FR and explicitly leave availability/target unchanged. | Reuse warnings as informational, not silent schedule compression or an implicit deadline extension. Each warning names step/date. Show fixed target value where applicable. Confirm may remain available when conflicts are acknowledged through the visible preview, per existing specification. |
| Pending and failure state | Verified: `lockForm`, `notice`, `focusStatus` exist. `request` exposes status/code through `RequestError`. Shared `errorKey(409)` is generic stale-plan text. | Freeze the date and request buttons during each request, keep input/preview on transport failure, and reuse the same request identifier for an identical confirm retry. Add Comeback-specific stale/regenerate and uncertain-result copy rather than falsely asserting an HTTP response loss means nothing saved. Root must finalize server error codes and response shape. |
| Cancel and edits | Verified: editor uses `dirty`/`canLeave` confirmation and onSaved callbacks; Comeback preview itself is non-mutating. | Cancel returns without calling a mutation endpoint. Editing the restart date invalidates the visible confirmable preview immediately; only a fresh explicit preview enables apply. No unsaved-study draft needs to be discarded to enter from the learning page. |
| Focus and async lifetime | Verified: main has `focusHeading`; existing subviews replace `shell.main` and shell navigation can occur while requests are pending. | Focus the subview heading on entry, preview result heading on success, error status on failure, then learning heading/status on completion. Guard asynchronous callbacks with the subview root's `isConnected` (or equivalent route generation) so a late response cannot replace a different screen. Preserve current native drawer behavior. |
| EN/FR and shell state | Verified: `bind` refreshes only connected DOM nodes; theme/sidebar controls survive subview replacement. | Bind dynamic date summaries as well as labels, including every accessibility label and recovery error state; theme/locale changes must retain date input and preview. French expansion and long titles need real browser verification. |

Proposed touched files: new `src/client/comeback.ts`; narrow integration changes to `journey.ts` and `main.ts`; new EN/FR entries in `i18n.ts`; scoped `.comeback-*` CSS. No `shell.ts` changes appear necessary. Shared contracts/backend are root/backend-agent owned; await their exact shapes before implementation.

Root's subsequent scoped decisions: preview uses `POST /api/plans/:id/comeback/preview` with `{revision,restartDate}` and makes no mutation; confirmation uses `{requestId,revision,restartDate}` and server recomputation. A zero-day preview is a no-op with disabled confirmation and an explanation. Visible availability/target conflicts require an explicit acknowledgement checkbox before apply. Editing the date immediately invalidates the shown preview and acknowledgement; stale rejection requires reload and a fresh explicit preview. These settle the comparison table's earlier candidate behavior; exact shared TypeScript response types remain awaited.

## Done When

Research source inspection is complete for the UI boundary. Production UI implementation remains on hold until root documents the complete P06 research gate and increment contract, including the initial restart-date default and endpoint/preview/retry/error schemas.

Candidate acceptance checks (planned, not performed): desktop light/dark preview, 320px French comparison/reflow and long titles, native keyboard/date labels/focus, cancel unchanged dates/revision/history, apply then reload persisted dates, input edits disable old apply, stale confirmation followed by explicit regenerated preview, transport failure retains input and allows safe identical retry, view navigation during pending requests causes no detached-view replacement, empty/all-complete entry behavior, and five-minute activity does not complete a step. Test the actual accepted contract rather than mirror UI implementation details.
