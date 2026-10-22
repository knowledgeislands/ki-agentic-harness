<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — Project repository orientation

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-repo-project --write`.

Line-by-line criteria for auditing ki-repo-project. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [PROJECT — Project orientation](#project--project-orientation)
- [GATE — Project commit gate](#gate--project-commit-gate)

## PROJECT — Project orientation

→ [standard](standards-project-repository.md)

A non-duplicating Project baseline and its owner boundaries.

- **PROJECT-1 [J] — owner-bound Project orientation** — Project orientation delegates primary-kind and forward-work selection to their respective owners. (standards-project-repository.md)
  - _Evidence scope:_ The repository’s declared kind and selected change-management adapter, reviewed through their owner audits.
  - _Review prompt:_ Do the owner-owned kind and adapter declarations support the intended Project orientation?
  - _Outcomes:_ conforming; owner-audit required; migration decision required
  - _Conforming guidance:_ Use ki-repo for primary-kind evidence and ki-work for adapter evidence; decide a Project/KB migration explicitly rather than inferring it here.

## GATE — Project commit gate

→ [standard](standards-project-repository.md)

The general Project gate delegates to the inherited repository contract.

- **GATE-1 [M] — Check-only Project commit gate** — Where the general Project is the primary shape and a committed pre-commit exists, it runs ki repo audit --skill ki-repo --staged, directly or through the canonical quiet helper. Hook existence, binding and exact text remain with ki-repo. (standards-project-repository.md#commit-gate)
  - _Remediation:_ diagnostic — Copy the canonical Project pre-commit asset for this package variant, then rerun the audit.
