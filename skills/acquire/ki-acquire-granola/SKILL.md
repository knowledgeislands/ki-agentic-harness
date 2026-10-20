---
name: ki-acquire-granola
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: [ki-acquire]
ki-shared-dependencies: [ki-skills:rubric]
ki-acquire-adapter: granola
ki-acquire-actions: [import, mark]
ki-acquire-repository-properties: [folder_ids, duplicate_folder_ids, unfoldered, residual, capture_root, folder_territories, acquired_folder_id]
ki-acquire-invocation-properties: [refresh, refresh-acquired]
ki-acquire-capabilities: [account, folders, meetings, details, transcripts, attachments]
ki-acquire-omissions: [source-url, source-timestamps, tags, media, source-version, deletion-tombstone]
ki-acquire-mutation-boundary: explicit-marker
ki-acquire-checkpoint: capture-front-matter
ki-acquire-reset-scopes: []
description: >
  Acquire Granola meetings through read-only MCP calls: complete date windows, folder routing, transcripts and
  screenshots, one capture per meeting UUID, skipping on Acquired-folder membership. Use for Granola import or audit;
  `ki-acquire` owns the common contract, tools-ki owns CLI execution, and marking or retirement needs separate approval.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | help | refresh'
---

# Granola acquisition

Apply `ki-acquire` for the common contract, then [the Granola acquisition standard](references/standards-granola-acquisition.md). The generated [rubric](references/rubric.md) holds the review criteria, and [sources](references/sources.md) tracks the volatile official MCP surface.

Granola's official remote MCP is the source adapter; `tools-ki` owns `ki acquire import` and `ki acquire mark` for `--adapter granola`. The `ki-acquire-*` front matter is the adapter declaration `tools-ki` reads. Import keeps no ledger: a meeting in the configured Acquired folder is skipped on membership alone, and an existing capture is found by its meeting UUID and kept unless `--refresh` is given. The committed capture is the only record.

## Operating modes

### Mode HELP

For `help`, `-h`, `?` or no recognised mode, explain the skill, modes and off-ramps without reading meeting content or changing Granola or repository state; offer a mode choice only in an interactive session.

### Mode AUDIT

Run the `ki-acquire` audit, then `ki repo audit --skill ki-acquire-granola --repo <repo>`, and review supplied run evidence for complete window enumeration, routing, transcripts, screenshots, omissions and absence of unapproved mutation. Do not contact Granola merely to complete an audit; missing evidence stays a named gap.

### Mode CONFORM

Run AUDIT, then `ki repo conform --skill ki-acquire-granola --repo <repo> --dry-run`. It may publish the generated rubric but cannot invent folder mappings, choose a receiver, contact Granola or grant retirement.

### Mode EDUCATE

Explain window splitting, folder routing and flags, one capture per UUID, the Acquired marker and `--refresh`, explicit omissions and the manual retirement gate. Do not acquire or mutate anything.

### Mode REFRESH

Run only in the canonical `ki-agentic-harness`; from an installed copy, stop and redirect there. Read [sources](references/sources.md), re-fetch the official Granola MCP documentation, inspect a separately approved read-only live schema, and update the standard, rubric and review date together. Retain no meeting content or credentials.

## Off-ramps

- `tools-ki` owns the commands, routing execution and capture writes.
- Knowledge Islands Principal owns the provider-neutral acquisition lifecycle.
- Granola account administration and connector management stay outside this skill.
