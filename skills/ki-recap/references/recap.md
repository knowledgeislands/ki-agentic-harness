# Recap procedure

_On-demand procedure for `ki-recap`. The kind, scope, and leg summary live in [`SKILL.md`](../SKILL.md) and are already loaded; this file is the full procedure._

## 1. Run the grounding helper

```bash
bun skills/ki-recap/scripts/recap-grounding.ts --json
```

(From another repo, use the harness-absolute path, per the "Audit script paths" convention: `bun /path/to/ki-agentic-harness/skills/ki-recap/scripts/recap-grounding.ts --json`.)

This emits `filesTouched` (git status), `diffStat`, `toolTally`, and `highCostCandidates` (repeated identical calls, large-file re-reads). It is a **helper**, not a checker — treat its output as raw signal to combine with warm in-session context, not a verdict.

## 2. Summarise

Using warm context plus the helper's `filesTouched` / `diffStat`: state what changed, what was decided, and why — in the order it happened, not a topic reshuffle. Keep it to what a reader picking this up cold would need: no blow-by-blow tool narration.

## 3. Surface what is outstanding

Look for threads left mid-change: uncommitted edits, a failing gate, a decision still open, work neither done nor parked. **Ground every "uncommitted" or "still dirty" claim in the `filesTouched` from the grounding helper run at the start of _this_ recap, never in a `git status`/`git diff` seen earlier in the conversation** — commits (yours or a concurrent process's) can land between that earlier look and the recap itself, and stale context reads as a false outstanding item. If meaningful time has passed since step 1 ran, re-run it before finalizing this section. Apply the house rule:

- A ROADMAP item **added during this session** counts as **what happened** (parking work on ROADMAP is a completed action — the roadmap is the durable home for deferred work), not as outstanding.
- A `ki-plan` opened this session with unchecked Steps **is** outstanding — cite its id and status.
- If something outstanding warrants a plan or a ROADMAP line and doesn't have one yet, say so and offer to create it (via `ki-plan new` or a ROADMAP edit) rather than silently letting it drop.

## 4. Harvest the learnings, and route each

For each dead-end, workaround, or convention discovered this session, route it to its proper home — **confirm with the user before writing anywhere durable**:

| Learning shape | Route to |
| --- | --- |
| Repeated dead-end, big-file re-read, tool-arg gotcha (mechanical, local) | `CLAUDE.md` learned-pattern entry — hand into `headroom learn`'s `<!-- headroom:learn:start -->` block, **never duplicate it** |
| Checker or rubric gap (a mechanical criterion missing or wrong) | A skill fix, or a new rubric criterion (mind the code-numbering caution: scan both the rubric and the linter for the next code) |
| A recurring task that could be delegated | A new or updated agent |
| An automatable guardrail (something that should block, not just advise) | A hook |
| Deferred work with no home yet | `ROADMAP.md`, or a `ki-plan` if it's multi-step |
| A durable cross-project fact about the user, feedback, or this project | Memory (per the auto-memory system's four types) — never duplicate what's already in a `CLAUDE.md` |

Use `highCostCandidates` from the grounding helper as a starting list, not the full set — warm context surfaces things the helper cannot see (a design dead-end, a rejected approach).

## 5. Compress (only when `--compress` is passed)

Write a carry-forward digest of the recapped span:

```markdown
## Context

<why this span of work happened>

## Decisions

<decisions made, one line each>

## Files Touched

<paths, from the grounding helper's filesTouched/diffStat>

## Outstanding

<from step 3>

## Learnings Routed

<from step 4, one line per learning: what it was, where it went>

## Keywords

<comma-separated terms for future retrieval>
```

State plainly that this digest is a **carry-forward artefact**, not a context-window reduction — the live window is unchanged. True in-context compression is native compaction or a `PreCompact` hook (`ki-tokenomics`'s domain); this skill does not attempt either.
