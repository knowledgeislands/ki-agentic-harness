---
type: ki-checkpoint
thread: paperclip-bootstrap-and-recovery
state: active
created_at: 2026-09-27T23:55:22Z
updated_at: 2026-10-05T17:36:43Z
---

# paperclip-bootstrap-and-recovery

## Objective

Get the companies working reliably from their repository roadmaps: the right teams, useful reviewed deliveries into local main, and regular checks that also run on demand. Prove the full cycle in VA first, then apply what works elsewhere. Keep this as the single recovery handoff, not another backlog.

## Current state

The harness reconstruction baseline is local main at f191e8c240287a815ac06bd72c5bac48d848b1a0. This checkpoint records observed state and the remaining-work index; it does not grant authority or schedule its list. Recheck live tasks and repositories before acting.

- The maintained Paperclip fork is now at `/Users/krisbrown/workspaces/kit/paperclip`, outside the Knowledge Islands estate directory. Its clean `ki/stable` checkout remains at 2c4ac3a2fd30e166517feed6906d4c3702a6c119, tagged `ki/v2026.916.1-r1`. The running installation is a separate copy under `~/.paperclip/cli/installs/fork/`; live data remains under `~/.paperclip/instances/default`. No service restart or data move accompanies the checkout relocation.
- The runtime health check passes. The fork includes the renewable isolated Claude authentication repairs, but not every company has completed renewable sign-in. Do not equate a healthy server or one successful agent test with lasting company readiness.
- All 16 agents use Claude as their primary connector. Bob, Forseti and Kitteth have successful saved-configuration connection tests with renewable sign-ins. VA's three agents also passed fresh tests, but VA, HNR and ER still need their own renewable sign-ins: importing the host login provides temporary access, not a durable refresh credential.
- The active CEOs' concurrency settings were reconciled to one; paused KIS settings were preserved. Wren's local mise environment was fixed, but intermittent HNR startup handshake timeouts remain. Wren's existing timer was preserved; do not claim all employee timers are off or all employee environments are verified.
- Six staffing reviews remain in review, freshly checked on 2026-10-05: VA-33, HNR-50, TMX-9, LGL-5, KIT-2 and ER-7. KIS-105 remains parked while KIS is paused. Read each current decision card rather than replaying an earlier hire proposal.
- [VA-2](http://127.0.0.1:3100/VA/issues/VA-2) remains blocked. Guru has a bounded continuation request to choose one already-authorised delivery, preserve holds, obtain independent review, and return the actual local-main result. No new reviewed local-main delivery has yet been proved in this recovery.
- The last routine inventory showed only two paused KIS changelog routines; the other companies had none. Definitions in a skill are not active routines. The memory policy is explicit in VA employee instructions, but the equivalent fleet rollout and weekly knowledge-return routine remain unfinished.
- Backup retention is now three daily days, four weekly weeks and one monthly month. Ninety-two older snapshots were removed, freeing about 7 GB; the pre-fork recovery backup and separate recovery folders were preserved. Retained worktrees have not been deleted.

## Decisions made

- Paperclip is replaceable coordination; repositories retain work records, decisions, procedures and delivery evidence. Every admitted repository has one project. Workspace-free Coordination coordinates only, including no read-only repository inspection.
- Coordination is a project boundary, not a blanket restriction on CEOs. A CEO may do authorised repository work in its owning project, but cannot independently review their own implementation. Prefer the smallest justified team and ask the human to approve theme-aligned names before hires.
- Claude is the default connector; Codex is a backup. New hires need the [post-hire setup](../../skills/agentic-systems/ki-agent-coordination-paperclip/assets/post-hire-task.md), least-necessary permissions, local KI and mise settings, concurrency one, and successful connection/runtime checks before dispatch. Use supported configuration APIs, not direct database bypasses.
- In laptop-local operation the human's designated primary checkout on local main is the delivery destination. Implementation uses isolated task worktrees, independent review and the repository's integration grant. Paperclip completion does not accept or prune KI work. Verified task associations live in each roadmap item's task_links.
- Keep KI symlink discovery. Paperclip skill import and agent assignment are separate from repository declarations; verify canonical-source access in real workspaces rather than assuming importer support.
- Repository-owned Project housekeeping or KB Activities define recurring obligations; Paperclip routines only schedule them. Reconcile daily audit plus conform dry-run before the 08:00 company report, and the same master [ki-repo REVIEW checklist](../../skills/keystone/ki-repo/references/mode-review.md) for ad-hoc and weekly judgment reviews. Also reconcile weekly work/knowledge, monthly risk and event-driven checks without duplicating existing deeper routines. Exact schedules and activation require approval.
- `para-memory-files` is an employee's working retrieval aid, not a parallel company knowledge base. Durable discoveries go to the owning shared repository with pointers from personal memory; no bulk copying, deletion or cross-company disclosure. The [agent-memory standard](../../skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-memory.md) owns this rule.
- Techné remains held. KIS's one-delivery pilot remains deferred; remote implementation requires a repository-owned remote-delivery policy first. Configuration repair alone lifts neither hold.

## Files touched

This pass refreshes this checkpoint and updates the Paperclip source path in `/Users/krisbrown/.local/share/chezmoi/docs/guides/tools/paperclip.md`. The checkout relocation also converts one generated dependency symlink to a relative link; it changes no tracked fork source. The maintained build, database, agent settings and running service are not relocated or reconfigured by this pass.

The [operational-review brief](../../skills/agentic-systems/ki-agent-coordination-paperclip/assets/bootstrap-task.md), [post-hire brief](../../skills/agentic-systems/ki-agent-coordination-paperclip/assets/post-hire-task.md) and [coordination skill](../../skills/agentic-systems/ki-agent-coordination-paperclip/SKILL.md) remain the reusable instructions, not proof that their live rollout is complete.

## Open questions

- Which staffing proposals does Kris approve? VA recommends no additional hire; other current cards offer the smallest role changes or hires. Approval is not permission to bypass post-hire checks or repository delivery grants.
- Who completes renewable Claude sign-in for VA, HNR and ER, and what explains HNR's intermittent startup timeout? Temporary access must not be presented as a permanent fix.
- What is the smallest remaining decision holding VA's first delivery, and which approved existing candidate can complete it? Preserve VA-13 and other holds unless Kris explicitly releases them.
- What exact schedules, budgets and activation scope should the missing routines use? Which repositories currently belong to each Agora, and are their project ownership, styling and task links complete?
- The permission-editing API currently rejects agent principals through a human-only removal guard. What scoped fork repair and verification will correct permission updates without weakening removal protections?

## Next step

Work index: existing tasks below already hold the company work; entries without a linked execution record are explicit tracking gaps, not silently queued jobs. Reuse an appropriate owning-project task when continuing them; do not create another bootstrap or copy the backlog.

1. **Approve the team choices.** Kris reviews [VA-33](http://127.0.0.1:3100/VA/issues/VA-33), [HNR-50](http://127.0.0.1:3100/HNR/issues/HNR-50), [TMX-9](http://127.0.0.1:3100/TMX/issues/TMX-9), [LGL-5](http://127.0.0.1:3100/LGL/issues/LGL-5), [KIT-2](http://127.0.0.1:3100/KIT/issues/KIT-2) and [ER-7](http://127.0.0.1:3100/ER/issues/ER-7). CEOs then enact only the approved staffing choice; an external operator configures and verifies new hires through the post-hire brief.
2. **Finish lasting Claude connections and runtime checks.** External operator completes isolated renewable sign-ins for VA, HNR and ER, investigates HNR startup failures, and verifies effective KI/mise settings for remaining employees. This still needs a scoped execution follow-up; do not overwrite host rotating credentials or broaden privileges.
3. **Land one useful VA result.** Guru continues [VA-2](http://127.0.0.1:3100/VA/issues/VA-2), reconciling existing VA-6, VA-7 and VA-31 work rather than starting over. Obtain an independent exact-candidate review and authorised integration; report the destination main commit, tests and roadmap links. Do not lift VA-13's hold.
4. **Make the routines visible and runnable.** Each CEO reconciles definitions in its owning repository and proposes activation through the existing operational review: daily preflight, daily report/changelog, next-work review, weekly changelog and weekly/ad-hoc repository review. Include employee knowledge return and explicit failure reporting. These are not yet active; agree timing and budget before scheduling.
5. **Check project coverage and styling.** Each CEO refreshes its Agora inventory, reuses existing projects and applies the skill's deterministic icons/colours. KIT's home-project setup and ER's newer projects need particular attention. An observer membership does not transfer ownership: LGL owns kit-legal.
6. **Roll out the memory boundary.** External operator and CEOs verify the repository-first memory clause for every employee, not just VA, and check that useful employee discoveries return through the shared review. Reuse the operational-review tasks; implementation outside VA remains a gap.
7. **Complete the maintained-fork repair list.** External operator tracks and fixes the agent permission-update guard separately from authentication. Follow the host-owned Paperclip guide and repair inventory; no database bypass or unapproved deployment. This defect still needs a scoped repair record.
8. **Review retained work before cleanup.** Use [GOV-114](../../docs/roadmap/KI-HARNESS-GOV-114-surface-held-workspaces.md) for held-workspace visibility and existing owning-project recovery tasks for individual disposition. Preserve unmerged changes and evidence; the visibility item is not a cleanup grant. Worktree storage remains a later, separate decision.
9. **Return to KIS and cloud planning later.** Preserve [KIS-105](http://127.0.0.1:3100/KIS/issues/KIS-105), the [KIS local integration grant](../../AGENTS.md#paperclip-local-delivery), and the KIS pilot and Techné holds until Kris changes direction. Reuse demonstrated VA lessons; obtain the required remote-delivery policy before changing where delivery runs.

Immediate human action: review the six staffing cards. Immediate coordination priority: finish the existing VA delivery, with runtime repair handled by the external operator. Updating this list alone does not wake agents or activate routines.
