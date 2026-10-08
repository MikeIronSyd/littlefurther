# Bounded design-record refresh — 8 October 2026

## Goal

Refresh stale P06/P07 descriptions in DESIGN.md and its sidecar after the user's instruction to proceed with the offered document refresh. Preserve the incumbent Amber visual system, qualitative identity, normative frontmatter and every token. This is documentation maintenance, not a redesign, product test or formal phase closure.

## Context Pointers

Applied the installed `C:/Users/USER/.codex/skills/impeccable/reference/document.md` scan/sidecar workflow using the settled refresh choice and existing descriptive language. The [research report](2026-10-08-integration-design-research.md) records the earlier read-only investigation and residual formal requirements. Read current [DESIGN.md](../../../../DESIGN.md), [sidecar](../../../../.impeccable/design.json), [journey.ts](../../../../src/client/journey.ts), [i18n.ts](../../../../src/client/i18n.ts), [styles.css](../../../../src/client/styles.css) and the P07 [system comparison](2026-10-08-circle-design-system.md).

The document refresh was written at **17:28 Africa/Lagos**. Its sidecar metadata uses the corresponding UTC timestamp `2026-10-08T16:28:55Z`.

### Focused changes

| Record | Old description | Correction and source |
| --- | --- | --- |
| DESIGN Overview | Present-tense P04/P05-only scan | Identifies the original 7 October scan separately from the 8 October P06/P07 extension refresh; adds actual Comeback/Circle source pointers. Existing identity paragraph and selected-direction authority remain unchanged. |
| DESIGN support panels | “P07 private circles remain forthcoming” | Records existing blue exact-copy/private-context treatment, neutral audience/privacy panels and divided shared-item/settings rows. Source: `.circle-preview`, `.circle-private-context`, `.circle-audience`, `.circle-privacy`, `.circle-item` and `.circle-management` in styles.css; existing P07 system comparison supplies independent evidence. |
| DESIGN Don't / mirrored narrative | “Don't turn forthcoming Comeback or peer support into fake working controls” | “Don't present a preview as saved or shared before the learner confirms it.” This expresses the existing Comeback/Circle distinction without calling delivered controls forthcoming. |
| Sidecar Return support | P06 boundary description; obsolete coming-soon paragraph | Clearly labelled visual excerpt now uses the exact current `returnTitle` and `returnCopy` strings: “Your completed work is still here.” and “You can restart with five minutes whenever you are ready.” Action behavior stays in the live app, as the description explicitly says. The snippet's CSS is unchanged. |
| Sidecar metadata | Earlier generation time | Updated only after the actual snippet/narrative refresh. Schema remains version 2; timestamp advancement alone is not presented as a refresh. |

## Constraints

Only DESIGN.md, `.impeccable/design.json` and this report were written for this assignment. PRODUCT.md, the surface brief, design history, source, tests, configuration, global skills and formal build spec/state were outside this write scope. Their current-state reconciliation remains the parent's work. No new component, CSS rule, token, breakpoint, shadow, motion, font, qualitative identity or user approval was added.

The bounded source checks found no new consequential design choice requiring resolution. Existing detailed-state mockups remain unapproved elaborations. The unchanged visual snippets were not rerendered; no new browser or general accessibility result follows from this refresh.

### Actual verification

| Command / check | Result and scope |
| --- | --- |
| PowerShell here-string piped to `node --input-type=module` using `node:fs`, `node:path`, `node:assert/strict` and `node:crypto` | Passed: JSON parses; schemaVersion/title/top-level extension-only keys valid for the retained structure; generatedAt parses; eight components retain valid references to existing frontmatter component names. |
| Same Node assertion pass | Passed: all eight canonical DESIGN section headings remain in order; all **13 local Markdown targets** exist; Do/Don't arrays equal their document bullets; current return snippet exactly contains both source localization strings; stale “forthcoming”/“coming in the next increment” wording absent from these two records. |
| SHA-256 plus before/after structural comparison | Passed: exact frontmatter bytes unchanged; entire extensions object unchanged; eight component names/order unchanged; **all eight component CSS strings unchanged**. File hashes below identify the authored versions. |
| `git diff --check -- DESIGN.md .impeccable/design.json` | Exit 0, no whitespace defects. Git emitted only its existing LF-to-CRLF working-copy warning. |
| `git diff --stat -- DESIGN.md .impeccable/design.json` and scoped `git diff` | Reviewed: seven changed lines in, seven out across the two design files; three DESIGN prose replacements and four sidecar fields. |
| Dedicated official DESIGN.md/schema checker | Unavailable in the inspected package scripts/document workflow. No undocumented validator command was invented. The explicit record assertions above are bounded checks, not an official schema certification or live-panel render test. |

The Node assertions were an inline verification script, not a new permanent test suite. The baseline was captured immediately before this assignment's edits. The frontmatter digest includes the opening delimiter through the closing delimiter, preserving original line endings and excluding the following newline.

| Artifact | SHA-256 before | SHA-256 after |
| --- | --- | --- |
| DESIGN.md | `e27bf2bfd80d7ba4ad36702ba8697b037236717c3a22e64c1177db41e4f189e4` | `d85c77c51dee5468636650fa621cfd6f5447197e57511d04be037cfa44084d42` |
| Normative frontmatter | `c05405209e5973e20c4ca654c57590d8388cd3d07892f094e01b7ee649073023` | Identical |
| Sidecar | `a1e3e6d92d823e75e55cd1cb926966e87df2ffab63c10aa462e7b54aa3efbe7a` | `6f2af3b6bad064cfa27d5442d01ac8f3e3da578625fb8376b888d107e2043aeb` |

## Done When

The requested bounded refresh is complete: current P06/P07 descriptions and Return support excerpt replace stale boundaries, sidecar narrative matches the document, tokens/CSS/identity are preserved and the stated record checks passed. The full updated [DESIGN.md](../../../../DESIGN.md) remains available for review alongside its sidecar.

Formal Impeccable completion is still unresolved at plates and the later phases. This refresh neither provides the genuine plan/inventory receipt nor resolves assembled-page capture feasibility, hero/final differences or missing QUALITY BAR evidence. Context and detector were not rerun, no phase was mutated, and no formal ship, application acceptance, learner outcome or native-French certification is inferred.

### Active-record follow-up — 17:41 Africa/Lagos

**Goal:** Complete the separately assigned active narrative refresh in the surface brief and design history while the parent works on P08/P09 corrections. This follow-up expands the earlier two-file assignment's documentation scope only.

**Context Pointers:** The [integration contract](../increments/integration.md) closes R18 for the bounded correction/refresh scope at 17:36. Its R18c records root's synthetic connected-journey observation. The [surface brief](../../../../.impeccable/surfaces/src-client-main-ts.md) and [design history](../design.md) now point to current P06/P07 evidence and distinguish it from historical P04/P05 and pending final integration verification.

**Constraints:** Changed only those two documentation files and appended this report. The active surface Goal/Context/Constraints/STORY/Done When now describe delivered P04–P07 work and ongoing P08/P09. Existing 56/36 results are explicitly prior P07 evidence; no new pass is inferred. The design history gains a dated current integrated-surface summary, labels the P04/P05 section historical and converts that section's future-work phrasing to past tense. Both records correct the inaccurate empty-review description: six plan items and 26 code-region entries still require genuine review even with zero plates. P07's 34 detector advisories are acknowledged; hero/final differences, QUALITY BAR and formal completion stay unresolved. Final product identity remains undecided. No source, design tokens, detector, receipt or phase state changed.

**Done When:** Complete for this documentation scope. An inline PowerShell here-string piped to `node --input-type=module` passed assertions for **36 local Markdown targets**, six explicitly named root-relative surface references, active wording and preservation fingerprints. `git diff --check -- .impeccable/surfaces/src-client-main-ts.md docs/specs/capstone/design.md` exited 0 with only the existing LF-to-CRLF warning. No dedicated official schema validator was available or invented. No browser/app tests were run by this documenter.

| Preserved section | SHA-256 before and after |
| --- | --- |
| Surface metadata frontmatter | `e92718959d313086ae2080d913065a99f996b6df76f36ecd510c87d92635ebae` |
| Surface's dated Comeback and StudyCircle extension contracts | `3b147a708937d8c16ea3f5b7d911b68b0daf8597cb6832af7ffe0629d63b38c2` |
| Design record from “Active selection and preserved static references” through the end, including original approvals and image-stage evidence | `2cc6f0d7c65d544bfce29e0a11c06a045c3e8494d8f46165ba73cea6e8e1c7aa` |

The authored surface file changed from `ea2cfac9d4a9e69ea172e092b3d455a5b2b346edcf18bd6c1bfe2022d69fa7c7` to `c40abdf6aa4c2d246a451bd4a4ba365155355eb8b0a50dce8d668f8ccb57eb5d`; the design-history file changed from `f7d76fb62c73ca6c5e81c8adc5fa60d59c225fe9f6b12353975754ca3d85611a` to `c73e2909d275f3007b15215e124f017489a17789625de6df886886f94289ff6d`. The preserved-section digests use exact UTF-8 strings and original line endings. These identify this bounded refresh, not a later commit or a formal ship.
