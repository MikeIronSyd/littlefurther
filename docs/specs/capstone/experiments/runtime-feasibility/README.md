# Isolated runtime feasibility evidence

## Goal

Preserve the 7 October 2026 research experiment for the selected Windows/Node stack. This is a synthetic authentication/database fixture, not capstone application code.

## Context Pointers

[REPORT.md](REPORT.md) records the findings and failed attempts. [verification.json](verification.json) records final commands, timestamps, exit codes and eight input hashes. [latest-result.json](latest-result.json) contains 35 assertions and cleanup results; `check-logs/` contains the final command outputs. Paths in those records identify the original ignored research workspace.

## Constraints

The eight reproduction inputs are `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `fixture.ts`, `vite.config.ts`, `web/index.html`, `web/main.ts` and `run-checks.ps1`. They are byte-for-byte copies of the recorded inputs. Temporary databases, dependencies and builds are excluded.

To reproduce without overwriting this dated evidence, copy only those eight inputs, preserving the `web/` directory, into a new ignored `.local/research/` directory. Run `run-checks.ps1` there with the documented Node and pnpm versions. Its optional `-Node` and `-Pnpm` arguments accept executable paths; defaults point to this PC's bundled runtime. Installation needs network access and downloads dependencies with lifecycle scripts disabled. The HTTP fixture binds loopback only and uses generated synthetic credentials.

The fixture creates local synthetic authentication databases in `runs/`; keep those private and excluded from source. Do not publish dependency folders or compiled output. No learner data or external account credentials are needed.

## Done When

The frozen install, strict compiler, fixture and Vite build each exit zero. Inspect the new run's results independently; this preserved run does not establish browser behavior, product authorization, disconnected use, a clean-machine install, process/machine restart, learner outcomes or product acceptance.
