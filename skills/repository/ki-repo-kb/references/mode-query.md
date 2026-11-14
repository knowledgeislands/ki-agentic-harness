# Mode QUERY — answer from the base

_On-demand procedure for kb's QUERY mode. The shared model — the five-zone structure, routing test, memory cascade, project bindings, and Step 1 (Load context) — lives in [`SKILL.md`](../SKILL.md) and is already loaded; this file is the procedure only._

1. Load the memory index and relevant profile context. When bound, use `kb_search` (or `ki kb search` on the shell) under the [derived search contract](standards-search.md), scoped to the selected base, zones and current access rules. Search exact identifiers literally. Inspect returned snippets and read targeted line ranges to establish the answer; widen only when evidence requires it. When search is unavailable, errors or yields insufficient evidence, use explicit literal grep plus targeted reads.
2. Answer, citing repository paths and locally validated line ranges to the notes and, for a declared binary mirror, its provenance under the [source mirror contract](standards-source-mirrors.md). Treat pointer or unknown labels as incomplete evidence; do not infer source fidelity or source-store access.
3. If the base cannot answer it, capture the researched answer as a new note (fall through to Mode SAVE).

**Special query: `?templates`** — list the available note templates for this base. Read `assets/templates/` in the skill, then any overrides declared in `[skills.ki-repo-kb.templates]` in the base's config. Return the zone, template name, and a one-line description of what each template is for. Do not create any files.
