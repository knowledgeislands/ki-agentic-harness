# Local skill linking for harness development

This is a developer workflow for working on a local checkout of the harness. It is not part of normal user installation: a person using the harness should start with [Install and get started](../user-guide/getting-started.md) and repository bootstrap.

Normal bootstrap and CONFORM publish generated regular-file copies into each selected project's runtime skill directory. They are self-contained, gitignored payloads that do not depend on this harness checkout remaining available.

This guide is only for harness authors who deliberately want live local edits. The harness has one explicit command for its small user-global development set, while `ki-repo` owns the command that links a target repository's declared skills. A consumer remains copy-based unless its author explicitly selects one of these modes.

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

## Link a target repository's declared skills

The explicit development linker mirrors the skills declared in a target repository's `.ki-config.toml` into its runtime-local skills directory:

```bash
bun /path/to/ki-agentic-harness/skills/keystone/ki-repo/scripts/link-repository-commands.ts /path/to/target-repo --development
```

The command must run from an active harness checkout so its links have a stable source. Preview a change with `--dry-run`. The links are gitignored and generated; they are never committed into a target repository because they depend on the local harness checkout. Add `--agents` only when deliberately linking the declared Claude Code governance agents as well.

Verify the selected development state with:

```bash
bun /path/to/ki-agentic-harness/skills/keystone/ki-repo/scripts/link-repository-commands.ts /path/to/target-repo --development --check
```

Without `--development`, the same checker instead verifies the normal copied-payload contract.

To restore portable copied payloads, run normal repository bootstrap:

```sh
curl -fsSL https://knowledgeislands.info/harness/bootstrap | sh
```

Start a new agent session after adding or removing a link so the runtime re-scans its skill directories.
