#!/usr/bin/env bun
/**
 * Mechanical CONFORM for the ki-skills rubric — fixes the subset of
 * audit.ts's findings that are unambiguous and reversible, leaving
 * everything that needs a human call as a printed manual TODO.
 *
 * Scope: every skill under a target's `skills/` dir (a single skill dir, or a
 * dir containing skills), matching the house conform shape (conform.ts,
 * conform.ts) — `bun conform.ts [path]` / `ki:skills:conform`.
 * Shared file discovery lives in `scripts/rubric/contexts/skill-files.ts`, which is
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
import { auditRubricItems, conformRubricItems, type ConformAction, type RubricFinding } from './lib/rubric/rubric.ts'
import { RUBRIC_ITEMS } from './rubric/items/index.ts'
import { FRONTMATTER } from './rubric/items/frontmatter.ts'
import { KI_SHAPE } from './rubric/items/ki-shape.ts'
import { LAYOUT } from './rubric/items/layout.ts'
import { NAME } from './rubric/items/name.ts'
import { createKiShapeContext, type KiSkillsConformContext } from './rubric/contexts/contexts.ts'
import { frontmatterLine, insertFrontmatterLine, parseFrontmatter, replaceFrontmatterScalar } from './rubric/contexts/frontmatter.ts'
import { discoverSkillDirs, listMarkdownFiles } from './rubric/contexts/skill-files.ts'
import { hintVerbs, isProcessSkill } from './rubric/contexts/modes.ts'

export const findingsFromConformActions = <Context>(actions: readonly ConformAction<Context>[]): RubricFinding[] =>
  actions.map((action) => ({
    type: 'M',
    level: action.level ?? 'POLISH',
    code: action.item.code,
    message: action.message,
    subject: action.subject
  }))

// Each action records a typed domain finding. The canonical reporter owns transport;
// the bootstrap aggregate is the only terminal renderer.
const argv = process.argv.slice(2)
const findings: RubricFinding[] = []
const recordActions = <Context>(actions: readonly ConformAction<Context>[]): boolean => {
  findings.push(...findingsFromConformActions(actions))
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
    recordActions(conformRubricItems(LAYOUT, { missingSkillRoot: true }))
    return
  }
  const content = readFileSync(skillMdPath, 'utf8')
  const frontmatter = parseFrontmatter(content)
  const block = frontmatter.raw
  if (block === null || !frontmatter.isMapping) {
    recordActions(conformRubricItems(FRONTMATTER, { hasBlock: block !== null, isMapping: frontmatter.isMapping }))
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

  const createContext = (): KiSkillsConformContext => {
    const currentFrontmatter = parseFrontmatter(`---\n${workingBlock}\n---`)
    const nameLine = frontmatterLine(workingBlock, 'name')
    return {
      name: {
        name: currentFrontmatter.keys.get('name'),
        directoryName: dirName,
        setName: (name) => {
          if (nameLine) workingBlock = workingBlock.replace(nameLine, `name: ${name}`)
        }
      },
      shape: createKiShapeContext({
        skill: conformSkillEvidence(workingBlock, stableEvidence),
        setArgumentHint: (argumentHint) => {
          workingBlock = replaceFrontmatterScalar(workingBlock, 'argument-hint', argumentHint)
        },
        setVendors: (vendors) => {
          const line = frontmatterLine(workingBlock, 'vendors')
          const replacement = `vendors: ${vendors}`
          workingBlock = line ? workingBlock.replace(line, replacement) : insertFrontmatterLine(workingBlock, replacement)
        }
      })
    }
  }

  fixedAny = recordActions(conformRubricItems(NAME, createContext().name)) || fixedAny

  fixedAny = recordActions(conformRubricItems(KI_SHAPE, createContext().shape)) || fixedAny

  if (fixedAny) {
    if (!dryRun) writeFileSync(skillMdPath, content.replace(block, workingBlock))
  }

  // Markdown link targets
  for (const file of listMarkdownFiles(dir)) {
    const md = readFileSync(file, 'utf8')
    const rel = file.slice(dir.length + 1)
    recordActions(conformRubricItems(LAYOUT, { markdown: md, subject: rel, writeMarkdown: (fixed) => !dryRun && writeFileSync(file, fixed) }))
  }
}

// --- entry -------------------------------------------------------------------
const main = (): void => {
  const dryRun = argv.includes('--dry-run')
  const target = argv.find((a) => !a.startsWith('-')) ?? '.'

  const skillDirs = discoverSkillDirs(target)
  if (skillDirs.length === 0) {
    findings.push(...auditRubricItems(LAYOUT, { noSkillsFound: true }))
    findings.push(...judgmentFindingsFromItems(RUBRIC_ITEMS))
    emitCheckerReporter({ mode: 'conform', concern: 'skills', target: resolve(target), findings })
    process.exit(checkerReporterExitCode(findings))
    return
  }

  for (const dir of skillDirs) conformSkill(dir, dryRun)

  findings.push(...judgmentFindingsFromItems(RUBRIC_ITEMS))
  emitCheckerReporter({ mode: 'conform', concern: 'skills', target: resolve(target), findings })
  process.exit(checkerReporterExitCode(findings))
}

main()
