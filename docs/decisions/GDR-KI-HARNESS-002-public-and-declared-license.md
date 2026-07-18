# GDR-KI-HARNESS-002: Public repos and a declared license, decoupled from visibility

**Date:** 2026-07-09

## Context

The `ki-repo` standard coupled license to visibility: a public repo had to carry MIT, a private repo a proprietary LICENSE and `"UNLICENSED"` in `package.json`. That coupling baked a policy into the checker — "public means MIT" — and left no way for a repo to be public under a different license, or to state its license as an explicit fact. Separately, the earlier direction kept `ki-plugins` private; but the harness is the source and the plugin set is its projection ([ADR-KI-HARNESS-002](ADR-KI-HARNESS-002-naming-model-and-harness-as-source.md)), and a governance skill set is only useful if it can be installed from source — which wants public repos.

## Decision

Knowledge Islands repos are **public by default** (installable from source), and each repo **declares its license** as an SPDX id, decoupled from visibility.

- `[ki-repo]` gains a `license` field — an SPDX id (e.g. `MIT`, `Apache-2.0`), or `UNLICENSED`/`proprietary` for all-rights-reserved — **defaulting to MIT** when unset. choosealicense.com is the picker and the REFRESH source.
- The `license`, `license-file`, and `package-license` checks verify that the **live GitHub license, the `LICENSE` file, and `package.json` `"license"` all match the declared-or-default id**. A proprietary declaration expects no recognised OSI license on GitHub and `"UNLICENSED"` in `package.json`.
- Visibility remains a separate, independently-declared-and-checked fact. A private repo may be MIT; a public repo may be proprietary — `ki-plugins`, for one, is public with a proprietary license declared, and the audit passes it.

## Consequences

- The checker does not encode "public ⇒ MIT" — license policy is data in each repo's `.ki-config.toml`, not a constant in `audit-repo.ts`.
- The **mechanism** is built harness-only in this program; the **actual visibility flips** across the sibling fleet are guide-driven and roll out per repo.
- The harness itself is now reconciled — it declares `license = "MIT"` in `.ki-config.toml`, ships a matching MIT `LICENSE` file and `package.json`, and is public — so a live `ki:repo:audit` of the harness agrees on all three.
- A repo that wants a non-default license states it once in `[ki-repo]` `license`; the three artifacts are then checked against it uniformly.

## References

- [ADR-KI-HARNESS-002](ADR-KI-HARNESS-002-naming-model-and-harness-as-source.md) — harness-as-source vs plugin-as-projection, which this makes installable.
- [ADR-KI-HARNESS-005](ADR-KI-HARNESS-005-validate-down-ki-config-contract.md) — the `.ki-config.toml` contract the `license` field extends.
