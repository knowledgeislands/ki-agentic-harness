# ADR-KI-HARNESS-TOOLCHAIN-005: Cost-reduction tooling evaluation — second pass (MarkItDown, Engram, Caveman, Graphify)

**Status:** Accepted

**Date:** 2026-06-29

## Context

[ADR-KI-HARNESS-TOOLCHAIN-002](ADR-KI-HARNESS-TOOLCHAIN-002.md) evaluated one batch of tools from the
[extraheadroom.com/reduce-claude-code-costs](https://extraheadroom.com/reduce-claude-code-costs) survey against the KI skills paradigm. Four
tools from the same survey were left unassessed and parked on the roadmap as a follow-on gate: **MarkItDown**, **Engram**, **Caveman**, and
**Graphify**. This ADR completes that pass and closes the roadmap item.

The evaluation criteria are unchanged from TOOLCHAIN-002: (a) complementarity with the KI skills paradigm, (b) maturity, (c) absence of
paradigm conflict — chiefly with the composition-only model ([ADR-KI-HARNESS-001](ADR-KI-HARNESS-001.md)), the validate-down config contract
([ADR-KI-HARNESS-CONFIG-001](ADR-KI-HARNESS-CONFIG-001.md)), and the git-visible, file-based `memory/` + `MEMORY.md` convention — and (d)
whether adoption needs a harness artifact or is satisfied by a personal/dev install.

## Decision

No new harness artifact and no new adoption: all four are declined or already covered. Each verdict and its reason follows.

### Not separately applicable — MarkItDown (Microsoft)

MarkItDown converts PDFs and Office documents into token-efficient Markdown — dropping the per-page vision rasterisation that makes feeding
raw documents expensive — and ships its own MCP server. It is a genuinely useful ingestion-boundary utility, but two facts remove the need
for a separate harness decision. First, headroom-ai (adopted as the context layer in TOOLCHAIN-002) already offers a MarkItDown add-on, so
the capability is reachable through the layer already in place. Second, the Knowledge Islands KB is Markdown-native by construction, so
MarkItDown's value is confined to the boundary where external binary documents enter context or a base — a personal/dev concern, not a
governed one. Its built-in MCP server is Microsoft's, not KI-authored, so it does not belong on the `mcp/` shelf (KI-authored servers only).
Use it ad hoc (`uvx markitdown <file>`) or via the headroom add-on when a document needs flattening; no harness artifact.

### Decline — Engram

Engram is a family of cross-session persistent-memory servers (an MCP front end over SQLite/vector stores). It targets exactly the slot the
harness already fills with its file-based `memory/` + `MEMORY.md` convention — and that convention was a deliberate choice for properties
Engram does not have: the memory is plain files, git-trackable, and reconciled into `CLAUDE.md` where it is visible in review. An opaque
MCP/SQLite store would be a second, invisible memory system running in parallel — the precise invisibility the memory-scope policy warns
against. The overlap is not theoretical: a Weaviate dogfooding writeup found Claude ignored Engram because Claude Code already auto-loads
`MEMORY.md`, and engram.tools itself positions as _complementing_ `CLAUDE.md` rather than replacing it. The file-based convention remains
the single persistent-memory mechanism.

### Decline — Caveman

Caveman (`JuliusBrussee/caveman`) is a Claude Code skill that forces a telegraphic, near-machine output style to cut tokens. Three problems.
First, it compresses _generated output_, which is a small fraction of a session's tokens, so its headline reduction translates to a
low-single-digit whole-session saving. Second, it installs as a monolithic skill outside the KI governance layer — the same structural
objection that declined superpowers and gstack in TOOLCHAIN-002. Third, telegraphic output conflicts directly with the house authoring
standards (readable Markdown and prose). The compression concern is already owned by headroom-ai, which operates at the proxy layer without
altering authored output.

### Decline (revisit at scale) — Graphify

Graphify builds a self-updating knowledge graph of a _codebase_ (tree-sitter static analysis plus LLM-driven extraction) so an assistant can
navigate by structure instead of grepping every file. By its own guidance the benefit appears only on large repositories (500+ files); below
~30 files there is none. The harness and its sibling repos are small Markdown/skill/MCP repos, not large code corpora, so the win does not
apply today. Separately, the Knowledge Islands KB is _itself_ a human-authored knowledge graph (linked Markdown notes), so the conceptual
slot is occupied by a curated artifact rather than a generated one. Recorded as a revisit candidate should a large code corpus emerge in the
ecosystem.

## Consequences

- No toolchain, CI, or dependency change. `ki:verify` / `ki:conform` and the `package.json` coverage model are untouched.
- The file-based `memory/` + `MEMORY.md` convention is reaffirmed as the single persistent-memory mechanism; no MCP-backed memory store is
  introduced.
- MarkItDown stays available as an on-demand utility (headroom add-on / `uvx`) without a governed artifact; the `mcp/` shelf's "KI-authored
  only" rule is preserved.
- Graphify is parked behind a scale gate; the roadmap candidate item is removed (resolved), per the roadmap's remove-once-done discipline.
- Completes the survey begun in TOOLCHAIN-002: every tool from the extraheadroom.com list now has a recorded disposition.

## References

- [ADR-KI-HARNESS-TOOLCHAIN-002](ADR-KI-HARNESS-TOOLCHAIN-002.md) — first-pass evaluation; same survey and criteria.
- [ADR-KI-HARNESS-001](ADR-KI-HARNESS-001.md) — composition over extension (the paradigm the declines protect).
- [extraheadroom.com/reduce-claude-code-costs](https://extraheadroom.com/reduce-claude-code-costs) — the source survey.
- [MarkItDown](https://github.com/microsoft/markitdown) — document → Markdown converter (Microsoft).
- [Engram](https://www.engram.fyi/) — cross-session persistent memory for AI coding agents (representative of the family).
- [Caveman](https://github.com/JuliusBrussee/caveman) — telegraphic output-compression skill.
- [Graphify](https://github.com/safishamsi/graphify) — codebase knowledge-graph skill.
