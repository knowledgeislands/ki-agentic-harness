# ADR-KI-HARNESS-TOOLCHAIN-003: Proxy local MCP servers behind mcporter

**Status:** Accepted

**Mutability:** open

**Date:** 2026-06-24

## Context

Claude Code keeps only a small number of MCP servers simultaneously active (around five) before the tool-list cost becomes significant. Knowledge Islands owns 19 local stdio MCP servers, alongside third-party servers a session may use. Each server is a distinct, intentionally-separate capability — the `ki-tokenomics` MCP-2/MCP-3 checks confirm the KB-FS-adjacent servers are not redundant duplicates — so the answer is not to cut the server set but to stop each one consuming a Claude Code slot of its own. mcporter is adopted as the MCP proxy daemon ([ADR-KI-HARNESS-TOOLCHAIN-002](ADR-KI-HARNESS-TOOLCHAIN-002.md)); this record states the governing principle.

## Decision

KI-owned local stdio MCP servers are proxied behind mcporter and consume a single Claude Code slot:

1. **No KI server is declared as a raw stdio entry in `~/.claude.json`.** All 19 sit behind the single `ki-mcporter` URL entry. A server is present to Claude Code only through the proxy.
2. **Adding a KI server** means adding an entry to mcporter's `~/.mcporter/mcporter.json` (chezmoi-managed), not to `~/.claude.json`.
3. **Third-party (non-KI) servers** are still declared directly in `~/.claude.json` in the conventional way.
4. Any skill or prompt referencing a proxied tool uses the namespaced form `server__tool` (double underscore), not the bare tool name.

## Consequences

- The 19 KI servers occupy one Claude Code slot, leaving headroom for third-party servers within the active-server budget.
- The server set lives in one chezmoi-managed source (`~/.mcporter/mcporter.json`), which also feeds the Claude Desktop config; `~/.claude.json` carries only the single proxy entry plus any third-party servers.
- mcporter's typed clients for the harness scripts and `mcp-*` repos are generated via `ki:codegen` (`scripts/generate-clients.ts`).
- The `ki-tokenomics` MCP-2/MCP-3 checks pass: the KB-FS-adjacent servers are distinct capabilities, not redundant.

## References

- [ADR-KI-HARNESS-TOOLCHAIN-002](ADR-KI-HARNESS-TOOLCHAIN-002.md) — adopts mcporter as the MCP proxy daemon and typed-client generator.
- [mcporter](https://github.com/steipete/mcporter) — MCP proxy daemon and typed-client toolkit.

## Changelog

- 2026-07-02 — realigned to present state: removed the "TOOLCHAIN-002 adopted… then" framing and the audit-WARN narrative; removed the "open ROADMAP item (not yet started)" line (typed-client generation is in place via `ki:codegen`).
