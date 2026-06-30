# skills

Knowledge Islands **Agent Skills** live here, one directory per skill. The **most-built-out part of the harness** today — **thirteen** skills, each a governance skill that holds a house standard and ships the universal **AUDIT / CONFORM / REFRESH** modes plus a mechanical checker.

## Convention

Each skill is a directory containing a `SKILL.md` (YAML frontmatter — `name` + `description` required — followed by a markdown body), per the [Agent Skills open standard](https://agentskills.io/specification). Longer detail goes in `references/`, executables in `scripts/`, templates in `assets/` — all loaded on demand. The **directory name is the skill's `name`**: lowercase, hyphenated, matching the `name:` frontmatter exactly, since agents discover a skill by `name`, not path.

Skill quality conforms to the **`knowledgeislands-skills`** standard (a sibling here) — run its AUDIT (`bun run ki:skills:lint`) before shipping. The container these skills sit in — this four-part `skills/` / `agents/` / `mcp/` / `evals/` harness — conforms to **`knowledgeislands-harness`**.

## Adding a skill

1. Scaffold `<name>/SKILL.md` (run `knowledgeislands-skills` Mode INIT), adding `references/` / `scripts/` / `assets/` only as needed.
2. Write to the rubric, not from memory; self-audit with `bun run ki:skills:lint <name>`.
3. Add it to the catalogue and the dependency-order sweep — see [docs/skills.md](../docs/skills.md).

The catalogue (what each skill does) is in [docs/skills.md](../docs/skills.md); how they fit together — boundaries, the knowledge loops, the shared principles — in [docs/design.md](../docs/design.md). Installed elsewhere by symlink via `bun run skills:link`.
