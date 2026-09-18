---
id: KI-HARNESS-GOV-074
area: GOV
title: Enforce AGENTS.md root orientation
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-18T04:05:10Z
updated_at: 2026-09-18T04:05:10Z
---

# Enforce AGENTS.md root orientation

## Goal

A repository that supports a runtime other than Claude Code cannot keep its orientation somewhere a non-Claude runtime will never read, and then pass its own governance audit. `ki repo audit` reports the inversion instead of leaving it to whoever happens to notice.

## Context

[The repository standard](../../skills/keystone/ki-repo/references/standards-repository.md) already states the rule: when a repository's declared `supported_runtimes` includes anything beyond `claude-code`, the orientation belongs in a literal root `AGENTS.md`, because a non-Claude-Code runtime cannot resolve the `@`-import syntax an index would rely on; `CLAUDE.md` then becomes a thin `@AGENTS.md` import plus a Claude-only appendix. Where `supported_runtimes` is `["claude-code"]` alone there is no reason to split, and `CLAUDE.md` on its own is sufficient.

The rule is prose only. No rubric item evaluates it, so a repository can invert it indefinitely and still audit green — which is what happened, and the observation that prompted this item is recorded under Discussion.

## Boundary

In scope is the placement question the standard already decides: which file holds the orientation, and whether the other one imports it, conditioned on the declared runtimes.

Out of scope: the quality, length or structure of the orientation content itself; context budgets, which `ki-tokenomics` owns; general validation of the `@`-import graph; nested per-workspace orientation files, which the standard does not currently address and which would need a decision before any check could cover them; and repositories declaring only `claude-code`, which the rule deliberately exempts.

## Discussion

### Observed evidence

On 2026-09-18, during an unrelated tidy-up of `kit-midnight.ninja`, the repository was found with the rule exactly inverted. Its `.ki.toml` declares `supported_runtimes = ["claude-code", "claude-desktop", "chatgpt-codex"]`. Its root `CLAUDE.md` held the entire orientation — folder layout, command table, key patterns, working rules, conventions, the governing-skill list — at roughly 130 lines. Its root `AGENTS.md` was a four-line stub whose substantive content was "Read `CLAUDE.md` for repository orientation". Codex, a declared runtime, would have read the stub and stopped.

`ki repo audit --repo .` reported `PASS · 16 skills` against that repository both before the inversion was corrected and after, with identical output. The audit had no opinion either way. The inversion had survived since the repository adopted multi-runtime support, and was found by a human reading the tree rather than by any tool.

A second, weaker signal from the same repository: `apps/site-tower/` carried a 95-line nested `CLAUDE.md` with no `AGENTS.md` beside it. Applying the same split there was a judgement call, not a standard — see Boundary.

### Candidate check shape

The gate is deterministic and already declared: read `supported_runtimes` from `.ki.toml` and evaluate only when it contains a value other than `claude-code`.

Two conditions look safely mechanical. A root `AGENTS.md` must exist and carry substantive content rather than a redirect. A root `CLAUDE.md`, where present, must contain a bare `@AGENTS.md` import line — an exact token test, not a prose match.

Detecting the inversion positively is the harder half. The `kit-midnight.ninja` case would have been caught by the redirect test alone: its `AGENTS.md` pointed at `CLAUDE.md` by name. A check for "`AGENTS.md` references `CLAUDE.md` as the place to read orientation" is narrow enough to be deterministic and catches the realistic failure, where someone writes the pointer in the wrong file. A size-ratio heuristic between the two files would catch more but is crude and would fire on legitimately long Claude-only appendices.

### Open questions

- FAIL or WARN? The standard says "should", and the consequence — a declared runtime reading a stub — is a real capability failure rather than a style preference, which argues for FAIL. Existing repositories would need remediation first, as with `SCR-10`.
- Does the rule extend to nested orientation files, and if so, is it conditioned on the nested file's size or on its existence alone?
- Should the check also verify the reverse direction — that a single-runtime repository has _not_ split unnecessarily — or is that harmless and better left alone?
