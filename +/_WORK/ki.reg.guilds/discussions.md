# ki.reg.guilds discussions

## Open

### BROADCAST-FORM - How a message sent to many packages should be written in Outbound

**Context:** The checker requires every Outbound line to name one recipient package id after `to` (`- <date> · <id> · to <package id> · …`). It has no form for a broadcast to many packages. Four guilds Outbound lines were broadcasts ("to 15 live packages", "to 41 live packages on sol"). To clear the failure without changing content, I wrote them as `to live-packages · 15 live packages · …`. `live-packages` is a placeholder that matches the id pattern but is not a real package.

**Query:** Should the checker and the work-package standard get a proper broadcast recipient form, or should broadcasts be logged as one Outbound line per receiving package?

**Options:**

a) (recommended, confidence medium - reviewed: the blind reviewer chose this at high, because the send, ACK and prune rules and the banner all assume one receiver per line; the run that raised it preferred a count form) Log each broadcast as one Outbound line per receiving package, so each ACK clears its own line. Add one sentence to the work package standard's Prune rule: an ACK clears the line matching both the id and the receiver. Drop the `live-packages` placeholder.

b) Add a broadcast form to the standard and checker, `to <n> live packages`, with new ACK-counting rules in the standard, checker and banner, and replace the placeholder lines with it.

c) Keep the `live-packages` placeholder convention.

### STUB-KEEP - Keep the two retired skills as stubs until no repository declares them

**Context:** The brief asked for both Paperclip skills to be removed. But the `ki` tool stops with an error in any repository that declares a skill no harness provides, and 55 repositories still declare one. Deleting both skills outright would stop every audit and setup command in all 55 until each one edits its `.ki.toml`. I kept them as empty stubs that only warn, and put the transition rules in one deletable migration file.

**Query:** Do you accept the stubs as the transition, rather than deleting the skills now?

**Options:**

a) (recommended, confidence high - nothing breaks, and the stubs and their migration file are deleted together in one change once the declarations are gone) Keep the stubs until no repository declares either skill, then delete them.

b) Delete both stubs now and accept that audits fail in the 55 repositories until each removes its declaration.

### DECL-SWEEP - How the 55 repositories drop the retired declaration

**Context:** Each of 56 repositories (the blind reviewer counted 56, not 55) needs to remove one `[skills.ki-delegation-paperclip]` or `[skills.ki-agent-coordination-paperclip]` table from its `.ki.toml`. Until it does, its audit carries one warning. Each repository owns its own `.ki.toml`, and this run had no authority to edit any of them.

**Query:** Should the declarations be removed by one estate-wide run, or left to each repository's own owner?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same course; one bounded run is quick and mechanical, but it writes in other repositories, so each territory has to agree to it) Ask State of play to route a single bounded estate run that removes the declaration in each repository, one commit per repository, under each territory's agreement.

b) Send each territory a message and let its owners remove the declaration at their own pace.

c) Fold the removal into each territory's next routine `ki repo` conform pass, which would need the stub's conform step changed to remove the declaration (the reviewer's suggested extra option).

### TASK-LINKS-CODE - Retire the Paperclip code left in `tools-ki`

**Context:** `tools-ki` still carries Paperclip-specific code, including a `paperclip` provider in its roadmap task-link display. Paperclip is retired, and nothing uses that code. The blind reviewer split the original TASK-LINKS question into this part and TASK-LINKS-FIELD.

**Query:** Should the Paperclip code in `tools-ki` be retired?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer judged this part clearly right; the code has no user) Yes: send ki.prj.tools-burndown a line to capture and remove it.

b) Leave it until someone next works in that area.

### TASK-LINKS-FIELD - Whether to retire the `task_links` roadmap field

**Context:** `task_links` is an optional roadmap-record field that links a record to tasks in another system. Paperclip was its main user. `tools-ki` already shows a `linear` provider beside `paperclip`, and Linear is a supported work adapter, so the field has a plausible use beyond Paperclip. The blind reviewer disagreed with retiring it and preferred keeping it as a general field, with its own triage record to test whether Linear or GitHub Issues linking will use it.

**Query:** Should the `task_links` field itself be retired?

**Options:**

a) (recommended, confidence medium - reviewed: the blind reviewer chose this; the field is provider-neutral and Linear already appears in the code) Keep it as a general field, and capture a triage record in the harness to test whether Linear or GitHub Issues linking will use it.

b) Retire it from the roadmap standard and the `tools-ki` validator now.

### ABSORB-DROPS - Drop the 13 overtaken ways-of-working queries

**Context:** Of the 117 parked queries in ki.prj.ways-of-working, 13 no longer ask anything live. Seven are findings or duplicates in the folder being deleted (QUICK-FIXES, AGENDA-SHAPE, RECORD-2, FOLDER-1, COORD-7-REST, Z-FILES, Z-FILES-HOME). Two proposed their own closure and were reviewed at high confidence (PRINCIPAL-READOPT, PRINCIPAL-KIND-SIZE). SPLIT-COMMIT is history only. SWEEP-GATE guarded a rename sweep that has since run. PILOT-CONTRACT-LINE wanted checks added to a pilot that was answered on 1 November. PROTECTED-PUBLICATION protected a stack that has since been published, and is dropped only after one check. Every other query moves, merges, routes or is already settled, with no drop.

**Query:** May the guild drop these 13 and keep the rest as planned?

**Options:**

a) (recommended, confidence high - each is overtaken by something checked directly in this run, and Git keeps the text) Yes: drop all 13, recording each with its reason in the guild's decisions log.

b) Carry all 13 into the guild's Parked section too, and decide them later.

### CLOSE-WAIVER - How to close the 92 finished runs

**Context:** `ki agent close` retires the whole `ki-project-ways-of-working` run group, and passes only when every entry in the 1,313-line decisions log has a recorded home or class and the run folders are empty. 34 of those folders still hold files. The owner can waive the decisions check with `--reconciled`. On 1 November the recommended answer to CLOSE-GATE was to meet the gate rather than bypass it, and the standard says "keep the close gate strict with the reconciled waiver". About 85% of the entries can be recorded as struck or operational in bulk. The reviewer notes that only the decisions check can be waived; the 34 non-empty folders must be homed or emptied either way.

**Query:** Should the absorption meet the close gate entry by entry, or should Kris waive it?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same course; it keeps the gate strict as Kris settled, though recording about 300 entries is a long run) Meet it: a reconcile run records a home or class for every entry, then closes the group under the strict gate.

b) Waive it: once the guild has moved the live entries, Kris authorises `--reconciled` for this group only.

### Z-PUBLISHED - The two Z reports are already public

**Context:** On 1 November, Z-FILES recommended keeping `reports/hold-request-20261030-z.md` and `reports/z-session-retirement-20261030.md` uncommitted until Kris said who the reports are for (PUBLIC-REPORT-AUDIENCE). Both were committed in ki-principal `7109c998` ("chore: baseline", 4 November) and are on `origin/main`, and ki-principal's `.ki.toml` declares it public. The retirement report describes private archives and recovery bundles by count; this run saw no secrets in it but did not judge its sensitivity. Rewriting published history needs a force-push, which no agent may do. The reviewer checked: no credentials, but the retirement report names a private archive path under `~/.local/state/ki/work-archives/` and lists archive and bundle file names. Waiting for an audience decision no longer protects anything, since they are already public; whether history needs rewriting is asked separately in Z-HISTORY.

**Query:** What should happen to the two published Z reports?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same course; it removes them from the current tree with the folder and touches no history, but nobody has judged how sensitive they are) Delete them with the folder at the close-out; Kris reads them once and says whether anything in history needs more than that.

b) Remove them now in their own commit, ahead of the close-out, and leave history as it is.

### Z-HISTORY - Whether the published Z reports need a history rewrite

**Context:** Deleting the two Z reports removes them from the current files, but they stay in ki-principal's public Git history from `7109c998` onwards. Removing them from history needs a force-push, which no agent may do and only you can authorise. The retirement report names a private archive path and lists archive and bundle file names, but no credentials. This part comes from the blind reviewer's reframing of Z-PUBLISHED.

**Query:** Will you read the two reports and decide whether history needs rewriting?

**Options:**

a) (recommended, confidence medium - reviewed: the blind reviewer judged your read the step that matters; the content looks low-risk, but only you can judge it) Yes: you read them once; if nothing in them is sensitive, history stays as it is.

b) Rewrite ki-principal's history to remove them now, which you would do yourself with a force-push.

### HOLD-STATES - take all seven as recommended, with HOLD-TIDY, landed in one run

from ki.sop.main

**Context:** seven hold-state choices, HOLD-IDLE, HOLD-SELF, HOLD-URGENT, HOLD-LISTEN, HOLD-FOOTER, HOLD-DIAGRAM and HOLD-TERRA, with HOLD-TIDY (Kris's rule of about 18:10 GMT on 4 November, already ACKed) riding with them; Kris asked for the hold states "thought through before changes go out". The recommended set: idle is "more expected" set by the worker (`hold.set_by: worker`, shown `💤 On hold · idle`), still two reasons; a worker may put its own work into idle only when nothing is running or queued, nothing is handed off, no message is unread, no query is with Kris and everything is pushed, while paused stays Kris's word; an IMPORTANT line on paused work waits and reaches Kris as a `resume` query; more expected and idle keep listening where listening is switched on, paused never does, which revisits LISTEN-STATUS (31 October) for more expected only; ⏸️ for paused and 💤 for more expected and idle, reason and release in the heading and listening on its own line, the wording sent to Agora to draw; the state-flow diagram in Mermaid in the Work Process note with a plain-text version, through one Enactment record; household-terra's self-set hold of 3 November left as it is and re-recorded once the standard changes. SOP-ACTS-FOR-IDLE (6 November) is already in hand. Design note: [hold-states.design.md](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/+/_WORK/ki.reg.guilds/skills/hold-states.design.md).

**Query:** take all seven as recommended, with HOLD-TIDY, landed in one run?

**Options:**

a) (recommended, confidence high - reviewed: an independent reviewer chose the recommended course on all seven) take all seven as recommended; one run lands them with HOLD-TIDY in the harness standards and, under one Enactment record, the Work Process note, then sends a refresh line to every package and household-terra

b) take them one at a time in an interactive pass

c) hand them to personal.reg.inbox-sol's coordination spec under COORD-SOLE (5 November) and land them from there. The seven unpacked queries stay readable in ki.sop.main's `_emerging/packed-queries.md`; Snoozing (on hold), landed on 6 November, may already settle part of HOLD-IDLE and HOLD-LISTEN

### METHOD-BATCH - take all of them as recommended, landed by one harness run

from ki.sop.main

**Context:** the bundle says fifteen method questions and names thirteen, each reviewed or recommended at high. How-we-work choices: VALUES-HOME (write the shared values once in the Work Process note under an Enactment record, each `work.md` linking them in an optional `## Values` line), GOAL-SETTING (an owner-invoked "goals" pass walking each focus area), URGENT-CRITERIA (only a stated deadline or a process rollout may be `URGENT`), LIVENESS (live means `status: active`, `listening: on` and activity within 30 minutes, the register becoming an optional `state.md` field), MESSAGE-WORDS (`URGENT`, `ACK` and `SUPERSEDED` as flags in the leading slot), BROADCAST-POINTER (a broadcast is a one-clause pointer to the pinned standard). Confirmations of delivered changes: REPLY-BLOCK-SUMMARY (the Summary keeps no reply block, as REPLY-BLOCK of 18 October), RENAME-FENCE (a run's record carries over to a renamed work), SUB-PACKAGE-COVERS (a sub-package stays out of `covers`), PUSH-EXCEPTION (drop Kris's 17 October push exception now a push footer exists), ADR-007 (update ADR-KI-HARNESS-SKILLS-007 in place for the move to `ki-muninn`). Harness follow-ups: AUDIT-ORPHANS (a stopped audit stops the test run it started, as a harness work item), BOARD-CAPTURE (wait for a second site before a design-board capture step). WATCH-AGORA, where views differ, stays a separate query in ki.sop.main. Design note: [how-we-work.design.md](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/+/_WORK/ki.reg.guilds/skills/how-we-work.design.md).

**Query:** take all of them as recommended, landed by one harness run?

**Options:**

a) (recommended, confidence high - each was reviewed by an independent reviewer who chose the same course, or rests on Kris's own earlier words) take all as recommended; one harness run lands the method text and the ADR-007 update, with an Enactment record for the Work Process values, and captures the AUDIT-ORPHANS work item

b) take the confirmations and follow-ups now and hand the six how-we-work choices to personal.reg.inbox-sol's coordination spec under COORD-SOLE

c) take them one at a time in an interactive pass. The unpacked queries stay readable in ki.sop.main's `_emerging/packed-queries.md`

### ORCA-SKILL-KIND - should `ki-delegation-orca` stay a process skill

from ki.prj.ways-of-working (run/orca-adapter, ORCA-LAUNCHER; blind review 1 November 05:25 GMT)

**Context:** a governance skill holds a house standard with four modes and a generated rubric; a process skill drives an action. `ki-delegation-paperclip` is governance, but the Orca adapter only describes how a coordinator starts, waits on, steers and closes workers, resting on `ki-delegation` and `ki-coordination`; the review agrees, so long as being a process skill is no way round the shared standards.

**Query:** should `ki-delegation-orca` stay a process skill?

**Options:**

a) (recommended, confidence high - reviewed; fits what the skill does, avoids an empty rubric) keep it a process skill, revisiting only if Orca use needs auditable criteria; any change to who writes reports, how runs detach or who holds authority is made in the governance skill that owns that rule

b) make it a governance skill now, declared in `.ki.toml`, with a rubric and audit scripts like `ki-delegation-paperclip`

### CLOSEOUT-STRIKE - strike that open point and cite the trial

from ki.prj.ways-of-working (run/orca-adapter, ORCA-LAUNCHER; blind review 1 November)

**Context:** `ki-coordination`'s "Closing out Orca workers" still says it is unproven whether a coordinator in an Orca chat may release a worker it started; the 1 November trial (TRIAL-SHAPE) showed a Claude Code chat coordinator can: release closed each worker's terminal and kept its transcript. The review agrees if the wording claims no more than seen (not Codex coordinators, not every terminal, no release of an unfinished worker).

**Query:** strike that open point and cite the trial?

**Options:**

a) (recommended, confidence high - reviewed; the trial recorded the release directly) strike it, cite TRIAL-SHAPE, say the proof covers Claude Code chat coordinators only, keep the fallback for a refused or uncertain release as an ordinary rule; releasing never stands in for stopping an unfinished worker

b) leave it open until the Orca sub-agent pilot checks it

### ONE-LAUNCHER - should one launcher per package per host become a rule

from ki.prj.ways-of-working (run/orca-adapter, ORCA-LAUNCHER; blind review 1 November, differs)

**Context:** the proposal has each package record one launcher per host in its decisions log, so a package never mixes Orca and `ki agent` on one Mac; it rests on design reasoning, not a trial; it would clash with OUTLIVE unless that exception is written in. The review prefers b) with high confidence: each opt-in can say what it covers, and one launcher per host would not stop the same work starting twice on another Mac or in a later session (now ONE-LAUNCHER-UNIT).

**Query:** should one launcher per package per host become a rule?

**Options:**

a) (recommended, confidence medium - review disagrees; keeps runs findable and close-out simple, but untested) adopt it as an adapter rule with OUTLIVE's runs named as the exception

b) leave it open and let each opt-in decision say what it covers (the review's pick)

### ONE-LAUNCHER-UNIT - should each dispatched unit have one recorded launcher, checked before

from ki.prj.ways-of-working (blind review of ONE-LAUNCHER, 1 November)

**Context:** whatever launcher a package uses, the same work could start twice, once per Mac or again by a new coordinator session; the review proposes exactly one launcher answerable for each dispatched unit, recorded at dispatch and checked first. The blind reviewer adds that the check must read the live list of running work as well as the log, since two Macs could both pass a Git-synced log check before either pushes.

**Query:** should each dispatched unit have one recorded launcher, checked before dispatch?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same course; guards against starting work twice, but the check is new and untried) yes: the adapter records the launcher with each unit at dispatch, and the coordinator checks the decisions log and running work before dispatching

b) no: rely on whatever ONE-LAUNCHER settles

### OUTLIVE - should a run that must outlive its coordinator go through `ki agent` u

from ki.prj.ways-of-working (run/orca-adapter, ORCA-LAUNCHER; blind review 1 November)

**Context:** nobody has tested whether an Orca worker survives its coordinator chat ending; a `ki agent` run is detached and survives, as the delegation standard requires of a run that must survive its launcher. The review agrees but warns survival alone is not enough to lift the rule: a fresh session must find the worker, see progress, collect its result and see it finish; a package wholly opted into Orca needs Kris to amend its opt-in.

**Query:** should a run that must outlive its coordinator go through `ki agent` until worker survival is proved?

**Options:**

a) (recommended, confidence high - reviewed; uses the launcher already proved) adopt as an interim rule, lifted only when WORKER-SURVIVAL shows a worker that keeps working, can be found with progress and result from a fresh session, and finishes; Kris amends a wholly-Orca opt-in to allow the exception

b) use Orca regardless and accept the risk of losing the run

### PROMPT-RENDER - should the whole brief text be the spec until `ki` can render one

from ki.prj.ways-of-working (run/orca-adapter, ORCA-LAUNCHER; blind review 1 November)

**Context:** Orca's `worker-start` takes the instructions as a "spec"; the proposal passes the whole brief with its authority footer and report rule, since no `ki` command renders a brief without launching it. The review agrees: hand over a brief already written and checked, and passing it must never add authority.

**Query:** should the whole brief text be the spec until `ki` can render one?

**Options:**

a) (recommended, confidence high - reviewed; the four trial workers ran this way) adopt it: the coordinator passes a brief already in the work folder, kept exactly as launched and checked first for leftover placeholders, a missing or doubled authority footer, a wrong report path and shell truncation; capture a `ki` render-only step as a tools-ki follow-up

b) wait for the render-only step before any further Orca dispatch

### HEARTBEAT-ACK - should the waiter acknowledge heartbeat-only batches itself

from ki.prj.ways-of-working (run/orca-adapter, ORCA-LAUNCHER; blind review 1 November)

**Context:** Orca workers send heartbeats and Orca prompts Kris about each unacknowledged one; filtering by type still wakes the waiter. The proposal has the waiter acknowledge a heartbeat-only batch and wait again within its five-minute bound, waking the coordinator only for a finish, escalation or question. Untried; the review wants a supervised trial covering more than a finish.

**Query:** should the waiter acknowledge heartbeat-only batches itself?

**Options:**

a) (recommended, confidence high - reviewed; nothing relied on until a supervised trial shows it safe) adopt it after one supervised trial covering a finish, a question, an escalation, an unknown message kind and a mixed batch, showing the waiter acknowledges only all-heartbeat batches; the five-minute bound runs from the waiter's first start

b) keep the coordinator acknowledging everything itself

### STOP-VERB - should `worker-stop` be the adapter's stop, used only on Kris's named

from ki.prj.ways-of-working (run/orca-adapter, ORCA-LAUNCHER; blind review 1 November)

**Context:** a run stops only when Kris names it and says stop (settled); the proposal maps that to Orca's `worker-stop --dispatch <id>`, never used in Knowledge Islands. The review agrees if the first use is checked.

**Query:** should `worker-stop` be the adapter's stop, used only on Kris's named word?

**Options:**

a) (recommended, confidence high - reviewed; Orca's documented verb, checks guard first use) adopt it, noted as unexercised: before first use check what the installed command stops and what happens to partial work, afterwards report whether the worker stopped; closing or releasing a worker never stands in for stopping it

b) leave stopping open until tried once

### RUN-RECOVERY - should this recovery procedure become the adapter's rule

from ki.prj.ways-of-working (run/orca-adapter, ORCA-LAUNCHER; blind review 1 November, differs)

**Context:** an Orca Run belongs to the chat session that made it. Proposal: a new session makes a new Run, finds the old one by its objective (starting with the work id), settles or names any worker still owing a decision, and logs the old Run as retired; Orca's takeover works only from a live coordinator terminal. The review prefers b) at medium: one workaround is not a general procedure, and a new Run can start work twice, strand a worker's question or lose the right to settle old workers.

**Query:** should this recovery procedure become the adapter's rule?

**Options:**

a) (recommended, confidence high - review disagrees; it is what was done on 1 November and needs no unproved feature) adopt it, logging the old Run retired only once every worker under it is settled or named unreachable with what it owes

b) wait for the RUN-HANDOVER test first (the review's pick)

### QUEUE-PACE - should that pacing become the adapter's rule

from ki.prj.ways-of-working (run/orca-adapter, ORCA-LAUNCHER; blind review 1 November)

**Context:** Orca does not start a queued worker when its dependencies finish; ORCA-QUEUE already routes queued runs through Orca while the parent chat is live, else `ki agent`. The proposal adds that the coordinator starts the next worker at the wake that settles the previous one, about three running; the review adds that three is a ceiling and a finish message alone does not prove the dependency succeeded.

**Query:** should that pacing become the adapter's rule?

**Options:**

a) (recommended, confidence high - reviewed; matches existing three-at-a-time guidance) adopt it: at the settling wake, read the report, confirm the next worker's dependency succeeded and nothing conflicts, then start it, no more than about three running and never starting a worker twice during recovery

b) leave pacing to each coordinator

### REPORT-HOME - should the coordinator copy an Orca worker's report into `reports/` at

from ki.prj.ways-of-working (run/orca-adapter, ORCA-LAUNCHER; blind review 1 November)

**Context:** `ki agent` copies a finished run's report into the work folder; Orca does not. The proposal has the coordinator copy the report named in the worker's finish message at receive. The review agrees if every rule naming the launcher as only writer changes too, and the copy is guarded (expected report for that worker and package, content unchanged, repeatable, stops if a different file is there, never copies a path just because a message names it). This revisits Kris's 14 October decision "make the launcher the only writer of the thread folder's log and report files".

**Query:** should the coordinator copy an Orca worker's report into `reports/` at receive?

**Options:**

a) (recommended, confidence high - reviewed; keeps reports in Git without waiting for tools-ki) revisit the 14 October decision for Orca alone: adopt the coordinator's copy as a named Orca exception, written into `ki-delegation`'s run-packet text and every rule naming the launcher as only writer, with those checks

b) teach `ki agent` to home Orca workers' reports, keeping one writer

### WORKER-SURVIVAL - should the next Orca-dispatched run include this test deliberately

from ki.prj.ways-of-working (run/orca-adapter, ORCA-LAUNCHER; blind review 1 November)

**Context:** untested; Kris left it as a technical detail for first live use under TRIAL-SHAPE; the review agrees with a deliberate test.

**Query:** should the next Orca-dispatched run include this test deliberately?

**Options:**

a) (recommended, confidence high - reviewed; cheap, and it is what lifts OUTLIVE) yes: with one short read-only worker running, note its identity, end only an expendable coordinator chat (not the Orca app or the Mac), and from a fresh session check the worker kept working, its result and any pending question can be reached, and it can be cleaned up; a worker finishing before the chat ends proves nothing

b) wait for it to happen by chance

### DELIVERY-REPLAY - run this test before relying on replay

from ki.prj.ways-of-working (run/orca-adapter, ORCA-LAUNCHER; blind review 1 November)

**Context:** Orca's help says an unacknowledged message replays on the next check; the loss test has not run. The review adds a second case: a message already acted on but not acknowledged must not cause a second action when it returns.

**Query:** run this test before relying on replay?

**Options:**

a) (recommended, confidence high - reviewed; the wait rule assumes no seen event is lost) yes, in the same trial as WORKER-SURVIVAL with results recorded separately: note the first message's id, end only the test waiter before it acknowledges, re-arm and check the same message returns; then end it after the coordinator acted but before acknowledging, and check the replay starts, accepts or changes nothing a second time

b) rely on Orca's help text

### RUN-HANDOVER - is the test worth running

from ki.prj.ways-of-working (run/orca-adapter, ORCA-LAUNCHER; blind review 1 November, differs)

**Context:** whether `run-use` can move a Run between chat sessions is untested beyond one failure; RUN-RECOVERY works round it with a new Run. The review prefers b) at high: the answer decides whether recovery must always replace Runs and whether old workers stay reachable, so a small read-only test is worth running, keeping reconnecting, handing over control and listing workers apart, testing the old session leaving apart from a live takeover, never two coordinators at once. One yes-or-no choice, not split.

**Query:** is the test worth running?

**Options:**

a) (recommended, confidence medium - review disagrees; RUN-RECOVERY already works, so this only adds convenience) leave it untested unless recovery proves costly

b) test it in the next trial, read-only, along the review's lines (the review's pick)

### OWNER-ASK - keep this open until OF-OWNER-ASK is decided

from ki.prj.ways-of-working (run/orca-adapter, ORCA-LAUNCHER; blind review 1 November)

**Context:** operational questions use Orca's ask-and-reply (proved); how a worker's question only Kris can answer reaches Kris is undecided under OF-OWNER-ASK in the orca-fit design, and the draft leaves it open. The review agrees, adding the gap must not leave a worker waiting indefinitely nor let a coordinator answer in Kris's place.

**Query:** keep this open until OF-OWNER-ASK is decided?

**Options:**

a) (recommended, confidence high - reviewed; already held by its own query, invents no route) yes; until then a worker that needs Kris reports the question and keeps it, and nothing needing Kris's answer goes ahead on a timeout, silence or a coordinator's reply

b) settle it in the adapter now

### ADAPTER-MERGE - should the branch go to independent review and then be fast-forwarded

from ki.prj.ways-of-working (run/orca-adapter, ORCA-LAUNCHER; blind review 1 November)

**Context:** the `orca-adapter` branch holds two commits on `main` at `321742fe` and would fast-forward; besides the skill text and diagrams it changes `skills/keystone/ki-repo/scripts/rubric/contexts/audit.ts` and the skill-function sorting in `skills/repo-structure/ki-repo-harness/scripts/rubric/contexts/skill-functions.ts`. The drafting run reported tests, type check and audits passing; the review did not rerun them; the brief forbade merging and pushing. The review agrees with a gated sequence.

**Query:** should the branch go to independent review and then be fast-forwarded into `main`?

**Options:**

a) (recommended, confidence high - reviewed; the repository's normal path) yes: apply the answers above that change the text, have the final branch including both audit scripts reviewed independently with checks rerun, then fast-forward it into `main`; as of 7 November `main` is 203 commits past `321742fe`, so the branch no longer fast-forwards as it stands

b) hold it until the open points are settled

### TRIAL-PUBLISH - how should Orca workers publish their notes

from ki.prj.orca-evaluation (SCOPE-SPLIT method question)

**Context:** how a worker commits in a repository whose pre-commit hook runs lint-staged, which made and dropped a backup stash; in plan069 a no-stash rule collided with it, `worker_done` read `failed` though the work succeeded, and Kris granted a bounded exception. Kris chose HOOK-STASH a), lint-staged with `--no-stash`, on 1 November, which may settle it. The blind reviewer found that with `--no-stash` no stash is made, so the clash is gone and the stash clause is no longer needed.

**Query:** how should Orca workers publish their notes?

**Options:**

a) (recommended, confidence medium - reviewed: the blind reviewer proposed this, and HOOK-STASH a) removed the reason for the exception) the worker commits its own note by explicit path inside a write window granted by ask, under the ordinary rules, and never runs `git stash`; the coordinator pushes at receive

c) each brief carries the bounded exception as first written, including that the hook may make and drop lint-staged's backup stash

b) no worker commits; the worker writes note and report and the coordinator commits both at receive. Likely closable as overtaken by HOOK-STASH a); original text at ki-principal `04591e2b`, `+/_WORK/ki.prj.orca-evaluation/queries.md`

### TRIAL-ASK - how does a worker raise a question only Kris can answer

from ki.prj.orca-evaluation (SCOPE-SPLIT method question)

**Context:** an Orca ask blocks the worker and times out after 10 minutes by default (30 at most), staying pending and resumable by message id; in plan069 an ask timed out and escalated and Kris answered in chat. Overlaps OWNER-ASK above and OF-OWNER-ASK in the orca-fit design.

**Query:** how does a worker raise a question only Kris can answer?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same course; keeps the ask for what the coordinator can answer, needs no one attentive for half an hour) the coordinator answers its own asks with `--timeout-ms 1800000`, resuming by message id on timeout; a question only Kris can answer ends the attempt: the worker raises it as a blocking query, `worker_done --outcome failed` names its tag, the coordinator records it and retries after Kris answers

b) the worker keeps the ask open while the coordinator relays it to Kris, resuming the same message after each 30-minute timeout. Original text at ki-principal `04591e2b`

### TRIAL-PRACTICE - run on the ORCA-FIT draft's recommended practice as a provisional, tri

from ki.prj.orca-evaluation (SCOPE-SPLIT method question)

**Context:** Orca workers need a rule for ids, specifications, liveness and reports; the ORCA-FIT draft recommends ids on a `state.md` Now line, the full rendered prompt as specification, liveness from Orca heartbeats only, and reports outside the repository named by `--report-path`; the draft never left Ways of working. Since then ORCA-ROUTING put Run ids out of package files, and PROMPT-RENDER, HEARTBEAT-ACK and REPORT-HOME above cover the rest.

**Query:** run on the ORCA-FIT draft's recommended practice as a provisional, trial-only rule?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same course; lets the trial generate evidence without settling the choices early) yes, provisionally and for the trial only, its evidence going back to the ORCA-FIT choices

b) no, settle those choices before any unit runs. Original text at ki-principal `04591e2b`

### ORCA-IDENTITY-LEAK - should `ki agent` also drop the remaining Orca variables from runs it

from ki.prj.orca-evaluation (SCOPE-SPLIT method question)

**Context:** `ki agent` passed its whole environment, so a run started from an Orca chat coordinator carried the coordinator's Orca identity and could act as it in `orca orchestration` commands. tools-ki `2970714c` now drops `ORCA_AGENT_SESSION_ID`, `ORCA_AGENT_SESSION_SPAWN_TOKEN`, `ORCA_STRUCTURED_SESSION` and `ORCA_CHAT_SCRATCH_DIR`; the pane, tab, worktree and hook variables remain (`ORCA_PANE_KEY`, `ORCA_TAB_ID`, `ORCA_WORKTREE_ID`, `ORCA_AGENT_HOOK_*`), and terra's runs appear in Orca only through inherited pane variables, so removing them may drop runs from terra's list. The blind reviewer disagreed and preferred: holding until an attended terra check, because the variables that carried identity are already gone and the rest affect only how runs are listed; it also suggests dropping only `ORCA_AGENT_HOOK_*` now if they credit a run's hook events to the coordinator.

**Query:** should `ki agent` also drop the remaining Orca variables from runs it starts?

**Options:**

a) (recommended, confidence medium - the leak is direct, but the effect on terra's list is unverified) yes, then check terra's list afterwards

b) hold until an attended terra check shows how terra lists runs, then decide

c) leave `ki agent` unchanged and add a rule that runs must not call `orca orchestration` commands. Original text at ki-principal `417546eb`

### KG-NAME - What to call the knowledge-graph method skill

**Context:** The new skill covers how deposited material is curated into a semantic knowledge graph: the card format, curating one item at a time, tending the staging area, and sending finished cards to their owners. Kris asked about it as "the semantic knowledge graph". Its sibling for capture is `ki-acquire`. The blind reviewer disagreed and preferred: `ki-curate`, because `ki-acquire` already calls this work "curation" and a "knowledge graph" name could be confused with the permanent bases `ki-repo-kb` governs. Kris, 7 November about 04:05 GMT: "I think the knowledge graph in itself is its own skill. I don't think it's part of the [repo] KB at all."

**Query:** What should the skill be called?

**Options:**

a) (recommended, confidence medium - it matches Kris's own words and the graph is the skill's centre) `ki-knowledge-graph`.

b) `ki-curate`, a verb that pairs with `ki-acquire`, though dispatch and the card format sit less naturally under it.

c) `ki-knowledge-funnel`, after the funnel card, though the funnel's capture stage belongs to `ki-acquire`.

### STAGING-HOME - Who owns the staging knowledge base's structure

**Context:** KNOWLEDGE-AS-KB a (6 November) makes the Inbox's `knowledge/` a declared staging knowledge base, using zone aliases that `ki-repo-kb` already supports. A staging base differs from an ordinary one: its ids can change, and it mirrors the islands it will dispatch to.

**Query:** Where is the staging base's shape set out?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same course; structure stays with the structure skill and method with the method skill) A staging profile in `ki-repo-kb` for the zones and aliases, with the graph skill covering how material moves through it.

b) All of it in the graph skill.

### GUILD-NAME - Keep the guild called "acquire", or rename it

**Context:** HARNESS-SCOPE a) (Kris, 7 November) made each harness skill folder a guild and put both new skills under the acquire guild, leaving its name open. With D12 and the graph skill added, the guild runs from sorting through capture and curation to dispatch. Renaming the folder moves skill paths, the catalogue and links. The blind reviewer disagreed and preferred: `knowledge-tending`, because it is exact, matches the Pillar folder, other guild folders are already hyphenated, and a bare `knowledge` could be confused with the knowledge-base skills in `repo-structure`.

**Query:** What should this guild be called?

**Options:**

a) (recommended, confidence medium - it names what the guild serves, not just its first step) `knowledge`.

b) `knowledge-tending`, the name of the Pillar folder that holds all three cards; it is exact but long.

c) Keep `acquire`; it costs nothing, but sorting and curation are not acquisition.

### D12-CANON - Where D12's rules live once the skill exists

**Context:** The D12 card, Kris's fundamental tenet of 5 November, holds the twelve Ds, the names and the ten rules, and currently says "change them there". SKILLS-OVER-GRAPH (6 November) says method moves into skills and the graph keeps "things that are".

**Query:** Which holds the authoritative D12 rules, the card or the skill?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same course; it keeps the tenet as a concept and puts the method where it gets used) The card keeps the concept (the twelve Ds, the names and why) and links to the skill. The skill's standard holds the ten rules and how they run.

b) The card stays the authority for everything, and the skill cites it.

### D12-KIND - One D12 skill with working modes, or two skills

**Context:** House governance skills share four modes: audit, conform, educate and refresh. D12 also needs working modes: sort arrivals, run the sweeps, and learn from corrections. Each writes only with an approval it cites.

**Query:** Should one skill hold both the standard and the working modes?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same course; one place for Kris to look, and the working modes are small) One `ki-dodecakrisis` skill: the four standard modes plus SORT, SWEEP and LEARN.

b) Two skills: `ki-dodecakrisis` for the standard and a separate process skill for running it.

### D12-RUNNER - What runs the sweeps and the learning loop

**Context:** Sweeps are simple, repeated label and age searches. The learning loop reads mail headers through the change history. Executable importers live outside the harness, in the Inbox's `ki-muninn`, which already holds the mailbox settings. Kris said on 6 November that the sweeps are D12's own runs.

**Query:** What should execute D12's sweeps and learning?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same course; repeatable, cheap and uses existing mailbox settings) Code in `ki-muninn` (`ki-muninn d12 sweep`, `ki-muninn d12 learn`), governed by the skill. Whether hnr-principal runs it for its own mailbox is left for later: that mailbox is Microsoft 365, so `ki-muninn` would need a second mail backend.

b) A scheduled agent pass that uses the skill and the mail servers directly, with code later.

### PROTECTED-HOME - Where the protected-label list lives

**Context:** Kris, about 23:40 GMT on 6 November: some labels "must never be changed or touched", as "a capability of the routing and of the mail MCP servers". A list held by the caller can be forgotten or left out; a list held in each server's own configuration (managed by chezmoi) protects every caller, D12 or not.

**Query:** Where should the protected list be declared?

**Options:**

a) (recommended, confidence high - only a server-side list protects against every caller) In each mail server's per-account configuration. The server refuses any change, and D12 reads the list from the server.

b) In the D12 settings of the declaring repository, passed to the server on each call.

### PROTECTED-READ - Does marking read count as touching

**Context:** Z-ARCHIVE (Kris, 6 November): nothing "adds, removes, renames or deletes any label under it, or changes the messages it holds". Opening a protected message in the Gmail web app marks it read regardless; this only concerns tool calls.

**Query:** Should the servers also refuse to mark protected messages read or unread?

**Options:**

a) (recommended, confidence high - it matches "never changed or touched") Yes, refuse every change, read state included.

b) Allow read-state changes and refuse everything else.

### ACQUIRE-SPLIT - Move curation and dispatch out of `ki-acquire`

**Context:** The `ki-acquire` standard already contains "Staging and curation" and "Dispatch and authority" sections, and its description mentions curation and dispatch. The new graph skill covers the same ground. Two copies would drift apart.

**Query:** Should `ki-acquire` be narrowed to capture, with its curation and dispatch text moved to the new skill?

**Options:**

a) (recommended, confidence high - one owner per rule is the house contract) Yes: `ki-acquire` keeps capture and hands off to the graph skill at curation.

b) No: `ki-acquire` keeps them, and the graph skill covers only the card format and tending.

### DOCKET-HOME - Where D12's Docket items live

**Context:** In D12, the Docket keeps actions that outlive the item they came from. The Gmail design has a `D12/12 Docket` label. The Inbox keeps Kris's life actions as cards in `knowledge/actions/`, which the KIV viewer reads. How the two relate is still open in the sorting-engine draft, and the standard can only describe a settled final state. The blind reviewer disagreed and preferred: leaving the Docket out of the first version, because the sorting-engine draft has not settled it and a standard can only describe a settled state; the action card can follow once the draft decides.

**Query:** What is a Docket item?

**Options:**

a) (recommended, confidence low - it matches the existing viewer, but Kris has not discussed it) An action card in the declaring repository's actions area that points at the item. The `D12/12 Docket` label just marks the item as having one.

b) Only the mailbox label; no card.

c) Leave Docket out of the first version of the skill.

## Parked

- ACQUIRE-ROUTE: acquisition items (GRANOLA-CAPTURED-SKIP MSG-6620cbb7, GRANOLA-COUNT, CHECKSUMS-SETTLED, ACQ-HOLD-WORDING, ACQ-SCAFFOLD-NOTE, ACQUISITION-PROCESS-APPROVE) to ki.reg.main via State of play; recommended a) high. Kris, 7 November: "We can come back to that later." None.
