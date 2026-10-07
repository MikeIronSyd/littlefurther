# P04/P05 first-journey verification

7 October 2026, Africa/Lagos. Implementation started from parent `e740fdc8cf4ac67e45470ffdfbf64826752b30d6`; source was an uncommitted candidate during these checks. Publication is a separate result below.

## Goal

Verify the first usable private journey and Amber shell against the [increment contract](first-journey.md). This is an intermediate product milestone: Comeback schedule recovery, private peer circles, full capstone acceptance, independent setup/adaptation and the timed video remain required work.

## Context Pointers

- [Research](../research.md): R15 closed at21:02 before dependent production implementation; exact tooling experiment and initial failures are preserved.
- [Specification](../spec.md), [plan](../plan.md), [local operations](../../../operations/local-demo.md), and root package scripts identify the requirements and reproduction commands.
- `tests/domain`, `tests/server`, `tests/e2e` and `tools/verify-process.mjs` provide executable checks. Tests use synthetic isolated accounts and ignored data directories.
- Independent behavior review, bounded visual review and tracker readback are linked from the parent verification record when complete.

## Constraints

### Actual checks

| Command / method | Observed result | Claim boundary |
| --- | --- | --- |
| `pnpm install --frozen-lockfile --ignore-scripts --reporter=append-only` | Passed; lockfile unchanged, dependencies already available. | This host/cache; not a fresh-machine rehearsal. |
| `pnpm run check` | Passed after correcting an invalid autocomplete literal and loading the official Vite client declarations. | Strict project TypeScript; no skipped library checking or handwritten shim. |
| `pnpm run lint` | Passed with warnings treated as errors. | Biome recommended rules on maintained source/tests/tooling. |
| `pnpm run format:check` | Passed31 files in the checked candidate. | Preserved handover/research/image provenance is intentionally outside the formatter. |
| `pnpm run build` | Server/compiler and Vite client build passed. | Built product; output size is not a real-device latency benchmark. |
| `pnpm test` |20/20 passed:10 domain cases,9 HTTP subtests and their parent. | Dates/DST/timezone, validation, real sessions, ownership, transactions/retries, explicit activity/completion, scope history and in-process reopen. |
| `pnpm run verify:process` | Passed with two different Node process IDs; session, secret, plan, reflection, minutes and explicit completion retained. | Actual child-process termination/restart on this PC. Not a machine reboot or database backup/restore test. |
| `pnpm run audit` | Passed; no known vulnerabilities returned at check time. | Registry advisory check, not a complete security audit. |
| Browser tests | Initially13/17 passed. Corrected batch17/18 passed, then focused sign-out and50-step cases both passed. Final mobile/locale/contrast confirmation passed6/6 at21:42. All19 distinct cases have passing evidence across these runs. | This is not one all19-green run. Initial3 auth-fixture cadence failures, real drawer Tab escape, then native-summary test selector mismatch are retained. No failed run is relabelled green. |
| Browser-egress restriction |30 loopback requests,0 attempted external requests; account/profile/plan/reload/study-save/reload worked while all non-loopback browser requests were intercepted and blocked. | Local server stayed running. Physical internet and server egress were not disabled. |
| Root browser MCP | Created a synthetic local account, confirmed Africa/Lagos, reviewed/saved the eight-action MDN template, saved five reported minutes/private reflection, explicitly completed the action, and reloaded to1/8 complete,1 study date and5 minutes. Light/dark, collapsed navigation and French switching operated on the same saved plan. | Actual in-app browser interaction; no real learner session or long-term benefit claim. |

### Review findings and dispositions

The independent behavior review found locale changes invalidating an editor revision, completion-only clearing an unsaved-reflection guard, and mobile Tab escaping its drawer. These were corrected and covered by regression checks. Root observed plural labels and focus lost after a successful save; count-aware English/French and focused save feedback were added. Form controls freeze during a pending write so later typing cannot be silently replaced by the captured save body.

The fresh visual review identified mobile priority/order drift from the saved design. Root observed that the French language selector's accessible label stayed in English because its translation binding was overwritten. One correction batch restored actual mobile DOM order to goal/introduction → action → return support → progress/path, retained the desktop composition, and combined the language control's value/name binding. Six affected browser cases passed after rebuilding: light/dark text and control/focus contrast; French mobile full journey and primary-action visibility;50-step320px layout; editor language/resize preservation; and French drawer focus/cleanup. Root browser MCP independently read the corrected French mobile order and “Langue” label. Final visual disposition is recorded by the independent reviewer separately.

Measured normal-text minimum across sampled pairs was6.19:1 in light and9.93:1 in dark. Input-border and focus-outline checks also passed3:1. These checks sample named states; no whole-site conformance claim follows. Browser network result and screenshots remain in ignored `.local/e2e-captures`; a user-facing actual eight-step screenshot is `outputs/first-journey/amber-working.jpg`. No synthetic demonstration counts are presented as learning outcomes.

The Impeccable spec gate measured32 semantic regions, no raster plates, and11 text regions. Its extra zero-asset review receipt remains absent; no force flag, fabricated user acceptance or later tool phase is claimed. Existing user selection and instruction to proceed authorize this semantic build. Manual screenshots/source review and documented system-font substitution must be reported separately from full automated fidelity/gate completion.

### Limits

- Only the scoped private journey exists. Five-minute activity works; automatic Comeback date-preview/confirmation and peer-circle APIs do not yet exist.
- English/French interaction and targeted contrast/reflow checks do not establish native-French quality, universal device support or general accessibility conformance.
- No real learner evaluation, improved retention/mastery, measured time saving, human adoption, public deployment or finished demo video.
- The manual-only GitHub workflow template is not activated: current OAuth access lacks workflow scope. No enforced provider gate or paid service is claimed.
- Local accounts are not email-verified; no password recovery, encrypted database or distributed peer synchronization is provided.

## Done When

Required milestone checks pass, material review findings are resolved with recorded evidence, the local runnable result is available, and source/tracker readbacks are completed separately. Parent AC06–AC08 and full-capstone AC12–AC14 remain open.

### Final review disposition

The [independent behavior review](../reviews/2026-10-07-first-journey-review.md) reports no reproduced behavioral finding left open. The [fresh visual review's verdict pass](../reviews/2026-10-07-first-journey-visual.md) scores the mobile-order and documentation corrections resolved, with no regression observed in those corrections. Its `ship` applies to those scored fixes only, not a new whole-surface review or full-capstone approval. DESIGN.md and the version-2 design sidecar record source-grounded tokens, layout and the system-font substitution.

Root ran `impeccable build-phase finish --disposition ship`. The process returned exit0 but its text **refused** completion because plates, hero, sections, motion and responsive phases remain open/pending. Treat this as a refused formal gate, not a successful finish. No forced receipt or invented acceptance was added. The user was told this limitation separately; the authorized local milestone and normal project-source publication continue with that evidence boundary.

The final documentation check parsed eight JSON artifacts, resolved134 local links, found no credential-shaped values in its limited source scan, and confirmed account/task mappings, official/internal deadlines and verified LMS facts unchanged. Source/tracker publication results are recorded in the parent verification closeout after actual execution.

### Delivery closeout

Artifact `9d5820bfd8058a951372c2e3be868425e3733df9` was published and read back on both private repositories; the personal commit was independently inspected with GitHub MCP. The browser MCP tracker reconciliation is recorded in the [saved-readback report](../reviews/2026-10-07-first-journey-tracker.md). The local app remains available at http://127.0.0.1:4317 while its process runs. This scoped milestone is delivered with the limits above; it does not complete the five-capability MVP or formal Impeccable pipeline. Final edits only reconcile documentation and evidence, so application checks were not repeated.
