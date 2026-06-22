# Installing and using skills

How to install a skill from this repository, how a skill fires once installed, the linking convention inside a skill, and the development
toolchain for working in the repo.

## Installing skills

Claude Code (and compatible agents) discover skills in two places:

- **User-global** — `~/.claude/skills/<name>/`, available in every session on this machine.
- **Per-project** — `<project>/.claude/skills/<name>/`, available only when working in that project (and shareable via the project's repo).

The install model is **keystone-plus-project-local**: only `knowledgeislands-bootstrap` is installed user-global; every other skill is wired
into each repo's `.claude/skills/` on demand. The global skill is paid on every turn everywhere, so keeping one tiny keystone there —
instead of all thirteen — keeps the standing description cost out of unrelated sessions, while each repo still loads exactly the skills it
declares. Both ends use **symlinks**, so edits in this repo are live wherever a skill is installed and a `git pull` updates every consumer
at once. Install dependencies once with `bun install`.

### Install the keystone, once per machine

```bash
bun run skills:link:global    # symlink just knowledgeislands-bootstrap into ~/.claude/skills
```

Under the hood this is `bun scripts/sync-skills.ts link --only knowledgeislands-bootstrap`. It is idempotent: it refreshes the existing
link, skips a target where a _real_ file or directory is in the way (rather than clobbering it), and creates `~/.claude/skills` if needed.
With the keystone in place, any Knowledge Islands repo can self-wire from inside it.

### Wire a repo's project-local skills

In the repo you want to work in, the keystone links its `.claude/skills/` from the repo's `.ki-config.toml` — exactly the skills it declares
(`[knowledgeislands-*]` tables), plus the `knowledgeislands-repo` + `knowledgeislands-authoring` baseline:

```bash
bun run skills:link:project   # in the target repo: link .claude/skills/ from .ki-config.toml
```

These symlinks are **gitignored and regenerated** — the committed artifacts are the `skills:link:project` script and the `.gitignore` line,
never the links themselves (which would dangle on a clone that does not have the harness checked out beside it). Re-run after editing the
repo's coverage tables or pulling new skills. Preview with `--dry-run`; the harness itself authors every skill, so it links **all** of them
rather than a coverage subset (`--all`).

### Without the script (plain shell)

The keystone, user-global:

```bash
cd /path/to/arcadia-agentic-harness
ln -sfn "$PWD/skills/knowledgeislands-bootstrap" ~/.claude/skills/knowledgeislands-bootstrap
```

A single skill into a project, by hand:

```bash
cd /path/to/target-repo && mkdir -p .claude/skills
ln -sfn /path/to/arcadia-agentic-harness/skills/knowledgeislands-kb .claude/skills/knowledgeislands-kb
```

`ln -sfn` forces replacement of an existing link and never dereferences into a directory, so re-running it updates the link in place instead
of nesting a second link inside it. The link name must match the skill directory name (and the `name:` frontmatter).

### Verify and remove

```bash
ls -l ~/.claude/skills            # the keystone; confirm its -> target resolves
ls -l <repo>/.claude/skills       # a repo's project-local links; confirm they resolve
rm ~/.claude/skills/<name>        # uninstall: removes the link only, never the repo
```

Removing a symlink only unlinks it — the skill source in this repository is untouched. Start a new session after adding or removing a skill
so the agent re-scans the skills directory.

## Using a skill

Once a skill is installed, there is nothing to import or configure — the agent loads it on demand. There are two ways it fires:

- **By trigger (automatic)** — just describe the task in plain language. The agent matches your request against each skill's `description`
  (the part that says _when_ to use it) and loads the skill itself. "audit the m365 MCP against our standard" or "save this to my notes"
  will pull in the right skill without you naming it.
- **By slash command (explicit)** — type `/<skill-name>` to invoke it directly, optionally followed by arguments:
  `/knowledgeislands-mcp audit ~/kis/knowledgeislands/mcp-gmail`. Use this when you want to be certain which skill runs, or to pass a
  specific mode.

A skill that takes modes or arguments advertises them in its `argument-hint` frontmatter, shown as you type the slash command. For example
`knowledgeislands-mcp` lists `audit <repo> | conform <repo> | init <repo> | refresh` — the words before each `<...>` are the modes, and the
rest is what to pass. The arguments are a hint, not a parser: anything you type after the name reaches the skill as free text, so a
plain-language phrasing of the same request works equally well.

This is why per-skill usage is **not** repeated in each `SKILL.md` body: the `description` documents when a skill fires and the
`argument-hint` documents its modes, both machine-read at selection time. How to invoke _any_ skill — the slash-vs-trigger mechanics above —
is a property of Claude Code and lives here, once.

## Linking inside skills

Skills use **standard relative markdown links**, not Obsidian wikilinks, so they stay valid when relocated, symlinked, or shared. Link a
co-located file by relative path (`[ref](<references/Detail.md>)`); use the CommonMark angle-bracket form for paths containing spaces. Refer
to _another_ skill by its `name` (e.g. "the `knowledgeislands-kb` skill"), never by a file path — the other skill loads into the session
under that name and its location on disk is not stable.

## Development

This repository follows the Knowledge Islands house toolchain — itself codified in the `knowledgeislands-engineering` skill, which this repo
conforms to (`bun run engineering:audit .`): [Bun](https://bun.sh) as the package manager, [Biome](https://biomejs.dev) for the TypeScript
(the sync script, the per-skill checkers, the eval harness), and Prettier with markdownlint-cli2 for the markdown that makes up the skills.
A husky pre-commit hook runs `lint-staged` over changed files.

```bash
bun install        # install dev dependencies and wire the git hook
bun run lint:check # Biome lint/format check (TypeScript + JSON)
bun run lint:fix   # Biome, auto-fixing
bun run lint:md    # Prettier + markdownlint over all markdown
bun run lint:types # tsc --noEmit
bun run lint:package # syncpack: keep package.json sorted
bun run skills:lint  # audit every skill's mechanical criteria (knowledgeislands-skills rubric)
bun run eval         # advisory behavioural eval suite (see ../evals/)
```

`skills:lint` runs the mechanical half of the [`knowledgeislands-skills`](../skills/knowledgeislands-skills/SKILL.md) rubric over every
skill (frontmatter, naming, length caps, link resolution); the judgment half is applied by that skill when you ask it to audit one. Several
skills also expose a repo-level audit script — `engineering:audit`, `repo:audit`, `kb:audit`, `streams:audit`, `tokenomics:audit`,
`harness:audit` — that runs their mechanical checker over a target.
