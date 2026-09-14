---
id: KI-HARNESS-REV-003
area: REV
title: Establish Model Radar
theme: regular-reviews
horizon: next
status: in-progress
blocks: []
blocked_by: []
baseline_ref: 98ab65610f668d6bfa58b2d7a16916893c67bce2
created_at: 2026-09-14T01:50:45Z
updated_at: 2026-09-14T17:35:11Z
---

# Establish Model Radar

## Goal

Establish a portable, evidence-backed `ki-model-radar` capability that helps Knowledge Islands compare language models and their agent routes, decide which combinations to assess, trial, adopt, hold, or retire, and keep harness defaults informed without following any single leaderboard automatically.

The capability should preserve why each model, benchmark, and execution route matters; distinguish frontier hosted models from genuinely open and locally practical alternatives; and hand consequential changes to the repository that owns implementation.

## Context

The current workstation uses Claude Opus 5 through Claude ACP and GPT-5.6 Sol through Codex ACP as its standard-purpose defaults. Higher-tier Claude Fable 5.1 and GPT-6 Astra routes remain available for work that justifies them. Gemini 3.8 Flash, GLM-5.3 and GLM-5.3 Flash, Kimi K3, Qwen3.8 Max, and Grok 4.6 are credible candidates for broader coverage.

Raw model rankings do not establish harness performance. Coding and terminal evaluations often measure a model-agent combination, while provider availability, subscription access, tool protocol, cost, latency, context, privacy, licence, and feasible execution hardware all affect whether a nominally capable model adds useful support.

The harness already has adjacent owners. `ki-pulse` performs bounded public-signal discovery and triages signals as Read / learn, Watch, Act, or Discard without retaining a standing inbox. `ki-tokenomics` owns the portable purpose taxonomy of fast, standard, reasoning, and frontier models. Runtime adapters and consuming repositories own effective configuration. `KI-HARNESS-REV-002` explores broader agentic standards and architectural patterns; this item is narrower and operational, covering language models, model-agent routes, evaluation evidence, and support recommendations.

## Boundary

Do not declare one universal benchmark or composite score authoritative, compare bare-model and model-agent results as though they were equivalent, or treat provider-reported results as independent evidence. Do not install agents, change runtime defaults, purchase access, provision inference infrastructure, or transmit private repository material as part of a radar refresh.

Do not use “open” as an unqualified Boolean, infer local practicality from published weights, or treat all variants in one model family as having the same licence or deployment options. Do not duplicate `ki-pulse` signal collection, `ki-tokenomics` purpose categories, runtime-specific configuration, existing skill source lists, or the broader architectural remit of `KI-HARNESS-REV-002`.

The first delivery need not build a visual polar chart, a continuous monitor, or a benchmark runner. It should establish the durable governance, evidence shape, current snapshot, refresh procedure, and hand-off boundaries first.

## Current state

### Intended approach

Create a runtime-neutral governance skill named `ki-model-radar`. Its source should keep the main `SKILL.md` as a thin operating contract and load focused references for the radar schema, benchmark registry, evidence policy, and current reviewed snapshot only when relevant. Add deterministic validation only where a script materially improves schema, date, identity, or closed-vocabulary checking.

The skill should support the universal AUDIT, CONFORM, EDUCATE, and REFRESH modes. AUDIT should identify malformed, stale, unsupported, or internally inconsistent records without ranking models itself. CONFORM should repair only safe mechanical shape. EDUCATE should explain the classifications and evidence limits. REFRESH should gather bounded current evidence, compare it with the committed snapshot, propose ring or lifecycle movements, and require reviewed evidence before durable changes.

Add a `ki-work-housekeeping` template for a lightweight weekly signal and deprecation review, with a deeper monthly or material-release review before reconsidering recommendation rings. The refresh should be on demand through normal housekeeping spawning, not a daemon or hidden scheduled task.

### Known dependencies

The skill should compose with `ki-pulse`, `ki-tokenomics`, `ki-work-housekeeping`, `ki-next`, `ki-skills`, and runtime-specific adapters without taking over their authority. No delivery dependency on `KI-HARNESS-REV-002` is required, but the two radars should share terminology where doing so does not merge their distinct subjects.

### Planning questions and resolution

Choose the smallest authoritative data representation that is readable when installed with the skill and mechanically validatable in the source harness. Decide whether the benchmark registry and model snapshot should be authored directly as Markdown/TOML or generated into a readable reference from one structured source. Define the initial Knowledge Islands evaluation set and its permitted use of public or synthetic repositories before any private-repository evaluation is attempted.

Use `references/radar.toml` as the single diffable current snapshot for model identities, executable routes, recommendation rings, support state, retirement state, evidence references, and review dates. Keep benchmark semantics and evidence policy in `references/standards-model-radar.md`, with refresh inputs and source-review dates in `references/sources.md`. Begin local-fit evaluation with public or synthetic repositories; private repository evaluation is outside the first delivery.

### Promotion conditions

Move this item to Next when the planned artifact boundary, schema authority, refresh inputs, benchmark applicability vocabulary, and verification commands are explicit; the relationship with `KI-HARNESS-REV-002` is collision-checked; and the first snapshot can be produced without credentials or paid infrastructure.

### Readiness summary

The adjacent owners and source boundaries are available locally, and the initial snapshot can be assembled from public primary sources without credentials or paid infrastructure. The first delivery is bounded to one governance skill, one committed snapshot, two housekeeping templates, deterministic structural checks, and an evaluation scenario. It does not change runtime defaults or adopt any newly assessed model.

## Steps

- [ ] Create `ki-model-radar` as a runtime-neutral governance skill with AUDIT, CONFORM, EDUCATE, and REFRESH modes, plus explicit off-ramps to `ki-pulse`, `ki-tokenomics`, runtime adapters, `ki-next`, and `ki-skills`.
- [ ] Define the TOML snapshot schema and Markdown evidence contract for stable model identities, executable routes, benchmark applicability, recommendation ring, support state, retirement state, movement, provenance, counter-evidence, and review dates.
- [ ] Seed the reviewed benchmark registry and initial model-route snapshot from the public sources named in this record, preserving uncertainty and keeping provider claims corroborating rather than decisive evidence.
- [ ] Add deterministic no-write validation for identity uniqueness, closed vocabularies, required dates, evidence linkage, and internally consistent lifecycle combinations; limit CONFORM to safe structural repairs.
- [ ] Add weekly signal/deprecation and monthly material-release housekeeping templates whose spawned work routes consequential changes through the normal roadmap lifecycle.
- [ ] Register and publish the skill, add an evaluation scenario, and verify its boundaries against `ki-pulse`, `ki-tokenomics`, `KI-HARNESS-REV-002`, and runtime-specific configuration owners.

## Files touched

- `.ki.toml`
- `skills/governance/ki-model-radar/`
- `docs/housekeeping/KI-HARNESS-HK-003-weekly-model-signal-review.md`
- `docs/housekeeping/KI-HARNESS-HK-004-monthly-model-release-review.md`
- `evals/scenarios/ki-model-radar.ts`
- Generated capability and rubric publications affected by registering the skill
- This roadmap item

## Verify

- Focused validator tests cover duplicate identities, invalid vocabularies, missing or stale review dates, broken evidence references, contradictory lifecycle states, and safe-CONFORM boundaries.
- `ki repo audit --skill ki-model-radar --repo .`
- `ki repo audit --skill ki-skills --repo .`
- `ki repo audit --skill ki-work-housekeeping --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `bun run test`
- `bunx tsc --noEmit`

## Dependencies / blocks

All delivery dependencies are locally available. `KI-HARNESS-REV-002` is a terminology and boundary cross-check, not a delivery prerequisite. Current public sources are sufficient for the first snapshot; paid endpoints, private repositories, runtime-default changes, and provider deployment are excluded.

## Documentation impact

### Decision Records

Add or revise a Decision Record only if implementation changes an existing skill-authority or lifecycle contract.

### Specifications

No repository-wide specification change is expected in the first delivery; the skill standard and snapshot schema own the new contract.

### Guides

Update an existing skills guide only when the generated catalogue does not give users a sufficient task-oriented route to the new capability.

### Roadmap

Keep this item as the implementation and review authority. Any approved runtime-default, adapter, or private-evaluation consequence becomes separate owner-local work through `ki-next`.

**Delegation:** one bounded lane may prepare the public-source snapshot and benchmark evidence while another implements the schema validator and fixtures. The coordinator retains schema authority, skill-boundary review, generated publication updates, final verification, and all roadmap lifecycle changes.

## Discussion

### Recommendation, support, and lifecycle

Use the widely recognised Thoughtworks recommendation rings as one independent axis:

- **Adopt** — proven in relevant Knowledge Islands use and recommended where its route fits.
- **Trial** — ready for controlled real work, with useful but incomplete local evidence.
- **Assess** — worth active investigation or evaluation, but not yet proven locally.
- **Hold** — avoid new adoption or proceed with caution because evidence, fit, risk, or supersession argues against it. A presentation may label this ring Caution while retaining the established `hold` identifier.

Keep actual harness state separate:

- **Default** — selected default for at least one declared purpose or runtime route.
- **Available** — supported and selectable, but not a default.
- **Evaluation** — integrated only for bounded assessment or trial.
- **Not integrated** — tracked by the radar but unavailable through the harness.

Keep support retirement separate again through `active`, `retiring`, and `retired`. Every active radar record is already tracked, so Track is not a recommendation ring. Record movement as new, inward, outward, or unchanged without turning movement into another maturity state.

### Evaluation unit

Maintain stable model identities separately from executable routes. A route binds a model version to the harness and access path actually evaluated, such as `GPT-6 Astra + Codex + ACP`, `Claude Fable 5.1 + Claude Code + ACP`, `Gemini 3.8 Flash + Gemini CLI + ACP`, or `GLM-5.3 Flash + OpenCode + ACP`.

Evidence must say whether it evaluates a bare model, a provider endpoint, a model-agent combination, or a complete task environment. Results from different units can corroborate one another but should not be numerically merged without an explicit defensible method.

### Benchmark registry

Track benchmark families as first-class radar evidence rather than a timeless list of links. Each benchmark record should identify its owner, evaluated unit, capability domain, metric, harness constraints, publication and data freshness, reproducibility, known saturation or contamination risk, cost of running, current applicability, last review date, source, and any successor.

Classify its role as primary, corroborating, or discovery evidence for a named use case. Maintain a separate benchmark lifecycle of current, watch, and retired so a once-useful benchmark can stop influencing decisions without losing its historical rationale.

The initial registry should cover:

- **BenchLM** — broad discovery and consensus aggregation across many benchmark families. It is valuable for finding candidate models and evidence gaps, but its derived ranking should not decide adoption alone.
- **Artificial Analysis Intelligence and Coding Agent indices** — independent cross-provider capability, cost, speed, and model-agent comparisons. They are useful broad operational evidence, while their weighting and predominantly English text scope must remain visible.
- **LMArena** — human-preference evidence for conversational quality. It is useful for perceived response quality, but not a substitute for correctness, long-horizon delivery, or repository work.
- **SWE-bench and current live or contamination-resistant relatives** — real-repository software issue resolution. These are primary coding-agent evidence when the exact agent scaffold, dataset version, cost, and success criteria are retained.
- **Terminal-Bench** — terminal tool-use and task-completion evidence closer to autonomous engineering work. Results remain agent-and-environment dependent.
- **Stanford HELM** — transparent, broad, multi-metric evaluation useful for capability and risk context even when its frontier-model cadence differs from commercial leaderboards.
- **Provider model cards, release notes, pricing, and deprecation notices** — primary evidence for identity, capabilities, access, licence, price, and lifecycle, but self-reported performance is corroborating evidence only.
- **Knowledge Islands evaluations** — a small versioned task set using the actual harness and representative public or synthetic repositories. This should become the decisive local-fit evidence once its safety, reproducibility, cost, and review contract exist.

### Openness and execution

Every model variant should record an exact licence and classify openness as proprietary, open-weight, or compliant with the Open Source AI Definition rather than using a generic open-source label. Record execution routes independently: vendor API, third-party API or gateway, subscription-backed agent, and self-hosted weights.

Record practical locality as laptop, workstation, server, cluster, or unavailable, together with the relevant parameter scale, quantisation, memory, accelerator, and context assumptions. “Self-hostable” does not mean useful on a personal workstation; full GLM-5.3 and Kimi K3 may be open-weight while remaining server- or cluster-oriented. Qwen3.8 Max is a proprietary hosted model and must not inherit the openness of smaller Qwen variants.

### Initial model coverage

The first reviewed snapshot should include:

- **Claude Opus 5** — initial Adopt / Default candidate through Claude Code and ACP; proprietary and hosted, and the standard-purpose Claude default.
- **GPT-5.6 Sol** — initial Adopt / Default candidate through Codex and ACP; proprietary and hosted, and the standard-purpose Codex default.
- **Claude Fable 5.1** — initial Adopt / Available candidate through Claude Code and ACP; proprietary and hosted, retained as a higher-tier option rather than the everyday default.
- **GPT-6 Astra** — initial Adopt / Available candidate through Codex and ACP; proprietary and hosted, retained as a higher-tier option rather than the everyday default.
- **Gemini 3.8 Flash** — initial Assess and first Trial candidate through Gemini CLI ACP; proprietary and hosted, with multimodal and cost/speed differentiation.
- **GLM-5.3 and GLM-5.3 Flash** — initial Assess candidates through OpenCode or compatible APIs; open-weight, with distinct licences and server-class self-hosting profiles. Flash should be assessed separately for its lower-cost, faster route.
- **Kimi K3** — initial Assess candidate; open-weight under the Kimi licence, available through hosted access or cluster-scale self-hosting.
- **Qwen3.8 Max** — initial Assess candidate; proprietary hosted model. Track an appropriately sized open-weight Qwen variant separately for local execution.
- **Grok 4.6** — initial Assess candidate through xAI-hosted access; proprietary.
- **Workstation-local lane** — at least one appropriately sized Qwen variant and relevant Gemma 4 variants, evaluated separately from the frontier-hosted lane for privacy, offline operation, latency, and total-cost value.

Initial ring positions are hypotheses to verify against current sources and local experience during the first REFRESH. No model enters Trial without controlled real use, and no model enters Adopt solely from external rankings.

### Evidence and movement gates

A recommendation movement should cite current primary identity and lifecycle evidence, at least two materially independent evaluation sources where available, and local-fit evidence proportional to the ring. Provider claims alone cannot move a model inward. Conflicting evidence remains visible rather than collapsed into false precision.

Ring changes should record the reviewed date, rationale, material counter-evidence, evaluated route, and reviewer. A weekly refresh can update availability, pricing, deprecations, and watch signals without forcing movement. Material movements should be reconciled through at least two agentic systems before review, with the human retaining the adoption decision.

### Consumer hand-off

The radar informs rather than mutates consumers. An approved support change becomes finite work through `ki-next` in the owning repository. The harness owns reusable agent and skill capability; runtime adapters own runtime-specific projection; dotfiles owns personal installation and selected defaults; Rig audits the declared local installation/profile state. A model retirement should identify successor and affected routes before downstream removal work begins.

### Initial sources

Use the [Thoughtworks Technology Radar FAQ](https://www.thoughtworks.com/radar/faq) for recommendation-ring semantics and the [Open Source AI Definition](https://opensource.org/ai/open-source-ai-definition) to avoid open-washing. Seed evaluation metadata from [BenchLM methodology](https://benchlm.ai/methodology), [Artificial Analysis intelligence methodology](https://artificialanalysis.ai/methodology/intelligence-benchmarking), [Artificial Analysis coding-agent methodology](https://artificialanalysis.ai/methodology/coding-agents-benchmarking/), [LMArena](https://forward-testing.lmarena.ai/faq), [SWE-bench](https://www.swebench.com/), [Terminal-Bench](https://www.tbench.ai/news/announcement), and [Stanford HELM](https://crfm.stanford.edu/helm/).

Confirm model identity and execution facts against current provider model cards and release documentation during each refresh. The sources above establish the initial registry, not permanent authority or an exhaustive list.
