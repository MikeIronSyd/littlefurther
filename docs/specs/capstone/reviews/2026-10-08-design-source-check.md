# Design assessments — independent source check

## Goal

Check Assessment A's three findings and the comp-hash question at source revision `0e3968f104f92ba0b2fe329156c494ad104f4568`, 8 October 2026, Africa/Lagos. All three described source mechanisms are confirmed. After B's release, two additional source findings were checked below. Their P2 framing is supported; this inspection establishes no additional live behavior or whole-criterion failure. No production change is proposed by this report.

## Context Pointers

Read [Assessment A](2026-10-08-design-assessment-a.md), [pipeline review](2026-10-08-design-pipeline-review.md), relevant client/store/contracts, and [AC01–AC03/AC11](../spec.md). Applied [learning-journey-review](../../../../.agents/skills/learning-journey-review/SKILL.md), installed Impeccable guidance and its critique reference; reused existing context without running it again. A's check preceded B's release; root subsequently supplied B01/B02 for narrow source verification. No detector output was read. Current source is unchanged; root-owned research/review files are concurrent work.

| Finding / AC | Expected behavior | Source evidence | Result / limit |
| --- | --- | --- | --- |
| A01 / AC01, AC11 | Availability entry and recovery explain the actual problem. | `plan-editor.ts:15–31` parses/deduplicates tokens and validates calendar dates; `:76` creates a raw textarea; `:243–258` groups missing/invalid dates, missing actions and excess actions under `invalidDraft`. `i18n.ts:316/671` asks for a topic and valid date regardless of selected template or invalid token. | **Verified fail** for source-level error specificity. Assessment A owns the reproduced `2026-10-08, tomorrow` case; this reviewer did not execute it. |
| A02 / AC01, AC03, AC11 | “Edit step” should preserve the selected-step context. | `journey.ts:128/154` passes the same zero-argument `edit` callback for both controls. `main.ts:315–338/445` opens the whole plan and focuses its heading. `showPlanEditor` has no selected-step parameter. | **Verified fail** for the claimed source-level affordance/context mismatch. Mobile heights and scrolling distances are Assessment A's observations, not independently remeasured. |
| A03 / AC02, AC03 | Studying should make the already supplied material discoverable. | `plan-editor.ts:111` renders template-source links; `:312` saves only manually entered references. `journey.ts:291` renders plan references in the overview; `showStudy` at `:309–419` renders neither references nor template sources. | **Verified pass** for the reported absence; live study behavior is **unverified here**. This is a connected-flow improvement, not proof that source traceability is wholly absent. |
| B01 / AC11 | Keyboard editing retains a meaningful focus location. | `plan-editor.ts:152` replaces every row; move/remove callbacks at `:187/201/213` call it without restoring focus. | **Verified fail** for source focus restoration. B's reported Enter→BODY observation was supplied by root, not repeated here. |
| B02 / AC04, AC11 | Rhythm status has understandable localized names. | `journey.ts:84` sets each name to raw ISO plus `✓`/`—`, outside locale binding. | **Verified fail** for localized semantic status text; no human screen-reader pronunciation claim. |

## Constraints

**Smallest corrections to consider after specification.** A01 can first separate missing topics, missing dates, malformed date tokens and excessive actions, using localized field-associated messages while preserving input/draft. A new multi-date selector is a larger interaction proposal, not already-required functionality. A02 can either label the existing full-plan destination accurately or pass the selected step ID and focus/identify its existing fieldset. A separate step-only editor requires a new contract; retain validation, removal confirmation, history and dirty-state protections. A03 can expose existing safe learner references and the matching template/version's source links during study, with the established external/internet disclosure. Specify locale/version lookup and empty/manual cases before implementation; add no fetching, translation, AI or hosted lessons.

B01 needs stable row identity and explicit post-move/removal focus, including boundary/empty cases. B02 needs locale-bound dates and neutral status words such as “Study recorded”/“No study recorded”; preserve underlying progress rules. Both require focused keyboard/language verification after correction.

**Hash semantics remain unresolved.** Read the measured spec and actual PNG, searched installed textual references/scripts for `compSha256`/hash semantics, and invoked only installed engine0.1.9 `comp-spec --help`. Neither help nor the relevant installed docs defines this field's byte domain. Raw `next-turn.png` SHA-256 is `27f77627e6b806782750654dcdbf62241c500db361a0bbdc13357d575af31364`; the spec stores `099a715facdadab06e9db96c668d507f92cc3601201f14baa8192605f2c4edc8`. Difference alone does not prove changed pixels, stale measurement or invalid provenance. Current packet capture/verification reported by the pipeline reviewer does not resolve the historical field's semantics. No binary extraction, spec regeneration, hash replacement or phase/receipt decision was performed.

## Done When

This bounded check is complete. Root can synthesize both released assessments. Any material UI correction needs its scoped research/specification and subsequent behavior evidence. The hash question remains explicitly unresolved; no further investigation was requested. No browser, detector, app test, product edit, tracker action or formal design advancement occurred; only this report was authored.
