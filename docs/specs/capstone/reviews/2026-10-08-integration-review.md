# P08 — Independent complete-journey review

8 October 2026, Africa/Lagos. Reviewed baseline: `6415a2958cbc2f9f05e928ea3bf8b890623e1359`.

## Goal

Review how TinySteps, personal and peer StudyCircle, flexible consistency, FinishLine and Comeback behave as one application. The initial source review identifies two related lifecycle defects that should be reproduced and corrected before calling the complete journey verified. Root's actual browser observation also found a mismatched URL after saving a new journey. Existing increment tests remain useful evidence; they do not cover every interaction between a pending request, another screen and sign-out.

This reviewer invoked the repository's [learning-journey-review skill](../../../../.agents/skills/learning-journey-review/SKILL.md) and Impeccable's technical-audit guidance. Product source stayed read-only. No test runner, application, browser, database, live tracker, commit, push or global configuration was operated by this reviewer.

## Context Pointers

Inspected [project instructions](../../../../AGENTS.md), [project context](../../../../project-context.json), [specification](../spec.md), [plan](../plan.md), [research](../research.md), and all three increment contracts and verification records: [private journey](../increments/first-journey.md), [Comeback](../increments/comeback.md), [StudyCircle](../increments/studycircle.md). Source inspection covers client routing, plan editor, study/progress screens, comeback, circle lifetime and privacy, localization, shell, validation, date calculations, templates, store and HTTP boundaries. Existing domain/server/browser tests were inspected for acceptance coverage and missing interactions.

`git rev-parse HEAD` returned the baseline above. `git diff --stat 134997605a02885dbd5181f0cee01e0aca5fe9ea 6415a2958cbc2f9f05e928ea3bf8b890623e1359 -- src tests tools package.json pnpm-lock.yaml` returned no difference. Therefore the recorded P07 source execution is reusable for this initial review. Direct log inspection confirmed `.local/circle-all-tests.log` ends with 56 tests passed, zero failed/skipped/cancelled; `.local/circle-browser-final.log` ends with 36 passed in 7.7 minutes; `.local/circle-process.log` records distinct-process persistence. These are earlier executions, not tests rerun by this reviewer.

### Acceptance evidence matrix

Each result describes the stated evidence slice. A criterion with additional unexecuted requirements remains unverified overall even when its existing checks pass.

| AC | Expected behavior | Evidence / revision | Result | Limitation |
| --- | --- | --- | --- | --- |
| AC01 | Reviewed editable supported/manual plans, dates, estimates and conflicts | `validation.ts`, `plan-editor.ts`, store transactions; domain/HTTP and planning browser cases at P07 artifact, unchanged at baseline | **verified pass** for recorded normal, failure and scope-edit cases; full interaction **unverified** | IR02: late editor response can replace a subsequent screen or clear its unsaved-state guard. |
| AC02 | Traceable source/version/prerequisites and supplied-topic fallback | `templates.ts`, template ID/version in contracts/store, unsupported-template validator and browser source/prerequisite case | **verified pass** for recorded technical cases | No curriculum quality, external-link availability today or native-French editorial validation is established by this review. |
| AC03 | Private plan → study → optional reflection → next action; activity separate from completion | `journey.ts`, activity/completion endpoints, skipped-reflection and five-minute browser cases, root's earlier saved walkthrough | **verified pass** for recorded ordinary cycle; pending-write interaction **unverified** | IR02: a detached study callback can still update global detail and clear a new form's dirty state. |
| AC04 | Seven calendar dates in selected timezone, deduplication and cumulative work | `progress.ts`; midnight, spring/fall DST, same-day and missed-day domain assertions; profile update persistence tests | **verified pass** for recorded deterministic boundaries | No longitudinal learner behavior or efficacy claim. A newly executed combined profile/timezone journey belongs to root. |
| AC05 | Current scope distinct from immutable history and mastery; empty plan safe | Store snapshots, `progressFor`, completion/removal/empty-plan tests and browser archived-history case | **verified pass** for recorded scope/history cases | Scope removal plus Comeback plus peer copy in one new walkthrough is not established by the separate tests alone. |
| AC06 | Exact unfinished shift, preserved order/history, explicit cancel/confirm, stale rejection | P06 contract and eight browser cases, domain/HTTP transaction tests; all rerun within P07's 36-case batch | **verified pass** for recorded scenarios | Comeback's own active-view/generation guard is sound in source; it does not protect unguarded root/private-journey callbacks. |
| AC07 | Two actual accounts, deliberate immutable copies, private-data boundary, cleanup | P07 role/DTO/lifecycle tests; separate IAB/Chrome root walkthrough; CircleStore never joins private plans/history into peer DTOs | **verified pass** for recorded local peer lifecycle | Already-rendered data is not push-revoked. Complete application sign-out lifecycle still needs IR01 coverage. No remote-peer or learner-study result. |
| AC08 | Hash-only, expiring, revocable, one-use transactional invitations | Store/HTTP capacity/concurrency/rollback/replay cases and browser uncertain-create/revoke case | **verified pass** for recorded invitation cases | No new invitation was issued by this reviewer. |
| AC09 | Session/ownership/membership, safe input/text/URLs, denied requests and sign-out | Existing HTTP ownership/sign-out cases, plain-text browser cases, dependency audit and source review | Sequential/server cases **verified pass**; full client session-boundary acceptance **unverified** | IR01: a late successful private response is not invalidated by sign-out. No comprehensive security certification. |
| AC10 | Refresh/restart persistence, honest saves, entire core with internet unavailable and server running | Distinct-process log plus browser refresh/failure checks and 30-loopback/zero-external-attempt baseline test | Persistence/named browser restriction **verified pass**; complete disconnected journey **unverified** | Earlier restriction covers browser traffic and early private journey. Physical internet and server egress were not disabled; P06/P07 were not traversed in that same restricted scenario. |
| AC11 | Image-first, English/French states, desktop/mobile, keyboard/zoom/reflow and targeted accessibility | Dated Amber references, source catalogues, existing inclusion/shell/P06/P07 browser cases and bounded capture reviews | Named existing checks **verified pass**; full combined acceptance **unverified** | No new screenshots, keyboard/zoom pass or native-language assessment here. Full formal Impeccable phases remain open. |
| AC11a–f | Theme/storage precedence and failures; correct panel icons; drawer focus/resize; both languages at 320px; contrast/forced colors/reduced motion | Existing shell/inclusion cases and P07 language/theme/input-preservation case, unchanged source; root P08 MCP observation | **verified pass** for recorded scoped checks; **verified fail** for IR03's observed route/hash mismatch | No universal accessibility/device claim; pending-request navigation was not included in these shell cases. Root observed mismatch, not this reviewer; reload consequence is source-derived. |
| AC12 | Independent fresh-checkout setup and bounded template/language adaptation | README and operations/adaptation instructions exist | **unverified — later delivery gate** | P10 execution not performed; agent rehearsal would still not establish human adoption. |
| AC13 | Actual lifecycle/MCP and repeated meaningful skills, saved trackers, immutable publication and demo index | E007–E009 reviews, source artifacts and readbacks; this review is P08's complete-journey review invocation | Earlier scoped evidence **verified pass**; complete delivery **unverified** | P08 results, subsequent correction review/evidence, and actual video-time mapping remain to be completed. Tracker/GitHub readbacks were read from records, not repeated here. |
| AC14 | Actual 3–5 minute all-five-capability walkthrough, two accounts, Codex's role and next month | Planned 4:30 sequence only | **unverified — later delivery gate** | No recording or timed rehearsal exists in the reviewed record. |

## Constraints

### Prioritized source findings

**IR01 — P1: invalidate prior private reads and identity callbacks at the session boundary (AC09; AC10/AC11 interaction).**

At baseline [main.ts](../../../../src/client/main.ts#L65), successful `signOut()` clears data and renders authentication but never advances `loadVersion`. `renderRoute()` checks that version after its awaited private reads (lines 313 and 324), then renders the result. A request authenticated before sign-out can legitimately finish afterward. If its already-successful detail response is delayed until the sign-out screen appears, it still passes the client generation check and can render the former learner's private plan/history on the signed-out screen. This is client display isolation; it does not imply the signed-out cookie can make a new authorized server read.

Related identity callbacks also lack a session guard: `changeLocale()` (line 53) replaces `me` and the account header after awaiting PUT `/api/me`; `initialize()` (line 434) accepts GET `/api/me` without a captured session generation. A delayed pre-sign-out locale response can restore the old account header after the successful sign-out. These are the same missing session-lifetime invariant, not separate backend authorization vulnerabilities.

Smallest reproduction: retain an authenticated successful GET `/api/plans/:id` response; finish Sign out; release the retained response; assert the Sign in view remains and no previous goal/reflection/account controls reappear. Also retain a successful locale PUT response across Sign out and assert it cannot restore the account menu. Root owns behavioral reproduction; at initial report writing this reviewer has source-confirmed control-flow evidence, not a newly executed failure.

**IR02 — P2: discard callbacks from departed editors, profile forms and study screens (AC01/AC03; F14).**

The baseline [plan-editor.ts](../../../../src/client/plan-editor.ts#L333) calls `onSaved` unconditionally when its request resolves. The callback in [main.ts](../../../../src/client/main.ts#L241) replaces global detail, clears `dirty`, sets the route to learning and renders, even if the editor was already discarded and another screen is active. A delayed successful save can pull the learner away from Activity, a peer composer or another unsaved editor without that newer form's confirmation. Profile saving has the same pattern at lines 211–215. The study callback at lines 365–373 unconditionally replaces detail and clears `dirty` after activity success; it need not render to silently remove the next form's unsaved-input protection.

Smallest reproduction: retain a successful plan POST/PUT response; leave that pending editor using the existing discard confirmation; open a new screen/editor and type; release the old response; assert the new route and input remain and its unsaved guard still operates. A targeted detached-study save followed by a dirty peer composer tests the cross-capability variant. P06 and P07's local `view.isConnected && isCurrent()` guards demonstrate the existing pattern to extend.

**IR03 — P2: synchronize the saved destination with its URL (F16; AC11c/AC11e).**

Root's P08 browser-MCP observation created a new plan from Journeys. Successful save displayed My learning and the new goal while the URL remained `#journeys`. Baseline [main.ts](../../../../src/client/main.ts#L250) sets `route = "learning"` in the editor's save callback without updating browser history. In contrast, ordinary navigation and opening a listed journey update both the route and hash. `initialize()` derives the selected destination from the hash, so a reload will route to Journeys rather than the screen just displayed; that consequence is source-derived here, not a claim that this reviewer performed a reload. A small shared route-transition helper should update route, hash and shell selection together; verify save from Journeys/Activity, then reload retains the displayed destination. This is navigational consistency, not a demo-quality or privacy claim.

### Minimum coherent correction contract

- A result may change identity/header state only if it belongs to the current session generation. A result may replace content, selected detail, current route or dirty state only if it also belongs to the active screen generation. Every actual view replacement must invalidate the previous view, including profile, editor, study and authentication screens.
- Theme and locale continue to update the active screen in place; they must not discard a draft or invalidate a current plan revision. Locale persistence belongs to the captured account/session, and old responses must not resurrect another account or overwrite a later preference response.
- Starting sign-out must prevent older work from rendering while the request is pending. Do not claim sign-out success, clear confirmed identity, or invent revocation on a failed POST: retain or deliberately reload the signed-in state and report the failure. Prevent duplicate sign-out attempts. On success, clear private application state and invalidate every prior screen/identity callback.
- Already-sent server mutations may have committed. Suppressing stale UI callbacks is not cancellation, rollback or evidence that the save did not happen; re-entry reads canonical state.

### Evidence gaps, separate from source defects

The existing 36-browser pass did not traverse the entire five-capability path while blocking all non-loopback traffic. Its restricted test creates an account/profile/manual plan, reloads, saves study and reloads. P08 should add one small connected scenario covering retained effort, Comeback and deliberate peer sharing under the declared connectivity condition, with both sessions accounted for. Browser interception alone must remain described as browser restriction; it does not establish server-egress or physical-adapter isolation.

Fresh-checkout adaptation, full demo timing, native-French editorial quality and real learner evaluation remain later or unavailable evidence. They are not source regressions and should not be manufactured or silently closed. Formal Impeccable finish remains refused/open at plates with later phases pending; a scoped source review cannot close it.

### Impeccable technical review boundary

Reused the already-loaded `.local/circle-impeccable-context.txt`; context and detector were not rerun. The P07 detector's 34 advisories and their source dispositions are recorded in the [visual review](2026-10-08-circle-visual.md). Source is unchanged from that artifact. This review inspected the five audit dimensions but did not execute a new rendered audit or assign a false whole-application conformance/health score.

| Dimension | Scoped evidence and remaining limitation |
| --- | --- |
| Accessibility | Native controls, labelled fields/status, focus helpers, drawer semantics and recorded contrast/keyboard checks are present. Current callback defects can move focus/content unexpectedly; no new assistive-technology execution here. |
| Performance | Text-led same-origin application, no new runtime service or raster dependency. No new latency, memory, touch-device or resource benchmark was measured. |
| Theming | Shared semantic CSS, native scheme, browser-origin preference allowlist and recorded light/dark preservation checks; no redesign requested. |
| Responsive design | Existing 320px French, mobile ordering, drawer cleanup and 50-step evidence is reused. No new physical-device or combined-flow zoom result. |
| Implementation integrity | One connected goal and optional support preserve the product-specific structure. IR01/IR02 reveal inconsistent request lifetime handling between earlier and later modules. The recommended correction is a scoped `$impeccable harden` implementation; any later polish remains bounded and follows behavioral verification. |

### Positive invariants to preserve

Domain date arithmetic uses calendar dates rather than DST-hour shifts. Completion and study remain explicit separate writes; archived scope leaves immutable activity/completion snapshots intact. Peer DTOs and circle tables remain isolated from private plan/reflection data. Comeback and Circle guard their detached views, expose uncertainty honestly and preserve request identity for safe retries. No membership requirement is added to private learning. The screen hierarchy remains one Amber learning workspace with optional peer support, rather than five unrelated destinations.

## Done When

This independent review is complete when the baseline, acceptance matrix, source evidence, reused execution limits and correction priorities are saved and passed to root. Root then reproduces IR01/IR02, retains the actual IR03 observation, documents the research/implementation contract before edits, makes the smallest coherent fix and obtains focused plus appropriate regression evidence. The combined-flow browser observation, exact connectivity evidence and updated P08/P09 tracker/publication record belong to root. Later AC12/AC14 work stays open.

No product code was changed and no application test or running UI was newly observed by this reviewer. Findings are not marked behaviorally resolved by source inspection alone.
