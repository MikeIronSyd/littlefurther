# Brand-colour interaction borders — 12 October 2026

## Goal

Implement the user's approved hover-border plan over `1b1698b3cd7b1ec091f854dfedbc70ae70fc03cc`. All secondary action buttons and language/theme/account controls retain soft backgrounds but lose visible resting borders. The sidebar toggle becomes borderless. This explicitly supersedes the affected CR01/CR02 permanent-outline requirements; primary actions, path controls and fields remain unchanged.

## Context Pointers

`src/client/styles.css` owns the presentation; existing native DOM controls/callbacks require no change. `.button:not(.primary)` includes default/subtle/small actions across editors, study, Journeys, Comeback and circles. `.circle-management summary` is a secondary disclosure and receives the same treatment. Header controls are `.language-select`, `.theme-button`, `.account-summary`; `.nav-trigger` is a separate exception. Existing underlined `.text-button`, `.menu-action`, `.password-reveal`, `.path-action`, fields, decorative identity and structural dividers are excluded.

### R33 research ledger

| Need | Findings and evidence | Status |
| --- | --- | --- |
| Authority/scope | Explicit all-secondary choice, then complete approved plan. Sidebar borderless; actual logo colour by theme; no controls/behavior/API change. Grill-me/grilling frontier empty. Earlier CR records retained as dated history. | Satisfied |
| Selectors/cascade/geometry | Current styles and read-only independent inventory confirm selectors above. Class specificity beats later generic select; mobile `.utilities .language-select` dimensions remain. Transparent1px border preserves secondary dimensions. Sidebar border0 retains44px box,29px icon and existing margins. Account native open state must not independently pin the border. | Satisfied |
| Brand/contrast | Native mark uses light `--ink` #14263d, dark `--amber` #f2b52d. Source-token ratios against existing page/surface/sidebar/Amber-band/blue are light13.725–15.280:1, dark7.471–9.674:1. These calculations are not rendered/conformance evidence. Shared private CSS token can encode this existing brand role without SVG/geometry changes. | Satisfied |
| Input/motion/accessibility | Primary [W3C non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) explains that visible text/icons can identify borderless controls and focus still needs contrast; [focus guidance](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html), [MDN hover](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/hover) and [reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) inspected in planning. Accessibility and motion companion checklists applied. Border-color animation is bounded to small controls, no layout/JS loops. Fine-pointer hover gate, press/focus alternatives, system-colour exception and disabled exclusion are specified below. | Satisfied |
| Tests/runtime/delivery | Current control-readability assertions require opaque idle borders and must change only for superseded controls. Paths retain their existing helper assertions. Existing shell/auth/password/drawer/privacy/lifetime suites remain applicable. Isolated4318 test data; separate actual visual fixture4319; ordinary4317 records untouched. Required verify pipeline and dual-private/trackers authorization verified locally. | Satisfied |
| Image-first reference | [Four synthetic native boards](../designs/hover-borders/README.md) rendered exit0 and root inspected all four before frontend edits:1280×900 desktop light/dark EN,320×1970 fullpage mobile light/dark FR. Geometry checks show44px targets/no overflow/no border-state shift. State columns are illustrative reference evidence, not app sections or behavior passes. | Satisfied |

All six research needs are satisfied and documented before production edits. Reference gate closed after root's four-image inspection. Reopen any consequential unknown; don't infer outcomes, full accessibility or formal approval.

R33 reopened after the first focused verification:7cases passed and the synthesized-touch case observed `:active` false immediately after its CDP touchStart. At that point the cause required investigation (browser input activation versus product styling); no source repair was inferred from that failure. Touch acceptance remained open until the input path and observed timing were verified, while other source/pixel checks continued independently.

R33 touch research reclosed before the dependent test correction. The bounded ignored Edge320 probe verifies hover/fine-pointer false, correct theme hit target and visual scale1. Holding touchStart through600ms leaves `:active` false; touchEnd emits trusted native compatibility mousedown/mouseup with `:active` true, exact brand border and transition0s, then the native click toggles theme and the active state clears. Correct verification observes the actual browser activation event, retains all brand/no-delay assertions and polls release/no-sticky border; no app listener or source repair is needed. Native CSS press feedback is immediate when the browser exposes `:active`, not a promise that every touch engine exposes it on initial finger contact. This is synthesized Edge evidence, not physical-device validation.

## Constraints

| ID | Acceptance and quality contract |
| --- | --- |
| HB01 | Secondary `.button:not(.primary)`, circle-management summaries and header language/theme/account retain soft fill/radius/padding with reserved1px transparent border at rest. Use shared existing-brand colour, ink light/Amber dark, for interaction border. Account open alone does not pin it. All affected screens use the same role. |
| HB02 | Sidebar toggle border0 in resting/hover/press/focus/forced colours; transparent resting fill and soft sidebar fill on supported hover or press. Preserve44×44 target,29px panel icon, occupied header slot and direction/labels/drawer/session contracts. Keyboard focus remains visibly outlined. |
| HB03 | Hover only under `(hover: hover) and (pointer: fine)`;150ms ease-out border-color fade in/out, reserving geometry. Enabled press and `:focus-visible` reveal brand border immediately; existing3px focus outline appears immediately. Leaving hover returns transparent unless pressed or keyboard-focused. Disabled actions retain opacity/native behavior and never acquire interaction emphasis. No global `transition: all`, JS animation, layout animation or persistent layers. |
| HB04 | Touch works without hover and has no sticky cosmetic border after release when keyboard focus is absent. Reduced motion disables fades. Forced colours retain system ButtonText borders for affected secondary/header/disclosure controls in all states; sidebar remains border0 with Highlight keyboard outline. Preserve system-adjusted control content. |
| HB05 | Primary Amber buttons, path resting outlines/current highlight/static completed rows, fields, password reveal, contained menu rows, underlined links and structural dividers retain current behavior/style/contrast. No copy, auth, dependency, font, API/schema or learner-data changes. EN/FR,320px and200% root-text keep contained controls and44px targets. |
| HB06 | Precode research/reference closure, meaningful state/geometry tests, full required verify and bounded desktop/mobile actual review, independent learning-journey-review, evidence skill and exact both-tracker saved readbacks; normal dual-private publication and head checks. Formal approval, learner outcomes and video remain separate. |

Production architecture remains CSS-only. A private `--brand-accent` token maps to existing ink/Amber and is shared by the mark and interaction borders; no public type/interface changes. Exclude primary buttons from new transition/interaction selectors. Keep keyboard/press feedback immediate. Forced-colour overrides must beat ordinary interaction selectors without `!important`; reduced-motion overrides must beat transition specificity. Retain normal user data and use isolated fixtures for checks.

### Implementation sequence

1. Render/inspect four synthetic reference boards, document R33 closure before source edits.
2. Implement scoped CSS/token/forced-colour/reduced-motion rules; align DESIGN's active control contract while retaining historical records.
3. Split affected tests into borderless-sidebar, transparent-rest interaction and unchanged persistent-path assertions; add fade/press/touch/disabled/open-menu/geometry cases.
4. Run focused checks, then `pnpm --pm-on-fail=download run verify`; investigate failures without suppressing checks. Batch actual light/dark desktop/mobile states, with at most one consolidated correction/confirmation. Independent acceptance review.
5. Record results and evidence; publish intended non-secret artifact normally to both private repos and verify exact heads; update both trackers/readback; publish separate documentation closeout if needed.

## Done When

HB01–HB06 have actual results in the verification record. Tests wait for fade completion by state polling and verify transition configuration, rather than assuming an exact frame timing. Contrast/target tests cover content/focus/interaction cues instead of falsely requiring transparent resting borders to meet opaque-border contrast. Required command: `pnpm --pm-on-fail=download run verify`; also `git diff --check` and proportional local documentation/JSON/link checks. Research/reference closure alone establishes no source or tracker pass.

HB01–HB06 implementation/technical acceptance and implementation delivery are complete within the recorded scope: required pipeline exit0 with56domain/server and90browser passes, separate-process persistence, static/build/audit checks, no-blocker independent review, exact E025 saved readbacks and verified dual-private implementation publication. Verification records the separate documentation closeout; formal human approval is not inferred.
