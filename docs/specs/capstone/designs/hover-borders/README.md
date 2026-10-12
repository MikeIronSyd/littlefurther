# Hover-border reference

## Goal

Show the approved quieter-border direction before frontend implementation. These are synthetic design references, not application captures, learner results or formal design approval.

## Context Pointers

`reference.html` is editable native HTML/CSS/SVG using the incumbent Amber tokens, Segoe UI/system stack and exact A Original monogram path (`M5 7V25H17V7H27M17 15H25`). The signed-in header follows the existing collapsed rail and narrow two-row placement. Desktop specimens are English at1280px; mobile specimens are French at320px, in both themes. Sidebar PanelLeftOpen, moon/sun, chevron and eye geometry comes from the existing icon vocabulary.

## Constraints

State samples use explicit illustrative hover/focus classes to display the proposed treatment simultaneously. The header rests normally. Controls have no app actions, accounts or learner records; the sample account name and password are synthetic. State columns and exception samples are a review board, not proposed dashboard sections. Sidebar borders are0 in every state; other affected controls reserve a transparent1px border and fade to light-mode ink or dark-mode Amber. Focus remains a separate immediate3px outline. Primary/path/field/password/link examples retain their distinct treatment. Native rendering may vary by host. PNGs contain embedded `ImageOrigin` metadata and no pixel resizing.

## Done When

Run `node docs/specs/capstone/designs/hover-borders/render.mjs` from the repository root. The installed Playwright/Edge renderer fulfills every network request from the reference string; no app server or remote resources are used. It saves four full-page PNGs and `reference-results.json`, measuring document overflow, header/state targets and a real reference-button hover/fade endpoint with unchanged geometry. These checks validate only the synthetic reference. Actual application behavior, research status, review and publication belong to the increment's specification and verification record.

## Actual application evidence

Eight `app-*.jpg` files are actual browserMCP native viewport captures of isolated4319 with the existing synthetic3-step/1-study/1-completion/1-empty-private-circle fixture. Root inspected all eight as one bounded batch. Desktop requests1280×900 return1265×864JPEG; mobile320×800 returns305×763JPEG. These are native bounds, not resized or full-page proof. Scrollbars/native capture omit some viewport edges and content below the image. Embedded ImageOrigin comments and `app-image-origins.json` preserve provenance without pixel changes.

The desktop samples show both themes at rest, theme hover and dark keyboard focus; mobile samples show French light/dark resting utilities and light circle disclosures. `app-visual-results.json` records actual brand/border matching in dark hover and keyboard focus, transparent mobile resting borders,44px header targets, wrapped disclosure heights and no sampled horizontal overflow. IAB's native rendering reports fractional computed border/outline widths (authored1px/3px); independent Edge tests check their own rendered values. Root's first light-hover read sampled the fade in progress at alpha0.624; the image is a hover capture, not an exact-frame timing measurement. A neighbouring account border can be fading after keyboard focus moves to the theme control. End-state/configuration acceptance belongs to the tests, not inferred from a single image.

Only theme/language/navigation presentation changed during this review; French/dark was restored, the temporary viewport reset and root's review tab closed. No session, plan, preference-form, invitation or shared-copy action was saved; ordinary4317 records were untouched. Circle invitations continue below the captured scroll position. Touch, enlarged text, reduced motion and forced colours are tested separately, not represented as physical-device or assistive-technology verification. Formal approval remains separate.
