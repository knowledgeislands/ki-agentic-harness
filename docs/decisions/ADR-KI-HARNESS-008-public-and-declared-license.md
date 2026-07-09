# ADR-KI-HARNESS-008: Public repos and a declared license, decoupled from visibility

**Date:** 2026-07-09

## Context

The repo standard coupled license to visibility: a public repo had to carry MIT, a private repo a proprietary LICENSE and `"UNLICENSED"` in `package.json`. That coupling baked a policy into the checker — "public means MIT" — and left no way for a repo to be public under a different license, or to state its license as an explicit fact. Separately, the earlier direction kept `ki-plugins` private; but the harness is the source and the plugin set is its projection ([ADR-KI-HARNESS-005](ADR-KI-HARNESS-005-naming-model-and-harness-as-source.md)), and a governance skill set is only useful if it can be installed from source — which wants public repos.

## Decision

Knowledge Islands repos are **public by default** (installable from source), and each repo **declares its license** as an SPDX id, decoupled from visibility.

- `[ki-repo]` gains a `license` field — an SPDX id (e.g. `MIT`, `Apache-2.0`), or `UNLICENSED`/`proprietary` for all-rights-reserved — **defaulting to MIT** when unset. [choosealicense.com](https://choosealicense.com/) is the picker and the REFRESH source.
- The `license`, `license-file`, and `package-license` checks verify that the **live GitHub license, the `LICENSE` file, and `package.json` `"license"` all match the declared-or-default id**. A proprietary declaration expects no recognised OSI license on GitHub and `"UNLICENSED"` in `package.json`.
- Visibility remains a separate, independently-declared-and-checked fact. A private repo may be MIT; a public repo may be proprietary. This supersedes the ki-plugins-private direction: `ki-plugins` declares its proprietary license and stays public with no FAIL.

## Consequences

- The checker no longer encodes "public ⇒ MIT" — license policy is data in each repo's `.ki-config.toml`, not a constant in `audit-repo.ts`.
- The **mechanism** is built harness-only in this program; the **actual visibility flips** (the harness and the sibling fleet going public) are the deferred, guide-driven rollout, not done here.
- The harness declares `license = "MIT"` as intent; reconciling its own live LICENSE, `package.json`, and GitHub visibility is part of that deferred rollout, so a live `ki:repo:audit` of the harness reports those until then.
- A repo that wants a non-default license states it once in `[ki-repo]` `license`; the three artifacts are then checked against it uniformly.

## References

- [ADR-KI-HARNESS-005](ADR-KI-HARNESS-005-naming-model-and-harness-as-source.md) — harness-as-source vs plugin-as-projection, which this makes installable.
- [repo-standard.md](../../skills/ki-repo/references/repo-standard.md) — the license and visibility checks in full.
- [ADR-KI-HARNESS-CONFIG-001](ADR-KI-HARNESS-CONFIG-001-validate-down-ki-config-contract.md) — the `.ki-config.toml` contract the `license` field extends.
