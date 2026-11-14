<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — the guild tree of a skill collection

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-keystone --write`.

Line-by-line criteria for auditing ki-keystone. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)
- [KEYSTONE — Keystone and the guild tree](#keystone--keystone-and-the-guild-tree)

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standard-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication)
  - _Remediation:_ automatic

## KEYSTONE — Keystone and the guild tree

→ [standard](standard-keystone.md)

A skill collection is grouped into guilds, each led by one lead in Keystone, and its guild map is current.

- **KEYSTONE-1 [M] — every skill in the collection declares its guild** — Once any skill in the repository’s `skills/` collection declares a guild, every skill there declares one, `ki-guild: <guild>`, so the guild tree is read from frontmatter and never from the folder a skill is stored in. (../../ki-skills/references/standard-guilds.md#44-membership, standard-keystone.md#42-one-lead-for-each-guild)
  - _Remediation:_ diagnostic — Add `ki-guild: <guild>` to each named skill, choosing the guild whose purpose it serves, then rerun the audit.
- **KEYSTONE-2 [M] — every guild has one lead, a member of Keystone** — Every guild a skill declares or leads has exactly one lead, which declares `ki-leads: <guild>`, and every lead is a member of Keystone, `ki-guild: keystone`. (standard-keystone.md#42-one-lead-for-each-guild, ../../ki-skills/references/standard-guilds.md#41-what-a-guild-is)
  - _Remediation:_ diagnostic — Give each guild one lead skill named after it, declaring `ki-guild: keystone` and `ki-leads: <guild>`, and remove `ki-leads` from any second lead, then rerun the audit.
- **KEYSTONE-3 [M] — the guild map is generated from frontmatter** — Where a skill leads Keystone, its SKILL.md holds one guild map between the `ki-keystone:guild-map` markers, and the map is exactly the one rendered from every skill’s `ki-guild` and `ki-leads`. (standard-keystone.md#43-the-guild-map)
  - _Remediation:_ diagnostic — Regenerate the guild map with `ki dev skill generate ki-keystone`, or restore the one pair of markers it is written between, then rerun the audit.
- **KEYSTONE-4 [J] — Keystone holds only leads and what every guild rests on** — Each member of Keystone other than its lead is either a guild’s lead or something every guild rests on, as `ki-skills` and `ki-knowledge-graph` are; a skill that serves one guild belongs to that guild. (standard-keystone.md#41-the-joining-rule, ../../ki-skills/references/standard-guilds.md#42-keystone)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Is every member of Keystone a guild’s lead or something every guild rests on, or does one serve a single guild and belong there?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **KEYSTONE-5 [J] — each lead discloses its guild** — Each lead says what its guild is for in a line and names each member once with when to use it, naming a family’s lead rather than each runtime skill, and the Keystone lead names where a session starts in a repository. (../../ki-skills/references/standard-guilds.md#45-how-a-lead-discloses-its-guild, standard-keystone.md#44-where-a-session-starts)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does each lead state its guild’s purpose and name each member with when to use it, and does the Keystone lead name where a session starts?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
