# P07 — Private StudyCircle verification

8 October 2026, Africa/Lagos. Baseline `e519d10f0391f8acd06c7d57aad5caf59df58dbf`. Results below concern the local P07 increment; full-capstone acceptance remains separate.

## Goal

Verify real local peer accountability while protecting private learning and truthful save/retry behavior. The [pre-code contract](studycircle.md) defines SC01–SC07 and follows R17 research closure at 10:55, before production edits.

## Context Pointers

- Shared types and bounds: `src/shared/contracts.ts`; strict input: `src/domain/circle-validation.ts`.
- Persistence/authorization: `src/server/circles.ts`, additive migration in `store.ts`, routes in `app.ts`.
- Connected UI: `src/client/circle.ts` with narrow main/journey/EN-FR/style integration.
- Tests: `tests/domain/circle.test.ts`, `tests/server/circle-store.test.ts`, `tests/server/circle.test.ts`, `tests/e2e/circle.spec.ts`, `tools/verify-process.mjs`.
- [Independent source review](../reviews/2026-10-08-circle-review.md), [visual review](../reviews/2026-10-08-circle-visual.md), [design-system comparison](../reviews/2026-10-08-circle-design-system.md), [research](../research.md), [tracker report](../reviews/2026-10-08-circle-tracker.md).

### Executed checks

| Command / observation | Actual outcome | Scope and limitation |
| --- | --- | --- |
| `pnpm run check` | Passed, including after client review corrections. | Strict TypeScript, not runtime proof. |
| `pnpm run lint` / `pnpm run format:check` | Passed aggregate; final formatting check passed all 43 checked files after the fixture correction. | Correction agent also passed scoped checks. Documentation is checked separately below. |
| `pnpm run build` | Passed. | Local supported Node/pnpm host. No new dependency. |
| `pnpm test` | **56/56 passed**, zero skipped/cancelled. | Existing 40 plus 16 new domain/store/HTTP cases, including real sessions and synthetic failure injection. |
| `pnpm run verify:process` | Passed. | Two distinct Node process IDs, both sessions, private history, circle membership, immutable copy, encouragement and invitation retry without raw token survive restart. Not machine reboot. |
| `pnpm run test:e2e` | Initial full batch: **35 passed, 1 failed**. | Failure was a root test fixture expecting the Activity screen without a saved private plan; that existing no-plan route renders the empty-learning state. Fixture corrected by saving a plan. |
| `pnpm run test:e2e -- tests/e2e/circle.spec.ts` | Final batch: **36/36 passed** in 7.7 minutes. | This invocation passed a literal `--` to Playwright and ran all 36 cases, not only the requested file: all nine P07 cases and 27 existing cases passed. This is measured suite duration, not time saved. |
| `pnpm run audit` | No known vulnerabilities reported. | Registry audit at execution time, not a comprehensive security guarantee. |
| Browser computer-use MCP | Actual separate IAB/Chrome identities created/joined a circle, previewed/shared a commitment and saved/read back the partner's preset encouragement. | Local server on this PC, synthetic accounts, no remote-peer or real-learner outcome claim. |

Logs are retained locally in ignored `.local/circle-all-tests.log`, `circle-build.log`, `circle-process.log`, `circle-browser-all.log` and `circle-browser-final.log`. Screenshots and local accounts are inspection/demo artifacts, not published learner data.

### Acceptance mapping

| Criterion | Evidence and result | Remaining boundary |
| --- | --- | --- |
| SC01 | Passed fresh/repeated v2 startup, populated-v1 preservation of profile/plan/activity/completion/scope/receipt rows, failed additive migration rollback, unsupported/noncontiguous versions and foreign-key checks. | Live demo opened only after these tests passed; its earlier 1/8 completion and five-minute history remained visible. No in-place reverse migration. |
| SC02 | Passed real-session invitation generation/hash-only persistence, once-returned token, expiry/revocation/single-use/concurrency, capacities, receipt conflicts and retry. A forced receipt-write failure after membership/token mutation rolls back all three and permits a later valid join with the same request. | Bounds are deliberate demo limits, not measured production capacity. |
| SC03 | Passed explicit preview/cancel/share, allowed DTO fields, immutable copy after private edits, preset replacement/replay and literal text/strict input handling. Root MCP verified an empty composer, exact audience/exclusions and saved peer encouragement. | Existing/future members see retained copies; previously seen information cannot be recalled. |
| SC04 | Passed server role/nested-resource/access/receipt matrix and cleanup tests. Browser removal clears denied content; closure retains private work; copy deletion and uncertain leave are exercised. | Access is checked on the next request, without push revocation of already-rendered content. |
| SC05 | All nine P07 browser cases passed, including lost invitation/copy/delete/leave responses, GET-only recovery, delayed GET/POST navigation, pasted-token disposal, explicit preview invalidation, keyboard use and EN/FR/theme switching. | EN/FR/320px and captured light/dark layouts are scoped checks, not broad accessibility/native-language certification. |
| SC06 | Passed distinct-process two-session persistence and all 36 browser cases, including the existing loopback-only request test and new sharing/reload checks. | Physical internet disconnection, machine reboot and other automated browser engines remain unverified. Root's separate Chrome/IAB walkthrough is narrower evidence. |
| SC07 | Research/spec, actual parallel implementation, independent source review, six-capture visual review (scoped disposition ship), unchanged-system documentation comparison and browser MCP evidence recorded. | Final source publication and E009 saved tracker readbacks pending. Formal Impeccable phases remain open as detailed below. |

## Constraints

### Failures and corrections retained

1. Backend fixture initially exceeded Better Auth's three-auth-attempts/ten-second rule. The fixture now waits 10.1 seconds before its fourth account; production limits remain intact. Dependent failures were rerun successfully.
2. Root's new rollback assertion initially accessed an untyped SQLite result property; strict compilation rejected it. Comparing the full expected `{count:0}` row corrected the assertion; all 56 tests then passed.
3. Independent review identified that a missing target on a successful-delete retry could be mistaken for lost circle membership. Mutation 403/404 now reconciles by GET and reports current information without inventing success; denied reads clear content. Failed reconciliation offers GET-only recovery.
4. Fresh review found that pasted invitation input could remain reachable in a detached translated DOM tree. Both created and pasted bearer fields now clear through navigation/detachment cleanup. This is active-view cleanup, not a claim to erase all historical memory or another person's copy.
5. The initial browser late-response test had no saved plan, so its expected Activity heading was invalid for that fixture. The test now creates a private plan before checking late GET/POST navigation and detached pasted-code disposal; no product assertion was weakened.

### Actual browser-MCP observation

At approximately 16:30–16:34 Lagos, root opened the rebuilt app on `http://127.0.0.1:4317`. The earlier synthetic Demo learner retained the eight-step plan, one completion, one five-minute session and confirmed Comeback dates. Root created **Small steps together**, generated a one-use invitation, and redeemed it from **Demo study partner** in a separate Chrome session without requiring that partner to create a plan. The owner refreshed, composed a new commitment with no automatic private text, inspected its exact preview, current two-person audience and excluded private data, then explicitly shared. The partner selected **Small steps count**, saved it, and the owner read the result back. The raw code was consumed and not included in saved evidence images.

Local captures under `outputs/circle/`: `circle-user-preview.png`, `circle-two-account-result.png`, desktop light/dark and French 320px light/dark browser-test previews. The IAB viewport was 1280×720 with 1265px document width; its captured PNG width is 1264px. These are actual synthetic app states, not mockups or a timed video.

### Judging evidence

| Criterion | Requirement and artifact | Actual result / boundary | Planned demo use |
| --- | --- | --- | --- |
| J1 | AC13; R17, P07 spec, contracts/source/tests, review skill and evidence skill, browser/GitHub MCP records. | Actual Codex planning/building/review/testing/documentation, with two review findings corrected. Publication/MCP/tracker readback recorded when complete. No claim that a plan file proves plan-mode UI use. | Show explicit-sharing feature, discovered correction and linked tests/reviews. |
| J2 | AC07–AC09; two-account shared-copy and private-history boundaries. | Demonstrated optional accountability controls. No measured retention, motivation, mastery or learner-impact improvement. | Same goal/learning journey with a voluntary trusted peer. |
| J3 | Cohesive CircleStore/validation/client modules, no added dependency, migration tests and local operations guidance. | Source and setup/adaptation guidance support future reuse; independent fresh-checkout/adaptation and human adoption remain pending. | Show documented boundaries and remaining production work. |
| J4 | Actual preview and two-account result captures. | Useful working material; no recorded or timed 3–5 minute demo yet. | Integrate into the planned 4:30 walkthrough, then time the real recording. |

Formal Impeccable phase completion remains separate from a scoped visual review. The final `impeccable.cmd build-phase finish --disposition ship` returned exit 0 but explicitly refused ship: plates, hero, sections, motion and responsive are not closed; current phase is plates. The refusal text is authoritative; the formal build is unfinished. No receipt or phase closure was fabricated. Hero/final comp differences and QUALITY BAR remain unavailable. The detector ran once with 34 advisories; the two new P07 font-size entries reuse the existing 1.15rem support role, and the other 32 concern unchanged styles. DESIGN.md and its sidecar hashes were preserved by the independent documentation comparison. The existing design-sidecar drift advisory is reported, not repaired as an unrelated side effect. Hosted CI remains inactive because current OAuth access lacks workflow-write capability.

## Done When

Local record validation before publication passed: 34 intended changed/new files, 167 resolving local Markdown links, parsed JSON context, no scoped credential-pattern matches, unchanged account/task mappings, official/internal dates and LMS facts, and preserved E008 history. `git diff --check` reported no whitespace defects. This documentation/source scan does not replace the behavior checks above.

P07 is complete when SC01–SC06 have final observed evidence and SC07's review, documentation, dual private publication and saved E009 readbacks are recorded. P08 full connected-journey review, P09 corrections, independent setup/adaptation, any available learner evaluation and the timed video remain later work.
