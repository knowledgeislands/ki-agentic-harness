# Setup for ki-agentic-harness

How to install a skill from this repository, how a skill fires once installed, the linking convention inside a skill, and the development toolchain for working in the repo.

Two companion pages cover what this page assumes:

- **[Recommended tools](recommended-tools.md)** — the system-level dependencies (chezmoi, headroom-ai, mcporter, claude.ai connectors) that skills and MCP servers rely on. Get these in place first.
- **[Bootstrap](bootstrap.md)** — the keystone-plus-project-local mechanics that actually get a skill from this repo onto a machine and into a target repo: the install commands, plain-shell equivalents, and verify/remove.

Once a skill is installed per Bootstrap, this page covers how it's used day to day.

## Using a skill

Once a skill is installed, there is nothing to import or configure — the agent loads it on demand. There are two ways it fires:

- **By trigger (automatic)** — just describe the task in plain language. The agent matches your request against each skill's `description` (the part that says _when_ to use it) and loads the skill itself. "audit the m365 MCP against our standard" or "save this to my notes" will pull in the right skill without you naming it.
- **By slash command (explicit)** — type `/<skill-name>` to invoke it directly, optionally followed by arguments: `/ki-mcp audit ~/kis/knowledgeislands/mcp-gsuite`. Use this when you want to be certain which skill runs, or to pass a specific mode.

A skill that takes modes or arguments advertises them in its `argument-hint` frontmatter, shown as you type the slash command. For example `ki-mcp` lists `audit <repo> | conform <repo> | init <repo> | refresh` — the words before each `<...>` are the modes, and the rest is what to pass. The arguments are a hint, not a parser: anything you type after the name reaches the skill as free text, so a plain-language phrasing of the same request works equally well.

This is why per-skill usage is **not** repeated in each `SKILL.md` body: the `description` documents when a skill fires and the `argument-hint` documents its modes, both machine-read at selection time. How to invoke _any_ skill — the slash-vs-trigger mechanics above — is a property of Claude Code and lives here, once.

## Linking inside skills

Skills use **standard relative markdown links**, not Obsidian wikilinks, so they stay valid when relocated, symlinked, or shared. Link a co-located file by relative path (`[ref](<references/Detail.md>)`); use the CommonMark angle-bracket form for paths containing spaces. Refer to _another_ skill by its `name` (e.g. "the `ki-kb` skill"), never by a file path — the other skill loads into the session under that name and its location on disk is not stable.

## Development

This repository follows the Knowledge Islands house toolchain — itself codified in the `ki-engineering` skill, which this repo conforms to (`bun run ki:engineering:audit .`): [Bun](https://bun.sh) as the package manager, [Biome](https://biomejs.dev) for the TypeScript (the sync script, the per-skill checkers, the eval harness), and Prettier with markdownlint-cli2 for the markdown that makes up the skills. A husky pre-commit hook runs `lint-staged` over changed files.

```bash
bun install        # install dev dependencies and wire the git hook
bun run ki:lint:check # Biome lint/format check (TypeScript + JSON)
bun run ki:lint:fix   # Biome, auto-fixing
bun run ki:lint:md    # Prettier + markdownlint over all markdown
bun run ki:lint:types # tsc --noEmit
bun run ki:lint:package # syncpack: keep package.json sorted
bun run ki:skills:lint  # audit every skill's mechanical criteria (ki-skills rubric)
bun run ki:eval         # advisory behavioural eval suite (see ../evals/)
```

`ki:skills:lint` runs the mechanical half of the `ki-skills` rubric over every skill (frontmatter, naming, length caps, link resolution); the judgment half is applied by that skill when you ask it to audit one. Several skills also expose a repo-level audit script — `ki:engineering:audit`, `ki:repo:audit`, `ki:kb:audit`, `ki:kb-streams:audit`, `ki:tokenomics:audit`, `ki:harness:audit` — that runs their mechanical checker over a target.
