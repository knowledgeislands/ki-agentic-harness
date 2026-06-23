# ADR-KI-HARNESS-TOOLCHAIN-002: Complementary tooling evaluation — context management and developer utilities

**Status:** Accepted

**Date:** 2026-06-23

## Context

The harness already adopts headroom-ai for context compaction. As the session and MCP surface grow, a second wave of tooling was surfaced
for evaluation: five tools addressing adjacent concerns — context token management, shell output compression, agentic workflow discipline,
MCP ergonomics, and structured skill collections.

A second set of tools from the same author as house-mcp-manager (`houseworthe/house-code`, `houseworthe/house-agents`) was added to the
evaluation after the initial pass.

The evaluation criteria were: (a) complementarity with headroom-ai and the KI skills paradigm, (b) maturity, (c) absence of paradigm
conflict with the composition-only model (ADR-KI-HARNESS-BASE-001), and (d) whether adoption requires a harness artifact or is satisfied by
a personal/dev install.

## Decision

### Not separately applicable — RTK (`rtk-ai.app`)

RTK is headroom-ai's bundled shell-output compression sub-component, not an independent tool. When headroom is installed and
`headroom wrap claude` is run, RTK is included and its `PreToolUse` hook is wired automatically. Evaluating RTK as a separate adoption was a
misread of the toolchain; the harness already captures its value through the headroom adoption.

### Adopt (personal tool, no harness artifact) — house-mcp-manager

house-mcp-manager is a CLI for toggling MCP servers on/off and saving named profiles, addressing the problem that always-on servers consume
a fixed token tax regardless of the task. The tool auto-detects Claude Code's `~/.claude.json` and handles backup safely. It is early-stage
(no npm release yet, 93.5% test pass rate) and does not belong as a harness artifact, but it is a useful personal utility for managing the
MCP surface between sessions. Revisit for a harness integration when a stable npm release ships.

### Adopt — mcporter

mcporter provides ergonomic TypeScript APIs and CLI wrappers for calling MCP servers, with auto-discovery from Claude/Cursor configs, typed
client generation, and record/replay. The original deferral assumed the MCP surface was empty; 19 servers are now configured in
`~/.claude.json` (`mcp-kb-fs`, `mcp-kb-notion-mirror`, `mcp-git-audit`, `mcp-gmail`, `mcp-m365`, `mcp-claude-housekeeping`,
`mcp-voicenotes-edit`, and several project-scoped variants). mcporter's auto-discovery and typed client generation are immediately
applicable for scripting against this surface — particularly for cross-server workflows and for building test fixtures via record/replay.

**Adoption action:** `npx mcporter list` to verify server discovery, then add as a dev dependency in any harness script or agent that needs
to call MCP tools programmatically.

### Adopt (user-level install) — house-agents

house-agents is a v1.0.0 stable collection of four sub-agents (`house-research`, `house-bash`, `house-git`, `house-mcp`) that offload
token-heavy operations into isolated Haiku 4.5 context windows, returning only condensed summaries to the main session. Measured reductions
in production: 95–99% per agent call (e.g. 42,900 tokens in → ~500 returned for git diff analysis). Each agent is a plain `.md` file with
YAML frontmatter — the same file-based pattern as KI agent definitions. Invocation is explicit, not automatic.

The pattern maps directly to the harness's `agents/` shelf and validates the sub-agent isolation model in ADR-KI-HARNESS-AGENTS-001. With 19
MCP servers configured, `house-mcp` is immediately useful. The agents install to `~/.claude/agents/` (user-level) rather than
`.claude/agents/` in the harness — they are not KI-governed agents, so they do not belong in the harness shelf. KI-authored equivalents
following this pattern do belong there and should be modelled on this reference implementation.

**Adoption action:** copy the four `.md` agent files to `~/.claude/agents/`. Reference the pattern when authoring agents for the harness
`agents/` shelf.

### Adopt (personal tool, no harness artifact) — house-code

house-code runs a daemon cleaner agent every 3 turns that actively prunes stale content from conversation history — old file reads,
completed todos, resolved errors. This is complementary to headroom-ai rather than duplicative: headroom compresses and compacts what is
present; house-code removes what is no longer relevant. Python package, `pip install -e .`.

**Adoption action:** install alongside headroom; run via the `house` CLI command.

### Decline — superpowers

superpowers ships a structured SDLC methodology as composable skills (brainstorming, TDD, git worktree isolation, subagent dispatch). The
philosophical overlap with the KI skills paradigm is high, but the execution model differs: superpowers skills trigger automatically and
share a monolithic install at `~/.claude/skills/gstack`. This conflicts with the validate-down `.ki-config.toml` contract
(ADR-KI-HARNESS-CONFIG-001) and the standalone-valid skill requirement (ADR-KI-HARNESS-SKILLS-004). The methodology value is real, but the
model for _how_ it is applied is the KI harness's own domain.

### Decline — gstack

gstack is a competing slash-command skill collection (office-hours, plan review, QA browser automation, security review, ship). It provides
genuine depth in some areas (real Chromium automation, STRIDE threat modelling) but installs as a monolithic `~/.claude/skills/gstack` tree
outside the KI governance layer. Adopting it alongside the KI skill set would create two parallel skill systems with no shared standard.
Individual gstack ideas (e.g. OWASP/STRIDE threat modelling as a harness skill) may be worth revisiting as KI skills in their own right.

## Consequences

- RTK is bundled with headroom — no separate install; shell-output compression is already in scope via the headroom adoption.
- house-mcp-manager gives an operator-level handle on MCP context cost between sessions; no CI or toolchain changes needed.
- mcporter adopted — 19 MCP servers are configured; `npx mcporter list` provides immediate ergonomic access and typed client generation for
  scripting and test fixture work against that surface.
- superpowers and gstack declined — the KI skills paradigm remains the single skill governance layer; no competing install conventions are
  introduced.
- house-agents adopted at user-level; its four sub-agents are immediately usable and provide a reference pattern for the harness `agents/`
  shelf population.
- house-code adopted as a personal tool; active context pruning complements headroom's compression layer.
- The `agents/` shelf gains a validated reference pattern; `mcp/` remains unblocked for KI-governed server definitions.

## References

- [ADR-KI-HARNESS-BASE-001](ADR-KI-HARNESS-BASE-001.md) — Composition over extension (paradigm the declines protect).
- [ADR-KI-HARNESS-CONFIG-001](ADR-KI-HARNESS-CONFIG-001.md) — Validate-down `.ki-config.toml` contract.
- [ADR-KI-HARNESS-SKILLS-004](ADR-KI-HARNESS-SKILLS-004.md) — Skills must be valid standalone.
- [RTK](https://www.rtk-ai.app/) — Rust Token Killer, shell output compression.
- [house-mcp-manager](https://github.com/houseworthe/house-mcp-manager) — MCP server toggle and profile manager.
- [mcporter](https://github.com/openclaw/mcporter) — MCP ergonomic API/CLI toolkit (deferred).
- [superpowers](https://github.com/obra/superpowers) — Agentic SDLC methodology skill collection (declined).
- [gstack](https://github.com/garrytan/gstack) — Structured virtual-team skill collection (declined).
- [house-agents](https://github.com/houseworthe/house-agents) — Sub-agent context isolation collection (adopted, user-level).
- [house-code](https://github.com/houseworthe/house-code) — Daemon cleaner agent for active context pruning (adopted, personal tool).
