# Integrated Amber design review — 8 October 2026

## Goal

Review the current connected learner experience against the selected Amber direction and AC11, including light/dark themes, desktop/mobile navigation, English/French presentation and the five-capability journey. The user explicitly requested the design review after P10. Produce actionable findings and a genuine formal review packet; do not turn a review request into an unrequested redesign.

## Context Pointers

Baseline: `0e3968f104f92ba0b2fe329156c494ad104f4568`. Production application source is unchanged from the verified P08/P09 artifact. [Specification](../spec.md), [design system](../../../../DESIGN.md), [surface brief](../../../../.impeccable/surfaces/src-client-main-ts.md) and the [selected reference](../../../../.impeccable/mocks/decision/next-turn.png) define the current requirements. P10's [reuse verification](reuse-verification.md) remains separate evidence. The original selected image is direction authority; later explicit sidebar/theme requirements supersede conflicting details in that image.

Impeccable `context --target src/client/main.ts` ran once for this review. `critique-storage slug src/client/main.ts` returned `src-client-main-ts`; no critique ignore file exists. The critique uses isolated Assessment A (unanchored design judgment) and B (detector/browser evidence). B's findings stay withheld until A finishes. A third independent task prepares the formal component-review checkpoint without making decisions for the user. These are actual skill invocations; none establishes learner benefit or user approval.

## Constraints

### Review contract and research checklist

| Need | Status at opening | Required evidence / unresolved fact |
| --- | --- | --- |
| R20a — Current target and settled direction | Satisfied | Exact Git baseline, source/spec/design records, Amber selection, theme/sidebar/brand requirements. No new visual-world choice or audience question. |
| R20b — Live browser access and isolated observation | Satisfied for access/build provenance; assessment evidence recorded separately | Existing server listens on127.0.0.1:4317. Root initially supplied localhost incorrectly; fresh browser attempts failed ERR_BLOCKED_BY_CLIENT. README38 and server/index.ts11 specify127.0.0.1. A reached a fresh signed-out IAB tab at the correct origin. B used a separate fresh-data server on4329, started by root in exec session47122. Both agents reported their browser pass complete. The isolated Vite/TypeScript builds below matched all14 existing generated files exactly. |
| R20c — Independent critique and detector evidence | Satisfied for this review | A finished before B findings were released at20:35. Five P2 issues are traced in the [critique](../reviews/2026-10-08-design-critique.md) and independently source-checked. Actual one-pass detector returned34 advisories, exit0; cross-origin overlay load failed without a policy bypass. Bounded browser results and limits are explicit. No product suite was rerun. |
| R20d — Formal workflow checkpoint | Packet readiness satisfied; later formal capture remains unresolved | Supported capture/serve produced a usable six-item/32-region packet; verify now reports pending real user decisions instead of the old file error. Root inspected the visible packet without choosing. The TypeScript-entry/authenticated-network limitation still prevents an asserted formal assembled capture. `compSha256` versus raw PNG hash semantics remain unresolved without an inferred provenance defect. No force, forged receipt or retroactive preimplementation claim. |
| R20e — Current tracking/delivery | Satisfied | E012 uniqueness/empty row checked live;39 intended Sheet cells and five complete Kaneo descriptions saved/read back with history/statuses/dates preserved. Artifacte83ab8c recorded as source evidence, the intended source revision matched and recorded GitHub MCP source inspection artifact read back. See tracker report. |

No production implementation is included in this review. Any subsequent material correction requires a scoped findings/reproduction/acceptance contract and closure of its research needs before editing production code. Review recommendations are not implemented fixes. Existing user decisions settle direction, audience and feature scope.

Synthetic accounts/content only. A owns a new browser tab on the existing server; B owns a new tab on a separate review-only server. The existing user server4317 stays running. Root stops review-only server4329 after observation, verifies the listener is gone and retains ignored synthetic data/evidence. The formal review helper may remain available for the user's actual decisions with its documented expiry and stop method. No external messages, volunteer recruitment, paid service, hosted deployment or global recovery action.

Root ran `pnpm --pm-on-fail=download exec vite build --outDir .local/design-build-attestation --emptyOutDir false` and `pnpm --pm-on-fail=download exec tsc -p tsconfig.server.json --outDir .local/design-server-attestation`; both exited0. A local SHA-256 comparison found all14 generated client/server files, including source maps, byte-identical to the existing `dist` files. This verifies reproducible built-file provenance at the source baseline, not an in-memory hash of the existing server process. The ignored receipt is `.local/design-build-attestation.json`. No production file was rebuilt or replaced.

After B finished, root sent Ctrl+C to its owned review-server session47122. The intentional interruption exited1; no4329 listener remained, and the existing4317 listener was still present at20:33:24 Africa/Lagos. `.local/design-server-cleanup.json` records the check. Synthetic data is retained, ignored and unpublished.

### Acceptance and verification plan

| ID | Observable completion |
| --- | --- |
| DR01 | Two independent assessments identify their revision, inspected source/visual evidence, scores/findings and limits; synthesis does not falsely convert inaccessible checks into passes. |
| DR02 | Current desktop/mobile, both themes and EN/FR receive bounded actual browser inspection where supported; screenshot provenance and interaction evidence remain distinct. |
| DR03 | Detector actually runs once on the frontend markup-containing directory; count/rules/locations and contextual dispositions retained. Unsupported overlay injection is explicitly unavailable. |
| DR04 | Formal review packet is concretely inspectable, or a precise missing capability is documented. No user decisions/receipt or downstream phase completion are invented. |
| DR05 | Findings are prioritized with learner impact, AC/source/observation links and concrete next actions. Review snapshot and evidence records preserve prior failures and limitations. |
| DR06 | Appropriate documentation/JSON/link/whitespace and unchanged-production checks pass; authorized tracker and source evidence-publication results are recorded independently after actual readback. |

## Done When

The independent findings and bounded design verdict are delivered, the formal checkpoint is usable or its exact blocker is explained, and review records/trackers/source publication reflect actual evidence. Design approval, implementation of recommendations, formal pipeline completion, broad accessibility/native-French certification and the timed3–5-minute video remain distinct deliverables. This review cannot establish measured retention, mastery or human adoption.

### Actual review outcome

DR01–DR05 have scoped evidence in the [synthesis](../reviews/2026-10-08-design-critique.md), [A](../reviews/2026-10-08-design-assessment-a.md), [B](../reviews/2026-10-08-design-assessment-b.md), [source check](../reviews/2026-10-08-design-source-check.md) and [packet report](../reviews/2026-10-08-design-pipeline-review.md). A's heuristic judgment is26/40; five P2 findings remain open. This is not a complete AC11 pass. Both active test tabs were closed and overrides reset; the live review packet remains a user-facing deliverable. B's owned overlay helper8400 stopped, root's review app4329 stopped and original4317 retained. Source/style/configuration and formal build-state files remain unchanged.

Impeccable stored the first critique snapshot at `.impeccable/critique/2026-10-08T19-41-12Z__src-client-main-ts.md`, fingerprinting main.ts as `02336c34a1152e2ba508e7c8562f615ff4c3e72d8320ea2d4a4ba7f437888738`. Temporary body removed; trend read returned one26/40 entry, so no trend is inferred. The snapshot contains no retrospective Run Notes. DR06 publication/tracker reconciliation remains separately recorded in the [tracker report](../reviews/2026-10-08-design-tracker.md).

DR06 delivery is complete at the artifact/tracker scope: [de508eb](https://github.com/MikeIronSyd/littlefurther/commit/de508eb4e13ab42842aa8f81c481ecca0fb8a2bd) recorded as source evidence with the recorded source reference and recorded GitHub MCP source inspection readback; E012 verified39 intended Sheet cells and five complete Kaneo descriptions. Before artifact publication, root's validator checked16 intended files and183 local links, parsed JSON, preserved E006–E011 history and all identities/deadlines/LMS/judging criteria, checked scoped secret patterns and verified unchanged production source/tests/dependencies/design tokens. Staged whitespace passed; independent consistency review found no material blocker. Tool-generated live-helper metadata is ignored through a one-line .gitignore addition. Five P2 corrections, real user decisions and later formal capture remain open.
