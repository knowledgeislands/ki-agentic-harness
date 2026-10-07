---
id: KI-HARNESS-GOV-147
area: GOV
title: Make the branch durable
kind: deliver
project: paperclip-bootstrap-and-recovery
component: agentic-systems
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-06T23:31:00Z
updated_at: 2026-10-07T14:00:01Z
---

# KI-HARNESS-GOV-147: Make the branch durable

## Goal

The branch, not the worktree, is the durable unit of coordinated work. A coordinated task records only its branch; its worktree is a disposable checkout that coordination recreates from that branch when it is missing, rather than failing. Nothing lives only in a worktree, so removing one is always safe and workspace cleanup becomes mechanical.

## Context

The 2026-10-07 leftovers cleanup of retained Paperclip worktrees found an uncommitted draft, the sandbox socket-path finding now captured as [KI-HARNESS-RTP-019](KI-HARNESS-RTP-019-fit-sandbox-socket-paths.md), existing only in the `KNO-7` Paperclip worktree. Had that worktree been removed, the work would have been lost with no record that it ever existed. Salvage copies from the cleanup are kept in `~/.local/state/ki/state-of-play/salvage/`.

The current coordination standard treats the worktree as the thing to protect. Its [workspace retirement](../../skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md#workspace-retirement) rule forbids any agent from removing a worktree by hand and reads a workspace still on disk as the mechanism declining to destroy unlanded work. That protection is only needed because work may exist nowhere but the checkout. If every agent commits to its task branch before it stops or hands off, the worktree holds nothing the branch does not, and its retention stops being a safety question.

Origin: the `ki-arcadia-principal` checkpoint `+/_CHECKPOINTS/state-of-play.md`, from the same cleanup. Kris approved capture on 2026-10-07 as a separate record rather than a widening of `KI-HARNESS-GOV-115`.

## Boundary

Owner: the `ki-agent-coordination-paperclip` skill and its [coordination standard](../../skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md).

In scope:

- **Branch as the recorded identity.** A coordinated task records its repository and branch; the worktree path is derived, not durable. When the worktree is missing, coordination recreates it from the branch head instead of failing the run.
- **Nothing only in a worktree.** An agent commits its work to the task branch, as a work-in-progress commit if needed, before it stops, pauses or hands off. Uncommitted state at a stop is a defect of the run, not something retention must protect.
- **Mechanical cleanup.** A worktree whose branch is merged or explicitly abandoned is removed. An orphaned or dirty worktree of a departed agent is flagged for disposition, not retained by default.

Out of scope:

- Paperclip provisioner code that recreates a missing worktree. No KI repository owns it, as with the provisioner request `KIS-71` carried for `KI-HARNESS-GOV-115`; this record states the requirement the provisioner must meet.
- Branch deletion and remote-branch policy, which stay with `ki-git` and the existing merge gate.
- Removing, salvaging or pruning any existing worktree or branch. The 2026-10-07 cleanup has already been done under its own approval.
- The base-currency claim and its mechanical check, which remain [KI-HARNESS-GOV-115](KI-HARNESS-GOV-115-require-a-current-base-for-a-coordinated-worktree.md).

## Discussion

### Rules this changes

Each is in the coordination standard unless stated otherwise.

- [Workspace retirement](../../skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md#workspace-retirement), criterion `COORD-9`. "No agent removes a worktree ... by hand" becomes "removing a worktree is safe; deleting an unmerged branch is not". The clean-tree gate becomes a stop-time duty of the run rather than a reason to hold. "A workspace still on disk is therefore not evidence of a leak" is inverted for a worktree whose branch is merged or abandoned, and a dirty or orphaned worktree of a departed agent is flagged rather than held. The held-workspace Triage rule narrows to branches whose state can never pass the merge gate.
- [Workspace model](../../skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md#workspace-model), criterion `COORD-4`. The workspace evidence paragraph records the branch as the durable identity and the worktree as a recreatable checkout, and a new paragraph requires the commit-before-stop duty.
- [Human-readable workspace names](../../skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md#human-readable-workspace-names), criterion `COORD-4`. "Never ... break a restart path" is satisfied by recreating from the branch, so the existing-workspace migration rule no longer needs to preserve directory bindings.
- [Remote delivery prerequisite](../../skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md#remote-delivery-prerequisite) and [Recovery and visibility](../../skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md#recovery-and-visibility), criteria `COORD-6` and `COORD-7`. A programme hold preserves commits on branches; the hold's "uncommitted files" clause and the "missing workspace" caution are restated against branches.
- The runtime decision in the `ki-arcadia-principal` checkpoint `+/_CHECKPOINTS/paperclip-bootstrap-and-recovery.md` to "preserve ... retained worktrees" is superseded for worktrees. That checkpoint is Arcadia Principal's to amend once this record lands; this record does not edit it.

### Relationship to KI-HARNESS-GOV-115

Related, not merged, and neither blocks the other. [KI-HARNESS-GOV-115](KI-HARNESS-GOV-115-require-a-current-base-for-a-coordinated-worktree.md) requires a coordinated worktree's base to be the destination tip at provisioning and reports drift; this record changes what is durable and how worktrees end. A worktree recreated from its branch is subject to the same current-base check, so the two compose. Both add to the standard's workspace model, which is a sequencing preference for whichever lands second, not a build order. Kris kept the records separate so that `GOV-115` keeps its ready scope.

[KI-HARNESS-GOV-114](KI-HARNESS-GOV-114-surface-held-workspaces.md) is also related: its held-workspace listing is the natural surface for the dirty or orphaned worktrees this record flags.

### Open questions

- What signals that an agent has departed, so that its dirty worktree may be flagged rather than treated as in use?
- Should the commit-before-stop duty be enforced by a stop hook, or by a mechanical coordination check on the branch?
- Is an explicitly abandoned branch deleted, retained under a recorded disposition, or tagged before its worktree goes?
