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
| arcadia-agentic-harness `README.md` - "The Knowledge Islands structure" | †                                                              | 2026-06-13    |
| [Knowledge Islands KB Reference][kb-reference]                          | This skill's own long-form detail on the modes and conventions | 2026-06-13    |

† The authoritative structure: five zones (Calendar / Pillars / Resources / Streams / Admin) flanked by the inbound `+` and outbound `-`
staging areas.

## Living (how the model is actually used)

These have no URL; they are sampled at REFRESH time through each base's own `kb-fs` MCP and `CLAUDE.md`. The two named bases are the current
exemplars and read in tandem: `arcadia-principal` is conforming _up_ to the zone model (adding `Admin/` and `-/`), while `kit-legal` already
has the fuller set but holds a zone under a local folder name resolved by an alias - between them they exercise both directions of drift the
model must absorb.

| Source                                | Governs                                                                                             | Last reviewed |
| ------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------- |
| `arcadia-principal` base[^ap]         | Whether the zone model, routing test, and bindings still match a real layout and practice           | 2026-06-13    |
| `kit-legal` base[^kl]                 | The same, from a base further along the structure but holding a zone under an aliased folder        | 2026-06-13    |
| Other bases actively using this skill | The same, as further bases adopt the skill                                                          | 2026-06-13    |
| Per-base `.ki-config` declarations    | Which base-specific declarations recur across bases and should be promoted into this standard skill | 2026-06-13    |

[^ap]:
    The first real Knowledge Islands base this skill tracks. Sampled through its own `kb-fs` MCP server (`arcadia-principal-mcp-kb-fs`) and
    its `CLAUDE.md` / memory index. It is conforming toward the canonical structure (it has added minimal `Admin/` and `-/`) while its
    governance still lives under `Pillars/Knowledge Capital/` pending migration — so when sampling it, distinguish the canonical model from
    this in-progress local state.

[^kl]:
    A second real base (`github.com/krisb/kit-legal`), sampled via its `kb-fs` MCP (`kit-legal-mcp-kb-fs`). It carries the fuller structure
    — `+`, `-`, `Admin/` (with `Admin/MEMORY.md`), `Calendar/`, `Resources/`, `Streams/` — but holds its Pillars zone under a local folder
    name. That is declared as a `[knowledgeislands-kb.zones]` alias rather than treated as a different zone — the live case behind the
    skill's zone-alias binding.

[kb-reference]: <Knowledge Islands KB Reference.md>
