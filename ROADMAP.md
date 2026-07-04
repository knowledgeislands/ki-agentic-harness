# arcadia-agentic-harness roadmap

Where this agentic harness is going. The [README](README.md) and the [docs/](docs/) it indexes cover what exists today and how to install it; this file is the forward view. Open work is grouped by horizon — **Next**, **Soon**, **Future** — the house phasing owned by `ki-harness` and referenced by `ki-plans`; speculative items are marked _(candidate)_ until committed.

This roadmap is itself subject to the house discipline it describes: when a skill's REFRESH run or an audit surfaces a structural gap, it lands here before it's built — and an item is **removed once done**, not ticked off, so the file always shows only open work.

**Continuous practices are not roadmap items.** Keeping the skills audited (`ki:skills:lint`, `ki:repo:audit`, `ki:kb-base:audit`, the `ki-mcp` audit over the `mcp-*` repos), re-running the advisory [eval suite](evals/README.md) as skills change, and the scheduled `ki-skills-refresh` sweep (which honours each skill's declared `**Refresh:**` cadence) are ongoing disciplines tied to the invariants in [docs/design.md](docs/design.md) (_Principles across the set_) — they run continuously, so they live there, not here.

## Next

### Cross-surface MCP/skill enablement

The workspace controls MCP servers and skills for Claude Code only: mcporter proxies the KI servers ([ADR-KI-HARNESS-TOOLCHAIN-003](docs/decisions/ADR-KI-HARNESS-TOOLCHAIN-003.md)) and `ki-bootstrap` links project-local skills — both write Claude-Code-only locations. There is no control for claude.ai web connectors (currently disabled wholesale to avoid an unmanageable surface) or for Claude Cowork, which offers no per-workspace MCP/skill enablement. This item is a house-mcp-manager successor spanning surfaces: a single source of truth (anchored on the chezmoi `mcp-servers-json` template already feeding Code and Desktop) fanning out to Claude Code, Desktop, claude.ai, and Cowork, plus a per-surface targeting table recording which servers each surface receives and how each surface is controlled. Because claude.ai/cloud enablement has no local config file, its controllability is the open question the plan spikes first. Tracked as plan [002](docs/plans/mcp/002-cross-surface-enablement.md).

### A clear, human-first account of what the harness is and does

The existing documentation is written for agents and contributors — the README is a ~30 KB working reference, and [docs/](docs/) carries design rationale and per-skill detail. What is missing is a short, plain-language overview a human reader can take in at one sitting: what the harness is, what the skills do for its owner, and how the pieces (skills, agents, MCP shelf, evals, bootstrap) fit. It lives **here**, in the harness, so the account and the thing it describes stay in one place; arcadia-principal references it rather than duplicating it. This also settles the direction of the docs-mirror question — the harness is canonical for its own story. Tracked as plan [005](docs/plans/docs/005-human-overview.md).

## Soon

### Complete behavioural-eval coverage of the skill set

Twelve of the nineteen skills have an eval scenario; seven do not: `ki-decision-records`, `ki-handoffs`, `ki-harness`, `ki-kb-activities`, `ki-kb-live-artifacts`, `ki-memory`, `ki-plans`. Author scenarios for the uncovered skills to the pattern in [evals/README.md](evals/README.md) (assertions + judge rubric, mindful of the "no honest gap" caveat there), then refresh the result matrices — the current `evals/results/matrix-*.log` set predates the rename and no longer matches the scenario set. Re-running matrices thereafter is continuous practice; this item is only reaching full authorship.

### KI plugin marketplace as the cross-surface enablement artifact _(candidate)_

Plan [002](docs/plans/mcp/002-cross-surface-enablement.md)'s spike found that Cowork's `enabledPlugins` uses the same Claude plugin-marketplace mechanism Claude Code supports, and a plugin can bundle MCP servers, skills, and agents — making a KI plugin marketplace the natural single-source artifact for per-project/per-workspace enablement on the locally-controllable surfaces. Candidate until plan 002's home decision ratifies the shape; the build enters Next only then.

## Future

### Graphify codebase knowledge-graph _(candidate)_

Graphify ([ADR-KI-HARNESS-TOOLCHAIN-002](docs/decisions/ADR-KI-HARNESS-TOOLCHAIN-002.md)) builds a structural knowledge graph of a codebase; its benefit appears only on large repositories (500+ files). Revisit should a large code corpus emerge in the ecosystem.

### Retire the harness `docs/` mirror once the website is KB-first

arcadia-website currently sources its pages from the harness `docs/` tree — the harness maintains the documentation and the site copies it in. Once arcadia-website sources its content from arcadia-principal instead (the KB-first pipeline, now tracked on arcadia-website's roadmap), the harness no longer needs to be that source, and duplicated content can be retired. Scope narrowed 2026-07-04: the harness stays **canonical for its own story** — the human-first overview and the skill/design documentation live here and arcadia-principal references them (see the Next item above) — so what retires is only content the harness holds purely for the website's benefit, not the harness's self-documentation.

**Gate:** the arcadia-website build sources content from arcadia-principal rather than the harness `docs/`; then retire the mirror. The pipeline work itself lives on arcadia-website's roadmap, and the content it first publishes is the `Agentic Tool Documentation` stream in arcadia-principal — this item is only the harness's own cleanup.
