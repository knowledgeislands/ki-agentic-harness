# Local skill linking for harness development

This is a developer workflow for working on a local checkout of the harness. It is not part of normal user installation: a person using the harness should start with [Install and get started](../user-guide/installation.md) and repository bootstrap.

The current local-development model uses symlinks so changes in this checkout take effect immediately in selected runtime skill directories. The deferred runtime-portability work will make ordinary project skill delivery copied by default and retain explicit development linking only where it is useful; this guide describes today's live-link behaviour, not that future model.

## Link the small global development set

From this harness checkout:

```bash
bun run ki:skills:link:global
```

This links `ki-bootstrap`, `ki-recap`, `ki-plan`, and `ki-delegate` into the declared runtime locations. Claude Code uses `~/.claude/skills/`; Codex uses `~/.agents/skills/`. The command is re-runnable and refuses to clobber a real file or directory.

## Link a target repository's declared skills

The current linker mirrors the skills declared in a target repository's `.ki-config.toml` into its runtime-local skills directory:

```bash
cd /path/to/target-repo
bun ~/.claude/skills/ki-bootstrap/scripts/link-skills.ts
```

On a Codex-only machine, invoke the same self-locating script from `~/.agents/skills/ki-bootstrap/` instead. Preview a change with `--dry-run`. The links are gitignored and regenerated; they are never committed into a target repository because they depend on the local harness checkout.

## Remove a development link

Remove only the link, never its source:

```bash
rm ~/.claude/skills/<name>
```

Start a new agent session after adding or removing a link so the runtime re-scans its skill directories.
