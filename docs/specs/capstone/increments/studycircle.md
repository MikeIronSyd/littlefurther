# P07 — Private StudyCircle

8 October 2026, Africa/Lagos. Baseline `e519d10f0391f8acd06c7d57aad5caf59df58dbf`. Written before P07 production edits. Root baseline strict compilation and all 40 existing domain/HTTP tests passed.

## Goal

Complete the private peer component of the connected learning journey. Learners can voluntarily create or join a circle, explicitly preview/share a commitment or check-in copy and exchange preset encouragement. They can control membership and remove their shared copies while retaining their private learning history. This implements F08–F10 and AC07–AC09 of the parent specification; it does not establish retention, mastery, adoption or full-capstone completion.

## Context Pointers

- [Parent specification](../spec.md), [plan](../plan.md), [research](../research.md), [P06 evidence](comeback-verification.md).
- [Backend research](../reviews/2026-10-08-circle-backend-research.md): actual v1 migration/receipt/auth integration, primary SQLite/Node documentation and ten passing isolated in-memory assertions. These are feasibility evidence, not product acceptance.
- [UI research](../reviews/2026-10-08-circle-ui-research.md): existing entry/lifetime/localization patterns, no-plan entry and inspected Amber sharing reference.
- Existing image `.impeccable/mocks/amber/sharing-preview.png` predates frontend work. Its detailed-state sidecar remains approved:false; the original Amber direction is already selected. Preserve the incumbent shell and design system, including correct panel icons and light/dark controls.
- Existing `src/server/store.ts`, `app.ts`, `src/shared/contracts.ts`, client/main/journey modules and test helpers are the integration boundaries. Keep the existing supported stack and lockfile; no additional dependency is justified.

## Constraints

### Research gate and settled decisions

R17 closes all P07-specific integration research: additive migration/rollback/cascades, auth IDs and authorization, receipt privacy and membership incarnation, token generation/hash/expiry, bounded DTOs/routes, UI lifetime/failure/locale handling, existing image and available verification tooling. The two research reports identify no unresolved factual blocker. Root chooses the explicit routine bounds and interface below before implementation. No consequential user question remains. Reopen research if a new material unknown appears.

No full chat, public community, email/message dispatch, runtime AI, public hosting, remote-peer promise, paid service or background polling. A second synthetic local account is a real separate identity/session, not a mocked peer. Circle membership never gates private studying or requires a private plan.

### Shared data contract

All entity and request IDs below are UUID strings; identity provider user IDs remain server-only arbitrary strings. Export types in existing `src/shared/contracts.ts`:

```ts
type CircleRole = "owner" | "member";
type CircleItemKind = "commitment" | "check_in";
type EncouragementPreset = "keep_going" | "small_steps_count" | "glad_you_returned";
type CircleInviteStatus = "active" | "expired" | "revoked" | "redeemed";
interface CircleSummary { id: string; name: string; role: CircleRole; memberCount: number; createdAt: string }
interface CircleMember { id: string; displayName: string; role: CircleRole; isSelf: boolean; joinedAt: string }
interface CircleEncouragement { id: string; senderMemberId: string; senderName: string; preset: EncouragementPreset; createdAt: string }
interface CircleItem { id: string; authorMemberId: string; authorName: string; kind: CircleItemKind; text: string; createdAt: string; encouragements: CircleEncouragement[] }
interface CircleDetail { circle: CircleSummary; members: CircleMember[]; items: CircleItem[] }
interface CircleInvite { id: string; createdAt: string; expiresAt: string; status: CircleInviteStatus }
interface CircleInviteCreated { invite: CircleInvite; token: string | null }
interface CircleRequestInput { requestId: string }
interface CreateCircleInput extends CircleRequestInput { name: string }
interface RedeemCircleInviteInput extends CircleRequestInput { token: string }
interface ShareCircleItemInput extends CircleRequestInput { kind: CircleItemKind; text: string }
interface CircleEncouragementInput extends CircleRequestInput { preset: EncouragementPreset }
```

Limits: circle name80 characters, trimmed shared text280; five active circle memberships per account (including ownership), ten members per circle (including owner),100 retained shared copies per circle, ten active unused invitations per circle, fixed24-hour expiry. Enforce capacities inside the mutation transaction. These are demo bounds, not measured performance targets. Deleting a copy frees its capacity. Do not silently truncate feeds. No shared due-date or private plan/step/activity identifier is accepted.

Each item is an immutable approved text/kind copy. Later private edits do not alter it. Names/time and preset codes are the only other shared fields. Never join private plans, reflections, resource lists or unshared activity into circle responses. Membership IDs are circle-specific; no email, auth ID, profile, token hash or receipt metadata appears in public DTOs. Current and future circle members can read retained copies; disclose this before sharing.

### Routes and authorization

All routes remain same-origin, authenticated, strictly validated and subject to existing JSON size/Host/Origin/error handling. Current session identity is authority, never a supplied user ID.

| Route | Body / result | Permission |
| --- | --- | --- |
| GET `/api/circles` | `{circles:CircleSummary[]}` | Own active memberships only |
| POST `/api/circles` | CreateCircleInput →201 `{circleId}` | Session; creates owner membership atomically |
| GET `/api/circles/:id` | CircleDetail | Active member |
| GET `/api/circles/:id/invites` | `{invites:CircleInvite[]}`; active unused only | Active owner |
| POST `/api/circles/:id/invites` | CircleRequestInput →201 CircleInviteCreated | Active owner |
| POST `/api/circles/:id/invites/:inviteId/revoke` | CircleRequestInput →200 `{ok:true}` | Active owner; unused invitation |
| POST `/api/circle-invites/redeem` | RedeemCircleInviteInput →200 `{circleId}` | Session; atomic token consumption/membership |
| POST `/api/circles/:id/items` | ShareCircleItemInput →201 `{itemId}` | Active member |
| POST `/api/circles/:id/items/:itemId/delete` | CircleRequestInput →200 `{ok:true}` | Active member and item's author |
| POST `/api/circles/:id/items/:itemId/encouragement` | CircleEncouragementInput →200 `{ok:true}` | Active member; another member's item |
| POST `/api/circles/:id/leave` | CircleRequestInput →200 `{ok:true}` | Active non-owner |
| POST `/api/circles/:id/members/:memberId/remove` | CircleRequestInput →200 `{ok:true}` | Active owner; non-owner target |
| POST `/api/circles/:id/close` | CircleRequestInput →200 `{ok:true}` | Active owner |

Nested item/invite/member must belong to the path circle. Anonymous401; absent, removed, closed or nonmember circle404; owner-only wrong role403 `owner_required`; wrong item author403 `shared_item_owner_required`; own-item encouragement403 `not_allowed`. Owner leave/self-remove409 `owner_must_close`; existing member redemption409 `already_member` without consuming the invite. Bounds return409 `circle_limit`, `member_limit`, `shared_item_limit`, `invite_limit`. Existing `invalid_input`400 with field and `idempotency_conflict`409 remain. Malformed token400; well-formed unknown/altered/used/expired/revoked/closed invitation410 `invite_unavailable`, described clearly in EN/FR.

One encouragement per sender/item. A new request can replace that member's preset; exact receipt replay does not roll a later preset backward. No free reply input or own-item encouragement.

### Persistence, receipts and lifecycle

Keep private JourneyStore semantics unchanged. Add cohesive CircleStore and pure circle-validation module. Migrate sequentially v1→v2 using additive circle/membership/invite/item/encouragement/receipt tables, foreign keys, parameterized queries and immediate transactions. Preserve private records and receipts. Repeat startup is harmless; unknown/newer schema fails clearly. Test rollback and populated-v1 upgrade before the existing demo database is opened by the new build. No migration rollback in place: stop the app and preserve the complete local database/auth-secret directory before any separately authorized restore; never publish local data or send it to CodexRecovery.

Generate32 cryptographically random bytes as base64url43; store only SHA256 hash plus invite state/timestamps. Return raw token only on first creation response. Never persist raw token in SQLite receipts, URLs, browser storage, logs or repository. Exact creation retry returns the original invitation metadata with `token:null`; UI explains why and offers revoke/new. Redemption checks active circle, current capacity, expiry (`now >= expiresAt` unavailable), revocation and single use atomically. Concurrent redemption admits only one new member. Failed insertion/capacity leaves the invitation unused.

Use separate minimal circle receipts: owner/request ID, operation/digest and resource/circle/membership IDs only, not whole DTO snapshots or shared text/name/token. Check current authorization before returning a receipt. Bind member requests to their membership UUID; after removal and rejoin, old receipts must neither disclose old data nor resurrect copies. Preserve tombstone receipt information sufficient to prevent recreation after deletion. Exact replay of a still-valid operation returns minimal identifiers/acknowledgement, then the client reads current detail. A deleted target returns unavailable without recreating it. Changed body/operation under the same key conflicts.

Successful leave/removal deletes that member's copies and attached encouragement, plus encouragement they authored on other members' items. Other members' copies and all private history remain unchanged. Access is denied on the next server request. Already-rendered or previously seen content cannot be recalled; do not promise push revocation. Owner leaves only by explicit closure: mark closed, clear members/shared items/encouragement and invalidate unused invitations atomically, retaining private history. A lost leave/close response is reconciled with the fresh circle list; a now-unauthorized retry may fail404 rather than reveal former data.

### Connected UI and failure contract

Use a Study together action in the learning support panel and in the no-plan state. Open the same My learning subview with a Back action; no fourth navigation destination. Show bounded lists and empty states, create/join forms, current member names/role, explicit copy composer/preview and saved shared updates. Use actual values, never mock example names/counts. Preserve the Amber shell and token system.

Before joining, disclose that the display name becomes visible and current/future circle members can read deliberately shared copies. Paste codes manually; retain only active-view memory. Owner creates/revokes invites and sees fixed expiry. Owner removal/closure, member leave and own-copy deletion each require a specific inline confirmation explaining cleanup and retained private work; the first click only opens that confirmation.

Active-view token clarification (8 October): source review of `circle.ts` and the retained localization bindings in `i18n.ts` confirms that detached inputs can remain referenced. Register and clear both the pasted join-code input and the newly created invitation-code input on successful view replacement, authorized navigation, access loss and detachment. Preserve them while the current view is retained after a failure or for exact retry. A detached-input browser assertion must verify clearing; no storage leak or behavioral pass is inferred from source inspection alone.

Composer has kind and bounded editable text with an exact normalized preview, recipient circle/current roster and clear exclusions. No automatic private-content prefill. Editing invalidates a previous preview; only explicit confirmation posts the previewed body. Switching language/theme/sidebar retains input and preview. Use separate labels for any private plan context; it never enters the share request. Preset encouragement has no arbitrary text field.

Freeze controls during writes and reuse the same request ID/body after uncertain responses. Say a mutation may have saved when transport fails. If POST succeeds but latest GET fails, explain saved state and offer read-only refresh, not another mutation. Access-denied refresh clears previously rendered circle content. Detached-view/generation guards prevent late responses from overwriting another route, account or circle. Reuse existing dirty-form navigation protection; cancel may discard the preview through that established boundary. Clearing/reloading after access loss must not expose stale private-circle content as current.

Retry-review clarification (8 October): scoped research is satisfied by `src/server/circles.ts` (`replayAccess`, `deleteItem`, `remove`, `leave`, `close`) and the existing client reconciliation callbacks. A mutation404 can mean a deleted target after a lost successful response, and mutation403 can mean an action-specific permission denial; neither alone proves lost circle membership. Re-read current detail/invitations, or the current circle list for leave/close, before interpreting access. A successful read confirms only refreshed information and must not claim the earlier action saved. A denied read clears stale content. If reconciliation itself fails, keep the existing controls frozen and offer GET-only refresh with honest uncertainty. SC05 verification must cover lost-delete retry preserving circle access, lost-leave/close retry reaching the current list, and actual denied reads clearing content; no behavioral pass is inferred from this source review.

Externalize all labels/errors and preset descriptions in EN/FR; format timestamps with learner timezone and locale. Use native labels/forms/buttons/details, focused headings/status, keyboard controls, safe text rendering, light/dark pairs and French320px reflow. No new polling or clipboard dependency.

### Ordered work and quality contract

1. Root documents R17 closure and this contract. Backend owns shared types, domain validation, CircleStore, additive migration/HTTP routes, and meaningful domain/HTTP/migration tests. Publish shared types first for frontend coordination.
2. Frontend owns circle.ts and narrow main/journey/i18n/styles integration; reads craft-floor immediately before UI edits. No production edits precede gate closure.
3. Root owns browser tests and process-restart extension; one aggregate test runner/server to avoid port and auth-rate conflicts. Preserve strict diagnostics and existing40 unit/HTTP plus27 browser cases.
4. Independent learning-journey-review checks role/lifecycle/privacy/receipt contracts and actual outputs. Fresh visual reviewer gets final desktop/light-dark/mobile packet; documenter compares the ordinary extension to the preserved system. No fabricated formal Impeccable receipts.
5. Update actual evidence with capstone-evidence-update, normal publication/readback on both private repositories and saved Sheet/Kaneo comparisons. No external messages, capstone submission, permission expansion or paid service.

Exact checks: `pnpm run check`, `pnpm run lint`, `pnpm run format:check`, `pnpm run build`, `pnpm test`, `pnpm run verify:process`, `pnpm run test:e2e`, `pnpm run audit`. Record failures, unavailable checks and corrected runs. All app scenarios use synthetic data. Local behavior checks do not prove human adoption or retention.

## Done When

| ID | Observable completion criteria |
| --- | --- |
| SC01 | Fresh/repeated v2 startup and populated-v1 upgrade preserve private rows/receipts; failed migration rolls back; unsupported version fails and FK check passes. |
| SC02 | Two real sessions create/join a circle; random token is hash-only at rest, once-returned, expiring/revocable/single-use under concurrent redemption; exact/conflicting retry and capacities verified. |
| SC03 | Explicit preview/cancel/share produces only an allowlisted immutable copy; private edits/history remain private; names/times/presets work; unknown fields, XSS text and invalid enum/size rejected or rendered literally as appropriate. |
| SC04 | Owner/member/nonmember/removed/signed-out permissions hold for every route group and cross-circle IDs; deletion/leave/removal/closure perform cleanup, retain private work and deny subsequent access, including stale receipts/rejoin. |
| SC05 | No-plan entry, EN/FR, desktop light/dark, French320px, keyboard/focus and input preservation work. Failed/uncertain mutations and post-save readback are honest; late callbacks cannot replace other screens; token absent from URL/storage. |
| SC06 | Circle state survives browser reload and distinct-process restart; existing learning/Comeback regressions pass under their recorded conditions. |
| SC07 | Review, documentation, normal dual publication and E009 tracker saved readbacks are recorded with real limits. P08 onward, learner evaluation, independent adoption and timed video remain separate. |

Actual results belong in `studycircle-verification.md` after execution. This pre-code contract alone passes none of the product criteria.
