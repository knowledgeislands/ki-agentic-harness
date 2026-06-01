/**
 * Eval scenarios for the `knowledgeislands-mcp` skill — the workspace MCP standard.
 *
 * Design note: a capable model already follows generic good MCP practice (sensible
 * tool names, config injection, fail-safe gating) — testing those shows "no
 * difference" because the baseline knows them too. So these scenarios target
 * house-ARBITRARY specifics a model cannot derive: the exact annotation-preset
 * names, the access-level env var + default, and the `bun test` trap. Those are
 * what the skill genuinely owns.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'knowledgeislands-mcp',
    id: 'mcp-annotation-presets',
    prompt:
      'In our workspace MCP servers, every tool sets its `annotations` to one of a fixed set of named presets (from utils/annotations.ts) that the access gate reads. What are those preset names?',
    assertions: [
      { name: 'READ_ONLY', re: /READ_ONLY/ },
      { name: 'WRITE_IDEMPOTENT', re: /WRITE_IDEMPOTENT/ },
      { name: 'DESTRUCTIVE_ONESHOT', re: /DESTRUCTIVE_ONESHOT/ }
    ],
    rubric:
      'House API (utils/annotations.ts): the annotation presets are READ_ONLY, WRITE, WRITE_IDEMPOTENT, DESTRUCTIVE, DESTRUCTIVE_ONESHOT, plus _REMOTE variants. DESTRUCTIVE_ONESHOT is for tools whose end state depends on current FS/index state. A correct answer names these specific presets (not invented ones).'
  },
  {
    skill: 'knowledgeislands-mcp',
    id: 'mcp-access-env',
    prompt: "What environment variable sets a workspace MCP server's access level, what is its default, and how do the levels nest?",
    assertions: [
      { name: 'MCP_<APP>_ACCESS_LEVEL env var', re: /MCP_[A-Z<][^\s`]*ACCESS_LEVEL/ },
      { name: 'default read', re: /default[^.\n]{0,20}\bread\b|\bread\b[^.\n]{0,20}default/i },
      { name: 'read ⊂ write ⊂ destructive', re: /read[^.\n]{0,20}write[^.\n]{0,20}destructive/i }
    ],
    rubric:
      'House rule: access level comes from env `MCP_<APP>_ACCESS_LEVEL` (e.g. MCP_GIT_ACCESS_LEVEL), default `read`; levels nest read ⊂ write ⊂ destructive, and a tool registers only when its annotation-derived level ≤ the configured level. A correct answer gives the MCP_<APP>_ACCESS_LEVEL var, the read default, and the nesting.'
  },
  {
    skill: 'knowledgeislands-mcp',
    id: 'mcp-bun-test-trap',
    prompt: 'In our MCP repos there is a known trap with `bun test` vs `bun run test`. What is it, and what must the package.json `test` script be?',
    assertions: [
      { name: 'bun test invokes Bun’s own runner', re: /bun test[^.\n]{0,60}(bun.?s own|built-?in|native|its own) (test )?runner|Bun.?s (own )?runner/i },
      { name: 'test script must be vitest run', re: /vitest run/ }
    ],
    rubric:
      "House trap: `bun run test` runs vitest (correct), but bare `bun test` silently invokes Bun's OWN test runner — so the package.json `test` script must be `vitest run`, and nothing should call `bun test`. A correct answer explains the bun-test-runner trap and that the script must be `vitest run`."
  }
]
