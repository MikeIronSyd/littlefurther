# Independent Assessment A — Amber learning workspace

## Goal

Review the design of `src/client/main.ts` and its connected learner views at source revision `0e3968f104f92ba0b2fe329156c494ad104f4568`, without implementing fixes. Assessment A ran independently in agent `/root/design_assessment_a`; Assessment B findings were not read. Date: 8 October 2026, Africa/Lagos. Mode: Operate.

**Design-specificity verdict:** the returning-learner workspace is authored for this product. The conspicuous amber next action, connected path, quiet retained-effort evidence and blue return support make the five capabilities feel like one journey. It is more specific than a generic dashboard. Its weakest parts are the transitions into planning and studying: these become long administrative forms or an activity log, losing some of the next-action clarity promised by the overview. Preserve the selected Amber identity; improve those transitions.

Overall assessment: a coherent, usable local demonstration with three supported P2 friction points. No P0 or P1 design defect was established in this bounded pass. This is a design assessment, not a full acceptance, accessibility or educational-effectiveness pass.

## Context Pointers

Read the supplied/project AGENTS instructions, active project context, `PRODUCT.md`, `DESIGN.md`, `.impeccable/surfaces/src-client-main-ts.md`, selected `.impeccable/mocks/decision/next-turn.png`, capstone specification and relevant first-journey contract. Source inspected: `main.ts`, `journey.ts`, `plan-editor.ts`, `shell.ts`, `ui.ts`, `comeback.ts`, focused `circle.ts` and `i18n.ts` sections, and related stylesheet selectors. Applied Impeccable's critique Assessment A/scoring/persona instructions and `.agents/skills/learning-journey-review/SKILL.md`. Root had already run Impeccable context for this session; it was not rerun. No prior critique/review report or detector output was opened. The mandatory surface brief contains a historical detector-count sentence; no rules, locations or findings from that run were consulted. `.impeccable/critique/ignore.md` was absent.

### Revision and live-test provenance

- Local `git rev-parse HEAD` returned the target SHA; the initial `git status --short` was empty.
- Initial new-tab attempts at the supplied `http://localhost:4317` failed with `net::ERR_BLOCKED_BY_CLIENT`. Root confirmed the actual demo origin is `http://127.0.0.1:4317`; this was a review setup error, not a product defect.
- A newly created Chrome tab loaded that origin but inherited an existing demo session. No app mutation was performed there; the exploratory tab was closed.
- All test mutations used the newly created, initially signed-out IAB tab 1, a fresh synthetic account named `Assessment A learner`, an eight-step template plan and a one-member synthetic `Assessment A circle`. No existing learner account or circle was changed. The synthetic records remain on the local demo server. No invitations were created and no other person received a message.
- Root independently reported an isolated Vite/TypeScript build whose fourteen output files match existing `dist` byte for byte; receipt: `.local/design-build-attestation.json`. That is parent-supplied build attestation, separate from this agent's observations. This agent did not record live script/CSS asset URLs or hash the running server's memory. The exact source revision is established; the live pass is against the existing local demo with that attested disk build.
- One bounded inspection covered desktop 1440×960 and mobile 320×760, EN/FR and light/dark. Screenshots were taken through browser MCP. Read-only DOM geometry was used for the documented measurements. No production source, build state, server process, tracker, commit or publication was changed by this agent.

### Observed sequence and evidence

Evidence directory: `.local/design-review-a/`; `capture-manifest.json` records file sizes and SHA-256 hashes. All images are actual browser captures, not recreated mockups.

| Capture | Observed state |
| --- | --- |
| `01-planner-en-desktop-light.jpg` | Empty manual planner; labelled fields and raw-date availability entry. |
| `02-planner-invalid-availability.jpg` | Selected HTML template plus `2026-10-08, tomorrow`; generic topic/date error. |
| `03-eight-step-review-desktop-light.jpg` | All eight suggested steps available for review before saving. |
| `04-learning-desktop-light.jpg` | Saved eight-step plan, 0 complete, expanded sidebar, amber primary action. |
| `05-learning-desktop-dark-compact.jpg` | Same plan in dark mode and compact navigation; brand remains visible. |
| `06-study-desktop-dark.jpg` | Study entry: minutes/reflection/completion controls; no template-resource link. |
| `07-comeback-desktop-dark.jpg` | Seven unfinished steps proposed one day later, completed work retained, conflict acknowledgement required. |
| `08-comeback-mobile-fr-dark.jpg` | Same preview translated/reflowed at 320px, before cancellation. |
| `09-learning-mobile-fr-dark.jpg` | Mobile next action in dark mode. |
| `10-drawer-mobile-fr-dark.jpg` | French modal drawer, named Close control and three destinations. |
| `11-learning-mobile-fr-light.jpg` | Same mobile workspace in light mode. |
| `12-edit-step-mobile-fr-light.jpg` | Edit-step entry lands at the beginning of the entire plan form. |
| `13-circle-preview-mobile-fr-light.jpg` | Full-page exact-copy preview, private context, audience and exclusions. |
| `14-circle-preview-mobile-viewport.jpg` | Ordinary viewport capture confirms readable preview without the full-page capture artifact. |
| `15-progress-mobile-fr-light.jpg` | Retained history shows one session, five minutes and one explicit completion. |
| `16-journeys-reloaded-desktop.jpg` | Saved eight-step journey and compact/light preferences survive reload. |
| `17-desktop-path-decision-viewport.jpg` | Six unfinished-step choices fully visible together at 1440×960. |

Full-page mobile capture 13 shows capture-time right-edge cropping/skip-link artifacts that were not reproducible in the ordinary viewport. Read-only geometry returned viewport, document and body scroll widths of 320px, no overflowing `main` descendant, and scrollX 0. Capture 14 is the reliable viewport evidence. No product overflow defect is inferred from capture 13.

### Acceptance evidence matrix

Results below apply only to the stated bounded expectation; no partial row closes its entire capstone criterion.

| AC | Expected behavior reviewed | Evidence/result | Limitation |
| --- | --- | --- | --- |
| AC01 | Review and explicitly save a template plan with valid dates | **Verified pass** for the eight-step creation; invalid availability rejected; saved plan reappeared after reload | Manual-topic creation, scope edits and all boundary conditions not executed. Error guidance has A01. |
| AC02 | Traceable template context and sources | **Verified pass** for source/outcome/prerequisite links visible in editor in both languages | Source/version contract not exhaustively reviewed; material access during study has A03. |
| AC03 | Study logging, optional reflection, separate whole-step completion | **Verified pass**: saved five minutes with blank reflection, then explicitly completed step; next action became step 2 | No study timer claim; no remaining-session/error-path coverage. |
| AC04 | Honest consistency display | **Verified pass** for displayed one study day, one session, five learner-reported minutes, date range and Africa/Lagos | Calendar/DST/deduplication correctness **unverified** by this review. |
| AC05 | Current completion differs from retained activity/history and mastery | **Verified pass** for 1/8 completion and separate activity/history readback with self-report language | Empty/all-complete and scope-change behavior **unverified**. |
| AC06 | Comeback shows old/new dates, retained work, explicit confirmation and cancel | **Verified pass** for seven changes of +1 day, one availability conflict, disabled Apply pending acknowledgement, cancel leaving original dates | Apply, atomicity, stale revisions and failure paths **unverified**. |
| AC07 | Deliberate exact-copy/audience preview and own-circle saved readback | **Verified pass** for one-member circle, preview and save of synthetic commitment; private context/exclusions visible | Peer access, encouragement, invitation and lifecycle controls **unverified**. |
| AC08–AC09 | Invite/security boundaries | **Unverified** | This design review did not test authorization, cryptography or hostile inputs. |
| AC10 | Ordinary refresh persistence | **Verified pass** for saved journey after browser reload | Server restart, network-disconnected operation and failed-save recovery **unverified**. |
| AC11a–b | Theme/sidebar operations and stored choice | **Verified pass** for both theme controls, compact/expanded navigation and light/compact reload readback | Device-following, storage failures and exhaustive unsaved-input preservation **unverified**. |
| AC11c | Correct directional toggle, persistent brand and named compact navigation | **Verified pass** in observed shell/source states | Complete keyboard traversal and every tooltip state **unverified**. |
| AC11d | Mobile drawer focus containment, Escape, navigation and resize cleanup | **Verified pass**: opening focused Fermer; Shift+Tab wrapped to Activité; Tab wrapped to Fermer; Escape restored trigger; Activity navigation closed drawer/focused heading; widening open drawer yielded zero open dialogs, empty body class and visible desktop-trigger focus | No assistive-technology user study. |
| AC11e | EN/FR and 320px operation | **Verified pass** for inspected states; material names remain saved learner-editable English text as intended | Full language catalogue, native-French quality and 200% zoom **unverified**. |
| AC11f | Light/dark readability and visible control states | Source/pixels inspected; theme switch **verified pass** | Numerical contrast, forced colors and reduced motion **unverified** by A. |

## Constraints

### Nielsen heuristic scores

Scores use 0–4, where 4 means excellent. All ten apply to this Operate surface.

| # | Heuristic | Score | Reason |
| --- | --- | ---: | --- |
| 1 | Visibility of system status | 3 | Saved/preview-only/completion feedback and explicit counts are clear. An earlier plan-saved banner persisted into the study and Comeback views. |
| 2 | Match with the real world | 2 | Encouraging study language works; ISO date lists, IANA timezone entry and “absolute http or https URL” add avoidable technical translation. |
| 3 | User control and freedom | 3 | Cancel/back, optional reflection and explicit sharing are strong. No correction/undo affordance was found after whole-step completion; correction behavior was not tested. |
| 4 | Consistency and standards | 3 | Palette, controls and shell remain cohesive across themes/languages. Edit step unexpectedly opens the same full editor as Edit plan. |
| 5 | Error prevention | 3 | Invalid dates are blocked, drafts require saving, and Comeback/share previews precede commitment. Availability entry itself invites formatting errors. |
| 6 | Recognition rather than recall | 2 | Next action and path are visible; the study screen tells learners to use material but does not retain the template-source access seen during setup. |
| 7 | Flexibility and efficiency | 2 | Editable order/dates/pace, five-minute restart and compact navigation help. Single-step adjustments require navigating a long global form. |
| 8 | Aesthetic and minimalist design | 3 | Amber meaningfully marks action; quiet surfaces and spacious text are coherent. Long editor pages and repeated status copy weaken the otherwise focused composition. |
| 9 | Error recognition and recovery | 2 | Input remains intact, but the reproduced invalid-date error requests a topic even when a template already supplies topics, and does not identify the invalid token. |
| 10 | Help and documentation | 3 | Useful local-operation, privacy, source, estimates and self-report guidance is contextual. Material access is weakest at the moment of studying. |
| | **Total** | **26/40** | **Acceptable** under the skill's scoring bands; targeted usability improvements remain. |

### Cognitive load

| Checklist item | Result | Evidence |
| --- | --- | --- |
| Single focus | Pass | Primary study action clearly dominates the overview; secondary return/circle support is quieter. |
| Chunking | Fail | The review exposes eight full editable step fieldsets in one long document. Each row is structured, but there is no compact review layer. |
| Grouping | Pass | Fieldsets, current-step band, comparison rows and audience/private panels make relationships visible. |
| Visual hierarchy | Pass | Heading → next action → retained effort/path is clear in both themes; mobile keeps the action early. |
| One thing at a time | Pass | Draft → review → save and compose → preview → share have distinct decisions. |
| Minimal choices | Fail, bounded | Six unfinished path actions were simultaneously fully visible at desktop; seven existed in the current path. The primary action reduces, but does not eliminate, this choice set. |
| Working memory | Fail | Template lessons are shown in the editor but not in the study screen, requiring the learner to remember/retrieve where the material was. |
| Progressive disclosure | Pass | Circle membership/invitations start collapsed; draft review and share confirmation appear only after their preceding action. |

Three failed items = **moderate cognitive load** in this checklist. The concentration is setup/editing and material retrieval, not the returning learner's primary action. The literal item-count heuristic is a prompt to inspect hierarchy, not evidence that the complete path must be hidden.

Actual greater-than-four-option points: on the final desktop viewport, “Set up your file,” “Build the page structure,” “Add a heading and paragraph,” “Add a link and image,” “Style your page,” and “Check a small screen” were six fully visible selectable path actions (DOM top/bottom positions 539.8–939.5px within 960px). “Finish and reflect” began at 951.5px and was not fully visible. The earlier eight-step draft rendered eight editable rows; a row has three inputs and three editing actions, separated into two visual groups. These are not eight simultaneously visible mobile choices. Three navigation destinations, two templates and two sharing kinds are not overloaded option sets. The seven-date rhythm is information, not seven choices.

### Emotional journey

The entry is welcoming and truthful about local accounts. Creating a first plan is the main emotional valley: a learner seeking a small next action must first type a schedule in a technical format and traverse a long review. Saving reaches a useful peak: the amber band presents one manageable action and makes retained work visible. Starting study then becomes an administrative logging form; existing template-material context drops away. Logging activity and explicitly completing a step give clear acknowledgement without claiming mastery. Comeback is reassuring because old/new dates and preserved work coexist, while its conflict acknowledgement protects deliberate choice. Sharing ends well: the learner sees the exact copy and audience before a saved item appears. No observed emotion, adoption or retention benefit is claimed; these are design interpretations of the tested sequence.

### What's working

1. **The overview earns its hierarchy.** Amber makes the next action conspicuous while the path preserves context. Dark mode and compact navigation retain that relationship and reclaim real working space.
2. **Comeback makes reassurance concrete.** It displays seven exact changes beside the completed step and cumulative effort, then requires a deliberate decision about the visible conflict. It does not silently rewrite a schedule.
3. **Privacy is understandable at the point of sharing.** The exact draft, current/future audience and excluded private data are presented before the final action. Ordinary study remains available without joining a circle.

### Priority issues

#### A01 — P2: Availability entry makes date syntax the learner's job; recovery misidentifies the problem

- **Observed reproduction:** select “Build a simple web page”; enter `2026-10-08, tomorrow` in Dates you are available; choose Review draft steps. Error: “Add at least one topic and one valid available date before reviewing.” The template already supplies topics and one valid date is already present. The invalid item is not identified. The input is preserved, so recovery is possible by editing the list.
- **Why it matters:** a broad learner audience has to translate ordinary availability into a comma-separated ISO list, and the error sends attention to a topic problem that does not exist. This adds avoidable friction before the product delivers its first manageable action.
- **Source/AC:** `src/client/plan-editor.ts:76`, `:243`, `:257`; `src/client/i18n.ts:296`, `:316`; AC01 and AC11's understandable, inclusive forms. Evidence 01–03.
- **Concrete fix:** offer a small multi-date selection control with an explicit add-date action, retain paste-list entry as an optional efficient path, identify the exact invalid token next to availability, and distinguish missing topics from malformed dates. Keep the existing dates and draft intact on correction.
- **Suggested command:** `$impeccable clarify`, followed by `$impeccable harden` within the existing research/spec gate.

#### A02 — P2: “Edit step” loses the selected step inside the full plan editor

- **Observed reproduction:** after completing step 1, click Edit step / Modifier l’étape for “Set up your file” at 320px French. The view focuses “Adaptez votre parcours” and begins with goal, disabled template, sources and general schedule fields. The intended action field is approximately 2475 CSS pixels down the document; the whole page is approximately 5775px high. No selected-step cue or jump is supplied.
- **Why it matters:** someone trying to adjust a ten-minute action has to navigate global plan setup and preceding rows. This is particularly burdensome on a phone or with sequential keyboard/screen-reader navigation.
- **Source/AC:** `src/client/journey.ts:128` and `:154` share the same edit callback; `src/client/main.ts:315`, `:338`, `:445`; AC01/AC03/AC11. Evidence 12 and recorded DOM measurement.
- **Concrete fix:** pass the current step ID to the editor, focus and visibly identify that fieldset, and provide a concise step-only edit presentation with an explicit route to the full plan. Preserve the current validation/history rules and unsaved-state protection.
- **Suggested command:** `$impeccable distill` or `$impeccable shape` for the bounded edit flow.

#### A03 — P2: Starting a template study session drops the material links that setup just supplied

- **Observed reproduction:** choose the HTML template, inspect its two MDN source links, save the plan without manually copying those links into Reference links, then Start study session. The session displays the action title and “Use your learning material” plus logging/completion fields. It exposes no template source link. Editing the plan reveals the links again, so a workaround exists.
- **Why it matters:** the primary action leads to recording work but makes retrieving the actual material a separate memory/navigation task. It weakens the connected plan → study → review journey without requiring runtime AI, fetching or stored external lessons.
- **Source/AC:** sources render in `src/client/plan-editor.ts:111`; saving only includes separately entered references at `:312`; overview references at `src/client/journey.ts:291`; `showStudy` at `:309`/`:412` does not render them. AC02 source traceability and AC03 connected study flow. Evidence 02–03 and 06. This is a discoverability improvement, not a claim that the source contract is wholly absent.
- **Concrete fix:** expose the existing template's source links and learner-supplied references in the study summary, with the existing internet-required/no-fetch disclosure. Keep the log and explicit completion actions separate. Do not imply that the app hosts or translates those lessons.
- **Suggested command:** `$impeccable clarify` / `$impeccable onboard` for the study transition.

### Persona red flags

- **Jordan, first-time learner:** the raw availability syntax and irrelevant missing-topic instruction interrupt first-plan creation. Later, Start study session does not reveal where to open the template lessons. Jordan has to discover that Edit plan contains them.
- **Casey, distracted mobile learner:** Edit step opens a 5775px document and the desired second-step field begins about 2475px down. This magnifies a small adjustment into a scrolling task. The mobile next-action band itself remains clear and reachable.
- **Sam, keyboard/accessibility-dependent learner:** drawer containment and focus return were observed working. The full-plan detour still creates a long sequential journey to one field, and the invalid-date error does not identify the problematic token beside its field. Screen-reader announcement quality and 200% zoom were not tested, so no failure is invented for those.

### Minor observations and design questions

- The plan-saved banner remained visible after entering study and Comeback. Scope or clear status messages when their action context ends so they do not look like confirmation of the current unsaved preview.
- Before any completed work exists, the overview still says “Your completed work is still here.” A first-plan variant would be more literally accurate while preserving the supportive tone.
- A completion is explicit and separate from a session, but no visible correction/undo path was found. Any correction proposal must preserve original history and first resolve the current contract; this review does not assume such an API exists.
- Saved template step text correctly remains English after switching to French. That is intended editable learner content, not a missing UI translation.
- Design questions for root synthesis: What is the smallest useful availability decision before the first study action? Should the study entry help the learner open material and record the work in the same place? How can a one-step adjustment stay a one-step task?

## Done When

Assessment A delivered its unanchored specificity verdict, ten heuristic scores, all eight load checks, concrete option counts, emotional-journey interpretation, three strengths, three supported priority issues, three persona views and limitations. Exact source revision and actual browser evidence are recorded. Questions are suggestions for parent synthesis; no question or approval gate was imposed on the user here.

This agent did not run the detector, inspect Assessment B or claim an overlay, formal pipeline receipt, complete accessibility conformance, educational effectiveness, full-capstone completion, or production readiness. Root owns synthesis and any subsequent evidence reconciliation. All seventeen captures and their manifest are intentionally retained as review evidence. The temporary viewport override was reset; both agent-created tabs were closed; the existing port 4317 server was left running. No additional polishing or implementation pass was performed.
