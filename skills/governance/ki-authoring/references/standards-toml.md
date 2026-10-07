# TOML formatting style

The **judgment-layer** presentation rules for the TOML written in Knowledge Islands repositories. TOML is a distinct standard because it has no mechanical house formatter and governs configuration readability rather than Markdown documents. Nothing in the house toolchain formats TOML (Biome owns TS/JSON, rumdl owns Markdown), so unlike Markdown there is no mechanical pass to fall back on: these conventions are applied by a person or model, and `ki-repo` checks the mechanical part of the `.ki.toml` layout.

This file owns only **presentation** (how existing values and comments read). The identity and topology of `.ki.toml` — including keys, tables, the compliance marker, the one-table-per-skill model, validation, declared divergences, and scaffolding — are semantic contract questions owned by `ki-repo`. Do not rename or create keys or tables to satisfy this style.

## Keys and values

- **Strings** are double-quoted.
- **Arrays** are always multiline: one element per line, each with a trailing comma, and the closing bracket on its own line. A single-element array follows the same form.
- **No inline tables.** A small map uses dotted keys or a nested table, as [Configuration structure](#configuration-structure) describes.
- **Comment non-obvious keys** with a `#` line above them — a declared value whose meaning isn't self-evident (why a value is set, what a flag gates) carries its _why_ on the line above, never at the end of the line.

```toml
[skills.ki-repo]
# Required agent-runtime support surface
supported_runtimes = [
  "claude-code",
  "chatgpt-codex",
]
```

## Configuration structure

In `.ki.toml`, the exact conformance header, skill-root declarations, semantic neighbourhoods, and owner boundaries belong to the `ki-repo` contract. Presentation makes those boundaries legible without changing the parsed data. Every `.ki.toml` follows six layout rules:

1. **Header, then banners.** The exact two-line conformance header comes first, then the neighbourhood banners in a fixed order: Foundation, Repository shape, Governance and runtime, Change management, Relationships. Omit an empty neighbourhood. No other decorative rule precedes, wraps or separates them.
2. **One blank line.** Exactly one blank line precedes every table heading and every banner. A comment above a heading belongs to it, so the blank line comes before the comment.
3. **No inline tables, multiline arrays.** As [Keys and values](#keys-and-values) states.
4. **Comments above.** A comment goes on the line above what it describes, never at the end of a line.
5. **Relationships order.** Within Relationships, `[skills.ki-trades]` is always the last table in the file.
6. **Subtables for data maps only.** Use a subtable only for a genuine data map, whose keys are data: `[skills.ki-work-roadmap.areas]` maps area codes to titles, and `[skills.ki-binding.clients]` maps client names to their bindings. Never use a subtable to group a fixed set of fields; those keys belong in the skill's own table. A list of names that each need a reason is an array, with each reason as a comment on the line above its entry. `[skills.ki-trades.territory]` is exempt while its trade-policy model is under separate review.

`ki-repo` checks rules 2, the array part of 3, 5 and 6 mechanically, and defines the compact/substantial banner threshold and the banner ordering in the shared configuration contract. Each banner is a concise three-line comment:

```toml
# Knowledge Islands repository configuration.
# Its presence declares conformance with the Knowledge Islands repository standard.

# -----------------------------------------------------------------------------
# Foundation
# -----------------------------------------------------------------------------

[repo]
harnesses = [
  "knowledgeislands/ki-agentic-harness",
]
```

After an explicit `[skills.<name>]` root, a short subordinate map entry **SHOULD** use a dotted key when its complete value remains readable on one line. This keeps declaration and configuration in one owner block:

```toml
[skills.ki-tokenomics]
budgets.mcp_servers = 20
```

Use a standard nested table instead when a map has more than a few entries, a record is multiline, needs its own comments, or carries further nested configuration. Dotted keys and nested tables are presentation-equivalent only when they produce the same parsed table; removing a duplicated or derivable key is a separate semantic change governed by the owning skill.
