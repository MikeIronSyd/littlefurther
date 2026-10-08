# Hackathon activity tracking

Use a Google Sheet owned by `m.alkali5130@miva.edu.ng` and the existing local Kaneo workspace to preserve the hackathon brief, activities, milestones, decisions and evidence. Keep source in the private separate account and MikeIronSyd repositories. Current direction as of 2026-10-07 is Track 2: Engagement & Staying in the Learning Journey, for learners generally, with all five capabilities and both personal cycles and private peer StudyCircle. The selected local browser demo uses curated templates, text/link inputs, English/French, a running local server for internet-disconnected use, and image-first interface design. See [the current capstone specification](../capstone/spec.md). Dated entries below preserve history; superseded Guidance and audience questions must not be reimported into active state.

## Requirements and scope

- Preserve the supplied brief: use Codex to build people-centred technology that makes learning easier to reach, sustain, and act on, helping people find what they need, stay engaged, and turn learning into opportunity.
- Build under exactly one challenge track: Engagement & Staying in the Learning Journey (Track 2). Preserve earlier choices and resets as history; all three track options and four judging criteria remain in `project-context.json`.
- Record Codex's contribution to planning, building, reviewing, and documenting, with links to actual artifacts. AGENTS.md, plan mode, MCPs, and reusable skills can strengthen that evidence.
- Track the entire activity history and current work in both Google Sheets and Kaneo. Keep stable activity IDs across both.
- Distinguish completed work, future work, unknown dates, unverified course completion, measured time, estimates, and unavailable checks. Do not invent these values.
- Use the existing local Kaneo service and authenticated accounts. Keep GitHub repositories private and credentials outside source files.
- Apply the user's SDLC, specification, UI/UX skill and authorized project commit/push instructions to subsequent work. Under the replacement 7 October 2026 policy, global Codex recovery is separate and never captures project files or Git history.

The capstone specification and research checklist govern product work. Audience, five-feature inclusion, both StudyCircle meanings and the selected delivery boundaries are settled. Adding paid services and creating recurring monitoring are outside this setup. Track MCP usage and reusable-skill invocations as actual work, with tool identity, artifact links, results and limitations; do not award completion merely for configured tools or skill files.

## Design

The Google Sheet contains Context, Activities, Milestones, Decisions, and Codex evidence tabs. Activities use A001 through A010 initially. Milestone requirement IDs use M1-R01 and similar IDs; decisions use D001 through D004. Dates and times use Africa/Lagos. The initial evidence record describes actual briefing and tracking work, with product evidence still to come.

Kaneo uses the same A001 through A010 prefixes, with To Do, In Progress, In Review, and Done columns. Record LMS module completion separately from the weekly milestones and practical deliverables. A requirement whose completion has not been checked remains explicitly unverified.

The personal repository is the local `origin` fetch remote, with push URLs for both repositories; `miva` also names the Miva repository for direct readback. A normal main-branch push to origin publishes the same history to both accounts. separate account has verified write access to the Miva repository. Preserve this explicit dual-private-repository publishing authorization, use normal local Git commits and `git push origin main` after applicable checks, preserve unrelated hooks, and verify both remote heads. Do not register projects with CodexRecovery, install recovery hooks or use `Push-WithBackup` for project publication.

Google Sheets was prepared as a verified local workbook. The user explicitly requested the signed-in Miva browser workflow. Browser file upload required an additional extension permission, so the existing editing controls are used to populate the native Sheet instead. Verify the native result separately from the local workbook.

Live execution status and publication evidence belong in the linked Google Sheet and Kaneo activities. `project-context.json` preserves the settled brief, account identities, destination links, and unresolved project decisions. The project AGENTS.md instructs Codex to read these records when resuming work. Generated workbooks, screenshots, and local authoring dependencies are excluded from Git source.

## Acceptance criteria

| ID | Observable result | Verification |
| --- | --- | --- |
| AC1 | The context preserves the brief, one-track constraint, three options, four judging criteria, milestones, and confirmed identities. | Parse the context and compare with screenshots and explicit user answers. |
| AC2 | A native Google Sheet in the Miva account contains five populated, legible tabs with useful scrolling and status controls. | Verify account, title, tab contents, representative cells, formatting, and saved state in the browser. |
| AC3 | Kaneo contains the hackathon project and ten initial tasks with aligned IDs, descriptions, and honest statuses. | Read back the board and task details. |
| AC4 | Intended non-secret source is committed and pushed to both authorized private GitHub repositories. | Verify both remote main-branch commit hashes against the intended local commit. Global recovery is separate and does not receive project files or Git history. |
| AC5 | Records distinguish actual outcomes from planned or unverified work. | Review statuses, dates, evidence, and unresolved fields in all records. |

## Plan

1. Record the brief, milestones, settled constraints, identities, and remaining project decisions.
2. Build and inspect the workbook, then populate and verify the native Miva Sheet.
3. Create and verify the Kaneo project and tasks, preserving common IDs.
4. Check intended source for credentials and unsuitable generated data, verify the existing private repository destinations and account access, then use normal commits/pushes to publish the same intended source history to both.
5. Record actual verification and publication evidence in the activity trackers. Keep future project decisions unresolved until they are discussed.

The spreadsheet, Kaneo, and account discovery work can run independently. Source publication depends on intended-source checks and verified access to both authorized repositories; no global-recovery registration or checkpoint is a project-publication prerequisite.

## Initial setup verification — 2026-10-02

This section preserves the original setup and its then-applicable recovery policy. Historical registration/checkpoint statements below do not reinstate that policy after the user's 7 October globals-only replacement.

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

A separate read-only inspection of the submission route showed a prerequisite reflection with twelve questions and an estimated three minutes to complete. Submission fields, deliverables, URL or file restrictions, and a deadline were not visible. No answers were entered or submitted during that inspection. This records what was visible in the LMS at inspection time.

Schedule clarification on 2026-10-03: the user's latest message explicitly establishes that the official submission deadline has not been announced. Earlier answers of two weeks and use 14 October were recorded as a submission date; those labels are superseded. Retain 2026-10-14 (Africa/Lagos) only as an internal planning target based on the earlier instruction. Official submission date/time and all milestone calendar due dates remain unknown. Clear both M3 due-date cells in the Sheet and A007's native Kaneo due date; describe the internal target separately and preserve the clarification history. Validate the null official dates, separate internal target, source attribution, and unchanged requirements before publication; verify both trackers separately.

This increment updates the selected track, delivery capacity, learner observations, and separately evidenced LMS progress. Preserve the existing brief, requirement lists, task IDs, destinations, and initial history. Do not create an empty capstone specification before the concept is defined. Validate JSON syntax, the selected track and unresolved concept fields, preservation of settled records, whitespace, and credential patterns before publication. Tracker synchronization and publication require their own observed outcomes before being marked complete.

Prepared-source checks passed on 2026-10-03: `Get-Content -LiteralPath 'project-context.json' -Raw | ConvertFrom-Json`; semantic comparisons against `git show HEAD:project-context.json` for the selected track, audience, two passed module titles, 100% LMS progress, unresolved product and date fields, and unchanged brief, milestones, destinations, ten-task mapping, and initial activity history; `git diff --check`; and an `rg -n -i` scan for API-token and private-key patterns across the three edited source files, with no matches. Read-only recovery inspection confirmed the exact workspace remains registered with its pre-push hook. The last observed complete checkpoint was 2026-10-03 at 10:45:34 WAT with no warnings; that historical checkpoint does not establish publication or backup of this later source increment.

## Delivery and maintenance

Fresh-ideation reset on 2026-10-03: the user explicitly asked to ignore the self-taught beginners problem statement and start afresh, then chose to reconsider all three tracks. Preserve the prior intake above as superseded history, clear the active track/audience assumptions, and reopen A003; A004 remains in progress. The new user observation is lack of motivation and not seeing the light at the end of the tunnel. Clarify who is affected, the learning goal, and whether the eventual benefit is unclear, progress feels invisible, or both before choosing a track. Preserve solo capacity, verified LMS completion, official-deadline clarification, and all destinations. The full capstone brief's theme Learning That Stays With You, participant-originated idea guidance, proof-of-concept scope, and operating constraints are captured in project-context.json. Verify that no track/audience/concept is selected, the new observations do not assume a cause or beneficiary, superseded history is labelled, and other settled facts remain intact.

Further intake identifies the user as the firsthand case: repeated difficulty during coding, project-management certification preparation, and AI development/engineering self-development. The user answered "Both, or I'm not sure yet" about unclear benefit versus invisible progress; retain that uncertainty. This does not select a product audience or establish wider prevalence. The next detail is one recent attempt's intended ability, moment momentum dropped, and subsequent action. Use that episode to clarify the problem before selecting a track or concept.

Subsequent user-originated concept on 2026-10-03 supersedes the episode prompt: begin with a desired skill, certification, course, job opening, or prospective opportunity; establish current knowledge, identify what must be learned, and guide study/practice through successive levels toward the goal, including interview preparation where relevant. The user also reports recent BSc Artificial Intelligence enrollment at Miva; record this as a self-report, distinct from verified accelerator LMS completion. Guidance, Pathways & Opportunity is the assistant's strongest-fit recommendation, not an explicitly reselected track. The new questions are one specific initial target and whether the learner brings a known target or discovers a target first. Separate the broad vision from a proposed single-journey prototype; do not invent an audience, implementation, readiness score, outcome guarantee, or validation evidence.

Keep the final Sheet and Kaneo board accessible through their links in the context. After each authorized project increment, update activities, decisions, evidence, and next actions in both trackers. Record a pending update if a destination is unavailable.

Latest concept-blending increment on 2026-10-03: A003 returns to Done because the user explicitly provides Guidance, Pathways & Opportunity as the focus track. A004 remains in progress for MVP scoping. Blend the user's baseline-to-goal journey with informal/offline skill recognition, local opportunity/requirement mapping, credible free resources, and a visual path with an accessible text equivalent. Record local browser storage as a proposal; do not claim it is implemented, secure, or sufficient for offline operation. Capture source-backed technical refinements and the distinction between learning completion, demonstrated competence, and formal eligibility in the capstone concept specification. Preserve original intake and reset decisions as history, along with the unchanged official-deadline clarification and verified LMS evidence.

Before source publication, run JSON parsing, `git diff --check`, and a credential-pattern scan over intended source. When using the installed GitHub CLI profile, keep its GitHub configuration scoped to child processes. Publish through normal local Git, preserving unrelated hooks; do not invoke project recovery wrappers. Never commit credentials, recovery configuration, private keys, conversation databases, or recovery archives as project source.

If project publication fails or its result is ambiguous, read both remote heads before retrying and keep the pending result explicit. Preserve local source and existing tracker records when an external destination fails. Any independently authorized global checkpoint failure belongs to the separate globals-only recovery workflow, without uploading project files or history.

### Tracking clarification — 8 October 2026

The user asked why Google Sheets was in use and which account owned it. Root explained the earlier dual-tracker request and identified the existing restricted capstone Sheet under `m.alkali5130@miva.edu.ng`. A proposed simplification was immediately superseded when the user explicitly said to continue with the Google Sheet and everything previously in use. The original Sheet, Kaneo and both private GitHub repositories remain active. No destination was deleted or had its sharing changed; the E008 Sheet writes had already completed before the question, so no redundant rewrite was needed. This clarification does not alter the separate Miva study tracker.
