# Sources — ki-repo-harness

**Refresh:** external-spec · monthly

The tracked sources behind [the compatible harness standard](standards-compatible-harness.md). Provenance only: the record of _what changed_ lives in git, not a changelog here.

## Authoritative

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| [AS] | [Agent Skills specification][as-spec] | The individual `SKILL.md` format the harness serves † | 2026-09-21 |
| [CC] | [Claude Code subagent docs][cc-subagents] | The subagent definition format the `subagents/` part serves | 2026-09-21 |

† Including the directory-name = `name:` constraint and the `references/`, `scripts/`, `assets/` layout.

## In-house

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| [AH] | [ki-agentic-harness README][ah-readme] | The KI canonical source-harness implementation § | 2026-09-21 |
| [CH] | [Compatible harness contract][compatible] | Installed identity, direct payload, capability, host, and activation boundaries | 2026-09-21 |
| [KR] | `ki-repo` skill | The `.ki.toml` contract and what makes a KI-governed repository | 2026-09-21 |
| [KS] | `ki-skills` skill | The governed-rubric family, session, and host boundary ‡ | 2026-09-21 |
| [KE] | `ki-engineering` skill | Development toolchain ownership outside compatible-harness installation semantics | 2026-09-21 |

§ Source layout and shelf practice are inferred from this repository; installed-payload policy comes from [CH].

‡ Catalogue shape, context/session ownership, generated publication, and direct host execution.

## Last review

_REFRESH last run **2026-09-21** (previous: 2026-08-12)._

**Confirmed:**

- [AS] re-fetched live: the spec still defines no bundle, harness, container, or multi-skill grouping concept. The `name`-matches-directory constraint holds. The optional frontmatter fields `compatibility`, `metadata`, and `allowed-tools` are now fully and formally documented in the spec (previously noted as "newly-documented" — open watch-item resolved). These remain a `ki-skills` concern to fold into the governed rubric; no change to the harness container standard.
- [CC] re-fetched live: Claude Code subagent docs now document `omitClaudeMd` (v2.1.271) and `experimental` (v2.1.248) as additional supported fields. The `ki-subagents-claude` standard has been updated. No change to the `subagents/` part of the harness contract.
- [AH] / [CH] re-read: the five-part source layout and the three-directory compatible payload remain as documented. No changes to ownership boundaries.
- [KR] / [KS] / [KE] re-read: boundaries unchanged.

**Open watch-items:**

- [AS] — Monitor for any spec update that adds harness-level concepts. `ki-skills` to fold in `compatibility`, `allowed-tools`, `metadata` into its governed rubric (flag carried forward).
- [CC] — Monitor Claude Code release notes for skill-install path or project-local convention changes.
- [CH] — Monitor host support for additional capability kinds. MCP servers and evals remain source shelves until compatible-payload contracts land.

[as-spec]: https://agentskills.io/specification
[cc-subagents]: https://code.claude.com/docs/en/sub-agents
[ah-readme]: ../../../../README.md
[compatible]: ../../../../docs/decisions/references/compatible-harness-contract.md
