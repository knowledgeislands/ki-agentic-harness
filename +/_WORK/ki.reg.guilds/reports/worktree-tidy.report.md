# [KI > Regular > Ways of working](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/+/_WORK/ki.reg.guilds/work.md) › worktree-tidy

**🤖 → 👤 Handoff to supervisor · Run report at 17:01 GMT · last mark none yet**

---

## Done

- Took stock on sol: 71 primary checkouts, found through the registry and a scan of `~/kis` and `~/workspaces/git`. Only three repositories had linked worktrees, 18 in all. None was missing its directory and no repository holds a stash.
- No live run owns any of the 18. The only live work is `legal-tidy` in legal-principal, the queued `drain` for tower, and this thread's own runs. Orca lists the harness's six worktrees but only as discovered folders: none has a terminal, an agent or any activity.
- Removed five worktrees with `git worktree remove` and no `--force`, deleted their five branches with `git branch -d`, and pruned all three repositories. Each worktree was clean, had nothing missing from a remote or local `main`, had no process inside it, and held only regenerable ignored files: installed skills, lint caches and test coverage.
  - ki-agentic-harness, 3 removed: `roadmap-assignee` (the finished ki.sop.main run), `finished-tidy` and `quiet-listen`. The last two were sibling folders beside the primary checkout.
  - tools-ki, 2 removed: `wow-rel-0141` and `roadmap-assignee`.
  - tools-rig, 0 removed.
- I did not run `ki agent close` for the owning runs. It doesn't remove worktrees; it only refuses while they exist. Its close also moves run reports into the ki-principal work packages of ki.sop.main and ki.prj.ways-of-working, and those packages belong to other threads.
- Thirteen worktrees stay: harness 3, tools-ki 6, tools-rig 4. Each is listed in the table below and covered by a query.
- Nothing was committed, pushed, stashed, reset or forced. No primary checkout was touched.

## In Progress

Nothing is running.

Outstanding - no action requested now:

- Two finished agents of ki.sop.main named `roadmap-assignee` (one per repository) now hold no worktree. That thread can retire them with `ki agent close ki-sop-main --agent roadmap-assignee --repo /Users/krisbrown/kis/knowledge-islands/ki-principal` when it next commits its package.
- `ki agent status --worktrees` also lists branches with no worktree, which this brief did not cover:
  - `ways-of-working-learn` in apps-knowledgeislands.info, fully merged.
  - `legal-review-2026-11-02` and `legal-site-skeleton` in apps-ninja.midnight.legal.
  - `z-retirement/observatory-20261030` in apps-observatory.local.
  - `run/wow-mod011-approved-candidate-mpg8sgz6` in ki-principal, 1,511 commits behind.
- These queries overlap the two queries already packed in ki.sop.main, BRANCH-SWEEP and UNMERGED-STRAYS, in [packed-queries.md](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.sop.main/_emerging/packed-queries.md). Answering the queries below settles the worktree part of both.

## Queries

### RIG-SPENT - Discard the four tools-rig worktrees from the 048 and 056 runs

**Context:** Four tools-rig worktrees are left from the night runs of 20 and 21 October on the records KI-TOOL-RIG-CORE-048 and KI-TOOL-RIG-CORE-056: `run/wow-accept-rig-056`, `run/wow-rework-rig-056`, `run/wow-night-rig-048-f` and `run/wow-night-rig-056-e`. They hold three unpublished roadmap commits and two uncommitted edits, all to those two record files. I checked on `main` that both records were since accepted ("accept signed-release install kind", "accept menu-bar persistence finding") and then pruned in `eccef96`, "prune 3 done work records". So everything left in these worktrees edits records that no longer exist. Removing them needs `git worktree remove --force` for the two with uncommitted edits and `git branch -D`, a delete that skips the merged check, for the branches with unpublished commits. This brief forbids both without your word.

**Query:** May a bounded run force-remove these four worktrees and force-delete their four branches?

**Options:**

a) (recommended, confidence high - I checked on `main` directly that both records were accepted and pruned, so nothing here can still land) Yes: force-remove all four worktrees and force-delete their branches.

b) Keep them for now and have a read-only run show you each leftover edit first.

### LANDED-COPIES - Remove the two tools-ki branches whose work is already on main

**Context:** In tools-ki, `launcher-paths` (1 commit, 3 November) and `run-close` (3 commits, 4 November) are clean worktrees from finished ki.sop.main runs. `git cherry` shows every one of their commits is already on `main` as an identical change under a different commit identity: "follow moved checkouts and renamed work", "close finished agents while the rest of the run goes on", and its tests. Because those exact commits exist on no remote, this brief kept them, and `git branch -d` would refuse. Removing the clean worktrees needs no force, but their branches need `git branch -D`.

**Query:** May a bounded run remove these two worktrees and force-delete the `launcher-paths` and `run-close` branches?

**Options:**

a) (recommended, confidence high - `git cherry` shows each change byte-identical on `main`, checked directly) Yes: remove both worktrees and force-delete both branches.

b) Keep them.

### SUPERSEDED-FIXES - Discard the four tools-ki worktrees from the 21 and 22 October recovery fixes

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

**Context:** Two clean harness worktrees hold unreviewed skill drafts that are on no remote and not on `main`. `ki-e2e` (2 commits, 2 November) drafts a browser-testing skill for Capital websites. `orca-adapter` (2 commits, 1 November) drafts `ki-delegation-orca`. Both already wait on your open queries in [ki.prj.ways-of-working discussions](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.ways-of-working/discussions.md): E2E-WAY, on whether to fast-forward `ki-e2e` into `main`, and ORCA-SKILL-KIND with the other ORCA-LAUNCHER queries.

**Query:** Should these two worktrees stay until those queries are answered?

**Options:**

a) (recommended, confidence high - deleting them would lose the only copy of reviewed draft work) Yes: keep both. Whoever lands or drops each draft retires its worktree.

b) Drop both drafts now, which needs `git branch -D`.

### OLD-DIAGRAMS - Remove the clean rename-paperclip worktree and the diagram files it holds

**Context:** The harness worktree `rename-paperclip`, from a finished ki.prj.ways-of-working run on 1 November, is clean and all its commits are on `main`. It sits in the run's temporary folder. It also holds gitignored diagram working files that exist nowhere else: the skill-area pages "agentic-systems" and "fundamentals", and an older `skill-map`. The current skill areas are acquire, coordination and records-and-code, so these look like renders of retired area names. A plain `git worktree remove` would delete them without asking, so I kept the worktree.

**Query:** May a bounded run remove this worktree, its branch and those old diagram working files?

**Options:**

a) (recommended, confidence medium - they are derived working output from committed sources, but I did not prove they can be regenerated) Yes: remove it and delete the `rename-paperclip` branch with `git branch -d`.

b) Copy the diagram folder somewhere first, then remove the worktree.

### Kept worktrees

| Repository | Branch | Last commit | Tree | Not on any remote | Owner | Query |
|---|---|---|---|---|---|---|
| ki-agentic-harness | `rename-paperclip` | 2026-11-01 | clean, unique ignored diagrams | 0 | finished run | OLD-DIAGRAMS |
| ki-agentic-harness | `ki-e2e` | 2026-11-02 | clean | 2 | finished run | DRAFT-SKILLS |
| ki-agentic-harness | `orca-adapter` | 2026-11-01 | clean | 2 | finished run | DRAFT-SKILLS |
| tools-ki | `launcher-paths` | 2026-11-03 | clean | 1, on `main` as a copy | finished run | LANDED-COPIES |
| tools-ki | `run-close` | 2026-11-04 | clean | 3, on `main` as copies | finished run | LANDED-COPIES |
| tools-ki | `wow-close-done-2` | 2026-10-21 | 1 edit | 2 | finished run | SUPERSEDED-FIXES |
| tools-ki | `wow-day-impl-fix-5` | 2026-10-22 | clean | 3 | finished run | SUPERSEDED-FIXES |
| tools-ki | no branch (`legacy`) | 2026-10-21 | 3 untracked | 0 | finished run | SUPERSEDED-FIXES |
| tools-ki | no branch (`reproductions`) | 2026-10-21 | 1 edit, 1 untracked | 0 | finished run | SUPERSEDED-FIXES |
| tools-rig | `run/wow-accept-rig-056` | 2026-10-20 | clean | 1 | finished run | RIG-SPENT |
| tools-rig | `run/wow-rework-rig-056` | 2026-10-20 | clean | 2 | finished run | RIG-SPENT |
| tools-rig | `run/wow-night-rig-048-f` | 2026-10-21 | 1 edit | 0 | finished run | RIG-SPENT |
| tools-rig | `run/wow-night-rig-056-e` | 2026-10-21 | 1 edit | 0 | finished run | RIG-SPENT |

"Not on any remote" counts commits missing from every remote and from local `main`, judged from the remote state as last fetched, since this run made no fetch. "Finished run" means the `ki agent` run that made the worktree has finished; no live run or open Orca workspace holds any of them.

### 🤖 → 👤 Handoff to supervisor · since 17:01 GMT

👤 5 with you

- [with you] RIG-SPENT · owner · since 17:01
- [with you] LANDED-COPIES · owner · since 17:01
- [with you] SUPERSEDED-FIXES · owner · since 17:01
- [with you] DRAFT-SKILLS · owner · since 17:01
- [with you] OLD-DIAGRAMS · owner · since 17:01

🧵 ki.reg.ways-of-working
