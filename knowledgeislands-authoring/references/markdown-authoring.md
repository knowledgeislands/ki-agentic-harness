# Markdown authoring conventions

The **judgment-layer** rules for the markdown we write across Knowledge Islands repos and bases — the choices a formatter can't make. Everything mechanical
(line width, prose wrap, bullet and quote characters, heading hierarchy, single H1, list spacing) is owned by **Prettier + markdownlint-cli2**; run
`bun run lint:md` at the repo root and let it settle those. This file only covers what's left to a person.

## Contents

- [What to leave to the linter](#what-to-leave-to-the-linter)
- [Tables and footnotes](#tables-and-footnotes)
- [Links](#links)

## What to leave to the linter

Don't hand-apply or document any of these — the toolchain owns them, and restating them here only invites drift when a config changes:

- **Line width and prose wrapping** — Prettier reflows prose to its `printWidth` with `proseWrap: always`. Write naturally; let it wrap.
- **Bullet, emphasis, and quote characters; trailing commas; blank-line spacing** — Prettier normalises these.
- **Heading hierarchy, single H1, duplicate-heading and list rules** — markdownlint-cli2 flags these.

The one place width _is_ your job is **tables** — Prettier aligns table columns but will not reflow a row's content, so an over-long row is on you. That's the
first convention below.

## Tables and footnotes

Keep every table **skimmable at a glance**. Prettier pads columns to align them but never breaks a cell across lines, so a cell with too much content forces a
very wide row that's unreadable in a terminal or in print. Aim to keep each row within a comfortable reading width (≈ 100 characters is a good target for
content meant to be read in a terminal or printed).

When a column's content would force the table to wrap awkwardly or demand cryptic abbreviations in the headers, **move the long content into footnotes below the
table** and leave a footnote marker in the cell instead.

**Prefer footnotes over** shrinking headers to cryptic abbreviations, wrapping mid-cell, or dropping a useful column. The table stays scannable; the detail sits
just below it.

### Footnote marker series

Use these markers in order (Chicago-style, omitting `*` since it collides with markdown emphasis):

1. `†` dagger
2. `‡` double dagger
3. `§` section
4. `¶` pilcrow
5. `‖` parallel
6. then doubled: `††`, `‡‡`, `§§`, `¶¶`, `‖‖`

If a visually distinct **second series** is needed — e.g. to separate "caveats" from "sources" in the same table — use: `※` `❡` `¤` `¥`.

### Example

```markdown
| Repo  | Status | Notes |
| ----- | ------ | ----- |
| alpha | ✅     | †     |
| beta  | ⚠️     | ‡     |

† Migration ran cleanly; post-deploy smoke check still pending review. ‡ Failing on the new schema validator — tracked in LIN-1423, owner @kris.
```

## Links

- **Use standard relative markdown links, never Obsidian wikilinks** (`[[…]]`). Wikilinks break the moment a file is relocated, symlinked, or read outside the
  base; relative markdown links survive it. For a path containing spaces, use the CommonMark angle-bracket form: `[ref](<references/My Detail.md>)`.
- **Write descriptive link text** — the words you'd skim for, not "click here" or a bare URL. `[the repo-config standard](…)`, not `[here](…)`.
- **Refer to another skill by its `name`**, never by a file path — "the `knowledgeislands-kb` skill" — because a skill's location on disk is not stable, but its
  name is how it loads into the session.
- **In editor / IDE contexts** where the harness asks for clickable references, link files and lines with relative markdown links
  (`[file.ts:42](src/file.ts#L42)`) rather than bare backtick paths, so the reference is navigable.
