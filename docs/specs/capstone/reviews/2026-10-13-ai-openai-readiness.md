# OpenAI replacement preparation review — 13 October 2026

## Goal

Independently review the current OpenAI-only specification, R34 evidence and updated precode references against AI01–AI11. Reviewed uncommitted preparation at `bd8dac957cc6f28615df9ed1a4e46a19b7064d4c`, using `learning-journey-review` and the already-loaded Impeccable/companion accessibility workflow.

**Disposition: the corrected preparation has no identified blocking document-level contradiction; production implementation remains on hold.** R34c/d/f still require actual billing compatibility, inference/search and representative output evidence. This is a preparation review, not an AI implementation, provider-access or product-test pass.

## Context Pointers

- [Current contract](../increments/ai-assistance.md), [verification](../increments/ai-assistance-verification.md) and [R34](../research.md#r34--contextual-ai-across-the-five-capability-journey-12-october-2026).
- Current `AGENTS.md`, `project-context.json`, parent specification and [D016](../design.md#overall-design-approval--12-october-2026). D016 approves the prior implemented visual baseline only.
- Actual baseline shared contracts, domain validation and server plan/migration/idempotency/scope-history code; no AI production change is present in the reviewed scope.
- Updated [editable reference](../designs/ai-assistance/reference.html) and [renderer](../designs/ai-assistance/render.mjs), with six PNGs. This reviewer rendered/inspected the packet in one bounded pass; root independently inspected all six.
- Ignored synthetic `.local/ai-research/provenance-feasibility.mjs` and `provenance-receipt.json`, inspected read-only. They are local research artifacts, not published implementation or provider evidence.

| AC | Expected preparation or behavior | Evidence at reviewed state | Result | Limitation |
| --- | --- | --- | --- | --- |
| AI01 | Actual research and references precede production edits. | R34 remains explicitly open; prepared contract separates selected bounds, documentation, metadata and experiments. | Verified pass for gate honesty; overall research completion unverified. | Billing/live inference/search/quality remain pending. |
| AI02–AI05 | Six contextual actions cover all five capabilities while retaining editable drafts, parent steps, history and deterministic dates/counts. | Current six-action table and updated boards retain manual/curated alternatives and separate acceptance/save/completion/schedule operations. | Verified pass for requirement coverage; behavior unverified. | No live model output or application acceptance test. |
| AI06 | Circle sends only typed own draft, kind and locale; membership stays local and explicit preview/share remain required. | Corrected action/privacy contract matches EN/FR reference disclosure; no search/private context allowed. | Verified pass for document alignment. | Outbound capture and membership/preview behavior still unverified. |
| AI07 | Exact provenance, source ownership/lifetime and legacy compatibility are specified and feasible. | Pinned DTO/v3 transient table, 24-hour TTL, storage bounds, snapshot/consume/retry rules; inspected 13-pass synthetic receipt/script. | Verified pass for bounded design/feasibility evidence. | Actual application migration, validators, receipts and DTO integration remain unverified. |
| AI08 | Secrets/server routing, plain-text/source validation, authorization and stale-result protections have enforceable boundaries. | OpenAI-only fixed endpoint/snapshot, strict/local validation, source IDs and session/view/input/revision guards; prior absolute injection claim corrected. | Verified pass for stated invariants; behavior unverified. | No actual outbound/security/model-quality test. |
| AI09 | Existing balance only, no purchases/top-ups/fallback; bounded requests and honest recovery. | Contract explicitly replaces free-only assumptions and does not promise an exact account spend ceiling. Selected 60s/90s, token/request/concurrency bounds are recorded. | Verified pass for scope alignment; operating compatibility unverified. | Billing login/balance/top-up behavior and real tool/cost path remain open. |
| AI10 | Provider-correct bilingual/theme/responsive references precede frontend work. | Six synthetic OpenAI boards; renderer exit 0 at 09:07 Africa/Lagos; root inspection at 09:09. | Verified pass for representative precode preparation. | Not running-app behavior, exhaustive device/accessibility coverage or new human visual approval. |
| AI11 | Checks, implementation review, trackers and publication have actual evidence. | Verification correctly leaves AI delivery criteria pending. | Unverified. | No new product verify, tracker save or publication performed by this reviewer. |

### Readback and experiment limits

The two [12 October planning findings](2026-10-12-ai-planning-review.md) are now **resolved at document level**: circle context is narrowed to typed own draft/kind/locale, and AI08 specifies enforceable tool/route/cost/ownership/source-ID/markup boundaries without promising immunity of model prose. The historical report remains unchanged.

The updated reference packet names OpenAI, removes universal unread-page promises, keeps supplied links unverified, shows three illustrative clickable MDN citations per plan board, and retains explicit unchecked reflection selection plus search-free reflection/circle disclosures. Renderer checks cover normal/200% root-text overflow, 44px native targets, field names and consent labels. Each board had zero page errors and only its intercepted synthetic document request. No provider search produced the examples; PNG origin metadata and visible copy say so.

The provenance receipt reports **13 passed, 0 failed** at 09:05:57 Africa/Lagos on 13 October. Its script extracts baseline v1/v2 application DDL and uses synthetic databases/minimal identity tables only. This review independently matched the current `src/server/store.ts` SHA-256 to the receipt: `6eb4ac6738bd9eb3604e17773456024c54d3b7990707ab979bec1aff29fbd08a`. The experiment supports additive/rollback/repeated migration, owner/FK checks, saved-source survival, TTL/storage limits and unchanged synthetic history. It does not test application URL/association validation, completed-source immutability, legacy receipt digest/replay, UTF-8 boundary cases or actual route/session integration. Those remain product acceptance work after implementation, rather than invented research passes.

Root reports key-present/OpenRouter-absent configuration and authenticated pinned-model metadata GET success at **09:12:23 Africa/Lagos**, with **zero OpenAI POSTs**. This reviewer did not inspect credentials or issue provider calls. Metadata access is not inference/search or billing evidence.

A read-only context comparison confirmed `current_preparation` remains an object and all **11 historical fields other than the intentionally updated date/status are unchanged** against HEAD. Current AI scope now records the actual key/metadata, experiment and reference preparation; no earlier output/history loss was found in that comparison.

## Constraints

### Remaining implementation-readiness blockers

- **R34c / AI01/AI09:** billing-browser access, usable existing balance/top-up settings and applicable billing behavior remain unverified. Do not activate live inference/search or describe spend enforcement from the configured key/model GET alone.
- **R34d / AI01/AI07/AI09:** obtain a bounded real search result with the pinned model, actual source/annotation data and observed hosted tool-call behavior. Validate the selected wire contract before treating one-tool-call and cost assumptions as established.
- **R34f / AI01–AI06:** obtain representative parseable EN/FR outputs across all six actions, including unsupported/insufficient sources, refusal/incomplete responses and adversarial content. Preserve original work and manual fallback; no output quality follows from synthetic examples.

No new scope decision, BYOK, user quota feature, provider/model fallback or additional aesthetic approval gate is required. Source-draft row caps and active-operation limits are storage/concurrency safeguards, not a user usage-quota feature. Before dependent implementation, keep exact assistance DTO/context bounds and safe error mapping aligned with the selected limits; do not send unbounded study history where deterministic summaries suffice. Cite only validated returned sources, and preserve refusal/incomplete handling separately from HTTP success.

No application code, tests, credentials, provider calls, ordinary learner database, browser account, tracker or Git publication was changed by this review. Only this new review record was authored. Existing no-runtime-AI baseline facts and previous failed-provider evidence remain dated history.

## Done When

This preparation review is complete and the earlier document findings are closed within their stated scope. Root can reconcile this review and proceed with remaining authorized research when billing access is available. Production stays on hold until R34 is actually satisfied; no additional permission gate follows verified closure within the settled scope.

No running application was observed and no product tests ran in this review. Implementation must subsequently demonstrate AI01–AI11, full required checks and independent corrected-source review; technical acceptance does not establish educational outcomes, production readiness, exhaustive conformance, future human visual approval or a finished capstone video.
