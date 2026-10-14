# P06 Comeback implementation review

8 October 2026, Africa/Lagos. Independent review using the project's `learning-journey-review` skill and Impeccable technical audit/craft-floor guidance. This review makes no production edits.

## Goal

Review P06 schedule recovery against F06/F07, AC06 and CB01–CB06, including affected private-journey regressions. The reviewed state is the uncommitted P06 increment above baseline `e3a682f14f6e9172efe2ec8ef91fc671e77163ba`; exact inspected file fingerprints are below.

Source review found no confirmed blocking production defect. The relevant automated behavior checks passed after correcting two test-fixture/assertion defects; no production validation was weakened. P06 behavior is ready within the tested scope. Fresh visual review and publication/tracker closeout remain separate. This is not approval of the full capstone: P07, learner benefit/adoption and the timed demo remain outside this review.

## Context Pointers

Read [AGENTS.md](../../../../AGENTS.md), [project context](../../../../project-context.json), [parent specification](../spec.md), [research](../research.md), [Comeback contract](../increments/comeback.md), [first-journey contract](../increments/first-journey.md), [existing verification](../verification.md), and the linked [backend](2026-10-08-comeback-backend-research.md) and [UI](2026-10-08-comeback-ui-research.md) research. Inspected `PRODUCT.md`, `DESIGN.md`, shared contracts, domain/validation/progress, server/store/auth boundary, the Comeback view and callers, localization/rendering helpers, CSS, new domain/HTTP/browser tests and the separate-process check. Root owns the single Impeccable context invocation for this turn; it was not repeated.

### Acceptance evidence matrix

| AC | Expected behavior | Evidence/revision | Result | Limitation |
| --- | --- | --- | --- | --- |
| AC06 / CB01 | One signed calendar-day shift for ordered unfinished active steps; completed/archived history and spacing remain fixed; both output bounds are enforced. | Inspected domain source and seven domain cases at the fingerprints below; root `pnpm test` passed 40/40, including all 20 new test results. | verified pass | Synthetic calendar and history fixtures; not a learner outcome claim. |
| AC06 / CB02 | Preview/cancel are read-only; owner-qualified, revision-bound confirmation and receipt are atomic; exact/conflicting retries, no-op, stale, bounds, auth and concurrency behave as specified. | Root passing domain/HTTP run includes twelve Comeback HTTP cases and parent; final 8/8 browser cases confirm cancellation, explicit apply and stale recovery. Root browser MCP also observed cancel retaining the original dates. | verified pass | Concurrent HTTP requests against this single local server; no separate concurrent-process writer claim. |
| AC06 / CB03 behavioral subset | Exact date comparison and both conflict types, retained work, explicit acknowledgement, EN/FR, zero/empty states, keyboard/focus and narrow-screen themes. | Final 8/8 browser run exercises light/dark, French 390px/320px no-overflow checks, focused preview heading, keyboard checkbox, retained input, conflicts and zero/empty/all-complete states. | verified pass | Emulated Edge viewports and sampled interactions; not physical-device, screen-reader or accessibility-conformance evidence. Fresh visual-fidelity judgment remains separate. |
| CB03 visual verdict | Fresh visual review of actual desktop/mobile renders against the Amber reference. | Root has separately assigned the fresh visual reviewer. | unverified | This source reviewer did not inspect rendered pixels or measure contrast; no visual score is inferred from passing interactions. |
| AC06 / CB04 | Editing invalidates the preview; stale data requires refresh/re-preview; uncertain saves preserve exact body/key; detached views ignore pending results. | Final 8/8 browser run covers hidden apply after date change, stale regeneration, exact lost-response retry after an intervening plan edit, saved POST/failed GET recovery, and delayed preview/confirmation after navigation. | verified pass | Synthetic response failures; no physical network-disconnection claim. |
| AC06 / CB05 | Saved schedule and receipt persist after reload/process restart; five-minute activity never completes a step; existing journey regresses cleanly. | Root `pnpm run verify:process` passed with distinct Node processes and retained receipt/session/history; domain/HTTP and browser checks passed. Root browser MCP observed seven unfinished dates move Oct 8–14 to Oct 11–17 while completed Oct 7, 1/8 completion and one five-minute session stayed fixed after reload. | verified pass | Local child-process restart, not machine reboot. Existing 19 browser cases and final 8 Comeback cases passed across recorded runs, not one 27-case run. |
| CB06 | Recorded actual checks/review limits, the intended source revision and saved tracker comparisons. | This invocation/report provides independent review evidence. | unverified | Publication/tracker reconciliation are outside reviewer authorization and pending root closeout. |

### Inspected fingerprint

SHA-256 of working-copy file bytes, obtained with PowerShell `Get-FileHash -Algorithm SHA256`. These are local inspection fingerprints, not commits or publication evidence.

| Path | SHA-256 |
| --- | --- |
| `src/shared/contracts.ts` | `5086d61200798d3ec856be010c4229eee19cb1cef676e5d5b0cf216c449c7594` |
| `src/domain/comeback.ts` | `c70dc828994a194aa25b0b8d1f06b52f4975eb4a809a983277ba86e2bcb6a9ec` |
| `src/domain/validation.ts` | `18460d9db8e17a4a9582312a8a934ac4acb05af95a4fb613e09f2cee4264897e` |
| `src/domain/progress.ts` | `7aa37c54f9d9ed4414bf3703556c02588c5b1adc105667ea2c87d207c3849ab2` |
| `src/server/store.ts` | `d8b94f4caba2e8d8790af04d995f793842c35c8e704cb446027972cf4d649023` |
| `src/server/app.ts` | `72a0f9e6926872f98d23950f0c9471bd9ed9740f4a94b8e6210b21f5b7fc8511` |
| `src/client/comeback.ts` | `05260b9dd040d81589c2e8ead4b3132770b426e461260b4dd7ba0e1ad582abf6` |
| `src/client/main.ts` | `fa265e9ad1b57af7558195b2912bbdbb620b67a7b329107c35e41e4cb1fa1bde` |
| `src/client/journey.ts` | `bf6cbbff2f12c346a15367d69fe8e2753299e1a3eb3c6b9beafadf9c5f71c61a` |
| `src/client/i18n.ts` | `ac32839f9099b8c265ef5ecb4b472330948ee46ced276eaed39615f5f363823d` |
| `src/client/styles.css` | `55b6f619d83169f9fe10ffb90d528fc5131b7710e16793374bf20887629bcd97` |
| `tests/domain/comeback.test.ts` | `3e325eb0a1d2dbf50942a9fd67a6cfdfc145b1cb76ff29038bfbf3011cc0a234` |
| `tests/server/comeback.test.ts` | `4c88226fad3d42ec7d63f5c70d0247fd8ddaa99f2683e1cce4525751a484a167` |
| `tests/e2e/comeback.spec.ts` | `f66abce59f4c7e1f97f530d3cd4e328793f40da0a54beae710768e391eaf4e78` |
| `tools/verify-process.mjs` | `76b2c529260125c7b1011b91979d38fb2d237df08171f2eba222e64007a95a82` |

## Constraints

### Findings and source conclusions

No confirmed P0–P2 production defect remains. This is bounded review confidence, not proof that defects are absent.

- **History and atomicity:** the domain builds new proposed step objects; confirmation first re-reads the owned plan and checks its revision inside the existing SQLite immediate transaction. It changes only mapped unfinished scheduled dates plus revision/timestamp. Completed fields, activity/completion/scope tables, target and availability are untouched. The no-op path returns before saving the plan; the receipt still persists in the transaction.
- **Ownership and input:** both routes follow the existing authenticated API middleware, Host/Origin/content-type and body-size controls. Validators reconstruct strict canonical input; owner qualification precedes receipt lookup. The client cannot supply the final dates or conflict list.
- **Retry and staleness:** exact retries retain the original body/key. Stale and idempotency errors invalidate applicability and require a deliberate reload/new preview. The client ignores the receipt's potentially old detail and fetches current detail after confirmation. A failed follow-up GET exposes an open-saved-plan recovery instead of implying the mutation failed.
- **UI lifecycle and localization:** busy state freezes form controls; navigation remains available through the shell. Async callbacks require both a connected view and matching route generation. Text uses existing safe rendering and locale bindings; selected dates and preview DOM survive locale/theme changes. Semantic current/proposed labels, native inputs/buttons, heading/error focus and scoped theme tokens follow the existing Amber system.

### Verification limits and follow-ups

- The reviewer ran only read-only source inspections, `git rev-parse HEAD`, scoped `git diff` and the scoped `git diff --check`; the whitespace check exited 0, with only the repository's LF-to-CRLF notices. Untracked new files are represented by the SHA-256 manifest, not covered by `git diff --check`. Root performed the app checks summarized below; reviewer inspected the three browser logs and final changed source/test fingerprints.
- The two initially missing CB04 branches now have passing execution evidence. The added later-edit fixture initially sent server-only `completedAt` through the strict PUT API. This reviewer flagged the field mismatch; root corrected the fixture to project only accepted fields. The final test verifies the exact retry body/key and shows the intervening goal after reloading current detail. The other new case verifies that recovery from successful confirm/failed GET sends only one confirmation.
- `PRODUCT.md` still described Comeback as future work during inspection. Root was notified to align it and document the narrow `DESIGN.md` extension during closeout after actual verification. This is pending lifecycle documentation, not evidence that behavior failed.
- Root's single manual Impeccable detector output `.local/comeback-detect.json` contained 34 advisory entries and no blocking-severity entry. Reviewer inspected the output and confirmed the two new type-ramp deviations were corrected from 1.4rem/0.85rem to the documented 1.35rem/0.91rem. The other 32 advisories are existing styles outside this increment; they were not suppressed. Detector output is mechanical evidence, not visual acceptance.
- This is a scoped technical source audit, not a visual-fidelity verdict. No total Impeccable health score is assigned without rendered contrast, performance and reflow measurements. Fresh desktop/mobile review results must be recorded separately. The earlier formal Impeccable phase boundary remains open; no finish receipt or human visual approval is inferred.

### Actual root execution evidence

| Check | Recorded result | Evidence boundary |
| --- | --- | --- |
| `pnpm run check`, `pnpm run lint`, `pnpm run format:check`, `pnpm run build` | Passed. Following final test-fixture correction, check/lint/format passed again; final lint checked 31 files and formatting checked 36. | Root execution reported to reviewer; no duplicate reviewer compiler run. |
| `pnpm test` | 40/40 passed: 20 existing and 20 new results, including parent tests. | Pure domain and in-process HTTP/database checks. |
| `pnpm run verify:process` | Passed. Distinct Node processes retained saved dates, receipt, session, secret, private reflection, activity and completion. | Actual child-process termination/restart; not machine reboot. |
| `pnpm run audit` | Passed with no known vulnerabilities. | Dependency audit at execution time; not proof of application security. |
| `pnpm run test:e2e` initial full run | 25/26 passed; the failed date-invalidation assertion used a role locator excluding the correctly hidden apply button. Root corrected the assertion to hidden-state behavior. | Read `.local/comeback-e2e.log`; passing existing 19 cases remain regression evidence. No production assertion or behavior was weakened. |
| First affected 8-case browser run | 7/8 passed; the new intervening-edit fixture was rejected with HTTP 400 because it supplied `completedAt`. | Read `.local/comeback-e2e-final.log`; validation rejection was expected for that invalid fixture. |
| Final affected `tests/e2e/comeback.spec.ts` browser run | 8/8 passed, exit 0, 1.4 minutes. | Read `.local/comeback-e2e-confirmed.log`. Final source/test fingerprints above. Across the full and corrected batches, all 27 distinct cases have passing evidence; no single 27-case pass is claimed. |
| Root browser/computer-use MCP | Root observed preview, unchanged cancel, explicit checkbox/apply and reload against a synthetic eight-step plan. | Root reported actual actions/results and saved `outputs/comeback/preview-user-1280.png` and `outputs/comeback/saved-schedule.png`; source reviewer did not personally operate that browser. |

## Done When

The independent behavior/source review is complete. No production source fix is requested; the two test defects were corrected and final affected execution passed. CB01/CB02/CB04/CB05 and the listed CB03 interactions have verified evidence within the limits above. Fresh visual review, lifecycle documentation alignment and CB06 publication/tracker readback remain root-owned closeout work. Any subsequent production change requires checking the affected fingerprint and relevant acceptance evidence.

The reviewer did not run a browser, start a server, execute aggregate tests, edit product code, publish source or update trackers. This actual skill invocation demonstrates a bounded independent code review; it does not establish usability, accessibility conformance, human adoption, long-term retention or learning benefit.
