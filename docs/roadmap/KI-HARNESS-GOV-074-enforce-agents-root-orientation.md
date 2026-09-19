---
id: KI-HARNESS-GOV-074
area: GOV
title: Enforce AGENTS.md root orientation
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 6e6c2e282366087f14a65594318546dd8976d601
created_at: 2026-09-18T04:05:10Z
updated_at: 2026-09-19T11:38:01Z
---

# Enforce AGENTS.md root orientation

## Goal

A repository that supports a runtime other than Claude Code cannot keep its orientation somewhere a non-Claude runtime will never read, and then pass its own governance audit. `ki repo audit` reports the inversion instead of leaving it to whoever happens to notice.

## Context

[The repository standard](../../skills/keystone/ki-repo/references/standards-repository.md) already states the rule: when a repository's declared `supported_runtimes` includes anything beyond `claude-code`, the orientation belongs in a literal root `AGENTS.md`, because a non-Claude-Code runtime cannot resolve the `@`-import syntax an index would rely on; `CLAUDE.md` then becomes a thin `@AGENTS.md` import plus a Claude-only appendix. Where `supported_runtimes` is `["claude-code"]` alone there is no reason to split, and `CLAUDE.md` on its own is sufficient.

The rule is prose only. No rubric item evaluates it, so a repository can invert it indefinitely and still audit green — which is what happened, and the observation that prompted this item is recorded under Discussion.

## Boundary

In scope is the placement question the standard already decides: which file holds the orientation, and whether the other one imports it, conditioned on the declared runtimes.

Out of scope: the quality, length or structure of the orientation content itself; context budgets, which `ki-tokenomics` owns; general validation of the `@`-import graph; nested per-workspace orientation files, which the standard does not currently address; and repositories declaring only `claude-code`, which the rule deliberately exempts.

## Current state

The intended approach is one new mechanical rubric item in `ki-repo`, gated on `supported_runtimes` containing a value other than `claude-code`, evaluating the repository root only.

Three sub-checks look deterministic enough to implement without judgement. A root `AGENTS.md` must exist. A root `CLAUDE.md`, where present, must contain a bare `@AGENTS.md` import line — an exact token test against the line, not a prose match. And `AGENTS.md` must not name `CLAUDE.md` as the place to go for orientation, which is the inversion itself and the form the observed failure took.

Dependencies are light: the check reads `.ki.toml` and two root files, all of which existing `ki-repo` evidence already collects. No new evidence source is needed, and nothing in `ki-tokenomics` or `ki-authoring` has to move.

The 2026-09-19 estate survey found 31 multi-runtime declarations: 12 repositories had no root `AGENTS.md`, and a further 9 had a root `CLAUDE.md` without the canonical import. Landing the eventual FAIL immediately would therefore break existing repositories before they can be remediated. This delivery introduces the exact mechanical signal at WARN; a later estate conformance wave may promote it to FAIL only after those repositories pass. Reverse-direction detection is deliberately narrow: reject a bare `@CLAUDE.md` import or a small redirect-shaped `AGENTS.md`, while allowing substantive guidance to mention `CLAUDE.md` when explaining the split.

## Steps

- [x] Add a root-only orientation evidence collector for multi-runtime repositories.
- [x] Publish `RUNTIMES-4` as a mechanical WARN with diagnostic remediation.
- [x] Prove missing `AGENTS.md`, missing Claude import, and reverse import or redirect are reported.
- [x] Prove Claude-only repositories and compliant multi-runtime repositories pass.
- [x] Update the repository standard and generated rubric reference with the staged WARN-to-FAIL posture.
- [x] Run the focused repository rubric tests, full Harness tests, TypeScript, and roadmap audits.

## Files touched

- `skills/keystone/ki-repo/scripts/rubric/contexts/audit.ts`
- `skills/keystone/ki-repo/scripts/rubric/contexts/repository.ts`
- `skills/keystone/ki-repo/scripts/rubric/contexts/repository.test.ts`
- `skills/keystone/ki-repo/scripts/rubric/items/runtimes.ts`
- `skills/keystone/ki-repo/references/standards-repository.md`
- generated `skills/keystone/ki-repo/references/rubric.md`
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`
- this roadmap record

## Verify

```sh
bun test skills/keystone/ki-repo/scripts/rubric/contexts/repository.test.ts
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-repo --repo .
ki repo audit --skill ki-work-roadmap --repo .
```

## Dependencies / blocks

No implementation dependency remains. Estate remediation and promotion from WARN to FAIL are deliberately outside this item so this repository can publish a useful signal without breaking currently non-conforming consumers.

## Documentation impact

### Decision Records

None. The repository standard already decides the runtime-neutral orientation owner.

### Specifications

None. The rubric and repository standard are the owning contract.

### Guides

None.

### Roadmap

Any later FAIL promotion requires a separately selected estate-conformance record with repository-local remediation evidence.

Promotion condition: settle severity, then survey how many repositories with multi-runtime declarations currently fail each sub-check. A FAIL is promotable once that count is zero or the remediation is itself queued.

## Review

### Delivered

Delivered the approved root-only runtime orientation signal from baseline `6e6c2e282366087f14a65594318546dd8976d601` without changing sibling repositories or nested orientation policy.

### Summary of changes

- Added mechanical `RUNTIMES-4` evidence and diagnostic WARN publication for multi-runtime root orientation.
- Detects a missing or non-physical root `AGENTS.md`, a missing bare `@AGENTS.md` line in a present root `CLAUDE.md`, and narrow reverse-import or redirect shapes.
- Added focused fixtures for missing, inverted, compliant, and Claude-only layouts.
- Published the generated rubric and updated the remediation inventory counts.

### Verification

- The focused root-runtime-orientation tests pass: 3 tests, 0 failures.
- The full Harness test suite passes after updating the structured-remediation inventory.
- TypeScript and Biome checks pass.
- Generated `ki-repo` rubric parity passes.
- `ki-repo`, `ki-authoring`, and `ki-work-roadmap` audits pass for this repository.

### Outstanding concerns

The signal deliberately remains WARN while affected repositories are conformed. Promotion to FAIL is not part of this delivery and needs a separately reviewed estate boundary.

### Post-change review

The implementation meets the item goal with deterministic local evidence, stays root-only, leaves Claude-only repositories exempt, and avoids a fleet-breaking severity change. It is ready for human acceptance.

### Mini recap

Multi-runtime repositories now receive an actionable warning when shared orientation is absent or inverted. The next durable route is an estate-conformance item before any severity promotion.

## Discussion

### Observed evidence

On 2026-09-18, during an unrelated tidy-up of `kit-midnight.ninja`, the repository was found with the rule exactly inverted. Its `.ki.toml` declares `supported_runtimes = ["claude-code", "claude-desktop", "chatgpt-codex"]`. Its root `CLAUDE.md` held the entire orientation — folder layout, command table, key patterns, working rules, conventions, the governing-skill list — at roughly 130 lines. Its root `AGENTS.md` was a four-line stub whose substantive content was "Read `CLAUDE.md` for repository orientation". Codex, a declared runtime, would have read the stub and stopped.

`ki repo audit --repo .` reported `PASS · 16 skills` against that repository both before the inversion was corrected and after, with identical output. The audit had no opinion either way. The inversion had survived since the repository adopted multi-runtime support, and was found by a human reading the tree rather than by any tool.

A second, weaker signal from the same repository: `apps/site-tower/` carried a 95-line nested `CLAUDE.md` with no `AGENTS.md` beside it. It was renamed to `AGENTS.md` and left as a single file — see the position on nested files below.

### Candidate check shape

The gate is deterministic and already declared: read `supported_runtimes` from `.ki.toml` and evaluate only when it contains a value other than `claude-code`.

Two conditions look safely mechanical. A root `AGENTS.md` must exist and carry substantive content rather than a redirect. A root `CLAUDE.md`, where present, must contain a bare `@AGENTS.md` import line — an exact token test, not a prose match.

Detecting the inversion positively is the harder half. The `kit-midnight.ninja` case would have been caught by the redirect test alone: its `AGENTS.md` pointed at `CLAUDE.md` by name. A check for "`AGENTS.md` references `CLAUDE.md` as the place to read orientation" is narrow enough to be deterministic and catches the realistic failure, where someone writes the pointer in the wrong file. A size-ratio heuristic between the two files would catch more but is crude and would fire on legitimately long Claude-only appendices.

### Position on nested files

The root split exists so a non-Claude runtime can find the orientation at all. That reasoning does not carry below the root. A nested orientation is reached because the root orientation names it, not because a runtime auto-loads it, so a single `AGENTS.md` serves every runtime and a `CLAUDE.md` pointer beside it adds a file and buys nothing. `kit-midnight.ninja` was briefly given the pair and then reduced to the single file; across the whole estate surveyed on 2026-09-18 it is the only nested orientation that exists at all, which is its own argument against building a rule for the case.

A check should therefore evaluate the root only, and must not infer a violation from a nested `CLAUDE.md` or a nested `AGENTS.md` standing alone.

### Settled implementation choices

- The first mechanical release is WARN because the estate survey proves immediate FAIL would create widespread breakage; the contract remains intended to become FAIL after conformance.
- The check is explicitly root-only and does not infer a violation from nested orientation files.
- Claude-only repositories remain exempt; an unnecessary split there is harmless and not audited.
