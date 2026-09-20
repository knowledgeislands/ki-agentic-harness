<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — Incremental and faithful ChatGPT project acquisition

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-acquire-chatgpt --write`.

Line-by-line criteria for auditing ki-acquire-chatgpt. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [SOURCE — ChatGPT source evidence](#source--chatgpt-source-evidence)
- [ROUTING — ChatGPT project routing](#routing--chatgpt-project-routing)
- [FIDELITY — ChatGPT conversation fidelity](#fidelity--chatgpt-conversation-fidelity)
- [RETIRE — ChatGPT source retirement](#retire--chatgpt-source-retirement)
- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)

## SOURCE — ChatGPT source evidence

→ [standard](standards-chatgpt-acquisition.md)

Authorised readable content paired with content-minimised identity and change evidence.

- **SOURCE-1 [J] — readable source is authorised and explicit** — Readable conversation acquisition uses an authorised stable source and never treats opaque local records, browser scraping, or undocumented private APIs as faithful content. (standards-chatgpt-acquisition.md#source-pairing)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does runtime evidence distinguish the readable source from opaque identity evidence and stop when either layer is unavailable?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **SOURCE-2 [J] — incremental checkpoints separate identity and content** — Identity enumeration and readable content versions carry distinct hashes and checkpoints so opaque changes can nominate revalidation without claiming readable content is unchanged. (standards-chatgpt-acquisition.md#incremental-acquisition)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Do checkpoints distinguish complete identity coverage from readable content evidence and advance only with explicit outcomes for every selected identity?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## ROUTING — ChatGPT project routing

→ [standard](standards-chatgpt-acquisition.md)

Immutable project selectors, prefixed presentation, and explicit receiver conflicts.

- **ROUTING-1 [J] — project identity survives renames** — Receiver bindings use immutable project IDs while current `<Domain>: <Topic>` names, parsed prefixes, and prior names remain review evidence and aliases. (standards-chatgpt-acquisition.md#project-identity-and-naming)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does each project binding use stable source identity while retaining current and prior names and making prefix drift visible?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **ROUTING-2 [J] — receiver conflicts fail closed** — Unknown prefixes, unmapped projects, conflicting bindings, and intentional duplication remain explicit rather than resolving through lexical or repository precedence. (standards-chatgpt-acquisition.md#receiver-routing)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Are unmapped, malformed, conflicting, and duplicated project routes visible and resolved only through explicit human authority?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## FIDELITY — ChatGPT conversation fidelity

→ [standard](standards-chatgpt-acquisition.md)

Complete readable conversations, explicit omissions, immutable versions, and retained copies.

- **FIDELITY-1 [J] — complete conversations are acquired** — The acquisition unit is one complete conversation with ordered roles, returned messages, write-ups, assets, provenance, hashes, and explicit omissions rather than selected excerpts. (standards-chatgpt-acquisition.md#conversation-fidelity)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does each acquired version preserve all readable content and assets the source returned without fabricating missing fields or decoding opaque records?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **FIDELITY-2 [J] — versions and missing sources are non-destructive** — Changed conversations create verified versions, unchanged repeats avoid payload churn, and source absence never deletes a retained receiver copy. (standards-chatgpt-acquisition.md#incremental-acquisition)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does repeated acquisition preserve prior versions, avoid unexplained churn, and report missing source identities without deleting retained evidence?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## RETIRE — ChatGPT source retirement

→ [standard](standards-chatgpt-acquisition.md)

Separate release authority, current exact evidence, and a manual-only fallback.

- **RETIRE-1 [J] — retirement is separately authorised** — Acquisition remains read-only; source retirement requires recoverable receiver evidence, a current exact manifest, unchanged source identity and content, resolved omissions, and immediate human approval. (standards-chatgpt-acquisition.md#source-retirement)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does proposed retirement refuse stale or incomplete evidence and stop at a manual manifest when no supported identity-specific mutation surface exists?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic
