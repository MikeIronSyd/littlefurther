# Formal design-review packet — 8 October 2026

Recorded at 20:28 Africa/Lagos. This is preparation of the outstanding formal Impeccable checkpoint, separate from the independent current-product design assessments. No product verdict or human acceptance is inferred.

## Goal

Make the inherited plan/inventory review genuinely usable for Michael, resolve its previous file error through the supported tooling, and identify the remaining formal workflow boundaries. Preserve the selected Amber direction and later explicit sidebar/theme requirements.

**Result:** the supported capture succeeded and a live, inspected review page is available at `http://127.0.0.1:61603/`. The six plan decisions and inventory confirmation remain Michael's. No review decisions were selected or submitted. The app already exists; the page's generic “before any page code” wording does not establish that this checkpoint happened before implementation.

## Context Pointers

- [Prior formal-workflow research](2026-10-08-integration-design-research.md), [specification](../spec.md), [reuse contract](../increments/reuse.md) and [reuse verification](../increments/reuse-verification.md).
- Installed `C:/Users/USER/.codex/skills/impeccable/SKILL.md`, `reference/component-review.md` and applicable `reference/new-work.md` sections. The root's existing context result was reused; context was not rerun.
- Current `.impeccable/build/state.json`, `.impeccable/build/spec.json`, `.impeccable/regions.json`, `.impeccable/review/components.json`, selected `next-turn.png` and its actual approval sidecar.
- Real application entry `index.html`, `vite.config.ts`, `src/client/main.ts`, `src/client/api.ts` and existing `dist/client/index.html` informed the later assembled-capture limitation.

### Supported commands and results

Commands ran from the project directory with `C:/Users/USER/.codex/skills/impeccable/scripts/impeccable.cmd` (engine version file `0.1.9`).

| Command / action | Actual result |
| --- | --- |
| `component-review --help` | Supports `plan`, `prepare`, `capture`, `verify`, `lifecycle`, `serve`, `status`, `refresh-approvals`; serve supports `--port 0` and `--idle-timeout`. |
| `component-review capture --help` and `prepare --help` | These are not detailed subcommand help. Both print `prepare needs --manifest <project-relative file>`; no capture was claimed from these calls. |
| `component-review capture --manifest .impeccable/review/components.json` | Exit 0; session and revision below; status `awaiting-review`, round 1. Capture schema is `plan-review-proof-v1`. It pins raster sources/crop geometry and explicitly does **not** claim browser capture, visual/semantic approval or human identity. |
| `component-review status --session 3958725ad218c4dfdda608b6a34055a5ffe63efeda72a7fea9cf00bea8b9d626` | Current revision found; receipt `null`; all six comp-crop records present. After serve, reports local URL and engine PID. |
| `component-review verify --manifest .impeccable/review/components.json` | Prints `component review is pending or needs work; await the user, then verify again`. The earlier `os error 2` is no longer reproduced after supported capture. This resolves the operational error for the present packet, but does not identify retrospectively which file caused the old error. |
| `component-review serve --session 3958725ad218c4dfdda608b6a34055a5ffe63efeda72a7fea9cf00bea8b9d626 --port 0` | Running helper prints `http://127.0.0.1:61603/`, engine PID `17684`. Started using `Start-Process ... -WindowStyle Hidden`; wrapper PID `30556`. |
| Browser MCP, own IAB tab | Original comp and first Progress crop render. Six numbered undecided items appear. Summary contains all 32 region buttons: six plan items plus 26 code regions. It says `6 still to decide`; final `Approve plan and assets` control is disabled. Only navigation to Start, Summary and first item occurred; no decision or inventory input was changed. |

No host `component_review` tool was exposed in the tool inventory, so the documented CLI fallback was used. A visible subagent IAB request was unsupported; a background tab was successfully created, inspected and marked as a deliverable. Root should open/show the URL for the user. Browser screenshot evidence is retained in ignored `.local/design-pipeline-review/progress.png` and `summary.png`.

### Packet identity and continuation

- Session: `3958725ad218c4dfdda608b6a34055a5ffe63efeda72a7fea9cf00bea8b9d626`.
- Revision: `87f3b74ffc5f6bd5211066384d046fa6841f06173a3bcb6856a929a1791242fa`.
- Plan items: Progress, Path, Rhythm, Circle, Estimate clock and Return icon; zero shipping raster plates.
- Current comp file SHA-256 pinned by capture: `27f77627e6b806782750654dcdbf62241c500db361a0bbdc13357d575af31364`. Its actual file hash was read back. The measured spec's existing `compSha256` field differs; this pass does not assert that those two differently sourced values have the same hash semantics or rewrite either. No image/spec change occurred here.
- Tool-owned session files live under `C:/Users/USER/.impeccable/component-reviews/<session>/`: `current.json`, the current revision and pinned blobs. These are generated review cache, not global configuration changes or project publication.
- Serve stdout/stderr and wrapper PID: ignored `.local/design-pipeline-review/serve.stdout.log`, `serve.stderr.log`, `serve.pid`. Stderr was empty when inspected.
- Root confirmed a fresh visible IAB tab `3`, inspected the Progress crop and zero of six decisions, and marked that tab deliverable. The delegated inspection tab `1` was closed after this handoff. The helper remains running intentionally for the user's review; no recurring process or scheduled work was created.
- Default idle expiry is 30 minutes according to the installed skill. If the URL has expired, resume with the same supported `serve --session <id> --port 0` command and use its newly printed URL. A timeout/no-browser exit is pending review, never acceptance. Do not submit or fabricate decisions to keep the session alive.

### Research status

| Need | Status and evidence | Remaining question |
| --- | --- | --- |
| Resolve the unusable previous verify result | Satisfied operationally: supported capture succeeds, status finds the packet, verify now explicitly reports pending review. | Historical missing-file identity remains unknown and is not needed to present this packet. |
| Ensure a complete current plan/inventory packet is reviewable | Satisfied at packet scope: matching manifest/spec SHA, six comp-crop items, 32 summary regions, actual browser rendering, no user receipt. | Human decisions remain required; visual inspection of tool UI is not acceptance of its content. |
| Preserve direction and later shell decisions | Satisfied: original approved comp/approval sidecar retained; no new comp or region change. | This packet reviews material/implementation classification. It does not revoke later sidebar/theme requirements or approve the assembled app. |
| Capture the authenticated assembled first viewport with the existing formal harness | Still unresolved, separate later requirement. The manifest contract requires the build-state artifact as the page entry, but the artifact is a TypeScript module (`src/client/main.ts`), while the runnable page is `index.html` and Vite emits `dist/client/index.html`. Application startup uses `/api/me`, `/api/plans`, `/api/templates` and plan-detail requests through `fetch` with same-origin credentials. The skill forbids network APIs in assembled capture. | A supported real-page capture path for this authenticated application is required. No static fixture, removed behavior, forced phase, altered artifact, intercepted API or sign-in-screen substitution was attempted. |

The outstanding capture requirement must remain in the root's research/plan record before dependent implementation or formal hero-completion claims. Inspecting a real running app through browser MCP remains valid product-review evidence at its stated scope; it is not the formal assembled-capture receipt.

## Constraints

The installed [component-review reference](C:/Users/USER/.codex/skills/impeccable/reference/component-review.md:11) states: **“Never submit the page or write a receipt on the user's behalf.”** Its receipt section says to apply the user's decisions, and requires every item approved plus confirmed inventory before advancing. This is the exact human-decision requirement; a broad request to proceed with the review does not supply those item decisions.

Michael can decide whether the six regions should be drawn in code, turned into images or revised, then inspect the comp coverage and submit his decisions. Existing Amber selection is settled. No additional aesthetic approval round or feature-scope decision was introduced.

No detector, doctor, root context rerun, production edit, phase mutation, force/waiver, receipt creation, tracker write, commit/push, paid service or global-setting change occurred. No A/B findings were read. The approved comp, measured spec, regions, manifest and historical state/timestamps remain unchanged.

| Preserved file | Before/after SHA-256 |
| --- | --- |
| `.impeccable/build/state.json` | `918a531e0d5fcb4a12276a87c0b076036b35ea29d3f2ab263224c099a6a9df23` |
| `.impeccable/build/spec.json` | `01c1bd9abdbdc89f5e345610bdcc2e7a9524a749a913406adc7aae5d2a7445ba` |
| `.impeccable/regions.json` | `c51115115991f2aa4c8da4549c7fdb5e06c0ae385fe16258a1ec68e30513211d` |
| `.impeccable/review/components.json` | `eff36f003f3645059309d7154ada40d413f9e6e27f4a834d11719fb15411d260` |

## Done When

This delegated preparation is complete: a real local packet is served and inspected, the original file error no longer blocks it, user decisions are untouched and later limitations are explicit. **Formal design completion remains pending**: plates is open, hero/sections/motion/responsive/review are pending, finish is null. This report does not grade current-product design quality or erase existing product/test evidence.

Only this report was authored in tracked project paths. Ignored screenshots/log/PID files and the supported tool's review-session cache are the other outputs. The review helper and marked browser tab remain available for the user-facing handoff.
