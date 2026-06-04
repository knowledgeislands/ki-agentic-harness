# Sources — where the model comes from

**This skill is the canonical definition** of the Streams structure and the Enactment Process — the single source of truth. The Knowledge Islands bases that run
the process **defer to it**: each carries a thin local process note that points here and adds only its local specifics. There is no separate in-base "canonical
Model" to re-anchor against; the skill _is_ the model.

Mode REFRESH therefore keeps this definition coherent and current **against practice** — how the live bases actually run their Streams — promoting genuinely
shared patterns into the skill and leaving single-base quirks as bindings or local notes. It then **bumps the `last reviewed` dates and records what changed**
in the changelog below. This skill follows no moving external spec: the Enactment Process is in-house.

## Canonical

The canonical definition lives in this skill itself:

- [the SKILL body](../SKILL.md) — the framing, lifecycle, anatomy, modes, bindings, and working rules.
- [the Streams structure reference](<Streams Structure Reference.md>) — Focus, Category, the `Proposal` suffix, leaf/parent/multi layout, note types.
- [the Enactment Process reference](<Enactment Process Reference.md>) — the model, proposal documents, the cycle, rollout, review, rejection.
- [the rubric](audit-rubric.md) + [`scripts/audit-streams.ts`](../scripts/audit-streams.ts) — the checkable criteria.

## Living (how the model is used in practice)

Sampled at REFRESH time through each base's own `kb-fs` MCP and `CLAUDE.md`. These are **consumers** of the canonical skill, read to keep it honest against real
use — not sources of the definition.

| Source                          | Governs                                                                                         | Last reviewed |
| ------------------------------- | ----------------------------------------------------------------------------------------------- | ------------- |
| `arcadia-principal` base[^ap]   | Whether the canonical skill still matches how the principal island runs its Streams in practice | 2026-06-04    |
| `kit-legal` base[^kl]           | The same, from a second base running the process under a local name                             | 2026-06-04    |
| Other bases running the process | The same, as further bases adopt the skill                                                      | 2026-06-04    |

[^ap]:
    The principal island. Sampled through `arcadia-principal-mcp-kb-fs`. Its `Pillars/Knowledge Islands/Model/Processes/Enactment Process` note now **defers to
    this skill** for the operational definition, keeping the island's governance philosophy (the council, the geography) and its local specifics; its
    `Model/Conventions/Structure` Streams section likewise points here. Conformed to the canonical model on 2026-06-04 (the `Proposal` suffix, `type:` scheme,
    machine-readable proposal frontmatter, `Governance` footers).

[^kl]:
    A second real base, sampled via `kit-legal-mcp-kb-fs`. Runs the canonical **Enactment Process**; its slim local note lives at a non-default location,
    `Admin/Operations/Processes/Enactment Process.md` (declared via the `process_note` binding), and points here. It adopted the canonical name on 2026-06-04,
    renamed from its former local `Repository Change Process`. Holds its internal store under the legacy `Matters/` (the `knowledgeislands-kb` `Pillars` →
    `Matters` zone alias).

## Review changelog

Record each REFRESH run: date, what was re-anchored, what changed in the model (or "no change").

- **2026-06-02** — Skill created. The `Streams` zone's structure and the Enactment Process were extracted from `knowledgeislands-kb` into this dedicated skill,
  with `knowledgeislands-kb` delegating the zone here. Codified the Focus lifecycle, Category patterns, leaf/parent/multi layout, the `Proposal` suffix, the
  status/priority vocabularies, the proposal anatomy, and the bindings (`process_note`, `note_type_scheme`).
- **2026-06-03** — **Superset pass.** Folded the full Streams conventions into the skill (note-type table, leaf ↔ parent transition,
  frontmatter-applies-by-type, the suffix's collision-safety rationale, the `Pass N/` cycle pattern, the Settled point-in-time policy, the lightweight-stream
  carve-out, approver framing).
- **2026-06-04** — **Flipped to skill-as-canonical.** Previously the in-base Model notes were named canonical and this skill was their summary. That is
  inverted: **the skill is now the single canonical definition**, and the bases defer to it via thin local process notes. `kit-legal` already pointed here;
  `arcadia-principal`'s `Model/Processes/Enactment Process` and the Streams section of `Model/Conventions/Structure` were slimmed to pointers + island-voice
  framing + local specifics. REFRESH re-anchors against practice (the live bases), not against a canonical Model. Also: the checker now recognises a notes-only
  **parent** stream (a folder containing a `* Proposal.md`), not just suffixed leaves.
- **2026-06-04** — **Two stream weights, per stream.** A sweep across the local bases found several (`kit-pkb`, `kit-hnr`, `kit-principal`) use `Streams/` as a
  lightweight tracker, not the proposal model. Rather than a per-base opt-out, the Enactment Process now defines **two weights chosen per stream** — a **full
  proposal** (the apparatus + gate) and a **lightweight stream** (a plain tracker; graduates to a proposal when it becomes a governed canonical change). The
  checker reflects this: `STREAM-3` flags only a stream whose index declares a proposal (`type: stream-proposal` / lifecycle `status`) yet lacks the suffix, and
  `GATE-1` demands the anchor only once the base actually runs proposals. Also added cross-skill plumbing this date: `knowledgeislands-kb` `MEM-2`
  (memory-cascade anchor) + composed audits, and `knowledgeislands-skills` `SHAPE-7` (behaviour-changing skills anchor + check their gate).
