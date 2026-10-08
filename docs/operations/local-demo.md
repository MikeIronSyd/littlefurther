# Running the local proof of concept

## Goal

Run the capstone on this PC with local accounts and SQLite. This guide covers the P04/P05 private journey, P06 Comeback and P07 private circles. Verification results are recorded separately; commands below do not claim a passing run by themselves.

## Context Pointers

Use the repository root, package.json, the single pnpm-lock.yaml, and [first-journey contract](../specs/capstone/increments/first-journey.md). Exact tested runtime/tooling is recorded in [R11](../specs/capstone/experiments/runtime-feasibility/REPORT.md) and [R15](../specs/capstone/experiments/quality-tooling.md).

The [Comeback contract](../specs/capstone/increments/comeback.md) and [verification record](../specs/capstone/increments/comeback-verification.md) describe P06 behavior and its actual check status. P06 adds no dependency or schema migration.

The [StudyCircle contract](../specs/capstone/increments/studycircle.md) and [verification](../specs/capstone/increments/studycircle-verification.md) describe P07. It adds an atomic v1→v2 migration for circles, members, hashed invitations, shared copies, encouragement and minimal retry receipts; existing private records remain separate. No dependency was added.

## Constraints

### Prerequisites and start

Use Node24.19.0 and pnpm11.19.0. Installation and exact-version provisioning need internet or an already populated compatible package cache. Commands use pnpm because npm is not installed in this Codex runtime. Check both versions from the repository root; a bundled pnpm 11 launcher may disable package-manager selection, so these commands explicitly request the package.json pin:

```powershell
node --version
pnpm --pm-on-fail=download --version
pnpm --pm-on-fail=download install --frozen-lockfile --ignore-scripts
pnpm --pm-on-fail=download run build
pnpm --pm-on-fail=download start
```

Keep that terminal running. Open the URL printed by the server (default http://127.0.0.1:4317). Stop it using Ctrl+C. This serves the built assets; after editing source, stop, rebuild and restart. No browser CDN/font/runtime AI or external database is required.

Expected versions are `v24.19.0` and `11.19.0`. The pnpm option changes only that invocation; it does not edit global wrappers/settings or package.json. On this Windows host the unqualified bundled launcher reported11.25.0; the explicit option provisioned and ran11.19.0. See [pnpm's documented selection behavior](https://pnpm.io/settings/cli#pmonfail) and the [P10 rehearsal contract](../specs/capstone/increments/reuse.md). Use this prefix for subsequent pnpm commands when required. If Ctrl+C prompts to terminate a Windows batch job, confirm termination, then verify the printed port has no listener before starting a replacement.

The repository's `.gitattributes` fixes maintained formatter inputs to LF even when Windows Git uses `core.autocrlf=true`; preserved source/history retains its existing `-text` rules. A fresh checkout should pass format without editing files. If an older checkout fails solely on CRLF, first preserve all local changes and inspect `git ls-files --eol`; verify the corrected revision in a separate fresh checkout. Do not change global Git settings or bulk-format historical material to conceal the failure.

Choose a fresh local account and synthetic demo content. The email is a login identifier, not a verified mailbox. This prototype sends no emails and provides no password-reset service. Confirm an explicit timezone before creating a plan. External learning-reference sites still require internet.

For Comeback, open a plan with unfinished steps and choose **Review restart dates**. Edit the suggested date and explicitly request a preview. Check old/new dates and any conflicts; cancel leaves the plan untouched. Applying a nonzero change moves only unfinished dates, keeping their order/spacing and preserving completed work, private history, availability and fixed targets. The interface requires acknowledgement of visible conflicts; zero-day previews need no application. Five-minute study is logged separately and never completes the step automatically.

For circles, **Open study circles** works with or without a plan. Create a named circle, open **Invitations** and create a code. Copy it while visible; the server stores only a hash and cannot recover the raw code. A second local account in a separate browser session pastes the code under **Join a circle**. Possession permits one new membership before the fixed24-hour expiry; only the owner creates/revokes unused invitations. This demonstrates separate local identities, not remote connectivity.

Members use **Write a shared copy** to type a commitment/check-in and preview the normalized copy, audience and exclusions before explicit sharing. No private text is copied automatically. Current and future members can read retained copies and add one replaceable preset encouragement per copy. Later private-plan edits do not change the shared text. Deleting an own copy removes its attached encouragement. Leaving or owner removal deletes that member's shared copies and attached encouragement, plus encouragement they sent on others' copies. Closing removes all circle membership/copies/encouragement and invalidates unused invites. All retain private study history. Already-seen information cannot be recalled; access is denied on the next request.

Demo bounds: five active circles per account, ten members including owner per circle,100 retained shared copies, ten active unused invitations,80-character names and280-character shared text. No free-text chat or background polling.

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

The current implementation covers private planning/study/progress, Comeback preview/confirmation and optional private StudyCircle peers. All five capabilities remain connected parts of the capstone. The [P08/P09 integration review and corrections](../specs/capstone/increments/integration-verification.md) passed their scoped checks. The [P10 independent setup/adaptation rehearsal](../specs/capstone/increments/reuse-verification.md) has scoped evidence on the existing Windows host; formal design completion and the timed demo remain open; implementation status does not replace acceptance and review evidence.

A failed save must remain visible with entered content retained. If a Comeback confirmation loses its response, it may already have saved: use the offered retry with the same request identity or return and refresh. Do not assume cancel can undo an uncertain save. A stale preview requires a new preview against the current revision and is never applied automatically. If the server cannot start, check the printed error and port, and preserve the data directory before any repair. Source rollback uses an earlier reviewed Git revision plus that revision's locked dependencies. Database schema migration/rollback must be checked independently; changing source is not a database restore.

Public hosting, TLS deployment, verified email/recovery, distributed peers, encrypted backups, production observability/moderation and broad device/language validation are outside this local milestone.

For an uncertain circle action, use **Retry the same action** or **Check saved information**. Exact retries reuse the request identity. A lost invitation-creation response cannot reveal the original raw code again: inspect active invitations, revoke the unused one and create another. A known-saved action with failed readback offers GET-only refresh. A missing target during retry refreshes current information without claiming saved action or lost membership. Never treat navigation away as undoing an uncertain write.

The v2 migration is additive and tested for populated-v1 preservation/rollback; newer or noncontiguous schema versions fail clearly. Source rollback to P06 cannot read v2. Before a separately authorized data restore, stop the server and preserve the complete current data directory including auth-secret; restore a matching whole pre-migration directory into a separate location and point the earlier source there. Do not drop circle tables or overwrite live data to roll back. Project databases never go to CodexRecovery or Git.

## Done When

A user can install from the documented prerequisites, build, start the server, create local accounts and a reviewed plan, save study/progress, explicitly preview/apply a restart schedule, voluntarily share a private-circle copy and return after reload/restart with data retained. Actual outcomes, failures and remaining criteria belong in the increment verification record; do not infer them merely from this guide.
