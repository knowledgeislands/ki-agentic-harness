---
id: 'FND-018'
title: Establish the installable kisle command-line interface
status: in-progress
roadmap: foundation-tooling/establish-the-installable-kisle-command-line-interface
blocks: —
blocked-by: —
handoff: true
tier: sonnet
readiness: 2026-07-21
---

## Context

`kisle` is the stable end-user façade for Knowledge Islands lifecycle operations, distinct from the `.ki/` repository directory and from harness-maintainer scripts.

Its implementation belongs in the zero-dependency `tools-kisle` repository and release delivery in `homebrew-tap`; this harness owns the lifecycle semantics and the implementation-ready handoff.

## Current state

The public bootstrap path, source-owned repository operations, and user installation components exist as separate surfaces with no common installable command.

`ODR-KI-HARNESS-001` defines the intended initial command family but leaves command parsing, versioning, exit/reporting, handoff, and release integration unresolved.

## Steps

1. ✓ Derive a complete command grammar from FND-016: `kisle user install`; `kisle repo bootstrap`, `educate`, `audit`, `conform`, and `clean`; plus HELP. Reserve scope-explicit DOCTOR and UNINSTALL forms without exposing them until their implementations meet the lifecycle contract. Define arguments, defaults, output streams, exit codes, idempotence, dry-run forwarding, and error messages.
2. ✓ Specify runtime-independent dispatch boundaries. Distinguish temporary-source repository operations from user installation, ensure no command silently broadens scope or invokes harness-maintainer utilities, and define how installed skills, public web launchers, and repository-local vendored commands relate without duplicating lifecycle meanings.
3. ✓ Write an implementation-ready cross-repository handoff for `tools-kisle`: zero-dependency constraints, command parser, platform assumptions, sourcing and pinning policy, integrity/error handling, shell completion, semantic versioning, test matrix, and compatibility contract. Add the corresponding `homebrew-tap` formula/release handoff requirements.
4. ✓ Align this harness's public help, onboarding, zero-install examples, and future `.ki/` layout language with the agreed command surface. Keep unavailable commands visibly coming soon rather than implying a local harness script is the installed CLI.
5. ✓ Validate the handoff against concrete bootstrap, clean, audit, and conform invocations in a temporary repository. Create only agreed external-roadmap or handoff artifacts; do not create, publish, install, or release `tools-kisle` or a Homebrew formula from this repository plan.

## Files touched

- `docs/decisions/`, user guides, public HELP, and lifecycle references in this harness.
- an implementation-ready handoff artifact and receiving-roadmap references for `tools-kisle` and `homebrew-tap`.
- no production command implementation outside this repository without an explicit receiving-repository task.

## Verify

1. Every initial command has unambiguous scope, arguments, output, exit, and dry-run semantics grounded in FND-016.
2. The handoff lets `tools-kisle` implement and test the CLI without re-deciding lifecycle ownership or reaching into harness-maintainer internals.
3. Documentation distinguishes available repository launchers from the future installed CLI and does not claim the unavailable bare `ki` name.
4. Relevant documentation checks, `bun run test`, and `bun run ki:audit` pass.

## Dependencies / blocks

FND-016 supplies the stable lifecycle operation boundary that `kisle` exposes.

FND-017 DOCTOR and later UNINSTALL work may extend the CLI only after their own scoped contracts are complete.

## Decisions

**Locked:** the initial grammar, dispatch, output, exit, pinning, compatibility, and reserved-command rules are defined in the [`kisle` command contract](../../../handoffs/kisle/command-contract.md). The [`tools-kisle`](../../../handoffs/kisle/tools-kisle.md) and [`homebrew-tap`](../../../handoffs/kisle/homebrew-tap.md) briefs assign the implementation and packaging work without moving lifecycle ownership out of this harness.

**Escalate:** the Website must publish and stability-test the repository-operation launcher route before `tools-kisle` can dispatch CLEAN through a public endpoint. The receiving repositories and their releases remain external work and are not created by this plan.

## Readiness

The cold-agent test passed on 2026-07-21: the command grammar and receiving briefs let an executor begin the parser and formula units without access to this session. The one missing public Website route is isolated as an explicit external prerequisite rather than an implementation choice.

## Validation evidence

On 2026-07-21, the source harness temporary-repository fixtures passed the bootstrap public entrypoint, package-free aggregate AUDIT and CONFORM dry-run parity, CLEAN dry-run and recovery, and scoped repository UNINSTALL checks. This validates the public and vendored command boundaries that the handoff names; it does not simulate an unavailable `kisle` binary or author external release work.

## Delegation

- Round 1 — judgment: a `gpt-5.6-sol` worker derives the initial `kisle` grammar and a receiving-repository handoff from the committed FND-016 lifecycle contract; files: this plan and the proposed handoff artifact only; gate: every command has a scope, source boundary, dry-run, output, and exit contract.
- Round 2 — mechanical: a `gpt-5.6-terra` worker may align independent harness documentation after the grammar is approved; gate: documentation and roadmap checks.
- Orchestrator: reviews the handoff for cross-repository ownership, preserves the prohibition on external publication, and runs final verification.
