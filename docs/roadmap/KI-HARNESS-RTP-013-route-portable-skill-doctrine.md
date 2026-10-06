---
id: KI-HARNESS-RTP-013
area: RTP
title: Route portable skill doctrine
theme: runtime-portability
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: c9ccf3096be175e0d52905d20ab7de361c001347
created_at: 2026-09-25T05:34:19Z
updated_at: 2026-10-06T21:19:43Z
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

- [x] Add a short "Classifying user-level instructions" section to `standards-knowledge-promotion.md`, after the promotion loop: take one section at a time; compare it with the current owning standard; classify it as already owned (remove or leave a pointer), missing portable doctrine (generalise into the owning skill), conflicting (retire, not promote), repository fact (route to `AGENTS.md`), or personal or machine-specific (retain); and verify each affected skill without the user file, reporting unavailable user-level evidence as a limit rather than a pass. The input is prose the owner supplies or a tracked source the owner points to, never a scan of a home directory.
- [x] Replace the overlapping sentences in the chezmoi standard's agent-instruction layering section with a one-line pointer to that method, keeping its decision rule and the evidence-unavailable reporting requirement.
- [x] Verify `ki-git` without user files: in a session started with user-level instruction loading disabled or an empty runtime configuration directory, read only the harness's tracked `ki-git` skill and this repository's orientation, and confirm each Git working-practice rule class named in Context (touched-path tracking, explicit-path staging, the serialized write window, contested paths, the `--` pathspec separator, no hook bypass) is stated in `skills/governance/ki-git/references/standards-git.md` or its `SKILL.md`. Record the session's start command, the mapping, and any gap in a `## Verification evidence` section of this record; route a gap to `ki-git` rather than to user scope.
- [x] Record the `KI-SHAPE-10` judgment outcome for `ki-git` from `ki repo audit --skill ki-skills` with that evidence.

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

## Verification evidence

### Session

Run from the delivery worktree at baseline `c9ccf3096be175e0d52905d20ab7de361c001347`, with the uncommitted standard edits present, on 2026-10-06:

```bash
CLAUDE_CODE_DISABLE_CLAUDE_MDS=1 claude -p --setting-sources project --strict-mcp-config --allowedTools Read < prompt.txt
```

The prompt first asked the session, before any tool use, to list every instruction or memory file in its context and whether its context contained the heading "Personal working preferences", which opens the owner's user-level `CLAUDE.md`. It then limited reading to `skills/governance/ki-git/SKILL.md`, `skills/governance/ki-git/references/standards-git.md` and `AGENTS.md`, and asked for a location or `GAP` for each rule class. The prompt, verbatim:

```text
You are verifying that the ki-git skill is portable: its Git working-practice doctrine must be stated in tracked repository files, not in any user-level instruction file.

First, without tools, state yes/no whether any CLAUDE.md, AGENTS.md or other instruction or memory file was loaded into your context, and whether your context contains the exact heading "Personal working preferences".

Then read ONLY these three files with the Read tool (relative to the current directory) and no others:
- skills/governance/ki-git/SKILL.md
- skills/governance/ki-git/references/standards-git.md
- AGENTS.md

For each rule class below, give the file and line number(s) where it is stated, with a short quote (under 20 words), or write GAP if it is not stated in those files:
1. touched-path tracking
2. explicit-path staging (never `git add -A` / `.`)
3. the serialized (serialised) write window for shared-tree Git writes
4. contested paths (paths another writer is also changing)
5. the `--` pathspec separator
6. no hook bypass (`--no-verify`)

Output a compact Markdown table: rule class | location | quote-or-GAP. Then one line naming any GAP.
```

- **No user-level file loaded:** the isolated session reported no instruction or memory file and no canary heading. A control with the same prompt and no `CLAUDE_CODE_DISABLE_CLAUDE_MDS` reported the user-level `CLAUDE.md` and its imports and found the canary, so the probe detects loading; `--setting-sources project` alone did not suppress the user file. An empty `CLAUDE_CONFIG_DIR` was tried first and could not authenticate.
- **Limit:** the absence of user-level instructions rests on the session's own report, corroborated by the control. Skill discovery and settings outside instruction files were not separately inventoried, and the read set rests on the prompt's restriction and the session's report rather than an inventoried tool-call transcript; `--allowedTools Read` does not technically confine reads to the worktree.

### Mapping

| Rule class | Tracked `ki-git` location |
| --- | --- |
| Touched-path tracking | `references/standards-git.md:101`; named in the `SKILL.md` description |
| Explicit-path staging | `references/standards-git.md:107` |
| Serialised write window | `references/standards-git.md:105` |
| Contested paths | `references/standards-git.md:103` |
| `--` pathspec separator | `references/standards-git.md:127` |
| No hook bypass | `references/standards-git.md:109`, added by this delivery |

The first session found one gap: `standards-git.md` described that Husky can be bypassed with `--no-verify` but did not forbid it. The gap was routed to `ki-git` as one sentence at the start of the post-commit inspection paragraph, and a second isolated session with the same start command located it at line 109.

### KI-SHAPE-10

Outcome for `ki-git`: conforming. With the gap closed, every listed Git working-practice rule class is stated in tracked `ki-git` files, and neither `SKILL.md` nor `standards-git.md` refers to a home-directory path or a personal instruction file. `ki repo audit --skill ki-skills` reports FAIL=0 with only the pre-existing `LONG-3` cadence warning; `KI-SHAPE-10` is a judgment criterion, so the audit itself does not decide it.

## Review

### Delivered

Within the recorded boundary, from baseline `c9ccf3096be175e0d52905d20ab7de361c001347`: the five-way classification method in `ki-authoring`, a pointer to it from the chezmoi layering section, `ki-git` verified without user-level instructions, and one routed `ki-git` gap. No home directory was scanned, the dotfiles repository was neither read nor changed, no personal prose was copied, no mechanical criterion was added, and no further skill was verified.

### Change Summary

- `skills/governance/ki-authoring/references/standards-knowledge-promotion.md`: new "Classifying user-level instructions" section after the promotion loop, with one-section-at-a-time review, the five classes, the without-user-files verification step, limit reporting, and the owner-supplied input rule.
- `skills/repo-structure/ki-repo-dotfiles-chezmoi/references/standards-chezmoi-dotfiles.md`: the "check it still works without those files" sentence becomes a pointer to that method; the decision rule, the evidence-unavailable reporting sentence and the `KI-SHAPE-10` sentence remain.
- `skills/governance/ki-git/references/standards-git.md`: one sentence forbidding hook bypass with `--no-verify` and requiring a failing hook to be fixed or reported.
- This record: Verification evidence and this packet.

### Verification

1. `standards-knowledge-promotion.md` contains the five classes, the without-user-files step, and the statement that input is never gathered by scanning a home directory.
2. The chezmoi standard points to the method and keeps its decision rule and evidence-unavailable reporting.
3. Verification evidence above names the start command, shows the canary result with its control, and maps all six rule classes.
4. Only files in this repository changed. The isolated sessions were instructed to read only the named worktree files and reported doing so; see the limit above.

- `bun run test`: 945 pass, 0 fail. `bunx tsc --noEmit`: clean. `bunx biome check .`: no errors.
- `ki repo audit --skill ki-authoring`: PASS. `ki-skills`: FAIL=0, WARN=1, the pre-existing `LONG-3` cadence warning. `ki-git`: PASS.
- `ki repo audit --skill ki-repo-dotfiles-chezmoi`: not applicable here; the CLI reports `--skill must name one declared resolved skill` because this repository does not declare that skill. `bunx rumdl check` on the changed standard is clean.

### Outstanding concerns

- The new `ki-git` hook-bypass sentence is normative; it states the rule class the plan names, but the owner should confirm its wording at acceptance.
- The planned `ki-repo-dotfiles-chezmoi` audit cannot run in this repository; it applies in a repository that declares that skill.

### Post-change review

The goal is met for the bounded scope: the classification method exists in its owning standard, the chezmoi section no longer restates it, and one skill has recorded evidence of working without user-level instructions. Regression risk is low: prose in three standards. Independent Fable review approved with no blocking findings; its two should-fix findings (state the read-set limit, record the prompt verbatim) and its forward-reference nit were applied. Its remaining nits leave the unrunnable chezmoi audit line in Verify for the acceptor to decide and note pre-existing US spelling in Steps. Ready for acceptance.

### Mini recap

Added the user-level classification method, pointed the chezmoi standard at it, verified `ki-git` in a session with `CLAUDE_CODE_DISABLE_CLAUDE_MDS=1`, and closed the one gap in `ki-git`. Gates green apart from one pre-existing warning. Learning route proposed: the isolated-session recipe and its canary control could become part of the method's verification step, through `ki-next` if wanted.

## Done

Accepted 2026-10-06 by Kris Brown on the review packet above.

## Discussion

### Detection boundary

Whether prose is personal preference, repository fact, or reusable doctrine is necessarily a review-time judgement. Mechanical support could inventory explicit user-level imports, but a clean skill repository cannot prove that no external file changes its behaviour. Audit reporting must say when user-scope evidence was unavailable rather than imply portability was proven.

### Repository review

The repository-review checklist already asks whether root orientation contains only repository-specific facts and points to governing skills. The classification method complements that lens for user-level files rather than adding a second competing portability rule.

### History

A 2026-09-27 pickup checkpoint verified `9b2efa68` and `15faa4e7` as partial delivery against local `main` at `0ad0377a0e7e14b1cd7314bce414d4871b062efc`, and treated the personal-file reduction at receiving commit `9511644` as a historical claim rather than a freshly verified migration. Those findings are carried into Current state above.

A 2026-10-06 re-check at `e30948ad` found the record's state honest: what `9b2efa68` delivered is already in Current state, and none of the four Steps has landed, so the record stays `ready` with no baseline rather than being started without delivery.
