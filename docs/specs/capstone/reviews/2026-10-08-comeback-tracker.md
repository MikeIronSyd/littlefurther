# Comeback tracker reconciliation — 8 October 2026

## Goal

Reconcile the P06 Comeback increment while preserving activity history and separating implementation evidence from learner outcomes and whole-MVP completion. The `capstone-evidence-update` and computer-use skills were read and applied. Initial read-only discovery is preserved below; final saved outcomes and the later tracking-policy change follow it.

## Context Pointers

Inputs read: `AGENTS.md`, `project-context.json`, the capstone specification, plan and verification, the activity-tracking specification, the evidence skill, and [the previous E007 tracker report](2026-10-07-first-journey-tracker.md). The previous report is historical evidence; today's observations below verify current reachability and field baselines.

- [Miva hackathon Sheet](https://docs.google.com/spreadsheets/d/1vuVwhMl6pSkSP36qlg0hDFoGKLfdpAalAkx1juJE7-M/edit): browser MCP displayed **Michael Alkali (m.alkali5130@miva.edu.ng)**, the expected title, **Private to only me**, and **Saved to Drive**. A fresh browser-mediated XLSX export supplied exact cell values for all five tabs. No native Sheets connector was used.
- [Kaneo project](http://localhost:5173/dashboard/workspace/wefNu1lRD5XDr17r5UVFiRpc2kcbXBVi/project/nejfw2r0b5lg6v9wpqorte7h/board): browser MCP displayed **Michael Alkali** and the expected project. The board has ten tasks: **one To Do, five In Progress, zero In Review, four Done**.
- Spreadsheet evidence contains **E001–E007**, with E008 absent across all five exported tabs and `Codex evidence!A9:J9` blank. Decisions remain D001–D015; activities remain A001–A010. E008 is available for the upcoming increment, subject to a fresh uniqueness check before writing.
- Each affected Kaneo task's rendered description was independently read into the browser session. All five start with the saved E007 first-private-journey block and have no E008 block. No new direction or changed activity status was observed in these records. This is not an audit of unrelated user activity.

| Activity / ticket | Kaneo task ID | Current status | Proposed focused reconciliation |
| --- | --- | --- | --- |
| A004 / CAH-5 | `r00pcmdoxqe9pg9sypknq8kv` | In Progress | P06 research/specification and settled scope |
| A006 / CAH-7 | `zlku14kwk2hz6t8wiuhskib1` | In Progress | Actual Comeback implementation, verification and next increment |
| A008 / CAH-9 | `uhcnhzx7eeu0qc3jonj5qzkj` | In Progress | Actual reusable-skill, agent and MCP work |
| A009 / CAH-3 | `p866v9czc3ko17xfzg9gyx5y` | Done for initial setup | Supplied and verified normal source evidence |
| A010 / CAH-10 | `nx3nmey5c6huteswnhhzv2zf` | In Progress | Actual acceptance evidence, failures/fixes and limitations |

A007 / CAH-8 (`x4m83y5luy1m0hk8gg7uch42`) is **Capstone submission and reflection** and remains **To Do**. It is not an implementation completion flag.

### Prepared Sheet update boundaries

| Tab | Exact range | Intended change, after evidence arrives |
| --- | --- | --- |
| Codex evidence | `A9:J9` | Add E008 only after rechecking uniqueness/blank destination; record actual P06 artifacts, checks, limits and J1–J4 mapping. |
| Codex evidence | `H8:I8` | Add dated superseding current state while retaining E007's previous values verbatim as history. |
| Activities | `G5:K5`, `G7:K7`, `G9:K11` | Reconcile next actions, output/evidence, Codex contribution, limitations and sources for the five existing activities. Keep former next actions in history. |
| Context | `B25:C25` | Add current scope/result/source evidence above the existing context and retain all prior history. |

The exported schema confirms Activities G–K are Next action, Output or evidence, Codex contribution, Result or limitation, Source. Context B25 already preserves an older history suffix ending in literal `Item`; retain the exact baseline without inventing lost text. No decision or milestone change is currently proposed.

## Constraints

- During the initial preparation, no live tracker content, status, due date, title, assignee, sharing setting, invitation or comment was changed. Separate temporary browser tabs avoided competing with the user's existing tracker tabs.
- Preserve all existing statuses, including A009's initial-setup Done and A007's To Do; preserve source and historical recovery records while clearly following the current global-only recovery policy. This task does not publish source or invoke recovery.
- At the initial preparation, root had not supplied a final P06 artifact or check results. Final implementation/publication evidence below supersedes that preparation limit; learner benefit, human adoption, measured time saving, full MVP and demo completion remain unclaimed.
- J1 will require actual P06 lifecycle/skill/MCP artifacts and results; J2 will describe observed recovery behavior with synthetic-test/learner-study limits; J3 will distinguish repeatable implementation from still-unexecuted independent setup/adoption; J4 remains a planned scene until a real timed recording exists.
- Official submission deadline remains unannounced. The 14 October date is an internal target only. No course-completion or milestone status change is proposed.

## Done When

The initial preparation established both destinations, the intended Miva identity, exact ranges and task IDs. Authorized reconciliation requires rereading affected records, retaining history, and comparing saved values after reload. A successful input action alone is not completion. The user's latest clarification **reaffirms the original Google Sheets, Kaneo and GitHub workflow**; the short-lived request to stop Sheet updates is superseded.

### Final evidence inputs

The [Comeback verification](../increments/comeback-verification.md), [independent source review](2026-10-08-comeback-review.md) and [scoped visual review](2026-10-08-comeback-visual.md) were read before live reconciliation. Root supplied actual results and artifact `204e227a63c550140ed7b868c1fe76e68b74391b`: [source evidence](https://github.com/MikeIronSyd/littlefurther/commit/204e227a63c550140ed7b868c1fe76e68b74391b). GitHub MCP `github_fetch_commit` independently returned the matching source evidence revision, title and canonical URL; Miva readback remains Git CLI evidence. This tracker agent did not run product checks or publish source.

### Sheet result and subsequent user clarifications

The Miva identity was reverified and every affected field matched its fresh baseline before mutation. Browser MCP wrote `Codex evidence!A9:J9`, `H8:I8`, `Activities!G5:K5`, `G7:K7`, `G9:K11`, and `Context!B25:C25`; all immediate comparisons passed. After Saved to Drive and reload, an exact browser-exported XLSX comparison confirmed **39 intended cells changed, zero value mismatches and no other cell changes**. A separate Python ZIP/XML comparison exited 0 with the same exact 39-cell set and all activity statuses preserved. E001–E006, untouched E007 fields, Decisions, Milestones, unrelated rows and prior text remain intact. E008 was absent before writing and created once.

These edits and saved readbacks **completed before the user briefly asked to stop Sheet updates during this increment**. On receipt of that steering, the tracker agent stopped all Sheet writes and inspections immediately. Before a Kaneo-only note was written, the user explicitly reversed that preference: “You can continue with the Google Sheet and everything we were doing before. It's okay.” The original Sheet + Kaneo + GitHub workflow is therefore current. A brief dated clarification was added to A010, preserving this chronology. No undo, deletion, permission change, duplicate evidence row or redundant Sheet write was performed.

The initial local XLSX comparator mishandled self-closing empty cells and reported 20 false additional differences using shared-string indices. The parser was corrected to handle self-closing cells; the corrected exact-value comparison and independent XML parser agree. No unintended Sheet change or failed live write resulted.

### Kaneo result

E008 was added above the existing descriptions of A004/CAH-5, A006/CAH-7, A008/CAH-9, A009/CAH-3 and A010/CAH-10. Every original description was reread and matched its baseline before mutation. Each complete intended result then passed reload-and-readback comparison with rendered whitespace normalized. Prior histories were preserved; no status, title, due date, assignee, invitation, comment or sharing change was made.

One A006 paste landed after the previous history rather than above it. Inspection and reload established the exact known state: one complete E008 block appended, original history intact. A focused replacement restored the intended block order, and the subsequent persisted comparison passed. No duplicate E008 block remained. A later A009 read timed out during reload; a fresh DOM observation and read succeeded without another write. These attempts are not counted as first-pass success.

The final A010 three-destination clarification passed its own reload-and-readback comparison. The final board still shows ten tasks: one To Do, five In Progress, zero In Review and four Done. A007 remains To Do and A009 remains Done for initial setup. All five E008 descriptions and the policy clarification are saved; no live reconciliation is pending.

Proof screenshots were saved and visually inspected at ignored `outputs/comeback/sheet-e008.png` and `outputs/comeback/kaneo-e008.png`. They show the saved E008 Sheet row and the actual A010 clarification/E008 heading. Two attempts through the lower-level browser screenshot method produced unusable black captures; the supported CUA screenshot returned the actual rendered Kaneo view and replaced the unusable file. Screenshot presence is supplementary; exact comparison evidence above establishes saved fields. Temporary duplicate tabs may close; the user's original tracker tabs and stable URLs remain available.

### Judging traceability

| Criterion | Requirement → artifact at `204e227` → actual result | Demo boundary |
| --- | --- | --- |
| J1 — Codex integration | AC13/D013 and CB01–CB06; pre-code research/contract, parallel implementation, actual second product review-skill iteration, this evidence-skill reuse, independent reviews, browser MCP and GitHub MCP. | Show the real contract, review finding/fix and observed recovery. No plan-mode use or measured time saving inferred. |
| J2 — Impact | AC06/CB01/CB05; 40/40 domain/HTTP tests; 19 existing plus eight Comeback browser cases passed across recorded runs, final affected eight/eight. Root's synthetic eight-step browser journey preserved completed 7 October, 1/8 completion and five reported minutes while seven unfinished dates moved 8–14 to 11–17 October. | Working preview/cancel/confirm/reload scene; no learner study, mastery, retention or causal benefit. No single 27-case run is claimed. |
| J3 — Reuse/adoption | Pure calendar rule, shared contracts, owned transaction, client module, tests and local setup/operations. Strict/lint/format/build/audit and distinct-process restart passed; receipt/dates/private work persisted. | Independent clean-checkout/adaptation and human adoption remain pending. Local checks do not establish production readiness. |
| J4 — Demo/pitch | Working Comeback scenario and actual browser captures are available. | Recording, measured 3–5 minute duration and timecodes remain pending; A007 remains To Do. |

P07 private invitation-only peer circles remains required next work. The visual `ship` verdict covers the scoped P06 extension; formal Impeccable completion remains refused/open at plates, with missing formal phase/QUALITY BAR/comp-diff evidence. CI remains an inactive template. Native-French review, real-device testing and full accessibility conformance are unverified. The local server must run. Official submission deadline remains unannounced and 14 October is internal only.
