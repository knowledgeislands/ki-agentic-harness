# Sources — where the standard comes from

**Refresh:** external-spec · monthly

The sources behind [the standard](agent-definitions-standard.md) and its [rubric](audit-rubric.md). Mode REFRESH reads this file, re-fetches
each source, diffs it against the standard + rubric, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below
(what changed is recorded in the commit, not a changelog). This is the skill's memory of where best practice comes from — keep it current.

Abbreviations match the `(SOURCE)` tags in [the standard](agent-definitions-standard.md) and [rubric](audit-rubric.md).

## Authoritative

| Tag | Source                               | Governs                                                                                 | Last reviewed |
| --- | ------------------------------------ | --------------------------------------------------------------------------------------- | ------------- |
| CC  | [Claude Code — subagents][cc]        | Subagent file format, the frontmatter spec set,[^cc] invocation control                 | 2026-06-21    |
| BP  | [Skill authoring best practices][bp] | Description writing, conciseness, least-privilege, evaluation-first (applied to agents) | 2026-06-21    |

[^cc]:
    Full set: `name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`, `maxTurns`, `skills`, `mcpServers`, `hooks`,
    `memory`, `background`, `effort`, `isolation`, `color`, `initialPrompt`.

## In-house

| Tag   | Source                                                 | Governs                                                                                 | Last reviewed |
| ----- | ------------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------- |
| HOUSE | The harness `agents/README.md` + the role-prompt shape | Layout, the role/lane prompt pattern, grounding, lane disambiguation, KB-note wikilinks | 2026-06-21    |

## Last review

**REFRESH 2026-06-21 — no drift.** The external sources (CC subagents docs, BP best-practices) were re-fetched and diffed against the
standard + rubric; the in-house sources re-read. Nothing in the standard, rubric, or linter needed a substantive change — a
confirmed-current date bump. The prior watch-item (which of the pinned fields the house adopts vs tolerates) stands open but un-actioned:
the shelf is still empty, so there is nothing yet to over-/under-tolerate.

- **CC (Claude Code subagents docs):** re-fetched 2026-06-21. The **supported-frontmatter table** still pins the **16-field set** our FM-3
  enumerates verbatim — `name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`, `maxTurns`, `skills`, `mcpServers`,
  `hooks`, `memory`, `background`, `effort`, `isolation`, `color`, `initialPrompt` (plus `prompt` = the body on the `--agents` CLI path).
  Only `name`/`description` required; `model` defaults to `inherit`. No new field, no deprecation. `tools`/`disallowedTools` semantics
  (denylist-first, `mcp__<server>` patterns, `Agent(type)` spawn-allowlist), the `permissionMode` value set + `bypassPermissions` caveat,
  and the "use proactively" / "use immediately after…" idiom all match §4/§5/§8 unchanged. New **surface** on the page — forked subagents
  (`fork` / `CLAUDE_CODE_FORK_SUBAGENT`), nested subagents (fixed depth-5 limit), and `SendMessage` resume — concerns spawning/runtime, not
  the definition file's frontmatter or prompt shape this skill governs, so it touches no criterion (see watch-items).
- **BP:** re-fetched 2026-06-21. Unchanged in substance — third-person description, `name` ≤ 64 / charset / no reserved words,
  concise-is-key, least-privilege, evaluation-first (≥ 3 evals; test on Haiku/Sonnet/Opus), no time-sensitive content. The
  proactive-delegation idiom stays carried in §4.
- **HOUSE:** re-read 2026-06-21 (no external fetch). The role/lane prompt shape and the KB-wikilink divergence stand. The repo-root
  `agents/` shelf is still empty (only `README.md`, whose field list already matches §5); the linter reports a clean empty pass.
- **Open watch-items:** (1) decide which pinned fields the house adopts vs merely tolerates once real agents land (FM-3 must not
  false-positive on tolerated ones); keep `permissionMode` / `disallowedTools` in view as least-privilege levers as the set grows. (2) The
  spawning/runtime surface (forks, nested subagents, `SendMessage` resume) is out of this skill's scope today, but if the house starts
  shipping coordinator agents that spawn others, revisit whether `tools: Agent(type)` spawn-allowlists deserve a dedicated FM/LANE
  criterion.

[cc]: https://code.claude.com/docs/en/sub-agents
[bp]: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
