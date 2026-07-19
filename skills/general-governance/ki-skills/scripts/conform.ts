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
 *   - KI-SHAPE-11: argument-hint missing the `help` token gets ` | help` appended.
 *   - KI-SHAPE-12 (verbs): argument-hint missing any of audit/conform/help/educate/
 *     refresh (skipped for self-declared process skills, ADR-KI-HARNESS-SKILLS-006)
 *     gets the missing verb(s) appended as bare ` | <verb>` segments.
 *   - KI-SHAPE-15: `vendors:` is set to its uniform current-contract list only
 *     when all three required bare entry scripts already exist.
 *   - LAY-4: backslash path separators inside markdown link targets are
 *     rewritten to forward slashes, across every .md file in the skill.
 *
 * Deliberately NEVER touches (judgment -> manual TODOs): DESC-1/2/3, KI-SHAPE-13
 * (mode-heading structure), SIZE-1/2, KI-LINK-2, KI-SHAPE-2/7/8/9, REF-3, COLL-1,
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
import { KI_SHAPE_11, KI_SHAPE_12, KI_SHAPE_15, type KiShapeRubricContext } from './rubrics/ki-shape.ts'
import { FM_1 } from './rubrics/frontmatter.ts'
import { LAY_4 } from './rubrics/layout.ts'
import { NAME_1, NAME_5 } from './rubrics/name.ts'
import { discoverSkillDirs, listMarkdownFiles } from './rubrics/support/skill-files.ts'

// Each action records a typed domain finding. The canonical reporter owns transport;
// the bootstrap aggregate is the only terminal renderer.
type Level = 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS'
const RUBRIC = 'references/rubric.md'
const argv = process.argv.slice(2)
const findings: RubricFinding[] = []
function reportCode(area: string): string {
  return area.match(/[A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*-\d+/)?.[0] ?? 'KI-SHAPE-12'
}
const rec = (level: Level, area: string, message: string, ref?: string, file?: string): void =>
  void findings.push({ type: 'M', level, code: reportCode(area), message, ref, file })

const isProcessSkill = (desc: string): boolean => /\(kind:\s*process\b/i.test(desc)
type BunYamlRuntime = { Bun: { YAML: { parse: (source: string) => unknown } } }

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

function isYamlMapping(block: string): boolean {
  try {
    const parsed = (globalThis as typeof globalThis & BunYamlRuntime).Bun.YAML.parse(block)
    return Boolean(parsed && typeof parsed === 'object' && !Array.isArray(parsed))
  } catch {
    return false
  }
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

function argumentHintValue(line: string): string {
  const match = line.match(/^argument-hint:\s*(['"]?)([\s\S]*?)\1\s*$/)
  return match ? (match[2] as string) : line.replace(/^argument-hint:\s*/, '')
}

function withArgumentHint(block: string, argumentHint: string): string {
  const line = getLine(block, 'argument-hint')
  if (!line) return block
  const quote = line.match(/^argument-hint:\s*(['"]?)/)?.[1] || "'"
  return block.replace(line, `argument-hint: ${quote}${argumentHint.trim()}${quote}`)
}

function kiShapeContext(dir: string, block: string, content: string): KiShapeRubricContext {
  const argumentHintLine = getLine(block, 'argument-hint')
  const argumentHint = argumentHintLine ? argumentHintValue(argumentHintLine) : undefined
  const scriptsDir = join(dir, 'scripts')
  const scriptNames = existsSync(scriptsDir) ? readdirSync(scriptsDir) : []
  return {
    skill: {
      governanceSkill: !isProcessSkill(content),
      argumentHint,
      hintVerbs: hintVerbs(argumentHint ?? ''),
      vendorsPresent: getLine(block, 'vendors') !== null,
      vendors: (getLine(block, 'vendors') ?? '').replace(/^vendors:\s*/, '').trim(),
      scriptNames,
      operatingModesSection: null,
      bodyModes: new Set(),
      operatingModesIntro: '',
      flatModeHeadings: [],
      bareModeHeadings: [],
      refreshText: '',
      retiredExtensionFiles: [],
      strongGate: false,
      anchorMentioned: false,
      checkerReadsAnchor: false,
      mechanicalRubricCount: 0,
      hasChecker: false,
      documentsMechanicalDelegation: false,
      checkers: [],
      dependsOnPresent: false,
      dependsOn: '',
      owns: [],
      contributes: [],
      requires: [],
      scaffoldedFiles: [],
      auditSource: null
    },
    ownershipCollisions: []
  }
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
  if (block === null || !isYamlMapping(block)) {
    const issue = block === null ? 'no YAML frontmatter block' : 'YAML frontmatter is not a mapping'
    todos.push(`${dirName}: ${FM_1.code} — ${issue}; author by hand`)
    rec('ADVISORY', `${dirName}:${FM_1.code}`, `${issue}; author by hand`, RUBRIC, 'SKILL.md')
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

  // ── KI-SHAPE-11 (help token) + KI-SHAPE-12 (universal verbs) ──
  const hintLine = getLine(workingBlock, 'argument-hint')
  if (hintLine) {
    for (const item of [KI_SHAPE_11, KI_SHAPE_12]) {
      const actions = item.conform?.({
        ...kiShapeContext(dir, workingBlock, content),
        setArgumentHint: (argumentHint) => {
          workingBlock = withArgumentHint(workingBlock, argumentHint)
        }
      })
      for (const action of actions ?? []) {
        rec(action.level ?? 'POLISH', `${dirName}:${action.item.code}`, action.message, RUBRIC, action.file)
        fixedAny ||= action.level !== 'ADVISORY'
      }
    }
  } else if (!process) {
    todos.push(`${dirName}: KI-SHAPE-11/KI-SHAPE-12 — no \`argument-hint\` field at all; author one by hand`)
    rec('ADVISORY', `${dirName}:KI-SHAPE-11/KI-SHAPE-12`, 'no `argument-hint` field at all; author one by hand', RUBRIC, 'SKILL.md')
  }

  // ── KI-SHAPE-15 (uniform vendors) ──
  for (const action of KI_SHAPE_15.conform?.({
    ...kiShapeContext(dir, workingBlock, content),
    setVendors: (vendors) => {
      const line = getLine(workingBlock, 'vendors')
      const replacement = `vendors: ${vendors}`
      workingBlock = line ? workingBlock.replace(line, replacement) : insertAfterAnchor(workingBlock, replacement)
    }
  }) ?? []) {
    rec(action.level ?? 'POLISH', `${dirName}:${action.item.code}`, action.message, RUBRIC, action.file)
    if (action.level === 'ADVISORY') todos.push(`${dirName}: ${action.item.code} — ${action.message}`)
    else fixedAny = true
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
    const rel = file.slice(dir.length + 1)
    const actions = LAY_4.conform?.({ markdown: md, file: rel, writeMarkdown: (fixed) => !dryRun && writeFileSync(file, fixed) })
    for (const action of actions ?? []) {
      lay4Fixes++
      rec(action.level ?? 'POLISH', `${dirName}:${action.item.code}`, action.message, RUBRIC, action.file)
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
