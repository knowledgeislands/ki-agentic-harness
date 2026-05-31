# Sources - where the structure model comes from

The canonical and living sources behind this skill's zone model, routing test, and project-bindings table. Mode REFRESH reads this file, re-anchors the model
against each source, then **bumps the `last reviewed` dates and records what changed** in the changelog below. This is the skill's memory of where its structure
comes from - keep it current.

Unlike `knowledgeislands-mcp` and `knowledgeislands-skills`, this skill follows **no moving external spec**: its structure is canonical and in-house. So REFRESH
re-anchors against the canonical definition and against how the bases actually use it, not against a published standard.

## Canonical (the structure definition)

| Source                                                         | Governs                                                        | Last reviewed |
| -------------------------------------------------------------- | -------------------------------------------------------------- | ------------- |
| arcadia-skills `README.md` - "The Knowledge Islands structure" | †                                                              | 2026-05-31    |
| [Knowledge Islands KB Reference][kb-reference]                 | This skill's own long-form detail on the modes and conventions | 2026-05-31    |

† The authoritative structure: five zones (Calendar / Pillars / Resources / Streams / Admin) flanked by the inbound `+` and outbound `-` staging areas.

## Living (how the model is actually used)

These have no URL; they are sampled at REFRESH time through each base's own `kb-fs` MCP and `CLAUDE.md`. The two named bases are the current exemplars and read
in tandem: `arcadia-principal` is conforming _up_ to the zone model (adding `Admin/` and `-/`), while `kit-legal` already has the fuller set but is renaming
_within_ it (`Matters/` → `Pillars/`) - between them they exercise both directions of drift the model must absorb.

| Source                                | Governs                                                                                      | Last reviewed |
| ------------------------------------- | -------------------------------------------------------------------------------------------- | ------------- |
| `arcadia-principal` base[^ap]         | Whether the zone model, routing test, and bindings still match a real layout and practice    | 2026-05-31    |
| `kit-legal` base[^kl]                 | The same, from a base further along the structure but using the legacy `Matters/` zone name  | 2026-05-31    |
| Other bases actively using this skill | The same, as further bases adopt the skill                                                   | 2026-05-31    |
| Base-coupled `<base>-kb` extensions   | Which base-specific conventions belong in an extension vs. promoted into this standard skill | 2026-05-31    |

[^ap]:
    The first real Knowledge Islands base this skill tracks. Sampled through its own `kb-fs` MCP server (`arcadia-principal-mcp-kb-fs`) and its `CLAUDE.md` /
    memory index. It is conforming toward the canonical structure (it has added minimal `Admin/` and `-/`) while its governance still lives under
    `Pillars/Knowledge Capital/` pending migration — so when sampling it, distinguish the canonical model from this in-progress local state.

[^kl]:
    A second real base (`github.com/krisb/kit-legal`), sampled via its `kb-fs` MCP (`kit-legal-mcp-kb-fs`). It carries the fuller structure — `+`, `-`, `Admin/`
    (with `Admin/MEMORY.md`), `Calendar/`, `Resources/`, `Streams/` — but holds its Pillars zone under the legacy `Matters/` while it renames toward `Pillars/`.
    That rename is declared as a `[knowledgeislands-kb.zones]` alias (`Pillars = "Matters"`) rather than treated as a different zone — the live case behind the
    skill's zone-alias binding.

## Review changelog

Record each REFRESH run: date, what was re-anchored, what changed in the structure model (or "no change").

- **2026-05-31** - Source list created alongside the new Mode REFRESH. Established that this skill tracks a canonical in-house structure, not a moving external
  spec; refresh re-anchors against the README definition and the live bases.
- **2026-05-31** - Bound to the first two real bases and named both in the living-sources table (each sampled via its `kb-fs` MCP). Re-anchoring against them
  drove four model changes:
  - **`arcadia-principal`** carried no `Admin/` or `-/` (governance under `Pillars/Knowledge Capital/`, digests in `Calendar/`). Resolution: the base is
    conforming toward the model (added minimal `Admin/` + `-/`); no change to the model itself.
  - **Wikilink convention stated.** Both bases link note content with Obsidian `[[wikilinks]]`; the model now states this for the five index-carrying zones
    (`[[Calendar]]` / `[[Pillars]]` / `[[Resources]]` / `[[Streams]]` / `[[Admin]]`), kept explicitly distinct from the skill files' own relative-link
    convention.
  - **`+` and `-` reframed as staging, not zones.** The structure is five zones flanked by an inbound and an outbound staging area; the zone table, reference,
    and canonical footnote were corrected to say so.
  - **Zone-alias binding added.** `kit-legal` holds its Pillars zone under the legacy `Matters/` while renaming toward `Pillars/`. Rather than fork the model,
    added a **Zone names** binding resolved from the base's `.ki-config.toml` `[knowledgeislands-kb.zones]` table (`Pillars = "Matters"`), validated down per
    the `.ki-config.toml` contract. The Knowledge-Capital-to-`Admin/` migration and the `Matters/`→`Pillars/` rename both remain base-local pending work.

[kb-reference]: <Knowledge Islands KB Reference.md>
