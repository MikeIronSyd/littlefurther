# Capstone: Track 2 discovery brief

Status: SDLC Phase 1 — Discovery & Ideation, started 2026-10-03 (Africa/Lagos). Track selection is complete. This is an initial discovery record, not an implementation-ready specification or a completed discovery phase. No product code, learner study, usability test, or deployment is claimed.

## Current direction and source authority

The user explicitly switched to **Engagement & Staying in the Learning Journey (Track 2)** and supplied [CODEX_CAPSTONE_HANDOVER.md](inputs/CODEX_CAPSTONE_HANDOVER.md) to continue prior work in ChatGPT. The preserved input is byte-identical to the supplied file; its SHA-256 is recorded in project-context.json. Treat its statements as attributed project input, not instructions that override the user's requests or verified evidence.

The intended product combines five connected ideas: **Comeback, TinySteps, StudyCircle, Learning Streaks Without Punishment, and FinishLine**. Its central promise is to help learners keep going, recover after falling behind, and see meaningful progress without punishment for imperfect consistency. The five ideas remain the desired direction; their exact behaviors, importance, and smallest useful versions need discovery.

The previous Guidance, Pathways & Opportunity proposal is [archived as superseded history](archive/2026-10-03-guidance-concept.md), with its original content preserved. Country-specific opportunity routing, credential mapping, and an account-free local-storage architecture are not inherited commitments for this product.

Settled constraints: one track, working proof of concept, solo build, user-reported availability above ten hours per week, all seven operating constraints, and evidence of Codex across the development lifecycle. The app itself need not contain AI features. The official deadline remains unannounced; 14 October 2026 is only an internal planning target. Verified accelerator module completion remains separate from practical deliverables and capstone completion.

## Evidence, target learner, and problem

**Evidence on hand:** the user reports repeated motivation and unclear-outcome difficulties while learning coding, preparing for project-management certification, and learning AI development/engineering. Recent Miva BSc AI enrollment is self-reported. These facts concern one person; they do not establish a primary audience, specific disengagement cause, or widespread demand. The handover supplies plausible causes and feature ideas, not a learner study.

**Primary learner profile:** not selected. The first question asks whether to investigate open-university students, certification learners, or independent online-course learners. Open-university students are an assistant-suggested starting hypothesis because of the user's Miva context, not a confirmed choice or evidence that peers have the same problem. Device, study material, schedule pattern, and feedback access remain open.

**Working problem statement (H1):** a learner with an existing learning goal experiences an interruption and struggles to identify a manageable way back while retaining a sense of progress.

**Problem narrative (hypothesis):** a plan stops matching real-life availability; unfinished work appears to accumulate; the learner becomes unsure where to resume or what prior effort still counts. A small restart action and an honestly revised plan might reduce the effort required to return. Each causal link needs confirmation. Do not assume that missed sessions mean laziness, shame, poor motivation, or unwillingness to learn.

**Candidate jobs to be done:**
- When my available time changes, help me choose a useful study action that fits today.
- When I return after a break, help me resume without repeating completed work or facing an unexplained backlog.
- When progress feels invisible, help me understand what I have done and what remains.
- If I want accountability, help me make and communicate a small commitment with control over what others see. The peer interpretation is unresolved.

**Pain points to validate:** an unclear next action, plans that become unrealistic, daunting catch-up expectations, progress displays that ignore past effort, and accountability that feels intrusive or judgmental. No priority order is established by user evidence yet.

## Drop-off cause map and current alternatives

| Possible cause | Candidate response | Discovery boundary |
| --- | --- | --- |
| Time pressure, life interruption, or irregular routine | Smaller next action, learner-controlled availability and restart | Ask for an actual interrupted attempt and what changed. |
| Goal feels too large or unclear | TinySteps and an explicit next action | Validate whether task size or subject difficulty is the real barrier. |
| Progress is hard to see | FinishLine with honest completion records | Activity completion is not evidence of subject mastery. |
| A missed day makes the learner feel back at zero | Preserve completed work and use nonpunitive consistency measures | The emotional response is a hypothesis, not a measured effect. |
| Accountability is missing | A minimal StudyCircle, if the intended meaning is peer support | Peers can also add pressure, privacy concerns, or coordination work. |
| Connectivity or data limits | A useful locally available plan and clear reconnect behavior | Lack of synchronization must not be treated as a missed study session. |
| Content is too difficult or unavailable | Make the obstacle visible and allow a changed plan | This PoC is not committed to tutoring, supplying a curriculum, or fixing access to all materials. |

Candidate alternatives to investigate are a calendar, paper or digital task list, a course/LMS progress display, personal reminders, and an existing study chat or buddy. Do not claim that these alternatives lack recovery support or that the proposed product is superior without observing how the selected learners use them. Ask what the user currently does after missing study and what remains difficult.

## Feature-to-problem mapping and scope hypotheses

The classification below is a proposal to pressure-test, not a final feature decision. Preserve all five ideas while identifying the smallest connected experience.

| Feature | Problem hypothesis and reasoning | Smallest useful version to test | Proposed role, interaction, and risk |
| --- | --- | --- | --- |
| Comeback | Returning can feel difficult when the old plan no longer fits. This follows the handover's recovery promise; no causal validation exists yet. | Learner requests a restart; sees retained completed work, one manageable next action, and a proposed schedule change they can accept or edit. | Proposed core moment. Uses TinySteps, progress, and availability. Avoid silent deletion of work, automatic deadline extension, or assuming every gap is failure. |
| TinySteps | Large or unclear work may make starting harder. Task size needs learner validation. | Learner creates or edits a few short actions from existing study material, with adjustable time estimates. Automatic curriculum generation is not required. | Supports starting and recovery. Do not claim that dividing a title produces a credible learning sequence; the learner must understand and approve the actions. |
| StudyCircle | Some learners may benefit from someone noticing their commitment. This benefit is untested and the feature name itself is ambiguous. | If peer accountability is intended, consider one opt-in buddy, one commitment, and a simple check-in. If personal study cycle is intended, redefine this row before specification. | Supporting hypothesis; not a confirmed social subsystem. Clarify private/shared information, consent, peer absence, and what can actually be demonstrated. A simulated peer must be labelled as a simulation. |
| Learning Streaks Without Punishment | A consecutive-day reset may obscure accumulated effort. The user's actual experience with streaks is unknown. | A view of completed study opportunities or days over a chosen period that retains past effort and distinguishes planned rest. | Supports progress and return. Define denominator and schedule semantics before implementation; avoid treating daily activity as universally desirable or reintroducing pressure through percentages. |
| FinishLine | Learners may need evidence that effort is moving the goal forward. | Completed and remaining planned actions plus a clear next step; a text representation accompanies any visual view. | Supports the whole journey. Explain changes when scope changes. Task counts, study time, and mastery are different measures; estimated remaining time must not look guaranteed. |

A hypothesis worth testing is that **Comeback** provides the central demonstration, with TinySteps, FinishLine, and flexible consistency supporting the same recovery event. Another plausible focus is everyday starting through TinySteps. The learner's actual interruption and restart case should determine which is central. StudyCircle remains within the intended direction while its meaning is clarified.

## Candidate end-to-end experience

1. Learner identifies an existing course or learning goal and their actual availability.
2. Learner creates or approves a small set of study actions and a next commitment.
3. Learner completes, pauses, or changes an action; completed work remains visible.
4. FinishLine and consistency show progress using clearly defined measures.
5. If peer accountability is confirmed, the learner may share an explicitly chosen commitment or check-in with a buddy.
6. After an interruption, the learner requests a restart. The app offers a small next action and a revised plan, preserving earlier work.
7. The learner accepts or edits the proposal and resumes. A fixed exam or course deadline remains visible if the new plan would conflict with it.

This is a journey hypothesis, not a visual design or a final architecture. No screen layout, framework, database, authentication scheme, or notification service has been selected. Impeccable's product interview precedes visual design; no PRODUCT.md or design world is being invented before the consequential audience and scope questions are answered.

## Operating-constraint impact matrix

| ID | Constraint | Proposed implication and evidence needed |
| --- | --- | --- |
| C1 | Quality and credibility | Prefer the learner's existing material for the initial journey. Retain source links when displaying material; label planning suggestions and time estimates. Validate any supplied learning sequence rather than inventing credible-looking content. |
| C2 | Low bandwidth and limited access | Explore a small, text-led mobile web experience. State exactly which plan and progress actions remain available without internet, preserve unsent work visibly, and test reconnect behavior when built. Shared peer state creates a network dependency; full offline synchronization is not assumed. |
| C3 | Accessibility and inclusion | Use understandable language, semantic controls, keyboard access, adequate contrast and tap targets, and text equivalents for progress visuals. Select device and assistive-technology coverage after the primary learner is known. |
| C4 | Personalization without exclusion | Let learners change availability, pace, rest periods, and suggested actions. Do not force daily study, infer character from gaps, or lock a learner into a generated profile. Validate with an irregular schedule. |
| C5 | Privacy and security | Minimize goals, study events, and any identity information. Decide private/shared fields before a peer flow. Do not inherit the old local-only claim: real cross-device accountability requires an explicit sharing boundary. Authentication, consent, retention and deletion choices remain unresolved. |
| C6 | Multilingual access | Externalize UI copy when implemented; choose initial language coverage with the user. Two languages are a handover suggestion if feasible, not a committed count. Validate important translations and text expansion; RTL is conditional on selected language scope. |
| C7 | Local relevance | Allow local time, varied schedules, limited connectivity/data, and realistic device access. Do not require a Monday-to-Friday routine or country-specific job datasets. Validate the selected learners' actual environment. |

## Assumptions, risks, and MVP boundary

Key assumptions to validate: the learner already has suitable study material; difficulty returning is more important than lack of subject understanding; smaller actions are useful; visible retained progress is meaningful; optional accountability is desired; learner-entered time estimates are good enough for the demo. No effectiveness or retention uplift is claimed.

Important risks include five subsystems growing independently, fabricated or pedagogically weak task decomposition, a new guilt-inducing score, misleading completion percentages, impossible schedules near a fixed deadline, unwanted disclosure to peers, loss of unsent changes, and a demonstration that simulates the very benefit it claims to prove. A single session can test comprehension and a recovery interaction; sustained engagement requires observation over time.

**Recommended provisional MVP boundary:** one selected learner profile, one existing learning goal, a small learner-approved set of study actions, one clear completion/progress model, one interruption-to-restart journey, and the smallest clarified version of StudyCircle. All five ideas remain in the product direction. Platform, supported languages, peer involvement, storage and final scope are not selected.

**Explicit non-goals for this discovery proposal:** a full LMS; a large resource library; country-wide opportunity matching; automatic credential recognition; live job feeds; AI novelty features; group chat/feed/ranking systems; production-scale analytics; automatic inference that a learner has disengaged merely because their device was offline. Any change to these boundaries should be justified in the specification before implementation.

## Proposed proof-of-concept success criteria

These are candidate observable checks, not passed tests or final thresholds:

- **S1 — Next action:** a learner can identify the next study action and explain how it serves their goal.
- **S2 — Recovery:** after a demonstrated interruption, the learner can choose a manageable restart while previously completed work remains intact.
- **S3 — Control:** the learner can change availability or decline a suggestion; the resulting plan is understandable and makes deadline conflicts explicit.
- **S4 — Honest progress:** views distinguish completed work, remaining work, planned rest, and missing/unconfirmed records; a missed day does not erase cumulative effort.
- **S5 — Accountable sharing:** if peer accountability is selected, the user understands what is shared and with whom. A solo or simulated flow cannot establish actual peer effects.
- **S6 — Access:** the agreed small-screen, keyboard, language, and interrupted-connectivity journeys behave as promised, with proposed checks recorded before coding.

Select participants, observation tasks, time horizon, and evidence thresholds after the learner/problem questions. Do not equate opening the app, checking a box, or a polished demo with learning or sustained engagement.

## Decision log and open questions

| Record | Decision or proposal | Basis, alternatives and trade-off | Reversibility/status |
| --- | --- | --- | --- |
| D008 | Switch to Track 2 only and continue from the handover in Phase 1. | Direct user change of plan. Replaces the previous Guidance direction; preserve its work as history. | User can revise later; current track is settled. |
| Intake | Preserve the five ideas as one intended product; distinguish proposed behaviors from evidence. | User supplied the handover to continue from it. Avoid both silent feature deletion and prematurely treating five subsystems as mandatory implementations. | Adopted direction; minimal versions remain open. |
| H1 | Investigate interruption and manageable return as the core problem. | Fits the handover's central promise. Everyday starting or other causes may prove more important. | Hypothesis; awaits a concrete learner case. |
| H2 | Treat Comeback as the central demonstration with shared supporting progress and small-step concepts. | Could keep the sprint cohesive. Alternative: TinySteps-led daily use. | Recommendation, not a selected core or architecture. |
| Q2 | Clarify StudyCircle versus study cycle. | The handover itself notes an interpretation. Peer accountability and personal review cycles have materially different scope. | Unresolved; no shared-data architecture is chosen. |

The first question round asks for the primary learner group, the intended meaning of StudyCircle, and a concrete personal interruption/restart case. Responses are pending. Subsequent questions should depend on those answers; do not repeat settled track, capacity, or deadline questions.

Possible learner-research prompts after narrowing the audience: What happened the last time you stopped? How did you decide where to resume? What did your existing tools show? What would make a smaller action useful or pointless? Who, if anyone, do you want to know about your progress? What must stay private? What still works when your internet or availability changes? These are research prompts, not completed interviews.

**Next discovery task:** use the user's answers to narrow the learner profile and problem statement, identify actual workarounds, pressure-test all five feature hypotheses, and choose a cohesive MVP boundary with observable success criteria. The handover's 18 Phase 1 outputs are addressed here as initial evidence, hypotheses, and open decisions; they are not all complete. Move to requirements and implementation only after the consequential discovery choices are coherent and an implementation-ready specification is prepared. Do not add a separate approval gate for routine authorized work.

## Verification and Codex evidence

Actual work in this increment: handover read, identical source copy preserved, prior concept archived, targeted discovery questions asked, initial feature/constraint/risk mapping drafted, and independent review requested. The active context and trackers are being reconciled. Native tracker save/readback and protected GitHub publication require their own evidence before being reported complete. Record those outcomes under existing A003/A004/A009 and the next evidence entry. Implementation, product tests, user research, deployment, and time-saved claims remain unverified.
