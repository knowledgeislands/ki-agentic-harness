# Sources — where the tokenomics standard comes from

**Refresh:** external-spec · weekly

The authoritative and community sources behind [the tokenomics standard](standards-tokenomics.md), [the Headroom operational safety standard](standards-headroom-operations.md), [the rubric](rubric.md), and its structured TypeScript families. Mode REFRESH reads this file, re-fetches each source, diffs it against those sources of truth, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below (what changed is recorded in the commit, not a changelog). This area moves fast — model windows, prices, cache TTLs, Headroom's config surface, Anthropic's guidance, and Claude Code's own context surface — so this list is the skill's memory of where the standard comes from; keep it current.

The volatile **numbers** themselves (model ids, prices, cache TTLs, context-window sizes) are not held here or in the standard — they live in the `claude-api` skill and are resolved at runtime (standard §7). This list tracks the sources for the budget's _shape_ and the tooling.

## Authoritative

| Source | Governs | Last reviewed |
| --- | --- | --- |
| [Effective context engineering for AI agents][ctx-eng] | context-engineering principles※ | 2026-07-27 |
| [Claude context windows][ctx-win] | window mechanics; the volatile sizes (deferred to `claude-api`) | 2026-07-27 |
| [Prompt caching][caching] | cache prefix / TTL mechanics behind the caching lever (§4) | 2026-07-27 |
| [Claude Code memory & `CLAUDE.md`][cc-memory] | what auto-loads + `@import` resolution; auto memory (§2) | 2026-07-27 |
| [Claude Code context window][cc-ctxwin] | startup composition, tool search, what survives compaction (§2,§4) | 2026-07-27 |
| [Claude Code settings][cc-settings] | `settings.json` keys: model, compaction, skill-listing caps (§2,§4) | 2026-07-27 |
| [Claude Code MCP][cc-mcp] | where MCP servers are configured; tool search defers schemas (§2) | 2026-07-27 |
| [Agent Skills standard][skills-std] | skill `description` loads in the selection surface (§2) | 2026-07-27 |
| [Prompting guides — model-type resolution][prompt-guides] | which concrete model each portable type resolves to per runtime (§3, ADR-008); the Claude column | 2026-07-27 |
| [GPT-5.6 Codex tiers (preview)][gpt56] | the Codex column of the type resolution — **preview, volatile; reconfirm each REFRESH** | 2026-07-13 |

※ Governs the finite-resource framing, minimal tool sets, and context ordering (§1, §6).

## Community / tooling

| Source                                         | Governs                                                             | Last reviewed |
| ---------------------------------------------- | ------------------------------------------------------------------- | ------------- |
| [Headroom — chopratejas/headroom][hr]          | the seeded compression-layer registry entry; detection + setup (§5) | 2026-07-27    |
| [Headroom app — extraheadroom.com][hra]        | the menu-bar proxy variant of the same engine (§5)                  | 2026-06-21    |
| Installed Headroom 0.32.0 CLI + package source | reset and per-project proxy contracts (§5)                          | 2026-07-16    |

## Last review

REFRESH last run **2026-07-27** (prior: 2026-07-04). Re-fetched this run: all authoritative sources (context-engineering blog, Claude context windows, prompt caching, Claude Code memory, Claude Code context window, Claude Code settings, Claude Code MCP, Agent Skills spec), the in-repo prompting guide, and the Headroom GitHub repo. Two sources not re-fetched due to session egress policy: codex.danielvaughan.com (GPT-5.6 community article, carried from 2026-07-13) and extraheadroom.com (carried from 2026-06-21). Installed Headroom CLI not re-run (carried from 2026-07-16).

Targeted operational verification **2026-07-16**: installed Headroom 0.31.0 `savings`, `perf`, and `install` help plus `headroom.paths`, `headroom.cli.savings`, `headroom.perf.analyzer`, `headroom.proxy.helpers`, `headroom.proxy.server`, `headroom.proxy.savings_tracker`, and `headroom.install.runtime` establish the independent reset surfaces and safety constraints recorded in [the Headroom operational safety standard](standards-headroom-operations.md). This corrected the staged assumption that `headroom savings --reset` clears all dashboard state: it deletes only the CLI environment's resolved `savings_events.jsonl`; `/stats` uses separate runtime counters and a separately resolved `proxy_savings.json` history.

The same installed-source verification establishes the proxy's URL-encoded `/p/<name>` project-context path, `X-Headroom-Project` header precedence, default `127.0.0.1:8787` endpoint, and the `savings.per_project` breakdown returned by `/stats`. The standard therefore scopes an existing project-local loopback override mechanically, while leaving remote or ambiguous gateways untouched.

- **Headroom** (chopratejas/headroom): upstream repo now at **v0.32.0** (was v0.30.0 at 2026-07-04 full REFRESH; targeted CLI verification used v0.31.0). Three MCP tools unchanged (`headroom_compress` / `headroom_retrieve` / `headroom_stats`). v0.32.0 additions: `HEADROOM_SAVINGS_PROFILE` env var; `headroom inspect` command (compare original vs compressed); Settings dashboard for runtime proxy config + lifetime metrics persistence (new persistent store, not yet covered by the operations standard); MCP HTTP streaming transport; published `server.json` (canonical JSON mcpServers entry shape now documented); MCP config resolution now checks both `~/.claude.json` and `~/.claude/mcp.json`; new CLI wrap targets (OpenClaude, Grok, Kimi). The operations standard procedure remains pinned at v0.31.0 — **re-verify before updating** (see watch-items).
- **Claude Code settings** (code.claude.com/docs/en/settings): full re-fetch this run. `autoCompactEnabled` (default true), `claudeMdExcludes`, `maxSkillDescriptionChars`, `skillListingBudgetFraction`, `ENABLE_TOOL_SEARCH` all confirmed live. New keys this run bearing on tokenomics: `disableBundledSkills` (removes bundled skills from the listing — affects SURF-3), `effortLevel`/`alwaysThinkingEnabled` (thinking-tier selection — affects RUN-2 judgment). Additional new keys immaterial to the standard: `fallbackModel`, `advisorModel`, `autoMemoryDirectory`, `awaySummaryEnabled`, `effortLevel`, `fileCheckpointingEnabled`, `askUserQuestionTimeout`.
- **Claude Code context window** (code.claude.com/docs/en/context-window): full re-fetch. Confirmed: tool search still default (deferred); `ENABLE_TOOL_SEARCH=true` force-deferred value now explicitly documented (folded into §2 footnote §). Skill body cap after compaction confirmed: 5,000 tokens/skill, 25,000 total, oldest dropped first (folded into §4). Compaction summarisation now inherits extended thinking config (v2.1.198+). Fable 5, Sonnet 5 listed with 1M context — volatile, deferred to `claude-api`.
- **Claude Code memory** (code.claude.com/docs/en/memory): full re-fetch. `MEMORY.md` limit: 200 lines or 25 KB, now excludes YAML frontmatter and HTML comments from measurement (v2.1.211). `/doctor` command (v2.1.206) analyses CLAUDE.md and proposes context-saving trims — useful context-engineering tool, no standard change needed. Auto memory `modified` timestamp in YAML frontmatter (v2.1.214).
- **Claude Code MCP** (code.claude.com/docs/en/mcp): full re-fetch. `alwaysLoad: true` server-level config and `_meta["anthropic/alwaysLoad"]: true` tool-level annotation for opting out of schema deferral confirmed (folded into §2 footnote §). `anthropic/maxResultSizeChars` annotation for per-tool output size limits confirmed — relevant to RUN-4 judgment. MCP tool auto-backgrounding after 2 minutes (v2.1.212+); `ENABLE_TOOL_SEARCH=auto:N` custom threshold variant documented.
- **Agent Skills specification** (agentskills.io/specification): `name` max 64 chars and `description` max 1024 chars unchanged. Two new optional fields now present: `compatibility` (max 500 chars, environment requirements) and `allowed-tools` (experimental, space-separated tool allowlist). Neither affects the standing-cost model; `allowed-tools` is experimental and not yet material to SURF-3.
- **Prompting guide** (in-repo): type resolution table current — frontier→Fable 5, reasoning→Opus 4.8, standard→Sonnet 5, fast→Haiku 4.5; Codex column (Sol/Terra/Luna) carried from 2026-07-13.
- **Prompt caching** (platform.claude.com): 1-hour TTL option (`ttl: "1h"`) and automatic-caching mode now documented — both volatile, deferred to `claude-api` as intended by §7. Context-engineering framing unchanged.
- **Open watch-items:**
  - **Re-verify operations standard against Headroom v0.32.0.** `standards-headroom-operations.md` is pinned at v0.31.0. v0.32.0 adds a Settings dashboard introducing a new persistent metrics store not covered by the current procedure. Re-run `savings`, `perf`, and `install` help against v0.32.0 before updating the procedure with the new store. Until then, the v0.31.0 procedure remains authoritative.
  - **Pin Headroom's exact config surface.** The JSON `mcpServers` entry shape is now documented via `server.json` (v0.32.0). The TOML shape, CCR store path + TTL key, and the cache-aligner toggle remain undocumented upstream. TOOL-3 (optimal-setup) stays judgment; promote to mechanical check the moment those keys are published.
  - **Promote `ENABLE_TOOL_SEARCH` to a mechanical check?** The key is now fully documented in the MCP docs with all values (`true` / `auto` / `auto:N` / `false`). The standard now captures the full vocabulary (§2 footnote §). The decision to teach the checker to read this key so MCP-3's tool-search clause becomes [M] is still open.
  - **extraheadroom.com and codex.danielvaughan.com** — blocked by session egress policy this run. Re-fetch next run.
  - The **"Netflix Headroom" attribution** remains uncorroborated by the repo — do not assert a Netflix origin.
  - Watch for a **second registry entry** worth seeding so the compression-tooling registry is plural in fact.

[ctx-eng]: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
[ctx-win]: https://platform.claude.com/docs/en/build-with-claude/context-windows
[caching]: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
[cc-memory]: https://code.claude.com/docs/en/memory
[cc-ctxwin]: https://code.claude.com/docs/en/context-window
[cc-settings]: https://code.claude.com/docs/en/settings
[cc-mcp]: https://code.claude.com/docs/en/mcp
[skills-std]: https://agentskills.io/specification
[prompt-guides]: ../../../../docs/guides/prompting/README.md
[gpt56]: https://codex.danielvaughan.com/2026/06/26/gpt-5-6-sol-terra-luna-preview-codex-cli-model-tiers-pricing-ultra-mode-configuration/
[hr]: https://github.com/chopratejas/headroom
[hra]: https://extraheadroom.com/
