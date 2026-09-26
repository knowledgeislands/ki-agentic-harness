# Humans Not Robots — Wren restart handoff

Wren, I stopped Paperclip because execution was becoming uncontrolled. I have since brought repositories towards a good baseline and had Paperclip's repository alignment and containment configuration repaired. Your first assignment on restart is a read-only readiness review, not resumption of the backlog.

## Evidence and starting position

Read `/Users/krisbrown/.paperclip/instances/default/data/backups/repository-alignment-20260926/maintenance-report.md`, especially its delivered changes, limitations and controlled restart sections. The same directory contains `repository-projects.json`, `task-migration-completed.json`, `verification.json` and database backups. Use those files for HNR's exact project/workspace mappings and migration evidence; you do not need access to KI's board to read the report. If the files are unavailable, report the gap rather than guessing.

At maintenance completion on 26 September 2026, all agents and reporting routines were paused, timer and on-demand wakeups were disabled, and Paperclip was stopped. No end-to-end agent pilot had run. Recheck live state before relying on that snapshot. I will enable only your on-demand review run initially; keep worker agents, timers and routines paused.

## Your review

1. Validate open-task ownership and workspace bindings against the migration evidence. Delivery belongs to the project for its actual repository. Coordination is for company operations and cross-repository planning, not implementation. Archived umbrella projects remain historical records. Propose separately authorized repository tasks where delivery genuinely crosses repositories; do not create or launch them during this review.
2. Check the existing provider binding for the proposed worker using non-mutating diagnostics that do not expose credentials or launch delivery. HNR provider authentication was not proven ready during maintenance: an account-validation probe failed while configuration was being updated. Do not replace credentials, re-adopt accounts or change models merely to bypass that failure. Report what remains unverified and the smallest required follow-up.
3. Confirm host KI resolution through the configured `KI_CONFIG_HOME`, `KI_DATA_HOME`, `KI_STATE_HOME` and `KI_CACHE_HOME` paths. A missing sandbox registry is not permission to bootstrap or reinstall KI. Host resolution was checked during maintenance; resolution inside the eventual worker run still needs verification.
4. Do not create formal trade routes between HNR and Knowledge Islands, legal, personal or other company groups. This current instruction supersedes the earlier proposal to activate an HNR-to-KI bridge. Keep findings such as HUM-20 local and present any need for a separately reviewed human handoff to me; do not submit them through a formal cross-company route. HNR task ownership does not authorize edits to KI repositories. Likewise, cross-repository planning tasks do not authorize delivery in every repository they mention.
5. Propose one bounded pilot. Name the task, repository project, governing work record or direct authority, worker, admitted commit, destination branch, verification and stop conditions. Reconcile earlier delivery and competing ownership first. Project baselines were deliberately pinned and may now be old. Identify any required paired change to the project's pinned commit and workspace ref; do not change either during the review. Account explicitly for primary-checkout changes not included in the commit, particularly the uncommitted `kit-hnr` work observed at baseline capture.

## Boundaries

Historical approval is not replay authority against a changed baseline. Delivery must use the correct repository's external, task-specific worktree; do not fall back to a primary or sibling checkout. Roadmap writes are the explicit exception: they require the owning KI workflow and serialized access to its designated primary checkout, never independent ledger allocation in delivery worktrees.

Worktree alignment is not an operating-system write restriction. Exactly-once execution is not guaranteed, and per-agent concurrency limits do not serialize different agents in one repository. A Paperclip task being done does not establish repository acceptance or make retained work disposable.

Do not bulk-resume agents, catch up missed routines, or infer push, merge, deployment or work-acceptance authority. Report material findings without repeated mentions for unchanged blockers.

## Return and stop

Return one concise review with evidence links: routing confidence, provider and KI readiness, blocking uncertainties and one proposed pilot. Keep workers and routines paused and wait for my approval before configuration changes or delivery. Once approved, enable only the named worker on demand, leave timers off, verify its external checkout and host KI resolution, and reconcile its result before proposing expansion.
