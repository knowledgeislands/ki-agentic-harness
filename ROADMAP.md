# arcadia-agentic-harness roadmap

Where this agentic harness is going. The [README](README.md) and the [docs/](docs/) it indexes cover what exists today and how to install
it; this file is the forward view. Items are grouped by confidence; speculative ones are marked _(candidate)_ until committed.

This roadmap is itself subject to the house discipline it describes: when a skill's REFRESH run or an audit surfaces a structural gap, it
lands here before it's built — and an item is **removed once done**, not ticked off, so the file always shows only open work.

**Continuous practices are not roadmap items.** Keeping the skills audited (`skills:lint`, `repo:audit`, `kb:audit`, the
`knowledgeislands-mcp` audit over the `mcp-*` repos), re-running the advisory [eval suite](evals/README.md) as skills change, and the
scheduled `knowledgeislands-skills-refresh` sweep (which honours each skill's declared `**Refresh:**` cadence) are ongoing disciplines tied
to the invariants in [docs/design.md](docs/design.md) (_Principles across the set_) — they run continuously, so they live there, not here.

## Later _(candidates)_

### KI Skill Extraction Candidates

Both `kit-legal` and `arcadia-principal` implement these patterns independently. Extracting them as KI skills would let any new island get
them for free. Candidates (from arcadia-principal plan, 2026-06-25):

| Pattern                            | Candidate extraction †                              |
| ---------------------------------- | --------------------------------------------------- |
| Admin zone structure ‡             | Extend `knowledgeislands-kb` or new `-admin` skill  |
| Activity system §                  | New `knowledgeislands-activities` or extend kb      |
| Charter + Conformance baseline     | Extend `knowledgeislands-kb` with bootstrap checker |
| Live artifacts (.md + .html pairs) | New `knowledgeislands-live-artifacts`               |
| Note templates system              | Extend `knowledgeislands-kb`                        |

† Both `kit-legal` and `arcadia-principal` implement these patterns independently; extracting them as KI skills lets any new island get them
for free.  
‡ `knowledgeislands-kb` already declares the zones; no skill currently governs the Governance/Operations arm structure.  
§ Activity type declared as `admin/operations/activity`; no skill governs naming, structure, or the Activities.md index.
