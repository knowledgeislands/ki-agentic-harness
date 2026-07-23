---
id: 'FND-003'
title: Define the KI CLI user guide and help manual
status: in-progress
roadmap: foundation-tooling/build-and-deepen-the-knowledge-islands-command-line-interface-cli
blocks: —
blocked-by: GOV-001
---

## Context

`ki` is intended to be the Knowledge Islands command-line interface (CLI): a stable end-user façade over user- and repository-scoped lifecycle operations.

The harness already holds an initial grammar and implementation handoffs, but those are contract and engineering documents rather than a guide a person can use to understand what `ki` is for, which commands are safe at each scope, and how to recover when a repository has not yet been bootstrapped.

The first deliverable for this roadmap item is therefore a reviewed user guide and CLI help manual. The first implementation slice follows that manual: the bootstrap seed makes `ki` available on `PATH`, and `ki doctor` gives a deliberately small coming-soon response. The fuller operational interface follows the agreed manual rather than allowing an executable's incidental parser shape to become the public interface.

## Current state

The user guide, CLI contract, and receiving handoff now agree on the staged release: the seed offers HELP, version, completion, installation, and root `ki doctor`; `ki acquire` is the next reserved substantive command; broader user and repository lifecycle leaves remain planned.

`-/_HANDOFFS/ki/tools-ki.md` and `-/_HANDOFFS/ki/homebrew-tap.md` provide receiving-repository implementation and delivery briefs. `tools-ki` now has open CLI-001 and CLI-002 plans; CLI-001 owns the seed implementation and CLI-002 owns the first acquisition command.

There is still no installable `ki` executable. Bootstrap currently leaves users with repository-local `.ki/bin` commands rather than a single `ki` command on `PATH`; CLI-001 owns the seed implementation against this settled manual.

## Steps

1. [x] Inventory the existing CLI contract, implementation and packaging handoffs, current source-owned user/repository operations, and onboarding prose. Record the user journeys, terminology, and unresolved interface questions that the first manual must settle.
2. [x] Define the bootstrap seed contract: the one-time route that installs or updates the minimal `ki` executable in a user command directory, provides an exact `PATH` recovery message when needed, and then delegates repository work through `ki`. Keep the initial bootstrap bridge minimal and do not make every current `.ki/bin` operation disappear at once.
3. [x] Write a user-facing CLI guide that explains the purpose of `ki`; its user and repository scopes; initial command groups; each command's intent, prerequisites, write boundary, dry-run or check behaviour, recovery route, and availability status. Make root `ki doctor` the initial small public command: it reports that diagnostics are coming soon without inspecting or changing either scope.
4. [x] Draft the canonical root and leaf HELP material from that guide, including usage, command summaries, option ownership, examples, diagnostics, reserved command behaviour, completion, and version. Make the guide and HELP mutually consistent without describing internal harness-maintainer entrypoints as public commands.
5. [x] Reconcile the manual-derived interface decisions against `command-contract.md`, the `tools-ki` handoff, the Homebrew handoff, and affected onboarding links. Replace the permanent rejection of root `ki doctor` with its deliberately minimal initial contract; distinguish it from future scope-specific diagnostics. Do not implement or publish the broader `tools-ki` lifecycle in this harness plan.
6. [x] Confirm that the receiving CLI plan adopts the exact seed-installation and `ki doctor` contract. Its owner implements and tests that vertical slice, including availability after installation, no user- or repository-scope inspection or mutation, and an honest coming-soon response; do not duplicate that implementation in this harness.
7. [x] Review the manual against representative first-use, existing governed repository, clean-and-recover, and user-install journeys. Record unresolved product decisions as explicit follow-up proposals rather than assuming them in implementation.
8. [x] Run the relevant documentation, roadmap, and link checks; confirm that every documented command has a precise scope and current availability statement. Prepare the plan for manual acceptance before broader CLI implementation work.

## Files touched

- `docs/guides/user-guide/command-line-interface.md` (new)
- user-guide navigation and onboarding links, where the manual needs a public entry point
- `-/_HANDOFFS/ki/command-contract.md`
- `-/_HANDOFFS/ki/tools-ki.md`
- `-/_HANDOFFS/ki/homebrew-tap.md`, only if the reviewed manual changes the packaging contract
- receiving-repository roadmap and plan material for the seed and `ki doctor` slice, once the `tools-ki` repository exists and accepts the handoff
- this plan and its Foundation Tooling roadmap reference

## Verify

1. A new user can distinguish `ki user ...` from `ki repo ...`, identify each command's mutation boundary and recovery route, and understand the initial availability of `ki doctor`.
2. The root and leaf help material, user guide, command contract, and receiving handoffs agree on every initial command, option, reserved path, diagnostic, and scope boundary.
3. The seed-installation and `ki doctor` contract gives the receiving CLI plan an exact user command directory, PATH recovery route, and no-inspection/no-mutation boundary.
4. `bun run ki:authoring:audit` and `bun run ki:repo-roadmap:audit` pass; link checks or the repository's relevant documentation tests pass when available.
5. This harness plan creates no broader executable lifecycle, release, Homebrew formula, or CLI implementation; those remain separately owned by the adopted `tools-ki` roadmap and plans.

## Dependencies / blocks

The working-area convention is settled, and FND-003 is structurally unblocked by completed foundation work.

GOV-001 now establishes the KAF acquisition boundary and initial `ki acquire` contract. FND-003 must use those decisions when it defines the public CLI manual, rather than treating acquisition as an incidental future command.

This plan makes the public interface reviewable before the broader `tools-ki` implementation handoff proceeds. The first seed and `ki doctor` slice should be adopted by a receiving-repository roadmap and plan; a stable public Website endpoint for CLEAN remains an external prerequisite for the eventual lifecycle implementation, not for writing the manual or the coming-soon command.
