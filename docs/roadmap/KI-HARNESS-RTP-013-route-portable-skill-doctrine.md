---
id: KI-HARNESS-RTP-013
area: RTP
title: Route portable skill doctrine
theme: runtime-portability
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-25T05:34:19Z
updated_at: 2026-10-06T01:22:00Z
---

## Goal

Knowledge Islands skills behave the same without their author's private instruction files. Reusable doctrine lives in its owning skill, repository-specific guidance lives in repository orientation, and user-scope files retain only genuine personal preferences or machine-specific configuration.

## Context

A review in `kit-midnight.ninja` on 25 September 2026 found that the chezmoi-managed `dot_claude/private_workflow.md`, rendered as `~/.claude/workflow.md` and imported into every Claude session, mixed genuine preferences with portable governance doctrine. Its sections included skill-owned rules about governed audits, Git working practice, cross-repository authority, writer coordination, formatting, and language conventions.

The portability principle already exists: `KI-SHAPE-10` prohibits private-configuration assumptions, and `ki-authoring` routes reusable operations to skills. The chezmoi placement rule now names reusable skill doctrine and requires explicit reporting when user-scope evidence is unavailable (`9b2efa68`); the reviewed personal instruction files were reduced (`9511644`). What remains is a reusable classification method and evidence that at least one skill works without user files: a clean repository-only audit cannot prove independence from an unseen home file.

The source review also shows why migration must be semantic rather than wholesale. A home-file rule may already exist in its governing skill, may need to be generalised there, or may conflict with the current portable standard and need retirement rather than promotion.

## Boundary

In scope: reconciling with the delivered chezmoi routing rule rather than restating it; one classification method for user-level instruction prose in `ki-authoring`'s knowledge-promotion standard; and one skill, `ki-git`, verified without user files, with the evidence recorded in this record.

Out of scope: scanning any home directory, in an audit or during this delivery; reading or editing the dotfiles repository's `dot_claude/private_workflow.md`, whose receiver-side reduction that repository owns; automatically copying personal prose into skills; a new mechanical criterion; and verifying further skills, which follow through `ki-next` if wanted. Genuinely personal choices, including interaction preferences, registry-publishing stance, and machine-specific source-store paths, remain user-scoped unless their governing evidence establishes a broader owner.

## Current state

Delivered: `9b2efa68` added the portable-versus-repository-versus-personal decision rule to [the chezmoi standard's agent-instruction layering section](../../skills/repo-structure/ki-repo-dotfiles-chezmoi/references/standards-chezmoi-dotfiles.md#agent-instruction-layering), including "check it still works without the files" and reporting unavailable user-level evidence. `skills/governance/ki-authoring/references/standards-knowledge-promotion.md` carries the general placement ladder and promotion loop but no method for classifying an existing user-level file section by section. `KI-SHAPE-10` in `ki-skills` remains the skill-level judgment. No skill has recorded verification without user files.

## Steps

- [ ] Add a short "Classifying user-level instructions" section to `standards-knowledge-promotion.md`, after the promotion loop: take one section at a time; compare it with the current owning standard; classify it as already owned (remove or leave a pointer), missing portable doctrine (generalise into the owning skill), conflicting (retire, not promote), repository fact (route to `AGENTS.md`), or personal or machine-specific (retain); and verify each affected skill without the user file, reporting unavailable user-level evidence as a limit rather than a pass. The input is prose the owner supplies or a tracked source the owner points to, never a scan of a home directory.
- [ ] Replace the overlapping sentences in the chezmoi standard's agent-instruction layering section with a one-line pointer to that method, keeping its decision rule and the evidence-unavailable reporting requirement.
- [ ] Verify `ki-git` without user files: in a session started with user-level instruction loading disabled or an empty runtime configuration directory, read only the harness's tracked `ki-git` skill and this repository's orientation, and confirm each Git working-practice rule class named in Context (touched-path tracking, explicit-path staging, the serialized write window, contested paths, the `--` pathspec separator, no hook bypass) is stated in `skills/governance/ki-git/references/standards-git.md` or its `SKILL.md`. Record the session's start command, the mapping, and any gap in a `## Verification evidence` section of this record; route a gap to `ki-git` rather than to user scope.
- [ ] Record the `KI-SHAPE-10` judgment outcome for `ki-git` from `ki repo audit --skill ki-skills` with that evidence.

## Files touched

- `skills/governance/ki-authoring/references/standards-knowledge-promotion.md`
- `skills/repo-structure/ki-repo-dotfiles-chezmoi/references/standards-chezmoi-dotfiles.md`
- `docs/roadmap/KI-HARNESS-RTP-013-route-portable-skill-doctrine.md` (verification evidence)
- `skills/governance/ki-git/references/standards-git.md`, only if verification finds a gap

## Verify

Acceptance criteria, each judgeable by someone who did not write this:

1. `standards-knowledge-promotion.md` contains the five-way classification and the without-user-files verification step, and states that classification input is never gathered by scanning a home directory.
2. The chezmoi standard points to that method and no longer restates it; its decision rule and evidence-unavailable reporting remain.
3. This record's verification evidence names the session start command, shows no user-level instruction file was loaded, and maps every listed rule class to a tracked `ki-git` location or a routed gap.
4. No file outside this repository is read or changed by the delivery.

```bash
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-authoring --progress never
ki repo audit --skill ki-repo-dotfiles-chezmoi --progress never
ki repo audit --skill ki-skills --progress never
```

## Dependencies / blocks

None. The dotfiles repository's own reduction is its receiver-owned work and does not block this record.

## Documentation impact

### Decision Records

None.

### Specifications

`standards-knowledge-promotion.md` gains the classification method; `standards-chezmoi-dotfiles.md` replaces overlapping prose with a pointer.

### Guides

None.

### Roadmap

None.

## Discussion

### Detection boundary

Whether prose is personal preference, repository fact, or reusable doctrine is necessarily a review-time judgement. Mechanical support could inventory explicit user-level imports, but a clean skill repository cannot prove that no external file changes its behaviour. Audit reporting must say when user-scope evidence was unavailable rather than imply portability was proven.

### Repository review

The repository-review checklist already asks whether root orientation contains only repository-specific facts and points to governing skills. The classification method complements that lens for user-level files rather than adding a second competing portability rule.

### History

A 2026-09-27 pickup checkpoint verified `9b2efa68` and `15faa4e7` as partial delivery against local `main` at `0ad0377a0e7e14b1cd7314bce414d4871b062efc`, and treated the personal-file reduction at receiving commit `9511644` as a historical claim rather than a freshly verified migration. Those findings are carried into Current state above.

A 2026-10-06 re-check at `e30948ad` found the record's state honest: what `9b2efa68` delivered is already in Current state, and none of the four Steps has landed, so the record stays `ready` with no baseline rather than being started without delivery.
