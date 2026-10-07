---
name: learning-journey-review
description: Review a learning-journey product's specification, changes, and test evidence against its acceptance criteria. Use for capstone increment reviews, learner journey checks, or evidence readiness reviews; it does not implement fixes or establish educational effectiveness.
---

## Goal

Produce an acceptance-criterion-linked review of the requested change or milestone, with actionable findings, reproducible evidence, and explicit unverified behavior. Review the scope the user supplied; a document-only review can establish document quality but cannot pass application behavior.

## Context Pointers

Start with the repository's `AGENTS.md`, `project-context.json`, and current specification and verification record under `docs/specs/`. Follow their links to relevant decisions, research, design references, and actual checks. In this repository the product specification is `docs/specs/capstone/spec.md`. A dated archive is historical evidence, not the current requirement. Explicit user decisions take precedence over stale records; identify consequential contradictions without reopening settled decisions.

Inputs are the review scope, acceptance criteria (ACs), change or commit/base reference, affected source, and available test or observation evidence. Resolve these from the task and repository before requesting missing consequential information. Record the exact revision or uncommitted state reviewed. For UI/UX review, apply the project's required Impeccable workflow alongside this skill.

Use each tool for the evidence it can actually provide:

| Evidence need | Preferred route | What to retain |
| --- | --- | --- |
| Local change, source, build, tests | Shell and repository tooling | Working directory, exact command, revision, exit result, useful output or artifact |
| Published commit, pull request, provider checks | Available GitHub MCP read tools | Repository, immutable SHA, check name/status, URL, observation time |
| Running learner journey | Browser computer-use MCP | App URL/build, setup, actions, visible result, evidence reference and limitations |

Discover available tools and inspect package scripts or documented commands before running them. Do not invent a test command, infer a passed provider check from a push, or substitute a screenshot for an interaction. If the preferred tool is unavailable, name the missing evidence and any actual fallback accurately. Shell Git is local/CLI evidence; browser automation of Sheets or Kaneo is browser MCP use, not native tracker MCP integration.

## Constraints

### Review workflow

1. Map affected ACs to changed modules, data contracts, copy, and user journeys. Inspect the affected rules and source, including relevant unchanged callers and persistence paths. Read existing evidence for its tested revision and scope before reusing it. Research gaps are review findings; do not silently close them with assumptions.
2. Derive the relevant invariants from the active specification. For this capstone, verify the checks below where affected. They are this product's requirements, not universal rules for every learning app.
3. Run only available, appropriate checks within the task's authorization. Inspect current scripts and preconditions first. When running the app is in scope, use isolated test data within that authorized scope; never overwrite real learner records to create a test scenario. Record failed, unavailable, and skipped checks as such. In a read-only or plan-mode task, inspect evidence and report remaining execution work without making changes.
4. Compare expected and observed behavior. Separate a reproducible defect from a risk, suggestion, or missing check. Prioritize by learner impact and likelihood; cite the AC, exact source location or observation, and the smallest useful correction. Do not modify product code merely because a review found a defect.

| Current capstone concern | Review evidence to seek |
| --- | --- |
| TinySteps and Comeback | Curated templates and learner edits produce an understandable next action; restart preserves completed work and history, and requires deliberate acceptance of plan changes. No AI-generation or content-quality claim is implied. |
| FinishLine and flexible consistency | Completed actions are self-reported activity, not assessed mastery. Scope edits do not silently rewrite historical evidence. The consistency calculation follows the specified seven **calendar** days and timezone, rather than a rolling 168 hours; check date boundaries, duplicate activity, rest, and changed plans against the stated denominator. |
| Both meanings of StudyCircle | Optional personal study/review can be skipped without blocking progress. Peer circles follow the specified ownership, membership, and private-by-default sharing rules; a learner controls consent and exactly what is shared. Check unauthorized access and withdrawal behavior when affected. |
| Local operation and privacy | The promised offline core requires the local server to be running on the PC. Verify reload and persistence with internet unavailable if execution is in scope. Do not claim browser-only operation, server-off availability, remote peer connectivity, or synchronization from a local demonstration. |
| Study material boundary | Text and URL references are retained as specified. No URL fetching, content ingestion, PDF processing, or source validation is implied by saving a reference. External links may need internet. |
| English and French | Both agreed languages cover affected journeys, validation, empty/error states, and accessible names. Check switching, longer text, keyboard access, and readable progress equivalents against the agreed device/accessibility scope. |
| Design and research gates | Required research evidence and the image-first design step precede dependent frontend work. The settled audience is learners generally; do not add a narrow-audience or source-case question gate. Flag missing agreed evidence rather than inventing validation or restarting settled intake. |

Do not expand a review into implementation, live tracker edits, publication, external messages, recurring monitoring, paid services, or repository visibility changes. Existing task authorization may permit a review record; otherwise return the review in the conversation. Publish any subsequently authorized change through normal local Git commits and pushes to the project's selected repositories, preserving unrelated hooks and verifying the required remote heads. Global Codex recovery is separate; never register or send project files or Git history there, install recovery hooks, or use `Push-WithBackup` for project publication.

## Done When

Deliver a concise report with these four fields:

- **Goal:** scope and revision reviewed, plus the overall readiness conclusion within that scope.
- **Context Pointers:** inspected ACs and artifacts; an evidence matrix with `AC | expected behavior | evidence/revision | result | limitation`. Use `verified pass`, `verified fail`, or `unverified`; a justified `not applicable` needs a scope explanation.
- **Constraints:** findings ordered by severity, each linked to its AC and source/observation; failed, skipped, stale, or unavailable checks and resulting limitations. Do not mark a behavior passed without relevant execution evidence.
- **Done When:** criteria satisfied by this review, remaining blockers, and concrete next checks or fixes. State whether a running application was observed and tests actually ran. A skill file's existence is not proof of skill use, adoption, usability, retention, or learning benefit.
