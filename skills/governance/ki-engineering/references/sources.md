# Sources — where the engineering standard comes from

**Refresh:** external-spec · monthly

The toolchain pins and conventions behind [the engineering standard](standards-engineering.md). Mode REFRESH reads this file, re-fetches each source, diffs it against the standard, rubric, and [canonical item catalogue](../scripts/rubric/items/index.ts), then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below. Provenance only — what changed goes in the REFRESH commit, not a changelog here.

Two layers feed the standard: the **upstream tools** (what they require / their current versions) and the **in-house convention** (the opinionated shape the sibling repos share on top). A pin is only "upstream-driven" if it traces to a tool's release; everything else is house style.

## Upstream tools (the pins the standard hard-codes)

The standard pins versions in `packageManager`, `engines`, `biome.json`'s `$schema`, and the devDependency ranges. Track the current line of each so a REFRESH knows when a pin has aged.

| Tag | Source | Governs | Pinned at | Last reviewed |
| --- | --- | --- | --- | --- |
| BUN | [Bun releases][bun] | `packageManager` and `mise` runtime line; Bun-install / Node-run split | declared and resolved `1.4.1`; upstream `1.4.2` | 2026-10-06 |
| NODE | [Node release schedule][node] | `engines.node >= 22` for `dist/` | declared floor `>=22` | 2026-10-06 |
| BIOME | [Biome releases][biome] | `biome.json` schema + formatter/linter config | declared and resolved `2.5.15` | 2026-10-06 |
| TS | [TypeScript releases][ts] | `tsconfig` / `tsconfig.build` compiler options | declared range and resolved `7.0.2` | 2026-10-06 |
| VITEST | [Vitest guide][vitest] | config-gated test profile + 100% coverage (`vitest run`, v8) | capability-selected; upstream `5.0.3` | 2026-10-06 |
| SYNCPACK | [syncpack releases][syncpack] | package ordering inside engineering audit/conform | declared range and resolved `15.3.3` | 2026-10-06 |
| COMMITLINT | [Commitlint releases][commitlint] | deterministic Conventional Commit validation in the Husky `commit-msg` binding | declared range and resolved `21.2.3` | 2026-10-06 |
| MDLINT | [rumdl releases][rumdl] | Markdown audit/conform inside `ki-authoring` ❡ | declared `^0.2.78`, resolved `0.2.78` | 2026-10-06 |
| KNIP | [knip releases][knip] | dependency + dead-code checks inside engineering audit/conform | declared range and resolved `6.39.0` | 2026-10-06 |
| DEPCRUISER | [dependency-cruiser releases][depcruise] | module-boundary checker in the isolated `tooling/boundaries` root (`DESIGN-2`) | collection declares `^18.5.0` with TypeScript `^6.0.3` | 2026-10-06 |

❡ The Markdown mechanical pass.

## Tool compatibility constraints

A pin is current only if every tool that consumes it supports it. A consumer that lags a pinned tool forces a workaround; record it here with the condition that retires it, so REFRESH reports both a pin bump that would break a consumer and a workaround that is no longer needed.

| Consumer | Consumes | Consumer supports | Pinned | Workaround | Retire when | Last reviewed |
| --- | --- | --- | --- | --- | --- | --- |
| dependency-cruiser `18.5.0` | TypeScript compiler API | `typescript >=2 <7` | `7.0.2` | isolated `tooling/boundaries` root on TypeScript 6, installed by the root `prepare` script | a release accepts TypeScript 7, which awaits the compiler API planned for TypeScript 7.1 ([#1069][depcruise-ts7], [7.1 plan][ts71]) | 2026-10-06 |

## Supported generated-artifact locations

These upstream locations determine whether the shared ignore contract needs an additional rule. A tool output already nested beneath an existing managed rule must not create a duplicate pattern.

| Tool | Source | Generated location | Managed coverage | Last reviewed |
| --- | --- | --- | --- | --- |
| Turborepo | [Caching][turbo-cache] | `.turbo/cache` | `.turbo/` from `ki-engineering` | 2026-10-06 |
| Vite | [Shared options][vite-cache] | `node_modules/.vite` | `node_modules/` from `ki-engineering` | 2026-10-06 |

## In-house (the workspace convention)

The standard is a **deliberately selected house shape**, not a vote count. Current configured repositories and this harness's committed tool files are supporting implementation evidence; the normative rules live in the standard and its registered rubric.

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| HARNESS | `package.json` + `bun.lock` † | declared ranges and exact resolved versions for the canonical harness | 2026-10-06 |
| COLLECTION | current configured collection ※ | house-shape comparison during a deliberate refresh, not a normative repository count | 2026-10-06 |
| FRAMEWORK | harness rubric sources ‡ | mode, checker, judgment-status, and generated-publication contracts | 2026-10-06 |

† `package.json` expresses the compatible range where one is selected; `bun.lock` is the resolved evidence for this harness. They are distinct.

※ derive this during the current refresh from `.ki.toml` selectors; do not hard-code an inventory in this skill.

‡ `ki-skills` rubric-authoring standard and this skill's canonical item catalogue.

## Last review

REFRESH last run **2026-10-06**. Cadence: monthly, alongside the other governance skills.

- **Reconciled declared and resolved evidence:** the canonical harness declares Bun `1.4.1`, Biome `2.5.15`, TypeScript `^7.0.2`, syncpack `^15.3.3`, Commitlint `^21.2.3`, knip `^6.39.0`, lint-staged `^17.6.0` and rumdl `^0.2.78`; its committed lock resolves those releases. The CONFORM scaffold defaults and the Biome exemplar move to the same releases.
- **Current upstream comparison:** Biome, TypeScript, syncpack, Commitlint, knip and rumdl match their latest releases. Vitest `5.0.3` is current for capability-selected repositories. Bun `1.4.2` was published on 2026-09-05; the harness and every configured repository still pin `1.4.1`, past the 14-day window, and no audit criterion measures the Bun runtime against it, because the freshness check reads only `bun outdated`. Node 24 is the active LTS and 26 is current; the `>=22` floor stands while 22 remains in maintenance.
- **Compatibility constraints added:** dependency-cruiser `18.5.0` supports `typescript >=2 <7`, so the isolated install root stays. TypeScript 7.0 ships no compiler API; 7.1 makes stabilising it the release goal, with stable planned for 2026-11-24.
- **Collection:** the configured `ki-engineering` repositories declare Bun `1.4.1` and TypeScript `^7.0.2`; the 23 with boundary enforcement pin `dependency-cruiser ^18.5.0` with TypeScript `^6.0.3` and install it from `prepare`.
- **Generated-artifact locations:** Turborepo still writes `.turbo/cache` and Vite `node_modules/.vite`.

[bun]: https://bun.sh/blog
[node]: https://nodejs.org/en/about/previous-releases
[biome]: https://github.com/biomejs/biome/releases
[ts]: https://github.com/microsoft/typescript-go/releases
[vitest]: https://vitest.dev/
[syncpack]: https://github.com/JamieMason/syncpack/releases

[commitlint]: https://github.com/conventional-changelog/commitlint/releases
[rumdl]: https://github.com/rvben/rumdl/releases
[knip]: https://github.com/webpro-nl/knip/releases
[depcruise]: https://github.com/sverweij/dependency-cruiser/releases
[depcruise-ts7]: https://github.com/sverweij/dependency-cruiser/issues/1069
[ts71]: https://github.com/microsoft/TypeScript/issues/63703
[turbo-cache]: https://turborepo.com/docs/crafting-your-repository/caching
[vite-cache]: https://vite.dev/config/shared-options#cachedir
