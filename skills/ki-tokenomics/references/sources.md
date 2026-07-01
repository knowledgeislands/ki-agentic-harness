# Sources — where the tokenomics standard comes from

**Refresh:** external-spec · weekly

The authoritative and community sources behind [the standard](tokenomics-standard.md), [the rubric](audit-rubric.md), and [`../scripts/audit-tokenomics.ts`](../scripts/audit-tokenomics.ts). Mode REFRESH reads this file, re-fetches each source, diffs it against the standard + rubric + checker, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below (what changed is recorded in the commit, not a changelog). This area moves fast — model windows, prices, cache TTLs, Headroom's config surface, Anthropic's guidance, and Claude Code's own context surface — so this list is the skill's memory of where the standard comes from; keep it current.

The volatile **numbers** themselves (model ids, prices, cache TTLs, context-window sizes) are not held here or in the standard — they live in the `claude-api` skill and are resolved at runtime (standard §7). This list tracks the sources for the budget's _shape_ and the tooling.

## Authoritative

| Source | Governs | Last reviewed |
| --- | --- | --- |
| [Effective context engineering for AI agents][ctx-eng] | context-engineering principles※ | 2026-06-21 |
| [Claude context windows][ctx-win] | window mechanics; the volatile sizes (deferred to `claude-api`) | 2026-06-21 |
| [Prompt caching][caching] | cache prefix / TTL mechanics behind the caching lever (§4) | 2026-06-21 |
| [Claude Code memory & `CLAUDE.md`][cc-memory] | what auto-loads + `@import` resolution; auto memory (§2) | 2026-06-21 |
| [Claude Code context window][cc-ctxwin] | startup composition, tool search, what survives compaction (§2,§4) | 2026-06-21 |
| [Claude Code settings][cc-settings] | `settings.json` keys: model, compaction, skill-listing caps (§2,§4) | 2026-06-21 |
| [Claude Code MCP][cc-mcp] | where MCP servers are configured; tool search defers schemas (§2) | 2026-06-21 |
| [Agent Skills standard][skills-std] | skill `description` loads in the selection surface (§2) | 2026-06-21 |

※ Governs the finite-resource framing, minimal tool sets, and context ordering (§1, §6).

## Community / tooling

| Source                                  | Governs                                                             | Last reviewed |
| --------------------------------------- | ------------------------------------------------------------------- | ------------- |
| [Headroom — chopratejas/headroom][hr]   | the seeded compression-layer registry entry; detection + setup (§5) | 2026-06-21    |
| [Headroom app — extraheadroom.com][hra] | the menu-bar proxy variant of the same engine (§5)                  | 2026-06-21    |

## Last review

REFRESH last run **2026-06-21**. Drift this run: the Claude Code context surface shifted materially (tool search now defers MCP schemas; new skill-listing and compaction settings keys), and Headroom shipped a published package. Folded into standard §2/§4/§5 and the rubric (MCP-3, RUN-3, SURF-3). The standard still holds only the _shape_ of the budget, deferring all volatile figures to `claude-api`.

- **Context engineering** (Anthropic, posted 2025-09-29, unchanged): confirmed the principles the standard leans on — context as a finite resource ("context rot" / an "attention budget" as it fills), keep tool sets minimal and non-overlapping, curate canonical examples over an exhaustive rule list, and "find the smallest set of high-signal tokens." Note: the article itself gives **no numeric** tool thresholds (the 3–5-always-loaded / dynamic-discovery-beyond-~10 figures are wider community heuristics — the standard attributes them as such, not to this post). It adds just-in-time / hybrid retrieval and progressive disclosure, and frames a sub-agent as returning a condensed ~1,000–2,000-token summary — consistent with the §4 fan-out lever; no standard change needed.
- **Claude Code context surface** (memory + context-window + settings + MCP docs; host moved to `code.claude.com/docs/en/*`): several changes now reflected in the standard.
  - **MCP tool search is default-on.** Only tool _names_ load at startup; full schemas are deferred and fetched on demand. `ENABLE_TOOL_SEARCH=auto` loads schemas upfront when they fit ~10% of the window; `ENABLE_TOOL_SEARCH=false` is the old load-everything behaviour. Qualified §2's "largest line item" claim and added the signal to rubric MCP-3 — the server-count proxy stands.
  - **Skill-listing caps.** `maxSkillDescriptionChars` (default 1536) and `skillListingBudgetFraction` bound the per-skill description text the model sees; `disable-model-invocation: true` drops a skill from the listing. Folded into §2 ‡ and SURF-3.
  - **Compaction is a settings lever.** `autoCompactEnabled` / `DISABLE_AUTO_COMPACT`; the skill-description listing is **not** re-injected after `/compact` (only invoked skills survive), while the project-root `CLAUDE.md` is re-read. Folded into §4 and RUN-3.
  - **Auto memory** is now a documented first-class system at `~/.claude/projects/<project>/memory/MEMORY.md` (first 200 lines / 25KB loaded each session) — confirms the skill's `MEMORY.md` model and the `memory_index` budget; no change needed.
  - **`claudeMdExcludes`** skips an irrelevant ancestor `CLAUDE.md` — added as a CONFORM lever in SKILL.md.
  - `@import` recursion confirmed at **max depth four hops**; imported files load at launch (do not reduce context) — matches SURF-1.
- **Headroom** (chopratejas/headroom + extraheadroom.com): now published as **`headroom-ai`** (pip / npm / Docker `ghcr.io`), at **v0.26.0** (Apache-2.0, Python 3.10+). Detection signals unchanged plus a `headroom wrap <agent>` mode (added to §5). Same three MCP tools and the `HEADROOM_OUTPUT_SHAPER` / `HEADROOM_OUTPUT_HOLDOUT` env keys; newer env keys seen (`HEADROOM_EMBEDDER_RUNTIME`, `HEADROOM_CONTEXT_TOOL`, `HEADROOM_UPDATE_CHECK`) are runtime/offload knobs, not detection or optimal-setup signals. Headline savings 60–95% (tool-heavy evals); budget against ~20–30% on mixed work.
- **Open watch-items:**
  - **Pin Headroom's exact config surface.** The MCP `mcpServers` JSON entry shape, the CCR store path + TTL key, and the cache-aligner toggle are still **not documented** upstream (CLI/env-driven; a `claude_analysis_ttl.py` exists in the tree but is unexplained). TOOL-3 (optimal-setup) therefore stays judgment; promote it to a mechanical check the moment those keys are published. Re-fetch the repo next run.
  - **Promote `ENABLE_TOOL_SEARCH` to a mechanical check?** It is now a concrete env signal bearing directly on the MCP-schema standing cost; consider teaching the checker to read it (and report tool-search state) so MCP-3's tool-search clause becomes [M].
  - **The "Netflix Headroom" attribution** seen in some secondary coverage is uncorroborated by the repo — do not assert a Netflix origin.
  - Watch for a **second registry entry** worth seeding (another compression / context-pruning project) so the registry is plural in fact.
  - Re-confirm the Claude Code config surface each run — it shifts under the skill (this run: doc host moved, tool search, skill-listing caps), which is why the skill resolves it at runtime rather than hard-coding it.

[ctx-eng]: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
[ctx-win]: https://platform.claude.com/docs/en/build-with-claude/context-windows
[caching]: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
[cc-memory]: https://code.claude.com/docs/en/memory
[cc-ctxwin]: https://code.claude.com/docs/en/context-window
[cc-settings]: https://code.claude.com/docs/en/settings
[cc-mcp]: https://code.claude.com/docs/en/mcp
[skills-std]: https://agentskills.io/specification
[hr]: https://github.com/chopratejas/headroom
[hra]: https://extraheadroom.com/
