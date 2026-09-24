---
id: KI-HARNESS-GOV-086
area: GOV
title: Audit tool shared code
theme: governance-consistency
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: 548861670244395838c19b40d7a546acbec4564c
created_at: 2026-09-22T06:00:48Z
updated_at: 2026-09-24T10:30:00Z
---

## Goal

Establish a trustworthy tool-estate consistency baseline and make stable shared installer and release code governable as `ki-repo-tools`-owned vendored material without introducing package-registry dependencies.

## Context

Five current `tools-*` repositories declare `ki-repo-tools`: `tools-git-almanac`, `tools-ki`, `tools-mgit`, `tools-rig`, and `tools-techne`. A fresh read-only sweep found all five pass the tool-repository audit. The three TypeScript/Bun tools also pass `ki-engineering`, while the Bash tools correctly do not declare it. No new mechanical failure needs a duplicate local roadmap record before this work begins.

The shared public shape is healthy but its implementation is not governed as reusable source. Every repository carries an independent `install.sh`, ranging from 75 to 367 lines, and all five copies are byte-distinct. Two repositories carry similar but distinct `release/package.sh` scripts. Common version modules and installer tests also repeat small concepts without a canonical source or drift classification. These differences reflect several real delivery models—source-script installation, compiled single-tool installation, unsigned archives, and signed multi-platform archives—alongside likely accidental divergence.

## Boundary

This item owns the Harness-side audit, delivery-profile classification, canonical vendoring contract, fixtures, and safe publication mechanism. Canonical reusable files live with `ki-repo-tools` as installed skill assets or templates and are copied into consumers under explicit ownership evidence; they are not published as npm packages or introduced as runtime dependencies.

The item does not edit sibling tool repositories, publish releases, change Homebrew formulae, rotate signing keys, or force one installer across incompatible release models. Repository migrations remain independently reviewable receiver-owned work after the Harness contract identifies exact profiles and upgrade paths.

## Current state

`ki-repo-tools` already governs installer behaviour, release readiness, help, manuals, version reporting, CI, and language-specific off-ramps. It verifies observable properties but provides no canonical vendored implementation, projection manifest, provenance marker, semantic drift check, or guarded conform action for shared installer and packaging code.

The existing estate therefore demonstrates conformance without demonstrating consistency. That is a sound audit baseline: the new work can focus on whether repeated code represents a stable shared concept rather than trying to repair unrelated failures at the same time.

## Steps

- [x] Inventory every tool repository's installer, release packaging, version surface, installer tests, and shared shell helpers; classify exact matches, intentional delivery profiles, stale copies, and tool-specific code.
- [x] Define the smallest stable vendoring profiles for source-installed Bash tools, archive-installed tools, and any security-hardened signed-release variant without weakening the strongest current integrity controls.
- [x] Add canonical skill-owned source assets with provenance and version evidence, plus a deterministic projection manifest whose parameters are data rather than repository-specific copied logic.
- [x] Extend `ki-repo-tools` audit and rubric coverage to report missing, modified, obsolete, and locally extended managed files while preserving declared tool-owned seams and language-specific implementation.
- [x] Add guarded CONFORM proposals that vendor only an unambiguous declared profile, never overwrite unexplained local changes, and remain idempotent.
- [x] Add fixtures for every supported delivery profile, checksum and signature boundaries, exact agreement, stale managed copies, unmanaged extensions, partial projections, and safe refusal; regenerate the published rubric.
- [x] Produce a repository-by-repository migration matrix and capture only the remaining receiver-owned changes in their local roadmaps.

## Files touched

- `skills/repo-structure/ki-repo-tools/SKILL.md`
- `skills/repo-structure/ki-repo-tools/assets/`
- `skills/repo-structure/ki-repo-tools/references/standards-tool-repositories.md`
- `skills/repo-structure/ki-repo-tools/references/standards-release-readiness.md`
- `skills/repo-structure/ki-repo-tools/references/rubric.md`
- `skills/repo-structure/ki-repo-tools/scripts/rubric/`
- `docs/decisions/`
- `docs/roadmap/KI-HARNESS-GOV-086-audit-tool-shared-code.md`

## Verify

- A committed estate matrix accounts for every current tool repository and each candidate shared implementation without treating filename equality as semantic identity.
- Focused fixtures prove canonical projections preserve delivery-profile security, detect drift, permit declared extension seams, and refuse ambiguous overwrites.
- `ki dev skill rubric ki-repo-tools` reproduces the committed rubric.
- `ki repo audit --skill ki-repo-tools --repo .`, `ki repo audit --skill ki-skills --repo .`, and `ki repo audit --skill ki-work-roadmap --repo .` pass.
- `bun run test` and `bunx tsc --noEmit` pass.

## Dependencies / blocks

No current mechanical audit finding blocks the Harness work. Coordinate the reusable vendoring mechanics and durable rationale with [KI-HARNESS-GOV-085](KI-HARNESS-GOV-085-audit-mcp-shared-code.md), but keep the artifact profiles, assets, audits, and receiver migrations independently executable.

## Documentation impact

### Decision Records

Prefer one shared Decision Record with GOV-085 for the cross-estate governed-vendoring principle if both items reach the same ownership and update model. Keep tool-specific delivery profiles in the `ki-repo-tools` standard rather than making the shared decision artifact-specific.

### Specifications

The `ki-repo-tools` standard and rubric become the accepted projection and drift contract; no separate specification is expected unless implementation exposes a public host interface.

### Guides

Update existing tool authoring and release guidance only if maintainers need a manual profile-selection, signing, or local-extension procedure after the automated contract is defined.

### Roadmap

Do not create speculative migration items in every tool repository. Use the completed matrix to enrich an existing local owner or allocate one bounded receiver item only where a real change remains.

## Review

### Delivered

Implemented the Harness-owned tool shared-code contract from baseline `548861670244395838c19b40d7a546acbec4564c`. The delivery adds source-script, checksummed-archive, and signed-archive profiles without modifying any receiver repository.

### Change Summary

Added hash-pinned installer and packaging templates, a deterministic profile manifest, validated profile-specific parameters, exact drift classifications, and guarded missing-file or executable-bit conformance. The shared vendoring rationale remains in GDR-KI-HARNESS-012, while the tool standard now includes the five-repository estate inventory and receiver-local migration matrix.

### Verification

- Focused `ki-repo-tools` tests pass: 17 tests and 164 assertions.
- The full Bun test suite and `bunx tsc --noEmit` pass.
- `ki dev skill rubric ki-repo-tools` reproduces the committed rubric.
- `ki-skills`, `ki-work-roadmap`, `ki-decision-records`, and `ki-authoring` audits pass.
- A live `ki-repo-tools` audit against `tools-git-almanac` passes with its keyless repository-owned profile.

### Outstanding concerns

- No receiver has adopted a managed profile; each migration remains receiver-owned and independently reviewable.
- `tools-ki` retains rollback and receipt extensions that must remain outside, or be explicitly reconciled with, the managed core.
- `tools-techne` has no release profile until its release contract is established.
- Archive packaging creates checksums; signing and CI publication remain receiver-owned steps.

### Post-change review

Ready for human review. The implementation does not publish packages, mutate sibling repositories, or overwrite modified managed files.

### Mini recap

`ki-repo-tools` can now identify, render, audit, and safely conform three stable delivery profiles while preserving repository-specific extensions and stronger integrity controls.

## Done

Accepted 2026-09-24 by Kris Brown on the review packet above.

## Discussion

### Planning decisions

The canonical source belongs to `ki-repo-tools`, because that skill already owns the tool-container, installer, and release-readiness contract and is installed wherever the projection is audited. Vendoring keeps each tool buildable and releasable from its checkout, avoids registry coupling, and lets repository commits pin the exact security-sensitive installer code they reviewed.

Profiles must be based on delivery behaviour, not implementation language alone. A Bash tool fetched as a versioned source file differs materially from a compiled tool installed from platform archives; a signed release adds another trust boundary. The audit should extract only stable control flow and express tool name, repository, binary, manual, archive, checksum, and signature choices as validated profile data.

### Audit order

First freeze the clean mechanical baseline and inventory observable installer contracts. Next compare integrity, rollback, idempotency, version selection, manual linking, platform detection, and test coverage before selecting canonical sources. Only then should CONFORM or receiver migrations be offered. The longest or most widely copied installer is not automatically the canonical one.

### Relationship to MCP work

[KI-HARNESS-GOV-085](KI-HARNESS-GOV-085-audit-mcp-shared-code.md) applies the same governed-vendoring principle to MCP runtime helpers. The two items may share provenance, manifest, and guarded-projection infrastructure, but `ki-repo-mcp` and `ki-repo-tools` retain authority over their own assets and variation profiles.
