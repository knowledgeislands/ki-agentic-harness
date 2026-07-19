---
id: 'RTP-001'
title: Add Codex transcript grounding to ki-recap
status: open
roadmap: runtime-portability/add-codex-transcript-grounding-to-ki-recap
blocks: —
blocked-by: —
---

## Context

`ki-recap` is installed for both Claude Code and Codex, but its mechanical grounding helper only discovers Claude transcripts under `~/.claude/projects/` and only understands Claude `tool_use` records. A Codex recap therefore loses its transcript-derived tool tally and high-cost signals even though Codex stores repository-associated JSONL sessions under `~/.codex/sessions/`.

## Current state

The helper derives one flat Claude project directory from the repository path, selects a regular `.jsonl` file there, and parses Claude content blocks. It has no runtime field, provider abstraction, recursive session discovery, Codex repository filter, or Codex call parser. Existing Claude behavior and selector hardening are covered by focused tests and must remain intact.

## Steps

1. Add `claude` and `codex` transcript providers behind one small runtime-neutral candidate model. Default to `detect`, choosing the newest matching regular transcript; retain `--runtime claude|codex` as an explicit override.
2. Discover Codex JSONL recursively below `~/.codex/sessions/`, accepting only sessions whose `session_meta.payload.cwd` resolves to the target repository. Keep transcript selectors basename-only, regular-file-only, and constrained to matching candidates.
3. Normalise Claude `message.content[].tool_use` and Codex `response_item` function/custom-tool calls into the existing `ToolCall` shape, then preserve the shared tally and repeated-call analysis. Include the selected runtime in grounding output.
4. Add synthetic Claude and Codex fixtures covering detection, forced runtime selection, repository filtering, concurrent-session selection, malformed records, and selector rejection. Update `SKILL.md` and the recap procedure with the runtime-neutral invocation.
5. Run the focused helper test, formatting/type checks for the touched files, and a direct smoke test against a local Codex session for this repository.

## Files touched

- `skills/process/ki-recap/SKILL.md`
- `skills/process/ki-recap/references/recap.md`
- `skills/process/ki-recap/scripts/recap-grounding.ts`
- `skills/process/ki-recap/scripts/recap-grounding.test.ts`

## Verify

- `bun test skills/process/ki-recap/scripts/recap-grounding.test.ts`
- `bunx biome check skills/process/ki-recap`
- `bun skills/process/ki-recap/scripts/recap-grounding.ts --json --runtime codex`

## Dependencies / blocks

This plan has no external dependency. It blocks treating the globally installed process-skill set as runtime-portable.
