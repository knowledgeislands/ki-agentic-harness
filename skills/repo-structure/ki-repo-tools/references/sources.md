# Sources — where the standard comes from

**Refresh:** external-spec · quarterly

The authoritative and in-house sources behind the [tool-repository standard](standards-tool-repositories.md) and [rubric](rubric.md). Mode REFRESH reads this file, re-fetches each source, and diffs it against the standard plus the structured catalogue under `scripts/rubric/items/`. It then **bumps the `Last reviewed` dates** and refreshes the `## Last review` block below; what changed belongs in the commit, not a changelog here.

Two layers feed the standard: the **external specs** (shellcheck, bats, keep-a-changelog, semver, XDG) that a conformant tool repo builds on, and the **in-house tool repos** that supply implementation evidence for shared practice. A finding is only "spec-driven" if it traces to an external spec; everything else is house style layered on top and should be labelled as such.

## External specs

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| SHELLCHECK | [ShellCheck][shellcheck] | Shell-tool lint gate (SHELL-LINT) — clean in CI | 2026-07-09 |
| BATS | [bats-core][bats] | Shell-tool test framework (SHELL-TEST) — `*.bats` + CI run | 2026-07-09 |
| CHANGELOG | [Keep a Changelog][keepachangelog] | Optional chronological changelog shape | 2026-07-30 |
| SEMVER | [Semantic Versioning 2.0.0][semver] | `vX.Y.Z` version marker + release tags | 2026-07-09 |
| XDG | [XDG Base Directory Specification][xdg] | Where the tool writes config/state/cache | 2026-07-09 |

## In-house tool repositories

The tool repositories under `knowledgeislands/` provide evidence for house style. When an implementation and the standard diverge, decide which is right and reconcile; keep shared policy in the skill and tool-specific procedures in the local guides.

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| MGIT | `tools-mgit` | Bash/Git boundary, installer overrides, workspace/repository command grouping | 2026-10-04 |
| KI | `tools-ki` | Typed command host, diagnostics, completion, signed installer, manual distribution | 2026-10-04 |
| RIG | `tools-rig` | Authored assembly, terminal ownership, workstation isolation, installer verification | 2026-10-04 |
| TECHNE | `tools-techne` | Typed operator boundary, compiled archives, remote-environment hold | 2026-10-04 |
| ALMANAC | `tools-git-almanac` | Read-only Git inspection, reporting boundary, Node artifact delivery | 2026-10-04 |

## Last review

The external-spec REFRESH last ran **2026-07-30**. The targeted in-house review on **2026-10-04** compared all five tools' standing instructions and delivery/release guides, clarified shared policy versus executable local procedures, and consolidated repeated guidance. Installer verification examples now require explicit disposable executable/manual destinations, unavailable checks remain visible, and post-hook committed-path inspection belongs to `ki-git`. Repeatable CLI parity remains a native-test responsibility; static hosted audit does not execute tools or claim semantic conformance. External specifications were not re-fetched in this review.

The owner-approved diagnostic review on **2026-10-05** compared all five tools' `diag` and `doctor` implementations and Rig's table renderer. It established common execution-context facts, evidence-backed local/release/unknown installation provenance, scoped health verdicts and counts, share-safe default diagnostics, and width-aware tables with lossless identifiers and deterministic redirected output. These are house conventions rather than new external requirements. Isolated repository-native fixtures own runtime proof; the hosted audit continues to report the semantic review as judgment work without launching target executables.

**Open watch-items:**

- Homebrew's own audit surface (`brew audit` / `brew style`, the Formula Cookbook) is tracked by the sibling `ki-repo-homebrew-tap` skill, not here — reconcile the tap-facing half there.
- If a second shell-specific concern emerges beyond shellcheck + bats, reconsider a dedicated `ki-shell` skill (deliberately not created at n=1).

[shellcheck]: https://www.shellcheck.net/
[bats]: https://bats-core.readthedocs.io/
[keepachangelog]: https://keepachangelog.com/en/1.1.0/
[semver]: https://semver.org/spec/v2.0.0.html
[xdg]: https://specifications.freedesktop.org/basedir-spec/latest/
