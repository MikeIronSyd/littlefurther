# Learning-engagement capstone

## Goal

Build a Track 2 proof of concept for the Andela x Miva x OpenAI Codex Accelerator Hackathon. The product helps learners take manageable study actions, see retained progress, optionally involve trusted peers, and return after interruptions.

The five connected capabilities are TinySteps, Comeback, StudyCircle (personal study/review and private peer accountability), flexible nonpunitive consistency, and FinishLine. Learners generally are the intended audience.

## Context Pointers

- [Product context](PRODUCT.md) captures the selected experience and operating boundaries.
- [Project instructions](AGENTS.md) and [machine-readable context](project-context.json) preserve decisions, destinations and working rules.
- [Specification](docs/specs/capstone/spec.md), [research](docs/specs/capstone/research.md), [plan](docs/specs/capstone/plan.md) and [verification](docs/specs/capstone/verification.md) govern implementation and its evidence.
- [Amber interface design](docs/specs/capstone/design.md) records the user's selected direction, preserved first-round alternatives, six reviewed light/dark/restart/sharing/French-mobile references, prompt records and connected state map. Direction selection is settled; the record distinguishes static review from unverified behavior.
- [learning-journey-review](.agents/skills/learning-journey-review/SKILL.md) checks changes against the learning journey's acceptance criteria.
- [capstone-evidence-update](.agents/skills/capstone-evidence-update/SKILL.md) reconciles actual work with the four judging criteria and authorized trackers.

The original handover and superseded concepts remain under `docs/specs/capstone/inputs/` and `archive/`; they are historical context, not authority to reopen settled decisions.

## Constraints

**Current status, 7 October 2026:** the user selected Amber and requested a light/dark toggle, collapsible sidebar, topbar utilities, future brand space at top left and a proper sidebar-toggle icon. The original selected reference records that approval; detailed state images remain design elaborations with no additional approval inferred. Six desktop/mobile references and prompt records have completed static review. Expanded R01–R14 research closed at 20:14 Africa/Lagos, preserving the earlier 16:57 closure.

There is no runnable learner application or completed product test suite yet. The isolated runtime experiment is research, not the prototype. The verification record distinguishes completed preparation and static design artifacts from outstanding implementation and evaluation. Theme/storage behavior, sidebar/drawer interaction, accessibility and all learner workflows remain unverified. The design record lists required implementation adjustments: reclaim collapsed width, preserve `Africa/Lagos`, keep one consistent French catalogue and unchanged background under the mobile overlay, enforce modal inertness without duplicate active utilities, and verify the approximately 80% responsive drawer target. Static focus styling does not establish accessible behavior or native-French validation.

The selected design is a local browser app using Node 24 LTS, Express 5, strict TypeScript/Vite, Better Auth and SQLite. Initial installation will need dependencies; the intended demo runs without internet while its local server remains running. It does not promise remote peer access, offline external learning websites, or operation after the local server stops.

Plans use curated templates or supplied topics/text and reference links. English and French are the initial interface languages. There is no runtime AI, PDF import, automatic URL fetching, full chat or public hosting in scope. A reference image precedes frontend code. The official submission deadline is unannounced; 14 October is an internal target only.

The planned shell keeps the provisional brand slot visible outside the sidebar, uses three standard navigation destinations and keeps theme/language/account controls in the topbar. Device theme applies until an explicit choice; only non-sensitive shell preferences may use guarded browser storage. Canonical learner data stays in SQLite. `PanelLeftClose`/`PanelLeftOpen` indicate sidebar state; narrow screens use a labelled modal drawer with a Close control. See the specification for F15/F16 and AC11a–AC11f; these are planned behavior, not working features.

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
