# Portable subagent roles

## Purpose

A portable subagent role is a runtime-neutral delegation contract. It defines a stable identity, a selection description, core instructions, a distinct lane, grounding, hand-offs, intended orchestration, and effectiveness evidence. It deliberately defines no serialization of its own: a designated primary projection carries the record, as [Record and projections](#record-and-projections) sets out.

## Required semantic evidence

- **Identity and selection.** State what role exists and the request cues that select it.
- **Core instructions and lane.** Bound ownership and state what is out of scope.
- **Grounding and hand-offs.** Name evidence to read before action and the receiving capability for adjacent work.
- **Orchestration.** If the role delegates, state the intended coordination boundary without assuming runtime limits or permissions.
- **Outcome.** Retain representative evidence that selection was appropriate and improved the requested result; a syntactically valid file is not such evidence.

## Record and projections

The role record is carried by one designated primary projection, the `ki-subagents-claude` Markdown file under a domain directory of `subagents/`, as [ADR-KI-HARNESS-AGENTS-002](../../../../docs/decisions/ADR-KI-HARNESS-AGENTS-002-portable-subagent-contract-and-runtime-adapters.md) decides.

- **Record fields** are identity (`name`), selection (`description`), and the instruction body that carries lane, grounding, hand-offs, orchestration, and outcome evidence. Portable criteria are judged against these in the primary file.
- **Projection fields** are every other key an adapter supports, such as `model`, `color`, or `tools`. They belong to the runtime adapter, not to the role.

Any other projection with the same `name` corresponds to the primary and never establishes the record. Its record fields must agree with the primary's; where they disagree, the primary prevails.

## Boundary

Claude Code Markdown/YAML and its fields are owned by `ki-subagents-claude`. Codex standalone TOML and its fields are owned by `ki-subagents-chatgpt`. Installation, publication, activation, effective settings, and runtime execution are host/runtime questions. The current Harness host implements no generic subagent publisher, so neither adapter may claim them.
