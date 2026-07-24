---
id: 'FND-004'
title: Define compatible harness registration and native repository-maintenance boundaries
status: in-progress
roadmap: foundation-tooling/define-compatible-harness-registration-and-native-repository-maintenance-boundaries
blocks: —
blocked-by: —
---

## Context

Knowledge Islands is replacing repository-vendored runners with native `ki` operations, but the earlier one-installed-collection design is no longer the current direction.

`ki` must always include the base `knowledgeislands/ki-agentic-harness` and support additional compatible harnesses, such as an organisation harness, from an XDG-managed user registry.

The harness owns compatible capability semantics; `tools-ki` owns the CLI platform and public grammar; KI Specifications owns portable contracts; and the Website owns public user-guide prose.

## Current state

The user guide records the released seed surface and the intended `ki list`, `ki harness list`, harness-qualified skill identity, XDG locations, and physical repository resolution.

[ADR-KI-HARNESS-012](../../../decisions/ADR-KI-HARNESS-012-installed-skill-collections-and-native-repository-operations.md), its companion contract, and [ODR-KI-HARNESS-001](../../../decisions/ODR-KI-HARNESS-001-scoped-lifecycle-operations.md) still describe one active skill collection and CLI grammar that belongs to `tools-ki`.

The shared ecosystem GDR now establishes the five-repository ownership model, but the local decision records and their checker do not yet represent that model consistently.

## Steps

1. Inventory every affected decision record across Arcadia Principal, the harness, `tools-ki`, KI Specifications, and the Website; classify each as a shared mirror, local authority, or stale cross-boundary record.
2. Define a harness capability as a typed published member of a compatible harness: skill, agent, MCP server, hook, eval, or a future registered kind. Preserve kind-specific standards while establishing the common harness capability vocabulary and inventory boundary.
3. Define qualified capability identity, including the settled `<harness-id>:<skill-name>` form for skills and an explicit extension point for other capability kinds.
4. Define managed capability activation projections: `vendor` regular-file copies and contained `symlink` links to a verified installed harness. Preserve ownership, containment, idempotence, and removal safety; neither mode restores vendored `.ki/bin` execution.
5. Keep the initial installation model at `latest`, with no user-selectable harness or capability versions. Design the XDG layout so a later model can retain `latest` and add sibling records for each version in use with explicit compatibility and integrity evidence.
6. Rewrite the harness decisions so they define only compatible-harness artefacts, capability semantics, and the harness publication boundary; remove CLI-host, release, and delivery ownership from them.
7. Establish the corresponding `tools-ki` decisions for XDG harness registration, command grammar, repository resolution, scoped activation, native operation hosting, migration, reporting, and status listing.
8. Establish or revise KI Specifications decisions and portable contract material for harness identity, capability inventory, qualified names, registry evidence, projection modes, and repository-resolution semantics.
9. Amend `ki-decision-records` so recognised verbatim shared records can be mirrored across repositories without violating local serial-sequence checks.
10. Align the harness guide, harness and bootstrap standards, capability rubrics, and the future `ki(1)` reference with the settled boundary; preserve current-versus-planned command status and remove obsolete one-collection terminology.

## Files touched

- Affected decisions and indexes across the five primary repositories
- Harness standards, guides, capability rubrics, and this foundation roadmap
- `ki-decision-records` standard, checker, tests, and vendored bootstrap material when its mirror rule changes
- Portable contract material in KI Specifications, executable-decision material in `tools-ki`, and the `ki(1)` roadmap item

## Verify

1. Every changed decision-record collection passes its applicable decision-record audit, apart from separately recorded pre-existing findings.
2. The shared ecosystem GDR is byte-identical in every approved mirror.
3. The harness, `tools-ki`, KI Specifications, and Website agree on capability vocabulary, ownership, projection modes, and the current-versus-planned command boundary without duplicate or contradictory contracts.
4. The harness roadmap, authoring, decision-record, skill, bootstrap, test, and aggregate audit gates pass after any harness or checker change.

## Dependencies / blocks

This work is independent of the eventual `tools-ki` implementation plan, which remains unplanned until the user reviews the target CLI structure.

The decision consolidation must complete before a native CLI implementation plan claims that its architecture is settled.
