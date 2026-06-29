# arcadia-agentic-harness roadmap

Where this agentic harness is going. The [README](README.md) and the [docs/](docs/) it indexes cover what exists today and how to install
it; this file is the forward view. Items are grouped by confidence; speculative ones are marked _(candidate)_ until committed.

This roadmap is itself subject to the house discipline it describes: when a skill's REFRESH run or an audit surfaces a structural gap, it
lands here before it's built — and an item is **removed once done**, not ticked off, so the file always shows only open work.

**Continuous practices are not roadmap items.** Keeping the skills audited (`ki:skills:lint`, `ki:repo:audit`, `ki:kb:audit`, the
`knowledgeislands-mcp` audit over the `mcp-*` repos), re-running the advisory [eval suite](evals/README.md) as skills change, and the
scheduled `knowledgeislands-skills-refresh` sweep (which honours each skill's declared `**Refresh:**` cadence) are ongoing disciplines tied
to the invariants in [docs/design.md](docs/design.md) (_Principles across the set_) — they run continuously, so they live there, not here.

> **Done — second-pass cost-reduction tooling evaluated (2026-06-29).**
> [ADR-KI-HARNESS-TOOLCHAIN-005](docs/decisions/ADR-KI-HARNESS-TOOLCHAIN-005.md) assessed the four tools the
> [extraheadroom.com/reduce-claude-code-costs](https://extraheadroom.com/reduce-claude-code-costs) survey left uncovered by TOOLCHAIN-002
> and declined all four: **MarkItDown** (not separately applicable — reachable via the headroom add-on; the KB is Markdown-native),
> **Engram** (overlaps the git-visible file-based `memory/` convention with an opaque store), **Caveman** (output-only compression,
> monolithic skill outside KI governance, clashes with the authoring standard), and **Graphify** (code-graph win only at 500+ files; the KI
> KB is already a human-authored knowledge graph — parked as a scale-gated revisit). Every tool from the survey now has a recorded
> disposition.
>
> **Done — knip replaced depcheck (2026-06-28).** The `ki:deps:*` family now runs [knip](https://knip.dev): `ki:deps:check` / `ki:deps:fix`
> (dependency-scoped) plus a new full-run `ki:knip` (dependencies + dead code) that gates `ki:verify`/CI. `knip` is a required devDependency
> with a per-repo `knip.json`; `depcheck` / `node-jq` are gone. Rolled across all 10 repos. The deciding evidence: depcheck false-flagged
> `@biomejs/biome` as unused (its auto-fix would have removed it), while knip got the config-referenced toolchain right and additionally
> surfaced real dead code (e.g. 27 redundant `export default` handlers in `mcp-m365`). See the `knowledgeislands-engineering` standard
> §2/§5.

## Distant future _(parked)_

Not on the near-term path; recorded so the thought isn't lost.

- **Virtual-branch workflow ([GitButler](https://gitbutler.com)).** GitButler was trialled on `arcadia-agentic-harness` and has since been
  removed (its refs + `.git/gitbutler` metadata dropped 2026-06-28); the repos are plain-git for now. Worth revisiting only if parallel
  multi-branch work across the harness + sibling repos becomes common enough to justify a virtual-branch tool — and only if it composes
  cleanly with the `ki:conform` / `ki:verify` gate and the per-repo `feat/*` → fast-forward-to-`main` flow we use today. A user-global
  `gitbutler.aimodelprovider` key may still linger in `~/.gitconfig` (harmless).
