import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { AuditOutcome, ConformOutcome, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'

const FORMULA_DIR = 'Formula'
const CONFIG_FILE = '.ki-config.toml'
const SECTION = 'ki-homebrew-tap'
const isDirectory = (path: string): boolean => existsSync(path) && statSync(path).isDirectory()
const isFile = (path: string): boolean => existsSync(path) && statSync(path).isFile()

export type FormulaEvidence = { name: string; file: string; text: string }

export type HomebrewTapContext = {
  target: string
  targetExists: boolean
  applicable: boolean
  formulaDirectory: boolean
  formulae: readonly FormulaEvidence[]
  readme: string | null
  config: 'missing' | 'malformed' | 'absent' | 'present'
  configKeys: readonly string[]
  brewOutcomes: () => RubricOutcomes<AuditOutcome>
  conformMarker: () => RubricOutcomes<ConformOutcome>
}

const parseConfig = (path: string): { config: HomebrewTapContext['config']; configKeys: readonly string[] } => {
  if (!isFile(path)) return { config: 'missing', configKeys: [] }
  try {
    const parsed = Bun.TOML.parse(readFileSync(path, 'utf8')) as Record<string, unknown>
    const candidate = parsed[SECTION]
    if (candidate && typeof candidate === 'object' && !Array.isArray(candidate))
      return { config: 'present', configKeys: Object.keys(candidate as Record<string, unknown>) }
    return { config: 'absent', configKeys: [] }
  } catch {
    return { config: 'malformed', configKeys: [] }
  }
}

const brewOutcomes = (target: string, formulae: readonly FormulaEvidence[]): RubricOutcomes<AuditOutcome> => {
  const available = spawnSync('brew', ['--version'], { encoding: 'utf8', timeout: 120_000 })
  if (available.error || available.status !== 0)
    return [{ status: 'NOT_APPLICABLE', message: 'brew is not on PATH; the tap CI remains the backstop for Homebrew checks.' }]

  const outcomes: AuditOutcome[] = []
  const invocationError = (text: string): boolean =>
    /no available formula|not tapped|is disabled|Error: Calling|Usage:|invalid option|unknown command/i.test(text)
  for (const formula of formulae) {
    for (const [verb, arguments_] of [
      ['style', ['style', join(target, FORMULA_DIR, formula.file)]],
      ['audit', ['audit', '--strict', formula.name]]
    ] as const) {
      const result = spawnSync('brew', arguments_, { cwd: target, encoding: 'utf8', timeout: 120_000 })
      if (result.error) {
        outcomes.push({
          status: 'NOT_APPLICABLE',
          message: `brew ${verb} could not be started.`,
          subject: `${FORMULA_DIR}/${formula.file}`
        })
        continue
      }
      const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`.trim()
      if (result.status === 0)
        outcomes.push({ status: 'INFO', message: `brew ${verb} completed without findings.`, subject: `${FORMULA_DIR}/${formula.file}` })
      else if (invocationError(output))
        outcomes.push({
          status: 'NOT_APPLICABLE',
          message: `brew ${verb} could not evaluate this formula.`,
          subject: `${FORMULA_DIR}/${formula.file}`
        })
      else {
        const detail = output.split(/\r?\n/).filter(Boolean).slice(0, 4).join(' · ')
        outcomes.push({
          status: 'VIOLATION',
          message: `brew ${verb} reported: ${detail || `exit ${result.status}`}`,
          subject: `${FORMULA_DIR}/${formula.file}`
        })
      }
    }
  }
  return outcomes.length > 0
    ? (outcomes as RubricOutcomes<AuditOutcome>)
    : [{ status: 'NOT_APPLICABLE', message: 'No formulae are available for Homebrew checks.' }]
}

export const createHomebrewTapContext = ({ target, dryRun }: { target: string; dryRun: boolean }): HomebrewTapContext => {
  const absolute = resolve(target)
  const targetExists = isDirectory(absolute)
  const formulaPath = join(absolute, FORMULA_DIR)
  const formulaDirectory = targetExists && isDirectory(formulaPath)
  const formulae = formulaDirectory
    ? readdirSync(formulaPath)
        .filter((file) => file.endsWith('.rb'))
        .sort()
        .map((file) => ({ name: file.replace(/\.rb$/, ''), file, text: readFileSync(join(formulaPath, file), 'utf8') }))
    : []
  const { config, configKeys } = targetExists ? parseConfig(join(absolute, CONFIG_FILE)) : { config: 'missing' as const, configKeys: [] }
  const readmePath = join(absolute, 'README.md')
  const readme = isFile(readmePath) ? readFileSync(readmePath, 'utf8') : null
  return {
    target: absolute,
    targetExists,
    applicable: config === 'present' || config === 'malformed' || formulaDirectory,
    formulaDirectory,
    formulae,
    readme,
    config,
    configKeys,
    brewOutcomes: () => brewOutcomes(absolute, formulae),
    conformMarker: () => {
      if (!targetExists) return [{ status: 'VIOLATION', level: 'FAIL', message: 'Conform target must be an existing directory.' }]
      if (!formulaDirectory)
        return [
          { status: 'VIOLATION', level: 'FAIL', message: 'Formula/ is absent; no safe conform action is available.', subject: FORMULA_DIR }
        ]
      const path = join(absolute, CONFIG_FILE)
      if (config === 'missing')
        return [{ status: 'INFO', message: '.ki-config.toml is absent; ki-repo owns creating the shared file.', subject: CONFIG_FILE }]
      if (config === 'malformed')
        return [
          { status: 'INFO', message: '.ki-config.toml is malformed; repair it by hand before adding the marker.', subject: CONFIG_FILE }
        ]
      if (config === 'present')
        return [{ status: 'PASS', message: 'The keyless [ki-homebrew-tap] marker is already present.', subject: CONFIG_FILE }]
      if (!dryRun)
        writeFileSync(
          path,
          `${readFileSync(path, 'utf8').replace(/\n*$/, '\n')}\n# This repo is a Knowledge Islands Homebrew tap.\n[${SECTION}]\n`
        )
      return [
        { status: 'FIXED', message: `The [ki-homebrew-tap] marker ${dryRun ? 'would be added' : 'was added'}.`, subject: CONFIG_FILE }
      ]
    }
  }
}
