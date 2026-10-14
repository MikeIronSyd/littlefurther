# P07 Private StudyCircle implementation review

8 October 2026, Africa/Lagos. Independent review using the project's `learning-journey-review` skill and Impeccable technical-audit guidance. **Scoped P07 review closed with no remaining blocker at 16:47; see the final evidence closeout below.** Earlier sections are retained as dated snapshots, including their then-pending evidence. Publication and tracker completion are outside this review's conclusion.

## Goal

Review the private StudyCircle increment against F08–F14, AC07–AC11 and SC01–SC07. Baseline: `e519d10f0391f8acd06c7d57aad5caf59df58dbf`. The scope includes additive migration, server authorization, invitation and receipt lifecycles, shared-field privacy, destructive cleanup, and truthful client state. Product source is read-only for this reviewer; root owns the single aggregate runner, process restart, browser observations and delivery.

## Context Pointers

Read [AGENTS.md](../../../../AGENTS.md), [project context](../../../../project-context.json), the [review skill](../../../../.agents/skills/learning-journey-review/SKILL.md), [parent specification](../spec.md), [research gate](../research.md), [P07 contract](../increments/studycircle.md), [backend research](2026-10-08-circle-backend-research.md), [UI research](2026-10-08-circle-ui-research.md), and [P06 verification](../increments/comeback-verification.md). Also inspected the incumbent auth/API, persistence, client request/render/lifetime helpers, product record and Amber design system. Root owns the session's Impeccable context invocation; it was not repeated.

### Acceptance evidence matrix

| AC | Expected behavior | Evidence/revision | Result | Limitation |
| --- | --- | --- | --- | --- |
| SC01 / AC10 | Fresh/repeated v2 startup, populated-v1 preservation, rollback, unsupported schema rejection, valid foreign keys. | P07 contract and backend research inspected. | unverified | Feasibility probes and old passing tests do not establish production migration behavior. |
| SC02 / AC08 | Authenticated two-account join; hash-only once-returned token; expiry/revocation/single use/concurrency; transactional limits and retry. | P07 contract and new shared types/validation inspected. | unverified | Final implementation and root execution pending. |
| SC03 / AC07 / AC09 | Deliberately approved immutable copy and DTO allowlists exclude private information; strict input and literal rendering. | Parent F08/F11, shared types and parsers inspected. | unverified | Static contract alone cannot pass a sharing journey. |
| SC04 / AC07 / AC09 | Every role/resource boundary and nested ID checked; leave/remove/delete/close cleanup preserves private work and prevents stale receipt resurrection. | Contract-derived lifecycle invariants sent to root. | unverified | Final implementation and synthetic authorization/lifecycle execution pending. |
| SC05 / AC11 | No-plan entry, localized state, keyboard/focus, input/preview preservation, honest failure, detached response and token privacy. | UI research and existing helpers inspected; Impeccable audit reference applied to planned source review. | unverified | No running P07 UI or pixels observed by this reviewer. Visual review is a separate scoped task. |
| SC06 / AC10 | Reload and distinct-process persistence; existing journey/Comeback regressions. | P06 evidence supplies historical context only. | unverified | P07 run pending; no stale result is reused as a new-feature pass. |
| SC07 | Recorded review, aligned documentation, source documentation and saved tracker comparisons. | This actual skill invocation and interim report. | unverified | Root-owned delivery/readback pending. |

## Constraints

### Initial contract findings

No consequential research blocker or contract contradiction was found in the supplied R17 closure and P07 contract. R17 closed at 10:55 Africa/Lagos before production work. The agreed local scope does not require remote peer access, email dispatch, runtime AI, a full chat system, or a new learner-segmentation decision.

The final source review will trace these high-risk invariants explicitly:

- Current authorization and the same membership incarnation must precede receipt replay. An old receipt cannot reveal stale shared data or resurrect an item after deletion/removal/rejoin.
- Retrying invitation creation returns metadata and `token: null`; raw bearer values never enter SQLite receipts, URLs, browser storage or logs.
- Replaying old encouragement must not overwrite a later preset. Nested IDs must belong to the path circle, including before receipt replay.
- Failed redemption/capacity checks must leave the invitation unused. Expiry includes equality at the boundary, and active ownership/membership limits are enforced in the mutation transaction.
- Leave/removal must remove the member's copies and attached encouragement, plus their encouragement on another author's copy, without modifying private plans/history.
- A known-saved write followed by failed readback must expose GET-only recovery. An uncertain write must reuse its exact body/key. Denied access must clear rendered circle data, and detached responses must not replace another screen.

### Verification boundary

This reviewer has run only read-only source/document inspections and has not started an app/server, executed tests, operated the browser, published source or changed trackers. Actual results and final byte fingerprints will be incorporated when root supplies them. Source inspection cannot establish a full visual verdict, native French quality, accessibility conformance, measured performance, human adoption, retention or learner benefit.

## Done When

The final implementation is reviewed against the invariants above, actual root execution is mapped to SC criteria with failures/limits retained, final inspected files have exact SHA-256 fingerprints, and confirmed findings have dispositions. Until then, review remains open. Publication and tracker closeout require root's separate verified evidence.

## Fresh final-source review — 8 October 2026, 16:29 Africa/Lagos

### Goal

The independent `circle_final_review` agent invoked `learning-journey-review` again for the corrected, uncommitted P07 implementation above baseline `e519d10f0391f8acd06c7d57aad5caf59df58dbf`. **No remaining production blocker was found in the inspected source.** Two client findings were reported and corrected by the separate `circle_fix` agent; their browser regression checks remain pending in this snapshot. This is a source-review conclusion, not a release, full-capstone, or visual approval.

### Context Pointers

This invocation read the repository instructions/context, the reusable review skill, the parent F08–F14 requirements, R17 closure, P07 contract, P06 verification history, final server/domain/shared/client implementation, affected domain/HTTP/browser tests, and the distinct-process verification script. It applied Impeccable's `reference/audit.md` to UI source, read the existing session context output, and did not repeat the context command. The reviewer ran only read-only inspections and file hashing; root retained the sole test runner, app, browser, publication and tracker ownership.

| AC / scoped slice | Expected behavior | Evidence / revision | Result | Limitation |
| --- | --- | --- | --- | --- |
| SC01 | Additive v2 startup/upgrade, populated-v1 private row and receipt preservation, failed-migration rollback, unknown-version rejection and valid foreign keys. | `tests/server/circle-store.test.ts`; actual root `.local/circle-all-tests.log` inspected, 56/56 tests pass, zero failed/skipped. | verified pass | Scoped synthetic SQLite fixtures; no restoration of a real learner database or machine reboot claimed. |
| SC02 / server | Two actual sessions; bounded hash-only once-returned invitations; exact/conflicting replay; expiry equality, revocation, concurrent redemption and transactional capacities/rollback. | `circles.ts` access/write/redeem paths; real-session HTTP suite and store tests in the inspected passing log. Trigger failure after membership/token mutation rolls back membership, consumption and receipt; the same request later succeeds. | verified pass | HTTP concurrency uses concurrent requests to the single local server; this is not distributed-system or measured load evidence. Browser join/recovery remains a separate pending slice. |
| SC03 / server | Explicit allowlisted immutable copy; strict body/enums/bounds; shared DTO excludes private plans/reflection/resource data and identity internals; old encouragement receipt does not revert a newer preset. | Pure parsers, DTO construction and receipt paths inspected; actual domain/HTTP assertions in the passing 56-test log. | verified pass | DOM preview/consent, literal rendering and locale behavior require the pending browser run; source alone does not pass those slices. |
| SC04 / server | Session/member/owner/author boundaries, cross-circle resource IDs, membership-incarnation replay protection, cleanup and private history preservation. | `access`, `write`, `replayAccess`, nested lookups and composite cascade foreign keys inspected. Actual HTTP checks deny anonymous/nonmember/wrong role, stale receipt after removal/rejoin and closed access; private history comparisons and FK checks pass. | verified pass | Already rendered/seen information is not recalled; no push revocation promise. This is scoped application review, not an exhaustive independent security scan. |
| SC05 / client | Accurate uncertain/save/denied states; exact retry body/key; no stale route replacement; active-view token lifetime; EN/FR controls and responsive semantic source. | Corrected `circle.ts`, `i18n.ts`, main integration, helpers and CSS inspected. New missing-copy retry and detached join-input assertions inspected in `tests/e2e/circle.spec.ts`. | unverified | Both findings below are resolved in source; automated/browser MCP execution, final detector and rendered review were not yet supplied at this snapshot. |
| SC06 / process | Separate executable processes retain both sessions, private history, circle membership/copy/preset and once-returned invitation semantics. | `tools/verify-process.mjs` inspected; actual root `.local/circle-process.log` inspected. Script asserts different process IDs and fresh readback, including `token: null` on invitation-creation replay. | verified pass | Root executed this check. It establishes process termination/restart, not a machine reboot or physical internet-disconnection check. Browser reload and complete browser regressions remain pending. |
| SC07 | Actual review invocation, aligned records, publication to this private repository and saved tracker readback. | This invocation and report preserve source/check evidence and findings. | unverified | Root-owned documentation/delivery/tracker closeout remains separate; no remote publication or tracker action was performed by this reviewer. |

Root reported successful `pnpm run check`, `pnpm run lint`, `pnpm run format:check`, `pnpm run build`, `pnpm test`, `pnpm run verify:process` and `pnpm run audit`. This reviewer directly read the saved build, 56-test and process logs; the other command outcomes are attributed to root's execution report. The root corrected a strict test-row typing assertion before those passing aggregate checks. The later `circle_fix` agent reported passing strict compiler and scoped lint/format checks after the two client fixes; final aggregate/browser evidence must name its own run and inspected revision. No independent command execution is implied. A dependency audit reporting no known vulnerabilities is not a vulnerability-free guarantee.

### Constraints

#### Findings and dispositions

1. **P2 / SC05 — mutation target disappearance was reported as lost circle access.** The earlier client sent every 403/404 mutation error directly to `deny`, including a safe deletion retry whose tombstoned item legitimately returns 404 while the owner still belongs to the circle. That incorrectly cleared the usable circle view and claimed access loss. Corrected at `src/client/circle.ts:195`: perform the operation's read-only reconciliation before interpreting access; use neutral localized `circleActionReconciled` copy after a successful read. A failed transport/readback keeps controls frozen and offers GET-only refresh; a denied fresh read still clears previously rendered content. Source disposition: **resolved**. Root's missing-copy browser regression is present but execution is pending at this snapshot.
2. **P2 / SC05 — a pasted join code survived view disposal in detached DOM.** Only the newly issued code was cleared by `forgetToken`; a pasted code was cleared only after successful redemption. `i18n.ts:709` retains translated nodes in a strong `Map` until a later locale change, so their detached ancestor tree can retain the join input and its value. This violated the active-view-memory contract without establishing a disk/storage/log leak. Corrected at `src/client/circle.ts:70`, `:88`, `:358` and `:722`: track both issued and pasted input nodes and clear both through the existing navigation, read replacement, denied-access and detached-view paths. Uncertain active-view retries retain their exact request. Source disposition: **resolved**. Root added a direct detached-input-value assertion; execution is pending at this snapshot.

No other confirmed source defect was found. Specifically:

- Server-derived identity is the authority. Current active circle access and owner role, where required, precede successful generic receipt replay. Creation/redemption replay also calls `replayAccess`; matching membership UUID prevents removal/rejoin from reviving former requests.
- Receipts contain operation/digest/IDs rather than names, shared text, raw invitation tokens or historical DTO snapshots. Operation names bind nested resources to their path; transaction actions also query the nested resource inside that circle. Deleted resources remain unavailable on replay rather than being recreated.
- Invitation creation uses 32 random bytes, stores SHA-256 only, and replays metadata with `token: null`. Immediate transactions contain capacity checks, membership insertion, token consumption and receipt insertion. No circle query joins private plan/history tables.
- Composite foreign keys remove a departing member's copies and attached encouragement plus encouragement they sent elsewhere in the circle. Closure invalidates unused invites and removes memberships/shared content while retaining private learning tables. Old encouragement replay returns acknowledgement without overwriting the currently saved preset.
- The client renders supplied text through text nodes; preview normalization matches the trimmed payload, editing invalidates approval, and only explicit share sends the copy. Locale binding preserves live inputs rather than recreating forms. Timestamps use the learner timezone. Current-view checks and generation guards prevent late responses from replacing another route.

Impeccable audit dimensions remain **unscored** here: source confirms semantic forms/labels, focus/status mechanisms, bounded data, token-based colors and 320px-oriented breakpoints, but it cannot establish actual contrast, reflow, physical touch behavior, native French quality, performance or accessibility conformance. The session context calls for one final mechanical detector run; its result and a fresh rendered review must be recorded separately. No formal finish receipt is inferred, and the inherited Impeccable phase limitations remain in force. P08 full integration, learner evaluation, human adoption/retention and timed pitch/video are outside this review.

#### Exact inspected fingerprints

SHA-256 of corrected source/test bytes read at 16:29 Africa/Lagos; all were uncommitted at inspection. Later edits require a new fingerprint or a clearly scoped follow-up rather than silently inheriting this review.

| File | SHA-256 |
| --- | --- |
| `src/server/circles.ts` | `19a458d65653c4b6088000f2b2b526a375f849dfc4f470f4adabc989119c1c94` |
| `src/server/store.ts` | `6eb4ac6738bd9eb3604e17773456024c54d3b7990707ab979bec1aff29fbd08a` |
| `src/server/app.ts` | `4d529bd6a2b4bd1ab0dc273dbab9997ffc9d578ed7fa9bef93fd13e33d5cdf56` |
| `src/domain/circle-validation.ts` | `20d2ca7877ad22b17c8fe665c07529d1d58e72acc48d65591732251d6618a831` |
| `src/shared/contracts.ts` | `4593d3fae665760a41420a7a95533ee75447511b7c678471d7367b9fb2a9b106` |
| `src/client/circle.ts` | `f118872a7a571f7f012f3fde3960f3e7b1507fd597f7fabb6316aaee33a0aece` |
| `src/client/main.ts` | `ecba8889e27950cfe36c5d7120fbe639c8f8bb358062c2113d1c3705bd5f73a3` |
| `src/client/journey.ts` | `6246864e3e990908e59ad27c20ff998540ab7d77080336fba386be54fe9a7b78` |
| `src/client/i18n.ts` | `af278ff1edbd942e954b92a8b8e60fc8cd14614ea6c99c0a0a9e2b24e6d80e87` |
| `src/client/styles.css` | `ecd64b80a8e9295bb76cc26b2f472f7c590aa191a8ddf5be9e906bcff0a1c6a3` |
| `tests/domain/circle.test.ts` | `8b73b01d1ebb7cec9986cae3c3e3de431b6b4e222e174e6b25c5e5d6de80e1a1` |
| `tests/server/circle-store.test.ts` | `a489e84e1c2749aeaa8c1a9e5f468683e4a16a27159c9e2508c0fcf98cb32c76` |
| `tests/server/circle.test.ts` | `3c30111d6d0e88c3a559781a2d3c34b21ade279e9043d8f12ea445a33f7bf26d` |
| `tests/e2e/circle.spec.ts` | `7a3b9a9a867a1ee2f42cc0bef779654551e7d43e693fd236d48ab3698cbe0143` |
| `tools/verify-process.mjs` | `e64f2080075613b90b8ef349ec94205f72183aa4938dd94b9b7f99668ec9aa5c` |

### Done When

The independent source inspection and supplied server/process-evidence review are complete for the fingerprinted snapshot, with both reported client issues resolved in source and no remaining source blocker. This reviewer did not run tests or observe a running app. Root must still attach the final browser regression outcomes, manual browser MCP observations, detector/rendered-review limits, aligned records and delivery/tracker readbacks before treating P07 as delivered. Passing this source review does not close P08 or the full capstone.

## Final evidence closeout — 8 October 2026, 16:47 Africa/Lagos

### Goal

Close the P07 source-and-evidence review after inspecting root's final execution log and the separately authored visual and design-system reports. **No remaining P07 review blocker.** Both P2 client findings now have passing browser regression evidence as well as the inspected source correction. This closeout supersedes the pending-browser statements in earlier snapshots while preserving their history.

### Context Pointers

Reapplied the existing `learning-journey-review` workflow to the updated project instructions/context, [P07 verification](../increments/studycircle-verification.md), final acceptance criteria, `.local/circle-browser-final.log`, the retained initial `.local/circle-browser-all.log`, corrected browser fixture, [visual review](2026-10-08-circle-visual.md) and [design-system comparison](2026-10-08-circle-design-system.md). Recomputed all 15 prior file hashes; production source and all other listed inputs are unchanged. Only the browser fixture hash differs, following its added saved-plan setup.

The exact root command was `pnpm run test:e2e -- tests/e2e/circle.spec.ts`. Its wrapper invoked `playwright test "--" "tests/e2e/circle.spec.ts"` and actually ran **all 36 browser cases**, using one worker, with **36 passed in 7.7 minutes**. The inspected log includes the application build and actual test names: nine P07 cases plus all 27 incumbent journey/Comeback/inclusion/shell cases. This is a final single-batch 36-case result, not a claim that the command filtered to nine cases. The existing 56/56 domain/store/HTTP and distinct-process results remain applicable to the unchanged source. Root reports final compiler/lint/format/build/audit checks passed; this reviewer did not rerun them.

| AC / final review slice | Expected behavior | Evidence / revision | Result | Limitation |
| --- | --- | --- | --- | --- |
| SC01 | Safe additive migration, preservation, rollback and version/FK checks. | Earlier inspected 56-test log and unchanged migration/store bytes. | verified pass | Synthetic local migration fixtures only. |
| SC02 | Actual account invite/join, once-returned code and honest lost-response retry/revocation, plus server token/capacity/concurrency controls. | Final browser cases 1 and 3, earlier HTTP/store evidence; root's separate IAB/Chrome session walkthrough. | verified pass | Local sessions on one PC; no remote-peer or distributed-load claim. |
| SC03 | Deliberate preview/cancel/share, immutable allowlisted copy, private exclusions, literal rendering and preset encouragement. | Final cases 1, 4 and 8, unchanged source/domain/HTTP evidence, and root's preview/share/preset readback. | verified pass | Synthetic users and content; no learner-outcome or content-quality inference. |
| SC04 | Role/lifecycle boundaries, cleanup/private preservation and clearing denied rendered content. | Earlier server authorization/rejoin tests; final cases 2, 6 and 9 exercise removal, closure, missing-copy retry and uncertain leave. | verified pass | Subsequent request enforcement; information already seen cannot be recalled. |
| SC05 | No-plan access, exact uncertain retry, known-saved GET-only refresh, truthful missing-target reconciliation, detached callbacks/code cleanup, EN/FR/theme preservation and 320px keyboard/reflow. | All nine final P07 cases pass. Case 6 directly checks the corrected deletion retry; case 7 checks late reads/writes and the retained detached input's empty value. Case 8 checks preview invalidation, literal text, theme/language preservation, French 320px overflow and keyboard share. Separate six-capture visual report returns `ship`. | verified pass | Scoped browser assertions/captures, not full accessibility conformance, native-French certification, physical-touch or all-engine coverage. |
| SC06 | Browser reload, executable restart and incumbent regressions. | Final case 1 includes circle reload; the full 36-case batch includes all 27 incumbent cases. Earlier distinct-process verification remains applicable. | verified pass | The existing disconnected-browser test blocks non-loopback requests while the local server runs; no physical network disconnection or machine reboot is claimed. |
| SC07 / review portion | Independent findings, dispositions, documented evidence and visual/system comparison. | This final closeout plus linked visual/design-system reports. | verified pass | Review portion only. |
| SC07 / delivery portion | Aligned final records, source evidence and E009 saved tracker readbacks. | Root owns separate closeout and verification records. | unverified | No publication, hosted CI or tracker-success claim is made by this review. |

Root's browser computer-use MCP observation is separately attributed: at approximately 16:30–16:34 Lagos, the existing synthetic owner in IAB and a new synthetic partner in Chrome created/redeemed a local invitation, used the empty composer and explicit copy preview, shared the commitment, saved the partner's preset encouragement and read it back from the owner session. The current verification describes the preserved private plan/history and the two local captures `outputs/circle/circle-user-preview.png` and `outputs/circle/circle-two-account-result.png`. This reviewer inspected that evidence record, not the running browser; browser automation through MCP is not a native application connector or a human learner study.

### Constraints

The initial browser batch was **35 passed, one failed**. The inspected failure was the late-response case expecting an Activity heading without a saved private plan. Root added `await saveManualPlan(page)` before creating the circle; the intended late GET/POST assertions and detached-code check remain. The full corrected batch passes. The earlier auth-rate-limit fixture correction, strict SQLite-row typing correction and both production client findings remain recorded above and in the verification record; this is not a first-try-success claim.

The independent visual report inspected six supplied states and returned `ship` with no material visual fix. The design-system comparison found no new system mismatch and left DESIGN.md and its sidecar unchanged during its pass. Both reports were read here; their image inspection is attributed to their respective reviewers. The saved detector contains 34 advisories: the two within the P07 CSS insertion are the reused `1.15rem` secondary-heading size, and the remaining 32 concern unchanged styles. This is not a clean-detector claim. Formal Impeccable phases remain open; QUALITY BAR and hero/final comp-diff evidence remain unavailable. No numerical comprehensive audit score or formal finish receipt is inferred.

Final readback fingerprints (lowercase SHA-256):

| Input | Fingerprint / disposition |
| --- | --- |
| All 14 earlier listed source/domain/server-test/process inputs other than the browser fixture | Recomputed; each matches the exact 16:29 table above. |
| `tests/e2e/circle.spec.ts` | `94254add4875cad16e9c414b3866a092a21bb660cc2f3c2bbe62afc77e0286c4` — corrected fixture inspected. |
| `.local/circle-browser-final.log` | `05a6245d5eded1a4bd56e2b69d2c59f6b3d7ed35924c0ce8ceb3b31b9a494c53` — 36/36 pass log inspected. |
| `.local/circle-detector.json` | `24de4cd8f6c6bf7d58cfc987b41cd3eafc5144032a4161227ecbc1040725bcff` — same evidence fingerprint as the design-system report. |

These identify the inspected local state and evidence, not a published commit. No additional broad tests, product edits, server/browser actions, tracker writes or publication were performed by this reviewer during closeout.

### Done When

Completed: final source identity rechecked, actual final execution evidence inspected, both findings verified by browser regression, and residual limits retained. **The scoped P07 review is closed with no remaining blocker.** SC07's separate delivery requirements remain for root to verify. P08 full connected-journey review, later corrections, independent setup/adaptation, learner evaluation, adoption and the timed demo remain separate work.
