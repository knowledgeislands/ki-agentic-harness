---
id: 'FND-004'
title: Define an installed-skill registry and native repository-maintenance contract
status: open
roadmap: foundation-tooling/define-an-installed-skill-registry-and-native-repository-maintenance-contract
blocks: —
blocked-by: —
---

## Context

The existing self-sufficiency model vendors checker copies and aggregate runners into every governed repository. Knowledge Islands is replacing that model with native `ki` operations resolved from one installed skill collection, so repositories declare their required governance in `.ki-config.toml` without carrying `.ki/bin` dispatchers or copied checkers.

## Current state

The public CLI guide now groups the current and expected commands and defines the intended XDG location convention. Existing bootstrap, aggregate, and lifecycle decision records still require vendored repository runners. The outgoing `-/_HANDOFFS/ki/command-contract.md` and `tools-ki.md` notes supplied constraints for this work; their durable successor is this plan and the receiving `tools-ki` implementation plan.

## Steps

1. Reconcile the current bootstrap, aggregate, lifecycle, and project-skill publication decision records into one current contract that retires vendored repository runners without retaining a compatibility fallback.
2. Define the XDG Base Directory layout for installed skill collections, configuration, cache, and state; define the integrity, version-selection, upgrade, and offline failure rules for the collection.
3. Define the native skill-registration contract: operation metadata, declared-skill resolution from `.ki-config.toml`, dependency ordering, shared finding/reporting model, and strict refusal for missing, incompatible, or undeclared skills.
4. Define explicit global and repository runtime activation semantics, including generated symlink ownership, supported runtimes, idempotence, containment, and removal safety. Installation must not activate every skill globally.
5. Define the repository command contract for `ki repo audit`, `ki repo conform`, scoped `--skill` execution, and explicit migration away from existing generated runners. Preserve physical repository resolution, dry-run, safe-write, and re-audit guarantees.
6. Define CI and direct-automation acquisition of the verified installed collection, including the trust root, immutable revision evidence, and refusal/recovery behaviour when it is unavailable.
7. Update the current guide, decision records, bootstrap and repo standards, and receiving-repository handoff references; remove superseded handoff material after its receiving roadmap and plan records are committed.

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
