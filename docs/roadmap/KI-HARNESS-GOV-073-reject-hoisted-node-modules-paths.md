---
id: KI-HARNESS-GOV-073
area: GOV
title: Reject node_modules paths
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: f97e34017e7d58a17d83f422be7f15859b9b3db8
created_at: 2026-09-17T16:53:09Z
updated_at: 2026-09-17T18:22:51Z
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

- [ ] Extend engineering evidence with root and workspace script locations using the existing safe workspace resolution.
- [ ] Add a new mechanical Scripts rubric item that emits FAIL for relative `node_modules` traversal and precise remediation guidance.
- [ ] Add fixtures covering root and workspace offenders, multiple path depths, valid `bunx`, valid module resolution, and valid cleanup of bare `node_modules`.
- [ ] Document the portability rule and both supported remediation forms in the engineering standard.
- [ ] Regenerate the engineering rubric and audit the evidenced repository after its scripts use resolver-based invocation.

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

## Discussion

### Severity

FAIL is appropriate because the construct asserts an install layout that the package manifest does not guarantee. A repository passing locally does not reduce the certainty of the defect; it demonstrates why a mechanical audit is necessary.

### Detection scope

Package scripts are bounded JSON strings already read by the engineering audit, so detection is deterministic and inexpensive. Arbitrary configuration files would require language-aware ownership and path semantics and would make this otherwise focused rule less reliable.
