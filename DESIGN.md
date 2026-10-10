---
name: Amber learning workspace
description: The implemented visual system for the local private learning journey.
colors:
  page: "#fbfcfd"
  surface: "#ffffff"
  sidebar: "#f6f8fa"
  ink: "#14263d"
  heading: "#111820"
  muted: "#4e6178"
  line: "#d9e1e9"
  control-line: "#7a8a9f"
  amber: "#f2b52d"
  amber-hover: "#e3a219"
  amber-band: "#fff2d0"
  amber-ink: "#392a0c"
  action-ink: "#17150f"
  action-border: "#a36c00"
  green: "#247246"
  green-ink: "#ffffff"
  blue: "#edf5ff"
  blue-ink: "#173758"
  focus: "#175dab"
  error: "#a02024"
  error-bg: "#fff0f0"
  neutral-dot: "#8a96a4"
  dark-page: "#0e1922"
  dark-surface: "#15232e"
  dark-sidebar: "#12212c"
  dark-ink: "#e2eaf4"
  dark-heading: "#f5f7fa"
  dark-muted: "#b4c5d8"
  dark-line: "#344859"
  dark-control-line: "#8298af"
  dark-amber-band: "#342c18"
  dark-amber-ink: "#fff0c6"
  dark-green: "#63c28b"
  dark-green-ink: "#10261a"
  dark-blue: "#192f43"
  dark-blue-ink: "#d6e9ff"
  dark-focus: "#91c5ff"
  dark-error: "#ffb5b7"
  dark-error-bg: "#391e26"
  dark-neutral-dot: "#8194a8"
typography:
  display:
    fontFamily: '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
    fontSize: "3rem"
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  headline:
    fontSize: "2.5rem"
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  title:
    fontSize: "1.35rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
  hint:
    fontSize: "0.91rem"
    lineHeight: 1.5
rounded:
  control: "6px"
  navigation: "8px"
  current-step: "10px"
  panel: "12px"
  circle: "50%"
spacing:
  field-gap: "6px"
  action-gap: "10px"
  support-gap: "14px"
  field-row-gap: "18px"
  form-gap: "20px"
  column-gap: "24px"
components:
  button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 18px"
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.action-ink}"
    rounded: "{rounded.control}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.amber-hover}"
  button-subtle:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 18px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
    width: "100%"
  navigation-active:
    backgroundColor: "{colors.amber-band}"
    textColor: "{colors.amber-ink}"
    rounded: "{rounded.navigation}"
    padding: "12px 20px"
  next-action:
    backgroundColor: "{colors.amber-band}"
    textColor: "{colors.amber-ink}"
    rounded: "{rounded.panel}"
    padding: "28px 34px"
  return-support:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.blue-ink}"
    rounded: "{rounded.panel}"
    padding: "20px 22px"
---

# Design System: Amber learning workspace

## Overview

**Creative North Star: "One clear next turn"**

The selected Amber direction puts a conspicuous next action beside evidence of retained effort. Neutral working surfaces, humanist text, connected step markers and restrained outline icons support an operating interface. The dark theme preserves the same hierarchy.

The initial P04/P05 scan was recorded on 7 October 2026 (Africa/Lagos). This 8 October refresh retains that visual system and records its P06 Comeback and P07 StudyCircle extensions, grounded in [styles.css](src/client/styles.css), [journey.ts](src/client/journey.ts), [comeback.ts](src/client/comeback.ts), [circle.ts](src/client/circle.ts), [shell.ts](src/client/shell.ts) and [ui.ts](src/client/ui.ts). [PRODUCT.md](PRODUCT.md) and the [specification](docs/specs/capstone/spec.md) own product behavior. The [selected reference](.impeccable/mocks/decision/next-turn.png) remains the direction authority; detailed state images remain unapproved elaborations. See the [design record](docs/specs/capstone/design.md) for provenance and formal workflow limits.

On 9 October 2026, the user selected **LittleFurther**, unchanged in English/French, and the joined LF concept. The [reference-only artwork](docs/specs/capstone/designs/littlefurther/README.md) retains Amber and the existing Segoe UI/system wordmark at weight 650, outside the sidebar. Final artwork selection, application integration and overall formal design approval remain pending. The running app still uses its provisional name and outlined-square mark; this reference does not replace the implemented visual system.

The 10 October [three-option comparison](docs/specs/capstone/designs/littlefurther/options.png), governed by the [options contract](docs/specs/capstone/increments/littlefurther-options.md), adds B (Stepped) and C (Solid) beside unchanged A (Original). These reference alternatives await artwork selection and leave the Amber tokens, system typography and implemented visual authority unchanged. App integration and overall formal design approval remain pending.

**Key Characteristics:**

- One dominant amber study action.
- Flat surfaces, quiet borders and connected progress markers.
- A persistent provisional brand and compact utility controls.
- Semantic HTML, CSS and SVG with no shipping raster or downloaded font.

## Colors

Amber identifies the current action, green identifies completed path steps, and blue groups return support and ordinary feedback.

### Primary

The amber, amber-hover, amber-band and amber-ink tokens distinguish an actionable button from its task band. Bright action amber is shared between themes; the band's foreground/background pair changes.

### Secondary

Green and green-ink pair on completed path markers. Progress-strip dots and studied-day markers instead use amber; these are distinct visual roles.

### Tertiary

Blue and blue-ink pair on return support and ordinary notices. Error and error-bg provide separate error feedback.

### Neutral

Page, surface and sidebar distinguish working area, controls/header and navigation. Heading, ink and muted carry text hierarchy. Line supplies quiet dividers; control-line gives controls a stronger boundary. Each dark-prefixed token replaces its default counterpart under `data-theme="dark"`; shared amber/action tokens stay unchanged.

**The Paired Surface Rule.** Switch semantic background and foreground pairs together. A theme change must preserve the meaning and readability of the state.

## Typography

Every role uses the local Segoe UI stack recorded above. This is a system-font substitution under the local-demo constraint, not exact raster lettering, a self-hosted font match or a newly chosen brand typeface.

Workspace display text reduces to 2.6rem at 800–1250px and 2rem below 800px. Authentication display text reduces from 3rem to 2.25rem on mobile. Task titles use 1.95rem on wide screens and 1.65rem at narrower widths. Goal titles use 1.65rem, reduced to 1.55rem on mobile; support titles use 1.25rem, reduced to 1.15rem.

Body paragraphs have a 72ch maximum width. Labels use weight 600; supporting copy uses muted ink. Numbered markers use tabular numerals. Learner text wraps without automatic translation.

## Layout

The desktop header has a 72px minimum height. The signed-in application grid reserves 240px for expanded navigation or 72px for the compact rail, reclaiming the remaining width. Signed-out sign-in/sign-up uses a full-width single column with no sidebar, navigation trigger or account menu. Branding stays outside the sidebar. The workspace is centered, at most 1600px wide, with 30px 28px 42px padding.

The wide workspace heading has three columns with ratios 1.3:1:0.75, a 210px progress minimum and 24px gaps. The next-action band combines a flexible text column with an action column of 345px flex basis. Below it, path/support columns use a 0.95:1.05 ratio and 24px gap. At 800–1250px the heading has two columns with progress below, and path/support stack.

Below 800px, the header wraps into brand/navigation and utility rows and the sidebar disappears. Workspace padding becomes 24px 16px 32px, with 12px horizontal padding below 360px. The native mobile drawer is `min(80vw, 350px)` wide and `100dvh` high.

The mobile journey uses actual DOM order: goal/introduction → next action → return support → progress → path and optional supports. Existing nodes move at the 799px breakpoint with focus retained; widening restores desktop composition. Forms collapse to one column; main forms have a 780px maximum width, settings 600px. Overview dots become a native progress element after twelve steps, beside the visible numeric summary.

## Elevation & Depth

Resting workspace surfaces are flat. Color changes and thin rules provide grouping. Only the account dropdown uses the theme-specific soft shadow recorded in the sidecar. The mobile drawer uses native modal layering and a translucent backdrop.

The9October theme action replaces the switch knob with a moon/sun icon button. No authored transition is required for it; existing reduced-motion rules remove nonessential transitions and animations.

## Shapes

Controls use the control radius; navigation is slightly rounder; content panels use the larger panel radius. Current path rows use the intermediate radius. Step and rhythm markers are circular, connected by rules. The provisional brand mark is a plain outlined square, not a finalized logo.

Icons are normally 24px square, panel toggles 29px and support icons 34px (27px on mobile). Decorative SVGs never replace independently named controls. Exact PanelLeftClose/PanelLeftOpen geometry and attribution are retained in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Components

### Buttons

Buttons have a 44px minimum height, control-line border and weight 600. Primary buttons pair amber/action-ink with the stronger action border and amber-hover. Neutral buttons use surface with sidebar hover. Subtle buttons have transparent borders until hover. Disabled buttons use opacity 0.55 and native disabled semantics.

The study button spans its action column, with 60px minimum height and 1.2rem text; mobile uses 52px and 1rem. A separate understated action opens a five-minute session. Logging activity and marking the whole step complete remain distinct actions.

### Inputs / Fields

Native labelled controls use the control radius, control-line border, surface background and 44px minimum height. Read-only controls use sidebar background; textareas resize vertically. Hints connect through `aria-describedby`; errors and saved/busy feedback use semantic alerts/status.

Focus-visible elements receive a 3px focus outline at 3px offset. Forced-color rules retain native adjustments and add explicit borders/outlines to essential controls and state markers. These treatments are implementation facts, not a complete accessibility-conformance claim.

### Navigation

Three ordinary links serve My learning, Journeys and Activity. Active navigation uses the amber band, weight 650 and a thin leading marker. Compact-rail labels appear on hover/focus while accessible names remain available. Topbar utilities contain language, theme and account.

PanelLeftClose means collapse expanded navigation; PanelLeftOpen means expand it or open the closed mobile drawer. The native modal has a named Close action, focus containment, Escape/focus return and resize cleanup. Theme follows the device until explicitly chosen; guarded storage saves only non-sensitive theme/sidebar preferences.

The9October sign-in refinement shows brand, language and theme while signed out; authentication restores the existing navigation/account and saved rail preference. The44px theme action shows a decorative Lucide moon in light mode and sun in dark, with a localized next-action name and hover/focus tooltip, dismissible with Escape. It has no aria-pressed or visible switch text. Session clear closes the modal/account state and clears the page lock before guarded auth-heading focus. The pre-code reference/provenance and AS01–AS06 are in [auth-shell.md](docs/specs/capstone/increments/auth-shell.md); actual results are separate from formal approval.

### Next action and support panels

The broad amber band owns the primary action: step position, task title, estimate/edit affordance and study button. Blue identifies return support; ordinary support panels use a thin neutral border, outline icon and brief copy. P06 extends return support with an explicit restart-date preview and confirmation. P07 uses the same blue treatment for the exact shared-copy preview and separately labelled private context; audience and privacy disclosures use neutral panels, while saved copies and circle settings use quiet dividers. Both extensions reuse the existing controls and paired theme tokens. See the [Comeback design-system comparison](docs/specs/capstone/reviews/2026-10-08-comeback-design-system.md) and [StudyCircle comparison](docs/specs/capstone/reviews/2026-10-08-circle-design-system.md) for scoped source and capture evidence.

### Path, rhythm and history

Ordered path rows combine visible status text with numbered or checked markers. Completed markers are green, current amber and upcoming neutral. The seven-date rhythm distinguishes recorded study days without punitive missed-day styling. Counts come from stored activity and completion, not reference-image samples. Reflection is private; self-reported completion does not prove mastery.

## Do's and Don'ts

### Do

- Do preserve one dominant amber study action and the connected ordered path.
- Do pair semantic foreground and background tokens when switching themes.
- Do keep the brand slot visible and use the directional panel icons.
- Do preserve mobile DOM order, native labels, visible focus and learner-entered text.
- Do keep completion, study activity and private reflection distinct.

### Don't

- Don't ship reference images as the working interface.
- Don't claim the local system font exactly matches the approved raster.
- Don't freeze synthetic sample counts into the product.
- Don't present a preview as saved or shared before the learner confirms it.
- Don't infer native-French quality, physical offline operation, accessibility conformance or learner benefit from these design records.
