<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — Source-independent faithful knowledge acquisition

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-acquire --write`.

Line-by-line criteria for auditing ki-acquire. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [CONFIG — Common acquisition configuration](#config--common-acquisition-configuration)
- [ACQUIRE — Faithful common acquisition](#acquire--faithful-common-acquisition)
- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)

## CONFIG — Common acquisition configuration

→ [standard](standards-acquisition.md)

The common contract takes local conventions from repository guidance and accepts no configuration keys.

- **CONFIG-1 [M] — common acquisition has no configuration properties** — Unexpected keys in the common skill table are visible rather than silently accepted as provider settings. (standards-acquisition.md#scope)
  - _Remediation:_ diagnostic — Remove unsupported keys; keep provider settings under their owning adapter.

## ACQUIRE — Faithful common acquisition

→ [standard](standards-acquisition.md)

Policy judgments require source, request and destination evidence; mechanical success does not establish fidelity.

- **ACQUIRE-1 [J] — scope and coverage are explicit** — The authorised scope, provenance and chronology distinguish supplied text, a bounded digest and a complete source export. (standards-acquisition.md#scope-and-coverage)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does the evidence establish the authorised source scope and coverage without inventing dates or weakening source-specific completeness?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **ACQUIRE-2 [J] — identities and routes survive retries** — Verified retries reuse established identities and paths while amendments and unknown or conflicting routes remain explicit. (standards-acquisition.md#identities-and-routing)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Were existing identities and handling evidence checked before writing, with request/package relationships and unresolved routing preserved?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **ACQUIRE-3 [J] — promised material and originals are preserved** — The selected source contract governs fidelity, exact required originals, retained versions and explicit omissions. (standards-acquisition.md#preservation-and-originals)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Do source and asset evidence prove the promised coverage and required original bytes, with gaps and earlier commitments still visible?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **ACQUIRE-4 [J] — completion follows destination verification** — Reports distinguish offered, received, committed and remotely verified material rather than overstating success. (standards-acquisition.md#verification-and-reporting)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Was the agreed destination read back and compared, and does the report match the actual verified scope and remaining gaps?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **ACQUIRE-5 [J] — handling proof and authority remain separate** — Handling evidence survives authorised package removal; capture does not grant receiver writes, provider mutation, source retirement or history compaction. (standards-acquisition.md#retained-state-and-authority)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does retained proof prevent reacquisition of handled sources, and did every publication or destructive operation stay within its own authority?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic
