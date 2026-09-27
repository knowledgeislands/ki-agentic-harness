# Bootstrap or rebootstrap an existing repository estate in Paperclip

This is a staged guide for an existing Knowledge Islands group, not permission to start agents or migrate repositories. Apply the [coordination standard](standards-agent-coordination-paperclip.md) for authority and the `ki-git` skill for Git grants. Use Paperclip's own skill for current project, task, workspace, and API mechanics. Keep the first pass local unless the repositories already have an approved remote-delivery policy.

Use one repeatable company-level bootstrap task in the workspace-free Coordination project. Inventory and reconcile before creating anything; a later run preserves correctly configured projects, tasks, hires, routines, links, and retained work rather than reproducing the first run. Route every repository-specific inspection, audit, conform, and delivery through that repository's project. Keep each completed run's evidence and decisions; a clean rerun reports no changes. An existing Onboarding project may hold an unfinished first run, but archive it only after its work has an owner and its history remains reachable.

## Starting a repeatable bootstrap

Use the [bootstrap task brief](../assets/bootstrap-task.md) without company-code or Agora placeholders. It resolves the current company through the coordination standard's [identity procedure](standards-agent-coordination-paperclip.md#resolving-the-current-company-and-agora). A missing binding becomes a concrete decision, not an inferred name. If the coordination skill is not yet assigned or discoverable, include its verified local `SKILL.md` path in the task until company-level access is established.

The first run drafts a plan only. It identifies changes and repository-project tasks without creating them or changing repositories. After approval, reuse the same bootstrap task to apply only the approved scope, verify it, and retain unresolved decisions for the next run. An approved audit and conform preview does not approve applying the preview.

## 1. Inventory before provisioning

For each repository, identify its canonical repository identity, current name and aliases, designated primary checkout, destination branch and host, active work adapter, held programmes, and the owner who can approve review and integration. Read the repository's work records and Git state; do not infer the backlog from Paperclip tasks alone. Separately list existing Paperclip companies, projects, tasks, agents, execution workspaces, and their repository bindings. Check archived projects and renamed issue keys before creating anything: a name change must not make a second project or orphan historical links.

Classify each retained branch or workspace as integrated, awaiting review, awaiting integration, superseded, held, or uncertain. Record exact commits, dirty or untracked content, task identity, and next owner. An old `done` task, a clean worktree, or absence of a task link is not proof that repository work is delivered or available. Preserve uncertain work until its owning repository dispositions it.

## 2. Establish ownership boundaries

Register `ki-agent-coordination-paperclip` in every admitted repository's `.ki.toml` with its required `organisation_code` before relying on that repository's company binding.

Use one Paperclip company for the intended KI group. Give every admitted repository exactly one active repository project, including repositories with no current delivery or with work on hold. Bind the project to the canonical repository identity and designated primary checkout. Reconcile an existing project rather than creating a replacement solely because its display name or issue code changed. Project colour and icon help navigation; they are not authority signals.

### Repository baseline and rollout

For each repository, obtain its project's evidence for `ki-repo` kind and primary-shape resolution, applicable skill declarations, prerequisites, active harness, and runtime discovery. Report invalid declarations and ambiguous primary shapes as exact proposed configuration changes; do not choose them by display name. Follow the coordination standard's [repository skill baseline](standards-agent-coordination-paperclip.md#repository-skills-are-the-execution-baseline), including validation in the task worktree. For an MCP repository, confirm that its required `ki-engineering` declaration and payload are present before dispatch.

Reconcile company-library availability and agent assignments separately from repository activation. Inventory managed agent instructions and propose corrections where they contradict the current contract. Roll out by approving concrete repository repairs, refreshing the installed harness through its supported workflow, auditing one pilot repository and task workspace, then applying the verified pattern to the remaining repositories. Report source changes, installation, repository conformance, and live-agent adoption separately; a source commit alone does not prove fleet rollout. Preserve holds throughout.

### Project styling

Use the same project-type styling across companies. Validate the required `repo_type` and `primary_shape` through `ki-repo`, then apply the mapping below. Coordination has its own non-repository style; a KB with `primary_shape = "ki-repo-kb"` selects Knowledge Base styling. For a Project, map its declared primary shape as follows: `ki-repo-tools` or `ki-repo-dotfiles-chezmoi` selects Tooling; `ki-repo-project` or `ki-repo-harness` selects Engineering; `ki-repo-mcp` selects MCP; `ki-repo-website` selects Website; `ki-repo-plugins` or `ki-repo-homebrew-tap` selects Package; `ki-repo-specifications` selects Specification. Missing or invalid fields block restyling; never infer a kind or shape from the repository name, other capabilities, or table order. Use these Paperclip icon names and colours:

- **Coordination:** `compass`, `#0ea5e9`.
- **Knowledge base:** `brain`, `#f59e0b`.
- **Tooling, CLI, or dotfiles:** `hammer`, `#8b5cf6`.
- **Engineering or agent harness:** `cpu`, `#6366f1`.
- **MCP or integration:** `puzzle`, `#14b8a6`.
- **Website or application:** `globe`, `#06b6d4`.
- **Package, plugin, or distribution:** `package`, `#ec4899`.
- **Specification or documentation:** `file-code`, `#3b82f6`.

Every repository records its kind and primary shape explicitly in `[skills.ki-repo]`. Every rerun uses those declarations. Propose a correction when the current project style differs from the resolved mapping; do not create another project to represent a secondary shape.

Keep a separate workspace-free Coordination project for company-wide sequencing, dependencies, decisions, hand-offs, and consolidated evidence. It never performs repository work, including read-only inspection or planning of one repository. Put every repository-specific task in that repository's project. A cross-repository effort may have a Coordination parent, with separately scoped tasks in each owning repository project. Do not treat project creation or assignment of a lead as permission to implement, integrate, publish, resume an agent, or lift a programme hold.

Map agent roles to responsibilities after project ownership is clear. A role may coordinate on one task and perform separately authorised repository work on another; role, run, workspace, and worker remain different identities. Keep agents paused while reconciling an inherited queue unless a bounded run has its own current authority.

After approved hires, use the [post-hire configuration brief](../assets/post-hire-task.md) to reconcile agent settings through an authorised external operator. Keep configuration read-back, actual workspace skill verification and permission to start work as separate gates.

## 3. Reconcile work and task identities

For each existing task, decide whether it governs one KI work item, merely relates to several items, or has no repository delivery role. Put verified provider-qualified associations in each owning item's [`task_links`](../../../change-management/ki-work-roadmap/references/standards-work-item-format.md#task-links), written through that repository's designated primary checkout. A delivery task has at most one governing item; one item may have several tasks, and related links may cross items. Near the top of a Paperclip delivery task's ordinary description, name the canonical repository, governing item, admitted revision, and bounded purpose. Do not invent a custom Paperclip field or shared writable lookup table.

Reconcile evaluation tasks, in-progress tasks, and retained historical tasks when they have a verified relationship to an item. Update the item's map rather than merely listing missing links in the bootstrap report. Preserve valid references; reconcile changed readable keys and URLs against stable task identity. Do not call the link gate complete while a known task-to-item relationship is missing or conflicting; report an unresolved identity instead of guessing.

Keep task lifecycle and KI lifecycle separate. A link preserves association history; it is not a live claim, available-work signal, or KI acceptance. Resolve a conflicting or missing backlink against the item, task, retained worktree, and repository evidence before assigning work. Capture new substantive work through the repository's normal work adapter, normally unadopted Triage, rather than growing a second Paperclip backlog.

### Repository health before the operating rhythm

Run each repository's mechanical audit and a judgmental pass in its own project before relying on its status for a company report. Preview conform and obtain authority for its exact writes; apply only authorised repairs, re-audit, then run conform in dry-run again. The second preview must propose no further change before calling conform idempotent. Record exceptions and incomplete checks explicitly; a mechanical `PASS` does not settle judgment criteria.

After establishing the health-check path, reconcile one daily change-log report at 08:00 in the company's chosen IANA timezone and one weekly review. Reuse existing routines or meetings rather than duplicating them. Before each daily report, run a repository preflight of mechanical and judgmental audit plus conform preview; apply only separately authorised repairs and verify convergence. This may be a separate scheduled task early enough to feed the report, but it routes repository work through repository projects and gains no write authority from its schedule. The 08:00 report states previous-day delivered results, current repository health, blockers, and today's focus. If preflight is incomplete or blocked, report that state rather than claiming a clean estate. The weekly review uses current preflight evidence. Coordination aggregates returned evidence and does no repository work.

Discover each repository's purpose and existing work before proposing hires or a small first delivery batch. Name the needed role, first assignment, independent reviewer, and integration owner; do not hire agents or bulk-import the work backlog by default. Human approval of the proposed roles and selected work remains separate from bootstrap reconciliation.

## 4. Prove one local delivery path

Choose one bounded, already-authorised repository item with a reviewable retained result. Name the destination as the human's designated primary checkout and local `main`, plus implementer, independent reviewer, integration owner, baseline, and checks. Keep implementation in a task-specific isolated worktree under a Paperclip-owned root outside the repository, its `.git` directory, and estate-discovery roots. Prefer a readable worktree name beginning with the KI item identifier and, where needed, the Paperclip task key. Do not rename existing bound worktrees just for appearance; migrate them only with verified Git and Paperclip binding preservation.

Before integration, compare the candidate with current destination `main` for ancestry, patch equivalence, and retained value. Do not blanket-rebase all old branches. Refresh an authorised diverged candidate in its isolated worktree, normally by merging exact current `main`; rebase needs separate history-rewrite authority. Re-run checks and independent review on the resulting commit. Integrate under the repository's Git grant in a serialised primary-checkout window. The human should then see the change on local `main`. No remote push or pull request is required for this local path, and neither Paperclip `done` nor a merged branch accepts the KI work item.

Return the destination commit, review and verification evidence, independent KI item state, and workspace disposition to the repository project and any Coordination parent. Let Paperclip retire its own workspaces only after its close-readiness rules and retained-work decisions are satisfied; do not remove its worktrees or branches by hand. A cooldown or refused retirement can be correct evidence of work still held.

## 5. Expand only from evidence

Review the pilot with the human: what reached local `main`, what remains in review or integration, what decisions are still needed, and which old tasks or workspaces remain held. Reconcile stale decision cards against repository decisions; close or refresh only the exact cards whose authority and current need are established. Reallocate misplaced repository tasks to their owning projects without changing their work authority. Finish retained work before starting more concurrency, and keep any separately held programme held until the human explicitly resumes it.

Repeat the proven path repository by repository, serialising each repository's roadmap and integration writes. Before any move to remote workers, agree a repository-owned [remote-delivery policy](standards-agent-coordination-paperclip.md#remote-delivery-prerequisite) identifying the authoritative destination host and checkout, evidence-return path, review and integration owners, synchronisation and conflict recovery, and publication authority. A worker's remote `main` is not the human's local live `main` by default.

The onboarding pass is complete only when each admitted repository has one unambiguous project and primary-checkout destination; existing tasks and retained work have an owner or explicit hold; at least one bounded local delivery has been independently reviewed and reached its destination; task/item associations are reconciled without false live claims; and remaining decisions and workspace dispositions are visible to the human. This does not require clearing every backlog item or resuming every agent.
