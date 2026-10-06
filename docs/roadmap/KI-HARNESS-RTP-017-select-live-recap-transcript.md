---
id: KI-HARNESS-RTP-017
area: RTP
title: Select live recap transcript
theme: runtime-portability
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: 9876daf2db220b4a3c689241a1e047ca8630f807
created_at: 2026-10-05T17:29:03Z
updated_at: 2026-10-06T11:50:00Z
---

# KI-HARNESS-RTP-017: Select live recap transcript

## Goal

Make live recaps use relevant session evidence without scanning the whole transcript archive for each repository. Prefer the invoking runtime's own session transcript when it can be identified, and keep current Git grounding available when relevant transcript evidence cannot be obtained within a bounded discovery pass.

## Context

On 2026-10-05 a Claude Code session launched from `ki-arcadia-principal` audited and conformed `mcp-ki-kb-fs`, then ran `/ki-recap` against that target. `scripts/recap-grounding.ts` derives the Claude candidate directory from the target repository path only, and no Claude project directory existed for `mcp-ki-kb-fs`. Detection therefore combined zero Claude candidates with Codex candidates whose session metadata named the target, and selected a Codex transcript from 2026-08-22 as newest. Git evidence remained correct; the transcript tally and markers were irrelevant to the live thread.

The Claude Code environment exposes `CLAUDE_CODE_SESSION_ID`, and the invoking transcript is `~/.claude/projects/<launch-root-slug>/<id>.jsonl`. The skill already treats transcript evidence as advisory and says selection does not identify the invoking thread; this item asks whether detection can identify it when the runtime supplies a session identity, and otherwise decline rather than substitute another runtime's history.

The five-tool consistency recap exposed a related discovery-cost problem: default helper invocations for six repositories did not finish promptly, so the session stopped its own scans and obtained Git-only evidence using an empty temporary transcript directory. Static inspection of `scripts/recap-grounding.ts` shows that `codexCandidates` recursively discovers JSONL files and calls `readJsonl` on each to check its repository; `readJsonl` reads and parses the complete file. This establishes repeated whole-file discovery work, not a measured attribution of elapsed time or a guarantee that transcript selection alone removes the cost.

## Boundary

This item covers live-session selection and bounded discovery within the existing grounding helper (`skills/change-management/ki-recap/scripts/recap-grounding.ts`) and the `ki-recap` documentation that describes it. It does not change Git grounding authority, the transcript-advisory contract, the repository-evidence marker, or the `ki-checkpoint` hand-off; mine historical transcripts; introduce a background index, cache or service; or add a Codex live-session locator. Codex has no documented session-identity variable, so Codex selection stays repository-matched discovery, now bounded.

## Current state

- Claude candidates come only from `~/.claude/projects/<slug>/`, where the slug is derived from the target repository path by replacing `/` and `.` only. The live session's transcript lives under the launch directory's project folder, so a recap of another repository never sees it.
- `--runtime detect` merges those Claude candidates with Codex candidates and picks the newest. With no Claude project directory for the target, it silently selected a weeks-old Codex transcript.
- Discovery reads and parses every candidate file in full: `claudeCandidates` calls `readJsonl` on each file in the project directory, and `codexCandidates` does so recursively for every file below `~/.codex/sessions/`. On the development host that archive holds 1,734 files totalling 6.6 GB; every `session_meta` record is the first line, with a 95th-percentile length of about 19.6 KB and a maximum of about 38 KB (measured 2026-10-06).
- The selected transcript is then parsed twice, once for tool calls and once for marker outputs.
- Claude Code documents `CLAUDE_CODE_SESSION_ID` as set in Bash, PowerShell, hook and stdio MCP subprocesses and as matching the hook `session_id` (updated on `/clear`). It documents transcripts at `<config>/projects/<project>/<session-id>.jsonl`, where `<config>` is `CLAUDE_CONFIG_DIR` or `~/.claude`, and `<project>` is the working directory with every non-alphanumeric character replaced by `-`, truncated with a hash beyond 200 characters, or named by `CLAUDE_CODE_PROJECT_DIR_NAME`. A session moved with `/cd` relocates its transcript. The entry format is internal and version-sensitive.

## Steps

- [x] **Live Claude locator.** When the helper runs under an identified Claude Code session (`CLAUDE_CODE_SESSION_ID` present), and the caller has not forced `--runtime codex` or named `--transcript`, locate `<session-id>.jsonl` as a regular file directly inside one project directory under the Claude projects root (`CLAUDE_CONFIG_DIR/projects` or `~/.claude/projects`), or directly inside `--transcripts-dir` when given. Search every project directory rather than deriving the launch slug, so path truncation, `CLAUDE_CODE_PROJECT_DIR_NAME` and `/cd` relocation do not matter. Exactly one match selects that transcript regardless of the target repository. No match, several matches, or a malformed identifier produce no transcript, with an explicit reason, and never fall back to Codex or to another Claude session.
- [x] **Runtime policy.** In `detect`, a session identity or `CLAUDECODE=1` identifies the invoking runtime as Claude Code. Without the identity, `CLAUDECODE=1` limits selection to the target's Claude project directory and never substitutes Codex history. Only when no runtime is identified does `detect` keep its current newest-across-both behaviour. `--runtime claude` uses the live locator when an identity exists; `--runtime codex` and `--transcript` keep explicit repository-matched selection.
- [x] **Bounded discovery.** List candidates by directory metadata only, keeping the regular-file (no symlink) rule, and order them newest first by modification time. Read at most a 64 KiB prefix of each candidate to check its eligibility from complete lines only, and stop at the first eligible match. That gives the same result as the old newest-of-all rule, because candidates are checked newest first. With `--transcript`, filter by basename before reading anything. Cap header inspection at 256 files per runtime. Reaching the cap without a match makes transcript evidence unavailable, with a `discovery-limit` reason, rather than claiming there is no transcript. Parse the selected transcript body once, after selection.
- [x] **Slug correction.** Derive the target's Claude project directory by replacing every non-alphanumeric character with `-`, under the configured Claude root, which matches the documented rule.
- [x] **Selection evidence.** Emit `transcriptSelection` in JSON (and one line of text output) with `method` (`live-session`, `newest-eligible`, `explicit` or `none`), an optional `reason`, `examined` (headers read) and `limitReached`. Git grounding fields and the marker comparison stay unchanged.
- [x] **Tests.** Add boundary tests with temporary `HOME` and `CLAUDE_CONFIG_DIR` directories and a scrubbed child environment, so no test reads the real `~/.claude` or `~/.codex`, or inherits the live session identity. Cover: live-session selection when the target has no Claude project directory, despite a newer Codex candidate; declining when the identified transcript is missing or duplicated; `CLAUDECODE=1` without an identity never selecting Codex; early exit after one header in a many-file archive containing a large eligible transcript; the discovery cap producing explicit unavailability; an oversized header being ineligible; explicit `--runtime codex` and `--transcript` behaviour preserved; and Git grounding unchanged when transcript evidence is declined.
- [x] **Documentation.** Update `ki-recap` `SKILL.md`, the grounding section of `references/standards-session-recap.md`, the helper header, and `references/sources.md` (add the Claude Code environment-variables source and the 2026-10-06 review) to describe live-session preference, declining, the bounds and the unchanged advisory contract.
- [x] Run Verify, write the review packet, and set the record to `awaiting-review`.

## Files touched

- `skills/change-management/ki-recap/scripts/recap-grounding.ts`
- `skills/change-management/ki-recap/scripts/recap-grounding.test.ts`
- `skills/change-management/ki-recap/SKILL.md`
- `skills/change-management/ki-recap/references/standards-session-recap.md`
- `skills/change-management/ki-recap/references/sources.md`
- This record

## Verify

- `bun test skills/change-management/ki-recap` passes, including the new boundary tests, and asserts bounded work through `transcriptSelection.examined` rather than wall-clock time.
- `bun run test`, `bunx tsc --noEmit` and `bunx biome check .` pass.
- `ki repo audit --repo . --progress never --concise` reports FAIL=0.
- A manual run of the helper from this Claude Code session against a repository with no Claude project directory selects this session's transcript through `live-session`, or reports a declined reason. It never selects a Codex transcript.

## Dependencies / blocks

No roadmap dependency. Builds on the documented Claude Code `CLAUDE_CODE_SESSION_ID` and transcript-location contract (see `references/sources.md`).

## Documentation impact

### Decision Records

None. The selection policy is a helper behaviour inside the existing advisory contract.

### Specifications

None.

### Guides

`ki-recap` `SKILL.md` and `references/standards-session-recap.md` § 1, as above.

### Roadmap

Closes this record on acceptance. A Codex live-session locator is out of scope until Codex documents a session-identity variable.

## Review

### Delivered

- `recap-grounding.ts` selects the identified Claude Code session's own transcript (`CLAUDE_CODE_SESSION_ID`) by probing every project directory under `CLAUDE_CONFIG_DIR/projects` or `~/.claude/projects`, or only `--transcripts-dir` when given. A missing, duplicated or malformed identity yields no transcript with the reason `live-session-transcript-not-found`, `live-session-transcript-ambiguous` or `live-session-identity-invalid`; it never falls back to Codex or another session.
- Under `detect`, `CLAUDECODE=1` without an identity restricts selection to the target's Claude project directory. Only an unidentified runtime compares both runtimes. `--runtime codex` and `--transcript` keep explicit repository-matched selection; under `detect` a `--transcript` selector searches both runtimes even inside Claude Code.
- Discovery lists candidates from directory metadata only (regular files, no symlinks), orders them newest first, reads at most a 64 KiB prefix per candidate, checks eligibility from complete lines only, and stops at the first eligible match. It inspects at most 256 headers per runtime; reaching the cap reports `discovery-limit` rather than claiming no transcript exists. The selected body is parsed once.
- The target's Claude project slug now replaces every non-alphanumeric character with `-`, matching the documented rule.
- JSON output carries `transcriptSelection` (`method`, optional `reason`, `examined`, `limitReached`); text output adds one selection line. Git grounding and the marker comparison are unchanged.
- `SKILL.md`, `references/standards-session-recap.md` § 1 and `references/sources.md` describe the live-session preference, declining, the bounds, and the 2026-10-06 Claude Code environment-variable evidence.

### Change Summary

Baseline `9876daf2db220b4a3c689241a1e047ca8630f807`. Six files: the helper and its tests, three `ki-recap` documentation files, and this record. Seven new boundary tests in two `describe` blocks, and a review-fix commit adding three more (a Codex selector inside Claude Code, a declining `--runtime claude` with an identity, and the live locator under `--transcripts-dir`), a comment that the 256 cap bounds header reads but not the metadata listing, and removal of an unused `CODEX_HOME` scrub; the existing tests now run in a scrubbed child environment with a fixture `HOME`, so none reads the real `~/.claude` or `~/.codex` or inherits the live session identity.

### Verification

- `bun test skills/change-management/ki-recap`: 22 pass, 0 fail after the review fixes (20 before).
- `bun run test`: 901 pass, 0 fail across 145 files after the review fixes.
- `bunx tsc --noEmit`: clean.
- `bunx biome check .`: no errors; the six remaining warnings are pre-existing in `ki-repo` and `ki-repo-kb` files outside this change.
- `ki repo audit --repo . --progress never --concise`: the delivery worktree reports environmental FAILs only (the worktree path is not in the local KI registry); the primary checkout, with this branch fast-forwarded onto main, reports FAIL=0.
- Manual runs from this Claude Code session: against `mcp-ki-kb-fs` (no Claude project directory) the helper reported `live-session` with 0 headers examined and selected this session's transcript. Forcing `--runtime codex` for `mcp-ki-kb-fs` against the real 6.6 GB archive took 0.29 s and reported `none (discovery-limit)` after 256 headers; the previous helper took 18.4 s and selected the unrelated 2026-08-22 transcript. For `ki-agentic-harness` without an identity, `newest-eligible` after 5 headers in 0.27 s.

### Outstanding concerns

- The Claude transcript entry format remains internal and version-sensitive; transcript evidence stays advisory.
- After `--continue` or an ID-less `--resume`, Claude Code documents that `CLAUDE_CODE_SESSION_ID` may carry the initial startup ID; the locator then selects that transcript or declines, never a different runtime's history.
- A subagent shares its parent's session identity, so a recap run from a subagent selects the parent session's transcript.

### Post-change review

The goal is met: an identified Claude Code session grounds on its own transcript or declines, and discovery is bounded and reports its work. Scope matches the plan. Regression risk is limited to transcript selection, which stays advisory; Git grounding is unchanged.

Independent review by a Fable subagent found no blocking issues, 20 of 20 tests passing. One should-fix: under `CLAUDECODE` or a session identity, `detect` narrowed a `--transcript` selector to Claude only, contradicting the plan and the documentation. Fixed, with a test naming a Codex basename inside Claude Code. Its nits are also addressed: a decline test for `--runtime claude` with an identity, live-locator tests under `--transcripts-dir` (found and not found), a comment that the header cap does not bound the metadata listing, removal of the unused `CODEX_HOME` scrub, and a re-run of the audit on the rebased branch. Ready for acceptance.

### Mini recap

KI-HARNESS-RTP-017 (`docs/roadmap/KI-HARNESS-RTP-017-select-live-recap-transcript.md`) delivered live-session transcript selection and bounded discovery in the `ki-recap` grounding helper, verified by the boundary tests and the full suite above. No learning is proposed for promotion outside this record.

## Done

Accepted 2026-10-06 by Kris Brown on the review packet above.

## Discussion

### Live-session selection

Captured on 2026-10-05 from the `mcp-ki-kb-fs` audit-and-conform recap session, which routed the observation here as a `ki-recap` learning. It neither blocks nor is blocked by work in `mcp-ki-kb-fs`.

### Bounded discovery

The user approved extending this existing item with bounded transcript discovery rather than creating another roadmap record. Preserve the regular-file, repository-eligibility and unambiguous-selector checks. Prefer a verified live-session locator when available; otherwise inspect only the metadata needed for eligibility within explicit work bounds, and parse transcript bodies only after selection. When the bound is reached or session identity remains uncertain, return current Git evidence with transcript evidence explicitly unavailable rather than substituting unrelated history or claiming completeness.

Planning should choose and document the discovery bounds and fallback behaviour. Verification should use disposable archives with many unrelated or large transcripts and assert bounded discovery work, correct selection or explicit unavailability, and unchanged Git grounding without relying solely on wall-clock thresholds. A cross-repository recap should not repeat a full archive-body parse for every target. The observed workaround is evidence for this proposal, not a new standing procedure.

### Adoption and readiness - 2026-10-06

The owner adopted this record from Triage into Now and approved it through Ready and delivery (Kris, 2026-10-06: "KI-HARNESS-RTP-017 - adopt it and push it through"). Acceptance remains with `ki-accept`.

The Triage boundary routed the environment variable's stability to `ki-tokenomics` runtime-adapter evidence. Both tokenomics adapters explicitly treat transcript state as unavailable and do not own transcript locators, so planning recorded the vendor evidence where the helper already cites its transcript sources: `ki-recap` `references/sources.md`. Claude Code documents `CLAUDE_CODE_SESSION_ID` as a supported variable. Codex documents no equivalent, so this item adds no Codex live-session locator.

The bounds are chosen from the measured archive: a 64 KiB header prefix exceeds the largest observed `session_meta` line by about 70 per cent, and newest-first early exit means a typical run reads one or a few headers. The 256-file cap limits a run with no match to about 16 MiB of header reads, instead of the 6.6 GB a full parse would read.

### Acceptance - 2026-10-06

Kris Brown approved closure on 2026-10-06 ("adopt it and push it through"). The rebase onto main before publication rewrote the plan commit, so `baseline_ref` names the published plan commit. The Fable review outcome and its dispositions are recorded under Post-change review; no finding remained open at acceptance.
