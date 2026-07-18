#!/usr/bin/env bun
/** Mechanical audit for a Knowledge Islands agentic harness. Emits canonical JSONL only. */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

type Level = 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS'
const STD = 'references/standards.md'
const RUBRIC = 'references/rubric.md'
const PARTS = ['skills', 'agents', 'mcp', 'evals', 'hooks'] as const

function localRubricPath(): string {
  const scriptDir = dirname(fileURLToPath(import.meta.url))
  const skillRoot = basename(scriptDir) === 'scripts' ? dirname(scriptDir) : scriptDir
  return join(skillRoot, 'references', 'rubric.md')
}

function hasTomlTable(toml: string, table: string): boolean {
  return new RegExp(`^\\[${table.replace(/-/g, '\\-')}\\]`, 'm').test(toml)
}

function readPackageJson(path: string): Record<string, unknown> {
  if (!existsSync(path)) return {}
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>
  } catch {
    return {}
  }
}

function hasScript(pkg: Record<string, unknown>, script: string): boolean {
  const scripts = pkg.scripts as Record<string, unknown> | undefined
  return typeof scripts === 'object' && scripts !== null && script in scripts
}

function parseFrontmatterName(content: string): string | null {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/)
  const nameMatch = match?.[1]?.match(/^name:\s*(.+)$/m)
  return nameMatch ? (nameMatch[1] as string).trim() : null
}

function emit(root: string, findings: CheckerFinding[]): never {
  findings.push(...judgmentFindingsFromRubric(localRubricPath(), RUBRIC))
  emitCheckerReporter({ mode: 'audit', concern: 'harness', target: root, findings })
  process.exit(checkerReporterExitCode(findings))
}

function main(): void {
  const root = resolve(process.argv.slice(2).find((value) => !value.startsWith('-')) ?? '.')
  const findings: CheckerFinding[] = []
  const add = (level: Level, code: string, message: string, ref?: string, file?: string): void => {
    findings.push({ type: 'M', level, code, message, ...(ref ? { ref } : {}), ...(file ? { file } : {}) })
  }
  const check = (level: Level, code: string, ok: boolean, message: string, file?: string): void =>
    add(ok ? 'PASS' : level, code, message, STD, file)

  if (!existsSync(root)) {
    add('FAIL', 'LAY-1', `Harness root does not exist: ${root}.`, STD, root)
    emit(root, findings)
  }

  for (const part of PARTS) {
    const directory = join(root, part)
    check('FAIL', 'LAY-1', existsSync(directory), 'Required five-part directory is present.', `${part}/`)
    if (existsSync(directory))
      check('WARN', 'LAY-2', existsSync(join(directory, 'README.md')), 'Required shelf description is present.', `${part}/README.md`)
  }
  check('FAIL', 'LAY-3', existsSync(join(root, 'CLAUDE.md')), 'Required root orientation is present.', 'CLAUDE.md')
  check('WARN', 'LAY-4', existsSync(join(root, 'ROADMAP.md')), 'Open-work register is present.', 'ROADMAP.md')
  check('FAIL', 'LAY-5', existsSync(join(root, '.ki-config.toml')), 'Required KI configuration is present.', '.ki-config.toml')

  const pkgPath = join(root, 'package.json')
  if (!existsSync(pkgPath)) {
    add('FAIL', 'PKG-1', 'Package manifest is absent — cannot check scripts.', STD, 'package.json')
    add('FAIL', 'PKG-2', 'Package manifest is absent — cannot check scripts.', STD, 'package.json')
  } else {
    const pkg = readPackageJson(pkgPath)
    check('FAIL', 'PKG-1', hasScript(pkg, 'ki:skills:link:project'), "Must have a 'ki:skills:link:project' script.", 'package.json')
    check('FAIL', 'PKG-2', hasScript(pkg, 'ki:skills:audit'), "Must have a 'ki:skills:audit' script.", 'package.json')
    for (const script of ['ki:skills:link:global', 'ki:skills:status', 'ki:skills:unlink', 'ki:skills:refresh-status', 'ki:eval'])
      check('WARN', 'PKG-4', hasScript(pkg, script), `Should have a '${script}' script.`, 'package.json')
    const scripts = (pkg.scripts as Record<string, string> | undefined) ?? {}
    let danglers = 0
    for (const [key, command] of Object.entries(scripts)) {
      if (!key.startsWith('ki:') || typeof command !== 'string') continue
      for (const segment of command.split(/&&|\|\||[;|]/)) {
        const tokens = segment.trim().split(/\s+/)
        for (let index = 0; index < tokens.length - 1; index++) {
          if (tokens[index] !== 'bun' && tokens[index] !== 'bunx') continue
          const arg = tokens[index + 1] as string
          if (
            arg === 'run' ||
            arg.startsWith('-') ||
            !(/\.(ts|tsx|js|mjs|cjs|sh)$/.test(arg) || arg.startsWith('./') || arg.startsWith('.ki-meta/'))
          )
            continue
          if (!existsSync(join(root, arg))) {
            add('WARN', 'PKG-6', `Script '${key}' shells 'bun ${arg}', which does not exist.`, STD, 'package.json')
            danglers++
          }
        }
      }
    }
    if (danglers === 0) add('PASS', 'PKG-6', 'All ki:* bun script targets resolve to a file.', STD, 'package.json')
  }

  const tomlPath = join(root, '.ki-config.toml')
  if (!existsSync(tomlPath)) {
    add('NA', 'CONFIG-1', 'KI configuration is absent — skipping table checks.', STD, '.ki-config.toml')
    add('NA', 'CONFIG-2', 'KI configuration is absent.', STD, '.ki-config.toml')
  } else {
    const toml = readFileSync(tomlPath, 'utf8')
    check('FAIL', 'CONFIG-1', hasTomlTable(toml, 'ki-harness'), 'Must have a [ki-harness] table.', '.ki-config.toml')
    check('WARN', 'CONFIG-2', hasTomlTable(toml, 'ki-repo'), 'Should have a [ki-repo] table.', '.ki-config.toml')
  }

  const skillsDir = join(root, 'skills')
  if (!existsSync(skillsDir)) {
    add('NA', 'SKILLS-1', 'Skill directory is absent — skipping name checks.', STD, 'skills/')
    add('NA', 'SKILLS-2', 'Skill directory is absent — skipping duplicate-name check.', STD, 'skills/')
  } else {
    const names = new Map<string, string[]>()
    for (const entry of readdirSync(skillsDir)) {
      const entryPath = join(skillsDir, entry)
      if (!statSync(entryPath).isDirectory()) continue
      const skillPath = join(entryPath, 'SKILL.md')
      if (!existsSync(skillPath)) continue
      const declaredName = parseFrontmatterName(readFileSync(skillPath, 'utf8'))
      if (!declaredName) {
        add('WARN', 'SKILLS-1', 'No parseable name: frontmatter.', STD, `skills/${entry}/SKILL.md`)
        continue
      }
      check('FAIL', 'SKILLS-1', declaredName === entry, `Directory '${entry}' must match name: '${declaredName}'.`, `skills/${entry}`)
      const entries = names.get(declaredName) ?? []
      entries.push(entry)
      names.set(declaredName, entries)
    }
    for (const [name, entries] of names) {
      if (entries.length > 1)
        add('FAIL', 'SKILLS-2', `Duplicate name '${name}' in ${entries.map((entry) => `skills/${entry}`).join(', ')}.`, STD, 'skills/')
    }
  }
  emit(root, findings)
}

try {
  main()
} catch (error) {
  const findings: CheckerFinding[] = [
    { type: 'M', level: 'FAIL', code: 'RUNTIME', message: `Checker failed: ${String(error)}.`, ref: RUBRIC }
  ]
  emit(resolve('.'), findings)
}
