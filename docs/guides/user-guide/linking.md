# Bootstrapping the skill set

How a skill gets from this repo onto a development machine and into a target repo: the keystone-plus-project-local install model, the commands that wire it, and how to verify or remove a link. See [Recommended tools](recommended-tools.md) for the system-level dependencies (chezmoi, headroom-ai, mcporter) this assumes are already in place, and [Using a skill](installation.md) for how a skill fires once installed.

## Installing skills

Claude Code (and compatible agents) discover skills in two places:

- **User-global** — `~/.claude/skills/<name>/`, available in every session on this machine.
- **Per-project** — `<project>/.claude/skills/<name>/`, available only when working in that project (and shareable via the project's repo).

The install model is **keystone-plus-project-local**: only `ki-bootstrap` is installed user-global; every other skill is wired into each repo's `.claude/skills/` on demand. The global skill is paid on every turn everywhere, so keeping one tiny keystone there — instead of all of them — keeps the standing description cost out of unrelated sessions, while each repo still loads exactly the skills it declares. Both ends use **symlinks**, so edits in this repo are live wherever a skill is installed and a `git pull` updates every consumer at once. Install dependencies once with `bun install`.

### Install the keystone, once per machine

```bash
bun run ki:skills:link:global    # symlink just ki-bootstrap into ~/.claude/skills
```

Under the hood this is `bun skills/ki-bootstrap/scripts/sync-skills.ts link --only ki-bootstrap`. It is idempotent: it refreshes the existing link, skips a target where a _real_ file or directory is in the way (rather than clobbering it), and creates `~/.claude/skills` if needed. With the keystone in place, any Knowledge Islands repo can self-wire from inside it.

### Wire a repo's project-local skills

In the repo you want to work in, the keystone links its `.claude/skills/` from the repo's `.ki-config.toml` — exactly the skills it declares (`[ki-*]` tables), plus the `ki-repo` + `ki-authoring` baseline:

```bash
cd /path/to/target-repo
bun ~/.claude/skills/ki-bootstrap/scripts/link-skills.ts   # link .claude/skills/ from .ki-config.toml
```

The script is self-locating: invoked through the keystone's global symlink it resolves back into the harness checkout and links the sibling skills from there, so the target repo needs no `package.json` — a KB or any other non-TS repo runs it exactly the same way. (Inside the harness repo itself, `bun run ki:skills:link:project` is the `package.json` alias for the same script.)

These symlinks are **gitignored and regenerated** — the committed artifacts are the linking script and the `.gitignore` line, never the links themselves (which would dangle on a clone that does not have the harness checked out beside it). Re-run after editing the repo's coverage tables or pulling new skills. Preview with `--dry-run`; the harness itself authors every skill, so it links **all** of them rather than a coverage subset (`--all`).

### Without the script (plain shell)

The keystone, user-global:

```bash
cd /path/to/ki-agentic-harness
ln -sfn "$PWD/skills/ki-bootstrap" ~/.claude/skills/ki-bootstrap
```

A single skill into a project, by hand:

```bash
cd /path/to/target-repo && mkdir -p .claude/skills
ln -sfn /path/to/ki-agentic-harness/skills/ki-kb .claude/skills/ki-kb
```

`ln -sfn` forces replacement of an existing link and never dereferences into a directory, so re-running it updates the link in place instead of nesting a second link inside it. The link name must match the skill directory name (and the `name:` frontmatter).

### Verify and remove

```bash
ls -l ~/.claude/skills            # the keystone; confirm its -> target resolves
ls -l <repo>/.claude/skills       # a repo's project-local links; confirm they resolve
rm ~/.claude/skills/<name>        # uninstall: removes the link only, never the repo
```

Removing a symlink only unlinks it — the skill source in this repository is untouched. Start a new session after adding or removing a skill so the agent re-scans the skills directory.
