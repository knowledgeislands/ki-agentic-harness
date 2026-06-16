# Sources — where the standard comes from

The authoritative and community sources behind [the standard](agent-skills-standard.md) and its [rubric](audit-rubric.md). Mode REFRESH
reads this file, re-fetches each source, diffs it against the standard + rubric, then **bumps the `last reviewed` dates** and refreshes the
`## Last review` block below (what changed is recorded in the commit, not a changelog). This is the skill's memory of where best practice
comes from — keep it current.

Abbreviations match the `(SOURCE)` tags in [the standard](agent-skills-standard.md) and [rubric](audit-rubric.md).

## Authoritative

| Tag  | Source                                      | Governs                                                                 | Last reviewed |
| ---- | ------------------------------------------- | ----------------------------------------------------------------------- | ------------- |
| SPEC | [Agent Skills specification][spec]          | Frontmatter fields, layout, hard caps, progressive-disclosure budget    | 2026-06-13    |
| —    | [Agent Skills home][home]                   | The standard's overview, examples, ecosystem                            | 2026-06-13    |
| BP   | [Skill authoring best practices][bp]        | Description writing, conciseness, scripts, anti-patterns, the checklist | 2026-06-13    |
| CC   | [Claude Code — skills][cc]                  | CC frontmatter, runtime listing/compaction budgets, commands→skills     | 2026-06-13    |
| ENG  | [Equipping agents with Agent Skills][eng] ※ | Rationale, progressive disclosure, evaluation-first, under-triggering   | 2026-06-01    |
| —    | [`skills-ref validate`][skills-ref]         | Mechanical baseline for frontmatter + naming (criteria B, C, D)         | 2026-06-01    |

※ Anthropic Engineering, 2025-12-18.

## Community

| Tag       | Source                                         | Governs                                                                 | Last reviewed |
| --------- | ---------------------------------------------- | ----------------------------------------------------------------------- | ------------- |
| COMMUNITY | [Skill Authoring Patterns][patterns]           | Distilled patterns: terminology, feedback loops, gotchas sections       | 2026-06-01    |
| COMMUNITY | [obra/superpowers writing-skills][superpowers] | Community restatement of the best-practices doc; convergent conventions | 2026-06-01    |

## In-house

| Tag                   | Source                       | Governs                                                                   | Last reviewed |
| --------------------- | ---------------------------- | ------------------------------------------------------------------------- | ------------- |
| arcadia-skills README | The repo's own `README.md`   | †                                                                         | 2026-06-13    |
| `knowledgeislands-kb` | The reference standard skill | Worked example of a trigger-rich description and the standard-skill shape | 2026-06-13    |

† Linking convention (no wikilinks), standard vs base-coupled-extension, the house toolchain, Knowledge Islands structure.

## Last review

REFRESH last run **2026-06-13** against the tracked sources above.

- **SPEC (agentskills.io/specification):** accessible this run. Fields and constraints unchanged: `name` (required, ≤64 chars, lowercase
  letters/digits/hyphens, no leading/trailing/consecutive hyphens, matches directory), `description` (required, ≤1024 chars), `license`,
  `compatibility` (≤500 chars), `metadata` (string→string map), `allowed-tools` (experimental). No new fields. The standard and rubric
  remain current.
- **Agent Skills home:** accessible; confirms broad adoption across many agent platforms (Cursor, GitHub Copilot, Gemini CLI, OpenCode,
  etc.) — no spec changes.
- **BP (Anthropic platform best-practices):** accessible; full page fetched. No new guidance beyond what the standard already covers.
  Confirms: third-person description, 500-line body limit, progressive disclosure, evaluation-first, feedback loops, avoid Windows-style
  paths, prefer one default with an escape hatch. All captured in the current standard and rubric.
- **CC (Claude Code skills docs):** accessible. Confirms custom commands merged into skills (already in standard note ※4). CC extensions
  (invocation control, subagent execution, dynamic context injection) unchanged. No new frontmatter fields.
- **ENG (Anthropic Engineering blog), COMMUNITY (generativeprogrammer.com), `skills-ref`:** not re-fetched this run — prior findings stand.
- **In-house scan:** `bun run skills:lint` — all six `knowledgeislands-*` skills PASS, 0 fail, 0 warn.
- **No standard or rubric change this run.**
- **Open watch-items:** re-attempt ENG, COMMUNITY (generativeprogrammer.com), and `skills-ref` sources next refresh.

(What past reviews changed in the standard / rubric / linter — the `disallowed-tools` behavioural note in §5, the CC runtime-extension
fields, MCP fully-qualified tool naming, the CC post-compaction budget row, the migration to area-scoped codes — is in git.)

[spec]: https://agentskills.io/specification
[home]: https://agentskills.io/
[bp]: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
[cc]: https://code.claude.com/docs/en/skills
[eng]: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
[skills-ref]: https://github.com/agentskills/agentskills/tree/main/skills-ref
[patterns]: https://generativeprogrammer.com/p/skill-authoring-patterns-from-anthropics
[superpowers]: https://github.com/obra/superpowers/blob/main/skills/writing-skills/anthropic-best-practices.md
