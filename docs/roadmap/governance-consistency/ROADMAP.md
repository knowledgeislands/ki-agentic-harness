# Governance consistency roadmap

## Blocking

Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.

## Next

Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.

## Soon

Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.

### Rename the universal `INIT` mode to Educate

Migrate the universal governance mode from `INIT` to **Educate** across skill contracts, vendored runners, agent and CLI invocation guidance, documentation, tests, and generated artifacts. Establish the compatibility approach before implementation, so the vocabulary changes consistently across the harness and its repository fleet rather than becoming a documentation-only alias.

### Codify convention placement and the knowledge-promotion loop

Define the runtime-neutral ladder that prevents useful knowledge becoming trapped in session or project memory: ephemeral agent memory → project guidance or an on-demand `docs/guides/agents/` document → shared governance or reference material → a reusable skill. For each rung, state what belongs there, the evidence that triggers promotion, the durable destination, and the reconciliation step that removes or redirects the lower-layer duplicate. Keep `AGENTS.md` as the portable orientation, reserve runtime files such as `CLAUDE.md` for runtime-specific imports and guidance, and route genuinely personal cross-project conventions to synchronized user configuration.

## Waiting for

Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.

## Future

Speculative or not yet scoped — items marked _(candidate)_ need a scoping pass (or a decision to drop them) before they're actionable.

### Separate Knowledge Islands policy from portable governance _(candidate)_

Identify which rules are universal enough to ship as portable governance and which are Knowledge Islands estate policy. Make the boundary explicit without duplicating standards or weakening the current composition model.

### Enforce cross-artifact reference integrity mechanically _(candidate)_

Scope a narrow drift check for identifiers, links, composition declarations, and generated indexes that can be validated without judgment. Do not turn this into a general prose-consistency engine.

### Roll Feature Definitions out across the repository fleet _(candidate)_

Once the local standard is stable, identify repositories whose externally visible behaviour benefits from governed requirements, then pilot the format before any fleet-wide adoption.
