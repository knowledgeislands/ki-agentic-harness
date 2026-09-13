# Choose a skill by outcome

Use this guide when you know what you want to achieve but do not yet know the Knowledge Islands skill name. It routes common outcomes to the smallest useful capability or journey. For the complete source-of-truth inventory, exact argument hints, runtime bindings, and formal dependencies, use the generated [capability catalogue](../../skills/README.md#generated-capability-catalogue).

You can ask for an outcome in plain language or invoke the named skill directly. Start with the narrowest route below; a skill's own HELP explains its modes and off-ramps before acting.

## Establish or govern a repository

- **Start using Knowledge Islands on a machine** — use `ki-bootstrap` for first-time CLI bootstrap, canonical Harness selection, and the boundary between user skill activation and repository governance.
- **Audit or conform the universal repository baseline** — use `ki-repo`. It owns repository configuration, standard root files, GitHub settings, and the `+` / `-` working areas.
- **Shape TypeScript and Bun engineering** — use `ki-engineering` for code structure, tests, package scripts, TypeScript, Biome, and the shared toolchain.
- **Format Markdown or TOML** — use `ki-authoring`. It owns the writing conventions and mechanical Markdown pass, not the meaning of configuration keys.
- **Prepare or review a commit** — use `ki-git` for commit shape, branch choice, shared-worktree hygiene, and stale-lock safety.
- **Create or audit the skill itself** — use `ki-skills` for `SKILL.md` quality, frontmatter, descriptions, progressive disclosure, rubrics, and dependency declarations.

A normal repository-governance journey is `ki-repo` plus the structure skill matching the repository, with `ki-engineering`, `ki-authoring`, and `ki-git` applied where their concerns exist. Composition is declared by each skill; do not infer a dependency merely because two standards commonly run together.

## Record why, what, how, or when

- **Why was a durable choice made?** Use `ki-decision-records` for a living Decision Record.
- **What behaviour must a system provide?** Use `ki-specs` for testable requirements and verification hooks.
- **How does a reader use, operate, contribute to, or maintain it?** Use `ki-guides` for practical instructions under `docs/guides/`.
- **When should repository work happen?** Use `ki-work` to select the adapter, then the matching adapter skill: `ki-work-roadmap`, `ki-work-github-issues`, or `ki-work-linear`.
- **What recurring maintenance is due?** Use `ki-work-housekeeping` to govern templates and due-run spawning.
- **How can a live thread resume in fresh context?** Use `ki-checkpoint` for one concise repository-owned reconstruction snapshot. Use `ki-recap` instead when summarising the current live session and routing durable learning.

Keep these instruments separate. A guide may link to the decision or specification that supports it, but it should not become a second copy of either. A future action belongs in the selected work adapter rather than a Decision Record.

## Select, plan, deliver, and close work

The standard local delivery journey is:

1. Use `ki-next` to select, capture, promote, defer, or spawn work from the shared queue. It can identify and confirm an independent batch candidate when the adapter and candidates support one; `ki-batch` requires separate explicit authorisation before execution.
2. Use `ki-plan` to make selected Now or Next work honestly ready. It enriches the canonical record and stops at `ready`.
3. Use `ki-implement` to deliver one explicitly approved ready record through the local adapter. It establishes a baseline, applies bounded changes, verifies them, and stops at `awaiting-review`.
4. Use `ki-accept` after human approval to close the evidence-backed record and optionally prune an explicitly selected eligible done record.

Use `ki-batch` only for an explicitly authorised, single-repository set of independent work records. It plans the named candidates first and then runs bounded cycles; it does not select or reshape backlog work. Use `ki-recap` at a session boundary to summarise completed changes, surface only genuinely unfinished work, and route durable learning.

## Delegate work or define a subagent

These concerns are related but distinct:

- **Let the current process use runtime subagents for bounded work** — the active process skill, such as `ki-implement` or `ki-batch`, decides whether delegation is useful and retains coordination, human interaction, review, and integration.
- **Make a high-risk hand-off durable** — use `ki-delegation` when an approved delegated change needs locked decisions, explicit authority, isolation, escalation, verification, and return boundaries that must survive a runtime hand-off. Ordinary bounded subagent use does not require a durable packet.
- **Define a reusable subagent role** — use `ki-subagents` for the portable role identity, purpose, lane, grounding, hand-offs, orchestration intent, and outcome evidence.
- **Project that role into a runtime format** — use `ki-subagents-claude` for Claude Code Markdown/YAML or `ki-subagents-codex` for Codex TOML. A valid source projection does not by itself prove installation, activation, selection, or execution.

Cross-repository transfer is not subagent delegation. Use the trade route below when another repository owns the work or knowledge.

## Choose a repository structure

Start with `ki-repo` for the common baseline, then select the structural capability that matches the repository's purpose:

- **Source Harness** — `ki-repo-harness` for the five shelves, compatible payload, capability identities, and generated skill catalogue.
- **General project** — `ki-repo-project` for a non-Knowledge-Base project baseline.
- **Knowledge Base** — `ki-repo-kb` for the base island structure; add `ki-repo-kb-principal`, `ki-repo-kb-streams`, `ki-repo-kb-activities`, or `ki-repo-kb-live-artifacts` only for the corresponding structure.
- **MCP server** — `ki-repo-mcp` for the MCP source, tool, access, and packaging delta.
- **Website** — start with `ki-repo-website`, then choose exactly one purpose-specific implementation: `ki-repo-website-content` for a Markdown/data page collection or `ki-repo-website-app` for one interactive React/Vite app. Add `ki-repo-website-cloudflare` independently for Workers Static Assets hosting.
- **CLI or developer tooling repository** — `ki-repo-tools`.
- **Specification repository** — `ki-repo-specifications`.
- **Plugin repository** — `ki-repo-plugins`.
- **Dotfiles managed by chezmoi** — `ki-repo-dotfiles-chezmoi`.
- **Homebrew tap** — `ki-repo-homebrew-tap`.

Repository structures compose with the universal baseline; they do not replace it. Use each catalogue entry's dependency list to distinguish a formal dependency from a common pairing.

## Bind runtimes and manage context cost

- **Define a portable MCP inventory** — use `ki-binding` for the canonical XDG source, server schema, client targeting, and vendor-neutral target.
- **Project bindings into a runtime or user environment** — use `ki-binding-claude`, `ki-binding-codex`, or `ki-binding-chezmoi` for the matching native surface. These adapters do not replace the portable source.
- **Set runtime-neutral context budgets or model-purpose guidance** — use `ki-tokenomics`.
- **Inspect bounded runtime filesystem evidence** — use `ki-tokenomics-claude` or `ki-tokenomics-codex` after the portable policy. These adapters do not establish undocumented live-session state.
- **Govern Claude-specific runtime housekeeping** — use `ki-housekeeping-claude`; use `ki-work-housekeeping` instead for portable recurring repository maintenance.
- **Review and explicitly delete repository-scoped Codex sessions** — use `ki-housekeeping-codex`; it is opt-in while its app-server binding remains experimental, and it never provides automatic retention.

Runtime binding and runtime evidence are separate from capability activation. A source file or clean source audit is not proof that a runtime loaded or executed it.

## Find website design inspiration

Use `ki-design-inspiration` to find visual references for a website or component, explain why selected examples fit, and suggest adaptations. Its curated sources cover navigation, footers, calls to action, page sections, 404 pages, bento grids, and motion. For example, ask “find navigation inspiration for this documentation site” or “suggest restrained motion references for this product page”. Website repository structure remains with `ki-repo-website` and its purpose-specific skills.

## Capture and triage new signals

- **Capture an interesting link or source** — use `ki-pulse` with an explicit destination; inaccessible material remains an unread candidate rather than an invented summary.
- **Scan for relevant public developments** — use `ki-pulse` with an invocation-scoped brief; it inspects at most ten leads and returns at most five cited observations.
- **Route a signal without creating another inbox** — use `ki-pulse` to assign one read / learn, watch, act, or discard disposition, then hand any durable result to its owning capability.

## Exchange work or knowledge across repositories

- **Define the approved repository community and roles** — use `ki-agora` for reciprocal Agora membership.
- **Define or audit the cross-repository protocol** — use `ki-trades` for routes, record identity, authority, immutable submitted projections, receipt, disposition, and retention.
- **Operate one repository's side of a trade** — use `ki-trade` to prepare, inspect, submit, receive, release, prune, or manage routes without writing the peer checkout.
- **Decide what the receiver does next** — use `ki-next` to record the receiver's confirmed disposition of a validated inbound trade and place accepted work in its own queue.

The sender proposes; the receiver owns priority, planning, and execution. A trade is directional repository coordination, not a shared worktree or a delegated agent lane.

## Verify the choice

Before acting, check three things:

1. The selected skill's HELP describes the intended outcome and names the adjacent off-ramps.
2. The generated catalogue shows the expected kind, argument hint, runtime binding, and formal dependencies.
3. The target repository declares the governance capabilities that `ki repo audit` or `ki repo conform` must execute; user-level installation alone does not add them to repository audit scope.

If none of the routes fits, start with `ki-skills` only when the missing outcome may warrant a new reusable capability. A one-off repository action normally belongs in the existing owning skill or local work record rather than a new skill.
