# Learning lifecycle references

## Goal

Show the coordinated archive, deletion, correction and recovery controls before frontend implementation.

## Context Pointers

[Contract and research](../../increments/learning-lifecycle.md), LC01–LC07. The [editable reference](reference.html) preserves the incumbent Amber colours, system typography, soft secondary controls and inline confirmation vocabulary.

## Constraints and actual reference checks

On 15 October 2026, root rendered and inspected [desktop light](reference-1440-light.png), [desktop dark](reference-1440-dark.png), [320px light](reference-320-light.png) and [320px dark](reference-320-dark.png) before authorizing production frontend edits. All four isolated Edge reference checks had no horizontal overflow and button heights of at least44px. [Provenance](reference-provenance.json) records the actual time, viewport and classification.

This board shows several states together to review the controls; it is not a single application screen. Content is synthetic. No learner record or provider request was used. Corrected completion entries have no duplicate correction action. Historical-link choices start unchecked. References do not establish implemented behavior, formal design approval or accessibility conformance.

## Done When

Implementation, actual application captures, test evidence and independent review are recorded separately in the increment verification. Publication remains pending explicit approval.

## Actual application capture batch

These are **actual application interfaces, synthetic isolated records, AI disabled, no provider calls**. A fresh account, manual plan, study session, completion/correction, scope removal and archive/restore were created through visible native UI controls at `http://localhost:4335/`, using the separate `.local/learning-lifecycle/browser-data` store. Ordinary learner records were not used. [Capture provenance](app-captures.json) records the base revision, exact working-tree source hashes, UTC capture time, viewport/capture dimensions, measured controls and limits.

| Surface | Image | Viewport / capture |
| --- | --- | --- |
| Corrected completion and retained private session | [Activity, English/light](app-activity-corrected-light-en.png) | 1440×1000 / 1440×1570 |
| Active plan management | [Journeys, English/light](app-journeys-active-light-en.png) | 1440×1000 / 1440×1000 |
| Fresh permanent-deletion preview, acknowledgement unchecked | [Deletion, English/light](app-delete-confirmation-light-en.png) | 1440×1000 / 1440×1000 |
| Read-only archived path and private history | [Archived plan, English/dark](app-archived-readonly-dark-en.png) | 1440×1000 / 1440×1554 |
| Removed-step preview, historical link/conflict choices unchecked | [Restoration, French/dark](app-removed-preview-dark-fr.png) | 320×900 / focused section 296×1205 |
| Permanent-deletion preview at 200% root text | [Deletion, French/light](app-delete-confirmation-light-fr-enlarged.png) | 320×900 / focused form 296×1752 |

The completed bounded batch and one correction-confirmation batch measured no horizontal overflow in all six captured states and the additional French320 forced-colours/reduced-motion state. Native Tab traversal reached Archive; cancelling the deletion confirmation returned focus. Deletion acknowledgement and historical-link/conflict choices started unchecked, with the corresponding final action disabled until acknowledgement. No external browser request occurred.

The initial batch found the archived screen's underlined **Back** button measured32.656×44px. A scoped minimum-width correction preserves its appearance; the single final confirmation batch now measures it44×44px, and all visible measured buttons meet the target. Initial capture automation stopped on that measurement; its mobile navigation selector was also corrected to open the existing drawer before choosing Parcours. Original pre-correction captures/receipts are retained privately under `.local/learning-lifecycle/pre-correction-captures`; the six gallery images and manifest show the rebuilt corrected source. Root's independent image inspection and the required full application pipeline remain separate evidence. Native OS calendar appearance and exhaustive accessibility conformance were not re-established by this batch.

Capture limitation: the enlarged French deletion image contains a white **Aller au contenu** skip-link overlay that masks part of the confirmation copy. This fixed-position full-page/element-capture anomaly was also seen in the earlier calendar evidence; no new application defect is established. The image is not an unclipped enlarged-text reference. The separate live layout measurements and keyboard/confirmation tests remain the behavioral evidence; they do not remove this screenshot limitation.
