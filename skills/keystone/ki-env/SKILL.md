---
name: ki-env
ki-kind: governance
ki-applicability: declaration-only
ki-guild: keystone
ki-leads: environment
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Lead the Environment guild: where agents run, the tools and access bound to them, the limits on their context,
  and the state agent hosts leave on a machine. Use to find the environment skill for MCP binding, context
  budgets or local housekeeping; each family's lead owns its portable rules and its runtime skills each agent
  host's delta.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | help | refresh'
---

# Environment

An environment is where an agent's work runs: the files, tools, access and limits it works with, in the sense of `ki-agentic-systems`' environment card. The Environment guild keeps what Knowledge Islands sets up there. Each concern is a family: a portable lead that holds the rules every runtime shares, and a runtime skill for each agent host that adds only its own delta. [The environment standard](references/standard-environment.md) holds the rules.

## Members

Start from a family's lead; it names its runtime skills.

- **`ki-env-binding`** for tools and access: the portable MCP inventory and its drift, with `ki-env-binding-claude`, `ki-env-binding-chatgpt` and `ki-env-binding-chezmoi` for each surface.
- **`ki-env-tokenomics`** for limits: context budgets, standing-surface attribution and model-purpose policy, with `ki-env-tokenomics-claude` and `ki-env-tokenomics-chatgpt`.
- **`ki-env-housekeeping`** for the state agent hosts leave: native memory, sessions, caches and storage, with `ki-env-housekeeping-claude` and `ki-env-housekeeping-chatgpt`.

## Boundaries

- **`ki-agentic-systems`** says what an environment, a machine and an agent host are.
- **`ki-acquire`** owns capturing a session's knowledge; housekeeping only inventories and cleans up.
- **`ki-repo-dotfiles-chezmoi`** owns the dotfiles repository the chezmoi binding renders into.

## Operating modes

For `help`, `-h`, `?` or no recognised mode, explain the guild, its families and where each concern starts, without changing anything; offer a mode choice only in an interactive session.

### Mode AUDIT

Run `ki repo audit --skill ki-env --repo <repo>`; the host checks the rubric publication. Then review the repository's environment declarations against [the standard](references/standard-environment.md): each concern reaches its family's lead, and each runtime skill adds only its runtime's delta.

### Mode CONFORM

Run AUDIT, then `ki repo conform --skill ki-env --repo <repo> --dry-run`. The host may regenerate the rubric publication; each family's own skills conform their own surfaces.

### Mode EDUCATE

Name the family for the concern in hand and its runtime skill for the agent host in use, and route anything outside the environment to its owner.

### Mode REFRESH

REFRESH writes only in the canonical `ki-agent-backpack` repository; from an installed copy, stop and redirect there. Read [the sources](references/sources.md), compare the families and their boundaries with the decisions they come from, then make and verify the smallest correction.
