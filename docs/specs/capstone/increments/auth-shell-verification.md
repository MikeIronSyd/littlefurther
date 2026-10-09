# Auth-shell verification — 9 October2026

## Goal

Verify the user's sign-in/theme plan against [AS01–AS06](auth-shell.md), preserving Amber, real authentication/private authorization and existing learner behavior. This is scoped technical evidence; formal design approval and final capstone acceptance remain separate.

## Context Pointers

Baseline `08231721b5c844fccb160292a7c7edcf286f8818`. R22 closed14:07 Africa/Lagos before edits. The desktop/mobile reference and provenance were saved under `.impeccable/mocks/amber/auth-shell-reference.png` before production implementation. The actual changed modules are shell/main/ui/i18n/styles; no server/schema/dependency/package change. Seven new auth-shell browser cases and five affected existing browser files retain strong current-action/theme-state assertions.

### Actual commands and results

All commands select the documented pinned package manager with `pnpm --pm-on-fail=download`. Root executed these; independent reviewers inspected source/fixtures and logs, not a separate browser run.

| Command | Actual result |
| --- | --- |
| `run check` | Exit0, strict TypeScript; rerun after the two fixture locator corrections also0. |
| `run lint` | Exit0,41 files, no warning/error. |
| `run format:check` | Initial full check0. Locator correction introduced one new test-line formatting failure; `exec biome format --write tests/e2e/auth-shell.spec.ts` corrected only that file, final full check0/46files. No broad formatting or relaxed check. |
| `run build` | Exit0; server compiler and Vite client14modules built. Full browser runner also builds the current source. |
| `test` | Final56/56 domain/store/HTTP tests pass,0fail/skip, exit0. Earlier same56pass log retained; command-exit readback was lost after interruption, so the final repeat resolves that evidence gap. |
| `run verify:process` | Exit0: distinct processes retain both sessions/secret, Comeback/receipt/private history/circle copies/encouragement/invitation retry. No reboot/physical disconnection inference. |
| `exec playwright test tests/e2e/auth-shell.spec.ts tests/e2e/shell.spec.ts` | Final13/13pass in1.4minutes, exit0, includes seven new cases and six shell regressions. |
| `run test:e2e` |Exit0;63/63 full browser cases pass in11.6minutes, including the new seven and existing56. The focused13 are a subset, not additional unique cases. |
| `run audit` | Exit0; registry reports no known vulnerabilities. This is not a complete security audit. |

Ignored actual logs: `.local/auth-shell-{check,lint,format,process,audit}.log`, `unit-final.log`, `focused-final.log`, `e2e-final.log`. Tool results also retain build and formatter exits. Generic NO_COLOR/FORCE_COLOR notices in test launch are runtime console warnings, not ignored product/test failures.

### Retained failures and corrections

The first focused run's two reported failures were fixture errors: a role locator retained English “Language” after the accessible name became “Langue”, and the input-preservation test used a nonexistent French account-link string. Root changed the language locator to the stable control with explicit English/French name assertions and used the actual existing translation “Première visite ? Créer un compte”. No production behavior or translation was altered to satisfy these failures. Corrected focused13cases pass. A later formatter check caught the newly longer test line; only that file was formatted, with final check0. Partial agent turns stopped due to usage limits; a fresh independent reviewer continued the partial source report. No model override, credits purchase or incomplete agent output is presented as completion.

### Criterion evidence

| AC | Actual evidence | Result / boundary |
| --- | --- | --- |
| AS01 | New desktop1440/mobile320 sign-in and sign-up cases; root browser MCP full-width main geometry, no nav/account/overflow | Verified focused pass; synthetic Edge/IAB evidence, not physical-device compatibility. |
| AS02 | Actual account sign-out/re-sign-in restores saved collapsed sidebar/exact icon; held real request after real session revocation returns401 with modal open, then closes modal/lock and focuses auth h1 | Verified focused pass; failed/delayed-sign-out regressions also passed in the full suite. |
| AS03–AS04 |44px decorative moon/sun native actions, exact localized labels/no pressed attribute, Enter/Space/focus outline, hover/focus/current-action tooltip/Escape | Verified focused pass; no broad screen-reader or accessibility certification. |
| AS05 | Auth input and node identity retained through in-place locale/theme changes; invalid/blocked storage, device changes and explicit reload precedence; existing learner draft preservation | Verified focused pass; only guarded non-sensitive enums stored, no persistence promise when blocked. |
| AS06 | Required checks above, independent scoped review, paired browser evidence, reference/provenance and reused skills | Verified scoped delivery: required checks, independent review, E014 saved comparisons and source publication complete. Formal human design approval remains separate. |

## Constraints

### Bounded visual/browser observation

Root used browser/computer-use MCP on the running normal demo `http://127.0.0.1:4317/`. One paired inspection at1440px light/English and320px dark/French found signed-out main atx0/full viewport width and no horizontal DOM overflow. Real UI actions switched language/theme without replacing the populated auth fields; saved captures are `.local/auth-shell-browser/desktop-en-light.png` and `mobile-fr-dark.png`. Auth inputs were synthetic, never submitted. Existing welcome copy/Amber hierarchy remained. The full-page mobile raster was cropped16px at the right by the capture surface, while readback showed innerWidth/clientWidth/scrollWidth320 and input/button right308. This capture limitation is retained rather than misreported as product overflow or an uncropped visual golden.

One `impeccable.cmd detect --json src/client/shell.ts src/client/main.ts src/client/ui.ts src/client/i18n.ts src/client/styles.css` scan exited0 with32advisories:27font,4color,1radius and0non-advisory findings. Advisories remain documented; this is not a clean-advisory pass or measured quality improvement. No redesign/token normalization was undertaken. A clean final entry capture at the restored default1280px viewport is `.local/auth-shell-browser/final-entry.png`; temporary viewport override is reset. After browser/runtime interruption the normal4317 listener was absent, so root restarted `pnpm --pm-on-fail=download start` with the existing `.local/data`; listenerPID25120 and execsession3757 are intentionally retained for the user. No database or account reset occurred. Scoped independent source/fixture review found no blocker; its actual fingerprints and continuation are in [review](../reviews/2026-10-09-auth-shell-review.md). This does not supply the outstanding formal design receipt/capture or QUALITY BAR.

### Judging evidence

| Criterion | Artifact/check | Demo scene / limitation |
| --- | --- | --- |
| J1 | R22/spec/reference before code, Impeccable and review/evidence skill invocations, parallel research/tests/review, CLI checks and actual browser MCP | Planned concrete planning/build/review/document story; GitHub MCP read tools unavailable, so no provider MCP success inferred. |
| J2 | Learners entering private study see relevant controls, retain input and can safely return after session clear; AS01–AS05 actual technical checks | Planned entry/theme/private-learning scene; no measured motivation/retention/mastery or population benefit. |
| J3 | Existing architecture and exact dependencies/auth contracts retained, vendored icon provenance, focused spec/tests and rollback with unchanged database | Earlier P10 setup/adaptation remains historical separate evidence; no new human adoption claim. |
| J4 | Updated working entry/theme state available for a3–5-minute walkthrough | Scene preparation only; final video, timing/playback and next-month pitch remain pending. |

## Done When

Full regression is complete, with63/63passes11.6minutes and exit0. Final independent review and authorized E014 saved tracker comparisons/publication are recorded separately before scoped delivery is complete. A local commit is not publication; both private remote heads require readback. The app remains a local server-running proof of concept, with unchanged private learner database. Formal design approval, native-French quality, full accessibility, learner outcomes and timed video remain open independently.

### Verified source publication

Normal git push origin main published artifact[8e3d2604aed972e4855ce3e92f378e7db5aeac8d](https://github.com/MikeIronSyd/littlefurther/commit/8e3d2604aed972e4855ce3e92f378e7db5aeac8d) to both private repositories. Both exact main heads matched at2026-10-09T17:37:21.4642469+01:00 through GitCLI. Current GitHub MCP read tools are unavailable, not passed. E014 saved reconciliation and later documentation closeout remain separately recorded.

### E014 saved delivery and scoped completion

E014 saved/read back in correct Miva Sheet and Kaneo:37intended/actual cells,0mismatch/extra, uniqueA15; all five full descriptions exactlymatch intended E014 prefix plus complete previous history. Titles/statuses/No date and10-task board/A007 retained. See2026-10-09-auth-shell-tracker.md. Browser automation through MCP, not native Sheets/Kaneo connectors. The [tracker report](../reviews/2026-10-09-auth-shell-tracker.md) records identity, saved comparisons and proof images. The [final independent review](../reviews/2026-10-09-auth-shell-review.md) has no scoped blocker and attributes actual test/browser execution to root. AS01-AS06 is complete within this technical prototype scope. This subsequent documentation records actual saved delivery; final normal dual-private documentation publication is verified separately through its local receipt. Formal design approval and broader capstone deliverables remain open.
