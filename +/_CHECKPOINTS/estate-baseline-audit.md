---
type: ki-checkpoint
thread: estate-baseline-audit
state: active
created_at: 2026-09-19T08:56:54Z
updated_at: 2026-09-19T13:11:43Z
---

# estate-baseline-audit

## Objective

Mechanically conform, dependency-refresh, judgmentally audit every Knowledge Islands repository, leave independently committed baselines, and publish estate-level evidence for deciding future structure.

## Current state

The estate contains 21 repositories. All are clean on `main`, have one primary worktree, and have committed readable `.ki.toml` presentation. All 14 repositories declaring `ki-engineering` carry the common executable Husky baseline and TypeScript Commitlint configuration. The Harness contract landed at `4b19032e`; accepted hook work `KI-HARNESS-GOV-077` was pruned at `593c5503`.

This pass actively covers 18 repositories. `mcp-acquire-whatsapp`, `tools-rig`, `ki-agentic-harness`, and the external chezmoi repository are deferred because other work may be active there. “ToolsWig” is interpreted as `tools-rig`, and “Shay Noir” as chezmoi. A repository that develops concurrent changes is moved to the deferred set rather than absorbing them.

Five of the 18 active-pass repositories are fully baselined: `mcp-git-audit` at `6905787`, `mcp-gsuite` at `4759952`, `mcp-housekeeping-claude` at `8b0180f`, `mcp-ki-kb-fs` at `53cd14a`, and `mcp-ki-kb-notion-mirror` at `138a7d9`. Each passes all 15 declared KI audits and its complete implementation gate. The legacy-SDK repositories deliberately hold Zod at 4.4.3 until their already-owned SDK-v2 migrations; every other dependency is current.

Master audit checklist:

1. **Protect concurrent work.** Record branch, HEAD, dirty paths, linked worktrees, and this thread's touched paths; use explicit-path staging only.
2. **Run mechanical audit first.** Resolve declared skills, run the whole registered `ki repo audit`, and distinguish repository failures from host or Harness defects.
3. **Apply only safe mechanical conforms.** Review `--dry-run`, apply bounded local writes, and leave judgment findings visible.
4. **Refresh dependencies.** Inventory package workspaces, remove stale holds, adopt current releases deliberately, update lockfiles, and review major-version risk.
5. **Verify implementation.** Run the repository's type-check, tests, coverage, build, lint, Knip, Syncpack, and artifact-specific gates where applicable.
6. **Audit `.ki.toml` semantics and readability.** Validate roots, skill tables, banners, grouping, comments, defaults, and owner boundaries without changing meaning.
7. **Audit repository identity and GitHub state.** Reconcile purpose, description, topics, visibility, licence, merge settings, features, security, and package metadata. Live GitHub mutations remain explicit reviewed actions.
8. **Audit code architecture judgmentally.** Check cohesion, boundaries, duplication, public contracts, generated surfaces, test quality, configuration injection, and purpose alignment.
9. **Audit durable documentation.** Reconcile README, guides, specifications, decisions, reviews, indexes, source records, and generated publications; remove obsolete reviews only when they have no durable role.
10. **Audit roadmap and housekeeping.** Validate ledgers; accept valid Awaiting review work as Done and commit it before a later prune-only commit; report promotion candidates without adopting Triage; check cadence and commit-volume triggers; keep agentic-radar work weekly.
11. **Audit working areas.** Keep `+` and `-` directional and temporary; retain skill-owned subfolders while declared; use `_BATCHES`, not `_AUTHORISATIONS`; never retain checkpoint `_RETIRED` directories.
12. **Audit relationships.** Reconcile Agora memberships, trade routes, reciprocal declarations, directionality, and skill ownership.
13. **Audit ignore composition.** Keep skill-owned `.gitignore` blocks demarcated, cover relevant tool outputs, and place repository-owned unmanaged entries in the terminal unmanaged section.
14. **Process worktrees.** Integrate or dispose of finished worktrees only after status, ancestry, processes, and retained value are understood; prune stale metadata.
15. **Create a baseline.** Commit exact touched paths in coherent units, re-audit committed state, and record unresolved findings, roadmap opportunities, and structural recommendations.

Repository progress ledger uses `✓` complete, `△` begun or needs re-check, `—` not started, `!` blocked, and `D` deliberately deferred. Columns map to checklist groups: `G` 1, `M` 2, `C` 3, `D` 4, `V` 5, `J` 6–13, `W` 14, and `B` 15.

| Repository | G | M | C | D | V | J | W | B | Current evidence or next gap |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | --- |
| `homebrew-tap` | ✓ | ✓ | △ | — | — | △ | ✓ | — | Release automation and TOML are committed (`0f4ec20`, `1861fb6`); dependency, judgment, and roadmap pass remain. |
| `ki-arcadia-principal` | ✓ | ! | △ | — | — | — | ✓ | — | TOML and hooks are committed; audit cannot resolve declared `ki-housekeeping-granola`. |
| `ki-plugins` | ✓ | ✓ | △ | — | — | — | ✓ | — | TOML is committed at `283bb61`; resume from conform review. |
| `ki-specifications` | ✓ | ✓ | △ | — | — | — | ✓ | — | TOML is committed at `a0e84e1`; resume from conform review. |
| `ki-techne-principal` | ✓ | ✓ | △ | — | — | — | ✓ | — | TOML is committed at `21dd0a9`; resume from conform review. |
| `ki-techne-tools` | ✓ | ✓ | △ | — | — | △ | ✓ | — | TOML is committed at `4574998`; declared MIT licence and live GitHub licence need reconciliation. |
| `ki-website` | ✓ | ✓ | △ | — | — | △ | ✓ | — | Hooks, release registry, and TOML are committed; `KI-WEB-SITE-012` needs roadmap review. |
| `mcp-git-audit` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `6905787`: 15-skill audit clean; dependencies current; full gate clean; legacy working records removed; `MCP-GIT-TOOL-006` captured in Triage. |
| `mcp-gsuite` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `4759952`: 15-skill audit and full gate clean; compatible Zod hold restored; Awaiting review work accepted/pruned; legacy working records removed. |
| `mcp-housekeeping-chatgpt` | ✓ | ✓ | △ | — | — | △ | ✓ | — | Real audit runs; legacy engineering, documentation, working-area, trade, and GitHub gaps remain. |
| `mcp-housekeeping-claude` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `8b0180f`: 15-skill audit and full gate clean; compatible Zod hold restored; obsolete handoff scaffolds removed; path-safety concern remains owned by `MCP-CH-OPS-001`. |
| `mcp-housekeeping-codex` | ✓ | ✓ | △ | — | — | △ | ✓ | — | Real audit runs; legacy engineering, coverage, documentation, working-area, trade, and roadmap gaps remain. |
| `mcp-ki-kb-fs` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `53cd14a`: 15-skill audit and full gate clean; compatible Zod hold restored; shared agent orientation added; obsolete handoff scaffolds removed. |
| `mcp-ki-kb-notion-mirror` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `138a7d9`: 15-skill audit and full gate clean; compatible Zod hold restored; shared agent orientation added; obsolete handoff scaffolds removed. |
| `mcp-m365` | ✓ | ✓ | △ | — | — | △ | ✓ | — | Hooks and TOML are committed; configuration injection, dependency holds, and roadmap schema need review. |
| `tools-git-almanac` | ✓ | ✓ | △ | — | — | △ | ✓ | — | Hooks and TOML are committed; accepted-requirement and roadmap schema findings need review. |
| `tools-ki` | ✓ | ✓ | △ | — | — | △ | ✓ | — | Hooks and TOML are committed; resume post-conform verification. |
| `tools-mgit` | ✓ | ✓ | △ | — | — | — | ✓ | — | TOML is committed at `8b7b2bb`; resume from conform review. |
| `mcp-acquire-whatsapp` | D | D | D | D | D | D | D | D | Deferred until the second pass because other work may be active. |
| `tools-rig` | D | D | D | D | D | D | D | D | Deferred until the second pass because other work may be active. |
| `ki-agentic-harness` | D | D | D | D | D | D | D | D | Deferred until the second pass; it also owns this checkpoint and audit tooling. |

## Decisions made

Mechanical conform precedes dependency and judgment work. Awaiting review records may be accepted and pruned under standing approval, but Done must land before a separate prune-only commit. Triage adoption still needs exact selection. Shared-tree commits use touched-path tracking and explicit staging. Empty specialist working subareas remain while their owning skill is declared; retired checkpoint directories do not.

## Files touched

This thread currently touches only `+/_CHECKPOINTS/estate-baseline-audit.md` in the Harness. Completed clean baselines are `mcp-git-audit` at `6905787`, `mcp-gsuite` at `4759952`, `mcp-housekeeping-claude` at `8b0180f`, `mcp-ki-kb-fs` at `53cd14a`, and `mcp-ki-kb-notion-mirror` at `138a7d9`; the gsuite acceptance/prune boundary is `c49e011` then `21eb1d2`. Earlier Harness fixes and all estate `.ki.toml`, hook, package-manifest, lockfile, and managed-ignore changes are committed. Audit reports are temporary outside repositories.

## Open questions

Whether Arcadia's missing Granola capability is a stale declaration or unpublished Harness capability; which roadmap records are credible promotion candidates; whether an existing roadmap item already owns the graphical estate dashboard.

## Next step

Commit this checkpoint update, then fully progress `mcp-m365` from mechanical re-audit through dependency, verification, judgment, roadmap, and committed baseline. Update its ledger row immediately after its stable result before moving to the next repository.
