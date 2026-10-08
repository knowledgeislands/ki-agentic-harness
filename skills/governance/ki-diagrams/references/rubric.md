<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — repository living diagrams

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-diagrams --write`.

Line-by-line criteria for auditing ki-diagrams. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)
- [DIAG — living diagrams](#diag--living-diagrams)

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic

## DIAG — living diagrams

→ [standard](standards-diagrams.md#the-manifest)

A repository keeps traced, self-contained, current Archify diagrams under one manifest.

- **DIAG-1 [M] — the manifest and the committed files agree both ways** — `docs/diagrams/diagrams.toml` is valid and complete; every listed diagram has its source, its SVG and an embed in `docs/diagrams/README.md`; and every file under `docs/diagrams/` belongs to a listed diagram. (standards-diagrams.md#the-manifest, standards-diagrams.md#committed-forms)
  - _Remediation:_ diagnostic — List each diagram in `diagrams.toml` with every field, commit its `<slug>.<type>.json` source and `<slug>.svg`, embed the SVG in `README.md`, and remove or list any stray file, then rerun the audit.
- **DIAG-2 [M + J] — no committed source or SVG carries private information** — No committed diagram source or SVG contains a local absolute path, a `file://` URL or an email address, and none names a private repository or a person. (standards-diagrams.md#privacy)
  - _Remediation:_ diagnostic — Replace the local path, URL or address in the source with a repository-relative or generic label, rebuild and re-export the SVG, then rerun the audit.
  - _Evidence scope:_ Every committed diagram source and SVG under docs/diagrams.
  - _Review prompt:_ Does any label, card, citation or repository URL name a private repository, a person, note content or a commit subject that a public reader of this repository should not see?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record a gap naming the diagram and the label, and rewrite the label generically before the next export.
- **DIAG-3 [M] — each SVG is self-contained** — Every committed `docs/diagrams/*.svg` is an SVG document whose `href` and `url()` references are fragments or inline `data:` URIs only. (standards-diagrams.md#committed-forms)
  - _Remediation:_ diagnostic — Re-export the SVG with the ki-diagrams exporter, which refuses an export with an external reference, then rerun the audit.
- **DIAG-4 [M + J] — no traced path changed since the diagram was last checked** — For each listed diagram, read-only Git history shows no change to a `traced` path between its `last_checked` revision and `HEAD`, and that revision exists in the repository's history. (standards-diagrams.md#regeneration-and-freshness)
  - _Remediation:_ diagnostic — Review the change against the diagram's `stale_when`; regenerate it if the change matches, then set `last_checked` to the revision checked, and rerun the audit.
  - _Evidence scope:_ Each diagram DIAG-4 reports, with its stale_when line and the reported changes.
  - _Review prompt:_ Does the change match the diagram's stale_when line, so that the diagram no longer tells the truth, or is it outside what the diagram draws?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ A matching change is a gap: regenerate through Mode REFRESH. A non-matching change is conforming once last_checked advances to the revision reviewed.
- **DIAG-5 [J] — each diagram finalizes at showcase quality and its type answers its question** — Each listed source passes Archify's `finalize --quality showcase` gates, and its diagram type is the one the standard maps its question to. (standards-diagrams.md#choosing-a-diagram-type, standards-diagrams.md#regeneration-and-freshness)
  - _Evidence scope:_ Every listed diagram, with Archify installed.
  - _Review prompt:_ Does `finalize <type> <source> <output.html> --repo-root . --quality showcase` pass all four gates, and does the chosen type answer the manifest question as the standard maps questions to types?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Without Archify, record the review as unevaluated with the Rig install instruction. A failing gate or a mismatched type is a gap for Mode REFRESH.
