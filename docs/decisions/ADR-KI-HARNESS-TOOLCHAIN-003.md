# ADR-KI-HARNESS-TOOLCHAIN-003: Proxy all local MCP servers behind mcporter rather than capping count

**Status:** Accepted

**Date:** 2026-06-24

## Context

Claude Code imposes a practical ceiling on the number of simultaneously active MCP servers (around five) before context cost and tool-list
noise become significant. The KI stack runs 19 KI-owned stdio servers plus additional third-party servers. Without a proxy layer, staying
within the ceiling means either accepting a reduced server surface or manually toggling servers between sessions.

The `knowledgeislands-tokenomics` audit surfaced two related WARNs (MCP-2, MCP-3) flagging that multiple KB-FS servers appeared to serve
overlapping purposes with no documented rationale. Investigation confirmed those servers have distinct root folders and are not redundant —
the WARN was a false positive arising from similar names rather than shared scope.

TOOLCHAIN-002 adopted mcporter as a proxy daemon. This ADR captures the governing principle that follows from that adoption.

## Decision

All KI-owned local stdio MCP servers are proxied behind mcporter. No KI server is declared as a raw stdio entry in `~/.claude.json`. The
count ceiling is handled at the infrastructure layer, not by limiting which servers are available.

The proxy model has two concrete benefits:

1. **No practical server cap.** All 19 servers appear to Claude as a single `ki-mcporter` URL entry. Adding a new server requires only a
   `mcporter.json` entry — it does not consume an additional MCP slot from Claude's perspective.

2. **Script access to the full suite.** mcporter's typed client generation and record/replay target the same daemon, so harness scripts and
   `mcp-*` repo integration tests can call the full server surface without managing separate stdio processes.

Third-party servers (those not owned by KI) are declared directly in `~/.claude.json` in the conventional way; this ADR covers KI-owned
servers only.

## Consequences

- The MCP-2 and MCP-3 audit WARNs in `knowledgeislands-tokenomics` are closed: the count issue is resolved by the proxy and the KB-FS
  overlap concern was a false positive (distinct root folders).
- Adding a new KI MCP server means updating `~/.mcporter/mcporter.json` (managed by chezmoi), not `~/.claude.json`.
- The mcporter typed client integration for harness scripts and `mcp-*` repos remains an open ROADMAP item (secondary role, not yet
  started).
- Any saved prompt or skill that references a bare tool name (`tool`) must use the namespaced form (`server__tool`) when the server is
  proxied through mcporter.

## References

- [ADR-KI-HARNESS-TOOLCHAIN-002](ADR-KI-HARNESS-TOOLCHAIN-002.md) — mcporter adoption and daemon configuration.
- [mcporter](https://github.com/steipete/mcporter) — proxy daemon and typed client toolkit.
