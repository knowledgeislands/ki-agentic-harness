# Sources - where the structure model comes from

**Refresh:** canonical · on-change

The canonical and living sources behind this skill's zone model, routing test, and project-bindings table. Mode REFRESH reads this file, re-anchors the model against each source, then **bumps the `last reviewed` dates** (what changed is recorded in the commit, not a changelog — history lives in git). This is the skill's memory of where its structure comes from - keep it current.

Unlike `ki-mcp` and `ki-skills`, this skill follows **no moving external spec**: its structure is canonical and in-house. So REFRESH re-anchors against the canonical definition and against how the bases actually use it, not against a published standard.

## Canonical (the structure definition)

| Source | Governs | Last reviewed |
| --- | --- | --- |
| arcadia-agentic-harness `docs/knowledge-islands.md` - "The Knowledge Islands structure" | † | 2026-06-21 |
| [Knowledge Islands KB Reference][kb-reference] | This skill's own long-form detail on the modes and conventions | 2026-06-21 |

† The authoritative structure: five zones (Calendar / Pillars / Resources / Streams / Admin) flanked by the inbound `+` and outbound `-` staging areas.

## Living (how the model is actually used)

These have no URL; they are sampled at REFRESH time through each base's own `kb-fs` MCP and `CLAUDE.md`. The two named bases are the current exemplars and read in tandem. Both have now reached the resolved end-state on the canonical zone names: `arcadia-principal` has completed conforming _up_ (its `Admin/` and `-/` are in place, each canonical zone carries its same-name index, and its `.ki-config.toml` `[ki-kb]` table is empty — no aliases), and `kit-legal` carries the same fuller set, its earlier Pillars-zone rename having completed and its alias dropped. So neither tracked base currently holds a live `[ki-kb.zones]` alias; the model keeps the alias as a canonical, reviewable override (and documents its lifecycle, transitional → dropped) regardless of having no live exemplar.

| Source | Governs | Last reviewed |
| --- | --- | --- |
| `arcadia-principal` base[^ap] | Whether the zone model, routing test, and bindings still match a real layout and practice | 2026-06-21 |
| `kit-legal` base[^kl] | The same, from a base further along the structure, now on the canonical zone names (alias dropped) | 2026-06-21 |
| Other bases actively using this skill | The same, as further bases adopt the skill | 2026-06-21 |
| Per-base `.ki-config` declarations | Which base-specific declarations recur across bases※ | 2026-06-21 |

※ Which base-specific declarations recur across bases and should be promoted into this standard skill.

[^ap]: The first real Knowledge Islands base this skill tracks. Sampled through its own `kb-fs` MCP server (`arcadia-principal-mcp-kb-fs`) and its `CLAUDE.md` / memory index. It now carries the full canonical structure — `+`, `-`, `Admin/` (with `Admin/Admin.md` and `Admin/MEMORY.md`), `Calendar/`, `Pillars/`, `Resources/`, `Streams/`, each canonical zone with its same-name index — on the canonical zone names, its `[ki-kb]` table empty (no aliases). Its governance Pillar, `Pillars/Knowledge Capital/`, now sits within the canonical `Pillars/` zone, so the earlier mid-migration caveat no longer applies (confirmed 2026-06-21).

[^kl]: A second real base (`github.com/krisb/kit-legal`), sampled via its `kb-fs` MCP (`kit-legal-mcp-kb-fs`). It carries the fuller structure — `+`, `-`, `Admin/` (with `Admin/MEMORY.md`), `Calendar/`, `Pillars/` (with `Pillars/Pillars.md`), `Resources/`, `Streams/` — all on the canonical zone names. It earlier held its Pillars zone under a local folder name, declared as a `[ki-kb.zones]` alias; that rename has since completed and the alias has been dropped (its `.ki-config.toml` now carries no `[ki-kb.zones]` table, re-confirmed via its live MCP layout 2026-06-21 — `Pillars/Pillars.md` sits at the canonical folder). So it now documents the alias lifecycle's resolved end-state — transitional alias → dropped after the rename — rather than a live alias, and the zone-alias binding currently has no live exemplar among the tracked bases.

[kb-reference]: <Knowledge Islands KB Reference.md>
