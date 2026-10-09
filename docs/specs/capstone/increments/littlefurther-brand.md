# LittleFurther brand reference — 9 October 2026

## Goal

Develop the user's selected LittleFurther name and joined LF concept into editable artwork and a reviewable reference before application integration. Baseline: `a8b4fa76b0adaf506eed4bd565cb2aa7906dde35`. This increment changes design artifacts and records only; the running application retains its provisional branding.

## Context Pointers

The user selected a warm, meaningful name, accepted **LittleFurther** unchanged in English/French, then selected the joined LF concept and explicitly requested this reference increment. Retain Amber, existing Segoe UI/system typography, the brand position outside the sidebar and the exact welcome promise: “Keep learning, even when life interrupts.” The French welcome remains unchanged. Sources: `src/client/shell.ts`, `styles.css`, `i18n.ts`, `index.html`, PRODUCT.md and DESIGN.md. Source inspection found a 32px desktop/29px mobile square mark, nonwrapping brand text and a 64px mobile navigation trigger. The longer name therefore needs reference-level reflow evidence before integration.

### R26 research gate — satisfied before artwork

| Need | Verified finding / evidence | Status |
| --- | --- | --- |
| Name, concept and scope | Explicit user selections and approved four-field plan above; final artwork is not yet selected. No outstanding consequential preference for this reference. | Satisfied |
| Existing-use screen | Bounded exact/spaced-name web searches, including education/company/software, GitHub and Apple/Google store restrictions, found no obvious exact learning-product brand. Ordinary marketing phrase uses appear under [Tally](https://tally-tracker.app/), [SCAMPR](https://scampr.co.uk/) and [Waymora](https://toluvo.com/app/trips?preview=1). This is indexed-search evidence, not exhaustive store search, legal clearance, domain or handle availability. | Satisfied for preliminary screen only |
| Domain status | Read-only registry checks on 9 October at 20:47 Africa/Lagos: [Verisign .com RDAP](https://rdap.verisign.com/com/v1/domain/littlefurther.com) returned a domain object for LITTLEFURTHER.COM; [Google .app RDAP](https://pubapi.registry.google/rdap/domain/littlefurther.app) returned HTTP 404. The .com is registered; .app registrar availability is unconfirmed. No registration or purchase. Domains are not required by the local-demo delivery. | Satisfied within stated scope |
| Incumbent geometry and symbols | Source inspection confirms current brand/header sizes, fixed sidebar trigger, shared locale name placeholders and existing proper panel icons. Reference must keep name readable at 320px/200% by wrapping at the Little/Further boundary; no abbreviated replacement. | Satisfied |
| Feasible native artifact/check route | Node v24.19.0, Playwright 1.63.0, installed Edge and local Segoe UI regular/semibold files confirmed. Native SVG and self-contained HTML can render without downloads or dependencies. Browser MCP can inspect the isolated reference; PNG is a browser-rendered reference, not an app screenshot. | Satisfied |

All required research for this bounded reference is satisfied before creating artwork. No claim of trademark clearance, measured recognition or learning effectiveness follows. Reopen research if a consequential new unknown arises.

## Constraints

| ID | Acceptance criterion |
| --- | --- |
| LF01 | Original authored editable 32×32 SVG geometry: L left, F right, connected baseline, open spaces and consistent softly rounded strokes. No external font, image, script, embedded link or dependency in the SVG. Include light/dark and monochrome treatments in the reference. |
| LF02 | Exact visible LittleFurther wordmark in existing system semibold, unchanged EN/FR. Use existing ink/Amber palette; keep the tagline outside the header. Complete name remains visible, with an optional break only between Little and Further. |
| LF03 | Reference includes desktop and actual 320 CSS-pixel signed-out/signed-in header layouts, light/dark, EN/FR and 100/200% root-text enlargement. Keep standard panel geometry distinct from LF. Demonstrate 16, 29, 32 and 64px mark sizes and monochrome. |
| LF04 | Explicit reference-only labelling. No application source, API/schema/authentication, package/dependency, font, hosting or domain change. Name/concept selection is distinct from finished-artwork and overall formal design approval. |
| LF05 | Independent skill-based review, actual static/contrast/reflow and visual evidence, saved tracker comparisons and normal dual-private publication with exact heads. Missing results remain pending. |

### Quality contract and plan

1. Create master `../designs/littlefurther/mark.svg`, isolated `reference.html` and a short reuse/provenance README. Use one geometry for all colour/size variants; keep wordmark as live text rather than embedding a licensed font. A native Node optional viewer binds127.0.0.1 only, exposes five fixed GET/HEAD routes for four design files, and returns400/404/405 for malformed/unknown/unsupported requests. It is separate from the product server.
2. Generate the PNG reference board from installed Edge. A static, labelled iframe isolates each header viewport from the board layout; these are synthetic layout references with decorative sample controls, not authenticated application sessions.
3. Use an ignored local Playwright verifier (`node .local/littlefurther-reference-check.mjs`) to validate SVG allowlist/geometry, no external requests, exact name/text, 32 header combinations (2 widths × 2 themes × 2 locales × 2 text sizes × 2 authentication-layout states), no overflow/clipping, visible name and reference controls. Compute contrast for actual foreground/background pairs; independently inspect the size specimens.
4. Inspect one batched board/mobile set through browser MCP and local image viewing; fix any material findings in one batch and confirm at most once. Run Impeccable detector once on the new HTML reference; report advisories at their actual scope. Independent learning-journey-review assesses LF01–LF05 and records its own limits.
5. Update current product/design/context notes with the selected name and artwork-pending boundary, retaining historical approval evidence. Use capstone-evidence-update for E018/A010 after verified artifact publication. Publish intended non-secret reference/documents with normal Git, verify both private heads and available GitHub MCP readback, then close out actual tracker results.

## Done When

Editable master, inspectable board PNG/HTML and provenance/reuse guidance exist; LF01–LF04 checks and independent review are recorded; LF05 tracker/publication results have saved readbacks. Present artwork for the user's selection. No application behavior checks or production build passes are inferred from reference tests; production code is unchanged, so backend/authentication/full-app suites are outside this increment.

### Verification and delivery

Artwork and reference are complete, independently reviewed and ready for selection. Production source remains unchanged. [Independent review](../reviews/2026-10-09-littlefurther-brand.md) records scope, findings and corrected viewer handling.

| Criterion | Actual check/evidence | Result / boundary |
| --- | --- | --- |
| LF01 | `node .local/littlefurther-reference-check.mjs`: SVG XML allowlist, exact32×32 path/4-unit rounded currentColor stroke, no external resources,16/29/32/64px sizes | Pass; newly authored geometry, not trademark clearance or measured recognition |
| LF02/LF03 | Same ignored verifier in installed Edge at20:58:46 Africa/Lagos:32 combinations (1440/320 × light/dark × EN/FR ×100/200% root text × signed-in/out layout) |32/32 pass; exact LittleFurther, no horizontal overflow/clipping, controls contained, correct panel/account reference counts, no header tagline.200% is root-font enlargement, not browser zoom |
| LF03 contrast | Computed sRGB contrast from actual palette: ink/white15.28:1; light wordmark/dark13.2:1; Amber/dark8.71:1; black/white21:1; support text/page6.19:1 | All targeted text/mark thresholds pass; no comprehensive accessibility claim |
| LF03 visual | One batched local board/mobile inspection plus browser-MCP reference read/capture.12 iframe widths equal1440/320; selected French/dark signed-in200% frame has client/scroll width320, root font32px and complete name | Scoped pass; synthetic design controls are decorative, not real authentication/navigation. No correction round needed |
| LF04 | No production `src`, index, dependencies, schema, API or auth changes. Asset labels and current product/design/spec/context notes preserve reference status | Pass; application suites/build are outside this reference-only contract, not new passes |
| LF05 review | Actual independent learning-journey-review + Impeccable invocation and source/visual verdict; two optional-viewer findings corrected and confirmed | No remaining artwork/source blocker; user decisions separate |

The reference verifier exited0 in3.22seconds, with zero page errors/external requests and no board overflow. Board capture1600×2078; specimens are isolated actual CSS widths. Source board/HTML, editable SVG and Wordmark preview are reusable artifacts. PNGs were captured in installed Edge, not generated images; Impeccable provenance embedding succeeded for both rasters and its scan found2rasters/0missing metadata. One detector run on `reference.html` exited0 with `[]` (no findings). No repeated polishing pass was performed.

Browser-MCP initially could not read iframe contentWindow through its sanitized DOM API. The documented frameLocator route then returned the actual width/font/name checks; this was a tool-access limitation, not a layout failure. Its capture was visually inspected and viewport reset after review.

Optional viewer checks: `node --check docs/specs/capstone/designs/littlefurther/preview.mjs` passed. Initial project Biome invocation processed0files because its explicit scope excludes docs; this was not a pass. An ignored isolated config retained the same formatter/linter rules without changing project configuration. Its first check found import ordering; corrected ordering and final `pnpm --pm-on-fail=download exec biome check --config-path=.local/littlefurther-style.json docs/specs/capstone/designs/littlefurther/preview.mjs` passed1file/0findings. `node .local/littlefurther-preview-check.mjs` passed at22:45:20 Africa/Lagos: five GET/HEAD routes/exact bodies/no-store, unknown404, POST405, malformed-target400 and viewer survival. `Get-NetTCPConnection` confirmed loopback127.0.0.1:4320. The former reference-server session was no longer available after resumption; no process was killed by guessed identity. Delivered viewer now serves the reference.

J1: actual source/name research, pre-integration SVG/HTML creation, independent reusable-skill review, Impeccable document reconciliation, browser-MCP reference observations and capstone-evidence-update reuse. This increment ran in Default mode; no plan-mode use is claimed. J2: retained specific learner promise without motivation/retention outcome measurements. J3: editable native assets, documented local viewer and actual viewer checks; not a fresh-checkout run or human adoption. J4: consistent identity supports the planned walkthrough opening; the timed final video remains pending.

Local `git diff --check` and context JSON parsing passed. GitHub MCP tools are absent in this resumed tool set; plugin discovery reports GitHub available but not installed. A suggestion does not establish connection; authorized CLI fallback is recorded separately. No provider-CI pass is inferred. User artwork selection and application integration are separate next actions.

Artifact `a3f77e53b12424e7eb3a768787b68b1b89bc75bd` was published with normal `git push origin main`. Exact separate account/MikeIronSyd main heads matched at22:47:42 Africa/Lagos; both repository privacy flags were read back as true. Installed GitHub CLI commit metadata and all16 changed paths matched both repositories at22:48:54. Initially `gh` was absent from PATH; resolving the physical installed runtime's `bin/gh.exe` enabled successful readback. No provider statuses/workflows were checked or CI success claimed. Receipts: `.local/littlefurther-publication.json`, `.local/littlefurther-provider-cli.json`, `.local/littlefurther-repository-privacy.json`.

capstone-evidence-update and computer-use were actually reused for E018/A010, with verified saved receipt at22:51:52 Africa/Lagos. Correct `m.alkali5130@miva.edu.ng` owner, one person/Restricted and Saved to Drive were checked. All five Sheet tabs compared: exactly10intended/actual changes at `Codex evidence!A19:J19`, zero mismatches/extra changes and one E018. Kaneo persisted after reload:78,375characters equal the5,035-character new block plus the entire exact73,340-character prior history. Current block uses the existing newest-first convention; old suffix is preserved without newline normalization or full-history rewrite. One E018, title/In Progress/No date unchanged; the entire ten-task board matches baseline, including A007 (1To Do/5In Progress/0Review/4Done). Proof images were inspected. No tracker write remains pending.

One successful mutation occurred per destination. Initial indexed Sheet shortcut prep timed out and explicitly sent no input; a fresh focused state and one paste succeeded. There was no ambiguous-write retry or duplicate. Local finalizer initially lacked Python tzdata; using the confirmed Lagos UTC+1 offset avoided installing anything and successful receipt generation followed. Earlier read-only tracker agent became unavailable before writes; its replacement reverified the live account, five-tab baseline and full task/board before the bounded update. Receipt `.local/littlefurther-tracker-final-receipt.json` links exact cell/full-string/board comparisons and proof images. This documentation closeout changes delivery records only; normal commit/push and exact final-head verification follow.

LF01–LF05 are complete for this reference/delivery scope. Finished-artwork selection, app integration and overall formal design approval remain separate, as do human recognition/learning outcomes and the final timed demo.
