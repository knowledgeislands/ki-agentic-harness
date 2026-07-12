# Sources — where the chezmoi dotfiles standard comes from

**Refresh:** external-spec · quarterly

The authoritative sources behind [the standard](dotfiles-standard.md), [the rubric](audit-rubric.md), and [`../scripts/audit.ts`](../scripts/audit.ts). Mode REFRESH reads this file, re-fetches each source, diffs it against the standard

- script, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below (what changed is recorded in the commit, not a changelog).

Two different kinds of claim live in this standard, and they carry different confidence:

- **Tool-behavior claims** (naming semantics, `.chezmoiignore`, `run_onchange_` scripts, health-check commands) are grounded in chezmoi's own official documentation — authoritative, and reasonably stable.
- **House-convention claims** (the shell-loader pattern, the bin/env dispatcher pattern, the Pattern A/B decision rule, the single-source multi-target templating pattern, the CLAUDE.md layering split, the audit-reporting etiquette) are derived from a **single anonymized case-study repo** (n=1, audited 2026-07-12) — not a corpus the way `ki-repo`'s repo standard was derived from ten `knowledgeislands`-org repos. Treat every `[J]` criterion in the rubric as provisional until more repos have been audited against this skill and the pattern is confirmed to generalize.

## Authoritative (chezmoi.io)

| Source | Governs | Last reviewed |
| --- | --- | --- |
| [Reference: source state attributes][attributes] | the `dot_`/`executable_`/`private_`/`.tmpl` naming-prefix system and prefix stacking | 2026-07-12 |
| [Reference: `.chezmoiignore`][chezmoiignore] | ignore-file syntax, including negation-through-ignored-parents | 2026-07-12 |
| [Reference: scripts][scripts] | `run_onchange_` script semantics — when chezmoi re-runs a script | 2026-07-12 |
| [Reference: templating][templating] | `.chezmoidata`/`.chezmoitemplates`, Go-template rendering | 2026-07-12 |
| [CLI: `chezmoi doctor`][doctor] | built-in diagnostics | 2026-07-12 |
| [CLI: `chezmoi status` / `managed` / `unmanaged`][status] | drift-checking commands | 2026-07-12 |
| [CLI: `source-path` / `target-path`][source-path] | resolving between source and target paths | 2026-07-12 |

## House convention (n=1 case study — not chezmoi.io-sourced)

| Source | Governs | Last reviewed |
| --- | --- | --- |
| One anonymized personal chezmoi dotfiles repo, audited directly | shell-loader pattern, bin/env dispatcher pattern, Pattern A/B decision rule, single-source multi-target templating pattern, CLAUDE.md layering split, audit-reporting etiquette | 2026-07-12 |

## Last review

Initial authoring, **2026-07-12** — standard drafted directly from chezmoi.io's reference documentation (source-state attributes, `.chezmoiignore`, scripts, templating) and from one real chezmoi repo's `.claude/*.md` topic files, generalized and stripped of repo-specific/personal content (see [`../SKILL.md`](../SKILL.md)'s origin note). No prior refresh has run — this is the baseline.

- **chezmoi.io sources**: all fetched/reviewed at authoring time, 2026-07-12. No drift to report against — this is the first pass.
- **House-convention source**: a single case study, explicitly not treated as a corpus. Open watch-item: re-confirm each `[J]` criterion in [the rubric](audit-rubric.md) still generalizes once a second and third chezmoi repo have been audited against this skill — if a pattern turns out to be idiosyncratic to the original repo rather than a genuine chezmoi convention, narrow or retire the corresponding standard section rather than letting it stand as house-wide guidance on n=1 evidence.

[attributes]: https://www.chezmoi.io/reference/target-types/
[chezmoiignore]: https://www.chezmoi.io/reference/special-files-and-directories/chezmoiignore/
[scripts]: https://www.chezmoi.io/reference/scripts/
[templating]: https://www.chezmoi.io/user-guide/templating/
[doctor]: https://www.chezmoi.io/reference/commands/doctor/
[status]: https://www.chezmoi.io/reference/commands/status/
[source-path]: https://www.chezmoi.io/reference/commands/source-path/
