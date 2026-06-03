# arcadia-skills

A collection of reusable [Agent Skills](https://agentskills.io/specification). This repository is the canonical home for skills authored across Knowledge
Islands - kept in one place so they can be versioned, reviewed, and installed together rather than scattered across the bases and projects that use them.

Skills here fall into a few kinds, and the set will grow:

- **Knowledge Islands skills** - operate over the standard Knowledge Islands knowledge-base structure (see below). They carry reusable mode logic and resolve
  only a few store-level bindings from the host base. `knowledgeislands-kb` is the first of these.
- **Process skills** - encode a workflow or procedure that is not tied to any particular base (a review process, a release checklist, a research harness).
- **Scoped skills** - target a specific area: a subset of folders, a single project, or one recurring task.

A skill does not have to be wedded to Knowledge Islands. The repository layout, the install steps, and the linking conventions below apply to every kind
equally.

## What a skill is

A skill is a directory containing a `SKILL.md` with YAML frontmatter and a markdown body, per the Agent Skills open standard (originated by Anthropic for Claude
Code, consumed by Cowork and other agent platforms). Longer detail goes in `references/`, executables in `scripts/`, templates in `assets/` - all loaded on
demand (progressive disclosure). Keep `SKILL.md` under ~500 lines / ~5,000 tokens.

```text
<skill-name>/
├── SKILL.md            # required - frontmatter (name, description) + body
├── references/         # optional - long-form detail
├── scripts/            # optional - executable helpers
└── assets/             # optional - templates and resources
```

The directory name **is** the skill's `name`: lowercase, hyphenated, and matching the `name:` frontmatter field exactly. Agents discover a skill by its `name`,
so the two must stay in sync.

## Skills in this repository

Six skills, each a **governance skill**: it holds a house standard and ships the universal **AUDIT / CONFORM / REFRESH** modes (plus skill-specific ones),
backed by a tracked `references/sources.md`.

### [`knowledgeislands-kb`](knowledgeislands-kb/SKILL.md) — Knowledge Islands

Interacts with a Knowledge Islands knowledge base over the standard zone model: the note-ops **DIGEST / EXTRACT / QUERY / SAVE / UPDATE**, plus **AUDIT /
CONFORM / INIT** to check a base against the structure model, bring it into line, or scaffold a new one. Only store-level bindings come from the host base.
Ships a mechanical checker (`audit-kb.ts`): zone-layout conformance plus validate-down of its `[knowledgeislands-kb]` config table. Delegates the **`Streams`
zone** to `knowledgeislands-streams`.

### [`knowledgeislands-streams`](knowledgeislands-streams/SKILL.md) — Knowledge Islands

Owns the **`Streams` zone** — the base's working copy ("plan mode") — and the **Enactment Process** that governs it: the lifecycle modes **PROPOSE / ITERATE /
READY / ROLLOUT / REVIEW / SETTLE / REJECT**, plus **AUDIT / CONFORM** of a base's Streams structure (Focus lifecycle, the `Proposal` suffix, leaf/parent
layout, proposal frontmatter). `knowledgeislands-kb` delegates the zone here, so the heavier process loads only when working in `Streams`. Ships a mechanical
checker (`audit-streams.ts`).

### [`knowledgeislands-mcp`](knowledgeislands-mcp/SKILL.md) — Process

Audits, conforms, and scaffolds workspace MCP servers against the "workspace MCP" standard (layout, config injection, `<app>_<resource>_<action>` tool naming,
access-level gate, security invariants, Bun/Node, tooling) across the `mcp-*` repos. Ships a mechanical checker (`audit-mcp.ts`).

### [`knowledgeislands-skills`](knowledgeislands-skills/SKILL.md) — Process

Audits, writes, and conforms Agent Skills against a checkable rubric — a bundled linter (`skills:lint`) for the mechanical checks, the judgment ones applied by
reading, and a tracked source list it revisits.

### [`knowledgeislands-repo`](knowledgeislands-repo/SKILL.md) — Process

Audits, conforms, and onboards any **Knowledge Islands–compliant** git repo (one carrying a `.ki-config.toml`) against the repo standard — local files, GitHub
settings, and security. Owns the cross-cutting **`.ki-config.toml` contract**. Ships a mechanical auditor (`repo:audit`) that discovers repos from a local tree
or a whole org.

### [`knowledgeislands-authoring`](knowledgeislands-authoring/SKILL.md) — Process

The house authoring conventions the other skills build on — Markdown (wide tables → footnotes, link style) and TOML formatting style — and the single source of
truth a repo's or base's `CLAUDE.md` points to. Its mechanical half is `bun run lint:md` (Prettier + markdownlint), not a bundled script; it carries the
judgment half.

Where the set is going next is in [ROADMAP.md](ROADMAP.md).

### The governance-skill shape

All six share one layout, so a reader (or a new such skill) can move between them:

- **`<domain>-standard.md`** (or the contract / conventions reference it holds) — the normative, quotable reference: what good looks like, and why.
- **`audit-rubric.md`** — the line-by-line checkable criteria, each tagged **mechanical** (a checker enforces it) or **judgment** (a reader assesses it), each
  citing the standard section it verifies.
- **`references/sources.md`** — the tracked sources behind the standard, with `last reviewed` dates and a REFRESH changelog.
- **a mechanical checker** — `audit-mcp.ts`, `lint-skills.ts`, `audit-repo.ts`, `audit-kb.ts`, `audit-streams.ts` for mcp / skills / repo / kb / streams;
  `bun run lint:md` (Prettier + markdownlint) for authoring. The judgment half is always applied by reading.

…and the same modes: **AUDIT** (run the checker, then apply the judgment criteria), **CONFORM** (bring an existing artifact into line), and **REFRESH**
(re-anchor the standard to its sources on a stated cadence), plus skill-specific modes where they fit — **INIT** to scaffold a new artifact, and kb's note-ops.
The mode model is codified in `knowledgeislands-skills` (rubric **SHAPE-5**).

### Where the skills do not overlap

Each skill's `description` carries its own boundaries so the agent selects the right one, but the distinctions worth stating once:

- **`knowledgeislands-mcp` vs `knowledgeislands-skills`** - both "audit against a standard", which is the one pair that could be confused.
  `knowledgeislands-mcp` audits an MCP **server repo** (its `src/` layout, config injection, tool surface, security invariants, tooling);
  `knowledgeislands-skills` audits a **`SKILL.md`** (its frontmatter and body prose). Auditing the `SKILL.md` of an MCP-related skill is the latter's job;
  auditing the server's code is the former's. Each description names the other as the off-ramp, so neither claims the other's request.
- **`knowledgeislands-kb` vs `knowledgeislands-streams`** - both operate over a base, but at different scopes. `knowledgeislands-kb` owns the five-zone model,
  routing into the zones, and note CRUD; it knows `Streams/` is a zone and **delegates the zone's internals** — the Focus lifecycle, the proposal layout, and
  the Enactment Process — to `knowledgeislands-streams`, which loads only when working in `Streams`. Anything outside that zone is kb's.
- **`knowledgeislands-kb` vs a base-coupled extension** - where a base ships its own `<base>-kb` skill, that extension wins and delegates the shared modes back
  to `knowledgeislands-kb` by name; the standard skill steps aside rather than competing for the same triggers.
- **`knowledgeislands-repo` vs `knowledgeislands-mcp`** - the `mcp-*` repos are where the two overlap, but `knowledgeislands-repo`'s reach is wider: it governs
  **any** Knowledge Islands–compliant repo (anything carrying a `.ki-config.toml`), not just MCP ones. Where they do meet, they sit at different layers.
  `knowledgeislands-repo` governs the repo's configuration and Knowledge Islands compliance (the `.ki-config.toml` contract, GitHub-side settings, and the
  universal local files — README/LICENSE/.gitignore/.editorconfig); `knowledgeislands-mcp` governs the server's **code** (`src/` layout, config injection, tool
  surface). Configuration vs source.
- **`knowledgeislands-authoring` vs the rest** - it owns _how we write_: Markdown style and TOML _formatting_ style, the cross-cutting layer the others assume
  rather than restate. The lines around it - note _content_ and KB structure belong to `knowledgeislands-kb`; a repo's _configuration_ and the `.ki-config.toml`
  _contract_ to `knowledgeislands-repo`; a `SKILL.md`'s prose and frontmatter to `knowledgeislands-skills`. `knowledgeislands-authoring` names each of those as
  an off-ramp and each names it back for general style, so the boundary is reciprocal and documented on both sides for humans too.

### Principles across the set

Four invariants hold for every skill here, current and future — each tied to a named rubric criterion rather than just asserted, so a new skill inherits them by
being audited:

- **Every skill carries a refresh path — and a cadence.** A skill that tracks a moving target (an external spec, a community best-practice, a base's live
  structure) ships a REFRESH mode and a dated `references/sources.md`, and states how often it should run; one that hard-codes no volatile external fact may
  instead resolve it at runtime. The point is durability: a skill installed into a shared or cloud catalogue is long-lived and far from its author, and must not
  rot silently. Enforced as `knowledgeislands-skills` rubric **LONG-1** (a refresh path exists) and **LONG-2** (it has a cadence, ideally a scheduled run), and
  mirrored into the `knowledgeislands-mcp` audit checklist. The monthly `knowledgeislands-skills-refresh` routine realises it — running all five skills' REFRESH
  against their tracked sources and opening a PR for review rather than committing.
- **No silent collisions.** Where two skills could fire on the same request, each description names the other as the off-ramp, and new skills are audited
  against the existing set before they ship (rubric **COLL-1/COLL-2**; the linter's cross-skill pass flags shared triggers). The current boundaries are the
  subject of _Where the skills do not overlap_, just above.
- **Standard vs base-coupled extension.** Knowledge Islands skills stay base-agnostic and resolve bindings at runtime; anything base-specific lives in a
  `<base>-kb`-style extension that delegates the shared modes back by name — spelled out in _Standard skills and base-coupled extensions_, below.
- **One governance-mode model.** Every skill exposes the universal **AUDIT / CONFORM / REFRESH** modes plus skill-specific ones (**INIT** to scaffold,
  operational modes such as kb's note-ops), codified as rubric **SHAPE-5** so a new skill inherits the shape. The layout this produces is _The governance-skill
  shape_, above.

## Installing skills

Claude Code (and compatible agents) discover skills in two places:

- **User-global** - `~/.claude/skills/<name>/`, available in every session on this machine.
- **Per-project** - `<project>/.claude/skills/<name>/`, available only when working in that project (and shareable via the project's repo).

The recommended way to install from this repository is a **symlink**, so edits in the repo are live everywhere the skill is installed and a `git pull` updates
every consumer at once. The bundled sync script ([`scripts/sync-skills.ts`](scripts/sync-skills.ts)) wraps this safely; it treats every top-level directory
containing a `SKILL.md` as a skill. Install dependencies once with `bun install`.

### With the sync script (recommended)

```bash
bun run skills:status   # show each skill and whether it is linked in ~/.claude/skills
bun run skills:link     # symlink every skill into ~/.claude/skills (re-runnable)
bun run skills:unlink   # remove only the symlinks that point back into this repo
```

`skills:link` is idempotent: it refreshes existing links, skips a target where a _real_ file or directory is in the way (rather than clobbering it), and creates
`~/.claude/skills` if needed. Pass flags straight through (no `--` separator needed with `bun run`), or call the script directly:

```bash
bun scripts/sync-skills.ts link --dry-run                                # preview without touching anything
bun scripts/sync-skills.ts link --target /path/to/project/.claude/skills # install into one project instead
```

### Without the script (plain shell)

A single skill, user-global:

```bash
cd /Users/krisbrown/kis/knowledgeislands/arcadia-skills
ln -sfn "$PWD/knowledgeislands-kb" ~/.claude/skills/knowledgeislands-kb
```

`ln -sfn` forces replacement of an existing link and never dereferences into a directory, so re-running it updates the link in place instead of nesting a second
link inside it. The link name must match the skill directory name (and the `name:` frontmatter).

### Verify and remove

```bash
ls -l ~/.claude/skills          # symlinks show their -> target; confirm they resolve
rm ~/.claude/skills/<name>      # uninstall: removes the link only, never the repo
```

Removing a symlink only unlinks it - the skill source in this repository is untouched. Start a new session after adding or removing a skill so the agent
re-scans the skills directory.

## Using a skill

Once a skill is installed, there is nothing to import or configure - the agent loads it on demand. There are two ways it fires:

- **By trigger (automatic)** - just describe the task in plain language. The agent matches your request against each skill's `description` (the part that says
  _when_ to use it) and loads the skill itself. "audit the m365 MCP against our standard" or "save this to my notes" will pull in the right skill without you
  naming it.
- **By slash command (explicit)** - type `/<skill-name>` to invoke it directly, optionally followed by arguments:
  `/knowledgeislands-mcp audit ~/kis/knowledgeislands/mcp-gmail`. Use this when you want to be certain which skill runs, or to pass a specific mode.

A skill that takes modes or arguments advertises them in its `argument-hint` frontmatter, shown as you type the slash command. For example
`knowledgeislands-mcp` lists `audit <repo> | conform <repo> | init <repo> | refresh` - the words before each `<...>` are the modes, and the rest is what to
pass. The arguments are a hint, not a parser: anything you type after the name reaches the skill as free text, so a plain-language phrasing of the same request
works equally well.

This is why per-skill usage is **not** repeated in each `SKILL.md` body: the `description` documents when a skill fires and the `argument-hint` documents its
modes, both machine-read at selection time. How to invoke _any_ skill - the slash-vs-trigger mechanics above - is a property of Claude Code and lives here,
once.

## Linking inside skills

Skills use **standard relative markdown links**, not Obsidian wikilinks, so they stay valid when relocated, symlinked, or shared. Link a co-located file by
relative path (`[ref](<references/Detail.md>)`); use the CommonMark angle-bracket form for paths containing spaces. Refer to _another_ skill by its `name` (e.g.
"the `knowledgeislands-kb` skill"), never by a file path - the other skill loads into the session under that name and its location on disk is not stable.

## The Knowledge Islands structure

The Knowledge Islands skills assume a fixed knowledge-base shape, so a base does not redefine it - it supplies only a few store-level bindings. A Knowledge
Islands base is one markdown store with a fixed set of five zones - `Calendar/`, `Pillars/`, `Resources/`, `Streams/`, and `Admin/` - flanked by an inbound
(`+/`) and an outbound (`-/`) staging area (staging, not zones: material lands or leaves through them but is not canonical there). Each whole base is an
"island"; within it, a **Pillar** is a major strand of subject matter (a case, a client, a domain, a theme). The full zone model, the note-content wikilink
convention, and routing rules live in [`knowledgeislands-kb`](knowledgeislands-kb/SKILL.md); the **`Streams` zone** — its internal structure and the Enactment
Process that governs work in motion — is owned by [`knowledgeislands-streams`](knowledgeislands-streams/SKILL.md), which `knowledgeislands-kb` delegates to.

### Standard skills and base-coupled extensions

A **standard** Knowledge Islands skill carries reusable mode logic over the structure and resolves the few base-level bindings (store aliases, scope usage,
writing standards) at runtime from the host base's own `CLAUDE.md` and memory index. It hard-codes no single base.

A **base-coupled extension** lives in its own base (e.g. a `<base>-kb` skill), supplies only the base-specific pre-flight and bindings, and delegates the shared
modes to the standard skill **by name** - both skills load into the session, so the extension refers to the standard skill by its `name`, not by a file path.

## Development

This repository follows the Knowledge Islands house toolchain: [Bun](https://bun.sh) as the package manager, [Biome](https://biomejs.dev) for the TypeScript
helper script, and Prettier + markdownlint-cli2 for the markdown that makes up the skills. A husky pre-commit hook runs `lint-staged` over changed files.

```bash
bun install        # install dev dependencies and wire the git hook
bun run lint:check # Biome lint/format check (TypeScript + JSON)
bun run lint:fix   # Biome, auto-fixing
bun run lint:md    # Prettier + markdownlint over all markdown
bun run lint:types # tsc --noEmit
bun run lint:package # syncpack: keep package.json sorted
bun run skills:lint  # audit every skill's mechanical criteria (knowledgeislands-skills rubric)
```

`skills:lint` runs the mechanical half of the [`knowledgeislands-skills`](knowledgeislands-skills/SKILL.md) rubric over every skill (frontmatter, naming, length
caps, link resolution); the judgment half is applied by that skill when you ask it to audit one.

## Roadmap

The forward view — what's next and why — lives in [ROADMAP.md](ROADMAP.md). It is nearly clear: the standard, the mechanical checkers, and the advisory eval
harness are all in place, and keeping them applied is a continuous practice (above), not roadmap work. One forward _(candidate)_ remains — generalising the
shared `.ki-config.toml` into a per-repo/per-base override layer any skill can read, now that `knowledgeislands-repo` and `knowledgeislands-kb` both consume it.
