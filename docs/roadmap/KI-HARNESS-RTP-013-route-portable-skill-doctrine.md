---
id: KI-HARNESS-RTP-013
area: RTP
title: Route portable skill doctrine
theme: runtime-portability
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-25T05:34:19Z
updated_at: 2026-09-25T05:34:19Z
---

## Goal

Knowledge Islands skills behave the same without their author's private instruction files. Reusable doctrine lives in its owning skill, repository-specific guidance lives in repository orientation, and user-scope files retain only genuine personal preferences or machine-specific configuration.

## Context

A review in `kit-midnight.ninja` on 25 September 2026 found that the chezmoi-managed `dot_claude/private_workflow.md`, rendered as `~/.claude/workflow.md` and imported into every Claude session, mixes genuine preferences with portable governance doctrine. Its sections include skill-owned rules about governed audits, Git working practice, cross-repository authority, writer coordination, formatting, and language conventions.

The portability principle already exists. `KI-SHAPE-10` says a skill must not assume private personal configuration, and `ki-authoring` routes reusable operations to skills. The operational gap is that `ki-repo-dotfiles-chezmoi` currently classifies guidance only as repository-local, user-level, or persistent memory. It does not name reusable skill doctrine as a separate destination, and a repository-only skill audit cannot discover an undeclared dependency hidden in a user's home directory.

The source review also shows why migration must be semantic rather than wholesale. A home-file rule may already exist in its governing skill, may need to be generalised there, or may conflict with the current portable standard and need retirement rather than promotion.

## Boundary

This item owns the generic classification, review evidence, and migration method in the harness. It does not scan arbitrary home directories during ordinary repository audits, automatically copy personal prose into skills, or edit the dotfiles repository's `dot_claude/private_workflow.md`. That repository owns the receiver-side reduction once its roadmap is structurally clean and a local item or trade is accepted.

Genuinely personal choices, including interaction preferences, registry-publishing stance, and machine-specific source-store paths, remain user-scoped unless their governing evidence establishes a broader owner.

## Discussion

### Detection boundary

Whether prose is personal preference, repository fact, or reusable doctrine is necessarily a review-time judgement. Mechanical support can inventory explicit user-level imports and present managed instruction sections for classification, but a clean skill repository cannot prove that no external file changes its behaviour. Audit reporting must say when user-scope evidence was unavailable rather than imply portability was proven.

### Migration route

Review each user-level section against the current owning standard. Move missing portable doctrine into the relevant skill or its standard, replace duplicate home-file prose with nothing or a narrow pointer, route repository-specific facts to `AGENTS.md` or a runtime-specific appendix, and retain only actual personal preferences. Verify each affected skill without the user file present.

### Repository review

The repository-review checklist already asks whether root orientation contains only repository-specific facts and points to governing skills. This item should reconcile that lens with user-level instruction review rather than add a second competing portability rule.
