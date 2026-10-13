# LittleFurther architecture

LittleFurther is a local browser proof of concept. Browser and loopback server run on one PC; SQLite is canonical. There is no hosted deployment, cross-device synchronization or remote-peer demonstration.

## System overview

```mermaid
flowchart TB
  subgraph PC[This PC]
    Browser[Native browser UI / Vite bundle]
    Server[Node 24 / Express loopback server]
    Auth[Better Auth accounts and sessions]
    Logic[Journey and circle stores / domain rules]
    AI[Bounded AI orchestration]
    DB[(SQLite auth and learner records)]
    Browser <-->|same-origin assets and authenticated JSON| Server
    Server --> Auth
    Auth <--> DB
    Server --> Logic
    Logic <--> DB
    Server --> AI
    AI --> Logic
  end
  AI -. optional server-only HTTP .-> OpenAI[OpenAI Responses]
  OpenAI -. plan discovery only .-> Search[Built-in web search]
  Browser -. learner opens a link .-> Resource[External learning page]
```

The manual core works without internet while the server runs. AI, search and external reference pages need internet. The app itself does not fetch arbitrary pages or extract PDFs.

## Actual source responsibilities

| Path | Responsibility |
| --- | --- |
| `src/client/` | Native DOM screens, localized copy, editor, study, Comeback, Activity, circles, shell/preferences and contextual AI review controls. |
| `src/domain/` | Validation and deterministic learning/circle/AI rules, progress/date calculations, templates and source constraints. |
| `src/server/app.ts` | Same-origin routes, authentication/authorization, input validation and orchestration. |
| `src/server/store.ts`, `circles.ts` | SQLite migration/private journey and circle persistence, transactional writes and retry receipts. |
| `src/server/ai-assistance.ts` | Necessary action context, owner/revision/member checks, concurrency/cancellation/deadlines and post-I/O rechecks. |
| `src/server/ai-provider.ts` | Native Responses HTTP, fixed model/tools, structured output and search-source extraction. |
| `src/server/ai-sources.ts` | Owner-scoped temporary source metadata, expiry and resolution; `store.ts` retains snapshots during explicit plan saving. |
| `src/server/index.ts` | Loopback startup, configuration and server-only credential loading. |
| `src/shared/` | Browser/server DTOs and six-action AI contracts. |
| `tests/`, `tools/` | Domain/server/browser tests and distinct-process verification. |
| `docs/specs/`, `.agents/skills/` | Requirements, dated evidence and reusable review/reconciliation workflows. |

Server modules orchestrate domain/store logic; no separate `src/application` layer or extra service exists. TypeScript contracts do not replace runtime input/output validation.

## AI and privacy request flow

```mermaid
sequenceDiagram
  participant L as Learner / browser
  participant S as Authenticated server
  participant O as OpenAI Responses
  participant D as SQLite
  L->>L: Read context disclosure and deliberately request help
  L->>S: Bounded action input
  S->>S: Validate session, owner, revision and membership
  S->>S: Construct task-specific context
  opt Plan discovery selected
    S->>O: Goal and locale / bounded web search
    O-->>S: Returned sources and citations
    S->>S: Filter and validate source metadata
  end
  S->>O: Strict generation / tools disabled / store:false
  O-->>S: Suggestion or failure
  S->>S: Recheck original session and current data, validate output
  opt Valid plan sources
    S->>D: Automatically stage owner metadata for 24 hours
  end
  S-->>L: Reviewable suggestion and source information
  L->>L: Review or discard, optionally apply to draft
  L->>L: Preview a circle copy locally before sharing
  L->>S: Separate Save / Complete / confirm dates / Share
  S->>D: Authorized write, plan save retains source snapshots
```

Six actions cover plans, smaller steps, study/reflection, Comeback, progress recap and circle wording. Search is available only for deliberate plan discovery. There is one generation request and at most one bounded search request, without automatic retries or provider/model fallback.

The pinned model is `gpt-5.4-mini-2026-03-17`. One operator-managed server key powers the app; there is no user-key entry, purchase, top-up or user quota feature. `CAPSTONE_AI_DISABLED=1` bypasses credential loading. `store:false` does **not** guarantee zero provider retention; see the [AI contract](specs/capstone/increments/ai-assistance.md) and [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data).

Circle generation receives only the learner’s typed own draft, kind and locale. Circle IDs support local checks and are not sent to the provider. Peer posts, saved reflections and private plans are excluded. Study help includes the current reflection draft only after selection; progress recaps exclude saved reflections. Point-of-use disclosures explain the necessary context.

Server post-I/O checks and browser session/input lifetime guards reject stale suggestions. Errors, refusals, exhausted credits, disconnection and cancellation retain inputs and leave manual controls available. Cancellation cannot guarantee that already-started provider processing or charges stop.

## Persistence and boundaries

Accounts/sessions and private records live in ignored local SQLite with a persistent authentication secret. Browser storage holds only validated theme/sidebar preferences. Local persistence is not encrypted backup or synchronization.

Schema v3 adds source drafts to the v1/v2 store. Metadata is bounded, owner-scoped and expires after 24 hours; separate successful plan saving copies exact source snapshots into retained plan JSON. Cleanup does not delete saved snapshots. Listed/cited/opened labels describe returned search evidence, not independent accuracy, free access or full-page reading. Supplied links remain unverified unless actually consulted.

Study saving does not complete a step. Comeback shifts unfinished dates only after preview/confirmation. Circle sharing creates a separate explicit copy; later private edits do not update it. Revisions, write receipts and transactions protect these workflows. [Operations](operations/local-demo.md) covers complete data-directory isolation and matching-source rollback.

## Evidence and future work

[13 October verification](specs/capstone/increments/ai-assistance-verification.md) records actual checks and limits. The [specification](specs/capstone/spec.md) governs future decisions. Public/TLS deployment, email/recovery, remote peers, encrypted backups, moderation and operational observability require additional work; the diagram does not imply those services exist.
