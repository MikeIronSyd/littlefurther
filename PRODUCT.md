# Learning-engagement capstone

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

The accepted delivery plan selects Node 24 LTS, Express 5, strict TypeScript/native browser modules with Vite, Better Auth, and SQLite through better-sqlite3. Selection followed comparison with SvelteKit and ASP.NET Core. R11 established host feasibility; R15 added verified compatible Biome and Playwright tooling before production code. P04/P05 implements the first private learning journey; P06 adds Comeback schedule recovery. P07 adds private circles through an additive v2 SQLite schema on the same stack, with no new dependency. Exact versions, implementation boundaries and observed checks are in the research, increment and verification records.

## Users

Learners generally, across formal courses, certifications and independent study. The user explicitly declined a narrower institutional or beginner audience. Concrete demonstrations may use particular learning situations without restricting product eligibility.

## Product Purpose

Help learners identify manageable actions, keep studying, see accumulated progress, receive optional supportive accountability, and return after interruptions. The proof of concept demonstrates this connected experience; improvements in motivation, retention or mastery have not been established.

## Operating Context

Track 2 of the Andela x Miva x OpenAI hackathon. The owner is building solo with reported availability above ten hours per week. The official submission deadline is unannounced; 14 October 2026 is only an internal target. Programme project dates use Africa/Lagos. Learner schedules must respect an explicit local timezone and irregular availability.

The prototype runs in a browser on this PC, with its local server running. P07 implements persisted peer interactions between two real local accounts through voluntary circles and explicit shared copies. Internet-disconnected operation does not imply remote peer access, offline installation, access to external resource sites without internet, or use after the local server stops.

## Capabilities and Constraints

- All five capabilities are committed to one product: TinySteps, Comeback, StudyCircle, flexible nonpunitive consistency, and FinishLine.
- StudyCircle means both a personal study/review cycle and private invitation-only peer circles. Peers share commitments, check-ins and preset encouragement; no full chat is in scope.
- Learners may use curated goal templates or supply topics, study text and source-reference links. Unsupported subject goals use supplied topics or manual steps. No runtime AI, automatic page fetching or PDF extraction is planned.
- English and French are the initial interface languages. Learner-provided text and external resources are not automatically translated.
- The user selected the Amber visual direction, then requested light/dark switching, a collapsible sidebar, topbar utilities and a top-left space for the future app name/logo. Keep brand identity outside the collapsing sidebar. Three standard navigation destinations serve the connected journey; topbar controls include theme, language and account. Use directional panel-toggle icons, not a hamburger.
- Follow the device theme until an explicit light/dark choice. Guard browser storage for non-sensitive theme and desktop sidebar enums only; learner data remains canonical in SQLite. Mobile navigation is a closed-by-default modal drawer with defined keyboard/focus behavior. Detailed requirements and pending checks are F15/F16 and AC11a–AC11f in the specification.
- The9October user decision retains sign-in and simplifies signed-out entry to brand, language and an icon-only moon/sun theme action. Authentication restores the existing navigation/account and saved sidebar preference. Localized next-action labels and hover/focus tooltips replace the visible switch; session clear closes drawer state and restores auth focus after unlock. See AS01–AS06 in `docs/specs/capstone/increments/auth-shell.md` for the scoped contract and its actual verification record for results.
- Learners can edit availability, pace and suggested plans. Comeback previews a uniform calendar-day shift of unfinished dates and applies it only after explicit confirmation against the same plan revision. Completed work, private history, availability and fixed targets remain unchanged; visible conflicts require acknowledgement in the interface. A short restart activity does not automatically complete its whole task.
- Consistency counts study days within a defined calendar window while preserving cumulative activity. Completion is self-reported activity, not proven mastery.
- Private plans, reflections and full histories remain separate from explicit shared commitment/check-in copies.
- Low bandwidth, accessibility, personalization without exclusion, privacy, credible sources, multilingual access and local relevance are requirements.

## Evidence on Hand

The owner supplied briefing slides and `docs/specs/capstone/inputs/CODEX_CAPSTONE_HANDOVER.md`, then clarified the settled choices above in conversation. Their learning experiences are self-reported. Accelerator LMS completion was verified separately on 2026-10-03.

`docs/specs/capstone/spec.md`, its research record and plan are the product authority. The original R01–R12 gate closed at 16:57 Africa/Lagos on 7 October 2026; expanded R01–R14 research closed at 20:14 for the requested theme/navigation scope. The user explicitly selected “I will go with Amber.” The original selected image is approved as a direction; detailed state images remain unapproved elaborations, not behavior evidence. All six desktop/mobile state images have provenance and completed static review in the design record; this does not introduce another approval gate.

Implementation must correct known raster limitations: reclaim the dark collapsed sidebar's wide gutter; preserve `Africa/Lagos` rather than the open mobile image's `Afrique/Lagos`; overlay the unchanged mobile page with one French translation catalogue; make outside modal controls inert without duplicate active utility controls; and implement/verify the intended approximately 80% responsive drawer width. Illustrated focus and portrait framing do not establish accessibility, reflow or native-French validation.

The local P04/P05 app supports account/profile, reviewed plans, study/reflection, explicit completion, retained progress and the Amber shell. P06 implements non-mutating restart previews, explicit atomic confirmation, unchanged-history safeguards and idempotent retries; see the [Comeback contract](docs/specs/capstone/increments/comeback.md) and [increment verification](docs/specs/capstone/increments/comeback-verification.md). P07 adds hash-only, expiring one-use invitations, deliberate immutable commitment/check-in copies, preset encouragement and membership/copy cleanup with private history retained. See [StudyCircle verification](docs/specs/capstone/increments/studycircle-verification.md) for actual checks and outstanding acceptance. P08 full-journey review is next. No measured learner benefit, usability study, verified human adoption or finished video exists.

On 9 October 2026, the user selected **LittleFurther**, unchanged in English/French, and the joined LF concept. The [brand reference increment](docs/specs/capstone/increments/littlefurther-brand.md) and [editable artwork/reference](docs/specs/capstone/designs/littlefurther/README.md) preserve Amber and the existing system typography. Final artwork selection, application integration and overall formal design approval remain pending; the running app retains its provisional name and outlined-square mark.

## Product Principles

1. Preserve evidence of previous effort when life interrupts study.
2. Make the next useful action understandable and adjustable.
3. Keep accountability voluntary and sharing explicit.
4. Present completion, estimates and demonstrated learning honestly.
5. Use one connected learning journey for all five capabilities.

## Accessibility & Inclusion

Plan semantic controls, full keyboard operation, visible focus, accessible feedback, sufficient contrast, readable text and small-screen reflow. Verify both themes, expanded/collapsed navigation, modal drawer focus/resize cleanup, forced colors and reduced motion. English/French layout and error states require verification; technical localization checks do not prove translation quality. A broad learner audience does not imply universal accessibility or compatibility has been verified.
