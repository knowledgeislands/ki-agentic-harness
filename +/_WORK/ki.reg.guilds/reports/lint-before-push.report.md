# [KI > Guilds](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/+/_WORK/ki.reg.guilds/work.md) › lint-before-push

**🤖 → 👤 Handoff to supervisor · Run report at 20:08 GMT · last mark none**

---

## Done

- LINT-BEFORE-PUSH and CHECK-CONSUMERS are in the harness commit rules: commit `056996c0` (`docs(skills): land checks before committing and retiring shared things`), fast-forwarded into local `main` and published.
- **The commit rule** now has one home, a new **Checks before committing** subsection in the `ki-git` standard ([standards-git.md](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/skills/governance/ki-git/references/standards-git.md#checks-before-committing)). It says:
  - It covers every session and run, including a coordinator's own commits and every line written into another package's `messages.md`.
  - Run the repository's own checks on each file before committing it. For Markdown that means `rumdl fmt` then `rumdl check`; other files take whatever the repository's hook names.
  - A refused commit is a failure to report, never something to retry around or skip with `--no-verify`.
  - Before pushing, `git status` must show every committed path clean.
  - It quotes Kris's words of 6 November.
- **Pointers to the commit rule, with no restatement:**
  - `ki-coordination`: the "Committing the work folder" section, the sender's one-line message write in "Messages between work", and the generated coordinator output style, which was regenerated with `ki dev skill generate ki-coordination --write`.
  - `ki-delegation`: the run "Commits" line.
- **The consumer rule** is a new **Retiring shared things** subsection under Authority tiers in the `ki-delegation` background-run standard ([standards-background-runs.md](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/skills/governance/ki-delegation/references/standards-background-runs.md#retiring-shared-things)). It sits beside Provider tokens, since `ki-git` governs only Git state. It says:
  - Before deleting or retiring anything shared, such as a token, list every consumer in every place that can name it, not only the one being changed.
  - It holds in every session and grants no authority to delete.
  - It cites the 3 November markhowarth.com build-token incident and Kris's LIFT a under LEARN-LOOP.
- Changed files:
  - [skills/governance/ki-git/references/standards-git.md](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/skills/governance/ki-git/references/standards-git.md)
  - [skills/governance/ki-git/references/sources.md](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/skills/governance/ki-git/references/sources.md)
  - [skills/governance/ki-delegation/references/standards-background-runs.md](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/skills/governance/ki-delegation/references/standards-background-runs.md)
  - [skills/governance/ki-delegation/references/sources.md](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/skills/governance/ki-delegation/references/sources.md)
  - [skills/change-management/ki-coordination/references/standards-coordination.md](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/skills/change-management/ki-coordination/references/standards-coordination.md)
  - [skills/change-management/ki-coordination/references/sources.md](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/skills/change-management/ki-coordination/references/sources.md)
  - [output-styles/ki-coordinator.md](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/output-styles/ki-coordinator.md)
- Each skill's sources review records the change as an in-house review dated 6 November 2026.
- Checks:
  - `rumdl fmt` then `rumdl check` on all seven files: clean.
  - Pre-commit hook: passed.
  - `bun run test`: 1556 pass, 0 fail, before and after rebasing onto `main`.
  - `bunx tsc --noEmit`: clean.
  - `ki dev skill generate ki-coordination`: all 8 surfaces in sync.
  - Focused audits, run in an isolated home: `ki-git` and `ki-delegation` pass. `ki-coordination` has one failure in a file this change doesn't touch (see below).
  - `git status` clean on the committed paths after the push.

## In Progress

Nothing is running.

The worktree at `/Users/krisbrown/.local/state/ki/agents/wow-open/lint-before-push/worktrees/ki-agentic-harness` and its merged branch `lint-before-push` are still in place. Removing them with `git worktree remove` can raise a permission prompt that nobody is there to answer in a background run, so that removal is left for `ki agent close` or a housekeeping run. The temporary folder holds only disposable logs and the isolated audit home.

**Outstanding - no action requested now**

- Fleet findings, not part of this change. All three were already on `main` before this commit and are in files it doesn't touch:
  - `ki-coordination` COORD-7: [rename-guilds.report.md](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/+/_WORK/ki.reg.guilds/reports/rename-guilds.report.md) names eight record identifiers without links. The guilds coordinator can fix this, or clear it when that report is pruned.
  - The full audit's `ki-delegation-paperclip` failure.
  - The full audit's CAP-2 capability-catalogue failure in `skills/README.md`.
- Two untracked reports from other sessions sit in the primary checkout's `+/_WORK/ki.reg.guilds/reports/`: `dotfiles-notice.report.md` and `dotfiles-resolve.report.md`. They were left untouched.
- `git pull --ff-only` in the primary checkout fails with "Cannot rebase onto multiple branches", which points to a local pull setting. Fetch followed by `git merge --ff-only origin/main` worked in its place.

## Queries

No outstanding queries.

### 🤖 → 👤 Handoff to supervisor · since 20:08 GMT

🤖 0 running · 👤 0 with you

- [done] LINT-BEFORE-PUSH and CHECK-CONSUMERS landed · run/lint-before-push · since 20:08
- [stranded] lint-before-push worktree, merged, awaiting close · run/lint-before-push · since 20:08

🧵 ki.reg.guilds
