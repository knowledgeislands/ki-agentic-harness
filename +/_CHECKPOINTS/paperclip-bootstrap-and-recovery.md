---
type: ki-checkpoint
thread: paperclip-bootstrap-and-recovery
state: active
created_at: 2026-09-27T23:55:22Z
updated_at: 2026-09-30T06:41:42Z
---

# paperclip-bootstrap-and-recovery

## Objective

Reconcile repeatable Paperclip bootstraps and retained local delivery work across the KI companies without duplicating projects or tasks, losing repository evidence, or widening approvals. Keep the KIS delivery pilot deferred until the principal is satisfied with TMX, VA and ER.

## Current state

The reconstruction baseline in this repository is local main at commit b1ea3ee7. This checkpoint supplies context, not authority to change repositories, agent controls, schedules or held work. Re-read the repository and Paperclip before acting.

- The [bootstrap brief](../../skills/agentic-systems/ki-agent-coordination-paperclip/assets/bootstrap-task.md) and [existing-estate guide](../../skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-existing-estate-onboarding.md) define the repeatable plan-first flow. The [post-hire brief](../../skills/agentic-systems/ki-agent-coordination-paperclip/assets/post-hire-task.md) now covers both KI paths and local mise settings; that change is in b1ea3ee7. A copied Paperclip skill may still need refreshing before an agent sees it.
- The 2026-09-30 read-only check found Paperclip healthy at version 2026.916.1. All 14 agents had four KI path keys, whose values the API masks. The five local Codex agents—Bob (TMX), Guru (VA), Forseti (LGL), Kitteth (KIT) and Dike (ER)—had both MISE_DATA_DIR and MISE_AUTO_INSTALL saved. The four KIS and five HNR Claude agents did not. KIS agents were paused; the others were idle. Saved settings are not proof of effective runtime values.
- Paperclip rejected supported configuration updates for a KIS Claude agent and an HNR Claude agent during AI-connection validation, although their connection records showed “connected”. The other Claude agents were left unchanged. Diagnose the validation gate before retrying; do not bypass it with direct database writes or unrelated AI/engine changes.
- Earlier verification found managed company–Agora and coordination-skill references for 14 agents and corrected clauses that allowed repository inspection in Coordination. Recheck actual skill access and instruction revisions; a source commit or saved path does not prove readability in a task workspace.
- An earlier repository-classification inventory passed for 43 configurations, including kit-legal. Re-inventory current Agora membership rather than treating that historical count as current.

## Decisions made

- Paperclip is replaceable coordination; repositories retain work records, decisions, procedures and delivery evidence. Every admitted repository has one project. Workspace-free Coordination coordinates only, including no read-only repository inspection.
- In laptop-local operation the human's designated primary checkout on local main is the delivery destination. Implementation uses isolated task worktrees, independent review and the repository's integration grant. Paperclip completion does not accept or prune KI work. Verified task associations live in each roadmap item's task_links.
- Keep KI symlink discovery. Paperclip skill import and agent assignment are separate from repository declarations; verify canonical-source access in real workspaces rather than assuming importer support.
- Repository-owned Project housekeeping or KB Activities define recurring obligations; Paperclip routines only schedule them. Reconcile daily audit plus conform dry-run before the 08:00 company report, and the same master [ki-repo REVIEW checklist](../../skills/keystone/ki-repo/references/mode-review.md) for ad-hoc and weekly judgment reviews. Also reconcile weekly work/knowledge, monthly risk and event-driven checks without duplicating existing deeper routines. Exact schedules and activation require approval.
- Techné remains held. KIS's one-delivery pilot remains deferred; remote implementation requires a repository-owned remote-delivery policy first. Configuration repair alone lifts neither hold.

## Files touched

This update consolidates the former paperclip-recovery.md checkpoint and the manually pasted draft into this one active record. The source guidance is in the [coordination skill](../../skills/agentic-systems/ki-agent-coordination-paperclip/SKILL.md), its linked briefs and guide; live agent settings remain in Paperclip, not this repository.

## Open questions

- What causes Paperclip's Claude AI-connection validation to reject otherwise narrow agent-environment updates, and can all nine pending agents then be configured through the supported API?
- Do effective KI paths, mise settings and coordination skills work in authorised agent runs and their actual repository workspaces? API read-back alone cannot answer this.
- VA's earlier approved discovery covered two repositories, while its Agora later added mark-markhowarth.com. What plan and approval scope now covers the third? ER's Agora also includes kit-legal as an observer, but LGL owns that repository.
- HNR's inherited pause instructions conflicted with idle agent state at the earlier check. What hold does the principal intend?
- Which existing routines already cover the recurring checklist, and what day, timezone, depth, budget and activation scope should any missing routine use?

## Next step

1. Review current TMX, VA and ER bootstrap results, decisions, projects, tasks and Agora membership before dispatching more work. Preserve VA approval boundaries and ER/LGL ownership.
2. Diagnose the Claude validation gate, then retry and read back only the nine pending local mise configurations. Preserve agent states and KI bindings; do not wake agents as part of configuration.
3. Obtain separate scope for a bounded runtime smoke test of KI diagnostics and skill readability. Record what ran and what remained unverified.
4. Reconcile repository-owned recurring definitions with existing Paperclip routines and seek approval for any exact schedule or write.
5. Keep the KIS delivery pilot and Techné held until the principal explicitly changes direction. When the pilot is authorised, revalidate retained work, the [local integration grant](../../AGENTS.md#paperclip-local-delivery), review and destination main before delivery.

For this checkpoint change, run the focused ki-checkpoint audit, Markdown check and Git diff check. Commit only the checkpoint transition; do not push.
