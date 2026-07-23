# Local skill linking for harness development

This is a developer workflow for working on a local checkout of the harness. It is not part of normal user installation: a person using the harness should start with [Install and get started](../user/getting-started.md) and repository bootstrap.

Normal bootstrap and CONFORM publish generated regular-file copies into each ordinary project's runtime skill directory. A harness is different: bootstrap links its declared runtime skills to the canonical sources in that same checkout.

This guide covers the harness's automatic project-local links and the explicit user-global development links. A consumer remains copy-based.

## Normal global installation

Normal users install the six process and keystone skills as regular-file copies with the stable user route:

```bash
curl -fsSL https://knowledgeislands.info/harness/install | sh
```

The installer detects only two regular top-level user directories: `~/.claude/` for Claude Code and `~/.agents/` for the Agents/Codex skill surface. It installs `ki-bootstrap`, `ki-recap`, `ki-next`, `ki-plan`, `ki-delegate`, and `ki-repo-review` into every conformant matching user skill directory. Claude Code uses `~/.claude/skills/`; Agents/Codex uses `~/.agents/skills/`. It is re-runnable and refuses to clobber a real file or directory. Pass `--runtime claude-code` or `--runtime codex` to choose explicitly when required.

## Link the global development set

Harness authors can replace those six managed global copies with symlinks into this checkout:

```bash
bun run ki:skills:link:global
```

This is deliberately a local-checkout command, not a public route. It refuses a source without a local Git checkout and detects the same two runtime directories as normal installation. Pass `--runtime claude-code` or `--runtime codex` to force one runtime when needed. Check that the links still resolve to this checkout with:

```bash
bun run ki:skills:link:global -- --check
```

To restore portable regular-file copies, re-run the public install route above. Start a new agent session after changing global skill payloads.

## Harness project skills

When EDUCATE runs in a harness, bootstrap maintains links from its runtime skill locations to its canonical sources:

```bash
bun run ki:educate
```

The links are gitignored and generated; they are never committed because they depend on the local harness checkout. Bootstrap also links the harness's frontmatter-declared `scripts/vendored/` support payloads to their canonical providers. Ordinary repository bootstrap remains copy-based.

`ki-self` is different from both generated runtime payloads and harness development links: author its one committed source at `.ki/self/skill/SKILL.md`. Bootstrap projects relative links to that source in every declared runtime; do not create or commit a separate runtime copy.

Verify the selected development state with:

```bash
bun run ki:bootstrap:audit
```

Start a new agent session after adding or removing a link so the runtime re-scans its skill directories.
