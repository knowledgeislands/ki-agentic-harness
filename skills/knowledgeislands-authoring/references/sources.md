# Sources — where the authoring conventions come from

The sources behind [markdown-authoring.md](markdown-authoring.md) and [toml-config.md](toml-config.md). Mode REFRESH reads this file,
re-fetches each source, diffs it against the conventions, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block
below (what changed is recorded in the commit, not a changelog). The house style is mostly internally owned, but it sits on top of these
external tools and specs, which move — so this is the skill's memory of what it rests on.

## Authoritative

| Source                   | Governs                                                            | Last reviewed |
| ------------------------ | ------------------------------------------------------------------ | ------------- |
| [CommonMark spec][cm]    | the Markdown syntax baseline                                       | 2026-06-13    |
| [Prettier options][pr]   | what the formatter normalises — `proseWrap`, `printWidth` (140)    | 2026-06-13    |
| [markdownlint rules][ml] | the `MDxxx` rules enforced (`MD013` off, `MD060`, `MD051`/`MD052`) | 2026-06-13    |
| [TOML spec][toml]        | TOML syntax for the shared `.ki-config.toml`                       | 2026-06-13    |

[cm]: https://spec.commonmark.org/
[pr]: https://prettier.io/docs/options
[ml]: https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md
[toml]: https://toml.io/en/v1.0.0

## Last review

REFRESH last run **2026-06-13** against CommonMark, Prettier, markdownlint, and the TOML spec (sources above).

- **CommonMark:** accessible this run (previously 403). Version 0.31.2 (released 2024-01-28) confirmed current; no newer version.
- **Prettier:** accessible this run (previously 403). House install is 3.8.3. New options since last confirmed review: `objectWrap` (v3.5.0,
  default `"preserve"`) for JS object literal formatting, `checkIgnorePragma` (v3.6.0, default `false`) for file-level opt-out markers.
  Neither affects the judgment conventions (Markdown prose wrap, link style, TOML) — no convention change.
- **markdownlint:** confirmed unchanged. Rules page accessible; still lists MD013 (off in house config), MD051/MD052 (reference-link
  validation), MD060 (table-column-style). No new or deprecated rules.
- **TOML:** `toml.io/en/v1.1.0` is now reachable (previously 403). The site shows v1.1.0 as current alongside v1.0.0. No diff was obtainable
  from the rendered page alone; the tracked URL still points to v1.0.0.
- **No convention change this run.** The judgment-layer rules (wide-table → footnote, link style, `.ki-config.toml` formatting) remain
  correct.
- **Open watch-items:** assess TOML v1.1.0 vs v1.0.0 for any syntax additions that affect `.ki-config.toml` formatting convention; update
  tracked URL to v1.1.0 once diff is confirmed (check `github.com/toml-lang/toml` release notes).
