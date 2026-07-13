# Sources — ki-binding-chezmoi

**Refresh:** canonical · on-change

Provenance only: the record of _what changed_ lives in git (the REFRESH commit), not a changelog here. This skill tracks no external spec on a clock — it is re-anchored when the chezmoi render contract changes (the `mcp-servers-json` template shape, the `.chezmoidata` wiring, or the `chezmoi apply` behaviour), or when either composed sibling's contract moves.

## In-house

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| [BIND] | `ki-binding` skill | The renderer-neutral surface audit this skill composes (surfaces agree with the single source) | 2026-07-13 |
| [CHEZ] | `ki-dotfiles-chezmoi` skill | The generic chezmoi source-repo standard this skill composes (repo is conventional) | 2026-07-13 |
| [SRC] | `~/.config/ki/mcp-servers.yaml` (canonical) + `.chezmoidata/*mcp*` (rendered-from copy) | The single source and the chezmoi data the render path reads | 2026-07-13 |
| [ADR] | `ADR-KI-HARNESS-SKILLS-004` (composition-for-backends corollary) | Why the render path is its own composition skill, not a fork or a `--backend` flag | 2026-07-13 |

## Open gates & watch-items

- **Render-template shape** — the `mcp-servers-json` partial and the target `.tmpl` files it feeds. Re-anchor when chezmoi's templating contract or the per-surface `mcpServers` config shape changes.
- **Source location** — the canonical XDG home vs the legacy `.chezmoidata/mcps.yaml` fallback. Re-anchor if the resolution order in `ki-binding` moves.
- **Composed siblings** — if `ki-binding`'s recognised surfaces/`clients` tokens or `ki-dotfiles-chezmoi`'s repo-shape criteria change, confirm the BINDCHEZ delta still sits cleanly on top rather than duplicating a sibling criterion.

## Last review

Initial authoring, **2026-07-13** — drafted alongside the renderer-neutral split of `ki-binding` and the `ki-dotfiles-chezmoi` standard. No prior refresh has run; this is the baseline. The composed siblings were confirmed present in the harness `skills/` tree at authoring time.
