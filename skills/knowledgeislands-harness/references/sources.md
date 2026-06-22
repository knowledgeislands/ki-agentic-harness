# Sources — knowledgeislands-harness

**Refresh:** external-spec · monthly

The tracked sources behind the harness standard. Provenance only: the record of _what changed_ lives in git (the REFRESH commit), not a
changelog here.

## Authoritative

| Tag  | Source                                                                  | Governs                                                                                                                                   | Last reviewed |
| ---- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| [AS] | [Agent Skills specification](https://agentskills.io/specification)      | The individual `SKILL.md` format the harness serves; the directory-name = `name:` constraint; `references/`, `scripts/`, `assets/` layout | 2026-06-21    |
| [CC] | [Claude Code subagent docs](https://code.claude.com/docs/en/sub-agents) | The subagent definition format the `agents/` part serves                                                                                  | 2026-06-21    |

## In-house

| Tag  | Source                                            | Governs                                                                                                         | Last reviewed |
| ---- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------- |
| [AH] | [arcadia-agentic-harness README](../../README.md) | The KI canonical reference implementation; all structure inferred from this repo                                | 2026-06-21    |
| [KR] | `knowledgeislands-repo` skill                     | The `.ki-config.toml` contract, coverage cascade, and what makes a KI-governed repo                             | 2026-06-21    |
| [KE] | `knowledgeislands-engineering` skill              | The enforcement framework (severity ladder, mode shape, checker contract); the common toolchain script families | 2026-06-21    |

## Last review

_Reviewed: 2026-06-21_

**Confirmed:**

- Agent Skills specification does not define a "harness" — the four-part structure, the `skills:link:project` install convention, and
  co-location intent are entirely a KI architectural convention. [AS] re-fetched: still no bundle/harness/container concept.
- The `SKILL.md` frontmatter (`name:`, `description:`, `argument-hint:`) and directory layout (`references/`, `scripts/`, `assets/`) are
  fully specified by [AS]; this skill adds no new SKILL.md requirements beyond those. The directory-name = `name:` constraint is unchanged.
- The subagent format (frontmatter, system-prompt body) is fully specified by [CC]; re-fetched, unchanged.
- The `.ki-config.toml` contract — including the `[knowledgeislands-harness]` table as the compliance marker — derives from
  `knowledgeislands-repo` [KR]; the harness skill does not extend the contract, it declares a new table.
- In-house reference [AH] re-read: the harness now holds **twelve** skills, the `agents/` and `mcp/` shelves remain valid empty shelves, and
  the eval suite covers eight of the twelve. The container the standard describes (four-part layout, the `harness:audit` and `agents:lint`
  scripts now wired in `package.json`, the `[knowledgeislands-harness]` table) matches current reality — the standard is count-agnostic and
  needs no edit for the 6→12 growth.

**Open watch-items:**

- [AS] — Monitor for any Agent Skills spec update that adds bundle/harness-level concepts. If agentskills.io formalises a multi-skill
  container, reconcile with this standard.
- [CC] — Monitor Claude Code release notes for any change to skill-install paths or the project-local skill-install convention.
