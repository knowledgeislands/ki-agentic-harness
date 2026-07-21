---
id: 'FND-018'
title: Establish the Knowledge Islands command-line interface (CLI)
status: in-progress
roadmap: foundation-tooling/establish-the-knowledge-islands-command-line-interface-cli
blocks: —
blocked-by: —
handoff: true
tier: sonnet
readiness: 2026-07-21
---

## Context

`ki` is the Knowledge Islands command-line interface (CLI): the stable end-user façade for lifecycle operations, distinct from the `.ki/` repository directory and harness-maintainer scripts.

Its implementation belongs in the zero-dependency `tools-ki` repository and release delivery in `homebrew-tap`; this harness owns lifecycle semantics and the implementation-ready handoff.

## Current state

The public bootstrap path, source-owned repository operations, and user installation exist as separate surfaces with no common installed command. The harness now has a complete, reviewed contract under the former provisional identity; this revision makes `ki` the canonical command, receiving repository, formula, and contract path before external implementation begins.

`ODR-KI-HARNESS-001` defines the intended command family but leaves external parser, versioning, exit/reporting, release integration, and Website delivery to receiving work.

## Steps

1. ✓ Define a complete grammar for `ki user install`; `ki repo bootstrap`, `educate`, `audit`, `conform`, and `clean`; plus HELP. Reserve scope-explicit DOCTOR and UNINSTALL forms without exposing them until their implementations meet the lifecycle contract. Define arguments, defaults, output streams, exit codes, idempotence, dry-run forwarding, and error messages.
2. ✓ Specify runtime-independent dispatch boundaries. Distinguish temporary-source repository operations from user installation, ensure no command silently broadens scope or invokes harness-maintainer utilities, and define how installed skills, public web launchers, and repository-local vendored commands relate without duplicating lifecycle meanings.
3. ✓ Write an implementation-ready cross-repository handoff for `tools-ki`: zero-dependency constraints, command parser, platform assumptions, sourcing and pinning policy, integrity/error handling, shell completion, semantic versioning, test matrix, and compatibility contract. Add the corresponding `homebrew-tap` formula/release handoff requirements.
4. ✓ Align this harness's public help, onboarding, zero-install examples, and future `.ki/` layout language with the agreed command surface. Keep unavailable commands visibly coming soon rather than implying a local harness script is the installed CLI.
5. ✓ Validate the handoff against concrete bootstrap, clean, audit, and conform invocations in a temporary repository. Create only agreed external-roadmap or handoff artifacts; do not create, publish, install, or release `tools-ki` or a Homebrew formula from this repository plan.
6. Rename the provisional command identity to `ki` consistently across the command contract, handoff paths, receiving repository, formula, roadmap locator, decision record, and guides. Re-run documentation and roadmap checks before renewed acceptance.

## Files touched

- `docs/decisions/`, user guides, public HELP, lifecycle references, and roadmap projections in this harness.
- implementation-ready handoff artifacts and receiving-roadmap references for `tools-ki` and `homebrew-tap`.
- no production command implementation outside this repository without an explicit receiving-repository task.

## Verify

1. Every initial `ki` command has unambiguous scope, arguments, output, exit, and dry-run semantics grounded in FND-016.
2. The handoff lets `tools-ki` implement and test the CLI without re-deciding lifecycle ownership or reaching into harness-maintainer internals.
3. Documentation distinguishes available repository launchers from the future installed CLI; no legacy command name, repository name, or stale handoff path remains.
4. Relevant documentation checks, `bun run test`, and `bun run ki:audit` pass.

## Dependencies / blocks

FND-016 supplies the stable lifecycle operation boundary that `ki` exposes. FND-017 DOCTOR and later UNINSTALL work may extend the CLI only after their scoped contracts are complete.

## Decisions

**Locked:** `ki` is the Knowledge Islands command-line interface (CLI). The initial grammar, dispatch, output, exit, pinning, compatibility, and reserved-command rules are defined in the [`ki` CLI contract](../../../handoffs/ki/command-contract.md). The [`tools-ki`](../../../handoffs/ki/tools-ki.md) and [`homebrew-tap`](../../../handoffs/ki/homebrew-tap.md) briefs assign implementation and packaging without moving lifecycle ownership out of this harness.

**Escalate:** the Website must publish and stability-test the repository-operation launcher route before `tools-ki` can dispatch CLEAN through a public endpoint. Receiving repositories and releases remain external work and are not created by this plan.

## Readiness

The cold-agent test passed on 2026-07-21: the contract and receiving briefs let an executor begin the parser and formula units without this session. The missing public Website route remains an explicit external prerequisite rather than an implementation choice.

## Validation evidence

On 2026-07-21, source-harness temporary-repository fixtures passed the bootstrap public entrypoint, package-free aggregate AUDIT/CONFORM dry-run parity, CLEAN dry-run/recovery, and scoped repository UNINSTALL checks. This validates public and vendored boundaries named by the handoff; it does not simulate an unavailable `ki` binary or author external release work.

## Delegation

- Round 1 — judgment: a `gpt-5.6-sol` worker derives the `ki` grammar and receiving-repository handoff from the committed FND-016 lifecycle contract; files: this plan and handoff artifacts only; gate: each command has a scope, source boundary, dry-run, output, and exit contract.
- Round 2 — mechanical: a `gpt-5.6-terra` worker may align independent harness documentation after the grammar is approved; gate: documentation and roadmap checks.
- Orchestrator: reviews the handoff for cross-repository ownership, preserves the prohibition on external publication, and runs final verification.
