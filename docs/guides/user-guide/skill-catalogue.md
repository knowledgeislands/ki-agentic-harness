# The skill catalogue

Every skill in the harness, grouped by cluster in the order of [the six clusters](skills.md#the-six-clusters). Each entry says what the skill governs and when to reach for it.

## Keystone

### `ki-bootstrap`

Bootstraps a repository into governance from its `.ki-config.toml`. It vendors the mechanical checks that let a repository govern itself with no skills installed, and it makes the repository's declared skills available to the active runtime. **Composes on** `ki-repo`, which owns the `.ki-config.toml` contract and coverage cascade it reads. The user-facing starting point is [Install and get started](getting-started.md); live linking from a harness checkout is contributor-only machinery.

### `ki-repo`

Audits, conforms, and onboards any **Knowledge Islands–compliant** git repo (one carrying a `.ki-config.toml`) against the repo standard — local files, GitHub settings, and security. Owns the cross-cutting **`.ki-config.toml` contract** and discovers repos from a local tree or a whole org.

## Foundations

### `ki-authoring`

The house authoring conventions the other skills build on — Markdown (wide tables → footnotes, link style) and TOML formatting style — and the single source of truth a repo's or base's `CLAUDE.md` points to.

### `ki-engineering`

The shared **engineering toolchain** every TS/Bun repo builds on — aggregate/scoped governance entrypoints, direct code-tool execution, `tsconfig`/`biome`, the Bun-install / Node-run split, a runner-neutral bare `test` entrypoint, the config-gated Vitest profile with 100% coverage, and the build/cli-chmod rule — plus the **enforcement framework** (the mode shape, mechanical-checker contract, rubric tagging, `sources.md` cadence, `.ki-config.toml` contract) the other governance skills conform to. The toolchain twin of `ki-authoring`; artifact skills (e.g. `ki-mcp`) **compose** their delta on top of its common layer.

## Repo-structure

### `ki-harness`

Audits, conforms, and scaffolds a **harness repository** — the container that bundles the other parts: the five-part `skills/` / `agents/` / `mcp/` / `evals/` / `hooks/` layout, the root `CLAUDE.md` / `ROADMAP.md` / `package.json` script families / `.ki-config.toml` table, and the delivery conventions that make its components available. Governs the **container, not the contents**: the bridge into the sibling skills rather than a replacement — it **composes** their checkers (`ki-skills`, `ki-agents`, `ki-project-roadmap`, `ki-mcp`, `ki-engineering`, `ki-repo`) and adds only the bundle-structure delta. Empty shelves are valid — a shelf is not a gap.

### `ki-kb`

Interacts with a Knowledge Islands knowledge base over the standard zone model: the note-ops **DIGEST / EXTRACT / QUERY / SAVE / UPDATE**, plus **AUDIT / CONFORM / INIT** to check a base against the structure model, bring it into line, or scaffold a new one. Only store-level bindings come from the host base. Delegates the **`Streams` zone** to `ki-kb-streams`.

### `ki-website`

Audits, conforms, and scaffolds static websites against the house build standard — **Eleventy 3 + Nunjucks + Markdown, TypeScript run natively on Bun, Tailwind 4 config-less with design tokens** — that compile to a portable `dist/`. Owns the **site-build delta** and **composes on** `ki-engineering` (toolchain) and `ki-authoring` (Markdown), handing the built `dist/` to `ki-website-cloudflare`.

### `ki-mcp`

Audits, conforms, and scaffolds workspace MCP servers against the "workspace MCP" standard (layout, config injection, `<app>_<resource>_<action>` tool naming, access-level gate, security invariants, Bun/Node, tooling) across the `mcp-*` repos.

### `ki-plugins`

Audits, conforms, and scaffolds a Knowledge Islands **plugin-marketplace** repo — the generated Claude plugin marketplace that projects the harness's skills and agents onto the Cowork surface (`knowledgeislands/ki-plugins`, `ADR-KI-HARNESS-002`). The fifth repo-structure skill; it governs the on-disk projection (the `marketplace.json` / `plugin.json` manifests, the verbatim `skills/` copy and flattened `agents/`, the MCP-deferred rule, the generated-not-hand-edited invariant). Generation and cross-surface enablement stay with `ki-binding`.

### `ki-tools`

Audits, conforms, and scaffolds a **standalone command-line tool** repo (`tools-*`) — one CLI per repo, distributed via a `curl | bash` installer and a companion Homebrew tap formula (`tools-mgit` is the reference). The sixth repo-structure skill; it governs the container shape language-agnostically (`bin/<tool>` executable, `--version` + a version marker, `install.sh` contract, `tests/` + CI present, keep-a-changelog + semver, `vX.Y.Z` tags → a GitHub release), with lint/test as capability conditionals (shell → shellcheck + bats; a `package.json` defers to `ki-engineering`). Rides `ki-repo`, not `ki-engineering`.

### `ki-homebrew-tap`

Audits, conforms, and scaffolds the **Homebrew tap** repo (`homebrew-tap`) that packages the `ki-tools` CLIs, by **wrapping Homebrew's external standard** — `Formula/*.rb` shape (`class`/`desc`/`url`/`sha256`/`license`/`install`/`test do`), versioned-tarball sourcing, the README formulae table. The seventh repo-structure skill; it delegates to `brew audit --strict` / `brew style`, and REFRESH tracks the Homebrew Formula Cookbook. The repo name is fixed by Homebrew; the skill governs shape, not name.

### `ki-dotfiles-chezmoi`

Codifies, audits, and conforms the **chezmoi dotfiles-management standard** — naming-prefix semantics (`dot_`/`executable_`/`private_`/`.tmpl`), edit-source-not-target discipline, shell-loader layering, the bin/ dispatcher pattern, app-mutated-config handling (surgical patch vs full-template reverse-merge), single-source-to-multi-target config templating, CLAUDE.md/agent-instruction layering, and chezmoi-specific repo-shape and OS gotchas. The eighth repo-structure skill; it governs any git repo that is a chezmoi source-state directory (detected via `.chezmoiroot`/`.chezmoi.toml.tmpl`/`.chezmoidata`/root-level `dot_*` files), additive to `ki-repo`'s generic file-presence checks rather than restating them. Derived from a single case-study repo (n=1) — its judgment criteria stay provisional until more repos are audited against it. **Composes on** `ki-authoring`.

## General governance

### `ki-skills`

Audits, writes, and conforms Agent Skills against a checkable rubric — mechanical checks plus judgment ones applied by reading, and a tracked source list it revisits.

### `ki-agents`

Audits, writes, and conforms **Claude Code subagent definitions** against a checkable rubric — mechanical checks (frontmatter, `name` uniqueness across the set, link resolution) plus the judgment ones applied by reading (the `description` as delegation signal, the system-prompt role/lane, own-vs-defer, least-privilege tools). The **agents twin of `ki-skills`**: that one governs a `SKILL.md`, this one a subagent definition. Governs the agents that land under `agents/`.

### `ki-decision-records`

Governs **Decision Records** in any Knowledge Islands repo, code or KB — the typed ID prefixes (`GDR` / `ADR` / `KDR` / …), the five-section format, the living-record principle (edited in place, no status lifecycle or supersession), and placement (`docs/decisions/` in a code repo, `Admin/Governance/Decisions/` in a KB). Defers to `ki-kb` for the island structure and the KI-wide frontmatter standard, and to `ki-kb-streams` for the Enactment Process by which a change is ratified.

### `ki-feature-definitions`

Governs **Feature Definitions** — the behaviour-level "what" of a system, the third leg of the `docs/` triad (decisions = why, features = what, guides = how). Definitions live in `docs/features/`, flat one-file-per-area, with an `index.md` defining the ID scheme and an areas table. Each requirement is a `### <PREFIX>-NNN — title` heading carrying one RFC-2119 (`MUST` / `SHOULD` / `MAY`) statement and a `_Verify:_` test hook; IDs are append-only, and an unnumbered `## Gaps` section holds the backlog. Off-ramps the governing decisions a requirement cites to `ki-decision-records`.

### `ki-project-roadmap`

Governs **forward work in non-KB repositories** through two automatically detected profiles. A simple repository keeps its complete open view in root `ROADMAP.md`. A thematic repository keeps canonical work in `docs/roadmap/<theme>/ROADMAP.md`, plans for Blocking/Next items beside it under `plans/`, a global plan index and dependency graph in `docs/roadmap/README.md`, and an exact generated root portfolio. Qualified `<theme>/<item-slug>` locators bind plans to one authoritative item home. The process skill `ki-plan` drives individual plan lifecycles. Knowledge Bases use `ki-kb-streams` instead; project-roadmap artifacts do not apply there.

### `ki-handoffs`

Governs the **handoff doctrine** — plan work once at the top reasoning tier, then write it as an implementation-ready spec a cheaper tier or a cold agent can execute without re-reasoning. Owns the reasoning-layer split, the handoff-spec quality bar (decisions-locked-vs-escalate, a per-unit recommended tier, a cold-model readiness test), and the opt-in marker contract (`handoff: true`). Rides on a host artifact — a `ki-project-roadmap` thematic plan or a `ki-kb-streams` proposal Checklist — and off-ramps tier cost/selection to `ki-tokenomics`.

## Process skills

Orthogonal to the six clusters (`ADR-KI-HARNESS-SKILLS-006`): each drives an action or lifecycle rather than holding a house standard, so neither carries the governance four-file shape or the universal modes.

### `ki-recap`

Drives a live-session recap: **summarise** what happened (changes, decisions, files touched), **surface what is outstanding** (unfinished threads, deferred fixes — a ROADMAP item added this session is "what happened", not outstanding), and **harvest the learnings**, routing each to its proper home (a `CLAUDE.md` learned-pattern entry via `headroom learn`, a skill fix or rubric criterion, a new agent, a hook, memory, or a `ki-plan`/ROADMAP item), confirming before writing anywhere durable. An optional **compress** leg writes a carry-forward digest — true in-context compression is the native / PreCompact-hook path, not something a skill can do. Installable globally, cross-repo, alongside `ki-bootstrap` — and like `ki-bootstrap`, never declared via a `.ki-config.toml` table.

### `ki-plan`

Drives the **plan lifecycle** for a non-KB repository — `done` / `execute` / `new` / `promote` / `status`. Reads the format and methodology from `ki-project-roadmap` and carries them out in the thematic profile: qualified roadmap locators, theme-local id allocation from `001`, qualified `<theme>/<NNN>` plan references, the `blocks`/`blocked-by` dependency graph, theme-aware status, and transactional roadmap/projection sync on `done`. `/ki-plan promote` turns the current authenticated Claude Code Plan Mode scratch plan into the same independent governed artifact; this discovery bridge is Claude-Code-only, while `docs/roadmap/<theme>/plans/` and the other file-oriented lifecycle procedures are runtime-neutral. Simple repositories expand to the thematic profile before creating a plan. Knowledge Bases route to a `ki-kb-streams` proposal Checklist. Installable globally alongside `ki-bootstrap` — and like `ki-bootstrap`, never declared via a `.ki-config.toml` table.

### `ki-delegate`

Turns a task list or an approved `ki-plan` into a **tiered, round-sequenced execution** across sub-agents, in four legs: **classify** each task as judgment / mechanical / research, **assign** it to an agent type and a per-spawn model tier (cheapest that suffices; judgment to a standard-encoding specialist or a stronger model), **sequence** into rounds (blockers and citation-targets first, then a parallel fan-out of the independents, with write-contention named), and **gate** every result (review each cheap-tier diff before commit; adversarially safety-review any auto-executing hook or script). Operationalises `ADR-KI-HARNESS-003` (mechanical-first) and draws model-tier cost/selection policy from `ki-tokenomics` without restating it. The method is written runtime-neutrally with the Claude-Code spawn mechanics tagged `CC`, so the skill models the portability discipline it delivers. Installable globally alongside `ki-bootstrap` — and like `ki-bootstrap`, never declared via a `.ki-config.toml` table.

## Implied families

### `ki-kb-streams`

Owns the **`Streams` zone** — the base's working copy ("plan mode") — and the **Enactment Process** that governs it: the lifecycle modes **PROPOSE / ITERATE / READY / ROLLOUT / REVIEW / SETTLE / REJECT**, plus **AUDIT / CONFORM** of a base's Streams structure (Focus lifecycle, the `Proposal` suffix, leaf/parent layout, proposal frontmatter). `ki-kb` delegates the zone here, so the heavier process loads only when working in `Streams`.

### `ki-kb-activities`

Governs **Activity notes** — the operational record of work adopted in a base, kept under `Admin/Operations/Activities/` (naming, frontmatter, realization type, and the index). Checks that an activity declared as a slash command has a backing skill, and that scheduled ones are flagged for the external scheduler. Composes on `ki-kb` for the zone structure.

### `ki-kb-live-artifacts`

Governs **Live Artifacts** — operational documents that track island state (dashboards, boards, queues, trackers) as a `.md` source paired with a rendered `.html`, kept under `Admin/Operations/Live Artifacts/` with an index, plus the sync rules between the two halves. Composes on `ki-kb` for the zone structure.

### `ki-website-cloudflare`

Audits, conforms, and scaffolds the house convention for serving a built site on **Cloudflare Workers + Static Assets** (not Pages): one `wrangler.jsonc` pointing `assets.directory` at the site's `dist/`, custom-domain routes, observability, and the `ki:site:deploy` script family. Owns the **hosting delta** for the site Worker; the `dist/` is the seam from `ki-website`. Companion Workers (bots, ingress) route to the generic `cloudflare` / `wrangler` skills.

## Environment

### `ki-binding`

Governs the **cross-surface binding** — enabling the KI MCP servers, skills, and agents consistently across the surfaces that run them (Claude Code, Desktop, mcporter, Cowork; claude.ai by convention) from the single renderer-neutral `mcp-servers.yaml` source (canonically `~/.config/ki/mcp-servers.yaml`), whose per-server `clients:` field is the targeting lever. Reads the source directly — requiring no particular renderer installed — verifies each surface agrees with it, and composes `ki-bootstrap` for the project-local skill half. The write path for the file-editable surfaces is a renderer (the chezmoi render path lives in `ki-binding-chezmoi`), never a hand-written per-surface config, which drifts; Cowork is gated on an external-edit verification before its `enabledPlugins` are wired. Implements the `ki-mcp` design record on cross-surface enablement.

### `ki-binding-chezmoi`

The **chezmoi render path** for the cross-surface binding — a composition skill (`implies:` `ki-binding` + `ki-dotfiles-chezmoi`) that supplies what the renderer-neutral `ki-binding` deliberately omits: rendering the canonical `mcp-servers.yaml` source through chezmoi templates + `chezmoi apply` so the file-editable surfaces are generated from the single source. Its AUDIT runs the `ki-dotfiles-chezmoi` and `ki-binding` checkers in sequence, then adds the render-wiring delta. Installed only by chezmoi users; a non-chezmoi setup uses `ki-binding` alone. The composition-not-fork shape follows `ADR-KI-HARNESS-SKILLS-004`.

### `ki-housekeeping`

Governs the hygiene of accumulated **Claude state** across all its areas — memory, plus sessions, artifacts, and storage that pile up across Claude Desktop / Cowork, Claude Code (`~/.claude/`), and VSCode. It pairs with the `mcp-claude-housekeeping` server on one principle: the skill is the standard and the judgment; the server is the tools (`ADR-KI-HARNESS-SKILLS-007`). **Memory** it governs fully in-skill — the per-project `memory/*.md` files and `MEMORY.md` index Headroom writes at `~/.claude/projects/<slug>/memory/`; every other area is audited and cleaned through the server's codified audits and access-gated tools. Distinct from `ki-kb`'s own memory cascade (a KB's own root `Admin/MEMORY.md`); off-ramps token-cost measurement to `ki-tokenomics`.

### `ki-tokenomics`

Audits, conforms, and tunes the **tokenomics** of a Claude Code environment — the standing context surface paid on every turn, as **composed** across the user-wide `~/.claude` and project-local layers and any base, plus the runtime levers (caching, model tier, compaction, sub-agent fan-out, tool-result verbosity). Attributes cost per layer, holds it to overridable budgets (a `[ki-tokenomics]` table, read validate-down), and checks context-compression tooling — **Headroom**, an extensible registry — is set up optimally. **Composes** on the artifact skills whose surfaces it measures (`ki-mcp` for the tool surface, `ki-skills` for the description surface, `ki-kb` for a base's loaded surface) and defers the volatile reference numbers to the `claude-api` skill.

Where the set is going next is in the roadmap.
