# Mode-element inventory

This is the current-state inventory for GOV-003.

Every governance skill currently exposes one standalone `scripts/govern.ts`, with `audit` and `conform` commands.

Those scripts remain independently runnable, but the aggregate runner currently treats each as an indivisible whole and orders them alphabetically.

That is insufficient where one script contains work that must happen before a writer and other work that must happen afterwards.

## Common element model

| Mode | Current element | Inputs | Effects | Aggregate constraint |
| --- | --- | --- | --- | --- |
| AUDIT | inspect and report | Repository/user state; skill references | Canonical JSONL only | Read-only; order is relevant only where an audit consumes a generated projection. |
| CONFORM | inspect, mutate, report | Repository/user state; safe defaults | Files, generated projections, or approved external settings | Serial; a consumer follows its producer, and normalisation follows all writers. |

The planner must retain the same target and argument transport as these entry points.

The current `audit.ts` / `conform.ts` pair is therefore the initial executable boundary, not a claim that every pair has one logical phase.

## Governance-skill inventory

| Skill | Current AUDIT element | Current CONFORM element | Principal effect / ordering constraint |
| --- | --- | --- | --- |
| `ki-binding` | Inspect cross-surface bindings | Reconcile generated binding files | External/user configuration is a terminal consumer. |
| `ki-housekeeping` | Inspect accumulated agent state | Prune safe stale state | User-environment maintenance; never precedes repository writers. |
| `ki-tokenomics` | Inspect standing context | Reconcile token-budget guidance | Documentation/configuration consumer. |
| `ki-authoring` | Inspect authored Markdown/TOML | Own config files; normalise Markdown | Split owned-file preparation from late Markdown normalisation. |
| `ki-engineering` | Inspect toolchain | Format and reconcile toolchain | Toolchain formatting follows source writers. |
| `ki-agents` | Inspect agent definitions | Scaffold/conform agent files | Agent files precede authoring normalisation. |
| `ki-decision-records` | Inspect decisions/index | Conform decision records/index | Decision writers precede authoring normalisation. |
| `ki-feature-definitions` | Inspect feature definitions/index | Conform feature documents/index | Feature writers precede authoring normalisation. |
| `ki-handoffs` | Inspect handoff artifacts | Conform handoff artifacts | Handoff writers precede authoring normalisation. |
| `ki-repo-roadmap` | Inspect roadmap projections | Generate roadmap projections | Must follow thematic roadmap and plan writers. |
| `ki-skills` | Inspect skill contract | Conform skill content | Skill writers precede authoring normalisation. |
| `ki-binding-chezmoi` | Inspect chezmoi binding | Render managed binding surface | Depends on binding/domain inputs before external render. |
| `ki-kb-activities` | Inspect activity notes/index | Append safe index entries | Domain writer before KB and roadmap projections. |
| `ki-kb-live-artifacts` | Inspect live artifact metadata | Reconcile safe artifact indexes | Domain writer before KB projections. |
| `ki-kb-streams` | Inspect streams/indexes | Reconcile stream indexes | Domain writer before KB and roadmap projections. |
| `ki-website-cloudflare` | Inspect Cloudflare deployment surface | Reconcile Workers/Pages configuration | Website-domain writer before website normalisation. |
| `ki-bootstrap` | Inspect generated governance footprint | Rebuild generated payload | Must establish payload before aggregate consumers. |
| `ki-repo` | Inspect repository contract | Scaffold repo configuration/GitHub settings | Configuration preparation precedes dependent repository skills. |
| `ki-dotfiles-chezmoi` | Inspect dotfiles shape | Conform chezmoi source files | Domain writer before authoring normalisation. |
| `ki-harness` | Inspect five-part harness | Conform harness layout | Harness writers precede skills/agents and authoring checks. |
| `ki-homebrew-tap` | Inspect tap structure | Conform tap files | Domain writer before authoring normalisation. |
| `ki-kb` | Inspect KB structure | Conform KB root/index | Consumes KB family outputs before roadmap projection. |
| `ki-mcp` | Inspect MCP surface | Conform MCP files | Domain writer before authoring normalisation. |
| `ki-plugins` | Inspect plugin layout | Conform plugin files | Domain writer before authoring normalisation. |
| `ki-specifications` | Inspect specification layout | Conform specification files | Domain writer before authoring normalisation. |
| `ki-tools` | Inspect tools layout | Conform tool files | Domain writer before authoring normalisation. |
| `ki-website` | Inspect website layout | Conform website files | Domain writer before authoring normalisation. |

## Required pilot split

`ki-authoring` is the required proof that a skill cannot be one global phase.

Its CONFORM path contains two elements:

1. `authoring-config` creates or repairs the owned formatter and editor configuration before tools run.
2. `markdown-normalise` runs after domain and projection writers have completed.

The first element is a preparation writer; the second is a terminal normaliser.

`ki-repo` provides the earlier configuration-preparation pilot, `ki-kb-activities` supplies a domain writer, and `ki-repo-roadmap` supplies a projection consumer that follows its domain writers.

## Minimum phase vocabulary

The inventory supports five ordered phases: `prepare`, `inspect`, `write`, `project`, and `normalise`.

AUDIT normally uses `inspect`; a read-only projection validation may use `project`.

CONFORM uses `prepare`, `write`, `project`, and `normalise`.

Explicit graph edges may order elements within a phase, but must not reverse phase order.

## Next implementation boundary

The executable contract will live in a versioned JSON schema owned by `ki-skills`, with one local mode-element declaration per governance skill.

Bootstrap will copy those declarations with a skill's mode payload into `.ki-meta/checkers/<skill>/`; they are regular files, never links.

The aggregate runner will validate and topologically order the copied declarations before it invokes an element.
