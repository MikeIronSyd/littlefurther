# LittleFurther A — app integration, 10 October 2026

## Goal

Apply the user's selected A artwork and LittleFurther name to the app's persistent header/browser title. Direct user selection: **“'A' is okay”**,10October2026. Integration follows the prior selected-artwork workflow; overall formal design approval remains separate. Baseline `99f8ebb8de412c14a7d6e0f030fe9a0343895602`.

## Context Pointers

Original A master `designs/littlefurther/mark.svg`/SHA256B43A8CEAF5BBE4EB16A3686C2BBA4BC0DC0EF5A03B57402700B06687C9932838; selected preimplementation image `reference.png` includes light/dark,1440/320 and enlarged headers. Prior32reference/96option checks remain reference evidence, not app passes. Existing app files shell.ts/styles.css/i18n.ts/index.html and auth-shell/shell/password-control tests govern real behavior. Amber/system650/nameunchangedENFR and welcome promise retained.

### R28 — research gate satisfied before production changes

| Need | Finding / source | Status |
| --- | --- | --- |
| Choice/scope/reference | Direct A selection settles artwork; previous integration-follows-selection plan supplies scope. Retain all selected system/controls; no new discovery/approval gate. A's reviewed PNG/HTML precede integration. | Satisfied |
| Renderer/module/locale coupling | createShell constructs a noninteractive brand div with square span and locale-bound appName. i18n.setLocale resets browser title to learning; index fallback title My learning. Existing DOM SVG icon pattern creates trusted static namespace nodes. A dependency-free branding module can export name/createBrand, with no import back into i18n/ui or cyclic dependency. | Satisfied |
| Responsive/theme coupling | Current.brand is nowrap; group minwidth0/mobile100%, trigger64px/mark29px. New brand must shrink/wrap at Little/Further, retain padding/gap/type and fixed32/29mark; dark mark uses existing amber while wordmark stays ink. CSScurrentColor supplies theme without event/state changes. | Satisfied |
| Verification/runtime/delivery | Independent lf_brand_tests inspected existing AS01/AS02 and found affected shell placeholder assertions; existing tests already exercise both authforms/locales/enlargement/theme/nav/storage/real session expiry. Localoperations/index.ts confirm loopback4317/default.local/data; E2E4318/.local/e2e-data isolated. Preserve existing data, no destructive reset. Required commands below proportional to UI-only scope. | Satisfied |

All required research for this bounded integration is documented and satisfied before production edits. No changed stack/dependency/interface or unresolved consequential question. Grill-me/grilling reuses settled choices; no repeated preference question. Impeccable established Amber authority/reference retained.

## Constraints

| ID | Acceptance / quality contract |
| --- | --- |
| BI01 | Exact A geometry `M5 7V25H17V7H27M17 15H25`,32viewBox/4roundedcurrentColor. Decorative aria-hidden/focusable=false adjacent to complete readable LittleFurther. Preserve noninteractive brand; no extra focus target, badge, font or control. |
| BI02 | Same name in EN/FR and browser title, shared name constant; initial HTML title LittleFurther. Wordmark existing Segoe UI/system650; only optional break at Little/Further. Mark32desktop/29mobile, ink/light and Amber/dark; no clipped full name/overlap at1440/320/100–200% root text/signed-in/out. |
| BI03 | Theme/locale/form input/focus/sidebar saved preference/account/dialog/session lifecycle remains unchanged. Correct panel icons distinct from LF. Signedout still has no sidebar/account/gutter; real sign-in restores controls; signout/expiry safe. Existing welcome/password reveal unchanged. |
| BI04 | Required pinned static/build checks and affected browser suites, bounded paired visual review, independent skill review, current documentation and E020/A010 saved evidence; normal source evidence/exact heads. No overall formal approval/learner outcome claim. |

Architecture: `src/client/branding.ts` exports immutable APP_NAME and a native DOM factory. i18n imports name only; shell imports factory; branding imports neither, keeping dependency direction acyclic. Trusted SVG namespace/path literals, no rawHTML/fetch/assets/fonts/data/API changes. CSS adds name reflow/markcolour only. index title and two catalogue placeholders use selected identity; navigation/learning translations unchanged. No favicon, package rename, authentication/data/server/API/schema/dependency or hosting change.

Plan: implement module/shell/catalogue/title/styles; update existingAS01/AS02 brand assertions and two shell placeholders without weakening lifecycle/fixture tests; execute checks; observe live desktop/mobile in one batch and correct at most once; independent review + documentary reconciliation; publish actual artifact, compare E020/A010 saved trackers, close out delivery. User A choice is artwork selection, not whole-design approval.

## Done When

Pinned commands: `pnpm --pm-on-fail=download run check`, `lint`, `format:check`, `build`; `pnpm --pm-on-fail=download exec playwright test tests/e2e/auth-shell.spec.ts tests/e2e/shell.spec.ts tests/e2e/password-control.spec.ts`; `git diff --check`. No backend/unit/process/audit/fullbrowser rerun required for dependency-free header identity/layout change. Do not claim them as new passes. The maintained build/static gates and all affected shell/auth/password cases must pass.

Run current built app on documented4317/default existing data, observing without exposing private learning records; use isolated synthetic visual data if signed-in capture is needed. Record actual visual/Codex/MCP/skill/check/results/limits and publish to this private repository with verified heads. Document missing/failed checks accurately; formal design/video/outcome gates stay separate.

### Verification and delivery

A is selected and integrated. BI01–BI03 and the check/review subparts of BI04 are verified; source publication and saved tracker readbacks are recorded below as they occur. Overall formal design approval remains separate. [Independent review](../reviews/2026-10-10-littlefurther-integration.md) includes the corrected mobile-capture addendum.

| AC | Actual verification | Result / boundary |
| --- | --- | --- |
| BI01 | Native factory exact A master path/32viewBox/4-unit rounded inherited paint; decorative SVG/noninteractive name; affected helper computed styles, name and geometry | Verified pass; no learner-recognition study |
| BI02 | AS01 at1440/320 across both authforms,EN/FR,light/dark,100/200%roottext; AS02 adds signed-in320 combinations. Exact title/name/system650/32-29mark/word-boundary/control containment checks | Verified pass; root-font enlargement is not browser zoom |
| BI03 | Existing real auth/signout401/sidebar persistence/session-expiry drawer cleanup, keyboard/tooltips/theme/storage/formfocus/password-reveal cases preserved | Verified pass within17affected cases; no new fullsuite/backend/CI result inferred |
| BI04 checks | Pinned `check`, `lint`43files, `format:check`48files, `build` and affected Playwright command above, all exit0; final17/17 in1.7minutes. Build15modules604ms; CSS25.45kB/gzip6,JS91.91kB/gzip29.61 | Verified pass for bounded contract |
| BI04 visual/review | Root one batched desktop/mobile inspection plus one mobile capture correction; actual browser MCP, independent source/pixel review and addendum. Desktop EN/light; mobile FR/dark320×900 viewport with visible theme focus; complete A/name and fitting visible controls | Scoped pass; mobile lowerform outsideviewport. DOMinner320/client-scroll305 means native scrollbar, no horizontaloverflow. No product edit needed for export correction |
| BI04 records/delivery | Current spec, AGENTS, product/design/surface/README/context aligned; R28 and actual skill/command/capture evidence retained. Exact source evidence and saved E020/A010 readbacks recorded below | Verified pass for scoped delivery; final documentation closeout published separately |

Initial browser batch:14passed/3failed in1.7minutes, all caused by helper assertions expecting inherited SVG attributes on the path. The fixture was corrected to computed path paint/width/rounding; exact geometry, semantics, colour, layout and lifecycle assertions remain. Final complete affected batch17passed, exit0. Static checks repeated after test correction; production source remained unchanged after the successful build. Initial failures are not hidden or reclassified as passes.

Initial mobile export visibly cropped right content and showed the focused skip link over the heading. A stale accessibility-target scroll attempt failed without input changes. Fresh readonly DOM plus one supported native viewport capture resolved the evidence defect. Root and independent reviewer inspected replacement: no right clipping/overlay in displayed content; lower controls remain outside viewport and are covered by tests. Temporary viewport reset. Capture APIs return native raster bytes; embedded origin explicitly distinguishes actual product captures from preimplementation synthetic references.

One Impeccable detector run on branding.ts/shell.ts/i18n.ts/styles.css/index.html exited0 with31advisories, all in unchanged styles.css declarations:26font-size,4colour,1radius. Diff inspection confirms no finding on new brand rules. No ignores/suppressions, overlay injection or live overlay server. Both new origins embedded; supported `embed-prompt --scan` finds6rasters/0missing. Unsupported discovery-help/scan commands produced no check evidence; the supported scan succeeded. Root did not rerun context or enter an open-ended polish cycle.

Independent learning-journey-review actually inspected source, tests, final last-run receipt and both pixel captures; it did not execute commands or personally operate a learner session. Documentation work was delegated separately, preserving9October reference and10October comparison as dated history. Reviewer/tracker agents initially hit an account usage limit, resumed after user's continue, and supplied actual results; no success is inferred from interrupted turns.

J1: actual R28/specification, image-first A reference, native SVG implementation, meaningful tests, independent reusable-skill review, evidence skill and browser MCP. This increment uses Default mode, not a claimed plan-mode invocation. J2: concrete retained learner promise and readable entry identity; no measured motivation/retention/recognition effect. J3: editable original master, small acyclic shared factory, maintained setup/documentation; no new fresh-checkout or human-adoption result. J4: branded working entry supports the planned video opening; timed3–5minute final video remains pending.

No dependency/auth/server/API/schema/data change. Original A SVG/reference/options assets remain unchanged. Normal4317 server preserves existing learner data;4319 visualserver uses separate.local/lf-brand-visual-data, and4318 E2E uses isolated testdata. No database reset/deletion or recovery-repository project upload. Missing GitHub MCP read tools are recorded separately from available normal Git/installed CLI readback; push alone never implies provider CI.

Source evidence: `39e8ee2bc33418db083bf36ce99bba6cc98667bf`. The source reference is retained. Recorded source inspection covered 21 intended files/paths. This is CLI readback, not GitHub MCP or hosted-CI evidence. `.local/lf-brand-publication.json` retains head receipt; working tree was clean after artifact commit. The normal4317 loopback listener and browserMCP signed-out LittleFurther/title were observed. Isolated4319 visualserver was stopped and temporary viewport reset; normalserver stays running for the user.

capstone-evidence-update and computer-use were actually reused for E020/A010; saved receipt13:46:56Africa/Lagos. CorrectMivaOwner `m.alkali5130@miva.edu.ng`, Restricted and Saved to Drive verified. All5Sheet tabs compare exactly10changesA21:J21, zero mismatches/extra and oneE020. Reloaded fullA01091,473characters equals6,643newprefix plus the entire exact84,830priorhistory; title/InProgress/NoDate and all10boardtasks/A007 unchanged. Root independently read the compact receipt and asserted those counts/flags. No pending tracker writes. One actual mutation each; initial Sheet preparation explicitly sent no input before the successful paste, no ambiguous retry. Unsupported readonly selection inspection changed no data. Proof images were inspected by the tracker agent. See [tracker closeout](../reviews/2026-10-10-littlefurther-integration-tracker.md).

BI01–BI04 are complete within this integration/check/review/source/tracker scope. Overall formal design approval, actual timed video, broader accessibility/native-French validation and measured learner outcomes remain separate; no additional user approval gate is invented for the completed increment.
