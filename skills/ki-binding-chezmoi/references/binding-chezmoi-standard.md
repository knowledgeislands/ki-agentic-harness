# The chezmoi render path for the KI MCP binding

The normative standard behind [the rubric](audit-rubric.md) and [the checker](../scripts/audit.ts). It governs one thing only: **rendering the canonical MCP single source through chezmoi** so the file-editable surfaces are generated from it, never hand-maintained.

This is a **governance skill**, and a **composition skill** in the sense of `ADR-KI-HARNESS-SKILLS-004` (skills relate by composition, never a base-coupled fork; the composition-for-backends corollary of that decision explains why a render path is its own skill rather than a fork of `ki-binding` or a `--backend` flag on it). It composes two siblings and adds a delta over them; it does not re-implement either.

## What each layer owns

- **`ki-binding`** is renderer-neutral. It reads the single source — a plain `mcpServers:` YAML, canonical home `~/.config/ki/mcp-servers.yaml` (resolution order: `--source` → `$KI_MCP_SOURCE` → canonical → legacy chezmoi path `~/.local/share/chezmoi/.chezmoidata/mcps.yaml` → `./.ki/mcps.yaml`) — and audits that each surface (Claude Code, Claude Desktop, mcporter) agrees with it. It does not render surfaces and requires no renderer installed. Each server carries a `clients:` set (`code` / `desktop` / `mcporter` / `cowork`) naming the surfaces it targets.
- **`ki-dotfiles-chezmoi`** is the house standard for any chezmoi source repo — naming prefixes, templating, `chezmoi apply`, surgical-patch reverse-merge. It covers a chezmoi repo generically, with no knowledge of MCP.
- **`ki-binding-chezmoi`** (this skill) is the render contract that ties them together: the `mcp-servers-json` template, the `.chezmoidata` wiring, and the `chezmoi apply` that turns the single source into the file-editable surfaces. This delta is deliberately owned here because `ki-binding` does **not** own any renderer, and `ki-dotfiles-chezmoi` covers only generic dotfile templating.

## The render contract

1. **Source data in the repo.** The chezmoi source repo carries the MCP source data under `.chezmoidata/` (a `*mcp*` YAML/TOML/JSON file) — the data chezmoi renders from. On a migrated machine this is the legacy `mcps.yaml` fallback path; the canonical XDG file is the tool-neutral home `ki-binding` reads.
2. **The render template.** A `mcp-servers-json` template partial expands the `clients:`-tagged source into per-surface `mcpServers` config.
3. **Wired to a surface target.** At least one target `.tmpl` (the Claude Code / Desktop / mcporter config) references the `mcp-servers-json` partial, so a `chezmoi apply` writes the surface from the source.
4. **Apply parity.** A `chezmoi apply` (previewed with `chezmoi diff`) reproduces exactly the surfaces `ki-binding` audits — no drift between what the render produces and what the surface audit expects.

## Invariants

- **Composition, in sequence.** AUDIT runs `ki-dotfiles-chezmoi` (repo is conventional) then `ki-binding` (surfaces agree with source), then adds the BINDCHEZ delta. Each sibling runs as a subprocess and owns its own criteria; this skill re-checks neither.
- **Edits flow through the source.** The render path never blesses a hand-written surface config — a surface is regenerated from the source by `chezmoi apply`. A surface edited by hand diverges from the source, which is the drift `ki-binding`'s BIND-1 catches.
- **Renderer-scoped.** `ki-binding` stays renderer-neutral; the chezmoi mechanism lives here. A non-chezmoi setup re-renders through whatever tool reads the canonical source and does not install this skill.
