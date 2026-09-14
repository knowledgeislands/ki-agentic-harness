---
id: KI-HARNESS-OPS-007
area: OPS
title: Restore source Harness CI
theme: operations
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: b2746ee7f7cb03ea0969861bd8f9d969444a9403
created_at: 2026-09-14T19:26:00Z
updated_at: 2026-09-14T19:55:00Z
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

- [x] Update the workflow from `actions/checkout@v4` to reviewed release `actions/checkout@v7.0.1`.
- [x] Preserve released `ki` installation, exact executable/version assertions, regular-install diagnostics, bootstrap, and repository registration.
- [x] After registration and before repair, validate the checked-out Harness with `ki dev local set knowledgeislands/ki-agentic-harness "$GITHUB_WORKSPACE"` and activate it with `ki dev local on knowledgeislands/ki-agentic-harness`.
- [x] Add an explicit diagnostic assertion that the active Harness source is the checked-out development path when current CLI output provides a stable field.
- [x] Keep the subsequent repair and audit on the released executable in isolated runner state.
- [x] Verify workflow syntax and exercise the supported v0.3.6 behaviour through source evidence and existing isolated CLI tests; reserve hosted-runner download proof for the next push.

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

## Review

### Delivered

Baseline `b2746ee7f7cb03ea0969861bd8f9d969444a9403`; implementation commit `4f260a4f` restores source-Harness selection in CI and refreshes the checkout action.

### Summary of changes

The workflow now uses `actions/checkout@v7.0.1`. It continues to download and prove released `ki` v0.3.6, bootstrap isolated runner state, and register the repository. Before repair, it resolves the workspace to a canonical path, validates that source through `ki dev local set`, activates it through `ki dev local on`, and asserts the diagnostic `source:` and `mode: on` fields. Repair, native audit, and Harness tests therefore run through the released executable against the checked-out Harness contract.

### Verification

- Bun's YAML parser accepts the workflow and finds the expected six steps.
- Official `actions/checkout` tags confirm `v7.0.1`; the action uses the current Node 24 runtime.
- Released tools-ki v0.3.6 source, specifications, and isolated tests confirm the exact set/on grammar, checkout revalidation, and stable diagnostic fields.
- The focused Claude publication fixture passed after one unrelated initial full-suite timeout; a complete isolated full-suite rerun passed.
- `bunx tsc --noEmit`, `git diff --check`, and the `ki-engineering`, `ki-repo-harness`, `ki-work-roadmap`, and `ki-authoring` audits pass.

### Outstanding concerns

Only a GitHub-hosted run can prove the released-download and hosted-runner path end to end. Push remains outside this batch, so remote confirmation is deferred to the next authorised push. One unrelated filesystem-heavy publication fixture timed out in the first full-suite run and passed alone and in the clean full rerun; retain as watch evidence unless it recurs.

### Post-change review

The change applies existing bootstrap and local-development contracts without changing public semantics. It strengthens rather than weakens trust: both released executable provenance and the exact source checkout are asserted. No developer state, release, credential, or external repository changed.

### Mini recap

CI can now test a Harness newer than the CLI's embedded archive while still proving the released CLI binary and explicitly validating the source it activates.

## Discussion

Treat as urgent Triage because every push is currently red before meaningful repository verification. Readiness should pin the failing run evidence, exact isolated XDG state, activation order, dependency-version evidence, and a regression case where source contracts are newer than the embedded archive.
