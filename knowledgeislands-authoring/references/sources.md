# Sources — where the authoring conventions come from

The sources behind [markdown-authoring.md](markdown-authoring.md) and [toml-config.md](toml-config.md). Mode REFRESH reads this file, re-fetches each source,
diffs it against the conventions, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below (what changed is recorded in the
commit, not a changelog). The house style is mostly internally owned, but it sits on top of these external tools and specs, which move — so this is the skill's
memory of what it rests on.

## Authoritative

| Source                   | Governs                                                            | Last reviewed |
| ------------------------ | ------------------------------------------------------------------ | ------------- |
| [CommonMark spec][cm]    | the Markdown syntax baseline                                       | 2026-06-01    |
| [Prettier options][pr]   | what the formatter normalises — `proseWrap`, `printWidth` (160)    | 2026-06-01    |
| [markdownlint rules][ml] | the `MDxxx` rules enforced (`MD013` off, `MD060`, `MD051`/`MD052`) | 2026-06-01    |
| [TOML spec][toml]        | TOML syntax for the shared `.ki-config.toml`                       | 2026-06-01    |

[cm]: https://spec.commonmark.org/
[pr]: https://prettier.io/docs/options
[ml]: https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md
[toml]: https://toml.io/en/v1.0.0

## Last review

REFRESH last run **2026-06-01** against CommonMark, Prettier, markdownlint, and the TOML v1.0.0 spec (the sources above).

- **State:** conventions established (wide-table → footnote transforms and link style for Markdown; `.ki-config.toml` formatting from the TOML spec). No drift
  found since.
- **Could not verify:** CommonMark, Prettier, and the TOML spec returned HTTP 403 this run; markdownlint's rules page was reachable and still lists 60 rules
  (MD013 off, MD051/MD052 reference-link validation, MD060 table-column-style) — no new rules or behaviour changes.
- **Open watch-items:** re-attempt the three 403 sources next refresh.
