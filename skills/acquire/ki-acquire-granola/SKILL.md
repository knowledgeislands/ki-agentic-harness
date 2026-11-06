---
name: ki-acquire-granola
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: [ki-acquire]
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Acquire Granola meetings through read-only MCP calls: complete date windows, folder routing, transcripts and
  screenshots, one capture per meeting UUID, skipping on Acquired or Captured membership. Use for Granola import or audit;
  `ki-acquire` owns the common contract, the Inbox's `ki-muninn` owns CLI execution, and marking or retirement needs separate approval.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | help | refresh'
---

# Granola acquisition

Apply `ki-acquire` for the common contract, then [the Granola acquisition standard](references/standards-granola-acquisition.md). The generated [rubric](references/rubric.md) holds the review criteria, and [sources](references/sources.md) tracks the volatile official MCP surface.

Granola's official remote MCP is the source adapter. The how-to has moved out of the harness: the Inbox's `ki-muninn` (krisb/inbox, `packages/ki-muninn/`) runs `granola import`, `mark` and `images` from the receiving repository's `[muninn.granola]` settings, and its README and the Inbox's Granola operator guide own the commands, flags, defaults and settings. `ki acquire` in tools-ki ran them until 5 November 2026; `ki muninn` will run them once tools-ki's extension mechanism, KI-TOOL-KI-CLI-176, lands. This skill keeps the provider method. Import keeps no ledger: a meeting in the configured Acquired folder, or in a territory's Captured folder when the repository declares `capture_moves`, is skipped on membership alone over an explicit window, and an existing capture is found by its meeting UUID and kept unless deliberately refreshed in place. The committed capture is the only record.

## Operating modes

### Mode HELP

For `help`, `-h`, `?` or no recognised mode, explain the skill, modes and off-ramps without reading meeting content or changing Granola or repository state; offer a mode choice only in an interactive session.

### Mode AUDIT

Run the `ki-acquire` audit, then `ki repo audit --skill ki-acquire-granola --repo <repo>`, and review supplied run evidence for complete window enumeration, routing, transcripts, screenshots, omissions and absence of unapproved mutation. Do not contact Granola merely to complete an audit; missing evidence stays a named gap.

### Mode CONFORM

Run AUDIT, then `ki repo conform --skill ki-acquire-granola --repo <repo> --dry-run`. It may publish the generated rubric but cannot invent folder mappings, choose a receiver, contact Granola or grant retirement.

### Mode EDUCATE

Explain window splitting, folder routing and flags, one capture per UUID, the Acquired marker or Triaged-to-Captured move and in-place refresh, explicit omissions and the manual retirement gate, and point to `ki-muninn` for the commands. Do not acquire or mutate anything.

### Mode REFRESH

Run only in the canonical `ki-agentic-harness`; from an installed copy, stop and redirect there. Read [sources](references/sources.md), re-fetch the official Granola MCP documentation, inspect a separately approved read-only live schema, and update the standard, rubric and review date together. Retain no meeting content or credentials.

## Off-ramps

- The Inbox's `ki-muninn` owns the commands, settings, routing execution and capture writes.
- Knowledge Islands Principal owns the provider-neutral acquisition lifecycle.
- Granola account administration and connector management stay outside this skill.
