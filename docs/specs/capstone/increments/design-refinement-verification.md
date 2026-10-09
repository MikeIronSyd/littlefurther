# Focused design-refinement verification — 9 October 2026

## Goal

Verify RF01–RF05 from the [contract](design-refinement.md), correcting the five findings while retaining Amber. Baseline `526ec3402c09e2e098e83dc44cd658428830f2cb`; current candidate is the uncommitted source/test diff. All results below are actual executions or attributed observations, not inherited passes.

## Context Pointers

[Editor research and handoff](../reviews/2026-10-09-refinement-editor-research.md), [test research](../reviews/2026-10-09-refinement-test-research.md), [initial independent review](../reviews/2026-10-09-refinement-review.md), [final source review](../reviews/2026-10-09-refinement-final-review.md) and [tracker preparation](../reviews/2026-10-09-refinement-tracker.md). R21 closed11:41 Africa/Lagos before production edits. Root changed main/journey/catalogue plus one measured spacing correction; editor agent changed only plan-editor; test author supplied the focused file. Root completed verification after two earlier agents' turns were interrupted by account usage limits. No credits or paid service was enabled.

### Commands and results

All root pnpm commands use `--pm-on-fail=download`, which selects pinned11.19.0. Existing package scripts/Playwright configuration remain unchanged.

| Command | Actual result |
| --- | --- |
| `pnpm --pm-on-fail=download run check` | Initial exit1: root passed an explicitly undefined selectedStepId under exactOptionalPropertyTypes. Fixed by omitting the property; final run exit0. No compiler option relaxed. |
| `pnpm --pm-on-fail=download run lint` | Exit0,40 files, no fixes. |
| `pnpm --pm-on-fail=download run format:check` | First exit1 on the new test file interrupted before formatting. Root formatted that file only; final exit0,45 files, no fixes. |
| `pnpm --pm-on-fail=download run build` | Exit0;14 Vite modules. Subsequent browser runner rebuilds include final resource spacing; delivered asset names below. |
| `pnpm --pm-on-fail=download test` | Exit0,56/56 domain/store/HTTP cases. |
| `pnpm --pm-on-fail=download run verify:process` | Exit0; distinct-process sessions/secret/history/Comeback/circle/copy/encouragement/invitation retry preserved. Local child termination/restart, not machine reboot or physical network disconnection. |
| `pnpm --pm-on-fail=download run audit` | Exit0; no known vulnerabilities found at execution. Registry audit is not a comprehensive security review. |
| `pnpm --pm-on-fail=download exec playwright test tests/e2e/design-refinement.spec.ts` | First:2 passed/6 failed; all six were fixture errors described below. After fixture corrections, exit0,8/8 passed in1.5minutes. |
| `pnpm --pm-on-fail=download run test:e2e` | Exit0,56/56 passed in11.1minutes; includes the new8 and existing48 cases. No failures or skipped cases. |
| `impeccable.cmd detect --json src/client` | One actual final scan; exit0,34 advisory entries:28 font-size,4 color,2 radius. No non-advisory finding. Complete JSON retained locally; prior structured-document explanations remain applicable. No browser overlay attempted in this correction increment. |

The first focused failure artifacts are preserved in ignored `.local/refinement-first-run/results`. Their results do not establish six product regressions: the test selected a nonexistent form name, retained English-labelled locators after translating the labels, and compared all plan fields after an intentional profile-language update. Existing profile behavior legitimately updates plan.locale/updatedAt. Root corrected the fixtures to verify accessible names once and use stable field locators across locale changes; explicitly assert en→fr metadata with monotonic updatedAt while comparing **every other plan/history/progress field exactly**. The unused multi-select assertion for text inputs was replaced with their ordered values. No production assertions or expected learner-data preservation were weakened.

### Bounded browser MCP evidence

Root started corrected local server4330 with fresh ignored `.local/refinement-browser/data`, created one synthetic account and an8-step template plan, and used only its own new IAB tab. Existing learner data was untouched. One desktop/mobile inspection and one spacing confirmation constitute the bounded cycle.

- The invalid list `2026-10-09, tomorrow` displayed the exact malformed token, aria-invalid/describedby including the original hint, and focused availability. Correcting it opened the reviewed draft.
- Enter on first Move step down moved the step to2/8, kept focus on that row's Move step down and announced its new position. Moving up restored its original position before explicit plan save.
- Study displayed both exact template sources/check dates in English and French, with safe external/internet disclosure. An unsaved private reflection retained its exact authored text through theme/language/mobile changes, then saved successfully. Explicit whole-step completion was a separate action.
- The overview exposed French labels for six no-record dates and one actual study date, such as `9 oct. 2026: Étude enregistrée`. Counts remained1studyday/1session/5minutes and1/8completion.
- At320px French dark, Edit step focused the second Action field and displayed “Modification de l’étape 2 sur 8.” Its viewport top was357px; scroll width305 matched the inner viewport305. The first completed step stayed locked.
- First source-list capture revealed crowding at the form boundary. Root documented the28px separation/780px measure/18–8px heading spacing before the single CSS refinement. Confirmation readback found resource bottom544.28px and form top572.28px, exactly28px apart. Source links, labels and inputs reflowed in both final captures.

Ignored actual captures: `.local/refinement-browser/availability-error.png`, `study-resources-desktop-en.png`, `study-resources-mobile-fr-dark.png`, `selected-step-mobile-fr-dark.png`, `final-resources-desktop-en-light.png`, `final-resources-mobile-fr-dark.png`. The final desktop and selected-step screenshots were visually inspected; all are browser captures, not image mockups. Final page loaded `/assets/index-DhaUu24O.js` and `/assets/index-DDT2m20M.css`. Root reset viewport, returned without changing the next session and closed its test tab. Ctrl+C stopped owned server4330; no4330 listener remained at12:04Africa/Lagos. Synthetic records remain ignored and unpublished.

### Acceptance matrix

| Criterion | Evidence | Current result / limit |
| --- | --- | --- |
| RF01 / D01 | Focused move/up/down boundary, removal next/previous/empty, add and consent tests; root actual Enter observation. | Scoped verified pass; no physical screen-reader pronunciation claim. |
| RF02 / D02 | Actual recorded/no-record labels switch EN/FR in overview/Activity; count/history invariant checks. | Scoped verified pass; underlying calendar logic separately passed domain tests. |
| RF03 / D03 | Missing/malformed/excessive dates, missing/excessive/overlong manual topics, field association/focus, retained hints/draft/locale and no premature POST. | Scoped verified pass with focused tests and root error recovery. |
| RF04 / D04 | Selected second step after completion, mobile French context/focus, stable selection after reorder, dirty cancellation and ordinary Edit plan entry. | Scoped verified pass. Stale selection source fallback is inspected; no separate stale-ID browser fixture claimed. |
| RF05 / D05 | Exact ID/version/current-locale sources, duplicate URLs, manual/empty/mismatch rendering fixtures, safe attributes, no fetching/journey write and authored-field preservation. | Scoped verified pass. Duplicate-catalog/version-mismatch responses are rendering-only fixtures, not unsupported backend capabilities. |

## Constraints

No API/schema/migration/dependency or global-setting change. No new date picker or step-only editor. No content fetching, translation of authored data, runtime AI, remote-peer test, public hosting, participant outreach or automatic monitoring. Native-French validation, broad device/accessibility conformance, formal six-item human receipt/assembled-capture/QUALITY BAR, timed video and learner outcomes remain unverified. Historical26/40 critique score is not rerated or claimed improved by this increment.

The prior independent reviewer identified the exact optional-parameter issue and inspected released editor/root source, but its final synthesis turn was interrupted. Those messages are source-review evidence, not a completed final sign-off. The new independent final reviewer inspected the stabilized source/fixtures and reports no scoped blocker; its report attributes actual checks to root. Full browser suite finished56/56, exit0. Publication/saved delivery remains separate from scoped correction acceptance.

### Judging trace

| Criterion | Requirement → evidence → demo use |
| --- | --- |
| J1 | AC13/RF01–RF05 → R21, disjoint implementation/test authors, actual review/evidence skills, source findings, CLI checks and browser MCP → show one review finding and its actual correction/check. |
| J2 | AC01–AC03/AC11 → clearer errors, retained keyboard position, direct editing and material access in synthetic learner tasks → explain concrete beneficiary actions; no retention/mastery claim. |
| J3 | AC12 → prior verified P10 setup/adaptation and unchanged source/data boundaries with new focused regressions → show maintainable extension, not human adoption. |
| J4 | AC14 → working corrected states/captures → recorded3–5-minute demo remains pending. |

## Done When

RF01-RF05, all required correction checks and independent stabilized source review are complete within scope. Publication/E013 saved delivery follows as a separate actual result. Formal review/capture/video/learner-effect limits remain open; no heuristic score improvement or human adoption is inferred.

### Local delivery state

The normal demo4317 was not running at the9October preflight. Root started the final build with the original ignored `.local/data` directory and preserved its contents. `/api/health` returned statusok and loopback listenerPID19096 was observed at12:11Africa/Lagos. Server session29357 remains running intentionally for the user; Ctrl+C is its stop method. `open_in_codex` returned queued, so no visible-open claim is made. The separate4330 test server is stopped, and root's synthetic verification tab is closed with viewport reset. No installed service or recurring monitor was introduced.

### Source publication

Normal `git push origin main` published [e53210745e82fafbcd7ce59b8e306f64285a8338](https://github.com/MikeIronSyd/littlefurther/commit/e53210745e82fafbcd7ce59b8e306f64285a8338), containing the verified correction and evidence, to both private repositories. Both main heads exactly matched at12:15:02Africa/Lagos. The current tool inventory exposes no GitHub repository/commit read tool or searchable-tool route, so provider MCP readback is unavailable for this increment; publication readback is GitCLI evidence. Earlier actual GitHub MCP results remain preserved. No unavailable provider check is called passed. E013 saved tracker reconciliation is recorded after execution; this documentation closeout is separate from the artifact linked there.

### Saved E013 delivery

Root inspected the final [tracker report](../reviews/2026-10-09-refinement-tracker.md) and actual receipts:39 intended/actual Sheet cells, zero mismatches/extra changes across all five tabs, uniqueE013A14, and five complete persisted Kaneo descriptions exactly matching intended text without normalization. Entire prior-history suffixes, statuses/dates, A007 and board counts remain intact. BrowserMCP actions and local comparisons are distinct; no native tracker connector is claimed. The artifact links remain pinned to2209bd2; this later documentation closeout records actual saved results. Local validator preserved exact E006-E012 history, identities/deadlines/LMS/judging criteria, unchanged backend/dependencies and scoped secret absence; staged whitespace passed. No product checks are relabelled from this documentation work.
