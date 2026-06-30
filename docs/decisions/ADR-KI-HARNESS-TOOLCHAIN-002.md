# ADR-KI-HARNESS-TOOLCHAIN-002: Complementary tooling evaluation — context management and developer utilities

**Status:** Accepted

**Date:** 2026-06-23

## Context

As a session grows and the MCP surface expands, token cost per turn rises and the ergonomics of managing many servers, understanding what is loaded, and scripting against them become significant friction points. A set of tools was evaluated against these concerns — context token management, shell output compression, agentic workflow discipline, MCP ergonomics, and structured sub-agent collections.

The evaluation criteria were: (a) complementarity with the KI skills paradigm, (b) maturity, (c) absence of paradigm conflict with the composition-only model (ADR-KI-HARNESS-001), and (d) whether adoption requires a harness artifact or is satisfied by a personal/dev install.

## Decision

### Adopt — headroom-ai

headroom-ai is a context compaction and session management tool. It injects a `PreCompact` hook to write the system prompt before compaction and includes RTK (Rust Token Killer) as a bundled sub-component for shell-output compression. headroom-ai is the primary context management layer for KI harness sessions.

Two deployment modes are available:

- **Proxy mode** (current) — `headroom proxy` starts a local optimisation server on port 8787; launch Claude Code as `ANTHROPIC_BASE_URL=http://localhost:8787 claude`. All requests are intercepted and optimised transparently.
- **Wrap mode** — `headroom wrap claude` wraps the Claude CLI directly without a separate proxy process.

**Adoption action:** install globally via npm; start `headroom proxy` and set `ANTHROPIC_BASE_URL` before launching Claude Code.

### Not separately applicable — RTK (`rtk-ai.app`)

RTK is headroom-ai's bundled shell-output compression sub-component, not an independent tool. When headroom-ai is running (either via proxy mode or wrap mode), RTK is included and its `PreToolUse` hook is wired automatically. Evaluate RTK only through the headroom-ai adoption above.

### Adopt (personal tool, no harness artifact) — house-mcp-manager

house-mcp-manager is a CLI for toggling MCP servers on/off and saving named profiles. It addresses the problem that always-on servers consume a fixed token tax regardless of the task. The tool auto-detects Claude Code's `~/.claude.json` and handles backup safely. It is early-stage (no stable npm release) and does not belong as a harness artifact, but it is a useful personal utility for managing the MCP surface between sessions.

### Adopt — mcporter

mcporter provides ergonomic TypeScript APIs and CLI wrappers for calling MCP servers, with auto-discovery from Claude/Cursor configs, typed client generation, and record/replay. mcporter is adopted in two complementary roles.

**Primary role — MCP proxy daemon.** All 19 KI-owned stdio servers are consolidated behind mcporter's keep-alive daemon and exposed as a single `ki-mcporter` URL entry (`http://localhost:3333/mcp`) in `~/.claude.json`. Tools appear namespaced as `server__tool` (double underscore). Two LaunchAgents, managed via chezmoi, run the pair of mcporter processes: `sh.mcporter.daemon` runs `mcporter daemon start --foreground`; `sh.mcporter.http-bridge` runs `mcporter serve --http 3333`. mcporter's system config lives at `~/.mcporter/mcporter.json`, also managed by chezmoi; it embeds full server definitions with `"lifecycle": "keep-alive"` for all 19 servers (resolved from the shared `mcp-servers-json` chezmoi template). No `"imports"` directive is used — the config is self-contained and is not dependent on the state of `~/.claude.json` at daemon start time.

**Secondary role — typed client and scripting.** mcporter's auto-discovery and typed client generation remain applicable for scripting against the configured MCP surface and for building test fixtures via record/replay. Integration into harness scripts and the `mcp-*` repos is tracked as an open ROADMAP item.

**Adoption action:** install via Homebrew (`brew install steipete/tap/mcporter`). chezmoi deploys the config and the two LaunchAgents; `launchctl load` activates them.

### Adopt (user-level install) — house-agents

house-agents is a stable collection of four sub-agents (`house-research`, `house-bash`, `house-git`, `house-mcp`) that offload token-heavy operations into isolated Haiku context windows, returning only condensed summaries to the main session. Each agent is a plain `.md` file with YAML frontmatter — the same file-based pattern as KI agent definitions. Invocation is explicit, not automatic.

The pattern maps directly to the harness's `agents/` shelf and validates the sub-agent isolation model in ADR-KI-HARNESS-AGENTS-001. The agents install to `~/.claude/agents/` (user-level) rather than `.claude/agents/` in the harness — they are not KI-governed agents, so they do not belong in the harness shelf. KI-authored equivalents following this pattern do belong there and should be modelled on this reference implementation.

**Adoption action:** copy the four `.md` agent files to `~/.claude/agents/`. Reference the pattern when authoring agents for the harness `agents/` shelf.

### Adopt (personal tool, no harness artifact) — house-code

house-code runs a daemon cleaner agent every 3 turns that actively prunes stale content from conversation history — old file reads, completed todos, resolved errors. This is complementary to headroom-ai rather than duplicative: headroom-ai compresses and compacts what is present; house-code removes what is no longer relevant. Python package, `pip install -e .`.

**Adoption action:** install alongside headroom-ai; run via the `house` CLI command.

### Decline — superpowers

superpowers ships a structured SDLC methodology as composable skills (brainstorming, TDD, git worktree isolation, subagent dispatch). The philosophical overlap with the KI skills paradigm is high, but the execution model differs: superpowers skills trigger automatically and share a monolithic install at `~/.claude/skills/gstack`. This conflicts with the validate-down `.ki-config.toml` contract (ADR-KI-HARNESS-CONFIG-001) and the standalone-valid skill requirement (ADR-KI-HARNESS-SKILLS-004). The methodology value is real, but the model for _how_ it is applied is the KI harness's own domain.

### Decline — gstack

gstack is a competing slash-command skill collection (office-hours, plan review, QA browser automation, security review, ship). It provides genuine depth in some areas (real Chromium automation, STRIDE threat modelling) but installs as a monolithic `~/.claude/skills/gstack` tree outside the KI governance layer. Adopting it alongside the KI skill set would create two parallel skill systems with no shared standard. Individual gstack ideas (e.g. OWASP/STRIDE threat modelling as a harness skill) may be worth revisiting as KI skills in their own right.

## Consequences

- headroom-ai adopted as the primary context management layer; shell-output compression is included via the bundled RTK component.
- house-mcp-manager gives an operator-level handle on MCP context cost between sessions; no CI or toolchain changes needed.
- mcporter adopted — daemon mode is the primary delivery: 19 KI stdio servers collapse to a single `ki-mcporter` URL entry via the HTTP bridge on port 3333; tools appear as `server__tool`. Any saved prompts or skills that reference bare tool names will need updating. Typed client generation for harness scripts and `mcp-*` repo integration remains an open ROADMAP item.
- superpowers and gstack declined — the KI skills paradigm remains the single skill governance layer; no competing install conventions are introduced.
- house-agents adopted at user-level; its four sub-agents are immediately usable and provide a reference pattern for the harness `agents/` shelf population.
- house-code adopted as a personal tool; active context pruning complements headroom-ai's compression layer.
- The `agents/` shelf gains a validated reference pattern; `mcp/` remains unblocked for KI-governed server definitions.

## References

- [ADR-KI-HARNESS-001](ADR-KI-HARNESS-001.md) — Composition over extension (paradigm the declines protect).
- [ADR-KI-HARNESS-CONFIG-001](ADR-KI-HARNESS-CONFIG-001.md) — Validate-down `.ki-config.toml` contract.
- [ADR-KI-HARNESS-SKILLS-004](ADR-KI-HARNESS-SKILLS-004.md) — Skills must be valid standalone.
- [ADR-KI-HARNESS-AGENTS-001](ADR-KI-HARNESS-AGENTS-001.md) — Subagent isolation for multi-skill invocation.
- [headroom-ai](https://headroom.ai/) — Context compaction and session management layer.
- [RTK](https://www.rtk-ai.app/) — Rust Token Killer, shell output compression (bundled with headroom-ai).
- [house-mcp-manager](https://github.com/houseworthe/house-mcp-manager) — MCP server toggle and profile manager.
- [mcporter](https://github.com/openclaw/mcporter) — MCP ergonomic API/CLI toolkit.
- [superpowers](https://github.com/obra/superpowers) — Agentic SDLC methodology skill collection (declined).
- [gstack](https://github.com/garrytan/gstack) — Structured virtual-team skill collection (declined).
- [house-agents](https://github.com/houseworthe/house-agents) — Sub-agent context isolation collection (adopted, user-level).
- [house-code](https://github.com/houseworthe/house-code) — Daemon cleaner agent for active context pruning (adopted, personal tool).
