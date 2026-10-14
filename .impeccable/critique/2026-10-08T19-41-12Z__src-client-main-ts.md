---
target: Integrated Amber learning workspace design review
total_score: 26
max_score: 40
na_heuristics:
p0_count: 0
p1_count: 0
target_identity: "file:C:\\Users\\USER\\Documents\\ChatGPT\\Andela X Miva X OpenAI (Codex Accelerator Hackathon)\\src\\client\\main.ts"
target_fingerprint: "sha256:02336c34a1152e2ba508e7c8562f615ff4c3e72d8320ea2d4a4ba7f437888738"
target_path: "C:\\Users\\USER\\Documents\\ChatGPT\\Andela X Miva X OpenAI (Codex Accelerator Hackathon)\\src\\client\\main.ts"
timestamp: 2026-10-08T19-41-12Z
slug: src-client-main-ts
---
Method: dual-agent (A: /root/design_assessment_a · B: /root/design_assessment_b)

# Integrated Amber design critique

## Goal

Review the current connected learner interface at `0e3968f104f92ba0b2fe329156c494ad104f4568`. **Keep the Amber direction and refine five specific usability/accessibility issues before the recorded demo.** The inspected product is coherent and usable within the local demonstration scope. No P0/P1 defect was established; five P2 findings remain open. This is a completed bounded critique, not formal design approval or implementation of its recommendations.

## Context Pointers

[Assessment A](../../docs/specs/capstone/reviews/2026-10-08-design-assessment-a.md) independently judged the design before [Assessment B](../../docs/specs/capstone/reviews/2026-10-08-design-assessment-b.md)'s findings were released at20:35 Africa/Lagos. [Source checking](../../docs/specs/capstone/reviews/2026-10-08-design-source-check.md) independently verifies the mechanisms and distinguishes minimal corrections from larger design proposals. The [review contract](../../docs/specs/capstone/increments/design-review.md) defines scope and evidence. The [formal checkpoint report](../../docs/specs/capstone/reviews/2026-10-08-design-pipeline-review.md) is separate from the critique.

Actual browser inspection used synthetic accounts and included desktop1440px and mobile320/390px, English/French, both themes, expanded/compact navigation, keyboard drawer behavior, planning, study/reflection, explicit completion, Comeback preview/cancel, progress and a one-member circle's exact-copy preview/save. Root's isolated pinned Vite/TypeScript builds matched all14 existing generated files byte for byte. B observed the corresponding served asset names. Source revision and reproducible disk build are established; no running-server memory hash is claimed.

### Design specificity and overall impression

The overview feels authored for a returning learner: one amber action, a connected path, retained effort and quieter return support. The five capabilities share one visual system. The weakest transitions are planning and editing, where the focused next-action experience becomes a long form, and study entry, where the learning-material links disappear. Improve those transitions without replacing the selected identity.

The detector returned34 advisories in `src/client/styles.css`:28 font-size,4 color and2 radius entries, exit0. Sixteen flagged font-size uses are already described in DESIGN prose; the2px navigation radius exists in a component snippet. These are largely structured design-document alignment issues, not34 reproduced interface defects. B found two accessibility defects through interaction/AX inspection that the detector did not identify. Both assessments independently reproduced the misleading availability error. The cross-origin detector script failed to load; no reliable live overlay exists. Ordinary browser evidence and complete CLI output provide the fallback.

### Heuristic score

A's unanchored assessment rated the interface **26/40 — acceptable, with targeted improvements**. This is expert judgment, not a measured usability result. All ten heuristics apply; B's later findings are incorporated into priorities rather than presented as a second independent score.

| Heuristic | Score /4 | Main observation |
| --- | ---: | --- |
| Visibility of system status | 3 | Clear previews/counts; old saved banners can persist into another context. |
| Match with the real world | 2 | Supportive language, but availability and timezone entry expose technical formats. |
| User control and freedom | 3 | Deliberate sharing and cancel paths; no visible completion correction was found. |
| Consistency and standards | 3 | Cohesive shell; Edit step unexpectedly opens Edit plan. |
| Error prevention | 3 | Explicit save/preview/conflict acknowledgement; date syntax invites mistakes. |
| Recognition rather than recall | 2 | Clear next action; study material must be retrieved from setup. |
| Flexibility and efficiency | 2 | Adjustable pace; a single-step change requires a long editor detour. |
| Aesthetic and minimalist design | 3 | Amber hierarchy works; long forms and repeated status copy weaken it. |
| Error recognition and recovery | 2 | Values survive errors, but guidance identifies the wrong missing input. |
| Help and documentation | 3 | Contextual privacy/estimate guidance; weak material access at study time. |
| **Total** | **26/40** | **Bounded design judgment; formal acceptance remains separate.** |

### What works

- The amber next action stays dominant in light/dark and mobile/desktop; the compact rail reclaims space while the brand remains visible. The correct directional panel controls are used.
- Comeback makes reassurance concrete through retained work, exact old/new dates and deliberate conflict acknowledgement. Cancel left the original schedule intact in the observed sequences.
- Sharing presents the exact copy, audience and private exclusions before confirmation. Reflection and circles remain optional.

### Cognitive and emotional load

Three of eight cognitive-load checks failed: chunking in the full eight-step editor, number of path choices and recalling where study resources live. Single focus, grouping, hierarchy, sequencing and progressive disclosure passed. Six unfinished path actions were simultaneously fully visible on A's desktop; hierarchy still made the primary action clear, so hiding the whole path is not the recommendation.

The emotional low point is first-plan setup and later single-step editing. The strongest moment is seeing the next manageable action beside evidence of retained effort. Comeback and sharing end with understandable, deliberate choices. These are design interpretations, not observed learner emotions or retention outcomes.

## Constraints

### Five priorities

| ID / severity | Observed issue and learner cost | Smallest useful correction | AC / source / suggested workflow |
| --- | --- | --- | --- |
| D01 / P2 | Enter on Move step down successfully reorders the draft but leaves keyboard focus on BODY. The learner loses their position. | Restore focus to the corresponding moved control, choose a logical adjacent target after removal and announce the new position. Verify the next Tab as well as the reorder. | AC11; [plan-editor.ts:152](../../src/client/plan-editor.ts#L152), callbacks187/201/213. `impeccable harden`. |
| D02 / P2 | Activity-marker names are raw dates plus symbols, such as `2026-10-08: ✓`, in both languages. The accessible label does not describe the state. | Supply localized date/status text for recorded and no-record dates, preserving neutral language and the numeric summary. | AC11; [journey.ts:84](../../src/client/journey.ts#L84). `impeccable clarify` / `harden`. Screen-reader pronunciation is untested. |
| D03 / P2 | Curated-template date failures ask for a topic even though the topic control is hidden. A mixed valid/invalid date list does not identify the bad token. | Distinguish missing/invalid dates from missing manual topics and associate the exact correction with availability. Preserve the entered values. A friendlier date-entry control is a separate optional UX change requiring a contract. | AC01/AC11; [plan-editor.ts:257](../../src/client/plan-editor.ts#L257), i18n.ts316/671. `impeccable clarify`. A01 and B03 corroborate the same underlying issue. |
| D04 / P2 | Edit step opens the whole plan at its heading. At French320px the intended second-step field starts about2475px down a5775px document. | Pass the selected step ID and focus/identify its fieldset while retaining full-plan access and unsaved protection. A dedicated step-only editor is an optional larger refinement, not required by this finding. | AC01/AC03/AC11; [journey.ts:128](../../src/client/journey.ts#L128), main.ts315/338/445. `impeccable distill`. |
| D05 / P2 | The study screen says to use learning material but omits the template sources visible during setup, and does not display separately entered reference links there either. | Present existing template sources and learner references beside the study action with the internet-required/no-fetch disclosure. Do not import, fetch, translate or invent lessons. | AC02/AC03; [plan-editor.ts:111](../../src/client/plan-editor.ts#L111), journey.ts291/309/412. `impeccable clarify` / `onboard`. |

The recommendations preserve product scope. Source checking confirms the five mechanisms; it does not establish hypothetical new controls or a completion-correction API. No production changes were made and no findings are marked fixed.

### Persona red flags

- **First-time learner:** technical availability entry and a misleading error delay the first useful study action; material links are harder to recover after setup.
- **Distracted mobile learner:** a small step adjustment becomes a long scroll through unrelated plan fields.
- **Keyboard or assistive-technology user:** reorder loses focus and activity names omit descriptive localized status. Drawer containment/focus return worked in the sampled checks; no broad screen-reader pass is claimed.

### Smaller observations

Scope saved-status banners to the action they confirm. Use a first-plan variant instead of “Your completed work is still here” when nothing is complete. Review the12.64px supporting metadata against the existing hint role. Align intentionally used values with structured design documentation during an authorized refresh; do not redesign to silence advisories. The visible absence of a completion-undo affordance remains a follow-up question, not a demonstrated missing backend capability. Final app name/logo remain deliberately undecided.

### Evidence and formal limits

| Area | Actual result | Limit |
| --- | --- | --- |
| AC01–AC07 presentation | Targeted plan/study/completion/Comeback/circle observations recorded by A/B. | No repeated full transactional, peer lifecycle or impact validation. |
| AC11 shell/reflow | Sampled themes, languages,320/390px layouts, named panel controls and drawer focus/resize behavior passed. | D01/D02 remain open; device-theme changes, storage failures, true browser zoom, complete routes and screen-reader testing not repeated. |
| AC11f | Sampled text/control/focus contrasts passed; forced-color navigation and reduced-motion0s transition observed. | No accessibility certification or exhaustive composited/native-state audit. |
| J1 / AC13 | Actual independent reviews, reusable review/evidence skills, browser MCP, detector and reproducible-build check. | No inferred time saving, plan-mode session or formal approval. |
| J2 | Working synthetic learner tasks and concrete usability friction. | Benefits remain hypotheses; no new real learner outcomes. |
| J3 / AC12 | Prior P10 setup/adaptation evidence retained; review source remains reusable. | No new human adoption or clean-machine claim. |
| J4 / AC14 | Five specific improvements and real captures available for demo preparation. | Timed3–5-minute recording and final delivery still pending. |

The formal plan/inventory packet now renders its six items and32-region summary. Its real decisions are still pending. This late checkpoint does not retrospectively establish pre-code review. Later authenticated assembled-page capture remains unresolved; no phase, receipt or comp authority was forced. The installed requirement (historical local reference) says: **“Never submit the page or write a receipt on the user's behalf.”** Only the user can supply those decisions. The packet classifies material/code treatment; it does not replace later explicit sidebar/theme requirements or approve the entire working application.

## Done When

The bounded critique is complete and the five priorities are recorded. Subsequent fixes require a proportional specification/research closure and affected verification, then a single confirmation review. Recommend correcting all five before demo capture, preserving Amber. The formal user packet, later capture feasibility and timed demo remain open. Tracker/publication results are recorded separately in the [design tracker report](../../docs/specs/capstone/reviews/2026-10-08-design-tracker.md).

### Decisions for the next increment

1. Which scope should lead: **all five focused fixes (recommended)**, **keyboard/accessibility plus error wording first**, or **study/editing flow first**?
2. For availability entry, prefer **accurate errors with the current input (recommended for the smallest demo increment)** or **a friendlier date-selection control as well**? The latter needs its own pre-code interaction reference and contract.
