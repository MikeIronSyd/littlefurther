# P10 — Independent reuse and operations review

8 October 2026, Africa/Lagos. Reviewed source/documentation candidate: `0787299f8d335b6bfa433934407289c57c2e0dce`.

## Goal

Review the setup, adaptation, distribution and recovery instructions against AC12 and the local-demo quality contract. This invokes [learning-journey-review](../../../../.agents/skills/learning-journey-review/SKILL.md) for an operational increment distinct from the prior lifecycle review. No current runtime defect is established by this inspection. Two documentation corrections are identified below. Actual fresh-checkout and adaptation acceptance remains dependent on the separate independent rehearsal; readable instructions alone cannot pass AC12.

## Context Pointers

- [README](../../../../README.md), [local operations](../../../operations/local-demo.md), [specification and AC12](../spec.md), [P10 contract and R19](../increments/reuse.md).
- [Package scripts](../../../../package.json), [locked dependencies](../../../../pnpm-lock.yaml), [ignore rules](../../../../.gitignore), [third-party notices](../../../../THIRD_PARTY_NOTICES.md), TypeScript/Biome/Vite/Playwright configuration and the inactive [workflow template](../../../operations/github-quality-workflow.yml).
- [Server startup](../../../../src/server/index.ts), [HTTP/auth boundary](../../../../src/server/app.ts), [store](../../../../src/server/store.ts), [templates](../../../../src/domain/templates.ts), [validation](../../../../src/domain/validation.ts), shared contracts and the distinct-process verification tool.
- [Integration verification](../increments/integration-verification.md) records the existing artifact's 56 domain/store/HTTP cases, 48 browser cases, process restart, static checks and dependency audit. Those results are reused for unchanged application scope, not reported as P10 executions by this reviewer.

Read-only commands included `git rev-parse HEAD`, `git status --short`, `git ls-files`, targeted `rg`/file reads and `git check-ignore --no-index` against representative generated/runtime paths. The initial candidate checkout was clean. The later root-owned P10 records are concurrent research work, not changed product source reviewed here.

### Evidence matrix

| AC / increment criterion | Expected behavior | Evidence / revision | Result | Limitation |
| --- | --- | --- | --- | --- |
| AC12 / RU01 | A fresh checkout installs, builds and starts from documented prerequisites. | Candidate README pins Node 24.19.0 and pnpm 11.19.0; frozen install with scripts disabled, build and start match package scripts. R19 records the separate rehearsal's discovered launcher-version mismatch and investigation. | **Unverified** as executed acceptance in this review. | Source consistency does not prove provisioning, clean-machine portability, native-module loading or successful installation. Rehearsal owns those results. |
| AC12 / RU02 | Fresh isolated local data persists through restart. | Startup binds `127.0.0.1`; validates port 1024–65535; selects a separate data directory. Operations explains isolation and preserving the previous directory. Prior integration record includes actual distinct-process persistence evidence. | **Unverified** for the new independent checkout. | Prior pass is supporting evidence for unchanged behavior, not a newly run P10 restart. |
| AC12 / RU03 | Another agent adapts a template/language record within documented boundaries. | Existing bilingual template and typed language keys are discoverable; README describes wording-only adaptation. RO01 identifies the version-persistence boundary. | **Unverified** pending actual adaptation/readback. | No changed wording, rebuilt draft or preserved saved plan was observed by this reviewer. |
| AC12 / RU04 | Distribution and operations review identifies factual gaps and a proportionate path forward. | This report's source inspection, path/ignore checks, findings and prioritized register at the exact candidate. | **Verified pass** for the document-review deliverable. | Does not establish operational execution, licensing permission, human adoption, security completeness or production readiness. |
| AC13 / repeated review skill | Review connects actual artifacts, findings and follow-up. | This operational use has distinct inputs and findings from the P08/P09 source review. | **Verified pass** for this scoped invocation. | Publication, tracker reconciliation and other judging evidence are root-owned and separate. |

## Constraints

### Findings requiring documentation follow-up

**RO01 — P2, AC12/RU03: new-template/version adaptation guidance omits persisted version mapping.** README's “Maintain or adapt” section names validator/contract updates for changed outcomes or new template IDs. However, `src/domain/validation.ts:135` permits only `html-first-page@1`, while `src/server/store.ts:202` stores `templateVersion` as `1` for every non-null template ID. A future adapter who extends the metadata and validator alone could save incorrect version provenance. The current single-version template and bounded wording-only rehearsal are unaffected. Smallest correction: explicitly distinguish meaning-preserving wording changes at the existing ID/version from new outcomes/versions; name template metadata, validation, persisted version mapping and associated tests as the latter's review boundary. This is a documentation completeness finding, not a demonstrated current data defect or request to generalize the store now.

**RO02 — P3, AC12/RU04: operations guide carries a stale current-stage statement.** `docs/operations/local-demo.md:70` lists full-journey integration as a remaining gate. README and the actual P08/P09 verification record establish that this scoped integration review/correction is complete. Replace that status sentence with a link to the integration results and retain the genuinely outstanding setup/adaptation, formal-design and timed-demo limits. Historical dated observations remain valid history.

**Optional clarity, not a blocker:** operations documents `CAPSTONE_PORT` and `CAPSTONE_DATA_DIR` but supplies no scoped PowerShell example or allowed port range. Source evidence is explicit: decimal integer 1024–65535, loopback-only binding, and an absolute resolved data path. A short example can reduce setup friction without changing behavior or global settings; it must keep the previous directory intact and restore/remove only variables introduced for the isolated run.

### What source and documentation already support

The dependency manifest is private, pins the package manager and dependency versions, declares Node `>=24.19.0 <25`, and has one lockfile. Maintained strict compiler/lint/format/build/test/audit commands are discoverable. The native dependency install boundary was researched previously; `--ignore-scripts` must be evaluated against actual rehearsal evidence rather than assumed broken. The inactive workflow is honestly described as inactive; it supplies no hosted or enforced provider gate.

Of 150 tracked paths, the inventory found no path matching the scoped generated/runtime/secret patterns (`node_modules`, `dist`, `.local`, `outputs`, `.env*`, SQLite/WAL/SHM, `auth-secret`, or key/archive extensions). Representative `git check-ignore --no-index` checks confirmed these ignore rules, including a SQLite database and `auth-secret` in a non-default data directory. This is a pathname and ignore-rule check, not a content-based secret scan or proof that every future file is safe to publish.

No tracked repository `LICENSE`/`COPYING` file or package `license` property was found. The vendored-icon notice retains Lucide/Feather terms; it does not state a license for the whole project. Do not label this project open source or presume a broader reuse grant from those notices. The current owner-authorized private clone/adaptation rehearsal needs no new distribution decision. A license decision becomes relevant before offering broader redistribution or inviting external reuse.

Operations correctly distinguishes source rollback from database restoration. It preserves the complete data directory and auth secret, documents additive schema v2, rejects unsupported schema versions, and warns that P06 source cannot read v2. Restoration into a separate location is described without destructive resets or project uploads to global CodexRecovery. This inspection did not perform a backup/restore drill. Module boundaries remain proportionate to a single local server; nothing inspected justifies a new framework, service or language for P10.

### Prototype-to-production gap register

These are future release conditions, not missing promises in the selected local demo. Priority denotes the earliest expansion that requires them.

| Priority / trigger | Existing evidence and remaining gap | Smallest useful next evidence or decision |
| --- | --- | --- |
| P1 — Before any network-accessible pilot | Startup and HTTP/auth trust are intentionally loopback-only. Hosting, HTTPS, origin configuration, secrets, rate-limit/session operations and deployment recovery have not been designed or verified for a remote service. | Choose the pilot deployment boundary, then specify and test it with a threat model and realistic session/failure paths. Do not expose the current listener by merely changing its bind address. |
| P1 — Before retaining real learner data in a pilot | Local accounts do not verify email or provide password recovery. Learner-data retention/deletion, recovery access and protected backups remain outside the current acceptance. Circle controls address specified in-app sharing, not a complete service data policy. | Owner defines identity/recovery and data lifecycle for the pilot; test authorization and restore/deletion behavior on representative synthetic data before collection. |
| P1 — Before relying on upgrades or recovery for ongoing users | Schema compatibility checks, migration tests and a distinct-process restart exist. A complete backup/restore rehearsal, release compatibility policy and operational recovery objectives do not follow from them. | Define a versioned release/migration procedure and demonstrate restoration of a matched source/data/auth-secret set into an isolated destination, with explicit loss/recovery limits. |
| P2 — Before inviting external reuse or routine maintenance | Current private-source structure, pins, notices and commands are useful. Project licensing is unstated; broader portability, active CI and enforced review gates are not established. | Decide distribution terms when distribution is in scope; rehearse supported host/tooling combinations; activate CI only with authorized access and verified cost constraints. Keep exact failures and lockfile provenance. |
| P2 — Before remote peer use at meaningful scale | Current local two-account lifecycle and explicit sharing are tested. Cross-device delivery, abuse/moderation, concurrent-session capacity, availability and observability are not. | Define the remote-peer operating model and measurable load/availability needs; run representative concurrency/failure checks before selecting additional infrastructure. |
| P2 — Before broad accessibility, language or impact claims | EN/FR UI and scoped browser checks exist. Native-language review, broader devices/assistive technology, physical disconnection coverage and learner outcomes remain limited or unverified. | Use bounded usability/accessibility/language observations, then separately measure sustained use if authorized. Do not infer retention, mastery or adoption from an agent rehearsal. |

The open factual questions for this increment are the independent agent's exact pnpm provisioning result, install/native startup results, isolated restart, safe bilingual adaptation diff and observed new-versus-existing-plan behavior. These are evidence requests to the ongoing rehearsal, not unanswered product-direction questions for the user. No consequential owner choice is required to finish the current private P10 scope.

## Done When

This review deliverable is complete when root disposes RO01/RO02 against verified source facts and links the separate rehearsal's actual RU01–RU03 results before closing AC12. RU05 publication and saved tracker readback remain root-owned. The present review passes RU04's bounded operational assessment; it does not itself close AC12 or the capstone.

No app, browser, installer, build or test runner was executed by this reviewer; no database, source, tracker or global setting was changed. Only this review document is authored. Later evidence or documentation corrections should be recorded as an addendum with their actual scope, preserving the reviewed candidate and the findings above.
