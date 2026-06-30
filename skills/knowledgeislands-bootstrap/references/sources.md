# Sources — knowledgeislands-bootstrap

**Refresh:** canonical · on-change

Provenance only: the record of _what changed_ lives in git (the REFRESH commit), not a changelog here. This skill tracks no external spec — it is a Knowledge Islands install convention, re-anchored when the model it depends on changes (not on a clock).

## In-house

| Tag  | Source                               | Governs                                                             | Last reviewed |
| ---- | ------------------------------------ | ------------------------------------------------------------------- | ------------- |
| [KR] | `knowledgeislands-repo` skill        | The `.ki-config.toml` contract and the coverage cascade †           | 2026-06-22    |
| [KE] | `knowledgeislands-engineering` skill | The enforcement framework ‡; `skills:*` scripts                     | 2026-06-22    |
| [KH] | `knowledgeislands-harness` skill     | The four-part container and the skill-install convention §          | 2026-06-22    |
| [AH] | [README](../../README.md)            | The reference implementation; the authoring hub linked with `--all` | 2026-06-22    |

† The coverage cascade is the set of `[knowledgeislands-*]` tables the contract reads.

‡ Severity ladder, mode shape, checker contract.

§ This skill is the project-local counterpart of that convention.

## Watch-items

- **Claude Code skill discovery** — the project-local model assumes Claude Code loads `.claude/skills/` per session and `~/.claude/skills/` globally. If those discovery locations or precedence change, re-anchor the standard.
- **The coverage cascade [KR]** — if `knowledgeislands-repo` changes the `[knowledgeislands-*]` table contract or adds cascade-exempt universals beyond `authoring`, update the baseline/link-set rule in [the standard](bootstrap-standard.md) and `link-skills.ts`.
