# Sources - where the structure model comes from

The canonical and living sources behind this skill's zone model, routing test, and project-bindings table. Mode REFRESH reads this file, re-anchors the model
against each source, then **bumps the `last reviewed` dates and records what changed** in the changelog below. This is the skill's memory of where its structure
comes from - keep it current.

Unlike `knowledgeislands-mcp` and `knowledgeislands-skills`, this skill follows **no moving external spec**: its structure is canonical and in-house. So REFRESH
re-anchors against the canonical definition and against how the bases actually use it, not against a published standard.

## Canonical (the structure definition)

| Source                                                                | Governs                                                                         | Last reviewed |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------- |
| arcadia-skills `README.md` - "The Knowledge Islands structure"        | The authoritative zone model (`+` Calendar Pillars Resources Streams `-` Admin) | 2026-05-31    |
| [Knowledge Islands KB Reference](<Knowledge Islands KB Reference.md>) | This skill's own long-form detail on the modes and conventions                  | 2026-05-31    |

## Living (how the model is actually used)

These have no URL; they are sampled at REFRESH time through the connected base's own MCP tools and `CLAUDE.md`.

| Source                              | Governs                                                                                      | Last reviewed |
| ----------------------------------- | -------------------------------------------------------------------------------------------- | ------------- |
| Bases actively using this skill     | Whether the zone model, routing test, and bindings still match real layouts and practice     | 2026-05-31    |
| Base-coupled `<base>-kb` extensions | Which base-specific conventions belong in an extension vs. promoted into this standard skill | 2026-05-31    |

## Review changelog

Record each REFRESH run: date, what was re-anchored, what changed in the structure model (or "no change").

- **2026-05-31** - Source list created alongside the new Mode REFRESH. Established that this skill tracks a canonical in-house structure, not a moving external
  spec; refresh re-anchors against the README definition and the live bases.
