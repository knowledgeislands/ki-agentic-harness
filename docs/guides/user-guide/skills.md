# The skills

The skills are the bulk of the harness today, each a **governance skill** — it holds a house standard and ships the universal **INIT / AUDIT / CONFORM / REFRESH** modes (plus skill-specific ones), backed by a tracked `references/sources.md`. This file is the catalogue and the map: what a skill is, how the set fits together, and what each one does. For the boundaries between the ones that could be confused, the loops that run across them, and the invariants they all hold, see [design.md](design.md).

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

The skills sit in **six clusters**, by the role each plays in the set (ADR-KI-HARNESS-SKILLS-006):

1. **Keystone** — `ki-bootstrap` (the one skill kept installed globally) and the `ki-repo` it pulls: the install entry point every governed repo starts from.
2. **Foundations** — `ki-authoring`, `ki-engineering`: the write-layer and build-layer standards every other skill builds on.
3. **Repo-structure** — `ki-harness`, `ki-kb`, `ki-website`, `ki-mcp`, `ki-plugins`: exactly one applies per repo, fixing that repo's shape.
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

## The catalogue

Grouped by cluster, in the order of [the six clusters](#the-six-clusters) above.

### Keystone

#### `ki-bootstrap`

Wires a repo's **project-local skills** (`.claude/skills/`) from its `.ki-config.toml` — links exactly the skills it declares plus the `ki-repo` + `ki-authoring` baseline, as **gitignored, regenerated** relative symlinks (the committed artifacts are a `ki:skills:link:project` script and the `.gitignore` line, never the links). This is the **install keystone** — the one `ki-*` skill kept installed globally in `~/.claude/skills`, so its `description` is deliberately tiny and any repo can self-wire. **Composes on** `ki-repo` (which owns the `.ki-config.toml` contract and coverage cascade it reads); it is the project-local counterpart of `ki-harness`'s install convention. Ships a mechanical checker (`link-skills.ts`).

#### `ki-repo`

Audits, conforms, and onboards any **Knowledge Islands–compliant** git repo (one carrying a `.ki-config.toml`) against the repo standard — local files, GitHub settings, and security. Owns the cross-cutting **`.ki-config.toml` contract**. Ships a mechanical auditor (`ki:repo:audit`) that discovers repos from a local tree or a whole org.

### Foundations

#### `ki-authoring`

The house authoring conventions the other skills build on — Markdown (wide tables → footnotes, link style) and TOML formatting style — and the single source of truth a repo's or base's `CLAUDE.md` points to. Its mechanical half is `bun run ki:lint:md` (Prettier + markdownlint), not a bundled script; it carries the judgment half.

#### `ki-engineering`

The shared **engineering toolchain** every TS/Bun repo builds on — package.json script families, `tsconfig`/`biome`/`vitest`, the Bun-install / Node-run split, 100% coverage, the build/cli-chmod rule — plus the **enforcement framework** (the mode shape, mechanical-checker contract, rubric tagging, `sources.md` cadence, `.ki-config.toml` contract) the other governance skills conform to. The toolchain twin of `ki-authoring`. Ships a mechanical checker (`audit-engineering.ts`); artifact skills (e.g. `ki-mcp`) **compose** their delta on top of its common layer.

### Repo-structure

#### `ki-harness`

Audits, conforms, and scaffolds the **agentic harness itself** — the container that bundles the other parts: the four-part `skills/` / `agents/` / `mcp/` / `evals/` layout, the root `CLAUDE.md` / `ROADMAP.md` / `package.json` script families / `.ki-config.toml` table, and the `skills:link:*` install convention (whose project-local linking `ki-bootstrap` carries out). Governs the **container, not the contents**: the bridge into the sibling skills rather than a replacement — it **composes** their checkers (`ki-skills`, `ki-agents`, `ki-mcp`, `ki-engineering`, `ki-repo`) and adds only the bundle-structure delta. Ships a mechanical checker (`audit-harness.ts`). Empty shelves are valid — a shelf is not a gap.

#### `ki-kb`

Interacts with a Knowledge Islands knowledge base over the standard zone model: the note-ops **DIGEST / EXTRACT / QUERY / SAVE / UPDATE**, plus **AUDIT / CONFORM / INIT** to check a base against the structure model, bring it into line, or scaffold a new one. Only store-level bindings come from the host base. Ships a mechanical checker (`audit-kb.ts`): zone-layout conformance plus validate-down of its `[ki-kb]` config table. Delegates the **`Streams` zone** to `ki-kb-streams`.

#### `ki-website`

Audits, conforms, and scaffolds static websites against the house build standard — **Eleventy 3 + Nunjucks + Markdown, TypeScript run natively on Bun, Tailwind 4 config-less with design tokens** — that compile to a portable `dist/`. Owns the **site-build delta** and **composes on** `ki-engineering` (toolchain) and `ki-authoring` (Markdown), handing the built `dist/` to `ki-website-cloudflare`. Ships a mechanical checker (`audit-websites.ts`).

#### `ki-mcp`

Audits, conforms, and scaffolds workspace MCP servers against the "workspace MCP" standard (layout, config injection, `<app>_<resource>_<action>` tool naming, access-level gate, security invariants, Bun/Node, tooling) across the `mcp-*` repos. Ships a mechanical checker (`audit-mcp.ts`).

#### `ki-plugins`

Audits, conforms, and scaffolds a Knowledge Islands **plugin-marketplace** repo — the generated Claude plugin marketplace that projects the harness's skills and agents onto the Cowork surface (`knowledgeislands/ki-plugins`, `ADR-KI-HARNESS-005`). The fifth repo-structure skill; it governs the on-disk projection (the `marketplace.json` / `plugin.json` manifests, the verbatim `skills/` copy and flattened `agents/`, the MCP-deferred rule, the generated-not-hand-edited invariant). Generation and cross-surface enablement stay with `ki-binding`. Ships a mechanical checker (`audit-plugins.ts`).

### General governance

#### `ki-skills`

Audits, writes, and conforms Agent Skills against a checkable rubric — a bundled linter (`ki:skills:lint`) for the mechanical checks, the judgment ones applied by reading, and a tracked source list it revisits.

#### `ki-agents`

Audits, writes, and conforms **Claude Code subagent definitions** against a checkable rubric — a bundled linter (`lint-agents.ts`) for the mechanical checks (frontmatter, `name` uniqueness across the set, link resolution), the judgment ones applied by reading (the `description` as delegation signal, the system-prompt role/lane, own-vs-defer, least-privilege tools). The **agents twin of `ki-skills`**: that one governs a `SKILL.md`, this one a subagent definition. Governs the agents that land under `agents/`.

#### `ki-decision-records`

Governs **Decision Records** in any Knowledge Islands repo, code or KB — the typed ID prefixes (`GDR` / `ADR` / `KDR` / …), the five-section format, the living-record principle (edited in place, no status lifecycle or supersession), and placement (`docs/decisions/` in a code repo, `Admin/Governance/Decisions/` in a KB). Ships a mechanical checker (`audit-drs.ts`). Defers to `ki-kb` for the island structure and the KI-wide frontmatter standard, and to `ki-kb-streams` for the Enactment Process by which a change is ratified.

#### `ki-feature-definitions`

Governs **Feature Definitions** — the behaviour-level "what" of a system, the third leg of the `docs/` triad (decisions = why, features = what, guides = how). Definitions live in `docs/features/`, flat one-file-per-area, with an `index.md` defining the ID scheme and an areas table. Each requirement is a `### <PREFIX>-NNN — title` heading carrying one RFC-2119 (`MUST` / `SHOULD` / `MAY`) statement and a `_Verify:_` test hook; IDs are append-only, and an unnumbered `## Gaps` section holds the backlog. Ships a mechanical checker (`audit-features.ts`). Off-ramps the governing decisions a requirement cites to `ki-decision-records`.

#### `ki-plans`

Governs the **planning methodology** for code repos — when to write a plan, how it derives from the ROADMAP near-horizon, the `blocks` / `blocked-by` dependency graph, and the quality bar for Steps and Verify. Owns the methodology; the plan format lives in `references/plan-format.md` and the `/plan` command drives the lifecycle. In a KB there is no `docs/plans/` — planning is a `ki-kb-streams` proposal Checklist. Ships a mechanical checker (`audit-plans.ts`).

#### `ki-handoffs`

Governs the **handoff doctrine** — plan work once at the top reasoning tier, then write it as an implementation-ready spec a cheaper tier or a cold agent can execute without re-reasoning. Owns the reasoning-layer split, the handoff-spec quality bar (decisions-locked-vs-escalate, a per-unit recommended tier, a cold-model readiness test), and the opt-in marker contract (`handoff: true`). Rides on a host artifact — a `ki-plans` plan or a `ki-kb-streams` proposal Checklist — and off-ramps tier cost/selection to `ki-tokenomics`. Ships a mechanical checker (`audit-handoffs.ts`).

### Implied families

#### `ki-kb-streams`

Owns the **`Streams` zone** — the base's working copy ("plan mode") — and the **Enactment Process** that governs it: the lifecycle modes **PROPOSE / ITERATE / READY / ROLLOUT / REVIEW / SETTLE / REJECT**, plus **AUDIT / CONFORM** of a base's Streams structure (Focus lifecycle, the `Proposal` suffix, leaf/parent layout, proposal frontmatter). `ki-kb` delegates the zone here, so the heavier process loads only when working in `Streams`. Ships a mechanical checker (`audit-streams.ts`).

#### `ki-kb-activities`

Governs **Activity notes** — the operational record of work adopted in a base, kept under `Admin/Operations/Activities/` (naming, frontmatter, realization type, and the index). Checks that an activity declared as a slash command has a backing skill, and that scheduled ones are flagged for the external scheduler. Ships a mechanical checker (`audit-activities.ts`). Composes on `ki-kb` for the zone structure.

#### `ki-kb-live-artifacts`

Governs **Live Artifacts** — operational documents that track island state (dashboards, boards, queues, trackers) as a `.md` source paired with a rendered `.html`, kept under `Admin/Operations/Live Artifacts/` with an index, plus the sync rules between the two halves. Ships a mechanical checker (`audit-live-artifacts.ts`). Composes on `ki-kb` for the zone structure.

#### `ki-website-cloudflare`

Audits, conforms, and scaffolds the house convention for serving a built site on **Cloudflare Workers + Static Assets** (not Pages): one `wrangler.jsonc` pointing `assets.directory` at the site's `dist/`, custom-domain routes, observability, and the `ki:site:deploy` script family. Owns the **hosting delta** for the site Worker; the `dist/` is the seam from `ki-website`. Companion Workers (bots, ingress) route to the generic `cloudflare` / `wrangler` skills. Ships a mechanical checker (`audit-cloudflare-hosting.ts`).

### Environment

#### `ki-binding`

Governs the **cross-surface binding** — enabling the KI MCP servers, skills, and agents consistently across the surfaces that run them (Claude Code, Desktop, mcporter, Cowork; claude.ai by convention) from the single chezmoi `mcps.yaml` source, whose per-server `clients:` field is the targeting lever. Ships a mechanical checker (`audit-binding.ts`) that verifies each rendered surface agrees with the source and composes `ki-bootstrap` for the project-local skill half. The write path for the file-editable surfaces is chezmoi (never a hand-written per-surface config, which drifts); Cowork is gated on an external-edit verification before its `enabledPlugins` are wired. Implements the `ki-mcp` design record on cross-surface enablement.

#### `ki-housekeeping`

Governs the hygiene of accumulated **Claude state** across all its areas — memory, plus sessions, artifacts, and storage that pile up across Claude Desktop / Cowork, Claude Code (`~/.claude/`), and VSCode. It pairs with the `mcp-claude-housekeeping` server on one principle: the skill is the standard and the judgment; the server is the tools (ADR-KI-HARNESS-SKILLS-007). **Memory** it governs fully in-skill — the per-project `memory/*.md` files and `MEMORY.md` index Headroom writes at `~/.claude/projects/<slug>/memory/`, checked by its own `audit-memory.ts`; every other area is audited and cleaned through the server's codified audits and access-gated tools. Distinct from `ki-kb`'s **MEM-2** memory cascade (a KB's own root `Admin/MEMORY.md`); off-ramps token-cost measurement to `ki-tokenomics`.

#### `ki-tokenomics`

Audits, conforms, and tunes the **tokenomics** of a Claude Code environment — the standing context surface paid on every turn, as **composed** across the user-wide `~/.claude` and project-local layers and any base, plus the runtime levers (caching, model tier, compaction, sub-agent fan-out, tool-result verbosity). Attributes cost per layer, holds it to overridable budgets (a `[ki-tokenomics]` table, read validate-down), and checks context-compression tooling — **Headroom**, an extensible registry — is set up optimally. **Composes** on the artifact skills whose surfaces it measures (`ki-mcp` for the tool surface, `ki-skills` for the description surface, `ki-kb` for a base's loaded surface) and defers the volatile reference numbers to the `claude-api` skill. Ships a mechanical checker (`audit-tokenomics.ts`) that reads both config layers by design.

Where the set is going next is in the roadmap.

## The governance-skill shape

All skills share one layout, so a reader (or a new such skill) can move between them — the layout and modes are themselves codified in `ki-engineering`'s enforcement framework:

- **`<domain>-standard.md`** (or the contract / conventions reference it holds) — the normative, quotable reference: what good looks like, and why.
- **`audit-rubric.md`** — the line-by-line checkable criteria, each tagged **mechanical** (a checker enforces it) or **judgment** (a reader assesses it), each citing the standard section it verifies.
- **`references/sources.md`** — the tracked sources behind the standard, with `last reviewed` dates. Provenance only: the record of _what changed_ lives in git (the REFRESH commit), not a changelog in the file. A skill tracking a moving external spec also keeps a current-state **`## Last review`** block — pinned revision, what's confirmed, open watch-items — overwritten each REFRESH.
- **a mechanical checker** — `audit-engineering.ts`, `audit-mcp.ts`, `audit-websites.ts`, `audit-cloudflare-hosting.ts`, `lint-skills.ts`, `lint-agents.ts`, `audit-repo.ts`, `audit-kb.ts`, `audit-streams.ts`, `audit-drs.ts`, `audit-features.ts`, `audit-activities.ts`, `audit-live-artifacts.ts`, `audit-plans.ts`, `audit-handoffs.ts`, `audit-tokenomics.ts`, `audit-harness.ts`, `link-skills.ts` for engineering / mcp / website / website-cloudflare / skills / agents / repo / kb / streams / decision-records / feature-definitions / activities / live-artifacts / plans / handoffs / tokenomics / harness / bootstrap; `bun run ki:lint:md` (Prettier + markdownlint) for authoring. The judgment half is always applied by reading.

…and the same universal four modes: **AUDIT** (run the checker, then apply the judgment criteria), **CONFORM** (bring an existing artifact into line), **INIT** (scaffold a new artifact — or bring an off-standard one onto the floor from scratch — via a per-skill `scripts/bootstrap.ts`), and **REFRESH** (re-anchor the standard to its sources on a stated cadence), plus skill-specific modes where they fit (OPTIMISE, kb's note-ops). The mode model is codified in `ki-skills` (rubric **SHAPE-5**).
