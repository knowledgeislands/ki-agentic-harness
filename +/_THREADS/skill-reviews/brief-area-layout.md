# Brief: area-diagram layout rule (KI-HARNESS-GOV-193)

Repository: /Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness, primary checkout, local `main`. Fetch first and work on top of origin/main; another thread may be active, so commit by explicit path only and never revert others' changes.

## Goal

Change the generated area-diagram layout in `skills/repo-structure/ki-repo-harness/scripts/rubric/contexts/skill-areas.ts` so that `docs/diagrams/skill-area-agentic-systems.architecture.json` comes out exactly as the owner specified (grid rows/columns as rendered):

- row 1: repo-harness (column 1)
- row 2: subagents (col 1), subagents-claude (col 2)
- row 3: agent-coordination-paperclip (col 1), subagents-chatgpt (col 2)
- row 4: git (col 1)

Today it is: row 1 repo-harness; row 2 subagents-chatgpt, subagents-claude, agent-coordination-paperclip; row 3 subagents; row 4 git. Edges: repo-harness→subagents, subagents-chatgpt→subagents, subagents-claude→subagents, agent-coordination-paperclip→git.

The diagrams are generated and checked byte-for-byte against frontmatter, so do NOT hand-edit the JSON. Express the change as a general rule that applies to all eight area diagrams. Intent behind the owner's arrangement (derive a rule that reproduces it, do not special-case one diagram):

- the concern's in-area dependency hub (what other members and the prerequisite above depend on) comes first, under what depends on it from above;
- members that depend on the hub sit beside/after it;
- a member linking to a concern below sits nearest that concern;
- the concern's region is compact (fewer columns, e.g. a near-square block) rather than spread across the full width;
- fewer edge crossings and shorter edges.
Keep Archify showcase gates passing (no crossings, width ≤1395px).

## Steps

1. Implement the rule; update/add tests in `skill-graph.test.ts` (or a skill-areas test) asserting the agentic-systems grid above.
2. Regenerate all diagram sources with `ki repo conform --skill ki-repo-harness` and refresh the SVG + committed HTML per `docs/diagrams/diagrams.toml` and the ki-diagrams workflow (`skills/governance/ki-diagrams/scripts/export-svg.ts`; Playwright/Chromium are installed locally). Update `last_checked` as the existing convention does.
3. Run sequentially: `bun run test`, `bunx tsc --noEmit`, `ki repo audit --skill ki-repo-harness`, `ki repo audit --skill ki-diagrams`. If the rubric publication is stale, `ki dev skill rubric ki-repo-harness --write`.
4. Screenshot all eight area diagrams (and the skill map if it changed) as PNGs into `/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/+/_THREADS/skill-reviews/screens/` (untracked scratch is fine; do not commit PNGs).
5. Commit by explicit path, conventional message referencing KI-HARNESS-GOV-193, with the trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Add a short note to `docs/roadmap/KI-HARNESS-GOV-193-area-diagrams-with-html.md` that the layout rule was revised at the owner's request (2026-10-14), keeping its status awaiting-review. Never use `--no-verify`; if a hook cannot run, stop and report.
6. Do NOT push. The owner wants to review the screenshots first.

## Report

End with a run report: what changed (the rule in one or two sentences), the agentic-systems grid as produced, any diagram whose layout got worse, check results, commit(s) made and the screenshot paths. If the requested grid cannot be met under the showcase gates, stop before committing and report why with screenshots of the closest result.
