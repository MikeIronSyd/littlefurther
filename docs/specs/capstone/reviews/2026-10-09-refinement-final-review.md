# Independent final review — focused learner-flow corrections

9 October 2026, Africa/Lagos. Source review completed against baseline `526ec3402c09e2e098e83dc44cd658428830f2cb` and the stabilized uncommitted refinement candidate inspected at 12:07. Root supplied final full-browser execution evidence at 12:13; source/test fingerprints remained unchanged. This replaces the incomplete synthesis status of the [initial independent review](2026-10-09-refinement-review.md), preserving that report as earlier evidence.

## Goal

Independently review RF01–RF05 from the [refinement contract](../increments/design-refinement.md), including the released editor, root caller/localization/resource changes, one scoped CSS correction and the focused regression fixtures. **No blocking source finding or failing required check remains within these five corrections.** Focused/full behavior evidence is attributed to root. This scoped technical review is complete; it does not establish tracker delivery, publication or full-capstone completion.

The [learning-journey-review skill](../../../../.agents/skills/learning-journey-review/SKILL.md) was invoked on the actual contract, research, candidate source and execution records. The installed Impeccable skill and its harden/critique guidance informed this bounded review of error recovery, localization, native controls, preserved input and scope. Existing session context was inherited; no context command, detector, critique command, formal phase or browser inspection was repeated by this reviewer.

## Context Pointers

Read `AGENTS.md`, active `project-context.json`, the capstone specification AC01–AC03/AC11, P09 view/session boundaries, P10 reuse evidence, R21 and its [editor](2026-10-09-refinement-editor-research.md)/[test](2026-10-09-refinement-test-research.md) research, incumbent PRODUCT/DESIGN/surface context, the initial review and [root verification record](../increments/design-refinement-verification.md). R21 records closure at 11:41 before dependent production edits; this review finds no new consequential research blocker.

Inspected the complete changed source and relevant unchanged DOM helpers, locale binding, shared DTOs, domain validation, catalog and profile persistence. Production changes are confined to five client files; API/server/domain/shared schema, package scripts, dependency pins and lockfile are unchanged. The new focused test file is also reviewed. Content fingerprints identify the source candidate even before publication:

| File | SHA-256 at source review |
| --- | --- |
| `src/client/main.ts` | `AF57F26E5710F9811ABD76B1412C168016CFFCCE1A68EB7E5A99684623C67A47` |
| `src/client/journey.ts` | `5B03081BCBA5AD85F8385FDA295679744B7C39256FB678096BE99A1BBCBC6D1F` |
| `src/client/plan-editor.ts` | `0EE2782468482F3AADE0786C62EAC2CBB3AC41201AE6B3835D773416BF0D1D26` |
| `src/client/i18n.ts` | `B2C0415A2B125D2387FF8012E2D57F992E23EAF26832F59AB42C19827889E5F5` |
| `src/client/styles.css` | `71C2C69C1F0BFCA0A05BD08D9DA6DF1CBDB15F62E1068D2957123222B0F3ABBE` |
| `tests/e2e/design-refinement.spec.ts` | `9C25A19E59B2D68E2424FFC9372C61CDBA092C708E825DD1A685D607F795223B` |

### Acceptance and evidence matrix

| Criterion / affected AC | Expected behavior and inspected candidate evidence | Result | Limitation |
| --- | --- | --- | --- |
| RF01 / AC01, AC11 | `plan-editor.ts:79–87/254–369/391–423` uses persisted IDs or generated draft uiId, recreates a map by that identity, follows the moved row, falls back to its Action at a disabled boundary, chooses next/previous Remove or empty Add, and focuses newly added Action. Localized polite position/removal status, completed locks and removal-consent reset remain. `:456` strips completed and uiId from API steps. Root's focused move/removal/add/consent cases and Enter observation supply execution evidence. | **Verified pass**, scoped; source independently reviewed, execution attributed to root. | Browser focus/status assertions do not establish physical screen-reader pronunciation or comprehensive accessibility. |
| RF02 / AC03, AC11 | `journey.ts:58–117` retains the seven calendar markers/count logic while `bind` refreshes each formatted calendar date plus neutral recorded/no-record label. EN/FR keys exist. Root's recorded-study overview/Activity case compares unchanged progress, and MCP readback observes French labels for actual study/no-record dates. | **Verified pass**, scoped; execution attributed to root. | No assessed mastery, retention or new calendar algorithm is inferred. |
| RF03 / AC01, AC11 | `plan-editor.ts:20–51/189–223/371–405/440–447` provides separate missing/malformed/excess-date and missing/excess/overlong-topic errors. Text-only malformed tokens, retained hint/error associations, first custom-invalid visible field focus, independent clearing and locale rebinding preserve draft/input. Custom validation precedes explicit native `reportValidity`. Root's two focused cases cover errors, bounds, field association, French switching, retained reviewed input and no premature POST. | **Verified pass**, scoped; execution attributed to root. | Server validation remains authoritative. Native-French certification and all possible input/error combinations are unverified. |
| RF04 / AC01, AC11 | `journey.ts:135/161` distinguishes full-plan and current-step edit. `main.ts:315–340` mounts the ordinary editor, preserves current-view/dirty/save guards, focuses heading and invokes selected focus synchronously. `plan-editor.ts:329–348/505–512` resolves persisted selection, updates context after reorder and refuses absent/disconnected targets. Root's French 320px second-step case covers locks, moved selection, dirty-cancel rejection/acceptance and full Edit plan heading entry. | **Verified pass**, scoped; execution attributed to root. | Unknown/stale ID fallback is independently source-inspected; no separate stale-ID browser fixture is claimed. No new route or step-only editor exists. |
| RF05 / AC02, AC03, AC11 | `journey.ts:328–361/452–456` uses already-loaded templates, requires both stored ID and version, renders current-locale labels/URLs/check dates and mismatch copy, retains learner links, deduplicates each displayed list without changing plan arrays, and hides empty manual resources. Links use DOM text, `_blank` and `noopener noreferrer`; unchanged server safeUrl enforces HTTP(S) without credentials. Locale rebinding replaces resources only, preserving study controls. Root's focused template/duplicate/manual/empty/mismatch cases and paired MCP inspection supply evidence. `styles.css:1011–1016` reuses 780px/28px measure and spacing plus existing supporting-heading rhythm. | **Verified pass**, scoped; execution attributed to root. | Catalog duplication/version mismatch are intercepted rendering fixtures. No source fetching, external source revalidation or new backend version capability is claimed. |

## Constraints

### Findings and fixture review

No blocking correctness, scope, privacy, DTO, focus-lifetime or localization finding was identified in the stabilized candidate. The prior strict exactOptionalPropertyTypes failure is resolved at `main.ts:337` by omitting an absent selectedStepId. It is not suppressed by a compiler change. The returned focus callback has no deferred work and checks the mounted input's connection; existing session/view callbacks and profile-write serialization remain in place.

Setting `form.noValidate` lets precise availability feedback run on submission; `form.reportValidity()` still checks native goal, target/step dates, minutes and deliberate removal consent before request construction. Topics are required only during manual new-draft creation, then hidden once reviewed. Locale callbacks update connected error/status/resource nodes; user-authored titles, values, reflections and URLs are not translated or reconstructed. Rendering external resources performs no request and gives the existing internet disclosure. The CSS addition changes only the new study-resource measure, logging gap and heading rhythm, preserving existing Amber/theme tokens and link wrapping.

The six first-run focused failures remain recorded as failed executions, followed by correction and a passing eight-case run. The stabilized tests retain their intended assertions:

- Correct form/label expectations match existing localized accessible names; field locators remain attached across label translation, with accessible names asserted explicitly.
- `expectLearningDataPreserved` (`design-refinement.spec.ts:25–34`) excludes only plan.locale and plan.updatedAt from the equality comparison, asserts en-to-fr and a monotonic timestamp, and compares every other plan field, revision, progress and history exactly. Unchanged `store.ts:93–110` deliberately writes those two metadata fields when the profile language changes. This correction preserves the private-data invariant rather than treating an authorized display-language update as a forbidden write.
- Input-order assertions use actual text input values. Keyboard middle/boundary focus, field hint/error associations, explicit no-write checks, selected second-step context, safe links, duplicate resource counts and mismatch/no-borrow behavior remain asserted.
- API readback verifies persisted learner records independently of rendering-only page interception. The mismatch fixture does not alter the database or claim that normal APIs accept an unknown template version.

### Actual execution provenance

This reviewer performed read-only source/diff/document inspection and authored only this review record. **No application was observed and no compiler, product test, browser suite, detector, tracker or publication action ran in this reviewer context.** Root's exact executions and MCP observations are retained in the linked verification record, including earlier failures and their corrections:

| Root check | Attributed final outcome at this review |
| --- | --- |
| Strict check, lint, format check | Final exit 0 after explicit optional-property/test-format corrections; settings unchanged. |
| Build | Exit 0; browser-runner rebuild includes the final resource spacing. |
| Domain/store/HTTP tests | Exit 0, 56/56. |
| Distinct-process verification | Exit 0 within the documented child-process restart scope. |
| Registry dependency audit | Exit 0, no known vulnerability found at execution; not comprehensive security certification. |
| Focused browser file | First 2 pass/6 fixture failures; corrected run exit 0, 8/8 in 1.5 minutes. |
| Full browser suite | `pnpm --pm-on-fail=download run test:e2e`: exit 0, 56/56 passed in 11.1 minutes, including the new 8 and prior 48 cases; no failures or skips. Root session 86146 completed at 12:13 Africa/Lagos. |
| Browser MCP | Root's one batched desktop/mobile inspection and spacing confirmation observed error recovery, keyboard reorder, EN/FR resources/reflection preservation, theme/mobile selected focus and in-place activity labels. |
| Impeccable detector | Root ran once: 34 advisories, comprising 28 font-size/4 color/2 radius; no non-advisory finding. This is not a clean-detector claim or formal phase pass. |

Formal six-item human receipt, authenticated assembled capture, QUALITY BAR, timed video, broad accessibility/device coverage, native-French validation, human adoption and learner outcomes remain separate open deliverables. This report does not rerate the earlier critique, approve those gates or establish retention/mastery benefit. No API/schema/dependency, runtime AI, source fetching, peer behavior, public deployment or global recovery change is within this review.

## Done When

Independent stabilized source and fixture review is complete with no scoped blocker. RF01–RF05 have passing focused behavior evidence, and all required code checks, the 56-case domain/store/HTTP suite and the 56-case full browser suite passed, with execution attributed to root. The fingerprinted candidate is ready within this technical correction scope; no product check was repeated by this reviewer. Root owns final verification/delivery records, tracker readback, normal authorized publication and both-remote checks. This review's conclusion applies only to the fingerprinted source candidate and the execution scopes recorded above; the separately listed formal design/demo/outcome deliverables remain open.
