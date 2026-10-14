# Focused learner-flow refinement — 9 October 2026

## Goal

Correct the five D01–D05 issues from the [integrated design review](../reviews/2026-10-08-design-critique.md), preserving the selected Amber interface. The user's subsequent “proceed” authorizes the recommended smallest correction scope: all five fixes, current date-list input, no new date picker or separate step-only editor. This inferred routine scope was stated before work; it is not a formal review receipt.

## Context Pointers

Baseline `526ec3402c09e2e098e83dc44cd658428830f2cb`; [source check](../reviews/2026-10-08-design-source-check.md), [specification](../spec.md) AC01–AC03/AC11 and [design review contract](design-review.md). Existing Amber images and observed review captures supply incumbent visual truth. These narrow corrections reuse native fieldsets, existing focus rules, error surfaces and reference-link styling; they do not introduce a visual-world or material change requiring a new image concept. Impeccable's existing session context and harden/clarify/craft-floor references govern implementation.

### Research checklist — before dependent production edits

| Need | Status | Findings / evidence |
| --- | --- | --- |
| R21a — Editor identity, focus and validation | Satisfied | [Independent editor research](../reviews/2026-10-09-refinement-editor-research.md) traces optional persisted IDs, row recreation/index hooks, locale helpers, native validation interception and server bounds. Separate uiId is stripped from payloads; Action is boundary focus fallback; next/previous Remove and empty Add are fixed choices. Returned selection callback follows root heading focus; field-specific localized errors preserve hints and draft. |
| R21b — Localized rhythm and study references | Satisfied | `journey.ts:84` supplies raw labels outside locale binding; `bind`/`dateLabel` in i18n.ts refresh connected nodes without recreating forms. Main is the only caller of showLearning/showStudy/showPlanEditor. GoalTemplate contains ID, version, locale sources and checkedOn; LearningPlan persists templateId/templateVersion. API templates are already loaded in renderRoute. Match both ID and version and render selected-locale source metadata; unknown/mismatched templates do not borrow current sources. Learner references are validated HTTP(S) strings by validation.ts78–90 and are already presented with no-fetch/external disclosure. No external source fetching or source revalidation is claimed. |
| R21c — Test/runtime and regression coverage | Satisfied | [Independent test research](../reviews/2026-10-09-refinement-test-research.md) verifies existing one-worker MS Edge/4318 synthetic fixtures, rate-limit handling, locale/field expectations and exact template-version rendering fixtures. Focus cases cover all five criteria and boundaries; no baseline pass is inferred. |
| R21d — Design scope and formal workflow | Satisfied for corrections | Explicit Amber/theme/sidebar decisions remain settled. Existing formal six-item receipt and authenticated capture remain separate open deliverables, as in R18d. No receipt, force or phase completion is a prerequisite for correcting these observed product defects; no broader formal-completion claim follows. |

R21a–d are closed for this correction scope on9October2026 at11:41 Africa/Lagos, before production edits. All required research is documented above and in the linked independent reports; no factual blocker or consequential unanswered choice remains. Actual implementation/testing and the separate formal pipeline are not passed by this closure.

## Constraints

### Interface and quality contract

Keep the existing strict TypeScript/native DOM stack, API bodies, SQLite schema and dependency pins. Ownership: editor implementer changes only plan-editor.ts; root changes main.ts, journey.ts and i18n.ts; independent test author changes only the new design-refinement browser test file. Production changes begin after R21a–d are satisfied and recorded. Reopen research for a consequential new unknown.

| Criterion | Implementation-ready requirement |
| --- | --- |
| RF01 / D01 | Each draft row has stable local identity independent of array position, including unsaved rows. Strip any UI-only identity from API DTOs. After move, focus the same row's corresponding move button if enabled, otherwise its Action input; announce localized new position/total through a polite live status. After removal, focus the next surviving row's Remove control, otherwise the preceding row's Remove; if empty, focus Add a step. Adding focuses the new Action input. Preserve all other draft input, completed locks, removal consent and history behavior. |
| RF02 / D02 | Every study-day marker receives a locale-bound formatted calendar date and neutral descriptive status: recorded study or no study recorded. Update English/French in place. Keep calendar calculation, numeric count and nonpunitive styling unchanged; avoid assuming mastery or screen-reader pronunciation. |
| RF03 / D03 | Validate availability on draft review and save: missing, malformed calendar token and excessive distinct dates receive separate localized feedback; topics are requested only for a manual new draft, with distinct missing/excess-topic messages. Identify malformed tokens using plain text. Associate each field error with its input using aria-invalid/describedby while retaining existing hints, focus the first affected visible field, preserve input and previously reviewed draft. Clear only that field's stale error on edit; language changes translate the error without clearing values. Server validation remains authoritative. |
| RF04 / D04 | showLearning's Edit plan opens the ordinary full editor; Edit step passes the current stable step ID. showPlanEditor accepts optional selectedStepId and returns a focusSelectedStep callback. Root focuses the editor heading first, then the selected Action field when found. Provide a localized visible selected-step context inside that fieldset. Unknown/stale ID falls back to the normal full editor. Reorder/removal follows stable identity; saving/cancel, dirty guards and revision/history rules remain intact. |
| RF05 / D05 | showStudy receives the already loaded templates. Render existing template sources only when stored ID and version match, using current locale labels/URLs and checked dates, beside the study summary. Render learner reference URLs too, deduplicating URLs within each displayed list without mutating plan data. Use safe external link attributes and existing internet-required/no-fetch disclosure. For mismatched template metadata show a localized sources-unavailable explanation and retain learner links. Manual plans with no references show no empty resource section. Locale/theme changes preserve reflection/minutes and existing activity/completion semantics. |

New message keys/parameters must be fully supplied in English/French before compilation. No user-entered titles, dates, topics, reflections or URLs are translated. Keep account/view guards and async lifetimes from P09. Use existing semantic controls and classes; introduce no dependency, broad token normalization, bulk formatting, runtime AI, content import, new peer behavior or deployment.

The first paired browser inspection showed the new reference list ending directly beside the minutes label. RF05 includes a small layout correction before the confirmation pass: constrain the study resource section to the existing780px form measure, separate it from logging with the existing28px study-summary spacing, and give its source heading the existing18px/8px supporting-heading rhythm. These values and roles are verified in styles.css; no new token or visual-world decision is needed. Root also owns this scoped stylesheet change. This is the one captured refinement batch, not another redesign.

Editor interface: `showPlanEditor(...existingArguments, options?: {selectedStepId?: string}): () => boolean`. Returned callback focuses the selected existing step's Action and returns true, or returns false for absent/stale selection. Native heading entry remains the fallback. Set form.noValidate for precise custom availability feedback, then call reportValidity explicitly after custom validation; retain all other native field/removal-consent checks. Manual topic errors also cover a line exceeding the existing240-character step-title bound. Exact keys: stepMoved(number,total), stepRemoved(total), editingStepContext(number,total), availabilityRequired, availabilityInvalid(dates), availabilityTooMany(max), topicsRequired, topicsTooMany(max), topicsTooLong(lines,max). Retained errors use locale binding and preserve hints. Rhythm keys studyRecorded/noStudyRecorded; mismatched-template key templateSourcesUnavailable. Root owns all English/French catalogue additions.

### Plan and verification

1. Complete research and document closure, including independent reports; finalize exact editor message keys.
2. Implement disjoint editor/root changes and independent focused tests.
3. Run required `pnpm --pm-on-fail=download run check`, `lint`, `format:check`, `build`, `pnpm --pm-on-fail=download test`, `run verify:process`, `run test:e2e`, `run audit`. Use the focused browser file first to diagnose correction-specific failures, then one full browser run after changes stabilize. Never weaken assertions or count historical passes as fresh evidence.
4. Perform independent source review and one batched browser MCP desktop/mobile EN/FR/theme inspection with synthetic data. Fix demonstrated blockers in one batch and confirm affected behavior once. Run Impeccable detector once on changed frontend targets; advisory documentation drift remains separate.
5. Record RF01–RF05 implementation/actual results, residual limits and J1–J4 evidence. Reconcile E013 in the correct Miva Sheet/Kaneo after live uniqueness check, publish intended source to this private repository and verify each head. Global recovery remains separate.

No migration is needed; rollback restores the prior source/build while retaining the unchanged local database. Builds should be served from the corrected source for the final observation. Existing demo data stays intact; test data is isolated and ignored.

## Done When

All five focused criteria have actual passing behavior evidence, required checks and independent review have no remaining blocking finding, and delivery records distinguish corrected behavior from open formal design approval/video/learner-effect deliverables. A formal receipt, educational impact, native-French certification and comprehensive accessibility are not inferred from these corrections.
