# Learning lifecycle verification

## Goal

Verify LC01–LC07 against the local uncommitted combined lifecycle/planning-calendar changes. No commit, publication or tracker approval follows from a check.

## Context Pointers

[Contract](learning-lifecycle.md), [precode references](../designs/learning-lifecycle/README.md). Existing unrelated AGENTS.md changes and local-only video material are preserved.

## Constraints and actual results

| Check | Result | Limit |
| --- | --- | --- |
| R44 research | Source/relationship/replay/concurrency/restoration/circle inventories and explicit user decisions complete before production edits | Research is not product verification |
| Precode reference gate | Four1440/320light/dark references rendered and inspected; no overflow,44pxbutton targets | Synthetic reference only |
| Implementation | LC01–LC06 controls, APIs, transactions and tests implemented locally | Combined final pipeline passed; publication remains separate |
| Focused browser checks | First six-case run5/6 passed; LC01 assumed an Active filter after restoration while Journeys deliberately retained Archived. Explicit filter assertion/selection corrected; LC01 retest1/1 passed9.1s | Test expectation issue; application filtering preserved |
| Focused final checks | LC01 with French date/focus and Back44×44 regression passed. LC04 attempted clicking a deliberately disabled Restore; changed to assert disabled, unchanged saved state, then enabled after acknowledgement | Corrected LC04 and all five new lifecycle browser cases passed in the final pipeline |
| Required pipeline first attempt | Interrupted after100 domain/server and56/115 browser cases passed so the measured Back target could be corrected | Partial result, not a full pass |
| Required pipeline second attempt | Interrupted after the old CB01 test expected an unchanged revision after saving study; current contract requires revision+1. Read-only audit found no other omitted revision migration | Application revision behavior retained; stale assertion corrected |
| Contract-correction retest | CB01/02/03/05 and LC04 both passed,2/2 in23.2s | Confirms revision advancement and conflict-gated restoration; no full-suite inference |
| Required pipeline third attempt | Interrupted after both theme versions of the old control test rejected any completed-row button; LC03 deliberately adds correction while preserving static completed study rows | Stale assertion narrowed to absence of `.path-action`, with soft-cue/44px checks for correction |
| Legacy UI contract migration | Updated control cases2/2 passed31.0s. Read-only19-file browser audit found one further section-count assumption; UL04–07 now checks three retained-history sections and separate Removed steps,2/2 passed24.5s | No further stale expectations identified; unaffected contracts retained |
| Required pipeline final attempt | **Passed**: 100/100 domain/server, 115/115 browser, static/type/lint/format/build/process and audit; completed 15 October 2026, 10:45:42 Africa/Lagos | Command `pnpm --pm-on-fail=download run verify`, exit0; no known audit vulnerabilities; isolated synthetic data/mocked AI |
| Actual browser MCP | Isolated account creation, timezone, manual plan save, archive/list/read-only view, EN→FR, deletion preview/cancel and restoration observed through visible UI | `http://localhost:4335`; no ordinary learner-data change, no permanent deletion through MCP |
| Actual visual review | Six final captures, desktop/320px, EN/FR, both themes and200% root text; all measured visible buttons≥44×44, no measured horizontal overflow; cancellation focus and unchecked destructive/restoration choices verified | One French320 forced-colours/reduced-motion restoration state; not exhaustive accessibility conformance |
| Independent review | Initial localized-date issue fixed and independently closed. Bounded follow-up found no blocking privacy/retry/ownership/lifecycle regression; nine capture source hashes match | Complete pipeline receipt now passes; reviewer’s source follow-up ran no additional tests |
| Shared destinations | Pending explicit approval | No commit/push/Sheet/Kaneo write authorized or performed |

## Acceptance evidence

| ID | Artifact and observed check | Boundary |
| --- | --- | --- |
| LC01 | `tests/server/lifecycle-store.test.ts`, `tests/server/lifecycle-http.test.ts` and LC01 browser case exercise active/archived enumeration, legacy normalization, read-only archive, original-date restoration and last-plan deletion | Destructive verification uses synthetic records only |
| LC02 | Store privacy tests inspect matching legacy receipts after reflection/session removal, current-state replay, restart and transaction failure; LC02/03 browser case separates minutes, reflection and completion | Existing backups/provider processing are outside live-store deletion |
| LC03 | Store tests cover correction/recompletion/old-event retry, current counters and removed-step correction; Activity shows corrected history rather than erasing it | Correction is not a learning-assessment result |
| LC04 | Store recovery tests cover latest identity, expired AI staging, selected historical links, preserved resources, limits, inconsistent metadata and atomic rejection; LC04 browser covers preview/defaults/conflicts/append and deleted-session absence | No URL fetching or recreation of private study records |
| LC05 | Circle store/HTTP and extended SC02/03/06 browser tests exercise own-only withdrawal, rotating IDs, retry/update/re-add, other sender retention and existing lifecycle | Circles remain local, private and nonarchivable |
| LC06 | Lifecycle HTTP tests cover authorization, strict request input, concurrent writes/revisions and delayed mocked AI; store tests cover content-free receipts, rollback and restart | No real provider call, machine reboot or native ARM check for this increment |
| LC07 | R44, precode board, final actual captures, browser MCP observations, scoped detector and independent review are recorded; final pipeline passed | Shared delivery and later human design decisions remain separate |

## Review corrections and visual limits

The archived list summary and restoration conflict rows now format dates inside locale bindings; changing EN/FR retains focus and updates those dates. The new archived Back button initially measured32.656×44px. A scoped minimum width preserves the underlined link-style appearance and brings it to44×44px; LC01 checks both dimensions.

One scoped Impeccable detector pass exited0 with39 advisories and0 blocking findings. The new `.875rem` historical-link metadata follows the established14px minimum but lies outside the documented typography ramp; it remains a qualified advisory, not an ignored failure or a reason for unrelated redesign. The bounded six-image batch and its single correction-confirmation batch are recorded in the [gallery](../designs/learning-lifecycle/README.md), with final source hashes and synthetic-data provenance. Root inspected all initial images and the corrected archived image; the independent reviewer inspected all six final images.

The enlarged French deletion screenshot contains a fixed skip-link capture overlay masking some copy. The gallery explicitly qualifies it; no unclipped screenshot or new application-defect claim is made. Root-text enlargement is not browser zoom. Native calendar popup appearance was not rechecked for this lifecycle increment. No learner outcome, production readiness or exhaustive accessibility claim follows.

Private raw receipts, logs and original captures stay in ignored `.local/learning-lifecycle`. These are verification records for product controls, not video scripts, storyboards or video-rehearsal documentation. The existing local-only recording policy is unchanged.

## Final documentary and runtime checks

Final scoped documentation validation passed: 16 Markdown records, 259 relative paths, 13 anchors, 3 JSON documents, 9 current-source hashes, 10 PNG signatures/dimensions, 7 context paths and 26 guide labels; no failures. The earlier257-path result preceded the two closeout navigation links. External links/GitHub rendering and whole-repository historical links were outside that check. Changed text source scan found no OpenAI credential pattern; ignored local credentials/runtime/data/recording material remain excluded. The ordinary app is running on127.0.0.1:4317 from the current build; health/page both200. Startup/read-only health checks performed no learner action or provider request. The isolated4335review server was stopped after capture; synthetic records remain local.

## Delivery state

Local implementation and documentation are prepared. The tracker content remains a local draft pending live identity/schema readback and Michael's approval of exact fields/content. No new stable evidence ID is allocated without checking the current tracker. No commit or push is approved or performed. Publication retains this repository’s existing history and owner authentication.

## Done When

Local implementation, required verification and independent review are complete within the recorded scope. Keep local/shared delivery states separate. No secure erasure, provider recall, learning outcome, production readiness or new Docker-platform verification is claimed.
