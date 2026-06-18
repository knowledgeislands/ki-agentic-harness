# Sources — where the standard comes from

The sources behind [the standard](agent-definitions-standard.md) and its [rubric](audit-rubric.md). Mode REFRESH reads this file, re-fetches
each source, diffs it against the standard + rubric, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below
(what changed is recorded in the commit, not a changelog). This is the skill's memory of where best practice comes from — keep it current.

Abbreviations match the `(SOURCE)` tags in [the standard](agent-definitions-standard.md) and [rubric](audit-rubric.md).

## Authoritative

| Tag | Source                               | Governs                                                                                 | Last reviewed |
| --- | ------------------------------------ | --------------------------------------------------------------------------------------- | ------------- |
| CC  | [Claude Code — subagents][cc]        | Subagent file format, the frontmatter spec set,[^cc] invocation control                 | 2026-06-18    |
| BP  | [Skill authoring best practices][bp] | Description writing, conciseness, least-privilege, evaluation-first (applied to agents) | 2026-06-18    |

[^cc]:
    Full set: `name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`, `maxTurns`, `skills`, `mcpServers`, `hooks`,
    `memory`, `background`, `effort`, `isolation`, `color`, `initialPrompt`.

## In-house

| Tag   | Source                                                 | Governs                                                                                 | Last reviewed |
| ----- | ------------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------- |
| HOUSE | The harness `agents/README.md` + the role-prompt shape | Layout, the role/lane prompt pattern, grounding, lane disambiguation, KB-note wikilinks | 2026-06-18    |

## Last review

Full **REFRESH 2026-06-18** — the external sources (CC subagents docs, BP best-practices) were re-fetched and diffed against the standard +
rubric; the prior open watch-item (pin the exact supported frontmatter field set) is **closed**.

- **CC (Claude Code subagents docs):** re-fetched 2026-06-18. The **supported-frontmatter table** now pins **15 fields**, only `name` and
  `description` required: `name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`, `maxTurns`, `skills`, `mcpServers`,
  `hooks`, `memory`, `background`, `effort`, `isolation`, `color`, plus `initialPrompt` (and `prompt` = the body on the `--agents` CLI
  path). `model` aliases are `sonnet`/`opus`/`haiku`/`fable`, a full id, or `inherit` (the default when omitted). `tools` is an allowlist;
  `disallowedTools` a denylist applied first; both accept `mcp__<server>` patterns and `tools` accepts `Agent(type)` spawn-allowlists. The
  subagent `name` rule on this page is only "lowercase letters and hyphens, unique" — the length/XML/reserved-word caps in our rubric come
  from the BP skills spec, carried for consistency. No deprecations. Our standard documented only 5 of these fields → expansion applied
  (§5/§8, FM-2/FM-3/FM-4).
- **BP:** re-fetched 2026-06-18. Unchanged in substance — third-person description, `name` ≤ 64 / charset / no reserved words,
  concise-is-key, least-privilege, evaluation-first (≥ 3 evals; test on Haiku/Sonnet/Opus), no time-sensitive content. Adds the
  proactive-delegation idiom ("use proactively") noted in §4.
- **HOUSE:** re-read 2026-06-18 (no external fetch). The role/lane prompt shape and the KB-wikilink divergence stand. The repo-root
  `agents/` shelf is still empty (only `README.md`); the linter reports a clean empty pass. The README's inline field list was expanded to
  match §5.
- **Open watch-items:** decide which of the nine newly-pinned fields the house actually adopts vs merely tolerates (FM-3 must not
  false-positive on tolerated ones); keep `permissionMode` and `disallowedTools` in view as least-privilege levers as the agent set grows.

[cc]: https://code.claude.com/docs/en/sub-agents
[bp]: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
