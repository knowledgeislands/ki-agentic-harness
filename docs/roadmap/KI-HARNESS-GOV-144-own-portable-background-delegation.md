---
id: KI-HARNESS-GOV-144
area: GOV
title: Own portable background delegation
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-06T22:54:11Z
updated_at: 2026-10-06T22:54:11Z
---

# KI-HARNESS-GOV-144: Own portable background delegation

## Goal

Anyone running Knowledge Islands work through an agent can delegate substantive work to detached background agents by following one runtime-neutral contract in `ki-delegation`, with each supported agentic system adding only a minimal shim for how it launches and monitors those agents.

## Context

Kris approved on 2026-10-07 capturing his working approach to delegation in two places: an interim personal default in chezmoi and this harness record. The approach was practised throughout the state-of-play review (`ki-arcadia-principal`, `+/_CHECKPOINTS/state-of-play.md`), whose agent prompts, statuses and reports live under `~/.local/state/ki/state-of-play/`. The approach is:

- Substantive work goes to detached background agents that survive an interrupt of the main thread. In Claude Code, in-session background subagents run under the launching turn and die with it, even when their tasks still look live.
- Each agent has a prompt file and a pid file, overwrites a one-line status file (`HH:MM CEST - plain-language activity`) at each change of activity and at least every two minutes, writes a short plain-language report, then writes `DONE` as the last line of its status file.
- The main thread stays non-blocking: one monitor emits a single line every two minutes with each agent's status and ends with `ALL FINISHED`, flagging any agent whose process exited without `DONE`.
- The user sees only the one-line status updates and a final Done / Failed / Needs you summary; no tooling output, commit SHAs or step narration.
- After an interrupt, check the agent processes before saying anything is running; relaunch rather than wait.
- Agents commit locally with explicit paths only; never push, prune, accept or delete without express authority; and stop and report rather than guess.

`skills/governance/ki-delegation` today owns only durable delegation packets for approved high-risk work, and its standard says a packet "is not required for routine runtime delegation". It has no contract for the execution-time packet (prompt, status, report, completion marker), the monitor cadence or the reporting shape.

The harness binds agentic systems through recognised runtime identifiers in `[skills.ki-repo].supported_runtimes` (`claude-code`, `claude-desktop`, `chatgpt-codex`) and through runtime-binding skills that declare `ki-runtime-binding: true` and `ki-supported-runtimes`, paired with a portable parent (for example `ki-subagents` with `ki-subagents-claude` and `ki-subagents-chatgpt`, or `ki-tokenomics` with its `-claude` and `-chatgpt` adapters), or through a bounded `Runtime binding` section in a mixed contract.

### Interim

Until this lands, the approach lives as Kris's personal Claude Code default in chezmoi commit `a646e9a` (`feat(claude): capture background delegation approach as interim`):

- `dot_claude/private_delegation.md`, imported from `dot_claude/private_CLAUDE.md`, which replaced its "Claude Code runtime" paragraph with a pointer.
- `bin/executable_claude-bg`, a helper with `launch`, `status` and `watch` subcommands that writes under `~/.local/state/claude-bg/<run>/`.

When this record lands, `private_delegation.md` is removed or reduced to a pointer to `ki-delegation`, and `claude-bg` is retired or becomes the Claude Code shim's documented implementation.

## Boundary

In scope:

- Widen `ki-delegation` to own, runtime-neutrally, for all Knowledge Islands use: detached agents that survive an interrupt; the prompt, status, report and `DONE` packet contract; the non-blocking monitor cadence and its exited-without-`DONE` flag; the low-noise reporting shape as it applies to delegated agents; and agent authority limits.
- Define a minimal shim per bound agentic system - at least `claude-code` and `chatgpt-codex`, and `claude-desktop` if it can launch detached agents at all - carrying only runtime-specific launch and monitor mechanics, following the existing runtime-binding pattern.
- Remove or reduce the chezmoi interim to a pointer.

Out of scope:

- Paperclip-coordinated delegation, which `ki-agent-coordination-paperclip` owns.
- Subagent role definition, which `ki-subagents` and its runtime projections own.
- Selecting, authorising or accepting work, which the process skills own.

## Discussion

### Overlaps

Noted rather than merged:

- **Slim-down 1** (approved but unstarted, state-of-play checkpoint): moves communication levels, report shape and the timestamped-update rule from private instructions into a portable skill, probably `ki-authoring`. This record's reporting shape for delegated agents depends on that home; one should cite the other rather than both restate it. No harness record yet exists for Slim-down 1.
- **`ki-delegation` scope:** widening it from high-risk durable packets to routine background execution contradicts its current "not required for routine runtime delegation" rule; shaping must decide whether the execution packet is a second contract in the same skill or a sibling skill.
- **`ki-subagents` and `KI-HARNESS-GOV-102`:** role records and their runtime projections are adjacent; a detached agent's prompt is not a role record.
- **`ki-agent-coordination-paperclip` and `KI-HARNESS-GOV-103`, `GOV-107`, `GOV-114`, `GOV-115`:** Paperclip is another delegation channel with its own isolation, review and integration rules; the authority limits here should be consistent with, not a copy of, those rules.
- **`ki-checkpoint`:** the state-of-play run directory is runtime state, not a checkpoint; the boundary between them should stay explicit.

### Open questions

- Should the execution packet's file layout (`<name>.prompt.md`, `.status`, `.report.md`, `.pid`) be portable, or only its semantics?
- Does a Codex shim need a detachment mechanism of its own, or can one shared launcher serve both runtimes?
- Should `claude-bg` move into the harness or `tools-ki` as the Claude Code shim, or stay a personal chezmoi script?
