# skills

Knowledge Islands **Agent Skills** live here, one directory per skill. This is the most-built-out part of the harness today: governance skills hold standards and checkers, while process skills drive bounded workflows and lifecycles.

## Convention

Each skill is a directory containing a `SKILL.md` (YAML frontmatter — `name` + `description` required — followed by a markdown body), per the [Agent Skills open standard](https://agentskills.io/specification). Longer detail goes in `references/`, executables in `scripts/`, templates in `assets/` — all loaded on demand. The **directory name is the skill's `name`**: lowercase, hyphenated, matching the `name:` frontmatter exactly, since agents discover a skill by `name`, not path.

Skill quality conforms to the **`ki-skills`** standard (a sibling here) — run its AUDIT (`ki repo audit --skill ki-skills`) before shipping. The container these skills sit in — this five-part `skills/` / `subagents/` / `mcp/` / `evals/` / `hooks/` harness — conforms to **`ki-repo-harness`**.

## Adding a skill

1. Scaffold `<name>/SKILL.md` (run `ki-skills` Mode EDUCATE), adding `references/` / `scripts/` / `assets/` only as needed.
2. Write to the rubric, not from memory; self-audit with `ki repo audit --skill ki-skills`.
3. Run `ki repo conform --skill ki-repo-harness` to refresh the generated catalogue below, then check the authored [skills-by-outcome guide](../docs/guides/skills-by-outcome.md) only when the new capability changes a reader journey.

Use the [skills-by-outcome guide](../docs/guides/skills-by-outcome.md) when you know the result you want but not the skill name. Use the generated catalogue below for complete membership, descriptions, argument hints, runtime bindings, and formal dependencies. Skills are installed elsewhere through managed KI activation.

<!-- ki-repo-harness:capability-catalogue:start -->
## Generated capability catalogue

This source harness publishes 60 skills: 50 governance skills and 10 process skills. The entries below are generated from canonical `SKILL.md` frontmatter; edit the source skill, then run `ki repo conform --skill ki-repo-harness` to republish this section.

### Agentic Systems

#### `ki-subagents`

Define or assess runtime-neutral KI subagent roles: identity, delegation purpose, instructions, lane, grounding, hand-offs, orchestration, and evidence. Use before a native projection; use `ki-subagents-claude` or `ki-subagents-codex` for runtime files.

- **Kind:** Governance
- **Arguments:** `audit | conform | educate | refresh | help`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-subagents-claude`

Audit or write Claude Code Markdown/YAML projections of approved portable KI subagent roles. Use for Claude-native agent source shape and fields; use `ki-subagents` for runtime-neutral role design and `ki-subagents-codex` for Codex TOML.

- **Kind:** Governance
- **Arguments:** `audit <agent-or-dir> | conform <agent> | help | educate <description> | refresh`
- **Dependencies:** `ki-subagents`
- **Runtime:** Runtime-bound: `claude-code`

#### `ki-subagents-codex`

Audit or write Codex TOML projections of approved portable KI subagent roles. Use for Codex-native agent source shape and fields; use `ki-subagents` for runtime-neutral role design and `ki-subagents-claude` for Claude Markdown/YAML.

- **Kind:** Governance
- **Arguments:** `audit | conform | educate | refresh | help`
- **Dependencies:** `ki-subagents`
- **Runtime:** Runtime-bound: `chatgpt-codex`

### Change Management

#### `ki-accept`

Close a reviewed local work record as done, record an approved terminal Triage disposition, or prune explicitly selected eligible done records. Use only with human approval; use `ki-implement` for delivery, `ki-plan` for readiness, and `ki-next` for selection or adoption.

- **Kind:** Process
- **Arguments:** `accept <work> | prune <work-record-or-glob>... | help`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-batch`

Prepare and run one bounded authority envelope over an exact set of Ready work records in one repository. Use for an approved autonomous roadmap window or synergistic independent set; individual planning, delivery, and closure remain governed by `ki-plan`, `ki-implement`, and `ki-accept`.

- **Kind:** Process
- **Arguments:** `batch <work>... | batch outcome <outcome> | run <batch-authorisation> | help`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-implement`

Deliver one approved Ready local work record from immutable baseline through verification and Awaiting review. Use to implement planned work; it never selects, replans, self-accepts, prunes, pushes, releases, or expands authority.

- **Kind:** Process
- **Arguments:** `implement <work-item> | help`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-next`

Capture substantive prospective work into unadopted Triage, or select, adopt, promote, and defer work in the shared queue. Use when new work emerges or deciding what comes next; use `ki-plan` for readiness and `ki-trades` for trade transport.

- **Kind:** Process
- **Arguments:** `next [--review] | defer <item> <horizon> | help`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-plan`

Shape selected Now or Next draft work in the local roadmap or KB Streams adapter until it is Ready. Use to plan or prepare implementation; it does not capture, select, implement, close, or prune work.

- **Kind:** Process
- **Arguments:** `plan <work>... | help`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-pulse`

Capture a submitted link or scan bounded public sources, then triage current signals into read or learn, watch, act, or discard. Use for link intake or what changed; `ki-agentic-radar` and `ki-model-radar` own durable landscape posture, while `ki-next` owns follow-on work.

- **Kind:** Process
- **Arguments:** `capture <url-or-source> [reason] | help | scan <interest-or-query> [sources] | triage [current-signals]`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-recap`

Recap the live session by summarising changes, decisions, touched files, unfinished work, and durable learning routes. Use for a session recap or outstanding-work handoff; use `ki-next` to select backlog work and housekeeping skills for historical session acquisition.

- **Kind:** Process
- **Arguments:** `recap [--runtime detect|claude|codex] [--transcript <session-file>] | help`
- **Dependencies:** `ki-authoring`
- **Runtime:** Portable

#### `ki-work`

Select and audit a repository's KI forward-work adapter and shared lifecycle vocabulary. Use when choosing between local roadmap, KB Streams, GitHub Issues, or Linear; the selected adapter owns record shape and process skills own lifecycle actions.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | educate <repo> | help | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-work-github-issues`

Define GitHub Issues configuration, lifecycle mapping, hierarchy, dependencies, review, closure, and remote-write safety as a KI work adapter. Use when GitHub Issues is selected; remote execution is unavailable, while local files use `ki-work-roadmap` and Linear uses `ki-work-linear`.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | educate <repo> | help | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-work-housekeeping`

Govern recurring repository-housekeeping templates, cadence or commit-volume eligibility, last-run evidence, and due-run spawning through `ki-next`. Use to define or audit recurring maintenance; runtime state cleanup belongs to the relevant `ki-housekeeping-*` skill.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | educate <repo> | help | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-work-linear`

Define Linear configuration, lifecycle mapping, hierarchy, dependencies, review, closure, and remote-write safety as a KI work adapter. Use when Linear is selected; remote execution is unavailable, while local files use `ki-work-roadmap` and GitHub Issues uses `ki-work-github-issues`.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | educate <repo> | help | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-work-roadmap`

Govern flat local work items, roadmap horizons, lifecycle detail, dependencies, root orientation, and done-before-prune commit boundaries. Use to audit or shape roadmap records; `ki-next`, `ki-plan`, `ki-implement`, and `ki-accept` apply the lifecycle, while Decision Records own durable rationale.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | help | educate <repo> | refresh`
- **Dependencies:** None
- **Runtime:** Portable

### Design

#### `ki-design-inspiration`

Find website design inspiration in curated galleries and turn selected examples into practical directions for navigation, sections, calls to action, grids, motion, and other UI patterns. Use for visual references and adaptation ideas; website repository structure belongs to `ki-repo-website`.

- **Kind:** Process
- **Arguments:** `help | inspire <website-or-component> | refresh`
- **Dependencies:** None
- **Runtime:** Portable

### Environment

#### `ki-binding`

Govern the portable KI MCP inventory in canonical XDG `mcp-servers.yaml`, including schema, client targeting, and vendor-neutral mcporter drift. Use for shared MCP source or targeting; runtime surfaces belong to `ki-binding-claude` and `ki-binding-codex`, and chezmoi rendering to `ki-binding-chezmoi`.

- **Kind:** Governance
- **Arguments:** `audit [project] | conform [project] | help | educate [project] | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-binding-chezmoi`

Audit or conform the chezmoi rendering path from canonical KI `mcp-servers.yaml` through a renderer partial and `chezmoi apply`. Use for that portable-source-to-dotfiles pipeline; `ki-binding` owns the source contract and `ki-repo-dotfiles-chezmoi` owns general chezmoi structure.

- **Kind:** Governance
- **Arguments:** `audit <target> | conform <target> | help | educate <target> | refresh`
- **Dependencies:** `ki-binding`, `ki-repo-dotfiles-chezmoi`
- **Runtime:** Portable

#### `ki-binding-claude`

Audit or safely conform Claude-native MCP configuration across Claude Code, Desktop, web conventions, and the KI Cowork plugin projection. Use when Claude MCP surfaces drift or Cowork needs rebuilding; `ki-binding` owns portable source and `ki-binding-codex` owns Codex.

- **Kind:** Governance
- **Arguments:** `audit [project] | conform [project] | help | educate [project] | refresh`
- **Dependencies:** `ki-binding`
- **Runtime:** Runtime-bound: `claude-code`

#### `ki-binding-codex`

Audit or safely render KI-targeted MCP servers into Codex native `[mcp_servers]` without taking over unrelated configuration. Use for Codex MCP drift or rendering; `ki-binding` owns portable source and `ki-binding-claude` owns Claude surfaces.

- **Kind:** Governance
- **Arguments:** `audit [project] | conform [project] | help | educate [project] | refresh`
- **Dependencies:** `ki-binding`
- **Runtime:** Runtime-bound: `chatgpt-codex`

#### `ki-housekeeping-chatgpt`

Acquire and audit installed ChatGPT session material through opaque, read-only local-store evidence. Use to import ChatGPT sessions for one repository, with faithful reads, checkpoints, staging, and later harvest; acquisition never authorises source-session deletion.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | educate <repo> | help | refresh`
- **Dependencies:** None
- **Runtime:** Runtime-bound: `chatgpt-codex`

#### `ki-housekeeping-claude`

Acquire, audit, and safely clean accumulated Claude Desktop, Cowork, Claude Code, and VSCode chat state. Use for Claude session import, memory or storage hygiene, plugins, caches, and backups; KB structure belongs to `ki-repo-kb` and context budgets to `ki-tokenomics`.

- **Kind:** Governance
- **Arguments:** `audit | conform | help | educate | refresh`
- **Dependencies:** None
- **Runtime:** Runtime-bound: `claude-code`

#### `ki-housekeeping-codex`

Acquire, audit, and later clean repository-scoped Codex sessions for one physical repository. Use for Codex session import, thread review, or old-thread cleanup with explicit retention; portable recurring repository maintenance belongs to `ki-work-housekeeping`.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <artifact> <thread-id>... | educate <repo> | help | refresh`
- **Dependencies:** None
- **Runtime:** Runtime-bound: `chatgpt-codex`

#### `ki-housekeeping-granola`

Acquire and reconcile Granola meetings through read-only MCP evidence, including complete date windows, folder routing, faithful reads, checkpoints, and amendment detection. Use for Granola meeting import or audit; CLI staging belongs to tools-ki and retirement requires separate human approval.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | educate <repo> | help | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-tokenomics`

Govern portable agent-context costs: standing-surface attribution, budget guide-rails, model-purpose taxonomy, and `[skills.ki-tokenomics]` configuration. Use for runtime-neutral context or model-purpose policy; runtime evidence belongs to `ki-tokenomics-claude` or `ki-tokenomics-codex`, and description quality to `ki-skills`.

- **Kind:** Governance
- **Arguments:** `audit | conform | help | educate | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-tokenomics-claude`

Audit direct non-secret Claude Code filesystem evidence in one repository: instructions, imports, rules, settings, and MCP declarations. Use for Claude runtime evidence supporting portable tokenomics; effective session state remains unavailable, portable budgets belong to `ki-tokenomics`, and Codex evidence to `ki-tokenomics-codex`.

- **Kind:** Governance
- **Arguments:** `audit | conform | educate | refresh | help`
- **Dependencies:** `ki-tokenomics`
- **Runtime:** Runtime-bound: `claude-code`

#### `ki-tokenomics-codex`

Audit direct non-secret Codex filesystem evidence in one repository: trusted configuration, AGENTS.md, skills, and custom-agent sources. Use for Codex runtime evidence supporting portable tokenomics; effective session state remains unavailable, portable budgets belong to `ki-tokenomics`, and Claude evidence to `ki-tokenomics-claude`.

- **Kind:** Governance
- **Arguments:** `audit | conform | educate | refresh | help`
- **Dependencies:** `ki-tokenomics`
- **Runtime:** Runtime-bound: `chatgpt-codex`

### Governance

#### `ki-agentic-radar`

Maintain an evidence-backed radar for agentic protocols, interfaces, organisations, architectures, research claims, and vendor terms. Use to compare maturity, interoperability, stance, or movement; `ki-model-radar` owns models and routes, `ki-pulse` discovers current signals, and `ki-next` owns follow-on work.

- **Kind:** Governance
- **Arguments:** `audit | conform | educate | help | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-agora`

Govern reciprocal Agora membership between KI repositories: a home declares purpose, canonical members, and roles, while each member independently consents. Use to define, audit, or conform Agora declarations; the `ki` CLI owns local resolution and environment tooling owns editor or client projections.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | educate <repo> | help | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-authoring`

Govern KI Markdown, TOML, README composition, and durable knowledge placement. Use to format or audit authored documents, shape a README, or decide where learning belongs; use `ki-skills` for SKILL.md quality, `ki-repo` for repository contracts, and `ki-engineering` for code toolchains.

- **Kind:** Governance
- **Arguments:** `audit <path> | conform <path> | educate <target> | help | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-checkpoint`

Create, update, resume, audit, or remove a concise repository-owned checkpoint for one human-named active thread. Use for reconstruction without a transcript or vendor session; Git owns history, while decisions, roadmap state, durable knowledge, recaps, and runtime continuity stay with their owners.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | educate <repo> | help | refresh | remove <thread> | resume <thread> | update <thread>`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-decision-records`

Create, audit, and maintain typed KI Decision Records for durable rationale and authority. Use to record or review a governance, architecture, knowledge, strategy, product, data, people, legal, or policy decision; use `ki-specs` for accepted behaviour, `ki-guides` for procedures, and `ki-work-roadmap` for future work.

- **Kind:** Governance
- **Arguments:** `audit [dir] | conform [dir] | help | educate [dir] | new <scope> "<title>" | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-delegation`

Govern durable delegation packets for approved high-risk agent work, including locked decisions, authority, isolation, escalation, verification, and return boundaries. Use when a cross-agent brief must survive a runtime handoff; active process skills own worker selection and execution, while `ki-trades` owns cross-repository transfer.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | educate <work-item> | help | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-engineering`

Audit or conform the shared KI TypeScript/Bun engineering standard: comprehension-first modularity, reuse, boundary testing, package scripts, tsconfig, Biome, and toolchain consistency. Use for code or toolchain quality; `ki-repo` owns repository configuration, `ki-authoring` document style, and `ki-repo-mcp` MCP specifics.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | help | educate <repo> | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-git`

Govern KI Git commits and safe shared-working-tree practice: Conventional Commit messages, touched-path tracking, branch or worktree selection, explicit staging, and stale-lock semantics. Use when preparing a commit or coordinating concurrent human or agent edits; `ki-repo` owns GitHub settings and environment skills own hook registration.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | help | educate <repo> | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-guides`

Create, audit, and maintain repository-local guides for the practical how of using, operating, contributing to, or maintaining a system. Use for procedures and contributor guidance; `ki-decision-records` owns why, `ki-specs` owns accepted behaviour, `ki-work-roadmap` owns future work, and `ki-authoring` owns style.

- **Kind:** Governance
- **Arguments:** `audit [dir] | conform [dir] | help | educate [dir] | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-model-radar`

Maintain an evidence-backed radar for models and model-agent routes. Use to compare routes, assess benchmark relevance, or review recommendation and retirement movement; `ki-pulse` discovers public signals, `ki-tokenomics` owns purpose categories, runtime adapters own effective configuration, and `ki-agentic-radar` owns broader agentic standards.

- **Kind:** Governance
- **Arguments:** `audit | conform | educate | help | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-specs`

Create, audit, and maintain repository Specifications as the accepted behaviour and quality contract, with stable requirements, conformance state, verification plans, and evidence. Use to specify what a system must do; `ki-decision-records` owns why, `ki-guides` how, and `ki-work-roadmap` future delivery.

- **Kind:** Governance
- **Arguments:** `audit [dir] | conform [dir] | help | educate [dir] | new <area> "<title>" | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-trade`

Operate one repository's side of a declared cross-repository trade: prepare, inspect, submit, receive, release, or prune a work or knowledge record. Use for one concrete trade action; `ki-trades` owns record and route governance, while `ki-next` owns receiver disposition.

- **Kind:** Process
- **Arguments:** `prepare <receiver> | observe <TRD> | submit <TRD> | abandon <TRD> | receive <TRD> | release <TRD> | prune <TRD> | routes <add|remove|list|check> | list | show <TRD> | help`
- **Dependencies:** `ki-trades`
- **Runtime:** Portable

#### `ki-trades`

Govern typed directional work and knowledge trades between registered KI repositories, including routes, identities, immutable submission, receipt, receiver decisions, observation, release, and pruning. Use to design or audit the trade system; `ki-trade` performs one side's actions and the receiver retains priority and acceptance authority.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | educate <repo> | help | refresh`
- **Dependencies:** None
- **Runtime:** Portable

### Keystone

#### `ki-bootstrap`

Explain first-time KI activation through the `ki` CLI: bootstrap a user, select a verified harness, and distinguish user skills from repository governance. Use for setup, skill activation, local development, or why an audit will not run; `ki --help` owns command mechanics and `ki-repo` owns repository coverage.

- **Kind:** Process
- **Arguments:** `help | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-repo`

Audit or conform the universal KI repository contract declared by `.ki.toml`, including setup, GitHub settings, and top-level `+` and `-` working areas. Use for whole-repository review; specialised `ki-repo-*`, `ki-engineering`, and `ki-work-roadmap` skills own their narrower structures.

- **Kind:** Governance
- **Arguments:** `audit | conform <repo> | educate <repo> | help | refresh | review [scope] | review close <REV-NNN>`
- **Dependencies:** `ki-authoring`, `ki-git`
- **Runtime:** Runtime-bound; supported runtimes are resolved by its host contract

#### `ki-skills`

Create, audit, review, extract, or optimise Agent Skills against current portable and KI authoring practice. Use for SKILL.md scope, descriptions, progressive disclosure, scripts, references, rubric checks, or reusable capability analysis; use `ki-subagents` for agent roles and `ki-repo-harness` for bundle layout.

- **Kind:** Governance
- **Arguments:** `audit <skill-or-repo> | conform <skill> | educate <description> | extract <repo> [--history <path>...] | help | optimise <skill> | refresh | review <skill-or-repo>`
- **Dependencies:** None
- **Runtime:** Portable

### Repo Structure

#### `ki-repo-dotfiles-chezmoi`

Audit or conform the KI chezmoi dotfiles-management standard: source-versus-target editing, app-mutated configuration, shell and `bin/` layout, prefix semantics, fragments, comment preservation, and reverse merges. Use for a chezmoi source repository, not a specific repository's personal tool choices.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | help | educate <repo> | refresh`
- **Dependencies:** `ki-authoring`
- **Runtime:** Portable

#### `ki-repo-harness`

Audit, conform, or design a KI-compatible harness that co-locates skills, subagents, MCP servers, evals, and hooks and publishes a verified installed payload. Use for harness source layout, prefix identity, declarations, or catalogue publication; content quality belongs to the relevant capability skill.

- **Kind:** Governance
- **Arguments:** `audit [path] | conform [path] | educate <name> | help | refresh`
- **Dependencies:** `ki-skills`, `ki-subagents`, `ki-decision-records`, `ki-work-roadmap`
- **Runtime:** Runtime-bound; supported runtimes are resolved by its host contract

#### `ki-repo-homebrew-tap`

Audit or scaffold a KI Homebrew tap repository and its `Formula/*.rb` distribution surface against Homebrew rules. Use when adding a formula, checking tap shape, sources, README publication, `brew audit`, or `brew style`; `ki-repo-tools` owns CLI repositories and `ki-repo` universal files and settings.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | educate <repo> | help | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-repo-kb`

Create, query, update, distil, or audit a KI knowledge base using Calendar, Pillars, Resources, Streams, and directional `+` and `-` areas. Use for notes, session digests, search, or zone conformance; `ki-repo-kb-streams` owns forward-work containers and `ki-authoring` general document style.

- **Kind:** Governance
- **Arguments:** `audit | conform | digest | extract | help | improve | educate | query <question> | refresh | save | update <note>`
- **Dependencies:** `ki-repo-kb-activities`, `ki-repo-kb-live-artifacts`, `ki-repo-kb-streams`
- **Runtime:** Portable

#### `ki-repo-kb-activities`

Create, audit, and maintain Activity notes recording automation, scheduling, and agentic work adopted by a KI knowledge base. Use for activity identity, frontmatter, realisation type, index, or linked skill and scheduled-task evidence; `ki-repo-kb` owns zones and `ki-skills` skill authoring.

- **Kind:** Governance
- **Arguments:** `audit | conform | help | educate | new <name> | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-repo-kb-live-artifacts`

Create, audit, and maintain KI Live Artifact pairs: a Markdown source and rendered HTML view for dashboards, queues, trackers, or status boards. Use for pair naming, index, or sync; `ki-repo-kb` owns zones and `ki-authoring` Markdown style.

- **Kind:** Governance
- **Arguments:** `audit | conform | help | educate | new <name> | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-repo-kb-principal`

Audit or conform the local structural overlay for a designated principal KI knowledge base: governance home, Enactment gate, charter, memory root, canonical zones, and handoff entry points. Use for the overlay only; it does not establish canonical identity, authority, or cross-island roles.

- **Kind:** Governance
- **Arguments:** `audit | conform | educate | help | refresh`
- **Dependencies:** `ki-repo-kb`, `ki-decision-records`
- **Runtime:** Portable

#### `ki-repo-kb-streams`

Govern the KI knowledge-base Streams container: flat `Streams/Roadmap` work records and `Streams/Housekeeping` templates. Use to establish, audit, route, or migrate KB forward-work structure; shared lifecycle actions belong to `ki-next`, `ki-plan`, `ki-implement`, and `ki-accept`, while `ki-repo-kb` owns the zone model.

- **Kind:** Governance
- **Arguments:** `audit | conform | help | educate | iterate | propose | ready | refresh | rollout`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-repo-mcp`

Audit or scaffold KI MCP server repositories against the workspace-MCP standard: layout, dependency injection, tool naming, annotations, access gates, audit logging, and security invariants. Use for MCP server code or standard refresh; `ki-engineering` owns common toolchains, `ki-skills` SKILL.md quality, and `ki-repo` settings.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | educate <repo> | help | refresh`
- **Dependencies:** None
- **Runtime:** Runtime-bound; supported runtimes are resolved by its host contract

#### `ki-repo-plugins`

Audit, conform, or scaffold the generated KI Claude plugin-marketplace projection: manifests, verbatim skills, flattened agents, deferred MCP configuration, and generated-only integrity. Use for the marketplace's on-disk shape; `ki-binding-claude` owns generation and Cowork enablement, while `ki-repo` owns universal files.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | help | educate <repo> | refresh`
- **Dependencies:** None
- **Runtime:** Runtime-bound; supported runtimes are resolved by its host contract

#### `ki-repo-project`

Explain the baseline and composable structures for a non-Knowledge-Base KI Project repository. Use when orienting or migrating a Project and choosing specialised `ki-repo-*` overlays; `ki-repo` owns primary-kind declarations, `ki-work` tracker selection, and `ki-repo-kb` Knowledge Bases.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | educate <repo> | help | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-repo-specifications`

Audit, conform, or scaffold the minimal repository structure for KI Specifications: marker configuration plus proposals, specifications, schemas, templates, examples, docs, and tooling. Use for the specifications repository container; `ki-specs` owns requirement records, `ki-decision-records` decisions, and `ki-repo` universal files.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | educate <repo> | help | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-repo-tools`

Audit or scaffold a KI `tools-*` repository containing one standalone CLI, its installer, release and changelog flow, CI, help, completion, and optional manual. Use for CLI repository shape; `ki-repo-homebrew-tap` owns formulae, `ki-engineering` TypeScript/Bun toolchains, and `ki-repo` universal files.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | help | educate <repo> | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-repo-website`

Govern the generator-neutral KI website seam: one site source root, reproducible `dist/`, and `ki:site:build`, `ki:site:dev`, and `ki:site:clean`. Use for any website repository before selecting exactly one implementation, `ki-repo-website-content` or `ki-repo-website-app`; add Cloudflare hosting independently.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | help | educate <repo> | refresh`
- **Dependencies:** None
- **Runtime:** Portable

#### `ki-repo-website-app`

Govern the KI interactive website implementation: one client-side React application bundled by Vite to `dist/`. Use for dashboards or single SPAs; select it instead of `ki-repo-website-content`, with `ki-repo-website` owning the neutral site lifecycle and hosting handled separately.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | help | educate <repo> | refresh`
- **Dependencies:** `ki-repo-website`
- **Runtime:** Portable

#### `ki-repo-website-cloudflare`

Govern Cloudflare Workers Static Assets hosting for either KI website implementation, including `wrangler.jsonc`, `dist/`, Workers Builds, workers.dev, custom domains, and deploy scripts. Use for Cloudflare publication or static-deployment diagnosis; it never selects the site generator and does not use Pages.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | educate <repo> | help | refresh`
- **Dependencies:** `ki-repo-website`
- **Runtime:** Portable

#### `ki-repo-website-content`

Govern the KI content-led website implementation: Eleventy 3, Markdown or structured data, Nunjucks, Tailwind 4 semantic tokens, and portable `dist/` output. Use for documentation, publication, or marketing page collections; select `ki-repo-website-app` for a single React/Vite SPA and keep hosting separate.

- **Kind:** Governance
- **Arguments:** `audit <repo> | conform <repo> | help | educate <repo> | refresh`
- **Dependencies:** `ki-repo-website`
- **Runtime:** Portable

<!-- ki-repo-harness:capability-catalogue:end -->
