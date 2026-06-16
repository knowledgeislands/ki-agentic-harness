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
| BUN      | [bun.sh / releases][bun]                           | `packageManager: bun@1.3.x`; the Bun-install / Node-run split | bun@1.3.14              | 2026-06-14    |
| NODE     | [Node release schedule][node]                      | `engines.node >= 22` (the runtime `dist/` targets)            | >=22.0.0                | 2026-06-14    |
| BIOME    | [biomejs.dev][biome]                               | `biome.json` schema + the formatter/linter config             | 2.5.0                   | 2026-06-14    |
| TS       | [typescript releases][ts]                          | the `tsconfig` / `tsconfig.build` compiler options            | ^6.0                    | 2026-06-14    |
| VITEST   | [vitest.dev][vitest]                               | the test runner + 100% coverage config (`vitest run`, v8)     | current                 | 2026-06-14    |
| SYNCPACK | [syncpack][syncpack]                               | `lint:package` (`syncpack format`)                            | ^15                     | 2026-06-14    |
| MDLINT   | [markdownlint-cli2][mdlint] / [prettier][prettier] | `lint:md` (the Markdown mechanical pass)                      | mdl ^0.22 / prettier ^3 | 2026-06-14    |
| DEPCHECK | [depcheck][depcheck]                               | `deps:missing` / `deps:unused`                                | current                 | 2026-06-14    |

## In-house (the workspace convention)

The standard is the **majority shape** across the TS/Bun repos under `knowledgeislands/`. They are the living source of truth for house
style; when they diverge, the majority wins and the outlier is a finding unless documented.

| Tag       | Source                                                                                     | Governs                                                                              | Last reviewed |
| --------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------- |
| REPOS     | the 10 TS/Bun sibling repos †                                                              | the script families, tsconfig/biome/vitest shape, the build/chmod rule               | 2026-06-14    |
| FRAMEWORK | `arcadia-agentic-harness/README.md` "governance-skill shape" + "Principles across the set" | the enforcement framework (modes, checker contract, rubric tagging, sources cadence) | 2026-06-14    |

† the 7 `mcp-*` servers + `arcadia-agentic-harness`, `arcadia-principal`, `arcadia-website`.

## Last review

REFRESH last run **2026-06-14** (skill created). Cadence: monthly, alongside the other governance skills (the
`knowledgeislands-skills-refresh` routine).

- **Pins confirmed current:** `bun@1.3.14`, `engines.node >=22.0.0`, Biome `2.5.0`, TypeScript `^6.0`, syncpack `^15`, markdownlint-cli2
  `^0.22`, prettier `^3`.
- **Standard extracted from `knowledgeislands-mcp`:** the generic toolchain (package.json families, bun-vs-node, tsconfig/vitest/biome, .env
  discipline, the build/chmod rule) was lifted out of that skill's §7–10 and rubric so it lives once, cross-cutting; `knowledgeislands-mcp`
  now references this standard and keeps only its MCP delta.
- **Open watch-items:** TypeScript `^6.0.3` and `@types/node ^25` are recent majors — confirm no `tsconfig` option deprecations on the next
  refresh. Bun and Biome both move fast; re-pin on the house upgrade. The `deps:*` family was promoted from "optional" to required — revisit
  if a new TS repo type legitimately can't carry it.

[bun]: https://bun.sh/blog
[node]: https://nodejs.org/en/about/previous-releases
[biome]: https://biomejs.dev/
[ts]: https://www.typescriptlang.org/
[vitest]: https://vitest.dev/
[syncpack]: https://github.com/JamieMason/syncpack
[mdlint]: https://github.com/DavidAnson/markdownlint-cli2
[prettier]: https://prettier.io/
[depcheck]: https://github.com/depcheck/depcheck
