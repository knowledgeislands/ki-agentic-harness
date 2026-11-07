# ki.reg.guilds discussions

## Open

### LEGAL-BRANCH - Paperclip declaration in the midnight.legal site

**Context:** `personal/apps-ninja.midnight.legal` is checked out on the branch `legal-site-skeleton`, not `main`, so I skipped it. Its `.ki.toml` still declares a retired Paperclip skill. Once the stub skills are gone from installed harnesses, that declaration will point at a skill that no longer exists, and the repository's audits will complain.

**Query:** How should the leftover declaration in this repository be removed?

**Options:**

a) (recommended, confidence medium - it keeps the branch work untouched and needs no checkout change) A short follow-up run removes the declaration on `main` through a commit made without switching the checkout, or when the branch next merges, and leaves the branch to pick it up then.

b) The session that owns `legal-site-skeleton` removes the declaration on its branch as part of its own work.

### RADAR-HISTORY - Paperclip rows in the radar's change log

**Context:** I removed Paperclip's subject, evidence and source entry from the agentic radar. Its change log, the review history table in `skills/governance/ki-agentic-radar/references/sources.md`, still names Paperclip in four dated rows. I added one row recording today's purge. Rewriting those rows would change the history of past reviews.

**Query:** Should the dated change-log rows that mention Paperclip stay as history?

**Options:**

a) (recommended, confidence medium - they record what past reviews found, like the work-folder notes the brief keeps) Keep them as history.

b) Reword or remove them so that Paperclip disappears from the harness entirely.

### BROADCAST-FORM - How a message sent to many packages should be written in Outbound

**Context:** The checker requires every Outbound line to name one recipient package id after `to` (`- <date> · <id> · to <package id> · …`). It has no form for a broadcast to many packages. Four guilds Outbound lines were broadcasts ("to 15 live packages", "to 41 live packages on sol"). To clear the failure without changing content, I wrote them as `to live-packages · 15 live packages · …`. `live-packages` is a placeholder that matches the id pattern but is not a real package.

**Query:** Should the checker and the work-package standard get a proper broadcast recipient form, or should broadcasts be logged as one Outbound line per receiving package?

**Options:**

a) (recommended, confidence medium - reviewed: the blind reviewer chose this at high, because the send, ACK and prune rules and the banner all assume one receiver per line; the run that raised it preferred a count form) Log each broadcast as one Outbound line per receiving package, so each ACK clears its own line. Add one sentence to the work package standard's Prune rule: an ACK clears the line matching both the id and the receiver. Drop the `live-packages` placeholder.

b) Add a broadcast form to the standard and checker, `to <n> live packages`, with new ACK-counting rules in the standard, checker and banner, and replace the placeholder lines with it.

c) Keep the `live-packages` placeholder convention.

### TASK-LINKS-FIELD - Whether to retire the `task_links` roadmap field

**Context:** `task_links` is an optional roadmap-record field that links a record to tasks in another system. Paperclip was its main user. `tools-ki` already shows a `linear` provider beside `paperclip`, and Linear is a supported work adapter, so the field has a plausible use beyond Paperclip. The blind reviewer disagreed with retiring it and preferred keeping it as a general field, with its own triage record to test whether Linear or GitHub Issues linking will use it.

**Query:** Should the `task_links` field itself be retired?

**Options:**

a) (recommended, confidence medium - reviewed: the blind reviewer chose this; the field is provider-neutral and Linear already appears in the code) Keep it as a general field, and capture a triage record in the harness to test whether Linear or GitHub Issues linking will use it.

b) Retire it from the roadmap standard and the `tools-ki` validator now.

### ONE-LAUNCHER - should one launcher per package per host become a rule

from ki.prj.ways-of-working (run/orca-adapter, ORCA-LAUNCHER; blind review 1 November, differs)

**Context:** the proposal has each package record one launcher per host in its decisions log, so a package never mixes Orca and `ki agent` on one Mac; it rests on design reasoning, not a trial; it would clash with OUTLIVE unless that exception is written in. The review prefers b) with high confidence: each opt-in can say what it covers, and one launcher per host would not stop the same work starting twice on another Mac or in a later session (now ONE-LAUNCHER-UNIT).

**Query:** should one launcher per package per host become a rule?

**Options:**

a) (recommended, confidence medium - review disagrees; keeps runs findable and close-out simple, but untested) adopt it as an adapter rule with OUTLIVE's runs named as the exception

b) leave it open and let each opt-in decision say what it covers (the review's pick)

### RUN-RECOVERY - should this recovery procedure become the adapter's rule

from ki.prj.ways-of-working (run/orca-adapter, ORCA-LAUNCHER; blind review 1 November, differs)

**Context:** an Orca Run belongs to the chat session that made it. Proposal: a new session makes a new Run, finds the old one by its objective (starting with the work id), settles or names any worker still owing a decision, and logs the old Run as retired; Orca's takeover works only from a live coordinator terminal. The review prefers b) at medium: one workaround is not a general procedure, and a new Run can start work twice, strand a worker's question or lose the right to settle old workers.

**Query:** should this recovery procedure become the adapter's rule?

**Options:**

a) (recommended, confidence high - review disagrees; it is what was done on 1 November and needs no unproved feature) adopt it, logging the old Run retired only once every worker under it is settled or named unreachable with what it owes

b) wait for the RUN-HANDOVER test first (the review's pick)

### RUN-HANDOVER - is the test worth running

from ki.prj.ways-of-working (run/orca-adapter, ORCA-LAUNCHER; blind review 1 November, differs)

**Context:** whether `run-use` can move a Run between chat sessions is untested beyond one failure; RUN-RECOVERY works round it with a new Run. The review prefers b) at high: the answer decides whether recovery must always replace Runs and whether old workers stay reachable, so a small read-only test is worth running, keeping reconnecting, handing over control and listing workers apart, testing the old session leaving apart from a live takeover, never two coordinators at once. One yes-or-no choice, not split.

**Query:** is the test worth running?

**Options:**

a) (recommended, confidence medium - review disagrees; RUN-RECOVERY already works, so this only adds convenience) leave it untested unless recovery proves costly

b) test it in the next trial, read-only, along the review's lines (the review's pick)

### TRIAL-PUBLISH - how should Orca workers publish their notes

from ki.prj.orca-evaluation (SCOPE-SPLIT method question)

**Context:** how a worker commits in a repository whose pre-commit hook runs lint-staged, which made and dropped a backup stash; in plan069 a no-stash rule collided with it, `worker_done` read `failed` though the work succeeded, and Kris granted a bounded exception. Kris chose HOOK-STASH a), lint-staged with `--no-stash`, on 1 November, which may settle it. The blind reviewer found that with `--no-stash` no stash is made, so the clash is gone and the stash clause is no longer needed.

**Query:** how should Orca workers publish their notes?

**Options:**

a) (recommended, confidence medium - reviewed: the blind reviewer proposed this, and HOOK-STASH a) removed the reason for the exception) the worker commits its own note by explicit path inside a write window granted by ask, under the ordinary rules, and never runs `git stash`; the coordinator pushes at receive

c) each brief carries the bounded exception as first written, including that the hook may make and drop lint-staged's backup stash

b) no worker commits; the worker writes note and report and the coordinator commits both at receive. Likely closable as overtaken by HOOK-STASH a); original text at ki-principal `04591e2b`, `+/_WORK/ki.prj.orca-evaluation/queries.md`

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
