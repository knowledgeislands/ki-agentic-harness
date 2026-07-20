# Local skill linking for harness development

This is a developer workflow for working on a local checkout of the harness. It is not part of normal user installation: a person using the harness should start with [Install and get started](../user-guide/getting-started.md) and repository bootstrap.

Normal bootstrap and CONFORM publish generated regular-file copies into each selected project's runtime skill directory. They are self-contained, gitignored payloads that do not depend on this harness checkout remaining available.

This guide is only for harness authors who deliberately want live local edits. The harness has explicit commands for its source-checkout project and small user-global development sets. A consumer remains copy-based.

## Normal global installation

Normal users install the five process and keystone skills as regular-file copies with the stable user route:

```bash
curl -fsSL https://knowledgeislands.info/harness/install | sh
```

The installer detects only two regular top-level user directories: `~/.claude/` for Claude Code and `~/.agents/` for the Agents/Codex skill surface. It installs `ki-bootstrap`, `ki-recap`, `ki-next`, `ki-plan`, and `ki-delegate` into every conformant matching user skill directory. Claude Code uses `~/.claude/skills/`; Agents/Codex uses `~/.agents/skills/`. It is re-runnable and refuses to clobber a real file or directory. Pass `--runtime claude-code` or `--runtime codex` to choose explicitly when required.

## Link the global development set

Harness authors can replace those five managed global copies with symlinks into this checkout:

```bash
bun run ki:skills:link:global
```

This is deliberately a local-checkout command, not a public route. It refuses a source without a local Git checkout and detects the same two runtime directories as normal installation. Pass `--runtime claude-code` or `--runtime codex` to force one runtime when needed. Check that the links still resolve to this checkout with:

```bash
bun run ki:skills:link:global -- --check
```

To restore portable regular-file copies, re-run the public install route above. Start a new agent session after changing global skill payloads.

## Link this harness's declared project skills

The explicit development linker replaces this harness's marker-proven generated runtime skill copies with links to its canonical sources:

```bash
bun run ki:skills:link:project
```

The command operates only on its source harness checkout, so it accepts no target. Preview a change with `--dry-run`. The links are gitignored and generated; they are never committed because they depend on the local harness checkout. It deliberately leaves runtime agents and `.ki-meta/` untouched.

Verify the selected development state with:

```bash
bun run ki:skills:link:project -- --check
```

To restore portable copied payloads, run normal EDUCATE:

```sh
bun skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/repo-bootstrap.ts .
```

Start a new agent session after adding or removing a link so the runtime re-scans its skill directories.
