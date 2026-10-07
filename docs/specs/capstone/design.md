# Amber learning-workspace design record

## Goal

Carry the user's selected Amber direction into one connected learning journey before frontend implementation. Add requested light/dark switching, a collapsible sidebar, topbar controls and a persistent future brand slot. These are static interface references, not a functioning product or a final brand.

## Context Pointers

Use [PRODUCT.md](../../../PRODUCT.md), [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md), and [verification.md](verification.md). Original R01–R12 research closed at 16:57 Africa/Lagos on 7 October 2026; expanded R01–R14 research closed at **20:14 Africa/Lagos** after the theme/navigation request. S23 subsequently supports the corrected panel-toggle icons. Impeccable Operate mode and native image generation remain the design workflow. Research closure establishes the implementation contract, not app behavior.

### Active selection and current references — 7 October 2026

The user explicitly selected **“I will go with Amber.”** The approved direction is [One clear next turn](../../../.impeccable/mocks/decision/next-turn.png), with the exact approval and its limited scope in the [sidecar](../../../.impeccable/mocks/decision/next-turn.png.json). The other direction proposals remain unselected. Do not reopen the direction choice or infer approval of later state images, a final name/logo or application behavior.

The subsequent user requests add a dark/light toggle, a collapsible sidebar, a top-screen menu and space for the future app identity at top left. The later correction requires a proper sidebar-toggle icon. The shell contract uses standard navigation and utility controls, not five feature destinations:

- A persistent top-left brand slot sits outside the collapsible sidebar, alongside the sidebar control. The slot is provisional; no final name or logo exists.
- Three sidebar destinations organize the journey. The topbar carries theme, language and account controls. The main work area remains centered on the next useful study action and supporting path/history.
- Expanded desktop navigation uses `PanelLeftClose`; collapsed navigation and the closed mobile trigger use `PanelLeftOpen`. Decorative SVGs do not replace independent localized accessible names, expanded state or controls references. The mobile drawer retains a labelled Close control.
- Theme follows the device until a learner explicitly chooses light/dark. Only validated non-sensitive shell preferences may use guarded browser storage; learner records remain in SQLite. Narrow navigation is a closed-by-default modal drawer with specified focus and resize behavior. [F15/F16 and AC11a–AC11f](spec.md) define the full contract.
- The return action reads **“Review revised dates”**: Comeback moves unfinished dates while preserving order/spacing, without implying smaller work or a changed real deadline.

| Detailed state | Reference / status | Evidence boundary |
| --- | --- | --- |
| Light workspace, expanded sidebar | [Light shell](../../../.impeccable/mocks/amber/shell-light.png) | Static reference; detailed state approval is not inferred from the direction choice. |
| Dark workspace, collapsed sidebar | [Dark shell](../../../.impeccable/mocks/amber/shell-dark.png) | Static reference; the render retains a wide gutter. Implementation must reclaim the collapsed sidebar's width. |
| Comeback confirmation preview | [Revised dates](../../../.impeccable/mocks/amber/comeback-preview.png) | Shows old/new dates, unchanged completed work and the 13 October target conflict; no mutation is performed by an image. |
| Explicit sharing preview | [Sharing preview](../../../.impeccable/mocks/amber/sharing-preview.png) | Shows audience, exact shared copy and private exclusions; no peer access control has been exercised. |
| French mobile, drawer closed | [French closed drawer](../../../.impeccable/mocks/amber/mobile-fr-closed.png) | Static review confirms the right-facing panel icon, two-row header, connected capabilities and consistent sample counts/timezone. No responsive behavior or French-language quality pass is inferred. |
| French mobile, drawer open | [French open drawer](../../../.impeccable/mocks/amber/mobile-fr-open.png) | Static review confirms the left-facing panel icon, three destinations, active item and illustrated Fermer focus ring. Known raster inconsistencies below must not become application behavior. |

Detailed state sidecars remain `approved: false`; this preserves provenance without creating another approval gate or undoing the settled Amber choice. Continue authorized design/implementation in the saved order after the relevant image and research prerequisites are met.

### Preserved first direction round — 7 October 2026

The saved [decision payload](../../../.impeccable/decision-options.json) supplies the comparison page. Runtime page state is local-only and ignored; the images and exact prompt sidecars are durable source artifacts.

| Proposal | Image | Role |
| --- | --- | --- |
| Joined progress | [Desktop comp](../../../.impeccable/mocks/decision/joined-progress.png) | Assigned direction: one joined progress strip and a prominent next action. |
| Open study page | [Desktop comp](../../../.impeccable/mocks/decision/open-study-page.png) | Grounded alternative: study action in a central reading column, support in the margin. |
| One clear next turn | [Desktop comp](../../../.impeccable/mocks/decision/next-turn.png) | Competitive wayfinding alternative, subsequently selected by the user: a conspicuous next-step band. |
| Familiar workspace | [Desktop comp](../../../.impeccable/mocks/decision/familiar-workspace.png) | Conventional alternative supplied for comparison. |

At the end of the first generation round no option had approval; the subsequent Amber choice above supersedes that status. No final product name exists; “My learning” is a navigation label. The illustrative programming goal does not restrict the broad learner audience.

## Constraints

### Truth and design research

| Need | Status | Evidence / finding |
| --- | --- | --- |
| Settled user scope and capability semantics | Satisfied | Active spec and PRODUCT.md read; all five capabilities and both StudyCircle meanings retained. |
| Current tracking context | Satisfied | Browser MCP read-only consultation verified correct Miva account, D009–D014 and E004; E005 observed unused in row 6. |
| Existing visual authority | Satisfied | The original round had no incumbent UI or DESIGN.md. The user's later Amber selection now supplies visual authority; the image-first workflow continues. |
| Coherent sample data | Satisfied | Independent learning-journey-review checked eight steps, distinct study dates, restart semantics and bounded sharing. |
| Visual fit / hierarchy | Amber selected; detailed states in progress | The exact user choice and approved reference are preserved above. Visual inspection does not verify accessible behavior, usefulness or device compatibility. |
| Theme and navigation requirements | Research satisfied; behavior unverified | R13/R14 and S15–S23 support the contract in F15/F16 and AC11a–AC11f. No browser test or compatibility result follows from research closure. |
| Detailed desktop restart and sharing composition | Images produced; static review recorded below | Four detailed desktop references are present; none demonstrates functioning controls or completed product acceptance. |
| Small-screen/French composition | Images produced; static review complete | Both linked mobile references and provenance exist. Independent review findings and implementation adjustments are recorded below; no browser/reflow/native-French validation is claimed. |

The original proposals used light neutral working surfaces with dark text and restrained accents. The selected direction now extends to a dark palette at the user's request, preserving Amber's next-action hierarchy and readable controls. These are design rationales, not field research. No study proving audience familiarity with a graphic tradition was conducted.

The product's mechanism is an editable next action connected to retained effort, gentle recovery and optional support. The avoided defaults are a five-card feature dashboard and its opposite, a decorative motivational poster.

Seven grounded visual candidates were considered: (1) annotated personal study notebook, (2) library shelf-end wayfinding, (3) swimming-lane progression marks, (4) woven selvedge rhythm, (5) radio programme schedules, (6) indexed field-guide pages, and (7) patchwork joining/preserved pieces. These span paper, spatial, textile and broadcast graphic references. The durable list was recorded after the seed call; no prior timestamped shortlist is claimed. Seed `30b46385` assigned candidate 7. No reroll was performed. In an operating interface these references supply type, density, accent and one signature move; they do not turn the screen into a physical object.

The wayfinding challenger is competitive on next-action clarity. The design-annual, orienteering, reference-setting, event-catalog and exposure-record challengers were declined as full directions; their useful disciplines are shown in the comparison payload: attribution consistency, legible state, explanatory proximity, complete scope visibility and distinct quantity labels. These are design judgments, not user research. Catalog imagery is labeled inspiration, not a promised product screen.

### Coherent example and state map

The synthetic example is “Build a simple web page”: eight active steps, first three self-reported complete on 1, 2 and 3 October. The next action is “Add a heading and paragraph,” estimated at ten minutes. Before any 7 October session, consistency shows three study days within 1–7 October 2026, Africa/Lagos. The completion counter is not mastery.

| State | Visible content and behavior to implement | Acceptance links |
| --- | --- | --- |
| Ready to study | One dominant Start study session action; editable step/estimate; full goal and remaining path. | AC01–AC03, AC05 |
| Study/review | Log study activity separately from Mark step complete; optional private reflection; choose next action. | AC03–AC05 |
| Short restart | Logging five minutes on 7 October adds a fourth distinct study day but leaves completion at 3/8 until explicit completion. | AC03, AC04, AC06 |
| Comeback preview | Five unfinished dates 4/6/8/10/12 October become 7/9/11/13/15 October (+3 days). Show old/new dates, the 13 October target conflict, Cancel and Apply revised plan. Completed dates remain unchanged. | AC06 |
| Sharing preview | Explicit audience (private circle); exact shared copy such as “I plan to study for 10 minutes today.” Cancel/Share; private reflections and full history excluded. | AC07–AC09 |
| Personal and peer support | Private review belongs to the study flow. Peer commitments/check-ins/preset encouragement are voluntary, not full chat. | AC03, AC07 |
| Narrow screen / French | Order goal → next action → return support → progress/path → optional peer support. French labels may expand; retain normal controls and readable reflow. | AC11 |
| Theme and desktop navigation | Light/expanded and dark/collapsed states preserve the same goal, progress and actions. Keep brand visible, use correct directional panel icons, and reclaim collapsed width during implementation. | AC11a–AC11c, AC11e–AC11f |
| Mobile drawer | Closed on entry; labelled panel opener and modal drawer with Close, correct focus behavior and resize cleanup. Utility controls remain accessible. | AC11d–AC11f |
| Empty / error / conflict | Create a first goal, no remaining steps, failed save, stale revision and denied sharing each need honest feedback and a recovery action. | AC01, AC05–AC11 |

No diagram or static render proves server-running disconnected operation, persistence, two-account access control, translation quality, keyboard behavior or contrast. These remain implementation and verification responsibilities.

### Actual review and limits

**Current detailed desktop round:** independent static review reported correct panel-icon directions, 3/8 completed steps and three study days, all five connected capabilities, the uniform +3-day date shift with the 13 October target conflict, and explicit sharing audience/private exclusions. This is review of visible image content. It is not proof of theme persistence, sidebar resizing, keyboard/focus, accessibility, privacy enforcement or application behavior. The dark collapsed render's wide gutter is a known implementation limitation; the real layout must use reclaimed width.

**Current French-mobile round:** independent `amber_state_review` inspected both corrected native image outputs. The closed drawer reference shows a right-facing divided-panel icon, two-row header, all five connected capabilities, 3/8 completed steps, three study days and the correct `Africa/Lagos` timezone. The open reference shows a left-facing divided panel, three destinations, an active item, a labelled **Fermer** control with an illustrated focus ring, and retained progress counts. Six detailed state references and their provenance now exist; static review is complete.

The open raster contains specific implementation corrections. It incorrectly renders `Afrique/Lagos`; keep the IANA identifier `Africa/Lagos` unchanged. It compresses/recomposes the background and changes French labels; the application must overlay the unchanged page and use one translation catalogue. Header utilities remain undimmed and appear again in the drawer; actual modal behavior must make outside controls inert with a consistent backdrop and avoid duplicate active copies. The drawer appears roughly two-thirds of the viewport; implement the intended approximately 80% responsive drawer target and verify usable width/reflow. These are recorded adjustments for the real UI, not grounds to claim a new validated render. A painted focus ring and portrait image establish no keyboard behavior, accessibility, 320px reflow or native-French validation.

**Preserved first-round observations:**

Root and the image-producing agents visually inspected the images. All proposals show an eight-step scope, three completed steps and three marked study dates. Joined progress carries the intended hierarchy and labels. The wayfinding render adds green completion marks, a pale blue return section and boxed supports beyond the restrained prompt; those deviations are visible and not silently called exact fidelity. The conventional alternative repeats navigation at the top and left; consolidate it if that option is chosen.

The Open study page render initially omitted the page title and made the current-step marker resemble completed markers. One native image edit restored “Your next step” and an outlined, unticked step 4. The producing agent inspected the corrected result: eight steps, three completed and three study days remain coherent. Its sidecar preserves the original generation and exact edit prompt; the image is still unapproved.

At first-round creation each image had exact tool-prompt provenance and an `approved: false` sidecar. The selected Amber direction's sidecar is now `approved: true`, backed only by the user's exact selection; the other original options remain unapproved. The detailed images preserve their own prompts and remain `approved: false`. No final implementation/finish review is invented; DESIGN.md completion follows the applicable Impeccable workflow.

## Done When

The original comparison round produced four saved images and the user selected Amber. The current task completes when the selected shell, connected restart/sharing and French-mobile references plus exact prompt records are saved, reviewed against the specified facts and recorded in project evidence/trackers. Direction selection is settled. New theme/sidebar controls and the learner journey still need implementation and actual acceptance checks.

The six detailed state artifacts and static review are complete, with the listed implementation adjustments retained. P03's final evidence/tracker reconciliation is recorded separately by the root agent. AC11 and AC11a–AC11f remain unverified as product behavior; images only establish the image-first design artifact. E005 preserves the first design round against J1 (actual Codex/skill/tool work), J2 (specific intended learner interaction), J3 (durable artifacts/provenance) and J4 (planned visual story). No learner benefit, adoption or demo video is established.
