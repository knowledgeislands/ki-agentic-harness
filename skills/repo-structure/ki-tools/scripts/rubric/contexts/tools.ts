import { chmodSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import type { ConformOutcome, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
const isDir = (path: string): boolean => existsSync(path) && statSync(path).isDirectory()
const isFile = (path: string): boolean => existsSync(path) && statSync(path).isFile()
const executable = (path: string): boolean => existsSync(path) && (statSync(path).mode & 0o111) !== 0
export type ToolsContext = {
  target: string; targetExists: boolean; applicable: boolean; binExists: boolean
  bins: readonly { name: string; executable: boolean }[]; primary: string | null; primaryText: string; shell: boolean
  install: 'missing' | 'non-executable' | 'executable'; changelog: boolean; workflows: readonly string[]; workflowText: string
  tests: boolean; bats: boolean; packageJson: boolean; config: 'missing' | 'malformed' | 'absent' | 'present'; configKeys: readonly string[]
  conformBins: () => RubricOutcomes<ConformOutcome>; conformInstall: () => RubricOutcomes<ConformOutcome>; conformConfig: () => RubricOutcomes<ConformOutcome>
}
export const createToolsContext = ({ target, dryRun }: { target: string; dryRun: boolean }): ToolsContext => {
  const absolute = resolve(target); const targetExists = isDir(absolute); const binDir = join(absolute, 'bin'); const binExists = targetExists && isDir(binDir)
  const names = binExists ? readdirSync(binDir, { withFileTypes: true }).filter((entry) => entry.isFile()).map((entry) => entry.name).sort() : []
  const bins = names.map((name) => ({ name, executable: executable(join(binDir, name)) })); const expected = basename(absolute).replace(/^tools-/, ''); const primary = names.find((name) => name === expected) ?? names[0] ?? null
  const primaryText = primary ? readFileSync(join(binDir, primary), 'utf8') : ''; const shell = /^#!.*\b(bash|sh|dash|zsh|ksh)\b/.test(primaryText.split(/\r?\n/, 1)[0] ?? '')
  const installPath = join(absolute, 'install.sh'); const install = !isFile(installPath) ? 'missing' : executable(installPath) ? 'executable' : 'non-executable'
  const workflowDir = join(absolute, '.github', 'workflows'); const workflows = isDir(workflowDir) ? readdirSync(workflowDir).filter((name) => /\.ya?ml$/.test(name)) : []; const workflowText = workflows.map((name) => readFileSync(join(workflowDir, name), 'utf8')).join('\n')
  const testsDir = join(absolute, 'tests'); const tests = isDir(testsDir); const bats = tests && readdirSync(testsDir).some((name) => name.endsWith('.bats'))
  const configPath = join(absolute, '.ki-config.toml'); let config: ToolsContext['config'] = 'missing'; let configKeys: string[] = []
  if (isFile(configPath)) try { const parsed = Bun.TOML.parse(readFileSync(configPath, 'utf8')) as Record<string, unknown>; const value = parsed['ki-tools']; if (value && typeof value === 'object' && !Array.isArray(value)) { config = 'present'; configKeys = Object.keys(value as Record<string, unknown>) } else config = 'absent' } catch { config = 'malformed' }
  const applicable = config === 'present' || config === 'malformed' || binExists
  const fixed = (values: ConformOutcome[], pass: string): RubricOutcomes<ConformOutcome> => values.length ? values as RubricOutcomes<ConformOutcome> : [{ status: 'PASS', message: pass }]
  return { target: absolute, targetExists, applicable, binExists, bins, primary, primaryText, shell, install, changelog: isFile(join(absolute, 'CHANGELOG.md')), workflows, workflowText, tests, bats, packageJson: isFile(join(absolute, 'package.json')), config, configKeys,
    conformBins: () => { if (!targetExists) return [{ status: 'VIOLATION', level: 'FAIL', message: 'target is not a directory', subject: absolute }]; if (!binExists) return [{ status: 'INFO', message: 'tool executable directory is missing; author it by hand', subject: 'bin/' }]; if (!bins.length) return [{ status: 'INFO', message: 'no executable files found; author the tool executable by hand', subject: 'bin/' }]; const values: ConformOutcome[] = bins.filter((bin) => !bin.executable).map((bin) => { if (!dryRun) chmodSync(join(binDir, bin.name), statSync(join(binDir, bin.name)).mode | 0o111); return { status: 'FIXED', message: `${dryRun ? 'would set' : 'set'} executable bit`, subject: `bin/${bin.name}` } }); return fixed(values, 'every bin/ file is already executable') },
    conformInstall: () => { if (install === 'missing') return [{ status: 'INFO', message: 'curl installer is missing; author it by hand', subject: 'install.sh' }]; if (install === 'executable') return [{ status: 'PASS', message: 'install.sh is already executable', subject: 'install.sh' }]; if (!dryRun) chmodSync(installPath, statSync(installPath).mode | 0o111); return [{ status: 'FIXED', message: `${dryRun ? 'would set' : 'set'} executable bit`, subject: 'install.sh' }] },
    conformConfig: () => { if (config === 'missing') return [{ status: 'INFO', message: 'configuration file is missing; ki-repo must create it first', subject: '.ki-config.toml' }]; if (config === 'present') return [{ status: 'PASS', message: '[ki-tools] marker already present', subject: '.ki-config.toml' }]; if (config === 'malformed') return [{ status: 'INFO', message: 'configuration is malformed; repair it by hand', subject: '.ki-config.toml' }]; if (!dryRun) { const text = readFileSync(configPath, 'utf8'); writeFileSync(configPath, `${text.replace(/\n*$/, '\n\n')}[ki-tools]\n`) }; return [{ status: 'FIXED', message: `${dryRun ? 'would append' : 'appended'} the [ki-tools] marker`, subject: '.ki-config.toml' }] }
  }
}
