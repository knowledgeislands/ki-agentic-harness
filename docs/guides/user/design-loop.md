# Run a design loop

Use the `ki-design-loop` skill to shape a Project, an Initiative or a cross-cutting model before any work record exists. The skill's standard, `references/standards-design-loop.md`, owns the stage contracts; this guide explains when and how to start it.

## When to use it

Start a design loop when you have a proposal whose shape is still open and a wrong choice would be costly to unwind:

- a new Project or Initiative, such as Techné;
- a model several skills or repositories must share, such as the roadmap model of 7 October 2026;
- a migration across the estate.

Skip it when the work already has a clear goal. Capture that with `ki-next` and ready it with `ki-plan`.

## Start it

Invoke the skill by name with the subject's slug:

```text
/ki-design-loop start techne
```

The agent asks for anything missing - the owning repository and your proposal - and then writes and commits the brief. To pick up a design in a later session, run `/ki-design-loop resume techne`; it reads the committed artefacts and continues at the first missing stage. `/ki-design-loop help` explains the loop without writing anything.

## What happens

1. **Brief.** The agent records the problem, your proposal verbatim, the facts already established, and its own numbered reflection.
2. **Reviews.** At least two independent, read-only reviews on different models or runtimes. Each forms its own view, fact-checks the brief, and marks every point Agree, Differ or Add.
3. **Merged report.** One report settles disputes on evidence, not by vote, and puts at most about eight decisions to you, each with options and a recommendation.
4. **Decisions.** You answer in your own words. Include any authority grant, its completion target, and what may be pushed or pruned.
5. **Rollout.** The agent captures the records your decisions call for and delivers one pilot before any parallel wave.

## Where the artefacts go

Everything lives in the repository that owns the subject: the territory Capital for a Project or Initiative, or the owning repository for a local design.

- The brief, reviews, report and decisions go verbatim in the decisions collection's `references/` directory, sharing one slug prefix, such as `techne-brief.md`. Each is committed when it is produced.
- The decisions become one Decision Record in that collection, citing each file.
- The Project or Initiative note links the Decision Record from its `## Notes`.

Local state keeps only runtime material such as agent prompts and status files.

## Hand-off

The loop ends when the rollout is captured. From there:

- `ki-next` captures each record with the Decision Record in its Context, and selects the pilot;
- `ki-plan` readies each record against the decisions;
- `ki-batch` runs each wave of independent Ready records under your grant, and `ki-accept` closes single records under the same grant.

The loop never decides for you, and never pushes, prunes or accepts beyond the grant your decisions file quotes.
