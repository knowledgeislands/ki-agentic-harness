---
id: KI-HARNESS-GOV-088
area: GOV
title: Detect inverted root orientation
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
transferred_from: knowledgeislands/ki-website
created_at: 2026-09-23T14:37:17Z
updated_at: 2026-09-23T14:37:17Z
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

### Handoff origin

Raised from `knowledgeislands/ki-website` during a session that corrected the inversion locally (`ki-website@db9902c`). Non-blocking in both directions: `ki-website` needs nothing from this item, and this item needs nothing from `ki-website`. There is no reciprocal record there, because the local correction was an ordinary commit rather than a tracked work item.
