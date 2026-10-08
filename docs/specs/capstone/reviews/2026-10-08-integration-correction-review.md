# P09 — Independent lifecycle correction review

8 October 2026, Africa/Lagos. Parent baseline: `6415a2958cbc2f9f05e928ea3bf8b890623e1359`; reviewed candidate is an uncommitted diff.

## Goal

Review the actual correction of P08's session, screen-lifetime, dirty-state and route findings against IC01–IC05. This is a second meaningful invocation of [learning-journey-review](../../../../.agents/skills/learning-journey-review/SKILL.md), using changed production code and reproduced defects rather than repeating the baseline verdict.

Initial disposition was **correction review remains open** because an additional profile/locale write race remained. The subsequent queue correction below resolves that source finding; **no remaining scoped source blocker was found**, all 12 focused integration cases pass, and the completed full browser regression passes **48/48**. The initial snapshot and findings below are preserved as history, not the final source state. This is a scoped correction-review pass, not a defect-free or completed-capstone claim.

## Context Pointers

- [P08 baseline review](2026-10-08-integration-review.md), preserved separately; [integration contract and IC01–IC05](../increments/integration.md); [actual baseline/MCP verification](../increments/integration-verification.md).
- R18 closed at 17:36 Lagos; the 17:40 addendum establishes that already-pending current-view operations remain valid until sign-out succeeds, avoiding stranded Circle/Comeback controls when sign-out fails.
- The production diff is confined to [main.ts](../../../../src/client/main.ts). No server, domain, schema, API, dependency, private-sharing policy, stylesheet or view module is changed by this patch. Added [integration browser tests](../../../../tests/e2e/integration.spec.ts) hold real successful server responses after authorization/persistence. Other modified records describe the design/evidence refresh, not additional app behavior.
- Initial inspected SHA-256: `main.ts` = `CB539A969CB89D2EAE1B43B3FA296BFE394D5D11411501DDD923741C2A7D764E`; `integration.spec.ts` = `B8D62ABA717AAC1D6178CF427E65351341EBA35E8A262CB7C8787A8504F70DC8`. These hashes identify this initial follow-up snapshot, not any later correction.

This reviewer read the actual diff, current main/client modules and tests, contract/addendum, baseline execution report and root's connected browser observations. Impeccable's technical-audit criteria apply to the state-preserving UI correction; previously loaded context and detector evidence are reused. No context/detector rerun, screenshot, application runner, browser action or database write was performed by this reviewer.

### Acceptance and finding disposition

| IC / AC | Baseline evidence | Candidate source disposition | Executed corrected-source evidence / limit |
| --- | --- | --- | --- |
| IC01 / AC09 / IR01 | Held authorized GET restored private content after successful sign-out despite fresh server 401; delayed locale response restored account controls. | `clearSession()` advances session/view/profile generations and clears private caches. `beginView()` includes session identity; root reads, auth and initialization inspect current lifetime. | Nine focused cases are running under root coordination; **unverified** until actual results arrive. |
| IC02 / AC01/AC03/AC10 / IR02 | Persisted editor response replaced a newer draft; old study/profile callbacks cleared its guard. | Every root view entry advances the view generation; editor/study/profile callbacks check their captured current view before mutating global detail/dirty/route. Circle/Comeback use the same current guard while retaining their attached-view guards. | **Unverified** pending corrected run. Detached controls' local cleanup may finish, but shared state is guarded. |
| IC03 / AC04/AC09/AC11 | Locale-after-sign-out failed; ordinary in-place EN→FR→EN preservation passed. | Session/profile operation guards prevent old responses replacing client identity/preferences. Language remains an in-place update. **CR01 below remains open:** sending a full profile from stale `me.profile` can overwrite a newer timezone on the server. | Initial nine tests do not cover a locale change during a successful held timezone-save response. Additional reproduction required; do not close IC03 solely from their result. |
| IC04 / AC09/AC10 / IR02 | Failed sign-out retained session/form but removed dirty guard. | Sign-out checks dirty without clearing it, sets a pending flag and makes root inert. New root actions stop, while existing valid callbacks may complete. Success clears session; failure reports its error without falsely asserting revocation; finally removes inert/busy state. | **Unverified** pending the failed-sign-out regression and aggregate Circle/Comeback runs. A newly requested sign-out does not by itself invalidate current-view finally/unlock behavior. |
| IC05 / AC11c/AC11e / IR03 | Actual root MCP and regression showed My learning with `#journeys` after plan creation. | Successful current editor callback now sets `route = "learning"` and `history.replaceState(..., "#learning")` before render. | Focused test asserts route/hash and actual reload destination; result pending. |
| Unaffected AC01–AC11 portions | Baseline review maps prior 56 domain/HTTP and 36 browser passes to exact features, with bounded limitations. | No domain/server/peer-policy/CSS change; reuse baseline matrix rather than claim fresh re-execution. | Full required root regression pending. |
| AC12–AC14 | Fresh checkout/adaptation and actual timed video remain later work; repeated scoped skills/MCP/tracker records exist. | This review adds a genuine correction iteration to AC13. | No setup, publication, tracker write, demo or outcome pass inferred here. |

## Constraints

### CR01 — P2: locale persistence can overwrite a newly saved timezone (IC03; AC04)

`showProfile()` sends the chosen timezone to PUT `/api/me`, but does not update `me.profile` until its response is delivered. While that response is pending the topbar language remains usable. `changeLocale()` submits `{ ...me.profile, locale }`, including the previous timezone. Holding an already-successful timezone response then switching language therefore sends a second full-profile write that restores the old timezone. `profileVersion` can discard an old response on the client; it cannot undo the stale field written by the newer request.

Concrete reproduction for root: start at Africa/Lagos; edit Preferences to America/New_York; hold the successful timezone PUT response after persistence; switch to Français; inspect the second request/body and GET `/api/me`; release the held response. Expected timezone is America/New_York throughout and after reload. Source predicts Africa/Lagos is persisted again. The plan store propagates every saved profile timezone to each plan, so the seven-calendar-day boundaries can change despite the learner's explicit successful timezone choice.

Smallest coherent fix should coordinate profile writes at their existing client owner: serialize or defer/coalesce language persistence against the pending intended profile rather than resending stale fields. Preserve immediate in-place language switching and learner-authored text. Handle failure and navigation without clearing the newer view's dirty state or falsely claiming an unconfirmed timezone save. No new endpoint, dependency, framework or schema is justified. Reopen the affected research item and document this interaction before dependent production edits.

This is source-confirmed write ordering, with behavioral reproduction pending. Root was notified promptly; it must not be relabelled a reproduced defect or fixed behavior without the actual check.

### What the patch gets right

The separate session and view generations express different lifetimes without changing resource authorization or persistence. Successful sign-out invalidates queued private responses and account work; failed sign-out preserves the actual current form. Profile-operation generation avoids applying older identity responses. Route/hash correction is small and located where the successful save changes destination. Current Circle/Comeback callbacks remain valid during a pending sign-out, so a failed attempt does not strand their completion/finally paths. Ignored old responses do not imply the server mutation was rolled back.

The initial nine tests distinguish seven actual product failures from two controls and preserve the authentication-throttle setup failure separately. Their response gate retrieves real successful HTTP responses before withholding delivery; it does not fabricate persistence or bypass authorization. Required aggregate checks and any extra reproduced case remain root-owned. No assertions or security controls should be weakened to obtain green results.

Formal Impeccable phases and wider physical-disconnection/native-language/accessibility/learner-outcome evidence remain separately open, as recorded in the integration contract. This source review neither modifies the selected Amber system nor manufactures a design receipt.

## Done When

Root reproduces/disposes CR01, supplies actual focused and aggregate results for the final source, and this reviewer confirms the resulting diff has no remaining scoped correctness blocker. Record exact final source hashes, command/results and any residual limitations below; preserve this initial finding and baseline evidence. Publication and saved tracker reconciliation remain separate root delivery actions. No new application test was executed by this reviewer.

### Subsequent evidence

**First correction and actual CR01 reproduction.** `.local/integration-corrected-browser.log` confirms all original nine cases passed in 3.4 minutes. That first correction therefore has actual passing evidence for the seven P08 failures and two controls. CR01 was then reproduced independently: `.local/integration-timezone-race-before.log` records the expected America/New_York versus actual Africa/Lagos result, with locale `fr`; its one case failed at the intended persisted-profile assertion. This is now a verified failure, superseding the initial source-only status. R18b was reopened and reclosed before dependent settings-order edits at 17:47 Lagos, as reported by root and recorded in the integration contract/research history.

**Final source inspection.** The new `saveProfile(patch)` helper serializes each profile operation on a promise sequence. Each operation reads fresh authenticated `/api/me` inside that sequence, verifies the captured account ID, merges only intentionally supplied fields, then sends the existing full-profile PUT. It checks the captured session before I/O and after every await. A failed prerequisite read cannot fall through to PUT. A failed operation still rejects to its caller while the queue's neutral completion handler permits a later operation to proceed. The next operation's fresh GET handles an earlier persisted write whose response was lost. `clearSession()` resets the queue and advances the generation; obsolete queued operations stop before sending and late in-flight results cannot restore private client state. Already-sent server mutations are not claimed to roll back.

Profile cache updates are allowed only for that same session. Active originating views alone may navigate or clear their own dirty state; a language-only update does not replace current learner input. Immediate `setLocale()` still runs in place, so serialization does not force the language selector to wait for the profile response. The existing pending-sign-out invariant remains unchanged: valid current-view work may settle and unlock before sign-out succeeds, root interaction is blocked meanwhile, and a failed attempt retains the current dirty guard. The route/hash and root-response corrections remain intact.

Final inspected SHA-256: `main.ts` = `02336C34A1152E2BA508E7C8562F615FF4C3E72D8320EA2D4A4BA7F437888738`; `integration.spec.ts` = `E91F22AB1174112A280EF0BF710FB5FE91F6C1E9614B00A49E9B02AB7800C676`. Production scope remains only the client entrypoint. The local serialization contract does not promise cross-tab or server-wide ordering, matching the research addendum. No additional abstraction, API or dependency was introduced.

**Scoped source disposition:** IR01, IR02, IR03 and CR01 are addressed in the reviewed final source, with no further scoped blocker identified. This is source review, not yet a final 12-case or full-suite pass.

**Execution boundaries retained.** Root reports 56 domain/HTTP cases, distinct-process persistence and registry audit with zero known findings passed; those executions are not this reviewer's own. Root's first strict-check attempt found nullable root-element typing in the correction, then the implementation agent introduced the checked non-null binding and reported type-check success. The first expanded browser attempt stopped during collection because its `afterEach` fixture argument used an unsupported non-destructuring parameter; `.local/integration-final-browser.log` preserves that failure. The corrected fixture began all 12 cases in `.local/integration-final-browser-rerun.log`; this reviewer observed five completed passes while that run was still active. Do not infer the final outcome from partial output. Final focused and aggregate results remain pending below.

### Focused behavioral disposition

The completed `.local/integration-final-browser-rerun.log` was then read directly: **12 passed in 2.3 minutes**, zero reported failures. Root reports the command `pnpm exec playwright test tests/e2e/integration.spec.ts` exited 0. A fresh file-hash read confirmed `main.ts` still matches the final inspected SHA above. These are test-agent executions whose actual final log this reviewer inspected, not newly run tests by this reviewer.

| Criterion / finding | Final focused result | Disposition and limit |
| --- | --- | --- |
| IC01 / IR01 | Held authorized plan GET and delayed profile/locale results leave the completed sign-out screen and backend 401 intact. | **verified pass** for tested session-boundary cases; initialization/auth branches also reviewed in source. |
| IC02 / IR02 | Late persisted editor, study and profile responses preserve the newer draft, selected screen and dirty guard. | **verified pass** for the reproduced cross-view failures. Existing Circle/Comeback aggregate regression remains pending. |
| IC03 / CR01 | Delayed timezone save plus language change retains America/New_York/fr after reload; a lost successful profile response cannot revert timezone; failed prerequisite GET causes zero PUTs and a later language save succeeds. | **verified pass** for all three added settings-order/error cases. In-place EN/FR learner text/focus/dirty-state control also passes. No cross-tab ordering claim. |
| IC04 / IR02 | Failed sign-out shows the network error, keeps the real session and current input, and retains the unsaved navigation guard. | **verified pass** for tested failure case. Pending current-view completion/unlock invariant independently reviewed in source. |
| IC05 / IR03 | Saved new plan selects My learning, sets `#learning`, and actual reload retains that destination. | **verified pass**; baseline URL mismatch resolved. |

IR01–IR03 and CR01 are now behaviorally resolved within the focused cases, with no remaining scoped source blocker. Root also reports final strict check, lint (39 files) and format check (44 files) passed, alongside the 56 domain/HTTP cases, distinct-process check and dependency audit already reported. The full browser regression contains 48 anticipated cases and is still running; **no aggregate pass is claimed until its actual completion**. Publication, trackers, formal design phases, clean-checkout adaptation, the timed video and learner outcomes retain their separate evidence boundaries.

### Completed aggregate disposition

Subsequent direct read of `.local/integration-full-browser.log` confirms **48 passed in 9.8 minutes**, including all 12 integration cases, nine Circle cases, eight Comeback cases and the prior private-journey, inclusion and shell regressions. This supersedes the preceding running-state note. A fresh read confirms the production `main.ts` SHA-256 remains `02336C34A1152E2BA508E7C8562F615FF4C3E72D8320EA2D4A4BA7F437888738`; no source change after the reviewed final candidate is inferred or required. The browser run also rebuilt the application; root owns the execution receipt and final process/port checks.

Root subsequently confirmed exit 0, no failed/skipped/retried cases, and release of isolated test port 4318. The final `integration.spec.ts` hash is `C754FAA58868B48A35F0B525A27066203D748F036C188094A508E022503AC00E`. The earlier `E91F22...` hash identifies the test snapshot before the documented fixture-signature correction to `({ page: _page })`; the test file is not claimed unchanged between those snapshots. Production `main.ts` remained unchanged throughout the final focused/aggregate runs.

**Final disposition: scoped P09 correction review passes.** IC01–IC05 and IR01–IR03/CR01 have source review and actual focused behavioral evidence, and the full browser regression adds current Circle/Comeback and existing journey/shell coverage. No remaining scoped correctness blocker was identified. All baseline product failures, the additional timezone failure, the authentication-fixture and collection failures, and the strict-type correction remain preserved above. This reviewer did not rerun application tests or modify product code.

The [integration verification record](../increments/integration-verification.md) is the final consolidated record for exact commands, delivery, publication and tracker readbacks. Formal Impeccable phases, broader physical-disconnection/native-language/accessibility evidence, fresh-checkout adaptation, the timed video and actual learner outcomes remain separately bounded or outstanding. Passing these checks does not establish universal correctness, production readiness or capstone completion. Review-file ownership is released to root for final integration and delivery.
