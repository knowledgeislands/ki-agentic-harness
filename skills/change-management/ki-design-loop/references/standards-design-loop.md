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

- **Decision Record.** The decisions become one Decision Record under `ki-decision-records` in that repository's decisions collection, with the prefix that skill's rules give the decision - usually governance or architecture. It states the accepted design and quotes any authority grant.
- **Supporting files.** The brief, each review, the merged report and the decisions file are kept verbatim in the collection's `references/` directory - `docs/decisions/references/` in a code repository, `Admin/Governance/Decisions/references/` in a Knowledge Base. They share one descriptive slug prefix, such as `roadmap-model-brief.md`, `roadmap-model-review-fable.md`, `roadmap-model-report.md` and `roadmap-model-decisions.md`. The Decision Record cites each from its body.
- **Commit as produced.** From the brief onward, write and commit each artefact in the owning repository when it is produced, never gathered later. Local state keeps only runtime material: agent prompts, pid, status and report files.
- **Registry link.** The Project or Initiative note links the Decision Record from its `## Notes`, under the [Project registry standard](../../ki-work/references/standards-project-registry.md).

`resume <subject>` reads these files by slug prefix; it never relies on a local folder.

## Stage contracts

Start each artefact from its template in `assets/`.

- **Brief.** The orchestrator writes the problem, the owner's proposal verbatim, the facts already established with their sources, and its own numbered reflection. Each numbered point is one claim a reviewer can agree with, differ from or extend.
- **Reviews.** At least two independent reviews, on different models or runtimes, each read-only. A reviewer forms its own view before it reads any other review, fact-checks the brief against the sources and marks Agree, Differ or Add against every numbered point, with evidence for each Differ.
- **Merged report.** The orchestrator settles disputes on cited evidence and the governing standards, never by counting votes. The report gives a summary, corrections to the brief, the proposed model, an agree-and-differ table, a rollout plan, at most about eight decisions each with options and a recommendation, and a changes-after-review log. Anything the evidence cannot settle goes to the owner as a decision.
- **Decisions.** The owner's own words, numbered against the report's decisions, kept verbatim. It records any authority grant with its completion target, and the push and prune scope. Where the owner's words differ from the report, the decisions win.
- **Rollout.** Records are captured through `ki-next` from the decisions. One pilot is delivered before any parallel wave. The pilot's lessons are written into each wave's brief before it starts, and authority is exercised through `ki-batch` or `ki-accept`, quoting the grant.

## Rollout hand-off

- `ki-next` captures each record the decisions call for, with the Decision Record in its Context, and selects the pilot.
- `ki-plan` readies each record against the decisions; a record that needs a choice the decisions did not make stops and returns it to the owner.
- `ki-batch` runs each wave of independent Ready records under the grant's `completion_target`; `ki-accept` closes single records under the same grant.
- Delegation to background agents follows the delegation contract in force; a high-risk handoff uses `ki-delegation`'s packet when that skill is selected.

## Stops

Stop and report when the subject has no owning repository, the owner's proposal is missing, fewer than two independent reviews exist, or a decision would be made on the owner's behalf. The loop never pushes, prunes, releases or accepts on its own authority.
