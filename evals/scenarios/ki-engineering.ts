/**
 * Eval scenarios for the `ki-engineering` skill — the common toolchain
 * + enforcement framework.
 *
 * Design note: a capable model already knows generic TS/Bun hygiene (lint, test,
 * tsconfig strictness), so testing those shows "no difference". These scenarios target
 * house-ARBITRARY specifics a baseline cannot derive: the exact required script families,
 * the cli-chmod rule (chmod the CLI bin, never the server bin), and the
 * common-vs-artifact composition that defines how a repo is audited.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-engineering',
    id: 'eng-script-families',
    prompt:
      'In our Knowledge Islands TypeScript/Bun repos, which prefixed package.json script families must every repo carry, and how does the standard treat repo-specific scripts beyond them?',
    assertions: [
      { name: 'ki:lint:* family', re: /lint:(check|fix|format|md|package|types)/ },
      { name: 'ki:deps:* family', re: /deps:(missing|unused|update)/ },
      { name: 'extras permitted', re: /(permissive|allowed|fine|not (drift|flagged)|additive)/i }
    ],
    rubric:
      'House rule: every TS/Bun repo carries the full `ki:lint:*` family (ki:lint:check, ki:lint:fix, ki:lint:format, ki:lint:md, ki:lint:package, ki:lint:types) and the `ki:deps:*` family (ki:deps:missing, ki:deps:unused, ki:deps:update), plus clean and prepare; these are exact-matched. Repo-specific extra scripts (server:*, ki:skills:*, eval, ki:repo:audit, …) are PERMITTED — the standard is strict about the families and permissive about additions. A correct answer names both families and states that extra scripts are fine, not drift.'
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
      { name: 'engineering common layer', re: /engineering[^.\n]{0,40}(common|toolchain)|audit-engineering/i },
      { name: 'mcp delta', re: /audit-mcp|MCP delta/i },
      { name: 'composed / both / in sequence', re: /(compose|both|sequence|in turn|then)/i }
    ],
    rubric:
      "House architecture: `ki-engineering` owns the common toolchain (package.json families, the `bun test` trap, tsconfig/biome/vitest with 100% coverage, .env, the cli-chmod rule); `ki-mcp` owns only the MCP delta (src/ layout, bin/exports, tool naming, the coverage-exclude list). A repo is audited by COMPOSING the two — run `ki:engineering:audit` (common) then `audit-mcp.ts` (delta), by running them in sequence, not by importing one another — and is clean only when both pass. A correct answer identifies the two layers/checkers and that they compose."
  }
]
