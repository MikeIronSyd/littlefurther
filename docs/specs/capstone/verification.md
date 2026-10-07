# Capstone verification and judging evidence

Updated: 7 October 2026, Africa/Lagos. Planning/research artifacts and four unapproved desktop direction mockups exist; R11 runtime feasibility passed and the research gate closed at 16:57. No product implementation or product acceptance result exists. E004 covers preparation; E005 covers design artifacts, neither establishes learner outcomes.

## Goal

Make every completion claim traceable to a requirement, real artifact/commit and actual check. Preserve failures, inaccessible capabilities and pending work. Support the four judging criteria without presenting plans, installed tools, drafted skills or agent rehearsal as measured learner impact.

## Context Pointers

Use [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md), [AGENTS.md](../../../AGENTS.md) and [project-context.json](../../../project-context.json). Historical content is in the [discovery archive](archive/2026-10-07-superseded-track2-discovery.md) and [handover](inputs/CODEX_CAPSTONE_HANDOVER.md).

Record activities/decisions in the [Miva hackathon Sheet](https://docs.google.com/spreadsheets/d/1vuVwhMl6pSkSP36qlg0hDFoGKLfdpAalAkx1juJE7-M/edit) under `m.alkali5130@miva.edu.ng` and [Kaneo](http://localhost:5173/dashboard/workspace/wefNu1lRD5XDr17r5UVFiRpc2kcbXBVi/project/nejfw2r0b5lg6v9wpqorte7h/board). Preserve A006/A008/A010 and earlier A001-style history; D009–D014 and E004 cover this increment. Do not duplicate already covered work under a new activity ID.

## Constraints

Statuses: **planned** = not executed; **passed** = named check observed its expected result; **failed** = executed check did not meet its criterion; **unavailable** = capability/evidence could not be accessed; **open** = essential research or unresolved work remains. Narrow checks only support their stated conclusions. Metadata reads, installs and documentation checks do not pass product acceptance criteria.

The user's replacement recovery policy of 7 October 2026 separates normal project commits/pushes from global-only CodexRecovery. Current publication evidence is the intended commit and matching heads in both authorized private project repositories. Project files and Git history never go to recovery; no project registration, recovery hook or `Push-WithBackup` is required. Earlier recovery plans and failures below remain historical evidence, not current delivery gates.

### Actual planning/source/access evidence

| Record | Date / execution context | Actual observation | Status and limit |
| --- | --- | --- | --- |
| V01 — Source/history | 7 Oct, documentation agent | Read active spec, context, preserved handover, Impeccable/grilling instructions and history. D009–D014 supersede stale discovery questions. | Passed inspection; no learner validation. |
| V02 — Primary research | 7 Oct, root research and documentation agent web reads | Read OU, MDN English/French, Better Auth, driver metadata, Node, .NET comparison, Express/Vite and W3C sources. Corrected the OU restart URL to include `/time-management-skills/`. | Passed source access; findings/limits in S01–S13. No runtime smoke or efficacy result. |
| V03 — Preserve discovery | 7 Oct, documentation agent | Checked archive target absent, copied discovery spec before rewriting, computed SHA-256 `345E55910D17B5AFB48F5279CB3B78EAB62250FB574FA5125A9526AC5DF74500`. | Passed archive creation/checksum; existing archive not overwritten. |
| V04 — Documentation checks | 7 Oct, documentation agent | Scoped `git diff --check` exited 0. Per-file no-index whitespace check emitted no whitespace errors; exit 1 denotes content differs from the empty side. Five-file scan found no trailing whitespace; spec contains 14 functional and 14 acceptance rows; all four current documents have the required four main headings. Local links resolved before the final R11 preservation links were added. | Passed named checks; normal LF→CRLF warning. Root must recheck final experiment links after its safe source-only copy; not app verification. |
| V05 — Personal GitHub MCP | 7 Oct, root connector read | `get_repo` succeeded for `separate account/andela-miva-codex-hackathon`. | Passed capability read; implementation commit/diff/check use remains planned. |
| V06 — Miva GitHub MCP | 7 Oct, root connector read | `get_repo` for `MikeIronSyd/andela-miva-codex-hackathon` returned 404. | Unavailable through connector; not evidence the repository is absent. |
| V07 — Miva CLI | 7 Oct, root scoped installed `gh` | Authenticated `gh repo view` confirmed `private: true` and `WRITE`. | Passed CLI visibility/access; explicitly not MCP evidence. |
| V08 — Baseline remote heads | 7 Oct, root `git ls-remote` | `origin` and `miva` both returned `089699a78d231429207a95ad3e6b3dbb94cbc941`. | Passed baseline readback only; not publication of this increment or proof of new backup. |
| V09 — Runtime feasibility | 7 Oct, runtime agent; documentation agent read final report/results | [R11 report](experiments/runtime-feasibility/REPORT.md), [commands/hashes](experiments/runtime-feasibility/verification.json) and [assertions](experiments/runtime-feasibility/latest-result.json): frozen install, strict TypeScript, 35/35 HTTP/SQLite checks and native-module Vite build all exited 0 at 16:57. | Passed research feasibility for this Windows/Node host. Server/DB closed. Same-process reopen is not machine/process reboot; no product acceptance, browser, offline or peer-control result. |
| V10 — Design prerequisite | 7 Oct, initial Impeccable context and root product record | No incumbent visual implementation was found. Root saved PRODUCT.md and the selected image-first configuration. | Product truth recorded; image mockup, visual contract and frontend verification planned. |
| V11 — Project skills | 7 Oct, skill author, root and independent agents | [learning-journey-review](../../../.agents/skills/learning-journey-review/SKILL.md) and [capstone-evidence-update](../../../.agents/skills/capstone-evidence-update/SKILL.md) created. Bundled quick_validate.py passed both and root reproduced both passes. Evidence skill invoked for tracker reconciliation/readback, then changed R11 evidence. Review skill applied independently to preparation; no material findings. | Structural validation and scoped skill use observed; [review report](reviews/2026-10-07-preparation.md). P08/P09 meaningful product iterations remain planned. |
| V12 — Trackers | 7 Oct, browser MCP tracker agent | Correct Miva account verified; saved Sheet cells and seven Kaneo descriptions compared with intended content; D009–D014/E004 and A001–A010 preserved. R11 completion subsequently saved/read back in both. | Passed scoped reconciliation/readback; no product acceptance or new publication inferred. Exact destinations below. |
| V13 — Publication/recovery history | Initial pre-publication record, before the 7 Oct policy replacement | The original plan called for protected delivery after final review/checks, with final hash, both remote heads and recovery result in live A009/E004 and ignored `.local/capstone-publication-result.json`. | Preserve this former plan as history; it did not establish publication or backup success. Current delivery uses normal project pushes and both-remote readback. Historical 089699a is baseline only. |

Root/runtime-agent results are distinguished from this agent's own checks. V09 was reconciled from the final on-disk report and machine-readable results. V12 records the tracker agent's observed saved readbacks. Preserve any later failures and resolutions; do not backdate product checks.

The runtime report retains initial strict-compiler failures (`bun:sqlite` missing, then full Bun ambient declarations conflicting), the narrow official `bun-types/sqlite` resolution, and an unsupported pnpm-remove flag during cleanup. The final manifest/lockfile and four command exit codes are independently preserved. No skipped library checks or handwritten type shim was used. The tiny Vite output measures the experiment, not product payload or performance. Persistent product auth-secret handling still needs implementation.

### Acceptance verification state

All product acceptance criteria are **planned** because no app exists. This initial state is not a waiver of required checks.

| Criteria | Required verification | Current result |
| --- | --- | --- |
| AC01–AC02 | Supported/manual planning, validated dates/estimates, editable approval, template/source/prerequisites and fallback. | Planned; no app/content test. |
| AC03 | Personal study/review, skipped private reflection, activity distinct from completion. | Planned. |
| AC04 | Seven-calendar-day distinct dates, explicit timezone, midnight/DST/deduplication; reported study minutes distinct from estimates. | Planned. |
| AC05 | Current scope versus retained history/self-report, empty plan and scope edits. | Planned. |
| AC06 | Exact unfinished-date shift, order/spacing/history, conflicts, cancel/confirm/stale revision and five-minute activity. | Planned. |
| AC07 | Two accounts, explicit copies/encouragement, owner/member/nonmember rules, leave/removal/own-copy deletion and owner closure with cleanup/access denial. | Planned; simulation cannot satisfy real peers. |
| AC08 | Hashed expiring revocable one-use invites; repeated/concurrent/altered/expired/revoked/closed-circle rejection. | Planned. |
| AC09 | Auth/sign-out, all-request ownership/membership, limits, safe links/text and dependency/review findings. | Planned. |
| AC10 | Refresh/restart persistence, honest failed saves, reload/use with internet disconnected and local server running, external-request inspection. | Planned; verify the stated condition, not a browser-offline mode that blocks localhost. |
| AC11 | Image before frontend, both languages/states, desktop/mobile, keyboard/focus, zoom/reflow, contrast/labels/targets. | Four desktop mockups produced before frontend; design choice and detailed French/mobile/restart/sharing composition pending. Behavior, accessibility and full AC remain unverified. |
| AC12 | Independent clean-checkout run and template/language adaptation from README. | Planned; not human adoption. |
| AC13 | Lifecycle/MCP work, two uses of each skill, tracker readback and verified dual-remote publication. | Planning/access evidence only; actual product/review/skill outcomes planned. |
| AC14 | Timed 3–5 minute full walkthrough, true verification and next-month scope. | Planned; 4:30 target is not measured. |

### Commands and execution policy

Planned app commands: `npm run check`, `npm run lint`, `npm run format:check`, `npm run build`, `npm test`, `npm run test:e2e`, `npm run audit` (delegates to `pnpm audit` for the selected lockfile). These product scripts are not claimed to exist or pass. Record command, candidate commit, date, outcome and relevant output when available. Resolve required failures or obtain an explicit scoped exception before release; a missing command is not a pass. R11's actual experiment commands/exit codes are separate V09 evidence.

For documentation, run `git diff --check` for tracked changes and a per-file whitespace check for new documents. Check local links and requirement references proportionally. Do not introduce app tests for prose-only edits. Record final actual outcomes below.

### Judging evidence index

| Criterion | Requirement | Artifact/commit connection | Actual check / status | Video timestamp |
| --- | --- | --- | --- | --- |
| J1 — Codex integration | AC13; D013 | Saved spec/plan/research, AGENTS and root context/product updates; E004; reproducible R11 fixture/results; later requirement-linked product code/tests/review. | V01–V09 are actual planning/source/access/research checks. Product commits/review/skill iterations planned. | Required walkthrough; actual recording pending. |
| J1 — MCP contribution | AC07/AC11/AC13 | Personal repository read; future commit/diff/check review and browser app/Sheet/Kaneo work. | V05 passed, V06 unavailable, V07 CLI passed. No native Sheets/Kaneo connector claimed. | Required walkthrough; actual recording pending. |
| J1 — Reusable skills | AC13 | Project learning-journey-review and capstone-evidence-update skills. | P08/P09 must record actual input/output/findings/dispositions/changes twice; SKILL.md alone is insufficient. | Required walkthrough; actual recording pending. |
| J2 — Impact | AC01–AC08; D009/D014 | Next action → study/review → progress → comeback → optional private accountability; optional volunteer observations. | Product checks planned; no participants, outcomes, time saving or retention effect recorded. | Required walkthrough; actual recording pending. |
| J3 — Reuse/adoption potential | AC12 | README, module boundaries, template/language schema, actual clean checkout/adaptation and production gaps. | Planned; agent rehearsal distinct from human adoption. | Required walkthrough; actual recording pending. |
| J4 — Demo/pitch | AC14 | Required 3–5 minute walkthrough; later actual recording/script with supported claims/limits. | Planned; measured duration and visible working behavior required. | Entire actual 3–5 minute recording pending. |

Attach exact commit/artifact links and actual timestamps as they exist. Local planning files are current evidence but have no verified published increment until normal publication and both-remote readback succeed. V08's baseline hash does not contain this increment.

### Review and meaningful iterations

First-pass documentation review checks coverage, scope, privacy/restart/data semantics, open research and judging traceability before app implementation. Record actual findings and dispositions when returned. Implementation review later inspects an immutable candidate and real tests; assignment alone does not count as a passed review.

Both project skills must contribute across two meaningful iterations: first complete journey review/evidence capture at P08, then review of changed behavior and reconciliation of changed evidence at P09. Retain input commit/state, invoked skill path, findings, changes and readback. Repeating a tool without new work does not satisfy the requirement.

### Current limitations

- R11 closes this host's selected runtime feasibility; it does not establish product correctness, clean-machine installation, process/machine restart or cross-platform support.
- Four static desktop direction proposals exist. No application, app tests, enforced CI, learner research, clean-checkout rehearsal or timed demo exists; direction choice and detailed states remain pending.
- GitHub MCP cannot currently read Miva; scoped CLI can. Browser automation is the Sheet/Kaneo path.
- Trackers have verified scope/R11 readbacks. Subsequent independent-review and project-publication updates are recorded only after their actual results; source snapshot publication remains a separate delivery step. Any independently scoped global recovery result is recorded separately.
- Local email/password does not verify email or provide recovery. Public hosting/HTTPS, distributed peers/sync, operational retention/deletion, abuse/moderation, availability, recovery and wider device/language/learner evaluation are future production work.

## Done When

Every implemented criterion maps to an actual check and artifact/commit; blocking failures are resolved or explicitly excepted; both private project heads match the intended source commit; both trackers preserve current truth/history; J1–J4 evidence is specific. Global Codex recovery is separate from this project's completion criteria. This initial increment can complete documentation while research/product gaps remain visible.

### Planning-increment closeout

Documentation agent saved spec.md, plan.md, research.md, verification.md and the preserved 7 October discovery archive. This agent performed no app code, dependency install, global settings change, browser write, commit or push. Scoped tracked `git diff --check` passed; direct scans found no whitespace errors, all four required main headings and 14 functional/14 acceptance rows. Existing local links resolved before final experiment links were added. Root owns safe R11 reproduction/report copying to `experiments/runtime-feasibility/` and the final link recheck. The original ignored experiment report/results were read directly and support research closure. Root integration/publication outcomes remain pending actual evidence; no documentation check verifies product behavior.

Root preserved fifteen explicit research input/result/log files, excluding databases, dependencies and generated builds; all eight input hashes match verification.json. `.gitattributes` preserves exact bytes for hashed evidence and original handover/discovery material so Git line-ending conversion cannot silently invalidate those hashes. The research README explains reproduction in an ignored copy rather than overwriting the dated record.

Tracker agent's initial saved readbacks: Sheet Context `B8:C8`, `B12:C15`, `B25:C25`, `B27:C27`; Activities `G4:K5`, `F7:K11`; Decisions `A10:F15` (D009–D014); Codex evidence `I4` and `A5:J5` (E004). Kaneo A003/CAH-4, A004/CAH-5, A006/CAH-7, A007/CAH-8, A008/CAH-9, A009/CAH-3 and A010/CAH-10 retained earlier descriptions and passed persisted comparison. Board contained ten tasks: one To Do, five In Progress, four Done; no new task was added.

After R11 completed, the evidence skill was reinvoked for changed research evidence. The agent read the actual report/results, then saved/read back Sheet E004 `D5:J5`, Context `B25:C25` and Activities `G5:K5`, `G7:K7`, `H9:J9`, `H11:J11`; Kaneo CAH-5/7/9/10 persisted comparisons all passed. These are preparation/research reconciliations, not the product iterations required by P08/P09. Sheet comparisons normalized line endings; Kaneo comparisons normalized rendered whitespace. No messages, invitations or capstone submission occurred.

Independent `learning-journey-review` invocation completed at 17:10 Africa/Lagos with no material preparation findings. Its [report](reviews/2026-10-07-preparation.md) identifies reviewed working-file hashes, checks and limits. It checked 53 local Markdown links, eight research input hashes, the preserved handover/archive, 14 functional/14 acceptance rows and recorded experiment results. Two failed reviewer link-check scripts were corrected and retained in the report. No app ran and no application acceptance criterion passed; this invocation cannot replace P08/P09.

Root reproduced both bundled `quick_validate.py` checks, each exit 0, using the bundled Python with temporary PyYAML 6.0.3 dependencies scoped through the child process's PYTHONPATH. No global skill/settings change was needed. `git diff --check` passed; original/preserved handover and archive hashes matched. Context parsed and retained the correct Miva account, ten stable task mappings, null official deadline and internal 14 October target. A scoped credential-pattern scan returned no matches; this is a limited source check, not a comprehensive security audit.

Historical pre-policy recovery inspection found a scheduled checkpoint failure at 17:09 Africa/Lagos on 7 October: the then-configured 4 GiB remote backup cap was reached. The runtime retained the last successful checkpoint from 6 October at 15:26 Africa/Lagos. At that stage root was diagnosing capacity before the formerly required protected delivery; the record did not claim bypassing the cap, coverage, retention or recovery hook. Preserve this failure and any subsequent result in live A009/E004 and the ignored delivery record referenced in V13. The user's later globals-only policy supersedes that project-backup requirement.

The first full staged whitespace check reported preserved CRLF bytes, original handover Markdown hard-break spaces and raw logs' terminal blank lines. Those evidence bytes were retained deliberately. The authored-source check passed with CRLF recognized and only the immutable supplied handover/raw command logs excluded: `git -c core.whitespace=blank-at-eol,blank-at-eof,space-before-tab,cr-at-eol diff --cached --check -- . ':(exclude)docs/specs/capstone/inputs/CODEX_CAPSTONE_HANDOVER.md' ':(exclude)docs/specs/capstone/experiments/runtime-feasibility/check-logs/**'`. This exception preserves source evidence; it does not suppress compiler, behavior or security findings.

### E005 — First interface direction round, 7 October 2026

The user authorized proceeding to the first image mockup. Root applied Impeccable/imagegen and the evidence skill; an agent applied learning-journey-review to the sample and actual artifacts. [Design record](design.md) links four 1536×1024 desktop proposals and the connected state map. Native image generation produced all four; one edit corrected the green proposal's missing title and ambiguous current-step marker. No product code was written.

Checks actually completed: root and agents visually inspected all four images; each shows eight steps, three completed steps and three study dates. All four sidecars retain approved:false. Direct PNG metadata parsing verified exact prompt equality for all four after two trailing-newline provenance differences were corrected. Ten design links and all four payload image paths resolve. The reviewer found no unresolved material factual issue; their inspection of Open study page is a recheck because they produced it. Small-screen/French, explicit sharing and Comeback preview images remain design work. No application acceptance criterion is passed.

The first root PNG check used Latin-1 decoding and falsely reported three prompt mismatches; a corrected UTF-8-aware read resolved the encoding error. The subsequent independent exact-equality check exited 0. These are provenance checks, not product tests.

The policy-editing agent initially could not validate the updated skills because PyYAML was absent. Root installed cached PyYAML 6.0.3 into ignored .local/skill-check-deps and ran both bundled quick_validate.py commands with child-scoped PYTHONPATH; both passed. No global skill/settings change or recovery checkpoint was made.

Browser MCP verified the comparison page title and option controls. The in-app tab then disappeared before it could be retained; serve-question reported PAGE CLOSED without an answer. The actual images remain saved and displayed, and the visual-choice question was re-presented through the structured asynchronous tool. No selection or approval is inferred.

The user's replacement policy on 7 October explicitly separates global-only Codex recovery from project publication. Active AGENTS, skills, context, plan, spec, README and tracking instructions were reconciled; historical failures preserved. Read-only inspection found no active recovery hook and no core.hooksPath override, so no hook was removed. Both original private project destinations remain authorized. No project backup or recovery wrapper was invoked. Publication and live tracker readback are recorded separately after actual execution.

J1: actual skills, image tooling, agent review, browser MCP and durable prompts. J2: a concrete intended next-action/restart/accountability flow, without impact claims. J3: saved design/state/provenance artifacts, without adoption claims. J4: visual-story preparation only; no demo recording or duration evidence.
