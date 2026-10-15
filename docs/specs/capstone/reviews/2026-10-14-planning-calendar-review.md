# Independent planning-calendar review — 14 October 2026

## Goal

Review the local uncommitted planning-calendar increment against PC01–PC06 using learning-journey-review and the incumbent Impeccable/accessibility guidance. No human approval or publication is inferred.

## Context Pointers

[Contract](../increments/planning-calendar.md) and [actual verification](../increments/planning-calendar-verification.md). Independent `planning_final_review` inspected code, tests, saved focused receipts and desktop/French enlarged captures without authoring code or operating the browser. Earlier `calendar_research` reviewed root's AI integration; its component assessment was self-review and is labelled accordingly.

## Constraints and findings

1. **Ready AI proposal remained after locale change — closed.** Source review found completed responses left the cancellation registry. Keeping the existing invalidator registered while a response exists makes the existing locale/view cancellation reset ready proposals and restore manual controls. Focused regression checks EN/FR invalidation without a new request/save, preserving inputs and selected dates.
2. **Unadded invalid date blocked saving selected dates — closed.** Independent final review found native bounds on the pending selector affected form-wide validation. The correction excludes only that unsaved selector during synchronous reportValidity and restores its precise disabled state in finally, before any async save lock. The new regression verifies actual rangeUnderflow, selected-only POST,503failure recovery and successful retry;2/2 targeted cases passed.
3. **Date-list reconstruction/binding growth — addressed without a speed claim.** Component self-review identified full-row reconstruction on each Add. Keyed row reuse now preserves existing controls and locale bindings. The actual366-date test passed; no measured performance improvement is claimed.
4. **Pending-date empty hint — no scoped blocker.** Independent follow-up inspected the user's requested visibility correction, localized copy and actual2/2passing receipt (18.3seconds). A valid pending candidate replaces the empty hint while the collection/count remain empty; clearing, adding and removing update both hints in English/French. Native input/change listeners and collection rendering cover the state changes. Explicit Add and the earlier synchronous save exclusion remain intact.

No additional blocking source finding remains in the bounded review. ISO collection validation, conditional manual topics, sourced AI review, explicit Save, pending cancellation, locale/input invalidation, date conflicts and retained history fit the contract. The reviewer inspected passing focused records rather than executing tests. Actual native-popup and broad browser evidence belong in the verification record.

Full-page screenshot skip-link positioning is retained as a capture limitation; source has the existing fixed/offscreen treatment and no new skip-link change. No product defect or exhaustive accessibility pass is inferred from that anomaly.

## Done When

The two behavioral findings are closed through source corrections and actual focused tests. Final required pipeline and evidence/document readbacks remain pending; no shared write, release, human design approval or learner outcome is claimed by this review.
