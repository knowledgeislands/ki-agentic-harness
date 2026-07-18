#!/usr/bin/env bun
/**
 * Conservative conformer for a Homebrew tap.
 *
 * It only appends the deterministic keyless opt-in marker. Formula content and
 * Homebrew findings are authoring or external-tool judgment, so remain advisory.
 */
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

const FORMULA_DIR = 'Formula'
const KI_CONFIG = '.ki-config.toml'
const KI_SECTION = 'ki-homebrew-tap'
const STD = 'references/standards.md'
const RUBRIC = 'references/rubric.md'
const rubricPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'references', 'rubric.md')
const KI_DEFAULT = `# Opt this repo into the ki-homebrew-tap standard (a Knowledge Islands Homebrew tap).
# Keyless marker: presence is the whole config. The tap shape is fixed by Homebrew.
[${KI_SECTION}]
`
const findings: CheckerFinding[] = []
const add = (level: CheckerFinding['level'], code: string, message: string, ref?: string, file?: string): void =>
  void findings.push({ type: 'M', level, code, message, ...(ref ? { ref } : {}), ...(file ? { file } : {}) })

const argv = process.argv.slice(2)
const dryRun = argv.includes('--dry-run')
const target = resolve(argv.find((argument) => !argument.startsWith('-')) ?? '.')
if (!existsSync(target) || !statSync(target).isDirectory()) {
  add('FAIL', 'TAP-FORMULA-DIR', `Target path is not a directory: ${target}`, STD)
} else if (!existsSync(join(target, FORMULA_DIR)) || !statSync(join(target, FORMULA_DIR)).isDirectory()) {
  add('FAIL', 'TAP-FORMULA-DIR', 'Formula/ is absent; no safe conform action is available.', STD)
} else {
  const configPath = join(target, KI_CONFIG)
  if (!existsSync(configPath)) {
    add('ADVISORY', 'CONFIG', '.ki-config.toml is absent; ki-repo owns creating the shared file.', STD, KI_CONFIG)
  } else {
    const config = readFileSync(configPath, 'utf8')
    if (new RegExp(`^\\[${KI_SECTION}\\]`, 'm').test(config)) {
      add('PASS', 'CONFIG', 'The keyless opt-in marker is already present.', STD, KI_CONFIG)
    } else {
      add('POLISH', 'CONFIG', `${dryRun ? 'Would append' : 'Appended'} the keyless opt-in marker.`, STD, KI_CONFIG)
      if (!dryRun) writeFileSync(configPath, `${config.replace(/\n*$/, '\n')}\n${KI_DEFAULT}`)
    }
  }
  add('ADVISORY', 'TAP-CLASS', 'Formula class declarations require author review.', STD)
  add('ADVISORY', 'TAP-FIELDS', 'Formula fields require author review.', STD)
  add('ADVISORY', 'TAP-DESC-STYLE', 'Formula descriptions require author review.', STD)
  add('ADVISORY', 'TAP-URL-VERSIONED', 'Source URLs and checksums require author review.', STD)
  add('ADVISORY', 'TAP-README', 'Formula documentation rows require author review.', STD)
  add('ADVISORY', 'TAP-BREW', 'Run Homebrew style and audit after any formula changes.', STD)
}
findings.push(...judgmentFindingsFromRubric(rubricPath, RUBRIC))
emitCheckerReporter({ mode: 'conform', concern: 'homebrew-tap', target, findings })
process.exitCode = checkerReporterExitCode(findings)
