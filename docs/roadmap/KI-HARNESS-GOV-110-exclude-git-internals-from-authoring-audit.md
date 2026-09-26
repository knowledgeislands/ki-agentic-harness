---
id: KI-HARNESS-GOV-110
area: GOV
title: Exclude Git internals
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-26T17:09:48Z
updated_at: 2026-09-26T17:09:48Z
---

# KI-HARNESS-GOV-110: Exclude Git Internals

## Goal

Repository authoring audits assess the selected checkout without treating physical Git metadata or sibling worktree contents as part of that checkout. Tracked Markdown in the selected worktree remains fully audited.

## Context

A full `ki repo audit` of the Harness reported `MD049` failures from Markdown below `.git/paperclip-worktrees/**`. Those files belong to active sibling Paperclip worktrees, not to the selected primary checkout, so their findings make the primary checkout appear unstable and allow one worktree to fail another's audit.

The authoring audit must exclude the repository's physical `.git/**` from discovery, including `.git/paperclip-worktrees/**`, while continuing to inspect tracked Markdown rooted in the selected worktree. The rule must also respect linked-worktree layouts where `.git` is a pointer file rather than a directory.

No existing roadmap item owns this audit-boundary defect. The nearest active worktree item, `KI-HARNESS-GOV-109`, concerns missing commit gates inside linked worktrees rather than cross-worktree file discovery.

## Boundary

This item does not modify, format, audit, or remove files inside active Paperclip worktrees. It does not broadly exclude hidden directories, weaken Markdown rules, suppress genuine findings from tracked files in the selected worktree, or implement the fix during intake capture.

## Discussion

### Stability boundary

An audit result should depend on the selected repository revision and its declared local configuration. Traversing Git's private storage makes that result depend on unrelated concurrent branches and temporary coordination state, so identical selected-checkout content can alternate between pass and fail.

### Verification shape

Later planning should prove both sides of the boundary: a deliberately non-conforming Markdown file below the selected worktree must still fail, while the same fixture below physical `.git/**`, including a Paperclip worktree path, must not enter the authoring audit. The test must exercise the discovery path used by the full repository audit rather than only a helper in isolation.
