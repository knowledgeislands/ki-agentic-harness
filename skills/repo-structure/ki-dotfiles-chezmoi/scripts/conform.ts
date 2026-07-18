#!/usr/bin/env bun
/**
 * Mechanical CONFORM for the chezmoi dotfiles-management standard.
 *
 * It creates only the derivable `.chezmoiignore` file. The locally vendored
 * canonical checker reporter emits the result stream; the aggregate renders it.
 */
import { existsSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

const STD = 'references/standards.md'
const RUBRIC = 'references/rubric.md'
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const rubricPath = existsSync(join(SCRIPT_DIR, 'references', 'rubric.md'))
  ? join(SCRIPT_DIR, 'references', 'rubric.md')
  : join(SCRIPT_DIR, '..', 'references', 'rubric.md')

function main(): void {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const target = resolve(args.find((arg) => !arg.startsWith('-')) ?? '.')
  const findings: CheckerFinding[] = []
  const record = (level: CheckerFinding['level'], code: string, message: string, ref?: string, file?: string): void => {
    findings.push({ type: 'M', level, code, message, ...(ref ? { ref } : {}), ...(file ? { file } : {}) })
  }

  if (!existsSync(target) || !statSync(target).isDirectory()) {
    record('FAIL', 'CHEZMOI-1', 'conform target is not an existing directory', STD, target)
  } else {
    const chezmoiignorePath = join(target, '.chezmoiignore')
    if (existsSync(chezmoiignorePath)) {
      record('PASS', 'CHEZMOI-1', 'managed ignore file is already present', STD, '.chezmoiignore')
    } else if (dryRun) {
      record('POLISH', 'CHEZMOI-1', 'would scaffold the managed ignore file', STD, '.chezmoiignore')
    } else {
      writeFileSync(
        chezmoiignorePath,
        '# Files/directories chezmoi should never manage.\n# See references/standards.md (Repo layout & naming) in the ki-dotfiles-chezmoi skill.\n'
      )
      record('POLISH', 'CHEZMOI-1', 'scaffolded the managed ignore file', STD, '.chezmoiignore')
    }
  }

  findings.push(...judgmentFindingsFromRubric(rubricPath, RUBRIC))
  emitCheckerReporter({ mode: 'conform', concern: 'dotfiles-chezmoi', target, findings })
  process.exitCode = checkerReporterExitCode(findings)
}

main()
