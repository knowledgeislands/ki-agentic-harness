# arcadia-agentic-harness roadmap

Where this agentic harness is going. The [README](README.md) and the [docs/](docs/) it indexes cover what exists today and how to install it; this file is the forward view. Open work is grouped by horizon — **Next**, **Soon**, **Future** — the house phasing owned by `ki-harness` and referenced by `ki-plans`; speculative items are marked _(candidate)_ until committed.

This roadmap is itself subject to the house discipline it describes: when a skill's REFRESH run or an audit surfaces a structural gap, it lands here before it's built — and an item is **removed once done**, not ticked off, so the file always shows only open work.

**Continuous practices are not roadmap items.** Keeping the skills audited (`ki:skills:lint`, `ki:repo:audit`, `ki:kb:audit`, the `ki-mcp` audit over the `mcp-*` repos), re-running the advisory [eval suite](evals/README.md) as skills change, and the scheduled `ki-skills-refresh` sweep (which honours each skill's declared `**Refresh:**` cadence) are ongoing disciplines tied to the invariants in [docs/design.md](docs/design.md) (_Principles across the set_) — they run continuously, so they live there, not here.

## Next

### Rename the `ki-kb-*` family

The four KB-zone skills — meaningful only inside a base — take a shared `ki-kb-*` prefix that encodes their containment: `ki-kb` → `ki-kb-base`, `ki-streams` → `ki-kb-streams`, `ki-activities` → `ki-kb-activities`, `ki-live-artifacts` → `ki-kb-live-artifacts`. Code-peer skills (`ki-plans`, `ki-mcp`, `ki-repo`, `ki-skills`, `ki-agents`) stay bare — the prefix marks "part of a KB base", not domain. A set-wide sweep: skill `name:` frontmatter and directory renames, `package.json` script families, `.ki-config.toml` coverage tables in every consuming base, `ki-bootstrap` wiring, and cross-references across the skill set. Tracked as plan [001](docs/plans/skills/001-ki-kb-family-rename.md).

## Future

### Retire the harness `docs/` mirror once the website is KB-first

arcadia-website currently sources its pages from the harness `docs/` tree — the harness maintains the documentation and the site copies it in. Once arcadia-website sources its content from arcadia-principal instead (the KB-first pipeline, now tracked on arcadia-website's roadmap), the harness no longer needs to be that source, and the duplicated documentation can be retired so it lives in one place.

**Gate:** the arcadia-website build sources content from arcadia-principal rather than the harness `docs/`; then retire the mirror. The pipeline work itself lives on arcadia-website's roadmap, and the content it first publishes is the `Agentic Tool Documentation` stream in arcadia-principal — this item is only the harness's own cleanup.
