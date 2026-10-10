# LittleFurther artwork reference

## Goal

Preserve the editable joined LF identity and its research/reference history. The user selected **A Original** on10October2026; the app integration is recorded in [littlefurther-integration.md](../../increments/littlefurther-integration.md). Overall formal design approval remains separate.

On10October the user requested two more designs for three total, then chose **A (Original)**. [options.png](options.png) is the retained comparison, [choices.png](choices.png) its focused side-by-side view, and [options.html](options.html) the editable browser reference. Equal display sizes, colours and wordmark supported the choice. At16px, A/C distinction is subtle; the large and29/32/64px specimens expose their different terminals/corners. The original assets remain unchanged; B/C are unused alternatives.

## Context Pointers

- `mark.svg` is the original editable master. ViewBox 32×32; L left and F right share a baseline. One 4-unit rounded path; no font, bitmap, link or script.
- `mark-b.svg` is Option B: the same rounded4-unit stroke vocabulary, with a rising baseline connection and shorter lower F stem.
- `mark-c.svg` is Option C: a compact filled construction with flat terminals, rounded outer corners and open letter spaces. It uses currentColor, with no font/bitmap/link/script. All three masters share the32×32 viewBox.
- `reference.html` is a self-contained browser reference with synthetic header layouts, live Segoe UI/system wordmark and 100/200% text specimens. It does not import or modify production code. Serve this directory locally so same-origin iframe height messages work.
- `reference.png` is its installed-Edge browser rendering. It is a design reference, not an application screenshot, interactive demo or human recognition study.
- The acceptance/research/actual-verification record is [littlefurther-brand.md](../../increments/littlefurther-brand.md).
- `app-desktop.png` and `app-mobile.png` are actual integration captures through browser MCP: signed-out EN/light desktop and FR/dark320px viewport. The latter includes a native scrollbar and only the upper account-creation fields. These are distinct from the synthetic boards; affected automated tests cover the remaining form and signed-in/enlarged states.

From the repository root with the existing Node runtime, run `node docs/specs/capstone/designs/littlefurther/preview.mjs`, then open `http://127.0.0.1:4320/options.html` for the three options, or `/` for the original reference. Stop with Ctrl+C. The optional viewer binds loopback only, serves ten allowlisted routes for nine design files and has no learner data or product API. No installation or build is needed. The PNG boards can also be viewed directly; their specimens were captured at declared widths. Other hosts may render the system-font fallback differently. The [options contract](../../increments/littlefurther-options.md) records its actual checks and independent review; reference controls are decorative, not product interactions.

## Constraints

Keep **LittleFurther** unchanged in both languages. Wordmark uses the existing system font at weight650; no font file is redistributed. The optional word break is between Little and Further, preserving the exact text. The promise remains in the welcome panel, outside the header.

The SVG uses `currentColor` with an ink default. Change its root colour or inline CSS for monochrome/reverse treatments: ink `#14263d` on white, amber `#f2b52d` on dark `#15232e`, white/black as needed. A separately loaded image cannot inherit page `currentColor`; the application uses a native inline SVG factory in `src/client/branding.ts`. It is decorative adjacent to the readable name; its standalone master title/description provide a label when viewed alone. The application identity is noninteractive and adds no focus target.

Sample sidebar/theme geometry reuses the existing Lucide icon vocabulary; its ISC attribution remains in [THIRD_PARTY_NOTICES.md](../../../../../THIRD_PARTY_NOTICES.md). All LF geometry is newly authored for this reference; independent originality or trademark clearance is not established. Original `reference.png`/`wordmark-preview.png` come from `reference.html`; comparison `options.png`/`choices.png` come from `options.html`. Both use the installed Segoe UI stack and browser capture, not image generation.

## Done When

The original reference-only increments preserved the running application. The subsequent A selection/integration changes its header identity and browser title; authentication/data remain unchanged. Consult the integration contract for checks, independent review, tracker/publication status and limits. Selection does not establish overall formal approval or measured learner recognition.
