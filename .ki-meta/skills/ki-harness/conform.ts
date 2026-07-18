#!/usr/bin/env bun
/** Mechanical, normalize-only CONFORM for a Knowledge Islands harness. Emits canonical JSONL only. */

import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

const STD = 'references/standards.md'
const RUBRIC = 'references/rubric.md'
const PARTS = ['skills', 'agents', 'mcp', 'evals', 'hooks'] as const
const ROOT_FILES = ['CLAUDE.md', 'ROADMAP.md'] as const
const REQUIRED_SCRIPTS = [
  'ki:skills:link:project',
  'ki:skills:audit',
  'ki:skills:link:global',
  'ki:skills:status',
  'ki:skills:unlink',
  'ki:skills:refresh-status',
  'ki:eval'
]

function localRubricPath(): string {
  const scriptDir = dirname(fileURLToPath(import.meta.url))
  const skillRoot = basename(scriptDir) === 'scripts' ? dirname(scriptDir) : scriptDir
  return join(skillRoot, 'references', 'rubric.md')
}

function hasTomlTable(toml: string, table: string): boolean {
  return new RegExp(`^\\[${table.replace(/-/g, '\\-')}\\]`, 'm').test(toml)
}

function parseFrontmatterName(content: string): string | null {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/)
  const nameMatch = match?.[1]?.match(/^name:\s*(.+)$/m)
  return nameMatch ? (nameMatch[1] as string).trim() : null
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

function emit(target: string, findings: CheckerFinding[]): never {
  findings.push(...judgmentFindingsFromRubric(localRubricPath(), RUBRIC))
  emitCheckerReporter({ mode: 'conform', concern: 'harness', target, findings })
  process.exit(checkerReporterExitCode(findings))
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const target = resolve(args.find((value) => !value.startsWith('-')) ?? '.')
  const findings: CheckerFinding[] = []
  const rec = (
    level: 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS',
    code: string,
    message: string,
    file?: string
  ): void => {
    findings.push({ type: 'M', level, code, message, ref: STD, ...(file ? { file } : {}) })
  }
  if (!(await exists(target))) {
    rec('FAIL', 'LAY-1', `Harness root not found: ${target}.`, target)
    emit(target, findings)
  }

  for (const part of PARTS) {
    const directory = join(target, part)
    if (!(await exists(directory))) {
      rec('POLISH', 'LAY-1', `${part}/ ${dryRun ? 'would be created' : 'created'}.`, `${part}/`)
      if (!dryRun) await mkdir(directory, { recursive: true })
    } else rec('PASS', 'LAY-1', `${part}/ is present.`, `${part}/`)
    const readme = join(directory, 'README.md')
    if (!(await exists(readme))) {
      rec('POLISH', 'LAY-2', `Shelf description ${dryRun ? 'would be scaffolded' : 'scaffolded'}.`, `${part}/README.md`)
      if (!dryRun)
        await writeFile(readme, `# \`${part}/\`\n\nEmpty shelf — no ${part} yet. TODO: describe what this part holds and its status.\n`)
    } else rec('PASS', 'LAY-2', 'Shelf description is present.', `${part}/README.md`)
  }

  const tomlPath = join(target, '.ki-config.toml')
  if (!(await exists(tomlPath))) {
    rec('ADVISORY', 'LAY-5', 'KI configuration is missing at root — author it by hand.', '.ki-config.toml')
  } else {
    const toml = await readFile(tomlPath, 'utf8')
    if (hasTomlTable(toml, 'ki-harness')) rec('PASS', 'CONFIG-1', '[ki-harness] table is present.', '.ki-config.toml')
    else {
      rec('POLISH', 'CONFIG-1', `Keyless [ki-harness] table ${dryRun ? 'would be appended' : 'appended'}.`, '.ki-config.toml')
      if (!dryRun) await writeFile(tomlPath, `${toml.replace(/\n*$/, '\n')}\n[ki-harness]\n`)
    }
    if (!hasTomlTable(toml, 'ki-repo')) rec('ADVISORY', 'CONFIG-2', 'No [ki-repo] table; add it by hand.', '.ki-config.toml')
  }

  for (const file of ROOT_FILES) {
    if (!(await exists(join(target, file))))
      rec('ADVISORY', file === 'CLAUDE.md' ? 'LAY-3' : 'LAY-4', 'Required root document is missing — author it by hand.', file)
  }
  const packagePath = join(target, 'package.json')
  if (!(await exists(packagePath))) {
    rec('ADVISORY', 'PKG-1', 'Package manifest is missing — author required script families by hand.', 'package.json')
  } else {
    try {
      const pkg = JSON.parse(await readFile(packagePath, 'utf8')) as { scripts?: Record<string, unknown> }
      const missing = REQUIRED_SCRIPTS.filter((script) => !(script in (pkg.scripts ?? {})))
      if (missing.length > 0) rec('ADVISORY', 'PKG-1', `Add repo-specific scripts by hand: ${missing.join(', ')}.`, 'package.json')
    } catch {
      rec('ADVISORY', 'PKG-1', 'Package manifest could not be parsed as JSON — fix it by hand.', 'package.json')
    }
  }
  const skillsDir = join(target, 'skills')
  if (await exists(skillsDir)) {
    const names = new Map<string, string[]>()
    for (const entry of await readdir(skillsDir)) {
      const skillPath = join(skillsDir, entry, 'SKILL.md')
      if (!(await exists(skillPath))) continue
      const declaredName = parseFrontmatterName(await readFile(skillPath, 'utf8'))
      if (!declaredName) rec('ADVISORY', 'SKILLS-1', 'No parseable name: frontmatter.', `skills/${entry}/SKILL.md`)
      else {
        if (declaredName !== entry)
          rec(
            'ADVISORY',
            'SKILLS-1',
            `name: '${declaredName}' differs from directory '${entry}' — choose the correction.`,
            `skills/${entry}`
          )
        const entries = names.get(declaredName) ?? []
        entries.push(entry)
        names.set(declaredName, entries)
      }
    }
    for (const [name, entries] of names) {
      if (entries.length > 1)
        rec('ADVISORY', 'SKILLS-2', `Duplicate name '${name}' in ${entries.map((entry) => `skills/${entry}`).join(', ')}.`, 'skills/')
    }
  }
  emit(target, findings)
}

main().catch((error) => {
  const findings: CheckerFinding[] = [{ type: 'M', level: 'FAIL', code: 'RUNTIME', message: `Checker failed: ${String(error)}.`, ref: STD }]
  emit(resolve('.'), findings)
})
