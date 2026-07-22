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

The first deliverable for this roadmap item is therefore a reviewed user guide and CLI help manual. Implementation follows the agreed manual rather than allowing an executable's incidental parser shape to become the public interface.

## Current state

`docs/handoffs/ki/command-contract.md` defines a version-one command grammar, lifecycle semantics, output, error, and compatibility boundaries.

`docs/handoffs/ki/tools-ki.md` and `docs/handoffs/ki/homebrew-tap.md` provide receiving-repository implementation and delivery briefs.

The public onboarding guide has only a short coming-soon note, and there is no installable `ki` executable or end-user CLI manual yet.

## Steps

1. Inventory the existing CLI contract, implementation and packaging handoffs, current source-owned user/repository operations, and onboarding prose. Record the user journeys, terminology, and unresolved interface questions that the first manual must settle.
2. Write a user-facing CLI guide that explains the purpose of `ki`; its user and repository scopes; initial command groups; each command's intent, prerequisites, write boundary, dry-run or check behaviour, recovery route, and availability status. Keep the current source-owned alternatives clear while `ki` is not released.
3. Draft the canonical root and leaf HELP material from that guide, including usage, command summaries, option ownership, examples, diagnostics, reserved command behaviour, completion, and version. Make the guide and HELP mutually consistent without describing internal harness-maintainer entrypoints as public commands.
4. Reconcile the manual-derived interface decisions against `command-contract.md`, the `tools-ki` handoff, the Homebrew handoff, and affected onboarding links. Amend those contracts only for reviewed, intentional interface changes; do not implement or publish `tools-ki` in this harness plan.
5. Review the manual against representative first-use, existing governed repository, clean-and-recover, and user-install journeys. Record unresolved product decisions as explicit follow-up proposals rather than assuming them in implementation.
6. Run the relevant documentation, roadmap, and link checks; confirm that every documented command has a precise scope and current availability statement. Prepare the plan for manual acceptance before starting CLI implementation work.

## Files touched

- `docs/guides/user-guide/command-line-interface.md` (new)
- user-guide navigation and onboarding links, where the manual needs a public entry point
- `docs/handoffs/ki/command-contract.md`
- `docs/handoffs/ki/tools-ki.md`
- `docs/handoffs/ki/homebrew-tap.md`, only if the reviewed manual changes the packaging contract
- this plan and its Foundation Tooling roadmap reference

## Verify

1. A new user can distinguish `ki user ...` from `ki repo ...`, identify each command's mutation boundary and recovery route, and see that `ki` is not yet released.
2. The root and leaf help material, user guide, command contract, and receiving handoffs agree on every initial command, option, reserved path, diagnostic, and scope boundary.
3. `bun run ki:authoring:audit` and `bun run ki:repo-roadmap:audit` pass; link checks or the repository's relevant documentation tests pass when available.
4. No executable, installer, release, Homebrew formula, or external repository is created or changed by this design-and-manual plan.

## Dependencies / blocks

FND-002 is complete and no longer blocks this work.

This plan makes the public interface reviewable before the `tools-ki` implementation handoff proceeds. A stable public Website endpoint for CLEAN remains an external prerequisite for the eventual CLI implementation, not for writing the manual.
