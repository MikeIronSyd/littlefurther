# Independent auth-shell and theme review — 9 October 2026

## Goal

Review the focused implementation against AS01–AS06, F15/F16 and the affected AC11 requirements. Invoke `learning-journey-review` with Impeccable's incumbent-context and technical review guidance. Baseline is `08231721b5c844fccb160292a7c7edcf286f8818`; the first source inspection occurred at14:10 Africa/Lagos on9October2026 in its uncommitted working tree. No scoped production blocker was found in this inspection. Behavioral verification and delivery remain unverified pending root results.

## Context Pointers

Inspected `project-context.json`, local AGENTS.md, the main specification, `increments/auth-shell.md` R22/AS01–AS06, the pre-code reference provenance, changed production source and relevant unchanged authentication/session/i18n callers. Impeccable context loaded successfully for `src/client/shell.ts`; the Amber Operate system and reference are preserved. This review does not rerun the root's bounded browser pass or detector.

| AC | Expected behavior | Evidence / revision | Result | Limitation |
| --- | --- | --- | --- | --- |
| AS01 | Signed-out entry hides navigation/account and reclaims the frame | `shell.ts` identity-driven visibility; `styles.css` native-hidden rule and more-specific signed-out grid; baseline plus uncommitted changes | Unverified behavior; source is consistent | Desktop/mobile execution is pending |
| AS02 | Signed-in navigation restores preference; clear session closes drawer/popover/lock and moves focus after unlock | `setUser`, drawer close guard, `clearSession`, sign-out try/finally and current-view-guarded auth microtask | Unverified behavior; source is consistent | Real success/failure/401 transitions are pending |
| AS03 | Moon/sun changing localized action names, no pressed state, decorative SVG and44px control | `paintTheme`, EN/FR keys, `ui.icon`, token-based theme-control styles | Unverified behavior; source is consistent | Rendered geometry, target size, keyboard and forced colors are pending |
| AS04 | Current hover/focus tooltip, Escape dismissal and retained control focus | Shell-local hover/focus/dismiss flags and Escape handler; labels repaint on locale/theme | Unverified behavior; source is consistent | Actual pointer, keyboard and dismiss interaction is pending |
| AS05 | Device/storage precedence and retained input | Existing guarded storage enum reads/writes remain; in-place theme/locale repaint rather than auth/form rerender | Unverified behavior; source is consistent | New auth-form cases and retained existing storage/device cases are pending |
| AS06 | Actual checks, independent review, visual evidence and truthful delivery | This review invokes both skills; R22 precedes code and reference provenance remains explicitly unapproved | Unverified delivery | Root checks/browser results and publication/readback are pending |

Initial production SHA-256 fingerprint:

| File | SHA-256 |
| --- | --- |
| `src/client/shell.ts` | `4d2426e07dea8702ba12bf0a3219fca4cc0e9bc68223a1a3e187422c9c5cf2f8` |
| `src/client/main.ts` | `0790a8ebeb6a4e1783650f46961b9cef6c568ceb8e2685dbd7278bae00e7da3c` |
| `src/client/ui.ts` | `0c70680a1ddba91a5f7654a64ece85ab1d2e196df62c256d461c862a2ccb1f7b` |
| `src/client/i18n.ts` | `6673fc1ee789b1693d2d65951d507ae520bf613878791c78beaafebb791bde16` |
| `src/client/styles.css` | `44de3d4472175a522ddaeee5f724f48c5b7cd08e60840afd6002bc8c6756d466` |

## Constraints

No P0/P1/P2 production finding was identified in the inspected delta. Identity remains server-authorized; the shell visibility change is not an authorization boundary. No server contract, schema, dependency, learner-data persistence, guest flow or runtime request was added.

One documentation alignment note was reported to root: research catalogue S17 still says F15 chooses the earlier stable-label toggle. It should explicitly mark that choice historical and superseded by AS03/current F15. This is documentation accuracy, not a behavior blocker.

The independent reviewer ran source/document inspection and Impeccable context only. It did not run application tests or observe a running app. Source reasoning does not pass behavior. Full accessibility conformance, native-French quality, physical-device interaction, learner retention/mastery/adoption and the final video are outside this review. The formal Impeccable approval receipt and authenticated capture remain separate and unresolved; no human approval is inferred from the reference, implementation or this review.

## Done When

The first scoped source review is complete with no production blocker. Inspect the final E2E changes and root verification/browser evidence, confirm the production fingerprint, and record actual outcomes before using this review as release evidence. Both tracker readbacks and the intended source revision are root delivery responsibilities and must remain separately evidenced.

---

## Continuation — independent source, fixture and evidence review

### Goal

Complete the review after the first reviewer stopped because of its usage limit, preserving its actual partial review above. The continuation began at17:22 and reconciled completed root evidence at17:35 Africa/Lagos. It invokes `learning-journey-review` and Impeccable's scoped technical review guidance. The reviewed HEAD remains `08231721b5c844fccb160292a7c7edcf286f8818`, with the auth-shell changes uncommitted. No scoped P0/P1/P2 production or test blocker was found. AS01–AS05 have relevant passing execution evidence; the implementation is ready for the root's authorized delivery within this scope. AS06 tracker/publication completion remains separately evidenced.

### Context Pointers

Re-inspected AGENTS.md, `project-context.json`, F15/F16 and AC11a–f, R22/AS01–AS06, reference provenance, all five changed production files, the seven new auth-shell cases, and the changed fixtures in `shell`, `inclusion`, `circle`, `comeback` and `design-refinement`. Relevant unchanged `main.ts` callers, `i18n.ts` bindings, `ui.ts` focus/locking helpers, real-account/rate-limit helpers, Playwright configuration and failed-sign-out/delayed-response integration cases were inspected. Impeccable context loaded successfully once for `src/client/shell.ts`. Subsequently inspected root's actual focused/full/unit/check/lint/format/process/audit logs, detector JSON, paired saved browser screenshots and [verification record](../increments/auth-shell-verification.md). No detector or browser pass was duplicated.

| AC | Expected behavior | Evidence / revision | Result | Limitation |
| --- | --- | --- | --- | --- |
| AS01 | Sign-in/sign-up hide navigation/account and reclaim desktop/320px width | Independently reviewed identity visibility/CSS; both viewport cases pass in root's13/13 focused and63/63 full logs; root MCP reports x0/full-width/no DOM overflow; saved composition inspected | Verified pass within tested scope | Emulated Edge/IAB evidence; the mobile raster crop remains a capture limitation |
| AS02 | Session clear closes modal/account/body lock, focuses current auth after unlock and preserves collapse; failed sign-out retains draft/session | Independently reviewed guarded lifecycle; new success/re-auth and real-revocation/401 cases pass; full-suite failed-sign-out and delayed-response integration cases pass | Verified pass within tested scope | Tests/root observed the running app; the independent reviewers did not execute transitions themselves |
| AS03 | Decorative moon/sun, localized changing action, no pressed state, 44px target and visible focus | New passing case asserts both geometries, SVG semantics, target bounds, names, Enter/Space and outline; root DOM readback and inspected saved captures agree | Verified pass within tested scope | Targeted keyboard/rendering evidence, not full assistive-technology or physical-device verification |
| AS04 | Tooltip action updates on theme/locale, hover/focus shows it, Escape dismisses it, control focus/input remain | Passing pointer/keyboard/current-action/Escape test; passing auth-input/node-identity preservation case; independently reviewed local state and connected binding | Verified pass within tested scope | Broad screen-reader behavior and universal pointer/touch compatibility remain unverified |
| AS05 | Device preference/storage precedence and in-place private input preservation | Passing auth-input/blocked-storage tests plus retained device/invalid-storage/learner-draft cases; full circle/Comeback/reference regressions and56 domain/store/HTTP cases pass | Verified pass within tested scope | Only current-page fallback is promised when storage is blocked; no machine reboot or physical internet-disconnection inference |
| AS06 | Truthful checks, independent review, bounded browser review and delivery records | R22/reference precede source; actual root checks/browser/detector evidence reviewed; original independent review and continuation retained | Unverified delivery; checks and scoped review evidenced | Tracker saved comparisons and both publication heads are root responsibilities; formal design approval remains open |

At17:22 and again after the completed full suite at17:34, all five production SHA-256 values exactly matched the first review's table. The current stabilized test files have these SHA-256 values:

| File | SHA-256 |
| --- | --- |
| `tests/e2e/auth-shell.spec.ts` | `ab99b4bc954c9e00ff7a4ad09bc10e0fc7099c473ceabf54e17d4f5f7e006ebc` |
| `tests/e2e/shell.spec.ts` | `c3c96e312edf678909d57d081119dc91330e39f85cbb86cd2e02b7b31f172c1d` |
| `tests/e2e/inclusion.spec.ts` | `82623bd4210825b042524b94948b9e2974332e92e6b2f61efe3267a93bc92ad7` |
| `tests/e2e/circle.spec.ts` | `192aea30cbd3d0910710697f16d28d4203f7a8e4de64bb82a54b9391e2710ef3` |
| `tests/e2e/comeback.spec.ts` | `751de59eaf28780845ed6f1f77e3e0fa4bec077906c0e3afc36d0923bc24f703` |
| `tests/e2e/design-refinement.spec.ts` | `826a9db6ddfc9514bd99f9a0d6cecc7e015cbe735cfdf8c73fa255727abdf5a7` |

### Constraints

No scoped blocker was identified. The first review's S17 alignment note is resolved: the current catalogue explicitly marks the stable-name toggle as historical and superseded by the 9 October decision and R22/AS03.

Root reported an initial focused run with two fixture-locator failures. The continuation directly confirmed their corrections against source: the locale test retains `.language-select` across the `Language` → `Langue` accessible-name change, then asserts both names; the auth-input test uses the current French `needAccount` text, “Première visite ? Créer un compte”. These changes do not weaken the acceptance assertions. The corrected focused13/13 and full63/63 cases pass. A subsequent formatter failure was corrected only in the new test file; direct reread confirmed that the French account-link click was wrapped across three lines. The17:22 test hash was `acfd3a4a4f3bdb030435d4f3db8feed6a48a1dac36cc9d62d31203ccb51548f2`; the final format-only hash is recorded above. Other reviewed test hashes and production hashes remain unchanged.

The real-expiry fixture delays a genuine `/api/plans` request, revokes the actual server session, confirms `/api/me` is 401, then forwards the held request to the server and asserts its 401 before checking drawer/lock/focus cleanup. The response is not a fabricated expiry payload. Account creation remains synthetic, the existing one-worker configuration remains intact, and the added failure cooldown respects the existing authentication limit rather than changing auth behavior. Explicit light preference in affected fixtures removes device-dependent next-action ambiguity.

Actual root execution reviewed:

| Command / evidence | Reviewed actual result |
| --- | --- |
| `pnpm --pm-on-fail=download run check`, `run lint`, `run format:check`, `run build` | Root reports final exit0 for each; strict/lint/format logs directly inspected, build recorded in verification and current full-suite launch. Final full formatter check passes after the scoped format correction. |
| `pnpm --pm-on-fail=download test` | `.local/auth-shell-unit-final.log`:56/56 pass,0fail/skip; root confirms exit0. |
| `pnpm --pm-on-fail=download run verify:process` | `.local/auth-shell-process.log`: distinct-process persisted-state check passes; root confirms exit0. |
| `pnpm --pm-on-fail=download exec playwright test tests/e2e/auth-shell.spec.ts tests/e2e/shell.spec.ts` | `.local/auth-shell-focused-final.log`:13/13 pass in1.4minutes; root confirms exit0. |
| `pnpm --pm-on-fail=download run test:e2e` | `.local/auth-shell-e2e-final.log`:63/63 pass in11.6minutes; root confirms final exit0. Includes failed-sign-out, delayed profile/locale responses, forced colors/reduced motion, sampled light/dark contrast, circle/Comeback/reference and non-loopback-blocked local-server regressions. |
| `pnpm --pm-on-fail=download run audit` | `.local/auth-shell-audit.log`: no known registry vulnerabilities; root confirms exit0. |
| `impeccable.cmd detect --json src/client/shell.ts src/client/main.ts src/client/ui.ts src/client/i18n.ts src/client/styles.css` | Root confirms exit0; independently parsed `.local/auth-shell-detector.json`:32advisories (27font,4color,1radius),0non-advisory findings. This is not a clean-advisory pass. |

Root observed the running normal demo at `http://127.0.0.1:4317/` through browser/computer-use MCP in one paired1440px light/English and320px dark/French pass. It reported main x0/full viewport width, no horizontal DOM overflow, retained populated auth inputs through actual theme/locale actions, and correct action names/target geometry. The continuation inspected the saved static captures `.local/auth-shell-browser/desktop-en-light.png` and `mobile-fr-dark.png`. Desktop composition is consistent with the focused auth layout; the mobile full-page image visibly has the reported16px right crop. Root readback separately establishes innerWidth/clientWidth/scrollWidth320 and input/button right308, so the cropped image is not treated as an uncropped golden or evidence of product overflow.

Both independent reviewers performed source/document inspection; neither executed application tests or directly observed a running app for this review. The continuation inspected root-run logs and static screenshots. The root's browser pass and test commands remain attributed to root. This is a scoped review of the requested change, not a comprehensive Impeccable audit score, accessibility certification, native-French certification, physical-device proof, learner-outcome evidence or formal design approval. Delivery evidence remains root-owned.

### Done When

Independent stabilized source/fixture scrutiny and review of completed root evidence are complete with no scoped blocker. The original production fingerprints remain unchanged; final test formatting is explicitly traced. No additional test, browser pass or detector run is required by this scoped review. Root may proceed with authorized delivery and record E014 saved tracker comparisons and the intended source revision separately. This report does not claim those delivery actions, close the formal design gate or establish complete capstone acceptance.
