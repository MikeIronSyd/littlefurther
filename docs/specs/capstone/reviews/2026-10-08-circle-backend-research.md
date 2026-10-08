# P07 StudyCircle backend integration research

8 October 2026, Africa/Lagos. Source baseline supplied by root: `e519d10f0391f8acd06c7d57aad5caf59df58dbf`. This report records source inspection and an isolated in-memory feasibility probe, not application implementation or passed P07 acceptance.

## Goal

Determine the exact integration needed for invitation-only local circles, explicit shared copies, preset encouragement and lifecycle cleanup. Preserve private plans/history, real-session authorization, bounded inputs, repeatable writes and the selected local runtime. Wait for the combined research gate and root's contract before production edits.

## Context Pointers

- [Specification F08–F12, AC07–AC10](../spec.md), [P07 plan](../plan.md), [research R06/R11/R16](../research.md), [Comeback contract](../increments/comeback.md) and [current verification](../increments/comeback-verification.md).
- [HTTP/auth adapter](../../../../src/server/app.ts), [migration/store/receipts](../../../../src/server/store.ts), [shared types](../../../../src/shared/contracts.ts), [validation](../../../../src/domain/validation.ts), [journey HTTP tests](../../../../tests/server/journey.test.ts) and [Comeback HTTP tests](../../../../tests/server/comeback.test.ts).
- `project-context.json` and `AGENTS.md` establish the retained Track 2 scope, local loopback delivery and two separate real account sessions. No mail, remote peer demonstration, public hosting, runtime AI or full chat is in scope.
- Primary documentation checked on 8 October: [better-sqlite3 transaction API](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#transactionfunction---function), [SQLite foreign keys](https://www.sqlite.org/foreignkeys.html), [Node 24 crypto](https://nodejs.org/docs/latest-v24.x/api/crypto.html#cryptorandombytessize-callback). The installed dependency set remains pinned; online documentation is supporting evidence, not a dependency update.

### Backend research checklist

| Need | Status | Verified finding and evidence | Unresolved fact |
| --- | --- | --- | --- |
| Scope and lifecycle authority | Satisfied | F08/F09 already require explicit shared copies, owner invite control, leave/removal/closure and cleanup. These decisions do not require new user selection. Root delegated backend integration only. | None. |
| Auth/session and identity integration | Satisfied | `app.ts` initializes Better Auth before application migration, exposes only five auth endpoints, then protects `/api` with `getSession`. Identity comes from `response.locals.user`; caller user IDs are never authority. Auth configuration does not select UUID generation, while existing `identifier()` accepts only UUIDs. Use new application UUID membership IDs publicly rather than assuming Better Auth identity format. | None. |
| HTTP security and error contract | Satisfied | Exact loopback Host, same Origin for mutations, JSON requirement, 64 KiB body limit, `no-store`, CSP, no-referrer and existing generic error serialization apply to new routes. `DomainError` emits only code/optional field. Place new routes below auth middleware and before the final `/api` 404. | None. |
| Current migration behavior and upgrade need | Satisfied | `migrate()` currently permits only version 1, returns when its row exists and creates seven private-journey tables in an immediate transaction on fresh DB. P07 requires explicit ordered additive v1→v2 migration and rejection of unknown/noncontiguous versions. Preserve private tables and existing rows. | None. |
| Transaction/FK primitives | Satisfied | Connection enables WAL, foreign keys and 5000ms busy timeout. Driver synchronous immediate transactions commit on return and roll back on throw; no async callback is safe inside them. SQLite cascades can remove copies and encouragement through membership FKs. The isolated ten-assertion probe below passed actual installed SQLite 3.53.4. | None. |
| Existing receipt suitability | Satisfied | `JourneyStore.write()` stores full `PlanDetail` JSON under `(owner_id,request_id)` and replays before `action()`. Circle permissions/lifecycles differ: reusing it unchanged could return stale feed or token content after membership removal. Keep the private journey helper unchanged and provide minimal circle receipts plus permission checks before replay. | None. |
| Invite generation/storage | Satisfied | Installed Node crypto supports existing SHA256/randomUUID usage and randomBytes is already used for auth secret. A 32-byte random value creates a 43-character base64url token; store only SHA256 hex plus lifecycle metadata. Token format/hash probe passed. No raw token belongs in database, receipts, URL query, logs or browser storage. | None. |
| Single-use redemption and concurrency | Satisfied | Synchronous immediate transaction can check active circle and unused/unexpired/unrevoked hash, check absent membership, insert a unique `(circle_id,user_id)` membership and mark redemption together. The transaction/unique constraints are available and sufficient for one local application server. Actual competing HTTP requests remain P07 acceptance work. | None. |
| Privacy/DTO integration | Satisfied | Existing learning_plan/event bodies contain detailed private data. Circle shared tables can remain independent, accepting only kind and bounded text supplied by explicit confirmation. Do not join private plan/event tables, and construct every output DTO field-by-field. Only public membership UUID, display name, role, self marker and approved shared content/timestamps are needed. | None. |
| Removal, closure and replay cleanup | Satisfied | Membership FKs can cascade authored copies and all encouragement from that membership, including encouragement attached to someone else's copy. Copy deletion cascades attached encouragement. Closure can retain a circle tombstone and invitation lifecycle/hash metadata while deleting memberships/content. Minimal receipt resource IDs are safe to retain, but replay must not recreate a deleted resource or bypass current membership. | None. |
| Existing test infrastructure | Satisfied | Node test suites start disposable loopback HTTP servers with synthetic Better Auth accounts/cookies and injected clocks; they inspect SQLite safely and close/reopen the same data directory. `tsconfig.tests.json` includes new domain/server test files automatically and `tools/run-unit-tests.mjs` discovers compiled `*.test.js`. | None. |
| Input bounds and exact API defaults | Satisfied as implementation decisions | Current validators provide strict object keys, trimmed bounded text, UUID and calendar dates. Recommended names/text limits, expiry, preset codes and API shape below are routine contract choices for root consolidation. They are not undocumented environmental facts or separately claimed user decisions. | Root chooses exact shared types/routes before parallel implementation; no missing research fact. |

### Isolated feasibility result

Executed a PowerShell literal here-string piped to `node --input-type=module` with only `:memory:` SQLite. Exit 0; output: `{"result":"pass","assertions":10,"sqlite":"3.53.4","scope":"in-memory migration rollback, additive schema, membership cascades, retained private row, token format/hash; no app behavior"}`.

The ten assertions covered: deliberately thrown migration rolls back; failed DDL leaves no table; failed migration leaves only version 1; successful additive migration retains a private plan row; deleting a peer membership removes only that peer's copy; encouragement both attached to that copy and authored by the peer on another copy disappears; private row still matches; 32 random bytes yield base64url43; SHA256 yields hex64; foreign_key_check is empty. The probe closed its connection. No production source, real database, app server, tracker or Git write occurred. This does not establish application migration, concurrency or browser behavior.

## Constraints

### Recommended implementation boundaries

Keep `JourneyStore` and private receipt semantics unchanged. Add a cohesive `CircleStore` in `src/server/circles.ts` and pure strict parsers in `src/domain/circle-validation.ts`. Extend shared types and only the required HTTP adapter wiring. Add v2 circle tables through the existing migration entry point. No new package or identity route is required.

Recommended minimum data:

- Circle: UUID, authenticated owner user ID (server only), bounded name, created timestamp, nullable closed timestamp.
- Membership: UUID, circle FK, authenticated user FK, joined timestamp; unique circle/user. Derive owner role from circle ownership. Public response exposes membership UUID/name/role/isSelf, never email, session, underlying auth ID, timezone or private profile.
- Invite: UUID, circle/creator, unique SHA256 token hash, created/expires/revoked/redeemed timestamps and redeemed membership reference where useful. Owner listing omits token/hash/redeemer identity. Default 24-hour expiry is a routine product bound. Closed circles invalidate all unused invites.
- Shared item: UUID, author membership FK, kind `commitment` or `check_in`, text and created time. Recommend text limit 280 and circle name limit 80. Optional due date is unnecessary unless the final UI contract uses it; never accept private plan/step/activity IDs or auto-copy reflection. Shared text is immutable: delete and explicitly share a new copy.
- Encouragement: UUID, item FK, sender membership FK, allowlisted preset code/time. A unique item/sender row bounds repeated encouragement; selecting a different preset can replace only that member's preset if root chooses this contract. Disallow freeform messages.
- Receipt: authenticated owner, request UUID, operation, input digest and minimal resource/circle/membership IDs. No saved feed, display-name snapshot, shared text, private detail or raw token. Keep enough tombstone information to prevent the same request resurrecting deleted content.

Root selected these routine demo bounds before implementation: 5 active circle memberships per account (including ownership), 10 members per circle (including owner), 100 retained shared items per circle and 10 active unused invites per circle. Publish them in shared limits, enforce them transactionally, return actionable codes and test boundaries. These are maintainability choices, not measured load targets. Own-item deletion frees shared-item capacity; leaving or circle closure frees membership capacity. No due date is included. Presets are `keep_going`, `small_steps_count` and `glad_you_returned`; selecting another preset replaces only that sender's encouragement, while own-item encouragement is disallowed.

### Suggested route/response shape for root agreement

| Route | Permission and result |
| --- | --- |
| `GET /api/circles` | Session; own active memberships only; summary list. |
| `POST /api/circles` | Session; strict requestId/name; atomic circle + owner membership; minimal `{circleId}` result. |
| `GET /api/circles/:id` | Active membership; allowlisted detail/members/items/presets. |
| `POST /api/circles/:id/invites` | Active owner; requestId; create 24-hour one-use invite; metadata + raw token only on first response. |
| `GET /api/circles/:id/invites` | Active owner; only currently active unused invitations (maximum 10), metadata only, no hash/token. |
| `POST /api/circles/:id/invites/:inviteId/revoke` | Active owner; requestId; unused invite only, idempotent safe result. |
| `POST /api/circle-invites/redeem` | Session; strict requestId/token in body; one transaction; minimal circleId result. |
| `POST /api/circles/:id/items` | Active member; requestId/kind/text; creates immutable explicit shared copy; minimal itemId result. |
| `POST /api/circles/:id/items/:itemId/delete` | Active member and author only; requestId; deletes own item and attached encouragement. |
| `POST /api/circles/:id/items/:itemId/encouragement` | Active member; requestId/preset; fixed-code validation, no text. |
| `POST /api/circles/:id/leave` | Active non-owner; requestId; deletes own membership/content/encouragement. |
| `POST /api/circles/:id/members/:memberId/remove` | Active owner, target non-owner in same circle; requestId; removal cleanup. |
| `POST /api/circles/:id/close` | Active owner; requestId; closure + content cleanup + invite invalidation atomically. |

The parent may standardize paths/types with the frontend before implementation. Above is a concrete proposal, not a production API claim. A client preview can show exactly its validated kind/text before POST; there is no hidden private input to rehydrate or trust. A server preview route is optional unless selected by the combined contract.

### Exact shared contract agreed with root before implementation

`CircleRole = "owner" | "member"`; `CircleItemKind = "commitment" | "check_in"`; `EncouragementPreset = "keep_going" | "small_steps_count" | "glad_you_returned"`; `CircleInviteStatus = "active" | "expired" | "revoked" | "redeemed"`.

| Type | Explicit output fields |
| --- | --- |
| `CircleSummary` | `id`, `name`, `role`, `memberCount`, `createdAt` |
| `CircleMember` | `id`, `displayName`, `role`, `isSelf`, `joinedAt` |
| `CircleEncouragement` | `id`, `senderMemberId`, `senderName`, `preset`, `createdAt` |
| `CircleItem` | `id`, `authorMemberId`, `authorName`, `kind`, `text`, `createdAt`, `encouragements` |
| `CircleDetail` | `circle: CircleSummary`, `members: CircleMember[]`, `items: CircleItem[]` |
| `CircleInvite` | `id`, `createdAt`, `expiresAt`, `status` |
| `CircleInviteCreated` | `invite: CircleInvite`, `token: string or null` |

Circle list is `{circles: CircleSummary[]}` and owner invite list is `{invites: CircleInvite[]}`. Circle creation returns 201 `{circleId}`; redemption 200 `{circleId}`; shared-item creation 201 `{itemId}`; invite creation 201 `CircleInviteCreated`; revoke/delete/encouragement/leave/remove/close return 200 `{ok: true}`. Clients fetch current list/detail after saved mutations. Input interfaces are `CreateCircleInput {requestId,name}`, `CircleRequestInput {requestId}`, `RedeemCircleInviteInput {requestId,token}`, `ShareCircleItemInput {requestId,kind,text}` and `CircleEncouragementInput {requestId,preset}`. The final contract uses client preview of exact kind/text and no server preview route.

Errors: existing 401 `unauthenticated`, 400 `invalid_input` with field, 404 `not_found`, 409 `idempotency_conflict`; new 403 `owner_required`, `shared_item_owner_required`, `not_allowed` (own-item encouragement); 409 `owner_must_close`, `already_member`, `circle_limit`, `member_limit`, `shared_item_limit`, `invite_limit`; 410 `invite_unavailable`. Nonmember/removed/closed/missing circle and cross-circle nested resource return 404. Owner-only wrong-role returns 403 only after confirming active membership. Malformed token returns 400 field `token`; well-formed unavailable token returns 410 uniformly.

### Retry and permission rules requiring explicit contract wording

1. Every operation checks the current circle/membership/owner before returning a receipt-derived resource. An absent/removed member receives 404, including retries. Do not return a receipt's old feed. Non-owner requests for owner-only controls may return 403 once their membership is confirmed.
2. Bind member mutations to the current membership UUID. A removed member who later joins on a new invite must not use an old receipt to recreate an old shared copy. Missing/deleted replay targets return an appropriate unavailable result without mutation.
3. Invitation creation must never persist raw token for replay. An exact retry can return the original metadata with `token: null`; explain that it was already created and offer revocation/new issuance if the first token response was lost. A new request key intentionally creates a different invitation within bounds.
4. Exact successful redemption retry may return a minimal circleId only if the recorded membership is still current/active. Different body for the same key is 409 idempotency conflict. A different account or new request cannot reuse the consumed token. Already-current members should not consume unused invitations; return already_member with no invite change.
5. Used/expired/revoked/altered/closed-circle invitations can use a single `invite_unavailable` code with clear localized UI wording. No token preview endpoint or anonymous circle enumeration is required. Exact expiry boundary is `now >= expiresAt` unavailable.
6. Leave and close make a subsequent authenticated detail read fail; a lost successful response is reconciled by a fresh list. It is acceptable for retry of a now-unauthorized mutation to fail closed without returning former data. Owner leave and self-removal must explicitly require closure rather than transfer ownership.
7. For all writes, check dependent resource belongs to the path circle. An item/invite/member from another circle must never be actionable using a valid membership in the requested circle.

### Privacy and behavior test matrix

| Area | Required checks before claiming P07 acceptance |
| --- | --- |
| Upgrade | Fresh DB reaches v2; existing populated v1 upgrades preserving every private plan/history/receipt; repeat migration is harmless; unsupported versions fail; failure rolls back v2 marker/tables; foreign_key_check passes. |
| Roles | Anonymous denied every route group; owner/member/nonmember/removed member checked for circle list/detail, items, encouragement, invites, member removal and closure. Signed-out cookie remains denied. |
| DTO allowlist | Assert exact nested output keys and absence of email, auth IDs, private plan goals/references/reflections, tokens/hashes and receipt internals in member detail, summaries, owner invites and write responses. No private-table join. |
| Sharing | Owner and peer can each share only after explicit client preview/confirmation; private edit never changes copy; unknown/body-forged fields and excessive text rejected; own-copy delete removes attachments; another member/owner cannot delete someone else's copy via author endpoint. |
| Encouragement | Only preset codes accepted; nonmember cannot send; cross-circle item cannot receive; repeat request adds no duplicate; sender removal deletes encouragement on other members' items. |
| Invitation storage | Raw token returned once; subsequent owner list/detail/replay/DB receipts contain no raw token; SHA256 token hash persisted; distinct creations yield distinct token/hash. Token absent from URL/browser storage. |
| Invitation use | Separate real sessions join; altered/unknown/expired/exact-boundary/revoked/reused/closed invites fail; owner/member cannot accidentally consume an invitation; concurrent two-account redemption admits exactly one member; failed insert/state check does not consume token. |
| Receipt safety | Same key/body repeatable; changed key/body behavior explicit; changed body same key conflicts; old receipts after item deletion/member removal/rejoin/closure do not expose former content or resurrect copies; invitation creation retry returns no token. |
| Lifecycle | Leave/removal denies immediate next request, removes authored copies and all sent/attached encouragement, retains other copies and all private plan/history bytes; owner cannot leave/self-remove; closure clears shared rows and memberships and invalidates invitations. |
| Persistence | Circle membership/copies/presets/hash/lifecycle survive server/database reopen. Parent's separate-process/browser tests establish broader restart/disconnected-internet evidence; same-process reopen alone does not. |

## Done When

Backend factual research is satisfied for the agreed local scope; no unresolved factual blocker was found. Root must consolidate exact defaults/types and close the combined backend/UI research gate before production implementation. Relevant production acceptance remains unverified. After contract assignment, implement only assigned backend/domain/shared portions, run scoped compiler/domain/HTTP/lint/format checks, report actual results and coordinate independent review. Root owns complete browser verification, documentation consolidation, tracker writes and publication.
