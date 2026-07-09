# The skills

The skills are the bulk of the harness today, each a **governance skill** — it holds a house standard and ships the universal **INIT / AUDIT / CONFORM / REFRESH** modes (plus skill-specific ones), backed by a tracked `references/sources.md`. This file is the map: what a skill is, how the set fits together, and the shape they all share; the per-skill entries are in [the catalogue](skill-catalogue.md). For the boundaries between the ones that could be confused, the loops that run across them, and the invariants they all hold, see [skill-design.md](skill-design.md).

## What a skill is

A skill is a directory containing a `SKILL.md` with YAML frontmatter and a markdown body, per the [Agent Skills open standard](https://agentskills.io/specification) (originated by Anthropic for Claude Code, consumed by Cowork and other agent platforms). Longer detail goes in `references/`, executables in `scripts/`, templates in `assets/` — all loaded on demand (progressive disclosure). Keep `SKILL.md` under ~500 lines / ~5,000 tokens.

```text
<skill-name>/
├── SKILL.md            # required - frontmatter (name, description) + body
├── references/         # optional - long-form detail
├── scripts/            # optional - executable helpers
└── assets/             # optional - templates and resources
```

The directory name **is** the skill's `name`: lowercase, hyphenated, and matching the `name:` frontmatter field exactly. Agents discover a skill by its `name`, so the two must stay in sync.

Today the set is uniform: every skill here is a **governance skill** — it holds a house standard and ships the universal **INIT / AUDIT / CONFORM / REFRESH** modes plus a mechanical checker — and every one is a Knowledge Islands skill, shipped as part of this system. So what tells the skills apart is not a _kind_ but _what each governs_: a repository's structure, a knowledge base, the machine itself. That distinction is the map below.

The Agent Skills standard is more general than this, though. A skill need not govern a standard at all — it could equally encode a standalone workflow (a review process, a release checklist, a research harness) or target one specific project or recurring task. Nothing here does yet, but the set is expected to grow beyond governance over time.

## The six clusters

The skills sit in **six clusters**, by the role each plays in the set:

1. **Keystone** — `ki-bootstrap` (the one skill kept installed globally) and the `ki-repo` it pulls: the install entry point every governed repo starts from.
2. **Foundations** — `ki-authoring`, `ki-engineering`: the write-layer and build-layer standards every other skill builds on.
3. **Repo-structure** — `ki-harness`, `ki-kb`, `ki-website`, `ki-mcp`, `ki-plugins`, `ki-tools`, `ki-homebrew-tap`: exactly one applies per repo, fixing that repo's shape.
4. **General governance** — `ki-skills`, `ki-agents`, `ki-decision-records`, `ki-feature-definitions`, `ki-plans`, `ki-handoffs`: cross-cutting instruments a repo of any shape may adopt.
5. **Implied families** — the members a parent repo-structure skill pulls in: `ki-kb-streams`, `ki-kb-activities`, `ki-kb-live-artifacts` under `ki-kb`; `ki-website-cloudflare` under `ki-website`.
6. **Environment** — `ki-binding`, `ki-housekeeping`, `ki-tokenomics`: govern the machine and the workspace, not any one repo.

## Interdependencies

The clusters group the skills by role. A second relationship runs across them: which skill **pulls in** which. Because skills compose rather than fork, a skill declares the siblings it builds on in its `implies:` frontmatter, and installing one brings in everything it implies. That makes a machine-readable graph — rendered as a tree by `bun run ki:skills:graph --tree` (each root is a skill nothing implies; its children are what it `implies:`):

```text
ki-bootstrap
└─ ki-repo
   ├─ ki-authoring
   └─ ki-engineering

ki-harness
├─ ki-skills
├─ ki-agents
└─ ki-decision-records

ki-kb
├─ ki-kb-activities
├─ ki-kb-live-artifacts
└─ ki-kb-streams

ki-website
└─ ki-website-cloudflare

ki-mcp
ki-handoffs
ki-plans
ki-feature-definitions
ki-binding
ki-housekeeping
ki-tokenomics
```

## The governance-skill shape

All skills share one layout, so a reader (or a new such skill) can move between them — the layout and modes are themselves codified in `ki-engineering`'s enforcement framework:

- **`<domain>-standard.md`** (or the contract / conventions reference it holds) — the normative, quotable reference: what good looks like, and why.
- **`audit-rubric.md`** — the line-by-line checkable criteria, each tagged **mechanical** (a checker enforces it) or **judgment** (a reader assesses it), each citing the standard section it verifies.
- **`references/sources.md`** — the tracked sources behind the standard, with `last reviewed` dates. Provenance only: the record of _what changed_ lives in git (the REFRESH commit), not a changelog in the file. A skill tracking a moving external spec also keeps a current-state **`## Last review`** block — pinned revision, what's confirmed, open watch-items — overwritten each REFRESH.
- **a mechanical checker** — `audit-engineering.ts`, `audit-mcp.ts`, `audit-websites.ts`, `audit-cloudflare-hosting.ts`, `lint-skills.ts`, `lint-agents.ts`, `audit-repo.ts`, `audit-kb.ts`, `audit-streams.ts`, `audit-drs.ts`, `audit-features.ts`, `audit-activities.ts`, `audit-live-artifacts.ts`, `audit-plans.ts`, `audit-handoffs.ts`, `audit-tokenomics.ts`, `audit-harness.ts`, `link-skills.ts` for engineering / mcp / website / website-cloudflare / skills / agents / repo / kb / streams / decision-records / feature-definitions / activities / live-artifacts / plans / handoffs / tokenomics / harness / bootstrap; `bun run ki:lint:md` (Prettier + markdownlint) for authoring. The judgment half is always applied by reading.

…and the same universal four modes: **AUDIT** (run the checker, then apply the judgment criteria), **CONFORM** (bring an existing artifact into line), **INIT** (scaffold a new artifact — or bring an off-standard one onto the floor from scratch — via a per-skill `scripts/bootstrap.ts`), and **REFRESH** (re-anchor the standard to its sources on a stated cadence), plus skill-specific modes where they fit (OPTIMISE, kb's note-ops). The mode model is codified in `ki-skills` (rubric **SHAPE-5**).
