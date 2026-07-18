---
id: 'FND-001'
title: Establish user harness installation and repository bootstrap
status: in-progress
roadmap: foundation-tooling/establish-user-harness-installation-and-repository-bootstrap
blocks: —
blocked-by: —
---

## Context

Using the harness has three distinct journeys that are currently blurred together: installing the harness for a user, bootstrapping one repository, and deliberately linking repository-local runtime commands while developing locally.

An ordinary user installs the harness once to make the global keystone and process skills available to an agent runtime. When Claude Code is selected, that same installation also installs its durable hook payload.

The user then bootstraps each repository to make it self-governing and publish only its declared project-local skills.

Symlinks are useful only as an explicit repository-local development choice, including a future `ki-self` command surface; they are not a durable installation mechanism.

## Current state

`bootstrap.sh` is a zero-install repository action, but the primary getting-started guide presents it at `/harness/install` and introduces it before a normal user-level installation exists.

The hook payload has a durable regular-file installer, while the five global skills (`ki-bootstrap`, `ki-delegate`, `ki-next`, `ki-plan`, and `ki-recap`) are presently installed by a checkout-dependent symlink helper.

Documentation and harness standards consequently disagree about whether global skills are a normal installation, whether only the keystone is global, and whether `sync-skills.ts` is product delivery or a developer utility.

### Current script surface

Every production script has a live caller or a live role, so no script is a deletion candidate before responsibilities are split.

`bootstrap.sh` and `bootstrap.ts` currently combine the public remote repository entry point with the repository bootstrap engine.

`install-hooks.sh` and `install-hooks.ts` are a separate durable Claude hook-payload installer.

`copy-skills.ts` publishes normal project-local regular-file skill copies, while `link-skills.ts`, `link-agents.ts`, and `sync-skills.ts` create checkout-dependent links.

`project-links.ts` and `package-scripts.ts` mix the copy and link paths with runtime, configuration, and `.gitignore` helpers.

`audit.ts`, `conform.ts`, and `educate.ts` are the universal `ki-bootstrap` mode entries. `resolve.ts` and `sync-checker-modules.ts` are bootstrap-engine internals. `skill-graph.ts` and `skill-help.ts` are harness-gated whole-tree tools.

Each test follows one of those production commands and moves with its owner.

### Target script surface

`ki-bootstrap/scripts/` exposes only invocable contracts: `user-install.sh`, `repo-bootstrap.sh`, and the canonical governance mode entries `audit.ts`, `conform.ts`, and `educate.ts`.

`ki-bootstrap/scripts/lib/` holds their TypeScript implementations and private bootstrap helpers: `user-install.ts`, `repo-bootstrap.ts`, `install-claude-hook-payload.ts`, resolution, normal project payload publication, vendoring, and filesystem/configuration helpers. `user-install.sh` invokes the hook-payload implementation when Claude Code is selected. A public route never names a `lib/` path.

`ki-repo` owns deliberately linking repository-local runtime commands. Its named linker can support both a future `ki-self` surface and a harness author’s local development workflow; it replaces the current `sync-skills.ts`, `link-skills.ts`, and `link-agents.ts` responsibility. It vendors or owns every helper it needs rather than importing from `ki-bootstrap`.

`ki-harness` composes the `ki-repo` linker for harness development, but owns no special link mechanism. The harness-gated graph and help tooling remains under review in ADR-008; only development linking moves in this plan.

## Steps

1. Rewrite ADR-KI-HARNESS-006 in place as the foundational installation record: `/harness/install` is the one-time user installer; `/harness/bootstrap` is the strictly repository-scoped mechanical chain; invoking `/ki-bootstrap` after user installation is the agentic route to that same repository operation; and neither normal user installation nor repository bootstrap creates a development symlink or writes Claude settings. `ki-repo` owns deliberate repository-local command linking, which `ki-harness` composes when needed. Keep the record immediately after its prerequisite configuration decision in the curated reading order; do not create a duplicate ADR.
2. [x] Inventory every executable under `ki-bootstrap` and classify it as a user entry point, repository entry point, skill mode, internal helper, or harness-development tool. Delete only scripts with no live caller or purpose; do not rename private helpers simply to resemble public URLs.
3. Align the dependent records in place: ADR-KI-HARNESS-010 defines the hook payload as an `/harness/install` component and leaves settings registration to a compliant user-environment manager; ADR-KI-HARNESS-011 distinguishes global user payloads, project-local copied payloads, and `ki-repo` repository-local command links; ADR-KI-HARNESS-008 removes the development linker from bootstrap-engine tooling and retains only the bootstrap-engine tools it actually needs.
4. Update the bootstrap, repo, and harness standards, rubrics, and generated checker copies from those records before changing implementation, so each surface has one owner and the expected names are mechanically auditable.
5. Build the idempotent remote-safe user entry point `scripts/user-install.sh` and its `scripts/lib/user-install.ts` implementation, bound at `/harness/install`. They install regular-file copies of the global core skill set into selected runtime discovery directories and, by default, install the durable Claude hook payload when Claude Code is selected. They must use a durable managed namespace, validate their payload, preserve unrelated user files, and never write runtime settings.
6. Keep hook registration outside the installer: chezmoi or another compliant user-environment manager reads the payload `/harness/install` has installed and manages Claude Code settings. Rename `install-hooks.ts` to the internal `scripts/lib/install-claude-hook-payload.ts`, remove the standalone `install-hooks.sh` entry point, and move its tests with the internal component. No separate public hook route or shell entry point is required.
7. Rename the repository entry point `scripts/repo-bootstrap.sh` and its `scripts/lib/repo-bootstrap.ts` implementation, bound at `/harness/bootstrap`, and keep them strictly repository-scoped: they may create `.ki-meta/` and project-local generated skill copies, but must not install user-global skills, hooks, or settings. They remain the direct non-agentic alternative to invoking `/ki-bootstrap` after user installation.
8. Move the deliberate linking contract to `ki-repo`: name its commands for their explicit purpose (for example, `link-repository-commands`), so it can serve `ki-self` and harness development without becoming a `ki-harness`-only capability. `ki-harness` composes that capability for its local workflow. Move or vendor every helper under its owning script surface. Ordinary user installation neither creates nor relies on symlinks.
9. Reshape `ki-bootstrap/scripts/` around public and mode entry points: retain only the remote shell shims and universal mode entry files at the root; move TypeScript entry implementations and private helpers into `scripts/lib/`; keep all imports within the owning skill's script surface; and move tests with their named entry point or implementation.
10. Rework the user guide into the intended order: first install the harness once for the user; then bootstrap every repository, either through `/ki-bootstrap` in an agent session or `curl -fsSL https://knowledgeislands.info/harness/bootstrap | sh` for direct use. Explain runtime-specific hook binding and developer linking separately. Update the README, skill descriptions, standards, architecture records, and eval scenarios to use the same terms.
11. Add isolated filesystem tests for first installation, repeat/update installation, runtime selection, unsafe or conflicting paths, hook hand-off, repository-only bootstrap, and development-link behaviour. Confirm the normal path works after the remote source is removed.

## Files touched

- `skills/keystone/ki-bootstrap/scripts/` — user installer, repository bootstrap entry point, and developer-link helper.
- `skills/keystone/ki-bootstrap/`, `skills/keystone/ki-repo/`, and `skills/repo-structure/ki-harness/` — their distinct installation, repository-link, and composition contracts, references, rubrics, and tests.
- `hooks/` and `docs/decisions/` — user-environment payload and binding boundary.
- `docs/guides/user-guide/` and `docs/guides/developer/` — the separate journeys.
- `README.md`, `skills/repo-structure/ki-harness/`, `evals/`, and generated `.ki-meta/` checker copies where their statements or tests change.

## Verify

- A clean temporary home can run the user installer, start a supported runtime with the five global skills available, and retain only regular files in managed payload locations.
- Re-running user installation is idempotent, runtime-selected, does not overwrite unrelated user files, and does not write Claude Code settings.
- A fresh repository can run `/harness/bootstrap` without any user-home mutation and self-govern through `./.ki-meta/bin/` after the temporary source is gone.
- The explicit developer command alone creates local-checkout symlinks, and the normal installer replaces no user skill with a link.
- `bun run test` and `bun run ki:audit` pass.

## Dependencies / blocks

This plan makes the desired current contract directly, without a compatibility path for existing global symlink footprints; they will be reconciled by the new installer.

Hand off this website roadmap item: **Publish stable user and repository harness entry points**. The friendly routes are the user-facing contract; no public developer-link or hook-only route is required now.

- `https://knowledgeislands.info/harness/install` serves or redirects to `https://raw.githubusercontent.com/knowledgeislands/ki-agentic-harness/main/skills/keystone/ki-bootstrap/scripts/user-install.sh`.
- `https://knowledgeislands.info/harness/bootstrap` serves or redirects to `https://raw.githubusercontent.com/knowledgeislands/ki-agentic-harness/main/skills/keystone/ki-bootstrap/scripts/repo-bootstrap.sh`.

The website binding must preserve shell arguments, including a caller-supplied pinned ref. The raw GitHub files are implementation locations; the two `knowledgeislands.info` URLs are the stable documented interface.
