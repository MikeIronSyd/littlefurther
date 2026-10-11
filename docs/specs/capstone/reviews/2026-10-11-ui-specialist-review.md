# Whole-interface review with the new UI resources

Date:11October2026, Africa/Lagos. Application revision:`c7ddff22a5756aaa2a979f7ca0b2a5fca19024a7`.

Method: independent design Assessment A (`ui_layout_reference_review`) and independent deterministic/browser Assessment B (`ui_motion_metadata_review`), plus an accessibility specialist and root's isolated live validation. A completed before B's fresh detector results entered synthesis. This is a review of the existing app, not implementation of the recommendations or formal design approval.

## Goal

Review LittleFurther's complete interface families with Impeccable and the new `ui-ux-resources` companion: layout, hierarchy, typography, controls/icons, forms, keyboard/focus, errors, responsive themes, relevant metadata and motion. Preserve Amber, Segoe UI, A Original, English/French and the connected Track2 scope. The result is a prioritized, evidence-linked improvement backlog.

**Verdict:** retain the visual identity. The app has a recognizable study/recovery model and clear primary/secondary controls. The largest remaining opportunities are useful failure recovery, truthful control-state feedback and a more compact task hierarchy. No P0 task-blocking failure was established in this bounded review. Four concrete usability/accessibility defects are confirmed below; further proposals remain distinct.

## Context Pointers

Read `AGENTS.md`, `project-context.json`, the active capstone specification and control-readability verification, PRODUCT/DESIGN and source/test patterns. Root and specialists actually invoked `learning-journey-review`; `capstone-evidence-update` reconciles this review as findings, not fixes.

The companion's three UI Skills checklists and licence hash-match installed provenance revision `d036a68c7a0785ae753f3b6d02dec515a419cf42`. Accessibility supplied field association/focus, accessible names/native semantics and target checks. Metadata supplied title/lang/favicon checks. Motion supplied animation/measurement/reduced-motion checks. No catalog, installer, snapshot refresh or `baseline-ui` defaults were adopted.

### R31 — review research ledger

| Need | Actual supporting evidence | Status / boundary |
| --- | --- | --- |
| Current app, identity and authority | HEAD c7ddff2; settled Amber/A/EN-FR/local-server decisions; current source/contracts and prior increment records | Satisfied for review. New recommendations do not replace the specification. |
| New resource applicability/provenance | Companion + three relevant snapshots; four hash matches including licence; recommended/reference status and two measured entries inspected | Satisfied. External measurements are captured-state evidence, not new product standards. |
| Whole-interface coverage | Three independent source reviews plus root's fresh browser batch covering entry, profile, creation/editor, learning/study, Journeys/Activity, Comeback and circle/list/composer/preview/navigation | Satisfied for general review. Not every state/theme/locale/size cross-product or assistive technology. |
| Remaining behavior defects | Live invalid-timezone association/focus; live50-step Add no-op; full checkbox target measurement; source/reference-error in-memory check | Satisfied for identified findings. General failure focus in other forms remains a risk to verify. |
| Layout, metadata and motion findings | Current/datelabelled captures, measured mobile/circle geometry, actual head/source and one fresh detector | Satisfied for findings/proposals; performance profiling and learner comprehension unmeasured. |
| Delivery and claim boundaries | Existing correct Miva/ten-task destinations; E023 baseline preparation; no production changes and no completed repairs | Review publication/trackers recorded separately. Future implementation research remains open. |

The review gate is satisfied for this bounded scope. It is **not** an implementation-ready redesign specification: user priorities and any date/timezone/minute-default behavior changes still need a selected scope, acceptance criteria and precode visual references. No inaccessible or unmeasured evidence is labelled passed.

### Independent subjective design assessment

These0–4 scores are expert judgement, not measured usability, WCAG certification or learner outcomes. Root's separate technical findings are not disguised as a numeric compliance score.

| Nielsen heuristic | Score | Main reservation |
| --- | ---: | --- |
| Visibility of system status | 3 | Activity record types need clearer grouping. |
| Match with the real world | 2 | IANA names and manually formatted date lists demand interpretation. |
| User control and freedom | 3 | Cancel/Back/confirmation are present; circle preamble wastes space. |
| Consistency and standards | 3 | Coherent native controls, icon vocabulary and resting outlines. |
| Error prevention | 3 | Deliberate sharing, preview and conflict acknowledgement; saves were not exercised by A. |
| Recognition rather than recall | 2 | History types and date formatting add recognition burden. |
| Flexibility and efficiency | 3 | Adjustable plans/five-minute return work; mobile preamble delays action. |
| Aesthetic/minimalist design | 3 | Amber is strong; oversized generic headings/sparse wide history dilute focus. |
| Error recovery | 3 | A's source assessment; root subsequently reproduced specific field/focus failures. |
| Help and documentation | 2 | Helpful inline privacy/meaning hints; setup is still technical. |
| **Total** | **27/40** | **A sound design foundation with specific friction.** |

### Confirmed defects and improvement opportunities

| ID / priority | Evidence and impact | Smallest useful correction / future verification |
| --- | --- | --- |
| **UR01a P2 — Field-error guidance/association, verified defect** | `api.ts:35` drops the existing optional `error.field`; `errorKey` looks for uppercase code fragments although domain errors use `invalid_input` + field. Preferences/editor catches show a generic alert. Fresh French invalid timezone shows dates/minutes/HTTP-links advice; `aria-invalid` is absent and describedby points only to the original hint. Invalid reference payload mapping also failed the specialist's isolated in-memory source experiment. | Retain the existing field payload, map known fields to useful localized guidance, associate error and invalid state without losing hints, clear on editing. Verify timezone and reference format/count separately in EN/FR. Reference-count versus malformed-URL differentiation needs explicit client validation/copy design; do not invent a server contract change. |
| **UR01b P2 — Failure focus, verified in preferences** | `lockForm` disables the active submit control. Fresh keyboard timezone rejection unlocks controls but leaves activeElement BODY. The alert is visible, but keyboard position is lost. Other auth/editor/study failure handlers share a source risk, not a freshly tested failure claim. | After unlocking, focus the relevant field/error or logical recovery control, guarded by current view/session. Verify one keyboard failure per affected form, preserved draft and late-response lifetime protection. |
| **UR02 P2 — Enabled Add at50 is a silent no-op, verified defect** | `plan-editor.ts:411–424` silently skips addition at LIMITS.steps50. Fresh French unsaved draft has50 named step groups; Add stays enabled, clicking leaves50 and no announcement. A naive group count initially included the availability group; corrected named-step count is50. No plan was saved. | Disable Add at the actual limit with visible/localized explanation and appropriate association/announcement.49→50 and removal must update it; preserve disabled reorder behavior and row focus. |
| **UR03 P2 — Checkbox target below project44px floor, verified defect** | `.checkbox-field` at `styles.css:898` has no minimum height. The **full** French desktop conflict label is621×24px; glyph22×22. This is a project-target failure, not an automatic statement that every checkbox violates WCAG. | Give the full label a44px minimum target and suitable spacing; keep the native glyph. Check desktop/mobile, both languages/themes, Comeback/removal consent and focus/disabled behavior. |
| **UR04 P2 — Repeated destructive actions lack target context, source-backed proposal** | `circle.ts:251–267,434–435,486–491,537`: Remove member/Delete shared copy/Revoke invitation have meaningful names but repeat without their row identity in the accessible name/description. Context is visual, harder in a screen-reader button list. | Add localized row-context descriptions or names using already visible identity/post/invitation context. Keep confirmation and private payload rules. Verify multiple rows; no multi-member browser fixture was exercised in this pass. |
| **UR05 P2 — Mobile preamble competes with the actual step, rendered opportunity** | Fresh FR/dark320 viewport places Start study at documentY603.94px; it still fits the800px viewport. Goal/Edit plan, generic large title, encouragement, step/title/estimate/Edit step precede it. Desktop generic title also dominates. | Keep exact encouragement and goal context but reduce the generic introduction's visual weight/spacing; make the specific step/action dominant and preserve logical heading/DOM/focus order. No sticky CTA, extra menu or new navigation destination is required. |
| **UR06 P2/P3 — Activity types/readable width, rendered/source opportunity** | Sessions have a subsection title; completions/scope changes do not. The same step title appears twice for different record types. Sparse history/rhythm spans most of the wide workspace. Existing semantic overview/history grouping is a strength. | Add completion/scope-change headings when populated, preserve existing order/counts/records, and use a deliberate history reading width with a compact rhythm. Do not convert it into a metric-card dashboard or change calculations. |
| **UR07 P2 — Circle navigation takes two vertical rows, rendered opportunity** | Fresh1280px circle has44px Back actions atY102.67/166.67; heading startsY230.67. The two useful destinations consume128px before the title. Sharing has a similar preamble. | Put destinations in one wrapping navigation row, retaining exact labels/underlines/native behavior/44px targets and dirty-state protection. Keep title and main circle action close. |
| **UR08 P3 — Browser orientation/identity, verified gaps and proposal** | Head has one stable LittleFurther title, correct viewport/lang/color-scheme, but every view shares the title; no favicon or theme-color. No public shareable URL exists. | Localized screen-label + brand titles without learner goals/names; derive a favicon from exact A geometry and test actual16/32px tab rendering. Theme-color is optional and must follow effective app theme. No PWA/manifest/SEO/OG/canonical/deployment requirement. |
| **UR09 P2 — Form ease/recorded-time clarity, product proposals** | Availability asks for comma/newline-separated ISO dates; timezone has an IANA datalist/device suggestion. Study minutes defaults to the estimated20 (five on restart), while labelled as recorded minutes. No timer exists and self-report copy is honest. | First clarify existing examples/hints and visually separate estimate from reported time. Native date collection controls, friendlier timezone selection or changing defaults require a separate selected behavior specification. No timer or automatic measurement is proposed. |
| **UR10 P3 — Design-document drift, verified documentation gap** | DESIGN's type paragraph still says mobile auth2.25rem; later prose and actual CSS say approved1.75rem. Intentional14px and responsive roles generate machine-ramp advisories. | Consolidate factual type guidance/intentional roles in the affected design records in a later maintenance increment. Do not flatten hierarchy or repair unrelated formal pipeline drift. |

Recommended grouping: first field/focus/limit/target corrections; then mobile/Activity/circle hierarchy in one bounded visual batch. Form-control/default redesign and browser metadata are separable decisions, not hidden additions to the MVP.

### Strengths and grounded persona risks

- Keep Amber primary versus soft outlined secondary actions, static completed path rows, correct panel/moon/sun/eye icons, exact LF geometry and complete wordmark. Avoid another blanket increase in outlines, shadows, cards or icons.
- Keep native labels/selects/details/dialog, visible keyboard focus, honest self-report, preserved effort and deliberate privacy preview. Fresh mobile drawer Escape returned focus to Open navigation; theme/locale preserved the unsaved preview text.
- First-time learners may struggle with technical date/timezone entry. Returning mobile learners scan a long preamble before a short action. Keyboard/screen-reader learners need field recovery and record/row context. These are reviewer risks, not observed abandonment or learner interviews.

### Qualified external reference evidence

The current [recommended index](https://github.com/xjli360/awesome-design-md-ecommerce/blob/main/RECOMMENDED.md) and [status](https://github.com/xjli360/awesome-design-md-ecommerce/blob/main/STATUS.md) were read, then two entries at revision`e4dc419594fae8b1f5f678e0dc5e335e71b8e3bb`, retrieved11October2026. Both actual desktop reference screenshots were inspected through browser MCP. The collection has measured component references, not verified whole-site reconstructions.

- [Ritual measured evidence](https://github.com/xjli360/awesome-design-md-ecommerce/blob/e4dc419594fae8b1f5f678e0dc5e335e71b8e3bb/design-md/ritual/MEASURED.md): captured30September at1440×1000,768×1024,390×844; candidate buttons45px high,12/24px padding and16px desktop text. Role identification is heuristic, navigation/menu-open states occluded/unmeasured and font availability unverified. Useful only as restrained utility/padding evidence; LittleFurther's own44px floor remains authoritative.
- [Muuto measured evidence](https://github.com/xjli360/awesome-design-md-ecommerce/blob/e4dc419594fae8b1f5f678e0dc5e335e71b8e3bb/design-md/muuto/MEASURED.md): same capture date/classes;50px desktop header/20px horizontal padding and a campaign170px heading. Mobile navigation/hover/focus/menu-open behavior unmeasured. Its expressive storefront composition is unsuitable as layout authority for this operating learning app; no pattern adopted.

Observed reference values, inferred roles and the LittleFurther proposals above remain distinct. No storefront fonts, assets, palette, radius or whole catalog was imported.

## Constraints

### Verification and limits

Source review covered authentication/preferences, all shell states, empty/populated learning, paths, creation/review/editing, study/reflection/completion, Journeys/Activity, Comeback/conflicts, circles/create/join/invites/member/copy/encouragement/closure and error/lifecycle patterns. The [capture README](../designs/ui-specialist-review/README.md) and [measurements](../designs/ui-specialist-review/measurements.json) distinguish current browser observations from seven dated prior app images.

Root freshly inspected both entry forms, study, Activity, preferences failure, Journeys/plan creation and50-step draft, Comeback preview/conflicts, learning mobile, circle list/detail/management/composer/preview and mobile navigation. French/dark desktop1280×900 and320×800 plus English/light mobile preview were sampled. No plan/activity/completion/member/invitation/shared item was saved. Read-only database check retains1plan/3steps,1study,1completion,0scope events,1circle and0items/invites; only synthetic session and presentation preferences were exercised and restored.

Exactly one fresh Assessment B detector ran: exit0,31advisories/0non-advisory; all styles.css.26`design-system-font-size` at148,170,461,473,527,544,602,611,637,695,703,745,938,1123,1230,1286,1597,1609,1646,1686,1698,1715,1746,1764,1770,1786;4`design-system-color` at518/689/784/1113;1`design-system-radius` at409. Responsive/type-role values, Amber edges/modal scrim and2px active-nav marker are contextualized advisories, not31 learner defects. No parent rerun or new ignore rule.

Motion source has no active animation/transition loops, scroll-driven effects, blur or persistent will-change. System fonts/native SVG and current92266-byte JS/26631-byte CSS are lean assets, not a performance profile. No real low-end hardware/frame-time assessment, full assistive-technology/zoom/forced-colour matrix, multi-peer fresh flow, native-French OS certification or learner outcome is established. Prior56domain/72browser/process/static/build/audit passes remain dated evidence; this review did not rerun that suite or claim repaired behavior.

The browser interruption reset bindings/servers mid-task. Fresh IAB inspection resumed after serving the existing build again. A wrong localized locator, transient capture/resize state, a generic-group count and nonfocusable-body key action were corrected from observed state. Cancel hit a browser-control timeout; a fresh tab recovered. These are harness limitations, not proven application failures. Current captures use JPEG extensions/metadata; temporary scratch data and viewport cleanup are recorded in delivery notes. Live overlay injection was unavailable through read-only evaluate; no overlay/console/live-server success is fabricated. Impeccable context was already loaded in this session and was not rerun.

## Done When

Review findings, provenance, sampled evidence, independent assessments and claim limits are delivered. Review artifact `d752f69c4ffff1088eabd2f64f23dcab94f496f1` was published normally to both private repositories; exact Git heads, installedCLI privacy/metadata/all16paths verified at19:11:23Africa/Lagos. GitHubMCP exact-SHA reads returned404 for both; authenticated CLI fallback succeeded, with no hostedCI success claim. Local checks passed16files/79relative links/2JSON/8rasters, source/tests/package unchanged, eight origin records present. Helper-generated blank frontmatter whitespace was fixed before the successful final cached check. No application suite was rerun for this review.

[E023 saved reconciliation](2026-10-11-ui-specialist-tracker.md) completed at19:25:22Africa/Lagos. Across all five Sheet tabs, onlyA24:J24 differs from the E022 baseline: ten exact values, uniqueE023, zero mismatch/extra. OnlyF24 changed after the firstE023 save to record the user's late choices. A010 exactly111,555characters equals8,004new prefix plus all103,551prior characters; all120,594original richHTML characters also remain an exact suffix. Title/IP/no date, ten-task1/5/0/4 board andA007To Do/No date are preserved. Two intentional pastes per destination (initial save + late steering), not error retries. Root independently inspects final receipts/prefix/history; later documentation publication has its own final-head check. The app is not repaired or newly approved by this report.

Archive snapshot was written to `.impeccable/critique/2026-10-11T18-05-44Z__src-client-main-ts.md`; its relative evidence links were corrected for that location. The temporary body file was removed. Trend read returned26/40→27/40, across different revisions/coverage, not a measured improvement. No ignore file, detector overlay or auxiliary live-server was created. Current IAB tabs/viewport are released; known old Chrome assessment IDs are absent. Review4319 is stopped, ordinary4317 remains healthy. Private tracker proofs stay ignored; app captures/measurements are intentional non-secret source.

At initial artifact publication, next-plan preferences were requested and unanswered. Later on11October the user selected **usability fixes and layout refinements together**, and **keep existing date/timezone/study-minute behavior while improving presentation/hints**. These late decisions supersede the earlier pending preference state and are recorded in the same E023 activity; they do not represent completed fixes. No new date-collection controls, timer or minute-default policy is selected. Actual implementation still needs a fresh proportional specification/research closure, precode reference and acceptance-linked tests. Formal design approval, learner evaluation, timed3–5minute video and submission remain separate.
