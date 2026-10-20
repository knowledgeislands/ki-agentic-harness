---
id: KI-HARNESS-GOV-225
area: GOV
title: Hook content claims
purpose: capability
project: tools-burndown
component: keystone
priority: medium
size: m
kind: deliver
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-19T22:46:17Z
updated_at: 2026-10-20T04:30:00Z
transferred_from: ki-principal ki.tools-burndown hooks-standard design section 4.2, HOOK-CAPTURE a), 2026-10-19
---

# KI-HARNESS-GOV-225: Hook Content Claims

## Goal

Each shape skill declares, in its rubric catalogue, the check-only lines it requires in a repository's committed `.githooks/pre-commit` and `.githooks/commit-msg`, and `ki-repo` declares the frame they follow, so that the `ki` host can compose a repository's hooks from the skills it declares instead of anyone writing them by hand.

## Context

Kris decided on 19 October, under GIT-HOOKS a) in the ki.tools-burndown [decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.tools-burndown/decisions.md), that all hook content lives in a committed `.githooks/`. ki-agentic-harness `95a1ab58` standardised the convention: [ADR-KI-HARNESS-SKILLS-017](../decisions/ADR-KI-HARNESS-SKILLS-017-commit-gate-existence-and-content-are-owned-separately.md) keeps existence and binding with `ki-repo` and content with the shape skills, and `HOOK-1` to `HOOK-5`, `SCR-5`, `SCR-11` and `GATE-1` audit the result. None of them creates a hook.

The [hooks-standard design](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.tools-burndown/design/hooks-standard.md), section 2.2, tabulates each shape's content and owning criterion: Bun (`SCR-11`), Knowledge Base (`GATE-1`), harness (a new `ki-repo-harness` criterion), Bash tool (`SHELL-HOOK`), chezmoi source (`GIT-2`) and the `HOOK-1`-only remainder. Section 4.2 names a claims mechanism on the model of the package-script claims. Kris took HOOK-CAPTURE a) at 23:21 BST: capture now, plans refined by pilot evidence, with the host in tools-ki, [KI-TOOL-KI-CLI-165 (pruned)](https://github.com/knowledgeislands/tools-ki/blob/fde00e97/docs/roadmap/KI-TOOL-KI-CLI-165-hook-composition-claims-host.md), and the declarations and standards here. The wave 1 pilot hand-wrote va-principal's `pre-commit` because no claim existed.

## Boundary

- In: the claim declaration shape in the rubric catalogue contract, beside `packageScripts`; the `ki-repo` frame template as declared data, matching the `HOOK-4` frame rule; claims from `ki-engineering`, `ki-repo-kb`, `ki-repo-tools`, `ki-repo-dotfiles-chezmoi` and `ki-repo-harness`; the new `ki-repo-harness` content criterion the design names; standard text in `ki-repo` and each shape skill saying that conform composes from claims; checker tests.
- Out: the host loader, composer and conform step, which [KI-TOOL-KI-CLI-165 (pruned)](https://github.com/knowledgeislands/tools-ki/blob/fde00e97/docs/roadmap/KI-TOOL-KI-CLI-165-hook-composition-claims-host.md) owns; `commit-msg` content for package-less repositories until `ki git check-message` ships in [KI-TOOL-KI-CLI-161 (pruned)](https://github.com/knowledgeislands/tools-ki/blob/ce905bee422605f2f7c7c4c2d94819582f0c56b8/docs/roadmap/KI-TOOL-KI-CLI-161-git-check-message.md); raising the hook checks to FAIL; running conform in any repository.

## Current state

Checked on 20 October 2026 on branch `roll-standards`, after step 6.1 of the [Git hooks model](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.chezmoi/design/git-hooks-model.md). Kris's STRICTNESS-CONFORM decision there settles the open questions below: there is one canonical hook pair per `primary_shape` and package presence, composed in a fixed order from the `ki-repo` frame and each shape's block, audited by exact comparison and with no extension point, so no repository keeps an unclaimed line; a repository-specific check becomes a criterion of its shape skill, run through the focused staged audit.

- The claims live as data in `ki-repo`, `skills/keystone/ki-repo/scripts/rubric/contexts/canonical-hooks.ts`, not in the rubric catalogue contract beside `packageScripts`.
- `ki-repo` `HOOK-4` compares each committed hook byte for byte with that text, and `HOOK-1` to `HOOK-4` are not applicable where a shape declares no hook.
- Each shape skill publishes its generated worked example under `assets/githooks/{package,no-package}/`, written by `ki-repo`'s generator.
- Content criteria: `ki-engineering` `SCR-11` and `PKG-6`, `ki-authoring` `MD-hook`, `ki-repo-kb` `GATE-1`, `ki-repo-harness` `GATE-1`, `ki-repo-tools` `SHELL-HOOK` and `ASSEMBLE-1`, and new `GATE-1` criteria in `ki-repo-specifications` and `ki-repo-homebrew-tap`; `ki-repo-dotfiles-chezmoi` `GIT-2` now requires that no hook is committed or bound.
- The harness's own hooks are its canonical package pair.

The host still composes nothing: writing the canonical text into a repository is [KI-TOOL-KI-CLI-165 (pruned)](https://github.com/knowledgeislands/tools-ki/blob/fde00e97/docs/roadmap/KI-TOOL-KI-CLI-165-hook-composition-claims-host.md), which can now read the published assets or the composer rather than a catalogue claim.

## Steps

- [x] Settle where the claim shape lives and how lines are ordered: settled by STRICTNESS-CONFORM, as above.
- [x] ~~Add the hook-line claim shape beside `packageScripts` in the catalogue contract.~~ Superseded: the claims are `ki-repo` data.
- [x] Declare the `ki-repo` frame as data and make `HOOK-4` compare against it.
- [x] Add each shape's block and content criterion, including the new `ki-repo-harness` criterion.
- [x] Add the standard text in `ki-repo` and each shape skill, and regenerate the affected rubrics.
- [ ] Agree with the owner whether this record now closes, leaving composition in repositories to KI-TOOL-KI-CLI-165.

## Files touched

- `skills/keystone/ki-repo/` composer, generator, standard, rubric items and `rubric.md`
- `ki-engineering`, `ki-authoring`, `ki-git` and the eight `ki-repo-*` shape skills' standards, criteria, `assets/githooks/` and `rubric.md`
- The harness's own `.githooks/`, `package.json` and `AGENTS.md`

## Verify

- `bun run test` and `bunx tsc --noEmit` pass.
- `ki dev skill rubric` leaves no diff for each touched skill, and `ki repo audit --skill ki-repo` and `--skill ki-repo-harness` report no FAIL here.

## Dependencies / blocks

KI-TOOL-KI-CLI-165 can proceed against the published canonical hooks. Kris's STRICTNESS-CONFORM decision brought the Project, homebrew-tap and specifications shapes in, which NO-GATE had parked.

## Documentation impact

### Decision Records

[ADR-KI-HARNESS-SKILLS-017](../decisions/ADR-KI-HARNESS-SKILLS-017-commit-gate-existence-and-content-are-owned-separately.md) is refined in place for the canonical hook and exact comparison.

### Specifications

None: the canonical text is harness data.

### Guides

None.

### Roadmap

None beyond KI-TOOL-KI-CLI-165 in tools-ki.

## Discussion

### Contract placement

The claim shape is read by the `ki` host, so it may belong in a KI Specifications contract rather than in the harness alone, as the rubric catalogue contract does. Planning should decide where it lives before either side writes code.

### Order and repository-specific lines

When several skills claim lines in one hook, the composed order must be stable: the design puts Bun lines first and the KB audit after them. Planning should decide whether order follows declared skill order or an explicit rank, and how a repository keeps lines no skill claims, which KI-TOOL-KI-CLI-165 also asks.

### Disposition, 20 October 2026

Kris Brown answered HARNESS-TRIAGE on 20 October 2026 in the ways-of-working decisions log, "owner answers on the 03:08 BST send": "let's get the ball moving forwards", taken as a) with changes. Adopted into Next. Planning decides whether the contract belongs in KI Specifications.
