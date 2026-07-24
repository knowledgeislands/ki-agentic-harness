# Onboard a repository to native KI governance

Knowledge Islands is moving from repository-vendored runners to verified installed compatible harnesses and native `ki` operations.

The target contract is [ADR-KI-HARNESS-012](../../decisions/ADR-KI-HARNESS-012-compatible-harness-publication-and-native-operation-boundary.md).

The native skill-installation, activation, repository-maintenance, and migration commands are not yet released by `tools-ki`.

This guide therefore describes the accepted onboarding model and safe migration boundary; it does not provide commands that pretend the pending surface already works.

For released CLI commands and current availability, see [the CLI guide](command-line-interface.md).

## The target model

Each user has a verified XDG-managed compatible-harness set. The base `knowledgeislands/ki-agentic-harness` is always included; additional compatible harnesses are installed explicitly.

`ki` uses `$XDG_CONFIG_HOME/ki`, `$XDG_CACHE_HOME/ki`, and `$XDG_STATE_HOME/ki` for configuration, disposable acquisition data, and mutable state.

If those variables are unset, their standard XDG defaults are `~/.local/share`, `~/.config`, `~/.cache`, and `~/.local/state`.

Knowledge Islands does not define a separate home variable.

A repository declares its governance coverage in `.ki-config.toml` through explicit `[ki-<skill>]` roots.

The installed `ki` release will resolve those declarations and their explicit dependencies from verified installed compatible harnesses, then run registered in-process operations in dependency order.

Verified installed harnesses are authoritative: a harness checkout, a temporary download, a runtime skill link, or a repository `.ki/` directory cannot supply a missing or untrusted skill.

## The eventual onboarding flow

When the native surface is released, onboarding has four deliberate stages:

1. Install or atomically update each required verified compatible harness with the installed `ki` release.
2. Explicitly activate only required installed skills in either repository or global runtime scope.
3. Declare the repository's selected coverage in `.ki-config.toml`.
4. Run the native repository operations hosted by `ki`.

Installing a harness does not activate every capability globally.

Repository activation will update the selected repository declaration and create only managed runtime-discovery links for that repository.

Global activation will create only managed links in the selected user runtime.

Both scopes require ownership proof and containment checks, are idempotent, support dry-run, and refuse altered or unfamiliar material.

`ki-repo` owns the question of which skills a repository should declare.

## Native repository maintenance

The planned native operations are `ki repo audit` and `ki repo conform`.

They will physically resolve the selected repository, read `.ki-config.toml`, validate declared dependencies, and use verified installed harnesses' registered compatible operations.

AUDIT will be read-only.

CONFORM will apply only registered safe mechanical changes through the same shared finding and reporting model.

Missing, incompatible, undeclared, or untrusted skills must fail before a write.

The native host will not invoke copied `govern.ts` scripts, `.ki/bin` wrappers, a nearby harness checkout, or any ad-hoc child-process fallback.

These operations remain planned until the installed `ki` release lists them in HELP and completion.

## Existing vendored repositories

The former bootstrap model created `.ki/bootstrap/`, `.ki/bin/`, and manifest state in every governed repository.

That material is now a migration source, not an executor for the native model.

Migration will be a separate explicit repository operation once delivered.

It must validate required verified harnesses, the repository declaration, runtime activation ownership, and every legacy removal target before changing anything.

If any legacy state is altered, partial, unfamiliar, linked, dangling, escaping, or concurrently changed, migration must stop and preserve it as a fail-closed blocker.

Do not manually delete legacy `.ki/` state, regenerate it from a harness checkout, or use its runners while native operations are unavailable.

Legacy scripts can inform inventory and implementation tests, but their passing result does not show that a repository has native governance.

## CI and direct automation

CI will explicitly establish the required verified installed harnesses before it invokes the required native `ki repo` operation.

It must use immutable release evidence and fail with recovery guidance when acquisition, verification, registry loading, operation availability, or declared-skill resolution fails.

CI must not bootstrap a checkout-local executor or fall back to repository-vendored files.

## Scope and safety

User-owned state is limited to the XDG harness registry and data, configuration, cache, state, and user runtime activation.

Repository-owned state is limited to `.ki-config.toml`, repository runtime activation links, and registered native-operation writes.

No unscoped action infers or crosses those boundaries.

Every mutation must resolve its selected scope, prove ownership and containment, validate the complete write or removal set, and stop before a partial change when safety evidence is incomplete.

## What to do now

If you are onboarding a new repository, wait for a `tools-ki` release that exposes native harness and repository operations, then follow that release's HELP.

If you maintain an existing vendored repository, retain its legacy state until the explicit native migration operation is available.

If a project needs a coverage decision today, record it in `.ki-config.toml` through the `ki-repo` contract; do not create `.ki/bin` compatibility scaffolding around it.
