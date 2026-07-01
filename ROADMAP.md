# arcadia-agentic-harness roadmap

Where this agentic harness is going. The [README](README.md) and the [docs/](docs/) it indexes cover what exists today and how to install it; this file is the forward view. Items are grouped by confidence; speculative ones are marked _(candidate)_ until committed.

This roadmap is itself subject to the house discipline it describes: when a skill's REFRESH run or an audit surfaces a structural gap, it lands here before it's built — and an item is **removed once done**, not ticked off, so the file always shows only open work.

**Continuous practices are not roadmap items.** Keeping the skills audited (`ki:skills:lint`, `ki:repo:audit`, `ki:kb:audit`, the `knowledgeislands-mcp` audit over the `mcp-*` repos), re-running the advisory [eval suite](evals/README.md) as skills change, and the scheduled `knowledgeislands-skills-refresh` sweep (which honours each skill's declared `**Refresh:**` cadence) are ongoing disciplines tied to the invariants in [docs/design.md](docs/design.md) (_Principles across the set_) — they run continuously, so they live there, not here.

## Website pipeline: pull from arcadia-principal

arcadia-website presently mirrors the harness `docs/` tree directly — site pages are maintained in this repo and copied in. The intended architecture is KB-first: arcadia-principal is the source of truth; the website publishes KB content outward rather than duplicating harness documentation alongside it.

**Gate:** wire the arcadia-website 11ty build to source content from arcadia-principal notes (or a curated export of them) rather than the harness `docs/`. The harness docs mirror can then be retired. The KB tool ecosystem documentation created in this cycle (see `Streams/Active/Agentic Tool Documentation Proposal` in arcadia-principal) is the first body of content the pipeline should publish.

## arcadia-principal conventions: make implicit explicit

Several conventions in arcadia-principal are asserted without documented rationale. Digest routing (`-/_DIGESTS/`), the staging zone distinctions, and the frontmatter type taxonomy are all enforced in practice but their _why_ is nowhere written down — which makes them brittle to revisit and invisible to anyone new to the island. The `session-digest` type is not even in the type taxonomy.

**Gate:** the named arcadia-principal stream runs to completion, producing rationale notes for each convention that currently lacks one. The stream proposal lives in arcadia-principal's Background streams. Remove this item once the stream is ratified.
