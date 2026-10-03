# Hackathon activity tracking

Use a Google Sheet owned by `m.alkali5130@miva.edu.ng` and the existing local Kaneo workspace to preserve the hackathon brief, activities, decisions, milestones, and evidence. Keep the project in private GitHub repositories owned by separate account and MikeIronSyd. This specification covers tracking setup and ongoing context maintenance. The initial setup preceded track selection; the user selected Guidance, Pathways & Opportunity on 2026-10-03, with self-taught beginners as the initial audience. The first learning area, product idea, and MVP remain undecided.

## Requirements and scope

- Preserve the supplied brief: use Codex to build people-centred technology that makes learning easier to reach, sustain, and act on, helping people find what they need, stay engaged, and turn learning into opportunity.
- Build under exactly one challenge track: Guidance, Pathways & Opportunity, selected by the user on 2026-10-03. The three options and four judging criteria are preserved in `project-context.json`.
- Record Codex's contribution to planning, building, reviewing, and documenting, with links to actual artifacts. AGENTS.md, plan mode, MCPs, and reusable skills can strengthen that evidence.
- Track the entire activity history and current work in both Google Sheets and Kaneo. Keep stable activity IDs across both.
- Distinguish completed work, future work, unknown dates, unverified course completion, measured time, estimates, and unavailable checks. Do not invent these values.
- Use the existing local Kaneo service and authenticated accounts. Keep GitHub repositories private and credentials outside source files.
- Apply the user's SDLC, specification, UI/UX skill, GitHub recovery, commit, and push instructions to subsequent project work.

Capstone product design and implementation require their own specification once the learner group, problem, and concept are defined. Adding paid services and creating recurring monitoring are outside this setup.

## Design

The Google Sheet contains Context, Activities, Milestones, Decisions, and Codex evidence tabs. Activities use A001 through A010 initially. Milestone requirement IDs use M1-R01 and similar IDs; decisions use D001 through D004. Dates and times use Africa/Lagos. The initial evidence record describes actual briefing and tracking work, with product evidence still to come.

Kaneo uses the same A001 through A010 prefixes, with To Do, In Progress, In Review, and Done columns. Record LMS module completion separately from the weekly milestones and practical deliverables. A requirement whose completion has not been checked remains explicitly unverified.

The personal repository is the local `origin` fetch remote, with push URLs for both repositories; `miva` also names the Miva repository for direct readback. A normal main-branch push to origin publishes the same history to both accounts. separate account has verified write access to the Miva repository. The project is registered with the installed recovery runtime, preserving original Git hooks and adding a pre-push checkpoint. Use Push-WithBackup for publication and inspect the resulting checkpoint.

Google Sheets was prepared as a verified local workbook. The user explicitly requested the signed-in Miva browser workflow. Browser file upload required an additional extension permission, so the existing editing controls are used to populate the native Sheet instead. Verify the native result separately from the local workbook.

Live execution status and publication evidence belong in the linked Google Sheet and Kaneo activities. `project-context.json` preserves the settled brief, account identities, destination links, and unresolved project decisions. The project AGENTS.md instructs Codex to read these records when resuming work. Generated workbooks, screenshots, and local authoring dependencies are excluded from Git source.

## Acceptance criteria

| ID | Observable result | Verification |
| --- | --- | --- |
| AC1 | The context preserves the brief, one-track constraint, three options, four judging criteria, milestones, and confirmed identities. | Parse the context and compare with screenshots and explicit user answers. |
| AC2 | A native Google Sheet in the Miva account contains five populated, legible tabs with useful scrolling and status controls. | Verify account, title, tab contents, representative cells, formatting, and saved state in the browser. |
| AC3 | Kaneo contains the hackathon project and ten initial tasks with aligned IDs, descriptions, and honest statuses. | Read back the board and task details. |
| AC4 | Intended source is committed and pushed to both private GitHub repositories, with successful recovery evidence. | Verify remote main-branch commit hashes against local HEAD and inspect checkpoint completion, source coverage, and warnings. |
| AC5 | Records distinguish actual outcomes from planned or unverified work. | Review statuses, dates, evidence, and unresolved fields in all records. |

## Plan

1. Record the brief, milestones, settled constraints, identities, and remaining project decisions.
2. Build and inspect the workbook, then populate and verify the native Miva Sheet.
3. Create and verify the Kaneo project and tasks, preserving common IDs.
4. Register recovery coverage, check intended source for credentials, configure private repositories and account access, then commit and push the same history to both.
5. Record actual verification and publication evidence in the activity trackers. Keep future project decisions unresolved until they are discussed.

The spreadsheet, Kaneo, and account discovery work can run independently. Source publication depends on recovery registration, intended-source checks, and verified repository access.

## Initial setup verification — 2026-10-02

- At initial setup, context JSON parsed successfully; it had three track options, four judging criteria, and no selected track.
- The local workbook contains five populated tabs. Artifact-tool inspection and the formula error scan found no formula errors. Every tab was rendered and checked for clipping. Saved workbook XML confirms tables, filters, frozen panes, and status validation. The bundled Node process returned exit 1 without a diagnostic after exporting; the saved ZIP, XML, content, and rendered views were checked independently.
- The saved native Sheet was visually reviewed and exported for independent readback. Every used cell matches the verified workbook plus authorized updates: zero value mismatches and zero cell errors. Its five tabs contain 27 context records, ten activities, fourteen requirements, four decisions, and one initial Codex evidence entry. All five filters and frozen heading rows, the four work-tab ID-column freezes, and six-option Activities/Milestones status dropdowns were verified. The Share dialog shows m.alkali5130@miva.edu.ng as Owner and general access Restricted. A002 is Done; A009 tracks source publication and recovery.
- Both GitHub repositories were read back as private. The exact Miva invitation was accepted, and the personal GitHub CLI reported WRITE access to `MikeIronSyd/andela-miva-codex-hackathon`.
- Kaneo was reloaded and read back in the visible UI: exactly ten tasks, no duplicates, no due dates, and all descriptions and statuses verified. At setup readback there were seven To Do, two In Progress, and one Done task. Course completion had not been verified at that point.
- `Register-Project.ps1 -Path <workspace> -ConfigPath <physical-runtime-config>` succeeded after an already-running scheduled checkpoint completed. Original hooks were preserved.
- The scheduled recovery checkpoint completed successfully at 18:34:59 WAT on 2026-10-02. This precedes source publication; it is not evidence that the repositories contain the final source.
- Final Kaneo status updates and publication checks are recorded as they complete in the linked activities and local delivery evidence. AC4 requires actual publication and checkpoint results before completion.

Initial validation commands included `Get-Content -LiteralPath '.\project-context.json' -Raw | ConvertFrom-Json`, `git diff --check`, and a credential-pattern scan over the intended files. Those context checks compared three tracks, four judging criteria, the then-unresolved selected-track field, the three confirmed account identities, and the ten-task mapping. Kaneo readback also checked that every description was verified and the duplicate count was zero.

## Capstone kickoff — 2026-10-03

The user confirmed Guidance, Pathways & Opportunity as the single selected track; record this completed selection under existing activity A003 / CAH-4. They are building solo and reported capacity above ten hours per week; this is an availability estimate, not measured effort. Their observations are that learners struggle to identify what to learn and the right resources, lose focus or motivation, and cannot see the eventual outcome of their learning. The initial audience is self-taught beginners facing information overload, conflicting resources, and an unclear learning path. Career changers were also discussed as facing difficulty; open university students provided a comparison around motivation. The first learning area, access to two or three learners for feedback, product idea, MVP, and calendar deadlines remain unresolved.

The signed-in LMS was read back on 2026-10-03 after the user reported both modules passed: Codex Foundations and Practical, Advanced Workflows and Automation; two of two modules passed, 100% course progress, and capstone access unlocked. This verifies LMS progress. It does not verify completion of whole weekly milestones, practical exercises, a reusable skill, MVP implementation, or submission deliverables. Preserve those distinctions in both trackers and the durable context.

A separate read-only inspection of the submission route showed a prerequisite reflection with twelve questions and an estimated three minutes to complete. Submission fields, deliverables, URL or file restrictions, and a deadline were not visible. No answers were entered or submitted during that inspection. This records what was visible in the LMS at inspection time; later user instructions can establish the project deadline.

Later on 2026-10-03, the user explicitly instructed: use 14 October as the submission deadline. Record 2026-10-14 (Africa/Lagos) as the submission date in the context, both M3 requirement rows in the Sheet, and Kaneo submission activity A007. It supersedes the initial relative answer of two weeks and the assistant's derived 17 October estimate. The cutoff time is unspecified and the organiser's cutoff has not been independently verified. Other programme-week dates remain unknown. Validate the context date, M3 date, source attribution, and preservation of other requirements before publication; verify both trackers separately.

This increment updates the selected track, delivery capacity, learner observations, and separately evidenced LMS progress. Preserve the existing brief, requirement lists, task IDs, destinations, and initial history. Do not create an empty capstone specification before the concept is defined. Validate JSON syntax, the selected track and unresolved concept fields, preservation of settled records, whitespace, and credential patterns before publication. Tracker synchronization and publication require their own observed outcomes before being marked complete.

Prepared-source checks passed on 2026-10-03: `Get-Content -LiteralPath 'project-context.json' -Raw | ConvertFrom-Json`; semantic comparisons against `git show HEAD:project-context.json` for the selected track, audience, two passed module titles, 100% LMS progress, unresolved product and date fields, and unchanged brief, milestones, destinations, ten-task mapping, and initial activity history; `git diff --check`; and an `rg -n -i` scan for API-token and private-key patterns across the three edited source files, with no matches. Read-only recovery inspection confirmed the exact workspace remains registered with its pre-push hook. The last observed complete checkpoint was 2026-10-03 at 10:45:34 WAT with no warnings; that historical checkpoint does not establish publication or backup of this later source increment.

## Delivery and maintenance

Keep the final Sheet and Kaneo board accessible through their links in the context. After each authorized project increment, update activities, decisions, evidence, and next actions in both trackers. Record a pending update if a destination is unavailable.

Before source publication, run JSON parsing, `git diff --check`, and a credential-pattern scan over intended source. Use the installed physical recovery runtime in isolated child processes, keeping its GitHub configuration scoped to those processes. Never commit credentials, recovery configuration, private keys, conversation databases, or recovery archives as project source.

If a checkpoint fails or is incomplete, preserve the previous successful backup, inspect the error, and retry or resolve it. If Push-WithBackup returns exit 20, the source push already succeeded; retry the checkpoint without repeating that source push. Local files and existing tracker records remain available if an external destination fails.
