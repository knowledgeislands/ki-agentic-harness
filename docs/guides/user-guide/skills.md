# The skills

The skills are the bulk of the harness today. Most are **governance skills** — each holds a house standard and ships the universal **INIT / AUDIT / CONFORM / REFRESH** modes (plus skill-specific ones), backed by a tracked `references/sources.md`. A smaller, growing set are **process skills** — lightweight skills that drive an action or lifecycle rather than holding a standard (`ADR-KI-HARNESS-SKILLS-006`); `ki-recap`, `ki-plan`, and `ki-delegate` are the current set. This file is the map: what a skill is, how the set fits together, and the shape they share; the per-skill entries are in [the catalogue](skill-catalogue.md).

## What a skill is

A skill is a self-contained capability an agent can load on demand — a name and description that tell the agent when to reach for it, and a body of instructions for what to do once it does. Skills are governed by the `ki-skills` standard, which sets the authoring rules; as a consumer you don't need those rules, only that a skill's `name` is what you invoke it by (via trigger or `/name`).

A `SKILL.md` follows the open [Agent Skills standard](https://agentskills.io/), so it is not Claude-Code-specific: a second runtime such as OpenAI Codex CLI discovers the same `SKILL.md` files from its own path (`.agents/skills`, vs Claude Code's `.claude/skills`), though it reads project instructions from `AGENTS.md` rather than `CLAUDE.md`.

Every skill here is a Knowledge Islands skill, shipped as part of this system, but the set now has two **kinds** (`ADR-KI-HARNESS-SKILLS-006`). Most are **governance skills** — each holds a house standard and ships the universal **INIT / AUDIT / CONFORM / REFRESH** modes plus a mechanical checker; what tells governance skills apart is not their kind but _what each governs_: a repository's structure, a knowledge base, the machine itself. A smaller set are **process skills** — they drive an action or lifecycle rather than holding a standard, are exempt from the four-file shape and universal modes, and expose HELP only optionally: `ki-recap` (summarise / surface-outstanding / harvest-learnings over a live session) `ki-plan` (the plan lifecycle, promoted from the former `/plan` command — paired deliberately with the governance skill `ki-plans`), and `ki-delegate` (decompose a task list or plan across agent and model tiers — classify / assign / sequence / gate). That distinction, and the six governance clusters, are the map below.

The Agent Skills standard is more general than this, though. A skill need not govern a standard at all — it could equally encode a standalone workflow (a review process, a release checklist, a research harness) or target one specific project or recurring task. The process kind is the first step into that territory, and the set is expected to grow further over time.

## The six clusters

The skills sit in **six clusters**, by the role each plays in the set:

1. **Keystone** — `ki-bootstrap` (the one skill kept installed globally) and the `ki-repo` it pulls: the install entry point every governed repo starts from.
2. **Foundations** — `ki-authoring`, `ki-engineering`: the write-layer and build-layer standards every other skill builds on. `ki-authoring` is universal (part of the `ki-repo` baseline, implied everywhere); `ki-engineering` is coverage-detected — it applies only where a `package.json` exists, so a repo declares `[ki-engineering]` itself rather than inheriting it through `ki-repo`.
3. **Repo-structure** — `ki-harness`, `ki-kb`, `ki-website`, `ki-mcp`, `ki-plugins`, `ki-tools`, `ki-homebrew-tap`, `ki-dotfiles-chezmoi`: exactly one applies per repo, fixing that repo's shape.
4. **General governance** — `ki-skills`, `ki-agents`, `ki-decision-records`, `ki-feature-definitions`, `ki-plans`, `ki-handoffs`: cross-cutting instruments a repo of any shape may adopt.
5. **Implied families** — the members a parent repo-structure skill pulls in: `ki-kb-streams`, `ki-kb-activities`, `ki-kb-live-artifacts` under `ki-kb`; `ki-website-cloudflare` under `ki-website`.
6. **Environment** — `ki-binding`, `ki-binding-chezmoi`, `ki-housekeeping`, `ki-tokenomics`: govern the machine and the workspace, not any one repo. `ki-binding-chezmoi` is a composition skill (it `implies:` `ki-binding` + `ki-dotfiles-chezmoi`) supplying the chezmoi render path that the renderer-neutral `ki-binding` deliberately omits — installed only by chezmoi users (ADR-KI-HARNESS-SKILLS-004).

## Interdependencies

The clusters group the skills by role. A second relationship runs across them: which skill **pulls in** which. Because skills compose rather than fork, a skill declares the siblings it builds on in its `implies:` frontmatter, and installing one brings in everything it implies. That makes a machine-readable graph — rendered as a tree by `bun run ki:skills:graph --tree` (each root is a skill nothing implies; its children are what it `implies:`):

```text
ki-bootstrap
└─ ki-repo
   └─ ki-authoring

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

ki-plugins

ki-handoffs

ki-plans

ki-feature-definitions

ki-housekeeping

ki-tokenomics

ki-binding-chezmoi
├─ ki-binding
└─ ki-dotfiles-chezmoi
   └─ ki-authoring

ki-delegate

ki-engineering

ki-homebrew-tap

ki-plan

ki-recap

ki-tools
```

## The governance-skill shape

All skills share one layout, so a reader (or a new such skill) can move between them — the layout and modes are themselves codified in `ki-engineering`'s enforcement framework:

- **`<domain>-standard.md`** (or the contract / conventions reference it holds) — the normative, quotable reference: what good looks like, and why.
- **`audit-rubric.md`** — the line-by-line checkable criteria, each tagged **mechanical** (a checker enforces it) or **judgment** (a reader assesses it), each citing the standard section it verifies.
- **`references/sources.md`** — the tracked sources behind the standard, with `last reviewed` dates. Provenance only: the record of _what changed_ lives in git (the REFRESH commit), not a changelog in the file. A skill tracking a moving external spec also keeps a current-state **`## Last review`** block — pinned revision, what's confirmed, open watch-items — overwritten each REFRESH.
- **a mechanical checker** — each governance skill ships one, covering what a reader can't reliably check by eye. The judgment half is always applied by reading.

…and the same universal four modes: **AUDIT** (run the checker, then apply the judgment criteria), **CONFORM** (bring an existing artifact into line), **INIT** (scaffold a new artifact — or bring an off-standard one onto the floor from scratch — via a per-skill `scripts/init.ts`), and **REFRESH** (re-anchor the standard to its sources on a stated cadence), plus skill-specific modes where they fit (OPTIMISE, kb's note-ops).
