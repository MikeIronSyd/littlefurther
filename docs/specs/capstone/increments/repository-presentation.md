# LittleFurther repository presentation — 13 October 2026

## Goal

Present the private proof of concept as LittleFurther with a visual front page and navigable documentation. Rename the existing repositories to `separate account/littlefurther` and `MikeIronSyd/littlefurther`, preserving their identities, history, privacy and main branch. This is presentation work; application behavior and source folders remain unchanged.

## Context Pointers

Accepted user plan; clean starting revision `3e81617e7ad41fa240bd7deeb42ff316e08cd5a5`, underlying product source `98372ac41150dc50ad66dc08ecde289794aa3169`; [specification](../spec.md), [AI verification](ai-assistance-verification.md), D016 in [design](../design.md), selected [A Original master](../designs/littlefurther/mark.svg). [Motrix](https://github.com/agalwood/Motrix) and [magpie](https://github.com/yetone/magpie) are composition references, not sources of artwork or claims.

### R35 research gate — satisfied before presentation implementation

| Need | Verified findings and evidence | Status |
| --- | --- | --- |
| Current identity/status | Clean baseline above. README has 1,697 words and no embedded logo, screenshots or diagram. Its 8 October milestone/pending approval and PRODUCT/local-demo summaries are stale. AI source implements six contextual actions. Prior 13 October verify: 85 domain/server and 94 browser passes. | Satisfied |
| Brand/assets | `mark.svg` and `src/client/branding.ts` share the original joined LF path, Segoe UI semibold, ink/light and Amber/dark. Existing eight AI app captures use synthetic fixtures; French mobile editor deliberately shows failure. Fresh successful presentation states required. | Satisfied |
| Architecture/privacy | Browser modules → Express orchestration → domain/stores → SQLite. No `src/application` folder exists. Responses is optional server I/O, search plan-only. Source metadata stages automatically for 24 hours; explicit saving copies snapshots. Circle outbound fields are own typed draft/kind/locale. `store:false` is not zero retention. | Satisfied |
| Capture feasibility | Installed Playwright/Edge, current compiled server and injectable synthetic-provider harness inspected. Separate loopback server and data directory can exercise real routes with fake provider I/O without credential-file loading or ordinary `.local/data`. PNG/SVG need no new dependency. | Satisfied |
| GitHub presentation | Official [README](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes), [Mermaid](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams), [themed pictures](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/quickstart-for-writing-on-github), and [rename](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository) guidance checked. Relative assets and native diagrams require actual remote render review. | Satisfied |
| Access/collision | Child-scoped CLI: separate account ADMIN on personal and WRITE on Miva. Signed-in Miva owner settings expose Rename. Both private, homepage empty. New names returned not-found in respective owner sessions; recheck before rename. Private UI has no social-preview upload. | Satisfied |
| Scope/destinations | User selected exact names, description/topics, README order/length, three guides, isolated mocks and dual publication. No code/workspace reorganization, live AI, hosting, CI, license or avatar changes. Existing Miva Sheet/Kaneo identities remain authorized. | Satisfied |

R35 is complete for the agreed scope before artifact implementation. Reopen consequential unknowns. Name availability is checked again at the mutation boundary, not treated as reserved.

## Constraints

Apply Impeccable and ui-ux-resources. Prepare a focused layout reference before rewriting README. Preserve Amber/A Original geometry and meaningful image descriptions. Correct active summaries without rewriting historical evidence. D016 approves its 12 October baseline, not later AI surfaces. Benefits remain hypotheses and recorded completion is not assessed mastery.

Capture with isolated synthetic accounts and mocked AI/search; no live provider calls, key loading or ordinary learner-data writes. Publish intended non-secret assets, fixture provenance and reproducible documentation capture/validation source helpers. Runtime data, temporary experiments and private receipts remain ignored. Preserve original artwork and historical captures. Caption actual interface/synthetic data/mocked responses and record dimensions/revision. Preserve hooks and use normal Git publication. Trackers require verified Miva identity and saved readbacks.

### Acceptance and quality contract

| ID | Observable acceptance |
| --- | --- |
| RP01 | Focused pre-README desktop/narrow reference; original-geometry light/dark SVG lockups; documented asset folder. |
| RP02 | README follows accepted order, approximately 600–900 words excluding commands/captions, with current screenshots, capabilities, pinned setup, Mermaid and deep links. |
| RP03 | `docs/README.md`, `ARCHITECTURE.md`, `DEVELOPMENT.md` match actual modules, staging/privacy/review/save boundaries and dated verification; stale current summaries corrected. |
| RP04 | Fresh desktop light/dark dashboard, successful French 320px journey, plan, study/reflection, Comeback, private-circle and FinishLine captures; deterministic fixtures/provenance, no live calls or ordinary-data mutation. |
| RP05 | Relative links/anchors/images/SVGs validate; bounded visual review and independent learning-journey-review find no blocking factual/presentation issue. |
| RP06 | Existing repositories renamed; exact About/topics/private/empty homepage read back; origin fetch/two push URLs and miva updated; historical redirects and active destinations checked. |
| RP07 | Actual GitHub images/navigation/Mermaid reviewed in light/dark/narrow layouts with limitations recorded. |
| RP08 | Evidence skill invoked; Miva Sheet/Kaneo history preserved and saves verified; intended source published with both exact main heads checked. |

### Implementation sequence

1. Record research/contract; create and review a focused README layout reference before rewriting.
2. Produce isolated captures/brand assets and three guides; root rewrites README/current summaries.
3. Validate documents/assets and pixels; obtain independent review, resolving blockers before rename.
4. Recheck names/access; rename existing repositories, set metadata, update remotes/active destinations while retaining historical commit links.
5. Publish normally; review actual GitHub rendering/redirects/heads. Reconcile trackers with saved comparisons; publish documentary closeout and verify both heads.

## Done When

RP01–RP08 have actual results in [verification](repository-presentation-verification.md). Dated prior application results are linked, not claimed as a new full suite for this documentation-only task. The timed video, learner outcomes, future AI-surface approval and production readiness remain separate.
