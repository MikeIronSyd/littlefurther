# Password visibility control — 9 October 2026

## Goal

Add an eye action to the existing sign-in and account-creation password input, allowing learners to inspect and correct their typing. Preserve the Amber entry screen and real authentication.

## Context Pointers

Baseline `4e01bc411ef745113d7af24a1fd8acd286a6db08`. Shared `showAuth` in `src/client/main.ts` builds both forms. `ui.ts` owns field association, icons and form locking; `i18n.ts` updates connected bindings in place. The [focused pre-code reference](../designs/password-control-reference.png) uses incumbent tokens and illustrates desktop/light and 320px/French/dark field treatments; it is a static design, not a screenshot or user approval.

### R24 research checklist (complete before production)

| Need | Finding and evidence | Status |
| --- | --- | --- |
| Existing callers and auth contracts | One shared password field; required, 8–128 characters, current/new-password autocomplete. POST bodies read its value directly. `lockForm` already disables all descendant buttons and inputs. Same input must retain label/hint associations. Root and independent research agent source inspection; research agent stopped before final review due usage limit. | Satisfied |
| Native interaction and selection | Native `type=button`, Enter/Space, changing action name without aria-pressed per [W3C button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/). Text/password support selection restoration per [MDN setSelectionRange](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange). Keep focus on the action for repeated keyboard activation. | Satisfied |
| Icon and browser behavior | Upstream Lucide [eye SVG](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/eye.svg) and [eye-off SVG](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/eye-off.svg) fetched and inspected; vendor geometry under existing notice, no dependency. [Edge documentation](https://learn.microsoft.com/en-us/microsoft-edge/web-platform/password-reveal) confirms scoped ::-ms-reveal suppression prevents duplicate browser reveal UI. | Satisfied |
| Visual, locale and lifecycle boundaries | Existing screenshot inspected; reference produced before code. Hidden on each fresh form/reload; visibility remains ephemeral. Locale/theme changes retain input node, text and selection. No guest, API, schema, dependency or storage changes. User decision is explicit; no unanswered consequential question. | Satisfied |

## Constraints

PV01: Both forms start masked; eye shows password and eye-off hides it. Use one same input, retaining value, selection, validation, name, autocomplete and label/hint references. New form/reload remasks; no visibility persistence.

PV02: Native non-submit button, decorative SVG, 44px minimum target, visible keyboard focus. Next-action accessible name/title: Show password / Hide password; Afficher le mot de passe / Masquer le mot de passe. No aria-pressed. Activating does not submit; retain button focus for keyboard toggling.

PV03: Theme and language changes preserve typed content and current visibility. Shared pending-form lock disables the reveal button and restores it on failure. Auth request bodies and server authorization stay unchanged.

PV04: Fits desktop and 320px in both themes, preserves field text space and existing entry layout. Suppress only the duplicate native Edge reveal control within this wrapper. Previously removed notices remain absent.

Quality contract: a small reusable password-field helper in `ui.ts`, existing shared auth caller and locale catalogue; no backend boundary changes. Keep all sensitive content ephemeral and out of logs, trackers and screenshots; use synthetic fixtures only. Required checks: pinned `pnpm --pm-on-fail=download run check`, `lint`, `format:check`, `build`, `test`, `verify:process`, `audit`, and scoped `pnpm --pm-on-fail=download exec playwright test tests/e2e/password-control.spec.ts tests/e2e/auth-shell.spec.ts`. Full unrelated browser suite need not repeat for this isolated control. Independent source review and one paired desktop/mobile browser-MCP pass, at most one corrective confirmation pass.

## Done When

1. Add helper, localized labels, eye geometry/attribution and scoped styling; wire both forms through the shared caller.
2. Verify keyboard, selection/value preservation, locales/themes, reset, pending failure and real authentication; record actual checks and limitations here.
3. Invoke learning-journey-review and capstone-evidence-update; reconcile A010/E016 in both authorized trackers, publish normal Git to this private repository, verify heads and available GitHub MCP readback. Formal design approval remains a separate human decision.

### Verification and delivery

Implemented and verified on9October2026 against the uncommitted increment from `4e01bc4`. Research/reference preceded production. `passwordField` wraps the existing input, retains label/hint and restores selection; EN/FR actions and upstream eye/eye-off are available on both forms, using the existing form lock and theme tokens. Spellcheck and capitalization are disabled for the revealed entry.

| Acceptance | Actual evidence | Result and limit |
| --- | --- | --- |
| PV01 | New both-form keyboard case checks input identity, value, selection/direction, associations, required/length/autocomplete and validity; locale/reset case checks fresh forms/reload; real synthetic account creates, signs out, signs in revealed and signs out. | Verified pass in Edge Playwright. |
| PV02 | Enter/Space, focused action,44px bounds, decorative SVG/action names/titles/no aria-pressed; no authentication request from reveal. Root browserMCP observed keyboard reveal/hide and visible focus. | Verified pass; no screen-reader or physical-mobile assessment. |
| PV03 | Theme/locale preserves same input, value, selection and visibility; held simulated401s on both forms verify exact unchanged payload, busy disable/restore and retained input. Real sign-in and existing blocked-storage case pass. | Verified pass; failed-request responses are controlled fixtures, separate from real authentication. |
| PV04 | Both themes, EN/FR and1440/320 Playwright layout bounds/nooverflow; root paired IAB desktop/light sign-in and mobile/dark French signup observed44px actions and no DOM overflow. | Verified scoped pass; IAB mobile screenshot retains existing right-edge capture crop and focus-overlay artefact. No product correction indicated by measured layout. |

Commands executed with pinned selection: `pnpm --pm-on-fail=download run check`, `lint`, final `format:check`, `build`, `test` (56/56domain/store/HTTP), `verify:process`, `audit` (zero known vulnerabilities), all exit0. Exact scoped browser command above passed11/11 in52.3seconds (four new, seven existing auth-shell). Initial formatter failed for the expanded main.ts import; formatted that file and final check passed. Initial `run test:e2e -- ...` passed a literal separator through the host launcher and selected67cases; stopped after four passes and reran the explicit `exec playwright` command. No full67-case pass is claimed. No dependency/backend changes. Independent source review below found no blocker. Local proofs: `.local/password-control-{desktop,mobile}.png`; these are masked/empty synthetic fields, with no account credentials published. BrowserMCP deliberately redacts input values, so value/caret evidence comes from Playwright, not the redacted browser inspection.

Artifact `23bf29f4b916aaacf1d2bebbd6a63e390b4bc063` retained as source evidence; exact source revision matched at19:51:07Africa/Lagos. GitHub MCP fetched personal metadata/diff; combined statuses and the PR-filtered workflow list were empty, not passing hosted CI. Miva MCP get_repo returned404; direct CLI head readback succeeded independently. Local normal server health is okay and serves the verified client asset `index-DZwqwEfa.js`.

capstone-evidence-update reconciled E016/A010 through actual browserMCP. Correct restricted Miva owner `m.alkali5130@miva.edu.ng` verified; saved five-tab export comparison passed exactly10intended A17:J17 cells, zero mismatches/extra changes, unique E016 atA17. A010 full69,800-character saved description equals expected; its exact65,979-character prior history remains the suffix, with title/status/date unchanged. Root independently checked the full saved string's suffix. Initial local helper offset reported false because its prefix TXT had CRLF while the JSON/editor used LF; only helper serialization/boundary accounting is corrected, without tracker rewrite or old-history normalization. Receipts/proofs are `.local/password-control-tracker-*`. Artifact source and checks remain immutable; a documentation-only closeout follows through normal source documentation.

Independent `password_control_review` invoked learning-journey-review for preliminary research and a second source review of the uncommitted increment against `4e01bc4`. No scoped blocker: PV01 same-input/selection/association, PV02 native button/labels/decorative SVG, PV03 single locale binding and inherited form lock, PV04 scoped sizing/theme/Edge style all conform in source. Reviewer ran no app/tests; source conformity alone does not pass behavior. Separate `password_control_tests` authored four behavior cases and formatted its file; root owns execution.

J1: actual specification/research, Impeccable refinement, independent agents/review-skill reuse, tests and browserMCP. J2: learner can inspect/correct typed credentials; no measured learning outcome. J3: one shared helper, incumbent stack and documented test contract; no new adoption/rehearsal claim. J4: usable entry control supports the planned demonstration; recorded/timed final video remains pending. Formal human design approval remains separate.
