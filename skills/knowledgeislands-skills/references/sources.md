# Sources — where the standard comes from

**Refresh:** external-spec · monthly

The authoritative and community sources behind [the standard](agent-skills-standard.md) and its [rubric](audit-rubric.md). Mode REFRESH
reads this file, re-fetches each source, diffs it against the standard + rubric, then **bumps the `last reviewed` dates** and refreshes the
`## Last review` block below (what changed is recorded in the commit, not a changelog). This is the skill's memory of where best practice
comes from — keep it current.

Abbreviations match the `(SOURCE)` tags in [the standard](agent-skills-standard.md) and [rubric](audit-rubric.md).

## Authoritative

| Tag  | Source                                      | Governs                                                                 | Last reviewed |
| ---- | ------------------------------------------- | ----------------------------------------------------------------------- | ------------- |
| SPEC | [Agent Skills specification][spec]          | Frontmatter fields, layout, hard caps, progressive-disclosure budget    | 2026-06-21    |
| —    | [Agent Skills home][home]                   | The standard's overview, examples, ecosystem                            | 2026-06-21    |
| BP   | [Skill authoring best practices][bp]        | Description writing, conciseness, scripts, anti-patterns, the checklist | 2026-06-21    |
| CC   | [Claude Code — skills][cc]                  | CC frontmatter, runtime listing/compaction budgets, commands→skills     | 2026-06-21    |
| ENG  | [Equipping agents with Agent Skills][eng] ※ | Rationale, progressive disclosure, evaluation-first, under-triggering   | 2026-06-21    |
| —    | [`skills-ref validate`][skills-ref]         | Mechanical baseline for frontmatter + naming (criteria B, C, D)         | 2026-06-21    |

※ Anthropic Engineering, 2025-12-18.

## Community

| Tag       | Source                                         | Governs                                                                 | Last reviewed |
| --------- | ---------------------------------------------- | ----------------------------------------------------------------------- | ------------- |
| COMMUNITY | [Skill Authoring Patterns][patterns]           | Distilled patterns: terminology, feedback loops, gotchas sections       | 2026-06-21    |
| COMMUNITY | [obra/superpowers writing-skills][superpowers] | Community restatement of the best-practices doc; convergent conventions | 2026-06-18    |

## In-house

| Tag                            | Source                       | Governs                                                                   | Last reviewed |
| ------------------------------ | ---------------------------- | ------------------------------------------------------------------------- | ------------- |
| arcadia-agentic-harness README | The repo's own `README.md`   | †                                                                         | 2026-06-21    |
| `knowledgeislands-kb`          | The reference standard skill | Worked example of a trigger-rich description and the standard-skill shape | 2026-06-21    |

† Linking convention (no wikilinks), standard vs base-coupled-extension, the house toolchain, Knowledge Islands structure.

## Last review

REFRESH last run **2026-06-21** against the tracked sources above. The four primary authoritative sources (SPEC, home, BP, CC) plus ENG and
COMMUNITY/patterns were re-fetched via WebFetch this run; `superpowers` (a community restatement of BP, confirmed unchanged at the source it
restates) carries its 2026-06-18 date. No drift: nothing in the standard, rubric, or linter changed.

- **SPEC (agentskills.io/specification):** accessible. Fields and constraints unchanged: `name` (required, 1–64 chars, lowercase
  letters/digits/hyphens, no leading/trailing/consecutive hyphen, matches directory), `description` (required, 1–1024 chars, non-empty),
  `license`, `compatibility` (1–500 chars), `metadata` (key-value map), `allowed-tools` (Experimental). Body budget restated as "< 5000
  tokens recommended", "under 500 lines", references "one level deep". No new fields, no deprecations.
- **Agent Skills home:** accessible; three-stage progressive disclosure (Discovery / Activation / Execution); the cross-platform client
  roster keeps growing (Junie, Gemini CLI, OpenCode, GitHub Copilot, Goose, Databricks, Laravel Boost, Tabnine, Qodo, TRAE, …) but the spec
  itself is unchanged.
- **BP (Anthropic platform best-practices):** accessible; full page fetched. No new guidance beyond the standard — confirms third-person
  description, < 500-line body, progressive disclosure, ToC > 100 lines, ≥ 3 evaluations, Haiku/Sonnet/Opus testing, forward-slash paths,
  one-default-with-escape-hatch, fully-qualified `ServerName:tool_name`, plan-validate-execute, justified constants, and the authoring
  checklist.
- **CC (Claude Code skills docs):** accessible; full frontmatter table confirms every CC-only field the standard lists (`when_to_use`,
  `argument-hint`, `arguments`, `disable-model-invocation`, `user-invocable`, `allowed-tools`, `disallowed-tools`, `model`, `effort`,
  `context`, `agent`, `hooks`, `paths`, `shell`). Confirms the 1,536-char `description`+`when_to_use` listing cap (~1% of context window,
  configurable via `skillListingBudgetFraction` / `SLASH_COMMAND_TOOL_CHAR_BUDGET` and `maxSkillDescriptionChars`), the post-compaction
  5,000-tok-per-skill / 25,000-tok combined budgets, and the commands→skills merge. New since last run is tooling/settings, not authoring
  standard: the `skill-creator` plugin eval loop and the `skillOverrides` visibility setting — neither changes a rubric criterion.
- **ENG (Anthropic Engineering blog):** accessible. Confirms the two required fields, the three-level progressive-disclosure model,
  evaluation-first authoring, and name/description as the trigger signal. Carries no numeric caps or line/token limits — cited for rationale
  only, as the standard does.
- **COMMUNITY (generativeprogrammer.com Skill Authoring Patterns):** accessible (page now dated April 2026). 14 named patterns including
  Known Gotchas and Autonomy Calibration; confirms the 1024 / 1536 caps, < 500 lines, ToC on long files, one-term terminology, third-person
  "pushy" descriptions, exclusion clauses, freedom-to-fragility, plan-validate-execute, and the `allowed-tools`-pre-approves-but-does-not-
  restrict note. Repeats the soft authoring trigger to begin splitting once SKILL.md passes ~300 lines — compatible with (and below) our
  500-line WARN; still not adopted as a separate cap.
- **`skills-ref` validator:** the `validate` CLI is documented but not the validator internals; the frontmatter + naming rules it enforces
  are fully specified on the SPEC page (which links skills-ref as the validator), so the mechanical baseline (NAME / DESC / OPT) is
  confirmed there.
- **In-house scan:** `bun run ki:skills:lint` — all **thirteen** `knowledgeislands-*` skills PASS for FAIL, 0 fail. One WARN (REF-3) on
  `knowledgeislands-mcp`'s own `sources.md` — out of scope for this skill's refresh.
- **No standard, rubric, or linter change this run.**
- **Open watch-items:** none outstanding. Next refresh, re-fetch `superpowers` directly (carried forward this run) and confirm the
  `skills-ref` validator source if its repo layout becomes fetchable, to verify the spec-documented rules against the implementation.

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
