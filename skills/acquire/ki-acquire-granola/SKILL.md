---
name: ki-acquire-granola
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: [ki-acquire]
ki-shared-dependencies: [ki-skills:rubric]
ki-acquire-adapter: granola
ki-acquire-actions: [import, status, reconcile, reset, mark]
ki-acquire-repository-properties: [folder_ids, duplicate_folder_ids, unfoldered, residual, capture_root, folder_territories, acquired_folder_id]
ki-acquire-invocation-properties: [refresh-transcripts, refresh-acquired]
ki-acquire-capabilities: [account, folders, meetings, details, transcripts, attachments]
ki-acquire-omissions: [source-url, source-timestamps, tags, media, source-version, deletion-tombstone]
ki-acquire-mutation-boundary: explicit-marker
ki-acquire-checkpoint: detail-transcript
ki-acquire-reset-scopes: [adapter, source, component, rebuild]
description: >
  Acquire and reconcile Granola meetings through MCP reads, including screenshots, complete date windows,
  folder routing, verified Acquired markers, checkpoints, and amendment detection. Use for Granola import or
  audit; `ki-acquire` owns the common contract, tools-ki owns CLI execution, and retirement needs separate approval.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | help | refresh'
---

# Granola acquisition

Apply `ki-acquire` for the common capture contract before the provider-specific rules here. Read [the Granola acquisition standard](references/standards-granola-acquisition.md) for enumeration, fidelity, routing, and checkpoint semantics; read [the retirement standard](references/standards-granola-retirement.md) only when evaluating eventual source release. The generated [rubric](references/rubric.md) provides the checkable review contract, and [sources](references/sources.md) tracks the volatile official MCP surface.

## What this skill owns

This skill governs how Knowledge Islands interprets Granola as a mutable communication source. It requires complete identity enumeration, faithful read-only source projections, explicit omissions, immutable acquired versions, visible receiver conflicts, repeatable checkpoints, and separation between acquisition and retirement.

Granola's official remote MCP is the selected source adapter. It supplies authentication and source reads; it does not own KI package construction, repository routing, ledgers, harvesting, trades, or retirement authority. `tools-ki` owns `ki acquire import --adapter granola`, provider-neutral KEP construction, Harbour staging, and executable reconciliation. Knowledge Islands Principal owns the provider-neutral lifecycle.

The `ki-acquire-*` frontmatter is the machine-readable adapter declaration consumed by `tools-ki`. It names the public actions, repository and invocation properties, source capabilities and omissions, explicit-marker mutation boundary, checkpoint model, and reset scopes without requiring an executor to parse prose or infer behaviour from the skill name.

## Verified provider boundary

The refreshed MCP supplies account, paged folders, owned-note date-window lists, meeting details, paged transcripts, and screenshot attachments. Natural-language query remains exploratory. Acquisition allowlists reads and ignores unrelated advertised tools; account, workspace, folder administration, removal, and deletion tools are never invoked. Live schema evidence, not a documentation release date, establishes optional capabilities.

MCP screenshots are decoded and retained as exact returned bytes, with attachment UUIDs, metadata, true image formats, counts, and checksum manifests. This proves the returned MCP representation; it does not establish byte equivalence with desktop originals. The manual `ki acquire images` path remains available for separately exported originals.

An owner-configured `acquired_folder_id` identifies a private progress folder, independently of territory routing. Routine import skips a marked note only after validating its committed local preservation receipt. `--refresh-acquired --refresh-transcripts` deliberately revalidates it. `ki acquire mark --adapter granola` previews eligible notes; `--confirm` separately authorises additive membership in that exact folder after committed capture, transcript, image, account, and source-version checks. Every original membership must survive readback. A marker is neither reconciliation nor deletion permission; retained checkpoints remain evidence.

## Operating modes

### Mode HELP

Explain the skill's purpose, invocation, modes, source boundary, and off-ramps, then stop without reading meeting content or changing Granola or repository state. Explicit `help`, `-h`, and `?` always take this path. With no recognisable mode, show the same explanation before offering an interactive mode choice.

### Mode AUDIT

Run the prerequisite `ki-acquire` audit, then `ki repo audit --skill ki-acquire-granola --repo <repo>` and apply the judgment criteria in the generated rubric. Review separately supplied runtime evidence for complete date-window enumeration, UUID reconciliation, source-projection hashes, receiver selection, explicit omissions, and absence of unapproved source mutation. Do not contact Granola merely to make an audit look complete; unavailable runtime evidence remains a named gap.

### Mode CONFORM

Run AUDIT first. `ki repo conform --skill ki-acquire-granola --repo <repo> --dry-run` may publish host-owned generated rubric material but cannot invent folder mappings, choose a receiver, contact Granola, write a KEP, change a checkpoint, or alter retirement authority. Apply authored configuration or contract corrections only after their owner approves them, then re-run AUDIT.

### Mode EDUCATE

Explain the four provider operations, complete-history window splitting, many-folder receiver routing, flag-only outcomes, temporary capture packages, retained handling checkpoints, normal versus exhaustive revalidation, explicit omissions, and the optional retirement gate. Do not perform acquisition or source mutation.

### Mode REFRESH

Run only against the canonical skill in `ki-agentic-harness`. When invoked from an installed copy, stop and redirect the work to `ki-agentic-harness`; the installed copy must never write a refresh. In the canonical source, read [sources](references/sources.md), re-fetch the official Granola MCP documentation, inspect a separately approved read-only live schema, and compare tool names, inputs, entitlement limits, output fields, caps, and mutation surface with the acquisition standard and rubric. Update the source review date and every affected contract in one change; do not retain meeting content or credentials.

## Off-ramps

- `tools-ki` owns the public command, provider-neutral KEP builder, repository selection, capture writes, and checkpoint persistence.
- Knowledge Islands Principal owns the provider-neutral acquisition lifecycle and semantics shared with non-Granola sources.
- `ki-trades` owns movement of harvested knowledge or correction work between repositories.
- Granola account administration and application-managed connector disablement remain outside this skill.
