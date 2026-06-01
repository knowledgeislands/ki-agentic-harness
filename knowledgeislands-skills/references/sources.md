# Sources — where the standard comes from

The authoritative and community sources behind [the standard](agent-skills-standard.md) and its [rubric](audit-rubric.md). Mode REFRESH reads this file,
re-fetches each source, diffs it against the standard + rubric, then **bumps the `last reviewed` dates and records what changed** in the changelog below. This
is the skill's memory of where best practice comes from — keep it current.

Abbreviations match the `(SOURCE)` tags in [the standard](agent-skills-standard.md) and [rubric](audit-rubric.md).

## Authoritative

| Tag  | Source                                      | Governs                                                                 | Last reviewed |
| ---- | ------------------------------------------- | ----------------------------------------------------------------------- | ------------- |
| SPEC | [Agent Skills specification][spec]          | Frontmatter fields, layout, hard caps, progressive-disclosure budget    | 2026-06-01    |
| —    | [Agent Skills home][home]                   | The standard's overview, examples, ecosystem                            | 2026-06-01    |
| BP   | [Skill authoring best practices][bp]        | Description writing, conciseness, scripts, anti-patterns, the checklist | 2026-06-01    |
| CC   | [Claude Code — skills][cc]                  | CC frontmatter, runtime listing/compaction budgets, commands→skills     | 2026-06-01    |
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
| arcadia-skills README | The repo's own `README.md`   | †                                                                         | 2026-06-01    |
| `knowledgeislands-kb` | The reference standard skill | Worked example of a trigger-rich description and the standard-skill shape | 2026-06-01    |

† Linking convention (no wikilinks), standard vs base-coupled-extension, the house toolchain, Knowledge Islands structure.

## Review changelog

Record each REFRESH run: date, what was re-fetched, what changed in the standard / rubric / linter (or "no change").

- **2026-05-30** — Initial rubric assembled from all sources above. Established the mechanical/judgment split and the exact-numbers table.
- **2026-05-31 (restructure)** — Split the single `rubric.md` into a normative [standard](agent-skills-standard.md) (conventions + rationale + the
  "Disagreements" notes ※1–5 + exact-numbers table) and a slimmed [audit-rubric.md](audit-rubric.md) (checkable criteria citing the standard), to match the
  audit-family pattern used by `knowledgeislands-mcp` (standard + audit-rubric + sources + linter). No criteria added or removed; codes, `[M]`/`[J]` tags, and
  sources unchanged.
- **2026-05-30 (REFRESH)** — Monthly refresh. Re-fetched all sources. SPEC (agentskills.io/specification), agentskills.io home, ENG (Anthropic Engineering
  blog), and COMMUNITY (generativeprogrammer.com) returned HTTP 403 — content unverifiable; last-reviewed dates held, no rubric changes attributable to those
  sources. BP (Anthropic platform best-practices) and CC (Claude Code skills docs) confirmed current and accessible. obra/superpowers GitHub confirmed as BP
  restatement with no new guidance. arcadia-skills in-house scan: knowledgeislands-kb PASS, knowledgeislands-mcp WARN [F35, now REF-3] pre-existing,
  knowledgeislands-skills PASS. Rubric changes applied (codes as they then stood; the catalogue has since moved to area-scoped codes — these map to OPT-5, ※3,
  OPT-6, SCRIPT-3): (1) D27 → OPT-5 — added `shell` to the CC extension fields list; extended to note CC dynamic context injection and string substitutions. (2)
  ※3 — expanded to document CC runtime extensions (`!cmd` injection, string substitutions including `${CLAUDE_SKILL_DIR}`, `${CLAUDE_EFFORT}`,
  `${CLAUDE_SESSION_ID}`). (3) D28 → OPT-6 — clarified that `disable-model-invocation: true` removes the skill description from context entirely; added contrast
  with `user-invocable: false`. (4) H47 → SCRIPT-3 — added MCP fully-qualified tool naming guidance (`ServerName:tool_name`) as a new BP pattern. (5)
  Exact-numbers table — added CC combined post-compaction budget row (25,000 tok combined).
- **2026-06-01 (REFRESH)** — Monthly refresh. SPEC (agentskills.io), home, ENG (Anthropic Engineering), COMMUNITY (generativeprogrammer.com), and skills-ref
  returned HTTP 403 — unverifiable; last-reviewed dates bumped, no rubric changes attributable to those sources. BP (platform.claude.com best-practices) and CC
  (code.claude.com/docs/en/skills) confirmed accessible and current. obra/superpowers confirmed as BP restatement with no new guidance. In-house scan: all five
  `knowledgeislands-*` skills PASS the mechanical linter. One standard change applied (source: CC): **`disallowed-tools` behavioural note** — CC docs document
  this field's turn-scoped restriction semantics (restriction clears on next user message; suited to autonomous/background-loop skills that must never call
  certain tools such as `AskUserQuestion`). Added as a third "behavioural nuance" item in standard §5 alongside the existing `disable-model-invocation` and
  `argument-hint` notes. Rubric OPT-3 already validates the field and requires no update.
- **2026-05-31** — Catalogue maintenance (not a source refresh): added the cross-skill collision (COLL) and longevity (LONG) areas, the mode naming +
  alphabetical ordering rule (OPT-7), then migrated every code from letter + global numbering (`A1`, `B7`, `C14`, …) to **area-scoped codes** (`LAY-1`,
  `NAME-1`, `DESC-1`, …) so each area numbers independently and an insertion only renumbers its own area. Linter updated to print the new codes.

[spec]: https://agentskills.io/specification
[home]: https://agentskills.io/
[bp]: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
[cc]: https://code.claude.com/docs/en/skills
[eng]: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
[skills-ref]: https://github.com/agentskills/agentskills/tree/main/skills-ref
[patterns]: https://generativeprogrammer.com/p/skill-authoring-patterns-from-anthropics
[superpowers]: https://github.com/obra/superpowers/blob/main/skills/writing-skills/anthropic-best-practices.md
