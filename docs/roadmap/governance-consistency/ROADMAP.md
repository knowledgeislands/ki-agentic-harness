---
code: GOV
---

# Governance consistency roadmap

## Blocking

Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.

### Establish the Knowledge Acquisition Framework (KAF) for session and project recovery

Adopt the Knowledge Acquisition Framework (KAF) as the upstream boundary that moves Knowledge Islands conversations, projects, attachments, and other source material out of agent sessions and into portable Knowledge Export Packages (KEPs). Settle KAF's fidelity, provenance, determinism, connector, and safety contract; preserve its strict separation from downstream KBEP extraction and KBIP ingress; and define a safe, user-assisted ChatGPT project/conversation pilot before considering browser automation. Use the resulting grounded corpus to support the broader consolidation of Knowledge Islands notes and chats into the canonical knowledge base and a coordinated go-forward roadmap. The KAF `ki acquire` interface must inform the CLI manual, but this harness work neither implements a scraper nor assumes a receiving code repository.

**Plan:** [GOV-001](plans/GOV-001-define-knowledge-acquisition-framework.md)

## Next

Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.

## Soon

Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.

### Align KB Stream focus with non-KB roadmap horizons

Align the two open-work models without treating them as identical. Add a Blocking focus to Knowledge Base Streams; represent "waiting for" as explicit dependency detail within Background, from which work promotes to Active when ready; align Dormant with a new Parked roadmap horizon; and remove Settled so completed history lives in canonical documentation and git rather than either open-work structure. Preserve plan status as a separate execution lifecycle.

Make the shared process layer structure-aware: `ki-recap` must route outstanding work to the local structure, `ki-next` must select and promote work in either model, and the plan/execution lifecycle must operate over either a non-KB plan or a KB Stream proposal checklist. Repository-type detection should dispatch to `ki-repo-roadmap` or `ki-kb-streams` as distinct governance adapters rather than forcing both repositories into one file shape. The result should make cross-repository handoffs and everyday lifecycle commands consistent while retaining the distinct Stream and roadmap forms. This is a lifecycle-model alignment, not an enactment of one repository structure inside the other. Origin: the four-repository ecosystem alignment rollout.

### Codify convention placement and the knowledge-promotion loop

Define one runtime-neutral routing reference and manual promotion loop that prevents useful knowledge becoming trapped in session or project memory: ephemeral agent memory → project guidance or an on-demand guide → shared governance or reference material → a reusable skill. For each rung, state what belongs there, the evidence that triggers promotion, the durable destination, and the reconciliation step that removes or redirects the lower-layer duplicate. Keep `AGENTS.md` as the portable orientation, reserve runtime files such as `CLAUDE.md` for runtime-specific imports and guidance, and route genuinely personal cross-project conventions to synchronized user configuration. Do not add automatic transcript mining or a new guide area by default.

### Create `ki-repo-review` as a human-led process skill

Create the reusable process skill from the completed `REV-001` review method: inventory a repository, gather inspectable evidence, interview material uncertainties, distinguish findings from decisions and delivery work, and link findings to plans. Compose with the then-current roadmap skill for review-record lifecycle rather than owning retention itself. Validate and forward-test the skill against the dotfiles assessment; it must guide a review rather than substitute automated judgment for one.

### Review the skill dependency graph and implementation quality _(candidate)_

Build one complete dependency graph for every skill relationship: declared `ki-depends-on:` edges, documentation and reference links, configuration ownership, subprocess or import edges, and generated or vendored runtime dependencies. Use it to review skills in dependency order from roots to dependants, covering each skill's `SKILL.md`, references, scripts, tests, and generated surfaces. Reconcile the canonical dependency order in `ADR-KI-HARNESS-SKILLS-003` with the shipped skill set, including every currently omitted skill. Verify that technology assumptions have explicit governance edges — for example, `ki-mcp` currently directs AUDIT through `ki-engineering` and should be checked for the corresponding conceptual dependency. Prefer executable, versioned source files inside the skill — including schemas — referenced from documentation, rather than making Markdown code blocks the only source of truth; retain short examples only where they clarify use. Record concrete repairs as separately scoped plans rather than turning this review into an unbounded rewrite.

## Waiting for

Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.

## Future

Speculative or not yet scoped — items marked _(candidate)_ need a scoping pass (or a decision to drop them) before they're actionable.

### Separate Knowledge Islands policy from portable governance _(candidate)_

Write a compact boundary matrix separating portable contract, Knowledge Islands estate policy, and runtime binding. Use it to identify when a principle first expressed in the Harness should return to Arcadia Principal as canonical philosophy; when it should mature into a portable formal contract in KI Specifications; when it remains reusable Harness mechanics; and when it is only a runtime-specific binding. The Website publishes or routes those source-owned bodies without becoming their authority. Do not split standards or redesign composition unless the matrix exposes a concrete ownership conflict.

### Roll Feature Definitions out across the repository fleet _(candidate)_

Select one named repository with externally visible behaviour and an owner, then pilot the format there. Do not begin fleet rollout before that pilot exists.

### Add engineering change value profiles to the verb map _(candidate)_

Define a compact, evidence-backed way to compare engineering changes without collapsing them into one misleading score. The profile should cover new capability, comprehensibility, maintenance reduction from duplicated or divergent implementation, reliability and risk reduction, leverage across repositories or agents, and delivery cost and reversibility. Decide which dimensions belong on each work verb or plan, how claims become measurable evidence, and how the profile informs roadmap ordering without becoming ceremony for small fixes.

### Review interpretable context methodology and current agentic practice _(candidate)_

Once the harness's own governance and orchestration contracts are stable, assess [Interpretable Context Methodology: Folder Structure as Agentic Architecture](https://arxiv.org/abs/2603.16021) alongside current agent models, runtimes, and orchestration approaches. Compare its filesystem-visible stages, layered context loading, local mechanical scripts, and human review points with the harness's skills, durable artifacts, shared modules, plans, and runtime bindings. Extract only evidence-backed improvements: retain differences that serve this architecture, record any adopted principle in its owning decision or standard, and avoid changing the harness merely to mirror an external model.

### Review language-model evaluation frameworks _(candidate)_

Review robust evaluation frameworks such as [EuroEval](https://euroeval.com/), which benchmarks language models across 30+ European languages and is part of the Horizon Europe [TrustLLM project](https://cordis.europa.eu/project/id/101135671), alongside agentic and harness-focused evaluation approaches. Determine what is transferable to this repository's `evals/` surface: benchmark design, multilingual coverage, reproducibility, dataset governance, result reporting, and the boundary between evaluating a model and evaluating an agent-plus-harness system. Treat external frameworks as research sources, not dependencies or an adoption commitment; record only evidence-backed improvements in the owning evaluation standard or plan.
