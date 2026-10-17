# Comprehensive UI refinement —17 October 2026

## Goal

Make the connected learner journey easier to scan and operate, preserving Amber, A Original LF, Segoe UI, three navigation destinations and current capabilities. Michael selected comprehensive refinement and one focused planning page. This is presentation/client-interaction work, not a new curriculum, AI capability or data lifecycle.

## Context Pointers

Baseline `ee61b7d2f719aaca7559a6a9faee72afb6a855d2`; only the pre-existing AGENTS.md edit was dirty at intake. R45 in [research](../research.md) records source discovery, Google/web comparison and limits. [References](../designs/ui-refinement/README.md) must be rendered/inspected before frontend edits. [Verification](ui-refinement-verification.md) separates actual checks and delivery.

Independent assessment A scored27/40 as bounded expert judgment. Assessment B ran the detector once:39advisories,0non-advisory findings,exit0; predominantly token documentation rather than learner defects. Root observed current sign-in, dashboard, seven-plan Journeys, planner, Activity, study and private-circle desktop screens using existing synthetic data at localhost:4325. No learning record was saved or AI requested. The attempted mobile override remained1280px and is not320px evidence. Nine lifecycle capture hashes match the baseline; planning styling/localization capture hashes differ after later lifecycle work and remain dated evidence.

## Constraints and contract

### Acceptance criteria

| ID | Required observable behavior |
| --- | --- |
| UR01 | New planning shows goal and native manual/AI method choice before route-specific fields. Manual is default. Shared scheduling, optional details and separate review/save stay on one page. Existing editing retains locked starter/no-AI behavior. |
| UR02 | Before review, changing method retains values and cancels pending AI; delayed output cannot enter the other route or replace reviewed steps. Accepted review locks method as the existing starter is locked. Hidden inactive controls are excluded from validation; native/server errors reveal containing details before focus. |
| UR03 | Step-associated title links remain visible; full provenance appears once per source ID in each catalogue, title/domain visible and metadata expandable. Do not merge different IDs or alter historical evidence/URLs. Retain supplied/search distinctions, limitations and explicit review/save. |
| UR04 | Contextual AI is default-collapsed with visible title/action identity; the selected planning AI route explicitly expands. Disclosure alone changes no input, record or request. Recipient/privacy text precedes actual request. Ready status does not steal focus after it leaves the panel or the panel closes; deliberate Review/Use keeps its focus transition. |
| UR05 | Study minutes, private reflection and Save form the working section before optional assistance; completion stays separate. Activity foregrounds counts/records, optional recap follows history. Corrected events are neutral; Completion history and counted-history copy distinguish retained events from totals. |
| UR06 | Journeys keeps Open/View prominent, maintenance under contextual native disclosures. Sessions/completions use the same quiet grouping. Confirmation/loading/error/retry panels remain outside collapsible triggers; Cancel reopens the group and focuses its trigger. Revision/receipt/dirty/ownership/acknowledgement behavior is unchanged. |
| UR07 | Cancelled dirty navigation restores the journey select to the current plan. Lifecycle action names include visible record context. Account Escape from inside returns focus to summary; outside pointer/focus closes without preventing/stealing outside action. Keep native semantics. |
| UR08 | EN/FR, both themes,320px/enlarged text, keyboard/touch, forced colours and reduced motion retain readable content/44px controls. Preserve approved hover borders,150ms/reduced-motion rules, borderless sidebar/icons/branding. Reconcile active design-token guidance without erasing dated evidence. |

### Client interfaces and data

- `AiPanelOptions.initiallyExpanded?: boolean` defaultsfalse; planning passestrue. `sourceLinks` supplies compact safe associated links; `sourceList` owns unique-ID metadata. Existing DTOs and public server APIs stay unchanged.
- New-plan `manual | ai` is local view state, not a saved-plan field. Dates/target/references retain their contracts. Method switching cancels pending work; explicit review alone creates editable suggested steps.
- A private lifecycle helper owns `{root, controls, panels, reveal}`. Only triggers go inside native details; confirmation/retry content remains in sibling panels. Cancel opens details before focusing its trigger. Removed-step restoration remains directly discoverable and contextually named.
- Shared `revealControl(control)` opens ancestor native details before native/server error focus without changing inputs or records.
- No server/schema/dependency/font/provider/model/quota/hosting change, real-key loading, live sponsored request, ordinary learner mutation or decorative motion for verification.

### Quality and implementation sequence

1. Complete R45 and this contract; render/inspect four surfaces at1440light and320dark before frontend edits.
2. Implement independent planner/AI work and shared study/history/management/shell changes with centralized translations/styles/helpers and separate agent file ownership.
3. Add UR-linked regressions; adapt prior tests to explicitly operate new visible route/disclosure controls. Preserve privacy/retry/validation assertions.
4. Run focused checks, then `pnpm --pm-on-fail=download run verify` and independent source review.
5. One combined actual desktop/mobile visual batch, one correction batch and at most one confirmation pass. Record actual failures/limits; no conformance or learner-outcome inference.
6. Update local evidence/context/handoff and exact tracker/publication drafts. No commit, push or shared update before Michael reviews and explicitly approves the concrete batch. Earlier publication approval is exhausted; preserve unrelated AGENTS.md changes and local-only recording material.

## Done When

UR01–UR08 have actual implementation/check/review evidence or explicit unresolved limits. Required verification passes and blocking findings are resolved. Source/tracker drafts are reviewable. Local implementation is not publication, human design approval, educational validation or video completion.
