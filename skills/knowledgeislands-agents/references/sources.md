# Sources — where the standard comes from

**Refresh:** external-spec · monthly

The sources behind [the standard](agent-definitions-standard.md) and its [rubric](audit-rubric.md). Mode REFRESH reads this file, re-fetches each source, diffs it against the standard + rubric, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below (what changed is recorded in the commit, not a changelog). This is the skill's memory of where best practice comes from — keep it current.

Abbreviations match the `(SOURCE)` tags in [the standard](agent-definitions-standard.md) and [rubric](audit-rubric.md).

## Authoritative

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| CC | [Claude Code — subagents][cc] | Subagent file format, the frontmatter spec set,[^cc] invocation control | 2026-06-26 |
| BP | [Skill authoring best practices][bp] | Description writing, conciseness, least-privilege, evaluation-first (applied to agents) | 2026-06-21 |

[^cc]: Full set: `name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`, `maxTurns`, `skills`, `mcpServers`, `hooks`, `memory`, `background`, `effort`, `isolation`, `color`, `initialPrompt`.

## Community / practitioner

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| COM1 | [awesome-claude-code-subagents (VoltAgent)][c1] | Example agent definitions (100+); patterns for tool scoping, model routing, description quality | 2026-06-26 |
| COM2 | [Sub-agent best practices (PubNub)][c2] | Production patterns: SubagentStop hooks, skills+hooks+subagents trinity, concurrent agent limits | 2026-06-26 |

## In-house

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| HOUSE | The harness `agents/README.md` + the role-prompt shape | Layout, the role/lane prompt pattern, grounding, lane disambiguation, KB-note wikilinks | 2026-06-26 |

## Last review

**REFRESH 2026-06-26 — drift found; action items raised.** CC re-fetched in full; two community practitioner sources added (COM1, COM2). The standard and rubric have meaningful gaps against the current CC spec and community practice. No changes applied this session — changes are tracked as open action items below for the next CONFORM pass.

- **CC (Claude Code subagents docs):** re-fetched 2026-06-26. Frontmatter field set unchanged (still the 16-field set in FM-3). Significant new surface confirmed that the rubric does not yet cover:
  - **`skills` field** — preloads full skill content into the subagent at startup; the idiomatic alternative to companion files for "extra context." FM-3 lists it as valid but no criterion governs when to use it vs runtime discovery. Needs FM criterion.
  - **`memory` field** — `user`/`project`/`local` persistent directory; agent accumulates codebase patterns and decisions across sessions. No criterion in rubric at all. Needs FM criterion covering scope choice and authoring guidance in system prompt.
  - **`hooks` field** — `PreToolUse`/`PostToolUse`/`Stop` scoped to the subagent. No guidance on blast radius or when scoped hooks are appropriate vs project-level `settings.json` hooks. Needs FM criterion.
  - **`effort` field** — per-agent effort override. No criterion. Needs FM criterion (when to pin vs inherit).
  - **`isolation: worktree`** — run in isolated git worktree. No criterion for when to use. Needs FM criterion.
  - **`background: true`** — always run as background task. No criterion. Needs FM criterion.
  - **`Agent(type)` spawn-allowlist** — `tools: Agent(worker, researcher)` to restrict which subagents a coordinator can spawn. Flagged as a watch-item since 2026-06-21; still un-actioned. Now the agents/ shelf is populated with coordinator-adjacent agents (ki-\*), making this more pressing. Needs FM + LANE criterion for coordinator patterns.
  - **Nested subagents (v2.1.172+)** — subagents can spawn their own (depth ≤ 5). LANE/COLL criteria don't address coordinator own-vs-defer for spawn-allowlists. Needs LANE update.
  - **Directory-per-agent** — CC spec does not support companion file injection; `skills` preloading is the platform answer. Standard §2 should add guidance: companion `.md` files (no `name` frontmatter) are permitted for human organisation, but reference content belongs in a preloaded skill, not an inert sibling.
- **BP:** not re-fetched this session (last reviewed 2026-06-21, within monthly cadence). No change.
- **COM1 (awesome-claude-code-subagents):** reviewed 2026-06-26. Confirms community converges on: one-goal-per-agent, tools scoped to role, `model: sonnet` for analysis roles, `model: haiku` for mechanical/cheap roles, "use proactively" idiom in description. No new field patterns beyond CC spec. Useful as a pattern-check source for PROC-11 (evaluation against representative tasks).
- **COM2 (PubNub best practices):** reviewed 2026-06-26. Key additions to watch: (a) `SubagentStop` hook pattern — enforce non-negotiables (tests pass, no secrets, no out-of-scope writes) before result folds back in; (b) skills+hooks+subagents trinity as the production setup (skill teaches the how, hook enforces the rule, subagent isolates the work); (c) limit concurrent subagents to 3–5 for orchestration hygiene. Items (a) and (b) support a new FM criterion for hooks; item (c) is advisory, not a rubric criterion.
- **HOUSE:** re-read 2026-06-26. The role/lane prompt shape and KB-wikilink divergence stand. The `agents/` shelf now has 5 KI governance agents (ki-skills-lead, ki-engineering-lead, ki-kb-curator, ki-decision-author, ki-streams-curator); FM-3 toleration decisions on `permissionMode`/`disallowedTools` can now be assessed against real agents — none use them, consistent with advisory-only treatment.
- **Open action items for next CONFORM pass:** add FM criteria for `skills`, `memory`, `hooks`, `effort`, `isolation`, `background`; add FM+LANE criteria for `Agent(type)` spawn-allowlist and coordinator patterns; update §2 (Layout) to address directory-per-agent and companion-file guidance; update source tags in standard + rubric to include COM1/COM2 where they support existing criteria.

[cc]: https://code.claude.com/docs/en/sub-agents
[bp]: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
[c1]: https://github.com/VoltAgent/awesome-claude-code-subagents
[c2]: https://www.pubnub.com/blog/best-practices-for-claude-code-sub-agents/
