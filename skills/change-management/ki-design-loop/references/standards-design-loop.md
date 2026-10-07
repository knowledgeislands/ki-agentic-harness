# Design-loop standard

## Contents

- [Scope](#scope)
- [Artefact home](#artefact-home)
- [Stage contracts](#stage-contracts)
- [Rollout hand-off](#rollout-hand-off)
- [Stops](#stops)

## Scope

The loop shapes one subject - a Project, an Initiative, or a cross-cutting model that precedes its Project - from the owner's proposal to approved decisions and a rollout of ordinary work records. It begins before any record exists and ends when the rollout records are captured and the pilot is selected. The records then follow `ki-plan`, `ki-implement`, `ki-batch` and `ki-accept` as usual.

The loop fixes independence and diversity, not a roster: no stage requires a particular model, vendor or runtime.

## Artefact home

The repository that owns the subject owns its design: the territory Capital for a Project or Initiative, or the owning repository for a repository-local design. Name it in the brief before any other work.

- **Design folder.** The brief, each review, the merged report and the decisions file live in a `design/` subfolder of the subject, sharing one descriptive slug prefix such as `roadmap-model-brief.md`, `roadmap-model-review-fable.md`, `roadmap-model-report.md` and `roadmap-model-decisions.md`:
  - In a territory Capital the folder sits under the Project's registry folder, `Streams/Projects/<slug>/design/`, or the Initiative's, `Streams/Initiatives/<slug>/design/`. A subject not yet registered as a Project - a new Project or a cross-cutting model - uses the Initiative it serves.
  - The registry note then becomes the folder note of its own folder under the index-note rule: `Streams/Projects/<slug>.md` moves to `Streams/Projects/<slug>/<slug>.md`, keeping its slug, frontmatter and body. The [Project registry standard](../../ki-work/references/standards-project-registry.md) accepts either form.
  - The `design/` folder carries its same-name index note, `design.md`, which names the subject and introduces each artefact.
  - In a repository without `Streams/`, a repository-local design lives in `docs/design/<subject-slug>/`. A Knowledge Base without a registry designs its territory's Projects and Initiatives in the Capital.
- **Temporary.** The artefacts are working material, not a record. Once their outcome is consolidated - into a Decision Record where a decision changed, the Project or Initiative note, and the standards and records the rollout touches - delete the design folder in one commit. The folder note stays where it is.
- **Decision Record only on change.** The loop produces a Decision Record under `ki-decision-records` only when it changes a decision. Where an existing record owns the concern, refine that record in place; otherwise write one new record. The record states the consolidated current decision and quotes any authority grant; it never links or cites the design artefacts, which are deleted.
- **Commit as produced.** From the brief onward, write and commit each artefact in the owning repository when it is produced, never gathered later. Local state keeps only runtime material: agent prompts, pid, status and report files.
- **Registry link.** While the design folder exists, the Project or Initiative note mentions it in its `## Notes`; once a Decision Record carries the outcome, the note links that record instead, under the [Project registry standard](../../ki-work/references/standards-project-registry.md).

`resume <subject>` reads the design folder; it never relies on a local folder outside the repository.

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

Stop and report when the subject has no owning repository or no home for its design folder, the owner's proposal is missing, fewer than two independent reviews exist, or a decision would be made on the owner's behalf. The loop never pushes, prunes, releases or accepts on its own authority.
