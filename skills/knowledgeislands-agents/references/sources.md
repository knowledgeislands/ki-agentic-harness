# Sources — where the standard comes from

The sources behind [the standard](agent-definitions-standard.md) and its [rubric](audit-rubric.md). Mode REFRESH reads this file, re-fetches
each source, diffs it against the standard + rubric, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below
(what changed is recorded in the commit, not a changelog). This is the skill's memory of where best practice comes from — keep it current.

Abbreviations match the `(SOURCE)` tags in [the standard](agent-definitions-standard.md) and [rubric](audit-rubric.md).

## Authoritative

| Tag | Source                               | Governs                                                                                      | Last reviewed |
| --- | ------------------------------------ | -------------------------------------------------------------------------------------------- | ------------- |
| CC  | [Claude Code — subagents][cc]        | Subagent file format, frontmatter (`name`/`description`/`tools`/`model`/`color`), invocation | 2026-06-16    |
| BP  | [Skill authoring best practices][bp] | Description writing, conciseness, least-privilege, evaluation-first (applied to agents)      | 2026-06-16    |

## In-house

| Tag   | Source                                                 | Governs                                                                                 | Last reviewed |
| ----- | ------------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------- |
| HOUSE | The harness `agents/README.md` + the role-prompt shape | Layout, the role/lane prompt pattern, grounding, lane disambiguation, KB-note wikilinks | 2026-06-16    |

## Last review

This rubric was **seeded 2026-06-16** as the agents twin of `knowledgeislands-skills`, grounded in the Claude Code subagents docs and the
house role-prompt pattern (the six HNR Pillar agents). Run a full **REFRESH** to re-anchor the external source.

- **CC (Claude Code subagents docs):** the subagent format and the `name`/`description`/`tools`/`model`/`color` frontmatter as understood at
  seeding; not re-fetched this run — confirm field set and any invocation-control additions on the next REFRESH.
- **BP:** the skill-authoring best-practices applied to agents (third-person description, least-privilege, evaluation-first, no rot).
- **HOUSE:** the role/lane prompt shape — role + grounding + when-invoked + own-vs-defer + authoring conventions — and the rule that agent
  prompts **may** use `[[wikilinks]]` to KB notes (the deliberate divergence from the `SKILL.md` standard).
- **Open watch-items:** re-fetch the CC subagents docs on the first REFRESH and pin the exact supported frontmatter field set.

[cc]: https://code.claude.com/docs/en/sub-agents
[bp]: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
