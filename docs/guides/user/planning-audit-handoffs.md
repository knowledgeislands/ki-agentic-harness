# Planning-only audit and handoff prompt

The reusable pattern is a "deep audit to implementation-ready roadmap" request. It does not depend on legal work, Knowledge Islands, Streams, or even a software repository.

This is a reusable request template, not a competing planning standard. The `ki-repo-roadmap` and `ki-handoffs` skills remain the normative sources for repository plans and cold-agent handoffs.

## Generic principles

- Inspect the existing system thoroughly before proposing changes.
- Define an explicit scope and exclusions.
- Separate planning from implementation: change only the planning artefacts.
- Identify what already works and should be preserved.
- Find duplication, conflicting ownership, stale state, unclear status, and missing structure.
- Establish a target operating model with clear responsibilities and sources of truth.
- Record reasoning and rejected alternatives so implementers do not reopen settled decisions.
- Separate judgment-heavy decisions from mechanical execution.
- Decompose the migration into dependency-ordered, bounded plans.
- Make each plan executable by a cold, lower-reasoning agent.
- Include exact inputs, outputs, boundaries, escalation conditions, and pass/fail checks.
- Preserve existing information until a conservation or migration manifest proves nothing will be lost.
- Test the plans by giving them to someone without the original context.
- Continue around non-blocking uncertainty; record unresolved areas as explicit follow-up work.
- For long work, write regular checkpoints and create recoverable commits where appropriate.

## Reusable prompt

```text
I want a deep, planning-only audit of [topic, system, repository, process, or body of work].

The priority scope is:

- [area one]
- [area two]
- [shared or cross-cutting areas]

The following is out of scope:

- [exclusions]

Start by examining the current structure, conventions, documentation, workflows, status information, and active work. Spend enough time scanning to understand how the system actually operates, including places where practice differs from the documented model.

Do not implement the proposed changes. You may create or update only the dedicated planning footprint at [location or output format].

Before the main audit, raise any genuinely important questions or permission requirements. After that, work autonomously. If something cannot be resolved, continue with the parts that can be completed and record the unresolved area, its impact, and the follow-up needed.

Produce:

1. A proposal explaining:
   - what is working well and should be preserved;
   - what is unclear, duplicated, stale, overloaded, or missing;
   - the underlying causes rather than only the symptoms;
   - the recommended target model;
   - clear ownership and source-of-truth boundaries;
   - rejected alternatives and why they were rejected;
   - risks, safeguards, and migration principles;
   - measurable acceptance criteria.

2. A dependency-ordered roadmap showing:
   - foundational decisions and governance first;
   - work that can run concurrently;
   - migration and consolidation stages;
   - integration, cutover, and final acceptance;
   - anything deliberately deferred or out of scope.

3. A set of implementation-ready plans suitable for cold, lower-reasoning agents.

Each plan must state:

- the outcome and definition of done;
- dependencies and blockers;
- locked decisions that must not be reopened;
- questions that must be escalated;
- exact permitted inputs, outputs, and change boundaries;
- ordered implementation steps;
- which steps are judgment-heavy and which are mechanical;
- safe parallelisation and file or ownership boundaries;
- conservation or rollback safeguards;
- objective pass/fail verification;
- the handoff package for the next plan.

Do not let implementers infer unknown state, silently expand scope, or discard existing information. Unknowns must be verified, escalated, or explicitly preserved.

Test at least the foundation plans by giving them to a cold lower-tier reviewer with no inherited context. Revise them until that reviewer can execute them without rediscovering the architecture.

For a long-running filesystem task, write progress to the planning artefacts regularly and make stable, explicitly scoped checkpoint commits where authorised. Do not include unrelated changes.
```

A useful short name for this style of request is **planning-only architecture audit with cold-agent implementation handoffs**.
