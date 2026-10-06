<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — Owner-declared Agora membership and inclusion

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-agora --write`.

Line-by-line criteria for auditing ki-agora. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)
- [CONFIG — Agora home declaration](#config--agora-home-declaration)

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic

## CONFIG — Agora home declaration

→ [standard](standards-agora.md)

Title, purpose, membership, and inclusion are owner-declared and portable.

- **CONFIG-1 [M] — Agora homes are canonical** — An owner-declared Agora has a stable identifier, a required non-empty single-line title, a non-empty purpose, duplicate-free canonical member repositories, and optional duplicate-free inclusions naming Agora identifiers or canonical repositories. An included repository is not a member. Owner identity comes from ki-repo.repository. Unknown fields fail closed. (standards-agora.md)
  - _Remediation:_ diagnostic — Correct the local ki-agora home declaration, then rerun the audit.
