/**
 * Eval scenarios for the `ki-tokenomics` skill — the standing context
 * surface + runtime levers.
 *
 * Design note: a capable model already knows generic "trim your prompt" advice, so
 * testing that shows "no difference". These scenarios target house-ARBITRARY specifics a
 * baseline cannot derive: the seeded compression tool and how the checker detects it, the
 * WARN-not-FAIL budget posture and where the numbers live, and the two-layer composition
 * the audit measures by design.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-tokenomics',
    id: 'tok-headroom',
    prompt:
      'In our Knowledge Islands tokenomics standard, which context-compression tool is the seeded default, what is its posture (required / recommended / off), and how does the checker detect it?',
    assertions: [
      { name: 'Headroom', re: /headroom/i },
      { name: 'recommended posture', re: /recommended/i },
      { name: 'detection signal', re: /headroom_(compress|retrieve|stats)|mcpServers|HEADROOM_/i }
    ],
    rubric:
      'House fact: the seeded context-compression entry is **Headroom** (the chopratejas / extraheadroom compression proxy / MCP server). The house default treats one such layer as **recommended** (not required, not off) — the posture is declared per environment. The checker detects it across both config layers via an `mcpServers` `headroom` entry exposing `headroom_compress` / `headroom_retrieve` / `headroom_stats`, a `headroom proxy`, or `HEADROOM_*` env. A correct answer names Headroom, says recommended, and names at least one detection signal. The registry is extensible (other projects can be added).'
  },
  {
    skill: 'ki-tokenomics',
    id: 'tok-budget-posture',
    prompt:
      'When auditing tokenomics in a Knowledge Islands repo, is a token-budget overage a FAIL or a WARN, where are the budgets configured, and where do the volatile numbers (model ids, prices, cache TTLs, context-window sizes) come from?',
    assertions: [
      { name: 'overage is WARN not FAIL', re: /\bWARN\b/ },
      { name: 'config table', re: /\[ki-tokenomics\]|\.ki-config\.toml/i },
      { name: 'numbers defer to claude-api', re: /claude-api/i }
    ],
    rubric:
      'House rules: a budget overage is a **WARN, never a FAIL** — the budgets are guide-rails, not gates. Budgets are configured in a `[ki-tokenomics]` table in the target\'s `.ki-config.toml` (read validate-down; `init` scaffolds the keys). The volatile reference numbers — model ids, prices, cache TTLs, context-window sizes — are deliberately NOT held in this skill; they resolve through the `claude-api` skill at runtime, and token figures here are a chars/4 estimate marked `~`, for budgeting not billing. A correct answer states WARN, names the `[ki-tokenomics]` table, and routes the numbers to `claude-api`.'
  },
  {
    skill: 'ki-tokenomics',
    id: 'tok-two-layers',
    prompt:
      'What configuration layers does our tokenomics audit measure together by design when it runs, and how do you tell the checker to look at only the project layer?',
    assertions: [
      { name: 'user-wide layer', re: /~\/\.claude|user-wide/i },
      { name: 'project-local layer', re: /project-local|project layer|\.claude|CLAUDE\.md/i },
      { name: '--no-user flag', re: /--no-user/ }
    ],
    rubric:
      'House design: tokenomics IS the **composition** of two layers, so the checker reads both by design — the **user-wide** `~/.claude` layer and the **project-local** `.claude` / `CLAUDE.md` layer (over any base in play) — and attributes cost to each. To audit the project layer alone you pass **`--no-user`** (`--user <dir>` points the user layer elsewhere for testing). A correct answer names both layers and the `--no-user` flag.'
  }
]
