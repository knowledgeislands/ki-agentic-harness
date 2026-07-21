---
id: ADR-KI-HARNESS-TOOLCHAIN-004
title: 'Checker remediation footer and learn-block context check'
date: 2026-07-10
status: current
type: Architecture Decision Record
type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-TOOLCHAIN-004: Checker remediation footer and learn-block context check

## Context

A governance checker is the mechanical half of a skill: it reports findings on the severity ladder and exits non-zero on FAIL, but it does not fix anything. Fixing is the judgment half — the skill's CONFORM mode decides _which_ change is right (which layer a fact belongs in, whether an overage is earned, whether a model tier fits the work). Yet the checkers gave the reader no pointer from a finding to that mode, so a user seeing a raw WARN was left to infer the remedy and hand-edit against the code — exactly the mechanical-fix-to-a-judgment-problem the split is meant to avoid.

Separately, Headroom's `headroom --learn` writes learned command/error-recovery patterns into `MEMORY.md` and the project `CLAUDE.md`, between `<!-- headroom:learn:start/end -->` markers. It is the one Headroom feature that _adds_ to the always-on prefix rather than compressing runtime, and because it mines whatever island the session ran in, the block accretes cross-repo captures — a live case in this harness carried ~1.5k tokens of another repo's `arcadia-*` recovery commands, re-paid on every turn. Nothing mechanically flagged it.

## Decision

1. **Remediation footer (checker contract).** Every checker MUST, on a non-clean human-output summary (any FAIL / WARN / POLISH), print a one-line footer naming the owning skill and mode — `→ to address: run /<skill> CONFORM`. It is suppressed on clean runs and under `--json` / `--report`. Codified in `ki-skills`' `references/checker-contract.md`; the two checkers touched here are the reference implementation, and the remaining checkers were subsequently brought into line (all 23 now carry it). The footer's presence is then **enforced mechanically**: the `ki-skills` linter scans every `audit-*.ts` / `lint-*.ts` source and WARNs on a missing footer or one naming another skill, so a new checker cannot ship without one — the guard-on-non-clean and `--json`-suppression halves stay a judgment read.
2. **Learn-block context check.** The `headroom:learn` block, wherever it appears, must not carry entries rooted in another repo. Detection is mechanical and keyed on absolute `knowledgeislands/<repo>` paths _inside the markers_ whose `<repo>` differs from the audited repo — a WARN, with the fix (re-learn or prune) left to CONFORM. It is applied by `ki-housekeeping` (over `MEMORY.md`) and `ki-tokenomics` (over the project `CLAUDE.md`), consistent with the two-axis split: housekeeping owns machine-state hygiene, tokenomics owns the repo's standing-surface cost.

## Consequences

- Checker output is self-documenting: a finding now names the mode that resolves it, matching the guidance in the context-surface tuning guide.
- The heuristic is deliberately narrow — scoped inside the markers and to absolute KI-sibling roots — so a governance repo's legitimate `../sibling` cross-repo references (which live in prose, and which it uses in relative form) never false-positive. It keys on kebab-case KI repo names; a repo name containing a `.` is out of scope.
- The check is a WARN, never a FAIL: the block regenerates and the call to prune vs. re-learn is judgment, so it nudges rather than blocks CI.
- Both checks are covered by run-based behavioural tests (`audit-memory.test.ts`, `audit-tokenomics.test.ts`) wired into `ki:verify`, per the `ki-engineering` convention that skill `scripts/` are run-tested rather than unit-tested.

## References

- [ADR-KI-HARNESS-TOOLCHAIN-002](ADR-KI-HARNESS-TOOLCHAIN-002-complementary-tooling-current-adoptions.md) — adopts Headroom (whose `--learn` writes the block this check governs).
