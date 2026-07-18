---
id: 'FND-001'
title: Establish user harness installation and repository bootstrap
status: open
roadmap: foundation-tooling/establish-user-harness-installation-and-repository-bootstrap
blocks: —
blocked-by: —
---

## Context

Using the harness has three distinct journeys that are currently blurred together: installing the harness for a user, bootstrapping one repository, and opting into live local development links while authoring the harness.

An ordinary user installs the harness once to make the global keystone and process skills available to an agent runtime. When Claude Code is selected, that same installation also installs its durable hook payload.

The user then bootstraps each repository to make it self-governing and publish only its declared project-local skills.

Symlinks are useful only to a developer deliberately working from a local harness checkout; they are not a durable installation mechanism.

## Current state

`bootstrap.sh` is a zero-install repository action, but the primary getting-started guide presents it at `/harness/install` and introduces it before a normal user-level installation exists.

The hook payload has a durable regular-file installer, while the five global skills (`ki-bootstrap`, `ki-delegate`, `ki-next`, `ki-plan`, and `ki-recap`) are presently installed by a checkout-dependent symlink helper.

Documentation and harness standards consequently disagree about whether global skills are a normal installation, whether only the keystone is global, and whether `sync-skills.ts` is product delivery or a developer utility.

## Steps

1. Record the three installation contracts in a decision record and the bootstrap standard: the one-time user-harness installer owns user-space payload copies; repository bootstrap owns only the target repository; `ki-harness` owns explicit development linking from a local checkout.
2. Build one idempotent remote-safe user-harness installer at `/harness/install` that installs regular-file copies of the global core skill set into selected runtime discovery directories and, by default, installs the durable Claude hook payload when Claude Code is selected. It must use a durable managed namespace, validate its own payload, preserve unrelated user files, and never write runtime settings.
3. Keep hook registration outside the installer: chezmoi or another compliant user-environment manager reads the payload `/harness/install` has installed and manages Claude Code settings.
4. Move the development-link contract to `ki-harness`: its link helper, package scripts, checks, and developer guide are the explicit harness-author workflow. It must be clearly named and documented as development-only, while ordinary user installation neither creates nor relies on symlinks.
5. Give repository bootstrap its stable remote entry point at `/harness/repo/bootstrap` and keep it strictly repository-scoped: it may create `.ki-meta/` and project-local generated skill copies, but must not install user-global skills, hooks, or settings. It remains the direct non-agentic alternative to invoking `/ki-bootstrap` after user installation.
6. Rework the user guide into the intended order: first install the harness once for the user; then bootstrap every repository, either through `/ki-bootstrap` in an agent session or `curl -fsSL https://knowledgeislands.info/harness/repo/bootstrap | sh` for direct use. Explain runtime-specific hook binding and developer linking separately. Update the README, skill descriptions, standards, architecture records, and eval scenarios to use the same terms.
7. Add isolated filesystem tests for first installation, repeat/update installation, runtime selection, unsafe or conflicting paths, hook hand-off, repository-only bootstrap, and development-link behaviour. Confirm the normal path works after the remote source is removed.

## Files touched

- `skills/keystone/ki-bootstrap/scripts/` — user installer, repository bootstrap entry point, and developer-link helper.
- `skills/keystone/ki-bootstrap/` and `skills/repo-structure/ki-harness/` — their distinct installation and developer-link contracts, references, rubrics, and tests.
- `hooks/` and `docs/decisions/` — user-environment payload and binding boundary.
- `docs/guides/user-guide/` and `docs/guides/developer/` — the separate journeys.
- `README.md`, `skills/repo-structure/ki-harness/`, `evals/`, and generated `.ki-meta/` checker copies where their statements or tests change.

## Verify

- A clean temporary home can run the user installer, start a supported runtime with the five global skills available, and retain only regular files in managed payload locations.
- Re-running user installation is idempotent, runtime-selected, does not overwrite unrelated user files, and does not write Claude Code settings.
- A fresh repository can run `/harness/repo/bootstrap` without any user-home mutation and self-govern through `./.ki-meta/bin/` after the temporary source is gone.
- The explicit developer command alone creates local-checkout symlinks, and the normal installer replaces no user skill with a link.
- `bun run test` and `bun run ki:audit` pass.

## Dependencies / blocks

This plan makes the desired current contract directly, without a compatibility path for existing global symlink footprints; they will be reconciled by the new installer.

Hand off this website roadmap item: **Publish stable user and repository harness entry points** — bind `/harness/install` to the one-time user installer and `/harness/repo/bootstrap` to the zero-install repository bootstrap entry point. The friendly routes are the user-facing contract; no public developer-link or hook-only route is required now.
