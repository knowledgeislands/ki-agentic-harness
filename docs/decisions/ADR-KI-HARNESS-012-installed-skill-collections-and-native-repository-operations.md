---
id: ADR-KI-HARNESS-012
title: 'Installed skill collections and native repository operations'
date: 2026-07-24
status: current
type: Architecture Decision Record
type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
decision_depends_on:
  - ADR-KI-HARNESS-003
  - ADR-KI-HARNESS-006
  - ADR-KI-HARNESS-007
  - ADR-KI-HARNESS-011
---

# ADR-KI-HARNESS-012: Installed skill collections and native repository operations

## Context

Governed repositories currently receive copied checkers, aggregate runners, manifests, and runtime payloads under `.ki/`. The resulting repository-local executor is independent of user installation, but it duplicates the governance implementation into every repository and makes the public `ki repo audit` and `ki repo conform` surface a dispatcher over generated scripts rather than a native CLI capability.

Knowledge Islands needs one user-installed source of mechanical governance operations while retaining declarative repository coverage, standalone mechanical execution, explicit runtime activation, safe writes, and strict separation between user and repository state. The CLI guide assigns XDG Base Directory locations to the collection, configuration, cache, and mutable state.

## Decision

Knowledge Islands adopts one verified active installed skill collection per user, rooted at `$XDG_DATA_HOME/ki/skills` with standard XDG fallback paths. `ki skill install` acquires or atomically replaces that collection from immutable release evidence verified by the installed `ki` release. `$XDG_CONFIG_HOME/ki`, `$XDG_CACHE_HOME/ki`, and `$XDG_STATE_HOME/ki` hold configuration, disposable acquisition data, and mutable state respectively. No KI-specific home variable exists.

The `ki` tool is the native operation host. A governance skill registers compatible in-process operation metadata and implementations for its mechanical modes; `ki repo audit` and `ki repo conform` physically resolve the selected repository, read its declared `.ki-config.toml` roots, validate their explicit dependencies, resolve them only from the active installed collection, and run the resulting operations in dependency order through one shared finding and reporting model. Missing, incompatible, undeclared, or untrusted skills fail before an operation writes. `ki` never invokes legacy `govern.ts` scripts, `.ki/bin` runners, a nearby harness checkout, or an ad-hoc child-process fallback.

`ki skill add <skill> --scope repo|global` explicitly activates one installed skill. Repository scope updates the selected repository declaration and creates only managed runtime discovery links; global scope creates only managed links in the selected user runtime. Activation does not make every installed skill global. Ownership markers, containment checks, idempotence, dry-run, and refusal for altered or unfamiliar material remain mandatory.

Repository vendoring ends. Existing `.ki` runner and manifest state is examined only by an explicit, fail-closed repository migration operation; it is never used as an execution fallback and is never removed without complete ownership proof. CI and direct automation acquire the verified installed collection and invoke native `ki repo` commands rather than bootstrapping a checkout-local executor.

## Consequences

The user has one current collection version instead of per-repository checker copies. Repositories remain declarative through `.ki-config.toml`, but a clean clone requires the verified `ki` collection before its mechanical governance operations can run. CI must install that collection explicitly and fail with recovery guidance when acquisition or integrity verification fails.

Skills retain ownership of their standards and mechanical operations, but their implementations migrate from standalone vendored scripts to registered native modules. The former bootstrap aggregate, generated `.ki/bin` wrappers, repository manifest, and package-script aliases to them are retired without a compatibility path. Existing user and repository ownership protections remain part of activation and migration rather than reasons to retain the executor.

The CLI implementation owns collection acquisition, XDG resolution, registry loading, operation ordering, reporting, activation, migration, and public command grammar. The harness owns the operation registration contract and skill semantics. Release packaging and Homebrew delivery remain `tools-ki` and `homebrew-tap` responsibilities.

The exact collection layout, integrity root, registry shape, native-operation protocol, command resolution, migration boundary, and CI pinning rules are in the [installed skill collection contract](references/installed-skill-collection-contract.md).

## References

- [ADR-KI-HARNESS-003](ADR-KI-HARNESS-003-mechanical-first-agent-judgment-progressively-enhances.md) — standalone mechanical governance.
- [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-user-installation-repository-bootstrap-and-self-sufficiency.md) — separated user and repository installation scopes.
- [ADR-KI-HARNESS-007](ADR-KI-HARNESS-007-uniform-skill-modes-bare-mode-scripts-and-a-coverage-scoped-aggregate-gate.md) — universal modes and coverage-scoped aggregation.
- [ADR-KI-HARNESS-011](ADR-KI-HARNESS-011-project-skill-copies-and-repository-local-links.md) — managed runtime payload ownership.
