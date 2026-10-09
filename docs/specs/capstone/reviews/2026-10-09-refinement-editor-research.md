# D01/D03/D04 — editor correction research

Recorded: 9 October 2026, Africa/Lagos. Inspected source: `526ec3402c09e2e098e83dc44cd658428830f2cb`. This report is source and primary-document research; it contains no new product execution or screen-reader result.

## Goal

Define the smallest editor corrections for stable keyboard focus after step changes, precise date/topic errors, and navigation to the selected existing step. Preserve the current Amber editor, date textarea, complete-plan access, unsaved protection, and persistence contracts.

## Context Pointers

Read `AGENTS.md`, `project-context.json`, the capstone specification, P10 reuse contract/verification, the 8 October critique/source check, and the editor, route, journey, UI/i18n helpers, shared contracts, domain validation, store, and browser-test patterns. The selected five-fix scope and current date input come from root's task brief; the chosen interfaces below come from root's refinement contract. Applied installed Impeccable `harden`, `clarify`, and `distill` guidance; reused root's once-per-session context without rerunning it. The craft floor remains an immediate pre-edit requirement.

### Satisfied factual research

| Need | Findings and supporting evidence | Status / unresolved question |
| --- | --- | --- |
| Stable row identity and payload boundary | `plan-editor.ts:12–14` extends optional-ID `StepInput`; `:151–236` replaces every row; reorder/removal callbacks rebuild without focus restoration. New draft/add rows have no ID (`:260–266`, `:284–294`). `contracts.ts:27–32` makes IDs optional; `validation.ts:112–115` rejects extra step properties and an ID on creation. `store.ts:205–213/229–237` generates persisted IDs. | Satisfied. A UI-only ID is required for all draft rows and must be removed from each request DTO. |
| Keyboard boundary, removal, and empty behavior | Up/down are disabled at the first/last row (`plan-editor.ts:192/206`); removal resets its acknowledgement and can empty the draft (`:207–236`). [HTML focus rules](https://html.spec.whatwg.org/multipage/interaction.html#focusable-area) exclude disabled elements. Current test hooks use index-based `title-0` names and fieldset legends (`tests/e2e/integration.spec.ts`, `journey.spec.ts`). | Satisfied. Preserve index-based names and existing removal rules. Root chose the moved row's Action input when the original move control becomes disabled. |
| Exact availability parsing, limits, and date validity | `datesFrom` splits whitespace/commas, trims, omits empty values and deduplicates in first-seen order (`plan-editor.ts:15–22`). `validDate` rejects malformed/out-of-range/normalized invalid calendar dates (`:23–31`). Domain calendar dates cover 2000–2100 and availability must contain 1–366 distinct dates (`domain/validation.ts:61–67/99–104`, `contracts.ts:231–236`); server sorts accepted dates. | Satisfied. Preserve parsing, raw textarea text and server validation; validate unique parsed count and identify every invalid token. |
| Manual-topic errors and hidden template state | Template actions come from the selected locale; manual actions come from trimmed nonempty lines (`plan-editor.ts:244–251`). Topic controls hide for template/existing plans (`:98–100`) and after review (`:271`). One generic `invalidDraft` currently handles absent dates, invalid dates, absent actions and excess actions (`:252–258`). Domain title limit is 240 and step limit 50 (`validation.ts:108/116`, `contracts.ts:233–234`). | Satisfied. Errors for missing/excess/overlong manual topics only apply while generating a manual draft; no topic error for a curated template or existing editor. |
| Field association, locale updates, and native submit order | `ui.ts:35–52` generates field IDs, associates labels and adds a hint ID to `aria-describedby`; `notice` supplies error/status semantics (`:59–64`). `i18n.ts:754–765` updates connected bound nodes in place. [W3C ARIA21](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21) supports `aria-invalid` plus associated explanatory text. [HTML submission](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#form-submission-algorithm) validates constraints before firing submit, unless the no-validate state is set. | Satisfied. A local field-error helper can reuse existing fields/styles and preserve hint association. Set `form.noValidate = true`, then retain the explicit `reportValidity()` after custom validation. |
| Selected-step route and focus lifetime | `journey.ts:115/128/154` shares one zero-argument edit callback. `main.ts:315–338` applies `canLeave()`, calls `beginView`, mounts the editor, then focuses h1; saved/cancel/dirty callbacks retain current-view checks. `ui.ts:66–73` focuses h1 synchronously. | Satisfied. Pass the selected persisted step ID without changing the route, then invoke synchronous selected focus after root's heading focus. Missing/stale ID must preserve the ordinary heading destination. |
| Persistence/history and existing meaningful checks | Submit maps draft fields and preserves revision/request-signature retry handling (`plan-editor.ts:305–338`). Completed fields are readonly (`:157/163/170`); the store rejects changed completed details and preserves existing snapshots (`store.ts:238–254`). Existing browser cases cover history after removal, failed saves, draft language preservation, and late responses protecting session/view/dirty state (`journey.spec.ts`, `integration.spec.ts`). | Satisfied. No API, revision, session/view, history, or dirty-guard change is needed. |

### Exact proposed interface and behavior

Root accepted this interface before implementation:

```ts
showPlanEditor(
  host, templates, existing, onSaved, onCancel, dirty,
  options: { selectedStepId?: string } = {},
): () => boolean;
```

The returned `focusSelectedStep` callback focuses the selected row's existing Action input and returns `true` only when that row is mounted. Root calls it immediately after `focusHeading(shell.main)`. With no matching persisted ID it returns `false`, displays no selected-step context and leaves heading focus unchanged. No timer, microtask, navigation hash, step-only editor, or automatic dirty change is necessary. Selected context uses `editingStepContext` with its current position/total, associated with the selected Action input in addition to its normal label. All steps remain present.

Each draft row gets a stable UI-only `uiId`, initialized once when copied/generated/added. Rebuilds look up mounted row controls through that identity, while keeping `title-{index}`, `date-{index}`, and `minutes-{index}` names. Existing persisted IDs remain unchanged. Save mapping strips both `completed` and `uiId`; creation must still send no persisted step IDs.

| Operation | Post-render focus | Feedback |
| --- | --- | --- |
| Move up/down within boundaries | Same move control in the same stable row. If that control becomes disabled at the boundary, focus that row's Action input. | `stepMoved`, current `{number, total}` in a persistent polite, atomic status region outside the replaced rows. |
| Remove any row | Next surviving row's Remove control; if absent, previous row's Remove; if none remain, Add a step. | `stepRemoved`, current `{total}`. Preserve reset acknowledgement, required acknowledgement for saved removals, and existing empty-history notice. |
| Add a row | New row's Action input. | No unrelated status/dirty behavior change. |

Use a persistent status element so row replacement does not remove the announcement target. Its complete localized message, not only its changing number, is updated. This follows [W3C status guidance](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html); actual assistive-technology announcement remains a later observation, never inferred from role attributes.

### Exact localized keys accepted for root's i18n edit

| Key | English | French |
| --- | --- | --- |
| `stepMoved` | Step moved to position {number} of {total}. | Étape déplacée à la position {number} sur {total}. |
| `stepRemoved` | Step removed. Active steps: {total}. | Étape retirée. Étapes actives : {total}. |
| `editingStepContext` | Editing step {number} of {total}. | Modification de l’étape {number} sur {total}. |
| `availabilityRequired` | Add at least one available date. | Ajoutez au moins une date disponible. |
| `availabilityInvalid` | Fix these dates: {dates}. Use YYYY-MM-DD from 2000-01-01 to 2100-12-31. | Corrigez ces dates : {dates}. Utilisez le format AAAA-MM-JJ, du 2000-01-01 au 2100-12-31. |
| `availabilityTooMany` | Use at most {max} available dates. | Utilisez au maximum {max} dates disponibles. |
| `topicsRequired` | Add at least one topic or section, one action per line. | Ajoutez au moins un sujet ou une section, une action par ligne. |
| `topicsTooMany` | Use at most {max} topics or sections, one action per line. | Utilisez au maximum {max} sujets ou sections, une action par ligne. |
| `topicsTooLong` | Shorten topics on lines {lines} to at most {max} characters each. | Limitez les sujets des lignes {lines} à {max} caractères chacun. |

Before draft review and save, availability checks distinguish empty parsed dates, invalid tokens, and an excessive unique count. A mixed list such as `2026-10-08, tomorrow` explicitly identifies `tomorrow`; invalid calendar values and out-of-range values are included. Before manual draft review, topic checks distinguish no nonempty lines, more than 50 actions, and trimmed titles over 240 characters using original textarea line numbers. Existing native goal/step date/minutes/removal-confirmation checks still run through `reportValidity()` after scoped custom validation.

Field errors use existing `notice error` styling beside their control, preserve the hint ID while appending the error ID to `aria-describedby`, and set `aria-invalid="true"` only while a demonstrated error exists. An attempted action focuses the first invalid visible field; later input clears only that field's stale error without moving focus, and the next attempted review/save rechecks it. Clearing an error removes its association and invalid state. Changing to a template clears any now-hidden topic error. Retained errors and operation/selected context messages update through `bind` on EN/FR changes without rebuilding or translating learner text. Error text is set as text content. [W3C error identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) requires understandable textual identification; these are chosen recovery details, not a certification claim.

## Constraints

This agent owns only `src/client/plan-editor.ts` after root closes the complete research/specification gate. Root owns route/journey/i18n; a separate agent owns tests. No CSS, new mockup, date picker, runtime fetching, server/API change, tracker write, receipt, phase change, commit, or push. Keep field names, completed readonly state, removal confirmation, raw input, dirty marking, native validation for other controls, revision and idempotent retry handling unchanged. Topics with disallowed control characters and unsafe references retain existing HTTP-boundary validation; this scoped refinement does not claim to mirror every server validation rule.

## Done When

All factual needs above are satisfied with source or primary-document evidence; root's consequential interface/focus/message decisions are recorded. There is no remaining editor-specific research blocker. Production code remains unchanged at this report's completion. Root must close its aggregate research gate before authorizing the editor edit. Later verification must observe interior/boundary moves plus the next Tab, all removal positions and empty state, draft/add stable identity and clean DTOs, exact availability/manual errors and recovery, EN/FR retained state, selected/stale focus behavior, and preserved save/history/dirty protection.

### Authorized implementation handoff

After root closed R21 at11:41 Africa/Lagos and authorized the dependent editor edit, the editor implementer read the craft floor and changed only `src/client/plan-editor.ts`. The accepted interface, focus/error behavior, UI-only identity stripping and exact catalogue keys are implemented. Selected rows expose `data-selected-step="true"`; all rows expose stable `data-step-id` and a `draft-step-{uiId}` DOM ID while retaining index input names. Existing UI identity uses its persisted step ID; new rows use a generated UUID. The returned callback also rejects a detached Action node, preventing a later call from focusing an obsolete editor.

The topic visibility condition now includes reviewed state so a locale update preserves the post-review hidden topic control. This maintains the intended reviewed editor state; it adds no topic-entry flow. `biome format --write src/client/plan-editor.ts` formatted one file successfully; `git diff --check -- src/client/plan-editor.ts` passed. Independent source review and root-owned compiler/browser verification remain pending. The implementation handoff is not a verified behavior claim.
