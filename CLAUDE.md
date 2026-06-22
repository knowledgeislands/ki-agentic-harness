# CLAUDE.md — arcadia-agentic-harness

Always-loaded orientation for an agent working in this repo. The README is the entry point; the full picture is in the [docs/](docs/) it
indexes — what each skill is, the map, the boundaries. The forward view is in [ROADMAP.md](ROADMAP.md). This file is the short anchor.

## What this repo is

The canonical home for the Knowledge Islands **Agent Skills** (per the [Agent Skills standard](https://agentskills.io/)). The
`knowledgeislands-*` skills are **governance skills**: each holds a house standard and ships the universal **AUDIT / CONFORM / REFRESH**
modes plus a mechanical checker. They sit in two layers plus a container governor and an install keystone — foundations (`authoring`,
`engineering`), domain skills (`kb`, `streams`, `mcp`, `repo`, `skills`, `agents`, `tokenomics`, and the website pair), `harness` (governs
the four-part bundle), and `bootstrap` (the one globally-installed skill, which wires each repo's project-local `.claude/skills/` from its
`.ki-config.toml`) — mapped in the README.

## How skills relate — composition only

Skills relate to one another by **composition**, never a base-coupled extension: a skill runs a sibling's checker/mode **in sequence** and
adds its own delta (it never imports another, so each stays valid installed standalone), and **declares the edge** in its AUDIT mode. What a
base or repo needs differently is **declared, not forked** — data in its `.ki-config.toml` table (read validate-down), prose in its
`CLAUDE.md` — never a `<base>-*` skill that takes the shared modes. See the _Composition only_ principle in [docs/design.md](docs/design.md)
and the `knowledgeislands-skills` rubric (SHAPE-2).

## Working here

- **Writing or editing a `SKILL.md`** → follow the `knowledgeislands-skills` rubric: run `bun run skills:lint` (the mechanical half) and
  apply the judgment half by reading. The directory name **is** the `name:` frontmatter.
- **Markdown / TOML style** → the `knowledgeislands-authoring` conventions; `bun run lint:md` is the mechanical gate. Wide tables →
  footnotes; relative markdown links, never wikilinks; refer to another skill by its `name`, never a file path.
- **The toolchain** (package.json scripts, `tsconfig`, `biome`) → the `knowledgeislands-engineering` standard, which this repo itself
  conforms to (`bun run engineering:audit .`).
- A change touching a standard another skill cites is **cross-skill** — keep the set internally consistent (the skills linter's cross-skill
  pass flags collisions).

## Toolchain

[Bun](https://bun.sh) for install/dev; `bun install` wires the husky pre-commit hook.

```bash
bun run lint:check     # Biome (TypeScript + JSON)
bun run lint:types     # tsc --noEmit
bun run lint:md        # Prettier + markdownlint over Markdown (writes)
bun run lint:md:check  # the check-mode twin (the CI Markdown gate)
bun run skills:lint           # audit every skill's mechanical criteria
bun run skills:link:global    # install the bootstrap keystone into ~/.claude/skills
bun run skills:link:project   # wire this repo's project-local skills from .ki-config.toml (--all here)
```
