<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — tokenomics

> **Generated publication.** TypeScript rubric items under `scripts/rubric/items/` are canonical.

## COMP — Composition and attribution

→ [standard](standards.md)

Layer composition and attribution.

- **COMP-1 [M] — Layers are read and reported** — Both configuration layers are read and reported. (standards.md)
- **COMP-2 [M] — Costs are attributed** — Every cost is attributed to its configuration layer. (standards.md)
- **COMP-3 [J] — Recommendations land in the right layer** — Does each recommendation account for where the cost lives? (standards.md)
  - _Review prompt:_ Does each recommendation account for where the cost lives?

## SURF — Standing-surface inventory

→ [standard](standards.md)

Standing context inventory.

- **SURF-1 [M] — Instruction files and imports are measured** — Each instruction file resolves imports and reports its size. (standards.md)
- **SURF-2 [M] — Memory indices are measured** — Memory indices and locatable memory files are measured. (standards.md)
- **SURF-3 [M] — Skill descriptions are measured** — Installed-skill descriptions are counted and summed per layer. (standards.md)
- **SURF-4 [J] — Standing instruction earns its cost** — Does each large instruction or memory entry earn its standing token cost? (standards.md)
  - _Review prompt:_ Does each large instruction or memory entry earn its standing token cost?

## MCP — MCP tool surface

→ [standard](standards.md)

MCP standing context.

- **MCP-1 [M] — MCP servers are enumerated** — Configured MCP servers are enumerated across layers. (standards.md)
- **MCP-2 [J] — MCP servers are used** — Is each configured server used by the work done here? (standards.md)
  - _Review prompt:_ Is each configured server used by the work done here?
- **MCP-3 [J] — MCP tool sets are minimal** — Are broad server tool sets curated or dynamically discovered? (standards.md)
  - _Review prompt:_ Are broad server tool sets curated or dynamically discovered?

## BUDG — Budgets

→ [standard](standards.md)

Budget evidence and review.

- **BUDG-1 [M] — Component budgets are compared** — Each component is compared with its declared budget. (standards.md)
- **BUDG-2 [M] — Total budget is compared** — The standing total is compared with the total budget. (standards.md)
- **BUDG-3 [J] — Overages are deliberate** — Is a sustained overage fixed or deliberately recorded? (standards.md)
  - _Review prompt:_ Is a sustained overage fixed or deliberately recorded?

## RUN — Runtime levers

→ [standard](standards.md)

Runtime token-cost levers.

- **RUN-1 [J] — Prompt caching is effective** — Is the stable prefix cacheable and being hit? (standards.md)
  - _Review prompt:_ Is the stable prefix cacheable and being hit?
- **RUN-2 [J] — Model type matches work value** — Does the declared model type match the work value? (standards.md)
  - _Review prompt:_ Does the declared model type match the work value?
- **RUN-3 [J] — Conversation growth is controlled** — Are compaction and sub-agent fan-out proportionate? (standards.md)
  - _Review prompt:_ Are compaction and sub-agent fan-out proportionate?
- **RUN-4 [J] — Tool verbosity is controlled** — Are raw tool results prevented from bloating context? (standards.md)
  - _Review prompt:_ Are raw tool results prevented from bloating context?
- **RUN-5 [M] — Pinned model is reported** — A default model pinned in settings is reported. (standards.md)

## TOOL — Compression tooling

→ [standard](standards.md)

Context compression tooling.

- **TOOL-1 [M] — Compression tooling is detected** — Configured context-compression tooling is detected. (standards.md)
- **TOOL-2 [M] — Compression expectation is honoured** — The declared Headroom expectation is honoured. (standards.md)
- **TOOL-3 [J] — Compression setup is optimal** — Where present, is the compression setup optimal? (standards.md)
  - _Review prompt:_ Where present, is the compression setup optimal?
- **TOOL-4 [M] — Learned captures are local** — The Headroom learned block contains no cross-repository captures. (standards.md)
- **TOOL-5 [M] — Proxy traffic is attributed** — Local Headroom proxy traffic is attributed to the repository. (standards.md)

## CFG — Configuration table

→ [standard](standards.md)

Tokenomics configuration table.

- **CFG-1 [M] — Config validates down** — The ki-tokenomics configuration table is parsed and validated down. (standards.md)
- **CFG-2 [M] — Education emits defaults** — Education emits the default configuration keys. (standards.md)
- **CFG-3 [J] — Configuration is warranted** — Are budgets and expectations warranted for this environment? (standards.md)
  - _Review prompt:_ Are budgets and expectations warranted for this environment?
- **CFG-4 [M] — Portable model type is declared** — A portable preferred model type is declared. (standards.md)
- **CFG-5 [M] — Model bindings are valid** — Optional model-tier bindings have valid keys and non-empty values. (standards.md)
