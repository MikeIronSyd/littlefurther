# Usability/layout verification

## Goal

Verify UL01–08 against the [increment specification](usability-layout.md), baselineb5eb433. Implementation is complete; final verification and delivery states are recorded below without inferring pending passes.

## Context Pointers

R32 and six synthetic precode references were completed before app edits. All six inspected: desktop light English and320px dark French for learning, Activity and circle. Render command `node docs/specs/capstone/designs/usability-layout/render.mjs` exit0; six no-overflow measurements and checkbox target≥44px. Single precode `impeccable.cmd detect --json --scope layout src/client` exit0, `[]`. These are reference/research evidence only.

## Constraints

Preserve isolated-data/auth/privacy/lifetimes. Tests use isolated4318 data; browser review uses separate synthetic4319 data. Ordinary4317 records were untouched. Partial independent research ended on account usage limits; the later independent source/pixel review is a distinct invocation, not inferred from those partial outputs.

## Done When

Complete the full pipeline, independent review and exact tracker/publication readbacks. Formal design approval remains a separate human decision.

## Actual command and correction ledger

- Precode synthetic rendering exit0; all6 inspected before production edits. One precode layout scan exit0/`[]`.
- First affected8-test run:4passed/4failed. Failures: forced wrapping assumption, stale confirmation-trigger language (real product defect), two test label mismatches. Rebinding the restored trigger corrected the product defect; labels/geometry expectations follow existing copy and natural wrapping.
- A24-test run was interrupted after1pass to correct unapplied test-label edits; it is not a completed pass. Corrected24-test run:19passed/5failed. All9 existing circle and all5 new layout/study cases passed. Failures were pointer-modality outline testing and4 locators retaining English names after switching French. Tests now use actual Shift+Tab and stable inputs with explicit bilingual accessible-name assertions.
- First full verify stopped at lint:4descending-specificity warnings. Scoped selectors were simplified/reordered with the same computed hierarchy; checks were not suppressed.
- Next full verify passed compiler/lint/format/build/56domain-server/process checks, then exposed an existing RF01 test's ambiguous `form.getByRole("status")`: the specified step-limit adds another status. Stopped after35browser passes/1failure. The reorder assertion now scopes its existing exact bilingual messages and polite live-region assertion; no product change or weakened check.
- Final complete `pnpm --pm-on-fail=download run verify`: exit0. Strict compiler, lint, formatting and build passed;56domain/server tests passed, separate-process restart/persistence passed,87browser cases passed in14.3minutes, and audit at low severity reported no known vulnerabilities. The15new browser cases are included in87, not additional. No production edits followed this passing run.
- Final single scoped `impeccable.cmd detect --json --scope layout src/client`: exit0/`[]`. This mechanical result does not establish usability or conformance.
- `git diff --check`: exit0; only normal Windows EOL conversion notices. Normal4317 health readback `{"status":"ok"}`. Temporary4319 review server stopped and browser viewport reset/tab closed.

## Acceptance evidence

| AC | Implementation and actual evidence | Current result/limit |
| --- | --- | --- |
| UL01 | api preserves field; ui appends existing hints; known single-field errors and reference count/length/format guidance; real invalid-timezone browser rejection; new form/study regressions | Verified pass in final87-browser suite; ambiguous repeated rows deliberately use generic fallback |
| UL02 | current/connected guards and post-unlock focus in auth/profile/editor/study/completion; late editor/study response tests | Verified pass in final suite; no stale route mutation/focus claim beyond tested cases |
| UL03 | persistent50-step count, disabled Add, removal reenables and restores row focus; localized limit assertions | Verified pass, including49→50 and bilingual feedback |
| UL04 | Full consent label≥44px/native22px, keyboardSpace,200%/forced-colour cases in both themes/languages; contextual action/confirm/cancel names and language restoration | Verified pass in final suite; identical visible messages can still yield identical names |
| UL05 | Actual learning1280/320 lightEN/darkFR plus focused layout passes; intro28/24px versus next-step31.2/26.4px; same-fixture actionTop522.42px vs prior603.94px | Bounded synthetic fixture, not a general fold promise or outcome |
| UL06 |75ch Activity/40rem rhythm, explicit populated types/row heading levels, data unchanged in both variants; circle nav desktop single row/mobile natural wrap, pending/uncertain/denied tests | Verified pass in final suite; normal visual fixture contains2types, isolated tests contain3 |
| UL07 | Explicit timezone examples includingUTC, existing date behavior, actual20estimate/5restart distinction and hints; study input retained | No new picker/timer/default behavior; native-French quality not established |
| UL08 | R32/precode/reference and local checks; full required pipeline exit0; [independent source/pixel review](../reviews/2026-10-11-usability-layout-review.md) finds no blocking issue; artifact dual-private publication and [E024 exact saved readbacks](../reviews/2026-10-12-usability-layout-tracker.md) | Verified pass within documented scope; final delivery-only commit receives separate head readback |

## Actual visual review and limitations

Root inspected the batched learning, study, Activity, circle and error states, then one consolidated capture confirmation. [Reference/evidence README](../designs/usability-layout/README.md) and JSON distinguish synthetic references from11actual JPEGs, normal20-minute screenshot from5-minute interaction, native bounds and truncation in2fullpage captures. Replacement viewport captures contain the controls but omit content below the viewport. Measurements are CSS coordinates; native returned image dimensions differ and are recorded without image resizing. English/French desktop/320 and200% root-text/forced-colour automated checks are bounded coverage, not full browser zoom, screen-reader, disability or language validation. Review did not create shared items/invitations or save study/preference changes. Theme/language were restored to French/dark.

## Judging evidence and next demo scenes

| Criterion | Requirement → artifact/check | Planned demo scene and boundary |
| --- | --- | --- |
| J1 | R32/UL contracts → precode references → native code/tests → actual independent review and both reusable skills; browser MCP app/trackers and GitHub readback when available | Show a field failure,50-step feedback and the source/test evidence; actual Plan Mode invocation is not claimed |
| J2 | Learners generally can return after interruptions with retained effort; this increment improves next-action hierarchy, input recovery and private-support clarity | Show one retained journey → five-minute restart → separate study/completion; effectiveness/retention remains unvalidated |
| J3 | Existing stack/contracts preserved, helpers reused and usage guide updated; required pipeline and prior dated setup rehearsal are distinct evidence | Point to README/guide/specs and explain local-server operation; no new human adoption claim |
| J4 | Actual app captures and reproducible scenarios prepare a3–5minute story | Recording, measured duration/playback and final submission remain pending; another-month work should include learner validation and production readiness |

## Delivery

[Implementation/review artifact1574949](https://github.com/MikeIronSyd/littlefurther/commit/9c5f12e0f05dfad8df8ef40017e808592598681a) was published normally using `git push origin main`, exit0 to both authorized repositories. Both exact Git main heads, installed GitHubCLI private flags, commit metadata and all46changed paths matched at21:56:54Africa/Lagos. The first CLI readback helper was blocked by the child PowerShell execution policy; a process-scoped `-ExecutionPolicy Bypass` retry passed without changing machine policy. Personal GitHubMCP exact-SHA metadata/diff succeeded; Miva MCP returned404 and the authenticated CLI supplied its independent readback. Empty status and PR-filtered workflow lists establish no hosted-CI pass.

Local record validation before staging checked46files/162local links/4JSON documents/11actual JPEG origins with0findings; staged diff check passed. The [independent review](../reviews/2026-10-11-usability-layout-review.md) has no blocking finding. No app source changed after the final full check.

Delivery resumed on12October after a session interruption. The11October full-pass evidence remains dated evidence; no repeat full run is claimed for documentation-only closeout. The normal4317 server was stopped at resume, restarted with the existing local data via `pnpm --pm-on-fail=download start`, and `/api/health` returned `{"status":"ok"}`. No database reset, new learner record or app-source change accompanied that restart.

E024 saved comparisons passed in both trackers. The11October agent made one ten-cell Sheet paste and one Kaneo paste. Fresh12October browserMCP reload/export/readback, without repeat writes, confirms all5Sheet tabs match with onlyA25:J25 ten intended changes, uniqueE024 and0mismatches/extra changes. Correct Miva owner/Restricted access was checked. A010 is exactly120,923characters =9,368newprefix +all111,555prior characters; its141,732-character saved HTML retains the entire129,966-character prior HTML suffix. Browser normalization stripped one trailing space from the new standalone artifact paragraph and added link markup; expectation was corrected to observed new-prefix normalization with no repeat content write and no prior-history normalization. Title/InProgress/NoDate, exact633-character10-task board (1/5/0/4) and wholeA007 ToDo/NoDate remain unchanged. [Dated tracker report](../reviews/2026-10-12-usability-layout-tracker.md) records interrupted-session recovery and limits. Two fresh screenshot attempts timed out; no fresh proof image is claimed. Existing11October actual app images remain separate evidence.

Intended source/design artifacts go only to the existing two private project repositories; no project recovery upload. Rollback is a source revert to baselineb5eb433 followed by rebuild; schema/API are unchanged and normal data must remain intact. This delivery-only closeout records observed results; its final commit receives normal dual publication and separate exact-head readback after commit. Formal human design approval, full accessibility/native-language validation, learner outcomes and the timed video remain open.

12October delivery-record check passed7changed/new files,151local links and1JSON document with0findings; `git diff --check` passed. A separate read-only agent compared the final records, tracker report and ignored receipts and found no blocking factual inconsistency. It performed no app test, browser action or file edit. This record check is separate from the11October implementation review and full product checks.
