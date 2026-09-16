---
name: ki-subagents-codex
ki-kind: governance
ki-applicability: detected
ki-depends-on: [ki-subagents]
ki-runtime-binding: true
ki-supported-runtimes: [chatgpt-codex]
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Audit or write Codex TOML projections of approved portable KI subagent roles. Use for Codex-native agent
  source shape and fields; use `ki-subagents` for runtime-neutral role design and `ki-subagents-claude` for
  Claude Markdown/YAML.
argument-hint: 'audit | conform | educate | refresh | help'
---

# KI subagents — Codex adapter

## Runtime binding

This adapter owns the Codex standalone TOML projection of a role defined by `ki-subagents`: required `name`, `description`, and `developer_instructions`; Codex-supported source configuration keys; candidate source discovery; and native mechanics. It owns no portable role judgment.

Codex reads custom agent files from `.codex/agents/` or `~/.codex/agents/`, but the Harness host has no Codex subagent capability/path or generic publisher. This adapter may inspect an authorised candidate source payload only; publication, installation, activation, effective model/profile/MCP state, and execution are unavailable and must be routed to a future host/runtime integration.

## Operating modes

### Mode AUDIT

1. Run `ki-subagents` first to establish the portable role contract.
2. Inspect authorised candidate TOML source files for physical paths, parseable tables, required strings, and supported keys.
3. Report source evidence separately from all runtime claims. A pass never establishes that Codex discovered, selected, or ran an agent.

### Mode CONFORM

Repair only the authorised candidate source contract. Do not write `.codex/agents/`, user-home configuration, or host payload paths; no publisher currently exists.

### Mode EDUCATE

Explain the native TOML source boundary and host-unavailable status without publishing an agent.

### Mode REFRESH

**Precondition:** REFRESH writes only in the canonical `ki-agentic-harness` source checkout. From an installed copy, stop and route the source refresh to that Harness.

Re-read the official Codex Subagents documentation and refresh this adapter's native fields only. Keep portable semantics in the parent.

### Mode HELP

Explain the adapter, its source-only evidence, host routing, and modes, then stop.

## References

- [Codex source standard](references/standards-codex-subagents.md)
- [Rubric](references/rubric.md)
- [Sources](references/sources.md)
