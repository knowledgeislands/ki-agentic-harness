# ki.reg.ways-of-working discussions

## Open

### RIG-SPENT - Discard the four tools-rig worktrees from the 048 and 056 runs

focus: _emerging

**Context:** Four tools-rig worktrees are left from the night runs of 20 and 21 October on the records KI-TOOL-RIG-CORE-048 and KI-TOOL-RIG-CORE-056: `run/wow-accept-rig-056`, `run/wow-rework-rig-056`, `run/wow-night-rig-048-f` and `run/wow-night-rig-056-e`. They hold three unpublished roadmap commits and two uncommitted edits, all to those two record files. I checked on `main` that both records were since accepted ("accept signed-release install kind", "accept menu-bar persistence finding") and then pruned in `eccef96`, "prune 3 done work records". So everything left in these worktrees edits records that no longer exist. Removing them needs `git worktree remove --force` for the two with uncommitted edits and `git branch -D`, a delete that skips the merged check, for the branches with unpublished commits. This brief forbids both without your word.

**Query:** May a bounded run force-remove these four worktrees and force-delete their four branches?

**Options:**

a) (recommended, confidence high - I checked on `main` directly that both records were accepted and pruned, so nothing here can still land) Yes: force-remove all four worktrees and force-delete their branches.

b) Keep them for now and have a read-only run show you each leftover edit first.

### LANDED-COPIES - Remove the two tools-ki branches whose work is already on main

focus: _emerging

**Context:** In tools-ki, `launcher-paths` (1 commit, 3 November) and `run-close` (3 commits, 4 November) are clean worktrees from finished ki.sop.main runs. `git cherry` shows every one of their commits is already on `main` as an identical change under a different commit identity: "follow moved checkouts and renamed work", "close finished agents while the rest of the run goes on", and its tests. Because those exact commits exist on no remote, this brief kept them, and `git branch -d` would refuse. Removing the clean worktrees needs no force, but their branches need `git branch -D`.

**Query:** May a bounded run remove these two worktrees and force-delete the `launcher-paths` and `run-close` branches?

**Options:**

a) (recommended, confidence high - `git cherry` shows each change byte-identical on `main`, checked directly) Yes: remove both worktrees and force-delete both branches.

b) Keep them.

### SUPERSEDED-FIXES - Discard the four tools-ki worktrees from the 21 and 22 October recovery fixes

focus: _emerging

**Context:** Four tools-ki worktrees are left from the ways-of-working runs of 21 and 22 October:

- `wow-close-done-2`, with 2 unpublished commits and an uncommitted edit to the record KI-TOOL-KI-CLI-145. That record has since been moved to ideas on `main`.
- `wow-day-impl-fix-5`, with 3 unpublished commits.
- Two worktrees with no branch, `legacy` and `reproductions`, under `wow-day-impl-fix.work`. They hold uncommitted test work: `agent-compatibility.test.ts`, which now exists on `main`, its snapshots and an edit to `agent-control.test.ts`.

Most of the unpublished commits are already on `main` in identical form. The rest are on `main` under the same titles as differently written commits, "preserve evidence across interrupted control operations" (`fc0aeb57`) and "recover interrupted preparations and event appends" (`3b19b135`). I did not compare that code line by line. Removing these worktrees needs `--force` and `git branch -D`.

**Query:** May a bounded run force-remove these four worktrees and force-delete `wow-close-done-2` and `wow-day-impl-fix-5`?

**Options:**

a) (recommended, confidence medium - the fixes landed on `main` under the same titles, but I did not compare the code line by line) Yes: discard all four.

b) First let a read-only run compare the two unmatched commits and the leftover test edits with `main` and bring you a keep-or-drop list, as UNMERGED-STRAYS in ki.sop.main proposes. Then discard.

### DRAFT-SKILLS - Keep the ki-e2e and Orca adapter draft worktrees until their queries are answered

focus: _emerging

**Context:** Two clean harness worktrees hold unreviewed skill drafts that are on no remote and not on `main`. `ki-e2e` (2 commits, 2 November) drafts a browser-testing skill for Capital websites. `orca-adapter` (2 commits, 1 November) drafts `ki-delegation-orca`. Both already wait on your open queries in [ki.prj.ways-of-working discussions](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.ways-of-working/discussions.md): E2E-WAY, on whether to fast-forward `ki-e2e` into `main`, and ORCA-SKILL-KIND with the other ORCA-LAUNCHER queries.

**Query:** Should these two worktrees stay until those queries are answered?

**Options:**

a) (recommended, confidence high - deleting them would lose the only copy of reviewed draft work) Yes: keep both. Whoever lands or drops each draft retires its worktree.

b) Drop both drafts now, which needs `git branch -D`.

### OLD-DIAGRAMS - Remove the clean rename-paperclip worktree and the diagram files it holds

focus: _emerging

**Context:** The harness worktree `rename-paperclip`, from a finished ki.prj.ways-of-working run on 1 November, is clean and all its commits are on `main`. It sits in the run's temporary folder. It also holds gitignored diagram working files that exist nowhere else: the skill-area pages "agentic-systems" and "fundamentals", and an older `skill-map`. The current skill areas are acquire, coordination and records-and-code, so these look like renders of retired area names. A plain `git worktree remove` would delete them without asking, so I kept the worktree.

**Query:** May a bounded run remove this worktree, its branch and those old diagram working files?

**Options:**

a) (recommended, confidence medium - they are derived working output from committed sources, but I did not prove they can be regenerated) Yes: remove it and delete the `rename-paperclip` branch with `git branch -d`.

b) Copy the diagram folder somewhere first, then remove the worktree.

### WOW-RELATIONSHIP - How the Ways of working Project relates to the new guild

focus: _emerging

**Context:** [ki.prj.ways-of-working](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.ways-of-working/work.md) is a Project in Knowledge Islands Principal. Its remit is the work model, the work package, coordination, delegation and their rollout, which is the same ground as [ki.reg.ways-of-working](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/+/_WORK/ki.reg.ways-of-working/work.md)'s skills focus. The new package adds the role catalogue and guild management. The Project has been on hold since you drained it to State of play on 3 November ("move all of the work to be coordinated through the SOP main"). It holds 95 parked queries, about 60 of them in the guild remit, and 14 focus folders of design notes and reports. Its own goal already said that method stewardship passes on once the method is defined (WOW-REFRESH, STEWARD-HOME). Keeping both alive means two homes for the same method.

**Query:** Should the guild take over the Project's live remit, with the Project closed once what it holds has homes?

**Options:**

a) (recommended, confidence medium - the remits coincide and the Project's own goal anticipated the hand-on; unreviewed) Yes. Transfer the guild-remit queries and live design notes to ki.reg.ways-of-working, leave its territory and tools items with their owners, let it tidy and close through the normal finished close-out, and mark the [Ways of working Project](/Users/krisbrown/kis/knowledge-islands/ki-principal/Streams/Projects/ways-of-working.md) as handed to the regular work.

b) Keep the Project on hold as the design home for large method changes, with the guild only maintaining the skills and the role catalogue.

c) Reopen the Project and treat the guild as its harness-side worker.

### TRANSFER-SOP-QUERIES - HOLD-STATES and METHOD-BATCH

focus: _emerging

**Context:** State of play's consolidated set for your return holds two method bundles, both recommended at high after review. [HOLD-STATES](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.sop.main/discussions.md) covers seven hold-state choices plus HOLD-TIDY, and METHOD-BATCH covers fifteen method choices with an ADR-007 update. Each plans one harness run that changes the coordination and work-package standards, which is now guild ground. Moving the queries themselves would mean asking them again.

**Query:** Should you answer them where they are, with the run that lands them launched by the guild?

**Options:**

a) (recommended, confidence medium - avoids asking twice while putting the harness change with its new owner; unreviewed) Yes. You answer them in State of play's pass; State of play sends each answer to the guild as a message line, and the guild lands it in the harness with the design notes as its brief.

b) Move both queries and their two design notes into the guild package now, and ask them there.

c) Leave both, including the landing run, with State of play.

### TRANSFER-WOW-PARKED - The Project's parked method queries

focus: _emerging

**Context:** The Project's 95 parked queries were never packed into State of play's consolidated set. About 60 fall to the guild: standards wording (HOOK-PATCH, WP-HEARTBEAT, RESTART-POLICY, RESTART-EVIDENCE, OPTION-CONFIDENCE, GIT-REBASE, PUSH-RETRY, FOCUS-SLOT-OWNER, FOCUS-TOP), flow and work in progress (WIP-PACKAGE, WIP-TERRITORY, GATES, GATES-SIZE, ROADMAP-UPCOMING and its two parts, PARKED-TO-IDEAS and its part, HOLD-CLOSE, IDEAS-REVISIT, DUE-FIELD), the package-definition fields (HOMES, EXECUTION, HOST, DISPLAY, THEME, ROUTING, SIGNAL, RESTART, THREAD-DEFAULTS), Paperclip (PAPERCLIP-RETIRE, PAPERCLIP-GRANT), harness checks (HNR-CAP, HNR-EMPTY-PROJECT, CITED-NOTES, DONE-PRUNE, OLD-PROPOSALS) and the Orca adapter group (ORCA-HOME). About ten are stale, for example HOLD-ROUTE, which SOP-ACTS-FOR-IDLE now covers. The rest belong to State of play, tools-ki, the Observatory, Rig or acquisition. An audit on 3 November already flagged 91 open queries against a warning level of eight.

**Query:** Should the guild take the guild-remit queries and triage them before anything reaches you?

**Options:**

a) (recommended, confidence medium - most were recommended before 3 November, but the method has moved since, so a triage pass avoids re-asking stale ones; unreviewed) Yes. The guild copies them in, drops each stale one with its evidence in the decisions log, re-checks the rest against the current method, packs them into a few bundles and blind-reviews the medium ones before they reach you. State of play sends each non-guild item to its owner.

b) Transfer them as they stand and take them one at a time in an interactive pass.

c) Leave them parked with the Project until it is reopened or closed.

### HARNESS-SCOPE - Does the guild take every harness change, or only the ways-of-working skills?

focus: _emerging

**Context:** ki.reg.ways-of-working lives in ki-agentic-harness. Its work page says it keeps "the skills ... that capture how we work" and the harness's worktrees and branches. Many open harness asks concern engineering, website and repository skills instead: the HNR conform conflicts (HNR-OFFLINE, HNR-MJS, HNR-PROOF, HNR-TOOLROOT, HNR-SITE-SHAPE, HNR-DR-LINKS), the unmerged `ki-e2e` branch (E2E-ADOPT, E2E-KIND, E2E-OFFRAMP, E2E-HELPERS), DRYRUN-SCOPE, AREA-COLUMN, STREAMS-CHECKER-GAP, STREAM9-SHA, GATE-BASELINE-COMPARATOR, LINK-EXTERNAL, SITE-LINT, and the Baseline rollout lines HARNESS-DEFECTS, HARNESS-FEEDBACK, HARNESS-FEEDBACK-2, WEBSITE-SKILL, PRODUCT-RECORDS, REPO-METADATA and REPO-CODE-CAP. Their natural carrier, [ki.prj.baseline-rollout](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.baseline-rollout/work.md), is paused, so nobody acts on them.

**Query:** Should the guild steward every ki-agentic-harness change, not only the ways-of-working skills?

**Options:**

a) (recommended, confidence medium - the harness has no other active steward, and the guild already holds its branches; this widens the work page beyond "how we work"; unreviewed) Yes. The guild adds a `harness` focus area for engineering, website and repository skill asks, kept apart from `skills`, and its work page says so.

b) No. The guild keeps to ways-of-working skills and roles; the other asks stay with ki.prj.baseline-rollout until you resume it, or go to ki.reg.main as ad hoc work.

### ORCA-HOME - Who holds the Orca adapter's rules

focus: _emerging

**Context:** Sixteen parked queries settle the `ki-delegation-orca` adapter's rules and trials and the unmerged `orca-adapter` branch in the harness (ORCA-SKILL-KIND, CLOSEOUT-STRIKE, ONE-LAUNCHER, ONE-LAUNCHER-UNIT, OUTLIVE, PROMPT-RENDER, HEARTBEAT-ACK, STOP-VERB, RUN-RECOVERY, QUEUE-PACE, REPORT-HOME, WORKER-SURVIVAL, DELIVERY-REPLAY, RUN-HANDOVER, OWNER-ASK, ADAPTER-MERGE). The held [ki.prj.orca-evaluation](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.orca-evaluation/work.md) also proposes, as SCOPE-SPLIT, handing its four method questions to "Ways of working". Meanwhile State of play's ORCA-CLOSE-HOME would give that Project's five questions and two notes to the Inbox, and inbox-sol's coordination spec plans runs as Orca workers (its Q17).

**Query:** Should the adapter's rules and branch come to the guild, while Orca usage evidence and upstream feedback go to the Inbox?

**Options:**

a) (recommended, confidence medium - the adapter is a delegation skill in the harness, while trial evidence and upstream feedback are about using Orca; unreviewed) Yes. The guild takes the sixteen adapter queries, SCOPE-SPLIT's four method questions and the `orca-adapter` branch; the Inbox takes Orca usage and upstream feedback under ORCA-CLOSE-HOME.

b) Send everything Orca-related to the Inbox, including the adapter.

c) Drop the adapter for now, because Agora now does the waking, and close the sixteen as no longer needed.

### COORD-OVERLAP - The Inbox's coordination and method focus areas

focus: _emerging

**Context:** Under COORD-SOLE (5 November), [personal.reg.inbox-sol](/Users/krisbrown/kis/personal/inbox/+/_WORK/personal.reg.inbox-sol/coordination/_index.md) alone holds coordination and communication: a session-coordination spec built with you part by part, with about ten open questions and 14 lines it will send once each part is agreed, most of them to ki.sop.main. It also holds the scored planning method, which it says is "done when ... handed to Ways of working". Both reach into `ki-coordination`, `ki-trades` and the work model, which the guild now keeps.

**Query:** Should the Inbox keep designing these with you, sending what is agreed to the guild instead of State of play?

**Options:**

a) (recommended, confidence medium - keeps the live design conversation where it is, while the guild lands the agreed parts in the skills; unreviewed) Yes. The guild sends inbox-sol one line asking it to address its agreed coordination and method sends to ki.reg.ways-of-working, and to hand the planning method here when it is done.

b) Move the `coordination` and `method` focus areas into the guild now.

c) Leave it as it is, with State of play routing each send on.

### ACQUIRE-ROUTE - Acquisition items are not guild work

focus: _emerging

**Context:** Several items concern acquisition skills rather than how we work: GRANOLA-CAPTURED-SKIP (MSG-6620cbb7, from hnr.sop.main, which wants a reply), GRANOLA-COUNT, CHECKSUMS-SETTLED, ACQ-HOLD-WORDING, ACQ-SCAFFOLD-NOTE and ACQUISITION-PROCESS-APPROVE. [ki.prj.knowledge-acquisition](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.knowledge-acquisition/work.md) is finished, acquisition now runs through the Inbox's `ki-muninn`, and State of play's SKILL-HOMES recommends sending harness acquisition items to ki.reg.main.

**Query:** Should State of play send these to ki.reg.main, with the Inbox consulted on the Granola ones?

**Options:**

a) (recommended, confidence medium - consistent with SKILL-HOMES; leaves the guild to method and roles; unreviewed) Yes. State of play routes them to ki.reg.main, and the Granola reply goes to hnr.sop.main from there.

b) The guild takes them under HARNESS-SCOPE b), because the acquisition skills live in the harness.

## Parked

None.
