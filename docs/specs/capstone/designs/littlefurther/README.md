# LittleFurther artwork reference

## Goal

Review the selected joined LF concept before applying branding to the app. The name and concept are user-selected; these finished assets await artwork selection. Overall formal design approval remains separate.

On10October the user requested two more designs for three total. [options.png](options.png) is the complete comparison, [choices.png](choices.png) its focused side-by-side view, and [options.html](options.html) the editable browser reference. Choose **A (Original)**, **B (Stepped)** or **C (Solid)**. Equal display sizes, colours and wordmark support a fair comparison. At16px, A/C distinction is subtle; the large and29/32/64px specimens expose their different terminals/corners. The original assets remain unchanged.

## Context Pointers

- `mark.svg` is the original editable master. ViewBox 32×32; L left and F right share a baseline. One 4-unit rounded path; no font, bitmap, link or script.
- `mark-b.svg` is Option B: the same rounded4-unit stroke vocabulary, with a rising baseline connection and shorter lower F stem.
- `mark-c.svg` is Option C: a compact filled construction with flat terminals, rounded outer corners and open letter spaces. It uses currentColor, with no font/bitmap/link/script. All three masters share the32×32 viewBox.
- `reference.html` is a self-contained browser reference with synthetic header layouts, live Segoe UI/system wordmark and 100/200% text specimens. It does not import or modify production code. Serve this directory locally so same-origin iframe height messages work.
- `reference.png` is its installed-Edge browser rendering. It is a design reference, not an application screenshot, interactive demo or human recognition study.
- The acceptance/research/actual-verification record is [littlefurther-brand.md](../../increments/littlefurther-brand.md).

From the repository root with the existing Node runtime, run `node docs/specs/capstone/designs/littlefurther/preview.mjs`, then open `http://127.0.0.1:4320/options.html` for the three options, or `/` for the original reference. Stop with Ctrl+C. The optional viewer binds loopback only, serves ten allowlisted routes for nine design files and has no learner data or product API. No installation or build is needed. The PNG boards can also be viewed directly; their specimens were captured at declared widths. Other hosts may render the system-font fallback differently. The [options contract](../../increments/littlefurther-options.md) records its actual checks and independent review; reference controls are decorative, not product interactions.

## Constraints

Keep **LittleFurther** unchanged in both languages. Wordmark uses the existing system font at weight650; no font file is redistributed. The optional word break is between Little and Further, preserving the exact text. The promise remains in the welcome panel, outside the header.

The SVG uses `currentColor` with an ink default. Change its root colour or inline CSS for monochrome/reverse treatments: ink `#14263d` on white, amber `#f2b52d` on dark `#15232e`, white/black as needed. A separately loaded image cannot inherit page `currentColor`; inline the SVG or explicitly change the file colour for a future integration. Mark it decorative when adjacent to the readable name; its standalone title/description provide a label when viewed alone. Do not make this noninteractive reference mark look like a clickable home control.

Sample sidebar/theme geometry reuses the existing Lucide icon vocabulary; its ISC attribution remains in [THIRD_PARTY_NOTICES.md](../../../../../THIRD_PARTY_NOTICES.md). All LF geometry is newly authored for this reference; independent originality or trademark clearance is not established. Original `reference.png`/`wordmark-preview.png` come from `reference.html`; comparison `options.png`/`choices.png` come from `options.html`. Both use the installed Segoe UI stack and browser capture, not image generation.

## Done When

Inspect the board and mark at16/29/32/64px, then select or revise the artwork. App integration is a separate increment. The running app, its authentication, data, browser title and provisional brand remain unchanged by this reference.
