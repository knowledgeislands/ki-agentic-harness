# Company Operational Review for an existing repository estate in Paperclip

<a id="bootstrap-or-rebootstrap-an-existing-repository-estate-in-paperclip"></a>

This is a staged guide for an existing Knowledge Islands group, not permission to start agents or migrate repositories. Apply the [coordination standard](standards-agent-coordination-paperclip.md) for authority and the `ki-git` skill for Git grants. Use Paperclip's own skill for current project, task, workspace, and API mechanics. Keep the first pass local unless the repositories already have an approved remote-delivery policy.

Use one repeatable company-level Company Operational Review task in the workspace-free Coordination project. Bootstrap and rebootstrap are legacy names for the same review; preserve task identity, approvals, evidence and existing links rather than creating a second onboarding task. Review operational readiness and efficiency: correct repository projects and styling, a capable lean team, useful roadmap progress, and working daily, next-work and weekly review coverage. Keep the current company's approved scope and selected pilot; do not restart a fleet review or expand to another company without authority.

Inventory and reconcile before provisioning; a later run preserves correctly configured projects, tasks, hires, routines, links, and retained work rather than reproducing the first run. Route every repository-specific inspection, audit, conform, and delivery through that repository's project. Keep each completed run's evidence and decisions; a clean rerun reports no changes. An existing Onboarding project may hold an unfinished first run, but archive it only after its work has an owner and its history remains reachable. Filenames and legacy anchors remain stable for existing tasks.

## Contents

- [Starting a repeatable review](#starting-a-repeatable-bootstrap)
- [Approve an outcome, not every step](#approve-an-outcome-not-every-step)
- [Minimum needed to start useful work](#minimum-needed-to-start-useful-work)
- [Roadmap-to-delivery loop](#roadmap-to-delivery-loop)
- [Inventory before provisioning](#1-inventory-before-provisioning)
- [Establish ownership boundaries](#2-establish-ownership-boundaries)
- [Reconcile work and task identities](#3-reconcile-work-and-task-identities)
- [Prove one local delivery path](#4-prove-one-local-delivery-path)
- [Expand only from evidence](#5-expand-only-from-evidence)

<a id="starting-a-repeatable-bootstrap"></a>

## Starting a repeatable review

Use the [Company Operational Review brief](../assets/bootstrap-task.md) without company-code or Agora placeholders. It resolves the current company through the coordination standard's [identity procedure](standards-agent-coordination-paperclip.md#resolving-the-current-company-and-agora). A missing binding becomes a concrete decision, not an inferred name. If the coordination skill is not yet assigned or discoverable, include its verified local `SKILL.md` path in the task until company-level access is established.

Start from the actual request and existing approvals. A request for a plan or read-only assessment stays within that boundary. A request to carry out an agreed bootstrap continues its authorised work; do not reset it to planning or seek the same permission again. The reusable brief permits bounded read-only discovery tasks in existing repository projects, so Coordination can obtain evidence without inspecting repositories itself. A more restrictive caller instruction overrides that permission. Creating a missing project, applying repository changes and starting a schedule still require their applicable authority. An approved audit and conform preview does not approve applying the preview.

Make the human-facing plan a one-screen decision brief; aim for no more than about 250 words without cutting context needed to decide. Lead with the useful result, what already works, the proposed changes and the decision needed. Name the work, owner, review and delivery path, limits and expected result. Keep detailed inventories, diffs, prior revisions and verification evidence in linked supporting records. A question must explain the situation, what has already been checked, why the human's judgement is needed, the recommended choice and the consequence of waiting. If no decision is needed, proceed within the existing authority and report progress.

The short review report answers: What is working? What improved? What happens next? What decision needs the human? Distinguish delivered improvements from proposals and unverified settings. Link supporting evidence and actual pending approvals. When no decision is needed, say so; a report is not a reason to pause authorised work.

## Approve an outcome, not every step

The bounded next action is a useful outcome, such as preparing one named roadmap item or delivering its agreed result. It may contain several technical steps. Present known setup, roadmap preparation, implementation, review and local integration permissions together when they are needed for that outcome and their scope is concrete. The human can approve that defined sequence once. Separate responsibilities and verification gates remain in force; they do not require separate human confirmations when the approval already covers them. A linked technical record cannot silently enlarge the approved scope.

Use the same repository task across preparation and delivery where its governing item and purpose remain the same; record the phase and approval as they change. Create separate tasks for a different repository, an independent reviewer or a genuinely distinct outcome. Do not create a task for every check, commit or hand-off. A completed historical task need not be reopened or have its workspace migrated solely to enable new work; preserve its evidence and configure the appropriate active task.

Preparing a repository plan means shaping the governing roadmap draft and its task links through the repository's work adapter, when those writes are authorised. Include that writing boundary and its local commit in the preparation scope. Do not claim to prepare the item while forbidding all roadmap writes and returning another Paperclip-only plan. An explicitly read-only assessment may return a proposal, but it must say the repository item is still unprepared.

Ask again only when a real decision is missing or has changed: selecting unapproved work, changing its meaning or priority, lifting a hold, resolving contested edits, exceeding the agreed budget, hiring, publishing, or obtaining a missing permission. Check tools and supported settings through the authorised operator before asking the human to investigate them. An agent's limited access is not a reason to repeat discovery or to ask the human who should investigate when that owner is already known.

## Minimum needed to start useful work

For the next operation, establish the owning repository project, its current instructions and usable runtime, the relevant roadmap state and holds, and authority for that operation. Before implementation, also establish the separate working copy, required checks, independent reviewer and authorised integration owner. Planning can proceed while later delivery permissions are being resolved, provided its own prerequisites and write scope are satisfied.

Choose the workspace for the operation. Repository-project read-only assessment may use the designated primary checkout; every roadmap write uses its serialised primary-checkout boundary. Neither requires an implementation worktree first. Canonical-content implementation uses isolation. Verify the instructions, capabilities and store bindings in the checkout actually used for each phase; a failure in a newly created worktree need not prevent authorised assessment through the working primary checkout.

Fresh worktrees may lack ignored skill projections and local store bindings. Include the supported preparation and verification of those in the implementation setup scope. Resolve required skills through verified runtime discovery or an explicitly supported canonical-source route; missing generated links and unreadable skills are different findings. Resolve external stores from the repository's authoritative existing bindings, never from a guessed directory name, and do not register a temporary worktree as another estate member just to satisfy a checker. If the runtime has no supported way to use a required binding, route that concrete setup defect to its operator while independent planning continues.

For local delivery, resolve the designated checkout's current local destination commit before provisioning and verify the worktree starts from that commit. Do not assume a platform's `main` setting uses local `main`; some prefer a remote-tracking branch. Use a supported explicit commit or verified local-ref setting, and revalidate before integration. A clean isolated copy does not settle ownership of an uncommitted primary edit. Preserve contested paths and stop overlapping writes or integration, while allowing independent read-only assessment and authorised disjoint work.

Classify each bootstrap finding as blocking the next operation, affecting a later operation, or follow-up improvement. A missing backup report, optional schedule, unrelated repository finding or styling correction does not block an otherwise authorised roadmap task. A failed prerequisite required by the selected work process does block that operation; return its specific repair and owner rather than repeating the entire bootstrap assessment. Never report an incomplete health check as passed.

Report operational readiness separately from complete bootstrap reconciliation. One repository can be ready for a first delivery while other setup remains open. Keep those remaining obligations visible and owned, without making a perfectly reconciled estate a prerequisite for useful work.

## Roadmap-to-delivery loop

Each repository project owns this loop, using its selected `ki-work` adapter. Coordination receives the result and handles dependencies. Check at the agreed next-work cadence and after relevant completion, approval or dependency events; a schedule must be explicitly configured before claiming it will run.

1. **Finish what has started.** Reconcile active work, retained branches, review and integration before starting another delivery. A `task_links` association is provenance, not an exclusive work claim; check the current task and repository evidence.
2. **Deliver selected Ready work.** Dispatch when the approved scope and required delivery permissions are present. A Ready label alone is insufficient; request any missing authority as one outcome-focused decision.
3. **Prepare selected drafts.** If no Ready item is available, examine adopted Now or Next drafts and recommend the next eligible item. With selection and preparation authority, use `ki-plan` to shape that actual record and its task links. Bring back its concrete plan for the approval required to mark it Ready and, where requested and fully specified, implement and locally integrate it. No Ready work is a reason to prepare work, not to idle indefinitely or rerun bootstrap.
4. **Ask about priorities when necessary.** If only Soon, Future, Triage, held or meaningfully competing work is available, follow `ki-next` ordering, recommend one item with a short reason and request the missing selection, promotion or adoption decision. Do not promote it silently, infer release of a hold or import the whole roadmap into Paperclip.
5. **Return the result to the repository.** Record implementation, checks, independent review, destination commit and task links. Paperclip task completion and KI acceptance remain separate. Keep delivered roadmap items available for human acceptance and any later explicit prune; a routine does not accept or prune them.

Begin with one active delivery per repository and at most one next item being prepared, unless an approved arrangement selects greater concurrency. Reuse live tasks and recurring-run reservations so scheduled and ad-hoc checks cannot dispatch the same work twice. Recheck only evidence invalidated by a relevant change; a repeated blocked run with no new evidence should retain its existing owner and waiting path.

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

Before relying on employee learning, reconcile every participating agent's managed instructions and memory-skill assignments against the [agent-memory boundary](standards-agent-memory.md). This includes coordinators and repository workers. Keep personal retrieval aids separate from company knowledge, retain company access limits and reconcile conflicting capture, planning or retention guidance. An instruction repair does not enable auto-memory or authorise reading or migrating existing private notes.

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

Where a justified gap requires a hire and proposal submission is authorised, the CEO submits a concrete proposal through Paperclip's supported human-approval mechanism. Reuse a matching pending proposal; do not substitute a prose recommendation for the approval request or hire automatically. Include responsibilities, first assignment, runtime and verified connection route, budget, and the independent review arrangement. Explain why reassignment or configuration of existing employees is insufficient. If submission access is missing, return the exact operator action and continue unrelated authorised work. A hire approval does not grant repository implementation, integration, acceptance or publication authority.

### Runtime binding

Resolve new-hire runtime choice from the principal's approved estate policy. The [review brief](../assets/bootstrap-task.md#runtime-binding) expresses this principal's Claude default, conditional on a working supported connection; it is not a global Paperclip default or a requirement for every user. Preserve explicitly approved exceptions and existing working runtimes. Verify the supported connection for the proposed hire and report a specific missing connection action to its operator. An unavailable preferred connection does not justify silently proposing another runtime, resetting approved work to discovery or disabling a working employee.

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
- Regular next-work review: run the [roadmap-to-delivery loop](#roadmap-to-delivery-loop), including preparation of selected drafts when no Ready work exists. Reconcile existing work before dispatch, and request only the missing selection or delivery decision. A routine or Ready label does not itself grant that authority.
- Weekly work/delivery and knowledge reconciliation: retained work, task links, unresolved decisions and delivered evidence, including the [employee knowledge-return check](standards-agent-memory.md#weekly-employee-knowledge-return-check). Each employee reviews their authorised recent work and permitted memory for useful discoveries, durable learning and company knowledge that have not reached their owning repository. Reconcile existing knowledge, promote within authority and report pending candidates and missing employee coverage. Prefer extending the existing weekly review over creating another routine or meeting.
- Ad-hoc and weekly judgment review: use the same master `ki-repo` REVIEW checklist to assess purpose, consolidation, drift, learning and possible repositioning, redirection or retirement. Scope each invocation by revision, last-reviewed baseline, depth and budget; preserve gaps where that baseline is unavailable. Keep proposals distinct from adopted work or permission to change direction.
- Monthly capability and risk review where relevant. Reuse existing deeper engineering or knowledge-reconciliation routines; a weekly bounded review must not duplicate their scope.
- Backup and recovery assurance at the estate or infrastructure owner's level, with member dependencies and evidence linked rather than duplicated checks.
- Event-driven reconciliation after hires, membership changes, skill changes or runtime changes.

The list is reconciled with existing obligations, not imported wholesale as new work. A weekly review may consolidate compatible concerns into one bounded invocation; the master checklist remains owned by `ki-repo`, not copied into each task or routine.

Before enabling any proposed routine, agree its exact scope, schedule including weekly day/time and IANA timezone, depth or budget, evidence destination and single-active-run safeguard. Determine a preflight start or dependency that can feed the 08:00 report without pretending a failed or late run passed. A routine triggers the governing due-run lifecycle; it does not independently spawn a duplicate of a run created by `ki-next`, accept the result or grant repository writes. Draft-only bootstrap does not activate schedules.

Make approved daily reporting, next-work and weekly review coverage visible and manually runnable through supported Paperclip projections. Scheduled and on-demand calls reuse their repository definition and active-run guard. Manual calls use their approved invocation scope; making them available does not require activating a timer or repeating unchanged approvals. Combine weekly review and employee knowledge return when their approved scopes fit one run. Verify the actual invocation and returned evidence before reporting a routine operational; a saved definition alone is not proof that it runs.

Discover each repository's purpose and existing work before proposing hires or a small first delivery batch. Name the needed role, first assignment, independent reviewer and integration owner; do not hire agents or bulk-import the work backlog by default. Roles, work selection and delivery permissions are distinct decisions that may share one concrete, explicitly approved bootstrap outcome; reconciliation alone grants none of them.

## 4. Prove one local delivery path

Choose one bounded, already-authorised repository item with a reviewable retained result. Name the destination as the human's designated primary checkout and local `main`, plus implementer, independent reviewer, integration owner, baseline, and checks. Keep implementation in a task-specific isolated worktree under a Paperclip-owned root outside the repository, its `.git` directory, and estate-discovery roots. Prefer a readable worktree name beginning with the KI item identifier and, where needed, the Paperclip task key. Do not rename existing bound worktrees just for appearance; migrate them only with verified Git and Paperclip binding preservation.

Before integration, compare the candidate with current destination `main` for ancestry, patch equivalence, and retained value. Do not blanket-rebase all old branches. Refresh an authorised diverged candidate in its isolated worktree, normally by merging exact current `main`; rebase needs separate history-rewrite authority. Re-run checks and independent review on the resulting commit. Integrate under the repository's Git grant in a serialised primary-checkout window. The human should then see the change on local `main`. No remote push or pull request is required for this local path, and neither Paperclip `done` nor a merged branch accepts the KI work item.

Return the destination commit, review and verification evidence, independent KI item state, and workspace disposition to the repository project and any Coordination parent. Let Paperclip retire its own workspaces only after its close-readiness rules and retained-work decisions are satisfied; do not remove its worktrees or branches by hand. A cooldown or refused retirement can be correct evidence of work still held.

## 5. Expand only from evidence

Review the pilot with the human: what reached local `main`, what remains in review or integration, what decisions are still needed, and which old tasks or workspaces remain held. Reconcile stale decision cards against repository decisions; close or refresh only the exact cards whose authority and current need are established. Reallocate misplaced repository tasks to their owning projects without changing their work authority. Finish retained work before starting more concurrency, and keep any separately held programme held until the human explicitly resumes it.

Repeat the proven path repository by repository, serialising each repository's roadmap and integration writes. Before any move to remote workers, agree a repository-owned [remote-delivery policy](standards-agent-coordination-paperclip.md#remote-delivery-prerequisite) identifying the authoritative destination host and checkout, evidence-return path, review and integration owners, synchronisation and conflict recovery, and publication authority. A worker's remote `main` is not the human's local live `main` by default.

The onboarding pass is complete only when each admitted repository has one unambiguous project and primary-checkout destination; existing tasks and retained work have an owner or explicit hold; at least one bounded local delivery has been independently reviewed and reached its destination; task/item associations are reconciled without false live claims; and remaining decisions and workspace dispositions are visible to the human. This does not require clearing every backlog item or resuming every agent.
