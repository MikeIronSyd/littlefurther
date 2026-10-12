# Usability and layout refinement — 11 October 2026

## Goal

Implement the combined usability fixes and layout refinements selected by the user after the [whole-UI review](../reviews/2026-10-11-ui-specialist-review.md), baseline `5f222238b2dceb1027db745d8fdd1b4c10b53b3e`. Make errors actionable, limits truthful and the learning task easier to scan. Preserve existing date/timezone/study-minute behavior while improving hints. This is an Amber/LittleFurther refinement, not new product scope.

## Context Pointers

Settled decisions: Track2/all five capabilities, learners generally, exact A Original, EN/FR, native TypeScript/DOM/CSS, optional private peer support, local server. Read AGENTS, PRODUCT/DESIGN, capstone spec, UR01–07/09 and the control-readability contracts. [Precode references](../designs/usability-layout/README.md) are synthetic editable HTML/CSS/SVG, not screenshots of implemented behavior. Root inspected all six rendered references before production edits. Layout assessment used existing source/captures independently of the subsequent single layout detector (exit0, empty findings); mechanical silence does not prove usability.

### R32 research ledger

| Need | Verified findings and sources | Status |
| --- | --- | --- |
| Scope and decisions | Explicit proceed; combined fixes/layout; presentation/hints only for date/timezone/minutes. Grill-me/grilling decision frontier empty. Metadata UR08 and unrelated design drift UR10 deferred. | Satisfied |
| Error contract and validation | ApiError already includes optional field; domain emits lowercase invalid_input plus timezone/references/availabilityDates/goal/targetDate/stepTitle/scheduledDate/estimatedMinutes/minutes/reflection. Current RequestError drops field. Status precedence stays intact; no server change. Repeated step errors lack row index: never guess one. Client URL checks must mirror existing HTTP(S), no credentials, max count/length; distinguish malformed links from excess count. Existing topics/availability helper preserves hint IDs. | Satisfied |
| Focus/lifetime | lockForm disables active controls; preferences live failure lost focus in review. Current() guards main views; editor/study need explicit current predicate plus connected node checks for added recovery. Unlock before focusing; late callbacks must not move focus or mutate a new view. Keep existing idempotent saves and dirty guards. | Satisfied |
| Limits and targets | LIMITS.steps50; renderSteps is authoritative after add/remove. Add remains enabled at50 currently. Full checkbox label24px in live prior review; existing native22px glyph stays. Full label minimum44px is project floor, distinct from WCAG minimum/exceptions. | Satisfied |
| Spatial structure and circle writes | Existing learning arrangement preserves DOM/focus across799px breakpoint. Reduce only scoped intro type/gaps, keeping goal/introduction/current step/action order. Activity overview/history already semantic; add populated completion/change type sections and h4 record titles; keep data order/counts. Circle has outer Back plus per-view Back; new shared wrapping nav must be included in write locking and uncertainty cleanup. Repeated action identity can use visible name/message/expiry via aria-labelledby, including confirmation/cancel. | Satisfied |
| Guidance and reference | Companion accessibility checklist plus primary W3C [form feedback](https://www.w3.org/WAI/tutorials/forms/notifications/), [error identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html), [target minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), retrieved11October. Preserve hints and associate errors; focus erroneous input when known; no universal44px WCAG claim. Six native synthetic references rendered/inspected with no overflow. | Satisfied |
| Verification and delivery | Existing package verify pipeline and isolated4318 E2E fixtures. Existing lifecycle/privacy/auth/theme/drawer tests reused. Browser visual review uses separate synthetic data. Correct Miva Sheet/Kaneo and private dual Git destinations are authorized; saved readback required. | Satisfied |

All required research for this bounded implementation is satisfied before production edits. Reopen if a consequential unknown emerges. Independent researchers supplied useful findings before hitting their account usage limit; no completed independent implementation review is inferred from those partial research outputs.

### Spatial thesis

The specific learning action leads; generic introduction and goal context support it. Use existing grouping and surfaces, reducing intro scale rather than reordering controls or adding cards. Activity has a75ch reading measure, compact rhythm and explicit sessions/completions/changes sections. Circle navigation is one wrapping native-button row above the title. Narrow layouts keep reading/tab order and vertical scrolling, with no clipping or hidden functions; enlarged text may legitimately wrap navigation into two rows.

## Constraints

| ID | Acceptance and quality contract |
| --- | --- |
| UL01 | Preserve known error.field in client RequestError; localized specific timezone/reference guidance, existing status precedence and safe generic fallback. Known single-field errors set aria-invalid and append error ID to existing hint describedby; clear on editing. Client reference format and count guidance differ. Never infer a repeated step row from server field alone. Retain all inputs and saved-state contracts. |
| UL02 | Auth, preferences, editor and study/completion failed submissions recover keyboard focus after unlocking to the known field or focusable error status. Guard by active view/session and connected form. Delayed failure cannot steal focus from another route/session. No credentials exposed, no auth behavior or API change. |
| UL03 | Add disabled at50 with persistent localized visible count/limit explanation, associated by describedby.49→50 disables; removal reenables. Existing row focus and disabled reorder rules preserved. The existing ability to remove completed steps with confirmation/history retention remains unchanged. |
| UL04 | Full checkbox labels minimum44px high, native22px glyph retained, wrapped label/disabled/focus/consent behavior preserved. Repeated remove-member/delete-copy/revoke-invite actions, their confirm and cancel controls have localized accessible names that include existing visible row context, without exposing private unshared data. Circle nav stays blocked during writes/uncertain state. |
| UL05 | Scoped learning introduction h1 1.75rem desktop/1.5rem mobile; supporting copy1rem; compact12px mobile heading gap/16px bottom gap. Current step heading remains1.95rem desktop/1.65rem mobile. Preserve exact encouragement/copy and existing breakpoint DOM/focus ordering. Primary action is earlier with identical fixture than prior603.94px mobile position; no fixed/sticky action, menu or new destination. |
| UL06 | Activity max-width75ch with compact rhythm (max40rem); explicit localized completion/scope-change h3 sections when populated, session section always including existing empty state. Record titles h4, reflection label styled secondary rather than a skipped heading. Preserve all records, order, calculations and self-report statements. Circle Back destinations share one wrapping nav with existing labels, native callbacks/44px/underlines/dirty protection. |
| UL07 | Improve existing timezone/date examples and recorded-minute hint; keep IANA input/datalist, ISO textarea parsing/deduplication, number defaults/limits, five-minute restart and no timer. Show estimated duration separately from reported-time form. No new date picker, defaults, server or schema behavior. |
| UL08 | Run meaningful affected tests and full `pnpm --pm-on-fail=download run verify`, git diff --check. Bounded actual desktop/mobile/theme/EN-FR/enlarged/forced-colour review, independent acceptance-linked review, update records and both trackers, publish intended non-secret source normally to both private repos and verify exact heads. Formal design approval/outcomes/video remain separate. |

Keep no new dependencies/fonts/icons/branding/API/schema/server/auth/guest features. Client helper changes remain in ui/api; main owns view/session predicates; rendering modules retain native controls and existing action closures. Avoid broad refactoring. Required checks may not be weakened to pass. Use only isolated synthetic data; never clear ordinary dev database. Root-text enlargement is distinct from browser zoom/full assistive-technology conformance.

### Implementation sequence

1. Close R32 and inspect reference gate (complete before source edits).
2. Generalize existing field-error helper, preserve request field payload, repair failure focus and add localized guidance; limit feedback in editor.
3. Apply learning/Activity structure, circle nav/context labels, checkbox targets and scoped styles.
4. Add acceptance-linked behavior/geometry regressions. Run focused then full required pipeline; resolve real failures.
5. One batched rendered review with at most one consolidated correction/confirmation. Independent review; evidence and exact tracker reconciliation; normal dual-private publication and head verification.

### Research addendum from focused verification

The first focused run found that a confirmation trigger detached during a language change loses its i18n binding when disconnected bindings are pruned. Cancelling then restored its previous-language text. Source inspection verified the cause; rebinding the existing action before reinsertion preserves the specified language and focus contract. The agent investigated this bounded lifecycle cause before correcting it; this addendum records that research after the correction. No new requirement or unknown remained. The French navigation fits one row at320px normal text and wraps at200% enlargement; wrapping is permitted when needed, not required at every narrow width. Test expectations now use existing product labels rather than alternative wording. Timezone hints explicitly include the existing valid UTC suggestion.

UL05 also sets the mobile goal heading to1.2rem, preserving its context role while the current-step heading remains1.65rem. This completes the scoped metric record; no heading order or wording changes.

## Done When

UL01–08 have actual evidence in [verification](usability-layout-verification.md). Initial reference rendering is not implementation verification. Research, build, tests, independent review, saved tracker readback and publication statuses are recorded separately; unavailable checks remain open. No formal approval, conformance, educational benefit, time savings or Plan Mode invocation is inferred.

Implementation and scoped acceptance are complete: the final required pipeline exits0 with56domain/server and87browser passes, separate-process persistence, static/build checks and audit. Bounded visual evidence and the no-blocker independent review are retained separately. Exact E024 tracker reconciliation, artifact dual-private publication and the delivery-only closeout are recorded in verification. Formal human design approval, learner validation and final demo/submission remain separate.
