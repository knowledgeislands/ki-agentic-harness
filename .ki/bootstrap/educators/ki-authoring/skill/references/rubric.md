<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — authoring conventions

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical; this file is generated from the in-memory catalogue. Edit the item definitions, then rerun `scripts/rubric/publish.ts`.

Line-by-line criteria for auditing ki-authoring. Classifications are derived from item aspects: **[M]** mechanical and **[J]** judgment. Sources are cited as declared by each canonical item.

## MD — Markdown authoring

→ [standard](standards/markdown.md)

The mechanical Markdown gate and reviewer-applied Markdown conventions.

- **MD-mech [M] — Markdown mechanical gate passes** — `ki:authoring:audit` passes: prose is unwrapped; bullet and quote characters, heading hierarchy, a single H1, spacing, table alignment, resolved links and references, no bare URLs, and descriptive link text satisfy Prettier and markdownlint-cli2, which run directly inside the audit. (standards/markdown.md)
- **MD-table [J] — wide tables are reshaped** — A table with rows that would exceed `printWidth` (140 chars) is reshaped into subheadings or a bulleted definition list; genuinely tabular data with one long column keeps the table and moves that column to footnotes below it. (standards/markdown.md)
  - _Review prompt:_ Are wide or prose-heavy tables reshaped according to the Markdown convention?
- **MD-footnote [J] — table footnotes use the house marker series** — Footnotes use the marker series `† ‡ § ¶ ‖` (then doubled), reset per table, with a distinct second series `※ ❡ ¤ ¥` where needed; each footnote is a separate paragraph. (standards/markdown.md)
  - _Review prompt:_ Do table footnotes use the documented marker series and paragraph layout?
- **MD-link [J] — house-file links are descriptive and portable** — House-file links are descriptive relative Markdown links rather than wikilinks; paths with spaces use angle brackets. KB note content and agent prompts remain explicitly scoped exceptions. (standards/markdown.md)
  - _Review prompt:_ Are the links descriptive, relative Markdown links where this convention applies?
- **MD-cell-prose [J] — tables avoid descriptive prose in cells** — Tables avoid long descriptive prose in cells — that is the footnote’s job. (standards/markdown.md)
  - _Review prompt:_ Do table cells avoid long descriptive prose?

## OWN — owned authoring configuration

→ [standard](../SKILL.md)

Configuration files wholly owned by the authoring convention.

- **OWN-1 [M] — owned authoring configuration matches the house templates** — The skill owns `.prettierrc.json`, `.editorconfig`, and `.markdownlint-cli2.jsonc` wholly (SHAPE-16 `owns:`): AUDIT warns on hash drift from the house templates, while CONFORM scaffolds missing files and overwrites drift. (owns:)

## TOML — TOML formatting

→ [standard](standards/toml.md)

Reviewer-applied TOML formatting conventions.

- **TOML-keys [J] — TOML keys are concise lowercase nouns** — Keys are lowercase, use `snake_case` for multiple words, and name the noun their value holds (`visibility`, not `repo_visibility_setting`). (standards/toml.md)
  - _Review prompt:_ Are TOML keys concise lowercase nouns, using snake_case for multiple words?
- **TOML-values [J] — TOML values use the house formatting** — Strings are double-quoted and short lists remain inline (`["a", "b"]`). (standards/toml.md)
  - _Review prompt:_ Do TOML strings and short lists follow the house formatting?
- **TOML-tables [J] — TOML uses one table per skill** — One table appears per skill, named for that skill, with subtables nested under it; `ki-repo` owns the `.ki-config.toml` contract behind this convention. (standards/toml.md)
  - _Review prompt:_ Does the TOML use one table per skill with nested subtables where appropriate?
- **TOML-comments [J] — non-obvious TOML keys explain their rationale** — Non-obvious keys carry a preceding `#` comment explaining why they exist. (standards/toml.md)
  - _Review prompt:_ Do non-obvious TOML keys carry a preceding rationale comment?

## SYNC — convention synchronisation

→ [standard](sources.md)

The generated publication and its convention sources remain coherent.

- **SYNC-1 [J] — conventions, rubric, and source record agree** — The convention references, this rubric, and `sources.md` agree; when a convention moves, all three move together. (sources.md)
  - _Review prompt:_ Do the convention references, rubric publication, and source record agree?
