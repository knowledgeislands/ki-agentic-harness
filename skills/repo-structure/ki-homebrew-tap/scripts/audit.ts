#!/usr/bin/env bun
/**
 * Mechanical audit for a Knowledge Islands Homebrew tap.
 *
 * Emits only the canonical checker-reporter JSONL stream. The checker collects
 * deterministic tap findings; the reporter owns transport and presentation.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

const FORMULA_DIR = 'Formula'
const README = 'README.md'
const KI_CONFIG = '.ki-config.toml'
const KI_SECTION = 'ki-homebrew-tap'
const STD = 'references/standards.md'
const RUBRIC = 'references/rubric.md'
const rubricPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'references', 'rubric.md')
const KI_DEFAULT = `# Opt this repo into the ki-homebrew-tap standard (a Knowledge Islands Homebrew tap).
# Keyless marker: presence is the whole config. The tap shape is fixed by Homebrew.
[${KI_SECTION}]
`

type Formula = { name: string; file: string; text: string }

const findings: CheckerFinding[] = []
const add = (level: CheckerFinding['level'], code: string, message: string, ref?: string, file?: string): void =>
  void findings.push({ type: 'M', level, code, message, ...(ref ? { ref } : {}), ...(file ? { file } : {}) })
const isDir = (path: string): boolean => existsSync(path) && statSync(path).isDirectory()
const isFile = (path: string): boolean => existsSync(path) && statSync(path).isFile()
const TOML = (globalThis as unknown as { Bun: { TOML: { parse(text: string): unknown } } }).Bun.TOML

function parseKiTap(text: string): { keys: string[] | null; malformed: boolean } {
  try {
    const document = TOML.parse(text) as Record<string, unknown>
    const table = document[KI_SECTION]
    return table && typeof table === 'object' && !Array.isArray(table)
      ? { keys: Object.keys(table as Record<string, unknown>), malformed: false }
      : { keys: null, malformed: false }
  } catch {
    return { keys: null, malformed: true }
  }
}

function listFormulae(directory: string): Formula[] {
  if (!isDir(directory)) return []
  return readdirSync(directory)
    .filter((name) => name.endsWith('.rb'))
    .sort()
    .map((file) => ({ name: file.replace(/\.rb$/, ''), file, text: readFileSync(join(directory, file), 'utf8') }))
}

function runBrew(base: string, formulaDir: string, formulae: Formula[]): void {
  const available = spawnSafe('brew', ['--version'])
  if (available?.status !== 0) {
    add('NA', 'TAP-BREW', 'brew is not on PATH; the tap CI remains the backstop for Homebrew checks.', STD)
    return
  }
  const invocationError = (text: string): boolean =>
    /no available formula|not tapped|is disabled|Error: Calling|Usage:|invalid option|unknown command/i.test(text)
  for (const formula of formulae) {
    const file = `${FORMULA_DIR}/${formula.file}`
    for (const [verb, args] of [
      ['style', ['style', join(formulaDir, formula.file)]],
      ['audit', ['audit', '--strict', formula.name]]
    ] as Array<[string, string[]]>) {
      const result = spawnSafe('brew', args, base)
      if (!result) {
        add('NA', 'TAP-BREW', `brew ${verb} could not be started.`, STD, file)
        continue
      }
      const output = `${result.stdout}\n${result.stderr}`.trim()
      if (result.status === 0) add('INFO', 'TAP-BREW', `brew ${verb} completed without findings.`, STD, file)
      else if (invocationError(output)) add('NA', 'TAP-BREW', `brew ${verb} could not evaluate this formula.`, STD, file)
      else {
        const detail = output.split(/\r?\n/).filter(Boolean).slice(0, 4).join(' · ')
        add('WARN', 'TAP-BREW', `brew ${verb} reported: ${detail || `exit ${result.status}`}`, STD, file)
      }
    }
  }
}

function spawnSafe(command: string, args: string[], cwd?: string): { status: number | null; stdout: string; stderr: string } | null {
  try {
    const result = spawnSync(command, args, { cwd, encoding: 'utf8', timeout: 120_000 })
    if (result.error) return null
    return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' }
  } catch {
    return null
  }
}

function audit(base: string): void {
  const formulaDir = join(base, FORMULA_DIR)
  const formulae = listFormulae(formulaDir)
  if (!isDir(formulaDir)) {
    add('FAIL', 'TAP-FORMULA-DIR', 'Formula/ is absent; this is not a Homebrew tap.', STD)
    return
  }
  if (formulae.length === 0) {
    add('FAIL', 'TAP-FORMULA-DIR', 'Formula/ contains no Ruby formulae.', STD)
    return
  }
  add('INFO', 'TAP-FORMULA-DIR', `${formulae.length} formulae found.`, STD)

  const readmePath = join(base, README)
  const readme = isFile(readmePath) ? readFileSync(readmePath, 'utf8') : null
  if (readme === null) add('WARN', 'TAP-README', 'README.md is absent; formula discoverability cannot be verified.', STD, README)

  for (const formula of formulae) {
    const file = `${FORMULA_DIR}/${formula.file}`
    const { text } = formula
    if (!/^\s*class\s+[A-Z][A-Za-z0-9]*\s+<\s+Formula\b/m.test(text))
      add('WARN', 'TAP-CLASS', 'The formula has no `class <Camel> < Formula` declaration.', STD, file)
    for (const [label, pattern] of [
      ['desc', /^\s*desc\s+"/m],
      ['homepage', /^\s*homepage\s+"/m],
      ['url', /^\s*url\s+"/m],
      ['sha256', /^\s*sha256\s+"/m],
      ['license', /^\s*license\s+/m],
      ['install method', /^\s*def\s+install\b/m],
      ['test do', /^\s*test\s+do\b/m]
    ] as Array<[string, RegExp]>) {
      if (!pattern.test(text)) add('WARN', 'TAP-FIELDS', `Required field is absent: ${label}.`, STD, file)
    }
    const desc = text.match(/^\s*desc\s+"([^"]*)"/m)?.[1]
    if (desc && desc.length > 80)
      add('WARN', 'TAP-DESC-STYLE', `Description is ${desc.length} characters; Homebrew permits at most 80.`, STD, file)
    if (desc && /^(A|An|The)\s/.test(desc)) add('WARN', 'TAP-DESC-STYLE', 'Description begins with an article.', STD, file)
    const url = text.match(/^\s*url\s+"([^"]*)"/m)?.[1]
    if (url && !/\/archive\/refs\/tags\/|\/releases\/download\//.test(url))
      add('WARN', 'TAP-URL-VERSIONED', 'Source URL is not a tagged-release tarball.', STD, file)
    if (readme !== null && !readme.includes(formula.name)) add('WARN', 'TAP-README', 'Formula name is absent from README.md.', STD, file)
  }
  runBrew(base, formulaDir, formulae)
}

const argv = process.argv.slice(2)
if (argv.includes('--educate')) {
  process.stdout.write(KI_DEFAULT)
  process.exit(0)
}
const target = resolve(argv.find((argument) => !argument.startsWith('-')) ?? '.')
if (!isDir(target)) {
  add('FAIL', 'TAP-FORMULA-DIR', `Target path is not a directory: ${target}`, STD)
} else {
  const configPath = join(target, KI_CONFIG)
  const parsed = isFile(configPath) ? parseKiTap(readFileSync(configPath, 'utf8')) : { keys: null, malformed: false }
  const hasStructure = isDir(join(target, FORMULA_DIR))
  if (parsed.keys === null && !parsed.malformed && !hasStructure) {
    add('NA', 'CONFIG', 'No tap declaration or Formula/ structural marker is present.', STD)
  } else {
    audit(target)
    if (parsed.keys === null) add('WARN', 'CONFIG', `[${KI_SECTION}] is absent from .ki-config.toml.`, STD, KI_CONFIG)
    else if (parsed.keys.length > 0)
      add('WARN', 'CONFIG', `The keyless marker contains unknown keys: ${parsed.keys.join(', ')}.`, STD, KI_CONFIG)
    else add('INFO', 'CONFIG', 'The keyless opt-in marker is present.', STD, KI_CONFIG)
  }
}
findings.push(...judgmentFindingsFromRubric(rubricPath, RUBRIC))
emitCheckerReporter({ mode: 'audit', concern: 'homebrew-tap', target, findings })
process.exitCode = checkerReporterExitCode(findings)
