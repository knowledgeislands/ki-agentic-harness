---
id: ki.reg.guilds
state: handoff-to-supervisor
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

- NO-WORKTREES for now (Kris, 02:55 GMT): guild runs edit in the primary checkout, one per repository at a time, until Kris lifts it.

0. STAGE-C-ROLES landed (`a4da0db2`, 03:03 GMT); REFRESH MSG-4cf14cb8 out to 15 packages, ACKs coming in; household-terra and household-sol switch their footers.
1. Nothing running.
2. Then, chained in the harness after STAGE-C-ROLES: `cm-tidy` (CHANGE-MGMT cluster), then the staged standard split (STAGING), then the absorption of ki.prj.ways-of-working once ki.sop.main acknowledges MSG-a5ca3edb.
3. Waiting: Kris creating the Cloudflare Access application for `legal.midnight.ninja` and giving its name, login method and allow policy (LEGAL-ACCESS), then run `legal-merge`; Kris verifying vega's key (VEGA-KEY); personal.reg.inbox-sol's state of coordination (COORD-OVERLAP); ki.sop.main's bundles (MSG-da83a96f) and Orca items (MSG-8125375d).

## Held

- REPO-SHAPE-PACKAGES (ki.sop.main MSG-7e674180, from ki.prj.stoa): Kris, 7 November: "It probably does mean that we should have a skill for whatever structure this thing might have. It seems like it's a new repo shape really, doesn't it?" A `ki-repo-*` shape skill for package repositories (vendored package tree, workbench app, release and re-vendor rule); packages-stoa is declared as tools today. STOA-SHAPE finding received (ki.prj.stoa MSG-6adb77c9, 04:28): for REPO-SHAPE-PACKAGES (routed to you as MSG-7e674180): the STOA-SHAPE finding, how a package repository such as packages-stoa differs from the tools shape and what a package-repository skill would own, is in [ki-repo-0-32-0's report](https://github.com/knowledgeislands/ki-principal/blob/34b5faeb/+/_WORK/ki.prj.stoa/reports/ki-repo-0-32-0.report.md#stoa-shape---how-a-package-repository-differs-from-the-tools-shape). packages-stoa is declared `ki-repo-project` meanwhile, because `ki-repo-tools` needs a `bin/` command. Please ACK. Ready for a design run after the query pass.
- DOER-LESSONS (ki.prj.agora MSG-991aa6ad, 04:03 GMT): Kris asked through Claude Design (CD-63) for tonight's doer-coordination lessons to become durable in the coordination skills; verbatim in `ki-principal/+/_WORK/ki.prj.agora/identity/claude-design/messages.md` (CD-63). Queued as harness run `doer-lessons` after `paperclip-purge`.
- HEADER-ESTATE (ki.sop.main MSG-8e93a86a for ki.prj.chezmoi): Kris agreed every chezmoi script opens with a plain-English header comment and "we want to adopt the standard into the skill"; propose it in `ki-repo-dotfiles-chezmoi`, shape in personal-principal `ec08de88` `briefs/headers.md`. Queued after `doer-lessons`.
- KG-CARDS (personal.reg.inbox-terra MSG-4479fedb, 02:40 GMT): 22 knowledge-graph cards in the inbox `+/_ACQUIRED/knowledge-graph/` for the `ki-knowledge-graph` skill; Kris suggests a keystone skill; `layered-graphs.md` adds shadow-node pruning. Feeds KG-NAME and GUILD-NAME.
- ORCA-CODEX-WAKE (ki.sop.main, 02:33 GMT): the seventeenth Orca adapter query, parked in ki.prj.ways-of-working's `discussions.md`; comes with the absorption and joins the Orca set.
- HOLD-TIDY: waits on TRANSFER-SOP-QUERIES, with HOLD-STATES.
- SKILL-SPECS settled by SKILLS-OVER-GRAPH a) (7 November, MSG-fc8a7eb5): `ki-dodecakrisis` in `acquire` (waits on the D12 queries); knowledge-graph method into `ki-repo-kb` via knowledge plan phase 0, not yet approved; legal evidential skill held as a harness idea until then; one `ki-work-design` note for the `specs-` kind and `ki-specs` rethink. SKILL-HOMES a) (MSG-0a60eb79): new `ki-exchange-dynamics` in `acquire`, drawing through `archify` and `dataviz`, design note `eda.design.md` in ki.sop.main. SITE-LINT waits on HARNESS-SCOPE.
- APP-SKILLS (ki.prj.agora, Kris about 20:50 GMT): UI testing end to end (with the `ki-e2e` draft), macOS menu-bar apps, Electron desktop apps, mobile apps: wait on HARNESS-SCOPE.
- PROTECTED-LABELS (personal.reg.inbox-terra MSG-9c1f7a35, Kris about 23:40 GMT): a declared list of protected mail labels no tool call may change, such as Gmail `Z_ARCHIVE/` and `Z_ARCHIVE/Legal Matters`, in the routing and in mcp-gsuite and mcp-m365; every filter or rule D12 manages carries a `D12` prefix (GD12-SWEEP): for `ki-dodecakrisis` and the mail-routing skill, the quartermaster building the servers; waits on HARNESS-SCOPE, with SKILL-SPECS.
- KNW-005 (where ideas live, work-in-progress reset): with the parked flow questions.
