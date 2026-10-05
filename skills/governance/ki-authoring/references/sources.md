# Sources — where the authoring conventions come from

**Refresh:** external-spec · monthly

The sources behind [the enforcement standard](standards-authoring.md), [the Markdown standard](standards-markdown.md), and [the TOML standard](standards-toml.md). Mode REFRESH reads this file, re-fetches each source, diffs it against the conventions, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below (what changed is recorded in the commit, not a changelog). The house style is mostly internally owned, but it sits on top of these external tools and specs, which move — so this is the skill's memory of what it rests on.

## Authoritative

| Source                      | Governs                                                     | Last reviewed |
| --------------------------- | ----------------------------------------------------------- | ------------- |
| [CommonMark spec][cm]       | the Markdown syntax baseline                                | 2026-10-05    |
| [rumdl rules][ru]           | the `MDxxx` rules enforced, their options, and reflow modes | 2026-10-05    |
| [rumdl global settings][rgs] | configuration-file and global-setting semantics | 2026-10-05 |
| [rumdl CLI][rcli] | `check --fix` behaviour and exit semantics | 2026-10-05 |
| [rumdl releases][rr] | current upstream release | 2026-10-05 |
| [GitHub alert guidance][ga] | GitHub alert labels, purpose, and Markdown form             | 2026-10-05    |
| [TOML spec][toml]           | TOML syntax for the shared `.ki.toml`                | 2026-10-05    |

## Advisory

Advisory sources inform local judgment conventions but are not specifications, mechanical findings, or universal Knowledge Islands policy.

| Source                | Informs                                                 | Last reviewed |
| --------------------- | ------------------------------------------------------- | ------------- |
| [Standard Readme][sr] | README entry-point structure and reader discoverability | 2026-10-05    |

[cm]: https://spec.commonmark.org/
[ru]: https://rumdl.dev/rules
[rgs]: https://rumdl.dev/global-settings/
[rcli]: https://rumdl.dev/usage/cli/
[rr]: https://github.com/rvben/rumdl/releases/tag/v0.2.78
[ga]: https://docs.github.com/en/contributing/style-guide-and-content-model/style-guide#alerts
[toml]: https://toml.io/en/v1.1.0
[sr]: https://github.com/RichardLitt/standard-readme

## Last review

REFRESH last run **2026-10-05**. CommonMark 0.31.2, TOML 1.1.0, GitHub alerts, and rumdl's release surface rechecked. rumdl advanced from v0.2.54 to v0.2.78 (24 releases).

- **CommonMark:** v0.31.2 (released 2024-01-28) confirmed still current; no newer version. Syntax baseline unchanged.
- **rumdl:** advanced to **v0.2.78** (2026-09-29). Key changes since v0.2.54: LSP per-directory config, MD013 sentence-opening-number fix, CRLF preservation through fixes, nested blockquote recognition, balanced parentheses in link paths, CJK line break handling, definition list reflow, mixed line ending and HTML block recognition fixes. Three new rules added — **MD090** (horizontal rule before heading, v0.2.72), **MD091** (opt-in: Markdown inside HTML blocks, v0.2.65), **MD093** (inline formatting in headings, v0.2.75). An **MD092** rule appears in the registry but its release and nature were not confirmed. The rule registry now covers MD001–MD093 (89 rules with gaps at MD002, MD006, MD008, MD015–MD017). **Open watch-item:** evaluate MD090, MD091, MD092, and MD093 against the house standard and determine whether to enable, disable, or treat as not-applicable. Re-test the open disabled-rule reproductions (MD005, MD056, MD060, MD075) against v0.2.78.
- **GitHub alerts:** five labels (`NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`) and `> [!ALERT_TYPE]` syntax confirmed unchanged.
- **TOML:** v1.1.0 remains current. No v1.2.0 or newer listed. Unchanged.
- **Standard Readme:** confirmed as advisory-only; no changes to the advisory guidance.
- **Standing check:** a rule this configuration disables is a deferral, not a verdict. Re-test each one against its recorded reproduction on every rumdl upgrade, and re-enable the ones upstream has fixed — otherwise a defensive setting outlives the defect and quietly costs the coverage it was meant to protect.
- **Open watch-items:**
  - **New rules MD090, MD091, MD092, MD093** require review and a house determination (enable, disable, or not-applicable). MD091 is opt-in; the others are default-on. Do not defer — each upgrade cycle that passes without a determination is a cycle without coverage or a cycle with an untested enable.
  - `MD056` is fixed for aliased wikilinks under the Obsidian flavor in 0.2.54. Under the standard flavor, `[[Target|Label]]` correctly retains GFM pipe semantics and is reported as an extra table cell. Re-test both flavors and the no-fix guard against v0.2.78.
  - Block constructs are recognised on soft-wrapped continuation lines, which is one root cause behind three separate corruptions. A line beginning `##]` is admitted as an ATX heading although CommonMark requires a space after the hash run, and `MD022`, `MD018` and `MD026` then split the paragraph and delete its full stop. An empty list item after a wrapped line is read as a setext heading, and `MD003` injects a literal `##` mid-sentence. `MD030` reads `8.Does ownership...` as a marker with no space and inserts one. To re-test each: run the construct through `rumdl check --fix` and through a reference CommonMark parser, and confirm they now agree.
  - `MD013` reflow silently skips any paragraph containing a `|`. Non-destructive, no rule disabled. Re-test on each bump.
  - `MD060` mis-handles a placeholder table whose only body row holds `-` cells. Re-test against v0.2.78 to see if upstream has fixed it.
  - `MD057` is disabled pending a decision about published skill copies. This one waits on a decision here, not on upstream.
  - rumdl is pre-1.0 and single-maintainer; confirm the house Markdown output is unaffected on each bump. The estate is a fixed point of this configuration, so any diff on upgrade is a regression to investigate rather than an improvement to accept.
  - Biome does not support Markdown at all (no `markdown` key in its schema); if that changes it would displace rumdl's formatter role but not its linter role.
