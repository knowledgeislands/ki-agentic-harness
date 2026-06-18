# Sources - where the structure model comes from

The canonical and living sources behind this skill's zone model, routing test, and project-bindings table. Mode REFRESH reads this file,
re-anchors the model against each source, then **bumps the `last reviewed` dates** (what changed is recorded in the commit, not a changelog
— history lives in git). This is the skill's memory of where its structure comes from - keep it current.

Unlike `knowledgeislands-mcp` and `knowledgeislands-skills`, this skill follows **no moving external spec**: its structure is canonical and
in-house. So REFRESH re-anchors against the canonical definition and against how the bases actually use it, not against a published
standard.

## Canonical (the structure definition)

| Source                                                                  | Governs                                                        | Last reviewed |
| ----------------------------------------------------------------------- | -------------------------------------------------------------- | ------------- |
| arcadia-agentic-harness `README.md` - "The Knowledge Islands structure" | †                                                              | 2026-06-18    |
| [Knowledge Islands KB Reference][kb-reference]                          | This skill's own long-form detail on the modes and conventions | 2026-06-18    |

† The authoritative structure: five zones (Calendar / Pillars / Resources / Streams / Admin) flanked by the inbound `+` and outbound `-`
staging areas.

## Living (how the model is actually used)

These have no URL; they are sampled at REFRESH time through each base's own `kb-fs` MCP and `CLAUDE.md`. The two named bases are the current
exemplars and read in tandem, and between them they exercise both ends of the zone-alias lifecycle: `arcadia-principal` is conforming _up_
to the zone model (adding `Admin/` and `-/`), while `kit-legal` has now reached the fuller set on the canonical zone names — its earlier
Pillars-zone rename has completed and its alias has been dropped. So `arcadia-principal` shows a migration mid-flight and `kit-legal` shows
its resolved end-state; no tracked base currently holds a live `[knowledgeislands-kb.zones]` alias, which the model keeps as a canonical,
reviewable override regardless.

| Source                                | Governs                                                                                             | Last reviewed |
| ------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------- |
| `arcadia-principal` base[^ap]         | Whether the zone model, routing test, and bindings still match a real layout and practice           | 2026-06-18    |
| `kit-legal` base[^kl]                 | The same, from a base further along the structure, now on the canonical zone names (alias dropped)  | 2026-06-18    |
| Other bases actively using this skill | The same, as further bases adopt the skill                                                          | 2026-06-18    |
| Per-base `.ki-config` declarations    | Which base-specific declarations recur across bases and should be promoted into this standard skill | 2026-06-18    |

[^ap]:
    The first real Knowledge Islands base this skill tracks. Sampled through its own `kb-fs` MCP server (`arcadia-principal-mcp-kb-fs`) and
    its `CLAUDE.md` / memory index. It is conforming toward the canonical structure (it has added minimal `Admin/` and `-/`) while its
    governance still lives under `Pillars/Knowledge Capital/` pending migration — so when sampling it, distinguish the canonical model from
    this in-progress local state.

[^kl]:
    A second real base (`github.com/krisb/kit-legal`), sampled via its `kb-fs` MCP (`kit-legal-mcp-kb-fs`). It carries the fuller structure
    — `+`, `-`, `Admin/` (with `Admin/MEMORY.md`), `Calendar/`, `Pillars/` (with `Pillars/Pillars.md`), `Resources/`, `Streams/` — all on
    the canonical zone names. It earlier held its Pillars zone under a local folder name, declared as a `[knowledgeislands-kb.zones]` alias;
    that rename has since completed and the alias has been dropped (its `.ki-config.toml` now carries no `[knowledgeislands-kb.zones]`
    table, confirmed 2026-06-18). So it now documents the alias lifecycle's resolved end-state — transitional alias → dropped after the
    rename — rather than a live alias, and the zone-alias binding currently has no live exemplar among the tracked bases.

[kb-reference]: <Knowledge Islands KB Reference.md>
