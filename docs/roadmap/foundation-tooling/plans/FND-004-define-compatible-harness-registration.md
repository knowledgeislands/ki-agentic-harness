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

[ADR-KI-HARNESS-012](../../../decisions/ADR-KI-HARNESS-012-compatible-harness-publication-and-native-operation-boundary.md) now defines compatible-harness publication, identity, operations, and projection semantics only. [ADR-KI-TOOLS-002](../../../../../tools-ki/docs/decisions/ADR-KI-TOOLS-002-compatible-harness-registry-and-native-operations.md) owns the XDG registry, command grammar, scope, and native host; [KIP-000003](../../../../../ki-specifications/proposals/KIP-000003-compatible-harnesses/README.md) is the Draft portable-contract proposal.

The shared ecosystem GDR now establishes the five-repository ownership model. Its byte-identical mirrors and every local decision-record collection now conform to the current decision-record standard.

## Completed foundation

- Defined qualified capability identity: `<harness-id>:<skill-name>` for skills and the reserved `<harness-id>:<kind>/<name>` extension shape for other kinds.
- Established the initial `latest` model, an XDG-managed multi-harness registry, and managed `vendor` and `symlink` capability-projection modes without restoring retired `.ki/bin` execution.
- Reassigned CLI registry, command grammar, repository resolution, activation, native-operation host, migration, reporting, and delivery ownership to `tools-ki`, with Homebrew and Cargo serving only as boundary-setting exemplars.
- Opened KIP-000003 to turn the proven harness publication, inventory, identity, projection, operation, and repository-resolution boundary into a future portable specification.
- Added `shared_record: true` for deliberate verbatim governance-record mirrors. The decision-record checker includes a mirror in an existing local prefix-and-scope sequence, while excluding an otherwise foreign mirror from serial continuity.
- Conformed and audited the decision-record collections in Arcadia Principal, the harness, `tools-ki`, KI Specifications, and the Website with no FAIL or WARN findings.

## Steps

1. Define qualified capability identity, including the settled `<harness-id>:<skill-name>` form for skills and an explicit extension point for other capability kinds.
2. Keep the initial installation model at `latest`, with no user-selectable harness or capability versions. Design the XDG layout so a later model can retain `latest` and add sibling records for each version in use with explicit compatibility and integrity evidence.
3. Rewrite the harness decisions so they define only compatible-harness artefacts, capability semantics, and the harness publication boundary; remove CLI-host, release, and delivery ownership from them.
4. Establish the corresponding `tools-ki` decisions for XDG harness registration, command grammar, repository resolution, scoped activation, native operation hosting, migration, reporting, and status listing. Use Homebrew and Cargo as boundary-setting exemplars, without importing their package or supply-chain models.
5. Define the planned maintenance vocabulary: `ki list` and `ki harness list` inventories; `ki missing` and `ki outdated` status reports; `ki install`, `ki reinstall`, and `ki uninstall` capability-management forms; `ki update` for the executable and installed harnesses; and CWD-resolved `ki upgrade` for available capability releases. Settle each form’s relationship to explicit `ki repo` and `ki user` activation before implementation.
6. Establish or revise KI Specifications decisions and portable contract material for harness identity, capability inventory, qualified names, registry evidence, projection modes, and repository-resolution semantics.
7. Align the harness guide, harness and bootstrap standards, capability rubrics, and the future `ki(1)` reference with the settled boundary; preserve current-versus-planned command status and remove obsolete one-collection terminology.

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

This work establishes the architectural prerequisite for [CLI-004](../../../../../tools-ki/docs/roadmap/cli/plans/CLI-004-native-repo-maintenance.md). CLI-004 owns the implementation and release evidence; it remains independently executable once the contract is accepted.
