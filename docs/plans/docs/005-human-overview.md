---
id: '005'
title: A clear, human-first account of what the harness is and does
status: open
roadmap: A clear, human-first account of what the harness is and does
blocks: —
blocked-by: —
---

# A clear, human-first account of what the harness is and does

## Context

Every existing description of the harness serves an agent or a contributor: `CLAUDE.md` orients a working agent, the README (~30 KB) is a full working reference, `docs/design.md` records rationale, `docs/skills.md` catalogues the nineteen skills. None gives a human reader a short, plain answer to "what is this and what does it do for me?". Kris's decision (2026-07-04): that account lives **in the harness repo** so the description and the thing described stay in one place, and arcadia-principal references it rather than holding its own copy.

**Recommended implementer tier:** opus for step 2 (the writing is judgement — plain language, accurate compression of the whole system); haiku for steps 3–4 (mechanical linking); the KB reference (step 5) is sonnet under KB conventions.

## Current state

- `docs/` holds `design.md`, `installation.md`, `knowledge-islands.md`, `skills.md`, `decisions/`, `plans/` — no overview document; the README's opening is the closest thing and is written for contributors, embedded in a ~30 KB reference.
- arcadia-principal's `Pillars/Knowledge Islands/` tree describes the KI model itself; where it touches the harness it should point here, not duplicate.
- The ROADMAP Future item on retiring the `docs/` mirror is now scoped (2026-07-04) so the harness's self-documentation is explicitly canonical here.

## Steps

1. Survey what exists so the overview compresses rather than invents: read `README.md`'s opening sections, `docs/skills.md`'s layer map, `docs/design.md`'s principles, and note the one-line purpose of each bundle part (`skills/`, `agents/`, `mcp/`, `evals/`, `ki-bootstrap`).
2. Write `docs/overview.md` — the human-first account, ≤ 2 pages: what the harness is (one paragraph), what it does for its owner (the governance loop in plain words: standards live as skills, checkers keep repos honest, AUDIT/CONFORM/REFRESH), how the four bundle parts and the bootstrap fit together, and where to go deeper (README, `docs/skills.md`, `docs/design.md`). Plain language: no house jargon unexplained, no acronym before its expansion, every skill mention earning its place. British English, hyphens only.
3. Link it: add `docs/overview.md` as the first row of the table under `## Documentation` in `README.md` (line ~77, currently opening with `docs/skills.md`), and extend `CLAUDE.md`'s orientation paragraph (line 3, "The README is the entry point; …") to name `docs/overview.md` as the human-first summary — so both humans and agents find it first.
4. Run `bun run ki:lint:md` then `bun run ki:lint:md:check` over the new/changed files.
5. Consumer-side reference (arcadia-principal, via its own governance): a short stream proposal per the Enactment Process adding a pointer from the relevant `Pillars/Knowledge Islands/` note to the harness `docs/overview.md` (and pruning any duplicated description found there). Do not edit the KB canon directly.

## Files touched

- `docs/overview.md` (new), `README.md` (docs index), `CLAUDE.md` (orientation pointer)
- Consumer-side (step 5): a `Streams/` proposal in arcadia-principal, not a direct canon edit

## Verify

- `docs/overview.md` exists, ≤ 2 pages, and a cold read by a non-contributor answers: what is it, what does it do, how do the parts fit, where next. Concretely: hand it to a haiku-class subagent with no other context and ask those four questions — all four answered from the document alone.
- README docs index lists it first; `CLAUDE.md` references it.
- `bun run ki:lint:md:check` and `bun run ki:verify` green.
- arcadia-principal has an open (or settled) stream proposing the reference — checked, not created, from this repo.

## Dependencies / blocks

Independent of plans 002–004 (touches none of the same files except README's index line — trivially mergeable with plan 004's README step; run either first). The KB-side reference (step 5) follows arcadia-principal's Enactment Process on its own schedule.
