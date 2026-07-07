# ki-agentic-harness roadmap

Where this agentic harness is going. The [README](README.md) and the [docs/](docs/) it indexes cover what exists today and how to install it; this file is the forward view. Open work is grouped by horizon — **Next**, **Soon**, **Future** — the house phasing owned by `ki-harness` and referenced by `ki-plans`; speculative items are marked _(candidate)_ until committed.

This roadmap is itself subject to the house discipline it describes: when a skill's REFRESH run or an audit surfaces a structural gap, it lands here before it's built — and an item is **removed once done**, not ticked off, so the file always shows only open work.

**Continuous practices are not roadmap items.** Keeping the skills audited (`ki:skills:lint`, `ki:repo:audit`, `ki:kb-base:audit`, the `ki-mcp` audit over the `mcp-*` repos), re-running the advisory [eval suite](evals/README.md) as skills change, and the scheduled `ki-skills-refresh` sweep (which honours each skill's declared `**Refresh:**` cadence) are ongoing disciplines tied to the invariants in [docs/design.md](docs/design.md) (_Principles across the set_) — they run continuously, so they live there, not here.

## Future

### Port the KI MCP servers into Cowork's sandbox

The `ki-binding` cross-surface skill is built, and the Cowork leg ships the `knowledgeislands/ki-plugins` marketplace plugin — but **skills + agents only**. The KI MCP servers are host-local (they read host filesystem paths and resolve secrets via 1Password) and Cowork runs plugins in a gVisor sandbox that cannot reach the host, so the servers do not port as-is (verified 2026-07-06, [cross-surface-enablement.md](skills/ki-mcp/references/cross-surface-enablement.md) Verification log). Making them reachable needs one of: a self-contained server bundled via `${CLAUDE_PLUGIN_ROOT}`, mounting the KB into the sandbox, or authenticated remote (`http`/`sse`) endpoints. Then `build-plugin.ts` emits a `.mcp.json` and the `cowork` `clients` token becomes live. Related open question: `ki-plugins` keeps the harness's proprietary LICENSE while public, which conflicts with `ki-repo`'s public-repo-MIT check — resolve the licensing/visibility stance.

### Rename `mcp-kb-notion-mirror` to `mcp-ki-kb-notion-mirror`

Bring the repo's directory/package name in line with the `ki-` prefix convention. Mechanical rename across the repo (package.json `name`, README, CI badges, any cross-repo references such as `ki-agentic-harness/scripts/generate-clients.ts` and the `ki-mcp` standard doc's repo list) plus the GitHub repo rename itself.

### Add `mcp-gcal`

A new sibling MCP server for Google Calendar, scaffolded from `mcp-gmail`'s shape (shared Google OAuth patterns) rather than folding calendar tools into `mcp-gmail` itself — keeps one `<app>` tool prefix and one scope set per repo, consistent with the rest of the `mcp-*` workspace.

### The harness `docs/` is canonical authoring; the website vendors a copy

Skill and design documentation is authored here and stays canonical — it is an **input** to two downstream consumers: ki-arcadia-principal references it (via the `Agentic Tool Documentation` stream), and ki-website needs it for its pages. The harness stays **canonical for its own story** — the human-first overview ([docs/overview.md](docs/overview.md)) and the skill/design docs live here; the downstream repos reference rather than own them.

Because the website build must be **autonomous** — no reach into a sibling repo at build time — it cannot source the harness `docs/` live; it vendors a self-contained copy. Automate that as a **one-directional committed sync**: a script or CI step in ki-website copies the website-relevant subset of the harness `docs/` into its content tree and commits it, so the build is fully self-contained, the harness stays the single source, and every update lands as a reviewable diff in the website's history — no manual duplication. (A git submodule pinned to a harness ref is the alternative, if strict version-pinning is preferred over copy-commits.)

**Gate:** this pipeline is ki-website's roadmap work; the harness's only responsibility is to remain the canonical author. Nothing here for the harness to retire.
