# The bootstrap standard — installed skill collections and native repository operations

This standard implements the architecture in [ADR-KI-HARNESS-012](../../../../docs/decisions/ADR-KI-HARNESS-012-installed-skill-collections-and-native-repository-operations.md).

It replaces the former repository-vendored executor model.

## Contents

- [Delivery status and terminology](#delivery-status-and-terminology)
- [Authoritative installed collection](#authoritative-installed-collection)
- [Declarative repository selection](#declarative-repository-selection)
- [Native operation registration and execution](#native-operation-registration-and-execution)
- [Managed runtime activation](#managed-runtime-activation)
- [Explicit legacy migration](#explicit-legacy-migration)
- [CI and direct automation](#ci-and-direct-automation)
- [Scope and safety separation](#scope-and-safety-separation)

## Delivery status and terminology

The native `ki` surface described here is the accepted target contract, but its implementation belongs to `tools-ki` and is not yet released.

Accordingly, command names in this standard describe required future behaviour; they are not executable instructions until the installed release exposes them.

The existing harness bootstrap engine, copied checkers, generated `.ki/bin` wrappers, manifests, and legacy lifecycle scripts are migration sources only.

They do not define a supported native operation and are never an execution fallback.

## Authoritative installed collection

One verified active skill collection exists per user at `$XDG_DATA_HOME/ki/skills`.

`ki` uses `$XDG_CONFIG_HOME/ki` for configuration, `$XDG_CACHE_HOME/ki` for disposable acquisition data, and `$XDG_STATE_HOME/ki` for mutable state.

When unset, the standard XDG defaults are `~/.local/share`, `~/.config`, `~/.cache`, and `~/.local/state`.

No KI-specific home variable is valid.

`ki skill install` must acquire or atomically replace the active collection from immutable release evidence verified by the installed `ki` release.

The installed collection is the sole source of registered skills and operations.

A local harness checkout, a cached temporary acquisition, an external collection, a repository `.ki/` directory, or a runtime-discovery link cannot supply a missing skill or substitute for integrity verification.

If the collection is unavailable, untrusted, or incompatible, the command must fail with recovery guidance before repository or runtime state changes.

## Declarative repository selection

`.ki-config.toml` declares the governance coverage of one repository through explicit `[ki-<skill>]` roots.

`ki-repo` owns the file's schema, creation, and coverage cascade.

The native resolver physically resolves the selected repository, reads those declarations, validates every explicit dependency, and resolves only the selected skills from the active installed collection.

Dependencies must be declared explicitly; a resolver must not inject a baseline, infer an undeclared skill, or silently rename a declaration.

Missing, incompatible, undeclared, or untrusted skills are fail-closed errors before an operation writes.

## Native operation registration and execution

A governance skill registers compatible in-process metadata and implementations for its mechanical operations.

`ki repo audit` and `ki repo conform` use that registry to execute declared operations in dependency order and report findings through one shared model.

Scoped execution may run only a declared compatible skill.

The host must not execute `scripts/govern.ts`, `.ki/bin` wrappers, copied checkers, a nearby harness checkout, or an ad-hoc child process as a fallback.

AUDIT is read-only.

CONFORM performs only registered safe mechanical writes, preserves the repository boundary, and re-audits according to its operation contract.

## Managed runtime activation

Collection installation and runtime activation are separate.

Installing a collection does not activate every installed skill globally.

`ki skill add <skill> --scope repo|global` explicitly activates one installed skill:

- Repository scope updates only the selected repository declaration and creates only managed runtime-discovery links for that repository.
- Global scope creates only managed links for the selected user runtime and does not alter repository coverage.

Activation must respect the selected runtime and its discovery location.

It must record ownership, validate containment, be idempotent, support dry-run, and refuse altered, unfamiliar, partial, or escaping material.

No operation may traverse or erase unproven links or files.

## Explicit legacy migration

Vendored repository execution is retired.

Existing `.ki/bootstrap/`, `.ki/bin/`, and manifest state are examined only by an explicit repository migration operation.

Migration validates the active collection, repository declaration, target ownership, and complete removal set before writing.

It removes generated legacy material only when it proves ownership of every target; a changed, dangling, linked, partial, unfamiliar, or concurrently changed footprint is left in place and reported as a fail-closed blocker.

Migration never runs legacy material to complete a native operation, never silently cleans up, and never treats legacy state as proof that native operations are available.

Before the migration operation ships, existing legacy code is useful for inventory and tests only.

Do not direct users to manually remove `.ki/` state, recreate it from a checkout, or use it as a compatibility runner.

## CI and direct automation

CI and direct automation explicitly acquire the verified installed collection, then invoke the native `ki repo` operation required by the repository declaration.

They must pin or otherwise verify immutable release evidence according to the installed CLI's trust contract.

If acquisition, verification, registry loading, or declared-skill resolution fails, automation fails rather than falling back to vendored files or a checkout-local executor.

Recovery guidance must identify the failed layer: CLI release, collection acquisition, collection integrity, repository declaration, compatibility, or operation availability.

## Scope and safety separation

User state comprises the XDG-owned collection, configuration, cache, state, and global runtime activation.

Repository state comprises `.ki-config.toml`, repository-scope activation links, and registered native-operation writes.

No unscoped operation infers or crosses either boundary.

Every mutating operation resolves its selected scope first, calculates and validates its complete write or removal set, and refuses unsafe state before any partial change.
