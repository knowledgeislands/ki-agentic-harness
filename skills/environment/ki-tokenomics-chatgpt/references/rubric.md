<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — Bounded Codex tokenomics evidence

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-tokenomics-chatgpt --write`.

Line-by-line criteria for auditing ki-tokenomics-chatgpt. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [SURF — Codex standing surfaces](#surf--codex-standing-surfaces)
- [NA — Unavailable Codex runtime state](#na--unavailable-codex-runtime-state)
- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)

## SURF — Codex standing surfaces

→ [standard](standards-codex-tokenomics.md)

Bounded documented Codex evidence.

- **CODEX-SURF-1 [M] — Documented Codex surfaces are bounded** — Only directly observed selected-repository Codex configuration, instructions, skills, and custom-agent source structure is reported; user-memory and effective-session state are unavailable, and values that may be secret are not emitted. (standards-codex-tokenomics.md)
  - _Remediation:_ diagnostic — Adjust the selected Codex configuration or document the observed standing surface; hosted conform does not change runtime state.

## NA — Unavailable Codex runtime state

→ [standard](standards-codex-tokenomics.md)

Session facts not inferred from filesystem observations.

- **CODEX-NA-1 [M] — Effective session state is unavailable** — Effective model, instructions, active MCP, trust, memory use, transcript, compaction, billing, and tool-schema metrics are unavailable without authorised session evidence. (standards-codex-tokenomics.md)
  - _Remediation:_ diagnostic — Use an explicitly authorised session-evidence owner; do not infer session state from filesystem sources.

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic
