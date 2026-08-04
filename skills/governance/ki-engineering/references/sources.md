# Sources — where the engineering standard comes from

**Refresh:** external-spec · monthly

The toolchain pins and conventions behind [the engineering standard](standards-engineering.md). Mode REFRESH reads this file, re-fetches each source, diffs it against the standard, rubric, and [canonical item catalogue](../scripts/rubric/items/index.ts), then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below. Provenance only — what changed goes in the REFRESH commit, not a changelog here.

Two layers feed the standard: the **upstream tools** (what they require / their current versions) and the **in-house convention** (the opinionated shape the sibling repos share on top). A pin is only "upstream-driven" if it traces to a tool's release; everything else is house style.

## Upstream tools (the pins the standard hard-codes)

The standard pins versions in `packageManager`, `engines`, `biome.json`'s `$schema`, and the devDependency ranges. Track the current line of each so a REFRESH knows when a pin has aged.

| Tag | Source | Governs | Pinned at | Last reviewed |
| --- | --- | --- | --- | --- |
| BUN | [bun.sh / releases][bun] | `packageManager: bun@1.3.x`; the Bun-install / Node-run split | bun@1.3.14 | 2026-08-03 |
| NODE | [Node release schedule][node] | `engines.node >= 22` (the runtime `dist/` targets) | >=22.0.0 | 2026-08-03 |
| BIOME | [biomejs.dev][biome] | `biome.json` schema + the formatter/linter config | 2.5.6 | 2026-08-03 |
| TS | [typescript releases][ts] | the `tsconfig` / `tsconfig.build` compiler options | ^6.0 ⚠ | 2026-08-03 |
| VITEST | [vitest.dev][vitest] | the config-gated test profile + 100% coverage (`vitest run`, v8) | current | 2026-08-03 |
| SYNCPACK | [syncpack][syncpack] | package ordering inside engineering audit/conform | ^15 | 2026-08-03 |
| MDLINT | [markdownlint-cli2][mdlint] / [prettier][prettier] | Markdown audit/conform inside `ki-authoring` ❡ | mdl ^0.23 / prettier ^3 | 2026-08-03 |
| KNIP | [knip][knip] | dependency + dead-code checks inside engineering audit/conform | current | 2026-08-03 |

❡ The Markdown mechanical pass.

## In-house (the workspace convention)

The standard is the **majority shape** across the TS/Bun repos under `knowledgeislands/`. They are the living source of truth for house style; when they diverge, the majority wins and the outlier is a finding unless documented.

| Tag       | Source                        | Governs                                                                              | Last reviewed |
| --------- | ----------------------------- | ------------------------------------------------------------------------------------ | ------------- |
| REPOS     | the 10 TS/Bun sibling repos † | aggregate/scoped scripts, tsconfig/biome, config-gated Vitest, build/chmod           | 2026-06-21    |
| FRAMEWORK | harness docs ※                | the enforcement framework (modes, checker contract, rubric tagging, sources cadence) | 2026-06-21    |

† the 7 `mcp-*` servers + `ki-agentic-harness`, `ki-arcadia-principal`, `ki-website`.

※ `ki-agentic-harness/docs/skills.md` "governance-skill shape".

## Last review

REFRESH last run **2026-08-03** (previous: 2026-07-04). Upstream tool versions re-fetched via npm registry. **Two notable upstream changes this cycle: TypeScript 7.0 has GA'd and Node 22 has entered EOL. Both require an explicit decision before the standard is updated — flagged as open items below.**

- **Biome:** upstream is **2.5.6** (up from 2.5.2; 2.5.3–2.5.6 are patch releases). Source table "Pinned at" updated. The house biome.json `$schema` should be bumped to `2.5.6` on the next repo-level upgrade.
- **TypeScript 7.0 GA** (watch-item resolved): TypeScript 7.0.2 was published to npm tagged `latest` on or around 2026-07-08. It is a Go-native rewrite (~10x faster compilation) with breaking changes — strict mode on by default, ES5 target removed (ES2015 floor), AMD/UMD/SystemJS removed, `moduleResolution: node10` removed, and no stable programmatic API (7.1 needed for tools depending on it). **The `^6.0` pin is NOT auto-bumped here** — upgrading to `^7.0` changes the required `target`/`moduleResolution` floor and removes the AMD/UMD output we do not use; a targeted decision is needed. Source table carries `^6.0 ⚠` as a signal. Human action needed: decide whether to upgrade to `^7.0` and update `tsconfig` targets and the standard accordingly.
- **Node 22 EOL:** Node 22 reached EOL on 2026-07-28 (5 days before this refresh). Node 24 is now the Active LTS. The current `>=22.0.0` floor points at an EOL runtime. The standard wording should migrate to `>=24.0.0` on the next targeted update; held for human decision. Watch-item from prior runs now resolved-but-unactioned.
- **Bun:** 1.3.14 — confirmed unchanged (no newer 1.3.x stable release).
- **markdownlint-cli2:** 0.23.2 on npm; still within the `^0.23` range. No change to pin.
- **prettier:** 3.9.6 on npm (up from 3.9.4); still within the `^3` (and `^3.9`) range. No change to standard pin.
- **vitest:** 4.1.10 (up from 4.1.9); tracked as "current", no pin change.
- **syncpack:** 15.3.2 — unchanged.
- **knip:** 6.31.0 on npm; tracked as "current".
- **Open watch-items:**
  - **TypeScript 7.0 decision (URGENT):** 7.0.2 is GA and tagged `latest` on npm. The `^6.0` pin is now tracking a superseded major. Decide: upgrade to `^7.0` (requires tsconfig `target`/`lib` review), pin `^6.0` explicitly to block the upgrade, or track both in parallel. This is the next planned action for this skill.
  - **Node 22 floor decision:** `>=22.0.0` is now an EOL floor. Recommend moving to `>=24.0.0` in the standard and sibling `engines` fields on the next targeted sweep.
  - **Repo-set count:** the "10 TS/Bun repos / seven `mcp-*` servers" claim overcounts — 6 `mcp-*` on disk. Reconcile in SKILL.md, this footnote, README, and CLAUDE.md centrally (carried from prior run).
  - Biome patch bumps; re-pin on the next house upgrade once 2.5.6 lands in the repos.

[bun]: https://bun.sh/blog
[node]: https://nodejs.org/en/about/previous-releases
[biome]: https://biomejs.dev/
[ts]: https://www.typescriptlang.org/
[vitest]: https://vitest.dev/
[syncpack]: https://github.com/JamieMason/syncpack
[mdlint]: https://github.com/DavidAnson/markdownlint-cli2
[prettier]: https://prettier.io/
[knip]: https://github.com/webpro-nl/knip
