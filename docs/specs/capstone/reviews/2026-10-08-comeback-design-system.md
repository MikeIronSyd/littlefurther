# P06 Comeback — design-system comparison

8 October 2026, Africa/Lagos. General-agent substitution: an independent general agent applied the public Impeccable documenter contract because this harness has no named documenter agent type. The agent read `C:/Users/USER/.codex/skills/impeccable/reference/degraded/documenter.md` and `reference/document.md`, and ran the skill's context loader for `src/client/main.ts` once.

## Goal

Compare the final P06 extension with the incumbent Amber system after the independent [scoped visual verdict](2026-10-08-comeback-visual.md) of `ship`. Preserve the established system and record actual differences without turning an ordinary extension into a redesign or general drift repair.

**Result:** the extension introduces a schedule-comparison composition and its local responsive rules; it requires no new canonical palette, type, shape, motion or shared-control definitions. The normative DESIGN.md frontmatter and complete design.json sidecar are preserved. One DESIGN.md status paragraph now identifies P06 as implemented and P07 as forthcoming.

## Context Pointers

Directly read: [PRODUCT.md](../../../../PRODUCT.md), [DESIGN.md](../../../../DESIGN.md), [design.json](../../../../.impeccable/design.json), [surface brief and Comeback direction contract](../../../../.impeccable/surfaces/src-client-main-ts.md), [Comeback contract](../increments/comeback.md), [visual verdict](2026-10-08-comeback-visual.md), the parent specification's current scope, and project-context.json. The source comparison used [styles.css](../../../../src/client/styles.css), [comeback.ts](../../../../src/client/comeback.ts), [main.ts](../../../../src/client/main.ts), [journey.ts](../../../../src/client/journey.ts), and both Comeback language catalogues in [i18n.ts](../../../../src/client/i18n.ts).

The documenter opened all five supplied captures under `.impeccable/review/comeback/`: `comeback-desktop-light.png`, `comeback-desktop-dark.png`, `comeback-mobile-fr.png`, `comeback-mobile-fr-320.png`, and `preview-user-1280.png`. These show the two-row light/dark comparison, French narrow layouts, and the seven-row IAB example. The two tall mobile images were automatically reduced for tool display; original dimensions and the independent full-packet inspection are recorded in the visual verdict. No capture was generated in this pass.

Also read: `.impeccable/build/state.json` and the existing `.local/comeback-detect.json`. These are existing evidence, not newly executed checks.

## Constraints

This is an ordinary extension of the selected Operate surface. Amber, theme switching, sidebar behavior, provisional brand placement, local Segoe UI substitution and the original direction selection are settled. No source/style changes, new detector run, application tests, external writes or Git operations belong to this documentation pass. No canonical system regeneration or sidecar regeneration was performed.

### Source-to-system comparison

| Area | Observed final source and capture evidence | Comparison |
| --- | --- | --- |
| Palette | Proposed dates use `amber-band` / `amber-ink`; preview actions use `blue` / `blue-ink`; completed checks use `green`; borders, surfaces and hint text use existing semantic variables. The dark capture preserves the same roles. | All 38 light/dark hex-valued CSS custom properties match the corresponding DESIGN.md colors exactly. The other two of its 40 color entries, action ink and action border, match the existing primary-button literals. No new color token. |
| Type | Existing page heading and subtitle remain inherited. Comeback section titles are 1.35rem; date labels and completed-date hints are 0.91rem; row titles use the 1rem label size and weight 600; date values use tabular numerals. | The two new sizes flagged in the stored detector report are corrected in the inspected source to existing title/hint sizes. The local font stack is preserved, without claiming exact raster typography or adding a new brand typeface. |
| Controls and feedback | Native date input, neutral Preview, subtle Cancel, primary Apply, shared checkbox-field and notice/error/warning classes; existing disabled and focus treatments apply. The entry point remains in return support and opens inside the current learning route. | Reuses the existing control system and three-destination shell. EN/FR interface labels retain learner-supplied text and the `Africa/Lagos` identifier. Source semantics do not independently prove keyboard or save behavior. |
| Shape and spacing | Comparison list, retained work, date controls and preview footer use 12px panels; proposed dates use 6px corners; rows use quiet rules. Form/column/row gaps include the existing 20px/24px/18px values. | No new global radius or spacing scale. Smaller local padding/gap values are composition details, not additions to the canonical scale. |
| Layout | Desktop comparison and retained work use a 2.1:1 grid with a 230px minimum aside; the local comparison stacks at 1100px. At 799px the restart controls and rows stack, with full-width footer actions. | The 1100px rule is new and limited to this comparison. It does not replace the shell's documented breakpoints or require promotion into the shared sidecar. Both narrow French captures show visible labels and complete actions. |
| Depth, material and motion | Flat semantic surfaces, borders and outline SVG checks. The new CSS adds no shadow, transition, animation, downloaded font or raster. | Preserves the incumbent treatment. The existing account shadow and theme-knob motion remain the sidecar's definitions. |

### Preservation evidence

SHA-256 values were computed before and after the authorized prose correction. The frontmatter digest covers the exact UTF-8 text from the opening `---` through the closing `---`, retaining its line endings. Full-file digests use `Get-FileHash -Algorithm SHA256`.

| Artifact | Before | After |
| --- | --- | --- |
| DESIGN.md normative frontmatter | `C05405209E5973E20C4CA654C57590D8388CD3D07892F094E01B7EE649073023` | identical |
| `.impeccable/design.json` full file | `A1E3E6D92D823E75E55CD1CB926966E87DF2FFAB63C10AA462E7B54AA3EFBE7A` | identical |
| DESIGN.md full file | `D833D7817ED75D5AFCFEDC093266D5521F7CBA6DFD8E9E87E1A0053A38B750EA` | `E27BF2BFD80D7BA4AD36702BA8697B037236717C3A22E64C1177DB41E4F189E4` |

The full DESIGN.md change is limited to its Next action and support panels paragraph: implemented P06 status, future P07 status and a link to this report. Existing design rules, section order and tokens remain unchanged.

### Drift not repaired or canonized

The saved detector contains 34 advisory entries: 28 font-size, four color and two radius entries. Two belong to Comeback (old 1.4rem at line 1101 and 0.85rem at line 1143); the inspected final source now uses 1.35rem and 0.91rem respectively. The parent and visual verdict identify the other 32 as pre-existing. This pass inspected their stored classification and sampled incumbent styles; it did not independently compare a historical Git baseline or rerun the detector, and does not claim a clean detector result. No new token was added to legitimize an advisory.

Preserved older records still contain P06-future wording: the sidecar's Return support example and narrative prohibition, the opening P04/P05 surface-brief sections, and DESIGN.md's unchanged historical prohibition about fake forthcoming controls. The surface brief's appended Comeback contract and this report establish the current increment. Those older examples/status phrases are reported as documentation drift, not repaired outside the narrow authorized paragraph. The existing system-font substitution remains explicitly qualified; no additional font commitment is canonized.

## Done When

Completed for this pass: the supplied source, system files and five captures have been compared; the local extension rules and remaining drift are recorded; the normative frontmatter and sidecar hashes match; only this report and the narrow DESIGN.md status paragraph were written.

The formal Impeccable pipeline remains at open `plates`, with later phases pending. The root's [delivery closeout](../increments/comeback-verification.md#delivery-closeout), read during this pass, records an actual `impeccable build-phase finish --disposition ship` invocation that refused completion for plates/hero/sections/motion/responsive despite exit code 0. QUALITY BAR and hero/final comp-diff reports were not supplied. The independent `ship` disposition is scoped visual evidence, not formal pipeline completion or new human approval. This report supplies no new behavioral, full-accessibility, native-French, learner-benefit or adoption validation.

### Five-line system summary

- Palette: paired Amber action, green completion and blue support roles across light/dark surfaces.
- Type: existing local Segoe UI hierarchy, including 1.35rem titles, 1rem row labels and 0.91rem hints.
- Shapes: existing 6px control and 12px panel corners with quiet dividers.
- Layout: the persistent Operate shell contains a local responsive old/new date comparison.
- Named rule: the Paired Surface Rule keeps semantic foreground/background pairs together.
