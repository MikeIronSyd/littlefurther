# Codex Handover — Capstone Project

## Project Theme
**Learning That Stays With You**

## Purpose of This Handover
This document is the source of truth for continuing the capstone project inside Codex.

The project has completed **Step 0: Track Selection** and is now entering:

> **SDLC Phase 1 — Discovery & Ideation**

Do **not** jump directly into implementation. Continue the discovery and ideation work first, pressure-test the problem and scope, and preserve an evidence trail showing how Codex contributes across the complete software development lifecycle.

---

# 1. Capstone Context

The capstone asks participants to use **AI software development tools, especially Codex, to build a working proof of concept that solves a real learning-access problem**.

The project does **not** need to be an AI-powered application.

The emphasis is on demonstrating effective use of **Codex throughout the full SDLC**, including:

- Ideation
- Discovery and problem framing
- Requirements gathering
- Product planning
- Architecture and technical design
- UX and user-flow design
- Implementation
- Testing
- Debugging
- Code review
- Refactoring
- Security review
- Accessibility review
- Documentation
- Deployment preparation
- Evaluation
- Demo preparation

Codex is the development partner across the lifecycle, not necessarily a feature inside the final product.

---

# 2. Invention Sprint Constraint

This is an **invention sprint, not a product launch**.

The goal is **not** to build production-ready software.

The goal is to create a **working proof of concept** that demonstrates that the idea is:

- Useful
- Viable
- Worth developing further

Scope decisions should therefore favor a convincing end-to-end experience over breadth, polish, or production complexity.

---

# 3. Selected Challenge Track

## Track 2 — Engagement & Staying in the Learning Journey

The project will focus exclusively on this track.

### Track intent
Build a solution that helps learners remain engaged over time instead of starting a learning journey and quietly falling off.

### Core problem territory
Learners may stop because of factors such as:

- Falling behind
- Feeling overwhelmed
- Large or unclear learning goals
- Broken streaks
- Lack of visible progress
- Lack of accountability
- Competing responsibilities
- Poor internet access
- Limited data
- Loss of motivation
- Difficulty restarting after a break

The discovery phase should determine which of these causes matter most for the target learner and how they relate to the proposed MVP.

---

# 4. Current Product Direction

The intended MVP is a single cohesive learning-engagement product containing five connected feature ideas.

These features should **not** become five separate mini-products. They should work together around one central product promise:

> **Help learners keep going, recover when they fall behind, and see meaningful progress without being punished for imperfect consistency.**

## 4.1 Comeback
Helps a learner recover after missed sessions or a longer break.

Possible behaviors:
- Detect missed or incomplete study sessions
- Offer a lightweight restart
- Reduce immediate workload instead of demanding full catch-up
- Preserve completed progress
- Re-plan remaining activities when appropriate
- Make returning feel achievable

Concept principle:

> Falling behind should trigger recovery, not abandonment.

---

## 4.2 TinySteps
Breaks a larger learning goal into small, achievable study actions.

Possible behaviors:
- Short daily tasks
- Estimated time per task
- Adjustable pace
- Reduced workload when needed
- Clear next action
- Avoid overwhelming the learner with the whole journey at once

Concept principle:

> Make the next step small enough that starting feels achievable.

---

## 4.3 StudyCircle
Provides small-group or peer accountability.

Note: the original phrase used was “study cycle.” The working interpretation is **StudyCircle** — a peer/accountability feature — unless the project owner later clarifies otherwise.

Possible behaviors:
- Small study groups
- Weekly commitments
- Check-ins
- Simple peer encouragement
- Shared progress or milestones
- Accountability without public shaming or punitive ranking

Concept principle:

> A learner may be more likely to continue when somebody notices whether they show up.

---

## 4.4 Learning Streaks Without Punishment
Measures consistency without resetting a learner’s sense of progress after one missed day.

Possible alternatives to traditional consecutive-day streaks:
- Study days out of the last 7/14/30 days
- Weekly consistency percentage
- Flexible rest days
- Recovery days
- Personal-best consistency
- Milestones based on cumulative effort

Concept principle:

> Missing one day should not erase evidence of previous effort.

---

## 4.5 FinishLine
Makes progress and the remaining journey visible.

Possible behaviors:
- Percentage complete
- Milestones
- Sessions completed
- Estimated sessions or time remaining
- Visual journey map
- Clear “what should I do next?” action

Concept principle:

> Visible progress helps learners understand that their effort is moving them somewhere.

---

# 5. Operating Constraints

The solution must account for real conditions experienced by the learners it is designed to serve.

These are design requirements, not presentation footnotes.

## 5.1 Quality and Credibility
If the product displays or uses learning materials:
- Information should be accurate
- Sources should be traceable
- Credible sources should be identifiable
- The prototype should not invent learning content or unsupported claims

If the MVP can avoid becoming a content-delivery platform, that may reduce unnecessary credibility complexity.

---

## 5.2 Low Bandwidth and Limited Access
The solution should remain useful for learners with:
- Unreliable internet
- Limited mobile data
- Basic or older devices

Design implications to investigate:
- Mobile-first web experience
- Text-first interactions
- Small payloads
- Minimal heavy media
- Local caching where appropriate
- Offline-friendly or reconnect-friendly behavior
- Graceful handling of interrupted connectivity

Do not over-engineer full offline synchronization unless required for the proof of concept.

---

## 5.3 Accessibility and Inclusion
Consider learners with different:
- Literacy levels
- Disabilities
- Digital confidence
- Device capabilities

Potential design considerations:
- Simple navigation
- Clear language
- Keyboard accessibility
- Semantic HTML
- Sufficient contrast
- Screen-reader-friendly structure
- Large tap targets
- Avoid unnecessary complexity
- Avoid relying only on color to convey status

---

## 5.4 Personalization Without Exclusion
Adaptation can be useful, but the learner should not be trapped by a system-generated profile.

Potential principles:
- Allow learners to change pace
- Allow manual schedule adjustment
- Let users override suggestions
- Avoid assuming one “correct” learning speed
- Do not punish irregular schedules
- Support different study patterns

---

## 5.5 Privacy and Security
The product may contain:
- Learning goals
- Study habits
- Academic progress
- Performance information

Use data minimization.

For the proof of concept:
- Collect only what the core experience requires
- Avoid unnecessary sensitive information
- Protect account/session data if authentication is implemented
- Do not expose peer information unnecessarily in StudyCircle
- Define what is private vs shared

---

## 5.6 Multilingual Access
Learners may use:
- English
- French
- Portuguese
- Arabic
- Local African languages

The prototype does not have to fully translate every language, but the architecture and UX should demonstrate multilingual readiness.

Possible PoC approach:
- Build localization/i18n support
- Demonstrate at least two languages if feasible
- Keep UI copy externalized rather than hard-coded
- Ensure layouts can accommodate varying text lengths
- Consider right-to-left readiness if Arabic is within demo scope

---

## 5.7 Local Relevance
Learning conditions, schedules, institutions, curricula, credentials, and opportunities vary by location.

Because this project is focused on engagement rather than credentials or career matching, avoid unnecessary dependence on country-specific opportunity datasets.

However:
- Do not assume stable electricity or connectivity
- Do not assume unlimited data
- Do not assume a conventional Monday-to-Friday study schedule
- Do not assume every learner has a laptop
- Let learners define their own availability and pace

---

# 6. Current Strategic Decisions

The following decisions have already been made:

1. The capstone will use **Track 2 only**.
2. The product does not need AI features simply because Codex is used to build it.
3. Codex should be used throughout the **complete SDLC**.
4. The project is an invention sprint and should remain a **proof of concept**.
5. The current desired MVP includes:
   - Comeback
   - TinySteps
   - StudyCircle
   - Learning Streaks Without Punishment
   - FinishLine
6. The five ideas should form one coherent learner-engagement experience.
7. The solution must explicitly account for the operating constraints listed above.
8. Formal Discovery & Ideation begins only after track selection; that track selection is now complete.

---

# 7. Important Scope Warning

The five desired MVP features may still be too large for an invention sprint if each is treated as a full subsystem.

During Discovery & Ideation:

- Preserve all five as the intended product direction.
- Identify the **core feature** and supporting features.
- Determine the smallest version of each feature needed to demonstrate the central idea.
- Look for ways the same underlying data model and user flow can power several features.
- Do not add unrelated features without a clear reason.
- Do not turn the product into a full LMS.
- Do not add AI features merely for novelty.
- Do not add large resource libraries unless the engagement experience genuinely requires them.

A likely architecture of product value is:

**TinySteps** helps the learner start manageable work  
→ **StudyCircle** adds accountability  
→ **FinishLine** makes progress visible  
→ **Flexible Streaks** preserve motivation during imperfect consistency  
→ **Comeback** activates when progress breaks

This is a hypothesis to validate during discovery, not a final architecture decision.

---

# 8. Phase 1 — Discovery & Ideation Objectives

Continue from this exact point.

The next phase should produce evidence-based or clearly labeled hypothesis-based answers to the following.

## 8.1 Define the Target Learner
Narrow the primary user.

Explore questions such as:
- University student, secondary-school learner, self-directed learner, certification learner, or another group?
- Mobile-first or laptop-first?
- Studying formal courses, online courses, or both?
- Typical study time and constraints?
- What causes this learner to disengage?
- What does “falling off” look like in practice?

Do not define the target so broadly that the product is for “everyone who learns.”

---

## 8.2 Define the Core Problem
Create:
- A one-sentence problem statement
- A more detailed problem narrative
- Jobs-to-be-done
- Pain points
- Current alternatives/workarounds
- Why those alternatives are insufficient

Separate facts from hypotheses.

---

## 8.3 Identify Drop-Off Causes
Generate and organize plausible causes of learning disengagement.

Potential categories:
- Time
- Motivation
- Difficulty
- Overwhelm
- Connectivity/data
- Lack of accountability
- Broken routines
- Poor progress visibility
- Unrealistic planning
- Life interruptions
- Fear/shame after falling behind

Prioritize the causes the PoC can realistically address.

---

## 8.4 Validate the Five Feature Hypotheses
For each feature, answer:

1. Which learner problem does it solve?
2. What evidence or reasoning suggests the problem matters?
3. What is the smallest useful version?
4. How does it interact with the other features?
5. What operating constraints affect it?
6. What could go wrong?
7. Is it core, supporting, or optional for the demo?

Do not assume every proposed feature is automatically necessary simply because it is currently desired.

---

## 8.5 Define the Core Experience
Find the smallest coherent user journey that demonstrates the invention.

Candidate flow to pressure-test:

1. Learner creates a learning goal
2. Learner defines availability
3. System breaks the goal into TinySteps
4. Learner completes or misses sessions
5. Progress appears in FinishLine
6. Consistency is measured without punitive streak resets
7. StudyCircle provides lightweight accountability
8. If the learner falls behind, Comeback creates a manageable restart

Reduce this flow if necessary to protect sprint scope.

---

## 8.6 Define Success
The proof of concept should demonstrate behavioral/product value, not production-scale metrics.

Potential success questions:
- Can a learner understand what to do next?
- Does the app make a large goal feel more manageable?
- Does the progress model avoid punishing missed days?
- Can a learner return after falling behind without restarting everything?
- Is the next recovery action obvious?
- Is the experience usable on a small mobile screen?
- Does poor connectivity leave the learner with something useful?
- Can users change the plan when life circumstances change?

Later convert these into measurable acceptance criteria.

---

# 9. Codex Working Instructions for Phase 1

Act as a rigorous product and software-development partner.

While continuing Discovery & Ideation:

- Challenge weak assumptions instead of simply agreeing.
- Keep the chosen track fixed: **Track 2**.
- Keep the invention-sprint scope visible.
- Continuously test ideas against the operating constraints.
- Separate:
  - confirmed decisions
  - hypotheses
  - open questions
  - risks
- Avoid premature architecture or code unless needed to assess feasibility.
- Avoid unnecessary AI product features.
- Look for the smallest demonstrable version of the idea.
- Flag scope creep early.
- Preserve an SDLC evidence trail.

For each meaningful decision, maintain a lightweight decision log containing:
- Decision
- Why it was made
- Alternatives considered
- Trade-off
- Whether it is reversible

---

# 10. Required Phase 1 Deliverables

Before moving to requirements or implementation, produce:

1. **Target learner profile**
2. **Problem statement**
3. **Problem narrative**
4. **Jobs-to-be-done**
5. **Top learner pain points**
6. **Drop-off cause map**
7. **Current alternatives and gaps**
8. **Feature-to-problem mapping for all five features**
9. **Core vs supporting feature classification**
10. **Operating-constraint impact matrix**
11. **Primary end-to-end user journey**
12. **Key product assumptions**
13. **Key risks**
14. **Explicit non-goals**
15. **Proof-of-concept success criteria**
16. **Recommended MVP boundary**
17. **Decision log**
18. **Questions that should be validated with potential learners if user research is possible**

Do not proceed to Phase 2 until these are coherent.

---

# 11. Suggested First Codex Task

Start with this prompt:

> We are beginning SDLC Phase 1: Discovery & Ideation for the capstone described in this handover. Track 2 is already selected and must remain fixed. Do not start coding. First, help me define and pressure-test the primary target learner and the exact engagement/drop-off problem we should solve. Use the invention-sprint constraint and all operating constraints as hard design criteria. Separate confirmed decisions, hypotheses, and open questions. Challenge assumptions where necessary. At the end, update a lightweight decision log and recommend the next discovery task.

---

# 12. Project North Star

The product should ultimately demonstrate this idea:

> **Learning journeys should be resilient to real life. A learner should be able to make progress in small steps, see that progress, receive supportive accountability, and recover after falling behind without being made to feel that previous effort has been erased.**

The proof of concept should make that idea tangible.
