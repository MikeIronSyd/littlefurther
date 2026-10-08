# Independent design assessment B — detector and browser evidence

Recorded 8 October 2026, Africa/Lagos. Method: isolated Assessment B subagent `/root/design_assessment_b`. Findings held from the parent until Assessment A finishes; no Assessment A output or prior critique findings were read.

## Goal

Assess the Amber learning workspace at source revision `0e3968f104f92ba0b2fe329156c494ad104f4568`, with `src/client/main.ts` as the stable target and `src/client` as the markup-containing scan scope. Preserve the accepted Amber direction, sidebar, themes and provisional top-left brand. This is evidence for critique synthesis, not an implementation or a formal design-phase completion.

The rendered core is readable across the sampled layouts and the mobile drawer behaved correctly in the tested keyboard sequence. Two accessibility issues need correction or an explicit scoped disposition: keyboard focus is lost after step reordering, and daily-rhythm accessible labels expose symbols without a localized study-status phrase. A misleading draft-validation message is a smaller, reproduced issue. The deterministic scan's 34 entries are all advisories, not 34 demonstrated interface defects.

## Context Pointers

Inputs inspected: repository `AGENTS.md`, `project-context.json`, `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, capstone AC11/AC11a–AC11f, the reuse contract and verification, and source `main.ts`, `shell.ts`, `journey.ts`, `plan-editor.ts`, `comeback.ts`, `circle.ts`, `ui.ts`, `i18n.ts` and `styles.css`. The relevant Impeccable `SKILL.md` and `reference/critique.md`, computer-use skill and the actual project `learning-journey-review` skill were invoked. Root's once-per-session context command was not rerun. There is no `planner.ts`; `plan-editor.ts` is the actual module.

### Deterministic scan

Executed once, from the project root:

```powershell
& 'C:\Users\USER\.codex\skills\impeccable\scripts\impeccable.cmd' detect --json src/client 1> '.local\design-review-b\detector.json' 2> '.local\design-review-b\detector.stderr.txt'
```

Observed exit **0**, empty stderr, valid JSON containing **34 findings**, all `severity: advisory`, `category: quality`, `advisory: true`. Although the playbook describes exit 2 for findings, this actual advisory-only invocation returned 0. The complete 22,044-byte JSON is retained locally; it was not truncated in storage. All findings are in **`src/client/styles.css`**, imported by `main.ts`. The target passed was a frontend directory, not CSS alone.

| Rule | Count | Exact lines and values |
| --- | ---: | --- |
| `design-system-font-size` | 28 | 148 `1.1rem`; 170 `1.2rem`; 425 `1.65rem`; 437 `0.95rem`; 491 `0.8rem`; 508 `1.95rem`; 567 `0.85rem`; 576 `1.2rem`; 602 `1.1rem`; 660 `1.05rem`; 668 `0.79rem`; 708 `1.25rem`; 758 `0.8rem`; 881 `0.85rem`; 1034 `1.15rem`; 1140 `1.15rem`; 1196 `1.15rem`; 1499 `2.6rem`; 1511 `1.65rem`; 1547 `1.2rem`; 1597 `2rem`; 1609 `1.55rem`; 1626 `1.65rem`; 1657 `1.15rem`; 1675 `2.25rem`; 1684 `1.05rem`; 1700 `0.79rem`; 1732 `0.8rem`. |
| `design-system-color` | 4 | 482 `#966300`; 654 `#9b6700`; 747 `#966300`; 1024 `rgb(3 12 23 / 55%)`. |
| `design-system-radius` | 2 | 261 `20px`; 373 `2px`. |

Interpretation and false-positive accounting:

- Sixteen font-size entries use sizes already described in the DESIGN narrative: `1.2`, `1.65`, `1.95`, `1.25`, `1.15`, `2.6`, `2`, `1.55`, `2.25rem`. The detector's structured typography ramp omits them. They are real structured-documentation discrepancies, but false positives if presented as undocumented design intent or visual defects. `DESIGN.md:171` describes the responsive sizes; its study-button description documents `1.2rem`.
- The remaining twelve font entries are smaller supporting/utility/section sizes outside that structured ramp. Inspecting them does not justify mechanically normalizing every value. The `0.79rem` path metadata and mobile step controls merit readability review, but this pass did not establish that they prevent operation.
- The `2px` navigation-marker radius is present in `.impeccable/design.json`'s Active navigation component CSS. It is another structured-scale omission, not evidence of an accidental new visual shape. The `20px` radius makes the intended theme-toggle pill.
- The color entries identify marker outlines/borders and the modal backdrop. Their roles are evident in source. They merit deliberate token/documentation alignment; no new color-related failure was observed. Do not replace the selected Amber palette merely to clear advisory output.
- The scan produced no non-advisory findings. Its result does not certify accessibility, translations, imperative TypeScript DOM construction, screen-reader usability or image fidelity.

The slug command `impeccable.cmd critique-storage slug src/client/main.ts` returned **`src-client-main-ts`**. `.impeccable/critique/ignore.md` was absent; no ignore entries were applied or created.

### Live application and browser provenance

Initial fresh IAB and Chrome attempts at the supplied `http://localhost:4317` returned `net::ERR_BLOCKED_BY_CLIENT`. The IAB attempt with a visibility option also reported `IAB visibility is not supported in a subagent thread`. These were setup limitations, not product failures. The README/server use the explicit loopback origin. Root supplied a separate review-only server at **`http://127.0.0.1:4329`**, backed by the empty `.local/design-review-b/data` directory, avoiding other sessions and learner records.

Assessment B created and used only its fresh Chrome tab **1791201683** at that origin. It created the synthetic learner `Design B learner`, a local eight-step curated plan, one ten-minute activity with a synthetic private reflection and one separately confirmed completion. No other tabs or learner data were edited, no invitations were issued and no shared message was sent. Root owns server execution session 47122 and its stop operation. The original server on 4317 was left running.

Observed browser asset references were **`/assets/index-CYQTTiCo.js`** and **`/assets/index-KJIeFt8i.css`**. Root's separately produced `.local/design-build-attestation.json` records a fresh pinned build comparison at the reviewed SHA with all 14 client/server artifacts byte-exact to current `dist`. This build execution is attributed to root, not claimed as an Assessment B build/test run.

### Browser checks actually performed

| AC / concern | Expected behavior | Evidence at reviewed build | Result / limitation |
| --- | --- | --- | --- |
| AC11, AC11e — representative reflow | Content and controls remain usable across desktop/mobile and both languages/themes. | Actual 1440×1000 desktop light EN expanded navigation; desktop dark FR collapsed navigation; 320×900 dark FR; 390×844 light EN; browser screenshots and DOM/AX observations. | **Verified pass within samples.** No horizontal overflow: observed document scroll width 1440 at width1440 light; 1425 at width1440 dark; 305 at width320; 375 at width390. Scrollbars account for the 15px difference. Not every route/combination or browser was covered. |
| AC11a — explicit choice | Theme/sidebar override survives reload; native scheme matches. | Light and dark controls visibly changed. Light root `color-scheme` was `light`. Final reload retained light theme and collapsed sidebar. | **Verified pass for explicit choice/reload sample.** Changing device preference, invalid values and native-control rendering across all states were not exhaustively tested. |
| AC11b — input retention | Theme, language and responsive changes retain entered study content. | Typed synthetic private reflection in English; switched dark, French and 390px; original exact reflection remained. It then saved successfully in French. | **Verified pass for this path.** Storage-failure injection and all dirty-state paths remain unverified here. |
| AC11c — desktop navigation | Sidebar collapses, keeps branding and named controls, with visible focus. | Enter on Collapse sidebar changed to Expand sidebar; DOM measured rail72px; French accessible name changed correctly; screenshot shows focus outline and persistent brand. | **Verified pass for collapse/name/visible-focus sample.** Rail hover labels and every keyboard route sequence were not retested. |
| AC11d — mobile modal | Open with focus inside; trap focus; Escape restores trigger; resize clears modal state. | At320px open drawer was256px wide. AX tree contained only Navigation, Close and three links. Shift+Tab from Fermer focused Activité; Tab from Activité focused Fermer. Escape closed and focused Ouvrir la navigation. Reopen then resize1440 closed the dialog, cleared body drawer class and focused desktop expand control. | **Verified pass for this sequence.** Background inaccessibility is observed through the modal AX tree and native modal behavior; no independent assistive-technology trial. |
| AC11 — editor keyboard use | Reorder preserves a logical keyboard position. | Enter on the first Move step down reversed the first two steps; immediate readback returned `activeTag: BODY`, `activeName: null`. Source replaces every draft row without restoring focus. | **Verified fail**, B01 below. |
| AC11 — localized accessible status | Daily activity has meaningful localized accessible labels. | EN/FR AX trees expose `2026-10-02: —`; after activity, `2026-10-08: ✓`. Source assigns raw ISO date + symbol. | **Verified fail for localized descriptive labels**, B02 below. Exact spoken output in a screen reader is unverified. |
| AC11 — draft error recovery | Validation identifies a visible, relevant correction. | Curated template selected, topics hidden, dates empty: Review draft steps produced “Add at least one topic and one valid available date before reviewing.” Dates alone recovered and produced eight steps. | **Verified fail for message accuracy**, B03 below. Data operation itself recovered. |
| AC11f — forced colors / reduced motion | Essential controls remain recognizable and operational. | Native tab-scoped CDP media emulation: both media queries true; theme knob transition `0s`; screenshot of circles entry in forced colors; Back to my learning operated while emulation was active. | **Verified pass within this sample.** Not a full forced-colors or screen-reader audit. |
| AC11f — contrast | Relevant foreground/background pairs remain readable. | Calculations using actual source tokens, corroborated by theme screenshots. See table below and local `contrast.json`. | **Verified pass for sampled text/control/focus pairs.** Not every composited, disabled, hover or native-control state. |
| AC06/AC11 — Comeback presentation | Preview distinguishes existing/proposed dates and preserves completed-work context. | At390px light EN: seven unfinished steps previewed two days later; completed row stayed displayed; two conflicts listed; Apply disabled until acknowledgement; Cancel returned with original next-step date. | **Verified pass for preview/cancel presentation.** Apply was not used; this does not repeat transactional acceptance. |
| AC07/AC11 — circles entry | Optional sharing explains audience/privacy and supports accessible forms. | Actual empty circles entry displayed labelled Create/Join forms, invitation disclosure and optional participation. Forced-color screenshot captured. Source inspected preview structure. | **Verified pass for entry sample; sharing preview and lifecycle unverified in this pass.** No messages sent. |
| AC11 — image-first provenance / overall completion | Mockup predates implementation; full agreed scope has evidence. | Current design authority was read; no new image/phase/receipt was generated. | **Unverified by this assessment.** Root's synthesis must retain separate provenance and formal workflow gates. |

Observed contrast ratios, using WCAG relative luminance `(Llighter + 0.05) / (Ldarker + 0.05)` with sRGB linearization:

| Pair | Light | Dark |
| --- | ---: | ---: |
| Ink / surface | 15.28:1 | 13.20:1 |
| Muted text / page | 6.19:1 | 10.09:1 |
| Amber-band text / band | 12.49:1 | 12.20:1 |
| Blue support text / surface | 11.08:1 | 11.09:1 |
| Completed marker foreground / green | 5.88:1 | 7.32:1 |
| Error text / error surface | 6.96:1 | 9.04:1 |
| Control border / surface | 3.52:1 | 5.38:1 |
| Focus outline / page | 6.41:1 | 9.85:1 |
| Focus outline / amber band | 5.91:1 | 7.66:1 |
| Focus outline / blue support | 5.99:1 | 7.61:1 |

Shared primary-button text/amber is9.93:1 and text/hover amber8.21:1. The neutral light progress dot/page ratio is2.93:1; progress already has a text equivalent and the numbered current path has additional status text. This narrowly low decorative ratio alone is not reported as an established WCAG failure. Marker-border/fill2.64:1 and action-border/fill2.43:1 likewise do not independently establish failure without considering the exterior background and complete control boundary.

### Browser visualization / overlay accounting

The returned Chrome documentation exposes a native **tab-scoped `cdp` capability**, so this assessment did not use custom CDP connections, external Playwright or an unsupported transport. Read-only `playwright.evaluate` was used only for observation. A documented native `Runtime.evaluate` preflight temporarily changed the title and appended an empty script element; it returned `{mutable:true,titleRestored:true}` after removing the element and restoring the title.

The bundled command `impeccable.cmd live-server --background` started a helper at port8400, PID22516. A native append of `http://localhost:8400/detect.js` created the tag; a bounded second load with explicit load/error listeners returned **`{loaded:false, reason:'script error event'}`**. No `impeccable` console messages were returned. The app's source CSP in `src/server/app.ts:117` permits only same-origin scripts; that policy is consistent with the failed cross-origin helper load, although the browser tool returned no specific CSP console message. No policy was weakened or bypassed.

**No reliable browser overlay was produced.** No `[Human]` overlay title/visibility claim is made. Further multi-page injection was skipped after the concrete script-load failure. Fallback evidence is the real CLI JSON, source interpretation, ordinary browser screenshots, AX/DOM readback and keyboard interaction. The failed script tag was removed before final reload; DOM readback confirmed `detectorTag:false`.

## Constraints

### Findings ordered by impact

1. **B01 — P2: Reordering drops keyboard focus.** AC11; `src/client/plan-editor.ts:152`, calls at187/201/213. Reproduced on the actual eight-step draft using Enter on Move step down. The first two steps changed correctly, but focus became BODY. Keyboard learners lose their place after a basic planning action. Preserve focus on the moved step's corresponding control, select a logical adjacent target after removal, and announce the new position. Verify Enter/Space plus the next Tab on move-up, move-down and removal. This is an observed accessibility defect, not a detector advisory.
2. **B02 — P2: Study-day accessible status is symbolic and unlocalized.** AC11; `src/client/journey.ts:84`. The actual AX labels are raw ISO dates followed by an em dash/check. These labels do not say whether activity was recorded and do not change with English/French UI. Use localized full-date/status labels such as “8 October, study recorded” and a neutral no-record equivalent; bind them to locale changes. Preserve the aggregate count and nonpunitive tone. Actual screen-reader pronunciation remains a follow-up check.
3. **B03 — P3: Curated-template validation asks for a hidden topic.** AC11; `src/client/plan-editor.ts:257`, `src/client/i18n.ts:316` and671. The error requests a topic even though selecting the curated template hides that field and supplies its actions. Use separate missing/invalid date and missing manual-topic messages, associated with the corresponding visible control. Dates alone already recover successfully; the defect is avoidable confusion.
4. **B04 — P3, documentation maintenance: Detector vocabulary does not match the documented implementation.** Thirty-four advisory entries include sixteen font values documented in prose and a navigation radius in sidecar component CSS. Align structured tokens with intentional sizes/roles during an authorized documentation task; independently judge the small supporting type before changing the interface. A clean detector is not the goal at the expense of the selected design.

Secondary observation: `styles.css:668` and1700 use `0.79rem` (12.64px at16px base) for path status/date and mobile reorder controls. The text has adequate sampled contrast, but it is visually small relative to the generous panels. Treat increasing essential metadata toward the existing hint size as a readability refinement, not a proven blocker.

No production source, tracker, global settings, commits, formal phases or receipts were changed. No unit/e2e suite was run by this assessment: this is a targeted manual browser/source/detector review. Device-theme changes, storage-failure injection, browser zoom, full keyboard route coverage, sharing preview/lifecycle, a native screen-reader session and native-French quality remain outside its actual evidence. Effective320px reflow was checked; do not relabel it as a real browser-zoom test.

### Local evidence and cleanup

Evidence retained in `.local/design-review-b/` (ignored local artifacts, not secrets for publication):

- Complete `detector.json`, empty `detector.stderr.txt`, `detector-exit.txt`.
- `contrast.json`, `final-dom.txt`, `browser-console.json` (empty returned array).
- `desktop-light-en.png`, `desktop-dark-fr-collapsed.png`, `mobile-320-dark-fr.png`, `mobile-320-drawer-fr.png`, `mobile-390-light-en-progress.png`, `mobile-390-light-en-comeback.png`, `desktop-forced-colors-circles.png`.

One full-page `Page.captureScreenshot` attempt timed out after5000ms. The native `getScreenshot` path then succeeded and supplied the seven saved viewport captures. Native media emulation was reset (`forced:false`, `reduced:false` readback), the explicit viewport override was reset, and the active assessment Chrome tab closed successfully. The failed initial browser tabs were not marked to persist; automatic ephemeral cleanup is tool-managed, not independently read back here.

The owned Impeccable helper PID22516 was verified as an Impeccable process, stopped, and port8400 had no listener afterward. No helper temp-body file was created. Detector/contrast/screenshots and the synthetic review data are deliberately retained as local evidence. Root reports stopping its review-only server4329 at20:33 Africa/Lagos and verifying no listener; it also verified4317 still running. Those server observations are attributed to root. Assessment B did not stop or modify the original4317 server.

## Done When

Assessment B has a usable complete detector result with rule counts/locations, independently obtained actual browser evidence, source interpretation, actionable issues and explicit limitations. Root explicitly confirmed Assessment A had finished and authorized release at20:35 Africa/Lagos, before these findings were returned. No approval request or product change was made. Questions skipped: this is the isolated evidence sub-assessment; user-facing synthesis and next-action questions belong to the parent critique.
