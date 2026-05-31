---
name: knowledgeislands-authoring
description: >
  The foundational authoring and formatting conventions shared across every Knowledge Islands skill, repo, and base — the common style layer the other skills
  build on rather than restate. Currently covers Markdown authoring (wide tables → footnotes, link style) and TOML config files (the shared `.ki-config.toml`
  shape, one table per skill). Use when writing or editing Markdown or TOML in a Knowledge Islands repo or base, formatting a document, README, table, or config
  to house style, or asking what the house convention is for something. Triggers: "format this to our style", "fix this markdown", "tidy this README", "how
  should this .ki-config.toml look", "what's our convention for tables / links / footnotes", "house style". For KB note-writing conventions use the
  `knowledgeislands-kb` skill; for the rest of a repo's configuration and commit / PR conventions use the `knowledgeislands-repo-config` skill; to judge a
  SKILL.md itself use the `knowledgeislands-skills` skill.
---

# Knowledge Islands authoring conventions

You are applying the **Knowledge Islands authoring conventions** — the foundational authoring and formatting rules every other skill, repo, and base in this
work builds on rather than restates. Conventions are a common theme across the skill set; this skill is the one place they live, so the rest can assume them. It
is the **single source of truth**: a repo's or base's `CLAUDE.md` carries a one-line pointer here instead of restating the rules, keeping the always-on layer
small and the detail in one versioned place.

This is a **standard, base-agnostic Process skill** — it hard-codes no single base and assumes no knowledge-base structure. Install it anywhere the conventions
should apply. How it sits alongside the other skills in this repository, and where it must not overlap them, is documented once in the arcadia-skills
`README.md`, not repeated here.

## The two layers

A convention is one of two kinds, and the distinction decides where it lives — never restate a mechanically-enforced rule here:

- **Mechanical** — deterministically enforced by the house toolchain, so you never hand-apply it. **Prettier + markdownlint-cli2** own Markdown (line width,
  prose wrap, bullet/quote characters, heading hierarchy, single H1, spacing); run `bun run lint:md`. **Biome** owns TS/JSON. Nothing in the toolchain formats
  **TOML**, so its conventions are entirely the judgment layer below.
- **Judgment** — needs a person or model deciding: when a wide table should spill into footnotes, whether link text is descriptive, how a `.ki-config.toml` is
  structured. The toolchain cannot assess these. **This is what this skill carries.**

So the workflow when authoring or tidying Markdown is: write to the judgment conventions, then run `bun run lint:md` to settle everything mechanical. TOML has
no such mechanical pass — the convention is all there is.

## Convention sets

Each set is a self-contained reference, loaded on demand. Read the one relevant to what you are writing.

| Set                | Covers                                                                                      | Reference                                                 |
| ------------------ | ------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Markdown authoring | Wide tables → footnotes (with the marker series), link style, what to leave to the linter   | [markdown-authoring.md](references/markdown-authoring.md) |
| TOML config        | The shared `.ki-config.toml` shape — one `[<skill-name>]` table per skill, keys, exceptions | [toml-config.md](references/toml-config.md)               |

Out of scope by design, with their natural homes:

- **KB note-writing conventions** (zones, frontmatter, routing) → the `knowledgeislands-kb` skill.
- **Commit and PR conventions, and the rest of a repo's configuration** → the `knowledgeislands-repo-config` skill. (That skill owns its own `.ki-config.toml`
  table's _keys_; this skill owns the _file-level shape_ every such table follows.)
- **SKILL.md authoring** (frontmatter, description, body altitude) → the `knowledgeislands-skills` skill.

## Adding a convention set

Keep this skill a thin router so growth has one obvious shape:

1. Add `references/<set-name>.md` holding the **judgment** rules only — state each rule with its _why_, and name what is left to the mechanical toolchain.
2. Add one row to the **Convention sets** table above with a one-line "covers" and the link.
3. Update the `description`'s "Currently covers …" clause so the new set surfaces at selection time.

Mutually-exclusive sets stay in separate files so an unrelated set never loads. If a set has a clear off-ramp to another skill, name it in the "Out of scope"
list rather than absorbing it here.
