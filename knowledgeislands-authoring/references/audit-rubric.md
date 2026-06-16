# Authoring audit rubric

The checkable criteria behind the [Markdown authoring](markdown-authoring.md) and [TOML formatting](toml-config.md) conventions. Each is
**[M] mechanical** (the house toolchain — Prettier + markdownlint-cli2 via `bun run lint:md`, Biome for TS/JSON — enforces it; never
hand-judge what a tool checks better) or **[J] judgment** (a reader assesses it). TOML has no formatter, so every TOML criterion is `[J]`.

## Markdown

- **MD-mech [M]** `bun run lint:md` passes: line width / prose wrap, bullet & quote characters, heading hierarchy, single H1, spacing, table
  alignment (`MD060`), resolved link fragments (`MD051`) and references (`MD052`). Prettier + markdownlint own these.
  (markdown-authoring.md)
- **MD-table [J]** A table that would exceed `printWidth` (160, from `.prettierrc.json`) is reshaped: a descriptive matrix → subheadings or
  a bulleted definition list; genuinely tabular data with one long column → keep the table and move that column to footnotes below it (a
  one-char marker in the cell). (markdown-authoring.md)
- **MD-footnote [J]** Footnotes use the marker series `† ‡ § ¶ ‖` (then doubled), reset per table; a distinct second series `※ ❡ ¤ ¥` where
  one table needs two. Each footnote is separated by a blank line (Prettier reflows adjacent ones into a paragraph). (markdown-authoring.md)
- **MD-link [J]** Link text is descriptive (the words you'd skim for), never "click here" or a bare URL; links are relative markdown, never
  wikilinks; use the angle-bracket form for paths with spaces. (markdown-authoring.md)
- **MD-cell-prose [J]** Tables avoid long descriptive prose in cells — that is the footnote's job. (markdown-authoring.md)

## TOML

- **TOML-keys [J]** Keys lowercase, `snake_case` for multi-word, named for the noun the value holds (`visibility`, not
  `repo_visibility_setting`). (toml-config.md)
- **TOML-values [J]** Strings double-quoted; short lists inline `["a", "b"]`. (toml-config.md)
- **TOML-tables [J]** One table per skill, named for the skill, with sub-tables nested under it. The `.ki-config.toml` _contract_ behind
  this is `knowledgeislands-repo`'s; this rubric checks only that the TOML is written that way. (toml-config.md)
- **TOML-comments [J]** Non-obvious keys carry a `#` line above with their _why_. (toml-config.md)

## Judgment / sync

- **sync [J]** the convention references, this rubric, and [`sources.md`](sources.md) agree; when a convention moves, all three move
  together (Mode REFRESH).
