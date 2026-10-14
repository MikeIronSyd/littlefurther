# Complete LittleFurther usage guide — 10 October 2026

## Goal

Fulfil the user's request for step-by-step use of every current app feature, from account creation to all journey, recovery and peer-circle controls. Deliver `docs/USER_GUIDE.md` and a detailed conversational walkthrough. Documentation only; no product behavior change.

## Context Pointers

Baseline `e2b6fae7e0c34a8d7563850f3e75c95e267b36f2`, current source and capstone specification/context. Three parallel read-only inventories cover account/shell/profile/local operations; plan/study/progress/history; and Comeback/circles. Actual source governs over unused translation keys or older plans. Existing app checks are historical evidence, not new tests for this guide.

| Research need | Actual finding/source | Status |
| --- | --- | --- |
| Account/shell/preferences/local boundaries | main.ts/shell.ts/ui.ts/i18n.ts, server auth allowlist/profile/store, operations guide; exact form limits, theme/locale persistence, drawer and signout behavior mapped by lf_brand_tests | Satisfied |
| Journey/study/progress/history | plan-editor.ts/journey.ts/main.ts, templates/progress/validation/store; all create/edit/reorder/remove/log/complete/reference/selection/empty/error controls mapped by lf_brand_review | Satisfied |
| Comeback/private peer lifecycle | comeback.ts/circle.ts and domain/server rules; exact preview/confirmation/retry/audience/invitation/encouragement/deletion/leave/remove/close mapped by lf_brand_tracking | Satisfied |
| Completeness/claim limits | Source crosschecks distinguish actual controls from unused strings; no timer, AI curriculum, ordinary-editor reload button, historical-delete/undo/export/remote-peer or outcome claims. Complete guide review and local links remain checks below | Satisfied for authoring; verification separate |

R29 discovery is complete for this bounded documentation scope. No essential fact or consequential choice is unresolved before authoring. Routine guide organization follows the settled request; no question gate. No UI implementation, new design comp, stack comparison or application test rerun is needed for prose-only documentation.

## Constraints

| ID | Acceptance |
| --- | --- |
| UG01 | Every current screen/control family and all five connected capabilities have user steps using actual English labels; French equivalence, local entry and shell are included. |
| UG02 | Explain validation, saved vs unsaved work, minutes vs completion, active vs retained history, selected-journey totals, calendar-day tracking, source/version limits, optional peer privacy and cleanup accurately. |
| UG03 | Cover errors, uncertainty/stale recovery, session changes, accessibility controls and absent features without promising unsupported controls or measured benefits. Separate learner use from maintainer commands. |
| UG04 | Independent source-linked completeness review, local link/content checks, saved E021/A010 trackers, normal source evidence and exact heads; actual evidence only. |

Plan: author guide and README entry; independent inventories review assigned guide sections; correct documentary findings as one batch; validate local links/coverage and `git diff --check`; publish; reconcile E021/A010; close out actual results. No source/test/data/schema/API/dependency changes or full application check claims.

## Done When

UG01–UG03 have source-grounded coverage and independent review; UG04 actual documentation checks and tracker/source readbacks are recorded. User receives the full practical walkthrough and durable guide. Final design approval, learner effectiveness, capstone submission and timed demo remain separate.

## Verification

On 10 October 2026, three independent source/prose reviews found no omitted current feature family in their assigned scope. Five small wording findings were corrected: device-theme fallback in memory, event dates, the unmounted scope heading, closed-circle recovery and dirty circle name/code entry. [Review record](../reviews/2026-10-10-user-guide.md) preserves scope and limitations.

Root ran `node .local/user-guide-check.mjs`: passed all 27 sequential sections, 45 current control labels, 34 relative documentation links and context JSON parsing. `git diff --check` passed. These are documentation checks, not application tests; no app build/static/browser suite was rerun for prose-only changes. No product source, tests, database, dependency or API changes.

UG01–UG03 are satisfied within current source-documentation scope. UG04 artifact publication and E021/A010 saved readback are complete; [delivery verification](user-guide-verification.md) records exact results. No human usability, learner outcome, formal design approval or finished video is inferred. Final documentation closeout is recorded as source evidence separately through normal source evidence.
