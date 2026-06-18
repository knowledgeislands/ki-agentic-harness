# Sources — where the authoring conventions come from

The sources behind [markdown-authoring.md](markdown-authoring.md) and [toml-config.md](toml-config.md). Mode REFRESH reads this file,
re-fetches each source, diffs it against the conventions, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block
below (what changed is recorded in the commit, not a changelog). The house style is mostly internally owned, but it sits on top of these
external tools and specs, which move — so this is the skill's memory of what it rests on.

## Authoritative

| Source                   | Governs                                                            | Last reviewed |
| ------------------------ | ------------------------------------------------------------------ | ------------- |
| [CommonMark spec][cm]    | the Markdown syntax baseline                                       | 2026-06-18    |
| [Prettier options][pr]   | what the formatter normalises — `proseWrap`, `printWidth` (140)    | 2026-06-18    |
| [markdownlint rules][ml] | the `MDxxx` rules enforced (`MD013` off, `MD060`, `MD051`/`MD052`) | 2026-06-18    |
| [TOML spec][toml]        | TOML syntax for the shared `.ki-config.toml`                       | 2026-06-18    |

[cm]: https://spec.commonmark.org/
[pr]: https://prettier.io/docs/options
[ml]: https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md
[toml]: https://toml.io/en/v1.1.0

## Last review

REFRESH last run **2026-06-18** against CommonMark, Prettier, markdownlint, and the TOML spec (sources above).

- **CommonMark:** accessible. Version 0.31.2 (released 2024-01-28) confirmed current; no newer version.
- **Prettier:** accessible. `proseWrap` (default `"preserve"`, house `always`), `printWidth` (default `80`, house `140`) unchanged. No new
  options affecting the judgment conventions; `objectWrap` (v3.5.0) and `checkIgnorePragma` (v3.6.0) remain irrelevant, as do the
  experimental `experimentalOperatorPosition` / `experimentalTernaries`. No convention change.
- **markdownlint:** confirmed unchanged. Still lists MD013 (off in house config), MD051/MD052 (reference-link validation), MD060
  (table-column-style); MD060 remains the highest-numbered rule. No new or deprecated rules. Local `lint:md:check` clean on
  markdownlint-cli2 v0.22.1 / markdownlint v0.40.0.
- **TOML:** v1.1.0 went **final on 2025-12-18** (the long-standing draft shipped; `github.com/toml-lang/toml` release `1.1.0` is marked
  Latest). Its additions — multi-line / trailing-comma inline tables, `\e` and `\xHH` string escapes, optional seconds in datetimes — are
  additive and do not touch `.ki-config.toml` formatting (lowercase `snake_case` keys, double-quoted strings, inline arrays,
  one-table-per-skill, `#` comments all unchanged). Tracked URL moved from v1.0.0 to **v1.1.0** to follow the released current spec.
- **No convention change this run.** The judgment-layer rules (wide-table → footnote, link style, `.ki-config.toml` formatting) remain
  correct.
- **Open watch-items:** none. (Prior TOML v1.1.0 watch-item closed — released and assessed.)
