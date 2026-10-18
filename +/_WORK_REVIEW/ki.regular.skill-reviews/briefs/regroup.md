# Brief: capability subgroups and plainer labels (KI-HARNESS-GOV-193)

Repository: /Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness, primary checkout, local `main`. Work on top of local `main` as it stands (it carries the unpushed area-layout commit a830b6ed; do not rebase or push). Another thread may be active: commit by explicit path only, never revert others' changes, never use `--no-verify`.

## Owner decision (2026-10-14, verbatim)

"After area-layout finishes, launch an agent to add capability subgroups inside the concern boxes from a small grouping table in the generator, starting with Change management · Work items (the work-* skills) and Change management · Delivery cycle (next, accept, plan, batch, recap, implement), and proposing groups for the other seven concerns; relabel the applicability words as always on · automatic · opt-in · command; regenerate, check, commit within KI-HARNESS-GOV-193, and show me screenshots before pushing."

The owner's reasoning: boxes should not rigidly follow directories; they should reflect the capability skills bring _and_ the directory they sit in. In change management, the work-* skills interact with repo-structure; the delivery-cycle skills (next, accept, plan, batch, recap, implement) interact with governance, especially delegation and checkpoint.

## Scope

Generator code: `skills/repo-structure/ki-repo-harness/scripts/rubric/contexts/` (`skill-areas.ts`, `skill-graph.ts`, `skill-map.ts`, tests).

1. **Grouping table** in the generator (not SKILL.md frontmatter): maps each skill to a capability group within its concern. Groups render as nested regions, or as concern regions split into labelled sub-regions, titled `<Concern> · <Group>` (e.g. "Change management · Work items", "Change management · Delivery cycle"). Use the exact change-management split above; check actual skill names under `skills/change-management/`. Propose groups for the other seven concerns from the skills' descriptions and dependencies; a concern too small or cohesive to split stays one group. Every skill must be in exactly one group; add a test that the table covers every skill and fails on an unknown or missing skill. Apply grouping to the area diagrams and to the skill map.
2. **Labels**: replace the applicability words in sublabels and legend: baseline → always on, detected → automatic, declaration-only → opt-in, invocation-only → command. Keep the legend's governance/process distinction legible (e.g. "Governance · always on", "Process · command"). Update the map's "Reading the map" card text to explain the four words plainly.
3. Keep the area-layout rule from a830b6ed working within groups (agentic-systems should keep the owner's grid unless grouping forces otherwise — if it does, say so). Keep Archify showcase gates passing (no crossings, width ≤1395px). Fix the agent-coordination-paperclip label overflow if cheap.
4. Regenerate with `ki repo conform --skill ki-repo-harness` but do not commit `skills/README.md` (catalogue regeneration is a separate open owner query); refresh SVG + committed HTML per `docs/diagrams/diagrams.toml` and the ki-diagrams workflow (`skills/governance/ki-diagrams/scripts/export-svg.ts`). Update `last_checked` per convention. Update `docs/diagrams/README.md` and any doc that explains the sublabel words.
5. Run sequentially: `bun run test`, `bunx tsc --noEmit`, `ki repo audit --skill ki-repo-harness` (CAP-2 catalogue failure is pre-existing; report it separately), `ki repo audit --skill ki-diagrams`; `ki dev skill rubric ki-repo-harness --write` if the rubric is stale.
6. Screenshots: replace the PNGs in `/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/+/_THREADS/skill-reviews/screens/` with all eight area diagrams plus `skill-map.png`; keep the previous set in `screens/before-regroup/`. Do not commit PNGs.
7. Commit by explicit path, conventional message referencing KI-HARNESS-GOV-193, trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Add a dated note to `docs/roadmap/KI-HARNESS-GOV-193-area-diagrams-with-html.md` (status stays awaiting-review).
8. Do NOT push.

## Report

Run report: the grouping table as a short list per concern (marking which groups are your proposals), the label change, any diagram that got worse, check results, commit(s), screenshot paths. If the gates cannot be met with nested groups, stop before committing and report with screenshots of the closest result.
