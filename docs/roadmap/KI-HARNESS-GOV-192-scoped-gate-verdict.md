---
id: KI-HARNESS-GOV-192
area: GOV
title: Scoped gate verdict
project: ways-of-working
component: governance
purpose: capability
kind: deliver
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-14T19:32:39Z
updated_at: 2026-10-14T19:32:39Z
---

# Scoped Gate Verdict

## Goal

One sentence in `ki-repo-kb`'s [standards-knowledge-base.md](../../skills/repo-structure/ki-repo-kb/references/standards-knowledge-base.md) commit-gate section (`GATE-1`) allows a Knowledge Base pre-commit hook to scope the audit's verdict to the staged index with `--staged`, while CI keeps the whole-tree verdict. The sentence is permissive: it names what a hook may do, and it requires nothing of a hook that keeps the whole-tree verdict.

## Context

Kris accepted the design on 2026-10-14 at 20:20 BST in the `ways-of-working` thread, as received: "GATE-SCOPE / accept the design: open a KI-TOOL-KI-CLI record for --staged and --paths on ki repo audit and a KI-HARNESS-GOV record for the GATE-1 sentence; switch ki-principal's hook once the released ki carries the option; CI stays whole-tree". The design is the gate-scope report in the Knowledge Islands Principal thread folder, `+/_THREADS/ways-of-working/gate-scope.report.md`, which Kris commissioned on 2026-10-14 at 19:26 BST: "propose scoping ki-principal's pre-commit audit to staged files, with the whole-tree audit kept in CI or a regular audit run; report the design before changing anything".

The finding behind it: a Knowledge Base's `.githooks/pre-commit` audits the whole tree because `ki repo audit` offers no narrower scope, not by decision, so one thread's non-conforming note blocks every other thread's commits. Evaluation must stay whole-tree, because zone layout, unique roadmap identity, wikilink resolution and a Project's close-out against open records cannot be judged from one file; only the verdict can be scoped, and a directory-containment rule keeps a finding the staged change caused in scope. `tools-ki` owns the option itself. The harness owns only the standard's wording: today the commit-gate paragraph says the gate is check-only and names the flags that fail it, and says nothing about the verdict's scope, so a hook adding `--staged` would be conforming by silence rather than by rule.

[ADR-KI-HARNESS-SKILLS-017](../decisions/ADR-KI-HARNESS-SKILLS-017-commit-gate-existence-and-content-are-owned-separately.md) already places the content of the gate with `ki-repo-kb` and keeps it check-only; a scoped verdict is still check-only, so the decision stands and no new decision record is needed.

## Boundary

- In scope: one sentence in the commit-gate paragraph of `standards-knowledge-base.md`, and this record.
- Out of scope: the `GATE-1` checker in `scripts/rubric/items/gate.ts`, which already accepts any audit line without `--fix` or `--write` and needs no change; the `--staged` and `--paths` options, which `tools-ki` delivers; the `ki-principal` hook line and its `Admin/Governance/Conformance.md` sentence, which change under Kris's instruction once the released `ki` pin carries the option; any CI or scheduled-audit change, since CI stays whole-tree and nothing scheduled is added; the rubric, the generated rubric publication, and `ki-repo` `HOOK-1` and `HOOK-2`.

## Requirements

- The commit-gate paragraph states that a hook may pass `--staged` so the audit's verdict covers only the staged index, that evaluation stays whole-tree, and that CI keeps the whole-tree verdict.
- The sentence is permissive and does not require `--staged`, so a hook without the option, and a hook run under a released `ki` that does not yet carry the option, remains conforming.
- The sentence does not weaken the check-only rule: `--fix` and `--write` still fail `GATE-1`.
- The `GATE-1` rubric item, its remediation and the generated rubric publication are unchanged.

## Current state

The commit-gate paragraph reads: "A Knowledge Base has no package toolchain to gate its commits, so its committed `.githooks/pre-commit` runs `ki repo audit` (`GATE-1`). The gate is check-only: a line that runs `ki repo conform`, or passes `--fix` or `--write` to the audit, fails, because a commit gate reports and never rewrites. Without a committed hook `GATE-1` is not applicable; `ki-repo` `HOOK-1` owns whether the hook exists and `HOOK-2` whether it is bound." The `GATE-1` checker inspects the audit line for rewriting flags only. The released `ki` does not yet carry `--staged`; `tools-ki` has the option open as ready work.

## Steps

- [ ] Add the scoped-verdict sentence to the commit-gate paragraph of `standards-knowledge-base.md`, after the check-only sentence and before the not-applicable sentence.
- [ ] Confirm the `GATE-1` rubric item and `skills/repo-structure/ki-repo-kb/references/rubric.md` need no change.
- [ ] Run the gates below and set the record awaiting review.

## Files touched

`skills/repo-structure/ki-repo-kb/references/standards-knowledge-base.md` and this record.

## Verify

`bun run test`, `bun skills/repo-structure/ki-repo-harness/scripts/skill-graph.ts --check`, `ki repo audit --skill ki-repo-kb` and `ki repo audit --skill ki-work-roadmap` all pass; `git diff --check` is clean; the commit-gate paragraph contains `--staged` and still names `--fix` and `--write` as failing.

## Dependencies / blocks

The option the sentence names belongs to `tools-ki`: `--staged` and `--paths` on `ki repo audit`, with whole-tree evaluation and a verdict scoped to the staged, deleted and containing paths, documented when delivered in its [repository audit specification](../../../tools-ki/docs/specs/repository-audit.md) and [repository operations guide](../../../tools-ki/docs/guides/user/repository-operations.md). The sentence is safe to deliver before that option is released, because it permits rather than requires the flag and the checker does not inspect it, so `blocked_by` stays empty: this is sequencing context, not build order. The `ki-principal` hook switch waits on the released `ki` pin, under Kris's instruction above, and is not part of this record.

## Documentation impact

### Decision Records

None. ADR-KI-HARNESS-SKILLS-017 already owns the gate's check-only content rule, and a scoped verdict is still check-only.

### Specifications

None in this repository; the standard itself is the deliverable, and the `REPO-AUDIT` specification for the option lives in `tools-ki`.

### Guides

None. The sentence is the guidance; `ki-principal`'s Conformance note changes under Kris's instruction when its hook switches.

### Roadmap

No follow-on record here. The hook switch is a bounded owner instruction in `ki-principal`, and the option is `tools-ki` work.

## Discussion

### Why a sentence and not a checker change

The checker fails only rewriting flags, so it already admits `--staged`. Without the sentence, a scoped hook conforms by silence, and a later reader could tighten `GATE-1` to require the whole-tree verdict without knowing the design chose otherwise. The sentence records the rule.
