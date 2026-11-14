---
name: ki-env-housekeeping
ki-kind: governance
ki-applicability: declaration-only
ki-guild: environment
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Hold the housekeeping rules every agent host shares: an explicit native-memory policy, durable learning routed
  into reviewed guidance, read-only session sources, bounded evidence and separately authorised deletion. Use for
  portable housekeeping policy; `ki-env-housekeeping-claude` and `ki-env-housekeeping-chatgpt` own each host's state and
  `ki-acquire` session capture.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | help | refresh'
---

# Housekeeping

Agent hosts leave state on a machine: native memory, sessions, caches, plugins and storage. This skill leads the housekeeping family. It holds the rules every agent host shares, and each runtime skill depends on it and adds only its own host's surfaces and controls. [The housekeeping standard](references/standard-housekeeping.md) holds the shared rules.

## Runtime skills

- **`ki-env-housekeeping-claude`** for Claude Desktop, Cowork, Claude Code and VSCode state.
- **`ki-env-housekeeping-chatgpt`** for the ChatGPT local store and Codex memory and sessions.

## Boundaries

- **`ki-acquire`** owns capturing a session's knowledge; full-session import is an owner-selected exception there, never routine housekeeping.
- **`ki-env-tokenomics`** owns context budgets; **`ki-env-binding`** owns MCP configuration.
- **`ki-env`** leads the Environment guild this family belongs to.

## Operating modes

For `help`, `-h`, `?` or no recognised mode, explain the shared rules and route each agent host's state to its runtime skill, without reading or changing any state; offer a mode choice only in an interactive session.

### Mode AUDIT

Run `ki repo audit --skill ki-env-housekeeping-claude` or `ki repo audit --skill ki-env-housekeeping-chatgpt` for the host in use; each composes this skill first. Then review the evidence against [the shared rules](references/standard-housekeeping.md).

### Mode CONFORM

There is no shared conform action: each runtime skill proposes only the safe repairs its host allows, and deletion always needs separate, explicit authority. The host may regenerate this skill's rubric publication through `ki repo conform --skill ki-env-housekeeping --repo <repo> --dry-run`.

### Mode EDUCATE

Explain the native-memory policy values, where durable learning goes, and why session sources stay read-only, then name the runtime skill for the host in use.

### Mode REFRESH

REFRESH writes only in the canonical `ki-agent-backpack` repository; from an installed copy, stop and redirect there. Read [the sources](references/sources.md), compare the shared rules with both runtime skills' standards, move a rule here only when both hold it, then make and verify the smallest correction.
