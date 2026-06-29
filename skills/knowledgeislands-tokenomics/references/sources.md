# Sources — where the tokenomics standard comes from

**Refresh:** external-spec · weekly

The authoritative and community sources behind [the standard](tokenomics-standard.md), [the rubric](audit-rubric.md), and
[`../scripts/audit-tokenomics.ts`](../scripts/audit-tokenomics.ts). Mode REFRESH reads this file, re-fetches each source, diffs it against
the standard + rubric + checker, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below (what changed is
recorded in the commit, not a changelog). This area moves fast — model windows, prices, cache TTLs, Headroom's config surface, Anthropic's
guidance, and Claude Code's own context surface — so this list is the skill's memory of where the standard comes from; keep it current.

The volatile **numbers** themselves (model ids, prices, cache TTLs, context-window sizes) are not held here or in the standard — they live
in the `claude-api` skill and are resolved at runtime (standard §7). This list tracks the sources for the budget's _shape_ and the tooling.

## Authoritative

| Source                                                 | Governs                                                              | Last reviewed |
| ------------------------------------------------------ | -------------------------------------------------------------------- | ------------- |
| [Effective context engineering for AI agents][ctx-eng] | finite-resource framing, minimal tool sets, context ordering (§1,§6) | 2026-06-29    |
| [Claude context windows][ctx-win]                      | window mechanics; the volatile sizes (deferred to `claude-api`)      | 2026-06-29    |
| [Prompt caching][caching]                              | cache prefix / TTL mechanics behind the caching lever (§4)           | 2026-06-29    |
| [Claude Code memory & `CLAUDE.md`][cc-memory]          | what auto-loads + `@import` resolution; auto memory (§2)             | 2026-06-29    |
| [Claude Code context window][cc-ctxwin]                | startup composition, tool search, what survives compaction (§2,§4)   | 2026-06-29    |
| [Claude Code settings][cc-settings]                    | `settings.json` keys: model, compaction, skill-listing caps (§2,§4)  | 2026-06-29    |
| [Claude Code MCP][cc-mcp]                              | where MCP servers are configured; tool search defers schemas (§2)    | 2026-06-29    |
| [Agent Skills standard][skills-std]                    | skill `description` loads in the selection surface (§2)              | 2026-06-29    |

## Community / tooling

| Source                                  | Governs                                                             | Last reviewed |
| --------------------------------------- | ------------------------------------------------------------------- | ------------- |
| [Headroom — chopratejas/headroom][hr]   | the seeded compression-layer registry entry; detection + setup (§5) | 2026-06-29    |
| [Headroom app — extraheadroom.com][hra] | the menu-bar proxy variant of the same engine (§5)                  | 2026-06-29    |

## Last review

REFRESH last run **2026-06-29**. Drift this run: `.claude/rules/` is now a documented first-class standing-surface component (missing from
the previous standard); `CLAUDE.local.md` was absent from the §2 catalogue; MCP gained an `alwaysLoad: true` per-server field that bypasses
tool search. Folded into standard §2 (new row + ★ footnote, updated CLAUDE.md row, updated § footnote), rubric (new SURF-5 [J]), and
SKILL.md (Mode CONFORM step 2). All other source principles confirmed unchanged.

- **Context engineering** (Anthropic, posted 2025-09-29, unchanged): all principles confirmed — context as a finite resource ("context rot"
  / "attention budget"), minimal non-overlapping tool sets, just-in-time retrieval, curate canonical examples over exhaustive rules,
  sub-agent returning ~1,000–2,000-token condensed summary. No standard change needed.
- **Claude Code context surface** (memory + context-window + settings + MCP docs; `code.claude.com/docs/en/*`):
  - **`.claude/rules/` is a new standing surface.** Markdown files in project `.claude/rules/` (and user `~/.claude/rules/`) load at launch
    (unconditionally, same priority as `.claude/CLAUDE.md`) or on demand for rules carrying a `paths:` frontmatter filter. Once loaded they
    persist for the session. Added to §2 catalogue (new row + ★ footnote) and rubric SURF-5 [J].
  - **`CLAUDE.local.md`** loads at the same time as `CLAUDE.md` at the project layer (personal per-project preferences; typically
    gitignored). Added to the §2 CLAUDE.md row.
  - **`alwaysLoad: true`** per-server MCP field forces full schema loading even when tool search is on. Added to the § footnote.
  - **`ENABLE_TOOL_SEARCH`** behavior unchanged from last run; confirmed as a concrete env signal.
  - **`autoMemoryEnabled` setting** — new key to toggle auto memory; no standard change (auto memory already covered in §2 Memory row).
  - All previously noted changes (tool search, skill-listing caps, compaction lever, auto memory, `claudeMdExcludes`, `@import` depth 4)
    remain accurate.
- **Headroom** (chopratejas/headroom): now at **v0.27.0** (June 22, 2026, up from v0.26.0). New env keys noted: `HEADROOM_TLS_STRICT=0`,
  `HF_HUB_OFFLINE=1`, `ORT_STRATEGY=system` — runtime/infra knobs, not detection or optimal-setup signals. Config surface (CCR store path,
  TTL key, cache-aligner toggle) still **not documented** upstream — TOOL-3 stays judgment.
- **extraheadroom.com**: returned HTTP 403 this run — site inaccessible. No drift assessment possible; re-fetch next run.
- **Prompt caching** (platform.claude.com): new 1-hour TTL option and workspace-level cache isolation (Feb 5, 2026) confirmed. Volatile
  pricing/TTL facts deferred to `claude-api` per §7; the caching lever principle in §4 is unchanged.
- **Claude context windows** (platform.claude.com): Claude Fable 5 / Mythos 5 have 1M-token windows; Sonnet 4.6/4.5/Haiku 4.5 gained
  context-awareness. Volatile facts deferred to `claude-api`; no standard change needed.
- **Agent Skills standard** (agentskills.io): `description` max 1024 chars confirmed; `disable-model-invocation: true` behavior confirmed.
  No change needed.
- **Open watch-items:**
  - **Pin Headroom's exact config surface.** CCR store path, TTL key, and cache-aligner toggle still **not documented** upstream. TOOL-3
    stays judgment; promote to mechanical once those keys are published. Re-fetch next run.
  - **extraheadroom.com inaccessible (403).** Could not confirm the menu-bar proxy variant this run. Re-fetch next run.
  - **SURF-5 [J] → [M] for `.claude/rules/`.** The checker does not yet scan `.claude/rules/`; promote once covered by
    `audit-tokenomics.ts`.
  - **Promote `ENABLE_TOOL_SEARCH` to a mechanical check?** Confirmed concrete env signal; consider teaching the checker to read it so
    MCP-3's tool-search clause becomes [M].
  - **The "Netflix Headroom" attribution** seen in some secondary coverage is uncorroborated by the repo — do not assert a Netflix origin.
  - Watch for a **second registry entry** worth seeding (another compression / context-pruning project).
  - Re-confirm the Claude Code config surface each run — it shifts under the skill.

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
