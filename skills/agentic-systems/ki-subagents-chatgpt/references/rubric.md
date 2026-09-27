<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — Codex standalone TOML source projections

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-subagents-chatgpt --write`.

Line-by-line criteria for auditing ki-subagents-chatgpt. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [CODEX — Runtime binding — Codex TOML source projection](#codex--runtime-binding--codex-toml-source-projection)
- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)

## CODEX — Runtime binding — Codex TOML source projection

→ [standard](standards-codex-subagents.md)

Native TOML source shape only; no host publication or activation assurance.

- **CODEX-1 [M] — Parseable physical TOML** — Each candidate is a physical TOML file with a parseable root table. (standards-codex-subagents.md#source-format, CODEX)
  - _Remediation:_ diagnostic — Repair the candidate source through its owner; do not publish it from this audit.
- **CODEX-2 [M] — Required Codex fields** — name, description, and developer_instructions are non-empty strings. (standards-codex-subagents.md#required-fields, CODEX)
  - _Remediation:_ diagnostic — Add the required Codex fields through the source-payload owner.
- **CODEX-3 [M] — Supported custom-agent keys** — The root table contains only documented custom-agent projection keys. (standards-codex-subagents.md#supported-keys, CODEX)
  - _Remediation:_ diagnostic — Remove or route an unsupported key through the source-payload owner.
- **CODEX-4 [M] — Unique source names** — Candidate source definitions do not duplicate a declared name. (standards-codex-subagents.md#source-format)
  - _Remediation:_ diagnostic — Resolve the duplicate through the source-payload owner.

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic
