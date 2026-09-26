# Sources — Claude Code adapter

**Refresh:** external-spec · monthly

**Last reviewed:** 2026-09-21

The parent `ki-subagents` owns portable semantics. This adapter uses current Claude Code documentation only for native Markdown/YAML source claims. Candidate source shape does not establish publication or runtime behavior.

## Normative

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| CC | [Claude Code subagents](https://code.claude.com/docs/en/sub-agents) | Markdown/YAML source shape, required/supported fields, discovery, and runtime-only limits | 2026-09-21 |

## Local boundary

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| HOST | Harness host capability inspection recorded in the Round 25 packet | No generic subagent publisher consumes the advertised Claude path | 2026-09-21 |

## Last review

2026-09-21 — Re-fetched live. Claude Code now documents two additional supported fields: `omitClaudeMd` (introduced v2.1.271, omits user/project/local CLAUDE.md at subagent launch) and `experimental` (introduced v2.1.248, supports `cacheTtl` for per-subagent prompt cache lifetime). Both added to the standard. All previously documented fields and skipping rules remain unchanged. The current Harness host still has no generic publisher consuming the subagent path; source conformance reporting only.
