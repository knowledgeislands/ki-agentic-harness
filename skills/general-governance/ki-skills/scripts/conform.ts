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
import {
  auditRubricItems,
  type ConformAction,
  findingsFromConformActions,
  type RubricFinding,
  type RubricLevel
} from './lib/rubric/rubric.ts'
import { RUBRIC_ITEMS } from './rubrics/index.ts'
import { createKiShapeContext, KI_SHAPE_11, KI_SHAPE_12, KI_SHAPE_15 } from './rubrics/ki-shape.ts'
import { FM_1 } from './rubrics/frontmatter.ts'
import { LAYOUT, LAY_4 } from './rubrics/layout.ts'
import { NAME_1, NAME_5 } from './rubrics/name.ts'
import { frontmatterLine, insertFrontmatterLine, parseFrontmatter, replaceFrontmatterScalar } from './rubrics/support/frontmatter.ts'
import { hintVerbs, isProcessSkill } from './rubrics/support/modes.ts'
import { discoverSkillDirs, listMarkdownFiles } from './rubrics/support/skill-files.ts'

// Each action records a typed domain finding. The canonical reporter owns transport;
// the bootstrap aggregate is the only terminal renderer.
const RUBRIC = 'references/rubric.md'
const argv = process.argv.slice(2)
const findings: RubricFinding[] = []
const rec = (level: RubricLevel, code: string, message: string, ref?: string, file?: string): void =>
  void findings.push({ type: 'M', level, code, message, ref, file })
const recordActions = <Context>(actions: readonly ConformAction<Context>[]): boolean => {
  findings.push(...findingsFromConformActions(actions, RUBRIC))
  return actions.some((action) => action.level !== 'ADVISORY')
}

const conformSkillEvidence = (block: string, stableEvidence: { governanceSkill: boolean; scriptNames: string[] }) => {
  const frontmatter = parseFrontmatter(`---\n${block}\n---`)
  const argumentHint = frontmatter.keys.get('argument-hint')
  return {
    ...stableEvidence,
    argumentHint,
    hintVerbs: hintVerbs(argumentHint ?? ''),
    vendorsPresent: frontmatter.present.has('vendors'),
    vendors: frontmatter.keys.get('vendors')?.trim() ?? ''
  }
}

// --- one skill ---------------------------------------------------------------
const conformSkill = (dir: string, dryRun: boolean): void => {
  const skillMdPath = join(dir, 'SKILL.md')
  const dirName = basename(dir)
  if (!existsSync(skillMdPath)) {
    for (const finding of auditRubricItems(LAYOUT, { missingSkillRoot: true })) {
      rec('ADVISORY', finding.code, 'no SKILL.md — author by hand', RUBRIC, 'SKILL.md')
    }
    return
  }
  const content = readFileSync(skillMdPath, 'utf8')
  const frontmatter = parseFrontmatter(content)
  const block = frontmatter.raw
  if (block === null || !frontmatter.isMapping) {
    const issue = block === null ? 'no YAML frontmatter block' : 'YAML frontmatter is not a mapping'
    rec('ADVISORY', FM_1.code, `${issue}; author by hand`, RUBRIC, 'SKILL.md')
    return
  }

  let workingBlock = block
  let fixedAny = false
  const process = isProcessSkill(content)
  const scriptsDir = join(dir, 'scripts')
  const stableEvidence = {
    governanceSkill: !process,
    scriptNames: existsSync(scriptsDir) ? readdirSync(scriptsDir) : []
  }

  // Name frontmatter
  const nameLine = frontmatterLine(workingBlock, 'name')
  if (nameLine) {
    const nameVal = frontmatter.keys.get('name') ?? ''
    const actions = NAME_5.conform?.({
      name: nameVal,
      directoryName: dirName,
      setName: (name) => {
        workingBlock = workingBlock.replace(nameLine, `name: ${name}`)
      }
    })
    fixedAny ||= recordActions(actions ?? [])
  } else {
    rec('ADVISORY', NAME_1.code, 'no `name` field at all; author by hand', RUBRIC, 'SKILL.md')
  }

  // Argument-hint frontmatter
  const hintLine = frontmatterLine(workingBlock, 'argument-hint')
  if (hintLine) {
    for (const item of [KI_SHAPE_11, KI_SHAPE_12]) {
      const actions = item.conform?.({
        ...createKiShapeContext({
          skill: conformSkillEvidence(workingBlock, stableEvidence),
          setArgumentHint: (argumentHint) => {
            workingBlock = replaceFrontmatterScalar(workingBlock, 'argument-hint', argumentHint)
          }
        })
      })
      fixedAny ||= recordActions(actions ?? [])
    }
  } else if (!process) {
    rec('ADVISORY', KI_SHAPE_11.code, 'no `argument-hint` field at all; author one by hand', RUBRIC, 'SKILL.md')
  }

  // Vendor frontmatter
  const vendorActions =
    KI_SHAPE_15.conform?.({
      ...createKiShapeContext({
        skill: conformSkillEvidence(workingBlock, stableEvidence),
        setVendors: (vendors) => {
        const line = frontmatterLine(workingBlock, 'vendors')
        const replacement = `vendors: ${vendors}`
        workingBlock = line ? workingBlock.replace(line, replacement) : insertFrontmatterLine(workingBlock, replacement)
        }
      })
    }) ?? []
  fixedAny ||= recordActions(vendorActions)

  if (fixedAny) {
    if (!dryRun) writeFileSync(skillMdPath, content.replace(block, workingBlock))
  }

  // Markdown link targets
  for (const file of listMarkdownFiles(dir)) {
    const md = readFileSync(file, 'utf8')
    const rel = file.slice(dir.length + 1)
    const actions = LAY_4.conform?.({ markdown: md, file: rel, writeMarkdown: (fixed) => !dryRun && writeFileSync(file, fixed) })
    recordActions(actions ?? [])
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

  for (const dir of skillDirs) conformSkill(dir, dryRun)

  findings.push(...judgmentFindingsFromItems(RUBRIC_ITEMS, RUBRIC))
  emitCheckerReporter({ mode: 'conform', concern: 'skills', target: resolve(target), findings })
  process.exit(checkerReporterExitCode(findings))
}

main()
