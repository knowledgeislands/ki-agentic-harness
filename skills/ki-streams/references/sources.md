# Sources — where the model comes from

**Refresh:** canonical · on-change

**This skill is the canonical definition** of the Streams structure and the Enactment Process — the single source of truth. The Knowledge Islands bases that run the process **defer to it**: each carries a thin local process note that points here and adds only its local specifics. There is no separate in-base "canonical Model" to re-anchor against; the skill _is_ the model.

Mode REFRESH therefore keeps this definition coherent and current **against practice** — how the live bases actually run their Streams — promoting genuinely shared patterns into the skill and leaving single-base quirks as bindings or local notes. It then **bumps the `last reviewed` dates** (what changed is recorded in the commit, not a changelog — history lives in git). Although this skill is `canonical · on-change` and carries no clock, it keeps a `## Last review` block as a **hand-kept practice-review note** — the record of the last re-anchor against live bases, not an external-spec pin. This skill follows no moving external spec: the Enactment Process is in-house.

## Canonical

The canonical definition lives in this skill itself:

- [the SKILL body](../SKILL.md) — the framing, lifecycle, anatomy, modes, bindings, and working rules.
- [the Streams structure reference](<Streams Structure Reference.md>) — Focus, Category, the `Proposal` suffix, leaf/parent/multi layout, note types.
- [the Enactment Process reference](<Enactment Process Reference.md>) — the model, proposal documents, the cycle, rollout, review, rejection.
- [the rubric](audit-rubric.md) + [`scripts/audit-streams.ts`](../scripts/audit-streams.ts) — the checkable criteria.

## Living (how the model is used in practice)

Sampled at REFRESH time through each base's own `kb-fs` MCP and `CLAUDE.md`. These are **consumers** of the canonical skill, read to keep it honest against real use — not sources of the definition.

| Source                          | Governs                                                             | Last reviewed |
| ------------------------------- | ------------------------------------------------------------------- | ------------- |
| `arcadia-principal` base[^ap]   | Whether the canonical skill still matches practice ※                | 2026-06-21    |
| `kit-legal` base[^kl]           | The same, from a second base running the process under a local name | 2026-06-21    |
| Other bases running the process | The same, as further bases adopt the skill                          | 2026-06-21    |

※ How the principal island runs its Streams in practice.

[^ap]: The principal island. Sampled through `arcadia-principal-mcp-kb-fs`. Its Streams zone carries the canonical structure cleanly — the Focus set, leaf streams with the `Proposal` suffix, and a textbook **parent** stream (`Streams/Future/Island MCP/` = bare-topic folder + slim `Island MCP.md` index + `Island MCP Proposal.md` + child note). **Conformance is partial / in-progress** (re-sampled 2026-06-21): the proposal documents carry the canonical apparatus (the `Proposal` suffix, `type:` scheme, machine-readable proposal frontmatter, `Governance` footers — the mechanical checker passes clean), but the Streams index notes still carry the legacy `card/*` tag scheme and `status: … - April 2026` keys (e.g. `Active/Active.md` has `status: current - April 2026`). The earlier duplicate `Enactment Process.md` is gone; the operational definition now lives only as an `## Enactment Process` section inside the legacy `Pillars/Knowledge Islands/Model/Processes/How Change Happens.md`, which **describes** the process but does not yet explicitly defer to this skill — so the deferral the model expects is not yet wired in. A `Settled/` proposal also sits at `status: completed` rather than being deleted (ENACT-5). These are `ki-streams` Mode CONFORM follow-ups against the base, not gaps in the canonical model.

[^kl]: A second real base, sampled via `kit-legal-mcp-kb-fs`. Runs the canonical **Enactment Process**; its slim local note lives at a non-default location, `Admin/Operations/Processes/Enactment Process.md` (declared via the `process_note` binding), and points here. It adopted the canonical name on 2026-06-04, renamed from its former local `Repository Change Process`. Holds its `Pillars` zone under a local folder name, resolved transparently through a `[ki-kb.zones]` alias.

## Last review

**2026-06-21** — Re-anchored the canonical definition against both living bases (`arcadia-principal` and `kit-legal`) via their `kb-fs` MCPs. The model is **current** and unchanged: the lifecycle (PROPOSE/ITERATE/READY/ROLLOUT/REVIEW/SETTLE/REJECT), the Streams structure (Focus, Category, the `Proposal` suffix, leaf/parent/multi layout, the five `type:` note types), and the proposal frontmatter all still match real use. Both bases sit cleanly on the structure — `arcadia-principal/Streams/Future/Island MCP/` is a textbook parent-stream layout. No promotion candidates and no edits to the skill body, references, rubric, or checker were warranted. `kit-legal` remains a clean exemplar (canonical name adopted, `process_note` binding declared and pointing here). `arcadia-principal`'s conformance is still partial: its earlier duplicate `Enactment Process.md` has gone, but the deferral is now only an `## Enactment Process` section inside the legacy `How Change Happens.md` that describes the process without explicitly deferring here, legacy `card/*` + `status: … - April 2026` index frontmatter persists, and a `completed` `Settled/` proposal has not been deleted (ENACT-5). All are `ki-streams` Mode CONFORM follow-ups against that base, not changes to the canonical model.
