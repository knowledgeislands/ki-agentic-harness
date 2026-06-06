# Sources — where the standard comes from

The authoritative and community sources behind [the standard](agent-skills-standard.md) and its [rubric](audit-rubric.md). Mode REFRESH reads this file,
re-fetches each source, diffs it against the standard + rubric, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below (what
changed is recorded in the commit, not a changelog). This is the skill's memory of where best practice comes from — keep it current.

Abbreviations match the `(SOURCE)` tags in [the standard](agent-skills-standard.md) and [rubric](audit-rubric.md).

## Authoritative

| Tag  | Source                                      | Governs                                                                 | Last reviewed |
| ---- | ------------------------------------------- | ----------------------------------------------------------------------- | ------------- |
| SPEC | [Agent Skills specification][spec]          | Frontmatter fields, layout, hard caps, progressive-disclosure budget    | 2026-05-30    |
| —    | [Agent Skills home][home]                   | The standard's overview, examples, ecosystem                            | 2026-05-30    |
| BP   | [Skill authoring best practices][bp]        | Description writing, conciseness, scripts, anti-patterns, the checklist | 2026-05-30    |
| CC   | [Claude Code — skills][cc]                  | CC frontmatter, runtime listing/compaction budgets, commands→skills     | 2026-05-30    |
| ENG  | [Equipping agents with Agent Skills][eng] ※ | Rationale, progressive disclosure, evaluation-first, under-triggering   | 2026-05-30    |
| —    | [`skills-ref validate`][skills-ref]         | Mechanical baseline for frontmatter + naming (criteria B, C, D)         | 2026-05-30    |

※ Anthropic Engineering, 2025-12-18.

## Community

| Tag       | Source                                         | Governs                                                                 | Last reviewed |
| --------- | ---------------------------------------------- | ----------------------------------------------------------------------- | ------------- |
| COMMUNITY | [Skill Authoring Patterns][patterns]           | Distilled patterns: terminology, feedback loops, gotchas sections       | 2026-05-30    |
| COMMUNITY | [obra/superpowers writing-skills][superpowers] | Community restatement of the best-practices doc; convergent conventions | 2026-05-30    |

## In-house

| Tag                   | Source                       | Governs                                                                   | Last reviewed |
| --------------------- | ---------------------------- | ------------------------------------------------------------------------- | ------------- |
| arcadia-skills README | The repo's own `README.md`   | †                                                                         | 2026-05-30    |
| `knowledgeislands-kb` | The reference standard skill | Worked example of a trigger-rich description and the standard-skill shape | 2026-05-30    |

† Linking convention (no wikilinks), standard vs base-coupled-extension, the house toolchain, Knowledge Islands structure.

## Last review

REFRESH last run **2026-05-30** (monthly) against the tracked sources above.

- **Verified current:** BP (Anthropic platform best-practices) and CC (Claude Code skills docs); obra/superpowers confirmed as a BP restatement with no new
  guidance.
- **Could not verify:** SPEC (agentskills.io/specification), the agentskills.io home, ENG (Anthropic Engineering blog), and COMMUNITY (generativeprogrammer.com)
  returned HTTP 403 — `last reviewed` dates held, no rubric change attributed to them.
- **Open watch-items:** re-attempt the four 403 sources next refresh.

(What past reviews changed in the standard / rubric / linter — the CC runtime-extension fields, MCP fully-qualified tool naming, the CC post-compaction budget
row, the migration to area-scoped codes — is in git.)

[spec]: https://agentskills.io/specification
[home]: https://agentskills.io/
[bp]: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
[cc]: https://code.claude.com/docs/en/skills
[eng]: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
[skills-ref]: https://github.com/agentskills/agentskills/tree/main/skills-ref
[patterns]: https://generativeprogrammer.com/p/skill-authoring-patterns-from-anthropics
[superpowers]: https://github.com/obra/superpowers/blob/main/skills/writing-skills/anthropic-best-practices.md
