# Getting Started

There are two ordered steps to using the harness: install it once for your user account, then bootstrap each repository you want it to govern.

## Before you begin

Both steps need [Bun](https://bun.sh) to run the harness's mechanical checks.

The [recommended tools](recommended-tools.md) guide covers optional machine-level tools: chezmoi manages user configuration, headroom-ai helps manage context, and mcporter provides a local MCP tool surface.

## 1. Install the harness for your user account

Install the small, global process-skill set once:

```bash
curl -fsSL https://knowledgeislands.info/harness/install | sh
```

`/harness/install` is the stable public route. Its implementation may change without changing the command you use.

The installer supports only two regular top-level user directories: `~/.claude/` for Claude Code and `~/.agents/` for the Agents/Codex skill surface. When either conformant directory is present, it copies `ki-bootstrap`, `ki-delegate`, `ki-next`, `ki-plan`, and `ki-recap` as regular files into its user skill directory.

When neither runtime directory exists, pass `--runtime claude-code` or `--runtime codex` to choose one explicitly.

For Claude Code, it also installs the durable Plan Mode and stale Git-lock hook payload below `~/.claude/hooks/knowledgeislands/ki-agentic-harness/`.

It does not bootstrap a repository, create development links, or write Claude Code settings.

On a chezmoi-managed machine, chezmoi reads the installed hook payload and is responsible for registering it in Claude Code settings.

## 2. Bootstrap a repository

From the repository you want to govern, either ask an installed agent to run `/ki-bootstrap`, or use the direct repository command:

```bash
curl -fsSL https://knowledgeislands.info/harness/bootstrap | sh
```

`/harness/bootstrap` is the stable public route. Its implementation may change without changing the command you use.

Repository bootstrap downloads a temporary harness source, builds that repository's `.ki-meta/` governance machinery, publishes its project-local runtime skill copies, then removes the temporary source.

It writes only inside the target repository.

### Bootstrap a repository fleet

If your repositories are registered with [`mgit`](https://github.com/knowledgeislands/tools-mgit), run the same bootstrap across the fleet from its container directory:

```bash
mgit -B sh -c 'curl -fsSL https://knowledgeislands.info/harness/bootstrap | sh'
```

`-B` runs the supplied command inside each registered repository, and `sh -c` provides the shell needed for the pipe. Review and commit each repository's generated changes separately.

For pinned revisions, another target, or more fleet detail, use the [bootstrap reference](onboarding.md).

## Start using skills

Once a repository is governed, describe what you need in plain language or use a slash command.

[Use skills](using-skills.md) explains both approaches.

For the detailed repository-bootstrap model, what `.ki-meta/` contains, and how to keep a repository current, continue to the [bootstrap reference](onboarding.md).
