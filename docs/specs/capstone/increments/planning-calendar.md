# Calendar availability and unambiguous AI review

## Goal

Replace manually typed availability lists with calendar selection and make a generated AI plan's review route unambiguous. Learners should select their study dates and review generated steps without retyping topics. Preserve explicit review/save and all manual planning.

## Context Pointers

User request14October2026 supersedes UL07's presentation-only date decision. Source baselinec3a07fe: `src/client/plan-editor.ts` owns creation/editing; `ai-assistance.ts` owns transient suggestions; target, step and Comeback dates already use native date inputs. Existing API accepts1–366 unique ISO dates, sorts on save and rejects invalid dates. No server/schema/provider change is needed. Preserve Amber, English/French, scope/history/privacy, existing keyboard/dirty-state/source contracts. Publication approval is separate from authorized local preparation.

Latest user clarification: label **Your topics or sections (optional)**. Learners with their own material may supply topics; AI planning does not require them. Manual review without a template still needs a topic to construct an action; it must report this conditional requirement rather than inventing a course or automatically invoking AI. French label: **Vos sujets ou sections (facultatif)**. This settles presentation/conditional validation without changing any API or provider behavior.

Later user clarification: **No dates selected yet** must disappear immediately after choosing a date. Source research identifies that the empty-state visibility was updated only when the selected collection changed. With zero selected dates and a valid pending picker value, show **Click Add date to include this date** instead. Clearing the candidate restores the empty state; adding a date shows the collection and removes both hints. Preserve explicit Add and selected-count semantics. This is a local visibility/copy correction, not automatic selection or another provider/data change; its focused precode reference precedes the correction.

## R43 research ledger

| Required need | Findings and evidence | Status |
| --- | --- | --- |
| Reproduce reported topic requirement | Source-traced two controls: generic Review draft steps always validates manual topics; AI Use this draft for review correctly consumes generated steps. Generic action remains alongside AI proposal | Satisfied; independent source review |
| Date/API boundaries | Availability textarea alone needs replacing; existing native target/step/restart fields2000–2100. Domain validation requires unique1–366 string dates and sorts; noValidate form requires explicit collection checks | Satisfied; source inspected |
| Native selection and accessibility | HTML date is single-value; multiple unavailable. Native picker + explicit Add + semantic removable list avoids custom calendar grid/dialog/navigation complexity. showPicker needs user activation, feature detection and safe fallback; browser controls native popup language/style | Satisfied; primary sources below; isolated reference interaction/inspection required before production edits |
| Selection semantics | Selected collection sorts chronologically; duplicate Add is announced without duplication. Pending picker date is not selected until Add. Existing draft step dates never move automatically when availability changes; conflict warnings remain | Resolved routine design decision |
| AI lifecycle | Hide competing manual topics/review only for current usable AI suggestion; restore after invalidation/discard/failure. Accept still enters editable review, never saves. Manual entry cancels pending AI; signature includes template/review state | Satisfied; source/callback design |
| Checks and visual authority | Current native DOM/Amber design and accessibility guidance inspected; affected helpers/five specs inventoried. Four light/dark1440/320 references rendered and root visually inspected before frontend edits. Isolated Edge genuine-button showPicker calls succeeded in all four; native popup captured/inspected. CUA inspection separately confirmed the reference UI and usable native-input fallback | Satisfied before production edits |

Primary sources: [HTML date state](https://html.spec.whatwg.org/multipage/input.html#date-state-(type=date)), [Chrome showPicker](https://developer.chrome.com/blog/show-picker), [MDN date input](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date), [W3C date-picker example and limitations](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/). Documentation establishes the platform contract; actual browser checks remain separately recorded.

R43 is closed for this bounded scope before production edits. Reference: [focused design](../designs/planning-calendar/reference.html), four sibling PNGs. `node .local/planning-calendar/reference-check.mjs` exited0: four no-overflow/native-date/44px checks and four successful native picker requests; `.local/planning-calendar/native-picker.png` shows the actual October calendar in isolated Edge. This is precode feasibility/reference evidence, not implemented application acceptance. No consequential research blocker remains; reopen if one emerges.

Implementation review addendum, researched before dependent correction: ready responses were removed from aiPanel's operation registry in `finally`, so the existing language-change cancellation cleared only pending requests. The new ready-proposal/manual-route state must also reset on language change. Retain the panel invalidator in the existing registry while a response exists; Use/Discard/input/locale/unmount invalidation already removes it. This preserves response ownership and existing lifecycle calls without another API or new request. Add a ready-result locale regression; all six contextual actions remain in full verification scope. This source-traced lifecycle need is resolved before the correction; no remaining research blocker.

Final-review addendum, researched before dependent correction: the pending date selector's native min/max/bad-input validity participates in `form.reportValidity()`. A rejected, unadded pending date could therefore block saving an otherwise valid selected collection. Saving must validate the selected collection and all saved fields, while excluding this unsaved selector from that synchronous native form check. Temporarily disable only the selector during reportValidity, restoring its exact prior disabled state in finally; Add retains native bounds and explicit validation. Add a rejected-pending-date regression. The first full pipeline was interrupted before completion for this correction; its partial results are not a full pass.

## Constraints and quality contract

- Add a focused client availability component: fieldset/legend, labelled native date input,44px Open calendar and Add date buttons, count/hint/status and semantic selected-date list. Each date has a localized44px Remove action. Feature-detect/catch showPicker; unsupported/blocked popup leaves the native input usable and focused. No dependencies/custom date grid.
- Explicit collection errors associate with/focus the date input; retain supported bounds/limit. Native picker pending input remains distinct from selected dates. Selected dates are unique and chronological; removal chooses the next/previous removal action or input for focus. At the limit Add is disabled with explanation, removal remains possible. Preserve pending input/list across language changes.
- Calendar collection changes trigger existing dirty, conflict and stale-AI handling. Never silently reschedule existing reviewed steps. All submitted DTOs remain ISO string arrays.
- Add an optional suggestion-state callback inside aiPanel; it reports a current usable suggestion and resets on invalidation. Plan editor hides manual topics and generic review while its AI proposal is ready. Use the explicit localized label **Review AI draft**. Retain manual topics on discard and enforce their existing validation for manual review. Cancel pending AI before manual review and include template/reviewed state in AI signatures.
- Keep AI result validation/source provenance/session/cancellation boundaries, manual fallback and separate save unchanged. No real provider request for verification. No ordinary learner data changes for testing.
- Required commands: `pnpm --pm-on-fail=download run verify`; focused regression tests and bounded browser visual/native-popup review; independent learning-journey review. Use isolated data/mocked responses. Record actual outcomes/limits, not a claim of conformance or learner benefit.
- Local source/spec/design edits are authorized. No commit/amendment/push, tracker write or external publication until Michael reviews exact changes/destinations and explicitly approves. Existing unrelated AGENTS.md edit is preserved. Recording notes remain ignored/local.

## Acceptance criteria

| ID | Observable result |
| --- | --- |
| PC01 | Calendar can open from an accessible action; dates can be added/removed without typing ISO lists. Unique chronological selected list survives locale changes and saved reload |
| PC02 | Empty/range/duplicate/366-limit states give appropriate errors/status/focus; keyboard/44px controls,320px/enlarged text, both themes/EN-FR/forced colours remain usable |
| PC03 | AI plan with empty manual topics offers a single clear AI review path, enters editable generated steps with sources, and writes no plan before explicit Save |
| PC04 | Discard/input change/refusal/error/cancellation restores the manual route; stale AI cannot replace a manual review. Empty manual topics still fail; curated starter works |
| PC05 | Availability changes preserve authored draft/completed work, display existing conflicts and preserve dirty-state/lifecycle rules. ISO API, ownership, sources and separate saving remain intact |
| PC06 | Required verification/independent review and scoped visual/native-popup checks have recorded actual results; publication/trackers remain pending explicit approval |

## Implementation sequence

1. Close R43 through four inspected precode references and isolated native-picker interaction.
2. Implement calendar component/styles/localized text; integrate creation/editing and existing validation/conflicts.
3. Implement AI suggestion-state/manual-review lifetime correction.
4. Migrate meaningful affected tests and add PC regressions; preserve domain/server invalid-input tests.
5. Run focused checks, bounded app/native-popup review and required pipeline; independent review/fix any blockers.
6. Update current user/design/spec records and prepare exact local diff and tracker/publication proposals for review; do not commit or write shared content yet.

## Done When

PC01–PC06 have actual evidence, local changes are reviewable and remaining limitations are stated. Approval covers only concrete shared actions presented later; no publication is inferred from a passing test.
