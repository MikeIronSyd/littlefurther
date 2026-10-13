# Contextual AI — bounded application review, 13 October 2026

## Goal

Review the six connected AI actions in LittleFurther's existing Amber interface, preserving manual work, English/French, source traceability and explicit learner decisions. This uses Impeccable, the companion accessibility checklist and learning-journey-review. Future AI-surface human approval is not inferred from D016.

## Context Pointers

The [contract](../increments/ai-assistance.md) and [verification](../increments/ai-assistance-verification.md) distinguish preparation from product evidence. Six precode boards in [reference.html](../designs/ai-assistance/reference.html) were inspected before frontend implementation; their pixels are synthetic proposals. The eight `app-*.png` files below are actual running application captures from isolated Edge/Playwright tests with deterministic AI responses. They contain synthetic accounts/material, not ordinary learner data or live model prose.

Root inspected all eight captures in one bounded batch on13October14:22–14:23Africa/Lagos. No blocking visual correction was found; no additional polish loop was performed.

| Actual capture | Evidence and scope |
| --- | --- |
| [Plan](../designs/ai-assistance/app-plan-desktop-light-en.png) | Desktop light EN, generated first segment, clickable per-step and global source records, review versus save. |
| [Editor](../designs/ai-assistance/app-editor-mobile-dark-fr.png) | 320px dark FR, retained editable input, explicit source failure, association/removal and manual save controls. |
| [Enlarged editor](../designs/ai-assistance/app-editor-mobile-dark-fr-enlarged.png) | 320px with200%root text, full name wrapping and controls without horizontal overflow. Long page is expected; native date/selected-option text may scroll within controls. |
| [System colours](../designs/ai-assistance/app-editor-mobile-fr-forced-colours.png) | Same enlarged FR editor with forced colours and reduced motion, system boundaries and reachable controls. |
| [Study](../designs/ai-assistance/app-study-desktop-light-en.png) | Smaller-step and selected-reflection help; manual Save and completion remain separate. |
| [Comeback](../designs/ai-assistance/app-comeback-desktop-light-en.png) | Advice is distinct from deterministic date preview and retained work. |
| [Progress](../designs/ai-assistance/app-progress-desktop-light-en.png) | Advisory recap alongside deterministic counts and consistency, without mastery assessment. |
| [Circle](../designs/ai-assistance/app-circle-desktop-light-en.png) | Own draft disclosure, AI wording and earlier preview; acceptance invalidates that preview before separate sharing. |

## Constraints

The root also exercised the actual Chrome app through browser MCP at loopback4319 with an isolated database and injected synthetic provider: account/profile, AI plan EN then FR, Apply→review→Save, source associations, study/smaller-step help, keyboard-selected reflection consent, retained earlier reflection and deliberate study Save. Source observation date/evidence/accessibility names retranslated. Comeback and progress requests were operated; remaining outcomes are supported by the executed automated cases rather than an invented Chrome observation. No external API request occurred in this review.

Actual Chrome desktop was1050×652 with1035px content; the requested320×740 viewport had305px content after its scrollbar. Both had `scrollWidth === clientWidth`. AI desktop actions measured45.33px high, with widths175.35–211.43px; mobile FR actions were248.67px wide and45.33/69.33px high. The22px checkbox itself is wrapped by the existing larger consent-label target; it is not a22px whole touch target. One browser-MCP checkbox click failed to toggle during reflow; a fresh state inspection and keyboard Space succeeded. The isolated Edge checkbox tests pass; no reproducible product defect is inferred from that tool attempt.

Sampled actual AI-panel foreground/background contrast is12.49:1 in light mode (`#392a0c` on `#fff2d0`) and12.20:1 in dark mode (`#fff0c6` on `#342c18`). Colours came from actual computed styles and ratios use WCAG relative luminance. Other existing theme/control contrast and targets remain covered by the full regression suite. This is sampled evidence, not exhaustive conformance.

Chrome screenshot capture twice timed out waiting for `Page.captureScreenshot` at5seconds, desktop then mobile. No Chrome proof image is claimed. The eight actual Edge captures were obtained with the test-only `CAPSTONE_AI_CAPTURE=1` option, followed by four passing AI browser cases in40.6seconds; they are not screenshots of the user's ordinary account. Physical devices, native-French review, every action×theme×locale×size combination, long-term outcomes and production readiness remain unverified.

## Done When

Bounded source/pixel/DOM review has no remaining scoped blocker. The four affected browser cases pass, including keyboard activation, explicit privacy selection, source save/reload, held Save/Share races, cancellation/failure/stale/session behavior, EN/FR320px, enlarged text and accessibility preferences. The full94-case browser suite passed separately. Human AI-surface review and the timed judging demo remain separate deliverables.
