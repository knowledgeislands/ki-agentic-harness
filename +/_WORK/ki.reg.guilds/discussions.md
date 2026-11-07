# ki.reg.guilds discussions

## Open

### TERRA-ORCA - Remove the stale Orca worktree on terra

**Context:** terra has one leftover worktree in apps-markhowarth.com. Orca, the app that manages agent workspaces, made it on 31 October while preparing a workspace and left it locked. It is clean, and the commit it points at is already published on `main`, so nothing in it would be lost. I changed nothing on terra because this brief allowed only a read-only look.

**Query:** Should a later run on terra unlock and remove it?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same, as Orca has not cleaned it up in a week) Yes: a run on terra re-checks that it is clean and its commit is on `main`, then removes it with Orca's own remove command, which also clears Orca's record; only if Orca no longer lists it, `git worktree unlock` then `git worktree remove`, never a forced `-f -f`. If Orca still lists it as in use, the run stops and asks you.

b) Leave it for Orca to clean up itself.

### VEGA-KEY - Let runs reach vega over SSH

**Context:** vega is listed in `~/.ssh/config` on sol, but SSH refused to connect because vega's host key, the fingerprint SSH uses to recognise a machine, is not recorded on sol. Accepting an unknown key without checking it is unsafe, and it would change the SSH setup, so I left vega unchecked.

**Query:** Should vega's host key be recorded on sol so that runs can check vega read-only?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same, as checking the fingerprint on vega itself is the safe way to trust a new key) You run `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub` on vega, then `ssh vega` once on sol, accepting only if the two fingerprints match. A later run then repeats the read-only check there.

b) Leave vega out of these checks.

### CM-PARTS - Divide change management into four named parts

**Context:** Change management has 13 skills, plus four in governance that coordination depends on. They fall into four groups with clear borders: Coordination (packages, runs, messages, reports), Work lifecycle (capture, plan, deliver, accept), Work records (the tracker and record formats) and Design (shaping new work). One guildmaster keeps them all; a guildmaster per part stays reserved until needed.

**Query:** Should the change-management guild be divided into these four parts?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same, as the borders match how the skills already hand off and one guildmaster fits "reserve until needed") Yes: Coordination (`ki-coordination`, `ki-work-package`, `ki-delegation`, `ki-recap`), Work lifecycle (`ki-next`, `ki-plan`, `ki-implement`, `ki-accept`), Work records (`ki-work`, `ki-work-roadmap`, `ki-work-recurring`) and Design (`ki-work-design`), one guildmaster for all. The trades skills stay on hold for the Trades revamp, which this answer does not decide.

b) Three parts: fold Design into Coordination, since it is one small skill.

c) No parts; keep change management as one list.

### PART-HOME - Record the parts without moving skill folders

**Context:** `ki-work-package`, `ki-delegation` and the trades skills live in the governance folder, while the Coordination part would include them. Moving folders breaks the links in every brief footer and every repository's references.

**Query:** Should the parts be recorded as a grouping only, or should skill folders move to match?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same, as moving folders breaks links across 63 repositories for a purely visual gain) Grouping only: record the parts in the guild's work page and as a field in the skills catalogue's generated data, so the two cannot drift; folders stay where they are.

b) Move folders so each part is its own directory under `skills/change-management/`.

### BATCH-RETIRE - Retire ki-batch into the unattended window

**Context:** `ki-batch` gives an approved, frozen set of Ready records one authority envelope. No batch has been created in 30 days; the last ledger was [KI-HARNESS-BATCH-025](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/+/_BATCHES/KI-HARNESS-BATCH-025.md) on 20 October. The unattended window in coordination now plans and delivers records "in `ki-batch` waves", so one grant has two authority records: the decisions log and a batch record. Retiring it touches the five brief footers, the `ki batch` command and 18 repositories' empty `+/_BATCHES/` folders.

**Query:** Should `ki-batch` be retired, with its frozen-set and closure rules moved into `ki-coordination` and `ki-accept`?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same, as no batch has been made since 20 October and two authority records for one grant drift) Yes, retire it. The window grant in the decisions log is the one authority record; the frozen-set rule (a wave is fixed before delivery starts) and the closure rule move into `ki-coordination` and `ki-accept`; all five brief footers lose their `ki-batch` clause in the same change; autonomous delivery outside a coordinating package is dropped, such work opening a package with a window; the empty `+/_BATCHES/` folders and the `ki batch` command go through the migration file.

b) Keep it but narrow it to autonomous delivery outside a coordinating package, and drop it from the window.

c) Keep it as is.

### REMOTE-ADAPTERS - Fold the GitHub Issues and Linear adapters into ki-work

**Context:** `ki-work-github-issues` and `ki-work-linear` describe using those services as a repository's tracker. Neither is declared by any repository, and neither can run: both say remote execution is unavailable. `ki-repo` uses the GitHub Issues declaration to decide whether a repository's Issues tab is switched on.

**Query:** Should the two remote tracker skills become one reference inside `ki-work`?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same, noting `ki-repo`'s live dependency needs a target) Yes, fold both into `ki-work` as one reference: a repository picks its tracker with a `ki-work` adapter value such as `adapter = "github-issues"`, which `ki-repo`'s Issues switch reads instead of a skill declaration; `ki-plan`, `ki-next` and the skills catalogue are repointed; the old names stay readable through the migration file.

b) Retire both outright, with no reference kept.

c) Keep both as they are.

### RECAP-NARROW - Narrow ki-recap to the conversational session recap

**Context:** `ki-recap` summarises a live session. While coordinating, the Summary already replaces it, as you decided on 14 October ("ki-recap keeps the ordinary session recap only"). It still carries a `checkpoint <work id>` mode that writes a work package, which `ki-work-package` owns, and a rule that tidies batch folders.

**Query:** Should `ki-recap` drop its checkpoint mode and batch tidying, keeping only the conversational recap?

**Options:**

a) (recommended, confidence high - it finishes what the 14 October decision started and removes two overlaps) Yes, narrow it to the conversational recap and its learning routes.

b) Keep the checkpoint mode as a convenience that calls `ki-work-package`.

### HELD-VS-RECORD - Where a package's deferred work lives

**Context:** Packages keep waiting work in their Held lists; this package holds six such items, some for days. Roadmap records are where `ki-next` looks for deferred work and where acceptance happens. HANDOFF-AS-MESSAGE (20 October) says handoffs are message lines and only deferred work the receiver owns becomes a record.

**Query:** Should deferred deliverable work that outlives a session become a roadmap record in its home repository, leaving Held only for items waiting on a named decision or event?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same, as it follows HANDOFF-AS-MESSAGE and puts deferred work where selection and acceptance look) Yes: work not delivered by the run or session that produced it becomes an unadopted triage record in its home repository, captured there through `ki-next`; Held keeps only items waiting on a named decision or event.

b) No: packages may keep deferred work in Held as long as needed, and roadmaps are only for repository delivery chosen separately.

### STAGE-C-SPLIT - Write in the parts of the role catalogue you've already approved now

**Context:** You've approved the role list and that every package records its role (ROLES-TIDY, 6 November), but none of it is in the shared skills. Packages are already adding a `role:` field the package format doesn't allow yet, so the `ki-work-package` audit flags them (RECORD-2, seen on this package in the hooks-stubs run). The seven open role questions only affect parts of the catalogue: seats, the assistant's name, Paperclip names and the library.

**Query:** Should a run write the approved parts into the skills now, and leave the parts the open questions affect until you answer them?

**Options:**

a) (recommended, confidence high - it only carries out what you've already approved, and it fixes the audit problem the ROLE-FIX messages caused) Yes. Add the catalogue's roles, their glyphs, the `role` field and the guildmaster and quartermaster entries to `ki-work-package` and `ki-coordination` now, and add the rest once you've answered the seven questions.

b) No, wait and do it all in one go after the seven questions are answered.

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

a) (recommended, confidence high - reviewed: Kris assigned absorption and closure to the guild, and a narrow, acknowledged stewardship exception carries that out without making the convening governor the delivery owner) The guild becomes the Project's assigned steward for the absorption only, by a committed and acknowledged handover in both decisions logs. `ki-work-package`'s stewardship rule gains one sentence admitting "a package the owner names as absorbing it". The guild's runs then transfer, home and finish the Project, with rule 14 as Kris's `finish`, and close it out.

b) Kris opens ki.prj.ways-of-working once more, for one close-out session in ki-principal. That session sends its transfers to the guild as message lines and finishes itself. No rule changes, but it costs a session of Kris's attention.

c) ki.sop.main takes assigned stewardship and runs the close-out, as the standard allows today, although rule 12 limits its governor to convening and recording.

### SEATS-VS-SUBPACKAGES - Whether seats replace sub-packages

focus: roles

**Context:** On 2 November Kris set SUB-PACKAGE: a doer's short-lived package for one focus area, id `<parent>.<focus>`, a sibling folder, one worker and one inbox. `personal.reg.inbox-terra.kiv` is the live example. The brief's seat is "a role taking part in a package, addressed `package+role` ... its folder is a sibling ... and lives and dies with its package". Rule 6 has naming migrate incrementally. The directive's first part counts complexity as a defect. Two sibling-folder shapes for one doer would be that kind of complexity.

**Query:** Should the seat replace the sub-package?

**Options:**

a) (recommended, confidence high - reviewed: one seat model removes overlapping sibling-folder machinery while keeping the doer's link to its parent) Yes. The sub-package rules retire into the seat rules, and `personal.reg.inbox-terra.kiv` becomes a seat of inbox-terra the next time it takes up its role, under rule 6.

b) Keep both: a sub-package for a focus area's short-lived doer, and a seat for a role in the package.

### HARNESS-SCOPE - Does the guildmaster keep every skill set, as the brief's "guild" term implies?

focus: roles

**Context:** On 6 November the guild's blind review recommended keeping the guild to the ways-of-working skills, with engineering, website and repository asks staying with the paused ki.prj.baseline-rollout or going to ki.reg.main. That review came before the brief. The brief defines Guild as "A set of skills, such as change management, kept by the guildmaster", and reserves "a guildmaster per guild" until "the work calls for them". So today's one guildmaster keeps every guild. Engineering, website, repository and acquisition are each a set of skills, and acquisition follows this answer under ACQUIRE-ROUTE. About 25 harness asks wait with no active carrier, among them the HNR conform conflicts, `ki-e2e`, DRYRUN-SCOPE, AREA-COLUMN, the checker boundaries and the Baseline rollout's harness lines.

**Query:** Should the guild keep every skill set in ki-agentic-harness as guilds, until the work calls for a second guildmaster?

**Options:**

a) (recommended, confidence high - reviewed: one keeper for the harness's skill sets gives the new guild model a clear owner, with specialist guildmasters reserved until needed) Yes. Each skill area is a guild kept here: change management, governance, engineering, repository, design, acquisition and environment. The work page says so. ACQUIRE-ROUTE takes b), and the idle harness asks come here.

b) No. The guild keeps only the change-management and coordination skills and the role catalogue. The other asks wait for ki.prj.baseline-rollout or go to ki.reg.main.

### TRANSFER-SOP-QUERIES - Move HOLD-STATES and METHOD-BATCH to the guild

focus: roles

**Context:** State of play holds two method bundles for Kris's return: [HOLD-STATES](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.sop.main/discussions.md), seven hold-state choices plus HOLD-TIDY, and METHOD-BATCH, fifteen method choices with an ADR-007 update. Both are recommended at high and both are unanswered. The guild's earlier recommendation, made before the brief, was for Kris to answer them in State of play's pass "to avoid asking twice". Because they have not been asked, moving them asks nothing twice. Rule 14 says "one package owns the method", and rule 12 says ki.sop.main's governor "only convenes and records".

**Query:** Should both bundles and their design notes move to the guild and be asked there?

**Options:**

a) (recommended, confidence high - reviewed: unanswered method decisions belong with the package that now owns the method, and moving them before asking costs you nothing) Yes. State of play sends both bundles and their two design notes here by message line. The guild asks them and lands the harness run.

b) Kris answers them in State of play's pass, and State of play sends each answer here for the guild to land.

### CAPTURE-ASSISTANT - Which "assistant" becomes gatekeeper

focus: roles

**Context:** The brief says: "Rename the capture skill's "assistant" to match gatekeeper", and "gatekeeper (replaces assistant; owns what comes in and goes out)". Under TOOLING-STAYS on 1 November, Kris kept `ki-acquire` and its provider skills' names ("acquiring goes to the assistant"), which reversed SKILL-NAME's `ki-assistant` rename. "The assistant" survives in two places. One is the harness acquire skills' wording, which calls the Inbox's executable route "the assistant's `ki-muninn`". The other is the Inbox's own capture guide and AGENTS.md, whose trigger is Kris's **"give it to my assistant"** and which sit in the Personal territory. The brief also says "whatever Kris is talking to is his point of contact in that capacity", so his spoken phrase is not a role name.

**Query:** What does the rename cover?

**Options:**

a) (recommended, confidence high - reviewed: gatekeeper replaces a role, TOOLING-STAYS keeps the skill's name, and your spoken phrase stays ordinary speech) Rename the role word, not the skill. The harness acquire skills say "the gatekeeper" where they mean the Inbox's role. The guild sends one line asking personal.reg.inbox-terra to do the same in its capture guide and AGENTS.md, keeping "give it to my assistant" as Kris's words. `ki-acquire` keeps its name under TOOLING-STAYS.

b) Rename the skill too, `ki-acquire` to a gatekeeper name with deprecated aliases, revisiting TOOLING-STAYS.

### LIBRARY-OPEN - When to open `ki.reg.library`

focus: roles

**Context:** Rule 10 says "One library, `ki.reg.library`". Rule 9 says "the guildmaster and the librarian together carry islands, guilds and library into the Knowledge Islands concept". No `ki.reg.library` package exists. The concept, the Work Process note and GDR-KI-PRINCIPAL-009, lives in ki-principal, where the guild may only send message lines. The directive says "Reserved roles stay reserved until the work calls for them". The librarian is not reserved, but opening a package still needs Kris's word, as OPEN-GUILD did.

**Query:** When should `ki.reg.library` open, and where?

**Options:**

a) (recommended, confidence high - reviewed: opening it at the concept step gives the guild its partner without an idle package) Open it in ki-principal, the Knowledge Base Capital, when Stage C reaches its concept step. ki.sop.main seeds it at Kris's word.

b) Open it now in ki-principal, so that it can take the role catalogue's terminology into the Knowledge Base alongside the guild.

## Parked

None.
