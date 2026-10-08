# P10 — Independent setup and adaptation rehearsal

Recorded: 8 October 2026, Africa/Lagos. Candidate `0787299f8d335b6bfa433934407289c57c2e0dce`; application artifact `4a59c0278fee0dea7c5370f05db2ab4bfe7af34d`. No production feature or design change is proposed.

## Goal

Verify AC12 by having an independent agent follow the published README from a clean checkout, run a fresh local demo and adapt one existing template's English/French wording within its documented boundaries. Resolve demonstrated setup/documentation friction, preserve exact failures and define a proportionate path from the prototype to wider use.

## Context Pointers

[README](../../../../README.md), [local operations](../../../operations/local-demo.md), [specification](../spec.md), [integration verification](integration-verification.md), package.json and pnpm-lock.yaml define the candidate. `src/domain/templates.ts` owns original editable prompts, two locale entries, stable ID/version, prerequisites and dated MDN source links. `src/shared/contracts.ts` and domain validators define allowable provenance. The review and evidence-update skills apply to real observations and saved delivery, separately from learner-impact evidence.

### Research checklist R19

| Need | Status | Findings and evidence | Unresolved question |
| --- | --- | --- | --- |
| R19a: exact candidate and isolated scope | Satisfied | Independent agent confirmed exact HEAD, absent `.local/rehearsals/p10`, clean detached local clone with `--no-hardlinks`, Node 24.19.0 and unused loopback 4326. Existing demo on4317/data stays separate. | None; a local clone and this host/cache are not a new machine or remote clone. |
| R19b: reproducible prerequisites and first run | Satisfied: primary source plus isolated execution | README requires pnpm11.19.0, but installed bundled launcher runs11.25.0 and explicitly sets `pnpm_config_pm_on_fail=ignore`; no Corepack command is available. Official [pnpm CLI settings](https://pnpm.io/settings/cli#pmonfail) supports a per-command override. Independent `pnpm --pm-on-fail=error --version` failed with the exact mismatch; `pnpm --pm-on-fail=download --version` returned11.19.0. Explicit-override frozen install/build/start and56/56 domain/store/HTTP tests passed. Install reused126 cached packages, downloaded0; fresh account/8-step plan saved at4326. | None for documenting this verified recovery path. Machine portability and cold-cache install remain untested. |
| R19c: bounded adaptation semantics | Satisfied: independent and root source inspection | `validation.ts:135` accepts only `html-first-page@1` or null; `store.ts:202` records non-null templateVersion1. New draft creation copies selected locale steps in `plan-editor.ts`; existing plans retain stored fields. No title-coupled tests were found. Equivalent first-step wording can be adapted in EN/FR without changing ID/version/estimates/sources/prerequisites. | None for the isolated wording fixture. New IDs/versions/outcomes would require separate validation, contract, storage provenance and test changes. |
| R19d: maintainability and production gaps | Satisfied: scoped independent inspection | Reviewer inspected150 tracked paths, known runtime/secret-path exclusions, operations and adaptation documentation. No current runtime defect established. Documentation omits the store version mapping and has a stale integration-gate statement. No project LICENSE/COPYING or package license exists; icon notices are separate. Existing specification identifies production operational gaps. | None for authorized private rehearsal and accurate documentation. Future redistribution/license, hosting, identity/recovery and operational policies remain explicit future owner decisions. |

**R19 closed at19:48 Africa/Lagos on8October2026**, before the dependent documentation correction and isolated adaptation. Required factual needs are satisfied through the actual evidence above; no unanswered consequential decision remains in scope. Baseline install/start and the narrowly isolated adaptation are rehearsal/research fixtures, never silently promoted to product source. Passing adaptation, final review, cleanup and saved delivery are still required observations, not inferred from research closure. Reopen affected research when a consequential unknown appears.

**R19b reopened at19:50, before any adaptation or production correction:** the untouched clean clone passes strict/lint but fails format because system `core.autocrlf=true` checks out maintained LF blobs as CRLF. Its status is clean. The parent authored working tree remained LF, explaining the prior passing result. Existing `.gitattributes` protects only historical byte-preserved material. Research now must verify scoped `text eol=lf` attributes against the actual formatter file inventory and unchanged historical/binary bytes, then demonstrate a newly checked-out candidate passes formatting. [Git's official attributes documentation](https://git-scm.com/docs/gitattributes) describes per-path checkout conversion and `-text` preservation. Do not alter global Git configuration, run a bulk formatter, suppress diagnostics or change historical evidence to hide the failure. Adaptation stays paused until this need is satisfied.

**R19b reclosed after the isolated attributes experiment, before production configuration edits:** `.local/reuse-eol-experiment.py` populated a separate Git index from candidate blobs, enabled `core.autocrlf=true` only in that fixture and checked out the proposed attributes. All45 maintained source/test/tool/root-config inputs retained exact LF bytes; four preserved historical/research files and a binary sentinel remained byte-exact. Proposed attributes SHA-256 `1808f73996fd6a6c1434f779187390b9ec0940f7926363745c5d18e00a49f4f2`. Root will add only the verified path-scoped attributes, retaining all existing `-text` rules, and the independent agent will check out that corrected revision and run format before adaptation. No source reformat, global setting change or relaxed formatter is permitted. Research feasibility is now satisfied; RU06's actual full-checkout formatter pass remains unverified until executed.

## Constraints

- Keep the candidate and primary application source unchanged during independent observation. Use a fresh `.local` data directory and an available separate loopback port in the clone. Do not copy parent dependencies, builds, databases or auth secret. Cache reuse and inherited host tools must be stated.
- Start with README and linked operations, record missing instructions before using a verified correction. Preserve package pins/lockfile. Resolve version mismatch with a per-command scoped method if verified; do not change global Codex wrappers/settings or weaken version enforcement.
- The adaptation changes only one existing step prompt in both locale entries, preserving its meaning, estimates, ID/version, sources and prerequisites. Capture an exact safe patch and before/after observations; do not merge it into the product. Choose equivalent concise wording, without educational guarantees or claiming native-French certification. Apply incumbent Impeccable guidance for rendered copy; no layout, new visual world, formal phase or receipt changes.
- Create a baseline synthetic plan before adaptation and verify its saved learner content survives rebuilding/restarting. New drafts should show the changed prompt in both languages; language switching must preserve learner-authored text. This is a configuration/content extension rehearsal, not measured human adoption.
- No volunteer availability is known. Do not contact or recruit anyone, collect real learner data, select a public license, activate CI/hosting, expose the server externally or enable paid services. Record those future decisions honestly.

### Acceptance and quality contract

| ID | Observable completion | Required evidence |
| --- | --- | --- |
| RU01 | Clean candidate installs and builds using documented prerequisites or an explicitly recorded, researched correction. | Exact clone/revision, versions, commands, exit results, lockfile unchanged and any host/cache limits. |
| RU02 | Fresh data/local account can create an explicitly saved plan; restart preserves it without importing parent data. | Running isolated URL, actual browser MCP actions/readback and distinct server restart; no machine-reboot claim. |
| RU03 | Independent reader adapts an existing EN/FR template within documented constraints and observes the new wording in new drafts while an earlier saved plan remains unchanged. | Safe adaptation patch, exact boundary inspection, affected checks and browser readback in both locales. |
| RU04 | Source/distribution/operations documentation identifies actual setup friction and a defensible sequence toward production. | Independent review with prioritized gaps, evidence and owner decisions; no unsupported production-readiness or license claim. |
| RU05 | Results, fixes and limitations are reviewed, published to both authorized private repositories and reconciled in E011 without altering prior history. | Normal Git/MCP readback, saved correct-account Sheet/Kaneo comparisons and dated skill outputs. |
| RU06 | An actual checkout with `core.autocrlf=true` retains LF for maintained formatter targets and passes format without formatting source or global config changes; historical byte-preserved material is unchanged. | Isolated attribute experiment plus fresh corrected checkout, target EOL inventory, hashes and actual format result. |

Verification is proportional: frozen install, build, strict/lint/format, 56 domain/store/HTTP checks and documented distinct-process checks can establish a fresh baseline. Browser observations and focused checks cover the adaptation; the unchanged application already has 48 passing browser cases at its artifact. Repeat broader tests only when a new production change, failure or unresolved concern warrants them. Exact executed commands and unexecuted checks belong in the rehearsal report. Root owns documentation corrections and current records; the independent agent owns its report and isolated fixture; a separate reviewer owns operations findings.

### Ordered work

1. Independently inspect and clone the exact candidate; establish prerequisites, isolated port/data and research findings.
2. Close R19 needs for any demonstrated correction; update README/operations only after the correcting method is verified. Rehearse the corrected instructions explicitly if needed.
3. Run/observe baseline and isolated bilingual wording adaptation; retain the patch and actual checks, then stop the isolated server without deleting retained evidence.
4. Review AC12, document production gaps and claim limits, reconcile current records, publish intended non-secret evidence/docs and read back E011.

## Done When

RU01–RU06 have actual pass/fail/unverified results and no unresolved blocker within this bounded scope. Formal design completion, optional learner evaluation and the timed P11 video remain separate deliverables. Successful agent setup/adaptation is evidence of maintainability and technical reuse potential, not adoption by a person, clean-machine portability, learning effectiveness or production readiness.
