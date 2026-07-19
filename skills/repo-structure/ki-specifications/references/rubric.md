<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — specifications

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical.

## SPEC — repository structure

→ [standard](standards.md)

Repository identity and stable top-level seams.

- **SPEC-1 [M] — repository identity marker** — `.ki-config.toml` declares a keyless `[ki-specifications]` table. Unknown keys WARN because the marker has no options yet. (standards.md)
- **SPEC-2 [M] — authority areas** — `proposals/`, `specifications/`, and `schemas/` exist as directories. Their absence FAILs. (standards.md)
- **SPEC-3 [M] — supporting areas** — `templates/`, `examples/`, `docs/`, and `tooling/` exist as directories. Their absence WARNs. (standards.md)
- **SPEC-J1 [J] — minimal floor** — Every asserted structure has proved stable enough to govern across time. (standards.md)
  - _Review prompt:_ Has every asserted structure proved stable enough to govern across time?
- **SPEC-J2 [J] — authority boundary** — The skill checks repository shape without claiming canonical ownership of normative specification meaning. (standards.md)
  - _Review prompt:_ Does the skill preserve the authority boundary around normative specification meaning?

## SYNC — standard synchronisation

→ [standard](standards.md)

Alignment across the knowledge chain.

- **SYNC-1 [J] — knowledge-chain synchronisation** — The standard, rubric, checker, tests, and source review agree. (standards.md)
  - _Review prompt:_ Do the standard, rubric, checker, tests, and source review agree?
