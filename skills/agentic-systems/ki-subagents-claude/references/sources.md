# Sources — Claude Code adapter

**Refresh:** external-spec · monthly

**Last reviewed:** 2026-09-14

The parent `ki-subagents` owns portable semantics. This adapter uses current Claude Code documentation only for native Markdown/YAML source claims. Candidate source shape does not establish publication or runtime behavior.

## Normative

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| CC | [Claude Code subagents](https://code.claude.com/docs/en/sub-agents) | Markdown/YAML source shape, required/supported fields, discovery, and runtime-only limits | 2026-09-14 |

## Local boundary

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| HOST | Harness host capability inspection recorded in the Round 25 packet | No generic subagent publisher consumes the advertised Claude path | 2026-08-12 |

## Last review

REFRESH last run **2026-09-14** (previous: 2026-08-12). Latest documented Claude Code version: v2.1.267+.

**Confirmed:**

- The field set is unchanged except for `experimental` (v2.1.248+), added to the standard. Its only documented key is `cacheTtl` (`5m` / `1h`); it is read from file source only, not from the CLI or plugin paths.
- Model resolution order is now formally documented: (1) per-invocation parameter, (2) subagent `model` frontmatter (`inherit` = caller's model), (3) `CLAUDE_CODE_SUBAGENT_MODEL` env var, (4) main conversation model. A `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1` override is also documented (does not override forks or skills with `model: inherit`).
- `bypassPermissions` isolation boundary: as of v2.1.267, a subagent no longer inherits `bypassPermissions` from the main conversation even when that conversation runs in that mode. Added to the standard's Supported fields section.
- Naming constraints (lowercase letters and hyphens only; digits and colons invalid) are unchanged.
- The current Harness host has no generic publisher consuming the subagent path; this adapter continues to report source conformance only.

**Open watch-items:**

- Monitor for any new `experimental` keys documented beyond `cacheTtl`.
- Monitor for host integration that activates publication or runtime execution, at which point publication/activation claims require separate evidence.
