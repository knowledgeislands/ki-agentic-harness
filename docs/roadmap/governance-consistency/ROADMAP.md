# Governance consistency roadmap

## Blocking

Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.

## Next

Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.

### Rename `ki-project-roadmap` to `ki-repo-roadmap`

Rename the roadmap skill to describe its repository-level scope without implying that every non-KB repository is a conventional project. Define a safe migration for the canonical skill directory and frontmatter, references, installation/linking, generated guidance, configuration, tests, and the existing `ki-plan` composition. Until that work is delivered, use the currently installed `ki-project-roadmap` name as authoritative; do not add an alias or change existing consumers opportunistically.

### Prefix plan identifiers with stable theme codes

Extend the then-current roadmap skill so every theme has a stable short code and plan filenames and references use `<THEME>-<NNN>` — for example, `FND-003-enforce-checker-json-contract.md` in `foundation-tooling`. Update the standard, plan parser, generated index, dependency references, and audit/conform rules together. Decide the safe migration of existing plan ids before renaming any current plan; do not alter an in-progress plan's identity opportunistically.

### Align KB Stream focus with non-KB roadmap horizons

Align the two open-work models without treating them as identical. Add a Blocking focus to Knowledge Base Streams; represent "waiting for" as explicit dependency detail within Background, from which work promotes to Active when ready; align Dormant with a new Parked roadmap horizon; and remove Settled so completed history lives in canonical documentation and git rather than either open-work structure. Preserve plan status as a separate execution lifecycle.

Make the shared process layer structure-aware: `ki-recap` must route outstanding work to the local structure, `ki-next` must select and promote work in either model, and the plan/execution lifecycle must operate over either a non-KB plan or a KB Stream proposal checklist. Repository-type detection should dispatch to `ki-project-roadmap` or `ki-kb-streams` as distinct governance adapters rather than forcing both repositories into one file shape. The result should make cross-repository handoffs and everyday lifecycle commands consistent while retaining the distinct Stream and roadmap forms. This is a lifecycle-model alignment, not an enactment of one repository structure inside the other. Origin: the four-repository ecosystem alignment rollout.

## Soon

Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.

### Codify convention placement and the knowledge-promotion loop

Define one runtime-neutral routing reference and manual promotion loop that prevents useful knowledge becoming trapped in session or project memory: ephemeral agent memory → project guidance or an on-demand guide → shared governance or reference material → a reusable skill. For each rung, state what belongs there, the evidence that triggers promotion, the durable destination, and the reconciliation step that removes or redirects the lower-layer duplicate. Keep `AGENTS.md` as the portable orientation, reserve runtime files such as `CLAUDE.md` for runtime-specific imports and guidance, and route genuinely personal cross-project conventions to synchronized user configuration. Do not add automatic transcript mining or a new guide area by default.

### Make the first decision record adopt Decision Records

Extend `ki-decision-records` so the first decision record in a repository is always the record that adopts Decision Records. Define its required decision type, title, and index position; update the NEW guidance, exemplars, and audit rules so a new collection cannot begin with an unrelated decision. Preserve existing collections as migration cases rather than renumbering or rewriting their records automatically.

### Create `ki-repo-review` as a human-led process skill

Create the reusable process skill from the completed `REV-001` review method: inventory a repository, gather inspectable evidence, interview material uncertainties, distinguish findings from decisions and delivery work, and link findings to plans. Compose with the then-current roadmap skill for review-record lifecycle rather than owning retention itself. Validate and forward-test the skill against the dotfiles assessment; it must guide a review rather than substitute automated judgment for one.

## Waiting for

Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.

## Future

Speculative or not yet scoped — items marked _(candidate)_ need a scoping pass (or a decision to drop them) before they're actionable.

### Separate Knowledge Islands policy from portable governance _(candidate)_

Write a compact boundary matrix separating portable contract, Knowledge Islands estate policy, and runtime binding. Do not split standards or redesign composition unless the matrix exposes a concrete ownership conflict.

### Roll Feature Definitions out across the repository fleet _(candidate)_

Select one named repository with externally visible behaviour and an owner, then pilot the format there. Do not begin fleet rollout before that pilot exists.

### Review the skill dependency graph and implementation quality _(candidate)_

Build one complete dependency graph for every skill relationship: declared composition and `implies:` edges, documentation and reference links, configuration ownership, subprocess or import edges, and generated or vendored runtime dependencies. Use it to review skills in dependency order from roots to dependants, covering each skill's `SKILL.md`, references, scripts, tests, and generated surfaces. Prefer executable, versioned source files inside the skill — including schemas — referenced from documentation, rather than making Markdown code blocks the only source of truth; retain short examples only where they clarify use. Record concrete repairs as separately scoped plans rather than turning this review into an unbounded rewrite.

### Add engineering change value profiles to the verb map _(candidate)_

Define a compact, evidence-backed way to compare engineering changes without collapsing them into one misleading score. The profile should cover new capability, comprehensibility, maintenance reduction from duplicated or divergent implementation, reliability and risk reduction, leverage across repositories or agents, and delivery cost and reversibility. Decide which dimensions belong on each work verb or plan, how claims become measurable evidence, and how the profile informs roadmap ordering without becoming ceremony for small fixes.
