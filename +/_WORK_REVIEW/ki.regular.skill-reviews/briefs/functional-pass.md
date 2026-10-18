# Brief: functional-area pass on the skill diagrams (KI-HARNESS-GOV-193)

Repository: /Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness, primary checkout, local `main`. You start after the `regroup` agent has finished; build on local `main` as it stands (unpushed commits a830b6ed and regroup's). Read regroup's run report in `/Users/krisbrown/.local/state/ki/agents/skill-reviews/regroup.log` first. Another thread may be active: commit by explicit path only, never revert others' changes, never `--no-verify`, do NOT push.

Generator: `skills/repo-structure/ki-repo-harness/scripts/rubric/contexts/` (`skill-areas.ts`, `skill-graph.ts`, `skill-map.ts`, `skill-diagrams.ts`, tests). Diagrams are generated and checked byte-for-byte; never hand-edit the JSON. Keep Archify showcase gates passing (no crossings, width ≤1395px).

## Owner feedback to amalgamate (2026-10-14; verbatim extracts in `+/_THREADS/skill-reviews/decisions.md`, read it)

1. **Skill map** stays organised by folder ("a really good introduction"), but add an overlay showing each skill's _functional area_ — e.g. a functional-area tag/colour/badge on each box or a secondary boundary layer, whatever Archify supports legibly. If an in-place overlay cannot pass the gates, say so and propose the closest alternative (e.g. a companion functional map).
2. **Area diagrams become functional-area diagrams**, titled by function, not by folder name. Re-derive the set of functional areas from what skills do and how they depend on each other (more or fewer than eight is fine). **Every skill must appear in at least one functional-area diagram**; a skill may appear in more than one. Add a test enforcing coverage. Rename diagram files/slugs and `docs/diagrams/diagrams.toml` entries to match; remove retired ones.
3. **Fundamentals** (replaces "Keystone" as a title): ki-authoring, ki-git, ki-repo, ki-bootstrap, ki-skills, ki-repo-harness, plus ki-diagrams alongside authoring. Overlay sub-groupings within it: {ki-repo-harness, ki-skills} and {ki-repo, ki-authoring, ki-git} (diagrams sits with authoring). Check actual skill names.
4. **Complex diagrams** (repo structure, governance, change management): first draw each without groupings, study how the edges actually interact, then co-locate skills that belong together and decide what each diagram is trying to show. ki-repo-harness has many interconnections — decide how to present it without dominating.
5. **Repo structure** by repository type: a group of repo-website-* skills, a group of repo-kb-* skills, ki-repo-project on its own, and the single-type ones (specifications, MCPs, harnesses, tools, projects, dotfiles-chezmoi) shown together in one place even though each is one skill. ki-repo-dotfiles-chezmoi is the only one that brings in the chezmoi binding and authoring — make that visible.
6. **Governance and change management**: the owner reviews these next pass; apply the approach (4) and the earlier split of change management into Work items (work-* skills) and Delivery cycle (next, accept, plan, batch, recap, implement), but keep changes there reasoned and reported.
7. Earlier notes: acquire, agentic systems, design, environment are good as laid out (keep unless functional re-derivation forces change). **Pulse** belongs functionally with ki-agentic-radar and ki-model-radar (a Signals functional area or group); do NOT move any folder (folder move is an open owner query). **SRC badge**: replace Archify's SRC count badge with stable skill stats (rubric rule count, code-size bucket S/M/L, reference count), exact figures in the HTML detail view if supported; keep the click-through to SKILL.md. **Full names**: show the `ki-` prefix on every box; widen or wrap as needed; fix any label overflow. Keep regroup's plain applicability labels (always on · automatic · opt-in · command).

## Steps

1. Implement; update docs (`docs/diagrams/README.md`, standards-compatible-harness.md section on generated diagrams, any references to old diagram names).
2. Regenerate with `ki repo conform --skill ki-repo-harness` (do not commit `skills/README.md`; catalogue regeneration is a separate open owner query), export SVG + committed HTML per the ki-diagrams workflow. Update `last_checked` per convention.
3. Run sequentially: `bun run test`, `bunx tsc --noEmit`, `ki repo audit --skill ki-repo-harness` (pre-existing CAP-2 reported separately), `ki repo audit --skill ki-diagrams`; `ki dev skill rubric ki-repo-harness --write` if stale.
4. Screenshots: all diagrams (map + every functional area) into `/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/+/_THREADS/skill-reviews/screens/`, previous set moved to `screens/before-functional/`. Do not commit PNGs.
5. Commit by explicit path (one or more coherent commits), referencing KI-HARNESS-GOV-193, trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; dated note on `docs/roadmap/KI-HARNESS-GOV-193-area-diagrams-with-html.md` (stays awaiting-review).
6. Do NOT push.

## Report

Run report: the functional-area set with members (skills in more than one area marked), how the map overlay works, what each complex diagram now shows and why, the repo-structure grouping, any owner note you could not honour and why, check results, commits, screenshot paths, and the list of HTML files the owner should open.
