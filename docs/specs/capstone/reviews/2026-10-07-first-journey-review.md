# P04/P05 first-journey behavior review

7 October 2026, Africa/Lagos. Review author: independent Codex quality agent. Invoked `.agents/skills/learning-journey-review/SKILL.md` for this implementation increment, alongside the required Impeccable audit workflow. The separate [visual review](2026-10-07-first-journey-visual.md) owns its pixel verdict.

## Goal

Review the first usable private learning journey against the [increment contract](../increments/first-journey.md), including meaningful failure paths and the selected Amber shell. The reviewed state is the uncommitted candidate based on parent HEAD `e740fdc8cf4ac67e45470ffdfbf64826752b30d6`; the source fingerprint below identifies the final tested files. Publication is a later root-owned check, not inferred from this review.

**Conclusion:** the tested P04/P05 behaviors pass after the recorded corrections. Nineteen distinct browser cases have passing evidence across the corrected batches; this is not a claim that one full 19-case invocation passed. The final six affected cases passed against the frozen mobile-order and French-label correction. No reproduced behavioral defect from this review remains open. Full capstone acceptance, all-device accessibility, learner impact, and a completed Impeccable tool pipeline remain unverified.

## Context Pointers

- Inputs: `AGENTS.md`, `project-context.json`, [specification](../spec.md), [research](../research.md), [plan](../plan.md), [design](../design.md), [first-journey contract](../increments/first-journey.md), and [root verification](../increments/first-journey-verification.md).
- Source reviewed: shared contracts; domain progress/validation/templates; server authentication, persistence and transaction boundaries; client rendering, locale bindings, shell, editor and study flow. Regression findings below identify the affected modules. Test implementation is in `tests/e2e/helpers.ts`, `journey.spec.ts`, `shell.spec.ts`, and `inclusion.spec.ts`.
- Tooling prerequisite: [R15 feasibility](../experiments/quality-tooling.md) was closed at 21:02 before dependent production implementation. It records primary-source package compatibility and the isolated experiment. It is not application acceptance evidence.
- Browser environment: Node 24.19.0, pnpm 11.19.0, Playwright Test 1.63.0, installed Edge 154.0.4258.53 through `channel: "msedge"`, Windows, headless Chromium. No browser download or external account/message was used. Tests launch the built app at `http://127.0.0.1:4318`, with isolated synthetic `example.test` accounts and ignored `.local/e2e-data`. Root's separate browser-MCP walkthrough uses port 4317.

### Acceptance evidence matrix

Each pass applies to the behavior stated in its row. It does not automatically close every subcondition of the parent criterion.

| AC | Expected behavior in this increment | Evidence/revision | Result | Limitation |
| --- | --- | --- | --- | --- |
| AC01 | Manual/template plan stays unsaved until confirmation; actions and estimates are editable; accepted scope survives refresh | Manual journey, failed-save, template and scope-removal browser cases; current candidate; root domain/HTTP evidence | verified pass | No Comeback rescheduling. Browser cases are representative inputs, with bounds/calendar conflicts covered by domain/HTTP tests. |
| AC02 | Template exposes credible source/prerequisite details and an editable review; manual topics remain available | Template browser case reads the MDN HTML URL, prerequisite copy and eight editable actions before saving; source metadata/domain review | verified pass | Source attribution is verified; teaching effectiveness and live external URL availability are not established by saving a reference. |
| AC03 | Study, optional private reflection and explicit completion remain separate; skipping review does not block progress | Manual flow logs five minutes with no reflection and zero completion, then explicitly completes; French flow logs seven minutes/private note; unsaved-reflection regression | verified pass | Personal study cycle only; peer sharing remains P07. Minutes and completion are learner reports. |
| AC04 | Distinct activity uses the seven local calendar dates and preserves cumulative effort | Root's 20 passing Node tests cover timezone/midnight/DST/date deduplication; browser checks one activity date and retained minutes; `src/domain/progress.ts` | verified pass | Deterministic and synthetic evidence, not longitudinal observation or learning mastery. |
| AC05 | Current plan scope differs from retained historical completions/activity and from mastery | Browser removes a completed action, reloads to 0/1 current scope, then reads one historical completion and five study minutes; self-report wording asserted; root domain/HTTP empty-scope coverage | verified pass | Historical evidence is stored locally; not an assessed credential. |
| AC06–AC08 | Full Comeback and private peer-circle/invite lifecycle | First-journey contract explicitly reserves P06/P07; no corresponding routes implemented | unverified | Five-minute activity exists, but automatic date-preview/confirmation, peers and invites remain required future work. |
| AC09 | Private access, input/URL safety, plain-text rendering and sign-out hold | Root HTTP ownership/origin/Host/limit/retry tests; browser literal malicious-looking text, unsafe URL rejection, sign-out 401 and subsequent real sign-in | verified pass | Scoped private-account boundary only; no peer authorization, full security audit, email verification or password recovery. |
| AC10: persistence/failure | Saved journey survives refresh and an actual local server-process restart; failed save preserves input without claiming success | Browser refresh and aborted-save/retry cases; root `verify:process` with distinct Node PIDs and retained auth secret/session/plan/reflection/minutes/completion | verified pass | Process restart is root-executed evidence, not this agent's invocation or a machine reboot. |
| AC10: connectivity | Core path uses loopback while all non-loopback browser requests are blocked | Browser route boundary case: 30 loopback requests, zero external attempts, account/profile/plan/reload/study/reload succeeded | verified pass | Exact condition only. Physical internet and server egress were not disabled; server-off operation is not promised. A physical network-disconnection demonstration is not established. |
| AC11: localization/reflow | English desktop and French 320px private journeys, translated accessible labels, preserved input | Full English flow; French create/study/complete/reload; final editor locale/resize test and `Langue` accessible-name assertions | verified pass | No native-French human review, exhaustive language/state matrix, real mobile-device or browser-zoom run. Parent AC11 is not a blanket accessibility pass. |
| AC11a | Initial/changing OS preference applies until explicit persisted override; invalid stored choice falls back | Theme cases emulate dark/light changes, test native `color-scheme`, explicit override, reload and invalid enum | verified pass | Installed Edge only. No operating-system settings were changed on the user's real profile. |
| AC11b | Blocked preference storage leaves controls and editable input usable; only UI enums are stored | Browser injects a `localStorage` getter that throws `SecurityError`; theme/sidebar change while route/input/focus survive; allowlisted keys inspected in normal flow | verified pass | Getter failure exercises unavailable storage. Separate getItem-only/setItem-only failures are source-reviewed catch paths, not separately injected cases; unavailable storage has no persistence promise. |
| AC11c | Correct directional panel icons, accessible expanded state and desktop keyboard operation | Exact Lucide panel geometry and aria assertions; Enter collapse, visible route link, reload persistence, brand retained in blocked-storage case | verified pass | Targeted controls and source review; not an exhaustive screen-reader audit or all compact-rail hover states. |
| AC11d | Drawer contains keyboard focus, closes/restores focus and cleans up at desktop transition | French 320px case checks eight Tabs, Shift+Tab, Escape, visible Close, focus return and open-drawer resize to desktop; final confirmation passed | verified pass | Native showModal supplies modal/inert behavior; no separate assistive-technology traversal or every route-destination sequence. |
| AC11e | Responsive shell preserves content/functions/input; next action and return support precede lengthy path | No horizontal overflow at 320px, 50-step last-action reachability, editor resize retention; final French action entirely within 720px viewport and return support above path; fresh captures | verified pass | Representative 320×720 and 1280px layouts, not all window sizes, content lengths or 200% zoom. |
| AC11f | Sampled text, controls and focus meet contrast targets in both themes; forced-colors/reduced-motion keep navigation usable | Six computed-color samples per theme; input outline at least 2px; forced-colors/reduced-motion keyboard drawer/theme case | verified pass | Samples and operation only; no general WCAG conformance or complete color-state matrix. |
| AC12 | Fresh-checkout setup and independent adaptation | Current source is runnable; this review uses the existing host and installed dependencies | unverified | Fresh machine/checkout and adaptation rehearsal remain future evidence. |
| AC13 | Traceable Codex, reusable-skill and MCP work plus tracker/publication readback | This dated skill invocation, executable tests, correction history, R15 report; root independently records browser MCP observations | unverified | This review contributes evidence; it does not certify every required skill reuse, tracker save or remote head. Root owns those readbacks. |
| AC14 | Timed 3–5 minute demo of all five capabilities and Codex workflow | No recording/rehearsal performed in this review | unverified | Full product and demo milestone remain open. |

### Actual browser commands and results

All runs rebuilt through the configured Playwright web server. One worker and zero automatic retries were used. Results and logs are ignored local artifacts, not committed learner data. The final success does not relabel failed earlier invocations.

| Completed, Africa/Lagos | Exact command | Result | Local record |
| --- | --- | --- | --- |
| 21:28:19 | `pnpm run test:e2e` | Exit 1; 13/17 passed, four failed. Three account-fixture cadence failures; one real drawer Tab-escape defect. | `.local/e2e-first-run.log`, `.local/e2e-first-run-result.json` |
| 21:34:18 | `pnpm run test:e2e` | Exit 1; 17/18 passed, one failed. Added browser network-boundary case passed; remaining failure was the native Account summary selector. | `.local/e2e-confirmation-run.log`, `.local/e2e-confirmation-run-result.json` |
| 21:35:53 | `pnpm exec playwright test tests/e2e/journey.spec.ts --grep 'sign out|fifty-step'` | Exit 0; 2/2 passed. Corrected native-summary selector and added a real 50-step layout regression case. | `.local/e2e-focused-run.log`, `.local/e2e-focused-run-result.json` |
| 21:42:39 | `pnpm exec playwright test --grep 'sampled workspace|French mobile journey|changing language while editing|French 320px|fifty-step'` | Exit 0; 6/6 passed in 1.1 minutes after final mobile-order/French-label correction. Both contrast cases now also measure borders/focus; fresh captures produced. | `.local/e2e-layout-confirmation.log`, `.local/e2e-layout-confirmation-result.json` |

The nine journey cases, six shell cases and four inclusion cases total nineteen. The last focused run rechecks changed behavior rather than redundantly repeating unrelated passing cases. Assertions were not weakened to bypass a product failure.

Final test-source checks executed by this reviewer also passed: `pnpm exec biome format --write tests/e2e` (four files, no changes); `pnpm exec biome lint --error-on-warnings tests/e2e` (four files); and the following independent strict compiler check, exit 0:

```powershell
pnpm exec tsc --ignoreConfig --noEmit --strict --noUncheckedIndexedAccess --exactOptionalPropertyTypes --module NodeNext --moduleResolution NodeNext --target ES2023 --types node tests/e2e/helpers.ts tests/e2e/journey.spec.ts tests/e2e/shell.spec.ts tests/e2e/inclusion.spec.ts
```

TS7 requires `--ignoreConfig` when explicitly supplying source files alongside a project tsconfig; the corrected invocation above was executed. Playwright transpilation alone is not the compiler check.

Root-executed results are attributed to [first-journey verification](../increments/first-journey-verification.md): frozen install with lifecycle scripts disabled; `pnpm run check`, `pnpm run lint`, `pnpm run format:check`, `pnpm run build`, `pnpm test` (20/20: ten domain, nine HTTP subtests and their parent), `pnpm run verify:process`, and `pnpm run audit` all passed for the documented candidate. Root records actual tool history rather than inventing raw log files. Its separate browser-MCP walkthrough created/saved an eight-action template plan, recorded five minutes/private reflection, explicitly completed one action, and reloaded to retained progress. CLI Playwright and root browser MCP are distinct evidence routes.

### Captures, contrast and network boundary

Final corrected captures: `.local/e2e-captures/workspace-light.png`, `workspace-dark.png`, `workspace-mobile-fr.png`, and `mobile-fr-drawer.png`. These are full-page captures of real browser fixtures. They are not mockups, learner results or approval receipts. The drawer fixture contains an unsaved synthetic draft. Its screenshot extends beyond the viewport; that extension does not itself demonstrate a broken on-screen modal backdrop.

Computed browser CSS colors were converted through Canvas and alpha-composited through element ancestors before WCAG relative-luminance calculation. Measurements below are rounded from the saved JSON; assertions use unrounded values. Outline width is separately asserted to be at least 2px.

| Sample | Light ratio | Dark ratio | Required ratio |
| --- | ---: | ---: | ---: |
| Main heading | 17.39:1 | 16.57:1 | 3:1, large text |
| Current progress | 14.88:1 | 14.66:1 | 4.5:1 |
| Self-report explanation | 6.19:1 | 10.09:1 | 4.5:1 |
| Primary study action | 9.93:1 | 9.93:1 | 4.5:1 |
| Goal input border | 3.52:1 | 5.38:1 | 3:1 |
| Goal input focus outline | 6.58:1 | 8.87:1 | 3:1 |

Raw values: `.local/e2e-captures/contrast-light.json` and `contrast-dark.json`. Gradient/text-over-image contrast and unsampled interactive states are outside this measurement.

`.local/e2e-captures/network-boundary.json` records exactly 30 loopback requests and zero attempted non-loopback requests. Playwright intercepted all browser requests and would abort any external request; the built local server stayed running throughout account creation, profile/plan save, reload, study save and reload. Physical internet was not disconnected, server egress was not blocked, and the test does not promise availability with the local server stopped.

## Constraints

### Findings and dispositions

| Priority / AC | Observed issue | Correction and verification | Disposition |
| --- | --- | --- | --- |
| P1 / AC03, AC10 | Completing a step could clear the unsaved-reflection guard despite not saving that note. | `main.ts` now clears dirty state only when the study-save callback reports a saved session. Browser dismisses the leave warning, confirms note retained, then saves deliberately. | Resolved; browser regression passed. |
| P1 / AC11d | Native Edge dialog let Tab leave the mobile drawer in the first browser batch. | `shell.ts` adds scoped first/last Tab wrapping while keeping native showModal/Escape. Corrected full batch and final focused French case pass. | Resolved. |
| P2 / AC01, AC11b | Changing profile locale incremented plan revision and could reject the learner's still-open editor as stale. | `store.ts` saves locale/timezone preferences without revising the schedule; domain/HTTP and browser locale-edit checks pass. Final test also resizes the unsaved editor in both directions without losing input or focus. | Resolved. |
| P2 / AC11, F16 | Fresh independent visual review found progress before the next action and return support after the full path on mobile. | `journey.ts` moves the same live nodes inside its own layout on the breakpoint, retains focus and removes stale listeners. Final French 320px test proves action before progress, primary button within initial 720px height, and return support before path. | Behavioral fix verified; separate visual reviewer owns pixel confirmation. |
| P2 / AC11 | Root MCP readback found French language chooser still named “Language”. | `shell.ts` now updates aria-label and selected value in one locale binding. Final French cases explicitly require accessible name “Langue”. | Resolved. |
| P2 / AC11e | Individual progress markers could overlap for more than twelve steps. | Native progress representation for long plans; actual 50-action manual plan has no 320px horizontal overflow, and the last action opens the study view. | Resolved; focused and final focused case passed. |
| P2 / AC10 | UI implementer identified editable controls during an in-flight captured save as a risk of silently replacing later typing. | `ui.ts` lockForm freezes/restores form controls and aria-busy during writes; source inspected and ordinary save/failure cases pass. | Correction source-reviewed; a dedicated delayed-response typing scenario was not executed. |
| P3 / AC03, AC11 | Root observed singular-count wording and focus lost after successful save. | Count-aware English/French messages and focused status nodes; ordinary saved-flow and exact singular-copy assertions pass. | Correction reviewed; screen-reader announcement quality not independently measured. |

The three initial synthetic-account failures came from the test helper's insufficient delay, not a demonstrated account product defect. Inspection of pinned Better Auth code showed the three-attempt path bucket resets after ten seconds of inactivity since its last allowed request. The helper now waits at least 10.1 seconds between synthetic account setups/additional sign-ins. Server rate limits remain enabled. The remaining Account failure used a button-role selector for a native `summary` exposed differently in Edge; the corrected test finds its accessible label and activates Enter, preserving the required user interaction.

### Unavailable or bounded evidence

- The application was actually exercised, but only on this Windows/Edge host with synthetic data. The suite does not establish Chrome/Firefox/WebKit support, real-device usability, native-French quality, all-state accessibility or educational effectiveness. No physical network disconnection or explicit browser-zoom run was performed by this reviewer.
- Root's dependency advisory check found no known vulnerabilities at execution time; this is not a full security assessment. Local accounts are unverified emails with no recovery. The local database is not encrypted and must remain in the ignored data directory.
- The selected image and shell references predate implementation. The separate Impeccable review records the real tool state: measured semantic specification, no raster plates, and unavailable later fidelity/detector/receipt evidence. No forced gate, invented approval, specialized-agent invocation, or completed native pipeline is claimed.
- Comeback schedule recovery, peer-circle consent/invites/lifecycle, fresh-checkout/adaptation rehearsal, actual learner observations, a timed demo and production delivery remain outside this passing increment. The 14 October date remains an internal target, not an authoritative submission deadline.
- Root owns Google Sheet/Kaneo reconciliation, GitHub publication and remote-head verification. No messages, tracker changes, commits, pushes, paid services or recovery registration were performed by this reviewer. Logs/traces/runtime databases and synthetic passwords remain ignored locally; intended source/tests and this report are reviewable tracked artifacts.

## Done When

This review's execution is complete: nineteen distinct browser cases have passing evidence, all six cases affected by the final layout/label change passed on the rebuilt frozen candidate, compiler/lint/format checks for the tests passed, real defects were reported to their owners and corrected, and limitations are explicit. Final paired captures were handed to the independent visual reviewer after freshness was confirmed.

Root can use this report for the scoped P04/P05 milestone and judging evidence, then complete visual disposition, documentation/tracker readback and authorized source publication. It must retain the unverified full-capstone criteria rather than presenting these tests as complete-product acceptance. Further behavior changes require affected verification against the new source; the fingerprint below is a snapshot, not a future promise.

### Final source fingerprint

The following SHA-256 values identify actual workspace bytes after the final passing focused run and the no-change test formatter check. They are not Git object IDs. Documentation/tracker reconciliation may continue without changing this tested source. Runtime data, credentials, node_modules and generated build output are intentionally excluded.

Recorded at 2026-10-07T21:47:23.6420004+01:00 (Africa/Lagos).

| File | SHA-256 |
| --- | --- |
| `src/client/api.ts` | `383cca8a7ef83572ce862b4e378c16e40a5fb2322f15e288f99c33afa935b98d` |
| `src/client/i18n.ts` | `e77c4ec3257d432b93cb1419fba98664059ac8022861a86be42967f5cf633b0a` |
| `src/client/journey.ts` | `4810acfef8d75dd1492cabcbc0f4f220b3af80d60ed47dfc9a3513ac0a2de6e5` |
| `src/client/main.ts` | `831ead437f1b589d4721a74865e81c09e1e355e8e209caaa54c22954b130634b` |
| `src/client/plan-editor.ts` | `d92cd998551e76c5cd05bb2424c92b95077821dd55b08d827998f1d8e6b9be72` |
| `src/client/shell.ts` | `6e034e7314d3334ec0983dd44abea6156a95afa6cf1841032e118f59f8afd9d1` |
| `src/client/styles.css` | `78522f6192577570398d56fe1ab417384ebbcecbdc1d3e7aedeec48c2fae04c4` |
| `src/client/ui.ts` | `ffb10547a77f66fdfcd8d721bdf060faf3522fcd1a45afdb84576008d5c13187` |
| `src/client/vite-env.d.ts` | `65996936fbb042915f7b74a200fcdde7e410f32a669b1ab9597cfaa4b0faddb5` |
| `src/domain/progress.ts` | `7aa37c54f9d9ed4414bf3703556c02588c5b1adc105667ea2c87d207c3849ab2` |
| `src/domain/templates.ts` | `0398d41f8281c6948aade72fcce0561d2bc13fd4cb491fbf7d4e0e64dc712a1e` |
| `src/domain/validation.ts` | `76807f24b40225ece7bbfd77ad6c7bb4edb35bb93cebf238564af49e4ec86b70` |
| `src/server/app.ts` | `7f8bbfc900fbc016218179486c96f996f9982b2bf0f85a77e0b3340cb4d263fd` |
| `src/server/index.ts` | `4aebcdc19371b980454b9a5c61dae2d405210f816a4ef008f123e20c0ded345b` |
| `src/server/store.ts` | `b95427225a9a1ed1fd0c416231984030ed90a266111130ab39fcd08d3d167fcd` |
| `src/shared/contracts.ts` | `c75c234137ce38c101647212d3d6e061b4a6339b10044754bd70936ff47d0a4f` |
| `tests/domain/journey.test.ts` | `fcdb6542a8a04ba7937fdaa50a9af8c84c23df81d3fc7341e8de826181f9e883` |
| `tests/e2e/helpers.ts` | `7788a572b6bc661f511089c7a898960528620d42fe2ba91eea5088f2fd4cc4ce` |
| `tests/e2e/inclusion.spec.ts` | `ffa3d26284e7ef8620bfdbbfa70a38a50d74de3b4feb2f9ed7850290c5685784` |
| `tests/e2e/journey.spec.ts` | `1bba83cd9c0f324766d1a2f715ac5561db17163535b2dade74fb82f1322eb706` |
| `tests/e2e/shell.spec.ts` | `caf16671c62916a02bd816473a93a81c1c1e3fe3686d36f7fbeafccc3bd4a95d` |
| `tests/server/journey.test.ts` | `5b8cf2fbab6050ea6258071c98ae6ae69952b0f262777d3e95a3f1969abae3e9` |
| `tools/run-unit-tests.mjs` | `e558e7a533527de6c88086ed32bbfd33c610e5667f00d31092ba2086e4fa710a` |
| `tools/verify-process.mjs` | `ca3a829bc3cad8694bd3e3c6b46e06d841c3ca52074b08b18b80160ad95efc88` |
| `package.json` | `7b6676d257e0d1a2a696fa66b763416f0e557a1331e8441e2da587b1e410910e` |
| `pnpm-lock.yaml` | `fa245a6fe8b8213d489fba8a00fa11275d3474aa1e6450911fe48ba70936106a` |
| `playwright.config.ts` | `eb09d45ab985991bb91b6628c7ff9c6218e6fb0357bc1bf3a6c51b6013189f13` |
| `biome.json` | `655a1cb6c98f09713fd61c5fdad9dcd00ba60662db92759a68b14a5fb43c352c` |
| `tsconfig.json` | `c1437e86f58024150ab21f48ce399b477ed73bc0563525d80bd6a6e9e54894a3` |
| `tsconfig.server.json` | `8f65d8e4eb145431e53f72408c8bc6ea5a7ecdba85c68de864d2cbf3308dc195` |
| `tsconfig.tests.json` | `7490f86cc0569ca943164b82f170d3e60250ba9605b087814c58161f0cf08ae3` |
| `vite.config.ts` | `c0b4cbc2db2e3ede11608640300e32de62e302c51e3ead4b857c8c22c8a100be` |
| `index.html` | `5a91a8176dd46177dcffa3e0db1f6e34f6d27dd9eb0c6db3e074c64b9e0b6a3c` |
