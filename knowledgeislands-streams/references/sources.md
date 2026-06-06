# Sources — where the model comes from

**This skill is the canonical definition** of the Streams structure and the Enactment Process — the single source of truth. The Knowledge Islands bases that run
the process **defer to it**: each carries a thin local process note that points here and adds only its local specifics. There is no separate in-base "canonical
Model" to re-anchor against; the skill _is_ the model.

Mode REFRESH therefore keeps this definition coherent and current **against practice** — how the live bases actually run their Streams — promoting genuinely
shared patterns into the skill and leaving single-base quirks as bindings or local notes. It then **bumps the `last reviewed` dates** (what changed is recorded
in the commit, not a changelog — history lives in git). This skill follows no moving external spec: the Enactment Process is in-house.

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
    renamed from its former local `Repository Change Process`. Holds its `Pillars` zone under a local folder name, resolved transparently through a
    `[knowledgeislands-kb.zones]` alias.
