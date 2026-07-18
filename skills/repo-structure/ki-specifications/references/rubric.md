# KI Specifications structure audit rubric

The mechanical criteria are enforced by [`../scripts/audit.ts`](../scripts/audit.ts). Judgment criteria remain reader-assessed.

## Mechanical criteria

- **marker [M]** `` `SPEC-1` `` `.ki-config.toml` declares a keyless `[ki-specifications]` table. Unknown keys WARN because the marker has no options yet. (standard: repository identity)
- **authority areas [M]** `` `SPEC-2` `` `proposals/`, `specifications/`, and `schemas/` exist as directories. Their absence FAILs because they are the core deliberative, normative, and machine-readable authority seams. (standard: top-level areas)
- **supporting areas [M]** `` `SPEC-3` `` `templates/`, `examples/`, `docs/`, and `tooling/` exist as directories. Their absence WARNs because the repository can remain usable while an early supporting area is being introduced. (standard: top-level areas)

## Judgment criteria

- **minimal floor [J]** `` `SPEC-J1` `` every asserted structure has proved stable enough to govern across time; emerging KIP/KIS process detail remains in the canonical Specifications repository until that threshold is met. (standard: intentionally small scope)
- **authority boundary [J]** `` `SPEC-J2` `` the skill checks repository shape without claiming canonical ownership of normative specification meaning. (standard: composition boundary)
- **sync [J]** `` `SYNC-1` `` the standard, rubric, checker, tests, and source review agree.
