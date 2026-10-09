# Focused sign-in shell and theme control — 9 October 2026

## Goal

Retain real local authentication for private learning records and circles, focus the signed-out entry screen, and replace the text/switch theme control with the user's selected moon/sun action button throughout the app. The user explicitly requested implementation of the settled plan. Baseline is `08231721b5c844fccb160292a7c7edcf286f8818`.

## Context Pointers

The main specification AC07/AC09/AC11, `src/client/shell.ts`, `main.ts`, `ui.ts`, `i18n.ts` and `styles.css` are the behavioral authority. The supplied screenshot shows signed-out navigation and the old switch. Existing Amber tokens, authentication fields/copy, placeholder branding, three-link signed-in navigation and EN/FR support are preserved. The [pre-code desktop/mobile reference](../../../../.impeccable/mocks/amber/auth-shell-reference.png) and adjacent provenance record were generated and inspected before production edits. It illustrates composition, not exact pixels, approval or working behavior; incidental generated softness/gradients are not adopted.

### Research checklist — R22

| Need | Status | Findings / evidence |
| --- | --- | --- |
| R22a — Session and shell visibility | Satisfied | `createShell` always mounts sidebar/drawer/nav trigger; `setUser` currently hides only account. `initialize` supplies authenticated MeResponse; `clearSession`/`showAuth` clear it. Gate navigation from the same session identity, retain collapse preference, and reclaim frame columns. Existing `:root [hidden]` has sufficient specificity against control display rules. No server/auth/schema change. |
| R22b — Focus and drawer lifetime | Satisfied | Main renders auth while sign-out's `root.inert` is true until finally. Defer auth heading focus with a current-view guard; drawer close-event focus must also check authenticated visibility. Clear body lock synchronously on session clear, close open modal without return to hidden trigger, close account details. Independent test agent confirmed real pending GET/revoked-session path can exercise401 while drawer is open. |
| R22c — Theme/icon/tooltip semantics | Satisfied | Existing guarded light/dark enum storage and device media query provide behavior to preserve. [W3C button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) supports changing action labels without aria-pressed. Official [moon SVG](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/moon.svg) and [sun SVG](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/sun.svg) fetched as source via PowerShell on9October; web reader rejected SVG MIME only. Vendor geometry alongside existing icons and ISC attribution, with no dependency. Tooltip uses localized next-action text, visible on pointer hover or keyboard focus, dismissible with Escape. |
| R22d — Layout and visual authority | Satisfied | Existing grid240/72px, header72px, mobile two-row header below800px and auth two-column/stack breakpoints inspected. Signed-out one-column frame needs precedence over collapsed grid; native hidden removes brand's toggle gap. Reference generated before code. Keep existing auth max1050px/gap70px and typography; no aesthetic redesign. |
| R22e — Verification and delivery | Satisfied | Independent test research inspected existing real-account/rate-limit fixtures, Edge single worker/4318 and theme usages in five files. Existing storage/device/drawer/forced-color coverage must remain strong. Focused tests can verify320px/session/input/tooltip requirements without changing server contracts. Required commands below; actual execution remains pending. Destinations and stable activity IDs verified from local context; live tracker uniqueness/readback required before writes. |

All five required needs are satisfied at14:07 Africa/Lagos on9October2026 before production edits. This closes only the agreed change's research gate. Formal design receipt/authenticated capture, native-French certification, complete accessibility, learner effects and final video remain separate open deliverables.

## Constraints

| ID | Acceptance criterion |
| --- | --- |
| AS01 | Signed-out sign-in/sign-up shows brand, language and theme; sidebar, trigger, drawer and account are hidden/unavailable. Main reclaims full frame width at desktop and320px, with no horizontal overflow or empty rail. Existing welcome/forms remain. |
| AS02 | Authentication restores existing navigation/account and saved desktop collapse preference with exact directional panel icons. Sign-out or401 clears any open drawer/body lock/account popover and focuses current auth heading after page unlock. Failed sign-out retains session/draft. |
| AS03 | Light mode shows decorative Lucide moon and localized “Switch to dark mode”; dark shows sun and “Switch to light mode”. French: “Passer en mode sombre” / “Passer en mode clair”. Native button has no aria-pressed, minimum44×44px and existing visible focus. |
| AS04 | Tooltip displays the same current localized action on hover/focus, remains while hovered/focused, dismisses with Escape and does not intercept input. Theme changes retain focus on control; locale changes update connected labels without rebuilding forms. |
| AS05 | Device preference remains followed until explicit override; valid stored override survives reload, invalid/blocked storage falls back safely. Auth email/password and learner form input persist across theme/locale changes. |
| AS06 | Required checks, independent review, bounded paired desktop/mobile browser MCP review and truthful local/tracker/publication evidence are recorded. Separate formal design approval is never fabricated. |

### Architecture / quality contract and ordered plan

1. Complete R22 and reference before production edits (done). Root owns production/spec/design/evidence; independent agent owns E2E edits. Retain exact pins, schema, auth APIs and module boundaries.
2. Shell owns signed-in boolean and visibility; `setUser(null)` synchronously closes modal/clears lock without changing saved collapse. Frame class controls signed-out columns. `main.ts` owns guarded auth-heading focus after rendering/unlock. No guest path or demo shortcut.
3. Existing icon helper adds only upstream moon/sun geometry; i18n supplies action labels. Theme paint updates root dataset, decorative SVG and action name/tooltip in place. Hover/focus tooltip state stays local to shell; Escape dismisses it. Remove obsolete track/knob rules and retain forced-color/reduced-motion safeguards.
4. Run `pnpm --pm-on-fail=download run check`, `run lint`, `run format:check`, `run build`, `test`, `run verify:process`, focused `exec playwright test tests/e2e/auth-shell.spec.ts tests/e2e/shell.spec.ts`, one full `run test:e2e`, and `run audit`. Preserve actual failures and corrections; do not weaken checks.
5. Independent source/AC review using learning-journey-review; one batched actual browser MCP desktop-light EN/mobile-dark FR check, then at most one confirmation after a demonstrated fix. Run detector once, contextualize advisories. Update design-system behavior notes and verification.
6. Reconcile E014 against live trackers, preserving histories/statuses/dates. Invoke capstone-evidence-update, normal authorized Git publication to both private destinations, verify both heads. GitHub MCP unavailable at discovery; record fallback accurately if still unavailable. No global recovery work.

No migration is required. Rollback restores prior source/build and retains unchanged database. Use isolated synthetic test data; preserve normal demo data and keep local demo available.

## Done When

AS01–AS06 have actual verification and no scoped blocking review finding; both correct trackers have saved readback and both private remote heads match intended publication. Describe any unverified destination separately. No human design approval, educational benefit, production readiness or completed video follows from this change.

## Requested notice deletion — 9 October2026 (R23)

### Goal

Remove exactly the local account/demo paragraph from sign-in/sign-up and the global local-demo footer, including French equivalents, as explicitly requested by the user.

### Context Pointers

Baseline 3f0440ff6c52ed323d680ce6e9c6a67679ea0579. Existing pre-code visual reference and actual final-entry capture establish Amber/form composition; this is explicit copy deletion within that reference, with no new visual concept. Source/independent research confirms one localAccount renderer in main.ts, one localDemo footer in shell.ts, both EN/FR keys and four exclusive style blocks. Shared hints, fields, theme/native navigation and live-status nodes are independent. No tests address these notices. Operations documentation retains actual server/email/recovery limitations.

### Constraints

R23a renderer/catalogue coupling, R23b exclusive versus shared styling and R23c proportional verification are all satisfied by source inspection and independent learning-journey-review research before code. No factual unknown or unanswered decision remains. NR01: neither notice nor its empty scaffold appears in either language. NR02: welcome/form labels, theme and navigation remain usable at desktop/320px. Remove only rendered nodes, orphaned EN/FR keys and exclusive CSS. This does not add email recovery or server-stopped operation. Existing reference guides this tiny correction; no additional approval or image-concept gate.

Plan: delete the two renderers/keys/exclusive styles; run check/lint/format/build and the two existing AS01 desktop/mobile sign-in/sign-up cases; observe actual EN desktop/FR mobile once, then record outcomes/publish and reconcile concise E015 evidence. No new tests or full63-case rerun is warranted for static copy deletion. Preserve all operational truth and historical verification/approval boundaries.

### Done When

NR01-NR02 have source, existing appearance-case and actual browser evidence; scoped independent review has no blocker; current build is available, intended source published to both private repositories, and concise E015 saved record readback is separate and accurate.
