---
id: KI-HARNESS-GOV-225
area: GOV
title: Hook content claims
purpose: capability
project: tools-burndown
component: keystone
priority: medium
size: m
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-19T22:46:17Z
updated_at: 2026-10-20T00:51:03Z
transferred_from: ki-principal ki.tools-burndown hooks-standard design section 4.2, HOOK-CAPTURE a), 2026-10-19
---

# KI-HARNESS-GOV-225: Hook Content Claims

## Goal

Each shape skill declares, in its rubric catalogue, the check-only lines it requires in a repository's committed `.githooks/pre-commit` and `.githooks/commit-msg`, and `ki-repo` declares the frame they follow, so that the `ki` host can compose a repository's hooks from the skills it declares instead of anyone writing them by hand.

## Context

Kris decided on 19 October, under GIT-HOOKS a) in the ki.tools-burndown [decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.tools-burndown/decisions.md), that all hook content lives in a committed `.githooks/`. ki-agentic-harness `95a1ab58` standardised the convention: [ADR-KI-HARNESS-SKILLS-017](../decisions/ADR-KI-HARNESS-SKILLS-017-commit-gate-existence-and-content-are-owned-separately.md) keeps existence and binding with `ki-repo` and content with the shape skills, and `HOOK-1` to `HOOK-5`, `SCR-5`, `SCR-11` and `GATE-1` audit the result. None of them creates a hook.

The [hooks-standard design](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.tools-burndown/design/hooks-standard.md), section 2.2, tabulates each shape's content and owning criterion: Bun (`SCR-11`), Knowledge Base (`GATE-1`), harness (a new `ki-repo-harness` criterion), Bash tool (`SHELL-HOOK`), chezmoi source (`GIT-2`) and the `HOOK-1`-only remainder. Section 4.2 names a claims mechanism on the model of the package-script claims. Kris took HOOK-CAPTURE a) at 23:21 BST: capture now, plans refined by pilot evidence, with the host in tools-ki, [KI-TOOL-KI-CLI-165](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-165-hook-composition-claims-host.md), and the declarations and standards here. The wave 1 pilot hand-wrote va-principal's `pre-commit` because no claim existed.

## Boundary

- In: the claim declaration shape in the rubric catalogue contract, beside `packageScripts`; the `ki-repo` frame template as declared data, matching the `HOOK-4` frame rule; claims from `ki-engineering`, `ki-repo-kb`, `ki-repo-tools`, `ki-repo-dotfiles-chezmoi` and `ki-repo-harness`; the new `ki-repo-harness` content criterion the design names; standard text in `ki-repo` and each shape skill saying that conform composes from claims; checker tests.
- Out: the host loader, composer and conform step, which [KI-TOOL-KI-CLI-165](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-165-hook-composition-claims-host.md) owns; `commit-msg` content for package-less repositories until `ki git check-message` ships in [KI-TOOL-KI-CLI-161 (pruned)](https://github.com/knowledgeislands/tools-ki/blob/ce905bee422605f2f7c7c4c2d94819582f0c56b8/docs/roadmap/KI-TOOL-KI-CLI-161-git-check-message.md); raising the hook checks to FAIL; running conform in any repository.

## Discussion

### Contract placement

The claim shape is read by the `ki` host, so it may belong in a KI Specifications contract rather than in the harness alone, as the rubric catalogue contract does. Planning should decide where it lives before either side writes code.

### Order and repository-specific lines

When several skills claim lines in one hook, the composed order must be stable: the design puts Bun lines first and the KB audit after them. Planning should decide whether order follows declared skill order or an explicit rank, and how a repository keeps lines no skill claims, which KI-TOOL-KI-CLI-165 also asks.
