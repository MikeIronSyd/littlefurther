---
name: capstone-evidence-update
description: Reconcile verified capstone work into local evidence records and authorized activity trackers, mapping artifacts to judging criteria J1-J4. Use after a project increment or for an evidence-readiness audit; do not use it to invent progress, submit a capstone, or expand publication permissions.
---

## Goal

Keep the capstone's activity history, current state, and judging evidence consistent with work that actually happened. Produce traceable evidence for each claimed result and explicit pending entries for missing checks or unavailable destinations.

## Context Pointers

Read `AGENTS.md`, `project-context.json`, the active `docs/specs/capstone/spec.md` and linked plan/verification records, and `docs/specs/activity-tracking/spec.md` when present. Inspect actual changed files, commits, check outputs, reviews, MCP observations, and demo artifacts supplied by the task. Separate active requirements from dated history and superseded proposals; preserve prior decisions and results rather than rewriting them as if the latest scope always applied.

Resolve account identities, tracker URLs, task mappings, repository destinations, and timezone from `project-context.json` and current user instructions. Do not hardcode private accounts in this skill, substitute another signed-in account, or confuse the hackathon tracker with a general study tracker. If an identity or destination cannot be verified, prepare the local update and leave that external write pending.

Inputs are the increment or activity to record, its actual artifacts and outcomes, the intended update scope, and existing stable IDs. Reconcile these before writing. Read the live affected tracker records when available; use their existing schema and IDs. A001-style activity IDs, decisions, milestones, and requirements have distinct meanings. Allocate a new ID only for new work after checking existing local and reachable tracker records; retain a provisional pending entry if uniqueness cannot be established.

## Constraints

### Evidence workflow

1. Build an evidence ledger from observed work. Each entry records the activity/requirement ID, date and timezone, actor and concrete Codex contribution, artifact path or URL, revision where relevant, actual check and result, limitation, and next action. Label user-reported facts, hypotheses, planned work, local checks, published evidence, and observed application behavior distinctly. Retain measured durations only when start/end or timing evidence exists; label estimates explicitly.
2. Map the ledger to the judging criteria below. For each relevant row use `criterion | requirement | artifact | commit/revision | check and result | demo scene | status/limitation`. A planned scene is a plan; an unrecorded demo is pending. Use `not yet available` for absent artifacts rather than inventing links or results.
3. Prepare a focused reconciliation of context, specification/verification, and tracker fields. Preserve stable IDs and dated history; correct the active summary and add a dated superseding decision when necessary. Do not change product requirements to fit incomplete implementation. Keep LMS completion, weekly milestones, implemented work, verified behavior, and submitted deliverables separate.
4. Apply only updates permitted by the task. In plan mode or a read-only audit, produce the proposed reconciliation without editing files or live trackers. For an authorized project update, update the relevant local records, then the configured Miva Sheet and Kaneo records using available supported routes. Do not create duplicate rows/tasks to work around a failed edit.
5. Read back every changed destination and compare its saved fields with the intended update. Record verified, failed, pending, or unverified status independently for local files, Sheet, Kaneo, source publication, and recovery. A submitted browser action is not saved-state evidence. After an ambiguous write, inspect the existing record before retrying; if still ambiguous, stop that destination's writes, record the reason, and continue independent work. Resume only once its state is known.

| Criterion | Evidence that supports it | Boundary on the claim |
| --- | --- | --- |
| J1 — Depth of Codex Integration | Actual planning, building, reviewing, and documenting contributions linked to artifacts and revisions; AGENTS.md guidance used, observed plan-mode use when claimed, agent work, real MCP operations, and actual reusable-skill invocations and outputs. | A plan file does not establish plan-mode use. A tool or skill being installed, authored, or available does not establish invocation or successful reuse. Name the tool route actually used. |
| J2 — Real-world Impact | The concrete educational problem and intended beneficiaries; AC-linked observations showing what a learner could do, understand, or recover in the demonstrated journey. | Report observed usability with method/sample limitations. Prototype completion, self-reported action counts, or one usability session do not establish mastery, retention improvement, broader demand, or causal benefit. |
| J3 — Reusability & Adoption Potential | Clean structure, documented prerequisites, a fresh-checkout run with exact commands/results, and an actual adaptation check with the change and result recorded. | Setup instructions alone are not a successful fresh-checkout run. Packaging skills or code is not adoption. Keep unexecuted run/adaptation checks pending. |
| J4 — Demo & Pitch Quality | A timed 3–5 minute video that shows the problem, working solution, Codex's concrete role, and what another month would enable; map scenes/timecodes to evidence. | A storyboard or script is preparation. Mark recording, duration, accessibility/playback, and final deliverable checks separately; do not call a video complete without the artifact and actual duration evidence. |

Use GitHub MCP read tools when available to inspect published commits and provider checks. Use browser computer-use MCP for actual browser observations and tracker operations where appropriate; report this as browser MCP evidence, not native Google Sheets or Kaneo MCP use. Shell commands remain CLI/local evidence. Record tool availability limits and accurate fallbacks.

This skill does not authorize external messages, capstone submission, public repository changes, paid services, scheduling, or deployment. Do not publish source merely to complete an evidence row. When source publication is already in scope, use the existing protected local Git and installed recovery workflow from project instructions; never use GitHub MCP writes to bypass hooks. Verify each required remote head against the intended commit and inspect checkpoint completion separately. A local commit, registration, or successful push alone does not establish complete remote recovery protection. If publication or backup is incomplete, retain that status and the last successful backup.

Do not invent time saved, quality gains, participant outcomes, official deadlines, human approval, or historical verification. In this project use Africa/Lagos for user-facing timestamps unless the user changes that rule. Read the current context for the distinction between an internal target and an official deadline.

## Done When

Deliver a compact result with these four fields:

- **Goal:** the increment reconciled and whether the authorized update is complete or partly pending.
- **Context Pointers:** stable activity IDs, changed records and links, and the J1–J4 evidence mapping with actual artifact/revision/check/demo references.
- **Constraints:** separate per-destination write/readback results; missing, stale, unavailable, or conflicting evidence and the resulting claim limits. Include publication/recovery results only when checked, and preserve their distinction.
- **Done When:** verified completion criteria and next actions for every pending item. Distinguish a newly packaged skill from an actual invocation, invocation from successful output, and output from reuse by another person or project.
