---
id: '003'
title: Reconcile rollout documentation
status: open
roadmap: foundation-tooling/reconcile-the-fleet-s-toolchain-prose-with-the-collapsed-toolchain
blocks: foundation-tooling/004
blocked-by: foundation-tooling/001
handoff: true
tier: sonnet
readiness: pending
---

## Context

The implementation has collapsed onto aggregate audit/conform entrypoints and a runner-neutral bare `test`, but live standards and guides still teach retired per-tool script families. Rollout is unsafe when humans and agents receive obsolete commands.

## Current state

Stale prose spans `ki-engineering`, sibling skills, and user guides. Historical decision records intentionally describe the retired model and must remain unchanged. The proposed `ki-engineering-ts` rename is deferred until after the release baseline because it would expand the blast radius without improving immediate adoption.

## Steps

1. Build an evidence-backed inventory of live non-historical references to retired `ki:lint:*`, `ki:deps:*`, `ki:knip`, `ki:verify`, CANON, and unconditional Vitest assumptions; explicitly classify historical references that must stay.
2. After plan 001 lands, update standards, rubrics, exemplars, SKILL prose, and guides to one shipped model: aggregate `ki:audit`/`ki:conform`; skill-scoped `ki:<suffix>:audit`/`conform`; code tools internal to `ki-engineering`; Markdown internal to `ki-authoring`; runner-neutral `test`; config-gated Vitest.
3. Preserve the closed `package.json` top-level manifest, standalone `.ki-meta` invocation, and deliberate historical ADR wording.
4. Add or extend drift checks for executable onboarding snippets and any normative command inventory that can be checked mechanically.
5. Run Markdown conform/audit, skill audit, full tests, and aggregate audit; review every edited standard for cross-skill consistency.

## Files touched

Live non-historical SKILL/reference prose and `docs/guides/` surfaces identified by the inventory; focused guide or drift tests where an executable contract exists. No decision-record rewrites and no `ki-engineering` rename.

## Verify

Pass when a fleet-wide repository search finds no unexplained live assertion that retired script families are required, executable guide tests pass, `bun run ki:skills:audit`, `bun run test`, and `bun run ki:audit` pass, and historical references remain intact.

## Dependencies / blocks

Blocked by `foundation-tooling/001` so documentation describes the final universal audit behaviour. It blocks the MCP rollout because rollout instructions must match the gate being deployed.

## Decisions

**Locked:** Update live operational claims only; preserve historical ADRs; defer `ki-engineering-ts`; keep the shipped aggregate/scoped/test model and config-gated Vitest posture. The recommended tier is `sonnet`: the inventory is mechanical, while distinguishing live norm from history and maintaining cross-skill semantics needs bounded judgment.

**Escalate:** A source contradicts the shipped implementation or appears normative but cannot be classified confidently as live versus historical.

## Readiness

- [ ] Readiness test: a cold executor can classify the first ten search hits and update the first live guide without reopening toolchain design.
