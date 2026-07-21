# ODR-KI-HARNESS-001: Scoped lifecycle operations

**Date:** 2026-07-20

## Context

EDUCATE materialises a repository's declared Knowledge Islands coverage into two derived surfaces: vendored self-governance material under `.ki/` and runtime-local skill payloads. User installation is a separate surface, containing the small global bootstrap keystone and any managed user-level payloads. The same repository can therefore have declared intent, generated repository state, and user-level state at once.

The terms `clean`, `uninstall`, and `doctor` describe different effects on those surfaces. Treating them as interchangeable makes a recovery command appear destructive, or lets a user-level action be mistaken for a repository-only one. A command-line interface also needs stable operation names and explicit scope before it can compose these behaviours safely.

## Decision

Knowledge Islands adopts four distinct lifecycle operations.

- **CLEAN** is repository-scoped only. It removes only proven generated and vendored repository state, retains the repository's declaration and authored material, and leaves every user-level installation untouched. EDUCATE restores the generated footprint after CLEAN.
- **UNINSTALL** ends Knowledge Islands adoption at an explicitly selected scope. Repository UNINSTALL removes KI-owned repository declarations and footprint; user UNINSTALL removes KI-owned user-level installation material. Neither scope implies the other.
- **DOCTOR** is read-only at either an explicit repository or user scope. It classifies the selected state and recommends the next operation without modifying it.
- **`kisle`** is the installable end-user command-line façade for the current public lifecycle: `kisle user install`; `kisle repo bootstrap`, `educate`, `audit`, `conform`, and `clean`; and `kisle help`. It is a zero-dependency tool owned by the `tools-kisle` repository, following the established `mgit` delivery shape, and distributed through `homebrew-tap`. Its syntax makes the `repo` or `user` scope explicit wherever both scopes exist; it does not introduce alternative lifecycle meanings or expose harness-maintainer utilities.

Zero-install public launchers may obtain a temporary harness source in order to run a repository operation, but they do not constitute a user installation or modify user state merely by running.

## Consequences

The existing source-owned repository CLEAN remains correctly named and its preservation boundary is part of the public contract. It is not a partial UNINSTALL.

Repository and user UNINSTALL, repository and user DOCTOR, zero-install launchers, and `kisle` command dispatch are separate deliverables. DOCTOR and UNINSTALL join the initial `kisle` surface only once they meet this contract. Each must implement the selected scope's ownership proof and preserve material belonging to the other scope. The harness defines the lifecycle contract and integration boundary; `tools-kisle` and `homebrew-tap` own the tool and distribution work through their respective roadmaps. Documentation and command help must present EDUCATE after CLEAN as the reconstruction path, and must never suggest that CLEAN removes adoption.

## Ownership matrix

Every lifecycle operation resolves its selected scope physically, rejects unsafe parent paths and links, snapshots every candidate, and rechecks it before deletion. A missing, altered, unfamiliar, linked, or concurrently changed candidate is a refusal for the selected operation; it is never treated as permission to infer ownership or broaden scope.

### Repository scope

- `.ki-config.toml` is the repository's authored declaration. CLEAN always preserves it. Repository UNINSTALL may remove it only when it is a regular, stable file containing exclusively KI configuration and comments; a mixed, malformed, linked, or otherwise unfamiliar declaration is preserved and causes UNINSTALL to refuse rather than attempt a heuristic edit.
- `.ki/self/skill/` is repository-authored local governance. CLEAN and repository UNINSTALL preserve it. Repository UNINSTALL may remove a separately proven generated runtime projection of it, because that projection is derived state rather than its source.
- `.ki/{bin,bootstrap,manifest.json}` is generated repository state. CLEAN and repository UNINSTALL remove it only through an exact, stable manifest proof covering its regular files and approved internal links.
- Runtime skill payloads are generated only when their marker, declared source identity, and integrity tree all validate. Repository operations remove those proven payloads only. Unmarked payloads, user-authored agents, `.gitignore`, canonical sources, and arbitrary repository paths are outside their ownership boundary and remain untouched.
- Repository operations never inspect, install, remove, or otherwise mutate user-level material. CLEAN is recoverable through EDUCATE; repository UNINSTALL intentionally ends only repository adoption.

### User scope

- User UNINSTALL may remove only the fixed KI-managed global-skill set when each directory has its current user-install marker and matching integrity proof.
- It may remove only the dedicated Knowledge Islands Claude hook namespace when its active pointer, current links, payload manifests, hashes, modes, and contained layout all validate. User settings and every other hook namespace remain untouched.
- All unmarked, altered, linked, partial, unfamiliar, or concurrent user material is preserved and causes user UNINSTALL to refuse. User operations neither read nor alter repository state.

### Recovery and refusal

CLEAN is idempotent once its proven generated footprint is gone, and EDUCATE reconstructs that footprint from the retained declaration. UNINSTALL is idempotent only after a successful selected-scope removal; it does not silently repair, adopt, or delete partial state. A caller must choose `repo` or `user` explicitly, and recovery after any refusal is inspection or the future read-only DOCTOR operation, never a broader deletion attempt.

## References

- [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-bootstrapping-and-self-sufficiency.md) — repository bootstrap and self-sufficiency boundary.
- [ADR-KI-HARNESS-010](ADR-KI-HARNESS-010-managed-hook-payloads-and-user-environment-binding.md) — managed user-level payload and binding boundary.
- [ADR-KI-HARNESS-011](ADR-KI-HARNESS-011-project-skill-copies-and-repository-local-links.md) — generated runtime payload ownership.
