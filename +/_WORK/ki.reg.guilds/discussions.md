# ki.reg.guilds discussions

## Open

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
