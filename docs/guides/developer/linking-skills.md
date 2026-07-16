# Local skill linking for harness development

This is a developer workflow for working on a local checkout of the harness. It is not part of normal user installation: a person using the harness should start with [Install and get started](../user-guide/getting-started.md) and repository bootstrap.

Normal bootstrap and CONFORM publish generated regular-file copies into each selected project's runtime skill directory. They are self-contained, gitignored payloads that do not depend on this harness checkout remaining available.

This guide is only for harness authors who deliberately want live local edits: the explicit development command replaces those generated copies with symlinks into this checkout. Re-run the normal copier to return a project to the portable default.

## Link the small global development set

From this harness checkout:

```bash
bun run ki:skills:link:global
```

This links `ki-bootstrap`, `ki-recap`, `ki-plan`, and `ki-delegate` into the declared runtime locations. Claude Code uses `~/.claude/skills/`; Codex uses `~/.agents/skills/`. The command is re-runnable and refuses to clobber a real file or directory.

## Link a target repository's declared skills

The explicit development linker mirrors the skills declared in a target repository's `.ki-config.toml` into its runtime-local skills directory:

```bash
cd /path/to/target-repo
bun ~/.claude/skills/ki-bootstrap/scripts/link-skills.ts --development
```

On a Codex-only machine, invoke the same self-locating script from `~/.agents/skills/ki-bootstrap/` instead. Preview a change with `--dry-run`. The links are gitignored and generated; they are never committed into a target repository because they depend on the local harness checkout.

To restore portable copied payloads, run:

```sh
bun ~/.claude/skills/ki-bootstrap/scripts/copy-skills.ts
```

## Remove a development link

Remove only the link, never its source:

```bash
rm ~/.claude/skills/<name>
```

Start a new agent session after adding or removing a link so the runtime re-scans its skill directories.
