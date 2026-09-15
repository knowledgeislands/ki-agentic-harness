---
name: ki-binding-codex
ki-kind: governance
ki-depends-on: [ki-binding]
ki-runtime-binding: true
ki-supported-runtimes: [chatgpt-codex]
ki-shared-dependencies: [ki-binding:binding, ki-skills:rubric]
description: >
  Audit or safely render KI-targeted MCP servers into Codex native `[mcp_servers]` without taking over
  unrelated configuration. Use for Codex MCP drift or rendering; `ki-binding` owns portable source and
  `ki-binding-claude` owns Claude surfaces.
argument-hint: 'audit [project] | conform [project] | help | educate [project] | refresh'
---

# Knowledge Islands Codex binding

This adapter composes `ki-binding` and owns only the native Codex TOML surface. `~/.codex/config.toml` is a live application file, so its merge boundary is Codex's own `codex mcp add` command, never a whole-file template or direct TOML rewrite.

## Operating modes

### Mode AUDIT

Run `ki-binding` first, then `ki repo audit --skill ki-binding-codex --repo <project>`. The adapter compares readable full non-secret definitions and leaves the merge-boundary decision visible for judgment. Missing or unreadable target evidence is unavailable; it never implies activation or runtime health.

### Mode CONFORM

Run AUDIT first. Preview with `bun skills/environment/ki-binding-codex/scripts/render-codex.ts --check [--source <path>]`, then run it without `--check`. The script adds only source servers targeting `chatgpt-codex` through the native CLI and leaves non-KI configuration untouched. Hosted activation is outside this adapter and routes to the coordinator.

### Mode EDUCATE

Explain the native TOML merge boundary without creating a second source.

### Mode REFRESH

Refresh only in `ki-agentic-harness` when Codex CLI MCP commands or TOML representation change. From an installed copy, stop and redirect to the canonical harness.

### Mode HELP

Explain this Codex adapter boundary and stop without changing anything.
