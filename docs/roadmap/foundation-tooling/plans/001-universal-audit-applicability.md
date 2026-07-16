---
id: '001'
title: Make audit applicability universal
status: in-progress
roadmap: foundation-tooling/make-ki-audit-a-fully-universal-clean-gate-na-skip-the-remaining-over-reaching-audits
blocks: foundation-tooling/003, foundation-tooling/004
blocked-by: —
handoff: true
tier: sonnet
readiness: 2026-07-16
---

## Context

Fleet rollout needs `ki:audit` to distinguish “this standard does not apply here” from “this repository violates an applicable standard.” Six artifact checkers currently emit structural failures before establishing applicability, which makes the aggregate noisy and undermines it as a baseline gate.

## Current state

`ki-feature-definitions`, `ki-project-roadmap`, `ki-engineering`, and `ki-website-cloudflare` already demonstrate clean off-ramps. The remaining targets are `ki-mcp`, `ki-website`, `ki-tools`, `ki-kb`, `ki-plugins`, and `ki-homebrew-tap`. Their canonical checkers and tests differ, and any coverage-scoped checker change must be formatted before re-vendoring.

## Steps

1. ✓ Inventory each target checker's current config-table and structural markers; record the exact applicability predicate without changing the standard's positive requirements.
2. ✓ Add an early applicability gate to each checker: when neither its `[ki-<skill>]` table nor its structural marker is present, emit one scoped `NA` and stop before structural failures. A declaration or structural marker keeps the full audit active.
3. ✓ Add fixtures for three cases per checker: absent and structurally irrelevant → one `NA`; explicitly declared but structurally incomplete → existing failures; structurally applicable without a declaration → full audit remains active.
4. ✓ Update only the standards/rubrics whose applicability wording is missing or contradicted by the code; do not broaden the work into output-format unification.
5. ✓ Format changed checkers, re-bootstrap coverage-scoped vendors, and verify source/vendor parity.

## Files touched

The six target skills' `scripts/audit.ts` and focused tests; their applicability rubric/standard text only where needed; coverage-scoped `.ki-meta` copies and manifest.

## Verify

Pass when every focused target test succeeds, `bun run test` succeeds, `bun run ki:audit` reports no FAIL/WARN introduced by the change, and `bun run ki:bootstrap:audit` confirms source/vendor parity.

## Dependencies / blocks

Independent first-round work. It blocks the documentation baseline because that sweep must describe the final applicability semantics, and it blocks fleet rollout because the aggregate gate must be trustworthy before applying it broadly.

## Decisions

**Locked:** Applicability is decided from the skill's own declaration or structural marker; absent plus irrelevant produces one `NA`; declared-but-incomplete remains a failure; output-format overhaul and new config schema are excluded. The recommended tier is `sonnet`: the pattern is specified, but six heterogeneous checkers require bounded implementation judgment.

**Escalate:** Stop and report if a target has no unambiguous structural marker or if adding the early gate would hide a currently intentional violation.

## Readiness

- [x] Readiness test: a cold executor identified all six predicates and could implement the first checker from this plan plus the owning skill's standard.

Passed 2026-07-16: `[ki-mcp]` or `src/mcp-server/`; `[ki-website]` or an Eleventy config at the repository root / `site/`; `[ki-tools]` or `bin/`; `[ki-kb]` (including its `[ki-kb.zones]` subtable) or any canonical KB zone; `[ki-plugins]` or `.claude-plugin/marketplace.json`; `[ki-homebrew-tap]` or `Formula/`.
