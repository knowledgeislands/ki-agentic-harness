# [KI > Guilds](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/+/_WORK/ki.reg.guilds/work.md) › rename-guilds

**🤖 → 👤 Handoff to supervisor · Run report at 18:52 GMT · last mark none**

---

## Done

- ki-agentic-harness `30d1a32d`: the package moved from `+/_WORK/ki.reg.ways-of-working/` to [`+/_WORK/ki.reg.guilds/`](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/+/_WORK/ki.reg.guilds/work.md) under rule 13. All five files have the new id and H1, and the title is now `KI > Guilds`. "Enabler tier" is now "manager tier" in the description and Goals. Scope has its `Home: ki-agentic-harness` line. The RENAME-GUILDS entry in `decisions.md` cites rule 13. Four outbound lines are listed as awaiting ACK. The five received reports now link to the new path. No query, state, hold or decision content changed.
- The `wow-open` run group's work folder is now `ki.reg.guilds`, recorded with `ki agent home`. Its control record moved with it, and the run group keeps its name.
- ki-principal `38010704`: MSG-b923c061 RENAME-GUILDS went into [ki.sop.main](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.sop.main/messages.md)'s Inbound. It asks ki.sop.main to add `ki.reg.guilds` to `covers` and Scope, to read GUILD-ROUTE MSG-958bb583 as addressed here without the withdrawn MSG-09e75f90, to send method lines here, and to update its description's two ki.prj.ways-of-working references. MSG-bf5f68b8 went into [ki.prj.agora](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.agora/messages.md)'s Inbound. It tells ki.prj.agora about the rename and asks whether terra should watch the package too.
- dotfiles `2b8d994`: MSG-02d1f29f AGORA-WATCH-GUILDS went to [personal.reg.household-sol](/Users/krisbrown/.local/share/chezmoi/+/_WORK/personal.reg.household-sol/messages.md). It replaces AGORA-WATCH-WOW and asks sol to watch `ki.reg.guilds` in `~/kis/knowledge-islands/ki-agentic-harness`. MSG-280bd6ab went to [personal.reg.household-terra](/Users/krisbrown/.local/share/chezmoi/+/_WORK/personal.reg.household-terra/messages.md) so that it updates its references.
- Old message lines elsewhere that name `ki.reg.ways-of-working` were left as history.
- Focused audit, `ki-work-package`: passed with 3 warnings, none of them new. Focused audit, `ki-coordination`: failed on 3 findings, none of them new. The details are under Findings.

## In Progress

Nothing is running.

Outstanding - no action requested now:

- Four lines await ACK: MSG-02d1f29f, MSG-bf5f68b8, MSG-b923c061 and MSG-280bd6ab.
- Sol's Agora watch takes effect only after household-sol edits its `config.toml` and restarts the Portal.
- The next bootstrap should carry `Rename thread: /rename 🧵 ki.reg.guilds`. A restart is warranted because the id changed.
- `decisions.md` has two "message-backlog received" headings at 17:03 GMT. The first one is empty. I left it alone because the brief forbids changes to decision content.
- ki-principal has four untracked report files from other sessions, in the ki.prj.ways-of-working and ki.sop.main folders. I did not touch them.

## Findings

### RENAME-AUDIT - Focused audit findings after the rename

**Goal:** Separate any finding the rename introduced from the ones that were already there.

**Scope:** `ki repo audit --skill ki-work-package` and `--skill ki-coordination` on ki-agentic-harness, at `30d1a32d`.

**As of:** 18:52 GMT, 6 November 2026.

| Finding | Where | New or existing |
| --- | --- | --- |
| FOLDER-1 warn: `reports/` is a type folder in a package that declares focus areas | `ki.reg.guilds` | Existing: the folder moved but its contents did not change |
| FOLDER-2 warn: five reports have every query answered and are due for the tidy | `ki.reg.guilds/reports/` | Existing: the coordinator's tidy at its next send or mark |
| FOLDER-6 warn: 15 open queries, more than 8 | `ki.reg.guilds/discussions.md` | Existing |
| COORD-7 fail: record ids are not linked (ADR-KI-HARNESS-AGENTS-002, GDR-KI-PRINCIPAL-009) | `reports/guild-plan.report.md` | Existing: the report's text was received like this |
| COORD-7 fail: record ids are not linked (KI-TOOL-RIG-CORE-056, PERSONAL-ASSISTANT-KNW-004, PERSONAL-ASSISTANT-KNW-005, AWAY-UNTIL-0800) | `reports/message-backlog.report.md` | Existing |
| COORD-7 fail: record ids are not linked (KI-TOOL-RIG-CORE-048, KI-TOOL-RIG-CORE-056, KI-TOOL-KI-CLI-145) | `reports/worktree-tidy.report.md` | Existing |

The rename introduced no finding. All six concern the package's own received reports and its query count, and they clear once the reports are pruned.

## Queries

No outstanding queries.

### 🤖 → 👤 Handoff to supervisor · since 18:52 GMT

👤 0 with you

- [awaiting ACK] MSG-958bb583 · to ki.sop.main · since 17:03
- [awaiting ACK] MSG-02d1f29f · to personal.reg.household-sol · since 18:51
- [awaiting ACK] MSG-bf5f68b8 · to ki.prj.agora · since 18:51
- [awaiting ACK] MSG-b923c061 · to ki.sop.main · since 18:51
- [awaiting ACK] MSG-280bd6ab · to personal.reg.household-terra · since 18:51

🧵 ki.reg.guilds
