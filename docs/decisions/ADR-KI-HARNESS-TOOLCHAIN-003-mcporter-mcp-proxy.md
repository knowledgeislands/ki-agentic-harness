# ADR-KI-HARNESS-TOOLCHAIN-003: Proxy local MCP servers behind mcporter

**Date:** 2026-06-24

## Context

Claude Code keeps only a small number of MCP servers simultaneously active (around five) before the tool-list cost becomes significant. Knowledge Islands owns 19 local stdio MCP servers, alongside third-party servers a session may use. Each server is a distinct, intentionally-separate capability — the `ki-tokenomics` checks confirm the KB-FS-adjacent servers are not redundant duplicates — so the answer is not to cut the server set but to stop each one consuming a Claude Code slot of its own. mcporter is adopted as the MCP proxy daemon ([ADR-KI-HARNESS-TOOLCHAIN-002](ADR-KI-HARNESS-TOOLCHAIN-002-complementary-tooling.md)); this record states the governing principle.

## Decision

KI-owned local stdio MCP servers are proxied behind mcporter and consume a single Claude Code slot:

1. **No KI server is declared as a raw stdio entry in `~/.claude.json`.** All 19 sit behind the single `ki-mcporter` URL entry. A server is present to Claude Code only through the proxy.
2. **Adding a KI server** means adding an entry to the canonical, tool-neutral source `$XDG_CONFIG_HOME/ki/mcp-servers.yaml` (defaulting to `~/.config/ki/mcp-servers.yaml` per the [XDG Base Directory spec](https://specifications.freedesktop.org/basedir/latest/); see `ki-binding`), not to `~/.claude.json`. mcporter's own `~/.mcporter/mcporter.json` is a rendered surface fed from that source, not the place a server is added.
3. **Third-party (non-KI) servers** are still declared directly in `~/.claude.json` in the conventional way.
4. Any skill or prompt referencing a proxied tool uses the namespaced form `server__tool` (double underscore), not the bare tool name.

## Consequences

- The 19 KI servers occupy one Claude Code slot, leaving headroom for third-party servers within the active-server budget.
- The server set lives in one renderer-neutral, XDG-located source (`$XDG_CONFIG_HOME/ki/mcp-servers.yaml`), which feeds mcporter's config and the Claude Desktop config alike; `~/.claude.json` carries only the single proxy entry plus any third-party servers. (This superseded an earlier state where mcporter's own `mcporter.json` was the source — see `ki-binding`'s 2026-07-13 renderer-neutral reframing.)
- mcporter's typed clients for the `mcp-*` repos are generated per-repo via each repo's `ki:generate:client` script (ki-mcp conform).
- The `ki-tokenomics` checks confirm the KB-FS-adjacent servers are distinct capabilities, not redundant.

## References

- [ADR-KI-HARNESS-TOOLCHAIN-002](ADR-KI-HARNESS-TOOLCHAIN-002-complementary-tooling.md) — adopts mcporter as the MCP proxy daemon and typed-client generator.
- [mcporter](https://github.com/steipete/mcporter) — MCP proxy daemon and typed-client toolkit.
- [XDG Base Directory Specification](https://specifications.freedesktop.org/basedir/latest/) — governs the canonical source's location (`$XDG_CONFIG_HOME/ki/mcp-servers.yaml`) and the `ki-binding-chezmoi` legacy fallback path (`$XDG_DATA_HOME/chezmoi/.chezmoidata/mcps.yaml`).
