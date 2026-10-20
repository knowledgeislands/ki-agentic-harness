# Work design standard

## Contents

- [Scope](#scope)
- [Artefact home](#artefact-home)
- [Stage contracts](#stage-contracts)
- [Rollout hand-off](#rollout-hand-off)
- [Stops](#stops)

## Scope

This standard was published under the skill name `ki-design-loop` until 14 October 2026, when the skill became `ki-work-design` under Kris's naming decision for the change-management design ("LOOP-NAME - `ki-work-design`"); the method is still called a design loop.

The loop shapes one subject - a Project, a theme, or a cross-cutting model that precedes its Project - from the owner's proposal to approved decisions and a rollout of ordinary work records. It begins before any record exists and ends when the rollout records are captured and the pilot is selected. The records then follow `ki-plan`, `ki-implement`, `ki-batch` and `ki-accept` as usual.

The loop fixes independence and diversity, not a roster: no stage requires a particular model, vendor or runtime.

## Artefact home

A design is working material of the work whose concern it shapes, under the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md). Name that work, by its id, in the brief before any other work: the Project work `<territory>.<project>` for a Project's design, or the territory work `<territory>` for a new Project, a theme or a cross-cutting model that no Project holds yet.

- **Design folder.** The brief, each review, the merged report and the decisions file live in the work folder's `design/` subfolder, `+/_WORK/<id>/design/`, in the repository that holds the work file, sharing one descriptive slug prefix such as `roadmap-model-brief.md`, `roadmap-model-review-fable.md`, `roadmap-model-report.md` and `roadmap-model-decisions.md`. Options papers, mocks and diagram sources with their renders for the same concern sit beside them; the `ki-work-package` [closed list](../../../governance/ki-work-package/references/standards-work-package.md#closed-list) sets which file kinds `design/` may hold, so scratch scripts and screenshots stay in temporary output. The `design/` folder carries no index note; the work file's `## Next steps` names what it holds while the design is open.
- **Report diagrams.** A design report carries each diagram as an inline text diagram or as a static SVG exported under `ki-diagrams` in its `ki` or `light` form, never the dual-theme form, so that it renders legibly in any previewer. The SVG is committed beside the report in the design folder, and a diagram that outlives the design moves beside the subject's Project note when the note graduates.
- **Nothing under `Streams/`.** No `design/` folder sits anywhere under `Streams/`, and no Project or theme note points into a work folder, under the [Project registry standard](../../ki-work/references/standards-project-registry.md). The Streams checker fails a `design/` folder there, and its papers move to the work folder at the territory's migration.
- **Temporary.** A design note is a draft, under review, graduated or deleted. It graduates when every decision it carried has a durable home - a Decision Record where a decision changed, the Project note, and the standards and records the rollout touches - and is deleted in the same change, so that nothing cites a deleted note: a work record cites a design note only while the note exists, and by `ready` the record's `Context` quotes what it needs in words; a Decision Record never cites a design note. This standard owns graduation; `ki-coordination` reviews `design/` at each mark and resolves it before Project work finishes. Once every note has graduated, the `design/` folder is gone; Git history holds the rest.
- **Decision Record only on change.** The loop produces a Decision Record under `ki-decision-records` only when it changes a decision. Where an existing record owns the concern, refine that record in place; otherwise write one new record. The record states the consolidated current decision and quotes any authority grant; it never links or cites the design artefacts, which are deleted.
- **Commit as produced.** From the brief onward, write and commit each artefact in the work folder when it is produced, never gathered later. A run's state folder keeps only runtime material: agent prompts, pid, status and report files.
- **Registry link.** Once a Decision Record carries the outcome, the Project or theme note links that record, under the [Project registry standard](../../ki-work/references/standards-project-registry.md).

`resume <id>` reads the work folder's `design/`; it never relies on a local folder outside the repository.

## Stage contracts

Start each artefact from its template in `assets/`.

- **Brief.** The orchestrator writes the problem, the owner's proposal verbatim, the facts already established with their sources, and its own numbered reflection. Each numbered point is one claim a reviewer can agree with, differ from or extend.
- **Reviews.** At least two independent reviews, on different models or runtimes, each read-only. A reviewer forms its own view before it reads any other review, fact-checks the brief against the sources and marks Agree, Differ or Add against every numbered point, with evidence for each Differ.
- **Merged report.** The orchestrator settles disputes on cited evidence and the governing standards, never by counting votes. The report gives a summary, corrections to the brief, the proposed model, an agree-and-differ table, a rollout plan, at most about eight decisions each with options and a recommendation, and a changes-after-review log. Anything the evidence cannot settle goes to the owner as a decision.
- **Decisions.** The owner's own words, numbered against the report's decisions, kept verbatim. It records any authority grant with its completion target, and the push and prune scope. Where the owner's words differ from the report, the decisions win.
- **Rollout.** Records are captured through `ki-next` from the decisions. One pilot is delivered before any parallel wave. The pilot's lessons are written into each wave's brief before it starts, and authority is exercised through `ki-batch` or `ki-accept`, quoting the grant.

## Rollout hand-off

- `ki-next` captures each record the decisions call for, stating the relevant decisions in its Context and naming the Decision Record where one exists, and selects the pilot.
- `ki-plan` readies each record against the decisions; a record that needs a choice the decisions did not make stops and returns it to the owner.
- `ki-batch` runs each wave of independent Ready records under the grant's `completion_target`; `ki-accept` closes single records under the same grant.
- Delegation to background agents follows the delegation contract in force; a high-risk handoff uses `ki-delegation`'s packet when that skill is selected.

## Stops

Stop and report when the subject has no owning work or no work folder to hold its design, the owner's proposal is missing, fewer than two independent reviews exist, or a decision would be made on the owner's behalf. The loop never pushes, prunes, releases or accepts on its own authority.
