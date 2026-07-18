#!/usr/bin/env bun
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

const SECTION = 'ki-specifications'
const STD = 'references/standards.md'
const RUBRIC = 'references/rubric.md'
const localRubric = join(dirname(fileURLToPath(import.meta.url)), '..', 'references', 'rubric.md')
const argv = process.argv.slice(2)
const dryRun = argv.includes('--dry-run')
const target = resolve(argv.find((argument) => !argument.startsWith('-')) ?? '.')
const findings: CheckerFinding[] = []
const TOML = (globalThis as unknown as { Bun: { TOML: { parse(text: string): unknown } } }).Bun.TOML
const add = (level: CheckerFinding['level'], code: string, message: string, file?: string): void => {
  findings.push({ type: 'M', level, code, message, ref: STD, ...(file ? { file } : {}) })
}

if (!existsSync(target) || !statSync(target).isDirectory()) {
  add('FAIL', 'SPEC-1', 'Conform target must be an existing directory.')
} else {
  const configPath = join(target, '.ki-config.toml')
  if (!existsSync(configPath)) {
    add('FAIL', 'SPEC-1', '.ki-config.toml is absent; establish the repository with ki-repo first.', '.ki-config.toml')
  } else {
    const current = readFileSync(configPath, 'utf8')
    let parsed: Record<string, unknown> | null = null
    try {
      parsed = TOML.parse(current) as Record<string, unknown>
    } catch {
      add('FAIL', 'SPEC-1', '.ki-config.toml is malformed; repair it before conforming.', '.ki-config.toml')
    }
    if (parsed) {
      if (parsed[SECTION] !== undefined) {
        add('PASS', 'SPEC-1', 'The [ki-specifications] marker is already present.', '.ki-config.toml')
      } else {
        const next = `${current.trimEnd()}\n\n# This repo carries the KI Specifications repository structure.\n[${SECTION}]\n`
        if (!dryRun) writeFileSync(configPath, next)
        add('POLISH', 'SPEC-1', `The [ki-specifications] marker ${dryRun ? 'would be added' : 'was added'}.`, '.ki-config.toml')
      }
    }
  }
}

findings.push(...judgmentFindingsFromRubric(localRubric, RUBRIC))
emitCheckerReporter({ mode: 'conform', concern: 'specifications', target, findings })
process.exitCode = checkerReporterExitCode(findings)
