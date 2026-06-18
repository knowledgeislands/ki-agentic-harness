# Sources — where the model comes from

**This skill is the canonical definition** of the Streams structure and the Enactment Process — the single source of truth. The Knowledge
Islands bases that run the process **defer to it**: each carries a thin local process note that points here and adds only its local
specifics. There is no separate in-base "canonical Model" to re-anchor against; the skill _is_ the model.

Mode REFRESH therefore keeps this definition coherent and current **against practice** — how the live bases actually run their Streams —
promoting genuinely shared patterns into the skill and leaving single-base quirks as bindings or local notes. It then **bumps the
`last reviewed` dates** (what changed is recorded in the commit, not a changelog — history lives in git). This skill follows no moving
external spec: the Enactment Process is in-house.

## Canonical

The canonical definition lives in this skill itself:

- [the SKILL body](../SKILL.md) — the framing, lifecycle, anatomy, modes, bindings, and working rules.
- [the Streams structure reference](<Streams Structure Reference.md>) — Focus, Category, the `Proposal` suffix, leaf/parent/multi layout,
  note types.
- [the Enactment Process reference](<Enactment Process Reference.md>) — the model, proposal documents, the cycle, rollout, review,
  rejection.
- [the rubric](audit-rubric.md) + [`scripts/audit-streams.ts`](../scripts/audit-streams.ts) — the checkable criteria.

## Living (how the model is used in practice)

Sampled at REFRESH time through each base's own `kb-fs` MCP and `CLAUDE.md`. These are **consumers** of the canonical skill, read to keep it
honest against real use — not sources of the definition.

| Source                          | Governs                                                                                         | Last reviewed |
| ------------------------------- | ----------------------------------------------------------------------------------------------- | ------------- |
| `arcadia-principal` base[^ap]   | Whether the canonical skill still matches how the principal island runs its Streams in practice | 2026-06-18    |
| `kit-legal` base[^kl]           | The same, from a second base running the process under a local name                             | 2026-06-18    |
| Other bases running the process | The same, as further bases adopt the skill                                                      | 2026-06-18    |

[^ap]:
    The principal island. Sampled through `arcadia-principal-mcp-kb-fs`. Its `Pillars/Knowledge Islands/Model/Processes/Enactment Process`
    note now **defers to this skill** for the operational definition, keeping the island's governance philosophy (the council, the
    geography) and its local specifics; its `Model/Conventions/Structure` Streams section likewise points here. **Conformance is partial /
    in-progress** (re-sampled 2026-06-18): the proposal documents carry the canonical apparatus (the `Proposal` suffix, `type:` scheme,
    machine-readable proposal frontmatter, `Governance` footers — the mechanical checker passes clean), but the deferring
    `Enactment Process` note and the Streams index notes still carry the legacy `card/*` tag scheme (and `status: … - April 2026` keys), a
    duplicate `Enactment Process.md` and the legacy `How Change Happens.md` still co-exist, and the proposals index lags the real folder
    set. These are `knowledgeislands-streams` Mode CONFORM follow-ups against the base, not gaps in the canonical model.

[^kl]:
    A second real base, sampled via `kit-legal-mcp-kb-fs`. Runs the canonical **Enactment Process**; its slim local note lives at a
    non-default location, `Admin/Operations/Processes/Enactment Process.md` (declared via the `process_note` binding), and points here. It
    adopted the canonical name on 2026-06-04, renamed from its former local `Repository Change Process`. Holds its `Pillars` zone under a
    local folder name, resolved transparently through a `[knowledgeislands-kb.zones]` alias.

## Last review

**2026-06-18** — Re-anchored the canonical definition against both living bases (`arcadia-principal` and `kit-legal`) via their `kb-fs`
MCPs. The model is **current**: the lifecycle (PROPOSE/ITERATE/READY/ROLLOUT/REVIEW/SETTLE/REJECT), the Streams structure (Focus, Category,
the `Proposal` suffix, leaf/parent/multi layout, the five `type:` note types), and the proposal frontmatter all still match real use, and
the mechanical checker passes both bases. No promotion candidates and no edits to the skill body, references, rubric, or checker were
warranted. `kit-legal` is a clean exemplar (canonical name adopted, `process_note` binding declared and pointing here).
`arcadia-principal`'s conformance is partial — its deferring process note exists, but legacy `card/*` index frontmatter persists, a
duplicate `Enactment Process.md` and the legacy `How Change Happens.md` still co-exist, and its proposals index lags; these are flagged as
`knowledgeislands-streams` Mode CONFORM follow-ups against that base, not changes to the canonical model.
