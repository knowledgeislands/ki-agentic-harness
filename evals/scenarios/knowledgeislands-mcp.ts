/**
 * Eval scenarios for the `knowledgeislands-mcp` skill — the workspace MCP standard.
 *
 * Design note: a capable model already follows generic good MCP practice (sensible
 * tool names, config injection, fail-safe gating) — testing those shows "no
 * difference" because the baseline knows them too. So these scenarios target
 * house-ARBITRARY specifics a model cannot derive: the exact annotation-preset
 * names, the access-level env var + default, and the `<app>_<resource>_<action>`
 * tool-naming convention. Those are what the skill genuinely owns.
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
    // Replaces the former `mcp-bun-test-trap` scenario — that leaned on general
    // Bun knowledge (Bun has its own test runner) a baseline partly shares. This
    // targets the house-ARBITRARY tool-naming convention the skill owns, which a
    // baseline cannot derive (the specific `<app>_<resource>_<action>` shape, the
    // per-repo fixed `<app>`, and the CLI-mirrors-tools rule).
    skill: 'knowledgeislands-mcp',
    id: 'mcp-tool-naming',
    prompt: 'What is the tool-naming convention for our workspace MCP servers? Give the exact name shape, what the leading segment is, and how the CLI relates to the tool names.',
    assertions: [
      { name: '<app>_<resource>_<action> snake_case shape', re: /<?app>?_<?resource>?_<?action>?|app[^.\n]{0,18}resource[^.\n]{0,18}action/i },
      { name: 'snake_case', re: /snake[_ ]?case/i },
      { name: '<app> fixed per repo', re: /(fixed|one|same)[^.\n]{0,25}per (repo|server)|per (repo|server)[^.\n]{0,15}(app|prefix)/i },
      { name: 'CLI verb surface mirrors the tool names', re: /CLI[^.\n]{0,40}mirror|mirror[^.\n]{0,40}(tool|MCP|name)/i }
    ],
    rubric:
      'House convention: workspace MCP tools are named `<app>_<resource>_<action>` in snake_case; `<app>` is FIXED per repo (git, kb, gmail, m365, claude_code/claude_desktop/vscode, voicenotes); metadata/lifecycle tools may drop the resource segment (e.g. gmail_auth_start, m365_about); and the CLI verb surface MIRRORS the tool names (same resource/action structure). A correct answer gives the `<app>_<resource>_<action>` snake_case shape, the per-repo-fixed `<app>`, and the CLI-mirrors-tools relationship.'
  }
]
