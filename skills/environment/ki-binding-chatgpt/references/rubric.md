<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — Knowledge Islands Codex MCP binding

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-binding-chatgpt --write`.

Line-by-line criteria for auditing ki-binding-chatgpt. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [CODEXBIND — Codex binding](#codexbind--codex-binding)
- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)

## CODEXBIND — Codex binding

→ [standard](standards-codex-binding.md)

Codex TOML definition comparison and coordinator-owned activation boundary.

- **CODEXBIND-1 [M] — Codex TOML definition agreement** — A configured Codex target has the complete non-secret source definition for each Codex-targeted server. (standards-codex-binding.md)
  - _Remediation:_ diagnostic — Review the canonical source and run the native Codex renderer after confirming intended client targets; do not overwrite unrelated application configuration.
- **CODEXBIND-J1 [J] — Hosted activation is coordinator-owned** — Repository selection and hosted Codex activation are explicitly outside this adapter. (standards-codex-binding.md)
  - _Evidence scope:_ The repository’s declared runtime selection and authorised hosted Codex activation evidence.
  - _Review prompt:_ Has the coordinator declared the adapter and recorded an authorised hosted activation check?
  - _Outcomes:_ conforming; activation unavailable; owner decision required
  - _Conforming guidance:_ Route repository selection and hosted activation to the coordinator; configuration evidence alone never proves activation or runtime health.

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic
