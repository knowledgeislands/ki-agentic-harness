# Sources — where the engineering standard comes from

The toolchain pins and conventions behind [the engineering standard](engineering-standard.md) and
[the enforcement framework](enforcement-framework.md). Mode REFRESH reads this file, re-fetches each source, diffs it against the standard +
rubric + [`../scripts/audit-engineering.ts`](../scripts/audit-engineering.ts), then **bumps the `last reviewed` dates** and refreshes the
`## Last review` block below. Provenance only — what changed goes in the REFRESH commit, not a changelog here.

Two layers feed the standard: the **upstream tools** (what they require / their current versions) and the **in-house convention** (the
opinionated shape the sibling repos share on top). A pin is only "upstream-driven" if it traces to a tool's release; everything else is
house style.

## Upstream tools (the pins the standard hard-codes)

The standard pins versions in `packageManager`, `engines`, `biome.json`'s `$schema`, and the devDependency ranges. Track the current line of
each so a REFRESH knows when a pin has aged.

| Tag      | Source                                             | Governs                                                       | Pinned at               | Last reviewed |
| -------- | -------------------------------------------------- | ------------------------------------------------------------- | ----------------------- | ------------- |
| BUN      | [bun.sh / releases][bun]                           | `packageManager: bun@1.3.x`; the Bun-install / Node-run split | bun@1.3.14              | 2026-06-21    |
| NODE     | [Node release schedule][node]                      | `engines.node >= 22` (the runtime `dist/` targets)            | >=22.0.0                | 2026-06-21    |
| BIOME    | [biomejs.dev][biome]                               | `biome.json` schema + the formatter/linter config             | 2.5.0                   | 2026-06-21    |
| TS       | [typescript releases][ts]                          | the `tsconfig` / `tsconfig.build` compiler options            | ^6.0                    | 2026-06-21    |
| VITEST   | [vitest.dev][vitest]                               | the test runner + 100% coverage config (`vitest run`, v8)     | current                 | 2026-06-21    |
| SYNCPACK | [syncpack][syncpack]                               | `lint:package` (`syncpack format`)                            | ^15                     | 2026-06-21    |
| MDLINT   | [markdownlint-cli2][mdlint] / [prettier][prettier] | `lint:md` (the Markdown mechanical pass)                      | mdl ^0.22 / prettier ^3 | 2026-06-21    |
| DEPCHECK | [depcheck][depcheck]                               | `deps:missing` / `deps:unused`                                | current                 | 2026-06-21    |

## In-house (the workspace convention)

The standard is the **majority shape** across the TS/Bun repos under `knowledgeislands/`. They are the living source of truth for house
style; when they diverge, the majority wins and the outlier is a finding unless documented.

| Tag       | Source                                                                                                           | Governs                                                                              | Last reviewed |
| --------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------- |
| REPOS     | the 10 TS/Bun sibling repos †                                                                                    | the script families, tsconfig/biome/vitest shape, the build/chmod rule               | 2026-06-21    |
| FRAMEWORK | `arcadia-agentic-harness/docs/skills.md` "governance-skill shape" + `docs/design.md` "Principles across the set" | the enforcement framework (modes, checker contract, rubric tagging, sources cadence) | 2026-06-21    |

† the 7 `mcp-*` servers + `arcadia-agentic-harness`, `arcadia-principal`, `arcadia-website`.

## Last review

REFRESH last run **2026-06-21**. Cadence: monthly, alongside the other governance skills (the `knowledgeislands-skills-refresh` routine). No
drift this cycle: every pin is unchanged since the 2026-06-18 review.

- **Pins confirmed current:** `bun@1.3.14` (still the latest stable line — 1.3.x shipped through .14 in May 2026, no newer release),
  `engines.node >=22.0.0` (22 now Maintenance LTS, 24 Active LTS, 26 Current — the `>=22` floor stays valid), Biome `2.5.0` (still latest),
  TypeScript `^6.0` (latest is `6.0.3`, exactly the repo pin — no newer 6.x; 7.0 Go port still mid-to-late 2026), syncpack `^15` (latest
  `15.3.2`, absorbed by the range), markdownlint-cli2 `^0.22` (`0.22.1`), prettier `^3` (`3.8.x`). vitest (`4.1.9`; 5.0 still in beta) and
  depcheck carry no hard-coded pin.
- **Repo cross-check clean:** `arcadia-agentic-harness` package.json / mise.toml / biome.json all agree with the standard —
  `packageManager bun@1.3.14` == `mise.toml bun 1.3.14` (drift pair holds), `node = "24.15.0"` pinned above the `>=22` floor, biome
  `$schema` and devDep both `2.5.0`.
- **Open watch-items:** Bun and Biome both move fast and were unchanged this cycle; re-pin on the house upgrade. TypeScript 7.0 (the Go-port
  rewrite) is expected mid-to-late 2026 — when it lands, decide whether the `^6.0` pin tracks it or stays on 6.x. Node announced a
  release-schedule change taking effect with v27 (one major/year, every release becomes LTS, odd/even distinction dropped); v26 is the last
  release under the current model — informational now, re-check the `>=22` floor and Node source wording at the first refresh after
  October 2026.

[bun]: https://bun.sh/blog
[node]: https://nodejs.org/en/about/previous-releases
[biome]: https://biomejs.dev/
[ts]: https://www.typescriptlang.org/
[vitest]: https://vitest.dev/
[syncpack]: https://github.com/JamieMason/syncpack
[mdlint]: https://github.com/DavidAnson/markdownlint-cli2
[prettier]: https://prettier.io/
[depcheck]: https://github.com/depcheck/depcheck
