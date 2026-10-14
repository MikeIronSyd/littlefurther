# Clarify incomplete sign-up — 14 October 2026

## Goal

Explain the existing-account recovery route after the user reported an unclear failure while reusing their email. Scope is the shared English/French `accountError` copy only; preserve authentication and the current inline error presentation.

## Context Pointers

Baseline `c6083b0`. Inspect `showAuth` in `src/client/main.ts`, `src/client/api.ts`, the two catalogues in `src/client/i18n.ts`, and installed BetterAuth1.7.7 `dist/api/routes/sign-up.mjs`. Impeccable context/clarify/craft-floor and the scoped ui-ux-resources accessibility checklist were used. Existing Amber/A identity and D016 remain settled.

R39 research is complete before frontend edits: source and an isolated synthetic HTTP experiment verify that `autoSignIn:false` masks duplicate emails with200/syntheticuser/token:null; the client then attempts sign-in. A different password produces401 `INVALID_EMAIL_OR_PASSWORD`; the existing password succeeds. Short-password400, invalid-email400, synthetic-server500 and rate-limit429 cases are distinct failures that can also reach the shared fallback. A definitive existing-email assertion is not available from this response. Preserve the backend privacy behavior and give conditional, actionable guidance. Private experiment/receipts are under ignored `.local/signup-copy/`; no ordinary email/data/credential/provider request was used.

## Constraints

English: “We couldn’t complete sign-up. If you’ve used this email here before, sign in with your existing password. Otherwise, check your details and try again.”

French: “Impossible de terminer l’inscription. Si vous avez déjà un compte avec cette adresse e-mail, connectez-vous avec votre mot de passe habituel. Sinon, vérifiez vos informations et réessayez.”

- Change only these two catalogue values. Keep network-specific and sign-in errors, existing sign-in action, alert/focus, retained fields/reveal, server/API/schema and dependencies unchanged.
- Prepare a focused reference in the current form before frontend edits, using synthetic routes and a temporary DOM copy replacement. Label it as a proposed-copy reference, not implemented behavior.
- Verify the resulting wording in EN/FR desktop/320px, both themes and enlarged text with retained input/error focus. Reuse affected password-control/auth-shell tests and static/build checks; no new mirrored copy-only test or full-suite claim.
- Record actual results and scoped independent review; preserve both activity histories and normal authorized source publication. No new human approval, educational outcome or completed demo follows.

## Done When

The two localized messages explain the existing-password sign-in route without asserting an unknown failure cause; bounded visual/behavior and affected checks pass, actual evidence is saved/read back in both trackers, and intended private source is normally published/read back. Reference, executed results and delivery will be appended here.

### Reference before implementation

Eight proposed-copy references were rendered on the unchanged built form before catalogue edits: EN/FR,1440/320px, light desktop/dark mobile,100%/200%roottext. Private `reference-receipt.json` records retained synthetic email/password, unlocked form, alert focus and zero horizontal overflow. Root inspected desktop English and enlarged mobile French captures. These are DOM text replacements with mocked auth responses, not implemented-copy evidence. The two catalogue strings were then changed; no handler/style/control changed.

### Actual verification

`pnpm --pm-on-fail=download run check`, `run lint`, `run format:check` and `run build` all exited0. `pnpm --pm-on-fail=download exec playwright test tests/e2e/password-control.spec.ts tests/e2e/auth-shell.spec.ts` exited0:11passed in1.1minutes. These affected existing tests cover signed-out/signed-in shell, session/drawer cleanup, theme/language/focus retention, password reveal/masking, pending/failure inputs and real synthetic-account sign-in/sign-out. No new full-suite/audit result is claimed; Docker's earlier85/94result remains dated evidence.

Eight actual-copy captures pass the same EN/FR desktop/mobile/100–200%roottext matrix, with exact localized copy, retained fake email/password, unlocked form, focus on the alert and no horizontal overflow. Root inspected the English desktop and enlarged French mobile captures. Synthetic routes reproduce signup200 then signin401; the separate actual HTTP experiment verifies why conditional wording is necessary. The existing sign-in action remains reachable; no server behavior, ordinary learner data or credential was changed. Private captures/receipts/logs remain under `.local/signup-copy/`.

Tracker reconciliation and normal source delivery require their actual saved/readback results below; local checks alone are not publication.

### Independent scoped review — 14 October 2026

**Goal:** `learning-journey-review` examined the uncommitted two-string change against baseline `c6083b0`. No blocking finding was identified for this copy-only correction.

**Context Pointers:** The reviewer inspected the source diff, unchanged authentication/request/alert helpers, R39, the synthetic HTTP experiment, the reference/actual capture scripts and receipts, and the completed affected-test log. Impeccable context/clarify and the ui-ux-resources accessibility checklist informed this bounded review. The English desktop and enlarged French320px actual captures were visually inspected independently.

| Acceptance scope | Evidence | Result | Limitation |
| --- | --- | --- | --- |
| Truthful recovery guidance without asserting the cause | Installed BetterAuth source, actual isolated HTTP responses, both changed catalogue values | Verified pass | A duplicate email cannot be identified definitively from the existing masked response. |
| Retained authentication, reveal, input and failure-focus behavior | Unchanged handlers/helpers;11affected browser tests passed;8actual-case receipts retain inputs, unlock and alert focus | Verified pass | Reviewer inspected the executed log; did not rerun it or claim a new full suite. |
| Readable localized error and available sign-in route | Exact-copy assertions in8actual cases, no horizontal overflow; scoped desktop/mobile capture inspection | Verified pass | Light desktop/dark mobile and100%/200%roottext were sampled; no exhaustive theme/device or browser-zoom claim. |
| Small scope and preserved privacy boundaries | Production diff only changes the EN/FR `accountError` strings; no provider/data/auth configuration change | Verified pass | Translation review is technical and editorial, not native-speaker validation or accessibility conformance. |

**Constraints:** No blocking correctness, regression or factual-copy issue was found. The message names the failed operation, conditionally explains the existing-password route and preserves a fallback for other failures. The existing inline alert and sign-in control remain intact. The reviewer performed the isolated HTTP experiment and inspected application captures/test evidence; this review did not operate a new browser session, modify product code, access ordinary learner records, make provider calls or update trackers.

**Done When:** Scoped technical review is complete. Tracker saved-state readbacks and owner-specific publication remain the release operator's delivery checks; this review alone does not establish publication, formal approval, adoption or learning outcomes.

### Saved activity evidence

The `capstone-evidence-update` skill was reused to reconcile reviewed implementation artifact `7d0cf6709e2016f84d177f9fb14703bf4f2f32cc` and its actual affected checks. On14October15:47–15:49Africa/Lagos, E032 was saved in the existing Miva hackathon Sheet and Kaneo A010 through browser MCP. Native Google Drive tools were unavailable. The Sheet browser verified `m.alkali5130@miva.edu.ng`, Private to only me and Saved to Drive before editing; a fresh complete five-tab export exactly matched the preceding E031 baseline.

Two values-only Sheet pastes changed precisely11values: Context B25 and Codex evidence A33:J33. Copied-range readbacks and the saved full export confirm zero mismatches, zero prior-cell style/formula changes, unchanged sheet structure/defined names and one unique E032. Context B25 now has34,150characters with all31,207prior characters preserved as its exact suffix. The recorded date is unambiguous text; no new decision or status/date change was needed. All prior activities, milestones, decisions and evidence remain unchanged.

One supported Kaneo description-editor HTML paste added a4,272-character E032 prefix. Saved state and reload confirm final168,747-character text and199,539-character HTML, preserving the complete prior164,475-character text and194,461-character rich HTML as exact suffixes. The saved HTML SHA256 is `896800eb87a28517fd898e7ef6a9e0a250851b9b50acc6a3a589433d1f5ba415`; the new heading occurs once. Title, In Progress/No date and the complete ten-card board remain exact; A007 remains To Do. No comment, message or duplicate paste occurred. Private full snapshots/comparisons and actual `sheet-e032.png`/`kaneo-e032.png` proof views remain under ignored `.local/signup-copy/trackers/`.

This records actual scoped research/copy/check/review/tool/skill work for J1 and maintainable localized guidance for J3. Synthetic error observations do not establish learner outcomes or adoption; J4 recording/submission remain unfinished. No new full-suite, audit, formal approval, credential/provider or ordinary-data result is inferred. Tracker reconciliation is complete; final documentary delivery and source readback remain recorded separately, with no further tracker write needed merely to advance documentary commits.
