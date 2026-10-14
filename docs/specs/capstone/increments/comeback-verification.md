# P06 — Comeback verification

8 October 2026, Africa/Lagos. Baseline: `e3a682f14f6e9172efe2ec8ef91fc671e77163ba`. This is scoped P06 evidence; P07 peers and full-capstone acceptance remain open.

## Goal

Verify that a learner can explicitly preview, cancel or confirm a revised unfinished schedule without losing previous work or applying a change twice.

## Context Pointers

The [contract](comeback.md) and R16 [research closure](../research.md) preceded production edits at09:52. Independent [behavior review](../reviews/2026-10-08-comeback-review.md), [visual review](../reviews/2026-10-08-comeback-visual.md) and [tracker record](../reviews/2026-10-08-comeback-tracker.md) distinguish source/checks from publication, saved tracker writes and real learner outcomes.

## Constraints

All accounts and scenarios in the acceptance checks are synthetic. No user research, retention/mastery improvement, measured development time saving, human adoption or production readiness is inferred. The app runs with the local server on; no remote deployment, new dependencies or schema migration was introduced. CI remains an inactive template because the existing OAuth login lacks workflow-write scope.

### Observed commands and results

| Check | Actual outcome |
| --- | --- |
| Baseline `pnpm run check`; `pnpm test` | Passed before production changes;20 existing domain/HTTP tests. |
| Final `pnpm run check` | Passed, including the final browser test fixtures. |
| `pnpm run lint`; `pnpm run format:check` | Passed;31 files linted and36 formatted files checked. No suppressions or weakened assertions. |
| `pnpm run build` | Server TypeScript and Vite build passed. Final affected browser run rebuilt the final assets successfully. |
| `pnpm test` |40/40 domain/HTTP tests passed:20 existing and20 new, including parent-test counting. |
| `pnpm run verify:process` | Passed across distinct Node process IDs: identity/session, private data, confirmed Comeback dates and exact confirmation receipt persisted after process restart. |
| `pnpm run test:e2e` | Initial full run25/26 passed. One assertion expected a disabled control that correctly becomes hidden after editing the date. Corrected test to require hidden control; application behavior unchanged. |
| `pnpm exec playwright test tests/e2e/comeback.spec.ts` | First expanded run7/8 passed; new test fixture sent server-only `completedAt`, correctly rejected400. Independent review identified the mistake; fixture now sends only allowed edit fields. Final affected run8/8 passed in1.4minutes, zero retries, installed Edge, one worker. |
| Browser coverage total |19 existing and8 Comeback cases have passing evidence across these recorded runs. This is not a claimed single27-case run. Initial failure logs remain in ignored `.local/comeback-e2e.log` and `.local/comeback-e2e-final.log`; corrected run in `.local/comeback-e2e-confirmed.log`. |
| `pnpm run audit` | No known vulnerabilities reported at execution; not a guarantee of vulnerability-free software. |

### Acceptance mapping

| ID | Verified implementation and evidence |
| --- | --- |
| CB01 | Pure domain tests check positive/negative/zero shifts, leap/DST boundary dates, unsorted/same-day order, empty/all-complete plans and lower/upper bounds. Only unfinished active dates move; completed records/history, availability and fixed target remain unchanged. |
| CB02 | HTTP tests check read-only preview, transactional confirmation, stale edits/completions, exact/conflicting receipts, ownership/anonymous denial, concurrent requests and atomic invalid-output rejection. Browser cancellation returns to unchanged saved dates. |
| CB03 | Browser checks compare exact dates and both conflict types; acknowledgement gates application; zero shift is disabled; all-complete/empty states offer no restart. EN light/dark1440px and FR390/320px captures retain readable rows and controls without horizontal overflow. Keyboard checkbox enables the French action. |
| CB04 | Browser checks cover edited-date invalidation, stale reload/re-preview, a lost successful POST response with identical retry body/key, an intervening plan edit preserved by fresh GET, known saved POST followed by failed GET and read-only retry, and late preview/confirm results after navigating elsewhere. |
| CB05 | Browser reload and the two-process verification retain dates/history. A five-minute restart adds activity while completion stays1/3 in the browser fixture. Existing19 browser cases passed, including previous privacy, shell and disconnected-browser conditions. |
| CB06 | Skills/reviews, browser MCP observations and documentary limits are recorded here. Publication and live tracker readback are separate closeout evidence below; P07/full-journey review, clean-checkout adaptation, learner evaluation and video remain open. |

### Actual browser MCP walkthrough

Root used the running IAB app at `http://127.0.0.1:4317` with its existing synthetic Demo learner. The eight-step example initially had one completion dated7October, seven unfinished dates8–14October, and one five-minute session. Previewing11October proposed11–17October with three availability warnings. Cancel retained the old schedule. Reopening, explicitly acknowledging conflicts and applying saved the revised schedule; browser refresh retained it, the completed7October record,1/8 progress and one five-minute session. No real learner's record was changed by this synthetic check.

Local screenshots: `outputs/comeback/preview-user-1280.png` and `outputs/comeback/saved-schedule.png`. The automated captures are in `.local/e2e-captures/`; the final reviewed copies are in `.impeccable/review/comeback/`. Generated captures remain outside project Git source.

### Review boundaries

The reusable learning-journey-review skill was applied by an independent agent to source, contracts and actual check outputs. Its suggested extra network branches were implemented as meaningful acceptance tests, and its invalid-fixture finding was corrected. Visual review uses a fresh general agent with the public Impeccable fallback contract because this harness cannot select a named shipped agent type. No full formal comp-fidelity approval is implied: earlier build phases, QUALITY BAR and hero/final diff evidence remain unavailable/open. Native French quality, broad device support and full accessibility conformance are unverified.

### Judging evidence

| Criterion | Requirement → artifact → actual result | Planned demo scene / limit |
| --- | --- | --- |
| J1 — Codex integration | AC06/CB01–CB06 → pre-code research/contract, parallel domain/UI work, independent review, reusable review/evidence skills, automated checks and root browser MCP. | Show the actual contract, review finding and working preview. No plan-mode use or time savings inferred from file existence. |
| J2 — Educational impact | CB01/CB05 → interrupted synthetic learner reschedules unfinished work while keeping completed effort. | Before/after dates and retained history; usefulness hypothesis awaits learner evaluation. |
| J3 — Reuse/adoption | Shared contract, pure calendar rule, owned HTTP transaction, client module, meaningful tests and setup/operations records. | Show readable boundaries; independent fresh checkout/adaptation and human adoption pending. |
| J4 — Demo/pitch | Working preview/cancel/confirm/reload scenario and local captures. | Include in the planned3–5minute walkthrough; recording and measured duration not yet available. |

## Done When

Behavior checks above pass for P06. Independent review dispositions, normal source evidence and live tracker saved readback must be recorded before treating the incremental delivery as closed. This never marks the full capstone complete.

### Delivery closeout

Independent source review found no remaining production blocker. Fresh visual review returned **ship** for the supplied P06 extension captures with no material visual fixes. The formal `impeccable build-phase finish --disposition ship` command nevertheless refused completion because plates/hero/sections/motion/responsive remain open. This inherited phase boundary is preserved; neither the scoped verdict nor passing behavior checks establishes full formal Impeccable completion. The command returned exit0 with a refusal message, so its text, not exit status, determines that result.

The independent [design-system comparison](../reviews/2026-10-08-comeback-design-system.md) preserved the canonical DESIGN.md frontmatter and `.impeccable/design.json` byte hashes. Only a current-status paragraph changed; older illustrative drift is recorded without being canonized. A general-agent documenter substitution is disclosed in that report.

The scoped documentation check passed for33 intended files,153 resolving local links, parsed context, no scoped credential-pattern match, unchanged account/task mappings, deadlines and LMS facts, and retained E007 history. This does not replace runtime checks. Recorded source artifact `204e227a63c550140ed7b868c1fe76e68b74391b` to this private repository. the intended source revision matched that hash; GitHub MCP independently returned the source evidence revision, message and canonical URL. No recovery wrapper or permission expansion was used. E008 live reconciliation passed: exactly39 intended Sheet cells changed with zero value mismatches or other cell changes; five Kaneo descriptions passed persisted comparison, preserving history and statuses. The tracker report records a corrected comparison-parser issue, one known-state paste reorder and a read timeout. These are retained as actual attempts, not first-pass success. The user subsequently reaffirmed the original Sheet + Kaneo + GitHub workflow.
