# [KI Regular Ways working](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/+/_WORK/ki.reg.guilds/work.md) › blind-review

**🤖 → 👤 Handoff to supervisor · Run report at 17:06 GMT · last mark none recorded**

---

## Done

- Reviewed RIG-SPENT, LANDED-COPIES, SUPERSEDED-FIXES and OLD-DIAGRAMS independently; skipped DRAFT-SKILLS as instructed.
- Read-only checks completed: worktree inventory, tracked and untracked changes, ignored-file inventory, ancestry, patch equivalence, selected source comparisons and diagram source/HTML hashes.
- No repository changes or commits; no removal, branch deletion, network request, test execution or approval of disposal.
- Did not read any work package’s `discussions.md`, `decisions.md` or any run report; reporting identity came from the local run binding and the bound package’s `work.md` and `state.md`.
- Evidence references: tools-rig main `224ca3159aed4effe6a16d391301c73e1d8eb66f`; tools-ki main `cc9bc575275f5086f51ca96e732c4e0b7bbc3697`; harness main rechecked at `0f064b37d83517914a15a7f4c7be4b9db2f0e448` after a concurrent work-package-only advance.

## In Progress

Nothing is running in this review. All worktrees and branches remain in place for the supervisor’s disposition.

Outstanding - no action requested now: remote publication and active-worker ownership were not verified. Local remote-tracking references are cached evidence, not a fresh remote check. The recommended disposal run must recheck the exact tips and file inventory before acting.

## Findings

### RIG-SPENT - Discard the obsolete record worktrees

**Goal:** Independently assess Kris’s proposed disposal of the four Rig worktrees, requested on 6 November 2026.

**Scope:** The four named branches, their unpublished differences and uncommitted changes, and the two records’ acceptance and pruning history on local main; no discussions, decisions or run reports.

**As of:** 6 November 2026, 17:06 GMT, on sol.

**Chosen option:** Approve the force-removal and branch deletion described in the query, the affirmative alternative to b). The brief supplied no text for option a).

**Confidence:** High.

**Reason:** The remnants concern obsolete planning and review states of two records whose accepted, later versions survive in main’s history.

**Verified facts:**

- `run/wow-accept-rig-056` is clean at `4efcee6`; `run/wow-rework-rig-056` is clean at `3160dcc`. Their unique changes touch only the menu-bar record. There are two distinct unpublished commits, appearing three times when counted separately across the two branch ranges; the brief’s “three” is not three distinct commits.
- `run/wow-night-rig-048-f` has only an uncommitted edit to [KI-TOOL-RIG-CORE-048 (pruned)](https://github.com/knowledgeislands/tools-rig/blob/47845d714b652e118216056f5b3a740778988f56/docs/roadmap/KI-TOOL-RIG-CORE-048-signed-release-install-kind.md): 48 added and four removed lines, principally a planning draft. It has no commits absent from main.
- `run/wow-night-rig-056-e` has only an uncommitted edit to [KI-TOOL-RIG-CORE-056 (pruned)](https://github.com/knowledgeislands/tools-rig/blob/63d1ac92d4a19fc0b8b7bd980b0dc831858e5efb/docs/roadmap/KI-TOOL-RIG-CORE-056-menu-bar-order-persistence.md): 68 added and 38 removed lines, principally evidence qualifications and review wording. It has no commits absent from main.
- Main accepted the signed-release record in `47845d7` and the menu-bar finding in `63d1ac9`; both pre-pruning records explicitly have `status: done` and acceptance text. `eccef96` subsequently deleted both paths. Their content is recoverable in Git.
- The two unpublished review commits and both uncommitted edits were inspected. The accepted record retains the menu-bar review/rework history and later evidence reconciliation. The leftover drafts are not claimed to be byte-identical copies of the accepted records.
- Ignored files in these four trees are limited to Markdown-linter caches; no additional authored files appeared in the inventory.

**Not verified:** No fresh remote check or live-worker check; acceptance authority was verified as recorded in Git, without reopening the prohibited decision logs.

**Would change my answer:** A worker still using a tree, an additional file outside the reviewed inventory, or a specific need to retain one of these intermediate drafts.

**Queries raised:** No new clarification query; the existing disposal decision remains with Kris.

### LANDED-COPIES - Remove the redundant tools-ki branches

**Goal:** Independently assess removal of `launcher-paths` and `run-close`, requested on 6 November 2026.

**Scope:** Both worktrees, branch-only commits, patch equivalence with local main and cached remote references; no run reports.

**As of:** 6 November 2026, 17:06 GMT, on sol.

**Chosen option:** Approve clean worktree removal and force-deletion of the two branches described in the query, the affirmative alternative to b). Option a)’s text was absent.

**Confidence:** High.

**Reason:** Every branch-only change is already represented on main, and neither tree has an uncommitted authored change.

**Verified facts:**

- Both worktrees have empty ordinary Git status. `launcher-paths` contains `8384a731` from 3 November; `run-close` contains that same commit plus `14bbbf8e` and `14adaa06` from 4 November. Thus the branch ranges have four entries but three distinct commits.
- `git cherry` marks every entry as already represented by an equivalent patch on main. The corresponding main commits are `03593db4`, `1237e1d8` and `8524f11a`.
- Neither branch is an ancestor of main, explaining why an ordinary merged-branch deletion check would fail despite the equivalent changes.
- No locally cached remote-tracking reference contains these exact branch-only commit identities. This does not prove their absence from every live remote.
- Ignored-file inventory exposed generated dependency/cache material rather than an additional authored delivery.

**Not verified:** The runs’ completion claims and current process ownership were not independently checked; no run report was opened and no remote was contacted.

**Would change my answer:** A changed tip, loss of patch equivalence, an active worker or additional uncommitted authored material at the disposal-time recheck.

**Queries raised:** No new clarification query; the existing disposal decision remains with Kris.

### SUPERSEDED-FIXES - Keep until the remaining material has a disposition

**Goal:** Independently assess disposal of the four recovery-fix worktrees, requested on 6 November 2026.

**Scope:** Both named branch ranges, the two detached worktrees’ test changes, and the single uncommitted record edit; static comparison only.

**As of:** 6 November 2026, 17:06 GMT, on sol.

**Chosen option:** b) Complete the read-only comparison and explicit keep-or-drop list before disposal; do not treat “Then discard” as approval to lose anything the comparison says to keep.

**Confidence:** High.

**Reason:** Much is superseded, but the group includes an unpreserved record-link correction and test differences needing an explicit disposition.

**Verified facts and partial keep-or-drop list:**

- The branch ranges contain two and three entries respectively, but only three distinct commits. `6c498f3a` is patch-equivalent to main. Contrary to the brief’s suggestion of two unmatched commits, `eb0e8b2e` and main’s `3b19b135` also have the same stable patch identifier: this commit’s change is already landed.
- Compared the complete patch text of `6c4d2a1a` with main’s `fc0aeb57`. The significant changed line in the patch comparison preserves main’s existing `!seen.ended` guard when adding `homeReports`, preventing repeat report delivery. Other differences are base hashes, context and line positions. This supports dropping the older implementation, rather than replaying it merely because its patch identifier differs.
- The detached `legacy` tree’s compatibility test and snapshot are present on main. The test differs through formatting and main’s added canonical-path handling. All eight snapshot differences replace `/private<fixture>/project` with `<fixture>/project`. These are superseded test drafts, not absent test coverage.
- The detached `reproductions` tree adds 177 lines to `agent-control.test.ts`. Nine of ten added test titles are present verbatim on main; the remaining terminal-event test has a later history-restoration version on main. Titles alone do not prove every assertion equivalent, and that full assertion-level disposition remains outstanding.
- Both detached trees additionally contain a `node_modules` symlink to the former tools-ki checkout path; neither has branch-only commits.
- `wow-close-done-2` modifies one link in [KI-TOOL-KI-CLI-145](/Users/krisbrown/kis/knowledge-islands/tools-ki/docs/ideas/KI-TOOL-KI-CLI-145-thread-session-bindings-role.md), changing it to an immutable link for a pruned harness record. The record is now under `docs/ideas` on main, but that specific correction is absent there. **Keep or explicitly waive this correction before deleting its only working copy.** A moved record does not by itself make its edit redundant.

**Not verified:** Full assertion-by-assertion equivalence of the reproductions tests, runtime correctness, current worker ownership or fresh remote state. No tests were run under this read-only brief.

**Would change my answer:** An explicit decision to discard the unique link correction, together with a complete test comparison identifying every remaining change as superseded or intentionally dropped, would support removal of all four trees and both branches.

**Queries raised:** No new clarification needed to finish this review; the supervisor should retain the existing comparison-before-disposal choice.

### OLD-DIAGRAMS - Remove the generated working copies

**Goal:** Independently assess removal of `rename-paperclip` and its ignored diagram files, requested on 6 November 2026.

**Scope:** Branch ancestry, ignored diagram inventory, marks, delivery metadata, committed sources and exact HTML comparisons; no browser, rebuild or run-report reads.

**As of:** 6 November 2026, 17:06 GMT, on sol.

**Chosen option:** Approve removal of the worktree, its merged branch and the generated working folder described in the query, the affirmative alternative to b). Option a)’s text was absent.

**Confidence:** High.

**Reason:** All three HTML files are exact copies of committed artifacts recoverable from main’s ancestry, so copying this generated folder elsewhere adds no protection for the diagrams themselves.

**Verified facts:**

- The tree is clean at `3634a9be`, and that commit is an ancestor of current main. No force-delete is needed to bypass an unmerged-branch check for this branch.
- The ignored folder has three diagram subfolders, six files each, totalling 2,778,413 bytes: HTML, a mark, delivery metadata and three generated validation files per diagram.
- For all three diagrams, the delivery metadata’s source hash matches the committed source at `3634a9be`, and its HTML hash matches the ignored HTML. Each ignored HTML is also byte-for-byte identical to its committed `docs/diagrams` counterpart at that commit, which remains reachable from main.
- The ignored `skill-map.html` is also identical to current main’s committed HTML. The two area HTML files differ from current main, but their exact earlier bytes remain in Git.
- **The brief’s retirement premise is false:** `skill-area-agentic-systems` and `skill-area-fundamentals` remain entries in the current [diagram manifest](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/docs/diagrams/diagrams.toml), with committed sources, viewers and receipts. Their names are not evidence of retirement. Removal is justified by the recoverable committed copies instead.
- The marks attribute the builds to `rename-paperclip` on 1 November 2026. The generated working-folder marks and detailed build diagnostics would be deleted; they are not all preserved as identical files in Git. The committed sources, HTML and portable receipts are preserved.

**Not verified:** No estate-wide search established whether every working diagnostic has another copy. Such a search is unnecessary for the HTML because exact committed copies were verified. No historical-evidence retention requirement or active worker was established.

**Would change my answer:** A pending review requiring these exact detailed build diagnostics or marks, or a newly discovered authored file outside the checked inventory, would favour b) copying the folder first.

**Queries raised:** No new clarification query; the existing disposal decision remains with Kris.

## Queries

No blocking clarification queries for this read-only review. These are recommendations for the supervisor’s four existing decisions, not disposal authority. No deletion was performed or authorised by this report.

### 🤖 → 👤 Handoff to supervisor · since 17:06 GMT

👤 4 with you

- [with you] RIG-SPENT review recommendation · supervisor · since 17:06 GMT
- [with you] LANDED-COPIES review recommendation · supervisor · since 17:06 GMT
- [with you] SUPERSEDED-FIXES review recommendation · supervisor · since 17:06 GMT
- [with you] OLD-DIAGRAMS review recommendation · supervisor · since 17:06 GMT

🧵 ki.reg.ways-of-working
