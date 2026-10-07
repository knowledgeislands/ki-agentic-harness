---
name: ki-design-loop
ki-kind: process
ki-applicability: invocation-only
ki-depends-on: []
ki-optional-depends-on: [ki-decision-records, ki-delegation]
description: >
  Shape a new Project, Initiative or cross-cutting model before any work record exists, through a brief, independent
  reviews, one merged report, the owner's decisions and a piloted rollout, with every artefact committed beside the
  subject's Project or Initiative. Use when the shape itself is undecided; use `ki-next` to capture or select known work, `ki-plan` to
  ready one record, and `ki-design-inspiration` for website visual design.
argument-hint: 'start <subject> | resume <subject> | help'
---

# ki-design-loop

**Kind:** process. Runs one design from an owner's proposal to approved decisions and a rollout of ordinary work records.

Read [the design-loop standard](references/standards-design-loop.md) before acting. Start each artefact from its template: [brief](assets/brief.md), [review](assets/review.md), [merged report](assets/report.md) and [decisions](assets/decisions.md). [Source notes](references/sources.md) record the worked exemplar.

## When to use it

Use the loop when the owner has a proposal for something whose shape is still open and wrong choices would be costly to unwind: a new Project or Initiative, a model several skills or repositories must share, or a migration across the estate. Kris starts it by name, for example `/ki-design-loop start techne`.

Do not use it for work that already has a clear shape. A finite change with a known goal goes straight to `ki-next` for capture and `ki-plan` for readiness; an open question with one obvious answer is a Discussion entry on its record.

## Contract

The loop has five stages - brief, independent reviews, merged report, decisions and rollout - each with the contract the standard defines. Reviews are independent and read-only, disputes are settled on cited evidence rather than by vote, and only the owner decides. Anything the evidence cannot settle goes to the owner as a numbered decision with options and a recommendation.

Every artefact is committed in the repository that owns the subject as it is produced, in a `design/` subfolder of the subject Project or Initiative with one shared slug prefix. The artefacts are temporary: once their outcome is consolidated, the design folder is deleted. A Decision Record under `ki-decision-records` follows only when a decision changes, refining an existing record in place where one owns the concern. Local state holds only runtime material such as agent prompts and status files.

The loop writes no work record, grants itself no authority and never chooses for the owner. Push, prune, release and acceptance follow only from a grant the decisions file quotes.

## Relationship boundary

- `ki-next` receives the rollout: it captures each record the decisions call for and selects the pilot.
- `ki-plan` readies each captured record against the decisions, which its Context cites.
- `ki-batch` runs a wave of independent Ready records under the decisions' authority grant; `ki-accept` closes single records under the same grant.
- `ki-decision-records`, when selected, owns the Decision Record's shape and identity.
- `ki-delegation`, when selected, supplies the packet for any high-risk reviewer or rollout handoff.
- The [Project registry standard](../ki-work/references/standards-project-registry.md) owns the Project or Initiative folder note that holds the design folder and links any resulting Decision Record.

## Invocation

- `help`, `-h`, or `?` explains the loop without writing.
- `start <subject>` names the subject and its owning repository, then writes and commits the brief.
- `resume <subject>` reads the subject's design folder and continues at the first missing stage.

With no subject, no owning repository or no owner's proposal, report the missing input and stop.
