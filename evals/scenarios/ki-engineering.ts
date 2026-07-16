/**
 * Eval scenarios for the `ki-engineering` skill — the common toolchain
 * + enforcement framework.
 *
 * Design note: a capable model already knows generic TS/Bun hygiene (lint, test,
 * tsconfig strictness), so testing those shows "no difference". These scenarios target
 * house-ARBITRARY specifics a baseline cannot derive: the aggregate/scoped script surface,
 * internal tool execution and config-gated Vitest posture, the cli-chmod rule, and the
 * common-vs-artifact composition that defines how a repo is audited.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-engineering',
    id: 'eng-governed-entrypoints',
    prompt:
      'In our Knowledge Islands TypeScript/Bun repos, which aggregate and skill-scoped package.json entrypoints are governed, where do the code tools run, and when does the Vitest profile apply?',
    assertions: [
      { name: 'aggregate audit/conform', re: /ki:audit[^.\n]{0,60}ki:conform|ki:conform[^.\n]{0,60}ki:audit/ },
      { name: 'skill-scoped engineering', re: /ki:engineering:(audit|conform)/ },
      { name: 'code tools internal', re: /(Biome|TypeScript|tsc)[^.\n]{0,80}(inside|internal|direct)|inside[^.\n]{0,80}(Biome|TypeScript|tsc)/i },
      { name: 'runner-neutral test', re: /(bare|runner-neutral)[^.\n]{0,30}`?test`?/i },
      { name: 'Vitest config-gated', re: /vitest\.config[^.\n]{0,50}(gate|select|present|carry|when)/i }
    ],
    rubric:
      'House rule: every governed repo exposes aggregate `ki:audit` and `ki:conform`, with derived scoped entrypoints such as `ki:engineering:audit`/`conform` and `ki:authoring:audit`/`conform`. Biome, TypeScript, syncpack, and knip run directly inside the engineering modes; Markdown tools run inside authoring. Tests use the runner-neutral bare `test` idiom. The canonical Vitest scripts, globals, and 100% coverage profile apply only when `vitest.config.*` selects Vitest. The former per-tool script families are retired. A correct answer covers all four parts.'
  },
  {
    skill: 'ki-engineering',
    id: 'eng-cli-chmod',
    prompt: 'In our repos that compile to dist/, what is the rule for what the `build` script chmods +x — and what must it NOT chmod?',
    assertions: [
      { name: 'chmod dist/cli/cli.js', re: /dist\/cli\/cli\.js/ },
      { name: 'iff src/cli exists', re: /(iff|only if|when)[^.\n]{0,30}src\/cli|src\/cli[^.\n]{0,30}(exist|present)/i },
      { name: 'never the server/mcp-server bin', re: /(not|never|no)[^.\n]{0,40}(server|mcp-server)[^.\n]{0,12}bin|(server|mcp-server)[^.\n]{0,20}(not|never|no) chmod/i }
    ],
    rubric:
      'House rule (a deliberate decision): the `build` script chmods `dist/cli/cli.js` **iff** `src/cli/` exists, and chmods NOTHING ELSE — in particular not the server / `dist/mcp-server/index.js` bin (package managers set +x on bin at install, and launchers run via `node`). A correct answer states chmod dist/cli/cli.js only when src/cli/ exists, and that the mcp-server/server bin must NOT be chmodded.'
  },
  {
    skill: 'ki-engineering',
    id: 'eng-composition',
    prompt: 'How is a workspace MCP repo fully audited under our standards — which checkers run, what does each own, and how do they compose?',
    assertions: [
      { name: 'engineering common layer', re: /engineering[^.\n]{0,40}(common|toolchain)|ki:engineering:audit/i },
      { name: 'mcp delta', re: /ki:mcp:audit|MCP delta/i },
      { name: 'composed / both / in sequence', re: /(compose|both|sequence|in turn|then)/i }
    ],
    rubric:
      "House architecture: `ki-engineering` owns the common toolchain (aggregate/scoped script surface, direct code-tool checks, the `bun test` trap, tsconfig/biome, config-gated Vitest, .env, and the cli-chmod rule); `ki-mcp` owns only the MCP delta (src/ layout, bin/exports, tool naming, and conditional coverage exclusions). The aggregate composes `ki:engineering:audit` (common) and `ki:mcp:audit` (delta) in sequence, and the repo is clean only when both pass. A correct answer identifies the two layers/checkers and that they compose."
  }
]
