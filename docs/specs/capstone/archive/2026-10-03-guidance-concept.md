# Capstone: blended concept proposal

Status: concept proposal dated 2026-10-03 (Africa/Lagos). The track and blended vision come from the user's request. Recommendations below are proposed design refinements, not implemented or verified product behavior. This is not yet an implementation-ready specification: first country, target, entry route, languages, audience, stack, and assessment details remain open.

## Purpose and selected track

Guidance, Pathways & Opportunity is the single selected track. Help a learner understand where their current knowledge can take them, what a relevant local goal requires, and which practical steps connect the two.

Blend the user's personal guidance concept with the skill-mapping and opportunity-router idea they supplied. Recognise formal, informal, and offline learning; relate it to real skills, courses, credentials, jobs, gigs, or university requirements; create a staged learning and practice path with visible evidence of advancement.

The user is the firsthand discovery participant, having described coding, certification preparation, AI development/engineering, and recent BSc AI enrollment at Miva. Enrollment is self-reported. A broader product audience and evidence of demand have not been established. The discarded self-taught-beginner framing is not a requirement.

## Blended journey

The wider vision has two entry routes: start with a goal/opportunity, or start with existing knowledge/current study and explore possible opportunities. Choose one entry route for the first prototype.

1. **Choose context and destination.** Record the learner's country and goal, or present a small set of relevant sourced opportunities to consider. Nigeria, Kenya, and Senegal are examples from the supplied idea, not selected launch countries.
2. **Establish the baseline.** Let the learner describe existing knowledge, study, and experience, including offline learning. Proposed refinement: distinguish self-reported ability, demonstrated ability, and unknowns; allow corrections and an accessible way to proceed without uploaded credentials.
3. **Explain the match and gaps.** Compare the baseline with actual requirements for the chosen opportunity. Show the source, region, and date of the requirement, and explain the mapping. Distinguish learning gaps from formal qualifications, experience, applications, examinations, fees, or other requirements that lessons alone do not satisfy.
4. **Build the path.** Give ordered milestones with prerequisites, the reason each matters, credible free learning resources, a practical task, and a clear completion criterion. Label any certification or examination cost separately from free learning access.
5. **Make progress visible.** Pair the visual roadmap with an accessible text checklist. Proposed refinement: completing a resource and demonstrating a skill are separate records. Show what the learner has demonstrated, what remains, and the next action.
6. **Prepare for the opportunity.** Offer relevant practice or preparation for the selected target, such as an interview response, portfolio exercise, application checklist, or assessment. Feedback should refer to the target's requirements and the learner's evidence.

The motivation hypothesis is that understandable milestones and visible links to a valued outcome help learners continue. This has not been validated. Do not promise employment, admission, certification, or interview success from checklist completion.

## Proposed first proof of concept

Prove one complete journey in one country for one target family, using a small, manually verified pack of requirements and resources. Include a short baseline activity, an explainable gap map, a staged plan, at least one practical demonstration, and saved progress. Keep the wider goal types and country expansion in the vision until scoped.

An account-free browser prototype is proposed by the user. A feasible local-core approach is to bundle a small requirements/resource pack and run the matching and progress logic in the browser. This proposal does not require hosted AI for core operation. AI-assisted development remains evidenced through Codex's actual planning, implementation, review, and documentation work.

Live job feeds, arbitrary institution coverage, automated recognition of credentials, large-scale resource scraping, and a comprehensive career-discovery engine are not committed MVP scope. Choose the precise supported target and data before implementation.

## Operating constraints and proposed verification

| ID | Required consideration | Proposed observable behavior and verification |
| --- | --- | --- |
| C1 | Quality and credibility | Every opportunity requirement and learning resource has a traceable source, checked date, and region. Distinguish sourced requirements from inferred skill mappings; flag unsupported or outdated items. Verify each item in the pilot pack and each claimed free-access condition. |
| C2 | Low bandwidth and limited access | After an initial successful load, the saved path, bundled baseline/practice content, and progress remain usable without a connection. Mark external resources that need internet. Test offline reload and progress persistence on the agreed basic-device/browser profile; set transfer budgets after scope is known. |
| C3 | Accessibility and inclusion | Provide a semantic text equivalent for the visual route, plain-language instructions, keyboard operation, and understandable state/error feedback. Test with the agreed assistive-technology and device coverage. Avoid requiring a CV, formal credential, or a single standard learner profile to start. |
| C4 | Personalization without exclusion | Learners can correct the baseline and adjust pace or goals. Explain uncertain matches and allow a useful path when evidence is incomplete. Test a learner with informal experience and one with missing baseline information. |
| C5 | Privacy and security | Proposed core has no required account and stores minimal learner state locally, with export/import and clear-data controls. Disclose shared-device and deletion limitations. Inspect network requests to verify the promised local-data boundary. If an external AI/API feature is added, document the exact data sent and obtain a meaningful opt-in. |
| C6 | Multilingual access | Choose and state initial supported languages, separate interface text from content, preserve original source provenance, and make fallback/untranslated content explicit. Review important translations and test text expansion and right-to-left behavior when applicable to the selected languages. |
| C7 | Local relevance | Country/region-specific requirements come from actual employers, credential bodies, or institutions, with dates and applicability. Do not treat a regional name in a prompt as evidence. Test the chosen pilot target against its original source and keep an expired job separate from a reusable role-preparation path. |

These checks are planned, not passed. Convert them into concrete acceptance tests after the pilot scope and implementation are defined.

## Browser storage and offline boundaries

The user's LocalStorage suggestion can support small browser-local state, but it is not itself a privacy, encryption, or offline-app guarantee. OWASP advises against sensitive data in local storage because scripts executing in the origin can access it and an XSS flaw can expose it. Minimise stored data and treat saved content as untrusted input. [OWASP HTML5 storage guidance](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)

LocalStorage normally persists across browser sessions, while private-session data is cleared when the last private tab closes; browser policy can prevent persistence. Its behavior on file URLs is undefined, so do not assume opening a raw HTML file provides dependable storage. Provide clear save-failure handling and export/recovery behavior. [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

Offline reuse requires deliberate availability of the app and the needed data, for example an app cache managed by a service worker plus a bundled requirement pack. Service workers run in a secure context such as HTTPS or localhost. External learning resources, opportunity refreshes, and hosted inference remain online operations unless explicitly provided offline. Browser-local processing and data-flow verification determine what can truthfully be called local. [MDN service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)

Show when the app and selected pack are ready for offline use. Loading a hosted app or refreshing a pack still involves network access even if learner records stay local. Exported files are separate copies and are not removed by clearing browser data.

Final choice of LocalStorage, IndexedDB, cache strategy, and any optional online features remains an implementation decision to specify. Do not claim unsupported encrypted storage, continuous synchronization, durable backup, offline access to linked websites, or local execution of a hosted model.

## Decisions before implementation

- First country, concrete target opportunity/goal, and initial learner group or tester profile.
- First entry route: a known goal or exploration from current skills/study.
- Initial supported languages and practical device/accessibility test coverage.
- Baseline evidence, practical assessment criteria, and the small verified requirements/resource pack.
- Platform/stack and deployment choices; exact local/offline boundary and any optional external-service budget.
- Feedback participants and meaningful success measures. Do not infer learning gains or time saved from the existence of the prototype.

The official submission deadline is unannounced. 14 October 2026 is only an internal planning target. Solo capacity is above ten hours per week as reported by the user; it is not measured effort.

## Codex evidence and next increment

Actual evidence so far includes the user's supplied concept, tracker decisions, this synthesis, and a technical review against primary browser/security documentation. Product implementation and learner validation have not occurred.

Next: narrow the pilot, convert this proposal into an implementation-ready specification and ordered plan, implement one journey, and verify C1-C7 against concrete acceptance criteria. Capture actual Codex contributions in planning, building, independent review, checks, and documentation. A reusable requirements/resource-pack validation skill is a possible project-specific workflow to scope later; it has not been created. Maintain all activity evidence in the existing Miva Sheet and Kaneo tasks.
