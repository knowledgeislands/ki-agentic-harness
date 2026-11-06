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

## Parked

None.
