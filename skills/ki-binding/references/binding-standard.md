# Cross-surface binding standard

The quotable invariant for `ki-binding`: what the single source is, how a server declares which surfaces it targets, and what each surface's config must contain to agree with the source. The **operating rationale** — per-surface controllability, the home decision, the build sequence — is the design record [cross-surface-enablement.md](../../ki-mcp/references/cross-surface-enablement.md); this file is the mechanical contract the checker enforces against.

## The single source

`~/.local/share/chezmoi/.chezmoidata/mcps.yaml` (chezmoi source path; overridable via `--source`). One `mcpServers:` list; each entry is one MCP server:

```yaml
mcpServers:
  - name: kit-mcp-gmail # unique key; the server's key in every rendered mcpServers map
    clients: [desktop, mcporter] # the surfaces this server targets — the binding field
    command: node
    args: [/abs/path/to/dist/mcp-server/index.js]
    env:
      MCP_GMAIL_ACCESS_LEVEL: read
      SECRET: { op: op://vault/item/field } # 1Password ref, resolved at chezmoi apply
```

Two shapes: a **command server** (`command` + `args` + `env`, as above) or a **url server** (`url:` only — an already-running endpoint such as the mcporter proxy). The `clients` field is the one this skill governs; the rest is the server's own definition (owned by `ki-mcp`).

## Recognised surfaces

| Surface | `clients` token | Rendered config (the write target) | Controllability |
| --- | --- | --- | --- |
| Claude Code | `code` | `~/.claude.json` `mcpServers` (in practice: the one `ki-mcporter` url proxy) | file-editable · chezmoi-rendered |
| Desktop | `desktop` | `~/Library/Application Support/Claude/claude_desktop_config.json` | file-editable · chezmoi-rendered |
| mcporter | `mcporter` | `~/.mcporter/mcporter.json` `mcpServers` (proxied daemon) | file-editable · chezmoi-rendered |
| Cowork | `cowork` † | `local-agent-mode-sessions/<account>/<workspace>/cowork_settings.json` (`enabledPlugins`) | gated — external-edit-honoured unverified ‡ |
| claude.ai | _(none)_ | no local file — Admin Console allowlist | manual-only · documented convention |

† `cowork` is **not yet a recognised token** in `mcps.yaml` — it is added when the Cowork gate (‡) passes. Until then the checker treats a `cowork` token as declared-but-unwired (WARN), never silently rendered. ‡ Whether an external edit to `cowork_settings.json` is honoured on next Cowork launch is the first build-time check (design record §); it must pass before the Cowork surface renders a plugin.

## The read model — how the skill computes "on for this surface"

1. **Parse the source** (`Bun.YAML.parse`). Validate: `mcpServers` is a list; every entry has a `name`; every entry has a non-empty `clients` naming only recognised tokens.
2. **For each surface `S`**, the expected server set is `{ e.name for e in mcpServers if S in e.clients }`.
3. **Compare** that expected set against the surface's rendered config `mcpServers` keys (or `enabledPlugins` for Cowork). Missing (in source, not in surface) and stray (in surface, not in source) are both drift.
4. **The skill half** — project-local skills for the surface — is not in `mcps.yaml`; it is `.ki-config.toml` coverage, checked by composing `ki-bootstrap --check`. Servers and skills are audited by their own sources; this skill only asserts the two agree with their declarations.

## Invariants

- **One source.** No surface config is authored by hand; each is rendered from `mcps.yaml` via chezmoi (the file-editable surfaces) or written by this skill from the same source (Cowork, once wired). A hand-edit that diverges from the source is drift, reported by BIND-1.
- **`clients` is the only binding lever.** Turning a server on for a surface is a one-line `clients` edit, never a per-surface script.
- **Cowork is gated, not skipped.** A `cowork` token with no verified path is surfaced (WARN), never dropped.

## Known limits

- **Per-machine, not per-project, for servers.** Code reaches every server through the single `ki-mcporter` proxy, so server enablement is per-machine. The `[project]` argument scopes the **skill** half (via `ki-bootstrap`) and the Cowork plugin set — not the server set. Per-project server scoping would need mcporter-side routing and is out of scope until the design record adopts it.
