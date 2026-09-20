---
type: ki-checkpoint
thread: estate-baseline-audit
state: active
created_at: 2026-09-19T08:56:54Z
updated_at: 2026-09-20T07:10:39Z
---

# estate-baseline-audit

## Objective

Mechanically conform, dependency-refresh, and judgmentally audit every Knowledge Islands repository; leave independently committed baselines; publish estate-level evidence for deciding the future structure.

## Current state

The estate contains 21 repositories. At the start of this pass every repository was on `main`, clean, and using one primary worktree. Recheck those conditions immediately before touching each repository because other humans and agents share the trees.

All 21 repositories are baselined: `mcp-git-audit` at `6905787`, `mcp-gsuite` at `4759952`, `mcp-housekeeping-claude` at `8b0180f`, `mcp-ki-kb-fs` at `53cd14a`, `mcp-ki-kb-notion-mirror` at `138a7d9`, `mcp-m365` at `4a73c07`, `mcp-housekeeping-codex` at `15e4152`, `mcp-housekeeping-chatgpt` at `033b466`, `mcp-acquire-whatsapp` at `97639c8`, `tools-mgit` at `5e43795`, `tools-git-almanac` at `539cb49`, `homebrew-tap` at `4e7c867`, `ki-plugins` at `52ae513`, `ki-specifications` at `32fc900`, `ki-arcadia-principal` at `864b969`, `ki-techne-principal` at `d35e256`, `ki-techne-tools` at `b7efdb6`, `ki-website` at `829e99b`, `tools-ki` at `aaa0570`, `tools-rig` at `f18780b`, and `ki-agentic-harness` at `fd23f03` plus checkpoint-only progress commits.

The earlier deferral of `mcp-acquire-whatsapp`, `tools-rig`, and `ki-agentic-harness` was lifted by the user’s request to cover every remaining repository. Concurrent pairing work in `mcp-acquire-whatsapp` settled into its owner’s own commits before the baseline dependency and lifecycle commits, so no shared-tree work was absorbed. “ToolsWig” was interpreted as `tools-rig`; “Shay Noir” is an external chezmoi repository and not one of the 21 repositories in this estate.

All 14 repositories declaring `ki-engineering` carry the common executable Husky, TypeScript, and Commitlint baseline. The Harness contract landed at `4b19032e`; accepted hook work `KI-HARNESS-GOV-077` was pruned at `593c5503`.

Legacy-SDK repositories deliberately hold Zod at 4.4.3 until their already-owned SDK-v2 migrations. Every other dependency reviewed so far is current.

**Master audit checklist**

1. **Protect concurrent work.** Record branch, HEAD, dirty paths, linked worktrees, and this thread's touched paths; use explicit-path staging only.
2. **Run mechanical audit first.** Resolve declared skills and run the whole registered `ki repo audit`; distinguish repository failures from host or Harness defects.
3. **Apply only safe mechanical conforms.** Review `--dry-run`, apply bounded local writes, and keep judgment findings visible.
4. **Refresh dependencies.** Inventory package workspaces, remove stale holds, adopt current releases deliberately, update lockfiles, and review major-version risk.
5. **Verify implementation.** Run the repository's type-check, tests, coverage, build, lint, Knip, Syncpack, and artifact-specific gates where applicable.
6. **Audit `.ki.toml` semantics and readability.** Validate roots, skill tables, banners, grouping, comments, defaults, and owner boundaries without changing meaning.
7. **Audit repository identity and GitHub state.** Reconcile purpose, description, topics, visibility, licence, merge settings, features, security, and package metadata. Live GitHub mutations remain explicit reviewed actions.
8. **Audit code architecture judgmentally.** Check cohesion, boundaries, duplication, public contracts, generated surfaces, test quality, configuration injection, and purpose alignment.
9. **Audit durable documentation.** Reconcile README, guides, specifications, decisions, reviews, indexes, source records, and generated publications; remove obsolete reviews only when their retained value has expired.
10. **Progress roadmap work.** Remove retired `candidate` state, capture newly found substantive work in Triage, advance credible items only within lifecycle authority, accept Awaiting review under standing approval, and prune accepted Done records in a separate commit.
11. **Audit working areas.** Preserve required declared-skill subfolders; remove obsolete `_HANDOFFS` overlap, stale records, expired `_BATCHES`, retired checkpoint directories, and valueless reviews.
12. **Prefer TypeScript and Bun.** Replace repository-owned `.mjs` utilities with `.ts` at the source when safe; do not hand-edit generated projections.
13. **Audit ignore composition.** Keep skill-owned `.gitignore` blocks demarcated, cover relevant tool outputs, and place repository-owned entries in the terminal unmanaged section.
14. **Process worktrees.** Integrate or dispose of finished worktrees only after status, ancestry, processes, and retained value are understood; prune stale metadata.
15. **Create the baseline.** Commit exact touched paths in coherent units, re-audit committed state, and record unresolved findings, roadmap opportunities, and structural recommendations.

**Repository progress ledger**

The columns map to checklist groups: `G` = 1, `M` = 2, `C` = 3, `D` = 4, `V` = 5, `J` = 6–13, `W` = 14, and `B` = 15. `✓` means complete, `△` means begun or an evidenced gap remains, `—` means not started, and `!` means blocked.

| Repository | G | M | C | D | V | J | W | B | Current evidence or next gap |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | --- |
| `homebrew-tap` | ✓ | ✓ | △ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `4e7c867`: formula releases align with all four latest upstream releases; Ruby tests, syntax, Homebrew style, strict online audits, release-fanout tests, and workflow lint pass; GitHub identity and settings align. The reviewed generic tool-release fanout was integrated, BREW-004 accepted and pruned separately, and its finished worktree removed. The Claude memory-index finding remains captured in BREW-002. |
| `ki-arcadia-principal` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `864b969`: all 18 declared audits, TypeScript, Biome, Syncpack, Knip, and 185-file Markdown gates pass; dependencies current; retired Granola declaration migrated to `ki-acquire-granola`; note metadata, ignore composition, Claude orientation and memory index, digest scaffold, and Biome schema conformed; obsolete HANDOFFS removed; completed GOV-008 pruned separately. Concurrent untracked factorisation review preserved untouched. |
| `ki-plugins` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `52ae513`: all 11 declared audits and both marketplace JSON parses pass; GitHub identity and settings align; runtime-neutral orientation added; topic override and obsolete HANDOFFS scaffolds removed. Proprietary root licence conflicts with GitHub's MIT detection; generated `.mjs` must be migrated in Harness source. |
| `ki-specifications` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `32fc900`: all 14 declared audits and every schema example pass; GitHub identity and settings align; bare Claude import added; obsolete HANDOFFS surfaces and superseded CLI-006 packet removed; completed RGV-002 pruned separately. RGV-001 remains an intentionally open Next/draft review. |
| `ki-techne-principal` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `d35e256`: all 16 declared audits and the 54-file Markdown gate pass; no package dependencies or `.mjs` utilities exist; live GitHub identity and settings align; obsolete HANDOFFS scaffolds removed; accepted Done OPS-008 pruned separately. |
| `ki-techne-tools` | ✓ | ✓ | ✓ | ✓ | △ | ✓ | ✓ | ✓ | Baseline `b7efdb6`: all 14 audits pass; CLI and controller TypeScript/Python tests, build, help surfaces, Biome, Knip, Syncpack, Markdown, dependency and root-layout gates pass; dependencies current; GitHub MIT identity aligns. Judgment found and restored the root manifest contract before OPS-001 was accepted and pruned separately. CloudFormation validation has prior successful delivery evidence but the baseline rerun could not refresh the host's expired AWS SSO token. |
| `ki-website` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `829e99b`: all 18 audits, type-check, Eleventy/Tailwind build, route verification, workflow lint, Markdown, Syncpack, and dependency gates pass; dependencies current; live GitHub identity aligns. The reviewed shared release-consumer change was integrated, its Done record pruned separately, the transient duplicate SITE-013 identity removed, and its finished worktree retired. Package-local `ki:site:*` keys satisfy the website seam; `site-root = "site"` remains the necessary non-default override. Seven CSS specificity warnings and six Knip hints remain captured without adoption in the surviving SITE-013. |
| `mcp-git-audit` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `6905787`: 15-skill audit and full gate pass; dependencies current; legacy working records removed; MCP-GIT-TOOL-006 captured in Triage. |
| `mcp-gsuite` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `4759952`: 15-skill audit and full gate pass; compatible Zod hold restored; Awaiting review work accepted and pruned; legacy working records removed. |
| `mcp-housekeeping-chatgpt` | ✓ | ✓ | △ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `033b466`: full implementation gate and local audits pass; FND-001 accepted and pruned; host-only environment loading is an evidenced warning in FND-002; Decision Record adoption and eight live GitHub settings remain explicit decisions. |
| `mcp-housekeeping-claude` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `8b0180f`: 15-skill audit and full gate pass; compatible Zod hold restored; obsolete handoff scaffolds removed; path-safety concern remains owned by MCP-CH-OPS-001. |
| `mcp-housekeeping-codex` | ✓ | ✓ | △ | ✓ | △ | ✓ | ✓ | ✓ | Baseline `15e4152`: local audits, type-check, build, test, Biome, Knip, Syncpack, and dependency gates pass; 38.33% line coverage remains captured in FND-001; FND-003 records a destructive public-export mismatch; Decision Record adoption and eight live GitHub settings remain explicit decisions. |
| `mcp-ki-kb-fs` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `53cd14a`: 15-skill audit and full gate pass; compatible Zod hold restored; shared agent orientation added; obsolete handoff scaffolds removed. |
| `mcp-ki-kb-notion-mirror` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `138a7d9`: 15-skill audit and full gate pass; compatible Zod hold restored; shared agent orientation added; obsolete handoff scaffolds removed. |
| `mcp-m365` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `4a73c07`: 15-skill audit and full gate pass; ambient configuration fallback removed; Awaiting review work accepted and pruned; legacy working records removed. |
| `tools-git-almanac` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `539cb49`: all 17 audits pass; 53 tests at 100% coverage, TypeScript, build, Biome, Knip, Syncpack, and mandoc pass; dependencies current; 20 accepted requirements carry concrete conformance evidence; GitHub identity and settings align. |
| `tools-ki` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `aaa0570`: all 18 audits, full Vitest and coverage gates, TypeScript, compiled build, Biome, Knip, Syncpack, mandoc and Markdown pass; dependencies current; live GitHub identity and settings align; no `.mjs` or obsolete HANDOFFS remain. KI-TOOL-BATCH-001 is complete but only two days old, so remains within the one-week `_BATCHES` retention window. |
| `tools-mgit` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `5e43795`: all 15 audits, ShellCheck, 58 Bats tests, and mandoc pass; GitHub identity and settings align; topic override and obsolete HANDOFFS scaffold removed. |
| `mcp-acquire-whatsapp` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `97639c8`: all 16 audits, 727 tests across 65 files, 100% coverage, type-check, build, Biome, Knip, Syncpack, Markdown, and dependency gates pass; dependencies are current; live private GitHub identity aligns; no `.mjs` utilities exist. Concurrent pairing changes remained in their owner’s commits. ACQ-021 was accepted after review, then ACQ-021 and completed FND-005 were pruned in a separate commit. |
| `tools-rig` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `f18780b`: all 15 audits, 124 Bats tests, ShellCheck, mandoc and 30-file Markdown gate pass; no package dependencies or `.mjs` utilities exist; live GitHub identity and settings align. CORE-007 and CORE-008 accepted together, then pruned together in a separate commit. Seven completed `_BATCHES` records remain within the one-week retention window. |
| `ki-agentic-harness` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Baseline `fd23f03` plus checkpoint commits: all 32 audits, full isolated Bun suite, TypeScript, Biome, Knip, Syncpack and 452-file Markdown gate pass; the non-gating model evaluation matrix completed; dependencies current; live GitHub identity aligns; no `.mjs` remain. Resolved runtime-binding review evidence pruned; GOV-074/075/076 accepted together then pruned separately; both `_BATCHES` records remain within one week. |

## Decisions made

Mechanical conform precedes dependency and judgment work. Awaiting review records may be accepted and pruned under standing approval, but Done must land before a separate prune-only commit. Triage adoption still needs exact selection. Shared-tree commits use touched-path tracking and explicit staging. Empty specialist working subareas remain while their owning skill is declared; retired checkpoint directories do not.

## Files touched

This thread currently touches only `+/_CHECKPOINTS/estate-baseline-audit.md` in Harness. Each completed sibling repository is clean after its explicitly scoped commits.

## Open questions

- Which remaining roadmap records are credible promotion candidates?
- Does an existing roadmap item already own the requested graphical estate dashboard?

## Next step

The full 21-repository checklist and final clean-state/worktree sweep are complete. Retain this checkpoint as the audit record until the user chooses whether to close it or begin the graphical dashboard and remaining Triage-promotion follow-on.
