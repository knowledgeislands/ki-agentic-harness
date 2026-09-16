---
name: ki-tokenomics-codex
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: [ki-tokenomics]
ki-runtime-binding: true
ki-supported-runtimes: [chatgpt-codex]
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Audit non-secret Codex repository evidence—configuration, AGENTS.md, skills, and custom agents—for portable
  tokenomics. Use `ki-tokenomics` for policy and `ki-tokenomics-claude` for Claude evidence; effective session
  state is outside this filesystem audit.
argument-hint: 'audit | conform | educate | refresh | help'
---

# Codex tokenomics

`ki-tokenomics-codex` composes `ki-tokenomics` with direct Codex filesystem observations from the selected repository only. It does not inspect user-home state, Claude state, arbitrary local caches, or undocumented local state.

The audit reports paths and structural presence only. It parses the selected trusted project TOML only to verify its shape and never reports values, including environment variables, API keys, headers, or credential-bearing configuration. Effective model/profile, loaded instruction hierarchy, active MCP, trust, memory use, transcript, compaction, billing, and tool-schema metrics are unavailable.

For dated source-local family evidence and the no-live-call evaluation protocol, read [the model-tier resolution standard](references/standards-model-tier-resolution.md).

It maps work roles to portable purposes without selecting an effective model; repository bindings remain advisory until separately authorised evaluation establishes a default.

CONFORM is report-only and emits no writes or commands.

## Composition

Run `ki-tokenomics` for portable configuration, budget semantics, and model purpose. Route MCP-server design to `ki-repo-mcp` and skill-description quality to `ki-skills`.

## Operating modes

### Mode AUDIT

→ Read [mode-audit.md](references/mode-audit.md)

### Mode CONFORM

→ Read [mode-conform.md](references/mode-conform.md)

### Mode EDUCATE

Declare this adapter only for repositories that support Codex; it scaffolds no runtime state.

### Mode REFRESH

→ Read [mode-refresh.md](references/mode-refresh.md)

Refresh only in `ki-agentic-harness`; from an installed copy, stop and redirect to the canonical harness.

### Mode HELP

Explain this Codex-only evidence boundary and stop without changing anything.
