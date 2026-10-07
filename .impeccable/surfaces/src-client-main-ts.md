---
version: 1
slug: "src-client-main-ts"
primary_target: "src/client/main.ts"
related_targets: ["DESIGN.md", "docs/specs/capstone/design.md", "src/client/styles.css", "src/client/journey.ts", "src/client/shell.ts"]
---

# Learning workspace surface brief

## Goal

Carry the user's selected Amber direction into the connected local learning experience, with light/dark switching, collapsible navigation and persistent provisional branding. Mode: Operate. P04/P05 implements the first private journey at src/client/main.ts; P06 schedule recovery and P07 private circles remain later increments.

## Context Pointers

PRODUCT.md, docs/specs/capstone/spec.md and docs/specs/capstone/increments/first-journey.md own product truth. DESIGN.md and .impeccable/design.json now document actual source tokens/components. docs/specs/capstone/verification.md owns application results; reviews/2026-10-07-first-journey-visual.md owns the independent bounded visual verdict.

Approved direction reference: .impeccable/mocks/decision/next-turn.png. Exact user selection: "I will go with Amber." Other direction proposals remain unselected. Expanded R01–R14 research closed at 20:14 Africa/Lagos on 7 October 2026; R15 quality-tooling research subsequently closed before production implementation. F15/F16 and AC11a–AC11f define the shell contract. S23 supports the panel icons.

Six detailed references in .impeccable/mocks/amber/ preserve exact prompts and static review: shell-light.png, shell-dark.png, comeback-preview.png, sharing-preview.png, mobile-fr-closed.png and mobile-fr-open.png. All remain approved:false; the original selected direction alone carries direct approval. This does not reopen selection or create another approval gate.

## Constraints

P04/P05 implements local account/profile, curated or manual reviewed plans, study logging, optional private reflection, explicit completion and retained history. All five capabilities remain committed. Comeback schedule recovery and invitation-only peer accountability remain P06/P07, with truthful forthcoming support copy. No runtime AI, chat, remote sync or outcome claims.

The interface uses semantic HTML/CSS/SVG and local Segoe UI. This system-font substitution is not exact raster lettering or a self-hosted font match. No raster ships. The brand slot remains outside the sidebar; no final name/logo exists.

Three ordinary navigation links organize the journey; topbar controls contain theme, language and account. Expanded desktop uses PanelLeftClose; collapsed desktop and the closed mobile trigger use PanelLeftOpen. Decorative SVGs have independently localized controls with aria-expanded/aria-controls. THIRD_PARTY_NOTICES.md retains attribution.

Expanded/collapsed navigation uses 240px/72px. Below 800px the closed-by-default native modal drawer is min(80vw, 350px), overlays the unchanged page, makes outside content inert and avoids duplicate active utilities. The source implements Close, contained keyboard focus, Escape/focus return and resize cleanup. Theme follows the device until explicitly chosen; guarded storage contains only non-sensitive theme/sidebar preferences. Learner records remain canonical in SQLite.

The final mobile correction moves existing DOM nodes into goal/introduction → next action → return support → progress/path → optional supports at the 799px breakpoint, retaining focus and restoring desktop order on widening. French uses one catalogue and preserves IANA identifiers such as Africa/Lagos. Learner text is not automatically translated.

The reference's 3/8 completion and three study days are synthetic examples; the app renders actual account state. The future Comeback preview retains its +3-day shift and target conflict; future sharing must identify exact audience/copy and private exclusions.

Quality-agent handoff confirms the final affected browser batch passed 6/6 at 21:42 Africa/Lagos and 19 distinct browser cases passed across batches; this documenter did not execute those tests. Root separately verified French Langue and mobile order through browser MCP. Current capture inspection and final independent verdict belong to the linked visual review. Source treatments and technical checks do not establish complete accessibility conformance, native-French quality, physical internet-disconnection validation or measured learner outcomes.

Formal Impeccable completion remains unavailable: measured spec 32 regions, zero raster plates and eleven measured text regions; comps skipped, plates open and later phases pending. An additional empty-asset acceptance receipt remains unresolved. Hero/final comp-diff reports, QUALITY BAR and detector findings are unavailable. Manual/source/browser evidence does not manufacture a finished pipeline or another user approval.

## Direction contract

THESIS: One conspicuous next action above a complete path and optional support, replacing five disconnected feature destinations.

OWN-WORLD: Neutral light working surfaces with charcoal humanist sans text and a dark equivalent; amber current-action band/buttons, green checked completion and blue return support inherited from the selected pixels.

STORY: The learner sees a goal, takes a manageable step, reviews privately and retains effort. Bounded peer sharing remains forthcoming.

FIRST VIEWPORT: Persistent provisional brand and panel toggle; three-link sidebar and topbar utilities. Desktop title, goal and actual progress precede a wide amber task band with study action at right, followed by path and support. Mobile uses the corrected action-first DOM order above.

FORM: User-selected wayfinding challenger "One clear next turn"; seed30b46385 assigned candidate7, but the user explicitly chose Amber. Original approved comp: 1536×1024.

FINISH: Preserve the actual review verdict, token-bearing DESIGN.md and truthful pipeline limitations. No shipping raster requires provenance; all reference images retain it.

## Done When

The selected direction and provenance remain intact; P04/P05 styling and responsive behavior are documented from actual source. Responsible agents record application checks and the final bounded visual verdict in their evidence files. P06/P07 and remaining full-journey acceptance remain open. No complete capstone, new human approval, learner benefit or universal compatibility pass is inferred.
