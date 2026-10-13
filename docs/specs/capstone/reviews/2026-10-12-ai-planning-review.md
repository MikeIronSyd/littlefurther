# Contextual AI planning review — 12 October 2026

## Goal

Independently review the prepared AI contract, research gate and synthetic visual references for implementation readiness. Reviewed uncommitted preparation against `bd8dac957cc6f28615df9ed1a4e46a19b7064d4c`, using `learning-journey-review`, the established Impeccable workflow and the companion accessibility checklist.

**Disposition: research-first planning is coherent; production implementation is not ready.** R34 explicitly remains open for provider/account/free-routing, live search and representative output evidence. One privacy-copy discrepancy and one overly broad security acceptance claim need correction before treating the contract as implementation-ready. No product behavior is passed by this document review.

## Context Pointers

- [AI contract and AI01–AI11](../increments/ai-assistance.md), [preparation verification](../increments/ai-assistance-verification.md) and [R34](../research.md#r34--contextual-ai-across-the-five-capability-journey-12-october-2026).
- Current project instructions, context, parent specification and [D016](../design.md#overall-design-approval--12-october-2026). D016 approves the earlier implemented visual baseline; it does not approve future AI interfaces.
- Existing `src/shared/contracts.ts`, the migration/version and completed-step boundaries in `src/server/store.ts`, and the current absence of AI production code. This is a targeted planning review, not a fresh whole-product audit.
- Six synthetic boards under [ai-assistance](../designs/ai-assistance/reference.html), created and inspected in a bounded prior pass by this reviewer; root independently inspected all six. The final renderer exited 0 and checked normal/200% root-text overflow, native targets and field names. Those are reference checks, not app/provider tests.

| AC | Expected behavior or planning requirement | Evidence/revision | Result | Limitation |
| --- | --- | --- | --- | --- |
| AI01 | Research and precode references precede production edits. | Prepared contract explicitly leaves R34 open; six origin-labelled synthetic boards exist. | Verified pass for the documented gate; research completion unverified. | Provider/account/model/source prerequisites remain pending. Reference evidence needs reconciliation into R34g. |
| AI02–AI05 | Editable grounded drafts, retained parent steps/reflections, deterministic Comeback/counts and no mastery inference. | Six-action table, source/provenance contract and contextual board copy at the reviewed working state. | Verified pass for requirement coverage; behavior unverified. | No real output quality or implementation test. |
| AI06, AI08 | Exact deliberate outbound circle context matches its user disclosure. | `circle_draft` permits selected personal context; reference copy promises only the typed draft and excludes private study records. | Verified fail for this document/reference mismatch. | No actual leak or request was observed. See P2-1. |
| AI07 | Additive provenance migration preserves old records/history and ownership. | Source-store contract plus existing schema 1/2 and JSON plan DTO inspection. | Unverified. | Exact v3 schema/DTO/lifecycle and migration experiments remain to be fixed before dependent implementation. |
| AI08 | Server-only credentials, authorization, bounded context and stale-result protection. | Proposed authenticated adapter, strict fields, authorization recheck and session/view/input guards. | Verified pass for listed invariants; behavior unverified. | Broad prompt-injection wording requires a testable security boundary; see P2-2. |
| AI09 | Both shared-key services remain free-only under concurrency, exhaustion and failure. | Fail-closed contract and pending R34c/d/f. | Unverified. | Account entitlement, enforcement, expiry/PAYG and actual zero-cost paths have not been established by this review. |
| AI10 | Accessible contextual help preserves the incumbent identity and manual flow. | EN/FR, light/dark, desktop/320px synthetic boards, loading/error/cancel/acceptance examples. | Verified pass for representative reference coverage; app behavior unverified. | Boards contain grouped illustrative states; native semantics/focus and all combinations still need actual app checks. |
| AI11 | Required checks, independent implementation review, trackers and publication have actual evidence. | Preparation record correctly keeps these pending. | Unverified. | This is planning review only; no new project test, tracker save or publication. |

## Constraints

### Findings requiring correction

**P2-1 — Circle data disclosure and allowed context differ (AI06/AI08).** The action table allows “any personal context deliberately selected,” while the reference says “Only your typed draft is sent” and excludes private study records. Either rule could be implemented faithfully and contradict the other. Smallest correction: limit provider-bound circle drafting to the learner's typed draft, commitment/check-in kind and locale; keep circle/member identifiers and private plan/reflection records local. If richer optional context is retained, specify its explicit selection and update both languages' disclosure before implementation. This is a specification discrepancy, not evidence of an existing privacy defect.

**P2-2 — Make prompt-injection acceptance observable (AI08).** “Prompt injection ... [is] prevented” promises more than the planned tests can establish. Replace that blanket claim with concrete invariants: untrusted text cannot trigger a tool/fetch, change provider/model/cost policy, access another owner's records, obtain secrets, select unknown source IDs or render executable markup; malformed or disallowed responses are rejected. Keep representative adversarial model-output tests and clearly separate these enforcement guarantees from the unverified quality of model prose.

### Pending research and implementation-detail boundaries

These are already-open prerequisites or details to resolve before declaring readiness; they are not new audience, feature or permission gates:

- **Shared free allowance (AI01/AI09):** fixed per-user and global request/concurrency limits must account for a shared app credential. Verify the provider's hard stop at included allowance/credit expiry, including concurrent requests; a pre-request balance read alone is not proof against races or paid overage. Record the selected enforceable policy and actual entitlement without credentials.
- **Exact external contract (AI01/AI02/AI08/AI09):** final provider model IDs, routes, supported structured-output shape, max input/output sizes, timeout/cancellation behavior and localized safe error codes are still pending R34. Advertised capabilities and configured keys are not live compatibility evidence.
- **Source migration lifecycle (AI07/AI08):** pin the v3 table/DTO fields and optional defaults, source-ID ownership/lifetime, per-step association validation and abandoned-draft retention bound. Verify populated v1/v2 migration, transactional failure rollback/repeated startup and saved-plan editing without changing existing event snapshots before ordinary-data startup. The current contract calls for these checks but no result exists.
- **Visual evidence reconciliation (AI01/AI10):** R34g and the verification document still say references/review have not occurred. Update them with the six boards' actual provenance/render/inspection results and this planning review; leave live-provider and product criteria pending. No additional broad screenshot cycle is needed for that record correction.

All-five inclusion, app-default credentials only, free endpoints only, contextual help, English/French and short-session parent preservation remain settled. No BYOK/vault, general chatbot or full-page retrieval requirement is introduced. Search snippets and supplied unread links retain their stated boundary. No application fixes, browser actions, provider calls, credential inspection, tracker writes or publication occurred in this review.

## Done When

This planning review is complete: requirement coverage, two concrete document-level findings and the remaining research boundaries are recorded. Root should reconcile their dispositions and the reference evidence. Production remains on hold until all agreed R34 needs have actual evidence and the implementation contract has its fixed provider/schema/limit decisions.

An authorized isolated preflight may gather the missing facts before production edits; it is research, not delivered functionality. Subsequent implementation still needs AI01–AI11 verification and independent corrected-source review. No running application was observed and no product tests ran during this review.
