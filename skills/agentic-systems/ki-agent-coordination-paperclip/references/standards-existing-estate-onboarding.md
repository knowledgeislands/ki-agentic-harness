# Bootstrap or rebootstrap an existing repository estate in Paperclip

This is a staged guide for an existing Knowledge Islands group, not permission to start agents or migrate repositories. Apply the [coordination standard](standards-agent-coordination-paperclip.md) for authority and the `ki-git` skill for Git grants. Use Paperclip's own skill for current project, task, workspace, and API mechanics. Keep the first pass local unless the repositories already have an approved remote-delivery policy.

Use one repeatable company-level bootstrap task in the workspace-free Coordination project. Inventory and reconcile before creating anything; a later run preserves correctly configured projects, tasks, hires, routines, links, and retained work rather than reproducing the first run. Route every repository-specific inspection, audit, conform, and delivery through that repository's project. Keep each completed run's evidence and decisions; a clean rerun reports no changes. An existing Onboarding project may hold an unfinished first run, but archive it only after its work has an owner and its history remains reachable.

## Contents

- [Starting a repeatable bootstrap](#starting-a-repeatable-bootstrap)
- [Inventory before provisioning](#1-inventory-before-provisioning)
- [Establish ownership boundaries](#2-establish-ownership-boundaries)
- [Reconcile work and task identities](#3-reconcile-work-and-task-identities)
- [Prove one local delivery path](#4-prove-one-local-delivery-path)
- [Expand only from evidence](#5-expand-only-from-evidence)

## Starting a repeatable bootstrap

Use the [bootstrap task brief](../assets/bootstrap-task.md) without company-code or Agora placeholders. It resolves the current company through the coordination standard's [identity procedure](standards-agent-coordination-paperclip.md#resolving-the-current-company-and-agora). A missing binding becomes a concrete decision, not an inferred name. If the coordination skill is not yet assigned or discoverable, include its verified local `SKILL.md` path in the task until company-level access is established.

The first run drafts a plan only. It identifies changes and repository-project tasks without creating them or changing repositories. After approval, reuse the same bootstrap task to apply only the approved scope, verify it, and retain unresolved decisions for the next run. An approved audit and conform preview does not approve applying the preview.

Make the human-facing plan a one-screen decision brief, not a reproduction of the bootstrap inventory; aim for no more than about 250 words without cutting context needed to decide. Lead with what is working, what remains blocked, and the single next action that actually needs approval. State its purpose, proposed owner, permitted change, explicit boundary, expected result and any decision the human must make in everyday language. A question must stand alone: explain what happened, what the agents have already checked, what remains unknown, why this needs the human rather than an authorised operator, the recommended choice and the consequence of waiting. Keep detailed findings, exact bytes or diffs, prior revisions, checks and later work in stable linked supporting records; links support the explanation but do not replace it. An approval of the brief covers only that named action; a supporting record is evidence, not a bundle of implicitly approved future actions. If no decision is needed, report status without manufacturing an approval request. Preserve accepted approvals and avoid repeating an investigation whose unchanged result already identifies a missing owner, permission or execution route.

## 1. Inventory before provisioning

For each repository, identify its canonical repository identity, current name and aliases, designated primary checkout, destination branch and host, active work adapter, held programmes, and the owner who can approve review and integration. Read the repository's work records and Git state; do not infer the backlog from Paperclip tasks alone. Separately list existing Paperclip companies, projects, tasks, agents, execution workspaces, and their repository bindings. Check archived projects and renamed issue keys before creating anything: a name change must not make a second project or orphan historical links.

Run a targeted duplicate-binding check across both active and archived projects before deciding that a repository has no project, creating one, or changing which repository a project belongs to. On the reviewed 2026.916.1 server build, `GET /api/companies/{companyId}/projects?includeArchived=true` includes archived projects; the same request without the query returns only active projects. The CLI `project list` and generated OpenAPI omit this query option, so neither proves archived coverage. Compare stable project IDs, names and keys, `archivedAt`, workspace repository URLs and checkout paths, and known aliases against the canonical repository. Report matching candidates or a no-match result with the query, caller scope and observation time; there is no need to hand over every unrelated project. The response is filtered by the caller's project-read permissions: a successful response alone does not prove company-wide visibility. If the agent cannot establish that visibility, ask an authorised board operator for one targeted check covering the company's proposed project creations and rebindings. Escalate only if no authorised check is available. Reverify this version-specific route after a Paperclip upgrade; the [source review](sources.md#last-review) records its evidence.

State the practical result plainly before giving technical proof:

- **Existing project found:** reuse and assess it; do not create a replacement. A visible match permits work within that known project but does not prove that no hidden duplicate exists.
- **No project found in a complete list:** an already-approved creation may proceed within its scope; otherwise request the normal creation approval.
- **Complete list unavailable:** hold only the proposed creation or rebinding. Continue read-only discovery, reconciliation of known projects, and other independently authorised work. Ask the board operator for the missing check, not the principal for a hand-built inventory or renewed approval.
- **Several possible matches:** hold the project change and request a decision identifying the intended project; do not guess from names.

For a decision card or status update, say what is waiting, why it matters, who can resolve it, and what continues meanwhile. For example: “We can see a project for this repository, so assessment can continue. Before creating or changing a project, a board operator needs to check the full current and archived project list. Your earlier approval still stands.” Attach the query, archived-coverage and caller-scope evidence below the plain-language summary. Treat workspace-free Coordination configuration as a separate check, not as proof of project-list coverage. Repeat the project check only when a creation or rebinding is proposed and its evidence is missing or stale, or when the project inventory changes.

Classify each retained branch or workspace as integrated, awaiting review, awaiting integration, superseded, held, or uncertain. Record exact commits, dirty or untracked content, task identity, and next owner. An old `done` task, a clean worktree, or absence of a task link is not proof that repository work is delivered or available. Preserve uncertain work until its owning repository dispositions it.

## 2. Establish ownership boundaries

Register `ki-agent-coordination-paperclip` in every admitted repository's `.ki.toml` with its required `organisation_code` before relying on that repository's company binding.

Use one Paperclip company for the intended KI group. Give every admitted repository exactly one active repository project, including repositories with no current delivery or with work on hold. Bind the project to the canonical repository identity and designated primary checkout. Reconcile an existing project rather than creating a replacement solely because its display name or issue code changed. Project colour and icon help navigation; they are not authority signals.

### Repository baseline and rollout

For each repository, obtain its project's evidence for `ki-repo` kind and primary-shape resolution, applicable skill declarations, prerequisites, active harness, and runtime discovery. Report invalid declarations and ambiguous primary shapes as exact proposed configuration changes; do not choose them by display name. Follow the coordination standard's [repository skill baseline](standards-agent-coordination-paperclip.md#repository-skills-are-the-execution-baseline), including validation in the task worktree. For an MCP repository, confirm that its required `ki-engineering` declaration and payload are present before dispatch.

Reconcile company-library availability and agent assignments separately from repository activation. Inventory managed agent instructions and propose corrections where they contradict the current contract. Roll out by approving concrete repository repairs, refreshing the installed harness through its supported workflow, auditing one pilot repository and task workspace, then applying the verified pattern to the remaining repositories. Report source changes, installation, repository conformance, and live-agent adoption separately; a source commit alone does not prove fleet rollout. Preserve holds throughout.

### Project styling

On every bootstrap or rebootstrap, compare each existing project's actual icon and colour with the scheme below. Include missing or mismatched styling in the short proposed changes; apply it once the governing bootstrap scope authorises project updates, even if unrelated discovery or delivery remains blocked. Do not create or replace a project just to restyle it.

Use the same project-type styling across companies. For a KI repository, validate the required `repo_type` and `primary_shape` through `ki-repo`, then apply the mapping below. Coordination has its own non-repository style; a KB with `primary_shape = "ki-repo-kb"` selects Knowledge Base styling. For a Project, map its declared primary shape as follows: `ki-repo-tools` or `ki-repo-dotfiles-chezmoi` selects Tooling; `ki-repo-project` or `ki-repo-harness` selects Engineering; `ki-repo-mcp` selects MCP; `ki-repo-website` selects Website; `ki-repo-plugins` or `ki-repo-homebrew-tap` selects Package; `ki-repo-specifications` selects Specification. Missing or invalid KI declarations block KI type styling; never infer a kind or shape from the repository name, other capabilities, or table order. A verified non-KI repository project may use the neutral style without claiming KI conformance. Use these Paperclip icon names and colours:

- **Coordination:** `compass`, `#0ea5e9`.
- **Existing Onboarding project while still active:** `rocket`, `#10b981`. Do not create one merely for bootstrap; preserve its history when it is eventually archived.
- **Knowledge base:** `brain`, `#f59e0b`.
- **Tooling, CLI, or dotfiles:** `hammer`, `#8b5cf6`.
- **Engineering or agent harness:** `cpu`, `#6366f1`.
- **MCP or integration:** `puzzle`, `#14b8a6`.
- **Website or application:** `globe`, `#06b6d4`.
- **Package, plugin, or distribution:** `package`, `#ec4899`.
- **Specification or documentation:** `file-code`, `#3b82f6`.
- **Verified non-KI repository:** `folder`, `#64748b`. This neutral style is not a substitute for an intended KI repository's missing declaration.

Every KI repository records its kind and primary shape explicitly in `[skills.ki-repo]`. Every rerun uses those declarations. Propose a correction when the current project style differs from the resolved mapping; do not create another project to represent a secondary shape.

Keep a separate workspace-free Coordination project for company-wide sequencing, dependencies, decisions, hand-offs, and consolidated evidence. It never performs repository work, including read-only inspection or planning of one repository. Put every repository-specific task in that repository's project. A cross-repository effort may have a Coordination parent, with separately scoped tasks in each owning repository project. Do not treat project creation or assignment of a lead as permission to implement, integrate, publish, resume an agent, or lift a programme hold.

Map responsibilities after project ownership and actual work are clear. Compare the existing employees' remits, skills, assignments and available capacity with company coordination, each repository's work, implementation, independent review, authorised integration and recurring obligations. For each gap or overlap, propose keeping the current arrangement, clarifying a remit, reassigning or reconfiguring an existing employee, or hiring only when the current team cannot reasonably cover it. Name the current and proposed owner, hand-off for retained tasks, review independence and approval needed; do not treat an employee's title or project membership as repository authority. A role may coordinate on one task and perform separately authorised repository work on another; role, run, workspace, and worker remain different identities. Keep agents paused while reconciling an inherited queue unless a bounded run has its own current authority.

After approved hires, use the [post-hire configuration brief](../assets/post-hire-task.md) to reconcile agent settings through an authorised external operator. Keep configuration read-back, actual workspace skill verification and permission to start work as separate gates.

## 3. Reconcile work and task identities

For each existing task, decide whether it governs one KI work item, merely relates to several items, or has no repository delivery role. Put verified provider-qualified associations in each owning item's [`task_links`](../../../change-management/ki-work-roadmap/references/standards-work-item-format.md#task-links), written through that repository's designated primary checkout. A delivery task has at most one governing item; one item may have several tasks, and related links may cross items. Near the top of a Paperclip delivery task's ordinary description, name the canonical repository, governing item, admitted revision, and bounded purpose. Do not invent a custom Paperclip field or shared writable lookup table.

Reconcile evaluation tasks, in-progress tasks, and retained historical tasks when they have a verified relationship to an item. Update the item's map rather than merely listing missing links in the bootstrap report. Preserve valid references; reconcile changed readable keys and URLs against stable task identity. Do not call the link gate complete while a known task-to-item relationship is missing or conflicting; report an unresolved identity instead of guessing.

Keep task lifecycle and KI lifecycle separate. A link preserves association history; it is not a live claim, available-work signal, or KI acceptance. Resolve a conflicting or missing backlink against the item, task, retained worktree, and repository evidence before assigning work. Capture new substantive work through the repository's normal work adapter, normally unadopted Triage, rather than growing a second Paperclip backlog.

### Repository health before the operating rhythm

Run each repository's mechanical audit and judgmental pass in its own project before relying on its status in the company report. Preview conform and obtain authority for its exact writes; apply only authorised repairs, re-audit, then run conform in dry-run again. The second preview must propose no further change before calling conform idempotent. Record exceptions and incomplete checks explicitly; mechanical `PASS` does not settle judgment criteria.

### Reconcile recurring obligations

Include the stock repository-review obligation from `ki-work-housekeeping` in every repository's coverage reconciliation. Reuse its Project or KB Activity template only where equivalent coverage is missing, preserving existing identities and evidence. Propose weekly and ad-hoc use of the same master `ki-repo` REVIEW checklist and active-run guard; record covered, paused, missing or explicitly not-applicable status rather than silently omitting it. A Paperclip routine is only the execution binding to that repository-owned definition, not a second checklist. Stock availability does not authorise adoption or schedule activation.

Apply the [recurring-activity contract](standards-agent-coordination-paperclip.md#recurring-activities-and-routines). Inventory the agreed recurring checklist, repository-owned definitions and existing Paperclip routines before proposing changes. Projects use `docs/housekeeping/`; KBs use the configured Activities area, normally `Admin/Operations/Activities/`, with a nested `housekeeping` mapping only when the recurring-work lifecycle applies. Do not create a parallel KB housekeeping definition. Return the canonical owner, locator, lifecycle and schedule state, last successful evidence, any active run, Paperclip linkage and proposed disposition for each obligation.

Reconcile missing coverage, duplicates, conflicting cadence, pauses, stale links and inappropriate obligations against each repository's purpose and capabilities. Keep valid routines and existing evidence; propose scoped repairs instead of replacing them. A runtime-independent procedure and retained outcomes must pass the [replacement test](standards-agent-coordination-paperclip.md#replaceable-coordination). Resolve the verified Agora home's ownership of shared definitions and reports; route report writes to its repository project, while Coordination only aggregates returned evidence.

Use these recurring concerns as discovery prompts, not mandatory schedules for every repository:

- Daily repository preflight: audit plus conform dry-run before the company report; separately authorised repairs require convergence evidence.
- Daily company change-log report at 08:00 in the chosen IANA timezone: previous-day delivered results, current health, blockers and today's focus. Record incomplete or blocked preflight rather than claiming a clean estate.
- Regular next-work review: each repository project checks its selected work queue, reconciles active and retained work first, and dispatches approved Ready delivery only when the existing authority, owners, workspace and review path are sufficient. Otherwise it returns the smallest decision needed; a routine or Ready label does not authorise selection, implementation or integration.
- Weekly work/delivery and knowledge reconciliation: retained work, task links, unresolved decisions, delivered evidence and useful learning.
- Ad-hoc and weekly judgment review: use the same master `ki-repo` REVIEW checklist to assess purpose, consolidation, drift, learning and possible repositioning, redirection or retirement. Scope each invocation by revision, last-reviewed baseline, depth and budget; preserve gaps where that baseline is unavailable. Keep proposals distinct from adopted work or permission to change direction.
- Monthly capability and risk review where relevant. Reuse existing deeper engineering or knowledge-reconciliation routines; a weekly bounded review must not duplicate their scope.
- Backup and recovery assurance at the estate or infrastructure owner's level, with member dependencies and evidence linked rather than duplicated checks.
- Event-driven reconciliation after hires, membership changes, skill changes or runtime changes.

The list is reconciled with existing obligations, not imported wholesale as new work. A weekly review may consolidate compatible concerns into one bounded invocation; the master checklist remains owned by `ki-repo`, not copied into each task or routine.

Before enabling any proposed routine, agree its exact scope, schedule including weekly day/time and IANA timezone, depth or budget, evidence destination and single-active-run safeguard. Determine a preflight start or dependency that can feed the 08:00 report without pretending a failed or late run passed. A routine triggers the governing due-run lifecycle; it does not independently spawn a duplicate of a run created by `ki-next`, accept the result or grant repository writes. Draft-only bootstrap does not activate schedules.

Discover each repository's purpose and existing work before proposing hires or a small first delivery batch. Name the needed role, first assignment, independent reviewer and integration owner; do not hire agents or bulk-import the work backlog by default. Human approval of the proposed roles and selected work remains separate from bootstrap reconciliation.

## 4. Prove one local delivery path

Choose one bounded, already-authorised repository item with a reviewable retained result. Name the destination as the human's designated primary checkout and local `main`, plus implementer, independent reviewer, integration owner, baseline, and checks. Keep implementation in a task-specific isolated worktree under a Paperclip-owned root outside the repository, its `.git` directory, and estate-discovery roots. Prefer a readable worktree name beginning with the KI item identifier and, where needed, the Paperclip task key. Do not rename existing bound worktrees just for appearance; migrate them only with verified Git and Paperclip binding preservation.

Before integration, compare the candidate with current destination `main` for ancestry, patch equivalence, and retained value. Do not blanket-rebase all old branches. Refresh an authorised diverged candidate in its isolated worktree, normally by merging exact current `main`; rebase needs separate history-rewrite authority. Re-run checks and independent review on the resulting commit. Integrate under the repository's Git grant in a serialised primary-checkout window. The human should then see the change on local `main`. No remote push or pull request is required for this local path, and neither Paperclip `done` nor a merged branch accepts the KI work item.

Return the destination commit, review and verification evidence, independent KI item state, and workspace disposition to the repository project and any Coordination parent. Let Paperclip retire its own workspaces only after its close-readiness rules and retained-work decisions are satisfied; do not remove its worktrees or branches by hand. A cooldown or refused retirement can be correct evidence of work still held.

## 5. Expand only from evidence

Review the pilot with the human: what reached local `main`, what remains in review or integration, what decisions are still needed, and which old tasks or workspaces remain held. Reconcile stale decision cards against repository decisions; close or refresh only the exact cards whose authority and current need are established. Reallocate misplaced repository tasks to their owning projects without changing their work authority. Finish retained work before starting more concurrency, and keep any separately held programme held until the human explicitly resumes it.

Repeat the proven path repository by repository, serialising each repository's roadmap and integration writes. Before any move to remote workers, agree a repository-owned [remote-delivery policy](standards-agent-coordination-paperclip.md#remote-delivery-prerequisite) identifying the authoritative destination host and checkout, evidence-return path, review and integration owners, synchronisation and conflict recovery, and publication authority. A worker's remote `main` is not the human's local live `main` by default.

The onboarding pass is complete only when each admitted repository has one unambiguous project and primary-checkout destination; existing tasks and retained work have an owner or explicit hold; at least one bounded local delivery has been independently reviewed and reached its destination; task/item associations are reconciled without false live claims; and remaining decisions and workspace dispositions are visible to the human. This does not require clearing every backlog item or resuming every agent.
