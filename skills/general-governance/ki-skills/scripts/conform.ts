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
 * Repair policy lives beside the owning rubric items. This wrapper applies only
 * their declared safe actions; it reports manual work as an advisory.
 *
 * Zero npm dependencies (bun + node stdlib only). Exit code is non-zero only
 * on an unrecoverable setup error (no skills found); findings/fixes never
 * fail the run.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { checkerReporterExitCode, emitCheckerReporter, judgmentFindingsFromItems } from './lib/checker-reporter.ts'
import type { RubricFinding, RubricItem } from './lib/rubric/rubric.ts'
import { RUBRIC_ITEMS } from './rubrics/index.ts'
import { createKiShapeContext, KI_SHAPE_11, KI_SHAPE_12, KI_SHAPE_15 } from './rubrics/ki-shape.ts'
import { FM_1 } from './rubrics/frontmatter.ts'
import { LAYOUT, LAY_4 } from './rubrics/layout.ts'
import { NAME_1, NAME_5 } from './rubrics/name.ts'
import {
  frontmatterBlock,
  frontmatterLine,
  frontmatterScalar,
  insertFrontmatterLine,
  isYamlMapping,
  replaceFrontmatterScalar
} from './rubrics/support/frontmatter.ts'
import { hintVerbs, isProcessSkill } from './rubrics/support/modes.ts'
import { discoverSkillDirs, listMarkdownFiles } from './rubrics/support/skill-files.ts'

// Each action records a typed domain finding. The canonical reporter owns transport;
// the bootstrap aggregate is the only terminal renderer.
type Level = 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS'
const RUBRIC = 'references/rubric.md'
const argv = process.argv.slice(2)
const findings: RubricFinding[] = []
const auditRubricItems = <Context>(items: readonly RubricItem<Context>[], context: Context): RubricFinding[] =>
  items.flatMap((item) => item.audit?.(context) ?? [])
const rec = (level: Level, code: string, message: string, ref?: string, file?: string): void =>
  void findings.push({ type: 'M', level, code, message, ref, file })

const conformSkillEvidence = (dir: string, block: string, content: string) => {
  const argumentHintLine = frontmatterLine(block, 'argument-hint')
  const argumentHint = argumentHintLine ? frontmatterScalar(argumentHintLine, 'argument-hint') : undefined
  const scriptsDir = join(dir, 'scripts')
  const scriptNames = existsSync(scriptsDir) ? readdirSync(scriptsDir) : []
  return {
    governanceSkill: !isProcessSkill(content),
    argumentHint,
    hintVerbs: hintVerbs(argumentHint ?? ''),
    vendorsPresent: frontmatterLine(block, 'vendors') !== null,
    vendors: frontmatterScalar(frontmatterLine(block, 'vendors') ?? 'vendors:', 'vendors').trim(),
    scriptNames
  }
}

// --- one skill ---------------------------------------------------------------
const conformSkill = (dir: string, dryRun: boolean, todos: string[]): void => {
  const skillMdPath = join(dir, 'SKILL.md')
  const dirName = basename(dir)
  if (!existsSync(skillMdPath)) {
    todos.push(`${dirName}: LAY-1 — no SKILL.md`)
    for (const finding of auditRubricItems(LAYOUT, { missingSkillRoot: true })) {
      rec('ADVISORY', finding.code, 'no SKILL.md — author by hand', RUBRIC, 'SKILL.md')
    }
    return
  }
  const content = readFileSync(skillMdPath, 'utf8')
  const block = frontmatterBlock(content)
  if (block === null || !isYamlMapping(block)) {
    const issue = block === null ? 'no YAML frontmatter block' : 'YAML frontmatter is not a mapping'
    todos.push(`${dirName}: ${FM_1.code} — ${issue}; author by hand`)
    rec('ADVISORY', FM_1.code, `${issue}; author by hand`, RUBRIC, 'SKILL.md')
    return
  }

  let workingBlock = block
  let fixedAny = false
  const process = isProcessSkill(content)

  // Name frontmatter
  const nameLine = frontmatterLine(workingBlock, 'name')
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
      rec('POLISH', action.item.code, action.message, RUBRIC, action.file)
      fixedAny = true
    }
  } else {
    todos.push(`${dirName}: ${NAME_1.code} — no \`name\` field at all; author by hand`)
    rec('ADVISORY', NAME_1.code, 'no `name` field at all; author by hand', RUBRIC, 'SKILL.md')
  }

  // Argument-hint frontmatter
  const hintLine = frontmatterLine(workingBlock, 'argument-hint')
  if (hintLine) {
    for (const item of [KI_SHAPE_11, KI_SHAPE_12]) {
      const actions = item.conform?.({
        ...createKiShapeContext({
          skill: conformSkillEvidence(dir, workingBlock, content),
          setArgumentHint: (argumentHint) => {
            workingBlock = replaceFrontmatterScalar(workingBlock, 'argument-hint', argumentHint)
          }
        })
      })
      for (const action of actions ?? []) {
        rec(action.level ?? 'POLISH', action.item.code, action.message, RUBRIC, action.file)
        fixedAny ||= action.level !== 'ADVISORY'
      }
    }
  } else if (!process) {
    todos.push(`${dirName}: KI-SHAPE-11/KI-SHAPE-12 — no \`argument-hint\` field at all; author one by hand`)
    rec('ADVISORY', KI_SHAPE_11.code, 'no `argument-hint` field at all; author one by hand', RUBRIC, 'SKILL.md')
  }

  // Vendor frontmatter
  for (const action of KI_SHAPE_15.conform?.({
    ...createKiShapeContext({
      skill: conformSkillEvidence(dir, workingBlock, content),
      setVendors: (vendors) => {
        const line = frontmatterLine(workingBlock, 'vendors')
        const replacement = `vendors: ${vendors}`
        workingBlock = line ? workingBlock.replace(line, replacement) : insertFrontmatterLine(workingBlock, replacement)
      }
    })
  }) ?? []) {
    rec(action.level ?? 'POLISH', action.item.code, action.message, RUBRIC, action.file)
    if (action.level === 'ADVISORY') todos.push(`${dirName}: ${action.item.code} — ${action.message}`)
    else fixedAny = true
  }

  if (fixedAny) {
    if (!dryRun) writeFileSync(skillMdPath, content.replace(block, workingBlock))
  }

  // Markdown link targets
  for (const file of listMarkdownFiles(dir)) {
    const md = readFileSync(file, 'utf8')
    const rel = file.slice(dir.length + 1)
    const actions = LAY_4.conform?.({ markdown: md, file: rel, writeMarkdown: (fixed) => !dryRun && writeFileSync(file, fixed) })
    for (const action of actions ?? []) {
      rec(action.level ?? 'POLISH', action.item.code, action.message, RUBRIC, action.file)
    }
  }
}

// --- entry -------------------------------------------------------------------
const main = (): void => {
  const dryRun = argv.includes('--dry-run')
  const target = argv.find((a) => !a.startsWith('-')) ?? '.'

  const skillDirs = discoverSkillDirs(target)
  if (skillDirs.length === 0) {
    findings.push(...auditRubricItems(LAYOUT, { noSkillsFound: true }).map((finding) => ({ ...finding, ref: RUBRIC })))
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
