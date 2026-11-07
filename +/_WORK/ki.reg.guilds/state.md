---
id: ki.reg.guilds
state: handoff-to-supervisor
since: 2026-11-06T18:54:52Z
received: 2026-11-06T16:54:00Z
beat: null
mark: 2026-11-07T02:25:09Z
method_read: 5c118279
listening_enabled: true
listening_status: on
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

0. IMPORTANT STAGE-C-ROLES (Kris, 02:30 GMT) first: `roles-design` running, then `roles-blind`, `roles-land`, seat glyphs and REFRESH; one owner report when landed.
1. Running: `drift-fix` (harness, DRIFT-FIRST), `d12-kg-design` (read-only), `terra-orca` (terra, TERRA-ORCA).
2. Then, chained in the harness after STAGE-C-ROLES: `paperclip-drop` (PAPERCLIP-DROP), `cm-tidy` (CHANGE-MGMT cluster), then the staged standard split (STAGING), then the absorption of ki.prj.ways-of-working once ki.sop.main acknowledges MSG-a5ca3edb.
3. Waiting: Kris verifying vega's key (VEGA-KEY); personal.reg.inbox-sol's state of coordination (COORD-OVERLAP); ki.sop.main's bundles (MSG-da83a96f) and Orca items (MSG-8125375d).

## Held

- ORCA-CODEX-WAKE (ki.sop.main, 02:33 GMT): the seventeenth Orca adapter query, parked in ki.prj.ways-of-working's `discussions.md`; comes with the absorption and joins the Orca set.
- HOLD-TIDY: waits on TRANSFER-SOP-QUERIES, with HOLD-STATES.
- SKILL-SPECS; SKILLS-OVER-GRAPH (1) `ki-dodecakrisis` (with the D12-LEARNS learning loop), (2) knowledge-graph method skill, (3) legal evidential skill, (4) `specs-` reference kind and `ki-specs` rethink; SITE-LINT: wait on HARNESS-SCOPE and Stage C.
- APP-SKILLS (ki.prj.agora, Kris about 20:50 GMT): UI testing end to end (with the `ki-e2e` draft), macOS menu-bar apps, Electron desktop apps, mobile apps: wait on HARNESS-SCOPE.
- PROTECTED-LABELS (personal.reg.inbox-terra MSG-9c1f7a35, Kris about 23:40 GMT): a declared list of protected mail labels no tool call may change, such as Gmail `Z_ARCHIVE/` and `Z_ARCHIVE/Legal Matters`, in the routing and in mcp-gsuite and mcp-m365; every filter or rule D12 manages carries a `D12` prefix (GD12-SWEEP): for `ki-dodecakrisis` and the mail-routing skill, the quartermaster building the servers; waits on HARNESS-SCOPE, with SKILL-SPECS.
- KNW-005 (where ideas live, work-in-progress reset): with the parked flow questions.
