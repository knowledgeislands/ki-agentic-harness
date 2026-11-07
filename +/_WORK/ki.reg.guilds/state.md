---
id: ki.reg.guilds
state: with-worker
since: 2026-11-06T18:54:52Z
received: 2026-11-06T16:54:00Z
beat: null
mark: 2026-11-07T04:52:00Z
method_read: a4da0db2
listening_enabled: true
listening_status: on
workers:
  - role: guildmaster
    tier: managers
    focus: [roles, skills]
    since: 2026-11-06T16:54:00Z
    status: active
    listening: on
---

# ki.reg.guilds state

## Now

- Renamed from ki.reg.ways-of-working at 18:51 GMT under rule 13; sol's Agora watches it, terra to follow.
- Sent to Kris at 18:54 GMT with fifteen queries: five on worktrees, three on routing, seven on the role catalogue rollout, all high after review.
- Landed today: LINT-BEFORE-PUSH and CHECK-CONSUMERS (`056996c0`), FOOTER-COUNTS (`27833e5b`), FOOTER-HOOK (`8ec15e63`).
- Both Macs repointed: harness `d8ade2e0` retired the five forwarding stubs (1,598 tests pass); run `refresh-all` is sending REFRESH MSG-283f72a5 to every live package.
- STAGE-C-SPLIT with Kris (23:20 GMT): write the approved role catalogue into the skills now; the `role:` field packages now carry fails RECORD-2 until then.
- Listening.

## Next steps

- AWAY-WINDOW from 05:00 GMT until Kris returns: build the agreed skills and land the agreed standards; no knowledge at top level, nothing done with the knowledge itself. One editing run per repository; primary checkouts.

1. Done: `d12-skill` (`6ee91697`, `d2b461e4`). Running: `method-land`. Held for Kris's return (outward, touches knowledge or other owners): the D12 card and sorting-engine rewording for inbox-terra, `ki-muninn` d12 commands, mcp-gsuite and mcp-m365 protected lists, all drafted in the d12-skill report.
2. Done: `method-land` (`84b28fc6`, `6dca3174`, `2bd6e20e`, `7ae588c3`, `f488f951`); records AUDIT-ORPHANS and TASK-LINKS-FIELD drafted in its report, to capture; REFRESH sent by run `refresh-method`. Was: HOLD-STATES with HOLD-TIDY, METHOD-BATCH with the ADR-007 update and AUDIT-ORPHANS item, BROADCAST-FORM, the `task_links` triage record; refresh line to every package after. Large.
3. Done: `orca-land` (`940341c5`, `816b5426`, `643b73a2`, published by `harness-resolve`; `orca-adapter` branch deleted); PROMPT-RENDER tools-ki follow-up to send. Was: the fifteen ORCA-ADAPTER rules, RUN-RECOVERY, RUN-HANDOVER, TRIAL-PUBLISH onto the `orca-adapter` draft, independent review, then onto `main` (ADAPTER-MERGE). Large.
4. Done: `doer-lessons` (`5a2030de`). Was: DOER-LESSONS from ki.prj.agora CD-63 into the coordination skills. Medium.
5. Done: `kg-skill` (`ae0a1944`, `bd18988b`). Was: `ki-knowledge-graph` in `skills/acquire/` (KG-NAME, HARNESS-SCOPE a)); no change to `ki-acquire`, no card dispatch. Medium.
6. Done: `eda-skill` with the PORT-1 fix (`602a7881`, `a24e0527`, `5ec64a03`). Was: `ki-exchange-dynamics` in `skills/acquire/` (SKILL-HOMES a), design note in ki.sop.main). Medium.
7. `pkg-shape` (harness): package-repository shape skill (REPO-SHAPE-PACKAGES, STOA-SHAPE MSG-6adb77c9, STOA-TOOLCHAIN MSG-c0ddcf23 on applying `ki-engineering` to plain JavaScript with JSDoc). Medium.
8. `header-estate` (harness): HEADER-ESTATE into `ki-repo-dotfiles-chezmoi`. Small.
9. `cm-tidy` (harness): the CHANGE-MGMT cluster. Medium.
10. `standard-split` (harness): the staged ki-coordination split, stage 2 onwards. Large.
11. `absorb` (ki-principal, then the guild package): ways-of-working absorption under ABSORB-CLOSE. Large.

Excluded: `legal-merge` (waits on LEGAL-ACCESS, Kris creating Cloudflare Access); GUILD-NAME, ACQUIRE-SPLIT, STAGING-HOME (Kris's unfinished pillar-structure thought); DOCKET-HOME (parked).

3. Waiting: Kris creating the Cloudflare Access application for `legal.midnight.ninja` (LEGAL-ACCESS); Kris verifying vega's key (VEGA-KEY); personal.reg.inbox-sol's state of coordination (COORD-OVERLAP).

## Held

- REPO-SHAPE-PACKAGES (ki.sop.main MSG-7e674180, from ki.prj.stoa): Kris, 7 November: "It probably does mean that we should have a skill for whatever structure this thing might have. It seems like it's a new repo shape really, doesn't it?" A `ki-repo-*` shape skill for package repositories (vendored package tree, workbench app, release and re-vendor rule); packages-stoa is declared as tools today. STOA-SHAPE finding received (ki.prj.stoa MSG-6adb77c9, 04:28): for REPO-SHAPE-PACKAGES (routed to you as MSG-7e674180): the STOA-SHAPE finding, how a package repository such as packages-stoa differs from the tools shape and what a package-repository skill would own, is in [ki-repo-0-32-0's report](https://github.com/knowledgeislands/ki-principal/blob/34b5faeb/+/_WORK/ki.prj.stoa/reports/ki-repo-0-32-0.report.md#stoa-shape---how-a-package-repository-differs-from-the-tools-shape). packages-stoa is declared `ki-repo-project` meanwhile, because `ki-repo-tools` needs a `bin/` command. Please ACK. Ready for a design run after the query pass.
- DOER-LESSONS (ki.prj.agora MSG-991aa6ad, 04:03 GMT): Kris asked through Claude Design (CD-63) for tonight's doer-coordination lessons to become durable in the coordination skills; verbatim in `ki-principal/+/_WORK/ki.prj.agora/identity/claude-design/messages.md` (CD-63). Addendum DOER-LESSONS-2 (MSG-275b0e5b, ILL-26 from the illustrator, verbatim in `ki-principal/+/_WORK/ki.prj.agora/identity/chatgpt/messages.md`) rides with it. Plan unit 4.
- HEADER-ESTATE (ki.sop.main MSG-8e93a86a for ki.prj.chezmoi): Kris agreed every chezmoi script opens with a plain-English header comment and "we want to adopt the standard into the skill"; propose it in `ki-repo-dotfiles-chezmoi`, shape in personal-principal `ec08de88` `briefs/headers.md`. Queued after `doer-lessons`.
- KG-CARDS (personal.reg.inbox-terra MSG-4479fedb, 02:40 GMT): 22 knowledge-graph cards in the inbox `+/_ACQUIRED/knowledge-graph/` for the `ki-knowledge-graph` skill; Kris suggests a keystone skill; `layered-graphs.md` adds shadow-node pruning. Feeds KG-NAME and GUILD-NAME.
- ORCA-CODEX-WAKE (ki.sop.main, 02:33 GMT): the seventeenth Orca adapter query, parked in ki.prj.ways-of-working's `discussions.md`; comes with the absorption and joins the Orca set.
- HOLD-TIDY: waits on TRANSFER-SOP-QUERIES, with HOLD-STATES.
- SKILL-SPECS settled by SKILLS-OVER-GRAPH a) (7 November, MSG-fc8a7eb5): `ki-dodecakrisis` in `acquire` (waits on the D12 queries); knowledge-graph method into `ki-repo-kb` via knowledge plan phase 0, not yet approved; legal evidential skill held as a harness idea until then; one `ki-work-design` note for the `specs-` kind and `ki-specs` rethink. SKILL-HOMES a) (MSG-0a60eb79): new `ki-exchange-dynamics` in `acquire`, drawing through `archify` and `dataviz`, design note `eda.design.md` in ki.sop.main. SITE-LINT waits on HARNESS-SCOPE.
- APP-SKILLS (ki.prj.agora, Kris about 20:50 GMT): UI testing end to end (with the `ki-e2e` draft), macOS menu-bar apps, Electron desktop apps, mobile apps: wait on HARNESS-SCOPE.
- PROTECTED-LABELS (personal.reg.inbox-terra MSG-9c1f7a35, Kris about 23:40 GMT): a declared list of protected mail labels no tool call may change, such as Gmail `Z_ARCHIVE/` and `Z_ARCHIVE/Legal Matters`, in the routing and in mcp-gsuite and mcp-m365; every filter or rule D12 manages carries a `D12` prefix (GD12-SWEEP): for `ki-dodecakrisis` and the mail-routing skill, the quartermaster building the servers; waits on HARNESS-SCOPE, with SKILL-SPECS.
- KNW-005 (where ideas live, work-in-progress reset): with the parked flow questions.
