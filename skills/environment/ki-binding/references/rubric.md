<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — Knowledge Islands cross-surface binding

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-binding --write`.

Line-by-line criteria for auditing ki-binding. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [BIND — Canonical MCP binding](#bind--canonical-mcp-binding)
- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)

## BIND — Canonical MCP binding

→ [standard](standards-cross-surface-binding.md)

Portable source validity, client targeting, and non-secret mcporter definition evidence.

- **BIND-1 [M] — mcporter agrees with source definitions** — An explicitly selected mcporter target has the complete non-secret definitions for each mcporter-targeted server, including header names, literal header values, and lifecycle; secret-derived header values are checked only for non-empty presence. (standards-cross-surface-binding.md)
  - _Remediation:_ diagnostic — Select an authoritative mcporter config through MCPORTER_CONFIG, then reconcile its full non-secret targeted definitions through the binding workflow.
- **BIND-2 [M] — Single MCP source is valid** — The resolved canonical source is a physical file with a closed, portable server schema. (standards-cross-surface-binding.md)
  - _Remediation:_ diagnostic — Correct the canonical MCP source so every server has one valid transport definition and current, intentional client targets.
- **BIND-J1 [J] — Client targeting is right for use** — The clients set reflects intended, least-surprising client availability. (standards-cross-surface-binding.md)
  - _Evidence scope:_ Every canonical MCP server and its intended client availability.
  - _Review prompt:_ Does each server target the clients that need it, without exposing it on clients that do not?
  - _Outcomes:_ conforming; target adjustment required; authority decision required
  - _Conforming guidance:_ Adjust the canonical clients set to the least-surprising intended availability, or record the owning authority decision before changing exposure.
- **BIND-J2 [J] — Host bridge is the local MCP route** — Host-bound runtimes reach KI MCP servers through their own host's mcporter bridge, and cloud-session connectors are not treated as local gaps. (standards-cross-surface-binding.md#host-surface-selection)
  - _Evidence scope:_ Every host-bound runtime that claims KI MCP access, its bridge route, and any reported connector gap.
  - _Review prompt:_ Does each host-bound runtime reach KI MCP servers through its own host's bridge, without depending on another host's loopback bridge or reporting an unauthorised cloud connector as missing local capability?
  - _Outcomes:_ conforming; route repair required; authority decision required
  - _Conforming guidance:_ Route the runtime to its host's bridge, or report the missing bridge or grant as a prerequisite; record an exposure decision before crossing hosts.

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic
