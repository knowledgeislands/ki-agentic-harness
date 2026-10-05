---
name: ki-binding-claude
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: [ki-binding]
ki-runtime-binding: true
ki-supported-runtimes: [claude-code]
ki-shared-dependencies: [ki-binding:binding, ki-skills:rubric]
description: >
  Audit or safely conform Claude-native MCP configuration across Claude Code, Claude Desktop, and the claude.ai
  web convention. Use when Claude MCP surfaces drift; `ki-binding` owns portable source and `ki-binding-chatgpt`
  owns Codex.
argument-hint: 'audit [project] | conform [project] | help | educate [project] | refresh'
---

# Knowledge Islands Claude binding

This runtime adapter composes `ki-binding` and owns the Claude-specific delta: Claude Code and Desktop JSON definition comparison and the intentionally non-rendered claude.ai web convention. Source projection, registration, installation, activation, and runtime health are reported separately. Knowledge Islands maintains no Cowork plugin projection (`ADR-KI-HARNESS-015`).

## Operating modes

### Mode AUDIT

Run `ki repo audit --skill ki-binding-claude --repo <project>`. The host resolves and runs the declared `ki-binding` prerequisite first; the adapter then reports Code/Desktop evidence. Web has no local configuration and is a judgment-only convention.

### Mode CONFORM

Run AUDIT first. This skill claims no package script and writes no Claude-native file; registration, installation, activation, and runtime health require separate authorised evidence.

### Mode EDUCATE

Explain the Claude-only surface contract without creating a second MCP source.

### Mode REFRESH

Refresh only in `ki-agentic-harness` when Claude's JSON or web convention contracts change. From an installed copy, stop and redirect to the canonical harness.

### Mode HELP

Explain this Claude adapter boundary and stop without changing anything.
