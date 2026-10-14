# First usable journey — P04/P05 implementation contract

7 October 2026, Africa/Lagos. Written before production source. The parent specification remains authoritative; this is an ordered increment, not removal of Comeback or peer StudyCircle.

## Goal

Make the selected Amber shell serve a real private learning journey: local account → reviewed, editable plan → study log → explicit completion → optional private reflection → retained progress after refresh/server restart. Establish P04 tooling and P05 behavior before P06/P07.

## Context Pointers

- [Specification](../spec.md): F01–F05/F10–F16, AC01–AC05/AC09–AC11f.
- [Research](../research.md): R01–R15 closed, including the [verified fixture](../experiments/runtime-feasibility/fixture.ts), its [report](../experiments/runtime-feasibility/REPORT.md), and the separately closed quality-tooling check.
- [Design](../design.md): user-selected Amber references, correct PanelLeftClose/PanelLeftOpen, light/dark and English/French shell.
- [Delivery plan](../plan.md): P04/P05 precede restart and peer implementation.

### Scoped research evidence and closure

| Need | Finding/evidence | Status |
| --- | --- | --- |
| Runtime, SQLite and maintained identity integration | R11 proves exact selected pins, native driver, Better Auth mounting before JSON parsing, migration/session compatibility. Product behavior still requires tests. | Satisfied |
| Plan/history/timezone semantics | F01–F05 specify active scope, immutable event snapshots, explicit completion, UTC events and seven local calendar dates. Concrete input bounds and HTTP shape below are implementation decisions. | Satisfied |
| Template wording and source coverage | R03/S04/S05; MDN English HTML lesson inspected again 7 October: structure, heading/paragraph, image/link and viewport. MDN [CSS: Styling the content](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Styling_the_content) inspected for the already-designed styling step. It teaches simple CSS rules; this plan links to lessons and supplies short original action prompts, not copied teaching content. Purpose, small-screen inspection and reflection are labelled project task suggestions. French source URLs supplied with localized original prompts. | Satisfied |
| UI/privacy/inclusion boundaries | R06/R07/R13/R14 and approved image-first references. No new external service, network curriculum fetching or browser learner-data store is needed. | Satisfied |
| Safe local secret/persistence implementation | Node exclusive file creation and existing-file read; generated 48-byte random secret remains in ignored data directory. SQLite WAL, foreign keys, bounded busy timeout and transactions reuse verified R11 primitives. Host/Origin validation is application policy, not an assumed framework guarantee. | Satisfied |

The domain/API needs above are satisfied. Immediately after this contract and serializable shared types were written, root reopened R15 for compatible quality tooling. Server/domain/frontend implementation was held until root documented R15 closure at21:02 Africa/Lagos; see [quality-tooling experiment](../experiments/quality-tooling.md). Implementation now proceeds against the closed gate. No passing application tests are claimed by that closure. Reopen the affected need if implementation exposes a consequential unknown.

## Constraints

### Architecture and quality contract

`src/shared/contracts.ts` carries serializable types/constants only. `src/domain/` contains pure validation, date/progress calculations and curated template metadata; it cannot import Express, SQLite, Better Auth or DOM. `src/server/` owns SQLite migration/repository transactions, auth and HTTP adapters. The client imports shared types and renders text safely. Server derives the account from the verified session; no client owner ID is accepted.

`createApp({dataDirectory, origin, clientDirectory?, clock?})` is asynchronous and returns `{app, close}`. `origin` must be an HTTP loopback origin (localhost or 127.0.0.1); the startup entrypoint binds 127.0.0.1. HTTP Host must match the configured host/port. Every unsafe request requires exact same-origin `Origin` and JSON content type; no permissive CORS. Auth is mounted before Express JSON parsing and retains Better Auth protections. Product responses are `Cache-Control: no-store`. CSP restricts scripts/connect/assets to self, disallows frames/objects; no external font/CDN/runtime requests are required. No passwords/cookies/reflections appear in logs.

Auth uses Better Auth `/api/auth/sign-up/email`, `/sign-in/email`, `/sign-out`, `/get-session`; email verification and recovery are unavailable. Registration returns no auto-session, so the client signs in after successful creation. Native password minimum is 8, maximum 128; display name is 1–80 and email max254. The app uses a generated persisted secret in `<dataDirectory>/auth-secret`; it never enters Git. SQLite is `<dataDirectory>/capstone.sqlite`. Foreign keys ON, WAL, busy timeout5000ms. Schema version1 is applied transactionally after maintained auth migrations. Unsafe schema changes fail startup. Root tooling excludes data/cache/build directories.

### HTTP and data contracts

All product routes except `/api/health` require a real session. JSON errors are `{error:{code,field?}}`; codes permit localized client text. Validation400, signed-out401, forbidden origin403, inaccessible/missing resource404, stale revision or idempotency conflict409, payload limit413, unexpected persistence failure500. Private IDs return404 to another account.

| Route | Body / response |
| --- | --- |
| GET `/api/health` | `{status:"ok"}`; no account/data metadata. |
| GET `/api/me` | `{user:{id,name,email},profile:{locale,timezone}|null}`. |
| PUT `/api/me` | `{locale:"en"|"fr",timezone:IANA}` → same me response. Timezone must be explicitly confirmed before plan creation; device guess is only a form suggestion. |
| GET `/api/templates` | `{templates: GoalTemplate[]}`: both locales, stable ID/version, source URLs/check date/prerequisites, ordered short suggested actions and estimates. |
| GET `/api/plans` | `{plans: LearningPlan[]}` for session owner, newest first, with active steps. |
| POST `/api/plans` | `CreatePlanInput`: requestId, goal, templateId nullable, availabilityDates, targetDate nullable, references, ordered steps. Returns201 `PlanDetail`. This is the explicit plan confirmation; no silent draft saves. |
| GET `/api/plans/:id` | `PlanDetail`: plan, full retained activities/completions/scope events, progress, nextStepId and conflicts. |
| PUT `/api/plans/:id` | `UpdatePlanInput`: expected revision and full active scope. Existing IDs are retained. Missing steps are archived; new steps get server UUIDs. Returns updated detail. Client confirms removals. |
| POST `/api/plans/:id/activities` | `{requestId,stepId,minutes,reflection?:string}`. Server UTC timestamp; separate from completion; optional reflection max2000. Returns updated detail. |
| POST `/api/plans/:id/completions` | `{requestId,revision,stepId}`. Explicit whole-step completion, never inferred from minutes. Returns updated detail. Already-complete step is a409 unless retrying the same request. |

Bounds (routine local-PoC decisions): product-route JSON64KiB; auth retains its maintained parser and configured field limits; goal/title1–160 trimmed characters; step title1–240;0–50 active steps (creation requires1–50); estimates/minutes1–480 integers;1–366 unique availability dates; reference0–10 URLs of max2048; template ID null or `html-first-page@1`; valid calendar dates between2000-01-01 and2100-12-31. Date ordering is learner-controlled; conflicts report an unavailable step date or date beyond fixed target, without silently shifting it. Goal/manual content remains plain text. URLs allow absolute HTTP(S) only, no username/password. Unsupported template IDs fail and the UI offers supplied/manual topics. Template choice does not bypass editable draft review.

Client-generated requestId is a UUID. A request replay with the same owner/key/operation/canonical body returns its saved response without duplicating work; reuse with different content returns409. Writes execute synchronously within one SQLite transaction. Creation, activity, completion and plan-update operations all use request IDs. Plans start revision1; each update/completion increments revision. Stale update/completion rejects409. Activities append without mutating plan revision and remain valid concurrent with plan reads; archived step IDs reject new activity.

Completed step title/date/estimate are immutable in subsequent scope edits; such edits reject409. Explicit removal archives that step; completion/activity snapshots remain intact. Activity records snapshot step title and UTC creation time with learner-reported minutes and optional private reflection. Completion records snapshot title/date/time; scope events preserve old/new active counts. No arbitrary client timestamp or mastery assertion is accepted.

Progress includes current completed/total counts (empty fraction is0), cumulative completion count including archived work, cumulative activities/minutes, and last-seven-calendar-day dates/count/timezone calculated from UTC activity timestamps. Completion alone is not study activity. No streak reset or failing-day status. Next action is first unfinished active step by learner order; null when all complete or empty. Template content is saved as learner-editable plan text and never changes when UI language changes.

Profile locale/timezone changes update the plan presentation/calculation preferences without incrementing its schedule revision or translating stored learner text. This preserves an open editor’s valid revision while language changes; future transactional scope edits read the current stored preferences. Stored UTC activity timestamps and scheduled calendar dates never move during a preference change. The auth limiter remains enabled, including Better Auth’s pinned default3 sign-up/sign-in requests per10seconds; tests must space or reuse accounts rather than disabling it.

### Ordered implementation and checks

1. Shared typed contract; pure validators/calendar/progress/template source record.
2. SQLite/auth application factory and schema; validated, authorized transactional routes.
3. Amber client sign-in/profile/draft/review/study/progress states against the API.
4. Meaningful domain and HTTP tests, then root browser/independent review. Root owns tooling and required exact script commands: `pnpm run check`, `pnpm run lint`, `pnpm run format:check`, `pnpm run build`, `pnpm test`, `pnpm run test:e2e`, `pnpm run audit`. R15 established pnpm availability; npm is unavailable in the bundled runtime. Node tests compile to `.local/test-build/tests/{domain,server}`.

Domain checks: impossible/leap dates, unsafe/credential URLs, invalid timezones, distinct local dates at UTC midnight and DST, empty/all-complete scope, archive-retained progress. HTTP checks: anonymous/cross-account denial, wrong-origin/Host rejection, persistent auth secret/session/data, malformed/oversize payloads, stale edits, repeated/conflicting request IDs, activity-versus-completion, skipped/private reflection and history after scope removal. Do not call a same-process DB reopen a process-restart check. Root separately checks actual browser theme/drawer/locale/input preservation and process restart/disconnection.

## Done When

The root can run the local app using committed documentation, sign in, explicitly confirm locale/timezone and a reviewed plan, log study with optional reflection, explicitly complete a step, edit future scope with retained history, and refresh without lost saved progress. Applicable scripts and meaningful domain/HTTP/browser checks have actual recorded outcomes and independent review findings are addressed. this private repository and activity trackers are reconciled by root. P06/P07 and full-capstone acceptance remain separately open until implemented and verified.

### Server/domain increment check record

Executed against the uncommitted first-journey source on7 October2026:

| Check | Actual result | Limit |
| --- | --- | --- |
| `pnpm exec tsc -p tsconfig.server.json` | Passed after correcting the initial auth-handler call from3 arguments to the actual2-argument Node adapter signature. | Compiler evidence only. |
| `pnpm exec tsc -p tsconfig.tests.json` | Passed. | Does not establish frontend/build behavior. |
| `node --test .local/test-build/tests/domain/journey.test.js .local/test-build/tests/server/journey.test.js` | Final20/20 passed:10 domain cases,9 HTTP journey subtests and their parent test. | In-process server/database reopen; no separate-process, machine-restart, browser or internet-disconnection claim. |
| `pnpm exec biome lint --error-on-warnings src/shared src/domain src/server tests/domain tests/server` | Passed,9 files checked. | Scoped files only. |
| `pnpm exec biome format --write src/shared src/domain src/server tests/domain tests/server` | Applied formatting; follow-up format check belongs to root aggregate verification. | Formatting is not behavioral verification. |

Initial HTTP run had18 passes/2 failures (one failed nested assertion plus parent) because Node Fetch normalized an attempted hostile Host header and sent the valid host. The corrected test uses raw Node HTTP to actually transmit the hostile host, preserving the expected403 assertion; final run passed. No production Host check was weakened. Independent quality feedback found locale changes incrementing plan revision; fixed before final run, with a test checking retained revision and unchanged UTC history after locale/timezone changes. Root browser checks and independent review remain separately recorded.
