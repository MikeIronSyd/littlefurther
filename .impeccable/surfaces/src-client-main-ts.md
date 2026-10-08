---
version: 1
slug: "src-client-main-ts"
primary_target: "src/client/main.ts"
related_targets: ["DESIGN.md", "docs/specs/capstone/design.md", "src/client/styles.css", "src/client/journey.ts", "src/client/shell.ts"]
---

# Learning workspace surface brief

## Goal

Carry the user's selected Amber direction into the connected local learning experience, with light/dark switching, collapsible navigation and persistent provisional branding. Mode: Operate. P04/P05 provides the private journey at src/client/main.ts; P06 Comeback schedule recovery and P07 private circles are implemented and verified within their recorded scopes. P08 complete-journey review and its P09 integration corrections passed final corrected-source checks and independent scoped review; delivery evidence belongs to the integration verification record.

## Context Pointers

PRODUCT.md and docs/specs/capstone/spec.md own product truth, with increments/first-journey.md, comeback.md and studycircle.md under docs/specs/capstone/. The corresponding verification records own observed results. DESIGN.md and .impeccable/design.json document the actual visual system, including the bounded 8 October wording/example refresh with normative tokens preserved. docs/specs/capstone/increments/integration.md governs P08/P09; R18 closed for its bounded correction/refresh scope at 17:36 Africa/Lagos. The existing independent visual reports remain scoped to their respective increments, not a finished full-capstone verdict.

Approved direction reference: .impeccable/mocks/decision/next-turn.png. Exact user selection: "I will go with Amber." Other direction proposals remain unselected. Expanded R01–R14 research closed at 20:14 Africa/Lagos on 7 October 2026; R15 quality-tooling research subsequently closed before production implementation. F15/F16 and AC11a–AC11f define the shell contract. S23 supports the panel icons.

Six detailed references in .impeccable/mocks/amber/ preserve exact prompts and static review: shell-light.png, shell-dark.png, comeback-preview.png, sharing-preview.png, mobile-fr-closed.png and mobile-fr-open.png. All remain approved:false; the original selected direction alone carries direct approval. This does not reopen selection or create another approval gate.

## Constraints

P04/P05 implements local account/profile, curated or manual reviewed plans, study logging, optional private reflection, explicit completion and retained history. P06 adds deliberate schedule recovery without rewriting earlier work. P07 adds invitation-only local circles, exact-copy/audience preview, explicit sharing, preset encouragement and lifecycle cleanup. These five connected capabilities use real local account data. No runtime AI, chat, remote-peer demonstration or outcome claims.

The interface uses semantic HTML/CSS/SVG and local Segoe UI. This system-font substitution is not exact raster lettering or a self-hosted font match. No raster ships. The brand slot remains outside the sidebar; no final name/logo exists.

Three ordinary navigation links organize the journey; topbar controls contain theme, language and account. Expanded desktop uses PanelLeftClose; collapsed desktop and the closed mobile trigger use PanelLeftOpen. Decorative SVGs have independently localized controls with aria-expanded/aria-controls. THIRD_PARTY_NOTICES.md retains attribution.

Expanded/collapsed navigation uses 240px/72px. Below 800px the closed-by-default native modal drawer is min(80vw, 350px), overlays the unchanged page, makes outside content inert and avoids duplicate active utilities. The source implements Close, contained keyboard focus, Escape/focus return and resize cleanup. Theme follows the device until explicitly chosen; guarded storage contains only non-sensitive theme/sidebar preferences. Learner records remain canonical in SQLite.

The final mobile correction moves existing DOM nodes into goal/introduction → next action → return support → progress/path → optional supports at the 799px breakpoint, retaining focus and restoring desktop order on widening. French uses one catalogue and preserves IANA identifiers such as Africa/Lagos. Learner text is not automatically translated.

The reference's 3/8 completion, three study days and +3-day Comeback scenario are synthetic examples; the app renders each account's actual saved state. Comeback previews current unfinished dates and conflicts before confirmation. Circle sharing identifies the exact copy, current/future audience and private exclusions before confirmation.

Historical P04/P05 evidence includes the final affected browser batch of 6/6 at 21:42 Africa/Lagos on 7 October and 19 distinct cases across batches. P07 subsequently records 56 domain/HTTP and 36 browser passes, the real two-account MCP walkthrough and a scoped six-capture visual ship verdict in docs/specs/capstone/increments/studycircle-verification.md. These are prior results. R18c records root's synthetic connected-journey walkthrough, including EN/FR, dark mode and 320px preservation. Final P08/P09 evidence records 56 domain/HTTP and 48 full browser passes, including 12 focused integration cases; independent corrected-source review has no remaining scoped blocker. The valid replacement visual packet received a scoped ship verdict, with initial capture cropping and automated-fixture attribution retained. Root reconciled these final results after the design documenter's refresh. No complete accessibility conformance, native-French quality, physical internet-disconnection validation or measured learner outcome follows from the design record.

Formal Impeccable completion remains unresolved: measured spec 32 regions, zero raster plates and eleven measured text regions; comps skipped, plates open and later phases pending. The generated review packet has six plan items plus 26 code-region entries. A genuine plan/inventory review receipt is still required despite zero raster assets; this is not an empty review. Hero/final comp-diff reports and QUALITY BAR remain unavailable, and authenticated assembled-page capture feasibility is unresolved. The saved P07 detector result exists with 34 advisories; it is not a clean-detector pass. See docs/specs/capstone/reviews/2026-10-08-integration-design-research.md. Manual/source/browser evidence does not manufacture a finished pipeline or user approval.

## Direction contract

THESIS: One conspicuous next action above a complete path and optional support, replacing five disconnected feature destinations.

OWN-WORLD: Neutral light working surfaces with charcoal humanist sans text and a dark equivalent; amber current-action band/buttons, green checked completion and blue return support inherited from the selected pixels.

STORY: The learner sees a goal, takes a manageable step, reviews privately and retains effort; after an interruption they can review revised dates, then optionally share a deliberate copy with their private circle.

FIRST VIEWPORT: Persistent provisional brand and panel toggle; three-link sidebar and topbar utilities. Desktop title, goal and actual progress precede a wide amber task band with study action at right, followed by path and support. Mobile uses the corrected action-first DOM order above.

FORM: User-selected wayfinding challenger "One clear next turn"; seed30b46385 assigned candidate7, but the user explicitly chose Amber. Original approved comp: 1536×1024.

FINISH: Preserve the actual review verdict, token-bearing DESIGN.md and truthful pipeline limitations. No shipping raster requires provenance; all reference images retain it.

## Done When

The selected direction and provenance remain intact; P04–P07 source, scoped behavior and visual evidence are documented. P08/P09 is complete only when the integration contract's correction, checks, independent review and evidence reconciliation are recorded. Formal design phases and remaining capstone acceptance stay distinct and open. No complete capstone, new human approval, learner benefit or universal compatibility pass is inferred.

## Comeback extension direction contract — 8 October 2026

THESIS: A restart makes the next manageable action explicit while preserving earlier effort. Extend the current learning workspace without a new navigation destination.

OWN-WORLD: Inherit Amber, paired light/dark semantic tokens, Segoe UI, standard controls and quiet dividers. Preserve the existing sidebar icons and top-left brand slot.

STORY: Choose a restart date, compare each unfinished old/new date, understand unchanged completed work and conflicts, then cancel or deliberately apply. Study and completion remain separate.

FIRST VIEWPORT: Existing shell surrounds a focused form: title/goal, editable restart date and Preview action, followed by the ordered date comparison and retained-work summary. Desktop aligns date columns;320px stacks them with explicit labels. Conflict acknowledgement precedes confirmation.

FORM: Local extension of the established Operate surface. Existing `.impeccable/mocks/amber/comeback-preview.png` is the pre-implementation reference; no concept seed or replacement identity applies. Its detailed-state approval remains false and is not fabricated. Interaction is explicit preview → confirmation with preserved history, not decorative motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Contract: docs/specs/capstone/increments/comeback.md. Existing formal Impeccable phase limitations remain distinct from scoped implementation and manual evidence; no receipt is forced.

## StudyCircle extension direction contract — 8 October 2026

### Goal

THESIS: Voluntary accountability uses one deliberately approved copy while private learning remains private. Extend My learning with circles and an explicit preview, without adding a fourth destination.

### Context Pointers

OWN-WORLD: Preserve Amber, paired semantic light/dark colors, local Segoe UI, the existing divided-panel sidebar icons, top-left brand slot, native forms and quiet dividers. The pre-code sharing reference is `.impeccable/mocks/amber/sharing-preview.png`; it remains an unapproved detailed-state elaboration of the user's selected direction. `docs/specs/capstone/increments/studycircle.md` owns SC01–SC07 and the pre-code research evidence.

### Constraints

STORY: Create or join an optional local circle, compose a commitment/check-in, inspect its exact copy, audience and private exclusions, then explicitly share. Other real local accounts may add preset encouragement. Membership and own-copy controls disclose cleanup before confirmation.

FIRST VIEWPORT: Retain the shell around a focused circle view. Desktop preview places the composer and exact copy beside audience/privacy context. Mobile stacks these in DOM order before the final share action. Current/future-member access is explicit; learner-entered text is preserved across language/theme switching.

FORM: A bounded extension of the existing Operate surface, not a replacement visual identity or new concept round. No raster ships. The original formal comp pipeline remains open at plates; no user approval, hero/final diff or receipt is fabricated.

### Done When

FINISH: Review actual desktop light/dark, French320px and current1280px captures plus the real two-account saved result. Record the independent verdict, mechanical detector and ordinary design-system comparison, preserving DESIGN.md and its sidecar. A scoped verdict does not close the inherited formal pipeline or prove accessibility conformance or learner impact.
