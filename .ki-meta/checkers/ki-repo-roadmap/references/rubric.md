<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — repository roadmaps

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical; this file is generated from the in-memory catalogue. Edit the item definitions, then rerun `scripts/rubric/publish.ts`.

## Contents

- [SCOPE — scope](#scope-scope)
- [PROFILE — profile](#profile-profile)
- [ROAD — roadmaps](#road-roadmaps)
- [THEME — themes](#theme-themes)
- [ITEM — items](#item-items)
- [PROJ — portfolio projection](#proj-portfolio-projection)
- [PLAN — plans](#plan-plans)
- [INDEX — index](#index-index)
- [SAFE — safe mechanics](#safe-safe-mechanics)
- [EXPAND — expansion](#expand-expansion)

## SCOPE — scope

→ [standard](standards.md)

Profile applicability.

- **SCOPE-1 [M] — KB scope** — KB repositories use `ki-kb-streams`; repository-roadmap artifacts in a KB fail, while a KB without them is not applicable. (standards.md)

## PROFILE — profile

→ [standard](standards.md)

Simple and thematic profile structure.

- **PROFILE-1 [M] — profile structure** — A non-KB repository has a root `ROADMAP.md`; `docs/roadmap/` selects the thematic profile, otherwise simple. Missing roots or incomplete thematic structure fail. (standards.md)
- **PROFILE-2 [J] — simple-profile suitability** — Simple remains appropriate only while the work is understandable without theme isolation or execution plans. (standards.md)
  - _Review prompt:_ Review whether the simple profile remains appropriate for the repository work.

## ROAD — roadmaps

→ [standard](standards.md)

Horizon structure and placement.

- **ROAD-1 [M] — roadmap structure** — Every authored roadmap has one H1 and the five horizons exactly once, in canonical order. (standards.md)
- **ROAD-2 [J] — honest horizon placement** — Items sit in honest horizons; Waiting-for items name their external condition; speculative Future work says `(candidate)`. (standards.md)
  - _Review prompt:_ Review horizon placement, waiting conditions, and Future candidate marking.
- **ROAD-3 [J] — open finite work** — Roadmaps are open-only and contain finite work rather than continuous practice. (standards.md)
  - _Review prompt:_ Review that roadmap items are finite open work, not completed work or ongoing practice.
- **ROAD-4 [M] — canonical horizon blurbs** — Every horizon heading is followed immediately by its exact canonical blurb; CONFORM inserts a missing blurb without removing existing authored content. (standards.md)
- **ROAD-5 [J] — promotion and readiness** — Horizon placement and transitions meet the readiness contract; only Blocking or Next work receives a plan, and CONFORM never chooses a move. (standards.md)
  - _Review prompt:_ Review each horizon transition against its readiness contract.

## THEME — themes

→ [standard](standards.md)

Thematic roadmap structure.

- **THEME-1 [M] — theme layout** — Theme directories are lowercase kebab-case, contain `ROADMAP.md`, and thematic items are `###` headings under a horizon. (standards.md)
- **THEME-2 [M] — stable theme code** — Every theme roadmap declares exactly one unquoted uppercase `code`, unique across the repository; plan IDs in that theme begin with that stable code. (standards.md)
- **THEME-3 [M] — non-empty themes** — A theme roadmap contains at least one item. CONFORM prunes only an otherwise scaffold-only empty theme, retaining indexes and repository READMEs. (standards.md)
- **THEME-4 [J] — coherent themes** — Themes are coherent workstreams, neither catch-alls nor one-item bureaucracy. (standards.md)
  - _Review prompt:_ Review theme boundaries and granularity.

## ITEM — items

→ [standard](standards.md)

Thematic item identity.

- **ITEM-1 [M] — unique qualified item locator** — Each thematic item has one unique qualified `<theme>/<item-slug>` locator. Duplicate derived locators fail. (standards.md)

## PROJ — portfolio projection

→ [standard](standards.md)

Generated root portfolio.

- **PROJ-1 [M] — root portfolio projection** — The thematic root `ROADMAP.md` exactly matches the generated linked portfolio and repeats no item prose. (standards.md)

## PLAN — plans

→ [standard](plan-format.md)

Plan identity, linkage, and dependencies.

- **PLAN-1 [M] — plan placement and shape** — Plans use the canonical thematic path, stable theme code and serial, required frontmatter, and matching filename and ID. (plan-format.md)
- **PLAN-2 [M] — plan roadmap linkage** — `roadmap:` is a qualified locator in the same theme and resolves to a Blocking or Next item. (plan-format.md)
- **PLAN-3 [M] — plan dependencies** — Dependencies use canonical plan identifiers, exist, are reverse-consistent, and acyclic; an in-progress plan has no non-done blocker. (plan-format.md)
- **PLAN-4 [J] — ready plan content** — In-progress plans have concrete Steps, checkable Verify, honest Current state, and minimal Files touched. (standards.md)
  - _Review prompt:_ Review active plan content for concrete, checkable execution detail.
- **PLAN-5 [J] — honest plan status** — In-progress status reflects live work; stale plans are advanced, returned to open, or removed. (standards.md)
  - _Review prompt:_ Review whether in-progress plan status reflects live work.

## INDEX — index

→ [standard](standards.md)

Generated thematic index.

- **INDEX-1 [M] — thematic index projection** — `docs/roadmap/README.md` exactly matches the generated theme index, list-based active-plan sections, and dependency graph. (standards.md)

## SAFE — safe mechanics

→ [standard](standards.md)

Safe write constraints.

- **SAFE-1 [M] — safe mechanics** — CONFORM and EDUCATE refuse symlink output paths, support dry-run, avoid clobbering authored files, and write generated files atomically. (standards.md)

## EXPAND — expansion

→ [standard](standards.md)

Judgment-led profile migration.

- **EXPAND-1 [J] — conservative expansion** — EXPAND conserves every open item exactly once and preserves its horizon and prose. (standards.md)
  - _Review prompt:_ Review expansion conservation against the source roadmap.
