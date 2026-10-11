# Actual UI specialist review captures

## Goal

Preserve representative current-app evidence for the11October whole-UI review. These are actual browser MCP screenshots on isolated synthetic4319, not generated designs or proposed replacements.

## Context Pointers

Application source is `c7ddff22a5756aaa2a979f7ca0b2a5fca19024a7`. [Review](../../reviews/2026-10-11-ui-specialist-review.md) links source findings/proposals and the two new resource sets. `measurements.json` stores selected failure/control/layout observations.

| Actual JPEG | State / viewport |
| --- | --- |
| activity-dark.jpg | French/dark Activity,1280×900; sessions versus completion record distinction |
| preferences-error-dark.jpg | French/dark invalid-timezone rejection,1280×900; retained synthetic input and generic alert |
| comeback-checkbox-dark.jpg | French/dark conflict preview,1280×900; full clickable label measured621×24; no confirmation applied |
| editor-limit-dark.jpg | French/dark unsaved50-step draft,1280×900; Add remains enabled and no-op; no plan saved |
| learning-mobile-dark.jpg | French/dark learning,320×800 at scroll0; primary study startsY603.94 |
| circle-dark.jpg | French/dark circle detail/management,1280×900; two44px Back actions before heading |
| sharing-preview-dark.jpg | French/dark synthetic commitment preview,1280×900; not shared |
| sharing-preview-mobile-light.jpg | English/light preview,320×800; input retained through theme/language changes |

Native scrollbar leaves1265/305CSSpx document width in the measured desktop/mobile views. Current screenshots are viewport captures: lower content can remain outside the image. This is one bounded review batch with corrected capture/locator timing, not an exhaustive screen-state matrix or an implementation/polishing loop.

## Constraints

No real learner record, credential, invitation token or private conversation is pictured. The Interface review account, web-page goal, note and commitment are synthetic fixtures. Stored plan/activity/completion/circle data was not changed. Locale/theme were tested and restored; temporary viewport reset. The rejected timezone and50-step/commitment inputs were scratch diagnostics. Root's IAB captures are separate from A/B's earlier native Chrome observations and the prior control-readability packet. Neither screenshots nor checklist use establish conformance, learner outcomes or formal design approval.

## Done When

All eight JPEGs contain embedded actual-capture origin metadata; capture paths/measurements resolve; durable review reports source versus runtime evidence accurately. Review-only server/tab cleanup and delivery readbacks are recorded separately. No raster is shipped by the application.
