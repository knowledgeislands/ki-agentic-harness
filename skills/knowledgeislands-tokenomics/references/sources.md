# Sources — where the tokenomics standard comes from

The authoritative and community sources behind [the standard](tokenomics-standard.md), [the rubric](audit-rubric.md), and
[`../scripts/audit-tokenomics.ts`](../scripts/audit-tokenomics.ts). Mode REFRESH reads this file, re-fetches each source, diffs it against
the standard + rubric + checker, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below (what changed is
recorded in the commit, not a changelog). This area moves fast — model windows, prices, cache TTLs, Headroom's config surface, Anthropic's
guidance — so this list is the skill's memory of where the standard comes from; keep it current.

The volatile **numbers** themselves (model ids, prices, cache TTLs, context-window sizes) are not held here or in the standard — they live
in the `claude-api` skill and are resolved at runtime (standard §7). This list tracks the sources for the budget's _shape_ and the tooling.

## Authoritative

| Source                                                 | Governs                                                              | Last reviewed |
| ------------------------------------------------------ | -------------------------------------------------------------------- | ------------- |
| [Effective context engineering for AI agents][ctx-eng] | finite-resource framing, minimal tool sets, context ordering (§1,§6) | 2026-06-18    |
| [Claude context windows][ctx-win]                      | window mechanics; the volatile sizes (deferred to `claude-api`)      | 2026-06-18    |
| [Prompt caching][caching]                              | cache prefix / TTL mechanics behind the caching lever (§4)           | 2026-06-18    |
| [Claude Code memory & `CLAUDE.md`][cc-memory]          | what auto-loads + `@import` resolution (§2)                          | 2026-06-18    |
| [Claude Code settings][cc-settings]                    | `settings.json` keys: model, `env`, `statusLine`, `hooks` (§2,§4)    | 2026-06-18    |
| [Claude Code MCP][cc-mcp]                              | where MCP servers are configured; the tool-definition surface (§2)   | 2026-06-18    |
| [Agent Skills standard][skills-std]                    | skill `description` loads in the selection surface (§2)              | 2026-06-18    |

## Community / tooling

| Source                                  | Governs                                                             | Last reviewed |
| --------------------------------------- | ------------------------------------------------------------------- | ------------- |
| [Headroom — chopratejas/headroom][hr]   | the seeded compression-layer registry entry; detection + setup (§5) | 2026-06-18    |
| [Headroom app — extraheadroom.com][hra] | the menu-bar proxy variant of the same engine (§5)                  | 2026-06-18    |

## Last review

REFRESH last run **2026-06-18** (skill authored). Sources fetched this run; the standard holds the _shape_ of the budget, deferring all
volatile figures to `claude-api`.

- **Context engineering** (Anthropic, post dated 2025-09-29): confirmed the principles the standard leans on — context is a finite resource
  ("context rot" as it fills), keep tool sets minimal (the 3–5-always-loaded / dynamic-discovery-beyond-~10 heuristic), order context system
  → memory → tools → history, curate canonical examples over exhaustive rules. Folded into standard §1 and §6.
- **Headroom** (chopratejas/headroom + extraheadroom.com): confirmed the detection signals the checker uses — MCP install
  (`headroom mcp install`) exposing `headroom_compress` / `headroom_retrieve` / `headroom_stats`; `headroom proxy --port 8787`; `HEADROOM_*`
  env (`HEADROOM_OUTPUT_SHAPER`, `HEADROOM_OUTPUT_HOLDOUT`, …); reversible CCR store + cache-aligner features. Apache-2.0, v0.x. Realistic
  savings ~20–30% mixed / 60–95% tool-heavy (the project's own evals — not budgeted against).
- **Open watch-items:**
  - **Pin Headroom's exact config surface.** The MCP `mcpServers` JSON entry shape, the CCR store path + TTL key, and the cache-aligner
    toggle are **not documented** upstream yet. TOOL-3 (optimal-setup) is therefore judgment; promote it to a mechanical check the moment
    those keys are published. Re-fetch the repo's docs/ next run.
  - **The "Netflix Headroom" attribution** seen in some secondary coverage is uncorroborated by the repo — do not assert a Netflix origin.
  - Watch for a **second registry entry** worth seeding (another compression / context-pruning project) so the registry is plural in fact.
  - Re-confirm the Claude Code config surface (auto-loaded files, settings keys) each run — it shifts under the skill, which resolves it at
    runtime rather than hard-coding it.

[ctx-eng]: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
[ctx-win]: https://platform.claude.com/docs/en/build-with-claude/context-windows
[caching]: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
[cc-memory]: https://docs.claude.com/en/docs/claude-code/memory
[cc-settings]: https://docs.claude.com/en/docs/claude-code/settings
[cc-mcp]: https://docs.claude.com/en/docs/claude-code/mcp
[skills-std]: https://agentskills.io/specification
[hr]: https://github.com/chopratejas/headroom
[hra]: https://extraheadroom.com/
