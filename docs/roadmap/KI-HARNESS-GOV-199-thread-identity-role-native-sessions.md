---
id: KI-HARNESS-GOV-199
area: GOV
title: Thread identity and role
kind: deliver
purpose: governance
project: ways-of-working
component: governance
size: m
status: done
blocks: []
blocked_by: []
baseline_ref: 72ad16866f1f3b4fbae2cac0f7c1ce09395465d2
created_at: 2026-10-16T21:28:02Z
updated_at: 2026-10-20T06:59:01Z
---

# KI-HARNESS-GOV-199: Thread Identity and Role

## Goal

Every agent and tool can tell which piece of work a native client session belongs to and whether that work coordinates, from one portable declaration in its work file `+/_WORK/<id>/work.md`, so that coordinator forms reach only coordinating work and conversational work such as Acquire's intake keeps its plain replies on every client and host.

## Context

Kris asked on 16 October 2026, in the `ways-of-working` thread, to "take ownership of native session metadata and logical thread identity under Ways of working", recognising each session's "human name, logical thread, conversational or coordination role, repository, optional checkpoint and lifecycle state". The `session-identity` run researched the clients and drafted the plan in [its report (deleted)](https://github.com/knowledgeislands/ki-principal/blob/ab526abed0d493bddd9c44ddb48c104d7fa2c846/+/_THREADS/ways-of-working/session-identity.report.md). Kris agreed it under SESSION-IDENTITY in the [decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.ways-of-working/decisions.md):

> Take the recommended option a) for PLAN-AGREE, THREAD-KEY, BINDING-HOME, SUPPLY-CHANNEL, NAME-AUTHORITY, RECORD-OWNERS, ROLE-FIELD and ROLE-STYLE (mechanism only); capture the three records and start Phase 1 after REPLY-FORMS lands.

The agreed design: the stable key is `<repository name>/<checkpoint stem>`; the checkpoint `label` is authoritative and the native name derives from it; native session identifiers live only in a machine-local binding at `~/.local/state/ki/threads/<repository>/<stem>.json`, never committed and never moved; identity reaches a session through the launcher's environment and name, the `SessionStart` hook on startup, resume and compact, and the pasted resume line where no hook runs; drift is reported, never repaired. The role is an optional checkpoint field `role: conversational | coordination | state-of-play`, absent meaning conversational, with coordinating values valid only where `[skills.ki-coordination]` is declared.

The reply forms, agreed under REPLY-FORMS and delivered as Phase 1a in [KI-HARNESS-GOV-198 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/87da1b26/docs/roadmap/KI-HARNESS-GOV-198-reply-forms.md), narrow the plan as the [reporting-forms report (deleted)](https://github.com/knowledgeislands/ki-principal/blob/528b53b1cddabb0bb4fb809a426a08baac75fa8b/+/_THREADS/ways-of-working/reporting-forms.report.md) sets out, and this record carries the narrowed text:

- ROLE-REPORT is withdrawn; the owner-report rule is not scoped by role, and Phase 3 carries no chezmoi owner-report edit.
- ROLE-STYLE decides the mechanism only: the repository keeps its `outputStyle` selection, whose scope paragraph landed with the reply forms, and `ki agent launch` starts background agents with a non-coordinator style.
- In the role-gated response table, a conversational "recap" gives the `ki-recap` session recap in its own form, not "plain text"; the conversational "hold" cell is superseded by CONV-CHECKPOINT, so a conversational thread pauses through a plain checkpoint update in `Current state` and `Next step`; and a conversational thread that ends a unit of work gives the completed-work report with no heading or banner. The "summary", "full summary", "status", "resume" and "mark" cells stand.
- Phase 1 no longer allows a messages block on a conversational checkpoint: under CONV-CHECKPOINT it carries none, and intake removes its block at its own next update.
- Phase 3 removes the hook-line scope sentence when the hook's role gate lands, with the pointer's conversational clause; the output style's scope paragraph stays, because Claude cannot unload a style.

The work model, [GDR-KI-PRINCIPAL-009](https://github.com/knowledgeislands/ki-principal/blob/main/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-009-the-work-model.md) and the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md), has since replaced the checkpoint with the work file and the thread role with the work file's `level`, and [KI-HARNESS-GOV-210 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/08468196/docs/roadmap/KI-HARNESS-GOV-210-work-model-write-in.md) writes it into the harness. Under it the key becomes `<repository name>/<work id>`; `level: territory` or `level: project` is coordinating work and `level: regular` is not, so the `role` field and COORD-10's role check are superseded by `level`, which COORD-10 now checks against the id; RECORD-4 checks that coordinating work, by level or, for an old checkpoint, by role, lives only where `[skills.ki-coordination]` is declared; and the `ki-coordination` Work naming section, ids `ki`, `ki.regular`, `ki.regular.<slug>` and `ki.<project>`, replaces Thread naming and answers IDS-MIGRATE's naming half. The binding moves to `~/.local/state/ki/threads/<repository>/<slug>.json`, the slug being the id with each `.` written as `-`, as `ki-coordination` Work naming names it. The agreed design otherwise stands, read with work file for checkpoint and level for role.

This record owns the harness phases. [KI-TOOL-KI-CLI-145](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-145-thread-session-bindings-role.md) owns the `ki thread` tooling and the background-agent style, and [KB-DOTFILES-UE-096](/Users/krisbrown/.local/share/chezmoi/docs/roadmap/KB-DOTFILES-UE-096-thread-identity-hook-registration.md) the hook registration. [KI-TOOL-KI-CLI-127 (pruned)](https://github.com/knowledgeislands/tools-ki/blob/a22214ee581b73a1f395da88f9a118ad89814bb9/docs/roadmap/KI-TOOL-KI-CLI-127-agent-status-live-threads.md) lists live runs and might later show bound threads; [KI-HARNESS-GOV-189](KI-HARNESS-GOV-189-move-thread-between-hosts.md) owns moving a thread between hosts, which this work leaves to it, since bindings are rebuilt on each host.

## Boundary

- **Narrowed on 2026-10-20** to Phase 1, the Work identity and native sessions section and the Work naming model, which have landed. The re-anchoring style re-read, Phase 3 and the pilots are out of this record and travel as `messages.md` lines to `ki.ways-of-working`, which owns them; Discussion under Narrowing records where each went. The bullets below are the agreed design as planned, kept for the record.
- **Phase 1, standard.** In `ki-work-folder`: the optional `role` field, its three values, the conversational default and the rule that coordinating values need `[skills.ki-coordination]`, with its rubric checks; a "thread identity and native sessions" section giving the key, the label as authority, the binding as a local runtime file outside every checkpoint, the three supply channels and drift as report-only, with pointers from the `ki-coordination` Glossary and `ki-delegation`. In `ki-coordination`: Thread types reads the role; Report forms and the SKILL description gate the coordinator forms to coordinating roles with the narrowed role-gated table; Bootstrap binds the session and checks the declared role against the opener; Re-anchoring is limited to coordinating roles; the scope sentences in the hook line and output style read "whose checkpoint declares role coordination or state-of-play" once the territory's coordinating checkpoints carry the field; the rubric item that every coordinating checkpoint carries `role`; and regeneration through `ki dev skill generate ki-coordination --write`. The migration adds `role` to every existing coordinating checkpoint through each thread's own next update or the state-of-play messages block, never by another thread editing it.
- **Thread naming.** Kris set the thread id, slug and title model on 17 October under THREAD-IDS and THREAD-IDS-DOC in the [decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.ways-of-working/decisions.md): "I'd like to think of threads as having an id, slug, and title", then "so document the naming approach". One canonical Thread naming section in the `ki-coordination` standard defines the id (`<territory>.sop`, `<territory>.<initiative>.<project>`, `<territory>.<slug>`) as authoritative, the slug derived from it for every file and folder name, and the title and label from display names, superseding NAMING's label rule; `ki-work-folder` and `ki-delegation` point to it. The `id` and `title` front-matter fields, checker support and renaming existing checkpoints, folders, runs and labels wait on the owner's migration answer, IDS-MIGRATE, in the [thread-ids report (deleted)](https://github.com/knowledgeislands/ki-principal/blob/ab526abed0d493bddd9c44ddb48c104d7fa2c846/+/_THREADS/ways-of-working/thread-ids.report.md).
- **Phase 3, hook script.** The shared `SessionStart` script gains `startup` and `resume` handling that emits the identity line ending `role <role>`; `UserPromptSubmit` emits the coordinator line, and `compact` the re-anchoring pointer, only when the resolved role is coordinating; an unbound session in a `ki-coordination` checkout gets nothing; silent under `KI_AGENT_RUN`. The hook-line scope sentence and the pointer's conversational clause go.
- **Re-anchoring re-reads the style.** A Claude Code coordinator kept its start-up copy of the `ki-coordinator` output style after a compaction, so the loaded style can lag the file on disk. Kris answered STYLE-STALE a) on 18 October 2026 under "owner answers, re-bootstrap queries" in the [decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.ways-of-working/decisions.md), in these words: "do all the recommended items, we just need to move forwards". After a compaction, the `ki-coordination` Re-anchoring after compaction steps re-read `output-styles/ki-coordinator.md` from disk alongside the standard, the work file and the decisions log, and the coordinator follows the file wherever it differs from the loaded style; the compact pointer, the style's own re-anchoring paragraph and the regenerated surfaces say the same.
- **Phases 4, 4b and 5.** The pilot result on intake and on the ways-of-working coordination thread is recorded here before acceptance. The intake pilot waits for PILOT-LABEL.
- **Out:** writing to native sessions beyond the owner's own hand rename; arbitrary vendor metadata; a role in any native name or vendor field; ChatGPT chat binding beyond paste; Claude Desktop and web; moving bindings between hosts; changes to `ki agent` runs beyond the background-agent style; intake's acquisition contract; any coordinator ceremony for conversational threads; FOOTER-PROJECTS. The thread-naming model answers NAME-ROOT and carries NAME-HOST's suffix rule, pending THREAD-IDS-AGREE.

## Current state

Accepted on 2026-10-20 after independent review of the narrowed boundary; see Done and the acceptance findings under Discussion. The following paragraph retains the delivery history.

The work-model write-in under [KI-HARNESS-GOV-210 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/08468196/docs/roadmap/KI-HARNESS-GOV-210-work-model-write-in.md) supersedes the `role` field, the role-reading COORD-10 and Thread naming, as Context sets out; old checkpoints keep `role` through the migration's tolerance window. The steps below are read under the work model: the identity section names the work file and work id, and the role gating reads `level`.

The Thread naming section has landed in the `ki-coordination` standard, with pointers from `ki-work-folder` and `ki-delegation`, documenting the model only. Phase 1's role field has landed: the `ki-work-folder` Thread role section with the optional `role` field, its three values, the conversational default and the `[skills.ki-coordination]` rule, checked by RECORD-2 and the new RECORD-4; one paragraph in the `ki-coordination` Thread types section; and the new COORD-10 rubric item, at WARN while existing coordinating checkpoints migrate through their own updates. The rest of Phase 1 has landed under the work model: the `ki-work-folder` Work identity and native sessions section, with a `binding` row in the `ki-coordination` Glossary and a pointer from the `ki-delegation` state-folder table; the Bootstrap check of the work file's `level` against the opener; and the hook-line and output-style scope sentences, reworded to read the work file's level and regenerated. Report forms and Re-anchoring were already gated to coordinating work by KI-HARNESS-GOV-210. Previously awaiting review since 2026-10-20, narrowed under Kris's "prepare the five" (SWEEP-ACCEPT-WAYS-OF-WORKING a), 20 October): the re-anchoring style re-read, folded in under STYLE-STALE on 18 October, goes to `ki.ways-of-working` as the STYLE-STALE line, and Phase 3 and the pilots, which wait on [KI-TOOL-KI-CLI-145](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-145-thread-session-bindings-role.md) and [KB-DOTFILES-UE-096](/Users/krisbrown/.local/share/chezmoi/docs/roadmap/KB-DOTFILES-UE-096-thread-identity-hook-registration.md), as the IDENTITY-PHASE3 line.

## Steps

- [x] Add the `role` field, its three values, the conversational default and the `[skills.ki-coordination]` rule to the `ki-work-folder` standard, with RECORD-2 accepting the field and RECORD-4 gating coordinating values.
- [x] Have `ki-coordination` Thread types read the role, and add COORD-10 checking that every coordinating checkpoint declares it.
- [x] Regenerate both rubrics and the `ki-coordination` surfaces.
- [x] Document the thread id, slug and title model in one `ki-coordination` Thread naming section, pointed to from `ki-work-folder` and `ki-delegation`.
- [x] Add the thread identity and native sessions section to `ki-work-folder`, with pointers from the `ki-coordination` Glossary and `ki-delegation`.
- [x] Gate Report forms by role with the narrowed role-gated table; have Bootstrap check the declared role against the opener; limit Re-anchoring to coordinating roles. Report forms and Re-anchoring were gated by level under KI-HARNESS-GOV-210; Bootstrap now checks `level`, or an old checkpoint's `role`.
- [x] Once the territory's coordinating work has work files, reword the hook-line and output-style scope sentences to "whose work file declares level territory or project" and regenerate. Every work file in ki-principal declares its level; an old checkpoint's `role` is still read at Bootstrap for the tolerance window, while the hook line carries no checkpoint wording.

## Files touched

- `skills/governance/ki-work-folder/references/standards-work-folder.md`, `references/rubric.md`, `scripts/rubric/contexts/work-folder.ts`, `work-folder.test.ts`, `scripts/rubric/items/records.ts`
- `skills/change-management/ki-coordination/references/standards-coordination.md`, `references/rubric.md`, `scripts/rubric/contexts/coordination.ts`, `coordination.test.ts`, `scripts/rubric/items/threads.ts`
- `skills/governance/ki-delegation/references/standards-background-runs.md`
- `hooks/coordinator-reminder.sh` and its test, `output-styles/ki-coordinator.md`
- `docs/roadmap/_ISSUES.md`, this record

## Verify

`bun run test`, `bunx tsc --noEmit`, and `ki repo audit --skill ki-work-folder`, `--skill ki-coordination`, `--skill ki-skills` and `--skill ki-work-roadmap`, run sequentially; then the pilot steps in the session-identity report.

## Dependencies / blocks

- Phase 1 depended on REPLY-FORMS landing, done in [KI-HARNESS-GOV-198 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/87da1b26/docs/roadmap/KI-HARNESS-GOV-198-reply-forms.md).
- Out of this record since the 2026-10-20 narrowing, and carried by the IDENTITY-PHASE3 line: Phase 3 needs [KI-TOOL-KI-CLI-145](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-145-thread-session-bindings-role.md) for the binding file and [KB-DOTFILES-UE-096](/Users/krisbrown/.local/share/chezmoi/docs/roadmap/KB-DOTFILES-UE-096-thread-identity-hook-registration.md) for the matchers.
- The intake pilot, also carried by IDENTITY-PHASE3, waited for PILOT-LABEL; the work model's Work naming has since answered THREAD-IDS-AGREE and IDS-MIGRATE's naming half.

## Documentation impact

### Decision Records

None: the decisions are Kris's SESSION-IDENTITY and REPLY-FORMS answers, quoted in the standards and the decisions log.

### Specifications

None: the `ki-work-folder` and `ki-coordination` standards are the contracts and change in place.

### Guides

None yet; the website skills guide describes skills by outcome. Revisit when `ki thread` ships in [KI-TOOL-KI-CLI-145](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-145-thread-session-bindings-role.md), which will need a how-to.

### Roadmap

The tooling and registration follow in [KI-TOOL-KI-CLI-145](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-145-thread-session-bindings-role.md) and [KB-DOTFILES-UE-096](/Users/krisbrown/.local/share/chezmoi/docs/roadmap/KB-DOTFILES-UE-096-thread-identity-hook-registration.md).

## Review

### Delivered

Phase 1 and the identity contract as narrowed under Boundary, from baseline `72ad1686`, read under the work model: the work identity and native sessions section in `ki-work-package`, formerly `ki-work-folder`, with its Glossary and `ki-delegation` pointers; the Work naming model in `ki-coordination`, which replaced Thread naming; the role field, now superseded by the work file's `level` and still read from an old checkpoint for the tolerance window; Bootstrap's level check against the opener; and the hook-line and output-style scope sentences reading the work file's level. Excluded by the narrowing: the re-anchoring style re-read under STYLE-STALE, Phase 3's hook identity line and role gate, and the Phase 4, 4b and 5 pilots, routed as Discussion, Narrowing records.

### Change Summary

- `d6b705dc` (16 October): the checkpoint `role` field, RECORD-2 and RECORD-4, and COORD-10, in `ki-checkpoint`, since renamed `ki-work-folder` (`9ca8f779`) and then `ki-work-package`.
- `655350a8` (17 October): the Thread naming section in `ki-pmo`, since renamed `ki-coordination` (`c4cbb5aa`) and replaced by Work naming under [KI-HARNESS-GOV-210 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/08468196/docs/roadmap/KI-HARNESS-GOV-210-work-model-write-in.md) in `ebc05eb2`.
- `0ae39eac` (18 October): the work identity and native sessions section, the Glossary `binding` row, the `ki-delegation` state-folder pointer, Bootstrap's level check, and the regenerated `hooks/coordinator-reminder.sh` and `output-styles/ki-coordinator.md` with `hooks/coordinator-reminder.test.ts`; `73c227f2` recorded the IDENTITY-TIMING answer.
- This record: narrowed on 2026-10-20 under Kris's "prepare the five"; the four unticked steps are removed and accounted for under Discussion, Narrowing. The Files touched list keeps the paths as they were when touched; the current homes are `skills/governance/ki-work-package/` and `skills/change-management/ki-coordination/`.

### Verification

Re-checked on 2026-10-20 against harness `main` at `9d2cd168`:

- `skills/governance/ki-work-package/references/standards-work-package.md` carries `## Work identity and native sessions`, with the key, the work file's `id` and `level` as authority, the machine-local binding path, the three supply channels, drift as report-only and the statement that no binding is written until the tooling ships; the checkpoint `role` is kept for the tolerance window.
- `skills/change-management/ki-coordination/references/standards-coordination.md` carries the Glossary `binding` row owned by `ki-work-package`, the Work naming section, and Bootstrap step 3 checking `level` against the opener, or an old checkpoint's `role`.
- `hooks/coordinator-reminder.sh` and `output-styles/ki-coordinator.md` scope the coordinator to a work file declaring `level: territory` or `level: project`; `skills/governance/ki-delegation/references/standards-background-runs.md` points its state-folder table to the binding section.
- `bun run test`, `bunx tsc --noEmit`, and `ki repo audit --skill ki-work-package`, `--skill ki-coordination`, `--skill ki-skills` and `--skill ki-work-roadmap`, run sequentially in the `wow-prepare` worktree: `bun run test` passes, 1363 tests; `tsc` passes; the `ki-work-package`, `ki-coordination` and `ki-skills` audits pass with no finding; `ki-work-roadmap` passes with four ITEM-2 size warnings on other records, this record's own cleared by declaring `size: m`.

### Outstanding concerns

- The re-anchoring style re-read is not implemented; it goes to `ki.ways-of-working` as STYLE-STALE and needs no dependency.
- Phase 3 and the pilots wait on [KI-TOOL-KI-CLI-145](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-145-thread-session-bindings-role.md) and [KB-DOTFILES-UE-096](/Users/krisbrown/.local/share/chezmoi/docs/roadmap/KB-DOTFILES-UE-096-thread-identity-hook-registration.md); they go to `ki.ways-of-working` as IDENTITY-PHASE3. Until then the coordinator lines still reach every session in a `ki-coordination` checkout, and only the scope sentence keeps a conversational session plain.
- COORD-10 stays at WARN through the tolerance window; moving threads between hosts stays with [KI-HARNESS-GOV-189](KI-HARNESS-GOV-189-move-thread-between-hosts.md).

### Post-change review

The goal's portable declaration exists: the work file's `id` and `level`, documented in one identity section, read by Bootstrap and by the scope sentences of the hook line and the style. Its enforcement on every client, the hook's role gate, needs tooling this record does not own, so the narrowing moves it to the work that tracks the tooling rather than leaving this record open on someone else's delivery. Regression risk from closing is nil: closing changes no code. Ready for acceptance on the narrowed boundary.

### Mini recap

Phase 1 of thread identity landed and was rewritten under the work model, so identity is now the work file's `id` and `level`. The style re-read, the hook gate and the pilots leave as two `messages.md` lines in `ki.ways-of-working`. Learning route: a record whose remainder waits on another repository's tooling should be narrowed at the hand-off, not held open.

## Done

Accepted 2026-10-20 by Kris, exercised by the independent accept-wow reviewer under his overnight grant, on the review packet above.

## Discussion

### Independent acceptance review - 20 October 2026

Acceptance authority: Kris, 20 October, "if you can quickly now accept ... accepting new things that are waiting with you and pruning those ... Same for ... the ways of working", as supplied in this run's brief and read back for this exact record and KI-PRINCIPAL-ECO-013 in the [Ways of working decisions log](</Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.ways-of-working/decisions.md>), including its 07:50 receipt. The grant covers acceptance on an independent pass; this run retains both records and commits locally only.

Verdict: pass on the narrowed Phase 1 boundary. The reviewer did not deliver this work. At source `dacdcc337ccb94cc48dd3301e9d5a3871282b934`, the six-part packet and all checked Steps agree with the identity section, binding pointers, Work naming, Bootstrap level check and generated hook/style scope. Delivery commits `d6b705dc`, `655350a8`, `0ae39eac` and `73c227f2` are ancestors of the reviewed candidate. STYLE-STALE has since landed in that candidate; the decisions log carries IDENTITY-PHASE3 into the coordinator's next steps. The excluded native-session pilots remain outside this acceptance, and no owner-only or attended check remains inside its narrowed boundary.

Fresh gates in an isolated worktree home after `ki repo repair`: `bun run test` passes 1372 tests; `bunx --no-install tsc --noEmit` passes; `ki-work-package`, `ki-coordination`, `ki-skills`, `ki-work-roadmap`, `ki-authoring`, `ki-delegation` and `ki-repo-harness` audits all have zero failures. The primary checkout's coordinator-hook test guard also passes. Audit warnings remain visible: two coordination warnings, five roadmap warnings and seventeen harness warnings; they do not invalidate this record's packet or delivered contract. No source, runtime or provider change was made by this review.

### Narrowing

Kris answered SWEEP-ACCEPT-WAYS-OF-WORKING on 20 October 2026 with "prepare the five", taking the reviewed course in the roadmap sweep of `ki.ways-of-working`. The four steps left unticked on that date went as follows:

- "Once the owner answers IDS-MIGRATE, accept `id` and `title` in the `ki-work-folder` checker and carry out the approved renames": superseded by the work model, whose work file carries `id` and `title` and whose migration moves the old folders; nothing is routed.
- "Add the re-read of `output-styles/ki-coordinator.md` from disk to the Re-anchoring after compaction steps": routed as STYLE-STALE to `+/_WORK/ki.ways-of-working/messages.md`.
- "Phase 3: the hook script's identity line and role gate": routed as IDENTITY-PHASE3 to the same queue, with its dependencies on KI-TOOL-KI-CLI-145 and KB-DOTFILES-UE-096.
- "Record the pilot results from Phases 4 and 4b": carried by IDENTITY-PHASE3, since the pilots test Phase 3.

### Earlier discussion

Settled provisionally on 18 October by the roadmap-next run: the identity section lands now, with Phase 1, and says that no binding is written until the `ki thread` tooling and hook registration ship, so it documents the contract the tooling builds to without claiming behaviour that does not exist yet.

Confirmed by Kris on 18 October 2026 in these words: "IDENTITY-TIMING a) - keep the identity section landed; Phase 3 waits on KI-TOOL-KI-CLI-145 and KB-DOTFILES-UE-096." The identity section stays where it landed, and Phase 3 waits on the `ki thread` session bindings in [KI-TOOL-KI-CLI-145](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-145-thread-session-bindings-role.md) and the hook registration in [KB-DOTFILES-UE-096](/Users/krisbrown/.local/share/chezmoi/docs/roadmap/KB-DOTFILES-UE-096-thread-identity-hook-registration.md).

COORD-10 uses the file name only to choose which checkpoints to ask, never to decide the role: an `<initiative>.<project>` checkpoint passes with `role: coordination` or `role: conversational`, so the owner's declaration always wins. It sits at WARN rather than FAIL so that ki-principal's gate keeps passing while each coordinating thread adds its field at its own next update.
