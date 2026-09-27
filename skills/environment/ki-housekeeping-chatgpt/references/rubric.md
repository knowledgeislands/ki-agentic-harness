<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — Safe repository-scoped ChatGPT session housekeeping

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-housekeeping-chatgpt --write`.

Line-by-line criteria for auditing ki-housekeeping-chatgpt. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [STATE — ChatGPT and Codex session housekeeping safety](#state--chatgpt-and-codex-session-housekeeping-safety)
- [MEMORY — Codex local-memory policy](#memory--codex-local-memory-policy)
- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)

## STATE — ChatGPT and Codex session housekeeping safety

→ [standard](../SKILL.md)

Provider-specific inventory, provenance, and source-mutation boundaries.

- **STATE-1 [J] — discovery is physical and content-minimised** — Discovery accepts one configured physical store, enumerates only recognised non-symlinked record paths, and returns provenance without decoded conversation content. (../SKILL.md#chatgpt-session-acquisition)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does the runtime evidence prove path containment, opaque handling, and content-minimised discovery?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **STATE-2 [J] — source mutation is unavailable during acquisition** — The provider exposes only discover, list, read, and checkpoint; KI staging and any later archive/delete decision remain separate. (../SKILL.md#chatgpt-session-acquisition)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does the provider preserve its no-decrypt, no-write, no-delete boundary?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **STATE-3 [J] — Codex inventory is exact and content-minimised** — Codex inventory matches one physical repository exactly, includes active and archived roots and complete descendants, and excludes transcript content. (standards-codex-state.md#repository-identity, standards-codex-state.md#inventory)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does the Codex provider prove exact repository identity and complete, content-minimised inventory?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **STATE-4 [J] — Codex deletion is explicitly reviewed and fail-closed** — Permanent deletion requires a reviewed artifact, exact selection, destructive confirmation, complete revalidation, and partial-execution reporting. (standards-codex-state.md#deletion)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does Codex deletion preserve the reviewed selection and every pre-delete safety gate?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## MEMORY — Codex local-memory policy

→ [standard](standards-codex-memory.md)

Explicit repository policy, readable runtime configuration, and retained-memory reconciliation.

- **MEMORY-1 [M] — repository memory policy is explicit** — A repository supporting Codex declares disabled, transition, or human-approved enabled memory. (standards-codex-memory.md#repository-policy)
  - _Remediation:_ diagnostic — Inspect the selected Codex memory store, then explicitly declare disabled or transition; enabled requires human approval.
- **MEMORY-2 [M] — readable Codex settings agree with policy** — Readable Codex configuration must not enable memory against KI policy; enabled requires project opt-in. (standards-codex-memory.md#runtime-settings)
  - _Remediation:_ diagnostic — Review Codex configuration precedence and session overrides; do not change managed user settings without review.
- **MEMORY-3 [M] — retained local memory is reconciled** — Transition always warns; memory files under disabled policy need reviewed knowledge routing. (standards-codex-memory.md#reconciliation)
  - _Remediation:_ diagnostic — Preserve local files until useful learning is approved in repository guidance or KB notes.

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic
