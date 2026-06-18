# arcadia-agentic-harness

The **agentic harness** for Knowledge Islands work — the canonical home for what an agent is given to work with here, kept in one place so
the whole set can be versioned, reviewed, and installed together rather than scattered across the bases and projects that use it. The layout
mirrors `hnr-agentic-harness`; it holds four things:

- **Skills** ([`skills/`](skills/)) — reusable [Agent Skills](https://agentskills.io/specification), the bulk of the harness today
  (**eleven** of them, all governance skills — see below). Installed elsewhere by symlink.
- **Agents** ([`agents/`](agents/)) — Knowledge Islands [Claude Code subagents](https://code.claude.com/docs/en/sub-agents), one per file.
  An empty **shelf** today, governed by the `knowledgeislands-agents` skill.
- **MCP servers** ([`mcp/`](mcp/)) — where KI's MCP servers would consolidate as workspace packages. An empty **shelf** today; they
  currently live as separate `mcp-*` repos, governed by the `knowledgeislands-mcp` skill.
- **Evals** ([`evals/`](evals/)) — a behavioural test suite that checks a skill actually _changes what the model does_, not just that its
  `SKILL.md` is well-formed.

Skills are the bulk of it today, so most of what follows is about them; the two shelves and the eval suite each get their own section after.

Skills here fall into a few kinds, and the set will grow:

- **Knowledge Islands skills** - operate over the standard Knowledge Islands knowledge-base structure (see below). They carry reusable mode
  logic and resolve only a few store-level bindings from the host base. The `kb` and `streams` skills are these.
- **Process skills** - encode a workflow or procedure that is not tied to any particular base (a review process, a release checklist, a
  research harness).
- **Scoped skills** - target a specific area: a subset of folders, a single project, or one recurring task.

A skill does not have to be wedded to Knowledge Islands. The repository layout, the install steps, and the linking conventions below apply
to every kind equally.

## What a skill is

A skill is a directory containing a `SKILL.md` with YAML frontmatter and a markdown body, per the Agent Skills open standard (originated by
Anthropic for Claude Code, consumed by Cowork and other agent platforms). Longer detail goes in `references/`, executables in `scripts/`,
templates in `assets/` - all loaded on demand (progressive disclosure). Keep `SKILL.md` under ~500 lines / ~5,000 tokens.

```text
<skill-name>/
├── SKILL.md            # required - frontmatter (name, description) + body
├── references/         # optional - long-form detail
├── scripts/            # optional - executable helpers
└── assets/             # optional - templates and resources
```

The directory name **is** the skill's `name`: lowercase, hyphenated, and matching the `name:` frontmatter field exactly. Agents discover a
skill by its `name`, so the two must stay in sync.

## Skills in this repository

Eleven skills, each a **governance skill**: it holds a house standard and ships the universal **AUDIT / CONFORM / REFRESH** modes (plus
skill-specific ones), backed by a tracked `references/sources.md`.

### The map — how the eleven fit together

The eleven sit in **two layers**: two cross-cutting **foundations** that every other skill builds on, and the **domain** skills that each
govern one kind of artifact. The arrows are the structural ties (who _delegates to_, _composes on_, or _feeds_ whom) spelled out in the
sections that follow.

```text
FOUNDATIONS — cross-cutting "how" (every domain skill builds on both)
  authoring     how we WRITE  ·  Markdown + TOML formatting style
  engineering   how we BUILD  ·  the shared toolchain + the enforcement framework
                                       ▲
                                       │ build on
───────────────────────────────────────┼──────────────────────────────────────
                                       │
DOMAIN — what each skill governs
  knowledge bases   kb ──delegates the Streams zone──▶ streams
  repos & code      repo ──owns the .ki-config.toml contract──▶ (kb · mcp · engineering consume it)
                    mcp  ──composes its checker on──▶ engineering
  skills & agents   skills ── a SKILL.md (frontmatter + body)   ·   agents ── a subagent definition (the twin)
  websites          11ty-websites ──emits dist/──▶ cloudflare-hosting   (both compose on engineering)
  context budget    tokenomics ──audits the standing surface composed across──▶ (kb · mcp · skills · settings)
```

Read the per-skill entries next for what each does; _Where the skills do not overlap_ draws the boundaries between the pairs that could be
confused, and _How knowledge moves_ shows the process loops that run across them.

### [`knowledgeislands-kb`](skills/knowledgeislands-kb/SKILL.md) — Knowledge Islands

Interacts with a Knowledge Islands knowledge base over the standard zone model: the note-ops **DIGEST / EXTRACT / QUERY / SAVE / UPDATE**,
plus **AUDIT / CONFORM / INIT** to check a base against the structure model, bring it into line, or scaffold a new one. Only store-level
bindings come from the host base. Ships a mechanical checker (`audit-kb.ts`): zone-layout conformance plus validate-down of its
`[knowledgeislands-kb]` config table. Delegates the **`Streams` zone** to `knowledgeislands-streams`.

### [`knowledgeislands-streams`](skills/knowledgeislands-streams/SKILL.md) — Knowledge Islands

Owns the **`Streams` zone** — the base's working copy ("plan mode") — and the **Enactment Process** that governs it: the lifecycle modes
**PROPOSE / ITERATE / READY / ROLLOUT / REVIEW / SETTLE / REJECT**, plus **AUDIT / CONFORM** of a base's Streams structure (Focus lifecycle,
the `Proposal` suffix, leaf/parent layout, proposal frontmatter). `knowledgeislands-kb` delegates the zone here, so the heavier process
loads only when working in `Streams`. Ships a mechanical checker (`audit-streams.ts`).

### [`knowledgeislands-mcp`](skills/knowledgeislands-mcp/SKILL.md) — Process

Audits, conforms, and scaffolds workspace MCP servers against the "workspace MCP" standard (layout, config injection,
`<app>_<resource>_<action>` tool naming, access-level gate, security invariants, Bun/Node, tooling) across the `mcp-*` repos. Ships a
mechanical checker (`audit-mcp.ts`).

### [`knowledgeislands-11ty-websites`](skills/knowledgeislands-11ty-websites/SKILL.md) — Process

Audits, conforms, and scaffolds static websites against the house build standard — **Eleventy 3 + Nunjucks + Markdown, TypeScript run
natively on Bun, Tailwind 4 config-less with design tokens** — that compile to a portable `dist/`. Owns the **site-build delta** and
**composes on** `knowledgeislands-engineering` (toolchain) and `knowledgeislands-authoring` (Markdown), handing the built `dist/` to
`knowledgeislands-cloudflare-hosting`. Ships a mechanical checker (`audit-websites.ts`).

### [`knowledgeislands-cloudflare-hosting`](skills/knowledgeislands-cloudflare-hosting/SKILL.md) — Process

Audits, conforms, and scaffolds the house convention for serving a built site on **Cloudflare Workers + Static Assets** (not Pages): one
`wrangler.jsonc` pointing `assets.directory` at the site's `dist/`, custom-domain routes, observability, and the `site:deploy` script
family. Owns the **hosting delta** for the site Worker; the `dist/` is the seam from `knowledgeislands-11ty-websites`. Companion Workers
(bots, ingress) route to the generic `cloudflare` / `wrangler` skills. Ships a mechanical checker (`audit-cloudflare-hosting.ts`).

### [`knowledgeislands-skills`](skills/knowledgeislands-skills/SKILL.md) — Process

Audits, writes, and conforms Agent Skills against a checkable rubric — a bundled linter (`skills:lint`) for the mechanical checks, the
judgment ones applied by reading, and a tracked source list it revisits.

### [`knowledgeislands-agents`](skills/knowledgeislands-agents/SKILL.md) — Process

Audits, writes, and conforms **Claude Code subagent definitions** against a checkable rubric — a bundled linter (`lint-agents.ts`) for the
mechanical checks (frontmatter, `name` uniqueness across the set, link resolution), the judgment ones applied by reading (the `description`
as delegation signal, the system-prompt role/lane, own-vs-defer, least-privilege tools). The **agents twin of `knowledgeislands-skills`**:
that one governs a `SKILL.md`, this one a subagent definition. Governs the agents that land under [`agents/`](agents/).

### [`knowledgeislands-repo`](skills/knowledgeislands-repo/SKILL.md) — Process

Audits, conforms, and onboards any **Knowledge Islands–compliant** git repo (one carrying a `.ki-config.toml`) against the repo standard —
local files, GitHub settings, and security. Owns the cross-cutting **`.ki-config.toml` contract**. Ships a mechanical auditor (`repo:audit`)
that discovers repos from a local tree or a whole org.

### [`knowledgeislands-authoring`](skills/knowledgeislands-authoring/SKILL.md) — Process

The house authoring conventions the other skills build on — Markdown (wide tables → footnotes, link style) and TOML formatting style — and
the single source of truth a repo's or base's `CLAUDE.md` points to. Its mechanical half is `bun run lint:md` (Prettier + markdownlint), not
a bundled script; it carries the judgment half.

### [`knowledgeislands-engineering`](skills/knowledgeislands-engineering/SKILL.md) — Process

The shared **engineering toolchain** every TS/Bun repo builds on — package.json script families, `tsconfig`/`biome`/`vitest`, the
Bun-install / Node-run split, 100% coverage, the build/cli-chmod rule — plus the **enforcement framework** (the mode shape,
mechanical-checker contract, rubric tagging, `sources.md` cadence, `.ki-config.toml` contract) the other governance skills conform to. The
toolchain twin of `knowledgeislands-authoring`. Ships a mechanical checker (`audit-engineering.ts`); artifact skills (e.g.
`knowledgeislands-mcp`) **compose** their delta on top of its common layer.

### [`knowledgeislands-tokenomics`](skills/knowledgeislands-tokenomics/SKILL.md) — Process

Audits, conforms, and tunes the **tokenomics** of a Claude Code environment — the standing context surface paid on every turn, as
**composed** across the user-wide `~/.claude` and project-local layers and any base, plus the runtime levers (caching, model tier,
compaction, sub-agent fan-out, tool-result verbosity). Attributes cost per layer, holds it to overridable budgets (a
`[knowledgeislands-tokenomics]` table, read validate-down), and checks context-compression tooling — **Headroom**, an extensible registry —
is set up optimally. **Composes** on the artifact skills whose surfaces it measures (`knowledgeislands-mcp` for the tool surface,
`knowledgeislands-skills` for the description surface, `knowledgeislands-kb` for a base's loaded surface) and defers the volatile reference
numbers to the `claude-api` skill. Ships a mechanical checker (`audit-tokenomics.ts`) that reads both config layers by design.

Where the set is going next is in [ROADMAP.md](ROADMAP.md).

### The governance-skill shape

All ten share one layout, so a reader (or a new such skill) can move between them — the layout and modes are themselves codified in
`knowledgeislands-engineering`'s [enforcement framework](skills/knowledgeislands-engineering/references/enforcement-framework.md):

- **`<domain>-standard.md`** (or the contract / conventions reference it holds) — the normative, quotable reference: what good looks like,
  and why.
- **`audit-rubric.md`** — the line-by-line checkable criteria, each tagged **mechanical** (a checker enforces it) or **judgment** (a reader
  assesses it), each citing the standard section it verifies.
- **`references/sources.md`** — the tracked sources behind the standard, with `last reviewed` dates. Provenance only: the record of _what
  changed_ lives in git (the REFRESH commit), not a changelog in the file. A skill tracking a moving external spec also keeps a
  current-state **`## Last review`** block — pinned revision, what's confirmed, open watch-items — overwritten each REFRESH.
- **a mechanical checker** — `audit-engineering.ts`, `audit-mcp.ts`, `audit-websites.ts`, `audit-cloudflare-hosting.ts`, `lint-skills.ts`,
  `lint-agents.ts`, `audit-repo.ts`, `audit-kb.ts`, `audit-streams.ts` for engineering / mcp / 11ty-websites / cloudflare-hosting / skills /
  agents / repo / kb / streams; `bun run lint:md` (Prettier + markdownlint) for authoring. The judgment half is always applied by reading.

…and the same modes: **AUDIT** (run the checker, then apply the judgment criteria), **CONFORM** (bring an existing artifact into line), and
**REFRESH** (re-anchor the standard to its sources on a stated cadence), plus skill-specific modes where they fit — **INIT** to scaffold a
new artifact, and kb's note-ops. The mode model is codified in `knowledgeislands-skills` (rubric **SHAPE-5**).

### Where the skills do not overlap

Each skill's `description` carries its own boundaries so the agent selects the right one, and where two could fire on the same request each
names the other as the **off-ramp** — reciprocally, so the line holds from both sides (for humans as well as the agent). The pairs worth
stating once, with the nuance in the footnotes below:

| Pair that could be confused                                            | The line between them                                                             |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `knowledgeislands-mcp` vs `knowledgeislands-skills`                    | MCP **server code** vs a **`SKILL.md`** (frontmatter + body prose). †             |
| `knowledgeislands-agents` vs `knowledgeislands-skills`                 | A **subagent definition** vs a **`SKILL.md`** — twins over different artifacts.   |
| `knowledgeislands-kb` vs `knowledgeislands-streams`                    | The five-zone model + note CRUD vs the **`Streams` zone internals**, delegated. ‡ |
| `knowledgeislands-repo` vs `knowledgeislands-mcp`                      | A repo's **configuration** vs an MCP server's **source**. §                       |
| `knowledgeislands-authoring` vs the rest                               | **How we write** vs _what_ we write. ¶                                            |
| `knowledgeislands-engineering` vs the rest                             | **How we build** vs everything that isn't the toolchain. ‖                        |
| `knowledgeislands-11ty-websites` vs `…-cloudflare-hosting`             | **Building** the portable `dist/` vs **serving** it — the `dist/` is the seam. †† |
| `…-cloudflare-hosting` vs the generic `cloudflare` / `wrangler` skills | The **one site Worker** serving `dist/` vs all other Workers + platform usage. ‡‡ |
| `knowledgeislands-tokenomics` vs `knowledgeislands-mcp`                | The **token cost** of the MCP tool surface vs an MCP server's **code**. §§        |
| `knowledgeislands-tokenomics` vs `knowledgeislands-skills`             | The installed set's **description cost** vs one `SKILL.md`'s **quality**. §§      |
| `knowledgeislands-tokenomics` vs the `claude-api` skill                | The **shape** of the context budget vs the volatile **numbers** it cites. §§      |

† Auditing the `SKILL.md` of an MCP-related skill is `knowledgeislands-skills`' job; auditing the server's `src/` layout, config injection,
and tool surface is `knowledgeislands-mcp`'s. This is the one pair that could be confused — both "audit against a standard" — so each names
the other as the off-ramp.

‡ Both operate over a base, at different scopes. `knowledgeislands-kb` owns the five-zone model, routing, and note CRUD; it knows `Streams/`
is a zone but delegates the zone's internals — the Focus lifecycle, the proposal layout, the Enactment Process — to
`knowledgeislands-streams`, which loads only when working in `Streams`. Anything outside that zone is kb's.

§ `knowledgeislands-repo` governs **any** Knowledge Islands–compliant repo (anything carrying a `.ki-config.toml`) — its configuration,
GitHub-side settings, and the universal local files (README/LICENSE/.gitignore/.editorconfig). `knowledgeislands-mcp` governs the server's
**code** (`src/` layout, config injection, tool surface). Configuration vs source.

¶ `knowledgeislands-authoring` owns _how we write_ — Markdown style and TOML _formatting_ — the cross-cutting layer the others assume rather
than restate. The content itself routes elsewhere: note _content_ and KB structure → `knowledgeislands-kb`; a repo's _configuration_ and the
`.ki-config.toml` _contract_ → `knowledgeislands-repo`; a `SKILL.md`'s prose and frontmatter → `knowledgeislands-skills`.

‖ `knowledgeislands-engineering` is the build/test twin of `knowledgeislands-authoring`: it owns the _engineering toolchain_ (package.json
script families, `tsconfig`/`biome`/`vitest`, the Bun/Node split, the build/cli-chmod rule) and the _enforcement framework_ every governance
skill follows. The rest routes out: GitHub settings, security, and the `.ki-config.toml` _contract_ → `knowledgeislands-repo` (engineering
only reads its own table within it); Markdown/TOML _formatting_ → `knowledgeislands-authoring`; an artifact's own code and delta (an MCP's
`src/` layout, tool surface, coverage-excludes) → that artifact skill, which **composes** its checker on top of engineering's common layer.
The two website skills are such artifact skills, composing on engineering exactly as `knowledgeislands-mcp` does.

†† `knowledgeislands-11ty-websites` owns the _build_ — Eleventy/Nunjucks/Tailwind and the absolute→relative URL transform that emits a
portable `dist/`; `knowledgeislands-cloudflare-hosting` owns _serving_ that `dist/` — the `wrangler.jsonc`, Workers + Static Assets, and
custom domains. They meet only at the `dist/` path, so each names the other as the off-ramp, and both compose on
`knowledgeislands-engineering`.

‡‡ `knowledgeislands-cloudflare-hosting` governs only the **site** Worker — the one with an `assets` block serving `dist/`. Every other
Worker — a bot, an ingress receiver, an API, anything with a `main` entry, bindings, or crons — and all general `wrangler`/Workers usage is
the generic `cloudflare` / `wrangler` skills' domain; the hosting skill notes such a Worker and leaves it alone.

§§ `knowledgeislands-tokenomics` measures and tunes the **cost** of the context surface; it does not own the artifacts that produce that
cost. It composes on the artifact skills rather than competing with them — it reads the MCP tool surface but routes a server's own design to
`knowledgeislands-mcp`, reads the installed skills' descriptions but routes a single `SKILL.md`'s quality to `knowledgeislands-skills`, and
reads a base's loaded surface but routes structure to `knowledgeislands-kb`. The volatile reference **numbers** (model ids, prices, cache
TTLs, context-window sizes) it deliberately holds none of — those are the `claude-api` skill's, resolved at runtime — so it owns the
budget's _shape_, that skill the figures.

### How knowledge moves and improves — the three loops

The skills share one mental model. Knowledge lives in **zones** (the canonical `Admin` / `Pillars` / `Resources`, the working `Streams`, and
the ephemeral `Calendar` plus `+` / `-` staging), and each skill is a **canonical definition** that **bases** defer to through bindings.
Over that sit three loops — how knowledge _enters_, _changes_, and _stays current_ — each owned by one skill and each handing off to the
next rather than overlapping:

- **Continuous Improvement** (`knowledgeislands-kb`, mode **IMPROVE**) — the base-side discovery loop. Each session, scan for knowledge
  applied ad-hoc but not yet formalised, then **route** each candidate to its home.
- **Enactment Process** (`knowledgeislands-streams`) — the gate. A candidate that changes a canonical zone becomes a proposal that passes
  approval before it lands.
- **REFRESH** (every skill) — the promotion loop. A candidate that recurs across bases is promoted from practice into the canonical skill.

```text
                           ┌─ local & non-canonical ──→ write it directly (no governance)
IMPROVE (notice) ─routes─→ ├─ changes a canonical zone ─→ ENACTMENT (proposal through the gate)
                           └─ recurs across bases ─────→ REFRESH (promote into the skill)
```

**IMPROVE and REFRESH are mirror images** across the skill/base line: IMPROVE looks _down_ (this base's practice → formalise), REFRESH looks
_across_ (many bases → one skill); a cross-base candidate is the handoff between them. **Enactment** is orthogonal — the gate any canonical
change passes through, whoever raised it. The discipline that keeps the three distinct: _IMPROVE discovers and routes, Enactment governs,
REFRESH promotes_ — none restates another.

### Principles across the set

Six invariants hold for every skill here, current and future — each tied to a named rubric criterion rather than just asserted, so a new
skill inherits them by being audited:

- **Every skill carries a refresh path — and a cadence.** A skill that tracks a moving target (an external spec, a community best-practice,
  a base's live structure) ships a REFRESH mode and a dated `references/sources.md`, and states how often it should run; one that hard-codes
  no volatile external fact may instead resolve it at runtime. The point is durability: a skill installed into a shared or cloud catalogue
  is long-lived and far from its author, and must not rot silently. Enforced as `knowledgeislands-skills` rubric **LONG-1** (a refresh path
  exists) and **LONG-2** (it has a cadence, ideally a scheduled run), and mirrored into the `knowledgeislands-mcp` audit checklist. The
  monthly `knowledgeislands-skills-refresh` routine realises it — running every governance skill's REFRESH against its tracked sources and
  opening a PR for review rather than committing.
- **No silent collisions.** Where two skills could fire on the same request, each description names the other as the off-ramp, and new
  skills are audited against the existing set before they ship (rubric **COLL-1/COLL-2**; the linter's cross-skill pass flags shared
  triggers). The current boundaries are the subject of _Where the skills do not overlap_, just above.
- **Composition only — no base-coupled extension.** Knowledge Islands skills stay base-agnostic and resolve bindings at runtime; what a base
  needs differently is **declared, not forked** — data in its `.ki-config.toml` table (read validate-down), prose in its `CLAUDE.md` — never
  a `<base>-kb`-style extension skill that takes the shared modes by name. Skills relate only by **composition** (run a sibling's
  checker/mode in sequence, add a delta), spelled out in _Standard skills and per-base config_, below.
- **One governance-mode model.** Every skill exposes the universal **AUDIT / CONFORM / REFRESH** modes plus skill-specific ones (**INIT** to
  scaffold, operational modes such as kb's note-ops), codified as rubric **SHAPE-5** so a new skill inherits the shape. The layout this
  produces is _The governance-skill shape_, above.
- **A behaviour-changing skill anchors its gate — and checks the anchor.** A skill that changes a default (installs a gate, a standing "do X
  before Y" rule) cannot rely on its own `description` to fire — skills load on demand, and the triggering request often won't name the
  skill (e.g. "edit this note" never says "proposal"). So it anchors the behaviour in always-loaded context (the base/repo `CLAUDE.md` /
  `AGENTS.md`) and its **checker verifies the anchor** is present. Enforced as rubric **SHAPE-7**; realised as `knowledgeislands-streams`'
  **GATE-1** (the Enactment gate) and `knowledgeislands-kb`'s **MEM-2** (the memory cascade).
- **Audits compose.** Auditing a target runs every _applicable_ skill's audit, not just one: a base audit is `knowledgeislands-kb` +
  `knowledgeislands-streams` + `knowledgeislands-authoring` over its markdown; a repo audit is `knowledgeislands-repo` +
  `knowledgeislands-engineering` (the common toolchain) + `knowledgeislands-mcp` (the MCP delta, for an MCP repo) — or, for a website repo,
  `+ knowledgeislands-11ty-websites` (the site-build delta) `+ knowledgeislands-cloudflare-hosting` (the hosting delta, if deployed) — + the
  skills linter (for any skills it ships) and the agents linter (for any subagents it ships). A target is "clean" only when each applicable
  skill's audit passes; each skill's AUDIT mode names the siblings it composes.
- **Applicability is declared, then enforced — the coverage cascade.** Which standards govern a repo isn't left to inference: a repo **opts
  in** by carrying a `[knowledgeislands-<skill>]` table, and `.ki-config.toml`'s presence is the **gate** — once it marks the repo a
  ki-repo, `knowledgeislands-repo`'s audit checks that every skill whose artifacts it detects (a `Streams/` zone, an `eleventy.config`, an
  MCP-SDK dependency, `skills/*/SKILL.md`, …) is declared, and WARNs on a detected-but-undeclared standard. A non-ki-repo (no
  `.ki-config.toml`) is never coverage-checked, so a lookalike isn't falsely flagged. This is the one place a skill (`repo`) reads across
  tables — **presence only** — and it's an _audit-time_ enforcement; the model lives in
  [the `.ki-config.toml` contract](skills/knowledgeislands-repo/references/ki-config-standard.md).

## Agents

The [`agents/`](agents/) shelf is where Knowledge Islands **Claude Code subagents** live — one Markdown file each (YAML frontmatter + system
prompt, per [the subagents standard](https://code.claude.com/docs/en/sub-agents)), grouped into domain subdirectories. **Empty for now**:
the shelf is in place, mirroring `hnr-agentic-harness/agents/`, ready for agents as they land. Identity comes from each agent's `name`
field, unique across the tree, not its path. Every definition conforms to the `knowledgeislands-agents` standard — run its AUDIT before
shipping an agent, the same way a `SKILL.md` runs `knowledgeislands-skills`. See [`agents/README.md`](agents/README.md) for the convention
and how to add one.

## MCP servers

The [`mcp/`](mcp/) shelf is where Knowledge Islands **MCP servers** would consolidate as Bun workspace packages (`mcp/<name>/`). **Empty for
now**: today KI's servers live as separate `mcp-*` repos, each conforming to the workspace-MCP standard that the `knowledgeislands-mcp`
skill defines and audits. This directory mirrors `hnr-agentic-harness/mcp/` and is where those repos would land if the harness takes them
in. See [`mcp/README.md`](mcp/README.md).

## Evals

The [`evals/`](evals/) suite is the **behavioural** half of what we ask of a skill: `skills:lint` checks that a `SKILL.md` is well-formed,
but an eval checks the skill _actually changes what the model does_. Each scenario asks the model the same question twice — once with the
skill off, once with it on — and scores both with regex **assertions** (the hard signal) and an LLM **judge** (the soft signal). It drives
the local `claude` CLI (no API key), so it spends a little normal quota; it is a **rough signal, not a gate** (a WARN), since output wobbles
run to run.

```bash
bun run eval                        # all scenarios, on Sonnet
bun run eval --model opus           # pick a model: sonnet | opus | haiku
bun run eval --scenario toml-style  # just one scenario
bun run eval --runs 3               # repeat 3× and average — steadier signal
```

Scenarios live under [`evals/scenarios/`](evals/scenarios/), one file per skill (aim for 3+ each), targeting **house-specific** facts — the
model already knows general best practice with or without the skill. Most skills have a scenario file; the website pair and
`knowledgeislands-agents` are still to be seeded (see [ROADMAP.md](ROADMAP.md)). For routine runs use Sonnet — the most cost-effective arm.
Full detail, including how to add scenarios, is in [`evals/README.md`](evals/README.md).

## Installing skills

Claude Code (and compatible agents) discover skills in two places:

- **User-global** - `~/.claude/skills/<name>/`, available in every session on this machine.
- **Per-project** - `<project>/.claude/skills/<name>/`, available only when working in that project (and shareable via the project's repo).

The recommended way to install from this repository is a **symlink**, so edits in the repo are live everywhere the skill is installed and a
`git pull` updates every consumer at once. The bundled sync script ([`scripts/sync-skills.ts`](scripts/sync-skills.ts)) wraps this safely;
it treats every directory under `skills/` containing a `SKILL.md` as a skill. Install dependencies once with `bun install`.

### With the sync script (recommended)

```bash
bun run skills:status   # show each skill and whether it is linked in ~/.claude/skills
bun run skills:link     # symlink every skill into ~/.claude/skills (re-runnable)
bun run skills:unlink   # remove only the symlinks that point back into this repo
```

`skills:link` is idempotent: it refreshes existing links, skips a target where a _real_ file or directory is in the way (rather than
clobbering it), and creates `~/.claude/skills` if needed. Pass flags straight through (no `--` separator needed with `bun run`), or call the
script directly:

```bash
bun scripts/sync-skills.ts link --dry-run                                # preview without touching anything
bun scripts/sync-skills.ts link --target /path/to/project/.claude/skills # install into one project instead
```

### Without the script (plain shell)

A single skill, user-global:

```bash
cd /Users/krisbrown/kis/knowledgeislands/arcadia-agentic-harness
ln -sfn "$PWD/skills/knowledgeislands-kb" ~/.claude/skills/knowledgeislands-kb
```

`ln -sfn` forces replacement of an existing link and never dereferences into a directory, so re-running it updates the link in place instead
of nesting a second link inside it. The link name must match the skill directory name (and the `name:` frontmatter).

### Verify and remove

```bash
ls -l ~/.claude/skills          # symlinks show their -> target; confirm they resolve
rm ~/.claude/skills/<name>      # uninstall: removes the link only, never the repo
```

Removing a symlink only unlinks it - the skill source in this repository is untouched. Start a new session after adding or removing a skill
so the agent re-scans the skills directory.

## Using a skill

Once a skill is installed, there is nothing to import or configure - the agent loads it on demand. There are two ways it fires:

- **By trigger (automatic)** - just describe the task in plain language. The agent matches your request against each skill's `description`
  (the part that says _when_ to use it) and loads the skill itself. "audit the m365 MCP against our standard" or "save this to my notes"
  will pull in the right skill without you naming it.
- **By slash command (explicit)** - type `/<skill-name>` to invoke it directly, optionally followed by arguments:
  `/knowledgeislands-mcp audit ~/kis/knowledgeislands/mcp-gmail`. Use this when you want to be certain which skill runs, or to pass a
  specific mode.

A skill that takes modes or arguments advertises them in its `argument-hint` frontmatter, shown as you type the slash command. For example
`knowledgeislands-mcp` lists `audit <repo> | conform <repo> | init <repo> | refresh` - the words before each `<...>` are the modes, and the
rest is what to pass. The arguments are a hint, not a parser: anything you type after the name reaches the skill as free text, so a
plain-language phrasing of the same request works equally well.

This is why per-skill usage is **not** repeated in each `SKILL.md` body: the `description` documents when a skill fires and the
`argument-hint` documents its modes, both machine-read at selection time. How to invoke _any_ skill - the slash-vs-trigger mechanics above -
is a property of Claude Code and lives here, once.

## Linking inside skills

Skills use **standard relative markdown links**, not Obsidian wikilinks, so they stay valid when relocated, symlinked, or shared. Link a
co-located file by relative path (`[ref](<references/Detail.md>)`); use the CommonMark angle-bracket form for paths containing spaces. Refer
to _another_ skill by its `name` (e.g. "the `knowledgeislands-kb` skill"), never by a file path - the other skill loads into the session
under that name and its location on disk is not stable.

## The Knowledge Islands structure

The Knowledge Islands skills assume a fixed knowledge-base shape, so a base does not redefine it - it supplies only a few store-level
bindings. A Knowledge Islands base is one markdown store with a fixed set of five zones - `Calendar/`, `Pillars/`, `Resources/`, `Streams/`,
and `Admin/` - flanked by an inbound (`+/`) and an outbound (`-/`) staging area (staging, not zones: material lands or leaves through them
but is not canonical there). Each whole base is an "island"; within it, a **Pillar** is a major strand of subject matter (a case, a client,
a domain, a theme). The full zone model, the note-content wikilink convention, and routing rules live in
[`knowledgeislands-kb`](skills/knowledgeislands-kb/SKILL.md); the **`Streams` zone** — its internal structure and the Enactment Process that
governs work in motion — is owned by [`knowledgeislands-streams`](skills/knowledgeislands-streams/SKILL.md), which `knowledgeislands-kb`
delegates to.

### Standard skills and per-base config

A **standard** Knowledge Islands skill carries reusable mode logic over the structure and resolves the few base-level bindings (store
aliases, scope usage, writing standards) at runtime from the host base's own `CLAUDE.md` and memory index. It hard-codes no single base.

What a base needs **differently** is declared, never forked into a base-coupled skill. Structured **data** — zone aliases, required
frontmatter, pre-flight reads — goes in the base's `.ki-config.toml` `[knowledgeislands-kb]` table, which the standard skill reads
**validate-down** (it warns on a key it doesn't recognise and never reads another skill's table). Narrative bindings — store alias, scope
usage, writing standards — live in the base's `CLAUDE.md`. A base ships **no** `<base>-kb` skill. This keeps base-specificity auditable in
one place rather than hidden in a coupled skill that drifts from the standard; a genuinely base-specific _behaviour_ that no declaration can
express is a signal to generalise it into the standard (a REFRESH candidate), not to fork.

## Development

This repository follows the Knowledge Islands house toolchain — itself codified in the `knowledgeislands-engineering` skill, which this repo
conforms to (`bun run engineering:audit .`): [Bun](https://bun.sh) as the package manager, [Biome](https://biomejs.dev) for the TypeScript
(the sync script, the per-skill checkers, the eval harness), and Prettier + markdownlint-cli2 for the markdown that makes up the skills. A
husky pre-commit hook runs `lint-staged` over changed files.

```bash
bun install        # install dev dependencies and wire the git hook
bun run lint:check # Biome lint/format check (TypeScript + JSON)
bun run lint:fix   # Biome, auto-fixing
bun run lint:md    # Prettier + markdownlint over all markdown
bun run lint:types # tsc --noEmit
bun run lint:package # syncpack: keep package.json sorted
bun run skills:lint  # audit every skill's mechanical criteria (knowledgeislands-skills rubric)
bun run eval         # advisory behavioural eval suite (see evals/)
```

`skills:lint` runs the mechanical half of the [`knowledgeislands-skills`](skills/knowledgeislands-skills/SKILL.md) rubric over every skill
(frontmatter, naming, length caps, link resolution); the judgment half is applied by that skill when you ask it to audit one. Several skills
also expose a repo-level audit script — `engineering:audit`, `repo:audit`, `kb:audit`, `streams:audit` — that runs their mechanical checker
over a target.

## Roadmap

The forward view — what's next and why — lives in [ROADMAP.md](ROADMAP.md). The standards, the mechanical checkers, and the advisory eval
harness are all in place, and keeping them applied is a continuous practice (above), not roadmap work. What remains is mostly _dogfooding_:
conforming the website repos to the new `11ty-websites` / `cloudflare-hosting` standards, finishing the `.ki-config.toml` override-layer
rollout across its consuming skills, and two Dependabot follow-ups for the `mcp-*` repos.
