# Sources — where the model comes from

The canonical and living sources behind this skill's Streams structure, the Enactment Process lifecycle, and the bindings table. Mode REFRESH reads this file,
re-anchors the model against each source, then **bumps the `last reviewed` dates and records what changed** in the changelog below. This is the skill's memory
of where its model comes from — keep it current.

Like `knowledgeislands-kb`, this skill follows **no moving external spec**: the Enactment Process is canonical and in-house. REFRESH re-anchors against the
canonical in-base Model and against how the live bases actually run their Streams, not against a published standard.

## Canonical (the model definition)

| Source                                                                              | Governs                                                           | Last reviewed |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------- |
| `arcadia-principal` · `Pillars/Knowledge Islands/Model/Processes/Enactment Process` | The canonical Enactment Process — lifecycle, proposals, the cycle | 2026-06-02    |
| `arcadia-principal` · `Pillars/Knowledge Islands/Model/Conventions/Structure`       | The canonical Streams structure — Focus, Category, index notes    | 2026-06-02    |

## Living (how the model is actually used)

Sampled at REFRESH time through each base's own `kb-fs` MCP and `CLAUDE.md`. The two named bases are the current exemplars and read in tandem:
`arcadia-principal` holds the canonical Model, while `kit-legal` carries the most refined _implementation_ — between them they show both the definition and best
practice, which the skill reconciles.

| Source                          | Governs                                                                                        | Last reviewed |
| ------------------------------- | ---------------------------------------------------------------------------------------------- | ------------- |
| `arcadia-principal` base[^ap]   | Whether the structure, lifecycle, and bindings still match the canonical Model and practice    | 2026-06-02    |
| `kit-legal` base[^kl]           | The refined reference implementation; the source of leaf/parent, the suffix, the gate, rollout | 2026-06-02    |
| Other bases running the process | The same, as further bases adopt the skill                                                     | 2026-06-02    |

[^ap]:
    The principal island, holding the canonical Knowledge Islands Model. Sampled through `arcadia-principal-mcp-kb-fs`. Its own `Streams/` notes currently lag
    the Model on the `Proposal` suffix, machine-readable proposal frontmatter, and the required `Governance` section — conforming it is part of aligning the
    bases.

[^kl]:
    A second real base, sampled via `kit-legal-mcp-kb-fs`. It runs the process under the local name **Repository Change Process** at
    `Admin/Operations/Processes/Repository Change Process.md` (declared to this skill as the `process_note` binding), and is the most refined implementation —
    leaf/parent layout, the `Proposal` suffix with reasoning, the name-confirmation gate, convention-rollout consolidation, the out-of-scope list, and git
    discipline. It holds its internal store under the legacy `Matters/` (the `knowledgeislands-kb` `Pillars` → `Matters` zone alias).

## Review changelog

Record each REFRESH run: date, what was re-anchored, what changed in the model (or "no change").

- **2026-06-02** — Skill created. The `Streams` zone's structure and the Enactment Process were extracted from `knowledgeislands-kb` (which had compressed
  `Streams` to one zone-table row) into this dedicated skill, with `knowledgeislands-kb` delegating the zone here. Established the canonical sources (the
  in-base Model notes) and the two living exemplars; codified the Focus lifecycle, Category patterns, leaf/parent/multi layout, the `Proposal` suffix, the
  status/priority vocabularies, the proposal anatomy, and the bindings (`process_note`, `note_type_scheme`). Drawn from `arcadia-principal`'s Model and
  `kit-legal`'s refined `Repository Change Process`.
- **2026-06-03** — **Superset pass.** Folded the full Streams conventions into the skill so it is the self-contained, canonical home (a base needs no separate
  Streams-conventions note). Added from `kit-legal`'s `Streams Conventions`: the `type:` note-type table (`stream-zone` / `-focus` / `-index` / `-proposal` /
  `-note`), the leaf ↔ parent transition rule, frontmatter-applies-by-type (only `stream-proposal` / `stream-note` carry `status`/`priority`/`dependencies`),
  the suffix's collision-safety rationale, the `Pass N/` iterative-cycle pattern, and the "Settled = point-in-time, not maintained, deletable" policy; plus the
  lightweight-stream gate carve-out and the approver framing (council / single-person user). Next: roll this superset out across the bases — `kit-legal` (adopt
  the canonical `Enactment Process` name) and `arcadia-principal` (conform up + promote the superset into its canonical Model).
