# Learning-engagement capstone

## Goal

Build a Track 2 proof of concept for the Andela x Miva x OpenAI Codex Accelerator Hackathon. The product helps learners take manageable study actions, see retained progress, optionally involve trusted peers, and return after interruptions.

The five connected capabilities are TinySteps, Comeback, StudyCircle (personal study/review and private peer accountability), flexible nonpunitive consistency, and FinishLine. Learners generally are the intended audience.

## Context Pointers

- [Complete LittleFurther user guide](docs/USER_GUIDE.md) walks through every current screen and feature, including validation, privacy and recovery.
- [Product context](PRODUCT.md) captures the selected experience and operating boundaries.
- [Project instructions](AGENTS.md) and [machine-readable context](project-context.json) preserve decisions, destinations and working rules.
- [Specification](docs/specs/capstone/spec.md), [research](docs/specs/capstone/research.md), [plan](docs/specs/capstone/plan.md) and [verification](docs/specs/capstone/verification.md) govern implementation and its evidence.
- [Amber interface design](docs/specs/capstone/design.md) records the user's selected direction, preserved first-round alternatives, six reviewed light/dark/restart/sharing/French-mobile references, prompt records and connected state map. Direction selection is settled; the record distinguishes static review from unverified behavior.
- [learning-journey-review](.agents/skills/learning-journey-review/SKILL.md) checks changes against the learning journey's acceptance criteria.
- [capstone-evidence-update](.agents/skills/capstone-evidence-update/SKILL.md) reconciles actual work with the four judging criteria and authorized trackers.

The original handover and superseded concepts remain under `docs/specs/capstone/inputs/` and `archive/`; they are historical context, not authority to reopen settled decisions.

## Constraints

**Current milestone, 8 October 2026:** the local private journey implements the selected Amber shell, local accounts, explicit timezone, curated/manual editable plans, study sessions, optional private reflection, separate step completion and retained history. English/French, light/dark mode, the correct divided-panel sidebar icons and a mobile drawer are implemented. P06 adds Comeback's explicit restart-date preview and confirmation, preserving completed work, availability and fixed targets. P07 adds optional private peer circles. R01–R15 closed before the first production increment; R16 closed before P06 and R17 before P07. Actual checks and remaining limits are recorded in [verification](docs/specs/capstone/verification.md) and the [StudyCircle verification record](docs/specs/capstone/increments/studycircle-verification.md); implementation alone is not an acceptance pass.

Comeback shows old/new unfinished dates and conflicts before applying the same calendar-day shift to each unfinished step. A stale plan requires a fresh preview, and retries reuse their request identity to avoid duplicate changes. The [P06 contract](docs/specs/capstone/increments/comeback.md) defines zero-day, conflict and uncertain-save behavior. P07 adds optional private circles: two real local accounts can join by one-use invitation, deliberately preview/share commitment or check-in copies, and exchange preset encouragement. The [P07 contract](docs/specs/capstone/increments/studycircle.md) and [verification](docs/specs/capstone/increments/studycircle-verification.md) record research, migration, privacy, checks and limitations. P08/P09 completed the connected-journey review and corrected delayed-response, failed-sign-out, route/hash and profile-write races. The [integration contract](docs/specs/capstone/increments/integration.md) and [verification](docs/specs/capstone/increments/integration-verification.md) record the reproduced failures, corrections, 56 domain/HTTP and 48 browser passes. P10 independently verified setup and an isolated EN/FR template adaptation after correcting two setup issues; see [reuse verification](docs/specs/capstone/increments/reuse-verification.md). The product template remains unchanged. Formal design completion and the timed demo remain open; no learner-impact, human adoption or completed-video claim is made.

### Run locally

Prerequisites: Node **24.19.0**, pnpm **11.19.0**. Check the versions from the repository root before installing. The explicit pnpm option selects the version pinned in package.json even when a host-provided pnpm 11 launcher disables automatic version selection:

```powershell
node --version
pnpm --pm-on-fail=download --version
pnpm --pm-on-fail=download install --frozen-lockfile --ignore-scripts
pnpm --pm-on-fail=download run build
pnpm --pm-on-fail=download start
```

Open **http://127.0.0.1:4317** and keep the server running. Create a local demo account, confirm your timezone, choose a template or supply your own topics, review the draft, and save it explicitly. Stop the server with Ctrl+C. Rebuild and restart after source changes. See [local operations](docs/operations/local-demo.md) for configuration, isolated data, checks and recovery limits.

The version checks must report `v24.19.0` and `11.19.0`. Exact-version provisioning may need internet or a compatible package cache; it does not alter the project pin or global launcher. Use the same `--pm-on-fail=download` prefix for later pnpm commands if your launcher otherwise selects another version. Repository attributes retain LF for maintained formatter inputs on Windows; no global Git setting change or whole-tree formatting is needed. The [P10 contract](docs/specs/capstone/increments/reuse.md) records the setup issues and their verification boundaries.

To revise an interrupted plan, choose **Review restart dates** in the learning view, enter a date and request a preview. Inspect each proposed date and any availability/target conflicts, then cancel, edit the plan or explicitly apply the change. Five-minute study remains a separate action; rescheduling does not log study or complete a step.

For private accountability, choose **Open study circles**, create a circle, and open **Invitations**. A code permits one new member to join before its 24-hour expiry; it is shown only on creation. Use a separate browser profile/session for the second synthetic local account. After joining, choose **Write a shared copy**, enter a commitment/check-in and preview its exact text, audience and privacy boundary before sharing. Peers see these copies and preset encouragement; detailed plans and private reflections remain private. Owners can revoke unused invitations, remove members or close a circle; authors can delete their copies and members can leave, each through explicit confirmation. See local operations for cleanup and retry behavior.

`pnpm run verify` runs strict compilation, lint, format, build, domain/HTTP tests, a separate-process persistence check, browser tests and a dependency audit. Browser tests require installed Microsoft Edge. A manual-only CI template is saved under docs/operations; the current GitHub login lacks workflow-write scope, so it is not activated. No paid service or enforced provider gate is implied.

### Maintain or adapt

The boundaries are deliberately small: serializable types in `src/shared`, pure business rules and curated metadata in `src/domain`, auth/SQLite/HTTP in `src/server`, and semantic browser UI in `src/client`. Canonical records stay in ignored `.local/data`; never commit that folder or the generated auth secret.

For a meaning-preserving wording adaptation, edit the corresponding English/French entries in `src/domain/templates.ts`; keep the existing ID/version, estimates, supported outcome, prerequisites and source records unchanged. Run affected checks, review new drafts in both languages and verify a previously saved plan retains its own content. Changed outcomes, new IDs or new versions require separate research and coordinated metadata, `src/domain/validation.ts`, shared contracts, persisted provenance in `src/server/store.ts`, and associated tests. The current validator permits only `html-first-page@1` or manual input, and the store records version1 for that template; adding metadata alone does not extend this contract. UI translations live in `src/client/i18n.ts` and use matching typed keys. Preserve learner-authored content when switching language. Actual independent rehearsal results are recorded separately from these instructions.

The repositories remain private and no project-wide license has been selected. [Third-party notices](THIRD_PARTY_NOTICES.md) cover vendored icons. Wider distribution is a future owner decision. The [operations review](docs/specs/capstone/reviews/2026-10-08-reuse-operations-review.md) orders the remaining hosting, identity/data lifecycle, recovery, licensing/CI, remote-peer and broader evaluation work before the corresponding production claims.

The selected design is a local browser app using Node 24 LTS, Express 5, strict TypeScript/Vite, Better Auth and SQLite. Initial installation will need dependencies; the intended demo runs without internet while its local server remains running. It does not promise remote peer access, offline external learning websites, or operation after the local server stops.

Plans use curated templates or supplied topics/text and reference links. English and French are the initial interface languages. There is no runtime AI, PDF import, automatic URL fetching, full chat or public hosting in scope. A reference image precedes frontend code. The official submission deadline is unannounced; 14 October is an internal target only.

The shell keeps the selected LittleFurther identity visible outside the sidebar, uses three standard navigation destinations and keeps theme/language/account controls in the topbar. Device theme applies until an explicit choice; only non-sensitive shell preferences use guarded browser storage. `PanelLeftClose`/`PanelLeftOpen` indicate sidebar state; narrow screens use a labelled modal drawer with a Close control. See F15/F16, AC11a–AC11f and [third-party notices](THIRD_PARTY_NOTICES.md).

On 9 October 2026, the user selected **LittleFurther**, unchanged in English/French, and the joined LF concept. The [editable mark and reference board](docs/specs/capstone/designs/littlefurther/README.md) are governed by the [brand reference contract](docs/specs/capstone/increments/littlefurther-brand.md); those synthetic references preceded application integration.

The 10 October [three-option comparison](docs/specs/capstone/designs/littlefurther/options.png) presents A (Original), B (Stepped) and C (Solid) under the [options contract](docs/specs/capstone/increments/littlefurther-options.md). The user selected A, now integrated with the LittleFurther name in the header and browser title. The mark uses ink in light mode and Amber in dark mode, while the complete name can wrap between Little and Further. The [integration record](docs/specs/capstone/increments/littlefurther-integration.md) owns actual checks and delivery evidence; [desktop](docs/specs/capstone/designs/littlefurther/app-desktop.png) and [mobile](docs/specs/capstone/designs/littlefurther/app-mobile.png) are app captures, distinct from the preserved reference boards. Overall formal design approval remains pending.

Use GitHub MCP for supported repository/commit/check readback and browser MCP for app observations and correct-account tracker interactions. After applicable checks, use normal local Git commits and `git push origin main` to publish intended source to the existing private separate account and MikeIronSyd repositories; verify both remote heads and preserve unrelated Git hooks. CodexRecovery covers only global instructions, skills and essential settings: never register or back up this project's files or Git history through it, and do not use `Push-WithBackup` for project publication. Do not commit secrets, local databases or real learner records.

### Use the included review workflow

Open this repository in Codex and provide the applicable skill file with a scoped task. For example:

```text
Use .agents/skills/learning-journey-review/SKILL.md.

Goal: Review the current increment against the applicable acceptance criteria.
Context Pointers: AGENTS.md, project-context.json, the capstone specification,
the changed files, and the actual check outputs for this increment.
Constraints: Read-only review. Do not infer application passes from documents,
invent missing evidence, or change trackers or source code.
Done When: Return criterion-linked findings, evidence and concrete next checks,
clearly separating verified results from unverified behavior.
```

Use the evidence-update skill after actual work, with explicit update scope and observed results. Both skills can be read by path; their files alone do not establish that a workflow was invoked or successfully reused. Current tracker accounts and IDs come from project context, never from assumptions.

## Done When

The capstone is complete only when the agreed journey is implemented and verified, research/design prerequisites are satisfied, both skills and MCPs have meaningful recorded use, setup/adaptation is independently exercised, and a timed 3–5 minute demo maps to the rubric. Short usability observations do not establish retention or mastery. See the plan and verification record for exact acceptance gates and outstanding work.
