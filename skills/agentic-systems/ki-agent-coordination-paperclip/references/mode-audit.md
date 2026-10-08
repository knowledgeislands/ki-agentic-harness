# Mode AUDIT — assess a KI–Paperclip coordination arrangement

_On-demand procedure for the coordination AUDIT mode. The position, shared model, and mode set live in [`SKILL.md`](../SKILL.md) and are already loaded; the normative claims live in the [coordination standard](standards-agent-coordination-paperclip.md). This file is the procedure only._

1. **Confirm the declaration.** This skill is `ki-applicability: declaration-only`: no repository shape implies it. A repository opts in with its owning company code in `.ki.toml`, placed in the governance section:

   ```toml
   [skills.ki-agent-coordination-paperclip]
   organisation_code = "KIS"
   ```

   Without it the host exits 2 with `--skill must name one declared resolved skill`. That message means the repository has not declared the capability; it is not an environment fault. Confirm with `grep -n 'ki-agent-coordination-paperclip' <repo>/.ki.toml` before treating the arrangement as ungoverned.

2. **Pin the host environment when auditing from inside a Paperclip run.** A Paperclip run scopes `XDG_CONFIG_HOME`, `XDG_DATA_HOME`, and `XDG_STATE_HOME` to the run directory, where no KI state exists. The user KI environment is reached through `PAPERCLIP_GITHUB_HOST_HOME`, which every Paperclip run injects, so this hardcodes no path:

   ```bash
   env -u XDG_CONFIG_HOME -u XDG_DATA_HOME -u XDG_STATE_HOME \
       HOME="$PAPERCLIP_GITHUB_HOST_HOME" \
       ki repo audit --skill ki-agent-coordination-paperclip --repo <repo>
   ```

   Unpinned, the host reports `declared skill <name> is provided by no declared harness` because no harness is installed under the run-scoped home. Unset all three: the repository registry lives under `XDG_STATE_HOME`, and leaving it pinned to the run directory produces a spurious `REPO-REG-1` failure on every repository. Outside a Paperclip run, invoke `ki` directly.

3. **Read the mechanical result as repository-side evidence, not conformance evidence.** `ORG-1` checks the declaration, `COORD-3` and `COORD-15` read only the selected checkout's local evidence, and `COORD-9` lists the repository's own worktree registry for information; every other COORD criterion is judgment. No mechanical operation reads the coordination plane, fetches, or writes.

   - _`COORD-3` linkage._ Under a local work adapter (`docs/roadmap/` for `roadmap`, `Streams/Roadmap/` for `kb-streams`), every record whose Paperclip `task_links` carry relation `implementation` with a non-null `baseline_ref` must have a resolving triple: the revision is a commit in the local object store, an ancestor of `HEAD`, and contains the record. Each delivery task identity (`authority`, `scope`, `id`) may be claimed as governing by at most one record. `evaluation` and `related` links are counted but never require a governing claim. A finding names the record and the failed part; correct the record and reconcile the task side by judgment. A `PASS` states that the plane side was not evaluated; it cannot see whether the task exists, names this item, is claimed or is accepted. A remote work adapter, or no record carrying a Paperclip link, reports `NOT_APPLICABLE`.
   - _`COORD-15` selected worktree._ When the selected checkout is a linked worktree, it must lie outside the primary working tree and the Git common directory, and contain the tip of its destination branch, read from the locally recorded `origin` default branch or else `main`. A stale finding names the worktree, its head, the destination tip and the behind count; re-admit the checkout at the current tip, record that commit as the new baseline on the governing work record and coordinating task, and recompute the change before it lands. The audit never moves, rebases, prunes or fetches for a worktree, and never inspects a sibling worktree. The primary working tree reports `NOT_APPLICABLE`.
   - _`COORD-9` held workspaces._ An `INFO`-only listing of the repository's linked worktrees whose merge gate cannot pass on local evidence: a detached `HEAD`, or a branch head that is not an ancestor of the primary worktree's branch. Each entry names the path, branch or detached state, head, ahead and behind counts, head-commit age and whether the working tree is dirty. It never changes the verdict, because a sibling worktree must not fail the selected checkout. For each entry, confirm the plane-side gates in Paperclip's close-readiness view, then capture a Triage item through `ki-next` in the owning repository to land, discard or record it as duplicate. The listing is never permission to remove a worktree or delete a branch.

   A clean run proves that the declaration resolves and that the repository side of these checks holds. Never report it as evidence that the arrangement conforms.

4. **Apply the judgment items** in [the generated rubric](rubric.md) against the arrangement's own evidence: the Paperclip company, agent roles, tasks, execution workspaces, and the KI repositories and admitted revisions those tasks name. Mechanical runs count these as unevaluated rather than manufacturing findings.

5. **Report repository facts separately from remote Paperclip facts.** Name the repository and admitted revision for each repository claim, and the task or agent identifier for each Paperclip claim. An unavailable remote view is unknown, not a pass — record it as unavailable and say what would resolve it.
