---
type: ki-checkpoint
thread: estate-baseline-audit
state: active
created_at: 2026-09-19T08:56:54Z
updated_at: 2026-09-19T10:58:13Z
---

# estate-baseline-audit

## Objective

Mechanically conform, dependency-refresh, and judgmentally audit every Knowledge Islands repository, then leave independently committed baselines and an estate-level assessment for deciding future structure.

## Current state

All 14 repositories declaring `ki-engineering` now carry the common executable Husky baseline and TypeScript Commitlint configuration. The thirteen sibling repositories are committed and clean; the Harness contract and implementation are verified pending its local commit. This supersedes the older per-repository hook-pending notes retained below as historical audit detail.

The estate contains 21 repositories. The first unsandboxed mechanical pass is complete for the 18 repositories that were not already active, except that `ki-arcadia-principal` cannot resolve its declared `ki-housekeeping-granola` capability. The Harness defect that made `COV-1` crash on a legitimate warning was fixed and committed as `2a049373`. Reviewed conform writes have begun in eleven clean repositories; four received the new Git-hook package dependencies and lockfile updates, five received the managed `.turbo/` ignore rule, and remaining diagnostic failures have not been hidden. The `ki-website` release-registry and `homebrew-tap` release-dispatch worktrees were verified, accepted, fast-forwarded into their respective `main` branches, removed, and their local feature branches deleted. The estate now has no linked non-primary worktrees or stale worktree metadata. All 21 `.ki.toml` files have semantics-preserving presentation commits: the conformance separator, exact `Governance and runtime` banner, compact roadmap areas, compact trade routes, and compact Agora memberships now follow the chezmoi exemplar; every file parses, matches its prior parsed data, and passes the presentation checker. No repository is yet declared fully baselined because dependency freshness, judgment review, and final estate reporting remain.

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

- `homebrew-tap` — release-dispatch automation and `.ki.toml` presentation are committed on `main` (`0f4ec20`, `1861fb6`); `BREW-003` is retained as Done, the feature worktree and local branch are removed, and the known Claude memory-index gap plus dependency, judgment, and final roadmap work remain.
- `ki-agentic-harness` — COV audit-host blocker and TOML presentation contract are fixed and committed; `.ki.toml` presentation is committed at `74c43726`, and dependency refresh, judgment review, roadmap pass, and final estate reporting remain.
- `ki-arcadia-principal` — `.ki.toml` presentation is committed at `98306f2`; the mechanical audit remains blocked by the unresolved `ki-housekeeping-granola` declaration.
- `ki-plugins` — mechanical audit passes and `.ki.toml` presentation is committed at `283bb61`; dependency, judgment, roadmap, and final reporting stages remain.
- `ki-specifications` — mechanical audit passes and `.ki.toml` presentation is committed at `a0e84e1`; dependency, judgment, roadmap, and final reporting stages remain.
- `ki-techne-principal` — mechanical audit passes and `.ki.toml` presentation is committed at `21dd0a9`; dependency, judgment, roadmap, and final reporting stages remain.
- `ki-techne-tools` — `.ki.toml` presentation was concurrently committed at `4574998`; the mechanical gap remains that live GitHub licence is absent while `.ki.toml` declares MIT.
- `ki-website` — common-hook conform, release-registry automation, and `.ki.toml` presentation are committed on `main`, with the presentation commit at `31c2b78`; `KI-WEB-SITE-012` is retained as Done, the feature worktree and local branch are removed, and dependency freshness, judgment review, and final roadmap pruning remain.
- `mcp-acquire-whatsapp` — the previously concurrent work has cleared and `.ki.toml` presentation is committed at `1521209`; the remaining mechanical, dependency, judgment, and roadmap stages are deferred until the estate pass reaches this repository.
- `mcp-git-audit` — `.ki.toml` presentation is committed at `7e1867a`; managed ignore and hook/tooling conform remains uncommitted, post-conform verification was interrupted, and roadmap `candidate` fields remain invalid.
- `mcp-gsuite` — `.ki.toml` presentation is committed at `fe018b5`; managed ignore remains uncommitted, and type-check, dependency-hold, hook/tooling, and roadmap-schema gaps remain.
- `mcp-housekeeping-chatgpt` — `.ki.toml` presentation is committed at `a0f8f6c` and the real audit runs after the COV fix; substantial legacy repository, engineering, documentation, working-area, trade, and GitHub gaps remain.
- `mcp-housekeeping-claude` — `.ki.toml` presentation is committed at `09bed80`; managed ignore remains uncommitted, and type-check, dependency-hold, hook/tooling, and roadmap-schema gaps remain.
- `mcp-housekeeping-codex` — `.ki.toml` presentation is committed at `53de5c1` and the real audit runs after the COV fix; substantial legacy repository, engineering, coverage, documentation, working-area, trade, and roadmap gaps remain.
- `mcp-ki-kb-fs` — `.ki.toml` presentation is committed at `4b3956d`; managed ignore remains uncommitted, and type-check, dependency-hold, hook/tooling, and roadmap-schema gaps remain.
- `mcp-ki-kb-notion-mirror` — `.ki.toml` presentation is committed at `b42508e`; managed ignore remains uncommitted, and type-check, dependency-hold, hook/tooling, and roadmap-schema gaps remain.
- `mcp-m365` — `.ki.toml` presentation is committed at `4d60641`; managed ignore remains uncommitted, and type-check, dependency-hold, configuration-injection, hook/tooling, and roadmap-schema gaps remain.
- `tools-git-almanac` — `.ki.toml` presentation is committed at `3664f96`; managed ignore and hook/tooling conform remains uncommitted, while accepted-requirement conformance lines, roadmap schema, and post-conform verification remain.
- `tools-ki` — `.ki.toml` presentation is committed at `ae90c37`; hook/tooling conform remains uncommitted and post-conform verification was interrupted.
- `tools-mgit` — mechanical audit passes and `.ki.toml` presentation is committed at `8b7b2bb`; dependency, judgment, roadmap, and final reporting stages remain.
- `tools-rig` — the previously concurrent work has cleared and `.ki.toml` presentation is committed at `4de0e18`; the remaining mechanical, dependency, judgment, and roadmap stages are deferred until the estate pass reaches this repository.

## Decisions made

Mechanical audit and conform precede dependency updates and judgmental review. Active repositories `mcp-acquire-whatsapp` and `tools-rig` stay until the end. Awaiting review records have human approval to close and prune when their evidence is valid, but pruning follows a distinct committed Done boundary. Triage adoption still needs exact selection. Shared-tree commits use touched-path tracking and explicit staging only. The chezmoi `.ki.toml` is a presentation exemplar for compact relationship declarations: dotted `memberships` and `routes` remain beside their owning skill roots when readable, while substantial multiline Agora homes may retain nested tables. Empty required specialist working subareas remain when their declaring skill is enabled; retired checkpoint directories do not.

## Files touched

Harness: `+/_CHECKPOINTS/estate-baseline-audit.md`; committed COV fix in `skills/keystone/ki-repo/scripts/rubric/items/coverage.ts` and `skills/keystone/ki-repo/scripts/rubric/items/index.test.ts`; committed TOML presentation checker changes in `skills/keystone/ki-repo/scripts/rubric/contexts/configuration-presentation.ts` and its test. Every estate `.ki.toml` is committed and clean. The previously uncommitted `.gitignore`, package manifest, lockfile, and common Git-hook/configuration conform work is now committed in each affected sibling repository. The Harness currently touches only its Git/worktree and TypeScript/Bun skill contracts, generated rubrics, hook configuration, legacy-cleanup helper migration, accepted hook roadmap record, remediation inventory, and this checkpoint. Audit reports are temporary under `/tmp/ki-estate-audit.PWIU7R` and `/tmp/ki-estate-conform`.

## Open questions

Whether the missing Granola capability is a stale Arcadia declaration or an unpublished Harness capability; which roadmap records are credible promotion candidates; and whether an existing roadmap item already owns the graphical estate dashboard.

## Next step

Resume post-conform verification with `mcp-git-audit`, then continue the mechanical baseline one repository at a time before dependency and judgment passes.
