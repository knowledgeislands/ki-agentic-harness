#!/usr/bin/env bun
import { existsSync, readFileSync, statSync } from 'node:fs'
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
const target = resolve(process.argv.slice(2).find((argument) => !argument.startsWith('-')) ?? '.')
const findings: CheckerFinding[] = []
const TOML = (globalThis as unknown as { Bun: { TOML: { parse(text: string): unknown } } }).Bun.TOML
const add = (level: CheckerFinding['level'], code: string, message: string, file?: string): void => {
  findings.push({ type: 'M', level, code, message, ref: STD, ...(file ? { file } : {}) })
}
const isDirectory = (path: string): boolean => existsSync(path) && statSync(path).isDirectory()

if (!isDirectory(target)) {
  add('FAIL', 'SPEC-2', 'Audit target must be an existing directory.')
} else {
  const at = (path: string): string => join(target, path)
  const configPath = at('.ki-config.toml')
  const hasStructuralMarker = ['proposals', 'specifications', 'schemas'].some((path) => isDirectory(at(path)))
  let table: Record<string, unknown> | null = null
  let malformed = false
  if (existsSync(configPath)) {
    try {
      const parsed = TOML.parse(readFileSync(configPath, 'utf8')) as Record<string, unknown>
      const candidate = parsed[SECTION]
      if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) table = candidate as Record<string, unknown>
    } catch {
      malformed = true
    }
  }

  if (!table && !malformed && !hasStructuralMarker) {
    add('NA', 'SPEC-1', 'ki-specifications is not applicable: no declaration or core structural marker is present.')
  } else {
    if (malformed) add('WARN', 'SPEC-1', '.ki-config.toml is malformed.', '.ki-config.toml')
    else if (!table) add('WARN', 'SPEC-1', '[ki-specifications] is absent from .ki-config.toml.', '.ki-config.toml')
    else {
      const keys = Object.keys(table)
      keys.length === 0
        ? add('PASS', 'SPEC-1', 'The keyless [ki-specifications] marker is present.', '.ki-config.toml')
        : add('WARN', 'SPEC-1', `The keyless marker contains unknown keys: ${keys.join(', ')}.`, '.ki-config.toml')
    }

    for (const path of ['proposals', 'specifications', 'schemas']) {
      isDirectory(at(path)) ? add('PASS', 'SPEC-2', `${path}/ is present.`, path) : add('FAIL', 'SPEC-2', `${path}/ is absent.`, path)
    }
    for (const path of ['templates', 'examples', 'docs', 'tooling']) {
      isDirectory(at(path)) ? add('PASS', 'SPEC-3', `${path}/ is present.`, path) : add('WARN', 'SPEC-3', `${path}/ is absent.`, path)
    }
  }
}

findings.push(...judgmentFindingsFromRubric(localRubric, RUBRIC))
emitCheckerReporter({ mode: 'audit', concern: 'specifications', target, findings })
process.exitCode = checkerReporterExitCode(findings)
