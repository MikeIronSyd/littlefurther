# Docker clone-and-run

## Goal

Start LittleFurther from a repository clone using `docker compose up --build -d`, without a host Node/pnpm installation. Preserve the local private learning journey and optional operator-managed AI. This increment supports J3 reproducibility; packaging alone does not establish adoption or learner outcomes.

## Context Pointers

User-approved scope: local image builds, no registry/hosting/CI activation. Existing stack is Node24.19.0, pnpm11.19.0, Express/Better Auth and better-sqlite3 13.0.3. Inspect `src/server/index.ts`, `src/server/app.ts`, `package.json`, `pnpm-lock.yaml`, [local operations](../../../operations/local-demo.md), [architecture](../../../ARCHITECTURE.md) and [verification](docker-verification.md). Baseline before this increment: `85c05ec`.

Primary sources reviewed14October2026: [multi-stage builds](https://docs.docker.com/build/building/multi-stage/), [loopback port publishing](https://docs.docker.com/engine/network/port-publishing/), [named volumes and stopped backups](https://docs.docker.com/engine/storage/volumes/) and [Compose file merging](https://docs.docker.com/compose/how-tos/multiple-compose-files/merge/).

### Research gate R38

| Need | Status / evidence |
| --- | --- |
| Actual engine/platform/tool support | Verified read-only: Docker Desktop4.93.0, Engine29.8.1 LinuxAMD64, Compose5.5.1, Buildx0.37.1; available ARM64 emulation. |
| Exact base and package compatibility | Manifest verified: `node:24.19.0-bookworm-slim@sha256:a9f5f7c91a432850b2a8a7797adf5eadb6c733ceed61167806cee7ea7fbc29df` includes AMD64/ARM64. Isolated LinuxAMD64 frozen full/prod installs with pnpm11.19.0 and `--ignore-scripts`, TypeScript/Vite builds and SQLite3.53.4 loading passed. No compiler/install-hook workaround needed. |
| Linux compiled app/auth startup | Verified isolated LinuxAMD64 image with direct Node: health200, signup/signin, authenticated French profile and disabled-AI status; source-copy listener experiment only. |
| Nonroot fresh volume, SQLite and secret ownership | Verified unique research volume: uid/gid1000, writable SQLite, node-owned data and mode0600 auth-secret. Session/secret survived SIGTERM exit0 and container recreation. Ordinary data untouched. |
| Config/network/privacy boundaries | Verified code: canonical127.0.0.1 origin, strict Host/Origin middleware, health endpoint, persistent complete data directory, disable flag before key loading, graceful signals. Introduce only an explicit bind address. |
| Repeatable acceptance harness | Existing HTTP/process and browser journey checks identified. Browser hard-coded4318 origins require an isolated container on4318 and an external test config, separate from native4317. |
| Recovery and credential path | Complete data directory must travel together, with server stopped and no competing writer. AI key is optional read-only runtime mount; no live requests. Actual synthetic restore and credential wiring remain acceptance checks. |

R38 closed14October14:31Africa/Lagos before production edits. All implementation research needs above are satisfied with code/source inspection and actual isolated Linux checks. Private experiment source/logs are under `.local/docker-research/`; final packaging/lifecycle/browser/restore/ARM64 checks remain acceptance work. The copied listener change was an isolated feasibility experiment, not production implementation. ARM64 emulation is distinct from native hardware testing. Reopen research for consequential new unknowns.

R38 reopened during acceptance for the optional missing-credential path: a synthetic absent-file mount unexpectedly created a host directory under Compose5.5.1/Desktop despite `create_host_path:false`. Valid synthetic AI wiring passed, but the promised absent-file guard needs an isolated correction experiment and documented closure before dependent production changes. No real credential was read or modified. Other accepted runtime checks remain evidence, not invalidated by this configuration gap.

Scoped R38 reclosed14October14:54Africa/Lagos before the documentation correction: effective Compose retains `create_host_path:false`, but Desktop creates the absent source; a file-backed Compose secret only warns and still starts, so it is not adopted. Actual isolated PowerShell and Git Bash conditional regular-file preflights each pass absent/directory/regular-file cases, refusing before the mocked CLI and creating no absent source. The supported operational procedure now requires that preflight; no unconditional Docker guarantee or new entrypoint/API is claimed. Valid existing-file read-only mount/mock-response evidence remains applicable.

## Constraints

### Quality contract and interfaces

- Preserve the current stack, frozen dependencies, app/schema/API/UI, authentication, owner authorization, privacy and both languages. No new package, registry, paid service or live AI request.
- Multi-stage Linux build: pinned image index above and pnpm11.19.0, frozen install inside Linux, compiled assets plus production dependencies only in final app directory. Do not copy host dependencies, sources/tests/docs, `.local`, credentials, Git or learner data into the image. Use a build-context allowlist.
- `CAPSTONE_BIND_HOST` accepts only `127.0.0.1` (native default) or `0.0.0.0` (Compose). Canonical origin remains `http://127.0.0.1:${CAPSTONE_PORT}`. Compose maps host127.0.0.1 only, with equal host/container ports. Invalid config fails before opening learner data.
- Direct Node PID1, nonroot `node` user, existing signal handlers and `/api/health`; named volume contains the complete DB/auth directory. No automatic reset/migration of PC data. Compose starts fresh independently of `.local/data`.
- Base Compose keyless; optional AI override mounts an existing `.local/ai-provider.env` read-only after the documented host regular-file preflight. Desktop's no-create flag alone is insufficient; never run the override with an absent source. No key in args, image layers, browser storage, logs or trackers. Synthetic wiring checks must block outbound provider traffic.
- Initial build needs internet. Subsequent manual operation requires the server/container running; external materials/AI need network. Linux image portability is not evidence of exhaustive host/device compatibility.
- Document stopped backup, restore into an empty volume, optional native-data migration, updates/rollback and alternate ports. Do not recommend destructive volume deletion as a normal stop/update command. Backups contain private records and auth secrets and stay outside Git.
- Preserve the authorized normal publication procedure. Verify the intended repository head.

### Acceptance criteria

| ID | Observable requirement / verification |
| --- | --- |
| DK01 | Clean LinuxAMD64 build/frozen install, native SQLite/auth startup; ARM64 emulated image/startup smoke labelled. |
| DK02 | Default native bind preserved; Docker loopback mapping, equal alternate ports, invalid bind rejection, foreign Host/Origin rejected. |
| DK03 | Nonroot fresh volume; synthetic plans/activity/Comeback/progress/circles/sessions and exact auth-secret hash survive stop, recreation and rebuild. |
| DK04 | Stopped synthetic complete-directory backup/restore retains DB, history, memberships, sessions and auth secret. |
| DK05 | Keyless manual use; fake read-only key enables status while outbound provider blocked; image/context/layers exclude private files and host dependencies. |
| DK06 | Health and graceful SIGTERM exit pass; English/French browser journey checks against container pass. |
| DK07 | Required `pnpm --pm-on-fail=download run verify`, scoped container tests and independent AC-linked review pass; docs reflect actual evidence/limits. |
| DK08 | Miva Sheet/Kaneo history preserved with saved readback; intended non-secret source normally published under the authorized owner and verified. |

### Implementation sequence

1. Close R38 with isolated Linux install/SQLite/startup/permissions evidence; retain exact logs privately and summarize here.
2. Add scoped bind config/process checks and Dockerfile/Compose/ignore/optional AI override.
3. Add Docker operations guide and concise links in existing developer/architecture/README records; no source reorganization.
4. Build clean source context and run unique-volume lifecycle/backup/security/AI-wiring/browser acceptance checks, then required native verification. Leave ordinary data/server intact.
5. Apply reusable independent review, resolve blockers, reconcile actual results/J1–J4/current records, update both trackers and perform separate normal repository delivery/readback.

## Done When

DK01–DK08 have actual criterion-linked evidence in [verification](docker-verification.md), research is closed before production implementation, no secrets/ordinary data were exposed or changed, and the intended source and activity destinations are read back. A timed video, submission, human adoption and educational effectiveness remain separate unfinished work.
