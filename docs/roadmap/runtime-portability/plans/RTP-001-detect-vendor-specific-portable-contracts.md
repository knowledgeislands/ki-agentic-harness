---
id: 'RTP-001'
title: Detect vendor-specific assumptions in portable skill contracts
status: done
roadmap: runtime-portability/detect-vendor-specific-assumptions-in-portable-skill-contracts
blocks: —
blocked-by: —
---

## Context

Portable skills should describe behaviour in runtime-neutral language so they work across supported agents without silently importing one vendor's files, capabilities, or interaction model.

Existing contracts can contain accidental references to Claude, Codex, their home directories, or runtime-only capabilities, and there is no systematic check to distinguish those from intentional runtime-binding guidance.

## Current state

`ki-skills` validates structural and cross-skill conventions but has no portable-language criterion.

Runtime-specific material is legitimate in dedicated binding skills, explicitly attributed source material, and deliberately comparative examples; a broad allowlist would conceal accidental historical wording elsewhere.

## Steps

1. ✓ Define the portable-contract boundary, prohibited unqualified vendor/runtime assumptions, and the narrow structural exceptions for runtime-binding responsibility, attribution, and intentional comparisons.
2. ✓ Add a named `ki-skills` rubric criterion and checker implementation that reports actionable locations without treating the exception cases as accidental drift.
3. ✓ Add focused fixtures for prohibited language, each exception class, mixed portable/runtime-specific skills, and stable diagnostic output.
4. ✓ Apply the criterion across shipped portable contracts and rewrite every genuine finding in runtime-neutral terms rather than retaining an accidental-wording allowlist.
5. ✓ Re-vendor any coverage-scoped checker changes, regenerate affected derived documentation, and run the serial repository gates.

## Files touched

- `skills/keystone/ki-skills/`
- affected portable skill contracts and references
- focused `ki-skills` fixtures and tests
- `.ki-meta/` generated checker payloads after re-vendoring
- generated skill documentation if dependency or catalogue output changes

## Verify

- Unqualified vendor or runtime assumptions in a portable contract fail with a precise location and remediation route.
- Dedicated runtime-binding guidance, attributed material, and intentional runtime comparisons remain valid.
- Existing portable contracts are clean without a blanket historical-wording allowlist.
- `bun run ki:skills:audit`
- `bun run test`
- `bun run ki:audit`

## Dependencies / blocks

This plan has no external dependency.

It makes the portable contract explicit before further multi-runtime rollout work depends on those contracts.

## Acceptance

### Delivered

Added PORT-1 and made the shipped skill set conform to the new runtime-portability boundary.

### Summary of changes

`ki-skills` now scans each Markdown contract with a file-and-line diagnostic, uses explicit runtime-binding declarations or sections for legitimate binding material, and accepts attributed source material and genuine multi-runtime comparisons. The structured rubric, generated publication, focused tests, and affected wording are all updated.

### Verification

Implementation evidence: `067be004`.

- `bun test` — pass.
- `bun run ki:audit` — zero FAIL; three pre-existing WARN findings remain (one decision-record serial gap and two KI-SHAPE-7 advisories).
- `bun run ki:bootstrap:audit` — pass with zero WARN before the implementation commit.

### Outstanding concerns

The dedicated `ki-runtime-binding: true` declaration is intentionally narrow and visible, but its use should be reviewed when a future runtime is added to ensure the stated responsibility remains accurate.

### Mini recap

The first whole-set scan exposed that runtime-specific content is concentrated in a small set of genuinely binding skills. Explicit structural boundaries are more durable than a word allowlist; future portable wording should use the same boundary rather than suppressing a finding.

## Done

PORT-1 now makes runtime-specific assumptions visible and actionable across the shipped skills. Residual concerns are limited to reviewing declared runtime-binding responsibilities when a new runtime is introduced; no immediate follow-up is required.
