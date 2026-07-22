---
id: 'FND-003'
title: Define the KI CLI user guide and help manual
status: open
roadmap: foundation-tooling/build-and-deepen-the-knowledge-islands-command-line-interface-cli
blocks: —
blocked-by: —
---

## Context

`ki` is intended to be the Knowledge Islands command-line interface (CLI): a stable end-user façade over user- and repository-scoped lifecycle operations.

The harness already holds an initial grammar and implementation handoffs, but those are contract and engineering documents rather than a guide a person can use to understand what `ki` is for, which commands are safe at each scope, and how to recover when a repository has not yet been bootstrapped.

The first deliverable for this roadmap item is therefore a reviewed user guide and CLI help manual. The first implementation slice follows that manual: the bootstrap seed makes `ki` available on `PATH`, and `ki doctor` gives a deliberately small coming-soon response. The fuller operational interface follows the agreed manual rather than allowing an executable's incidental parser shape to become the public interface.

## Current state

`docs/handoffs/ki/command-contract.md` defines a version-one command grammar, lifecycle semantics, output, error, and compatibility boundaries, but it currently rejects unscoped `ki doctor` permanently.

`docs/handoffs/ki/tools-ki.md` and `docs/handoffs/ki/homebrew-tap.md` provide receiving-repository implementation and delivery briefs.

The public onboarding guide has only a short coming-soon note, and there is no installable `ki` executable or end-user CLI manual yet. Bootstrap currently leaves users with repository-local `.ki/bin` commands rather than a single `ki` command on `PATH`.

## Steps

1. Inventory the existing CLI contract, implementation and packaging handoffs, current source-owned user/repository operations, and onboarding prose. Record the user journeys, terminology, and unresolved interface questions that the first manual must settle.
2. Define the bootstrap seed contract: the one-time route that installs or updates the minimal `ki` executable in a user command directory, provides an exact `PATH` recovery message when needed, and then delegates repository work through `ki`. Keep the initial bootstrap bridge minimal and do not make every current `.ki/bin` operation disappear at once.
3. Write a user-facing CLI guide that explains the purpose of `ki`; its user and repository scopes; initial command groups; each command's intent, prerequisites, write boundary, dry-run or check behaviour, recovery route, and availability status. Make root `ki doctor` the initial small public command: it reports that diagnostics are coming soon without inspecting or changing either scope.
4. Draft the canonical root and leaf HELP material from that guide, including usage, command summaries, option ownership, examples, diagnostics, reserved command behaviour, completion, and version. Make the guide and HELP mutually consistent without describing internal harness-maintainer entrypoints as public commands.
5. Reconcile the manual-derived interface decisions against `command-contract.md`, the `tools-ki` handoff, the Homebrew handoff, and affected onboarding links. Replace the permanent rejection of root `ki doctor` with its deliberately minimal initial contract; distinguish it from future scope-specific diagnostics. Do not implement or publish the broader `tools-ki` lifecycle in this harness plan.
6. Implement and test only the seed-installation and `ki doctor` vertical slice in the receiving CLI repository once its local roadmap and plan adopt this handoff. Verify that the command is available after installation, that it performs no user- or repository-scope inspection or mutation, and that its output gives an honest coming-soon route.
7. Review the manual against representative first-use, existing governed repository, clean-and-recover, and user-install journeys. Record unresolved product decisions as explicit follow-up proposals rather than assuming them in implementation.
8. Run the relevant documentation, roadmap, and link checks; confirm that every documented command has a precise scope and current availability statement. Prepare the plan for manual acceptance before broader CLI implementation work.

## Files touched

- `docs/guides/user-guide/command-line-interface.md` (new)
- user-guide navigation and onboarding links, where the manual needs a public entry point
- `docs/handoffs/ki/command-contract.md`
- `docs/handoffs/ki/tools-ki.md`
- `docs/handoffs/ki/homebrew-tap.md`, only if the reviewed manual changes the packaging contract
- receiving-repository roadmap and plan material for the seed and `ki doctor` slice, once the `tools-ki` repository exists and accepts the handoff
- this plan and its Foundation Tooling roadmap reference

## Verify

1. A new user can distinguish `ki user ...` from `ki repo ...`, identify each command's mutation boundary and recovery route, and understand the initial availability of `ki doctor`.
2. The root and leaf help material, user guide, command contract, and receiving handoffs agree on every initial command, option, reserved path, diagnostic, and scope boundary.
3. The seed installer makes `ki` available through the documented user command directory or gives a direct recovery instruction; `ki doctor` makes no filesystem, repository, network, or child-process inspection beyond rendering its fixed coming-soon response.
4. `bun run ki:authoring:audit` and `bun run ki:repo-roadmap:audit` pass; link checks or the repository's relevant documentation tests pass when available.
5. No broader executable lifecycle, release, Homebrew formula, or external repository is created or changed before the receiving repository explicitly adopts its own roadmap item and plan.

## Dependencies / blocks

FND-002 is complete and no longer blocks this work.

This plan makes the public interface reviewable before the broader `tools-ki` implementation handoff proceeds. The first seed and `ki doctor` slice should be adopted by a receiving-repository roadmap and plan; a stable public Website endpoint for CLEAN remains an external prerequisite for the eventual lifecycle implementation, not for writing the manual or the coming-soon command.
