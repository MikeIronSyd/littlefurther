# Clearer welcome promise — 9 October2026

## Goal

Implement the user's approved encouraging, specific message on both authentication forms. Connect small study steps, personal reflection, flexible routine/progress, recovery and optional private support. Baseline `fc8c419dc524c98cbe45af5ab25ff8af44296c44`.

## Context Pointers

Shared `welcome`/`welcomeCopy` catalogue entries render h1/p in the same auth intro for sign-in/account creation. Only `journey.spec.ts` AC09 has an exact old-heading expectation; preserve its401 and real sign-in checks. Incumbent auto-height Amber layout wraps normally, with desktop28px/mobile22px padding and48px/36px headings. [Pre-code focused reference](../designs/welcome-copy-reference.png) is a static Pillow typography/layout study, not a browser capture or formal approval. Real wrapping and enlargement still require execution.

### R25 research (satisfied before production)

| Need | Findings/evidence | Status |
| --- | --- | --- |
| Exact user direction and claims | User supplied exact EN/FR messages below and explicitly requested implementation. Capstone F01–F08 support all capabilities; peer support remains voluntary, no outcome guarantee. Independent entry_copy_critique source/claim review agrees. No unresolved consequential decision. | Satisfied |
| Callers, localization and test coupling | Root/independent source trace confirms one shared auth intro, in-place locale bindings, only AC09 exact old heading. No behavior/API/data change needed. | Satisfied |
| Responsive feasibility | Existing CSS has normal wrap, auto-height and no intro truncation. Longer copy adds vertical space; existing scroll allows forms below. Static reference prepared/inspected before code; actual EN/FR320/enlarged checks remain verification, not assumed passes. | Satisfied |

## Constraints

WC01 exact English headline: **Keep learning, even when life interrupts.**

English body: Build a flexible study plan, study and reflect in small steps, and see your progress. Return after a break with your earlier effort intact, and invite trusted peers for private support when you want it.

WC02 exact French headline: **Continuez à apprendre, malgré les imprévus.**

French body: Créez un programme d’étude souple, étudiez par petites étapes, faites le point et suivez vos progrès. Reprenez après une pause en conservant la trace de vos efforts, et invitez des personnes de confiance dans un cercle privé pour vous soutenir, si vous le souhaitez.

WC03 preserve Amber/auth layout, controls, password reveal, theme/locale/input focus and authorization. No new controls, dependencies, API/schema or claims of motivation/mastery/completion. Both locales/forms must reflow at1440/320 and200% root-text enlargement without text clipping/overflow, with form controls reachable by scrolling. Text enlargement is distinct from browser zoom/physical-device/screen-reader validation.

## Done When

1. Change only four catalogue values and affected exact test expectation. Extend existing AS01 appearance checks to cover exact bilingual text and enlarged reflow; do not add unrelated behavior tests.
2. Required pinned commands: `pnpm --pm-on-fail=download run check`, `lint`, `format:check`, `build`; `pnpm --pm-on-fail=download exec playwright test tests/e2e/auth-shell.spec.ts tests/e2e/password-control.spec.ts`; and `pnpm --pm-on-fail=download exec playwright test tests/e2e/journey.spec.ts --grep AC09`. No backend/unit/process/audit/fullbrowser rerun required for catalogue-only change; prior results are historical, not relabelled new passes.
3. One paired desktop/mobile browserMCP review, including enlargement where feasible; at most one corrective confirmation round. Independent learning-journey-review and capstone-evidence-update; record actual results, E017/A010 in both authorized trackers, normal source evidence with exact heads/GitHubMCP readback. Formal design approval stays separate.

### Verification and delivery

Implemented exactly as approved: four shared catalogue values plus AC09 heading expectation and extended existing AS01 layout checks. No CSS/authentication/interaction change. R25/reference preceded production edits.

| Criterion | Actual check/evidence | Result/limit |
| --- | --- | --- |
| WC01/WC02 | Both forms render exact EN/FR heading/body in AS01; independent source review checks accepted strings and shared caller; root browserMCP reads live EN/FR text. | Pass for text fidelity; no human comprehension/native-French assessment. |
| WC03 | AS01 at1440/320, both locales/forms,100/200% root-font sizes checks exact strings, text within auto-height panel, no horizontal overflow and reachable/enabled submit/password reveal. | Pass; text enlargement differs from browser zoom/physical-device/screen-reader assessment. |
| WC03 unchanged auth | All existing auth-shell/password-control cases pass, including real revealed-password sign-in, session expiry, form retention and blocked storage. AC09 verifies401 after sign-out and successful return to the saved journey. | Pass in Edge Playwright, isolated4318 data. |
| Visual | One paired browserMCP pass: desktop English/light sign-in and320 French/dark signup, read/capture inspected. Panel heights approx296/453CSSpx, no DOM overflow; mobile form remains reachable by scrolling/keyboard. | Scoped pass. IAB mobile capture retains prior right-edge crop and incidental theme tooltip; source/layout measurement distinguishes these capture artefacts. No corrective visual round needed. |

Pinned strict/lint/format/build commands above all exit0. Auth-shell/password-control command passed11/11 in53.2seconds; AC09 grep selected two existing cases (literal-text/unsafe-link and sign-out/private-journey),2/2pass27.4seconds. Total13selected cases; no full-suite/unit/process/audit rerun or new result claimed for this catalogue-only increment. No failed check. Local proof files `.local/welcome-copy-{desktop,mobile}.png`; normal server remains running and serves the new build.

Independent entry_copy_critique reused learning-journey-review and Impeccable clarification for source research and final uncommitted review against `fc8c419`: no actionable blocker, exact English/French match, optional-support wording supported,401/real-sign-in assertions retained. Reviewer ran no app/tests; root supplies execution above. Source fingerprints recorded by reviewer: cataloguea24fd616bff581e7ced0848f3aaee917af7eac22; AS01tests608c5dc5002d47a3e52ec55391d551489c013f59; AC09tests21ed568b65021b300abaf61fac5ed7f3250a5510.

J1: actual source research, pre-code reference, copy implementation, independent reusable-skill review and browserMCP observations. J2: specific learner promise/capabilities, without outcome measurements. J3: existing shared localization/architecture retained, no adoption claim. J4: clearer entry introduction supports planned walkthrough; final timed video/formal design approval remain separate.

Artifact `718489294f379eeb358d22309004c4ebb32e3768` retained as source evidence; exact source revision verified at 2026-10-09T20:23:46.7291178+01:00. GitHub MCP personal commit metadata/diff readback passed. Empty statuses and PR-filtered workflow-run lists do not establish hosted CI success. Miva commit MCP returned 404; its exact Git CLI head independently passed. Receipt: `.local/welcome-copy-publication.json`.

capstone-evidence-update reused actual browser automation through MCP for E017/A010, with saved readbacks at 20:26:49 Africa/Lagos. Correct private `m.alkali5130@miva.edu.ng` Sheet account verified. All five tabs compared: exactly 10 intended/actual changes at `Codex evidence!A18:J18`, zero mismatches/extra changes, unique E017 at A18. Kaneo saved A010 equals the 3,540-character LF prefix plus the entire exact 69,800-character prior history, 73,340 characters total. Full-string/suffix checks pass; title, In Progress, No date and entire ten-task board remain unchanged (1 To Do / 5 In Progress / 0 In Review / 4 Done, A007 retained). One Sheet paste and one task fill; a read-only final export fetch interruption and local unbound-variable diagnostic were resolved before successful export comparison, with no extra tracker mutation. Receipt `.local/welcome-copy-tracker-final-receipt.json` links the cell/string/board comparisons; proof images `.local/welcome-copy-tracker-{sheet,kaneo}-e017.png` were inspected. No tracker update remains pending. Documentation closeout publication follows; it does not change product behavior or the checked artifact.
