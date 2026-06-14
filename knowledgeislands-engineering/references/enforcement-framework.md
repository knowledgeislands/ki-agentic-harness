# The enforcement framework — how any Knowledge Islands standard is defined and checked

The shared **mechanism** every governance skill in this repository uses, so a standard is defined, audited, conformed, and refreshed the same way no matter what
it governs. This is the formal home of what the arcadia-skills `README.md` calls "the governance-skill shape"; the README points here for the detail rather than
restating it.

A **governance skill** holds a house standard and ships the universal modes over it, backed by a tracked source list. `knowledgeislands-engineering` owns this
framework because it is the cross-cutting "how we engineer" layer; every other governance skill (`-mcp`, `-kb`, `-repo`, `-skills`, `-streams`, `-authoring`)
conforms to it.

## Contents

- [1. The layout](#1-the-layout)
- [2. The mechanical-checker contract](#2-the-mechanical-checker-contract)
- [3. The rubric format](#3-the-rubric-format)
- [4. The source list (`sources.md`)](#4-the-source-list-sourcesmd)
- [5. The modes](#5-the-modes)
- [6. The principles every governance skill inherits](#6-the-principles-every-governance-skill-inherits)

## 1. The layout

Each governance skill is a directory of this shape (loaded on demand — keep `SKILL.md` under ~500 lines / ~5,000 tokens):

- **`SKILL.md`** — frontmatter (`name` = directory name; trigger-rich `description` that names its off-ramps; `argument-hint` listing the modes) + a body that
  states what it governs, the model "at a glance", and the modes. Per-skill _usage_ is not repeated here — `description` + `argument-hint` are machine-read at
  selection time.
- **`references/<domain>-standard.md`** (or the contract / conventions reference it holds) — the normative, quotable reference: what good looks like, and why.
- **`references/audit-rubric.md`** — the line-by-line checkable criteria (§3).
- **`references/sources.md`** — the tracked provenance (§4).
- **a mechanical checker** in `scripts/` (§2) — or, where the toolchain already enforces the mechanical half (authoring's `bun run lint:md`), a pointer to it.

## 2. The mechanical-checker contract

A checker is the deterministic half of a standard. It MUST:

- take a target path as its argument and read only that target (`bun scripts/audit-<concern>.ts <path>`);
- emit grouped **PASS / WARN / FAIL** findings, each tagged with an area, and a one-line summary;
- exit **non-zero iff any FAIL** (WARN does not fail the build);
- depend on **Node/Bun builtins only** — no npm dependencies;
- be **self-contained**: no imports from another skill's files. Skills are symlinked individually into a skills directory, so a cross-skill import would break
  once deployed. Checkers **compose by being run in sequence**, never by importing one another (§5).

The checker owns the mechanical criteria; everything it cannot decide deterministically is left to the judgment half, applied by reading.

## 3. The rubric format

`audit-rubric.md` lists every criterion with a stable id, tagged by who enforces it:

- **🔧 mechanical** — a checker enforces it; in AUDIT you capture the checker's output verbatim and never re-derive it by hand.
- **judgment** — a reader/agent assesses it; the checker cannot decide it deterministically.

Each criterion cites the standard section it verifies, and carries a severity where the standard grades findings. A criterion that becomes deterministic should
**move into the checker and flip to 🔧** — the rubric and checker stay in lockstep.

## 4. The source list (`sources.md`)

Provenance only — the record of _what changed_ lives in the REFRESH commit, not a changelog in the file. It tracks each source behind the standard with a
`last reviewed` date. A skill that tracks a **moving external** target (a spec, an upstream tool, a community best-practice) also keeps a current-state
**`## Last review`** block — pinned revision, what's confirmed, open watch-items — overwritten each REFRESH. A skill that hard-codes no volatile external fact
may instead resolve it at runtime; the point is durability (LONG-1/LONG-2 below).

## 5. The modes

Every governance skill exposes the universal three, plus skill-specific ones where they fit. Modes are named and alphabetical.

- **AUDIT** — run the checker, capture its output, then apply the judgment criteria; report by location → criterion → fix. **Audits compose**: auditing a target
  runs every _applicable_ skill's audit and names the siblings it composes with (e.g. an MCP repo = `engineering:audit` for the common layer + `audit-mcp.ts`
  for the MCP delta + the repo and skills audits where they apply). A target is "clean" only when each applicable audit passes.
- **CONFORM** — bring an existing artifact into line in place; re-run the checker (and any judgment pass) until clean. Copy from the closest healthy sibling
  rather than invent.
- **REFRESH** — re-anchor the standard to its sources on a stated cadence: read `sources.md`, re-fetch each source, diff against the standard + rubric +
  checker, propose a diff (confirm before writing), then bump the `last reviewed` dates and the `## Last review` block.
- **INIT** (optional) — scaffold a new artifact to the standard.
- **operational** (optional) — domain actions that are not audit/conform (e.g. kb's note-ops, streams' enactment lifecycle).

## 6. The principles every governance skill inherits

These hold for every skill, current and future:

- **A refresh path, and a cadence (LONG-1 / LONG-2).** A skill that tracks a moving target ships a REFRESH mode and a dated `sources.md` and states how often it
  should run; one that hard-codes no volatile fact resolves it at runtime. A skill in a shared catalogue is long-lived and far from its author and must not rot
  silently.
- **No silent collisions (COLL-1 / COLL-2).** Where two skills could fire on one request, each `description` names the other as the off-ramp; a new skill is
  audited against the existing set before it ships.
- **One governance-mode model (SHAPE-5).** The universal AUDIT/CONFORM/REFRESH plus skill-specific modes, so a new skill inherits the shape.
- **A behaviour-changing skill anchors its gate, and checks the anchor (SHAPE-7).** A skill that changes a default cannot rely on its own `description` firing;
  it anchors the behaviour in always-loaded context (a repo/base `CLAUDE.md`/`AGENTS.md`) and its checker verifies the anchor.
- **Audits compose.** No single skill's pass means a target is clean; the applicable skills compose (§5).
- **Standard vs base-coupled extension.** A standard skill stays base-agnostic and resolves bindings at runtime; base-specific behaviour lives in an extension
  that delegates the shared modes back by name.

(The criterion ids — LONG-1/2, COLL-1/2, SHAPE-5/7 — are owned and enforced by the `knowledgeislands-skills` rubric; named here so this framework and that
rubric stay in lockstep.)
