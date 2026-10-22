---
name: ki-acquire
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Govern source-independent knowledge capture: supplied scope, honest coverage, faithful preservation, exact required
  originals, verified destinations and dispatch by Git move, with the capture package as the only record. Use for common
  acquisition rules; ki-acquire-chatgpt and ki-acquire-granola own their provider contracts.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | help | refresh'
---

# Knowledge acquisition

Read [the common acquisition standard](references/standards-acquisition.md), then the receiving repository's capture entry point and only the applicable source route. Keep capture simple: establish scope, find any existing capture, route, preserve, verify and report.

This skill owns the common capture contract; provider skills add source completeness and capability rules. Repository guides supply local paths, publication authority and environment steps. Knowledge Islands owns the durable lifecycle and rationale; tools-ki owns executable importers. The [generated rubric](references/rubric.md) holds the review criteria. This skill accepts no repository configuration properties.

For owner-selected Claude or Codex full-session capture, read [the agent-session acquisition guidance](references/standards-agent-session-acquisition.md). It owns exception-based session import; `ki-housekeeping-claude` and `ki-housekeeping-chatgpt` retain inventory, memory and cleanup.

## Operating modes

For `help`, `-h`, `?` or no recognised mode, explain the contract, modes and provider off-ramps without capturing anything; offer a mode choice only in an interactive session.

### Mode AUDIT

Run `ki repo audit --skill ki-acquire --repo <repo>`, then review supplied capture evidence against the standard. The mechanical audit does not prove fidelity; missing evidence stays a named gap. Do not contact a provider merely to complete an audit.

### Mode CONFORM

Run AUDIT, then `ki repo conform --skill ki-acquire --repo <repo> --dry-run`. The host may regenerate rubric publication. This mode does not choose routes, rewrite source bytes, publish captures or retire sources.

### Mode EDUCATE

Explain the common workflow and the repository's capture entry point, and route provider-specific completeness to its skill. Do not acquire content to demonstrate the contract.

### Mode REFRESH

REFRESH writes only in the canonical `ki-agentic-harness` repository; from an installed copy, stop and redirect there. Read [the sources](references/sources.md), compare the durable acquisition model and actual capture practice, then make and verify the smallest correction. Provider capability refresh stays with its provider skill.
