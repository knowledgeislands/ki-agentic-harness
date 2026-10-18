---
id: KI-HARNESS-GOV-199
area: GOV
title: Thread identity and role
kind: deliver
purpose: governance
project: ways-of-working
component: governance
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: 72ad16866f1f3b4fbae2cac0f7c1ce09395465d2
created_at: 2026-10-16T21:28:02Z
updated_at: 2026-10-18T02:22:09Z
---

# KI-HARNESS-GOV-199: Thread Identity and Role

## Goal

Every agent and tool can tell which piece of work a native client session belongs to and whether that work coordinates, from one portable declaration in its work file `+/_WORK/<id>/work.md`, so that coordinator forms reach only coordinating work and conversational work such as Acquire's intake keeps its plain replies on every client and host.

## Context

Kris asked on 16 October 2026, in the `ways-of-working` thread, to "take ownership of native session metadata and logical thread identity under Ways of working", recognising each session's "human name, logical thread, conversational or coordination role, repository, optional checkpoint and lifecycle state". The `session-identity` run researched the clients and drafted the plan in [its report](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_THREADS/ways-of-working/session-identity.report.md). Kris agreed it under SESSION-IDENTITY in the [decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_THREADS/ways-of-working/decisions.md):

> Take the recommended option a) for PLAN-AGREE, THREAD-KEY, BINDING-HOME, SUPPLY-CHANNEL, NAME-AUTHORITY, RECORD-OWNERS, ROLE-FIELD and ROLE-STYLE (mechanism only); capture the three records and start Phase 1 after REPLY-FORMS lands.

The agreed design: the stable key is `<repository name>/<checkpoint stem>`; the checkpoint `label` is authoritative and the native name derives from it; native session identifiers live only in a machine-local binding at `~/.local/state/ki/threads/<repository>/<stem>.json`, never committed and never moved; identity reaches a session through the launcher's environment and name, the `SessionStart` hook on startup, resume and compact, and the pasted resume line where no hook runs; drift is reported, never repaired. The role is an optional checkpoint field `role: conversational | coordination | state-of-play`, absent meaning conversational, with coordinating values valid only where `[skills.ki-pmo]` is declared.

The reply forms, agreed under REPLY-FORMS and delivered as Phase 1a in [KI-HARNESS-GOV-198](KI-HARNESS-GOV-198-reply-forms.md), narrow the plan as the [reporting-forms report](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_THREADS/ways-of-working/reporting-forms.report.md) sets out, and this record carries the narrowed text:

- ROLE-REPORT is withdrawn; the owner-report rule is not scoped by role, and Phase 3 carries no chezmoi owner-report edit.
- ROLE-STYLE decides the mechanism only: the repository keeps its `outputStyle` selection, whose scope paragraph landed with the reply forms, and `ki agent launch` starts background agents with a non-coordinator style.
- In the role-gated response table, a conversational "recap" gives the `ki-recap` session recap in its own form, not "plain text"; the conversational "hold" cell is superseded by CONV-CHECKPOINT, so a conversational thread pauses through a plain checkpoint update in `Current state` and `Next step`; and a conversational thread that ends a unit of work gives the completed-work report with no heading or banner. The "summary", "full summary", "status", "resume" and "mark" cells stand.
- Phase 1 no longer allows a messages block on a conversational checkpoint: under CONV-CHECKPOINT it carries none, and intake removes its block at its own next update.
- Phase 3 removes the hook-line scope sentence when the hook's role gate lands, with the pointer's conversational clause; the output style's scope paragraph stays, because Claude cannot unload a style.

The work model, [GDR-KI-PRINCIPAL-009](https://github.com/knowledgeislands/ki-principal/blob/main/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-009-the-work-model.md) and the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md), has since replaced the checkpoint with the work file and the thread role with the work file's `level`, and [KI-HARNESS-GOV-210](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-210-work-model-write-in.md) writes it into the harness. Under it the key becomes `<repository name>/<work id>`; `level: territory` or `level: project` is coordinating work and `level: regular` is not, so the `role` field and PMO-10's role check are superseded by `level`, which PMO-10 now checks against the id; RECORD-4 checks that coordinating work, by level or, for an old checkpoint, by role, lives only where `[skills.ki-pmo]` is declared; and the `ki-pmo` Work naming section, ids `ki`, `ki.regular`, `ki.regular.<slug>` and `ki.<project>`, replaces Thread naming and answers IDS-MIGRATE's naming half. The binding moves to `~/.local/state/ki/threads/<repository>/<work id>.json`. The agreed design otherwise stands, read with work file for checkpoint and level for role.

This record owns the harness phases. [KI-TOOL-KI-CLI-145](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-145-thread-session-bindings-role.md) owns the `ki thread` tooling and the background-agent style, and [KB-DOTFILES-UE-096](/Users/krisbrown/.local/share/chezmoi/docs/roadmap/KB-DOTFILES-UE-096-thread-identity-hook-registration.md) the hook registration. [KI-TOOL-KI-CLI-127](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-127-agent-status-live-threads.md) lists live runs and might later show bound threads; [KI-HARNESS-GOV-189](KI-HARNESS-GOV-189-move-thread-between-hosts.md) owns moving a thread between hosts, which this work leaves to it, since bindings are rebuilt on each host.

## Boundary

- **Phase 1, standard.** In `ki-checkpoint`: the optional `role` field, its three values, the conversational default and the rule that coordinating values need `[skills.ki-pmo]`, with its rubric checks; a "thread identity and native sessions" section giving the key, the label as authority, the binding as a local runtime file outside every checkpoint, the three supply channels and drift as report-only, with pointers from the `ki-pmo` Glossary and `ki-delegation`. In `ki-pmo`: Thread types reads the role; Report forms and the SKILL description gate the coordinator forms to coordinating roles with the narrowed role-gated table; Bootstrap binds the session and checks the declared role against the opener; Re-anchoring is limited to coordinating roles; the scope sentences in the hook line and output style read "whose checkpoint declares role coordination or state-of-play" once the territory's coordinating checkpoints carry the field; the rubric item that every coordinating checkpoint carries `role`; and regeneration through `ki dev skill generate ki-pmo --write`. The migration adds `role` to every existing coordinating checkpoint through each thread's own next update or the state-of-play messages block, never by another thread editing it.
- **Thread naming.** Kris set the thread id, slug and title model on 17 October under THREAD-IDS and THREAD-IDS-DOC in the [decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_THREADS/ways-of-working/decisions.md): "I'd like to think of threads as having an id, slug, and title", then "so document the naming approach". One canonical Thread naming section in the `ki-pmo` standard defines the id (`<territory>.sop`, `<territory>.<initiative>.<project>`, `<territory>.<slug>`) as authoritative, the slug derived from it for every file and folder name, and the title and label from display names, superseding NAMING's label rule; `ki-checkpoint` and `ki-delegation` point to it. The `id` and `title` front-matter fields, checker support and renaming existing checkpoints, folders, runs and labels wait on the owner's migration answer, IDS-MIGRATE, in the [thread-ids report](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_THREADS/ways-of-working/thread-ids.report.md).
- **Phase 3, hook script.** The shared `SessionStart` script gains `startup` and `resume` handling that emits the identity line ending `role <role>`; `UserPromptSubmit` emits the coordinator line, and `compact` the re-anchoring pointer, only when the resolved role is coordinating; an unbound session in a `ki-pmo` checkout gets nothing; silent under `KI_AGENT_RUN`. The hook-line scope sentence and the pointer's conversational clause go.
- **Phases 4, 4b and 5.** The pilot result on intake and on the ways-of-working coordination thread is recorded here before acceptance. The intake pilot waits for PILOT-LABEL.
- **Out:** writing to native sessions beyond the owner's own hand rename; arbitrary vendor metadata; a role in any native name or vendor field; ChatGPT chat binding beyond paste; Claude Desktop and web; moving bindings between hosts; changes to `ki agent` runs beyond the background-agent style; intake's acquisition contract; any coordinator ceremony for conversational threads; FOOTER-PROJECTS. The thread-naming model answers NAME-ROOT and carries NAME-HOST's suffix rule, pending THREAD-IDS-AGREE.

## Current state

The work-model write-in under [KI-HARNESS-GOV-210](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-210-work-model-write-in.md) supersedes the `role` field, the role-reading PMO-10 and Thread naming, as Context sets out; old checkpoints keep `role` through the migration's tolerance window. The steps below are read under the work model: the identity section names the work file and work id, and the role gating reads `level`.

The Thread naming section has landed in the `ki-pmo` standard, with pointers from `ki-checkpoint` and `ki-delegation`, documenting the model only. Phase 1's role field has landed: the `ki-checkpoint` Thread role section with the optional `role` field, its three values, the conversational default and the `[skills.ki-pmo]` rule, checked by RECORD-2 and the new RECORD-4; one paragraph in the `ki-pmo` Thread types section; and the new PMO-10 rubric item, at WARN while existing coordinating checkpoints migrate through their own updates. The rest of Phase 1, the identity section and the `ki-pmo` Bootstrap and Re-anchoring role edits, the naming migration, the scope-sentence rewording, Phase 3 and the pilots remain.

## Steps

- [x] Add the `role` field, its three values, the conversational default and the `[skills.ki-pmo]` rule to the `ki-checkpoint` standard, with RECORD-2 accepting the field and RECORD-4 gating coordinating values.
- [x] Have `ki-pmo` Thread types read the role, and add PMO-10 checking that every coordinating checkpoint declares it.
- [x] Regenerate both rubrics and the `ki-pmo` surfaces.
- [x] Document the thread id, slug and title model in one `ki-pmo` Thread naming section, pointed to from `ki-checkpoint` and `ki-delegation`.
- [ ] Once the owner answers IDS-MIGRATE, accept `id` and `title` in the `ki-checkpoint` checker and carry out the approved renames in their order. Superseded by the work model: the work file carries `id` and `title`, and the moves happen in the migration's phase 3.
- [ ] Add the thread identity and native sessions section to `ki-checkpoint`, with pointers from the `ki-pmo` Glossary and `ki-delegation`.
- [ ] Gate Report forms by role with the narrowed role-gated table; have Bootstrap check the declared role against the opener; limit Re-anchoring to coordinating roles.
- [ ] Once the territory's coordinating work has work files, reword the hook-line and output-style scope sentences to "whose work file declares level territory or project" and regenerate.
- [ ] Phase 3: the hook script's identity line and role gate, removing the hook-line scope sentence and the pointer's conversational clause.
- [ ] Record the pilot results from Phases 4 and 4b.

## Files touched

- `skills/governance/ki-checkpoint/references/standards-checkpoints.md`, `references/rubric.md`, `scripts/rubric/contexts/checkpoints.ts`, `checkpoints.test.ts`, `scripts/rubric/items/records.ts`
- `skills/change-management/ki-pmo/references/standards-pmo.md`, `references/rubric.md`, `scripts/rubric/contexts/pmo.ts`, `pmo.test.ts`, `scripts/rubric/items/threads.ts`
- `skills/governance/ki-delegation/references/standards-background-runs.md`
- Later: `hooks/coordinator-reminder.sh` and its test, `output-styles/ki-coordinator.md`
- `docs/roadmap/_ISSUES.md`, this record

## Verify

`bun run test`, `bunx tsc --noEmit`, and `ki repo audit --skill ki-checkpoint`, `--skill ki-pmo`, `--skill ki-skills` and `--skill ki-work-roadmap`, run sequentially; then the pilot steps in the session-identity report.

## Dependencies / blocks

- Phase 1 depended on REPLY-FORMS landing, done in [KI-HARNESS-GOV-198](KI-HARNESS-GOV-198-reply-forms.md).
- Phase 3 needs [KI-TOOL-KI-CLI-145](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-145-thread-session-bindings-role.md) for the binding file and [KB-DOTFILES-UE-096](/Users/krisbrown/.local/share/chezmoi/docs/roadmap/KB-DOTFILES-UE-096-thread-identity-hook-registration.md) for the matchers.
- The intake pilot waits for PILOT-LABEL, which now waits for THREAD-IDS-AGREE and IDS-MIGRATE.

## Documentation impact

### Decision Records

None: the decisions are Kris's SESSION-IDENTITY and REPLY-FORMS answers, quoted in the standards and the decisions log.

### Specifications

None: the `ki-checkpoint` and `ki-pmo` standards are the contracts and change in place.

### Guides

None yet; the website skills guide describes skills by outcome. Revisit when `ki thread` ships in [KI-TOOL-KI-CLI-145](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-145-thread-session-bindings-role.md), which will need a how-to.

### Roadmap

The tooling and registration follow in [KI-TOOL-KI-CLI-145](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-145-thread-session-bindings-role.md) and [KB-DOTFILES-UE-096](/Users/krisbrown/.local/share/chezmoi/docs/roadmap/KB-DOTFILES-UE-096-thread-identity-hook-registration.md).

## Discussion

Open for planning: whether the identity section lands with the role field or with the hook in Phase 3, since nothing reads the binding until the tooling exists.

PMO-10 uses the file name only to choose which checkpoints to ask, never to decide the role: an `<initiative>.<project>` checkpoint passes with `role: coordination` or `role: conversational`, so the owner's declaration always wins. It sits at WARN rather than FAIL so that ki-principal's gate keeps passing while each coordinating thread adds its field at its own next update.
