# ADR-KI-HARNESS-TOOLCHAIN-002: Complementary tooling — current adoptions

**Date:** 2026-06-29

## Context

As a session grows and the MCP surface expands, token cost per turn rises and the ergonomics of managing many servers, understanding what is loaded, and scripting against them become friction points. Tools from the [extraheadroom.com/reduce-claude-code-costs](https://extraheadroom.com/reduce-claude-code-costs) survey and adjacent sources are assessed against four criteria: (a) complementarity with the KI skills paradigm, (b) maturity, (c) absence of paradigm conflict — chiefly with the composition-only model ([ADR-KI-HARNESS-003](ADR-KI-HARNESS-003-composition-over-extension.md)), the validate-down config contract ([ADR-KI-HARNESS-007](ADR-KI-HARNESS-007-validate-down-ki-config-contract.md)), and the file-based `memory/` + `MEMORY.md` convention — and (d) whether adoption needs a harness artifact or is satisfied by a personal/dev install. This record states the current disposition of each tool.

## Decision

### Adopted

**headroom-ai** — the primary context management layer. It injects a `PreCompact` hook to preserve the system prompt across compaction and bundles RTK (Rust Token Killer) as its shell-output compression sub-component (RTK is not a separately adopted tool — it ships and wires its `PreToolUse` hook automatically when headroom-ai runs). Deployed either in proxy mode (`headroom proxy` on port 8787, with `ANTHROPIC_BASE_URL=http://localhost:8787 claude`) or wrap mode (`headroom wrap claude`). A MarkItDown add-on is available through headroom for flattening binary documents at the ingestion boundary.

**mcporter** — adopted in two roles. As the **MCP proxy daemon**, all 19 KI-owned stdio servers sit behind mcporter's keep-alive daemon, exposed as a single `ki-mcporter` URL entry (`http://localhost:3333/mcp`) in `~/.claude.json`, with tools namespaced `server__tool`; this is the subject of [ADR-KI-HARNESS-TOOLCHAIN-003](ADR-KI-HARNESS-TOOLCHAIN-003-mcporter-mcp-proxy.md). As a **typed client**, mcporter generates the per-repo clients the harness scripts and `mcp-*` repos call, via `ki:codegen` (`scripts/generate-clients.ts`). Installed via Homebrew (`brew install steipete/tap/mcporter`); chezmoi deploys the config and LaunchAgents.

**house-agents** (user-level) — a collection of four sub-agents (`house-research`, `house-bash`, `house-git`, `house-mcp`) that offload token-heavy operations into isolated context windows. Each is a plain `.md` file with YAML frontmatter — the same file-based pattern as KI agent definitions — and validates the sub-agent isolation model in [ADR-KI-HARNESS-AGENTS-001](ADR-KI-HARNESS-AGENTS-001-subagent-isolation.md). They install to `~/.claude/agents/`; they are not KI-governed, so they serve as the reference pattern for KI-authored agents on the harness `agents/` shelf, not as shelf contents.

**house-code** (personal tool) — a daemon cleaner that prunes stale conversation content (old file reads, completed todos, resolved errors) every few turns. Complementary to headroom-ai: headroom compacts what is present, house-code removes what is no longer relevant.

### Available, not governed

**MarkItDown** — converts PDFs and Office documents into token-efficient Markdown at the ingestion boundary. Reachable via the headroom add-on or ad hoc (`uvx markitdown <file>`); its MCP server is Microsoft's, not KI-authored, so it is not a harness `mcp/` artifact. The KI KB is Markdown-native, so its value is confined to the boundary where external binary documents enter — a personal/dev concern.

### Declined

- **superpowers** — a structured SDLC methodology shipped as auto-triggering skills under a monolithic `~/.claude/skills` install; conflicts with the validate-down `.ki-config.toml` contract and the standalone-valid skill requirement ([ADR-KI-HARNESS-SKILLS-004](ADR-KI-HARNESS-SKILLS-004-skills-valid-standalone.md)). How a methodology is applied is the KI harness's own domain.
- **gstack** — a competing monolithic slash-command skill collection outside the KI governance layer; adopting it would create two parallel skill systems with no shared standard. Individual ideas (e.g. OWASP/STRIDE threat modelling) are candidates for KI skills in their own right.
- **Engram** — a cross-session persistent-memory MCP over SQLite/vector stores. It targets the slot the harness fills with its file-based `memory/` + `MEMORY.md` convention, which is deliberately plain-file, git-trackable, and reconciled into `CLAUDE.md` where it is visible in review; an opaque store would be a second, invisible memory system. The file-based convention is the single persistent-memory mechanism.
- **[Caveman](https://caveman.so/)** — a token-efficiency toolkit spanning a proxy/gateway (input/prompt compression, not just output), a persistent memory layer ("Cavemem"), a terminal coding agent ("Caveman Code"), and a chat-interface browser extension. It duplicates ground the harness already owns through separate, deliberate mechanisms — headroom-ai at the proxy layer, the file-based `memory/` convention in place of Cavemem — as one monolithic third-party stack outside the KI governance layer.

### Scale-gated

**Graphify** — builds a self-updating knowledge graph of a _codebase_ (tree-sitter plus LLM extraction) to navigate by structure. Its benefit appears only on large repositories (500+ files); the harness and its siblings are small Markdown/skill/MCP repos, and the KI KB is itself a curated human-authored knowledge graph. Not adopted at current scale. Dropped from the ROADMAP on 2026-07-05 as not needed; revisit from this ADR should a large code corpus ever emerge.

### Prior art — house-mcp-manager

house-mcp-manager is a CLI that toggles MCP servers and saves named profiles by editing Claude Code's `~/.claude.json`. It is Claude-Code-only; the Code surface's MCP cost is now handled by the mcporter proxy (TOOLCHAIN-003). It is noted as prior art for MCP-surface enablement. The live, unmet need — managing enablement across claude.ai web connectors and Cowork per-workspace — is a ROADMAP item, not an adoption here.

## Consequences

- headroom-ai is the primary context layer (with bundled RTK compression); mcporter is the MCP proxy daemon and the typed-client generator (`ki:codegen`).
- The KI skills paradigm remains the single skill-governance layer; no competing monolithic-skill install conventions (superpowers, gstack, Caveman) are introduced.
- The file-based `memory/` + `MEMORY.md` convention is the single persistent-memory mechanism (Engram declined); the `mcp/` shelf stays KI-authored-only (MarkItDown's server excluded).
- The `agents/` shelf has a validated reference pattern (house-agents); house-code adds active pruning as a personal tool.
- Cross-surface MCP/skill enablement (claude.ai, Cowork) is carried as a ROADMAP item.

## References

- [ADR-KI-HARNESS-003](ADR-KI-HARNESS-003-composition-over-extension.md) — Composition over extension (the paradigm the declines protect).
- [ADR-KI-HARNESS-007](ADR-KI-HARNESS-007-validate-down-ki-config-contract.md) — Validate-down `.ki-config.toml` contract.
- [ADR-KI-HARNESS-SKILLS-004](ADR-KI-HARNESS-SKILLS-004-skills-valid-standalone.md) — Skills must be valid standalone.
- [ADR-KI-HARNESS-AGENTS-001](ADR-KI-HARNESS-AGENTS-001-subagent-isolation.md) — Subagent isolation for multi-skill invocation.
- [ADR-KI-HARNESS-TOOLCHAIN-003](ADR-KI-HARNESS-TOOLCHAIN-003-mcporter-mcp-proxy.md) — Proxy local MCP servers behind mcporter.
- [extraheadroom.com/reduce-claude-code-costs](https://extraheadroom.com/reduce-claude-code-costs) — the source survey.
- [headroom-ai](https://headroom.ai/) — context compaction and session management layer (bundles RTK).
- [mcporter](https://github.com/steipete/mcporter) — MCP ergonomic API/CLI toolkit and proxy daemon.
- [house-agents](https://github.com/houseworthe/house-agents) — sub-agent context isolation collection (adopted, user-level).
- [house-code](https://github.com/houseworthe/house-code) — daemon cleaner for active context pruning (adopted, personal tool).
- [house-mcp-manager](https://github.com/houseworthe/house-mcp-manager) — MCP server toggle and profile manager (prior art, Claude-Code-only).
- [MarkItDown](https://github.com/microsoft/markitdown) — document → Markdown converter (available, not governed).
- [superpowers](https://github.com/obra/superpowers) — agentic SDLC methodology skill collection (declined).
- [gstack](https://github.com/garrytan/gstack) — structured virtual-team skill collection (declined).
- [Engram](https://www.engram.fyi/) — cross-session persistent-memory server (declined).
- [Caveman](https://caveman.so/) — token-efficiency toolkit for AI coding agents (declined).
- [Graphify](https://github.com/safishamsi/graphify) — codebase knowledge-graph skill (scale-gated).
