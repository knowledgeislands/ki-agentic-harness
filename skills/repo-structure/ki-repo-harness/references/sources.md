# Sources — ki-repo-harness

**Refresh:** external-spec · monthly

The tracked sources behind [the compatible harness standard](standards-compatible-harness.md). Provenance only: the record of _what changed_ lives in git, not a changelog here.

## Authoritative

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| [AS] | [Agent Skills specification][as-spec] | The individual `SKILL.md` format the harness serves † | 2026-09-14 |
| [CC] | [Claude Code subagent docs][cc-subagents] | The subagent definition format the `subagents/` part serves | 2026-09-14 |

† Including the directory-name = `name:` constraint and the `references/`, `scripts/`, `assets/` layout.

## In-house

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| [AH] | [ki-agentic-harness README][ah-readme] | The KI canonical source-harness implementation § | 2026-07-27 |
| [CH] | [Compatible harness contract][compatible] | Installed identity, direct payload, capability, host, and activation boundaries | 2026-07-27 |
| [KR] | `ki-repo` skill | The `.ki.toml` contract and what makes a KI-governed repository | 2026-07-27 |
| [KS] | `ki-skills` skill | The governed-rubric family, session, and host boundary ‡ | 2026-07-27 |
| [KE] | `ki-engineering` skill | Development toolchain ownership outside compatible-harness installation semantics | 2026-07-27 |

§ Source layout and shelf practice are inferred from this repository; installed-payload policy comes from [CH].

‡ Catalogue shape, context/session ownership, generated publication, and direct host execution.

## Last review

_REFRESH last run **2026-09-14** (previous: 2026-08-12)._

**Confirmed:**

- [AS] re-fetched live: still defines **no** bundle, harness, container, or multi-skill grouping concept. The `name` field must match the parent directory name. Optional frontmatter fields (`compatibility`, `allowed-tools`, `metadata`) remain unchanged. The spec now makes the consecutive-hyphen prohibition explicit ("Must not contain consecutive hyphens (`--`)"); this is a `ki-skills` frontmatter quality concern, not a harness container concern — the `ki-skills` optional-fields watch item should also note this constraint.
- [CC] re-fetched live: the subagent definition format (frontmatter `name` / `description` / `tools` / `model` + system-prompt body, project- and user-level install locations) is unchanged. The `experimental` field (object; `cacheTtl` key) was added in v2.1.248+. No structural change to the `subagents/` part of the harness contract.
- [CH] / [KR] / [KS] / [KE] in-house sources were not re-fetched this cycle; boundaries remain as confirmed in the 2026-08-12 review.

**Open watch-items:**

- [AS] — Monitor for any spec update adding bundle/harness-level concepts. The optional frontmatter fields (`compatibility`, `allowed-tools`, `metadata`) and the now-explicit consecutive-hyphen constraint are both `ki-skills` concerns — flag raised, not owned here.
- [CC] — Monitor Claude Code release notes for changes to skill-install paths, the project-local skill-install convention, or additional `experimental` keys.
- [CH] — Monitor host support for additional capability kinds. MCP servers and evals remain source shelves until their compatible-payload contracts land.

[as-spec]: https://agentskills.io/specification
[cc-subagents]: https://code.claude.com/docs/en/sub-agents
[ah-readme]: ../../../../README.md
[compatible]: ../../../../docs/decisions/references/compatible-harness-contract.md
