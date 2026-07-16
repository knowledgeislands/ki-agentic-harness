---
id: '003'
title: Reconcile rollout documentation
status: open
roadmap: foundation-tooling/reconcile-the-fleet-s-toolchain-prose-with-the-collapsed-toolchain
blocks: foundation-tooling/004
blocked-by: —
handoff: true
tier: sonnet
readiness: 2026-07-16
---

## Context

The implementation has collapsed onto aggregate audit/conform entrypoints and a runner-neutral bare `test`, but live standards and guides still teach retired per-tool script families. Rollout is unsafe when humans and agents receive obsolete commands.

## Current state

The frozen inventory contains 21 stale Markdown/standard surfaces plus live TypeScript comments and evals that still reward the retired behaviour. The main groups are `ki-authoring`, `ki-engineering`, the MCP and website deltas, `ki-engineering-lead`, the engineering eval, and two governance examples/checks. Historical decision records intentionally describe the retired model and must remain unchanged. Existing retirement explanations, regression fixtures, the correct config-gated Vitest rubric, and the `CANON` aggregate map in engineering conform are also intentional. The proposed `ki-engineering-ts` rename is deferred until after the release baseline because it would expand the blast radius without improving immediate adoption.

## Steps

1. Run this stable inventory seed over `AGENTS.md`, `agents/`, `evals/`, `skills/`, and `docs/guides/`: `rg -n --glob '*.md' --glob '*.ts' 'bun run ki:(lint|deps|knip|verify)|ki:lint:|ki:deps:|ki:knip|ki:verify|vitest/globals|vitest\\.config'`. Sort the results by path and classify every hit against the locked inclusions/exclusions below.
2. Rewrite the foundations together: `ki-engineering` standard/SKILL/exemplars/sources/enforcement prose, `ki-authoring` standard/SKILL/rubric/exemplars/sources, and the `ki-skills` delegation example. Establish one shipped vocabulary: aggregate `ki:audit`/`ki:conform`; skill-scoped `ki:<suffix>:audit`/`conform`; code tools internal to `ki-engineering`; Markdown internal to `ki-authoring`; runner-neutral `test`; config-gated Vitest.
3. Update the MCP and website deltas against the landed universal-audit behaviour. Make MCP Vitest and coverage-exclude examples explicitly conditional on the repository selecting the Vitest profile.
4. Update live agent, eval, TypeScript comment, and exemplar/check prose. Replace the obsolete engineering eval assertions with aggregate/scoped keys, internal tool execution, runner-neutral tests, and config-gated Vitest.
5. Preserve the closed `package.json` top-level manifest, standalone `.ki-meta` invocation, explicit “retired key” explanations, retirement regression fixtures, correct live references, and deliberate historical decision-record wording.
6. Add a narrow drift test for executable guidance that recommends `bun run ki:(lint|deps|knip|verify)` as a live command. Do not raw-scan tokens whose correct retirement/history uses must remain.
7. Run authoring conform once, then authoring audit, skill audit, full tests, and aggregate audit sequentially; review every edited standard for cross-skill consistency.

## Files touched

Live non-historical SKILL/reference prose, agent/eval surfaces, and TypeScript comments identified by the inventory; focused drift tests. No decision-record rewrites, generated-copy hand edits, or `ki-engineering` rename.

## Verify

Pass when a fleet-wide repository search finds no unexplained live assertion that retired script families are required, executable guide tests pass, `bun run ki:skills:audit`, `bun run test`, and `bun run ki:audit` pass, and historical references remain intact.

## Dependencies / blocks

Unblocked. It blocks the MCP rollout because rollout instructions must match the gate being deployed.

## Decisions

**Locked:** Update live operational and behavioural claims, including TypeScript comments/evals; preserve historical ADRs, explicit retirement explanations, and regression fixtures; editing a `sources.md` current-state block does not change its review date unless external sources are actually refreshed; generated `.ki-meta` copies change only through re-vendoring; defer `ki-engineering-ts`; keep the shipped aggregate/scoped/test model and config-gated Vitest posture. The recommended tier is `sonnet`: the inventory is mechanical, while distinguishing live norm from history and maintaining cross-skill semantics needs bounded judgment.

**Escalate:** A source contradicts the shipped implementation or appears normative but cannot be classified confidently as live versus historical.

## Readiness

- [x] Readiness test: a cold executor ran the frozen search, classified its first ten sorted hits, and confirmed the `ki-authoring` batch can proceed without reopening toolchain design (2026-07-16).
