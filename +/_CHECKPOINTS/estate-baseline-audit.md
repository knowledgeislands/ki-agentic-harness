---
type: ki-checkpoint
thread: estate-baseline-audit
state: active
created_at: 2026-09-19T08:56:54Z
updated_at: 2026-09-19T10:02:13Z
---

# estate-baseline-audit

## Objective

Mechanically conform, dependency-refresh, and judgmentally audit every Knowledge Islands repository, then leave independently committed baselines and an estate-level assessment for deciding future structure.

## Current state

The estate contains 21 repositories. The first unsandboxed mechanical pass is complete for the 18 repositories that were not already active, except that `ki-arcadia-principal` cannot resolve its declared `ki-housekeeping-granola` capability. `mcp-acquire-whatsapp` and `tools-rig` remain deliberately deferred because they contain concurrent work. The Harness defect that made `COV-1` crash on a legitimate warning was fixed and committed as `2a049373`. Reviewed conform writes have begun in eleven clean repositories; four received the new Git-hook package dependencies and lockfile updates, five received the managed `.turbo/` ignore rule, and remaining diagnostic failures have not been hidden. The `ki-website` release-registry and `homebrew-tap` release-dispatch worktrees were verified, accepted, fast-forwarded into their respective `main` branches, removed, and their local feature branches deleted. The estate now has no linked non-primary worktrees or stale worktree metadata. No repository is yet declared fully baselined because dependency freshness, judgment review, and final estate reporting remain.

The master checklist below applies to every repository. Update its evidence and the repository ledger after each project reaches a stable state or commit.

1. **Protect concurrent work.** Record initial branch, HEAD, dirty paths, linked worktrees, and the exact paths this audit touches. Never stage the whole tree or absorb another thread's changes.
2. **Run the mechanical audit first.** Resolve every declared skill, run the whole registered `ki repo audit`, and distinguish genuine failures from sandbox, tool, or Harness defects.
3. **Apply only safe mechanical conforms.** Review `--dry-run`, apply bounded local writes, run any separately authorised command-backed repairs, and leave diagnostic or judgment findings visible.
4. **Refresh dependencies.** Inventory every package and workspace, remove stale holds, adopt current compatible releases deliberately, update lockfiles, and review major-version or release-note risk.
5. **Verify the implementation.** Run the repository's type-check, tests, coverage, build, lint, Knip, Syncpack, and artifact-specific gates in the form appropriate to that repository.
6. **Audit `.ki.toml` semantics and readability.** Validate declared roots, skill tables, banners, neighbourhood grouping, comments, defaults, and owner boundaries without changing parsed meaning. Use chezmoi as the compact relationship exemplar: readable dotted `memberships` and `routes` sit with their owning skill root; substantial multiline Agora homes may use nested tables.
7. **Audit repository identity and GitHub state.** Reconcile README title and purpose, description, topics, visibility, licence, merge settings, feature toggles, security settings, and package metadata. Treat live GitHub mutations as explicit reviewed actions.
8. **Audit code and architecture judgmentally.** Check cohesion, boundaries, duplication, public contracts, generated surfaces, test quality, configuration injection, and whether the implementation still matches its stated purpose.
9. **Audit durable documentation.** Reconcile README, guides, specifications, decisions, reviews, indexes, source records, and generated publications; prune obsolete `docs/reviews` material only when it no longer has a durable role.
10. **Audit roadmap and housekeeping.** Validate every work record and ledger; accept and commit valid Awaiting review work as Done, then prune it in a later prune-only commit; count credible promotion candidates without implicitly adopting Triage; check recurring housekeeping cadence and commit-volume triggers; and ensure agentic-radar work is weekly.
11. **Audit working areas.** Keep top-level `+` and `-` directional and temporary, require retained specialist subfolders when their skill is declared, remove obsolete contents by their owner and retention policy, use `_BATCHES` rather than `_AUTHORISATIONS`, and never retain checkpoint `_RETIRED` directories.
12. **Audit relationships.** Reconcile Agoras, trades, routes, roots, memberships, directionality, and handoff overlap so declarations are compact, reciprocal where required, and owned by the right skill.
13. **Audit ignore composition.** Ensure each skill-owned `.gitignore` block is demarcated, broad bundler and tool outputs are covered, and repository-specific unmanaged entries remain only in the terminal unmanaged section.
14. **Process repository worktrees.** Inspect status, branch, ancestry, and active processes; remove only clean, finished worktrees and retain anything dirty, unmerged, active, or ambiguous.
15. **Create the baseline.** Commit exact touched paths per repository in coherent units, preserve the separate Done-before-prune boundary, re-audit the committed state, and record unresolved findings, roadmap opportunities, and future structural recommendations in the estate report or dashboard owner.

Repository progress ledger:

- `homebrew-tap` — release-dispatch automation is committed on `main` at `0f4ec20`; `BREW-003` is retained as Done, the feature worktree and local branch are removed, and the known Claude memory-index gap plus `.ki.toml`, dependency, judgment, and final roadmap work remain.
- `ki-agentic-harness` — COV audit-host blocker fixed and committed; final self-audit, dependency refresh, judgment pass, roadmap pass, and worktree review remain.
- `ki-arcadia-principal` — blocked before audit by unresolved `ki-housekeeping-granola` declaration.
- `ki-plugins` — mechanical audit passes; later stages remain.
- `ki-specifications` — mechanical audit passes; later stages remain.
- `ki-techne-principal` — mechanical audit passes; later stages remain.
- `ki-techne-tools` — mechanical gap: live GitHub licence is absent while `.ki.toml` declares MIT.
- `ki-website` — common-hook conform and release-registry automation are committed on `main`; `KI-WEB-SITE-012` is retained as Done, the feature worktree and local branch are removed, and `.ki.toml`, dependency freshness, judgment review, and final roadmap pruning remain.
- `mcp-acquire-whatsapp` — deferred until the end because concurrent work is present.
- `mcp-git-audit` — managed ignore and hook/tooling conform applied and dependencies installed; post-conform verification was interrupted, and roadmap `candidate` fields remain invalid.
- `mcp-gsuite` — managed ignore conformed; type-check, dependency-hold, hook/tooling, and roadmap-schema gaps remain.
- `mcp-housekeeping-chatgpt` — real audit now runs after the COV fix; substantial legacy repository, engineering, documentation, working-area, trade, and GitHub gaps remain; no conform write landed.
- `mcp-housekeeping-claude` — managed ignore conformed; type-check, dependency-hold, hook/tooling, and roadmap-schema gaps remain.
- `mcp-housekeeping-codex` — real audit now runs after the COV fix; substantial legacy repository, engineering, coverage, documentation, working-area, trade, and roadmap gaps remain; no conform write landed.
- `mcp-ki-kb-fs` — managed ignore conformed; type-check, dependency-hold, hook/tooling, and roadmap-schema gaps remain.
- `mcp-ki-kb-notion-mirror` — managed ignore conformed; type-check, dependency-hold, hook/tooling, and roadmap-schema gaps remain.
- `mcp-m365` — managed ignore conformed; type-check, dependency-hold, configuration-injection, hook/tooling, and roadmap-schema gaps remain.
- `tools-git-almanac` — managed ignore and hook/tooling conform applied and dependencies installed; accepted-requirement conformance lines, roadmap schema, and post-conform verification remain.
- `tools-ki` — hook/tooling conform applied and dependencies installed; post-conform verification was interrupted.
- `tools-mgit` — mechanical audit passes; later stages remain.
- `tools-rig` — deferred until the end because concurrent work is present.

## Decisions made

Mechanical audit and conform precede dependency updates and judgmental review. Active repositories `mcp-acquire-whatsapp` and `tools-rig` stay until the end. Awaiting review records have human approval to close and prune when their evidence is valid, but pruning follows a distinct committed Done boundary. Triage adoption still needs exact selection. Shared-tree commits use touched-path tracking and explicit staging only. The chezmoi `.ki.toml` is a presentation exemplar for compact relationship declarations: dotted `memberships` and `routes` remain beside their owning skill roots when readable, while substantial multiline Agora homes may retain nested tables. Empty required specialist working subareas remain when their declaring skill is enabled; retired checkpoint directories do not.

## Files touched

Harness: `+/_CHECKPOINTS/estate-baseline-audit.md`; committed COV fix in `skills/keystone/ki-repo/scripts/rubric/items/coverage.ts` and `skills/keystone/ki-repo/scripts/rubric/items/index.test.ts`. Uncommitted conform work currently exists only in `mcp-git-audit`, `mcp-gsuite`, `mcp-housekeeping-claude`, `mcp-ki-kb-fs`, `mcp-ki-kb-notion-mirror`, `mcp-m365`, `tools-git-almanac`, and `tools-ki`, limited to reviewed `.gitignore`, package manifest, lockfile, and Git-hook/configuration paths recorded in each tree's status. `ki-website` now contains the committed hook conform and release-registry delivery. Audit reports are temporary under `/tmp/ki-estate-audit.PWIU7R` and `/tmp/ki-estate-conform`.

## Open questions

Whether the missing Granola capability is a stale Arcadia declaration or an unpublished Harness capability; which roadmap records are credible promotion candidates; and whether an existing roadmap item already owns the graphical estate dashboard.

## Next step

Apply and commit the estate-wide `.ki.toml` presentation tidy-up without changing parsed configuration, updating this checkpoint after each repository result.
