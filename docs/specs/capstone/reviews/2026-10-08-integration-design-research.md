# P08 design-workflow research — 8 October 2026

## Goal

Identify the evidence and supported tooling needed for the outstanding Impeccable workflow, and define the safe scope of the requested design-record refresh before the complete-journey review. This is research, not a phase completion or application review verdict.

The current application can undergo P08 review and its current-state design records can be refreshed without inventing formal comp-pipeline completion. The inherited pipeline remains incomplete. Its next unresolved checkpoint is a real plan/inventory review; zero raster assets does not make that review empty or approved.

## Context Pointers

Read the installed `C:/Users/USER/.codex/skills/impeccable/SKILL.md`, `reference/document.md`, `reference/new-work.md`, `reference/component-review.md` and `reference/doctor.md`. Reused `.local/circle-impeccable-context.txt`; did not rerun context, detector, doctor or any phase mutation. All line references below refer to those installed files at this research pass.

Project inputs inspected: `.impeccable/config.json`, `.impeccable/build/state.json`, `.impeccable/build/spec.json`, `.impeccable/review/components.json`, `DESIGN.md`, `.impeccable/design.json`, `.impeccable/surfaces/src-client-main-ts.md`, the selected direction sidecar, `docs/specs/capstone/design.md`, P07 visual/system comparison reports, current P08 plan and verification records, stylesheet/localization source, `index.html` and `vite.config.ts`.

Opened all six detailed Amber references once: shell light/dark, Comeback preview, sharing preview, and French mobile closed/open. They show the intended later shell and preview hierarchy. As already documented, the dark reference retains an excessive collapsed gutter, and the open mobile reference changes wording/timezone and repeats utilities. These are reference limitations, not new product requirements. Their sidecars remain unapproved elaborations. The original `next-turn.png` sidecar records only the actual user selection, “I will go with Amber,” and its direction scope.

### Verified commands and observations

All commands used `C:/Users/USER/.codex/skills/impeccable/scripts/impeccable.cmd` from the project directory.

| Read-only command | Actual result |
| --- | --- |
| `build-phase --help` | Advertises `start`, `status [--json]`, `completion [--session-id …]`, `advance [--force --reason …]`, `record hero --build …`, `scaffold`, `note` and `finish --disposition …`. No documented skip/reset/waive-phase command. |
| `build-phase status --json` | State version 2; original 1536×1024 selected comp; artifact `src/client/main.ts`; current phase `plates`. Comps skipped, spec closed, plates open, hero/sections/motion/responsive/review pending; finish null. |
| `build-phase completion --session-id 01a0fd8c-ebb2-7da3-a219-fed96c5f3c06` | `status: incomplete`, all six open/pending phases listed, disposition null, `canContinue: true`. The verification scope explicitly covers entry-artifact bytes and recorded phase status, not every dependency. |
| `component-review --help` | Advertises `plan`, `prepare`, `capture`, `verify`, `lifecycle`, `serve`, `status`, `refresh-approvals`. `capture/verify --manifest <file>` and `serve/status --session <id>` are supported. |
| `component-review verify --manifest .impeccable/review/components.json` | Failed with `The system cannot find the file specified. (os error 2)`. The manifest itself exists. The error does not identify the missing dependent file, so it must not be reported as a verified missing receipt diagnosis or an approval pass. |
| `comp-diff --help` | Supports `--comp`, `--build`, `--spec`, `--out-dir`, `--align top|stretch`, `--label`, `--threshold`, `--json`. No diff was run. |

The manifest is schema version 3, stage `components`, and its `specSha256` matches the current spec. It contains **six plan items**, not zero: progress, path, rhythm, circle, estimate-clock and return-icon; 26 other code-region entries follow. There are no shipping raster plates. The recorded plates scoring gate says `ok: true`, “no plates owed,” but that mechanical result is not a human inventory acceptance.

### Requirements per outstanding phase

| Phase | Existing usable evidence | Still required / limitation |
| --- | --- | --- |
| Comps/spec | Direction provenance; 32-region measured spec; eleven measured text regions; closed spec gate. | Preserve these historical results. The detailed later shell states have no new approval; do not mark them approved or silently substitute them as the authoritative comp. |
| Plates | Zero-raster inventory and matching generated six-item plan manifest. | A real plan/inventory review of the current manifest. `component-review.md:7–19` requires the generated packet, capture, real user decisions and verify. At line 11: “Never submit the page or write a receipt on the user's behalf.” Existing direction selection or a broad proceed instruction is not an observed review receipt. |
| Hero | Original comp/spec and later shell contracts can guide comparison. | No `hero-repro.png`, scaffold or hero diff directory exists in the inspected review tree. `new-work.md:113` requires a valid capture at the comp's exact dimensions, measured comparison, all regions and hard-veto checks. The reference's old top navigation differs from the user's later requested sidebar/topbar; do not regress those explicit requirements to improve a numeric score. |
| Sections | Implemented private journey, Comeback and Circle; existing scoped source/test/visual reports. | Full connected-flow observation is P08 work. Later areas inherit the system (`new-work.md:114`), not invented extra imagery. Their existence does not itself close the earlier phases. |
| Motion | Sidecar and CSS describe only the 160ms theme-knob transition, removed with reduced motion. Existing tests have scoped reduced-motion coverage. | Verify actual state transitions/reduced motion in the P08 surface review. No decorative animation is owed by this Operate extension. Formal phase remains pending; read-only help does not expose a separate motion receipt schema. |
| Responsive | Earlier desktop/mobile paired captures and P07 320px French captures; 1280px actual-user view; existing scoped browser results. | Full-journey P08 capture/interaction at the user's width, representative desktop and mobile with both themes. Formal comp workflow separately specifies `.impeccable/review/desktop.png` at 1440px full page and `mobile.png` at 390px plus common 1280–1600 desktop widths (`new-work.md:116`). Circle previews are different content and cannot simply be renamed to prove the original workspace comparison. |
| Review/documentation | P07 scoped finish-reviewer `ship`; ordinary extension comparison with unchanged design hashes. | A P08 review must receive its actual complete-journey captures and evidence. Formal finish also needs closed phases and its diff packet. `new-work.md:142–152` separates fresh review, documenter handoff and recorded finish; a refused ship remains unfinished. QUALITY BAR and hero/final diff evidence remain unavailable. |

### Formal capture feasibility remains unresolved

The recorded artifact is a TypeScript module, `src/client/main.ts`. The real page is `index.html`, which loads that module through Vite; the built frontend is emitted to `dist/client`. `component-review.md:53–61` requires a schema-v2 hero manifest with exactly one full-viewport component, the artifact as `preview.path`, explicit local dependencies and no external request. It states that network APIs, frames and workers are unavailable during assembled capture.

The current authenticated application depends on its local API and saved session. A compliant assembled-page capture therefore needs a feasibility investigation; an arbitrary HTML fixture, removed behavior, or a screenshot of an authentication screen would not establish hero fidelity. No state/artifact change or capture workaround was attempted here. No existing result closes this need.

## Constraints

The user's selected world and later theme/sidebar requirements are settled. This is an ordinary extension and integrated review, not a new visual world. `new-work.md:16,31–33` says to inherit an existing surface; no concept tournament or redesign is warranted. `new-work.md:150` directs ordinary extensions to compare and preserve system files, reporting drift rather than repairing it unasked. The parent has current authorization to refresh the stale design record and owns that bounded update.

`new-work.md:99,111` allows force only for an explicit user downgrade of comp authority. None was observed. Do not force, manually close phases, claim receipt acceptance, or reinterpret product tests as comp fidelity. The original pipeline cannot be retroactively described as having run before implementation. Conversely, this inherited pipeline limitation does not erase observed product behavior or prevent read-only P08 research/review and authorized documentation work.

### Specific design-document drift to repair

| Record | Verified gap | Bounded refresh |
| --- | --- | --- |
| `DESIGN.md` | Overview still names the P04/P05 scan; support paragraph says P07 forthcoming; Do/Don't still frames Comeback/peer controls as forthcoming. | Update current-state descriptions with P06/P07 source/review links, preserving the Amber language and normative tokens. Avoid rewriting historic scan evidence as if it occurred later. |
| `.impeccable/design.json` | Saved context flags `design-sidecar-stale` because DESIGN.md changed after sidecar generation. Return support snippet says schedule recovery is coming; description calls it a P06 boundary. Narrative retains stale forthcoming wording. | Re-extract the existing component example and current narrative from source/documentation. Retain schema version 2 and extension-only structure; fresh `generatedAt` means a real refresh, not changing a timestamp alone. |
| Surface brief | Opening Goal/Constraints/STORY/Done When still says P06/P07 future, though appended extension contracts describe actual work. Detector unavailable wording is older than the saved P07 detector report. | Reconcile the active preamble and current evidence pointers; preserve dated extension contracts and historical limitations. |
| `docs/specs/capstone/design.md` | Current intro and first implementation section identify P06/P07 forthcoming. | Add a clearly dated current-state update and retain labelled historical image-stage records. Do not rewrite unapproved mockups or their known corrections. |
| Normative primitives | P07 independent comparison matched 38 paired color properties plus two primary literals, and found the 1.15rem support headings reuse an existing role. No new color/radius/motion/font system was introduced. | No token redesign or arbitrary new tokens to silence detector advisories. The latest integration observations may reveal an actual source discrepancy; if so record it before editing. |

`document.md:71` requires the existing-file choice to be resolved before overwrite; settled authorization to refresh does not require reasking qualitative direction. Preserve established North Star, voice and confirmed colors. Under lines 251–255, regenerating DESIGN.md also regenerates its sidecar; a sidecar-only request preserves DESIGN.md. Sidecar schema at 257–303 is version 2 with `generatedAt`, `title`, `extensions`, `components`, `narrative`; primitives stay in frontmatter. Snippets use self-contained `ds-` classes and inline SVG, meaningful hover/focus states, and source CSS custom properties (305–314). Narrative mirrors the actual canonical sections without rewording (330–340). Do not invent tonal ramps or motion where none exists.

No application/design/build-state file was changed, no receipt produced, no fresh comp generated and no test pass claimed by this research. The command/help and document reads are tool evidence, not a browser usability or accessibility pass.

## Done When

Research is complete for the bounded document refresh and for identifying the inherited formal requirements. P08 actual observation and source review remain the parent's work. Formal pipeline completion remains unresolved at the real plan-review checkpoint and later capture feasibility; no unsupported completion claim is recommended.

Read-only endpoint fingerprints match the earlier P07 comparison:

| Artifact | SHA-256 |
| --- | --- |
| `.impeccable/build/state.json` | `918A531E0D5FCB4A12276A87C0B076036B35EA29D3F2AB263224C099A6A9DF23` |
| `.impeccable/build/spec.json` | `01C1BD9ABDBDC89F5E345610BDCC2E7A9524A749A913406ADC7AAE5D2A7445BA` |
| `DESIGN.md` | `E27BF2BFD80D7BA4AD36702BA8697B037236717C3A22E64C1177DB41E4F189E4` |
| `.impeccable/design.json` | `A1E3E6D92D823E75E55CD1CB926966E87DF2FFAB63C10AA462E7B54AA3EFBE7A` |

Only this research report was authored. No recurring task, message, public deployment, paid service or broader design change was introduced.
