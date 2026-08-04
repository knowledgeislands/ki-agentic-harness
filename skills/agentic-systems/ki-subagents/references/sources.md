# Sources — where the standard comes from

**Refresh:** external-spec · monthly

The sources behind [the subagent-definitions standard](standards-subagent-definitions.md) and its [rubric](rubric.md). Mode REFRESH reads this file, re-fetches each source, diffs it against the standard + rubric, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below (what changed is recorded in the commit, not a changelog). This is the skill's memory of where best practice comes from — keep it current.

Abbreviations match the `(SOURCE)` tags in [the standard](standards-subagent-definitions.md) and [rubric](rubric.md).

## Authoritative

| Tag | Source                               | Governs                                                                 | Last reviewed |
| --- | ------------------------------------ | ----------------------------------------------------------------------- | ------------- |
| CC  | [Claude Code — subagents][cc]        | Subagent file format, the frontmatter spec set,[^cc] invocation control | 2026-08-03    |
| BP  | [Skill authoring best practices][bp] | Description, conciseness, least-privilege, evaluation-first †           | 2026-07-04    |
| A2A | [Agent2Agent protocol][a2a]          | Remote-agent discovery plus task lifecycle and status updates           | 2026-07-17    |

[^cc]: Full set (16 fields, unchanged): `name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`, `maxTurns`, `skills`, `mcpServers`, `hooks`, `memory`, `background`, `effort`, `isolation`, `color`, `initialPrompt`. Model aliases now include `fable` (added since last review); `permissionMode` now accepts `manual` as alias for `default`.

† Description writing, conciseness, least-privilege, and evaluation-first — all applied to agents.

## Community / practitioner

| Tag  | Source                                          | Governs                            | Last reviewed |
| ---- | ----------------------------------------------- | ---------------------------------- | ------------- |
| COM1 | [awesome-claude-code-subagents (VoltAgent)][c1] | Example agent definitions (100+) ‡ | 2026-06-26    |
| COM2 | [Sub-agent best practices (PubNub)][c2]         | Production patterns §              | 2026-06-26    |

‡ Patterns for tool scoping, model routing, and description quality.

§ SubagentStop hooks, the skills+hooks+subagents trinity, and concurrent agent limits.

## In-house

| Tag   | Source                                                    | Governs                                   | Last reviewed |
| ----- | --------------------------------------------------------- | ----------------------------------------- | ------------- |
| HOUSE | The harness `subagents/README.md` + the role-prompt shape | Layout and the role/lane prompt pattern ¶ | 2026-08-03    |

¶ Grounding, lane disambiguation, and KB-note wikilinks.

## Last review

**REFRESH last run 2026-08-03** (previous: 2026-07-04). CC re-fetched live; HOUSE re-read in-repo. BP (403) and A2A (403) and COM1 (GitHub proxy-blocked) and COM2 (403) could not be re-fetched — carried from prior dates.

- **CC (Claude Code subagents docs):** re-fetched live 2026-08-03. Frontmatter field set **unchanged** — the 16-field set in FM-3 still stands (`name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`, `maxTurns`, `skills`, `mcpServers`, `hooks`, `memory`, `background`, `effort`, `isolation`, `color`, `initialPrompt`). **Notable behavioral updates since last review — evaluate impact on standard and rubric:**
  - **`model` now includes `fable` alias** (four aliases: `sonnet`, `opus`, `haiku`, `fable`). If FM-4 or standards enumerate the alias set, add `fable`.
  - **Background is now the default** (since v2.1.198): Claude runs subagents in the background by default; the `background` field now means "always background" (`true`) or "always foreground" (`false`). Previously it was "opt into background". FM-10 semantic note needs updating if it frames `background: true` as opt-in.
  - **`permissionMode: manual`** added as alias for `default` (since v2.1.200). If FM-6 or the rubric lists valid values, add `manual`.
  - **Names can't contain `:`** (since v2.1.218): `name` must use lowercase letters, numbers, and hyphens only — colons are now explicitly forbidden (reserved for plugin-scoped identifiers like `my-plugin:reviewer`). FM-1 name constraint should note this.
  - **`disallowedTools` now supports MCP patterns:** `mcp__<server>` or `mcp__<server>__*` remove all tools from a named server; `mcp__*` removes all MCP tools from any server.
  - **`/agents` command removed the interactive wizard** (v2.1.198): it now just prints a reminder to ask Claude or edit `.claude/agents/` directly. If PROC guidance references the wizard, retire that note.
  - **Extended thinking inheritance** (v2.1.198): subagents inherit the session's extended thinking setting (on/off).
  - **Background tool filter documented:** background subagents keep a specific subset of built-in tools; the spec now enumerates them explicitly.
  - Isolation improvements (v2.1.203, v2.1.210, v2.1.216): stricter `worktree` isolation checks for working-directory and `git -C`-style redirects.
  - LANE-3/LANE-4 (`Agent(type)` allowlist, depth limit) still documented and unchanged.
- **BP** (carried — 403 in proxy env): third-person description, caps (name ≤ 64, desc ≤ 1024), conciseness, least-privilege all unchanged as of 2026-07-04. Re-fetch next run.
- **A2A** (carried — 403 in proxy env): still watch-only; no local-subagent-file requirement imposed yet. Re-fetch next run.
- **COM1** (carried — proxy-blocked): reviewed 2026-06-26. Re-fetch next run.
- **COM2** (carried — proxy-blocked): reviewed 2026-06-26. Re-fetch next run.
- **HOUSE** (re-read 2026-08-03): `subagents/README.md` unchanged — 5 governance agents in `subagents/governance/`, same group: `ki-skills-lead`, `ki-engineering-lead`, `ki-kb-curator`, `ki-decision-author`, `ki-kb-streams-curator`. Directory structure, convention note, and the "name unique across whole tree" rule match prior review. No new agents added or removed.
- **Open watch-items:**
  - **CC behavioral changes (URGENT):** `fable` model alias, `background` default semantics, `manual` permissionMode alias, and name no-colon constraint should all be reflected in the standard and rubric criteria (FM-1, FM-4, FM-6, FM-10). Evaluate each and apply in the next CONFORM pass.
  - **Adjacent surfaces (agent-view / agent-teams).** Still watch-only — not yet part of the subagent-definition rubric scope.
  - **`SubagentStop`-hook enforcement (COM2).** FM-7 codifies the field; no live governance agent yet uses a scoped hook. Carry.
  - **BP/COM1/COM2 re-fetch:** all blocked by proxy in this scheduled run. Require a non-proxy session for the next re-fetch (target next monthly pass).

[cc]: https://code.claude.com/docs/en/sub-agents
[bp]: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
[a2a]: https://a2a-protocol.org/latest/
[c1]: https://github.com/VoltAgent/awesome-claude-code-subagents
[c2]: https://www.pubnub.com/blog/best-practices-for-claude-code-sub-agents/
