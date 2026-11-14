---
name: ki-acquire
ki-kind: governance
ki-applicability: declaration-only
ki-guild: keystone
ki-leads: acquire
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Lead the Acquire guild and govern source-independent knowledge capture and curation: supplied scope, honest
  coverage, faithful lean preservation, verified destinations, incremental curation into a staging knowledge graph,
  with the transient capture package as the only record. Use for common acquisition or curation rules, and for
  `pulse`: capture a submitted link, scan bounded public sources for what changed, or triage signals.
  ki-acquire-chatgpt and ki-acquire-granola own their provider contracts.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | help | pulse capture <source> | pulse scan <query> | pulse triage | refresh'
---

# Knowledge acquisition

Read [the common acquisition standard](references/standards-acquisition.md), then the receiving repository's capture entry point and only the applicable source route. Keep capture simple: establish scope, find any existing capture, route, preserve, verify and report. Where the port stages knowledge, curate incrementally: each curated or dropped item leaves its capture in its own commit, a card never links to a capture and gives its origin in one front-matter line only where that helps a later check, and a meeting is a source rather than a card.

This skill owns the common capture contract; provider skills add source completeness and capability rules. Repository guides supply local paths, publication authority and environment steps. Knowledge Islands owns the durable lifecycle and rationale. Executable importers live outside the harness: the Inbox's `ki-muninn` (krisb/inbox, `packages/ki-muninn/`) runs the acquisition the `ki-acquire-granola` and `ki-acquire-chatgpt` provider skills govern, which `ki acquire` in tools-ki ran until 5 November 2026, and will run as `ki muninn` once tools-ki's `ki-<name>` extension mechanism, KI-TOOL-KI-CLI-176, lands. The [generated rubric](references/rubric.md) holds the review criteria. This skill accepts no repository configuration properties.

This skill leads the Acquire guild, which brings knowledge in from outside. Its members: `ki-acquire-chatgpt` and `ki-acquire-granola` for each provider's capture contract, `ki-dodecakrisis` for sorting a mailbox before Deposit, and `ki-exchange-dynamics` for analysing a captured conversation or meeting. The PULSE mode below discovers and triages current signals.

For owner-selected Claude or Codex full-session capture, read [the agent-session acquisition guidance](references/standards-agent-session-acquisition.md). It owns exception-based session import; `ki-env-housekeeping-claude` and `ki-env-housekeeping-chatgpt` retain inventory, memory and cleanup.

## Operating modes

For `help`, `-h`, `?` or no recognised mode, explain the contract, modes and provider off-ramps without capturing anything; offer a mode choice only in an interactive session.

### Mode AUDIT

Run `ki repo audit --skill ki-acquire --repo <repo>`, then review supplied capture evidence against the standard. The mechanical audit does not prove fidelity; missing evidence stays a named gap. Do not contact a provider merely to complete an audit.

### Mode CONFORM

Run AUDIT, then `ki repo conform --skill ki-acquire --repo <repo> --dry-run`. The host may regenerate rubric publication. This mode does not choose routes, rewrite source bytes, publish captures or retire sources.

### Mode EDUCATE

Explain the common workflow and the repository's capture entry point, and route provider-specific completeness to its skill. Do not acquire content to demonstrate the contract.

### Mode PULSE

`pulse capture <url-or-source> [reason]`, `pulse scan <interest-or-query> [sources]` or `pulse triage [current-signals]` runs one bounded, on-demand pulse and keeps no standing state. Read [the pulse reference](references/mode-pulse.md) and follow it; it loads [the Pulse standard](references/standards-pulse.md). `ki-agentic-radar` and `ki-model-radar` own durable landscape posture.

### Mode REFRESH

REFRESH writes only in the canonical `ki-agent-backpack` repository; from an installed copy, stop and redirect there. Read [the sources](references/sources.md), compare the durable acquisition model and actual capture practice, then make and verify the smallest correction. Provider capability refresh stays with its provider skill.
