# Sources — where the authoring conventions come from

**Refresh:** external-spec · monthly

The sources behind [the enforcement standard](standards-authoring.md), [the Markdown standard](standards-markdown.md), and [the TOML standard](standards-toml.md). Mode REFRESH reads this file, re-fetches each source, diffs it against the conventions, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below (what changed is recorded in the commit, not a changelog). The house style is mostly internally owned, but it sits on top of these external tools and specs, which move — so this is the skill's memory of what it rests on.

## Authoritative

| Source                      | Governs                                                     | Last reviewed |
| --------------------------- | ----------------------------------------------------------- | ------------- |
| [CommonMark spec][cm]       | the Markdown syntax baseline                                | 2026-09-14    |
| [rumdl rules][ru]           | the `MDxxx` rules enforced, their options, and reflow modes | 2026-09-14    |
| [rumdl global settings][rgs] | configuration-file and global-setting semantics | 2026-09-14 |
| [rumdl CLI][rcli] | `check --fix` behaviour and exit semantics | 2026-09-14 |
| [rumdl releases][rr] | current upstream release | 2026-09-14 |
| [GitHub alert guidance][ga] | GitHub alert labels, purpose, and Markdown form             | 2026-09-14    |
| [TOML spec][toml]           | TOML syntax for the shared `.ki.toml`                | 2026-09-14    |

## Advisory

Advisory sources inform local judgment conventions but are not specifications, mechanical findings, or universal Knowledge Islands policy.

| Source                | Informs                                                 | Last reviewed |
| --------------------- | ------------------------------------------------------- | ------------- |
| [Standard Readme][sr] | README entry-point structure and reader discoverability | 2026-08-29    |

[cm]: https://spec.commonmark.org/
[ru]: https://rumdl.dev/rules
[rgs]: https://rumdl.dev/global-settings/
[rcli]: https://rumdl.dev/usage/cli/
[rr]: https://github.com/rvben/rumdl/releases
[ga]: https://docs.github.com/en/contributing/style-guide-and-content-model/style-guide#alerts
[toml]: https://toml.io/en/v1.1.0
[sr]: https://github.com/RichardLitt/standard-readme

## Last review

REFRESH last run **2026-09-14** (previous: 2026-08-12). CommonMark 0.31.2, TOML 1.1.0, GitHub alerts were rechecked; rumdl release surface surveyed across 19 releases (v0.2.54 → v0.2.73, released 2026-09-11). rumdl rule pages were egress-blocked; rule status inferred from GitHub release notes across all 19 releases.

- **Standard Readme:** Advisory — reviewed 2026-08-29; advisory cadence not monthly. No change this cycle.
- **CommonMark:** Version 0.31.2 (released 2024-01-28) confirmed still current. Syntax baseline unchanged.
- **TOML:** v1.1.0 remains current. No change.
- **GitHub alerts:** Five labels (`NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`) unchanged. GitHub notes Liquid-syntax alerts are deprecated for new alerts; this is an internal documentation-tooling change, not a user-Markdown change. No impact on the house convention.
- **rumdl (v0.2.54 → v0.2.73):** 19 releases since the last review. The installed project version is pinned at `^0.2.64` (resolves to v0.2.64); v0.2.73 is the latest release and is not yet installed. Key changes:
  - **MD005, MD075, MD056:** No fix mentioned in any of the 19 releases. All three remain unresolved upstream; leave disabled/unfixable as before.
  - **MD057:** v0.2.61 fixed the self-reference policy; v0.2.73 stopped requiring `index.md` for directory links in filesystem mode. These reduce false positives but do not resolve the estate-wide policy deferral for `ki-repo-plugins`. Rule remains disabled.
  - **MD013:** Improvements in v0.2.56, .57, .59, .64, .66, and .72 addressed sentence-ending and setext-reflow cases; the `|`-paragraph skip remains open.
  - **MD090 (v0.2.72, non-opt-in):** New rule, flags horizontal rules directly before headings. Non-opt-in means it is active by default. Not yet in the installed v0.2.64; will become active when the package is upgraded to v0.2.72+. Before upgrading, run `rumdl check` at v0.2.73 against a representative repository, count MD090 findings, and decide: enable intentionally or disable with a recorded reason.
  - **MD089 (v0.2.64, opt-in):** CJK-spacing. Opt-in; silent unless enabled. No action needed.
  - **MD091 (v0.2.65, opt-in):** Markdown in HTML blocks. Opt-in; silent unless enabled. No action needed.
  - **v0.2.73 parser improvement:** "stopped reading headings inside blocks with non-Markdown bodies." This may resolve the soft-wrap `##]` ATX-heading admission watch-item. Re-test the recorded reproduction at v0.2.73 before upgrading.
- **Standing check:** a rule this configuration disables is a deferral, not a verdict. Re-test each one against its recorded reproduction on every rumdl upgrade, and re-enable the ones upstream has fixed.
- **Open watch-items:**
  - `MD056` — under the standard flavor, `[[Target|Label]]` remains a real column separator. The house configuration keeps MD056 enabled for detection and unfixable to prevent destructive autofix. Re-test both flavors and the no-fix guard on each upgrade.
  - **Soft-wrap `##]` ATX-heading admission** — v0.2.73 parser improvement ("stopped reading headings inside blocks with non-Markdown bodies") may close this. Re-test the recorded reproduction at v0.2.73 before upgrading: run through `rumdl check --fix` and a reference CommonMark parser, confirm they agree. If resolved, remove from this list. The `MD022`/`MD018`/`MD026` and setext heading (`MD003`) corruptions are in the same family; re-test those reproductions too.
  - `MD013` reflow silently skips paragraphs containing `|`. Non-destructive; no rule disabled for it. Re-test on each MD013 upgrade: write a wrapped paragraph containing `[[Target|Label]]` and confirm `check --fix` joins it.
  - `MD060` mis-handles a placeholder table whose only body row holds `-` cells. Remains opt-in; no action needed until re-enabled.
  - `MD057` disabled pending a policy decision about `ki-repo-plugins` publication artefact links. Waits on a content decision, not upstream. v0.2.61 and v0.2.73 reduce false positives but do not resolve the policy.
  - **MD090 (non-opt-in, v0.2.72+):** Evaluate before upgrading past v0.2.71. Run a check, count findings, decide. If findings exist and are correct, fix and enable. If not applicable, disable with a recorded reason.
  - rumdl is pre-1.0 and single-maintainer; confirm the house Markdown output is unaffected on each bump. Any diff on upgrade is a regression to investigate, not an improvement to accept.
  - Biome does not support Markdown. If that changes it would displace rumdl's formatter role but not its linter role.
