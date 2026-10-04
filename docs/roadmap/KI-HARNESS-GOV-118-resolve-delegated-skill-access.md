---
id: KI-HARNESS-GOV-118
area: GOV
title: Resolve delegated skill access
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-27T16:50:38Z
updated_at: 2026-10-04T19:00:00Z
---

# Resolve delegated skill access

## Goal

A delegating agent can determine how its recipient reaches each required governance skill before sending work, without relying on private memory or discovering an unavailable runtime invocation by failure.

## Context

[KI-ARCADIA-ECO-005](https://github.com/knowledgeislands/ki-arcadia-principal/blob/main/Streams/Roadmap/KI-ARCADIA-ECO-005-record-delegated-skill-access.md) records governance-skill invocation failures during the 22 September 2026 MCP and tools batch. Its 26 September installation observation distinguished installed process skills from governance skills available through the harness. Those are dated observations to recheck, not a universal claim that governance skills can never be invoked by a runtime.

This is the principal delivery record for that outcome. On 27 September 2026 the principal approved relocating delivery ownership here while retaining Arcadia's originating observation. The existing Next / draft position is preserved; this ownership edit neither approves a delivery design nor makes the item Ready.

## Boundary

Own the reusable delegation and skill-access guidance and its verification. Do not install skills, change runtime configuration, introduce a private checkout path as a portable contract, or choose a distribution redesign merely to resolve the observation. Arcadia retains provenance and handoff verification, not a second implementation plan.

## Current state

The originating observation exists, but the supported access route has not been freshly established in each affected runtime. The repository-relative versus runtime-installed discovery boundary must be checked before choosing documentation or implementation changes.

## Steps

- [ ] Reproduce or retire the dated access observations against the supported runtime and installed harness surfaces.
- [ ] Identify the smallest supported access route and resolve whether guidance alone is sufficient.
- [ ] If another repository must change, create or reuse a bounded downstream record there and link both directions before its implementation; do not absorb that repository's implementation here.
- [ ] Prepare the harness guidance and verification plan for human review before marking this record Ready.
- [ ] Following separately approved delivery, verify that a delegating agent can identify the supported access route without trial-and-error invocation.

## Files touched

- `skills/keystone/ki-bootstrap/references/standards-bootstrap.md` - new "Skill access in delegated work" section and contents entry
- `skills/keystone/ki-bootstrap/SKILL.md` - one-line pointer
- `docs/roadmap/KI-HARNESS-GOV-118-resolve-delegated-skill-access.md`

No runtime, host configuration, CLI or Arcadia knowledge files are authorised by this record.

## Verify

Exercise representative delegation instructions against the supported access route, including an unavailable invocation and its documented fallback. Run the relevant focused skill audits, harness tests and TypeScript gate for the reviewed implementation. Do not generalise evidence from one runtime to all runtimes.

## Dependencies / blocks

Arcadia's KI-ARCADIA-ECO-005 is the origin, not a build-order blocker. There is no known downstream implementation requirement yet. This principal record owns the overall outcome and integration evidence; any later downstream record owns only its repository-local deliverable and verification. Cross-repository relationships are recorded in prose, not local dependency arrays.

## Documentation impact

### Decision Records

No new decision is made by this ownership change. Assess whether a distribution or authority choice needs a Decision Record during planning.

### Specifications

Change an accepted access contract only if the reviewed solution requires it; do not turn a dated environment observation into a requirement.

### Guides

Make the supported route discoverable from the delegation guidance rather than keeping it in an agent's private memory.

### Roadmap

Keep the reciprocal Arcadia origin link and any later downstream links current. Closing a handoff or downstream ticket does not accept this principal outcome.

## Plan - 2026-10-04

Remedy: guidance only. No runtime, installation or CLI change; the dangling-projection detection gap stays with `tools-ki` and needs no downstream record from this item, so Step 3 closes with "no downstream record required".

Home: `ki-bootstrap`, because it is the one skill every recipient can invoke whatever its start directory, and its standard already owns the user-versus-repository activation model. `ki-delegation` activates only for durable high-risk packets and `ki-subagents` defines reusable roles, so neither reaches ordinary handoffs. The new section links the Paperclip "repository skills are the execution baseline" rule rather than duplicating it.

Content: a recipient invokes only user-scope process skills plus its start repository's projection; a delegator names each required governance skill with a readable source path in the target projection or the canonical harness source; the recipient reads rather than trial-invokes; `ki repo audit --skill <name>` needs no runtime invocation. Evidence stays dated per runtime: Claude Code and Codex on 2026-10-04, Cowork an explicit gap.

Verification: `ki repo audit --skill ki-skills`, `--skill ki-authoring` and `--skill ki-work-roadmap` (`ki-bootstrap` is invocation-only and has no audit catalogue; record the CLI result), `bun run test`, `bunx tsc --noEmit`, and a representative check that a governance skill absent from a recipient's list is readable at the named path.

Readiness: plan approved, and the Step 4 human-review gate satisfied, by the Fable reviewer under delegated autonomy (2026-10-04), reversible.

### Access observation - 2026-10-04 (Codex)

User scope `~/.agents/skills` links only the seven process skills; governance skills reach a Codex session only through the start repository's ignored `.agents/skills/` projection (for example `mcp-git-audit`'s). This matches the Claude Code observation below. Cowork was not exercised.

## Discussion

### Access observation - 2026-10-04 (Claude Code)

This observation covers part of Step 1 for Claude Code only. Codex and Cowork were not exercised.

- User scope: `~/.claude/skills` and `~/.agents/skills` link only the seven process skills (`ki-accept`, `ki-batch`, `ki-bootstrap`, `ki-implement`, `ki-next`, `ki-plan`, `ki-recap`).
- Project scope: governance skills reach a Claude Code session only through the ignored `.claude/skills/` projection of the repository the session started in. A delegated subagent launched from an `ki-arcadia-principal` session to work in `ki-agentic-harness` saw Arcadia's declared set. That set includes `ki-repo-kb-streams` but excludes the target's `ki-skills`, `ki-work-roadmap`, `ki-delegation` and `ki-guides`. The recipient's invocable skills therefore depend on the delegator's start directory, not on the target repository's declarations.
- Projection hygiene: both `ki-agentic-harness` projections (`.claude/skills/` and `.agents/skills/`) held seven dangling links to retired skill names. These were `ki-change-management`, `ki-change-management-housekeeping`, `ki-change-management-roadmap`, `ki-feature-definitions`, `ki-harness`, `ki-housekeeping-granola` and `ki-roadmap`. `ki-arcadia-principal` held five more. `ki repo diag` and `ki repo repair --dry-run` both reported the harness healthy while the links were present. The harness links were removed locally, as ignored projection state. The detection gap belongs to `tools-ki`.
- Workable fallback: a recipient can always read `<target>/.claude/skills/<name>/SKILL.md` or the installed harness source directly. The `ki` CLI audits do not depend on skill invocation.
- Implication for Step 2: guidance alone may be enough if delegation packets name the target repository's projection path for any skill missing from the recipient's list. Whether that is the supported route, or whether runtime-scoped discovery needs a host change, is still the planning decision for the owner.

### Pickup checkpoint — 2026-09-27

- Verified partial guidance delivery since the earlier audit: `7d7b247d674846244d74f29dfccc33988ab8c6c6` adds [repository skills as the execution baseline](../../skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md#repository-skills-are-the-execution-baseline) and judgment criterion `COORD-10`. It distinguishes declarations, runtime discovery and company skill assignment, requires actual-workspace verification, and describes supported canonical-source access or an explicit provisioning prerequisite without bypassing access boundaries.
- Remaining: this is Paperclip-facing guidance, not proof that the dated delegation failures are resolved in every affected runtime. Reproduce or retire those observations, test the actual recipient’s access and unavailable-invocation fallback, and determine whether generic delegation guidance or a bounded downstream change remains necessary. No runtime was provisioned or exercised by this audit.
- Closure route: preserve Next / draft and the existing principal-owner split. Reconcile this delivered guidance during planning before seeking readiness approval; later delivery still requires representative verification and explicit owner acceptance. Do not create a competing principal ticket or duplicate the existing coordination guidance.

Evidence scope: inspected local `main` at `0ad0377a0e7e14b1cd7314bce414d4871b062efc` on 2026-09-27. The read-only probe of `http://127.0.0.1:3100/api/health` could not connect; live tasks, current claims and runtime configuration were not verified. The local Git worktree registry was inspected, not every retained worktree’s contents. Before further implementation, reconcile the current destination branch, linked coordination tasks and retained worktrees where applicable, including reachability, patch equivalence and uncommitted work. Missing evidence does not release ownership or lift a hold. This checkpoint is guidance, not a mechanical execution block or a grant to resume. Lifecycle, checkboxes and ownership remain unchanged; retain any later done record until the principal explicitly selects pruning.

### Choice of remedy

Documenting a supported repository-local access route and making skills runtime-invocable are alternatives, not interchangeable commitments. Decide from fresh evidence and ownership boundaries. A CLI or installation defect, if established, needs its own downstream ticket in the implementation owner rather than a second principal record.
