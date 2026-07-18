# Getting Started

Start here when you want to use the harness. There are two different kinds of installation, and they intentionally do different things:

- **Repository bootstrap** gives one repository the checks and guidance it needs to govern itself. It writes only inside that repository.
- **User-environment installation** is optional machine setup. It writes under your home directory and is managed separately from any repository.

## Before you begin

Repository bootstrap needs [Bun](https://bun.sh). The [recommended tools](recommended-tools.md) guide covers optional machine-level tools: chezmoi manages user configuration, headroom-ai helps manage context, and mcporter provides a local MCP tool surface. Install only the tools that suit your environment; none of them are required merely to read this guide.

## Bootstrap a repository

From the repository you want to govern, run:

```bash
curl -fsSL https://knowledgeislands.info/harness/install | sh
```

This is a **zero-install** repository action. It downloads a temporary copy of the harness, builds the repository's `.ki-meta/` governance machinery, then removes the temporary source. It does not install skills globally, write Claude settings, or change another repository. The `main` in the URL is the harness branch being used; use the [bootstrap reference](onboarding.md) when you need a pinned revision, a different target, or fleet operation.

## Optionally install the Claude Code hook payload

Claude Code's Plan Mode and stale Git-lock hooks are a separate **user-environment** capability. Install their durable payload once for your user account with:

```bash
curl -fsSL https://raw.githubusercontent.com/knowledgeislands/ki-agentic-harness/main/skills/keystone/ki-bootstrap/scripts/install-hooks.sh | sh
```

This copies verified regular files below `~/.claude/hooks/knowledgeislands/ki-agentic-harness/`. The active manifest declares stable regular command copies at `current/plan-stamp.sh`, `current/plan-sync.sh`, and `current/git-lock-check.sh`; a user-environment manager consumes those declarations instead of a content-addressed directory name. It does not run repository bootstrap and it never writes `~/.claude/settings.json`. On a chezmoi-managed machine, chezmoi is responsible for registering the installed payload in Claude Code settings.

## Start using skills

Once a repository is governed, describe what you need in plain language or use a slash command. [Use skills](using-skills.md) explains both approaches.

For the detailed repository-bootstrap model, what `.ki-meta/` contains, and how to keep a repository current, continue to the [bootstrap reference](onboarding.md).
