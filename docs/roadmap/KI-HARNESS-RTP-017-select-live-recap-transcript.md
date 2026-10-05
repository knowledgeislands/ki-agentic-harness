---
id: KI-HARNESS-RTP-017
area: RTP
title: Select live recap transcript
theme: runtime-portability
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-05T17:29:03Z
updated_at: 2026-10-05T17:29:03Z
---

# KI-HARNESS-RTP-017: Select live recap transcript

## Goal

Make `ki-recap`'s grounding helper prefer the invoking runtime's own session transcript under `--runtime detect`, so a live recap does not report an unrelated runtime's stale transcript as its advisory evidence.

## Context

On 2026-10-05 a Claude Code session launched from `ki-arcadia-principal` audited and conformed `mcp-ki-kb-fs`, then ran `/ki-recap` against that target. `scripts/recap-grounding.ts` derives the Claude candidate directory from the target repository path only, and no Claude project directory existed for `mcp-ki-kb-fs`. Detection therefore combined zero Claude candidates with Codex candidates whose session metadata named the target, and selected a Codex transcript from 2026-08-22 as newest. Git evidence remained correct; the transcript tally and markers were irrelevant to the live thread.

The Claude Code environment exposes `CLAUDE_CODE_SESSION_ID`, and the invoking transcript is `~/.claude/projects/<launch-root-slug>/<id>.jsonl`. The skill already treats transcript evidence as advisory and says selection does not identify the invoking thread; this item asks whether detection can identify it when the runtime supplies a session identity, and otherwise decline rather than substitute another runtime's history.

## Boundary

This is unadopted Triage work. It does not change Git grounding authority, the transcript-advisory contract, or `ki-checkpoint` hand-off. Any Codex equivalent and the environment variable's stability belong to `ki-tokenomics` runtime-adapter evidence before planning.

## Discussion

Captured on 2026-10-05 from the `mcp-ki-kb-fs` audit-and-conform recap session, which routed the observation here as a `ki-recap` learning. It neither blocks nor is blocked by work in `mcp-ki-kb-fs`.
