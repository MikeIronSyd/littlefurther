# R11 isolated runtime feasibility — 7 October 2026

## Goal

Determine whether the selected local Node/TypeScript/Express/Better Auth/SQLite/Vite stack works on this Windows PC before production implementation. This is synthetic research, not application acceptance testing.

## Context Pointers

- Final machine-readable outputs: `verification.json` (commands, exit codes and source hashes), `latest-result.json` (all 35 fixture assertions), and `check-logs/` (four final command logs).
- Reproduction inputs: `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `fixture.ts`, `vite.config.ts`, `web/index.html`, `web/main.ts`, and `run-checks.ps1`.
- Official references checked 7 October 2026: https://better-auth.com/docs/integrations/express (ESM, Express 5 named wildcard and middleware order); https://better-auth.com/docs/concepts/database (programmatic migration API); https://better-auth.com/docs/adapters/sqlite (direct better-sqlite3 adapter); https://better-auth.com/docs/authentication/email-password (email/password enablement, sign-up/sign-in/sign-out); https://better-auth.com/docs/reference/security (origin/callback checks and cookie settings).
- Installed source inspected: Better Auth `dist/types/init-options.d.mts` imports `bun:sqlite`; official `bun-types/sqlite.d.ts` provides that ambient module without requiring the unrelated Bun global declarations. Better Auth telemetry source was inspected and telemetry explicitly disabled in the fixture.

## Constraints

- All files reside in the existing ignored `.local/research/runtime-check/` directory. `git check-ignore` confirmed exclusion. No production files were changed.
- Synthetic `example.invalid` accounts only. Test password and auth secret are randomly generated in memory. No password, secret, session cookie or token is printed in reports/logs.
- Server binds only to `127.0.0.1` on an OS-assigned port. The `finally` block closes server and database; final readback confirms both closed.
- No email sending, paid services, public hosting, runtime AI, browser UI evaluation or external tracker actions. Dependency downloads were the only intentional non-loopback network activity. No dependency lifecycle scripts were enabled.
- Fixture SQLite files under `runs/` contain disposable synthetic authentication state. Do not copy these databases or generated folders into source control. A source-only reproduction can preserve the eight inputs listed above plus safe reports/logs.

## Done When — achieved for this research scope

Final consolidated run completed at 16:57 Africa/Lagos, 7 October 2026. All four recorded commands exited 0; all 35 HTTP/SQLite assertions passed. This closes the tested local runtime feasibility questions, not the broader product implementation or acceptance criteria.

Environment: Windows `10.0.26300`, x64; PowerShell `7.6.5`; Node `24.19.0`; pnpm `11.19.0`.

Exact direct dependency pins:

| Runtime packages | Version |
| --- | --- |
| express | 5.2.1 |
| better-auth | 1.7.7 |
| better-sqlite3 | 13.0.3 |
| SQLite engine reported by native driver | 3.53.4 |

| Development packages | Version |
| --- | --- |
| typescript | 7.0.2 |
| vite | 8.3.3 |
| @types/node | 24.19.1 |
| @types/express | 5.0.6 |
| @types/better-sqlite3 | 9.6.0 |
| bun-types | 1.4.2 |

The compiler uses `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noEmitOnError`, NodeNext ESM and only `node` / `bun-types/sqlite` ambient type entrypoints. `skipLibCheck` is absent, so dependency declarations are checked. The Bun package is a declaration dependency only; the fixture executes with Node and better-sqlite3. No handwritten type shim or diagnostic suppression was introduced.

Final commands (working directory is this fixture; executables and complete arguments are preserved in `verification.json`):

| Command | Exit | Actual result |
| --- | --- | --- |
| `pnpm install --frozen-lockfile --ignore-scripts --reporter=append-only` | 0 | Lockfile accepted; installed dependencies up to date. This is not a clean-machine install test. |
| `pnpm exec tsc -p tsconfig.json` | 0 | Strict compilation of HTTP/auth fixture, Vite configuration and native browser TypeScript module. |
| `node compiled/fixture.js` | 0 | 35 assertions passed; server stopped and SQLite closed. |
| `pnpm exec vite build` | 0 | Native browser ES-module fixture bundled: HTML 0.24 kB, JS 0.77 kB; no UI framework included. These sizes are fixture output, not product budget measurements. |

Invoke the same sequence with `./run-checks.ps1`. Its optional `-Node` and `-Pnpm` parameters allow explicit executable paths on another machine; defaults point to this PC's bundled runtime. It records logs and SHA-256 hashes and stops on a nonzero check result.

Observed HTTP/SQLite behavior:

- Native driver loads; WAL mode works; transaction commit persists a row and an intentional exception rolls back a second insertion.
- Better Auth's programmatic migrations apply cleanly and a repeated migration plan has no pending tables, columns or indexes.
- Express 5 `/api/auth/*splat` handler works before `express.json()`, with `/api/auth/ok` returning 200.
- Two separate synthetic accounts register and sign in, receive distinct sessions, and remain explicitly `emailVerified: false`. Both authenticate to a minimal fixture-only private endpoint; anonymous access returns 401.
- Session cookies carry HttpOnly and SameSite=Lax. Short password returns 400; wrong password returns 401. Untrusted sign-up origin, untrusted authenticated sign-out origin and untrusted callback URL return 403. Rejected malicious-origin logout leaves the session usable.
- Closing server and database and reopening both against the same file retains the committed row and both authenticated sessions. This is a server/connection restart within one Node process, not a process or machine reboot.
- Authorized logout succeeds, reuse of that original cookie returns 401, and the second account's session remains valid.

Discovery failures and resolution are retained rather than hidden:

1. Initial `pnpm exec tsc -p tsconfig.json` exited 1: Better Auth's type declaration could not resolve `bun:sqlite` (TS2307). The initially emitted JavaScript did execute all 35 fixture assertions, but that did not count as compiler success.
2. Adding `@types/bun@1.4.2` and loading full Bun ambient types still left strict compilation at exit 1: TS2694 for `node:util.TextEncoderEncodeIntoResult`, TS2552 for `ConnectionOptions` and `KeyObject`, and TS2304 for `TLSSocket` in unrelated Bun global declarations.
3. Replaced the full ambient entrypoint with pinned official `bun-types@1.4.2`, compiler `types: ["node", "bun-types/sqlite"]`. Strict compilation passed. Removed the unnecessary `@types/bun` direct dependency from the manifest and regenerated the lockfile with scripts disabled.
4. An attempted `pnpm remove --save-dev --ignore-scripts @types/bun --reporter=append-only` was rejected because pnpm's remove command does not accept `--ignore-scripts`. Its individual exit code was not captured; the enclosing shell command ended 0 after a separate successful add. The manifest edit and subsequent `pnpm install --ignore-scripts` resolved cleanup; the final frozen install/compile/fixture/build all independently exited 0.

Material limits: no final product UI, learning workflow, peer-circle authorization, accessibility, localization quality, browser cookie behavior, disconnected-internet journey, recovery UX, real learner adoption or performance target was verified. Persistent product auth-secret management remains an implementation requirement; this experiment deliberately kept its secret in memory. No email delivery or verified-email identity claim is made. Native driver/build results apply to this Windows x64 runtime; other platforms remain untested.

SHA-256 of final manifest: `8bd3cbef0cf99a8006ecc17be92027652d55164c59048fb0a6e64af0ec78389a`.

SHA-256 of final lockfile: `73f5b51a8320993033be604a3ba14d94ba8bb9040052bbcb587cb44e4be82833`.

All eight input hashes and timestamps are preserved in `verification.json`. No Git publication or recovery checkpoint was performed by this delegated experiment.
