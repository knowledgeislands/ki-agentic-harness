#!/usr/bin/env bun
/**
 * Mechanical CONFORM for the ki-skills rubric — fixes the subset of
 * audit.ts's findings that are unambiguous and reversible, leaving
 * everything that needs a human call as a printed manual TODO.
 *
 * Scope: every skill under a target's `skills/` dir (a single skill dir, or a
 * dir containing skills), matching the house conform shape (conform.ts,
 * conform.ts) — `bun conform.ts [path]` / `ki:skills:conform`.
 * Shared file discovery lives in `scripts/rubrics/support/skill-files.ts`, which is
 * private to this skill's rubric implementation rather than a vendorable module.
 *
 *   bun scripts/conform.ts [path] [--dry-run]   # default target: cwd
 *
 * Every invocation emits the canonical checker reporter. `--dry-run` governs
 * writing only, so it composes with the same machine-readable report stream.
 *
 * Fixes:
 *   - NAME-5: `name:` frontmatter rewritten to match the directory name.
 *   - SHAPE-11: argument-hint missing the `help` token gets ` | help` appended.
 *   - SHAPE-12 (verbs): argument-hint missing any of audit/conform/help/educate/
 *     refresh (skipped for self-declared process skills, ADR-KI-HARNESS-SKILLS-006)
 *     gets the missing verb(s) appended as bare ` | <verb>` segments.
 *   - SHAPE-12 (vendors leg): a missing `vendors:` frontmatter line is authored
 *     from the scripts/ directory's audit-*.ts / lint-*.ts (+ conform-*.ts if
 *     present); an existing `vendors:` line that already names an audit/lint
 *     script but omits `conform:` gets that key added when a conform-*.ts
 *     script is present in scripts/. Never invents a script path that doesn't
 *     exist on disk.
 *   - LAY-4: backslash path separators inside markdown link targets are
 *     rewritten to forward slashes, across every .md file in the skill.
 *
 * Deliberately NEVER touches (judgment -> manual TODOs): DESC-1/2/3, SHAPE-13
 * (mode-heading structure), SIZE-1/2, LINK-2, SHAPE-2/7/8/9, REF-3, COLL-1,
 * LONG-3/4.
 *
 * Zero npm dependencies (bun + node stdlib only). Exit code is non-zero only
 * on an unrecoverable setup error (no skills found); findings/fixes never
 * fail the run.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { checkerReporterExitCode, emitCheckerReporter, judgmentFindingsFromItems } from './lib/checker-reporter.ts'
import type { RubricFinding } from './lib/rubric/rubric.ts'
import { RUBRIC_ITEMS } from './rubrics/index.ts'
import { NAME_1, NAME_5 } from './rubrics/name.ts'
import { discoverSkillDirs, listMarkdownFiles } from './rubrics/support/skill-files.ts'

// Each action records a typed domain finding. The canonical reporter owns transport;
// the bootstrap aggregate is the only terminal renderer.
type Level = 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS'
const RUBRIC = 'references/rubric.md'
const argv = process.argv.slice(2)
const findings: RubricFinding[] = []
function reportCode(area: string): string {
  return area.match(/[A-Z]+-\d+/)?.[0] ?? 'SHAPE-12'
}
const rec = (level: Level, area: string, message: string, ref?: string, file?: string): void =>
  void findings.push({ type: 'M', level, code: reportCode(area), message, ref, file })

// ── kept in lockstep with audit.ts ──
const isProcessSkill = (desc: string): boolean => /\(kind:\s*process\b/i.test(desc)
const UNIVERSAL_VERBS = ['audit', 'conform', 'help', 'educate', 'refresh']

function hintVerbs(hint: string): string[] {
  const out: string[] = []
  for (const seg of hint.split('|')) {
    const m = seg.trim().match(/^[a-zA-Z][a-zA-Z0-9-]*/)
    if (m) out.push(m[0].toUpperCase())
  }
  return out
}

// --- frontmatter block access -----------------------------------------------
// Single-line scalar fields only (name, vendors, argument-hint) — the folded
// `description:` block scalar is never touched here (DESC-* stays judgment).
function frontmatterBlock(content: string): string | null {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return m ? (m[1] as string) : null
}

function getLine(block: string, key: string): string | null {
  const m = block.match(new RegExp(`^${key}:.*$`, 'm'))
  return m ? (m[0] as string) : null
}

// Insert a brand-new top-level line just after `depends-on:` (or `name:`, or at
// the very top) so a freshly-authored `vendors:` line lands in the
// conventional name/depends-on/vendors/description/argument-hint order.
function insertAfterAnchor(block: string, newLine: string): string {
  for (const anchorKey of ['depends-on', 'name']) {
    const anchor = getLine(block, anchorKey)
    if (anchor) return block.replace(anchor, `${anchor}\n${newLine}`)
  }
  return `${newLine}\n${block}`
}

// --- one skill ---------------------------------------------------------------
function conformSkill(dir: string, dryRun: boolean, todos: string[]): void {
  const skillMdPath = join(dir, 'SKILL.md')
  const dirName = basename(dir)
  if (!existsSync(skillMdPath)) {
    todos.push(`${dirName}: LAY-1 — no SKILL.md`)
    rec('ADVISORY', `${dirName}:LAY-1`, 'no SKILL.md — author by hand', RUBRIC, 'SKILL.md')
    return
  }
  const content = readFileSync(skillMdPath, 'utf8')
  const block = frontmatterBlock(content)
  if (block === null) {
    todos.push(`${dirName}: LAY-1/NAME-1 — no frontmatter block; author by hand`)
    rec('ADVISORY', `${dirName}:LAY-1/NAME-1`, 'no frontmatter block; author by hand', RUBRIC, 'SKILL.md')
    return
  }

  let workingBlock = block
  let fixedAny = false
  const process = isProcessSkill(content)

  // ── NAME-5 ──
  const nameLine = getLine(workingBlock, 'name')
  if (nameLine) {
    const nameVal = (nameLine.match(/^name:\s*(.+)$/)?.[1] ?? '').trim()
    const actions = NAME_5.conform?.({
      name: nameVal,
      directoryName: dirName,
      setName: (name) => {
        workingBlock = workingBlock.replace(nameLine, `name: ${name}`)
      }
    })
    for (const action of actions ?? []) {
      rec('POLISH', `${dirName}:${action.item.code}`, action.message, RUBRIC, action.file)
      fixedAny = true
    }
  } else {
    todos.push(`${dirName}: ${NAME_1.code} — no \`name\` field at all; author by hand`)
    rec('ADVISORY', `${dirName}:${NAME_1.code}`, 'no `name` field at all; author by hand', RUBRIC, 'SKILL.md')
  }

  // ── SHAPE-11 (help token) + SHAPE-12 (universal verbs) ──
  const hintLine = getLine(workingBlock, 'argument-hint')
  if (hintLine) {
    const hintMatch = hintLine.match(/^argument-hint:\s*(['"]?)([\s\S]*?)\1\s*$/)
    const quote = hintMatch?.[1] || "'"
    let hintVal = hintMatch ? (hintMatch[2] as string) : hintLine.replace(/^argument-hint:\s*/, '')
    let hintChanged = false

    if (!/(^|[|\s'"])help([|\s'"]|$)/.test(hintLine)) {
      hintVal = `${hintVal} | help`
      hintChanged = true
      rec('POLISH', `${dirName}:SHAPE-11`, 'appended `help` to argument-hint', RUBRIC, 'SKILL.md')
    }

    if (!process) {
      const verbs = hintVerbs(hintVal)
      const missing = UNIVERSAL_VERBS.filter((v) => !verbs.includes(v.toUpperCase()))
      if (missing.length > 0) {
        hintVal = `${hintVal} | ${missing.join(' | ')}`
        hintChanged = true
        rec('POLISH', `${dirName}:SHAPE-12`, `appended missing verb(s) to argument-hint: ${missing.join(', ')}`, RUBRIC, 'SKILL.md')
      }
    }

    if (hintChanged) {
      workingBlock = workingBlock.replace(hintLine, `argument-hint: ${quote}${hintVal.trim()}${quote}`)
      fixedAny = true
    }
  } else if (!process) {
    todos.push(`${dirName}: SHAPE-11/SHAPE-12 — no \`argument-hint\` field at all; author one by hand`)
    rec('ADVISORY', `${dirName}:SHAPE-11/SHAPE-12`, 'no `argument-hint` field at all; author one by hand', RUBRIC, 'SKILL.md')
  }

  // ── SHAPE-12 (vendors leg) — process skills are exempt, same as audit.ts ──
  if (!process) {
    const scriptsDir = join(dir, 'scripts')
    const scriptFiles = existsSync(scriptsDir) ? readdirSync(scriptsDir) : []
    const auditScript = scriptFiles.find((n) => /^(audit-|lint-)[a-z0-9-]+\.ts$/.test(n) && !n.endsWith('.test.ts'))
    const conformScript = scriptFiles.find((n) => /^conform-[a-z0-9-]+\.ts$/.test(n))

    const vendorsLine = getLine(workingBlock, 'vendors')
    if (!vendorsLine || /vendors:\s*\[\s*\]/.test(vendorsLine)) {
      if (auditScript) {
        const parts = [`audit: scripts/${auditScript}`]
        if (conformScript) parts.push(`conform: scripts/${conformScript}`)
        const newLine = `vendors: { ${parts.join(', ')} }`
        workingBlock = vendorsLine ? workingBlock.replace(vendorsLine, newLine) : insertAfterAnchor(workingBlock, newLine)
        rec('POLISH', `${dirName}:SHAPE-12`, `authored \`${newLine}\``, RUBRIC, 'SKILL.md')
        fixedAny = true
      } else if (!vendorsLine) {
        todos.push(`${dirName}: SHAPE-12 — no \`vendors:\` declaration and no scripts/audit-*.ts|lint-*.ts to point at; needs a human call`)
        rec(
          'ADVISORY',
          `${dirName}:SHAPE-12`,
          'no `vendors:` declaration and no scripts/audit-*.ts|lint-*.ts to point at; needs a human call',
          RUBRIC,
          'SKILL.md'
        )
      }
    } else if (!/\bconform:/.test(vendorsLine) && conformScript) {
      const newLine = vendorsLine.replace(/\}\s*$/, `, conform: scripts/${conformScript} }`)
      workingBlock = workingBlock.replace(vendorsLine, newLine)
      rec('POLISH', `${dirName}:SHAPE-12`, `added missing \`conform: scripts/${conformScript}\` to vendors`, RUBRIC, 'SKILL.md')
      fixedAny = true
    }
  }

  if (fixedAny) {
    if (!dryRun) writeFileSync(skillMdPath, content.replace(block, workingBlock))
  } else {
    rec('PASS', `${dirName}:frontmatter`, 'frontmatter already canonical (nothing to fix)', RUBRIC, 'SKILL.md')
  }

  // ── LAY-4: backslash link separators, across every markdown file ──
  let lay4Fixes = 0
  for (const file of listMarkdownFiles(dir)) {
    const md = readFileSync(file, 'utf8')
    let count = 0
    const fixed = md.replace(/\[([^\]]*)\]\(([^)]+)\)/g, (whole, text, target) => {
      if (!(target as string).includes('\\')) return whole
      count++
      return `[${text}](${(target as string).replace(/\\/g, '/')})`
    })
    if (count > 0) {
      lay4Fixes += count
      const rel = file.slice(dir.length + 1)
      rec('POLISH', `${dirName}:LAY-4`, `${count} backslash link target(s) → forward slashes`, RUBRIC, rel)
      if (!dryRun) writeFileSync(file, fixed)
    }
  }
  if (lay4Fixes === 0) {
    rec('PASS', `${dirName}:LAY-4`, 'no backslash link separators (nothing to fix)', RUBRIC)
  }
}

// --- entry -------------------------------------------------------------------
function main(): void {
  const dryRun = argv.includes('--dry-run')
  const target = argv.find((a) => !a.startsWith('-')) ?? '.'

  const skillDirs = discoverSkillDirs(target)
  if (skillDirs.length === 0) {
    findings.push({
      type: 'M',
      level: 'FAIL',
      code: 'LAY-1',
      message: 'No skills were found below the requested target.',
      ref: RUBRIC
    })
    findings.push(...judgmentFindingsFromItems(RUBRIC_ITEMS, RUBRIC))
    emitCheckerReporter({ mode: 'conform', concern: 'skills', target: resolve(target), findings })
    process.exit(checkerReporterExitCode(findings))
    return
  }

  const todos: string[] = []
  for (const dir of skillDirs) conformSkill(dir, dryRun, todos)

  findings.push(...judgmentFindingsFromItems(RUBRIC_ITEMS, RUBRIC))
  emitCheckerReporter({ mode: 'conform', concern: 'skills', target: resolve(target), findings })
  process.exit(checkerReporterExitCode(findings))
}

main()
