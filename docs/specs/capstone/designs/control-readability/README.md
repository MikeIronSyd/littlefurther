# Control/readability reference

## Goal

Show the approved persistent-control and readability direction before frontend implementation. This is a synthetic reference, not an application screenshot, functioning product or evidence of educational benefit.

## Context Pointers

`reference.html` is editable, dependency-free native HTML/CSS/SVG. It uses the baseline Amber tokens, Segoe UI, exact A Original path, existing panel/theme/eye SVG geometry and exact English/French welcome copy. `render.mjs` uses the repository's installed Playwright/Edge tooling to render six desktop/mobile/auth specimens. All requests are fulfilled from the reference string: no app server, external content or learner data is accessed. URL parameters `locale=en|fr`, `theme=light|dark` and `view=learning|auth` select specimens when opened with a local viewer.

## Constraints

Dashboard goal, dates/counts and editor/Activity samples are illustrative. The side-by-side lower samples are reference specimens, not proposed additions to the dashboard. Edit-plan and five-minute placements demonstrate a pattern composition; production control positions remain unchanged except approved Activity grouping and mobile authentication metrics. Reference buttons have no product actions. System-font rendering may vary on another host. Image origins identify native synthetic rendering rather than image generation. Preserve exact A geometry and product promise; formal design approval remains separate.

## Done When

From the repository root run `node docs/specs/capstone/designs/control-readability/render.mjs`. Inspect desktop-light/dark, mobile-light/dark and mobile-auth-light/dark PNGs together in one pass. `reference-results.json` records measured capture geometry; these measurements describe only the synthetic reference. Product acceptance and actual delivery results belong to [the verification record](../../increments/control-readability-verification.md).

### Actual application captures

`app-desktop-light.jpg`, `app-activity-light.jpg` and `app-circle-light.jpg` are actual browser MCP captures of the isolated4319 application with synthetic records at1440×1000. `app-mobile-dark.jpg` and `app-auth-mobile-dark.jpg` show French dark-mode states at320×800. Native capture returned JPEG bytes; the extensions reflect that format. These are viewport captures: content below the viewport remains outside the image. Native Chrome scrollbar space leaves1425/305CSSpx document width respectively; measured scroll width equals client width. The supporting welcome paragraph preserves the app's existing1.05rem mobile size (16.8px), slightly larger than the synthetic reference's1rem specimen.

The full-page browser screenshot API timed out; the supported native browser capture was used. An initial auth screenshot lagged behind the confirmed sign-out DOM and showed the old circle screen; it was replaced after the authentication screen settled and independently re-inspected. The retained auth image is the actual signed-out state. Screenshots are observation evidence, not AI-generated artwork, learner outcomes, full-page coverage or formal approval.

`app-header-fr-200.png` and `app-date-fr-200.png` are actual installed Edge/Playwright crops at320px with200% root text, on the same isolated4319 synthetic fixture. They confirm the enlarged language/brand/header and native date content after the skip-link correction; this is distinct from the five browser MCP captures. `native-field-results.json` preserves four100/200% measurements, including the unfocused skip link's final bottom0 at both scales, room for native arrows/calendar and reachable date preview. Horizontal containment is measured; negative vertical header bounds in some rows reflect main-focus scrolling, not an assertion that every header part fits vertically without scrolling. Product UI is French while browser native formatting is en-US; root-text enlargement is not browser zoom. The two cropped PNGs have embedded origin metadata and no private account credentials.
