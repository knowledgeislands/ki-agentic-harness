# Getting Started

There are two ordered steps to using the harness: install it once for your user account, then bootstrap each repository you want it to govern.

## Before you begin

Both steps need [Bun](https://bun.sh) to run the harness's mechanical checks.

The [recommended tools](recommended-tools.md) guide covers optional machine-level tools: chezmoi manages user configuration, headroom-ai helps manage context, and mcporter provides a local MCP tool surface.

## 1. Install the harness for your user account

Install the small, global process-skill set once:

```bash
curl -fsSL https://raw.githubusercontent.com/knowledgeislands/ki-agentic-harness/main/skills/keystone/ki-bootstrap/scripts/user-install.sh | sh
```

The stable public route for this command is `/harness/install`; until the website binding is published, the raw GitHub form above is the working source.

It copies `ki-bootstrap`, `ki-delegate`, `ki-next`, `ki-plan`, and `ki-recap` as regular files into the selected runtime's user skill directory.

For Claude Code, it also installs the durable Plan Mode and stale Git-lock hook payload below `~/.claude/hooks/knowledgeislands/ki-agentic-harness/`.

It does not bootstrap a repository, create development links, or write Claude Code settings.

On a chezmoi-managed machine, chezmoi reads the installed hook payload and is responsible for registering it in Claude Code settings.

## 2. Bootstrap a repository

From the repository you want to govern, either ask an installed agent to run `/ki-bootstrap`, or use the direct repository command:

```bash
curl -fsSL https://raw.githubusercontent.com/knowledgeislands/ki-agentic-harness/main/skills/keystone/ki-bootstrap/scripts/repo-bootstrap.sh | sh
```

The stable public route for this command is `/harness/bootstrap`; until the website binding is published, the raw GitHub form above is the working source.

Repository bootstrap downloads a temporary harness source, builds that repository's `.ki-meta/` governance machinery, publishes its project-local runtime skill copies, then removes the temporary source.

It writes only inside the target repository.

For pinned revisions, another target, or fleet operation, use the [bootstrap reference](onboarding.md).

## Start using skills

Once a repository is governed, describe what you need in plain language or use a slash command.

[Use skills](using-skills.md) explains both approaches.

For the detailed repository-bootstrap model, what `.ki-meta/` contains, and how to keep a repository current, continue to the [bootstrap reference](onboarding.md).
