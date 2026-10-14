# Docker verification — 14 October 2026

## Goal

Verify the accepted [Docker contract](docker.md) using isolated synthetic data. Preparation is not an executed acceptance pass.

## Context Pointers

Baseline `85c05ec`; Linux engine on Windows Docker Desktop. Exact feasibility, packaging revision, commands, outcomes and limitations will be recorded here. Ordinary native server4317 and `.local/data` remain outside the test setup.

## Constraints

No live provider requests, credential contents, normal learner data, image registry/hosting/CI activation or global recovery. ARM64 checks use emulation and cannot establish native ARM hardware compatibility. Preserve failed-attempt evidence with subsequent corrections.

## Done When

Completion requires DK01–DK08 checks, independent review, tracker readbacks and the authorized delivery. The executed sections below supersede this record's initial pending preparation state; outstanding release checks are identified individually.

## Executed packaging checks

R38 closed14:31Africa/Lagos before production edits. LinuxAMD64 and emulatedARM64 source-only feasibility built with the exact pinned base, full/production frozen installs and SQLite3.53.4; nonroot fresh-volume/auth/signal checks passed. These were isolated research copies, separate from shipping acceptance.

The shipping working increment adds only four bind-validation/listener lines plus packaging and operational verification/docs. No dependency, frontend, schema or API changes. Baseline `85c05ecd515b0b9fcd94182fffe53eaa15069062`; private receipts retain exact source hashes.

| AC | Actual check and result | Boundary |
| --- | --- | --- |
| DK01 | `docker compose -p littlefurther-verify-20261014 build --no-cache app` passed; LinuxAMD64 image `sha256:68911729c47af826581db31596d64648924f841d0ae91c543bec2aa741ccb1f7`. `docker build --platform linux/arm64 --no-cache ...` passed; image `sha256:3fedc307b9add84fa515f5ee6296370f8e175b74f80f7cf9840b01827d152e46`. Both load Node24.19.0/SQLite3.53.4 and support authenticated startup. | Actual LinuxAMD64 WSL2 engine; ARM64 emulation, no native ARM/all-host claim. |
| DK02 | Shipping4320/44318 health/auth and foreign Host/Origin403 pass. Compose default maps127.0.0.1:4317:4317; alternate mapping remains equal. Process checks reject empty/localhost/nonloopback/whitespace bind values before any data directory or credential-file read. | Native4317/ordinary records untouched. Default config inspected; runtime uses isolated alternate ports. |
| DK03 | AMD64 synthetic two-account seed/verify passes stop/start, down/up and cached shipping rebuild/force-recreation. Exact plan/activity/reflection/completion/Comeback receipt/circle records, both original sessions and auth-secret digest retained. UID1000, writable fresh volume, secret0600. ARM64 recreation retains session/profile/secret too. | Isolated unique test volumes; no ordinary-data migration. |
| DK04 | Documented stopped tar backup and new empty-volume restore pass with exact records/sessions/secret retained. Repeated extraction into nonempty target is refused. Restored ownership permits nonroot startup. | Synthetic backup only; not an ordinary-data migration or encryption test. |
| DK05 | Basekeyless manual journey passes. Production optional mount plus synthetic read-only key/preload returns mocked authenticated step help; fixed endpoint/model/strict-output/store:false assertions pass and external requests are blocked. Returning to base preserves records. Nine build-context canaries excluded (41 entries); exported shipping image10layers/11865entries has no excluded private/source/development inputs. Independent runtime dependency inspection finds only three production top-level packages. | Actual keys never read/mounted; no live provider request. Empty `.local/data` mountpoint is intentional, not host data. |
| DK06 | Healthy directNode process; AMD64 SIGTERM832ms/exit0/noOOM. ARM64 SIGTERMexit0. Five unchanged browser cases pass56.56s: reviewed plan/study/completion/progress, Comeback, two-account circles, French320px and blocked external browser requests. | Windows Edge drives LinuxAMD64; no Linux desktop-browser/physical network-loss claim. |
| DK07 | `pnpm --pm-on-fail=download run verify` exited0 on14October15:01Africa/Lagos: typecheck, lint, format, build,85domain/server tests, strengthened process checks,94browser tests(15.5minutes) and audit(no known vulnerabilities). [Independent review](../reviews/2026-10-14-docker-review.md) plus scoped preflight follow-up find no remaining implementation blocker. | Windows native pipeline complements Linux runtime checks; no hosted CI or broad host/device claim. |
| DK08 | Tracker baselines/nextE031 and D019 slots verified read-only; publication/readbacks pending. | No delivery inferred from local builds. |

AMD64 acceptance ran14:41–14:44Africa/Lagos; ARM64 shipping smoke14:42. Private build/platform/lifecycle/source-hash/browser receipts and synthetic fixtures are retained under ignored `.local/docker-checks/`. All owned test containers/volumes were removed; normal app4317 and Kaneo remain available.

### Corrected checks and scoped research reopening

The first acceptance harness expected200 for plan creation, while the existing API correctly returns201. The ignored harness now accepts successful2xx for positive operations and retains explicit failure assertions; a fresh full rerun passes. The first feasibility foreign-Host attempt used Node fetch, which did not transmit its override; rawHTTP/curl confirms403. These are harness corrections, not product defects.

A later missing optional file probe exposed Desktop creating an absent source directory despite effective `create_host_path:false`. File-backed Compose secrets likewise only warn and start; they were not adopted. R38 reopened for this behavior and reclosed14:54 before dependent documentation changes. PowerShell and Git Bash each executed three isolated preflight fixtures (absent/directory/regular file) with a synthetic CLI marker: only the regular file invokes CLI, no absent source is created. [Optional AI instructions](../../../operations/docker.md#optional-operator-managed-ai) require that conditional host preflight and explicitly qualify the Docker flag. Valid existing-file mount checks remain applicable. No runtime entrypoint/API addition or actual credential access was needed.

## Judging evidence

- J1: actual research/specification, implementation, delegated acceptance, independent review, process checks and reused review/evidence skills; tracker tool routes will be named after execution.
- J2: synthetic learner workflows retain earlier effort/private control; no measured motivation, retention or mastery claim.
- J3: actual clean Linux builds, nonroot authenticated runs, full-data lifecycle and restore; operating guide documents prerequisites and limits. No human adoption inferred.
- J4: Docker setup can be a demo scene; the timed3–5minute video and final submission remain unfinished.

### Required verification and release preparation

The full required command completed with exit0 at15:01Africa/Lagos. It uses synthetic local test data and `CAPSTONE_AI_DISABLED=1`; provider tests inject mocks. Full logs remain ignored. Focused documentation validation passes15records/315relative links and anchors, preserving settled brief/LMS/D016 and prior history; staged whitespace and secret-pattern checks pass. Comments added to the optional override do not change its already tested mount behavior. DK01–DK07 are verified within their stated limits. DK08 awaits actual source/trackers saved readback and final documentary delivery.
