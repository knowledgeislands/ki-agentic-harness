---
id: ODR-KI-HARNESS-001
title: 'Scoped lifecycle operations'
date: 2026-07-20
status: current
type: Operations Decision Record
type_url: https://knowledgeislands.info/specifications/decision-records/odr
decision_type: operations
---

# ODR-KI-HARNESS-001: Scoped lifecycle operations

## Context

The legacy EDUCATE implementation materialises a repository's declared Knowledge Islands coverage into vendored self-governance material under `.ki/` and runtime-local skill payloads. The current contract instead separates verified installed harnesses, managed runtime discovery links, and a repository's authored declaration. The same machine can therefore have declared repository intent, managed repository activation state, and user-level harness and activation state at once.

The terms `clean`, `uninstall`, and `doctor` describe different effects on those surfaces. Treating them as interchangeable makes a recovery command appear destructive, or lets a user-level action be mistaken for a repository-only one. A command-line interface also needs stable operation names and explicit scope before it can compose these behaviours safely.

## Decision

Knowledge Islands adopts four distinct lifecycle operations.

- **CLEAN** is repository-scoped only. It may remove only proven managed runtime links and legacy generated state selected by an explicit fail-closed migration. It retains the repository's declaration and authored material, leaves every user-level installation untouched, and never treats `.ki` as a native execution fallback.
- **UNINSTALL** ends Knowledge Islands adoption at an explicitly selected scope. Repository UNINSTALL removes only KI-owned repository declaration and managed activation state; user UNINSTALL removes only KI-owned harness registration and user-level activation material. Neither scope implies the other.
- **DOCTOR** is read-only at either an explicit repository or user scope. It classifies the selected state and recommends the next operation without modifying it.
- **The host** is the installable Knowledge Islands CLI and native operation host. It manages verified harness registration, explicit user or repository activation, and declared repository operations. The CLI grammar is owned by `tools-ki`; this lifecycle record requires that both scopes remain explicit where they are available and never introduces a second meaning for CLEAN, UNINSTALL, or DOCTOR.

Legacy zero-install launchers and bootstrap scripts are migration inputs, not native repository-operation launchers. They do not constitute a user installation or modify user state merely by running.

## Consequences

Repository CLEAN remains distinct from UNINSTALL and its preservation boundary is part of the public contract. It is not a partial UNINSTALL or an executor fallback.

Repository and user UNINSTALL, repository and user DOCTOR, legacy migration, and `ki` command dispatch are separate lifecycle concerns. Each must implement the selected scope's ownership proof and preserve material belonging to the other scope. The harness defines the lifecycle contract and integration boundary; `tools-ki` and `homebrew-tap` own the tool and distribution work. Documentation and command help must present explicit activation after CLEAN as the reconstruction path, and must never suggest that CLEAN removes adoption.

## Ownership matrix

Every lifecycle operation resolves its selected scope physically, rejects unsafe parent paths and links, snapshots every candidate, and rechecks it before deletion. A missing, altered, unfamiliar, linked, or concurrently changed candidate is a refusal for the selected operation; it is never treated as permission to infer ownership or broaden scope.

### Repository scope

- `.ki-config.toml` is the repository's authored declaration. CLEAN always preserves it. Repository UNINSTALL may remove it only when it is a regular, stable file containing exclusively KI configuration and comments; a mixed, malformed, linked, or otherwise unfamiliar declaration is preserved and causes UNINSTALL to refuse rather than attempt a heuristic edit.
- `.ki/self/skill/` is repository-authored local governance. CLEAN and repository UNINSTALL preserve it. Repository UNINSTALL may remove a separately proven managed runtime projection of it, because that projection is derived state rather than its source.
- `.ki/{bin,bootstrap,manifest.json}` is legacy generated repository state. A repository operation may inspect or remove it only through an explicit migration with exact, stable ownership proof; native `ki repo` operations never read it to execute governance work.
- Runtime discovery links are removable only when their marker, declared source identity, and integrity tree all validate. Unmarked payloads, user-authored agents, `.gitignore`, canonical sources, and arbitrary repository paths are outside their ownership boundary and remain untouched.
- Repository operations never inspect, install, remove, or otherwise mutate user-level material. CLEAN is recoverable through explicit repository-scope activation; repository UNINSTALL intentionally ends only repository adoption.

### User scope

- User UNINSTALL may remove only verified KI harness registrations and managed user runtime links when each has its current ownership marker and matching integrity proof.
- It may remove only the dedicated Knowledge Islands Claude hook namespace when its active pointer, current links, payload manifests, hashes, modes, and contained layout all validate. User settings and every other hook namespace remain untouched.
- All unmarked, altered, linked, partial, unfamiliar, or concurrent user material is preserved and causes user UNINSTALL to refuse. User operations neither read nor alter repository state.

### Recovery and refusal

CLEAN is idempotent once its proven managed and explicitly migrated footprint is gone, and repository-scope activation reconstructs only its managed discovery links from the retained declaration. UNINSTALL is idempotent only after a successful selected-scope removal; it does not silently repair, adopt, or delete partial state. A caller must choose `repo` or `user` explicitly, and recovery after any refusal is inspection or the read-only DOCTOR operation, never a broader deletion attempt.

## References

- [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-user-installation-repository-bootstrap-and-self-sufficiency.md) — repository activation and self-sufficiency boundary.
- [ADR-KI-HARNESS-010](ADR-KI-HARNESS-010-managed-hook-payloads-and-user-environment-binding.md) — managed user-level payload and binding boundary.
- [ADR-KI-HARNESS-011](ADR-KI-HARNESS-011-project-skill-copies-and-repository-local-links.md) — managed runtime activation ownership.
