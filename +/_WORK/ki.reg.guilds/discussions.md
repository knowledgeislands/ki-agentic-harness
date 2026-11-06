# ki.reg.guilds discussions

## Open

### RIG-SPENT - Discard the four tools-rig worktrees from the 048 and 056 runs

focus: _emerging

**Context:** Four tools-rig worktrees are left from the night runs of 20 and 21 October on the records KI-TOOL-RIG-CORE-048 and KI-TOOL-RIG-CORE-056: `run/wow-accept-rig-056`, `run/wow-rework-rig-056`, `run/wow-night-rig-048-f` and `run/wow-night-rig-056-e`. They hold three unpublished roadmap commits and two uncommitted edits, all to those two record files. I checked on `main` that both records were since accepted ("accept signed-release install kind", "accept menu-bar persistence finding") and then pruned in `eccef96`, "prune 3 done work records". So everything left in these worktrees edits records that no longer exist. Removing them needs `git worktree remove --force` for the two with uncommitted edits and `git branch -D`, a delete that skips the merged check, for the branches with unpublished commits. This brief forbids both without your word.

**Query:** May a bounded run force-remove these four worktrees and force-delete their four branches?

**Options:**

a) (recommended, confidence high - reviewed: an independent check confirmed both records were accepted on main and later pruned, so the leftovers are outdated drafts) Yes: force-remove all four worktrees and force-delete their branches.

b) Keep them for now and have a read-only run show you each leftover edit first.

### LANDED-COPIES - Remove the two tools-ki branches whose work is already on main

focus: _emerging

**Context:** In tools-ki, `launcher-paths` (1 commit, 3 November) and `run-close` (3 commits, 4 November) are clean worktrees from finished ki.sop.main runs. `git cherry` shows every one of their commits is already on `main` as an identical change under a different commit identity: "follow moved checkouts and renamed work", "close finished agents while the rest of the run goes on", and its tests. Because those exact commits exist on no remote, this brief kept them, and `git branch -d` would refuse. Removing the clean worktrees needs no force, but their branches need `git branch -D`.

**Query:** May a bounded run remove these two worktrees and force-delete the `launcher-paths` and `run-close` branches?

**Options:**

a) (recommended, confidence high - reviewed: an independent check confirmed every change on both branches is already on main) Yes: remove both worktrees and force-delete both branches.

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

a) (recommended, confidence high - reviewed: the independent review found a link correction to KI-TOOL-KI-CLI-145 that exists nowhere else, and test edits that still need a keep-or-drop decision) First a read-only run compares the two unmatched commits and the leftover test edits with `main` and brings you a keep-or-drop list, landing the link correction if kept; then discard all four.

b) Discard all four now, the worktree run's own recommendation at medium confidence, because the fixes landed on `main` under the same titles.

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

a) (recommended, confidence high - reviewed: an independent check found all three pages byte-identical to copies committed in Git, so nothing is lost) Yes: remove it and delete the `rename-paperclip` branch with `git branch -d`.

b) Copy the diagram folder somewhere first, then remove the worktree.

### ORCA-HOME - Who holds the Orca adapter's rules

focus: _emerging

**Context:** Sixteen parked queries settle the `ki-delegation-orca` adapter's rules and trials and the unmerged `orca-adapter` branch in the harness (ORCA-SKILL-KIND, CLOSEOUT-STRIKE, ONE-LAUNCHER, ONE-LAUNCHER-UNIT, OUTLIVE, PROMPT-RENDER, HEARTBEAT-ACK, STOP-VERB, RUN-RECOVERY, QUEUE-PACE, REPORT-HOME, WORKER-SURVIVAL, DELIVERY-REPLAY, RUN-HANDOVER, OWNER-ASK, ADAPTER-MERGE). The held [ki.prj.orca-evaluation](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.orca-evaluation/work.md) also proposes, as SCOPE-SPLIT, handing its four method questions to "Ways of working". Meanwhile State of play's ORCA-CLOSE-HOME would give that Project's five questions and two notes to the Inbox, and inbox-sol's coordination spec plans runs as Orca workers (its Q17).

**Query:** Should the adapter's rules and branch come to the guild, while Orca usage evidence and upstream feedback go to the Inbox?

**Options:**

a) (recommended, confidence high - reviewed: the reusable adapter is a delegation skill, while trials and feedback are about using Orca) Yes. The guild takes the sixteen adapter queries, SCOPE-SPLIT's four method questions and the `orca-adapter` branch; the Inbox takes Orca usage and upstream feedback under ORCA-CLOSE-HOME.

b) Send everything Orca-related to the Inbox, including the adapter.

c) Drop the adapter for now, because Agora now does the waking, and close the sixteen as no longer needed.

### COORD-OVERLAP - The Inbox's coordination and method focus areas

focus: _emerging

**Context:** Under COORD-SOLE (5 November), [personal.reg.inbox-sol](/Users/krisbrown/kis/personal/inbox/+/_WORK/personal.reg.inbox-sol/coordination/_index.md) alone holds coordination and communication: a session-coordination spec built with you part by part, with about ten open questions and 14 lines it will send once each part is agreed, most of them to ki.sop.main. It also holds the scored planning method, which it says is "done when ... handed to Ways of working". Both reach into `ki-coordination`, `ki-trades` and the work model, which the guild now keeps.

**Query:** Should the Inbox keep designing these with you, sending what is agreed to the guild instead of State of play?

**Options:**

a) (recommended, confidence high - reviewed: sending agreed parts straight to the guild removes a routing hop without interrupting your design conversation with the Inbox) Yes. The guild sends inbox-sol one line asking it to address its agreed coordination and method sends to ki.reg.ways-of-working, and to hand the planning method here when it is done.

b) Move the `coordination` and `method` focus areas into the guild now.

c) Leave it as it is, with State of play routing each send on.

### ACQUIRE-ROUTE - Acquisition items are not guild work

focus: _emerging

**Context:** Several items concern acquisition skills rather than how we work: GRANOLA-CAPTURED-SKIP (MSG-6620cbb7, from hnr.sop.main, which wants a reply), GRANOLA-COUNT, CHECKSUMS-SETTLED, ACQ-HOLD-WORDING, ACQ-SCAFFOLD-NOTE and ACQUISITION-PROCESS-APPROVE. [ki.prj.knowledge-acquisition](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.knowledge-acquisition/work.md) is finished, acquisition now runs through the Inbox's `ki-muninn`, and State of play's SKILL-HOMES recommends sending harness acquisition items to ki.reg.main.

**Query:** Should State of play send these to ki.reg.main, with the Inbox consulted on the Granola ones?

**Options:**

a) (recommended, confidence high - reviewed: acquisition has its own method and owner; a file living in the harness does not make it guild work) Yes. State of play routes them to ki.reg.main, and the Granola reply goes to hnr.sop.main from there.

b) The guild takes them under HARNESS-SCOPE b), because the acquisition skills live in the harness.

### ABSORB-STEWARD - Who carries out the Project's transfer and close-out in ki-principal

focus: roles

**Context:** Rule 14 says `ki.reg.guilds` "absorbs `ki.prj.ways-of-working` in ki-principal ... and closes it". The Project's package sits in ki-principal and has had no session since 3 November. The work-package standard lets other work write only one line in its `messages.md`. Only the folder's own work, or territory work once the folder is finished, may delete it. Only a State of play can become a package's assigned steward, by an acknowledged handover. Rule 12 now says ki.sop.main's governor "only convenes and records". The close-out means homing a 1,307-line decisions log, transferring about 95 parked queries and 14 focus folders, and finishing the Project.

**Query:** How should the guild get the authority to work inside the Project's package and close it?

**Options:**

a) (recommended, confidence medium - this matches rule 14's words with the smallest rule change, but it widens a stewardship rule, which the directive's purpose review watches for) The guild becomes the Project's assigned steward for the absorption only, by a committed and acknowledged handover in both decisions logs. `ki-work-package`'s stewardship rule gains one sentence admitting "a package the owner names as absorbing it". The guild's runs then transfer, home and finish the Project, with rule 14 as Kris's `finish`, and close it out.

b) Kris opens ki.prj.ways-of-working once more, for one close-out session in ki-principal. That session sends its transfers to the guild as message lines and finishes itself. No rule changes, but it costs a session of Kris's attention.

c) ki.sop.main takes assigned stewardship and runs the close-out, as the standard allows today, although rule 12 limits its governor to convening and recording.

### SEATS-VS-SUBPACKAGES - Whether seats replace sub-packages

focus: roles

**Context:** On 2 November Kris set SUB-PACKAGE: a doer's short-lived package for one focus area, id `<parent>.<focus>`, a sibling folder, one worker and one inbox. `personal.reg.inbox-terra.kiv` is the live example. The brief's seat is "a role taking part in a package, addressed `package+role` ... its folder is a sibling ... and lives and dies with its package". Rule 6 has naming migrate incrementally. The directive's first part counts complexity as a defect. Two sibling-folder shapes for one doer would be that kind of complexity.

**Query:** Should the seat replace the sub-package?

**Options:**

a) (recommended, confidence medium - the two shapes do the same job, and keeping both fails the simplicity part, but the brief does not say so outright) Yes. The sub-package rules retire into the seat rules, and `personal.reg.inbox-terra.kiv` becomes a seat of inbox-terra the next time it takes up its role, under rule 6.

b) Keep both: a sub-package for a focus area's short-lived doer, and a seat for a role in the package.

### HARNESS-SCOPE - Does the guildmaster keep every skill set, as the brief's "guild" term implies?

focus: roles

**Context:** On 6 November the guild's blind review recommended keeping the guild to the ways-of-working skills, with engineering, website and repository asks staying with the paused ki.prj.baseline-rollout or going to ki.reg.main. That review came before the brief. The brief defines Guild as "A set of skills, such as change management, kept by the guildmaster", and reserves "a guildmaster per guild" until "the work calls for them". So today's one guildmaster keeps every guild. Engineering, website, repository and acquisition are each a set of skills, and acquisition follows this answer under ACQUIRE-ROUTE. About 25 harness asks wait with no active carrier, among them the HNR conform conflicts, `ki-e2e`, DRYRUN-SCOPE, AREA-COLUMN, the checker boundaries and the Baseline rollout's harness lines.

**Query:** Should the guild keep every skill set in ki-agentic-harness as guilds, until the work calls for a second guildmaster?

**Options:**

a) (recommended, confidence medium - this follows the brief's Guild and Reserved wording, which overturns a reviewed recommendation made before the brief) Yes. Each skill area is a guild kept here: change management, governance, engineering, repository, design, acquisition and environment. The work page says so. ACQUIRE-ROUTE takes b), and the idle harness asks come here.

b) No. The guild keeps only the change-management and coordination skills and the role catalogue. The other asks wait for ki.prj.baseline-rollout or go to ki.reg.main.

### TRANSFER-SOP-QUERIES - Move HOLD-STATES and METHOD-BATCH to the guild

focus: roles

**Context:** State of play holds two method bundles for Kris's return: [HOLD-STATES](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.sop.main/discussions.md), seven hold-state choices plus HOLD-TIDY, and METHOD-BATCH, fifteen method choices with an ADR-007 update. Both are recommended at high and both are unanswered. The guild's earlier recommendation, made before the brief, was for Kris to answer them in State of play's pass "to avoid asking twice". Because they have not been asked, moving them asks nothing twice. Rule 14 says "one package owns the method", and rule 12 says ki.sop.main's governor "only convenes and records".

**Query:** Should both bundles and their design notes move to the guild and be asked there?

**Options:**

a) (recommended, confidence medium - rules 12 and 14 make the guild the one method owner, and moving unanswered queries costs Kris nothing; this changes a reviewed recommendation) Yes. State of play sends both bundles and their two design notes here by message line. The guild asks them and lands the harness run.

b) Kris answers them in State of play's pass, and State of play sends each answer here for the guild to land.

### CAPTURE-ASSISTANT - Which "assistant" becomes gatekeeper

focus: roles

**Context:** The brief says: "Rename the capture skill's "assistant" to match gatekeeper", and "gatekeeper (replaces assistant; owns what comes in and goes out)". Under TOOLING-STAYS on 1 November, Kris kept `ki-acquire` and its provider skills' names ("acquiring goes to the assistant"), which reversed SKILL-NAME's `ki-assistant` rename. "The assistant" survives in two places. One is the harness acquire skills' wording, which calls the Inbox's executable route "the assistant's `ki-muninn`". The other is the Inbox's own capture guide and AGENTS.md, whose trigger is Kris's **"give it to my assistant"** and which sit in the Personal territory. The brief also says "whatever Kris is talking to is his point of contact in that capacity", so his spoken phrase is not a role name.

**Query:** What does the rename cover?

**Options:**

a) (recommended, confidence medium - this covers both places the role word lives and keeps Kris's own phrase, but the brief names only "the capture skill") Rename the role word, not the skill. The harness acquire skills say "the gatekeeper" where they mean the Inbox's role. The guild sends one line asking personal.reg.inbox-terra to do the same in its capture guide and AGENTS.md, keeping "give it to my assistant" as Kris's words. `ki-acquire` keeps its name under TOOLING-STAYS.

b) Rename the skill too, `ki-acquire` to a gatekeeper name with deprecated aliases, revisiting TOOLING-STAYS.

### PAPERCLIP-NAMES - How far "Paperclip-era role names are deleted" reaches

focus: roles

**Context:** The brief: "Paperclip-era role names are deleted (no confirmation needed)." On 26 September `subagents/coordination/` gained four "coordination lane" roles: `ki-convenor`, `ki-steward`, `ki-wright` and `ki-ferryman`, which covers remote execution and is not a Paperclip delivery role as such. The harness AGENTS.md section "Paperclip local delivery" names Wright, Steward and Convenor, and holds Kris's standing grant for the Convenor to merge into local `main`. The parked PAPERCLIP-RETIRE and PAPERCLIP-GRANT ask about retiring the Paperclip skill and its 54 declarations, and about suspending that grant. "Steward" lives on as a manager role.

**Query:** Does the deletion take in the AGENTS.md Paperclip section and its merge grant, as well as the four subagents?

**Options:**

a) (recommended, confidence medium - the grant names only roles the brief deletes, and Paperclip was retired on 31 October by the stock-take's account, which I did not verify directly) Delete all four subagents and the AGENTS.md "Paperclip local delivery" section with its grant. The `ki-delegation-paperclip` skill and its declarations stay for PAPERCLIP-RETIRE.

b) Delete only `ki-convenor`, `ki-steward` and `ki-wright`. Keep `ki-ferryman` and the AGENTS.md grant until PAPERCLIP-GRANT is answered.

### LIBRARY-OPEN - When to open `ki.reg.library`

focus: roles

**Context:** Rule 10 says "One library, `ki.reg.library`". Rule 9 says "the guildmaster and the librarian together carry islands, guilds and library into the Knowledge Islands concept". No `ki.reg.library` package exists. The concept, the Work Process note and GDR-KI-PRINCIPAL-009, lives in ki-principal, where the guild may only send message lines. The directive says "Reserved roles stay reserved until the work calls for them". The librarian is not reserved, but opening a package still needs Kris's word, as OPEN-GUILD did.

**Query:** When should `ki.reg.library` open, and where?

**Options:**

a) (recommended, confidence medium - the concept update is the first work that needs a librarian, and opening earlier would leave an idle seat, which is a capture sign) Open it in ki-principal, the Knowledge Base Capital, when Stage C reaches its concept step. ki.sop.main seeds it at Kris's word.

b) Open it now in ki-principal, so that it can take the role catalogue's terminology into the Knowledge Base alongside the guild.

## Parked

None.
