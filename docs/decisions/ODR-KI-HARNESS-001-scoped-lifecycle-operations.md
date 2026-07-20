# ODR-KI-HARNESS-001: Scoped lifecycle operations

**Date:** 2026-07-20

## Context

EDUCATE materialises a repository's declared Knowledge Islands coverage into two derived surfaces: vendored self-governance material under `.ki-meta/` and runtime-local skill payloads. User installation is a separate surface, containing the small global bootstrap keystone and any managed user-level payloads. The same repository can therefore have declared intent, generated repository state, and user-level state at once.

The terms `clean`, `uninstall`, and `doctor` describe different effects on those surfaces. Treating them as interchangeable makes a recovery command appear destructive, or lets a user-level action be mistaken for a repository-only one. A command-line interface also needs stable operation names and explicit scope before it can compose these behaviours safely.

## Decision

Knowledge Islands adopts four distinct lifecycle operations.

- **CLEAN** is repository-scoped only. It removes only proven generated and vendored repository state, retains the repository's declaration and authored material, and leaves every user-level installation untouched. EDUCATE restores the generated footprint after CLEAN.
- **UNINSTALL** ends Knowledge Islands adoption at an explicitly selected scope. Repository UNINSTALL removes KI-owned repository declarations and footprint; user UNINSTALL removes KI-owned user-level installation material. Neither scope implies the other.
- **DOCTOR** is read-only at either an explicit repository or user scope. It classifies the selected state and recommends the next operation without modifying it.
- **`kisle`** is the installable command-line façade for the current public lifecycle: `kisle user install`; `kisle repo bootstrap`, `educate`, `audit`, `conform`, and `clean`; and `kisle help`. It is a zero-dependency tool owned by the `tools-kisle` repository, following the established `mgit` delivery shape, and distributed through `homebrew-tap`. Its syntax makes the `repo` or `user` scope explicit wherever both scopes exist; it does not introduce alternative lifecycle meanings.

Zero-install public launchers may obtain a temporary harness source in order to run a repository operation, but they do not constitute a user installation or modify user state merely by running.

## Consequences

The existing source-owned repository CLEAN remains correctly named and its preservation boundary is part of the public contract. It is not a partial UNINSTALL.

Repository and user UNINSTALL, repository and user DOCTOR, zero-install launchers, and `kisle` command dispatch are separate deliverables. DOCTOR and UNINSTALL join the initial `kisle` surface only once they meet this contract. Each must implement the selected scope's ownership proof and preserve material belonging to the other scope. The harness defines the lifecycle contract and integration boundary; `tools-kisle` and `homebrew-tap` own the tool and distribution work through their respective roadmaps. Documentation and command help must present EDUCATE after CLEAN as the reconstruction path, and must never suggest that CLEAN removes adoption.

## References

- [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-bootstrapping-and-self-sufficiency.md) — repository bootstrap and self-sufficiency boundary.
- [ADR-KI-HARNESS-010](ADR-KI-HARNESS-010-managed-hook-payloads-and-user-environment-binding.md) — managed user-level payload and binding boundary.
- [ADR-KI-HARNESS-011](ADR-KI-HARNESS-011-project-skill-copies-and-repository-local-links.md) — generated runtime payload ownership.
