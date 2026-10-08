# Mode REFRESH - regenerate stale diagrams, or re-anchor the standard

**Precondition:** re-anchoring edits this skill's own canonical files, which exist only in `ki-agentic-harness`. Invoked from an installed copy, it stops there and names the harness as where to run it; regenerating an adopting repository's own diagrams is the only REFRESH work done elsewhere.

## In an adopting repository

REFRESH regenerates diagrams. It needs Archify; without it, stop with the Rig install instruction.

1. Run [AUDIT](mode-audit.md) and take each diagram whose DIAG-4 change matches its `stale_when`, or whose DIAG-5 review found a gap.
2. For each, follow [Regeneration and freshness](standards-diagrams.md#regeneration-and-freshness): re-trace with the `regenerate` prompt and the current source, keeping the layout where the facts hold; finalize at showcase quality; re-export the SVG with `scripts/export-svg.ts`; set `last_checked`.
3. Review the rebuilt SVG by eye in both themes before committing it with its source and manifest change.
4. Re-run AUDIT.

## In `ki-agentic-harness`

1. Re-examine each entry in [sources.md](sources.md): has Archify gained a command-line SVG export, a tree layout or an importer, and has any considered alternative changed enough to revisit the choice?
2. If Archify ships a command-line SVG export, shrink `scripts/export-svg.ts` to a wrapper or retire it.
3. Edit the standard and the rubric catalogue together, then regenerate `rubric.md` with `ki dev skill rubric ki-diagrams --write`.
4. Update review dates and the `## Last review` block in `sources.md`; record the substantive change in the commit rather than a changelog.
