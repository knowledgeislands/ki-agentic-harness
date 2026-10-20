<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — Safe and complete Granola meeting acquisition

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-acquire-granola --write`.

Line-by-line criteria for auditing ki-acquire-granola. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [ACQUIRE — Granola acquisition fidelity](#acquire--granola-acquisition-fidelity)
- [ROUTING — Granola receiver routing](#routing--granola-receiver-routing)
- [RETIRE — Granola source retirement](#retire--granola-source-retirement)
- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)

## ACQUIRE — Granola acquisition fidelity

→ [standard](standards-granola-acquisition.md)

Complete enumeration, faithful source projections, the capture as the only record.

- **ACQUIRE-1 [J] — complete identity enumeration** — Global and every folder history use saturation-aware date-window splitting, UUID deduplication, and fail-closed completeness. (standards-granola-acquisition.md#complete-identity-enumeration)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does the evidence prove every global and folder window complete, unsaturated and deduplicated?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **ACQUIRE-2 [J] — faithful read** — Details, complete transcripts, and MCP screenshot bytes are preserved with identities, hashes, and explicit omissions. (standards-granola-acquisition.md#acquisition-fidelity)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does evidence reconcile attachment counts and UUIDs, validate transcripts and image bytes, and preserve hashes, provenance, and omissions?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **ACQUIRE-3 [J] — repeat runs are honest** — Acquired members are skipped on membership alone, existing captures are found by UUID and kept unless refreshed, and no skip claims unchanged content. (standards-granola-acquisition.md#repeat-runs-and-amendments)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Were existing captures found by UUID and kept or deliberately refreshed in place, with duplicate or foreign-account captures reported and no ledger written?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **ACQUIRE-4 [J] — Acquired marker is confirmed and verified** — Only a confirmed mark adds Acquired membership, after verifying the committed capture against fresh source hashes and preserving every original membership. (standards-granola-acquisition.md#acquired-marker)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Was each marker explicitly confirmed, checked against its single committed capture, and read back with every original membership intact?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## ROUTING — Granola receiver routing

→ [standard](standards-granola-acquisition.md)

Folder evidence, explicit flag policies, central packages, visible receiver conflicts.

- **ROUTING-1 [J] — folder evidence reconciled** — Folder membership comes from complete query context and unfoldered identity is inferred only from the complete global-minus-folder union. (standards-granola-acquisition.md#folder-routing)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does the routing evidence distinguish provider fields from query-derived folder and unfoldered inference?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **ROUTING-2 [J] — receiver conflicts fail closed** — Conflicting folder mappings require human selection; multi-repository acquisition requires explicit intentional duplication. (standards-granola-acquisition.md#folder-routing)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Are unmatched, overlapping, excluded, and conflicting identities visible without silent precedence or duplication?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **ROUTING-3 [J] — flag-only outcomes stay visible** — Explicit unfoldered and residual flag policies report identity evidence without reading content or claiming acquisition. (standards-granola-acquisition.md#folder-routing)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Are flagged identities reported on each run without detail or transcript reads, implicit routing, or acquired-content claims?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **ROUTING-4 [J] — central captures preserve every route** — Many selected folders may share one receiver; each UUID has one package preserving all memberships and explicit territory routes, with multi-territory packages awaiting review. (standards-granola-acquisition.md#capture-packages)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does each UUID have one safe capture package with every observed membership, explicit territory mapping, and no silent choice between multiple territories?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## RETIRE — Granola source retirement

→ [standard](standards-granola-acquisition.md)

Separate release authority, complete evidence gate, manual fallback.

- **RETIRE-1 [J] — retirement separately authorised** — Reads and confirmed additive markers remain separate from retirement, which requires every evidence gate, a current exact manifest, and immediate human approval. (standards-granola-acquisition.md#source-retirement)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does the proposed retirement refuse every missing or stale gate and fall back to a manual manifest when no safe API exists?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic
