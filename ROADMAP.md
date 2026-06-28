# arcadia-agentic-harness roadmap

Where this agentic harness is going. The [README](README.md) and the [docs/](docs/) it indexes cover what exists today and how to install
it; this file is the forward view. Items are grouped by confidence; speculative ones are marked _(candidate)_ until committed.

This roadmap is itself subject to the house discipline it describes: when a skill's REFRESH run or an audit surfaces a structural gap, it
lands here before it's built — and an item is **removed once done**, not ticked off, so the file always shows only open work.

**Continuous practices are not roadmap items.** Keeping the skills audited (`ki:skills:lint`, `ki:repo:audit`, `ki:kb:audit`, the
`knowledgeislands-mcp` audit over the `mcp-*` repos), re-running the advisory [eval suite](evals/README.md) as skills change, and the
scheduled `knowledgeislands-skills-refresh` sweep (which honours each skill's declared `**Refresh:**` cadence) are ongoing disciplines tied
to the invariants in [docs/design.md](docs/design.md) (_Principles across the set_) — they run continuously, so they live there, not here.

## Toolchain evaluation — complementary cost-reduction tools _(candidate)_

Four tools from the [extraheadroom.com/reduce-claude-code-costs](https://extraheadroom.com/reduce-claude-code-costs) survey were not covered
by ADR-KI-HARNESS-TOOLCHAIN-002 and warrant evaluation as a follow-on ADR:

| Tool                         | Concern               | Notes                                                                                                                                  |
| ---------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **MarkItDown** _(Microsoft)_ | Input token reduction | Converts PDFs and Office docs before they enter context; complementary to headroom-ai compression                                      |
| **Engram**                   | Cross-session memory  | Persistent memory layer; potential overlap with the harness `memory/` convention — evaluate conflict before adopting                   |
| **Caveman**                  | Input compression     | ~50% reduction on high-noise inputs (build logs, JSON arrays, shell output); may duplicate RTK coverage already bundled in headroom-ai |
| **Graphify**                 | Knowledge graph       | Claude knowledge-graph integration; least understood — evaluate fit with the KI KB paradigm                                            |

**Gate:** produce ADR-KI-HARNESS-TOOLCHAIN-003 covering adopt / decline / not-separately-applicable for each. Remove this item once the ADR
is accepted.

## Replace depcheck with knip in the `ki:deps:*` family _(candidate)_

The `knowledgeislands-engineering` standard's `ki:deps:missing` / `ki:deps:unused` scripts use `depcheck`, which is static-only and noisy on
the exact case the KI repos hit — toolchain deps referenced from config files (biome, prettier, husky, lint-staged, vitest, wrangler,
eleventy) rather than imported — hence the brittle `depcheck --json | node-jq | xargs bun add -D/remove` plumbing that is unsafe to run
unattended. [knip](https://knip.dev) is the modern replacement: plugin-aware (understands those config-referenced tools, killing the
false-positive class), first-class Bun + workspaces support, finds both unused **and** unlisted deps, and offers `--fix` so the family
collapses to a clean `bunx knip --dependencies --fix` form. As a bonus it also surfaces unused files/exports.

**Gate:** trial knip in one repo (`mcp-gmail`) and diff its findings against `depcheck` first; if clean, land a coordinated standard change
— swap the canonical `ki:deps:*` definitions, add `knip` to the required toolchain `devDependencies` + the §1 coverage manifest, update
`audit-engineering.ts`'s `CANON`, and roll across the 10 repos. Remove this item once adopted (or declined with a recorded reason).
