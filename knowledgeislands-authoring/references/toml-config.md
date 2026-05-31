# TOML config conventions

The **judgment-layer** rules for the TOML we write in Knowledge Islands repos — in practice the shared **`.ki-config.toml`** file a repo carries to declare its
own configuration. Nothing in the house toolchain formats TOML (Biome owns TS/JSON, Prettier + markdownlint own Markdown), so unlike Markdown there is no
mechanical pass to fall back on: **these conventions are the whole of it**, applied by hand.

## Contents

- [The shared `.ki-config.toml` file](#the-shared-ki-configtoml-file)
- [Table per skill](#table-per-skill)
- [Keys and values](#keys-and-values)
- [Declared exceptions](#declared-exceptions)
- [Scaffolding and ownership](#scaffolding-and-ownership)

## The shared `.ki-config.toml` file

A repo declares its configuration in **one** `.ki-config.toml` at its root — not one file per concern. It is shared: several skills may read it, each from its
own section. This keeps a repo's declared config in a single reviewable place and lets a skill discover what it needs without a bespoke file.

## Table per skill

Each skill that needs declared config owns **exactly one** TOML table, named for the skill:

```toml
[knowledgeislands-repo-config]
visibility = "public"
exceptions = ["branch-protection", "secret-scanning"]
```

- The table name **matches the skill's `name`** exactly, so the owner is unambiguous and the file reads as a map of skill → its settings.
- A skill reads **only its own table** and never reaches into another skill's — the table boundary is the ownership boundary. If two skills need the same fact,
  it still lives under whichever skill owns it, and the other resolves it from there.

## Keys and values

- **Keys** are lowercase; use `snake_case` for multi-word keys (the prevailing TOML convention). Keep them to the noun the value holds (`visibility`, not
  `repo_visibility_setting`).
- **Strings** are double-quoted; **arrays** use the inline `["a", "b"]` form for short lists.
- **Comment non-obvious keys** with a `#` line above them — a declared value whose meaning isn't self-evident (why an exception is taken, what a flag gates)
  carries its _why_ inline, the same rule as everywhere else.

## Declared exceptions

Where a skill's standard allows intentional divergence, record it as an `exceptions` array of the checker's IDs in that skill's table, rather than letting the
divergence look like drift:

```toml
exceptions = ["branch-protection", "secret-scanning"]  # private repo, plan-limited — revisit on upgrade
```

The owning skill's auditor reports a listed ID as an acknowledged exception instead of a failure. This is the established `knowledgeislands-repo-config`
pattern; adopt the same shape for any other skill that needs declared, reviewable exceptions.

## Scaffolding and ownership

The **keys** inside a table belong to the skill that owns it — that skill documents and scaffolds them (e.g. via an `--init` that appends its default keys), not
this one. This file owns the **file-level shape** every table follows: one shared `.ki-config.toml`, one table per skill named for the skill, read-only across
table boundaries. For a given skill's keys, see that skill (for repo settings, the `knowledgeislands-repo-config` skill).
