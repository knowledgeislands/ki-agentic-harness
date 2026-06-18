---
name: knowledgeislands-authoring
description: >
  The foundational authoring and formatting conventions shared across every Knowledge Islands skill, repo, and base — the common style layer
  the others build on rather than restate. Currently covers Markdown authoring (wide tables → footnotes, link style) and TOML formatting
  style (for the shared `.ki-config.toml`). Use when writing or editing Markdown or TOML, bringing a document, README, table, or config to
  house style (conform), checking one against the conventions (audit), or refreshing them against their sources. Triggers: "format this to
  our style", "fix this markdown", "tidy this README", "audit this doc's formatting", "does this follow house style", "what's our convention
  for tables / links / footnotes". For KB note-writing use the `knowledgeislands-kb` skill; for a repo's configuration and the
  `.ki-config.toml` contract use `knowledgeislands-repo`; to judge a SKILL.md use `knowledgeislands-skills`; for the build/lint/test
  toolchain use `knowledgeislands-engineering`.
argument-hint: 'audit <path> | conform <path> | refresh'
---

# Knowledge Islands authoring conventions

You are applying the **Knowledge Islands authoring conventions** — the foundational authoring and formatting rules every other skill, repo,
and base in this work builds on rather than restates. Conventions are a common theme across the skill set; this skill is the one place they
live, so the rest can assume them. It is the **single source of truth**: a repo's or base's `CLAUDE.md` carries a one-line pointer here
instead of restating the rules, keeping the always-on layer small and the detail in one versioned place.

This is a **standard, base-agnostic Process skill** — it hard-codes no single base and assumes no knowledge-base structure. Install it
anywhere the conventions should apply. How it sits alongside the other skills in this repository, and where it must not overlap them, is
documented once in the arcadia-agentic-harness `README.md`, not repeated here.

## The two layers

A convention is one of two kinds, and the distinction decides where it lives — never restate a mechanically-enforced rule here:

- **Mechanical** — deterministically enforced by the house toolchain, so you never hand-apply it. **Prettier + markdownlint-cli2** own
  Markdown (line width, prose wrap, bullet/quote characters, heading hierarchy, single H1, spacing); run `bun run lint:md`. **Biome** owns
  TS/JSON. Nothing in the toolchain formats **TOML**, so its conventions are entirely the judgment layer below.
- **Judgment** — needs a person or model deciding: when a wide table should spill into footnotes, whether link text is descriptive, how a
  `.ki-config.toml` reads. The toolchain cannot assess these. **This is what this skill carries.**

So the workflow when authoring or tidying Markdown is: write to the judgment conventions, then run `bun run lint:md` to settle everything
mechanical. TOML has no such mechanical pass — the convention is all there is.

## Operating modes

Like every governance skill it carries **AUDIT · CONFORM · REFRESH** — no INIT, since it conforms existing documents rather than scaffolding
new artifacts. Infer the mode from the request; ask if unclear. (Modes are named and alphabetical.) The conventions each mode acts on are
the **Convention sets** below; the checkable criteria are in [the rubric](references/audit-rubric.md).

### Mode AUDIT — check a document against house style

1. Run `bun run lint:md` for the **mechanical** layer (Prettier + markdownlint) and capture its output — never hand-judge what it enforces.
2. Apply the **judgment** (`[J]`) criteria from [the rubric](references/audit-rubric.md): wide tables that should spill into footnotes,
   non-descriptive link text, a `.ki-config.toml` that reads poorly. TOML has no mechanical pass — the rubric is all of it.
3. **Report** by location → criterion → fix; lead with anything that breaks the build (`lint:md` failures), then the judgment findings.

### Mode CONFORM — bring a document into house style

1. Apply the judgment transforms in place — wide tables → footnotes (the marker series), descriptive link text, tidy TOML — per the
   Convention sets.
2. Run `bun run lint:md` to settle the mechanical layer (table alignment, prose wrap, and transient `MD052`/`MD060` until references and
   alignment land).
3. Re-run until `lint:md` is clean and the judgment criteria pass.

### Mode REFRESH — re-anchor the conventions to their sources

The house conventions sit on top of external tools and specs (CommonMark, Prettier, markdownlint, the TOML spec), which move. Run
periodically (monthly, with the other skills), or when asked "are the authoring conventions current".

1. **Read [the source list](references/sources.md)** — each tracked source with its `last reviewed` date.
2. **Re-fetch each** (WebFetch; fall back to WebSearch if a host is blocked or returns non-200) and diff against the convention references:
   a changed Prettier/markdownlint default that shifts what's mechanical, a CommonMark/TOML change, a rule worth adopting.
3. **Propose a diff** to the convention references (and this skill); confirm before writing.
4. **Update [the source list](references/sources.md)** — bump each `last reviewed` date and refresh the `## Last review` block (what's
   confirmed, open watch-items). What changed goes in the commit, not a changelog.

## Convention sets

Each set is a self-contained reference, loaded on demand. Read the one relevant to what you are writing.

- **[Markdown authoring](references/markdown-authoring.md)** — wide tables → footnotes (with the marker series), link style, and what to
  leave to the linter. The footnote-marker series, in order, is `†` `‡` `§` `¶` `‖` (then doubled: `††` `‡‡` `§§` `¶¶` `‖‖`), reset per
  table — omitting `*`, which collides with markdown emphasis; where one table needs two footnote categories, a visually distinct second
  series `※` `❡` `¤` `¥` separates them. (Stated here so it is reachable without opening the reference; the worked example, gotchas, and
  rationale stay in the reference.)
- **[TOML formatting](references/toml-config.md)** — key case, quoting, and comments for the shared `.ki-config.toml` (its _contract_ is
  `knowledgeislands-repo`'s).

Out of scope by design, with their natural homes:

- **KB note-writing conventions** (zones, frontmatter, routing) → the `knowledgeislands-kb` skill.
- **Commit and PR conventions, a repo's configuration, and the `.ki-config.toml` _contract_** (the compliance marker + one-table-per-skill
  model) → the `knowledgeislands-repo` skill. This skill owns only the TOML _formatting_ style every such table is written in.
- **SKILL.md authoring** (frontmatter, description, body altitude) → the `knowledgeislands-skills` skill.

## Adding a convention set

Keep this skill a thin router so growth has one obvious shape:

1. Add `references/<set-name>.md` holding the **judgment** rules only — state each rule with its _why_, and name what is left to the
   mechanical toolchain.
2. Add one row to the **Convention sets** table above with a one-line "covers" and the link.
3. Update the `description`'s "Currently covers …" clause so the new set surfaces at selection time.

Mutually-exclusive sets stay in separate files so an unrelated set never loads. If a set has a clear off-ramp to another skill, name it in
the "Out of scope" list rather than absorbing it here.
