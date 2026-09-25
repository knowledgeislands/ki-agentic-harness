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

Record enough workspace evidence to reproduce what the task saw: repository, baseline revision, local branch or worktree identity when applicable, and any uncommitted starting state admitted into scope. Never infer a clean or current checkout from the agent name.

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
