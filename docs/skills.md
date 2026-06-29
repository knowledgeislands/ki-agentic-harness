# The skills

The skills are the bulk of the harness today: **sixteen** of them, each a **governance skill** — it holds a house standard and ships the
universal **AUDIT / CONFORM / REFRESH** modes (plus skill-specific ones), backed by a tracked `references/sources.md`.

This file is the catalogue: what each skill does, and the shared shape they all follow. For how they fit together — the boundaries between
the ones that could be confused, the loops that run across them, and the invariants they all hold — see [design.md](design.md). The overview
map lives in the [README](../README.md).

## The sixteen

The sixteen sit in **two layers** plus a bridge and a keystone: two cross-cutting **foundations** that every other skill builds on, the
**domain** skills that each govern one kind of artifact, `knowledgeislands-harness` — the **container** skill that governs the bundle
holding them all — and `knowledgeislands-bootstrap`, the **install keystone** that wires a repo's project-local skills into place.

### [`knowledgeislands-kb`](../skills/knowledgeislands-kb/SKILL.md) — Knowledge Islands

Interacts with a Knowledge Islands knowledge base over the standard zone model: the note-ops **DIGEST / EXTRACT / QUERY / SAVE / UPDATE**,
plus **AUDIT / CONFORM / INIT** to check a base against the structure model, bring it into line, or scaffold a new one. Only store-level
bindings come from the host base. Ships a mechanical checker (`audit-kb.ts`): zone-layout conformance plus validate-down of its
`[knowledgeislands-kb]` config table. Delegates the **`Streams` zone** to `knowledgeislands-streams`.

### [`knowledgeislands-streams`](../skills/knowledgeislands-streams/SKILL.md) — Knowledge Islands

Owns the **`Streams` zone** — the base's working copy ("plan mode") — and the **Enactment Process** that governs it: the lifecycle modes
**PROPOSE / ITERATE / READY / ROLLOUT / REVIEW / SETTLE / REJECT**, plus **AUDIT / CONFORM** of a base's Streams structure (Focus lifecycle,
the `Proposal` suffix, leaf/parent layout, proposal frontmatter). `knowledgeislands-kb` delegates the zone here, so the heavier process
loads only when working in `Streams`. Ships a mechanical checker (`audit-streams.ts`).

### [`knowledgeislands-decision-records`](../skills/knowledgeislands-decision-records/SKILL.md) — Process

Governs **Decision Records** in any Knowledge Islands repo, code or KB — the typed ID prefixes (`GDR` / `ADR` / `KDR` / …), the five-section
format, the status lifecycle, and placement (`docs/decisions/` in a code repo, `Admin/Governance/Decisions/` in a KB). Ships a mechanical
checker (`audit-drs.ts`). Defers to `knowledgeislands-kb` for the island structure and the KI-wide frontmatter standard, and to
`knowledgeislands-streams` for the Enactment Process by which a change is ratified.

### [`knowledgeislands-activities`](../skills/knowledgeislands-activities/SKILL.md) — Process

Governs **Activity notes** — the operational record of work adopted in a base, kept under `Admin/Operations/Activities/` (naming,
frontmatter, realization type, and the index). Checks that an activity declared as a slash command has a backing skill, and that scheduled
ones are flagged for the external scheduler. Ships a mechanical checker (`audit-activities.ts`). Composes on `knowledgeislands-kb` for the
zone structure.

### [`knowledgeislands-live-artifacts`](../skills/knowledgeislands-live-artifacts/SKILL.md) — Process

Governs **Live Artifacts** — operational documents that track island state (dashboards, boards, queues, trackers) as a `.md` source paired
with a rendered `.html`, kept under `Admin/Operations/Live Artifacts/` with an index, plus the sync rules between the two halves. Ships a
mechanical checker (`audit-live-artifacts.ts`). Composes on `knowledgeislands-kb` for the zone structure.

### [`knowledgeislands-mcp`](../skills/knowledgeislands-mcp/SKILL.md) — Process

Audits, conforms, and scaffolds workspace MCP servers against the "workspace MCP" standard (layout, config injection,
`<app>_<resource>_<action>` tool naming, access-level gate, security invariants, Bun/Node, tooling) across the `mcp-*` repos. Ships a
mechanical checker (`audit-mcp.ts`).

### [`knowledgeislands-11ty-websites`](../skills/knowledgeislands-11ty-websites/SKILL.md) — Process

Audits, conforms, and scaffolds static websites against the house build standard — **Eleventy 3 + Nunjucks + Markdown, TypeScript run
natively on Bun, Tailwind 4 config-less with design tokens** — that compile to a portable `dist/`. Owns the **site-build delta** and
**composes on** `knowledgeislands-engineering` (toolchain) and `knowledgeislands-authoring` (Markdown), handing the built `dist/` to
`knowledgeislands-cloudflare-hosting`. Ships a mechanical checker (`audit-websites.ts`).

### [`knowledgeislands-cloudflare-hosting`](../skills/knowledgeislands-cloudflare-hosting/SKILL.md) — Process

Audits, conforms, and scaffolds the house convention for serving a built site on **Cloudflare Workers + Static Assets** (not Pages): one
`wrangler.jsonc` pointing `assets.directory` at the site's `dist/`, custom-domain routes, observability, and the `ki:site:deploy` script
family. Owns the **hosting delta** for the site Worker; the `dist/` is the seam from `knowledgeislands-11ty-websites`. Companion Workers
(bots, ingress) route to the generic `cloudflare` / `wrangler` skills. Ships a mechanical checker (`audit-cloudflare-hosting.ts`).

### [`knowledgeislands-skills`](../skills/knowledgeislands-skills/SKILL.md) — Process

Audits, writes, and conforms Agent Skills against a checkable rubric — a bundled linter (`ki:skills:lint`) for the mechanical checks, the
judgment ones applied by reading, and a tracked source list it revisits.

### [`knowledgeislands-agents`](../skills/knowledgeislands-agents/SKILL.md) — Process

Audits, writes, and conforms **Claude Code subagent definitions** against a checkable rubric — a bundled linter (`lint-agents.ts`) for the
mechanical checks (frontmatter, `name` uniqueness across the set, link resolution), the judgment ones applied by reading (the `description`
as delegation signal, the system-prompt role/lane, own-vs-defer, least-privilege tools). The **agents twin of `knowledgeislands-skills`**:
that one governs a `SKILL.md`, this one a subagent definition. Governs the agents that land under [`agents/`](../agents/).

### [`knowledgeislands-repo`](../skills/knowledgeislands-repo/SKILL.md) — Process

Audits, conforms, and onboards any **Knowledge Islands–compliant** git repo (one carrying a `.ki-config.toml`) against the repo standard —
local files, GitHub settings, and security. Owns the cross-cutting **`.ki-config.toml` contract**. Ships a mechanical auditor
(`ki:repo:audit`) that discovers repos from a local tree or a whole org.

### [`knowledgeislands-authoring`](../skills/knowledgeislands-authoring/SKILL.md) — Process

The house authoring conventions the other skills build on — Markdown (wide tables → footnotes, link style) and TOML formatting style — and
the single source of truth a repo's or base's `CLAUDE.md` points to. Its mechanical half is `bun run ki:lint:md` (Prettier + markdownlint),
not a bundled script; it carries the judgment half.

### [`knowledgeislands-engineering`](../skills/knowledgeislands-engineering/SKILL.md) — Process

The shared **engineering toolchain** every TS/Bun repo builds on — package.json script families, `tsconfig`/`biome`/`vitest`, the
Bun-install / Node-run split, 100% coverage, the build/cli-chmod rule — plus the **enforcement framework** (the mode shape,
mechanical-checker contract, rubric tagging, `sources.md` cadence, `.ki-config.toml` contract) the other governance skills conform to. The
toolchain twin of `knowledgeislands-authoring`. Ships a mechanical checker (`audit-engineering.ts`); artifact skills (e.g.
`knowledgeislands-mcp`) **compose** their delta on top of its common layer.

### [`knowledgeislands-tokenomics`](../skills/knowledgeislands-tokenomics/SKILL.md) — Process

Audits, conforms, and tunes the **tokenomics** of a Claude Code environment — the standing context surface paid on every turn, as
**composed** across the user-wide `~/.claude` and project-local layers and any base, plus the runtime levers (caching, model tier,
compaction, sub-agent fan-out, tool-result verbosity). Attributes cost per layer, holds it to overridable budgets (a
`[knowledgeislands-tokenomics]` table, read validate-down), and checks context-compression tooling — **Headroom**, an extensible registry —
is set up optimally. **Composes** on the artifact skills whose surfaces it measures (`knowledgeislands-mcp` for the tool surface,
`knowledgeislands-skills` for the description surface, `knowledgeislands-kb` for a base's loaded surface) and defers the volatile reference
numbers to the `claude-api` skill. Ships a mechanical checker (`audit-tokenomics.ts`) that reads both config layers by design.

### [`knowledgeislands-harness`](../skills/knowledgeislands-harness/SKILL.md) — Process

Audits, conforms, and scaffolds the **agentic harness itself** — the container that bundles the other parts: the four-part `skills/` /
`agents/` / `mcp/` / `evals/` layout, the root `CLAUDE.md` / `ROADMAP.md` / `package.json` script families / `.ki-config.toml` table, and
the `skills:link:*` install convention (whose project-local linking `knowledgeislands-bootstrap` carries out). Governs the **container, not
the contents**: the bridge into the sibling skills rather than a replacement — it **composes** their checkers (`knowledgeislands-skills`,
`knowledgeislands-agents`, `knowledgeislands-mcp`, `knowledgeislands-engineering`, `knowledgeislands-repo`) and adds only the
bundle-structure delta. Ships a mechanical checker (`audit-harness.ts`). Empty shelves are valid — a shelf is not a gap.

### [`knowledgeislands-bootstrap`](../skills/knowledgeislands-bootstrap/SKILL.md) — Process

Wires a repo's **project-local skills** (`.claude/skills/`) from its `.ki-config.toml` — links exactly the skills it declares plus the
`knowledgeislands-repo` + `knowledgeislands-authoring` baseline, as **gitignored, regenerated** relative symlinks (the committed artifacts
are a `ki:skills:link:project` script and the `.gitignore` line, never the links). This is the **install keystone** — the one
`knowledgeislands-*` skill kept installed globally in `~/.claude/skills`, so its `description` is deliberately tiny and any repo can
self-wire. **Composes on** `knowledgeislands-repo` (which owns the `.ki-config.toml` contract and coverage cascade it reads); it is the
project-local counterpart of `knowledgeislands-harness`'s install convention. Ships a mechanical checker (`link-skills.ts`).

Where the set is going next is in [ROADMAP.md](../ROADMAP.md).

## The governance-skill shape

All sixteen share one layout, so a reader (or a new such skill) can move between them — the layout and modes are themselves codified in
`knowledgeislands-engineering`'s [enforcement framework](../skills/knowledgeislands-engineering/references/enforcement-framework.md):

- **`<domain>-standard.md`** (or the contract / conventions reference it holds) — the normative, quotable reference: what good looks like,
  and why.
- **`audit-rubric.md`** — the line-by-line checkable criteria, each tagged **mechanical** (a checker enforces it) or **judgment** (a reader
  assesses it), each citing the standard section it verifies.
- **`references/sources.md`** — the tracked sources behind the standard, with `last reviewed` dates. Provenance only: the record of _what
  changed_ lives in git (the REFRESH commit), not a changelog in the file. A skill tracking a moving external spec also keeps a
  current-state **`## Last review`** block — pinned revision, what's confirmed, open watch-items — overwritten each REFRESH.
- **a mechanical checker** — `audit-engineering.ts`, `audit-mcp.ts`, `audit-websites.ts`, `audit-cloudflare-hosting.ts`, `lint-skills.ts`,
  `lint-agents.ts`, `audit-repo.ts`, `audit-kb.ts`, `audit-streams.ts`, `audit-drs.ts`, `audit-activities.ts`, `audit-live-artifacts.ts`,
  `audit-tokenomics.ts`, `audit-harness.ts`, `link-skills.ts` for engineering / mcp / 11ty-websites / cloudflare-hosting / skills / agents /
  repo / kb / streams / decision-records / activities / live-artifacts / tokenomics / harness / bootstrap; `bun run ki:lint:md` (Prettier +
  markdownlint) for authoring. The judgment half is always applied by reading.

…and the same modes: **AUDIT** (run the checker, then apply the judgment criteria), **CONFORM** (bring an existing artifact into line), and
**REFRESH** (re-anchor the standard to its sources on a stated cadence), plus skill-specific modes where they fit — **INIT** to scaffold a
new artifact, and kb's note-ops. The mode model is codified in `knowledgeislands-skills` (rubric **SHAPE-5**).
