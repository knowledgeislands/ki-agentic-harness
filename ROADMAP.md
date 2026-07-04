# arcadia-agentic-harness roadmap

Where this agentic harness is going. The [README](README.md) and the [docs/](docs/) it indexes cover what exists today and how to install it; this file is the forward view. Open work is grouped by horizon — **Next**, **Soon**, **Future** — the house phasing owned by `ki-harness` and referenced by `ki-plans`; speculative items are marked _(candidate)_ until committed.

This roadmap is itself subject to the house discipline it describes: when a skill's REFRESH run or an audit surfaces a structural gap, it lands here before it's built — and an item is **removed once done**, not ticked off, so the file always shows only open work.

**Continuous practices are not roadmap items.** Keeping the skills audited (`ki:skills:lint`, `ki:repo:audit`, `ki:kb-base:audit`, the `ki-mcp` audit over the `mcp-*` repos), re-running the advisory [eval suite](evals/README.md) as skills change, and the scheduled `ki-skills-refresh` sweep (which honours each skill's declared `**Refresh:**` cadence) are ongoing disciplines tied to the invariants in [docs/design.md](docs/design.md) (_Principles across the set_) — they run continuously, so they live there, not here.

## Next

### Cross-surface MCP/skill enablement

The workspace controls MCP servers and skills for Claude Code only: mcporter proxies the KI servers ([ADR-KI-HARNESS-TOOLCHAIN-003](docs/decisions/ADR-KI-HARNESS-TOOLCHAIN-003.md)) and `ki-bootstrap` links project-local skills — both write Claude-Code-only locations. There is no control for claude.ai web connectors (currently disabled wholesale to avoid an unmanageable surface) or for Claude Cowork, which offers no per-workspace MCP/skill enablement. This item is a house-mcp-manager successor spanning surfaces: a single source of truth (anchored on the chezmoi `mcp-servers-json` template already feeding Code and Desktop) fanning out to Claude Code, Desktop, claude.ai, and Cowork, plus a per-surface targeting table recording which servers each surface receives and how each surface is controlled. Because claude.ai/cloud enablement has no local config file, its controllability is the open question the plan spikes first. Tracked as plan [002](docs/plans/mcp/002-cross-surface-enablement.md).

### Add the `ki-handoffs` governance skill

A doctrine skill owning the reasoning-layer split: plan work once at the top tier, then write it as an implementation-ready spec a cheaper tier or a cold agent can execute without re-reasoning. It composes on `ki-plans` (the plan is the host artifact in a code repo) and `ki-kb-streams` (the proposal Checklist in a KB), and off-ramps tier cost/selection to `ki-tokenomics` — owning only the delegation-readiness delta (decisions-locked-vs-escalate, a per-unit recommended tier, the cold-model readiness test). Tracked as plan [003](docs/plans/skills/003-ki-handoffs.md).

## Future

### Populate the `agents/` shelf with KI-authored agents _(candidate)_

The harness `agents/` shelf has a validated reference pattern (house-agents, [ADR-KI-HARNESS-TOOLCHAIN-002](docs/decisions/ADR-KI-HARNESS-TOOLCHAIN-002.md)) but no KI-authored contents. When a governance concern warrants a dedicated subagent, author it here modelled on that pattern.

### Graphify codebase knowledge-graph _(candidate)_

Graphify ([ADR-KI-HARNESS-TOOLCHAIN-002](docs/decisions/ADR-KI-HARNESS-TOOLCHAIN-002.md)) builds a structural knowledge graph of a codebase; its benefit appears only on large repositories (500+ files). Revisit should a large code corpus emerge in the ecosystem.

### Retire the harness `docs/` mirror once the website is KB-first

arcadia-website currently sources its pages from the harness `docs/` tree — the harness maintains the documentation and the site copies it in. Once arcadia-website sources its content from arcadia-principal instead (the KB-first pipeline, now tracked on arcadia-website's roadmap), the harness no longer needs to be that source, and the duplicated documentation can be retired so it lives in one place.

**Gate:** the arcadia-website build sources content from arcadia-principal rather than the harness `docs/`; then retire the mirror. The pipeline work itself lives on arcadia-website's roadmap, and the content it first publishes is the `Agentic Tool Documentation` stream in arcadia-principal — this item is only the harness's own cleanup.
