# Sources — where the tokenomics standard comes from

**Refresh:** external-spec · weekly

The authoritative and community sources behind [the standard](standards.md), [the rubric](rubric.md), and [`../scripts/audit.ts`](../scripts/audit.ts). Mode REFRESH reads this file, re-fetches each source, diffs it against the standard + rubric + checker, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below (what changed is recorded in the commit, not a changelog). This area moves fast — model windows, prices, cache TTLs, Headroom's config surface, Anthropic's guidance, and Claude Code's own context surface — so this list is the skill's memory of where the standard comes from; keep it current.

The volatile **numbers** themselves (model ids, prices, cache TTLs, context-window sizes) are not held here or in the standard — they live in the `claude-api` skill and are resolved at runtime (standard §7). This list tracks the sources for the budget's _shape_ and the tooling.

## Authoritative

| Source | Governs | Last reviewed |
| --- | --- | --- |
| [Effective context engineering for AI agents][ctx-eng] | context-engineering principles※ | 2026-07-20 |
| [Claude context windows][ctx-win] | window mechanics; the volatile sizes (deferred to `claude-api`) | 2026-07-20 |
| [Prompt caching][caching] | cache prefix / TTL mechanics behind the caching lever (§4) | 2026-07-20 |
| [Claude Code memory & `CLAUDE.md`][cc-memory] | what auto-loads + `@import` resolution; auto memory (§2) | 2026-07-20 |
| [Claude Code context window][cc-ctxwin] | startup composition, tool search, what survives compaction (§2,§4) | 2026-07-20 |
| [Claude Code settings][cc-settings] | `settings.json` keys: model, compaction, skill-listing caps (§2,§4) | 2026-07-20 |
| [Claude Code MCP][cc-mcp] | where MCP servers are configured; tool search defers schemas (§2) | 2026-07-20 |
| [Agent Skills standard][skills-std] | skill `description` loads in the selection surface (§2) | 2026-07-20 |
| [Prompting guides — model-type resolution][prompt-guides] | which concrete model each portable type resolves to per runtime (§3, ADR-008); the Claude column | 2026-07-20 |
| [GPT-5.6 Codex tiers (preview)][gpt56] | the Codex column of the type resolution — **preview, volatile; reconfirm each REFRESH** | 2026-07-13 |

※ Governs the finite-resource framing, minimal tool sets, and context ordering (§1, §6).

## Community / tooling

| Source                                         | Governs                                                             | Last reviewed |
| ---------------------------------------------- | ------------------------------------------------------------------- | ------------- |
| [Headroom — chopratejas/headroom][hr]          | the seeded compression-layer registry entry; detection + setup (§5) | 2026-07-20    |
| [Headroom app — extraheadroom.com][hra]        | the menu-bar proxy variant of the same engine (§5)                  | 2026-06-21    |
| Installed Headroom 0.31.0 CLI + package source | reset and per-project proxy contracts (§5)                          | 2026-07-16    |

## Last review

REFRESH last run **2026-07-20** (prior: 2026-07-04; targeted operational check 2026-07-16). Automated weekly pass — eight authoritative sources re-fetched live; hra and gpt56 network-blocked; installed Headroom CLI not re-inspected (requires local execution). Standard, rubric, and checker hold — no normative drift.

- **ctx-eng:** confirmed; sub-agent/jit-retrieval framing unchanged. §1/§6 current.
- **ctx-win:** Fable 5 + Mythos 5 (1M window, 128k max output) now documented; task-budget injection (beta) for Opus 4.7+/Fable/Mythos replaces context-awareness tags; server-side compaction beta. Volatile — deferred to `claude-api` per §7.
- **caching:** 1-hour TTL option confirmed (2× write, 0.1× read); workspace-level cache isolation; pre-warming via `max_tokens:0`. Volatile — deferred per §7.
- **cc-memory:** path-scoped rules (`.claude/rules/*.md`) load conditionally on file match (context-saving, not startup cost). `claudeMd` in `managed-settings.json`. Subagents do NOT inherit parent's auto memory (own if `memory:` configured). Affects §4 sub-agent surface estimate — see watch-items.
- **cc-ctxwin:** MCP tool-names ~120 tokens at startup; skill descriptions ~450 tokens, not re-injected post-`/compact`. Subagent stack ≈900+1800+970 tokens. Confirms existing standard claims.
- **cc-settings:** `managed-settings.d/` drop-in, `disableBundledSkills`, `alwaysThinkingEnabled` observed. `maxSkillDescriptionChars`/`skillListingBudgetFraction`/`ENABLE_TOOL_SEARCH` not re-confirmed (page truncated).
- **cc-mcp:** auto-backgrounding for tool calls >2 min (v2.1.212); MCP output capped at **25k tokens** by default. Tool search on by default confirmed. §4 framing current.
- **skills-std:** `allowed-tools` experimental field; ~100-token metadata / <5k-token body confirmed. §2 claims current.
- **prompt-guides (in-repo):** type resolution confirmed — frontier→Fable5, reasoning→Opus4.8, standard→Sonnet5, fast→Haiku4.5; Sol/Terra/Luna (Codex). §3 bindings correct.
- **gpt56:** not re-fetched (blocked); verified 2026-07-13, harness README consistent. Date carried.
- **Headroom (GitHub):** v0.32.0 released 2026-07-17. Three MCP tools unchanged. New: `HEADROOM_EMBEDDER_RUNTIME=pytorch_mps`, granular install extras (`[ml]`,`[memory]`,`[vector]`). Installed inspection deferred to next manual session (was v0.31.0 on 2026-07-16).
- **hra:** blocked; date carried.

**Open watch-items:**

- **Re-inspect Headroom v0.32.0 installed CLI.** Run `savings`/`perf`/`install` help; check new extras; update `headroom-operations.md` version stamp.
- **Pin Headroom config surface.** CCR store path, cache-aligner key still undocumented upstream. TOOL-3 stays [J]; promote when published.
- **MCP output cap (25k default).** Native ceiling pre-Headroom; consider noting in §5 savings framing at next normative pass.
- **Path-scoped rules + subagent memory.** Consider §2 note on conditional surface; clarify §4 "re-pays the whole surface" — memory is sub-agent-local, not parent-inherited.
- **`ENABLE_TOOL_SEARCH` re-confirm.** Settings page truncated; re-verify next pass.
- **Netflix attribution:** uncorroborated; do not assert. Second registry entry: no candidate yet.

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
