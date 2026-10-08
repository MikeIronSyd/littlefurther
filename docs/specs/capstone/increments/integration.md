# P08 / P09 — Complete-journey review and corrections

8 October 2026, Africa/Lagos. Starting revision `6415a2958cbc2f9f05e928ea3bf8b890623e1359`; its application source is the verified P07 artifact `1349976`.

## Goal

Review TinySteps → personal study/review → FinishLine/consistency → Comeback → optional private StudyCircle as one journey. Identify and correct verified integration defects, refresh the existing design record without changing the selected Amber identity, and reconcile actual evidence. This is P08's full-journey review and any necessary P09 corrective iteration, not a completed capstone or measured learner evaluation.

## Context Pointers

- [Parent specification](../spec.md), [plan](../plan.md), [research](../research.md), and P04/P05, P06 and P07 contracts/verification.
- [Independent complete-journey review](../reviews/2026-10-08-integration-review.md) and [design-workflow research](../reviews/2026-10-08-integration-design-research.md), being prepared from the unchanged baseline.
- Existing 56 domain/HTTP and 36 browser passes are prior evidence; only new executions receive new pass claims.
- `src/client/main.ts` owns session, current plan, route, dirty state and route load generation. Comeback and circles already receive active-view guards; initial plan/profile/study/auth callbacks need investigation.
- Review skill: `.agents/skills/learning-journey-review/SKILL.md`; reconciliation: `.agents/skills/capstone-evidence-update/SKILL.md`; Impeccable and its document workflow govern visual review and the requested record refresh.

## Constraints

Settled scope stays unchanged: broad learners, all five capabilities, local server, real local accounts, English/French, explicit learner intent, no runtime AI, external fetching, full chat or hosting. No production edits until R18's relevant research needs are satisfied and documented. Research repro tests may precede the final corrective specification. Preserve user data and earlier synthetic demonstrations; use isolated test accounts. No physical network disconnection of this PC, global settings, unsolicited outreach, paid services or fabricated user design receipts.

### Review and research needs

| Need | Status / evidence | Required resolution |
| --- | --- | --- |
| R18a — Scope and baseline | Satisfied: clean Git baseline, parent AC01–AC14 and previous 56/36 outcomes inspected; no stack change. | Full review stays within existing requirements. |
| R18b — Delayed responses across identity/screens | Satisfied: independent source trace plus held successful responses reproduce seven failures; two controls pass. The nine cases are in `tests/e2e/integration.spec.ts`; exact baseline executions remain in `.local/integration-regression-baseline.md`. | Session lifetime and view lifetime are different. Missing invalidation permits old private GET/editor/profile/study/locale callbacks to alter a newer screen; failed sign-out consumes dirty state; editor save omits hash update. A profile-after-sign-out control recovered via a later 401 and is not claimed as a reproduced defect. |
| R18c — Connected-journey evidence | Satisfied for corrective scope: root browser MCP observed a new three-step plan, 5-minute private study, separate explicit completion, retained history, Comeback +3-day preview/conflict acceptance, another 5-minute return, exact copied check-in, real peer encouragement, EN→FR/dark/320px preservation. | Peer DOM contained the shared copy but neither private goal nor reflection. Activity showed 2 sessions/10 minutes, 1 study day and 1 completed step. This uses existing P07 membership and synthetic accounts, not a new participant study. Visual inspection and corrected-source checks are still delivery verification, not missing design facts. |
| R18d — Design record and phase requirements | Satisfied for bounded refresh: linked research verifies actual source, commands and tool state; DESIGN/sidecar refresh preserves normative tokens and all eight component CSS strings. | Formal pipeline remains open: six-item plan review needs an actual user receipt and authenticated capture feasibility remains unresolved. This is a known excluded formal-completion deliverable, not a reason to invent receipts or block correction of observed product defects. |

R18 is closed for this bounded P08/P09 scope at **17:36 Africa/Lagos**, before production edits. No stack, schema, API, membership policy, visual identity or feature scope changes are needed. A formal Impeccable finish and broader educational validation are not declared complete. Reopen research if the corrective implementation exposes a consequential unknown.

### Corrective contract and quality requirements

The client entrypoint remains the owner of account/session, active view, route and unsaved-state coordination. View modules keep their existing local DOM and persistence boundaries. Use explicit generations or equivalent small lifecycle helpers; no new framework, service or dependency. A saved mutation may still complete on the server after navigation: ignoring a stale response is not cancellation or rollback.

| ID | Required behavior | Verification |
| --- | --- | --- |
| IC01 | A successful sign-out invalidates all prior private response callbacks and clears private caches/account controls. Initial account loads and authentication callbacks may only affect their current session/view. | Held authorized GET released after sign-out stays on auth UI; backend returns 401. Inspect initialization/auth error paths. |
| IC02 | Every actual view replacement invalidates callbacks from the prior view, including profile, editor, study, circle, Comeback and route loads. Old saves must not replace a newer draft, change its route, clear its dirty guard or write private detail. | Held persisted editor/profile/study responses released after entering a new draft; guard remains and draft/navigation stays current. Existing circle/Comeback regressions remain passing. |
| IC03 | Locale persistence may update current account state only within its captured session and latest applicable operation. Language/theme switches in place must preserve the active form, learner text, preview, focus and unsaved guard. A locale response must not restore account controls after sign-out. | Delayed locale/sign-out regression plus in-place EN/FR control and existing shell/circle checks. |
| IC04 | Sign-out failure shows an honest error while retaining the active account, draft and unsaved guard. Block repeated sign-out and new root navigation during the attempt. Until sign-out succeeds, already-pending operations may finish in their still-current session/view, including control unlocking; an actual successful save may clear only its own current dirty state. Success atomically invalidates old session/view callbacks and discards private UI. | Network-failed sign-out on dirty form retains guard; successful sign-out regressions. Reviewer inspects pending/failure lifecycle and Circle/Comeback unlock guards. |
| IC05 | Successful plan save from any destination selects My learning and synchronizes URL hash before route rendering, so reload returns to the same destination. | Create from Journeys, assert selected navigation/hash, then reload and read back. |

Ordered work: implement the small lifecycle correction; run the nine focused cases; review the exact patch independently; correct blocking findings; run strict type-check, lint, format, build, 56 existing domain/HTTP cases, process checks, all browser cases and dependency audit. Exact commands are the parent plan/package scripts; focused command is `pnpm exec playwright test tests/e2e/integration.spec.ts`. Coordinate one browser runner. Retain baseline failures, setup-only throttle failure and unchanged controls distinctly from later passes. Record command exits and corrected-source evidence in the integration verification record. Scope the final visual review to current screenshots and unchanged visual primitives; no CSS polish loop.

**R18b addendum, 17:40, before dependent guard edits:** existing `circle.ts`/`comeback.ts` gate success, errors and finally/control unlocking on their active-view callback. Invalidating this callback merely because sign-out is pending could strand preserved controls if sign-out later fails. The active guard therefore tracks actual session/view lifetime; the pending flag is for new root actions, not blanket suppression of valid current-view completions. This verified control-flow fact resolves the new integration question without changing API I/O, data contracts or adding response queues. IC04 above records the resulting rule.

**R18b reopened during independent P09 review:** a profile PUT can persist a new timezone while its response is held; a concurrent language PUT currently takes the old timezone from cached `me.profile`. Client response generations do not order persisted writes. A held-response regression is required to verify the predicted lost timezone before dependent production correction. Existing fixes may be checked independently, but this consequential profile-write question keeps final P09 readiness open. Preserve in-place language switching and the explicit timezone contract; do not silently weaken either.

**R18b reclosed before settings-order correction:** the tenth isolated regression confirmed America/New_York/en was persisted before the language switch, then Africa/Lagos/fr after the competing responses. The original nine corrected cases passed. IC03 is extended: serialize profile mutations within the existing client entrypoint; each requested update contains only its intentional fields (locale-only, or explicitly submitted timezone/locale). Inside that sequence, read the current authenticated `/api/me` immediately before merging and submitting the existing full-profile PUT. This avoids replaying an old cached timezone, including after an uncertain prior save. Stop a write if the prerequisite read fails; keep the sequence available for later retries. Check captured session before/after each await and skip queued obsolete-session writes. Update shared profile cache only within that session; only the active originating view may navigate or clear its own dirty state. Language still changes in place immediately; it must not destroy the pending preferences form. No cross-tab/server-wide ordering or transaction rollback guarantee is introduced. Existing server GET/PUT contract suffices; no schema/API/dependency change is needed.

### Verification plan

1. Independent source review maps all ACs, reuses correctly scoped previous evidence and identifies integration gaps.
2. Root reproduces suspected late-response defects with deterministic gates around successful responses, without weakening auth or assertions. A failing reproduction is evidence, not a product pass.
3. Record a minimal corrective contract after research, then implement and run focused regressions and the required quality checks. Independent reviewer reinspects changed source/evidence as a separate meaningful iteration.
4. Root browser MCP observes the connected learner journey with synthetic accounts; desktop/mobile and both languages are inspected in one bounded visual round, with at most one confirmation round after actual fixes.
5. Refresh DESIGN.md/sidecar by extracting the incumbent implementation and preserving its normative identity. Apply actual phase checks when supported; never force a user review receipt or infer approval from a screenshot.
6. Use E010 after checking live uniqueness; publish intended source normally to both private repositories, read back both heads and personal GitHub MCP artifact, then verify saved Sheet/Kaneo updates.

## Done When

P08 has an AC-linked complete-journey report with exact observed results and limits. Necessary P09 fixes have specified behavior, reproduced regressions, passing required checks and independent follow-up review. The current design record is accurate, with any user-owned formal gate explicitly pending. Both trackers and private repositories agree with verified results. Independent fresh-checkout/adaptation, any available learner evaluation and the timed 3–5 minute video remain later deliverables unless actually completed.
