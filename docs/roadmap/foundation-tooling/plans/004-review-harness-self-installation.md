---
id: '004'
title: Review harness self-installation of KI skills
status: open
roadmap: foundation-tooling/review-harness-self-installation-of-ki-skills
blocks: governance-consistency/005
blocked-by: foundation-tooling/003
---

## Context

The harness is both the canonical authoring source and an active local development repository.

Its own installed runtime skills should support immediate local authoring feedback, while ordinary consumer repositories receive regular copied payloads that remain standalone after the harness is absent.

## Current state

Bootstrap and project-link behaviour already distinguishes copied consumer payloads from explicit development linking. The completed checker/educator rollout confirms that `.ki-meta` is a generated mechanical surface, while `.claude/skills` and `.agents/skills` remain the separate runtime instruction surfaces this plan must govern.

The review must settle the intended symlink policy before changing generated runtime paths or consumer behaviour.

## Steps

1. Inventory every harness self-installation and consumer publication path: source `skills/`, `.claude/skills/`, `.agents/skills/`, global runtime links, agents, generated ignores, and existing development-link entrypoints.
2. Decide and document the harness-only development contract: which local runtime skill directories must link to canonical authored sources, which may remain copied, and how this differs from a consumer repository.
3. Define safe replacement rules for stale generated copies, managed symlinks, unfamiliar links, missing parents, and unsupported runtimes; preserve non-harness consumer copy semantics and never treat `.ki-meta` payloads as runtime-skill links.
4. Implement audit and conform signals for the harness's expected development-linked state, with an explicit opt-in/intent boundary where replacing a regular copy by a symlink is material.
5. Update bootstrap/linking scripts, generated excludes, runtime orientation, documentation, and tests for each supported runtime without introducing permanent legacy dual paths.
6. Verify the harness in development mode and a clean consumer fixture in copy mode; test removal of the source harness after consumer publication to prove consumer self-sufficiency.
7. Re-vendor the harness, run focused linking/publication tests, then run `bun run test` and `bun run ki:audit` sequentially.

## Files touched

- `skills/keystone/ki-bootstrap/scripts/` linking and publication logic
- `.ki-config.toml`, runtime orientation files, generated ignore rules, and linking guides
- `skills/repo-structure/ki-harness/` or other owning standards where the contract belongs
- Bootstrap/linking tests and generated harness payloads

## Verify

- The harness's declared local development runtime paths match the approved link contract.
- A clean consumer receives regular-file payloads and still works after the harness source path is unavailable.
- Managed stale copies or safe links can be repaired only with the required explicit intent; unfamiliar or unsafe links are preserved and reported.
- Harness tests and aggregate audit pass sequentially.

## Dependencies / blocks

Blocked by `foundation-tooling/003` to retain the requested delivery order.

The work must preserve the existing distinction between local development linking and consumer vendoring.
