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

- **DIAG-1 [M] — the manifest and the committed files agree both ways** — `docs/diagrams/diagrams.toml` is valid and complete, each `traced` entry a repository-relative path, a pathspec glob or a private repository's `path:revision:lines` citation; every listed diagram has its source, its SVG and an embed in `docs/diagrams/README.md`, and a diagram with `commit_html = true` also has its `<slug>.html`, linked from the README; and every file under `docs/diagrams/` belongs to a listed diagram, an HTML file and its `<slug>.receipt.json` only under that opt-in. (standards-diagrams.md#the-manifest, standards-diagrams.md#committed-forms)
  - _Remediation:_ diagnostic — List each diagram in `diagrams.toml` with every field, commit its `<slug>.<type>.json` source and `<slug>.svg`, embed the SVG in `README.md`, commit and link `<slug>.html` only where `commit_html = true`, and remove or list any stray file, then rerun the audit.
- **DIAG-2 [M + J] — no committed diagram file carries private information** — No committed diagram source, SVG or interactive HTML contains a local absolute path, a `file://` URL or an email address, and none names a private repository or a person. A repository URL appears in a citation only where the remote is public; a private repository cites `path:revision:lines` with no URL, and the audit accepts either form. (standards-diagrams.md#privacy)
  - _Remediation:_ diagnostic — Replace the local path, URL or address in the source with a repository-relative or generic label, rebuild and re-export the SVG, then rerun the audit.
  - _Evidence scope:_ Every committed diagram source, SVG and HTML under docs/diagrams.
  - _Review prompt:_ Does any label, card, citation or repository URL name a private repository, a person, note content or a commit subject that a public reader of this repository should not see, and does any citation carry a repository URL where the remote is private rather than the URL-free `path:revision:lines` form?
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
- **DIAG-6 [M] — each committed viewer carries a receipt that matches its source** — Every diagram with `commit_html = true` has a `docs/diagrams/<slug>.receipt.json` naming its slug, type, source and HTML, whose SHA-256 hashes and byte counts match the committed source and viewer, with the renderer's name and version; it is read from committed files alone, and `last_checked` plays no part. (standards-diagrams.md#committed-forms, standards-diagrams.md#regeneration-and-freshness)
  - _Remediation:_ diagnostic — Re-render the diagram with the build command, which writes its viewer and receipt together, and commit both with the source; never hand-edit a receipt. Then rerun the audit.
- **DIAG-7 [M] — no Mermaid diagram is left in tracked Markdown unless kept** — Each fenced block whose info string is `mermaid` in the repository's tracked Markdown, backtick or tilde, warns with its file and line until it is replaced by an Archify diagram or the owner decides to keep it, recorded by `<!-- ki-diagrams: keep mermaid -->` on the line before the fence; a fence shown inside a longer fence is an example and is not counted. (standards-diagrams.md#the-tool-archify)
  - _Remediation:_ diagnostic — Replace the diagram with an Archify diagram under Mode REFRESH, or, where the owner decides to keep it, put `<!-- ki-diagrams: keep mermaid -->` on the line before the fence; then rerun the audit.
- **DIAG-8 [M] — each working folder under `+/diagrams/` carries a well-formed mark** — Each folder under `+/diagrams/` carries a `mark.toml` at its root naming the work, the run and agent or the session that wrote it, and `written_at`, under the `ki-delegation` background-run standard's working-area marks; a folder without one, or whose mark is not well formed, warns. (standards-diagrams.md#regeneration-and-freshness)
  - _Remediation:_ diagnostic — Rebuild the diagram with `scripts/build-html.ts`, which writes the mark, passing `--work <id>` from an interactive session; or delete a folder no one owns; rerun the audit.
