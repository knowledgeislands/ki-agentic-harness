---
id: KI-HARNESS-OPS-007
area: OPS
title: Restore source Harness CI
theme: operations
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: b2746ee7f7cb03ea0969861bd8f9d969444a9403
created_at: 2026-09-14T19:26:00Z
updated_at: 2026-09-14T19:43:00Z
---

# Restore source Harness CI

## Goal

Restore a trustworthy push gate that verifies the checked-out Harness with the released `ki` CLI while retaining released-binary provenance checks.

## Context

Seven consecutive GitHub Actions runs failed on 2026-09-13 and 2026-09-14. Released `ki` v0.3.6 embeds a Harness older than this checkout: the latest failure cannot resolve `ki-model-radar`, while an earlier run applies a roadmap contract that predates timestamps and current horizons. The workflow also uses `actions/checkout@v4`, whose Node 20 runtime now emits a retirement warning.

The released CLI already provides an isolated development-Harness route through `ki dev local set` and `ki dev local on`. A candidate fix can preserve released CLI identity and diagnostics, then explicitly validate and activate the checkout before repair and audit.

## Boundary

Do not publish or install a replacement CLI, weaken released-binary checks, mutate developer state, or infer trust from an arbitrary checkout. CI-local state must remain isolated and the source checkout must be validated before activation. Review the major checkout action update rather than applying future dependency majors automatically.

## Current state

In progress from immutable baseline `b2746ee7f7cb03ea0969861bd8f9d969444a9403`. GitHub Actions runs `34855978255` and `34884015566` establish the source-versus-embedded-contract failure. The workflow already isolates KI data, configuration, cache, and state under `${{ runner.temp }}`, verifies the released executable and version, bootstraps the runner, registers this repository, repairs it, and audits it. Released `ki` v0.3.6 supports explicit `ki dev local set/on`; official checkout tags confirm `v7.0.1` as the current v7 release.

## Steps

- [ ] Update the workflow from `actions/checkout@v4` to reviewed release `actions/checkout@v7.0.1`.
- [ ] Preserve released `ki` installation, exact executable/version assertions, regular-install diagnostics, bootstrap, and repository registration.
- [ ] After registration and before repair, validate the checked-out Harness with `ki dev local set knowledgeislands/ki-agentic-harness "$GITHUB_WORKSPACE"` and activate it with `ki dev local on knowledgeislands/ki-agentic-harness`.
- [ ] Add an explicit diagnostic assertion that the active Harness source is the checked-out development path when current CLI output provides a stable field.
- [ ] Keep the subsequent repair and audit on the released executable in isolated runner state.
- [ ] Verify workflow syntax and exercise the released-CLI development-Harness sequence locally in disposable state where feasible.

## Files touched

- `.github/workflows/ci.yml`
- Workflow-focused tests or documentation only if needed to prove ordering and regression behaviour.
- This roadmap item and batch evidence.

## Verify

- Parse `.github/workflows/ci.yml` as YAML with its existing GitHub Actions expression handling.
- Run the released `ki` v0.3.6 identity, bootstrap, registry, local-Harness activation, repair, and audit sequence in disposable XDG state where feasible.
- `bun run test`
- `bunx tsc --noEmit`
- `ki repo audit --skill ki-engineering --repo .`
- `ki repo audit --skill ki-repo-harness --repo .`
- `ki repo audit --skill ki-work-roadmap --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `git diff --check`

## Dependencies / blocks

No code dependency. The released v0.3.6 CLI already implements the required explicit local-Harness route. Remote confirmation requires a push, which remains outside this batch and will be reported as post-change evidence.

## Documentation impact

### Decision Records

No Decision Record change. This applies existing development-Harness and CI trust contracts.

### Specifications

No Specification change. Workflow ordering is repository-local operational implementation.

### Guides

No guide change expected; existing `ki-bootstrap` guidance already documents `ki dev local set/on`.

### Roadmap

Keep this record as delivery and remote-confirmation evidence. Capture any stable diagnostic gap or action-compatibility failure separately rather than weakening the gate.

## Discussion

Treat as urgent Triage because every push is currently red before meaningful repository verification. Readiness should pin the failing run evidence, exact isolated XDG state, activation order, dependency-version evidence, and a regression case where source contracts are newer than the embedded archive.
