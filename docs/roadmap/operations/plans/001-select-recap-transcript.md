---
id: '001'
title: Select the recap grounding transcript explicitly
status: in-progress
roadmap: operations/let-ki-recap-accept-an-explicit-transcript-selector
blocks: —
blocked-by: —
---

## Context

`ki-recap` must ground its claims in the transcript the caller intends, even when another session in the same repository is newer.

## Current state

The helper selects the newest `.jsonl` transcript by modification time and exposes no caller-selected session.

## Steps

1. [ ] Add a safe explicit transcript selector that resolves only an existing `.jsonl` beneath the selected repository's transcript directory.
2. [ ] Retain newest-by-time selection only when no selector is supplied and reject invalid, escaping, or missing selectors.
3. [ ] Add two-session behavioural coverage and update `ki-recap` invocation guidance.
4. [ ] Run focused tests and the relevant audit, then commit the independent change.

## Files touched

- `skills/process/ki-recap/scripts/recap-grounding.ts`
- `skills/process/ki-recap/scripts/recap-grounding.test.ts`
- `skills/process/ki-recap/SKILL.md`
- `skills/process/ki-recap/references/recap.md`

## Verify

- The selector chooses the named older session over a newer concurrent one.
- Invalid, absent, and escaping selectors fail safely.
- Existing no-selector behaviour remains intact.

## Dependencies / blocks

Independent of the Educate migration.
