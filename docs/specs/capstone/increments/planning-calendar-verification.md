# Calendar and AI review verification

## Goal

Verify PC01–PC06 against the local uncommitted planning-calendar increment based onc3a07fe. Shared publication and tracker writes are not authorized by passing checks.

## Context Pointers

[Contract/research](planning-calendar.md), [references and actual captures](../designs/planning-calendar/README.md), [independent review](../reviews/2026-10-14-planning-calendar-review.md). Existing unrelated AGENTS.md modification is preserved. Recording preparation stays local/ignored.

## Constraints and actual results

| Check | Actual result | Scope/limit |
| --- | --- | --- |
| Research/precode | Four light/dark1440/320 references plus focused optional-topic and pending-hint references rendered and inspected before dependent edits; isolated Edge native popup captured | Synthetic design/platform feasibility only |
| Static/build | check, lint, format:check, build and whitespace passed during local development | Required final pipeline remains separate |
| Focused final-label run | `pnpm --pm-on-fail=download exec playwright test tests/e2e/planning-calendar.spec.ts tests/e2e/ai.spec.ts`:10/10 passed,2.0minutes | Six PC + four existing AI cases before the final pending-selector save correction |
| Native calendar | Actual Edge popup keyboard ArrowRight/Enter selected15October from14, then Add retained15; passing current optional-label run | Headless Edge/native popup, not physical devices or every browser |
| Pending-selector correction | `pnpm --pm-on-fail=download exec playwright test tests/e2e/planning-calendar.spec.ts --grep 'pending calendar\|selections are explicit'`:2/2 passed,18.7seconds | Actual rangeUnderflow candidate excluded; failed-save unlock + retry and selected-only persistence checked |
| Full pipeline first attempt | Interrupted before completion after independent review identified pending-picker validity edge case | No full pass inferred; partial log retained locally |
| Full pipeline second attempt | Interrupted for the later user-requested pending-hint correction after77/109 browser cases passed | No full pass inferred; partial log retained locally |
| Pending-hint correction | Focused pending-guidance and RF03 cases2/2 passed,18.3seconds | EN/FR choose/clear/Add/remove, count zero before Add; no automatic selection |
| Fresh required pipeline | Stopped at Michael's explicit request to prioritize recording before the submission deadline;110 browser cases were scheduled | Remaining verification deferred; no full pass claimed |
| Browser MCP | Actual isolated app: three selected dates sorted14/16/18; empty topics; no competing manual review while mock proposal ready; Review AI draft entered three editable sourced steps and focused review | No Save clicked; mocked provider/search; ordinary learner data untouched |
| Actual visual review | Five current working-tree captures inspected: focused EN pending-date guidance, EN desktop light, EN desktop dark AI ready, FR320dark at200% root text, FR320light editable AI review; no measured overflow | Refreshed after both corrections; source hashes retained in capture manifest. Full-page captures have a fixed skip-link positioning anomaly, not established as a new product defect |
| Impeccable detector | One scoped pass exit0:38 advisory findings,0 blocking,0 in newly added availability styles | Existing typography/radius advisories outside this increment retained; no unrelated redesign |
| Independent review | Ready-locale and pending-selector findings corrected; fresh source review and2/2 evidence close pending-selector issue; no remaining scoped blocker | Full pipeline result still pending |

The calendar list is explicit, unique, chronological and limited to366 dates. Manual topic validation remains conditional on selecting manual review without a starter; AI review needs no manual topics. Advice remains separate from save/share/completion. Tests use isolated synthetic data and provider fixtures; no sponsored call or new API/schema/dependency is part of this increment.

## Status at the 14 October recording pause

Michael explicitly deferred remaining work to record before the submission deadline. The local changes are implemented and built; focused checks and independent review results above remain valid. Final required verification and evidence closeout are incomplete. Commit/push/tracker writes remain pending explicit approval. No timed/live video, production readiness, accessibility conformance, learning outcome or fresh Docker-platform result is claimed.

## 15 October combined verification closeout

The 14 October user-requested pause and earlier partial runs above remain historical facts. The later accepted lifecycle implementation resumed combined verification. 15 October combined verification passed: 100 domain/server tests, 115 browser tests, and static/type, lint, format, build, process and dependency audit checks. Completed 15/10/2026, 10:45:42 Africa/Lagos. Isolated synthetic data and mocked AI only. The full run includes all planning-calendar browser cases and existing mocked-AI regression cases. This is one combined result, not an invented standalone calendar run. Local implementation/checks are now complete within scope; commits, pushes and tracker writes remain pending explicit approval.

## Done When

Local implementation, combined required checks and scoped review are complete. Shared delivery remains pending Michael's explicit approval of concrete content and destinations. The earlier recording deadline pause is preserved above as history.
