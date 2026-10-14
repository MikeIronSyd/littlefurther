# Docker increment independent review — 14 October 2026

## Goal

Review the [Docker contract](../increments/docker.md) against the implementation and actual shipping-image evidence. The `learning-journey-review` skill was invoked for this acceptance-linked review. Scope: baseline `85c05ecd515b0b9fcd94182fffe53eaa15069062` plus the uncommitted Docker increment; no frontend, dependency, schema or API changes. Review observation: 14 October 2026, 14:46–14:48 Africa/Lagos.

The core packaging and application checks pass, but a later optional-key acceptance check blocks release: Docker Desktop created a missing bind source as a directory despite the configured no-create option. DK05 is therefore incomplete and its scoped research is reopened. DK01–DK04 and DK06 retain their existing evidence. DK07 remains incomplete while the required full native pipeline runs; DK08 remains unverified until activity and publication readbacks. This is a scoped readiness review, not a completed-release statement.

## Context Pointers

Inspected `.dockerignore`, `Dockerfile`, `compose.yaml`, `compose.ai.yaml`, `src/server/index.ts`, the unchanged Host/Origin/authentication/data-lifetime code in `src/server/app.ts`, `tools/verify-process.mjs`, README, architecture/development guidance, [Docker operations](../../../operations/docker.md), the contract and [verification record](../increments/docker-verification.md).

The source-copy feasibility experiments establish R38 only. The acceptance matrix below uses the shipping images and later checks, rather than substituting feasibility results. Shipping AMD64 image: `sha256:68911729c47af826581db31596d64648924f841d0ae91c543bec2aa741ccb1f7`. Shipping ARM64 image: `sha256:3fedc307b9add84fa515f5ee6296370f8e175b74f80f7cf9840b01827d152e46`.

| AC | Expected behavior | Evidence / reviewed scope | Result | Limitation |
| --- | --- | --- | --- | --- |
| DK01 | Frozen clean Linux builds; SQLite and authenticated startup | Shipping AMD64/ARM64 build logs; runtime inspections; ARM64 reviewer-executed health/auth/French-profile smoke. Node 24.19.0, pnpm 11.19.0 and SQLite 3.53.4 loaded. | Verified pass | AMD64 runs on Docker Desktop's Linux WSL2 engine; ARM64 uses emulation, not native ARM hardware. |
| DK02 | Native loopback default, constrained bind config, equal loopback ports and rejected foreign requests | Static index/Compose inspection; process check rejects four invalid bind values before data or credential-file access; shipping HTTP probes on 4320 and 44318 return 403 for foreign Host/Origin; inspected host mapping is 127.0.0.1. | Verified pass | Default 4317 is read back in Compose configuration; runtime tests use isolated alternate ports to preserve the ordinary server. |
| DK03 | Nonroot complete-directory persistence across stop, recreation and rebuild | AMD64 acceptance receipt checks original owner/peer sessions, exact secret digest, plans, private reflection, progress, FinishLine, Comeback receipts, membership and deliberate shared copies after all three operations. UID 1000 owns data; secret mode 0600. ARM64 also retains session/profile/secret after recreation. | Verified pass | Synthetic records only; rebuild uses the same Dockerfile and build cache. No machine reboot or ordinary-data migration test. |
| DK04 | Stopped full-directory backup and empty-target restore | Documented tar commands executed on synthetic volumes; restoration retains the original sessions, complete learning/circle records and exact secret hash. A repeated restore to the nonempty destination exits 1. | Verified pass | Archive protection/encryption and actual learner migration are operator responsibilities; no ordinary records were copied. |
| DK05 | Keyless manual use; safe optional runtime key; no private build inputs | Keyless manual, read-only synthetic Responses and image/context hygiene checks pass. However, the later missing-source probe creates a host directory despite `create_host_path: false`; the required missing-file refusal/no-create behavior is not satisfied. | Verified fail — release blocker | Scoped research is reopened for the optional credential mount. Other passing privacy/image checks remain valid; no actual key or live provider request was involved. |
| DK06 | Healthy direct Node lifecycle and preserved bilingual browser journeys | AMD64 healthy startup and 832 ms SIGTERM exit 0 / no OOM; ARM64 health 200 and SIGTERM exit 0. Five unchanged container browser tests pass in 56.56 s: planning/study/progress, Comeback, private circles, French 320 px and blocked external browser requests. | Verified pass | Windows-host Edge drives the Linux AMD64 server. Browser request blocking is not a physical internet-disconnection test. |
| DK07 | Required full verification and independent review | Scoped checks and this review pass; `pnpm --pm-on-fail=download run verify` is running in `.local/docker-checks/full-verify.log`. | Unverified — required pipeline pending | Do not infer a full pass from the scoped container tests or earlier verification. |
| DK08 | Saved activity and recorded as source evidence-source readbacks | No delivery or tracker completion is inferred by this review. | Unverified — delivery pending | Final release evidence must be recorded separately. |

Private detailed evidence is retained under `.local/docker-checks/`: shipping build logs, `container-acceptance-receipt.json`, `playwright-results.json`, `native-process-receipt.json`, `shipping-arm64-receipt.json`, `context-result.json` and `image-layers.json`. The final [verification record](../increments/docker-verification.md) is the published result summary; private fixtures, session state and archives must stay outside Git.

## Constraints

**Release blocker, DK05:** the configured bind no-create option does not establish missing-file safety on the tested Docker Desktop route. A synthetic missing-file probe created a source directory. Do not publish the current missing-file guarantee or close this AC until a researched correction passes both missing-source refusal/no-creation and valid read-only synthetic assistance checks. Production correction is on hold while that scoped research is completed; no real credential was used. The image/context checks themselves still pass: nine excluded canaries / 41 inputs, ten image layers / 11,865 entries, and only the three production top-level packages with no inspected development package in the pnpm store.

The initial README statement that no registry was involved was corrected: initial builds download base images/packages, while no project-image publication or hosting is configured. The verification record still needs its actual-result closeout before release.

Retained failed attempts are test-harness findings, not product defects: the first container probe expected HTTP 200 for plan creation, but the existing API correctly returns 201; the corrected expectation follows `app.ts`. The earlier feasibility Host probe used Node fetch, which did not transmit its custom Host override; raw HTTP/curl confirmed the expected 403. Neither correction changed application assertions or production behavior.

The build uses a source allowlist and frozen Linux dependency installation; the runtime receives compiled assets and production dependencies only. Bind validation precedes credential loading and data creation. Canonical Host/Origin authorization remains unchanged. Valid synthetic key mounts are read-only; missing-file behavior remains the blocker above. Restore uses a stopped source and empty target, preserves failed/nonempty destinations and restores nonroot ownership. No ordinary learner data, actual key, live sponsored request, registry publication, hosting or CI activation occurred in the reviewed checks.

The reviewer executed the shipping ARM64 smoke and the independent image dependency inspection, and inspected the other agent's comprehensive AMD64/browser receipts. A running shipping application was observed through HTTP. Technical acceptance does not establish human adoption, educational effectiveness, exhaustive accessibility conformance or production readiness.

## Done When

DK01–DK04 and DK06 execution review is complete. Resolve the DK05 optional-key missing-file blocker through documented research and actual correction checks before release. Then finish the required pipeline, reconcile the verification/current records, and record saved tracker and authorized publication readbacks. Preserve the platform, offline and synthetic-data qualifications above.

## Scoped independent credential-preflight follow-up — 14:55 Africa/Lagos

### Goal

Independently review the researched DK05 correction in the current uncommitted Docker increment after R38 reclosed at14:54. This follow-up invokes `learning-journey-review` and supersedes only the missing-file blocker above; it does not infer DK07/DK08 completion.

### Context Pointers

Inspected the revised [operator procedure](../../../operations/docker.md), `compose.ai.yaml`, the R38 closure and the original missing-mount/file-backed-secret research receipts. Reproduced the documented regular-file conditional with an explicitly stubbed `docker` function in isolated PowerShell and Git Bash fixtures. All six cases pass: absent sources and directories refuse before the CLI and create no absent source; existing synthetic regular files invoke only the stub. Private independent results are in `.local/docker-checks/independent-preflight-powershell.json` and the corresponding Bash fixtures. An initial attempt to execute a saved PowerShell script was rejected by the PC's execution policy; the same conditional was then exercised as normal inline PowerShell without changing that policy.

| AC | Expected behavior | Evidence / reviewed scope | Result | Limitation |
| --- | --- | --- | --- | --- |
| DK05 | Enable the optional override only with an existing regular credential file | Independently executed PowerShell/Bash absent, directory and synthetic-file preflights; only the file reaches the stub CLI. The guide requires the conditional before every optional-AI `up` and truthfully qualifies Desktop's no-create behavior. | Verified pass for the documented existing-file procedure | This is a host preflight, not a Docker-enforced missing-source guarantee or a file-permission grant. Directly bypassing it remains outside the documented procedure. |
| DK05 | Existing-file mount stays read-only and supplies optional assistance without provider traffic | Reviewed the unchanged shipping AMD64 acceptance receipt and harness: Docker mount `RW:false`, synthetic available status and step-help response, blocked external fetches, no automatic save, and successful return to keyless Compose. | Verified pass from inspected shipping execution evidence | This reviewer did not repeat the actual mount/request test. No real credential or live provider request was used by the fixture. |

### Constraints

The correction meets the accepted existing-file runtime-mount scope without adding a dependency, entrypoint, API or credential-copy path. It makes the actual safeguard explicit instead of asserting that the unsupported Desktop flag protects absent sources. Regular-file checks cannot prevent a concurrent operator filesystem change between checking and starting Compose; maintain the file and its UID1000 read access throughout startup. The guide already states that preflight does not grant permissions. No unconditional no-creation claim, production-readiness claim or new live provider validation is supported.

### Done When

No remaining scoped DK05 blocker is identified after the documented correction and six independently executed conditional cases. DK07 still requires the completed full pipeline and final review reconciliation; DK08 still requires saved tracker and authorized publication readbacks. This reviewer observed the preflight fixtures and inspected shipping receipts, but did not operate a running application during this follow-up.

## Final independent technical review — 15:02 Africa/Lagos

### Goal

Close DK07 against the actual completed verification and corrected Docker records. Scope remains `85c05ecd515b0b9fcd94182fffe53eaa15069062` plus this Docker increment. Earlier pending/failing snapshots above remain dated evidence; the14:55 follow-up resolves DK05 and this section closes DK07.

### Context Pointers

Read the actual `.local/docker-checks/full-verify.log` and `full-verify-result.json`: the required `pnpm --pm-on-fail=download run verify` completed with exit0,85domain/server passes,94browser passes in15.5minutes, compiler/lint/format/build/process checks and audit reporting no known vulnerabilities. Root observed command completion at15:01Africa/Lagos; the result receipt was recorded at15:02. Reviewed the [updated verification record](../increments/docker-verification.md), scope/limitations and the shipping source hashes. Current `src/server/index.ts`, `Dockerfile`, `compose.yaml` and `tools/verify-process.mjs` bytes exactly match the shipping AMD64 acceptance receipt.

| AC | Expected behavior | Evidence / reviewed scope | Result | Limitation |
| --- | --- | --- | --- | --- |
| DK07 | Required project pipeline and independent acceptance-linked review pass | Actual final full log/exit receipt, prior shipping five-case browser result, DK01–DK06 evidence and the corrected DK05 follow-up. | Verified pass | The full native pipeline ran on Windows; LinuxAMD64 runtime and ARM64 emulation are separately qualified shipping checks. No hosted CI or all-host compatibility claim. |
| DK08 | Saved tracker and authorized publication readbacks | Read-only tracker baselines and prepared nextE031/D019 bounds only. | Unverified — release activity pending | Local passing checks do not establish publication or saved external updates. |

### Constraints

No remaining scoped technical implementation blocker is identified for DK01–DK07. The current guide accurately distinguishes keyless use, optional existing-file preflight, synthetic AI testing, initial network downloads, running-server offline behavior, fresh data volumes and stopped backup/restore. Source/behavior changes after these tested bytes would require reassessment. This reviewer inspected the completed pipeline evidence rather than rerunning it; no additional application operation, real key/provider request, ordinary learner-data access or educational/adoption outcome is claimed.

### Done When

DK01–DK07 are technically verified within their recorded limits and ready for the already authorized normal publication. DK08 remains open until the actual Miva Sheet/Kaneo saves and each intended private repository head are independently read back. Timed demo, final submission, learner effectiveness and future AI-surface human review remain separate.
