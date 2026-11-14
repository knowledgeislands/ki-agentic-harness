<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — where agents run

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-env --write`.

Line-by-line criteria for auditing ki-env. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)
- [ENV — Environment families](#env--environment-families)

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standard-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication)
  - _Remediation:_ automatic

## ENV — Environment families

→ [standard](standard-environment.md)

Each environment concern reaches its family's lead, and each runtime skill adds only its agent host's delta.

- **ENV-1 [J] — each environment concern reaches its family's lead** — Tools and access, limits, and the state agent hosts leave are each governed through their family's portable lead, never through a runtime skill alone. (standard-environment.md#41-what-the-guild-covers)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does each environment concern the repository governs reach its family's lead?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **ENV-2 [J] — each runtime skill adds only its host's delta** — A rule that holds for every runtime sits with the family's lead, and a runtime skill holds only what is true of its own agent host. (standard-environment.md#42-families)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does any runtime skill restate a rule its family's lead holds, or does the lead hold a rule true of only one runtime?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
