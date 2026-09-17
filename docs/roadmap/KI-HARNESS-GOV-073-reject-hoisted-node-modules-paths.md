---
id: KI-HARNESS-GOV-073
area: GOV
title: Reject node_modules paths
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 789b8ea8c0d32f486f72ad7a7d0eb2757baad28f
created_at: 2026-09-17T16:53:09Z
updated_at: 2026-09-17T21:38:27Z
---

# Reject node_modules paths

## Goal

`ki-engineering` should fail a package script that invokes a dependency through a hand-written relative path into `node_modules`, preventing local hoisting from hiding a hosted-build failure.

## Context

A workspace script such as `bun ../../node_modules/@11ty/eleventy/cmd.cjs` works when Bun hoists the dependency to the repository root. It fails when an installer places dependencies within the workspace. Cloudflare Workers Builds did exactly that for `krisb/kit-midnight.ninja`, and both site builds stopped immediately with `Module not found` even though Turborepo, TypeScript, and the full local KI audit were green.

The construct survived a workspace migration because the relative depth was diligently updated instead of being recognised as an install-layout assumption. `ki-engineering` requires workspace task graphs and is therefore the right owner for the complementary portability rule.

## Boundary

Inspect `package.json` script bodies at the root and in resolved Bun workspaces. Do not govern dependency resolution generally, lockfiles, package-manager hoisting policy, bare `node_modules` cleanup targets, generated files, or arbitrary build-configuration source in this delivery.

## Current state

The engineering audit already resolves root and workspace package manifests for monorepo checks, but the Scripts rubric does not retain or inspect every workspace script body for relative `node_modules` traversal.

## Locked decisions

- Add a mechanical FAIL item. A relative dependency path is deterministic non-portability, not advisory style.
- Inspect every string-valued script in the root package and each safely resolved workspace package.
- Match shell-token text containing one or more `./` or `../` path segments immediately leading to `node_modules/`; report the package path, script name, and offending fragment.
- Do not flag bare `node_modules` used by cleanup scripts, explanatory prose outside scripts, or package-manager-managed paths.
- Remediation is resolver-based: invoke exposed binaries with `bunx --bun <package-or-bin>` and resolve required package files through `createRequire(import.meta.url).resolve(...)` in owned code.
- Keep build-configuration scanning outside this item until concrete evidence supports a bounded file and syntax contract.

## Steps

- [x] Extend engineering evidence with root and workspace script locations using the existing safe workspace resolution.
- [x] Add a new mechanical Scripts rubric item that emits FAIL for relative `node_modules` traversal and precise remediation guidance.
- [x] Add fixtures covering root and workspace offenders, multiple path depths, valid `bunx`, valid module resolution, and valid cleanup of bare `node_modules`.
- [x] Document the portability rule and both supported remediation forms in the engineering standard.
- [x] Regenerate the engineering rubric and audit the evidenced repository after its scripts use resolver-based invocation.

## Files touched

- `skills/governance/ki-engineering/references/standards-engineering.md`
- `skills/governance/ki-engineering/scripts/rubric/contexts/engineering.ts`
- `skills/governance/ki-engineering/scripts/rubric/contexts/audit-evidence.ts`
- `skills/governance/ki-engineering/scripts/rubric/items/scripts.ts`
- Focused engineering rubric fixtures and tests
- Generated `skills/governance/ki-engineering/references/rubric.md`
- This work item

## Verify

- A root script and a workspace script containing `../node_modules/…` produce FAIL with their package and script identities.
- Equivalent scripts using `bunx --bun` do not produce the finding.
- A clean script removing bare `node_modules` retains its current valid outcome.
- Non-string scripts, malformed or unsafe workspace manifests, and paths outside declared workspaces retain their existing handling.
- `ki dev skill rubric ki-engineering`, focused engineering tests, `bun run test`, `bunx tsc --noEmit`, and `ki repo audit --skill ki-skills --repo .` pass.

## Dependencies / blocks

No dependencies. This item is independent of [KI-HARNESS-GOV-071](KI-HARNESS-GOV-071-follow-shared-website-config.md) and [KI-HARNESS-GOV-072](KI-HARNESS-GOV-072-govern-multi-site-repositories.md), despite sharing the same originating migration evidence.

## Documentation impact

### Decision Records

No Decision Record is required: the new check applies the existing portable workspace contract to one deterministic failure pattern, and the standard records its rationale.

### Specifications

Update the engineering standard and generated rubric with the mechanical failure and remediation contract.

### Guides

No separate guide is required. The audit message and standard provide the actionable replacement patterns.

### Roadmap

Do not expand this item into build-configuration scanning. Capture that separately only after a bounded syntax and false-positive model is evidenced.

## Review

### Delivered

From baseline `789b8ea8c0d32f486f72ad7a7d0eb2757baad28f`, `ki-engineering` now publishes mechanical `SCR-10`. It scans string-valued scripts in the root manifest and repository-contained resolved workspace manifests, rejects each `./node_modules/` or `../node_modules/` dependency path with package, script, fragment, and remediation evidence, and leaves bare cleanup targets and arbitrary configuration source outside the rule.

### Summary of changes

- Added repository-contained root and workspace package-script source collection.
- Added precise relative `node_modules` fragment detection and portable remediation guidance.
- Published the normative rule, generated rubric item, focused fixtures, and updated remediation inventory.

### Verification

- Focused engineering tests cover root and workspace offenders, multiple traversal depths, unsafe workspace escape, non-string scripts, bare cleanup, `bunx --bun`, `createRequire(...).resolve(...)`, and an unscanned configuration file.
- `bun run test` — 726 pass, 0 fail, 3,188 expectations across 133 files.
- `bunx tsc --noEmit` — pass.
- `ki dev skill rubric ki-engineering` — generated publication in sync.
- `ki repo audit --skill ki-skills --repo .` and `ki repo audit --skill ki-work-roadmap --repo .` — pass.
- `bunx rumdl check` for the standard and this record — pass.

### Outstanding concerns

Known repositories that still contain relative `node_modules` invocations will fail `SCR-10` when they consume this Harness change; their script remediation belongs in those repositories, not this batch.

### Post-change review

The scanner follows only real package manifests whose resolved paths remain within the repository. It reports every offending fragment independently, does not execute scripts, and delegates malformed or unsafe workspace declarations to existing workspace validation.

### Mini recap

Hoisting-dependent package scripts are now a deterministic engineering failure with portable repair guidance.

## Discussion

### Severity

FAIL is appropriate because the construct asserts an install layout that the package manifest does not guarantee. A repository passing locally does not reduce the certainty of the defect; it demonstrates why a mechanical audit is necessary.

### Detection scope

Package scripts are bounded JSON strings already read by the engineering audit, so detection is deterministic and inexpensive. Arbitrary configuration files would require language-aware ownership and path semantics and would make this otherwise focused rule less reliable.
