---
id: KI-HARNESS-GOV-088
area: GOV
title: Detect inverted root orientation
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: ea0422363fb02ebdad908ef77f78d34130671fd3
transferred_from: knowledgeislands/ki-website
created_at: 2026-09-23T14:37:17Z
updated_at: 2026-09-23T18:25:25Z
---

## Goal

A multi-runtime repository that keeps its orientation in the Claude-only file fails its audit instead of passing it. Today the audit reports conformance, and only a person reading both files notices that a Codex session is being handed the thin one.

## Context

`RUNTIMES-4` holds that once `supported_runtimes` includes a runtime other than `claude-code`, the repository's orientation belongs in the literal root `AGENTS.md`, with any root `CLAUDE.md` staying a thin Claude-only appendix carrying a bare `@AGENTS.md` import.

`ki-website` satisfied both structural conditions while the property failed completely. Its root `AGENTS.md` existed, and its root `CLAUDE.md` opened with `@AGENTS.md` — but `CLAUDE.md` held 41 lines describing the stack, the eight governing-skill bullets and the whole toolchain block, while `AGENTS.md` held 15 lines of commit convention and cross-repository choreography. `.ki.toml` declares `chatgpt-codex`. A Codex session read the 15-line file and learned nothing about the repository it was working in.

`ki repo audit --skill ki-repo --repo .` was run against that repository on 2026-09-22 and reported `RUNTIMES-4` clean, both before and after the inversion was corrected in `ki-website@db9902c`. The two failures it did report (`PKG-1`, `TOGGLE-1`) were unrelated. The check is satisfied by the presence of a file and an import line, and neither distinguishes a thin appendix from a full orientation document.

The judgment half of this is already covered. `ki-repo@bb80a0a2` added two lenses to `references/mode-review.md` — that `AGENTS.md` is the authoritative home for shared runtime-neutral guidance, and that an accompanying `CLAUDE.md` imports it and contains only Claude-specific additions. What remains is that the mechanical rubric still returns green on the case those lenses were written to catch, so a repository that is never manually reviewed never learns.

The general shape is worth stating because it recurs: a structural check that asks whether a file exists cannot report on what the file contains, and a clean result from it reads exactly like verification.

## Boundary

This item is about the mechanical `RUNTIMES-4` rubric only. It does not revisit the `ki-repo` REVIEW lenses added in `bb80a0a2`, which already cover the judgment side and need no change. It does not restate or renegotiate the `RUNTIMES-4` standard itself in `standards-repository.md` — the rule is right, the check under-serves it. It does not change the finding's current WARN severity, which `standards-repository.md` ties to a separately reviewed conformance boundary. It does not audit or edit any downstream repository's root files; `ki-website` is already corrected and is cited here as evidence, not as work.

## Current state

`RUNTIMES-4` verifies that a multi-runtime repository has a physical root `AGENTS.md`, rejects an obvious `AGENTS.md` redirect to `CLAUDE.md`, and requires a physical `CLAUDE.md` containing a bare `@AGENTS.md` import. It does not compare the two files' substantive, repository-owned orientation. A repository can therefore keep a thin `AGENTS.md` and a much larger shared orientation in `CLAUDE.md` while receiving no `RUNTIMES-4` finding.

The checker already reads both files in `audit.ts`. Headroom-managed learning blocks are legitimate Claude-specific material and must be excluded from any relative-weight signal. A conservative deterministic warning can catch the evidenced inversion without claiming semantic proof: after removing comments, imports, headings, blank lines, and complete recognised managed blocks, warn only when `CLAUDE.md` retains at least eight substantive lines and more than twice the substantive lines in `AGENTS.md`.

## Steps

- [x] Extract a bounded root-orientation evidence helper that counts only substantive repository-owned lines and excludes complete recognised managed blocks without following links or interpreting imported files.
- [x] Extend `RUNTIMES-4` to emit its existing WARN-level finding when a multi-runtime `CLAUDE.md` has at least eight substantive unmanaged lines and more than twice the substantive unmanaged lines in `AGENTS.md`.
- [x] Add focused fixtures for the observed inverted pair, a conforming shared-orientation pair, Claude-only repositories, managed Headroom blocks, incomplete managed markers, and small legitimate Claude-specific notes.
- [x] Keep `RUNTIMES-J1`, the standard wording, severity, and downstream repository files unchanged; regenerate the published rubric only if canonical item metadata changes.

## Files touched

- `skills/keystone/ki-repo/scripts/rubric/contexts/audit.ts`
- `skills/keystone/ki-repo/scripts/rubric/contexts/repository.test.ts`
- `docs/roadmap/KI-HARNESS-GOV-088-detect-inverted-root-orientation.md`

## Verify

- Focused repository fixtures prove the evidenced 41-line/15-line inversion warns while conforming, Claude-only, managed-block, incomplete-marker, and small-note cases retain their intended outcomes.
- `bun test skills/keystone/ki-repo/scripts/rubric/contexts/repository.test.ts` passes.
- `ki repo audit --skill ki-repo --repo .`, `ki repo audit --skill ki-skills --repo .`, and `ki repo audit --skill ki-work-roadmap --repo .` pass.
- `bun run test` and `bunx tsc --noEmit` pass.

## Dependencies / blocks

No external dependency blocks the implementation. The current user instruction approves adoption, readiness, and bounded delivery. The existing WARN severity and standard are locked; any broader semantic orientation analysis or severity promotion is excluded.

## Documentation impact

### Decision Records

No Decision Record is required because the accepted orientation contract and authority split do not change; this delivery closes an implementation gap in its existing mechanical warning.

### Specifications

No separate Specification changes. The existing `ki-repo` standard and `RUNTIMES-4` rubric item remain the accepted behaviour owner.

### Guides

No guide changes. The finding message and existing standard give maintainers the repair direction.

### Roadmap

No downstream migration item is created by this delivery. Wider repository reviews can surface any newly detected inversions through their owning review records.

## Review

### Delivered

Delivered the approved warning-only `RUNTIMES-4` implementation from baseline `ea0422363fb02ebdad908ef77f78d34130671fd3`. Multi-runtime repositories now warn when substantive unmanaged orientation is materially heavier in `CLAUDE.md` than `AGENTS.md`; Claude-only repositories, imports, headings, comments, short appendices, and complete Headroom learning blocks remain outside that signal. No downstream repository, standard wording, severity, or judgment item changed.

### Change Summary

`audit.ts` gained a bounded substantive-line counter, complete Headroom-block exclusion, and the conservative eight-line and greater-than-two inversion check. `repository.test.ts` gained fixtures for the observed inversion, complete and incomplete managed blocks, and a small Claude-specific appendix. The planned generated-rubric step was correctly skipped because canonical rubric metadata did not change.

### Verification

`bun test skills/keystone/ki-repo/scripts/rubric/contexts/repository.test.ts` passed 46 tests. `ki repo audit --skill ki-repo --repo .`, `ki repo audit --skill ki-skills --repo .`, and `ki repo audit --skill ki-work-roadmap --repo .` passed. `bunx tsc --noEmit` passed. `bun run test` passed 761 tests across 137 files with zero failures.

### Outstanding concerns

None within the approved item. The warning is deliberately heuristic and remains paired with `RUNTIMES-J1` human review rather than claiming semantic proof or changing severity.

### Post-change review

The goal is met within scope: the exact inversion that previously passed now emits a repository-owned warning, while explicit boundary fixtures constrain false positives around managed Claude material and small appendices. The change is read-only, root-only, and multi-runtime-only, so regression risk is limited to an additional WARN where repository orientation is materially inverted. The item is ready for acceptance review.

### Mini recap

GOV-088 now detects a thin shared `AGENTS.md` paired with substantially heavier unmanaged `CLAUDE.md` orientation. Focused, full-suite, type, and governance gates pass with no unresolved item-scoped concern. Any future semantic classification or severity change should be routed as separate work rather than widening this delivered warning.

## Discussion

### What a stronger check could measure

Several options, in rough order of how much they assume:

Relative weight is the bluntest and probably the most honest: if `CLAUDE.md` carries substantially more non-import prose than `AGENTS.md`, the orientation is in the wrong file regardless of what either says. It needs a threshold, and a threshold invites argument, but it would have caught this case at roughly 3:1.

Section shape is narrower and more defensible: a conforming `CLAUDE.md` contains the import, optionally a sentence explaining the arrangement, and optionally Claude-specific sections — so a top-level heading in `CLAUDE.md` that describes the repository, its stack, or its commands is the signal, not the line count.

Managed regions complicate both. `ki-website`'s `CLAUDE.md` legitimately retains Headroom's rendered `headroom:learn` block, which `ki-housekeeping-claude` treats as a Claude-specific surface. Any weight or section measure has to exclude marker-bounded managed regions or it will penalise a conforming repository for content it does not own.

### Why not just rely on the review lenses

Because the estate is larger than the set of repositories anyone reviews by hand, and the mechanical arm is what runs everywhere. A lens that exists only in `mode-review.md` catches the repositories that get reviewed; the repositories most likely to have drifted are the ones that do not.

### Open questions

Whether the check should also verify the converse — that a repository declaring only `claude-code` is _not_ penalised for keeping everything in `CLAUDE.md`, which `standards-repository.md` explicitly permits. A naive weight comparison would flag exactly that legitimate arrangement, so the runtime declaration has to gate the check rather than the file layout alone.

Whether `AGENTS.md` should additionally be required to be non-trivial in absolute terms. A repository with two thin files is differently broken from one with an inverted pair, and the two probably want different messages.

### Readiness decision

The relative-weight heuristic is deliberately conservative and warning-only. Eight substantive Claude-owned lines avoids treating a short appendix as inverted, the greater-than-two ratio catches the cited failure, and complete managed-block exclusion avoids penalising Headroom output. Incomplete marker pairs remain substantive rather than being silently hidden from evidence.

### Handoff origin

Raised from `knowledgeislands/ki-website` during a session that corrected the inversion locally (`ki-website@db9902c`). Non-blocking in both directions: `ki-website` needs nothing from this item, and this item needs nothing from `ki-website`. There is no reciprocal record there, because the local correction was an ordinary commit rather than a tracked work item.
