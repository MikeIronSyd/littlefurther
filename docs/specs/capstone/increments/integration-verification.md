# P08 / P09 integration verification — 8 October 2026

## Goal

Record the first connected five-capability review, its actual defects, the corrective iteration and evidence reconciliation. Baseline `6415a29` contains unchanged application source from P07 artifact `1349976`. This record distinguishes baseline failures from corrected-source verification; it does not certify retention, accessibility or full capstone completion.

## Context Pointers

- [Integration contract and IC01–IC05](integration.md), [research closeout](../research.md), [parent acceptance criteria](../spec.md).
- [Independent P08 review](../reviews/2026-10-08-integration-review.md), [design research](../reviews/2026-10-08-integration-design-research.md), [bounded design refresh](../reviews/2026-10-08-integration-design-refresh.md), [E010 tracker preparation](../reviews/2026-10-08-integration-tracker.md).
- Root and reviewer applied [learning-journey-review](../../../../.agents/skills/learning-journey-review/SKILL.md) to source, acceptance and observed interactions. Root and tracker preparation applied [capstone-evidence-update](../../../../.agents/skills/capstone-evidence-update/SKILL.md) to baseline evidence and stable destinations. Corrected-source review and final reconciliation are separate iterations below.

### Baseline regression experiment

The test agent held delivery of real successful HTTP responses **after** authorization/persistence. Seven defects reached their intended failing assertions. Two controls passed. All executions used synthetic accounts on isolated port 4318; root's live demo on4317 was separate.

| IC / finding | Baseline observed result |
| --- | --- |
| IC01 / IR01 | An authorized private plan GET released after completed sign-out restored private goal/activity content, despite fresh backend requests returning 401. |
| IC02 / IR02 | A persisted editor save replaced a newer draft and route. Persisted study and profile responses cleared a newer draft's unsaved guard. |
| IC03 / IR01 | A delayed locale response restored old account controls after sign-out. In-place EN→FR→EN without sign-out preserved text/focus/dirty state and passed as a control. |
| IC04 / IR02 | Failed sign-out showed a network error and retained the session but lost the current draft's dirty guard. |
| IC05 / IR03 | Saving from Journeys selected My learning while retaining `#journeys`; the baseline assertion stopped before reload. |
| Profile control | Delayed profile save after sign-out recovered through another authenticated request receiving 401. No final-state defect is claimed for this control. |

Exact baseline executions: `pnpm exec playwright test tests/e2e/integration.spec.ts` initially had 8 tests, 1 pass/7 fail; six failures were product assertions and one was an account-setup throttle failure after worker replacement. The test-only cooldown was corrected to respect the existing 10.1-second auth boundary. The profile-after-sign-out rerun passed; the new profile-after-navigation case failed at its intended assertion. Nine cases now cover seven failures/two controls. Logs and exact commands are retained in ignored `.local/integration-regression-baseline.md` and its linked logs; no production auth limit or assertion was weakened.

### Actual root browser MCP connected journey

On8 October, root used `http://127.0.0.1:4317` in separate IAB owner and Chrome peer sessions, reusing P07's synthetic accounts and two-member circle. Existing data was preserved. These are product interactions through browser MCP, not a participant study or remote-peer deployment.

| Requirement | Action and observed result |
| --- | --- |
| AC01/AC02 TinySteps | Created a new manual goal, “Return to my course reading,” with three reviewed ten-minute steps and 8/10/12 October dates. Saved explicitly. The route mismatch above was also observed manually. |
| AC03 personal cycle | Studied the first step for five reported minutes and saved a private reflection. Returning showed 0/3 completed, 1 session/5 minutes and 1 studyday. Explicitly marking that step complete separately changed progress to1/3 without adding another session. |
| AC04/AC05 consistency/FinishLine | Activity retained the reflection and first completion. After a second five-minute study session on the same date it showed 2 sessions/10 minutes, 1 distinct studyday and 1 completion, not assessed mastery. Reload retained these values. |
| AC06 Comeback | Previewed restart 13 October: unfinished 10→13 and 12→15, preserving +3-day spacing; completed 8 October unchanged. The12 October target remained unchanged. Four availability/target warnings required acknowledgement before Apply became available. Saved, then used the five-minute restart without automatically completing step 2. |
| AC07/AC09 private peers | Entered only “I returned for five minutes. Next I will explain one example.” as a check-in, inspected exact copy/current-and-future audience/private exclusions, and shared explicitly. Chrome peer read the copy and added “Glad you returned”; owner read its French equivalent. Peer-visible DOM contained neither private goal nor reflection. Membership creation/join is P07 evidence, not repeated here. |
| AC11/AC11a–f | EN→FR and light→dark while the sharing preview was pending preserved learner text/preview. At320px, observed innerWidth 320/clientWidth 305/documentWidth 305. At390px the learning view measured 390/390/390. Desktop and mobile actual screenshots were inspected together. Correct panel geometry, persistent provisional branding, action-first mobile order, explanatory progress labels and distinct shared/private preview sections remain visible. |

Root saved six initial captures under ignored `outputs/integration/`: `comeback-preview.png`, `shared-preview-fr-dark-320.png`, `peer-result.png`, `activity-fr-dark.png`, `learning-light.png`, `learning-mobile-light.png`. Independent visual inspection correctly rejected the two narrow full-page images: their saved pixels cut right edges, beyond the viewer's later downscaling. Root's viewport captures and DOM bounds showed no element beyond the page (French controls right 292.667 within client 305); the full-page capture path remained faulty. No CSS was changed to compensate. A later tab-scoped CDP capture produced an uncropped 390px learning view, actually dark despite its `learning-mobile-light-cdp.png` name. Fresh automated mobile fixture captures are used for the replacement review packet and labelled separately from the connected owner/peer MCP story. Captures do not establish universal contrast, native-French quality or screen-reader conformance.

The original IAB tab's debugger stalled during temporary large-viewport capture/cancel recovery. Browser troubleshooting and bounded reset/close attempts did not recover it; no extra shared copy was submitted. A fresh tab retained the owner's real saved journey, 1/3 completion and 2 sessions/10 minutes; it loaded final `index-CYQTTiCo.js`, matching the current build. Its tab-scoped override was cleared and DOM width returned 1280. Earlier ordinary viewport overrides had been reset; the stalled tab's final override/close result is unverified. The fresh demo tab is the deliverable. The theme selector was exposed by AX as a checkbox but Playwright's checkbox-role lookup found no match; the actual AX control performed the original switch successfully. Later input/capture tooling failures are not reported as product passes or diagnosed as product defects without evidence.

The connected observations used the baseline application; the lifecycle corrections require their own later verification. No physical network adapter or server egress was disabled. Existing loopback-only browser routing and separate-process persistence tests remain separately scoped evidence until rerun below.

### Corrected-source checks and review

R18 closed at17:36 and the guard/unlock addendum at17:40, before dependent edits. The original nine corrected cases passed. Independent P09 review then found CR01: changing locale during a held successful timezone-save response resent the old cached timezone. A tenth test verified America/New_York/en before the language change and Africa/Lagos/fr afterward. Research was reopened and reclosed at17:47 before the serialized profile-write correction. The new helper reads fresh authenticated profile state before merging each intentional patch and sending the existing PUT; it checks session ownership around every await. This is client-local ordering, not a cross-tab/server transaction guarantee.

| Exact command / evidence | Actual result | Scope / limit |
| --- | --- | --- |
| `pnpm exec playwright test tests/e2e/integration.spec.ts` (first correction) |9/9 passed, exit 0. `.local/integration-corrected-browser.log`. | Original seven failures plus two controls. CR01 was not covered yet. |
| `pnpm exec playwright test tests/e2e/integration.spec.ts --grep 'changing language during'` |1 intended failure, exit 1. `.local/integration-timezone-race-before.log`. | Actual persisted timezone loss, not just a source hypothesis. |
| `pnpm exec playwright test tests/e2e/integration.spec.ts` (final correction) |12/12 passed in2.3 minutes, exit 0. `.local/integration-final-browser-rerun.log`. | Original nine, timezone race, lost successful PUT response and failed fresh GET/noPUT/laterretry. These 12 are a subset of the later full suite. |
| `pnpm run check` | Final exit 0. Earlier correction attempt failed TS18047 for nullable root; fixed with a checked non-null binding. | No diagnostic suppression. |
| `pnpm run lint` | Exit 0, 39 files. | No fixes applied by this command. |
| `pnpm run format:check` | Exit 0, 44 files. | No fixes applied. |
| `pnpm test` |56/56 passed, exit 0. | Domain/store/HTTP. Executed before the final client-only queue edit; server/domain source stayed unchanged. |
| `pnpm run verify:process` | Exit 0; distinct Node processes retained auth, secret, private history, Comeback dates/receipt, circles, copied content and encouragement. | No machine reboot or physical network disconnection. Backend unchanged afterward. |
| `pnpm run audit` | Exit 0, no known vulnerabilities. | Registry audit, not a comprehensive security guarantee. Dependencies unchanged. |
| `impeccable.cmd detect --json src/client/main.ts` | Exit 0, `[]`, one final changed-target execution. | Does not clear P07's34 CSS advisories or complete formal phases. |
| `pnpm run test:e2e` |48/48 passed in9.8 minutes, exit 0; no failures/skips/retries. Server TypeScript/client Vite startup build succeeded; isolated port 4318 released. | `.local/integration-full-browser.log`. Includes the 12 focused cases and all 36 prior cases. |

The expanded focused run initially failed during test collection because its afterEach fixture parameter was not destructured. A brief empty-destructure form also failed lint. Final `{ page: _page }` satisfies both; no product/security assertion was weakened. The corrected cooldown only handles unexpected-failure worker replacement; ordinary account setup retains its prior timing. These harness failures are preserved separately from product failures.

The [independent P09 correction review](../reviews/2026-10-08-integration-correction-review.md) inspected the final source and final 12-case/full 48-case logs: IR01–IR03 and CR01 are resolved within the tested scope, with no remaining scoped source blocker. Final main.ts SHA-256 is `02336C34A1152E2BA508E7C8562F615FF4C3E72D8320EA2D4A4BA7F437888738`; final test file is `C754FAA58868B48A35F0B525A27066203D748F036C188094A508E022503AC00E`. Production edits affect only the client entrypoint; no CSS, endpoint, schema, dependency or peer policy changes. Latest loopback-only browser check made 31 local requests and 0 external attempts; physical internet/server egress stayed available. The [replacement visual review](../reviews/2026-10-08-integration-visual.md) accepted the uncropped automated fixture packet within its scope; inherited formal phases remain open.

### Judging evidence and delivery

| Criterion | Requirement → artifact → actual observation → planned demo scene | Status / limit |
| --- | --- | --- |
| J1 | AC13 → P08 review, R18 facts, IC01–IC05, held-response tests and P09 correction → eight reproduced failing behaviors, independent dispositions and 48 browser passes → show a real review finding and its passing correction. | Actual planning, research, implementation, test, review and documentation iterations; GitHub/tracker delivery evidence below. No plan-mode UI action or time saving inferred. |
| J2 | AC01–AC09 → one private plan through study, recovery, progress and exact sharing → observed retained effort, manageable return and privacy boundary → demonstrate these decisions in the learner story. | Synthetic working behavior; educational effectiveness, demand and sustained engagement remain hypotheses. |
| J3 | AC12 → existing documented source/commands → independent fresh-checkout/adaptation still pending → show actual later rehearsal. | Documentation alone is not successful reuse or adoption. |
| J4 | AC14 → actual working captures and parent the required 3–5 minute walkthrough → no recording/timing yet →3–5-minute demo with concrete next-month work. | Planned, not a completed video. |

E010 is absent/available according to the fresh tracker baseline; final uniqueness must be rechecked before writing. Normal dual-private-repository publication, GitHub MCP artifact readback and saved Sheet/Kaneo readback remain pending. No project backup is required or authorized through global CodexRecovery.

## Constraints

The formal Impeccable pipeline is still open. The manifest has six plan items, 26 code regions and no shipping raster plates; zero rasters does not imply a completed user plan review. Actual user decisions/receipt and authenticated comp-capture feasibility are outstanding. Hero/final comp diffs and QUALITY BAR are unavailable; P07's detector has 34 advisories and is not a clean pass. Bounded document refresh preserves normative tokens, original direction provenance and detailed references' actual unapproved status.

Hosted CI remains inactive. This local proof of concept needs its server running, has no runtime AI, no remote peer demonstration and no server-off offline promise. No volunteers were contacted or observed; no retention improvement, time saved, measured learning outcome or human adoption is claimed. Official submission date remains unannounced; 14 October is internal only.

## Done When

This increment is complete when blocking integration findings have corrected-source checks and independent follow-up disposition, scoped design/source records agree, and both publication and saved tracker readbacks are recorded. Full capstone acceptance additionally needs the pending evidence above, the independent reuse rehearsal and the timed demo; this increment does not silently complete those tasks.
