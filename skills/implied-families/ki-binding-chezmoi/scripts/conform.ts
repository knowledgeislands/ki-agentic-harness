#!/usr/bin/env bun
/**
 * ki-binding-chezmoi CONFORM — the write-pass twin of audit.ts.
 *
 *   bun scripts/conform.ts [chezmoi-repo]
 *   --dry-run                      # report only, write nothing
 *   --json                         # emit the checker-contract wrapper instead of prose
 *
 * The render path scaffolds NO target-repo file of its own (so no `owns:` frontmatter —
 * SHAPE-16). Its write pass is a composition: run each composed sibling's CONFORM in sequence,
 * then hand off the render step (edit `.chezmoidata`, then `chezmoi apply`) as a TODO — a
 * `chezmoi apply` mutates real surface configs and is never fired blindly from here. This
 * mirrors ki-binding, whose file-editable surfaces are conformed through chezmoi, not by a
 * script hand-editing a rendered config.
 *
 * Exit code is non-zero only on an unrecoverable error (target path missing); never because
 * judgment / render items remain outstanding.
 */
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

const argv = process.argv.slice(2)
const positional = argv.find((a) => !a.startsWith('-'))
const target = positional ? resolve(positional) : '.'
const STD = 'references/standards.md'
const rubricPath = new URL('../references/rubric.md', import.meta.url).pathname

if (positional && !existsSync(target)) {
  const findings: CheckerFinding[] = [{ type: 'M', level: 'FAIL', code: 'BINDCHEZ-1', message: `No such path: ${target}`, ref: STD }]
  findings.push(...judgmentFindingsFromRubric(rubricPath))
  emitCheckerReporter({ mode: 'conform', concern: 'binding-chezmoi', target, findings })
  process.exit(checkerReporterExitCode(findings))
}

const findings: CheckerFinding[] = []
const rec = (level: CheckerFinding['level'], code: string, message: string, ref?: string, file?: string): void =>
  void findings.push({ type: 'M', level, code, message, ref, file })

// ── composition handoff — printed, never auto-applied ──
// Each composed sibling owns its own write pass; the render step is a manual chezmoi apply.
const todos = [
  ['BINDCHEZ-1', 'Run `/ki-dotfiles-chezmoi CONFORM <chezmoi-repo>` — bring the chezmoi source repo into house shape first.'],
  ['BINDCHEZ-2', 'Run `/ki-binding CONFORM` — reconcile the surfaces (Code / Desktop / mcporter via the render, Cowork directly).'],
  ['BINDCHEZ-3', 'Ensure the chezmoi repo carries the MCP source data (`.chezmoidata/*mcp*`) and the `mcp-servers-json` render template.'],
  [
    'BINDCHEZ-6',
    'Render: edit the MCP source, preview with `chezmoi diff`, then `chezmoi apply` — never hand-edit a rendered surface config.'
  ]
] as const

for (const [area, msg] of todos) rec('ADVISORY', area, `${msg} (manual — not auto-applied)`, STD)

findings.push(...judgmentFindingsFromRubric(rubricPath))
emitCheckerReporter({ mode: 'conform', concern: 'binding-chezmoi', target, findings })
process.exit(checkerReporterExitCode(findings))
