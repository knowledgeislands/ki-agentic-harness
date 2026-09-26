# Paperclip coordination standard

## Position and authority

Paperclip coordinates execution around a Knowledge Island group or archipelago. It may own agent scheduling, operational tasks, run state, and execution-workspace bindings. It does not own the durable knowledge, repository history, KI work lifecycle, acceptance decision, or authority envelope those tasks act within.

A Paperclip assignment grants coordination context, not repository authority. Every mutation still needs the authority already carried by the governing KI work, direct user instruction, and repository rules. A Paperclip status transition cannot push, merge, deploy, accept, close, or prune KI work by implication.

## Identity model

Keep these identities separate because they change on different cadences:

- **Agent role** — durable responsibility, selection purpose, and organisational relationship.
- **Run or session** — one bounded execution continuity in a harness.
- **Workspace** — the filesystem view and admitted repository baseline for a task.
- **Worker** — the compute process, VM, container, or host executing a run.

Do not equate an agent with a thread, process, VM, or checkout. A role can have many runs; a run uses a workspace; a worker can host different runs. Replacing any one does not silently replace the others.

## Knowledge boundary

The repository is the durable knowledge source. Paperclip task descriptions, comments, plans, and agent memory are operational context or caches. They may point to repository knowledge and carry short-lived coordination detail, but any decision, learning, specification, or evidence that must survive the task returns to its correct repository-owned artifact.

Ground a run in an explicit repository identity and admitted revision before work begins. If the task depends on a KI context, authority, or work record, resolve that source rather than copying an unversioned paraphrase into an agent prompt.

## Task-to-work relationship

A Paperclip task may execute all or part of one governing KI work item. Record a durable locator comprising the repository identity, KI work identifier, admitted revision, and task purpose wherever the active Paperclip task model can preserve it without inventing unsupported fields.

One KI work item may fan out into several Paperclip tasks. One Paperclip task has at most one governing KI work item; related items remain links or context so authority and closure do not become ambiguous.

Paperclip and KI lifecycle states remain independent:

- Paperclip `done` means the coordinated execution task ended; it does not accept the KI work item.
- KI acceptance requires its normal human review and evidence gate.
- Newly discovered substantive work is captured through the active KI work adapter, normally as unadopted Triage, rather than hidden in a task comment.
- Paperclip may show a task blocked or awaiting review without rewriting the KI record unless an authorised KI lifecycle action occurs.

## Workspace model

Runs operating on the same island may share repository identity and baseline while using different physical workspaces. Concurrent mutating tasks use separate worktrees, clones, or equivalent isolated writable checkouts. A shared mutable checkout is acceptable only when mutation is serialised explicitly; read-only inspection may share a filesystem view.

A run that will write to a repository works in its own isolated checkout — normally a linked worktree on its own branch, cut from a named commit — whether or not another run happens to be active. Isolation is a standing property of a writing run, not a precaution taken when concurrency is observed, because a run cannot see the runs that start after it. A human's working copy is never a run's working directory: a person must be able to read, build, and edit their own checkout without an agent changing files underneath them.

Paperclip worktrees use an explicit Paperclip-owned root outside the repository's working tree and outside its Git common directory. The root is outside estate discovery and includes enough company, project or repository, and task identity to prevent collisions. Do not use Paperclip's repository-local default, an ad hoc workspace sibling, or `.git/paperclip-worktrees` for working files.

A writing run may commit verified work to its task branch when the governing KI work or direct instruction authorises that mutation. It does not push or integrate that branch into the primary branch unless explicit current-user or standing repository authority separately grants that action. Paperclip assignment, agent autonomy, and a `done` task state grant none of commit, push, merge, deployment, or KI acceptance by themselves.

A repository's ordinary Paperclip workflow may grant non-force push of only the recorded task branch and creation or update of its draft pull request. The grant does not include primary-branch push, tags, releases, deployment, remote-branch deletion, approval, merge, or auto-merge.

A repository may delegate pull-request review, approval, merge, or auto-merge to selected Paperclip agents as independent capabilities. The repository-owned grant identifies each stable agent, repository and target refs, eligible work domain, required checks or reviews, allowed merge method, and expiry or revocation condition. Paperclip may enforce or project that grant, but assignment, role title, credentials, broad autonomy, and a `done` task state do not originate or widen it. An integration agent acts only within the grant, never approves its own delivery, never bypasses protection, and does not treat PR merge as KI acceptance.

Record enough workspace evidence to reproduce what the task saw: repository, baseline revision, local branch or worktree identity when applicable, and any uncommitted starting state admitted into scope. Never infer a clean or current checkout from the agent name.

### Roadmap records are the exception

Work records are the deliberate exception to isolation. Every write to a repository's roadmap records — capture, shaping, a lifecycle transition, acceptance, or a prune — is made in that repository's designated primary checkout, never in a task's isolated worktree.

Isolation and serialisation protect different things. Isolation keeps two deliveries from corrupting each other's working files. Serialisation keeps two runs from allocating the same work-item identifier, which isolation actively defeats: two worktrees that each advance the issue ledger on their own branch both believe they hold the number, and the collision surfaces at the merge rather than at the allocation. The [roadmap standard](../../../change-management/ki-work-roadmap/references/standards-repository-roadmaps.md#roadmap-write-locus) requires exactly one designated writing checkout per repository and owns the committed-advance-before-record ordering; this standard names the primary checkout as that designation for coordinated runs.

A coordinated run therefore crosses back to the primary checkout to take its number and write its record, and returns to its own worktree for delivery. Those are two write boundaries in two checkouts by design, and the task's evidence records both.

## Interaction and skill composition

Humans may speak directly to an agent. Direct conversation does not bypass governance: the agent uses this skill to preserve the KI relationship and Paperclip's own skill for control-plane operations. Paperclip remains optional for a conversation and authoritative for the coordination state it actually owns.

This skill does not duplicate Paperclip endpoints, authentication, heartbeat procedures, or task mutation rules. It also does not redefine portable agent roles or KI tracker semantics. Route those concerns to Paperclip's official skill, `ki-subagents`, and the selected `ki-work` adapter respectively.

## Evidence and completion

Before reporting coordinated work complete, reconcile four evidence classes:

- Paperclip task outcome and relevant thread or plan context;
- repository diff, commit, test, and review evidence;
- the governing KI work record and its independent lifecycle state;
- durable learning or decisions promoted to the repository that owns them.

If any class is unavailable, report it as unavailable. Never convert absence of remote access, an agent's recollection, or a task status into evidence that the repository accepted the result.
