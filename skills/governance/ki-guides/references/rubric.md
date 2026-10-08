<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — repository-local practical guides

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-guides --write`.

Line-by-line criteria for auditing ki-guides. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)
- [GUIDE — guide layout](#guide--guide-layout)
- [ROUTE — documentation routing](#route--documentation-routing)

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic

## GUIDE — guide layout

→ [standard](standards-guides.md#guide-root-and-index)

The controlled guide root has an entry point and identifiable guide documents.

- **GUIDE-1 [M] — docs/guides is a regular directory** — `docs/guides/` exists as a regular directory inside the repository. (standards-guides.md#guide-root-and-index)
  - _Remediation:_ diagnostic — Create a regular `docs/guides/` directory inside the repository, then rerun the audit.
- **GUIDE-2 [M] — docs/guides/README.md is the collection entry point** — `docs/guides/README.md` exists as a regular file and is the collection entry point. (standards-guides.md#guide-root-and-index)
  - _Remediation:_ diagnostic — Add a regular `docs/guides/README.md` collection entry point, then rerun the audit.
- **GUIDE-3 [M] — each guide has exactly one H1** — Every Markdown guide below `docs/guides/`, except its root `README.md`, has exactly one H1. (standards-guides.md#guide-root-and-index)
  - _Remediation:_ diagnostic — Give each affected guide exactly one H1, then rerun the audit.
- **GUIDE-4 [M] — a guide links no document outside its collection** — No guide below `docs/guides/` links a Markdown document outside the collection; code paths and sibling guides are unaffected. (standards-guides.md#a-guide-is-self-contained)
  - _Remediation:_ diagnostic — Name the document in prose instead of linking it, or move the material the guide needs into docs/guides/references/, then rerun the audit.
- **GUIDE-5 [M] — every guide lives in an audience folder** — No guide sits directly below `docs/guides/`; apart from the root `README.md`, every guide lives in a folder named for its audience. (standards-guides.md#guide-root-and-index)
  - _Remediation:_ diagnostic — Move each named guide into its primary audience's folder below `docs/guides/`, update every inbound link, then rerun the audit.
- **GUIDE-6 [M] — a guide opens with its outcome** — Every guide below `docs/guides/`, except its root `README.md`, has at least 120 characters of prose before its first `##`; front matter, the H1, and HTML lines do not count. (standards-guides.md#a-guide-opens-with-its-outcome)
  - _Remediation:_ diagnostic — Open each affected guide, before its first `##`, with prose saying what the reader will be able to do once they have read it, then rerun the audit.

## ROUTE — documentation routing

→ [standard](standards-guides.md#boundary-and-migration-rules)

Guides are the durable how without creating parallel documentation systems.

- **ROUTE-1 [M] — retired parallel documentation roots are absent** — A repository declaring this skill has no `docs/spec/` or `docs/developer/` parallel root; their durable material is reclassified into the owned documentation concern. A specialised operational owner decides whether a `docs/logs/` area is generic. (standards-guides.md#boundary-and-migration-rules)
  - _Remediation:_ diagnostic — Reclassify durable material from the retired root into its owning documentation concern, then remove the retired root and rerun the audit.
- **ROUTE-2 [J] — guides are discoverable, actionable, and correctly placed** — The guide index and the audience folders give each intended reader a clear route, and each guide contains practical procedure rather than duplicated rationale, behaviour specification, or future work; stable behaviour reaches its existing Specification or a routed `ki-specs` gap. (standards-guides.md#boundary-and-migration-rules)
  - _Evidence scope:_ The Guides index, every guide below `docs/guides/`, and their linked Decision Records, Specifications, `ki-specs` gaps, and roadmap records where applicable.
  - _Review prompt:_ Can each intended reader find the guide through a clear index route? Do the open-vocabulary audience directories each name a reader rather than a topic, and does each guide sit with its primary reader? Do specialised exact-role paths preserve that route? Can the reader complete the stated outcome, verify success, and recover from the failures described? Are why, what, and when statements held by their Decision Record, existing Specification, routed `ki-specs` gap, and roadmap owners instead?
  - _Outcomes:_ conforming; guide revision; reclassify material
  - _Conforming guidance:_ Revise the index or guide for its intended reader and outcome, rename or regroup an audience folder that names a topic rather than a reader, move a guide to its primary reader, or move rationale, behaviour, and future work to their owning record. Do not invent a fixed directory taxonomy, relocate authored guides through CONFORM, or infer a documentation or product decision from the check alone.
- **ROUTE-3 [J] — a guide cites only what its reader can reach** — Each guide names internal governance artefacts only where its intended reader holds the repository; a guide written for somebody using what the repository produces is bounded by the product, its configuration, the files it leaves on that reader's machine, and its sibling guides. (standards-guides.md#what-a-reader-can-be-expected-to-reach)
  - _Evidence scope:_ Every guide below `docs/guides/`, read against the audience its collection declares by grouping or by its own framing.
  - _Review prompt:_ For each guide, who is the reader, and does every artefact the guide names sit within their reach? A reader working in this repository can open a Decision Record or a roadmap item that is named. A reader using what the repository produces holds the product and not `docs/decisions/` or `docs/roadmap/`, so naming a record there cites something they cannot open and did not ask about.
  - _Outcomes:_ conforming; guide revision; reclassify material
  - _Conforming guidance:_ State the substance the record decided, in the guide, in terms of what the reader does — or move the material to a guide whose reader can reach it. Do not infer audience from a directory name alone where the guide itself says otherwise, and do not mechanically fail a named identifier: whether a reader can reach it is a judgment about that reader.
- **ROUTE-4 [J] — link text carries a fact, not a deferral** — Each link in a guide carries a fact the guide has already stated; no link text stands in for content the guide owes its reader. (standards-guides.md#a-guide-is-self-contained)
  - _Evidence scope:_ Every link in every guide below `docs/guides/`, read with the sentence that holds it.
  - _Review prompt:_ For each link, remove it: does the sentence still say something true and useful? A link that cites a fact the guide has already stated passes. A link whose text is where the answer lives, such as "the full guide", "see the README" or a bare "here", defers the content the guide owes its reader.
  - _Outcomes:_ conforming; guide revision
  - _Conforming guidance:_ State the fact in the guide and keep the link as a citation of it, or drop the link. Do not mechanically fail a phrase: a phrase list refuses honest sentences and passes dishonest ones, so whether link text carries a fact is a judgment about the sentence.
