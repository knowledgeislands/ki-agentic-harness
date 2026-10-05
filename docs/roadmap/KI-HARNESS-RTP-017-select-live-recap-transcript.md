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
updated_at: 2026-10-05T20:41:58Z
---

# KI-HARNESS-RTP-017: Select live recap transcript

## Goal

Make live recaps use relevant session evidence without scanning the whole transcript archive for each repository. Prefer the invoking runtime's own session transcript when it can be identified, and keep current Git grounding available when relevant transcript evidence cannot be obtained within a bounded discovery pass.

## Context

On 2026-10-05 a Claude Code session launched from `ki-arcadia-principal` audited and conformed `mcp-ki-kb-fs`, then ran `/ki-recap` against that target. `scripts/recap-grounding.ts` derives the Claude candidate directory from the target repository path only, and no Claude project directory existed for `mcp-ki-kb-fs`. Detection therefore combined zero Claude candidates with Codex candidates whose session metadata named the target, and selected a Codex transcript from 2026-08-22 as newest. Git evidence remained correct; the transcript tally and markers were irrelevant to the live thread.

The Claude Code environment exposes `CLAUDE_CODE_SESSION_ID`, and the invoking transcript is `~/.claude/projects/<launch-root-slug>/<id>.jsonl`. The skill already treats transcript evidence as advisory and says selection does not identify the invoking thread; this item asks whether detection can identify it when the runtime supplies a session identity, and otherwise decline rather than substitute another runtime's history.

The five-tool consistency recap exposed a related discovery-cost problem: default helper invocations for six repositories did not finish promptly, so the session stopped its own scans and obtained Git-only evidence using an empty temporary transcript directory. Static inspection of `scripts/recap-grounding.ts` shows that `codexCandidates` recursively discovers JSONL files and calls `readJsonl` on each to check its repository; `readJsonl` reads and parses the complete file. This establishes repeated whole-file discovery work, not a measured attribution of elapsed time or a guarantee that transcript selection alone removes the cost.

## Boundary

This is unadopted Triage work, covering live-session selection and bounded discovery within the existing grounding helper. It does not change Git grounding authority, the transcript-advisory contract, or `ki-checkpoint` hand-off; mine historical transcripts; introduce a background index or service; or confer implementation authority. Any Codex equivalent and the environment variable's stability belong to `ki-tokenomics` runtime-adapter evidence before planning.

## Discussion

### Live-session selection

Captured on 2026-10-05 from the `mcp-ki-kb-fs` audit-and-conform recap session, which routed the observation here as a `ki-recap` learning. It neither blocks nor is blocked by work in `mcp-ki-kb-fs`.

### Bounded discovery

The user approved extending this existing item with bounded transcript discovery rather than creating another roadmap record. Preserve the regular-file, repository-eligibility and unambiguous-selector checks. Prefer a verified live-session locator when available; otherwise inspect only the metadata needed for eligibility within explicit work bounds, and parse transcript bodies only after selection. When the bound is reached or session identity remains uncertain, return current Git evidence with transcript evidence explicitly unavailable rather than substituting unrelated history or claiming completeness.

Planning should choose and document the discovery bounds and fallback behaviour. Verification should use disposable archives with many unrelated or large transcripts and assert bounded discovery work, correct selection or explicit unavailability, and unchanged Git grounding without relying solely on wall-clock thresholds. A cross-repository recap should not repeat a full archive-body parse for every target. The observed workaround is evidence for this proposal, not a new standing procedure.
