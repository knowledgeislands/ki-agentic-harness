# Sources — where the rubric comes from

The authoritative and community sources behind [the rubric](rubric.md). Mode C (REFRESH) reads this file, re-fetches each source, diffs it against the rubric, then **bumps the `last reviewed` dates and records what changed** in the changelog below. This is the skill's memory of where best practice comes from — keep it current.

Abbreviations match the `(SOURCE)` tags in [the rubric](rubric.md).

## Authoritative

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| SPEC | [Agent Skills specification](https://agentskills.io/specification) | Frontmatter fields, layout, hard caps, progressive-disclosure budget | 2026-05-30 |
| — | [Agent Skills home](https://agentskills.io/) | The standard's overview, examples, ecosystem | 2026-05-30 |
| BP | [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) | Description writing, conciseness, scripts, anti-patterns, the checklist | 2026-05-30 |
| CC | [Claude Code — skills](https://code.claude.com/docs/en/skills) | CC frontmatter, runtime listing/compaction budgets, commands→skills | 2026-05-30 |
| ENG | [Equipping agents with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) † | Rationale, progressive disclosure, evaluation-first, under-triggering | 2026-05-30 |
| — | [`skills-ref validate`](https://github.com/agentskills/agentskills/tree/main/skills-ref) | Mechanical baseline for frontmatter + naming (criteria B, C, D) | 2026-05-30 |

† Anthropic Engineering, 2025-12-18.

## Community

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| COMMUNITY | [Skill Authoring Patterns](https://generativeprogrammer.com/p/skill-authoring-patterns-from-anthropics) | Distilled patterns: terminology, feedback loops, gotchas sections | 2026-05-30 |
| COMMUNITY | [obra/superpowers writing-skills](https://github.com/obra/superpowers/blob/main/skills/writing-skills/anthropic-best-practices.md) | Community restatement of the best-practices doc; convergent conventions | 2026-05-30 |

## In-house

| Tag                   | Source                       | Governs                                                                                                                 | Last reviewed |
| --------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------- |
| arcadia-skills README | The repo's own `README.md`   | Linking convention (no wikilinks), standard vs base-coupled-extension, the house toolchain, Knowledge Islands structure | 2026-05-30    |
| `knowledgeislands-kb` | The reference standard skill | Worked example of a trigger-rich description and the standard-skill shape                                               | 2026-05-30    |

## Review changelog

Record each REFRESH run: date, what was re-fetched, what changed in the rubric/linter (or "no change").

- **2026-05-30** — Initial rubric assembled from all sources above. Established the mechanical/judgment split and the exact-numbers table.
