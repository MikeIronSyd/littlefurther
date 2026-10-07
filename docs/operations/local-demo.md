# Running the local proof of concept

## Goal

Run the capstone on this PC with local accounts and SQLite. This guide belongs to the P04/P05 increment. Verification results are recorded separately; commands below do not claim a passing run by themselves.

## Context Pointers

Use the repository root, package.json, the single pnpm-lock.yaml, and [first-journey contract](../specs/capstone/increments/first-journey.md). Exact tested runtime/tooling is recorded in [R11](../specs/capstone/experiments/runtime-feasibility/REPORT.md) and [R15](../specs/capstone/experiments/quality-tooling.md).

## Constraints

### Prerequisites and start

Use Node24.19.0 and pnpm11.19.0. Installation needs internet or an already populated compatible package cache. Commands use pnpm because npm is not installed in this Codex runtime.

```powershell
pnpm install --frozen-lockfile --ignore-scripts
pnpm run build
pnpm start
```

Keep that terminal running. Open the URL printed by the server (default http://127.0.0.1:4317). Stop it using Ctrl+C. This serves the built assets; after editing source, stop, rebuild and restart. No browser CDN/font/runtime AI or external database is required.

Choose a fresh local account and synthetic demo content. The email is a login identifier, not a verified mailbox. This prototype sends no emails and provides no password-reset service. Confirm an explicit timezone before creating a plan. External learning-reference sites still require internet.

### Local files and configuration

CAPSTONE_PORT selects another available loopback port. CAPSTONE_DATA_DIR selects the data directory; the default is .local/data relative to the repository root. The startup process prints only its URL, not account details or secrets.

The data directory contains capstone.sqlite, its temporary SQLite WAL/SHM files, and auth-secret. The server creates and then reuses the secret; changing or losing it invalidates sessions. These files are excluded from Git. Do not commit them or copy them into a public folder.

For a fresh isolated demonstration, stop the server and start it with a different empty CAPSTONE_DATA_DIR. Keep the previous folder intact. There is no automatic destructive reset command. To return to an older demo, stop and point the server at its previous directory. Never run two independently configured servers against the same data directory.

Canonical learner records remain in SQLite. Browser localStorage contains only validated theme/sidebar preferences. Local persistence is not encrypted storage or remote synchronization. The server must remain running; this is not server-stopped offline mode.

### Verification commands

```powershell
pnpm run check
pnpm run lint
pnpm run format:check
pnpm run build
pnpm test
pnpm run verify:process
pnpm run test:e2e
pnpm run audit
```

pnpm run verify executes the same checks in sequence and stops at failure. pnpm run format applies formatting only to maintained application files/configuration, not preserved research evidence or mockup provenance.

Browser tests use installed Microsoft Edge through Playwright's msedge channel, a separate test server on4318 and .local/e2e-data. Test accounts/data are synthetic and use unique identifiers. Reports/traces remain under .local. No bundled-browser or Firefox/WebKit coverage is implied.

[The prepared GitHub workflow template](github-quality-workflow.yml) is manual-only and deliberately stored outside `.github/workflows`. The current OAuth login cannot create workflow files; both repositories rejected the first attempt, leaving their previous heads intact. Activating this template requires authorized workflow-capable access and checking the owner's included runner budget. It uses read-only repository permissions and pinned official checkout/setup-node action revisions. No hosted workflow or enforced branch protection is active, and no paid service was enabled. All local commands above remain runnable. Official sources checked7October: [manual workflows](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow), [checkout metadata](https://raw.githubusercontent.com/actions/checkout/v6/action.yml), [setup-node metadata](https://raw.githubusercontent.com/actions/setup-node/v6/action.yml).

### Limits and recovery

The current increment targets private planning/study/progress; Comeback and peer-circle functionality remain later implementation work until their acceptance records say otherwise. All five remain capstone requirements.

A failed save must remain visible with entered content retained. If the server cannot start, check the printed error and port, and preserve the data directory before any repair. Source rollback uses an earlier reviewed Git revision plus that revision's locked dependencies. Database schema migration/rollback must be checked independently; changing source is not a database restore.

Public hosting, TLS deployment, verified email/recovery, distributed peers, encrypted backups, production observability/moderation and broad device/language validation are outside this local milestone.

## Done When

A user can install from the documented prerequisites, build, start the server, create a local account and reviewed plan, save study/progress and return after reload/restart with data retained. Actual outcomes, failures and remaining criteria belong in the increment verification record; do not infer them merely from this guide.
