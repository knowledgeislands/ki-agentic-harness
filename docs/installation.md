# Installing and using skills

How to install a skill from this repository, how a skill fires once installed, the linking convention inside a skill, and the development toolchain for working in the repo.

## System dependencies

Two system-level components must be in place before the skills and MCP servers work correctly on a development machine. Both are installed via Homebrew and managed by chezmoi.

### headroom-ai

headroom-ai provides context compaction management (`PreCompact` hook) and shell-output compression via its bundled RTK component.

```bash
brew install headroom-ai
```

headroom-ai runs in one of two modes:

- **Proxy mode** — `headroom proxy` starts a local proxy on port 8787; Claude Code is pointed at it via `ANTHROPIC_BASE_URL=http://localhost:8787`.
- **Wrap mode** — `headroom claude` wraps the Claude CLI directly without a separate proxy process.

The harness CLAUDE.md notes which mode is active in the current machine's chezmoi config.

### mcporter (MCP proxy daemon)

mcporter consolidates all 19 KI-owned MCP servers behind a single keep-alive daemon and exposes them through a single HTTP MCP endpoint, reducing the `~/.claude.json` `mcpServers` block from 19 stdio entries to one URL entry.

```bash
brew install steipete/tap/mcporter
```

Two LaunchAgents are deployed and activated by chezmoi:

| LaunchAgent label         | Command                              | Purpose                                          |
| ------------------------- | ------------------------------------ | ------------------------------------------------ |
| `sh.mcporter.daemon`      | `mcporter daemon start --foreground` | Keep-alive process manager for all 19 servers    |
| `sh.mcporter.http-bridge` | `mcporter serve --http 3333`         | HTTP MCP endpoint at `http://localhost:3333/mcp` |

mcporter's config lives at `~/.mcporter/mcporter.json` (chezmoi-managed). It embeds full server definitions with `"lifecycle": "keep-alive"` for each server, resolved from the same `mcp-servers-json` chezmoi template that generates the Claude Desktop config.

After `chezmoi apply` loads the plists, activate them:

```bash
launchctl load ~/Library/LaunchAgents/sh.mcporter.daemon.plist
launchctl load ~/Library/LaunchAgents/sh.mcporter.http-bridge.plist
```

Tools are exposed as `server__tool` (double underscore). `~/.claude.json` should contain only a single `ki-mcporter` URL entry under `mcpServers`:

```json
"ki-mcporter": { "type": "url", "url": "http://localhost:3333/mcp" }
```

Verify with:

```bash
mcporter daemon status          # all 19 servers idle/running
curl http://localhost:3333/mcp  # should return a valid MCP JSON response
```

## Installing skills

Claude Code (and compatible agents) discover skills in two places:

- **User-global** — `~/.claude/skills/<name>/`, available in every session on this machine.
- **Per-project** — `<project>/.claude/skills/<name>/`, available only when working in that project (and shareable via the project's repo).

The install model is **keystone-plus-project-local**: only `ki-bootstrap` is installed user-global; every other skill is wired into each repo's `.claude/skills/` on demand. The global skill is paid on every turn everywhere, so keeping one tiny keystone there — instead of all eighteen — keeps the standing description cost out of unrelated sessions, while each repo still loads exactly the skills it declares. Both ends use **symlinks**, so edits in this repo are live wherever a skill is installed and a `git pull` updates every consumer at once. Install dependencies once with `bun install`.

### Install the keystone, once per machine

```bash
bun run ki:skills:link:global    # symlink just ki-bootstrap into ~/.claude/skills
```

Under the hood this is `bun scripts/sync-skills.ts link --only ki-bootstrap`. It is idempotent: it refreshes the existing link, skips a target where a _real_ file or directory is in the way (rather than clobbering it), and creates `~/.claude/skills` if needed. With the keystone in place, any Knowledge Islands repo can self-wire from inside it.

### Wire a repo's project-local skills

In the repo you want to work in, the keystone links its `.claude/skills/` from the repo's `.ki-config.toml` — exactly the skills it declares (`[ki-*]` tables), plus the `ki-repo` + `ki-authoring` baseline:

```bash
bun run ki:skills:link:project   # in the target repo: link .claude/skills/ from .ki-config.toml
```

These symlinks are **gitignored and regenerated** — the committed artifacts are the `ki:skills:link:project` script and the `.gitignore` line, never the links themselves (which would dangle on a clone that does not have the harness checked out beside it). Re-run after editing the repo's coverage tables or pulling new skills. Preview with `--dry-run`; the harness itself authors every skill, so it links **all** of them rather than a coverage subset (`--all`).

### Without the script (plain shell)

The keystone, user-global:

```bash
cd /path/to/ki-agentic-harness
ln -sfn "$PWD/skills/ki-bootstrap" ~/.claude/skills/ki-bootstrap
```

A single skill into a project, by hand:

```bash
cd /path/to/target-repo && mkdir -p .claude/skills
ln -sfn /path/to/ki-agentic-harness/skills/ki-kb-base .claude/skills/ki-kb-base
```

`ln -sfn` forces replacement of an existing link and never dereferences into a directory, so re-running it updates the link in place instead of nesting a second link inside it. The link name must match the skill directory name (and the `name:` frontmatter).

### Verify and remove

```bash
ls -l ~/.claude/skills            # the keystone; confirm its -> target resolves
ls -l <repo>/.claude/skills       # a repo's project-local links; confirm they resolve
rm ~/.claude/skills/<name>        # uninstall: removes the link only, never the repo
```

Removing a symlink only unlinks it — the skill source in this repository is untouched. Start a new session after adding or removing a skill so the agent re-scans the skills directory.

## Using a skill

Once a skill is installed, there is nothing to import or configure — the agent loads it on demand. There are two ways it fires:

- **By trigger (automatic)** — just describe the task in plain language. The agent matches your request against each skill's `description` (the part that says _when_ to use it) and loads the skill itself. "audit the m365 MCP against our standard" or "save this to my notes" will pull in the right skill without you naming it.
- **By slash command (explicit)** — type `/<skill-name>` to invoke it directly, optionally followed by arguments: `/ki-mcp audit ~/kis/knowledgeislands/mcp-gmail`. Use this when you want to be certain which skill runs, or to pass a specific mode.

A skill that takes modes or arguments advertises them in its `argument-hint` frontmatter, shown as you type the slash command. For example `ki-mcp` lists `audit <repo> | conform <repo> | init <repo> | refresh` — the words before each `<...>` are the modes, and the rest is what to pass. The arguments are a hint, not a parser: anything you type after the name reaches the skill as free text, so a plain-language phrasing of the same request works equally well.

This is why per-skill usage is **not** repeated in each `SKILL.md` body: the `description` documents when a skill fires and the `argument-hint` documents its modes, both machine-read at selection time. How to invoke _any_ skill — the slash-vs-trigger mechanics above — is a property of Claude Code and lives here, once.

## Linking inside skills

Skills use **standard relative markdown links**, not Obsidian wikilinks, so they stay valid when relocated, symlinked, or shared. Link a co-located file by relative path (`[ref](<references/Detail.md>)`); use the CommonMark angle-bracket form for paths containing spaces. Refer to _another_ skill by its `name` (e.g. "the `ki-kb-base` skill"), never by a file path — the other skill loads into the session under that name and its location on disk is not stable.

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

`ki:skills:lint` runs the mechanical half of the [`ki-skills`](../skills/ki-skills/SKILL.md) rubric over every skill (frontmatter, naming, length caps, link resolution); the judgment half is applied by that skill when you ask it to audit one. Several skills also expose a repo-level audit script — `ki:engineering:audit`, `ki:repo:audit`, `ki:kb-base:audit`, `ki:kb-streams:audit`, `ki:tokenomics:audit`, `ki:harness:audit` — that runs their mechanical checker over a target.
