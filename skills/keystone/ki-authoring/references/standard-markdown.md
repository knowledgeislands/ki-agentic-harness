---
type: standard@2026-11-09T21:36:32Z
revised: 2026-11-09T22:09:53Z
status: in force
---

# Markdown authoring conventions

## Contents

- [1. Introduction](#1-introduction)
- [2. Scope](#2-scope)
  - [2.1 In scope](#21-in-scope)
  - [2.2 Out of scope](#22-out-of-scope)
- [3. Terms and definitions](#3-terms-and-definitions)
- [4. Rules](#4-rules)
  - [4.1 What to leave to the linter](#41-what-to-leave-to-the-linter)
  - [4.2 Markdown flavour](#42-markdown-flavour)
  - [4.3 Migration safety](#43-migration-safety)
  - [4.4 Tables and footnotes](#44-tables-and-footnotes)
    - [4.4.1 Table or list?](#441-table-or-list)
    - [4.4.2 Keeping tables skimmable](#442-keeping-tables-skimmable)
    - [4.4.3 Footnote marker series](#443-footnote-marker-series)
    - [4.4.4 Example](#444-example)
    - [4.4.5 Gotchas](#445-gotchas)
  - [4.5 Frontmatter](#45-frontmatter)
  - [4.6 Links](#46-links)
  - [4.7 Callouts](#47-callouts)
  - [4.8 Code blocks](#48-code-blocks)

## 1. Introduction

The **judgment-layer** rules for the Markdown written across Knowledge Islands repositories and bases — the choices a formatter cannot make. Markdown is a distinct standard because its mechanical formatter/linter boundary and its human table, link, callout, and code-block decisions do not apply to the TOML configuration format. Everything mechanical (prose wrapping, bullet and quote characters, heading hierarchy, single H1, list spacing) is owned by **rumdl**; run `ki repo conform --skill ki-authoring` at the repository root and let that hosted rubric settle those. This file only covers what remains for a person or model. The decisions behind these rules are in [the sources file](sources.md#3-decisions).

[Back to contents](#contents)

## 2. Scope

The judgment choices left in Markdown after the mechanical gate.

### 2.1 In scope

- Markdown flavour and conversion to GFM.
- Migration safety when acting on linter findings.
- Tables and footnotes, frontmatter presentation, links, callouts and code blocks.

[Back to contents](#contents)

### 2.2 Out of scope

- Everything mechanical, owned by rumdl: what to leave to it is listed in [4.1](#41-what-to-leave-to-the-linter).
- The mechanical gate itself: the [authoring enforcement standard](standard-authoring.md).
- A document's required frontmatter fields and value semantics: the domain skills that own them.

[Back to contents](#contents)

## 3. Terms and definitions

| Term | Definition |
| --- | --- |
| **Judgment layer** | The choices a formatter cannot make, left for a person or model. **Standard:** this one, [1](#1-introduction) |
| **GFM** | GitHub-flavoured Markdown, the flavour Knowledge Islands prefers. **Standard:** this one, [4.2](#42-markdown-flavour) |

[Back to contents](#contents)

## 4. Rules

The rules, part by part.

### 4.1 What to leave to the linter

Don't hand-apply or document any of these — the toolchain owns them, and restating them here only invites drift when a config changes:

- **Prose wrapping** — rumdl runs `MD013` with `reflow-mode = "normalize"` at an unbounded width, which joins any mid-paragraph line break back to a single line. Never insert a line break mid-sentence; the linter will undo it.
- **Bullet, emphasis, and quote characters; trailing commas; blank-line spacing** — rumdl normalises these.
- **Heading hierarchy, single H1, duplicate-heading and list rules** — rumdl flags these.

The one place column width _is_ your job is **tables**, and it is now wholly your job. The former formatter padded table columns only when the padded result fit within its print width, leaving wider tables compact; rumdl's `MD060` styles are unconditional, so the house configuration leaves the opt-in `MD060` off and enforces neither shape. Nothing mechanical will align a table for you — that makes the width conventions below load-bearing rather than advisory.

[Back to contents](#contents)

### 4.2 Markdown flavour

Markdown stays the Knowledge Islands authoring format. Typst is noted as a possible authoring alternative, not adopted: Kris said on 29 October 2026, under DIAGRAM-TOOLS, "Typst is definitely more about authoring and is possibly an alternative to Markdown. But right now, Markdown is what we use." Nothing here authors in Typst until a later decision says so; its diagramming package, fletcher, is ranked in the `ki-diagrams` [tool preference order](../../../governance/ki-diagrams/references/standards-diagrams.md#tool-preference-by-diagram-kind).

Knowledge Islands prefers GitHub-flavoured Markdown (GFM). Other flavours, chiefly Obsidian's wikilinks, embeds and custom callouts, remain supported: a reader, audit or tool must never fail merely because a file uses another flavour, and no one need convert a file just to read or cite it. Do not add a per-note flavour field.

A file you edit is converted as a whole to GFM in the same change, through the converter once it exists, with the conversion visible for review; if the converter refuses the file, flag it for a decision or record an approved exception.

A repository may rewrite a batch of files, or the whole repository, to GFM in a dedicated change with no unrelated edits, after the converter's dry run, verification and decisions on exceptions. Where a construct has no GFM equivalent, such as a block reference, a transclusion or a plugin query, the author decides its replacement or records an approved exception; it is never dropped silently.

[Back to contents](#contents)

### 4.3 Migration safety

Treat Markdown-linter findings as evidence, not permission for a bulk rewrite when the syntax has more than one valid meaning.

In particular, a setext-style heading uses an underline of `---`, but the same line can be a horizontal rule after an image or other block. Before converting a setext-heading finding to an ATX heading, classify its local structure and intended meaning; where that remains uncertain, preserve the source and obtain the author's confirmation. Do not apply a global `---` → `##` transform.

[Back to contents](#contents)

### 4.4 Tables and footnotes

When to use a table, how to keep one skimmable, and how to footnote what does not fit.

#### 4.4.1 Table or list?

Decide this **before** reaching for `|` pipes. A table earns its cost only when the content is a genuine grid: **three or more columns** of parallel attributes a reader scans _across_ as well as _down_, where aligning the columns is what makes it readable — a comparison matrix, a Sources table of source / tag / governs / reviewed.

A **two-column table is almost always a list in disguise** — a term and its explanation. Write those as a bulleted list with a **bold lead-in term**:

- it wraps naturally within `printWidth`, so long explanations never trip the width rule or force footnote gymnastics;
- it reads cleanly in a terminal and in print, with no column padding to blow out;
- it diffs one line per entry, so edits and reviews stay legible.

Rule of thumb: **table for parallel data across several dimensions; list for term → description pairs**, and for anything whose cells would be full sentences. If a table has exactly two columns, or any cell runs to a sentence or more, it wants to be a list.

[Back to contents](#contents)

#### 4.4.2 Keeping tables skimmable

Keep every table **skimmable at a glance**. Nothing breaks a cell across lines, so a cell with too much content forces a very wide row that's unreadable in a terminal or in print. Aim to keep each row within 120 characters.

When a column's content would force the table to wrap awkwardly or demand cryptic abbreviations in the headers, **move the long content into footnotes below the table** and leave a footnote marker in the cell instead.

**Prefer footnotes over** shrinking headers to cryptic abbreviations, wrapping mid-cell, or dropping a useful column. The table stays scannable; the detail sits just below it.

[Back to contents](#contents)

#### 4.4.3 Footnote marker series

Use these markers in order (Chicago-style, omitting `*` since it collides with markdown emphasis):

1. `†` dagger
2. `‡` double dagger
3. `§` section
4. `¶` pilcrow
5. `‖` parallel
6. then doubled: `††`, `‡‡`, `§§`, `¶¶`, `‖‖`

If a visually distinct **second series** is needed — e.g. to separate "caveats" from "sources" in the same table — use: `※` `❡` `¤` `¥`.

[Back to contents](#contents)

#### 4.4.4 Example

```markdown
| Repo  | Status | Notes |
| ----- | ------ | ----- |
| alpha | ✅     | †     |
| beta  | ⚠️     | ‡     |

† Migration ran cleanly; post-deploy smoke check still pending review.

‡ Failing on the new schema validator — tracked in LIN-1423, owner @kris.
```

[Back to contents](#contents)

#### 4.4.5 Gotchas

Learned applying this; bake them in:

1. **Separate every footnote with a blank line.** Adjacent footnote lines without a blank line between them render as a single paragraph — keep each footnote on its own paragraph.
2. **Footnoting a column often isn't enough to reach `printWidth`.** A long `Source` URL still blows the row out; convert such URLs to **reference-style links** (`[text][ref]` in the cell, `[ref]: https://…` definitions collected at the file bottom).
3. **When the long cell is content, not a URL,** reference links don't help — shorten the cell to a short label with a marker and move the full content to a **second-series (`※`) footnote**.
4. **Watch for a pre-existing footnote series.** If a table already uses `†` for something (e.g. a date caveat), give the dominant content series the primary daggers and move the lone caveat to the `※` series so markers don't collide.
5. **Author loosely, then run `ki repo conform --skill ki-authoring`.** rumdl flags `MD052` (undefined reference) until the `[ref]:` definitions land — transient; the pass should end at 0 errors. It will not re-align table padding, so check that yourself.

[Back to contents](#contents)

### 4.5 Frontmatter

Frontmatter is authored Markdown content. Use an unquoted scalar when it is a plain, unambiguous token; quote a value only when quoting preserves its intended string meaning or makes punctuation and whitespace clear.

The mechanical normalizer removes paired single or double quotes only when the value is a bare-safe identifier-like token (`[A-Za-z_][A-Za-z0-9_-]*`) and is not YAML-significant (`true`, `false`, `null`, `y`, `n`, `yes`, `no`, `on`, `off`, `.nan`, or `.inf`, case-insensitively). It leaves dates, numeric-looking values, whitespace, punctuation, escaped values, and YAML-significant scalars unchanged.

For example, write `id: PERSONAL-DOTFILES-UE-001`, not `id: 'PERSONAL-DOTFILES-UE-001'`; retain `title: "A value: with punctuation"` and `enabled: "true"` where those values must remain strings.

This is an authoring presentation rule. Domain skills own a document's required frontmatter fields and value semantics; `ki` accepts valid quoted scalar input so existing authored files remain readable.

[Back to contents](#contents)

### 4.6 Links

- **Use descriptive, note-relative Markdown links in angle brackets as the house form**, including KB note content: `[ref](<references/My Detail.md>)`. Normalise Obsidian's `%20` space encoding to literal spaces inside the angle-bracket destination, structurally within links; preserve other necessary URI escapes and literal percent signs. `ki-repo-kb` owns internal-link resolution.
- **Keep supported wikilinks readable inside table cells.** Escape an existing wikilink alias separator as `\|`; an unescaped `|` is parsed as a column separator. GFM conversion uses a descriptive Markdown link instead.
- **Write descriptive link text** — the words you'd skim for, not "click here" or a bare URL. `[the repo standard](…)`, not `[here](…)`.
- **Refer to another skill by its `name`**, never by a file path — "the `ki-repo-kb` skill" — because a skill's location on disk is not stable, but its name is how it loads into the session.
- **In editor / IDE contexts** where the harness asks for clickable references, link files and lines with relative markdown links (`[file.ts:42](src/file.ts#L42)`) rather than bare backtick paths, so the reference is navigable.

Link presentation does not establish territorial authority or canonical knowledge ownership. `ki-repo-kb` owns KB identity, provenance, and adoption; `ki-repo-kb-principal` owns the territorial Charter and Known Lands declaration contract. Keep those declarations in their governed homes and link to them rather than restating them as general authoring conventions.

[Back to contents](#contents)

### 4.7 Callouts

Use a GitHub alert only when a short, contextual aside needs to remain visually distinct from the surrounding prose.

Write the alert in the exact GitHub form: `> [!NOTE] Message`. The supported labels are `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, and `CAUTION`; choose the least severe label that accurately signals the consequence.

Do not use a callout for ordinary explanatory prose, a required procedural step, or a heading substitute. Keep it concise, use no custom title, and state the action or consequence directly. For example:

```markdown
> [!NOTE] Knowledge Islands diagnostics are coming soon. This command currently performs no checks and changes nothing.
```

GitHub alerts are an intentional GitHub-flavoured Markdown extension. Use ordinary prose when the rendered target does not support them.

[Back to contents](#contents)

### 4.8 Code blocks

Every fenced code block must carry a **language specifier** — never bare triple backticks.

```bash
# good
echo "hello"
```

Use the closest accurate tag. Common choices: `bash` or `sh` for shell commands; `ts`, `js`, `python`, `go`, etc. for source; `toml`, `yaml`, `json` for config; `text` for literal output that isn't a recognised language. When in doubt, `text` is correct and satisfies the rule — any specifier beats none.

**Why:** language tags enable syntax highlighting in GitHub, rendered docs, and IDE previews; downstream renderers (including the Artifact tool) key off the tag. Bare blocks are the second-most-common authoring friction point after wide tables.

[Back to contents](#contents)
