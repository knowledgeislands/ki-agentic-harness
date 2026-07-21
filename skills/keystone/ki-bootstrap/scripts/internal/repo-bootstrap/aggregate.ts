#!/usr/bin/env bun
/**
 * Vendored by ki-bootstrap.
 *
 * This is the whole-repository renderer for governed checkers. It imports each
 * vendored `govern.ts` entrypoint and invokes its programmatic plan/check
 * contract in-process; the aggregate never launches a local checker process.
 */

import { execFileSync } from 'node:child_process'
import { existsSync, lstatSync, readdirSync, readlinkSync, realpathSync } from 'node:fs'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

type CheckMode = 'audit' | 'conform'
type CheckerLevel = 'FAIL' | 'WARN' | 'FIXED' | 'INFO' | 'NOT_APPLICABLE' | 'PASS'
type ProgressMode = 'auto' | 'always' | 'never'

type Finding = {
  level: CheckerLevel
  code: string
  title: string
  message: string
  subject?: string
}

type Summary = {
  fail: number
  warn: number
  fixed: number
  info: number
  notApplicable: number
  pass: number
  judgment: { unevaluated: number }
}

type CheckResult = {
  findings: readonly Finding[]
  summary: Summary
  exitCode: 0 | 1
  plannedItems: number
}

type CheckPlan = {
  plannedItems: number
}

type StatusEvent = {
  type: 'start' | 'item-complete' | 'complete' | 'failed'
  completed: number
  total: number
  code?: string
}

type GovernedModule = {
  plan: (mode: CheckMode, options: any) => CheckPlan
  check: (mode: CheckMode, options: any) => CheckResult
  options?: (mode: CheckMode, arguments_: readonly string[]) => Record<string, unknown>
}

type AggregateReport = {
  skill: string
  findings: readonly Finding[]
  summary: Summary
}

const LEVELS: readonly CheckerLevel[] = ['FAIL', 'WARN', 'FIXED', 'INFO', 'NOT_APPLICABLE', 'PASS']
const DEFAULT_LEVELS: Record<CheckMode, readonly CheckerLevel[]> = {
  audit: ['FAIL', 'WARN'],
  conform: ['FAIL', 'WARN', 'FIXED']
}
const ICON: Record<CheckerLevel, string> = {
  FAIL: '❌',
  WARN: '⚠️ ',
  FIXED: '✅',
  INFO: 'ℹ️ ',
  NOT_APPLICABLE: '🚫',
  PASS: '✅'
}
const SHORT: Record<CheckerLevel, string> = {
  FAIL: 'fail',
  WARN: 'warn',
  FIXED: 'fixed',
  INFO: 'info',
  NOT_APPLICABLE: 'na',
  PASS: 'pass'
}

const usage = (): string =>
  `${[
    'Usage: bun .ki/bin/aggregate.ts <audit|conform|educate|help> [options]',
    '',
    'Commands:',
    '  audit    Run every vendored governed checker (default in ki-audit).',
    "  conform  Apply each checker's safe mechanical fixes.",
    '  educate  Re-bootstrap the governed repository or one skill.',
    '  help     List governed skills or show one skill help.',
    '',
    'Audit and conform options:',
    '  --skill <ki-skill>        Run one vendored governed checker.',
    '  --dry-run                 Report conform changes without writing them.',
    '  --progress <mode>         Progress: auto, always, or never (default: auto).',
    '  --reporter-levels <list>  Render levels, or all (default: FAIL,WARN).',
    '  -h, --help                Show this help and exit.'
  ].join('\n')}\n`

const modeUsage = (mode: CheckMode): string =>
  `${[
    `Usage: bun .ki/bin/aggregate.ts ${mode} [options]`,
    '',
    mode === 'audit'
      ? 'Audit each vendored governed checker and render one combined report.'
      : "Apply each vendored governed checker's safe mechanical fixes.",
    '',
    'Options:',
    '  --skill <ki-skill>        Run one vendored governed checker.',
    ...(mode === 'conform' ? ['  --dry-run                 Report changes without writing them.'] : []),
    '  --progress <mode>         Progress: auto, always, or never (default: auto).',
    '  --reporter-levels <list>  Render levels, or all (default: FAIL,WARN).',
    '  -h, --help                Show this help and exit.'
  ].join('\n')}\n`

const binDir = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(binDir, '..', '..')
const checkersDir = join(binDir, '..', 'bootstrap', 'checkers')

const contained = (root: string, path: string): boolean => {
  const rel = relative(root, path)
  return rel === '' || (rel !== '..' && !rel.startsWith('../') && !rel.startsWith('..\\'))
}

const safeSourceLink = (path: string): boolean => {
  try {
    const target = readlinkSync(path)
    if (!target || isAbsolute(target)) return false
    return contained(realpathSync(join(repositoryRoot, 'skills')), realpathSync(resolve(dirname(path), target)))
  } catch {
    return false
  }
}

const safeGovernFile = (path: string): boolean => {
  if (!existsSync(path)) return false
  const stat = lstatSync(path)
  return (stat.isFile() || stat.isSymbolicLink()) && (!stat.isSymbolicLink() || safeSourceLink(path))
}

const governedSkillNames = (): string[] =>
  existsSync(checkersDir)
    ? readdirSync(checkersDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort()
    : []

const parseLevels = (value: string): readonly CheckerLevel[] => {
  if (value.toLowerCase() === 'all') return LEVELS
  const levels = value
    .split(',')
    .map((level) => level.trim().toUpperCase())
    .filter(Boolean) as CheckerLevel[]
  if (!levels.length || levels.some((level) => !LEVELS.includes(level)))
    throw new Error(`--reporter-levels accepts ${LEVELS.join(', ')}, or all`)
  return [...new Set(levels)]
}

const parseOptions = (mode: CheckMode, argv: readonly string[]) => {
  let skill: string | undefined
  let progress: ProgressMode = 'auto'
  let levels = DEFAULT_LEVELS[mode]
  let dryRun = false
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index] as string
    const readValue = (option: string): string => {
      const value = argument === option ? argv[++index] : argument.slice(option.length + 1)
      if (!value || value.startsWith('-')) throw new Error(`${option} requires a value`)
      return value
    }
    if (argument === '--skill' || argument.startsWith('--skill=')) {
      skill = readValue('--skill')
      if (!/^ki-[a-z0-9-]+$/.test(skill)) throw new Error('--skill requires one canonical ki-* skill name')
    } else if (argument === '--progress' || argument.startsWith('--progress=')) {
      const value = readValue('--progress')
      if (!(['auto', 'always', 'never'] as const).includes(value as ProgressMode))
        throw new Error('--progress accepts auto, always, or never')
      progress = value as ProgressMode
    } else if (argument === '--reporter-levels' || argument.startsWith('--reporter-levels=')) {
      levels = parseLevels(readValue('--reporter-levels'))
    } else if (argument === '--dry-run' && mode === 'conform') {
      dryRun = true
    } else {
      throw new Error(`unknown option: ${argument}`)
    }
  }
  return { skill, progress, levels, dryRun }
}

const ANSI_ESCAPE = new RegExp(`${String.fromCharCode(27)}\\[[0-?]*[ -/]*[@-~]`, 'gu')

const displayWidth = (value: string): number =>
  Array.from(value.replace(ANSI_ESCAPE, '')).reduce((width, char) => {
    const point = char.codePointAt(0) ?? 0
    return width + (point === 0 || (point >= 0x300 && point <= 0x36f) ? 0 : point >= 0x1100 ? 2 : 1)
  }, 0)

const truncate = (value: string, width: number): string => {
  if (displayWidth(value) <= width) return value
  if (width <= 3) return '.'.repeat(Math.max(width, 0))
  let output = ''
  for (const char of Array.from(value)) {
    if (displayWidth(output) + displayWidth(char) > width - 3) break
    output += char
  }
  return `${output}...`
}

const progressLine = (mode: CheckMode, completed: number, total: number, detail: string): string => {
  const columns = process.stderr.isTTY && process.stderr.columns > 0 ? process.stderr.columns : 80
  const left = mode.toUpperCase()
  const summary = `${completed}/${total} ${total === 0 ? 100 : Math.round((completed / total) * 100)}% ${detail}`
  const available = columns - left.length - summary.length - 4
  if (available < 8) return truncate(summary, columns)
  const filled = total === 0 ? available : Math.min(available, Math.floor((completed / total) * available))
  return `${left} [${'#'.repeat(filled)}${'.'.repeat(available - filled)}] ${summary}`
}

const createProgress = (mode: CheckMode, progress: ProgressMode, total: number) => {
  const enabled = progress === 'always' || (progress === 'auto' && Boolean(process.stderr.isTTY))
  const write = (completed: number, detail: string, final = false): void => {
    if (!enabled) return
    process.stderr.write(
      `${process.stderr.isTTY ? '\r\x1b[2K' : ''}${progressLine(mode, completed, total, detail)}${final || !process.stderr.isTTY ? '\n' : ''}`
    )
  }
  return { write, complete: () => write(total, 'complete', true) }
}

const findingLine = (finding: Finding, skill?: string, full = true): string =>
  `  ${ICON[finding.level]} ${SHORT[finding.level].padEnd(4)}${skill ? ` ${skill.padEnd(20)}` : ''} [${finding.title} (${finding.code})]${finding.subject ? ` ${finding.subject}` : ''} — ${full ? finding.message : finding.message.split('\n')[0]}`

const render = (mode: CheckMode, reports: readonly AggregateReport[], errors: readonly string[], levels: readonly CheckerLevel[]): void => {
  for (const report of reports) {
    const visible = report.findings.filter((finding) => levels.includes(finding.level))
    if (!visible.length) continue
    process.stdout.write(`\n==> ki:${report.skill.replace(/^ki-/, '')}:${mode}\n`)
    for (const finding of visible) process.stdout.write(`${findingLine(finding)}\n`)
    process.stdout.write(
      `  ${report.summary.fail ? ICON.FAIL : report.summary.warn ? ICON.WARN : ICON.PASS} summary: FAIL=${report.summary.fail} WARN=${report.summary.warn} FIXED=${report.summary.fixed} JUDGMENT_UNEVALUATED=${report.summary.judgment.unevaluated}\n`
    )
  }
  const findings = reports.flatMap((report) => report.findings.map((finding) => ({ ...finding, skill: report.skill })))
  const visible = findings.filter((finding) => levels.includes(finding.level))
  process.stdout.write('\n==> recap\n')
  if (!visible.length)
    process.stdout.write(`  ✅ no ${levels.join(' / ')} findings across ${mode === 'audit' ? 'audited' : 'conformed'} skills\n`)
  else for (const finding of visible) process.stdout.write(`${findingLine(finding, finding.skill, false)}\n`)
  const count = (level: CheckerLevel): number => findings.filter((finding) => finding.level === level).length
  const judgment = reports.reduce((total, report) => total + report.summary.judgment.unevaluated, 0)
  process.stdout.write(
    `  ${count('FAIL') ? ICON.FAIL : count('WARN') ? ICON.WARN : ICON.PASS} totals: FAIL=${count('FAIL')} WARN=${count('WARN')} FIXED=${count('FIXED')} JUDGMENT_UNEVALUATED=${judgment}\n`
  )
  for (const error of errors) process.stdout.write(`  ❌ fail ${error}\n`)
}

const importGoverned = async (skill: string): Promise<GovernedModule> => {
  const path = join(checkersDir, skill, 'scripts', 'govern.ts')
  if (!safeGovernFile(path)) throw new Error(`${skill}: governed entrypoint is missing or unsafe`)
  const candidate = (await import(pathToFileURL(path).href)) as Partial<GovernedModule>
  if (typeof candidate.plan !== 'function' || typeof candidate.check !== 'function')
    throw new Error(`${skill}: governed entrypoint must export plan() and check()`)
  return candidate as GovernedModule
}

const checkerOptions = (governed: GovernedModule, mode: CheckMode, dryRun: boolean, statusTracker?: (event: StatusEvent) => void) => {
  const arguments_ = [repositoryRoot, ...(mode === 'conform' && dryRun ? ['--dry-run'] : [])]
  const parsed = governed.options?.(mode, arguments_) ?? { target: repositoryRoot, dryRun }
  return { ...parsed, target: repositoryRoot, dryRun, ...(statusTracker ? { statusTracker } : {}) }
}

const run = async (mode: CheckMode, argv: readonly string[]): Promise<number> => {
  if (argv.includes('-h') || argv.includes('--help')) {
    process.stdout.write(modeUsage(mode))
    return 0
  }
  const options = parseOptions(mode, argv)
  let skills = governedSkillNames()
  if (options.skill) {
    if (!skills.includes(options.skill)) throw new Error(`no vendored checker for ${options.skill}`)
    skills = [options.skill]
  }
  const modules = new Map<string, GovernedModule>()
  const plans = new Map<string, number>()
  const errors: string[] = []
  for (const skill of skills) {
    try {
      const governed = await importGoverned(skill)
      modules.set(skill, governed)
      const plan = governed.plan(mode, checkerOptions(governed, mode, options.dryRun))
      if (!Number.isInteger(plan.plannedItems) || plan.plannedItems < 0) throw new Error('plan returned an invalid work count')
      plans.set(skill, plan.plannedItems)
    } catch (error) {
      errors.push(`${skill}: ${error instanceof Error ? error.message : String(error)}`)
      plans.set(skill, 1)
    }
  }
  const total = [...plans.values()].reduce((sum, value) => sum + value, 0)
  const progress = createProgress(mode, options.progress, total)
  const reports: AggregateReport[] = []
  let completed = 0
  for (const skill of skills) {
    const governed = modules.get(skill)
    const planned = plans.get(skill) ?? 1
    progress.write(completed, skill)
    if (!governed) {
      completed += planned
      continue
    }
    try {
      const result = governed.check(
        mode,
        checkerOptions(governed, mode, options.dryRun, (event) => {
          if (event.type === 'item-complete' || event.type === 'complete' || event.type === 'failed')
            progress.write(Math.min(total, completed + event.completed), `${skill}: ${event.code ?? event.type}`)
        })
      )
      reports.push({ skill, findings: result.findings, summary: result.summary })
      if (result.exitCode !== 0) errors.push(`${skill}: checker reported failures`)
    } catch (error) {
      errors.push(`${skill}: ${error instanceof Error ? error.message : String(error)}`)
    }
    completed += planned
  }
  progress.complete()
  render(mode, reports, errors, options.levels)
  return errors.length ? 1 : 0
}

const main = async (): Promise<void> => {
  const [verb, ...argv] = process.argv.slice(2)
  if (!verb || verb === '-h' || verb === '--help') {
    process.stdout.write(usage())
    return
  }
  if (verb === 'educate' || verb === 'help') {
    execFileSync(join(binDir, verb === 'educate' ? 'ki-educate' : 'ki-help'), argv, { stdio: 'inherit' })
    return
  }
  if (verb === 'refresh') {
    process.stderr.write('REFRESH is harness-only; run it in ki-agentic-harness.\n')
    process.exitCode = 3
    return
  }
  if (verb !== 'audit' && verb !== 'conform') throw new Error(`unknown command: ${verb}`)
  process.exitCode = await run(verb, argv)
}

try {
  await main()
} catch (error) {
  process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 2
}
