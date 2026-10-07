# R15 — quality tooling feasibility

Checked **7 October 2026, 21:02 Africa/Lagos**. This narrow research need is satisfied. This is isolated tooling evidence, not product implementation, app acceptance, security certification or cross-platform verification.

## Goal

Select and verify the smallest maintained formatter, linter and browser-test tools compatible with the already selected Windows/Node 24/strict TypeScript 7 stack. Retain Node's built-in test runner for domain and HTTP integration tests; use browser tests for browser behaviour.

## Context Pointers

- Existing stack and quality contract: [specification](../spec.md), [plan](../plan.md), [runtime feasibility](runtime-feasibility/REPORT.md).
- Exact package metadata, engines and dependencies were read from the npm registry on 7 October: [Biome 2.5.15](https://registry.npmjs.org/@biomejs%2Fbiome/2.5.15), [Playwright Test 1.63.0](https://registry.npmjs.org/@playwright%2Ftest/1.63.0), [typescript-eslint 8.71.1](https://registry.npmjs.org/typescript-eslint/8.71.1).
- Primary documentation: [Biome CLI](https://biomejs.dev/reference/cli/), [Biome language support](https://biomejs.dev/introduction/language-support/), [typescript-eslint dependency support](https://typescript-eslint.io/users/dependency-versions/), [Playwright installation and requirements](https://playwright.dev/docs/intro), [Playwright TypeScript](https://playwright.dev/docs/test-typescript), [Playwright browser channels](https://playwright.dev/docs/browsers).
- The disposable fixture, locked packages, seven command logs, PowerShell runner and machine-readable `result.json` are retained locally in the ignored `.local/research/quality-tooling/` directory. `git check-ignore` confirmed exclusion. No production package/configuration/code was changed by this experiment.

## Constraints

Keep all experiments synthetic and local. No production dependency installation, global installation, browser download, public hosting, tracker mutation or user-profile automation was performed. The browser process used a fresh Playwright context with a temporary loopback HTTP server, then closed both. Package downloads and the dependency advisory lookup required network access.

### Findings and selected tooling

| Item | Verified choice / reason |
| --- | --- |
| Formatter and linter | Pin `@biomejs/biome` **2.5.15**. Its registry engine is Node `>=14.21.3` and it has no TypeScript peer dependency. The installed Windows binary formatted and linted representative TypeScript and JSON alongside TS **7.0.2**. Use recommended rules and `--error-on-warnings`; this does not replace strict compiler checking. |
| Alternative considered | `typescript-eslint` **8.71.1** documents and declares TypeScript `>=4.8.4 <6.1.0`. This excludes the selected TS7 compiler. Do not suppress an unsupported-version warning or downgrade the already verified stack merely to use this linter. Biome avoids that peer compatibility problem and combines formatting/linting in one dependency. |
| Browser runner | Pin `@playwright/test` **1.63.0**, which depends on matching `playwright` **1.63.0** and requires Node `>=20`. Playwright transpiles test TypeScript; retain separate strict `tsc` checking. |
| Local browser | Installed Microsoft Edge **154.0.4258.53**, `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`, works headlessly with `browserName: "chromium"`, `channel: "msedge"`. An installed Chrome executable was also found but was not tested. The usual `ms-playwright` browser cache was absent. Do not claim bundled Chromium, Firefox or WebKit coverage. |
| Runtime | Actual `node.exe`: `C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`, version **24.19.0**. Actual `pnpm.cmd`: `C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm.cmd`, version **11.19.0**. |
| Package script interface | Use **`pnpm run`** as the canonical local command interface. `npm` is absent from PATH; a targeted search found only Corepack npm shims, not an installed npm CLI. No npm installation is necessary just to preserve the spelling of earlier planned commands. The same named package scripts remain usable with npm on a machine that has npm. Preserve the selected pnpm lockfile and `pnpm audit`. |

The maintained product commands should be `pnpm run check`, `pnpm run lint`, `pnpm run format:check`, `pnpm run build`, `pnpm test`, `pnpm run test:e2e`, and `pnpm run audit`. Map them respectively to strict TypeScript, Biome lint with warnings failing, read-only Biome format checking, the selected server/client build, Node's built-in tests, Playwright Test, and pnpm audit. Scope formatter/linter input to maintained product source/configuration/tests; do not rewrite historical evidence, generated image prompt metadata or preserved research artifacts. Exact product commands remain unverified until implementation creates and runs them.

### Actual isolated checks

Final harness: `./run-checks.ps1` in `.local/research/quality-tooling/`. The runner recorded each command's exit independently, instead of inferring intermediate success from the final shell status.

| Command | Exit | Actual result |
| --- | --- | --- |
| `pnpm install --frozen-lockfile --ignore-scripts --reporter=append-only` | 0 | Locked isolated dependencies installed; no package lifecycle scripts. |
| `pnpm exec biome format biome.json tsconfig.json quality.spec.ts playwright.config.ts package.json` | 0 | Five fixture files passed formatting after an earlier deliberate formatting pass. |
| `pnpm exec biome lint --error-on-warnings quality.spec.ts playwright.config.ts` | 0 | Both TypeScript fixture files passed lint. |
| `pnpm exec biome lint --error-on-warnings invalid-lint.ts` | 1, expected | Deliberate `any` and unused variable emitted two warnings; the command correctly failed. This verifies warnings cannot silently pass the intended gate. |
| `pnpm exec tsc --project tsconfig.json` | 0 | TS7 strict checking, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, no `skipLibCheck`, including Playwright configuration and test types. |
| `pnpm exec playwright test` | 0 | One real headless Edge test passed. It loaded a synthetic page over loopback, checked its title, focused a button, pressed Enter and observed the resulting status text. Final run: 1.7 seconds total reported by runner. |
| `pnpm audit --audit-level=low` | 0 | No known vulnerabilities reported for this isolated tooling dependency graph at this time. This is not the product dependency graph or a proof of security. |

The browser run emitted a harmless Node warning that `FORCE_COLOR` takes precedence over `NO_COLOR`; it did not affect the test result. No TypeScript, lint or browser incompatibility remained in the tested scope. No product workflow, two-account authorization, accessibility, localization, persistence or offline acceptance was tested here.

## Done When

Achieved for R15: primary-source compatibility and exact pins are recorded, the selected formatter/linter and browser test actually execute with the existing Node/TS versions, failure behaviour is checked, and the canonical script interface uses the installed package manager. The product quality tooling may now be implemented against this decision. Fresh-checkout/CI browser prerequisites and actual product checks still require their own verification; another machine must provide Edge or explicitly install/configure an appropriate Playwright browser before claiming browser coverage.
