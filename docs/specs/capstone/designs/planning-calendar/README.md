# Planning calendar reference

## Goal

Show the scoped calendar selection and ready-AI-review treatment before frontend implementation.

## Context Pointers

[Contract](../../increments/planning-calendar.md), R43 and PC01–PC06. [Editable HTML](reference.html) uses the incumbent Amber colours/system typography and synthetic proposal content. It is a focused surface reference, not a complete app screen or new design approval.

## Constraints

Root rendered and inspected [desktop light](reference-desktop-light.png), [desktop dark](reference-desktop-dark.png), [320px light](reference-mobile-light.png) and [320px dark](reference-mobile-dark.png) before production edits on14October2026. Desktop viewport1440×1000; mobile320×900; full-page image heights follow content. Isolated Edge checks passed native date/showPicker requests,44px height and no horizontal overflow. The captured native calendar and detailed receipts remain ignored local research evidence. No learner records or real provider calls were used.

For the user's later optional-label clarification, the [focused editable reference](optional-reference.html) and [320px capture](optional-reference.png) were rendered/inspected before the two localized label edits. It shows the conditional manual/AI hint without replacing the existing visual direction.

For the subsequent pending-date clarification, the [focused editable reference](pending-reference.html) and [320px capture](pending-reference.png) were rendered/inspected before the visibility correction. Choosing a valid candidate replaces the empty message with an Add-date action hint; the count remains zero until Add.

Actual application captures use isolated synthetic learner records and mocked AI/search responses:

| View | Capture |
| --- | --- |
| English pending-date guidance, before Add, focused fieldset | [Actual interface](app-pending-date-en.png) |
| English desktop light, optional topics and selected dates | [Actual interface](app-desktop-light-en.png) |
| English desktop dark, AI proposal ready and manual route hidden | [Actual interface](app-desktop-dark-ai-en.png) |
| French320px dark,200% root text | [Actual interface](app-mobile-dark-fr-enlarged.png) |
| French320px light, editable AI review | [Actual interface](app-mobile-light-ai-review-fr.png) |

[Capture provenance](app-captures.json) records dimensions, source hashes, base revision and classification. These five captures were refreshed after the synchronous pending-selector save-validation and pending-hint corrections. Full-page capture includes a fixed skip-link positioning anomaly; no new skip-link product defect is established. No saved plan, real provider request or learner outcome is claimed by these images.

## Done When

This reference informs implementation; actual application checks, independent review and approval/publication state are recorded separately. Native calendar appearance/language is controlled by browser/OS.
