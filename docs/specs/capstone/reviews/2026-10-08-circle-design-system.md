# P07 StudyCircle — design-system comparison

8 October 2026, Africa/Lagos. Substitution: a fresh general subagent applied the public Impeccable documenter role because this harness does not expose a named documenter agent type. It read `C:/Users/USER/.codex/skills/impeccable/SKILL.md`, `reference/document.md` and `reference/degraded/documenter.md`. The session context loader and detector were not rerun.

## Goal

Compare the finished P07 extension with the incumbent Amber system after the independent [scoped visual verdict](2026-10-08-circle-visual.md) of `ship`. Preserve the existing design system and document actual extension details without creating a new visual identity or repairing unrelated drift.

**Result:** StudyCircle inherits the incumbent palette, shared controls, panel shapes and heading hierarchy. Its composer, exact-copy preview, audience/privacy sidebar and shared-update rows are local compositions. No consequential design-system mismatch was found in the inspected source and six supplied captures. No new token-bearing DESIGN.md or sidecar rewrite is required. Both files remain byte-for-byte unchanged in this pass.

## Context Pointers

Read the project `AGENTS.md`, `project-context.json`, [PRODUCT.md](../../../../PRODUCT.md), [DESIGN.md](../../../../DESIGN.md), [design.json](../../../../.impeccable/design.json), final [StudyCircle direction contract](../../../../.impeccable/surfaces/src-client-main-ts.md), [P07 specification](../increments/studycircle.md), relevant F08–F10/F13 and AC07–AC09/AC11 requirements in the [parent specification](../spec.md), the [current verification record](../verification.md), and the prior [P06 design-system comparison](2026-10-08-comeback-design-system.md).

Source inspection covered the new block in [styles.css](../../../../src/client/styles.css), the rendered components and control reuse in [circle.ts](../../../../src/client/circle.ts), integration in [main.ts](../../../../src/client/main.ts) and [journey.ts](../../../../src/client/journey.ts), both Circle language catalogues in [i18n.ts](../../../../src/client/i18n.ts), the helpers in [ui.ts](../../../../src/client/ui.ts), and the shell's route/theme/navigation definitions in [shell.ts](../../../../src/client/shell.ts). A read-only `git diff -- src/client/styles.css` against the parent baseline `e519d10f0391f8acd06c7d57aad5caf59df58dbf` showed one 240-line insertion, at current lines 1042–1281; the existing theme and shared-control declarations were unchanged. The supplied `.local/circle-detector.json` and `.impeccable/build/state.json` were read as existing evidence.

All six final captures were opened directly with the image-viewing tool. Dimensions were checked from the files; the two tall 320px images were reduced to 285 × 2048 for tool display. The visual reviewer independently recorded its full-packet inspection. This pass generated no capture and performed no browser interaction.

| Capture under `outputs/circle/` | Dimensions | Directly observed comparison |
| --- | --- | --- |
| `circle-desktop-light.png` | 1440 × 1276 | Neutral working surface, native composer, blue exact-copy preview, outlined audience/privacy panels and one final amber Share action. |
| `circle-desktop-dark.png` | 1440 × 1276 | Same hierarchy and geometry with paired dark surfaces and readable control boundaries. |
| `circle-mobile-fr-320-light.png` | 320 × 2303 | French headings and disclosures wrap within the narrow column; preview, audience and privacy precede the final action. |
| `circle-mobile-fr-320-dark.png` | 320 × 2303 | Same single-column ordering and paired dark treatments. |
| `circle-user-preview.png` | 1264 × 1326 | Current IAB preview adds separately labelled private learning context and a two-member audience; it keeps the established shell. |
| `circle-two-account-result.png` | 1264 × 912 | Shared commitment, author/time, named preset encouragement, audience and collapsed settings use quiet rows and native details controls. |

The IAB files have `.png` filenames but were decoded with the image library to verify their actual dimensions; a PNG-header-only check was inapplicable to those two files. The supplied 1280px browser viewport is distinct from the captured 1264px content width. This has no observed layout consequence.

## Constraints

This is the final contract's ordinary Operate extension. The selected Amber direction, local Segoe UI substitution, three navigation destinations, topbar utilities and provisional brand location are settled. The detailed sharing image remains an `approved:false` elaboration; it is not a new pixel-perfect contract or permission to replace the incumbent system. No raster ships.

Only this comparison record was written. DESIGN.md, its sidecar, source files, tests, browser/server state, Git state and trackers were not mutated by this agent. The parent owns product/current-state documentation and evidence reconciliation. No application test, new detector run, computed-style browser inspection, contrast measurement or accessibility certification was performed here.

### Source-to-system comparison

| Area | Exact source evidence and supplied output | Comparison |
| --- | --- | --- |
| Palette | A read-only comparison matched all 38 hex-valued light/dark CSS custom properties to DESIGN.md with zero mismatches. Its remaining two color tokens, action ink `#17150f` and action border `#a36c00`, match the existing primary-button literals. Circle preview/private context use `blue` / `blue-ink`; panels and rows use `line`; preview rules use `control-line`; bylines use `muted`. | No new color token. Both paired-theme captures retain the recorded semantic roles. The Paired Surface Rule is inherited. |
| Type | Circle section titles use 1.35rem; audience/private-context and saved-item subheadings use 1.15rem; bylines/encouragement use 0.91rem. Body text, 2.5rem page headings, weights and the Segoe UI stack inherit the existing rules. | Title/hint values match the frontmatter. The 1.15rem support-heading size is already documented in DESIGN.md prose and used by existing drawer/mobile support headings; it is absent from the machine-readable frontmatter, explaining the two P07 advisories. No scale expansion is needed to legitimize those findings. |
| Local code display | Only `.circle-token input` requests `ui-monospace, monospace`. The created invite code is a read-only native field, unlike ordinary prose or display headings. | A local content-format treatment, not a replacement type system or new global font token. No font asset or network font is added. This field is source-inspected; it is outside the six rendered capture states. |
| Controls and feedback | Circle code imports the existing `button`, `field`, `input`, `notice` and focus helpers. Preview/create/join/encouragement use neutral buttons, Cancel uses subtle, Share/Write use primary, and Back/management triggers use text buttons. Shared rules retain 6px corners, 10px × 18px button padding, 44px minimum height, weight 600, 3px focus outline/offset and native disabled styles. Fields retain 6px corners and 10px × 12px padding. | Existing control definitions cover the new flow. Native details/summary retain ordinary disclosure behavior and add local 44px summary height. Source semantics and still images alone do not verify keyboard, persistence or authorization behavior. |
| Shapes and material | Audience/privacy use 1px quiet borders, 12px panel corners and 22px padding. Preview/private context use 12px corners and 24px padding. All four use 18px padding on mobile. Shared updates and settings use dividers rather than new elevated cards. | Preserves the recorded flat-panel language. No new global radius, shadow or material. Local padding and gaps are composition details rather than canonical scale additions. |
| Layout and spacing | Circle view max-width is 1380px. The main grid is `minmax(0, 1.15fr) minmax(300px, 0.85fr)` with 32px gap; it becomes one column at 1100px. Entry forms use equal columns, 40px gap and 1050px maximum width, stacking at 799px with 32px gap. Form gaps reuse 20px; audience list gaps use 10px/24px. | Local layouts extend the existing shell. The 1100px composition breakpoint is already used by Comeback and does not replace or expand the shell's shared breakpoint contract. The 799px threshold remains the mobile shell boundary. |
| Disclosure and action hierarchy | In `compose`, form/preview precede the sidebar and the final action row in DOM order. Optional private-plan context is separately named. The sidebar contains actual audience names, current/future-member disclosure and privacy exclusions. `white-space: pre-wrap` and `overflow-wrap: anywhere` preserve/wrap copy. | Desktop and French mobile captures reflect the final direction contract. The full-width mobile Share action follows all disclosures. English learner-entered text remains unchanged under the French UI, consistent with F13. This comparison establishes presentation, not privacy enforcement. |
| Shell and motion | Main/journey add Circle entry points and open a subview inside My learning; `Route` remains learning/journeys/activity. Captures retain brand, panel icons and utilities. New CSS adds no animation, transition, shadow or image. | No fourth navigation destination or new visual world. Existing account shadows and theme-knob motion remain as recorded in the sidecar. |

### Preservation and source fingerprints

Full-file SHA-256 values use `Get-FileHash -Algorithm SHA256`. The frontmatter digest covers exact UTF-8 text from the opening `---` through its closing `---`, retaining the line endings and excluding the following newline. The two complete system artifacts and frontmatter were measured before and after authoring this report.

| Preserved artifact | SHA-256 before | After |
| --- | --- | --- |
| DESIGN.md full file | `E27BF2BFD80D7BA4AD36702BA8697B037236717C3A22E64C1177DB41E4F189E4` | Identical |
| DESIGN.md normative frontmatter | `C05405209E5973E20C4CA654C57590D8388CD3D07892F094E01B7EE649073023` | Identical |
| `.impeccable/design.json` full file | `A1E3E6D92D823E75E55CD1CB926966E87DF2FFAB63C10AA462E7B54AA3EFBE7A` | Identical |

These fingerprints identify the source and evidence inspected at this pass; they are not claims about a later published commit.

| Source / evidence | SHA-256 |
| --- | --- |
| `src/client/styles.css` | `ECD64B80A8E9295BB76CC26B2F472F7C590AA191A8DDF5BE9E906BCFF0A1C6A3` |
| `src/client/circle.ts` | `F118872A7A571F7F012F3FDE3960F3E7B1507FD597F7FABB6316AAEE33A0AECE` |
| `src/client/i18n.ts` | `AF278FF1EDBD942E954B92A8B8E60FC8CD14614EA6C99C0A0A9E2B24E6D80E87` |
| `src/client/main.ts` | `ECBA8889E27950CFE36C5D7120FBE639C8F8BB358062C2113D1C3705BD5F73A3` |
| `src/client/journey.ts` | `6246864E3E990908E59AD27C20FF998540AB7D77080336FBA386BE54FE9A7B78` |
| `src/client/ui.ts` | `FFB10547A77F66FDFCD8D721BDF060FAF3522FCD1A45AFDB84576008D5C13187` |
| `src/client/shell.ts` | `6E034E7314D3334EC0983DD44ABEA6156A95AFA6CF1841032E118F59F8AFD9D1` |
| `.impeccable/surfaces/src-client-main-ts.md` | `EA2CFAC9D4A9E69EA172E092B3D455A5B2B346EDCF18BD6C1BFE2022D69FA7C7` |
| `.local/circle-detector.json` | `24DE4CD8F6C6BF7D58CFC987B41CD3EAFC5144032A4161227ECBC1040725BCFF` |
| `.impeccable/build/state.json` | `918A531E0D5FCB4A12276A87C0B076036B35EA29D3F2AB263224C099A6A9DF23` |

### Drift not repaired or canonized

The saved detector has 34 advisories: 28 font-size, four color and two radius entries. Only current CSS lines 1140 and 1196 are within the P07 insertion, both for 1.15rem secondary headings. The read-only CSS diff confirms the other 32 findings fall on unchanged styles, including lines shifted by the insertion. The 1.15rem role is documented above as reuse; no advisory was suppressed or transformed into a new token. This is not a clean-detector claim.

The parent supplied the session's pre-existing `design-sidecar-stale` warning; this pass did not rerun context to reproduce it. Direct inspection confirms older state wording: the sidecar's Return support example still says schedule recovery is forthcoming; its narrative and DESIGN.md retain historical forthcoming-control wording; the opening surface-brief sections still describe P06/P07 as future work. DESIGN.md's support paragraph still marks P07 forthcoming. The appended final extension contracts and current increment records identify delivered work. These status/example discrepancies do not change the preserved palette or controls. They are recorded as drift, with current-state reconciliation owned by the parent, not repaired by this pass.

The qualified local system-font substitution remains an inherited implementation limitation, not an exact-raster or new brand-font commitment. No defect or stale example is canonized as a new system rule.

## Done When

Completed for this documentation scope: the finished source and six captures were compared with the incumbent system; local extension decisions and drift were recorded; exact system hashes remained identical; only this record was written. No design-system blocker was found and no system rewrite is needed for P07.

Formal Impeccable completion remains unverified: the inspected state has `plates` open and `hero`, `sections`, `motion`, `responsive` and `review` pending. QUALITY BAR and hero/final comp-diff reports were unavailable. The independent scoped `ship` verdict and this comparison do not close those phases, invent a receipt or establish new human approval. Behavioral acceptance, native-French review, general accessibility, learner benefit, adoption, publication and tracker readback require their separate evidence.

### Five-line system summary

- Palette: inherited Amber action and blue support, with the same paired light/dark semantic colors.
- Type: local Segoe UI, 1.35rem section titles, existing 1.15rem support headings and 0.91rem bylines/hints.
- Controls and shapes: existing native 44px controls, 6px control corners and flat 12px panels.
- Layout: the three-destination Operate shell contains a responsive composer, disclosure sidebar and shared-update rows.
- Named rule: the Paired Surface Rule keeps semantic foreground/background pairs together.
