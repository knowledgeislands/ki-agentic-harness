---
name: ki-plans
description: >
  Govern the Knowledge Islands planning methodology: when to write a plan, how to phase and sequence work, dependency discipline, and plan quality criteria. Owns the mandate (plan before code for any multi-file or multi-step change), the Next/Soon/Future phasing model, the blocks/blocked-by dependency graph, and the quality bar for Steps and Verify sections. AUDIT checks a repo's plans directory for frontmatter conformance, README sync, and block-reference integrity. CONFORM fixes mechanical issues. REFRESH revisits the methodology. Does not own the plan lifecycle (new/execute/done/status) — that is the /plan slash command. Triggers: "audit plans", "are my plans in order", "should I write a plan for this", "how should I phase this", "plan methodology". Off-ramps: /plan (lifecycle), ki-decision-records (decisions vs. plans), ki-streams (KB stream context).
argument-hint: 'audit [dir] | conform [dir] | refresh'
---

# Knowledge Islands Plans standard

You are applying the **Knowledge Islands Plans standard** — when to plan, how to structure and sequence plans, how dependencies flow, and what a good plan looks like. The format mechanics and lifecycle commands live in `.claude/commands/plan.md`; this skill owns the _methodology_ that makes plans effective.

## What this skill owns

1. **The mandate** — any multi-file or multi-step change requires a plan before code is touched. A plan is the recoverable, dependency-ordered record that survives context resets, onboarding handoffs, and parallel workstreams.
2. **The phasing model** — work is assigned to exactly one phase at a time: Next (highest-impact, nearest-term), Soon (opportunistic, can overlap with Next), or Future (larger, blocked, or calendar-gated). Phase assignment is a statement of current priority, not a promise.
3. **Dependency discipline** — `blocks` and `blocked-by` fields are bidirectional and kept consistent: if plan A blocks B, B's `blocked-by` must list A. The dependency graph in `README.md` is the authoritative execution order. No plan in a `blocked-by` chain may move to `in-progress` before its blockers are `done`.
4. **Plan quality criteria** — see the [quality bar](#plan-quality-bar) section. The four non-negotiables are: concrete Steps, a checkable Verify, an honest Current state, and a minimal Files touched list.
5. **The placement rule** — `docs/plans/` for code repos (KI repo, MCP server, website); `Streams/<name>/plans/` for KB repos (one plans index per stream). Both carry the same format and README structure.
6. **Lifecycle discipline** — `open` → `in-progress` (on execute) → `done` (on completion). A plan stays `in-progress` for at most one working session before it is either advanced or its next step is committed. No zombie plans: if a plan is abandoned, use `/plan done` to close it with a note.
7. **The index rule** — `README.md` in the plans directory is always in sync with the plan files on disk. Every file has a row; every row has a file. The dependency graph is rebuilt whenever blocks/blocked-by change.
8. **Plans vs. Decision Records** — a plan answers "how do we execute this?" with ordered steps; a DR answers "why did we decide this?" with context and consequences. They are complementary: a DR may exist before a plan (decision made, not yet scheduled), or a plan may reference a DR (executing a decision). Use `ki-decision-records` for the latter.

## Plan quality bar

A plan is ready to execute when it passes these four checks:

**Steps are concrete** — each step names a specific action (Read X, Write Y, Run Z). Vague steps like "handle the edge cases" or "improve performance" are not steps — they are scope that needs decomposing. If a step can't be checked off by inspection, rewrite it.

**Verify is checkable** — the Verify section is a pass/fail test, not a description of intent. "Run `bun run ki:verify` and confirm exit 0" is checkable. "Make sure everything works" is not.

**Current state is honest** — the Current state section records what is actually true today, including gaps and known issues. It is not aspirational. It is the baseline the steps depart from.

**Files touched is minimal** — list the files the plan is expected to change. Not every file in the repo; not a guess. This list anchors scope and makes drift visible during execution.

## Operating modes

Carries the universal **AUDIT · CONFORM · REFRESH**. Infer the mode from the request; ask only if genuinely unclear.

### Mode AUDIT

Check that a repo's plans are methodologically sound and mechanically consistent.

1. Locate the plans directory: `docs/plans/` for code repos, `Streams/*/plans/` for KB repos (audit all streams, or the one named in the argument).
2. **Frontmatter check** — for each `*.md` file (excluding `README.md`): `id`, `title`, `phase`, `status`, `blocks`, `blocked-by` must all be present; `phase` ∈ {Next, Soon, Future}; `status` ∈ {open, in-progress, done}; `id` is a zero-padded three-digit string.
3. **Sync check** — every plan file has a row in `README.md` (matched by id); every row in `README.md` has a file on disk.
4. **Dependency integrity** — for every `blocks: A, B` field, plans A and B must exist; for every `blocked-by: C` field, plan C must list this plan's id in its `blocks`. No cycles.
5. **Phase/dependency coherence** — no plan in a `blocked-by` chain is in an earlier phase than its blocker.
6. **Quality spot-check** — read the Steps and Verify sections of each `in-progress` plan; flag any step that is not concrete or any Verify that is not checkable.
7. **Zombie check** — flag any plan with `status: in-progress` that has no recent git commits touching it.

Report findings on the severity ladder (FAIL / WARN / ADVISORY / PASS). A missing `README.md`, a missing required field, or a broken dependency reference is FAIL. A vague step or uncheckable Verify is WARN. A quality observation is ADVISORY.

### Mode CONFORM

Fix mechanical FAIL and WARN items found in AUDIT. In order:

1. Add or correct any missing frontmatter fields (infer values where unambiguous; ask if not).
2. Rebuild `README.md` rows from files on disk, preserving any phase grouping that is still correct.
3. Repair broken dependency references (add missing reverse links; remove references to non-existent plans).
4. Rebuild the dependency graph from the corrected `blocks`/`blocked-by` fields.
5. Commit with message `fix(plans): conform to plans standard`.

Do not change plan content (Steps, Context, Current state) — those belong to the author. CONFORM touches only structure and metadata.

### Mode REFRESH

Revisit the methodology against current practice:

1. Check whether the Next/Soon/Future phasing model still reflects how work is actually sequenced across active repos.
2. Review whether the quality bar criteria need sharpening based on patterns seen in plan files.
3. Check whether the placement rule (code repos vs KB repos) needs updating.
4. Update this `SKILL.md` with any changes. Summarise what changed and why in the commit message.

## Notes

- **Not every change needs a plan.** Single-file fixes, typo corrections, and config tweaks that can be described and completed in one step do not warrant a plan file. The mandate is for multi-file or multi-step changes.
- **Plan before commit, not plan before thought.** Exploration and research do not need a plan. The plan is written when scope is clear and implementation is about to begin.
- **Plans are not tickets.** A plan is a self-contained execution document, not a backlog item or a task tracker row. It contains enough context to pick up cold after a context reset.
- **KB repos use per-stream plans.** Each stream in `arcadia-principal` (or any KI KB) keeps its own `Streams/<name>/plans/` directory. Plans in one stream do not cross-reference plans in another stream by id — use prose if a cross-stream dependency exists.
- **The /plan slash command is the tool; this skill is the standard.** When a user asks "how should I structure this plan?" or "audit my plans", invoke this skill. When a user types `/plan new`, that is the slash command doing the mechanical work. Both are needed; neither replaces the other.
