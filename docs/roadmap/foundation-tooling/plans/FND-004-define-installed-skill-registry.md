---
id: 'FND-004'
title: Define an installed-skill registry and native repository-maintenance contract
status: acceptance
roadmap: foundation-tooling/define-an-installed-skill-registry-and-native-repository-maintenance-contract
blocks: —
blocked-by: —
---

## Context

The existing self-sufficiency model vendors checker copies and aggregate runners into every governed repository. Knowledge Islands is replacing that model with native `ki` operations resolved from one installed skill collection, so repositories declare their required governance in `.ki-config.toml` without carrying `.ki/bin` dispatchers or copied checkers.

## Current state

[ADR-KI-HARNESS-012](../../../decisions/ADR-KI-HARNESS-012-installed-skill-collections-and-native-repository-operations.md) and its [installed skill collection contract](../../../decisions/references/installed-skill-collection-contract.md) define the XDG collection, integrity, registration, activation, native-operation, migration, and CI boundary. The current guides and bootstrap, repository, engineering, and skills standards adopt that contract; the misrouted handoff material has been deleted after adoption. The receiving [CLI-004](https://github.com/knowledgeislands/tools-ki/blob/main/docs/roadmap/cli/plans/CLI-004-native-repo-maintenance.md) can now implement it without reopening architecture; it remains responsible for executable delivery, release, and Homebrew decisions.

## Steps

1. [x] Reconcile the current bootstrap, aggregate, lifecycle, and project-skill publication decision records into one current contract that retires vendored repository runners without retaining a compatibility fallback.
2. [x] Define the XDG Base Directory layout for installed skill collections, configuration, cache, and state; define the integrity, version-selection, upgrade, and offline failure rules for the collection.
3. [x] Define the native skill-registration contract: operation metadata, declared-skill resolution from `.ki-config.toml`, dependency ordering, shared finding/reporting model, and strict refusal for missing, incompatible, or undeclared skills.
4. [x] Define explicit global and repository runtime activation semantics, including generated symlink ownership, supported runtimes, idempotence, containment, and removal safety. Installation must not activate every skill globally.
5. [x] Define the repository command contract for `ki repo audit`, `ki repo conform`, scoped `--skill` execution, and explicit migration away from existing generated runners. Preserve physical repository resolution, dry-run, safe-write, and re-audit guarantees.
6. [x] Define CI and direct-automation acquisition of the verified installed collection, including the trust root, immutable revision evidence, and refusal/recovery behaviour when it is unavailable.
7. [x] Update the current guide, decision records, bootstrap and repo standards, and receiving-repository handoff references; remove superseded handoff material after its receiving roadmap and plan records are committed.

## Files touched

- CLI guide and relevant current decision records
- `ki-bootstrap`, `ki-repo`, and skill-registration standards and tests
- Foundation roadmap and this plan
- Outgoing handoff cleanup under `-/_HANDOFFS/`

## Verify

1. The updated decisions, guide, and standards agree on the installed-skill and no-vendoring boundary.
2. The new contract names a complete safe path for a clean user, an existing vendored repository, a repository with missing installed skills, and CI.
3. The foundation roadmap audit and applicable authoring, decision-record, skill, and bootstrap checks pass.
4. The receiving [`CLI-004`](https://github.com/knowledgeislands/tools-ki/blob/main/docs/roadmap/cli/plans/CLI-004-native-repo-maintenance.md) plan can implement the contract without reopening its architecture.

## Dependencies / blocks

This plan adopts the contract material formerly held in the harness's misrouted outbound `ki` handoff directory. It supplies the external architecture prerequisite for the receiving `tools-ki` implementation plan; `tools-ki` retains ownership of its priority, executable, release, and delivery.

## Delegation

- Round 1 — research: inventory the current decisions, standards, guides, and deleted-handoff constraints that the replacement contract must retain, amend, or reject; worker `contract-inventory`, model `gpt-5.6-terra` because the work is bounded evidence gathering; files: read-only `docs/decisions/`, `docs/guides/`, `skills/`, and Git history; gate: cited inventory with no proposed edits.
- Round 1 — research: map the current bootstrap, aggregate, config-resolution, runtime-publication, and CI implementation seams that must become native registered operations; worker `runtime-inventory`, model `gpt-5.6-terra` because the work is bounded code-path analysis; files: read-only `skills/keystone/ki-bootstrap/`, `skills/keystone/ki-repo/`, `.ki/`, and CI/toolchain files; gate: cited migration surface and test matrix with no proposed edits.
- Round 2 — judgment: the orchestrator reconciles the evidence into one current architecture decision and contract; files: the decision, standards, and guide surfaces selected after Round 1; gate: decision-record, roadmap, and relevant governance audits.
- Round 3 — mechanical: bounded workers apply the settled contract and migration fixtures in exclusive file scopes; model and file boundaries are assigned only after Round 2 fixes the interface; gate: focused tests plus adversarial review for every automatically executing installer, runner, or migration artefact.
- Orchestrator: review every worker result before writing, preserve the no-vendoring decision boundary, run final verification, and commit only gated work.

## Acceptance

### Delivered

An XDG-installed skill-collection architecture and native repository-maintenance contract that replaces vendored repository runners without a compatibility fallback.

### Summary of changes

- Added [ADR-KI-HARNESS-012](../../../decisions/ADR-KI-HARNESS-012-installed-skill-collections-and-native-repository-operations.md) and the [installed skill collection contract](../../../decisions/references/installed-skill-collection-contract.md), covering collection integrity, registry operations, `.ki-config.toml` resolution, activation, migration, and CI.
- Aligned the user CLI guide and the `ki-bootstrap`, `ki-repo`, `ki-skills`, and engineering standards with native `ki repo audit` / `ki repo conform` delivery.
- Removed the adopted `-/_HANDOFFS/ki` material and made [CLI-004](https://github.com/knowledgeislands/tools-ki/blob/main/docs/roadmap/cli/plans/CLI-004-native-repo-maintenance.md) the receiving executable-delivery plan.

### Verification

- `bun run test` — passed.
- `bun run ki:audit` — passed.
- `bun run ki:repo-roadmap:audit` — passed with no FAIL or WARN findings.
- `bun run ki:authoring:audit` — passed with no FAIL or WARN findings.
- `bun run ki:bootstrap:audit` — passed with no FAIL or WARN findings.
- `bun run ki:decision-records:audit` — passed with the pre-existing `GDR-KI-ARCADIA` serial-gap warning only.
- Manual contract review confirmed a safe path for a clean user, an existing vendored repository, a repository missing installed skills, and CI.
- Implementation evidence: `38e97336913bbb767295f5dc67a230839d48c2b3`.

### Outstanding concerns

The contract is complete, but [CLI-004](https://github.com/knowledgeislands/tools-ki/blob/main/docs/roadmap/cli/plans/CLI-004-native-repo-maintenance.md) still owns the executable host, release, and Homebrew delivery. The unrelated `GDR-KI-ARCADIA-001` serial-gap warning remains for its owner to resolve.

### Mini recap

The native-operation boundary must be designed before the CLI implementation: resolving declared skills from one verified collection makes `ki repo audit` and `ki repo conform` portable without perpetuating copied `.ki/bin` runners. No further architecture learning route is proposed.
