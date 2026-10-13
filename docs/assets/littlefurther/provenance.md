# Presentation asset provenance

## Goal

Provide a reproducible gallery without confusing actual interface captures with research results or visual mockups.

## Context Pointers

The selected A Original [master](../../specs/capstone/designs/littlefurther/mark.svg) is preserved. Lockups reuse its exact `M5 7V25H17V7H27M17 15H25` path, rounded 4-unit strokes and Segoe UI semibold. Light uses ink `#14263d` throughout (monochrome); dark uses Amber `#f2b52d` for the mark and `#e2eaf4` for the name. No font or dependency was added.

The [layout reference](layout-reference.html), [desktop](layout-desktop.png) and [320px](layout-mobile.png) boards were rendered and inspected before README rewriting. They are composition references with labelled placeholder frames, not app screenshots. GitHub controls final typography/layout.

## Constraints

All eight gallery images are **actual application interface, synthetic demo data, mocked AI/search responses**. Captured13October2026, Africa/Lagos; exact UTC timestamp/hashes are in the [receipt](capture-receipt.json). Source revision `3e81617e7ad41fa240bd7deeb42ff316e08cd5a5`; product implementation `98372ac41150dc50ad66dc08ecde289794aa3169`. Edge via Playwright1.63.0, desktop1280×960/mobile320×720 viewports. Full-page/focused-element captures retain actual dimensions below. No app restyling was used.

[The harness](capture.mjs) invokes compiled `createApp` with a fresh ignored SQLite directory on127.0.0.1:4320 and injected synthetic provider fetch. It never invokes the production credential loader, opens ordinary `.local/data` or contacts OpenAI. Five mocked responses cover plan search/draft, study/reflection, Comeback and circle wording. **Zero live provider requests**; no user records used. The separate server closes after capture; its database remains ignored.

Fixtures: Demo learner and Demo peer with unique `example.test` login identifiers; goal “Build my first web page”; three steps (heading5minutes, paragraph10, review10) dated13/15/17October. Mock search returns the MDN heading/paragraph URL with listed/cited evidence. These labels, source timestamps and prose are fixture metadata, not live source-quality evidence. One5-minute study with a typed reflection is saved separately from its completion. The first step is complete for dashboard/mobile. Real local invitation redemption, explicit preview/share and peer preset encouragement produce the circle. The final two completions use authenticated server routes to produce FinishLine. Learner-authored text remains English when the UI switches to French.

| Capture | Actual pixels | State / crop |
| --- | --- | --- |
| `dashboard-light.png` | 1280×1729 | Full saved dashboard after study and first-step completion. |
| `dashboard-dark.png` | 1280×1681 | Same saved data in dark mode after reload; transient save notice is cleared. |
| `planning.png` | 780×1758 | Focused plan-help panel; suggestion not yet applied/saved. |
| `study.png` | 780×1034 | Focused study form with optional current reflection consent, suggestion and explicit Save. Completion control is outside this crop. |
| `comeback.png` | 1040×1420 | Main workspace with advice/date controls; no date confirmation. |
| `circle.png` | 1040×887 | Main workspace; two synthetic local members and explicit shared copy/encouragement. |
| `finishline.png` | 1280×1685 | Full completed-plan state; self-reported activity, not mastery. |
| `journey-mobile-fr.png` | 320×2838 | Successful saved French dashboard; no horizontal overflow. |

Initial harness attempts failed on a missing Origin header, incorrect circle locator and French plural expectation. These capture-harness mistakes were corrected without production edits. Independent review found transient button-text loss in theme captures. The harness waits for font/layout/transition completion, uses software rendering and reloads the saved dark view before capture. Final execution and confirmation are recorded in presentation verification/review. No failed capture is presented as a successful workflow.

## Done When

Reproduce from the root after building: `node docs/assets/littlefurther/capture.mjs`. Keep port4320 free and Edge installed. Dates/source observation times follow execution; exact byte replication is not promised. Fixtures and receipts establish provenance, not educational effectiveness, production readiness or a finished video.
