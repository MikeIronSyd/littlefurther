# Hover-border verification

## Goal

Verify HB01–HB06 in [the contract](hover-borders.md), baseline92d7070. Implementation and technical checks are complete; final review and delivery states are recorded separately below.

## Context Pointers

R33 source/primary-guidance and independent selector inventory are complete. The four precode synthetic references rendered exit0 and root inspected all four; image-first gate closed before frontend edits. Previous UL/CR passes are dated evidence, not a new increment pass.

## Constraints

Only isolated synthetic app/test data. Ordinary4317 learner data unchanged. Synthetic reference PNGs are distinct from actual app captures. Root-text enlargement/touch emulation/Edge evidence do not establish physical-device or full assistive-technology conformance. Formal design approval remains separate.

## Done When

Record precode reference closure, exact command outcomes/corrections, HB evidence, independent review, saved tracker comparisons and the recorded source reference. No benefit/time-saving/adoption/video claims without their evidence.

## Actual ledger

Research/specification and four-image gate closed before production edits. `node docs/specs/capstone/designs/hover-borders/render.mjs` exit0; reference checks show44px targets/no horizontal overflow and no size shift between border states. Desktop1280×900 and mobile320×1970 fullpage outputs are synthetic references, distinct from later implementation evidence.

Production CSS implemented after gate closure; scoped formatter/lint and build passed. First focused command `pnpm --pm-on-fail=download exec playwright test tests/e2e/control-readability.spec.ts tests/e2e/hover-borders.spec.ts`:7passed/1failed in1.4minutes. All5updated connected/mobile/forced cases and2new pointer/keyboard/theme cases passed. Synthesized CDP touchStart observed `:active` false at an immediate read; R33 reopened for cause investigation. No source defect or complete pass is inferred. A later final test addition explicitly asserts sidebar press geometry; the required full run must cover that final state.

Root's bounded actual browserMCP batch captured and inspected8native JPEGs: desktop light/dark rest, theme hover and dark keyboard; mobile French light/dark rest plus circle disclosure. [Evidence README](../designs/hover-borders/README.md) distinguishes partial fade readings/native dimensions/content outside images. Samples have no horizontal overflow and preserve44px header targets/29px panel icon; dark hover/focus border matches the Amber logo. EN/light presentation was restored to FR/dark, viewport reset and root review tab closed. No learner study/sharing or normal4317 data changed. These are observed samples, not final touch/full-pipeline acceptance.

Ignored synthesized-touch research (two bounded probes, the second collecting native event/hit-target evidence) established that Edge's `:active` becomes true during trusted compatibility mousedown after touchEnd, not the earlier touchStart read. Passive one-time observation now retains trusted/active/exact-brand/transition0s checks, plus no-sticky/native-action assertions. First corrected single-case run reached those assertions but failed cleanup's unconditional touchCancel after already-ended gestures; cleanup now cancels only an unfinished touch and always detaches. No app code changed. Final `pnpm --pm-on-fail=download exec playwright test tests/e2e/hover-borders.spec.ts --grep 'press feedback'`: exit0,1passed in10.0seconds (case2.7s). Scoped test format/lint passed.

Final required `pnpm --pm-on-fail=download run verify` (execution80269): exit0. Strict compiler/lint/format/build passed;56domain/server tests passed, separate-process restart/persistence passed,90browser cases passed in16.3minutes and low-severity audit reported no known vulnerabilities. The3new cases are included in90;5existing CR cases were updated for the explicitly superseded style contract. Earlier failed attempts remain above; assertions and required checks were not suppressed. No production edit followed this successful full run.

## Acceptance evidence

| AC | Actual implementation/check evidence | State/limit |
| --- | --- | --- |
| HB01 | Scoped CSS roles, updated connected-action tests and2theme-specific border/fade cases; actual8-image batch | Verified in final90-case suite; soft resting fill and open-account state retained |
| HB02 | Sidebar border0/transparent rest, same44px box/29px icon; native/forced drawer and final press geometry tests; actual mobile utilities | Verified in final suite; focus outline is distinct from a border |
| HB03 |150ms ease-out border-colour only; immediate focus/press, exact rendered-brand matching and unchanged geometry | Verified in final suite; configuration/endpoints are not exact-frame timing or physical-device claims |
| HB04 | Fine-pointer gate/reduced-motion/system-token rules; forced/reduced cases and corrected native activation touch case | Verified in final suite; synthesized Edge touch, native activation timing documented |
| HB05 | Only styles.css production changed; protected primary/path/field/password/menu/link styles; connected/auth/200%/EN-FR and actual desktop/320 evidence | Verified in final suite including auth/privacy/lifetime/error/draft regressions; bounded engine/fixture coverage |
| HB06 | R33 and4precode boards, full pipeline exit0, [independent source/test/pixel review](../reviews/2026-10-12-hover-borders-review.md) with no scoped blocker; exact E025 saved readbacks and source evidenceimplementation publication | Verified within stated technical/delivery scope; formal design approval separate |

## Judging evidence

J1 links the actual conversational Plan Mode planning, approved specification, image-first artifacts, CSS/test/review work, project review/evidence skills and browserMCP results. No GUI mode interaction or tool availability alone is claimed as work. J2 demonstrates a specific interaction choice in the educational engagement journey using synthetic data, without learner-benefit validation. J3 preserves the stack/modules and existing setup documentation; prior dated setup rehearsal remains separate. J4 adds working control states/captures for the planned3–5minute demo; recording/duration/playback/submission remain pending.

## Delivery

At delivery's start, both tracker saves and source publication were pending. Actual results follow below. Normal Git publication only; project data/history never goes to global recovery. Rollback is a source revert of this presentation-only increment and rebuild; preserve the existing data directory.

Before staging, local record checks passed30files/171local links/4JSON documents/8actualJPEG origin labels with0findings; `git diff --check` passed. Independent technical review has no blocker and explicitly leaves delivery pending at its review time. No source/contract/dependency change outside styles.css, no production edit after the successful full run. Normal4317 `/api/health` returned `{"status":"ok"}`; temporary4319 review runtime stopped and root review tab/viewport cleaned up.

Source evidence: [Implementation/review artifact0c49b93](https://github.com/MikeIronSyd/littlefurther/commit/4e9cd327693626fbaf6a3fd741fd64ab36ed6211). Recorded source inspection covered 30 intended files/paths. GitHubMCP exact-SHA reads returned404 for this private repository; personal combined-status/workflow calls also returned404. CLI readback supplied successful fallback evidence; no provider-MCP success or hosted-CI pass is inferred. Earlier increments' successful MCP readbacks remain historical evidence. Final E025 saves/readbacks and delivery-only documentation closeout remain separate.

Final [E025 saved reconciliation](../reviews/2026-10-12-hover-borders-tracker.md) passed. Correct Miva Sheet identity/private/saved state observed; fresh full export has exactly10intended cells at A26:J26 and no mismatch/extra change across all5tabs. Kaneo A010 is exactly130197characters with9274new and all120923prior text, plus the exact141732prior HTML suffix; metadata,633-character board/10tasks and fullA007 remain unchanged. Root resumed by inspecting saved state and performed zero duplicate content writes. Two native tracker proof screenshots saved locally; private full exports/history remain ignored. Temporary root readback tabs closed. Documentation-only closeout follows these verified artifact/tracker results and requires matching final private heads; no new frontend edit or app-test rerun is warranted for those record changes.

Documentation-only closeout checks passed5intended records/69local links/1JSON/0findings and `git diff --check`. Implementation publication and E025 receipts remain separate from the final documentation-head receipt at ignored `.local/hover-borders-publication.json`; final delivery verifies the intended source revision against the closeout commit. No production code changed after the passing full pipeline.
