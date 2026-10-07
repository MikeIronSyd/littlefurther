# First learning-workspace design round

## Goal

Make the five committed capabilities legible as one connected learning journey before frontend implementation. This increment produces comparable desktop visual proposals and a state map, not a functioning product or an approved brand.

## Context Pointers

Use [PRODUCT.md](../../../PRODUCT.md), [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md), and [verification.md](verification.md). The research gate for the agreed runtime scope closed at 16:57 Africa/Lagos on 7 October 2026. The direction round uses Impeccable in Operate mode and native image generation. The user requested proceeding to the first mockup; settled scope is unchanged.

The saved [decision payload](../../../.impeccable/decision-options.json) supplies the comparison page. Runtime page state is local-only and ignored; the images and exact prompt sidecars are durable source artifacts.

| Proposal | Image | Role |
| --- | --- | --- |
| Joined progress | [Desktop comp](../../../.impeccable/mocks/decision/joined-progress.png) | Assigned direction: one joined progress strip and a prominent next action. |
| Open study page | [Desktop comp](../../../.impeccable/mocks/decision/open-study-page.png) | Grounded alternative: study action in a central reading column, support in the margin. |
| One clear next turn | [Desktop comp](../../../.impeccable/mocks/decision/next-turn.png) | Competitive wayfinding alternative: a conspicuous next-step band. |
| Familiar workspace | [Desktop comp](../../../.impeccable/mocks/decision/familiar-workspace.png) | Conventional alternative supplied for comparison. |

No option has user approval. No final product name exists; “My learning” is a navigation label. The illustrative programming goal does not restrict the broad learner audience.

## Constraints

### Truth and design research

| Need | Status | Evidence / finding |
| --- | --- | --- |
| Settled user scope and capability semantics | Satisfied | Active spec and PRODUCT.md read; all five capabilities and both StudyCircle meanings retained. |
| Current tracking context | Satisfied | Browser MCP read-only consultation verified correct Miva account, D009–D014 and E004; E005 observed unused in row 6. |
| Existing visual authority | Satisfied | No incumbent UI or DESIGN.md; only the image-first workflow is settled. |
| Coherent sample data | Satisfied | Independent learning-journey-review checked eight steps, distinct study dates, restart semantics and bounded sharing. |
| Visual fit / hierarchy | Proposals generated; selection pending | Compare the actual images. Visual inspection does not verify accessible behavior, usefulness or device compatibility. |
| Detailed small-screen/French, restart and sharing composition | Outstanding design work | State requirements below guide the next composition round; these screens have not yet been rendered. |

The learner uses a normal screen in variable ambient light and needs readable work, so proposals use light neutral working surfaces with dark text and restrained accents. This is an inferred design rationale, not field research. No study proving audience familiarity with a graphic tradition was conducted.

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
| Comeback preview | Five unfinished dates 4/6/8/10/12 October become 7/9/11/13/15 October (+3 days). Show old/new dates, conflicts, Cancel and Apply revised plan. Completed dates remain unchanged. | AC06 |
| Sharing preview | Explicit audience (private circle); exact shared copy such as “I plan to study for 10 minutes today.” Cancel/Share; private reflections and full history excluded. | AC07–AC09 |
| Personal and peer support | Private review belongs to the study flow. Peer commitments/check-ins/preset encouragement are voluntary, not full chat. | AC03, AC07 |
| Narrow screen / French | Order goal → next action → return support → progress/path → optional peer support. French labels may expand; retain normal controls and readable reflow. | AC11 |
| Empty / error / conflict | Create a first goal, no remaining steps, failed save, stale revision and denied sharing each need honest feedback and a recovery action. | AC01, AC05–AC11 |

No diagram or static render proves server-running disconnected operation, persistence, two-account access control, translation quality, keyboard behavior or contrast. These remain implementation and verification responsibilities.

### Actual review and limits

Root and the image-producing agents visually inspected the images. All proposals show an eight-step scope, three completed steps and three marked study dates. Joined progress carries the intended hierarchy and labels. The wayfinding render adds green completion marks, a pale blue return section and boxed supports beyond the restrained prompt; those deviations are visible and not silently called exact fidelity. The conventional alternative repeats navigation at the top and left; consolidate it if that option is chosen.

The Open study page render initially omitted the page title and made the current-step marker resemble completed markers. One native image edit restored “Your next step” and an outlined, unticked step 4. The producing agent inspected the corrected result: eight steps, three completed and three study days remain coherent. Its sidecar preserves the original generation and exact edit prompt; the image is still unapproved.

Each image has exact tool-prompt provenance and an `approved: false` sidecar. These are direction-decision images, not approved composition contracts. DESIGN.md is deferred until a visual direction is chosen and built/reviewed; no visual approval or finish review is invented.

## Done When

This direction round is complete when all four images and their prompt records are saved, factual sample details have been inspected, the comparison is available for review, and actual design evidence is reconciled to the existing trackers. The next task is to select/refine a direction, then finish the connected restart, sharing and narrow-width/French composition before frontend implementation.

P03 remains in progress. AC11 is only partly evidenced by generating images before frontend code; the full criterion remains unverified. E005 records design preparation against J1 (actual Codex/skill/tool work), J2 (specific intended learner interaction), J3 (durable artifacts/provenance) and J4 (planned visual story). No learner benefit, adoption or demo video is established.
