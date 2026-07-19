#!/usr/bin/env bun
/**
 * Source-harness contract collector for every checker that declares the canonical
 * reporter dependency. It runs AUDIT only: a collector is read-only and never
 * mutates the harness or its audited target.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parseCheckerReporterJsonl, rubricCriteriaFromFile, validateCheckerReporterEvents, validateCheckerReporterRubric } from './checker-reporter.ts'

const SKILLS_ROOT = resolve(import.meta.dirname, '..', '..', '..', '..')
let failed = false

const check = (label: string, errors: string[]): void => {
  if (errors.length === 0) {
    console.log(`  \x1b[32mok\x1b[0m   ${label}`)
    return
  }
  failed = true
  console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  for (const error of errors.slice(0, 3)) console.log(`       ${error}`)
  if (errors.length > 3) console.log(`       … ${errors.length - 3} more`)
}

const skillDirectories = (): string[] => {
  const result: string[] = []
  for (const cluster of readdirSync(SKILLS_ROOT, { withFileTypes: true })) {
    if (!cluster.isDirectory()) continue
    const clusterPath = join(SKILLS_ROOT, cluster.name)
    if (existsSync(join(clusterPath, 'SKILL.md'))) result.push(clusterPath)
    for (const entry of readdirSync(clusterPath, { withFileTypes: true })) {
      if (entry.isDirectory() && existsSync(join(clusterPath, entry.name, 'SKILL.md'))) result.push(join(clusterPath, entry.name))
    }
  }
  return result.sort()
}

const usesCanonicalReporter = (skillDir: string): boolean => {
  const frontmatter = readFileSync(join(skillDir, 'SKILL.md'), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
  return /^checker-dependencies:\s*\[[^\]]*ki-skills:checker-reporter[^\]]*\]/m.test(frontmatter)
}

for (const skillDir of skillDirectories().filter(usesCanonicalReporter)) {
  const skill = readFileSync(join(skillDir, 'SKILL.md'), 'utf8').match(/^name:\s*(\S+)/m)?.[1] ?? skillDir
  const audit = join(skillDir, 'scripts', 'audit.ts')
  const rubric = join(skillDir, 'references', 'rubric.md')
  if (!existsSync(audit)) {
    check(`${skill} → declares canonical reporter and ships audit.ts`, ['audit.ts is absent'])
    continue
  }
  if (!existsSync(rubric)) {
    check(`${skill} → declares canonical reporter and ships rubric metadata`, ['references/rubric.md is absent'])
    continue
  }
  const result = spawnSync('bun', [audit, SKILLS_ROOT], { encoding: 'utf8' })
  const parsed = parseCheckerReporterJsonl(result.stdout ?? '')
  const transportErrors = [...parsed.errors, ...validateCheckerReporterEvents(parsed.events, result.status ?? 1)]
  check(`${skill} → canonical audit transport`, transportErrors)
  if (transportErrors.length === 0)
    check(`${skill} → rubric codes, types, prompts, and non-repeating messages`, validateCheckerReporterRubric(parsed.events, rubricCriteriaFromFile(rubric)))
  if ((result.stderr ?? '').trim()) check(`${skill} → writes no stderr`, [`${result.stderr.trim().split('\n')[0]}`])
}

if (failed) process.exit(1)
console.log('\n\x1b[32mchecker-fleet.test.ts: all declared canonical checkers passed\x1b[0m')
