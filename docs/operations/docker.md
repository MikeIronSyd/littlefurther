# Run LittleFurther with Docker

## Goal

Build and run the local app from a repository clone without installing Node or pnpm on the host. Docker manages the Linux runtime; your browser stays on this computer.

## Context Pointers

Install/start Docker Desktop with Linux containers, or a Linux Docker Engine28+ with Compose. Repository access and Git are needed to clone. Initial image/dependency downloads require internet and disk space. [Docker verification](../specs/capstone/increments/docker-verification.md) records actual platforms and limits.

## Constraints

### Start and create your account

From the cloned repository root:

```bash
docker compose up --build -d
docker compose ps
```

Open **http://127.0.0.1:4317**, create an account and follow the [learner guide](../USER_GUIDE.md). Wait for healthy status; use `docker compose logs --tail=50 app` if startup fails. Use the exact127.0.0.1 address because authentication/request protection use that canonical origin. No AI key is required for manual planning, study, progress, Comeback or circles.

This starts with fresh container records. One named volume holds SQLite, WAL/SHM files and `auth-secret`; existing PC `.local/data` is not imported or mounted. The default project is `littlefurther`, normally with volume `littlefurther_learning-data`. Keep the project name consistent across commands. Separate clones using that name share this Docker installation's resources; use `docker compose -p another-name ...` and another port for an intentionally separate instance.

The app runs as nonroot. Only host127.0.0.1 is published; `CAPSTONE_BIND_HOST=0.0.0.0` enables routing inside the container. Do not change host mapping to0.0.0.0 for remote peers. Docker administrators and containers on the same network have access to container networking; this is a local proof of concept.

### Alternate port

If4317 is occupied, choose an integer1024–65535. One `CAPSTONE_PORT` controls equal host/container ports, preserving Host/Origin checks.

PowerShell:

```powershell
$env:CAPSTONE_PORT = '4320'
docker compose up --build -d
```

Bash:

```bash
CAPSTONE_PORT=4320 docker compose up --build -d
```

Open `http://127.0.0.1:4320`. Keep the setting for later commands, or put `CAPSTONE_PORT=4320` in an ignored root `.env`; never put keys there. Changing port changes origin, so sign in again if needed. Native startup still defaults to127.0.0.1; bind config accepts only127.0.0.1 or0.0.0.0 and does not change canonical origin.

### Logs, stop and restart

```bash
docker compose logs --tail=50 app
docker compose stop
docker compose start
docker compose restart app
docker compose down
docker compose up -d
```

`stop` preserves container/volume. `down` removes containers/network and preserves records; `up` recreates with the same volume. SIGTERM reaches Node directly and closes the existing server/database. Never add `--volumes`/`-v` to `down` unless deliberately deleting all records and the authentication secret. Prune is not an update/reset procedure.

After building, the manual app works without internet while Docker/the server run. AI, search and external pages need internet. No server-stopped offline use, remote-peer access or cross-device sync is provided.

### Optional operator-managed AI

Use the existing ignored `.local/ai-provider.env` with an operator's `OPENAI_API_KEY`, as in [native setup](local-demo.md). Never print the key, paste it into commands/chat, put it in frontend variables or commit it. Ensure the existing file is readable by container UID1000; on Linux grant only appropriate read access, never world-writable access.

Check that the file already exists before invoking the override. PowerShell:

```powershell
if (Test-Path -LiteralPath '.local/ai-provider.env' -PathType Leaf) {
  docker compose -f compose.yaml -f compose.ai.yaml up --build -d
} else { throw 'Create the ignored AI credential file before enabling AI.' }
```

Bash:

```bash
test -f .local/ai-provider.env && docker compose -f compose.yaml -f compose.ai.yaml up --build -d
```

The preflight refuses missing files/directories before Compose runs. The override mounts an existing file read-only and does not copy it into the image or data volume. Docker Desktop can create an absent source directory despite `create_host_path:false`; do not bypass the preflight. These checks do not grant read permissions: ensure UID1000 can read the file. Keep both `-f` arguments when operating with AI and repeat the existence check before `up`. Return to keyless mode by recreating with base Compose:

```bash
docker compose -f compose.yaml up -d --force-recreate
```

No BYOK screen, retry/model fallback, purchase or top-up is added. `store:false` is not zero retention. Sponsor balance/settings are not verified by Docker startup. Packaging tests use synthetic credentials/responses and make no live provider requests.

### Stopped backup and restore

Backups contain private records and authentication secrets. Keep them outside Git, protect them and retain a separately accessible copy. These commands do not encrypt them. Stop the app first; never have two servers writing the same directory.

Create `.local/backups` (`New-Item -ItemType Directory -Force .local/backups` in PowerShell; `mkdir -p .local/backups` in Bash), then:

```bash
docker compose stop app
docker compose run --rm --no-deps --user root --entrypoint tar -v ./.local/backups:/backup app -czf /backup/littlefurther-data.tar.gz -C /app/.local/data .
docker compose start app
```

Use a fresh filename each time to preserve recovery points. Copy the complete directory, including `auth-secret` and any WAL/SHM files; copying only SQLite can lose recent writes or invalidate sessions.

Restore only to a **new empty** project volume. Stop the original app and use `-p littlefurther-restore` consistently; the old/restored instances must not compete for a port. Use the backup's image/source revision and port setting. This guard refuses nonempty destinations:

```bash
docker compose -p littlefurther-restore run --rm --no-deps --user root --entrypoint sh -v ./.local/backups:/backup:ro app -c 'test -z "$(ls -A /app/.local/data)" && tar -xzf /backup/littlefurther-data.tar.gz -C /app/.local/data && chown -R node:node /app/.local/data'
docker compose -p littlefurther-restore up -d
```

If the guard refuses, preserve that volume and choose another project name. A failed extraction can leave a partial destination; check the archive and use another empty volume, preserving the failed state. Verify sign-in, plans and history before resuming.

For optional PC migration, stop the native server, archive its complete `.local/data` with a trusted local archiver, then use the same empty-volume restore. Leave the original folder untouched. Windows SQLite files are portable; restoration must set node:node ownership. Rehearse with synthetic data before migrating ordinary records. No automatic migration occurs.

### Update and rollback

Stop and back up first, update source through the authorized Git workflow, then:

```bash
docker compose up --build -d
docker compose ps
```

Use both `-f` arguments if AI was enabled. Node24.19.0 is pinned to a multi-platform digest; pnpm11.19.0 and the frozen lockfile install inside Linux. Rebuild after source/lock edits. Security/runtime updates need reviewed pin/lock changes and verification; pulling cannot change a pinned digest.

Rollback uses the earlier reviewed source/Dockerfile/lockfile and stopped data backup from that revision. Source rollback does not undo schema migrations. Preserve the failed state, restore into an empty volume and verify before replacing a working instance.

## Done When

The app is healthy, the canonical URL opens and a learner can sign in and use manual workflows. This guide is a procedure; [executed evidence](../specs/capstone/increments/docker-verification.md) identifies tested platforms/lifecycle checks. No project-image registry publication, hosting or CI activation is needed.
