# Developing LittleFurther

Preserve the connected journey, Amber/A Original identity, English/French UI and private-by-default behavior. Start with the [specification](specs/capstone/spec.md), [instructions](../AGENTS.md) and [architecture](ARCHITECTURE.md); active increments define criteria and dated results.

## Pinned local setup

Use Node **24.19.0** and pnpm **11.19.0** from the root:

```powershell
node --version
pnpm --pm-on-fail=download --version
pnpm --pm-on-fail=download install --frozen-lockfile --ignore-scripts
pnpm --pm-on-fail=download run build
pnpm --pm-on-fail=download start
```

Open http://127.0.0.1:4317. This serves built assets; stop, rebuild and restart after edits. The explicit pnpm option selects the package pin when a host launcher disables automatic selection. Native SQLite compatibility, the frozen lockfile and scoped LF checkout attributes are part of the tested setup. [P10’s independent rehearsal](specs/capstone/increments/reuse-verification.md) used this Windows host/cache, not a pristine machine.

## Checks and evidence

```powershell
pnpm --pm-on-fail=download run check
pnpm --pm-on-fail=download run lint
pnpm --pm-on-fail=download run format:check
pnpm --pm-on-fail=download run build
pnpm --pm-on-fail=download test
pnpm --pm-on-fail=download run verify:process
pnpm --pm-on-fail=download run test:e2e
pnpm --pm-on-fail=download run audit
```

`pnpm --pm-on-fail=download run verify` runs required checks in sequence, stopping at failure. `format` writes only maintained inputs. Do not suppress findings, weaken assertions or bulk-format historical evidence to obtain a pass.

Browser checks use installed Microsoft Edge through Playwright, a separate server on4318 and synthetic `.local/e2e-data`. Credentials/data/reports stay ignored. Verification disables real credential loading and mocks provider responses; no live API budget is required. Record the tested revision, command, result and unavailable coverage. [13 October AI verification](specs/capstone/increments/ai-assistance-verification.md#actual-executed-checks) contains 85 domain/server and 94 browser passes; these are prior results, not new runs for documentation edits.

The [GitHub workflow template](operations/github-quality-workflow.yml) remains outside `.github/workflows`. Hosted CI and enforced branch protection are not active. Activation needs separate access/budget verification and authorization.

## Safe local isolation

Use a new empty ignored `CAPSTONE_DATA_DIR` for experiments; never point tests at ordinary learner data. Preserve a matching whole data directory and authentication secret for restoration. Do not run differently configured servers against one store or downgrade its schema in place.

Optional AI uses server-only `OPENAI_API_KEY` from the environment or ignored `.local/ai-provider.env`. Never put keys in `VITE_` configuration, browser storage, tracked examples, logs or chat. `CAPSTONE_AI_DISABLED=1` disables AI before loading credentials. No BYOK, automatic retry, provider fallback, purchase or top-up exists. [Operations](operations/local-demo.md) covers configuration/failure/recovery.

## Adapt templates and translations

1. Inspect `src/domain/templates.ts`, validators/contracts and [P10 adaptation evidence](specs/capstone/increments/reuse.md). Keep the supported template ID stable; change its version only with explicit compatibility/stored-history handling.
2. Update both English/French template text and credible source metadata. A template creates an editable draft; it does not silently rewrite saved plans. Supplied links are not fetched merely by saving them.
3. Add copy to both catalogues in `src/client/i18n.ts`, including accessible names, errors, hints and optional/privacy language. Keep LittleFurther unchanged. Do not automatically translate learner text or imply an English resource is French.
4. Run affected checks, both themes and desktop/320px layouts with longer French copy. Record exact results/limits before publishing.

## Included Codex workflow

Shape substantial work around **Goal, Context Pointers, Constraints and Done When**. Research unresolved facts first; record a specification and observable criteria before material implementation. UI work uses Impeccable, scoped ui-ux-resources checklists and a visual reference before frontend edits.

Invoke [learning-journey-review](../.agents/skills/learning-journey-review/SKILL.md) with the increment, criteria, revision and execution evidence. It produces an AC-linked review, prioritizes findings and separates observed behavior from unverified claims. A review document alone cannot establish a running app or human adoption.

Invoke [capstone-evidence-update](../.agents/skills/capstone-evidence-update/SKILL.md) with actual artifacts/results to reconcile J1–J4 and authorized trackers. Use supported GitHub MCP reads and distinguish unavailable private-repository reads from authenticated CLI fallback. Browser MCP observes interactions and maintains Kaneo; verified Miva Google Drive MCP can update/read bounded Sheet cells, with browser visual inspection. Describe actual routes accurately, preserve stable IDs/history and compare saved changes.

Publish intended non-secret source through [authorized normal Git publication](operations/repository-publication.md), preserving hooks and verifying the intended main commit. Project data/history never goes to CodexRecovery. Keep learner hypotheses, dated tests, human approval and the unfinished video distinct.
