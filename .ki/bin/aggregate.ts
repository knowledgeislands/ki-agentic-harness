#!/usr/bin/env bun
// Vendored by ki-bootstrap. Runs each vendored skill checker under ../checkers/ in
// sequence for the given verb — no package.json required.
// Usage: bun .ki/bin/aggregate.ts <audit|conform|educate|help> [options]
import { execFileSync, spawnSync } from 'node:child_process'
import { closeSync, existsSync, lstatSync, mkdtempSync, openSync, readFileSync, readlinkSync, readdirSync, realpathSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const verb = process.argv[2]
if (!verb) {
  console.error('Usage: bun .ki/bin/aggregate.ts <audit|conform|educate|help> [options]')
  process.exit(2)
}
const helpRequested = process.argv.slice(3).some((argument) => argument === '-h' || argument === '--help')
if (helpRequested && (verb === 'audit' || verb === 'conform')) {
  const isConform = verb === 'conform'
  process.stdout.write(
    [
      'Usage: bun .ki/bin/aggregate.ts ' + verb + ' [options]',
      '',
      isConform
        ? 'Apply each vendored skill checker\'s safe mechanical fixes.'
        : 'Audit each vendored skill checker and render one combined report.',
      '',
      'Options:',
      '  --skill <ki-skill>        Run one vendored skill checker.',
      '  --progress <mode>          Progress display: auto, always, or never (default: auto).',
      '  --reporter-levels <levels> Render comma-separated levels or all.',
      ...(isConform ? ['  --dry-run                 Report changes without writing them.'] : []),
      '  -h, --help                Show this help and exit.'
    ].join('\n') + '\n'
  )
  process.exit(0)
}
const binDir = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(binDir, '..', '..')
const contained = (root, path) => {
  const rel = relative(root, path)
  return rel === '' || (rel !== '..' && !rel.startsWith('../') && !rel.startsWith('..\\'))
}
const safeSourceLink = (path) => {
  try {
    const target = readlinkSync(path)
    if (!target || isAbsolute(target)) return false
    const resolved = realpathSync(resolve(dirname(path), target))
    const sourceRoot = realpathSync(join(repositoryRoot, 'skills'))
    return contained(sourceRoot, resolved)
  } catch {
    return false
  }
}
const safeCheckerFile = (path) => {
  if (!existsSync(path)) return false
  const stat = lstatSync(path)
  return (stat.isFile() || stat.isSymbolicLink()) && (!stat.isSymbolicLink() || safeSourceLink(path))
}
if (verb === 'educate' || verb === 'help') {
  // educate: whole-set re-bootstrap or a selected target-local educator payload.
  // help: the vendored HELP snapshots. Both exec the sibling wrapper.
  execFileSync(join(binDir, verb === 'educate' ? 'ki-educate' : 'ki-help'), process.argv.slice(3), { stdio: 'inherit' })
  process.exit(0)
}
if (verb === 'refresh') {
  // REFRESH's write target is always a skill's own canonical files under skills/<name>/
  // in ki-agentic-harness — this vendored runner is by construction never running
  // there, so refresh is always out of scope here. Say so explicitly instead of
  // silently falling through the pattern match below to a bare exit(0).
  console.error(
    '\x1b[33m⚠️  REFRESH is harness-only\x1b[0m — it edits only its own canonical\n' +
      "files, which live in ki-agentic-harness. Run it there, or use ki-kb's\n" +
      'IMPROVE mode for a pattern recurring across bases.'
  )
  process.exit(3)
}
if (verb !== 'audit' && verb !== 'conform') process.exit(0)
const checkersDir = join(binDir, '..', 'bootstrap', 'checkers')
if (!existsSync(checkersDir)) process.exit(0)
let checkers = readdirSync(checkersDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort()

// The aggregate is the sole terminal renderer. Each checker is invoked normally and
// must emit the canonical JSONL stream. A malformed stream is a clear aggregate
// failure: the runner never falls back to a checker's legacy prose or wrapper format.
// Every icon must occupy two display columns so the level column aligns. Most are
// Emoji_Presentation=Yes glyphs (genuinely 2 cols everywhere); ⚠️/ℹ️ have narrow base
// chars that VS16 does NOT widen under wcwidth-style terminals (VS Code/xterm.js counts
// them 1 col), so they carry an explicit trailing space to make up the second column.
// NOT_APPLICABLE uses 🚫 (a 2-col circle-slash) in place of the 1-col ⊘.
const ICON = { FAIL: '\u274c', WARN: '\u26a0\ufe0f ', FIXED: '\u2705', INFO: '\u2139\ufe0f ', NOT_APPLICABLE: '\ud83d\udeab', PASS: '\u2705' }
const LEVELS = ['FAIL', 'WARN', 'FIXED', 'INFO', 'NOT_APPLICABLE', 'PASS']
const PROGRESS_MODES = ['auto', 'always', 'never']
const SUMMARY_KEYS = ['fail', 'warn', 'fixed', 'info', 'notApplicable', 'pass']
const RUN_KEYS = ['version', 'runId', 'record', 'mode', 'concern', 'target', 'generatedAt']
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const DEFAULT_REPORTER_LEVELS = new Set(verb === 'conform' ? ['FAIL', 'WARN', 'FIXED'] : ['FAIL', 'WARN'])
const verbed = verb === 'conform' ? 'conformed' : 'audited'
const runCheckerProcess = (scriptPath, childArgs, env = process.env) => {
  // Bun truncates piped spawn output at roughly 700 KiB even when maxBuffer is
  // raised. Capture through regular files so large canonical JSONL streams stay
  // complete, then remove the private temporary directory immediately.
  const captureDir = mkdtempSync(join(tmpdir(), 'ki-aggregate-'))
  const stdoutPath = join(captureDir, 'stdout')
  const stderrPath = join(captureDir, 'stderr')
  const stdoutFd = openSync(stdoutPath, 'w', 0o600)
  const stderrFd = openSync(stderrPath, 'w', 0o600)
  let result
  try {
    result = spawnSync('bun', [scriptPath, '.', ...childArgs], { stdio: ['ignore', stdoutFd, stderrFd], env })
  } finally {
    closeSync(stdoutFd)
    closeSync(stderrFd)
  }
  try {
    return { ...result, stdout: readFileSync(stdoutPath, 'utf8'), stderr: readFileSync(stderrPath, 'utf8') }
  } finally {
    rmSync(captureDir, { recursive: true, force: true })
  }
}
// Render one finding row: icon status [title (code)] subject — message. full=false
// trims the message to its first line so recap rows remain one-line.
const SHORT = { FAIL: 'fail', WARN: 'warn', FIXED: 'fixed', INFO: 'info', NOT_APPLICABLE: 'na', PASS: 'pass' }
const parseReporterOptions = (args) => {
  let levels = DEFAULT_REPORTER_LEVELS
  let skill
  let progress = 'auto'
  const childArgs = []
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    let value
    if (arg === '--reporter-levels') value = args[++index]
    else if (arg.startsWith('--reporter-levels=')) value = arg.slice('--reporter-levels='.length)
    else if (arg === '--progress') {
      progress = args[++index]
      if (!PROGRESS_MODES.includes(progress)) throw new Error('--progress accepts ' + PROGRESS_MODES.join(', '))
      continue
    } else if (arg.startsWith('--progress=')) {
      progress = arg.slice('--progress='.length)
      if (!PROGRESS_MODES.includes(progress)) throw new Error('--progress accepts ' + PROGRESS_MODES.join(', '))
      continue
    }
    else if (arg === '--skill') {
      skill = args[++index]
      if (!skill || !/^ki-[a-z0-9-]+$/.test(skill)) throw new Error('--skill requires one canonical ki-* skill name')
      continue
    } else if (arg.startsWith('--skill=')) {
      skill = arg.slice('--skill='.length)
      if (!/^ki-[a-z0-9-]+$/.test(skill)) throw new Error('--skill requires one canonical ki-* skill name')
      continue
    } else {
      childArgs.push(arg)
      continue
    }
    if (!value) throw new Error('--reporter-levels requires one or more comma-separated levels')
    const requested = value.toUpperCase() === 'ALL' ? LEVELS : value.split(',').map((level) => level.trim().toUpperCase())
    if (!requested.length || requested.some((level) => !LEVELS.includes(level)))
      throw new Error('--reporter-levels accepts comma-separated values from ' + LEVELS.join(', ') + ', or all')
    levels = new Set(requested)
  }
  return { levels, skill, progress, childArgs }
}
const FALLBACK_TERMINAL_COLUMNS = 80
const COMMAND_COLUMN_WIDTH = 10
const ANSI_ESCAPE = /\x1b\[[0-?]*[ -/]*[@-~]/gu
const displayWidth = (text) =>
  Array.from(text.replace(ANSI_ESCAPE, '')).reduce((width, character) => {
    const point = character.codePointAt(0) || 0
    if (point === 0 || (point >= 0x300 && point <= 0x36f)) return width
    return width + (point >= 0x1100 ? 2 : 1)
  }, 0)
const truncate = (text, width) => {
  const plainText = text.replace(ANSI_ESCAPE, '')
  if (displayWidth(plainText) <= width) return plainText
  if (width <= 0) return ''
  if (width <= 3) return '.'.repeat(width)
  let result = ''
  for (const character of Array.from(plainText)) {
    if (displayWidth(result) + displayWidth(character) > width - 3) break
    result += character
  }
  return result + '...'
}
const progressBar = (width, completed, total) => {
  const innerWidth = width - 2
  if (completed === undefined || total === undefined) return '[>' + '.'.repeat(Math.max(0, innerWidth - 1)) + ']'
  if (total <= 0) return '[' + '#'.repeat(innerWidth) + ']'
  const clamped = Math.max(0, Math.min(completed, total))
  const filled = clamped === total ? innerWidth : Math.floor((clamped / total) * innerWidth)
  return '[' + '#'.repeat(filled) + '.'.repeat(innerWidth - filled) + ']'
}
const progressLine = (left, right, completed, total) => {
  const columns = process.stderr.isTTY && Number.isFinite(process.stderr.columns) && process.stderr.columns > 0
    ? Math.floor(process.stderr.columns)
    : FALLBACK_TERMINAL_COLUMNS
  const leftWidth = Math.min(COMMAND_COLUMN_WIDTH, columns)
  const remainingWidth = columns - leftWidth - 2
  const barWidth = Math.min(100, Math.floor(remainingWidth / 2))
  const rightWidth = remainingWidth - barWidth
  if (barWidth >= 3 && rightWidth > 0)
    return truncate(left, leftWidth).padEnd(leftWidth) + ' ' + progressBar(barWidth, completed, total) + ' ' + truncate(right, rightWidth).padEnd(rightWidth)
  return truncate(right, columns)
}
const createProgressTracker = (mode) => {
  const interactive = Boolean(process.stderr.isTTY)
  if (mode === 'never' || (mode === 'auto' && !interactive))
    return { initialise: () => {}, discover: () => {}, planned: () => {}, start: () => {}, active: () => {}, advance: (completed, count) => completed + count, complete: () => {} }
  let total
  const write = (completed, state, skill) => {
    const detail =
      state === 'initialising'
        ? 'initialising'
        : state.startsWith('discover:')
          ? 'reading checker plans ' + state.slice('discover:'.length)
          : total === undefined
            ? state
            : Math.max(0, Math.min(completed, total)) +
              '/' +
              total +
              ' ' +
              (total <= 0 ? 100 : Math.round((Math.max(0, Math.min(completed, total)) / total) * 100)) +
              '% ' +
              (state === 'start' ? 'starting' : state === 'complete' ? 'complete' : skill)
    process.stderr.write(
      (interactive ? '\r\x1b[2K' : '') +
        progressLine(verb.toUpperCase(), detail, total === undefined ? undefined : completed, total) +
        (interactive && state !== 'complete' ? '' : '\n')
    )
  }
  return {
    initialise: () => write(0, 'initialising'),
    discover: (completed, count) => write(0, 'discover:' + completed + '/' + count),
    planned: (nextTotal) => {
      total = nextTotal
    },
    start: () => write(0, 'start'),
    active: (completed, skill) => write(completed, 'active', skill),
    advance: (completed, count, skill) => {
      write(completed + count, 'active', skill)
      return completed + count
    },
    complete: () => write(total, 'complete')
  }
}
const findingLine = (icon, level, code, title, subject, msg, skill, full) =>
  '  ' + icon + ' ' + (SHORT[level] || level.toLowerCase()).padEnd(4) +
  (skill ? ' ' + skill.padEnd(20) : '') +
  ' \x1b[2m[' + title + ' (' + code + ')]\x1b[0m' +
  (subject ? ' \x1b[36m' + subject + '\x1b[0m' : '') +
  ' — ' + (full ? msg : String(msg).split('\n')[0])

const isRecord = (value) => typeof value === 'object' && value !== null && !Array.isArray(value)
const nonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0
const parseJsonl = (output) => {
  const events = []
  const errors = []
  for (const [index, raw] of output.split(/\r?\n/).entries()) {
    const line = raw.trim()
    if (!line) continue
    try {
      events.push(JSON.parse(line))
    } catch {
      errors.push('line ' + (index + 1) + ' is not valid JSON')
    }
  }
  return { events, errors }
}
const validateReport = (events, exitCode, expectedMode) => {
  const errors = []
  if (events.length < 2) return ['report must contain meta and summary records']
  const meta = events[0]
  const summary = events.at(-1)
  if (!isRecord(meta) || meta.record !== 'meta') errors.push('first record must be meta')
  if (!isRecord(summary) || summary.record !== 'summary') errors.push('last record must be summary')
  if (!isRecord(meta)) return errors
  if (meta.version !== 1) errors.push('meta version must be 1')
  if (!nonEmptyString(meta.runId) || !UUID.test(meta.runId)) errors.push('meta runId must be a UUID')
  if (meta.mode !== expectedMode) errors.push('meta mode must be ' + expectedMode)
  if (!nonEmptyString(meta.concern) || !nonEmptyString(meta.target)) errors.push('meta concern and target must be non-empty')
  if (!nonEmptyString(meta.generatedAt) || Number.isNaN(Date.parse(meta.generatedAt))) errors.push('meta generatedAt must be an ISO timestamp')
  const counts = { fail: 0, warn: 0, fixed: 0, info: 0, notApplicable: 0, pass: 0 }
  let hasFailure = false
  for (const [index, event] of events.entries()) {
    const label = 'record ' + (index + 1)
    if (!isRecord(event)) {
      errors.push(label + ' must be an object')
      continue
    }
    const record = event.record
    if (record !== 'meta' && record !== 'finding' && record !== 'summary') {
      errors.push(label + ' has an invalid record kind')
      continue
    }
    const permitted =
      record === 'meta' ? RUN_KEYS : record === 'finding' ? [...RUN_KEYS, 'level', 'code', 'title', 'message', 'subject'] : [...RUN_KEYS, 'summary']
    for (const key of Object.keys(event)) if (!permitted.includes(key)) errors.push(label + ' has unknown field: ' + key)
    if (event.version !== 1 || event.runId !== meta.runId || event.mode !== meta.mode || event.concern !== meta.concern || event.target !== meta.target || event.generatedAt !== meta.generatedAt)
      errors.push(label + ' must carry the meta run identity')
    if (index > 0 && index < events.length - 1 && record !== 'finding') {
      errors.push(label + ' must be a finding record')
      continue
    }
    if (record !== 'finding') continue
    if (!LEVELS.includes(event.level)) errors.push(label + ' has an invalid finding level')
    if (expectedMode === 'audit' && event.level === 'FIXED') errors.push(label + ' audit finding cannot be FIXED')
    if (!nonEmptyString(event.code) || !nonEmptyString(event.title) || !nonEmptyString(event.message))
      errors.push(label + ' must carry a code, title, and message')
    if (event.subject !== undefined && !nonEmptyString(event.subject)) errors.push(label + ' subject must be non-empty when present')
    if (LEVELS.includes(event.level)) {
      const key = event.level === 'NOT_APPLICABLE' ? 'notApplicable' : event.level.toLowerCase()
      counts[key]++
    }
    if (event.level === 'FAIL') hasFailure = true
  }
  if (isRecord(summary) && summary.record === 'summary') {
    if (!isRecord(summary.summary)) errors.push('summary record must carry a summary object')
    else {
      for (const key of SUMMARY_KEYS) {
        if (!Number.isInteger(summary.summary[key]) || summary.summary[key] < 0 || summary.summary[key] !== counts[key])
          errors.push('summary ' + key + ' does not match findings')
      }
      const judgment = summary.summary.judgment
      if (!isRecord(judgment) || !Number.isInteger(judgment.unevaluated) || judgment.unevaluated < 0)
        errors.push('summary judgment.unevaluated must be a non-negative integer')
      else for (const key of Object.keys(judgment)) if (key !== 'unevaluated') errors.push('summary judgment has unknown key: ' + key)
      for (const key of Object.keys(summary.summary))
        if (![...SUMMARY_KEYS, 'judgment'].includes(key)) errors.push('summary has unknown key: ' + key)
    }
  }
  if ((exitCode !== 0) !== hasFailure) errors.push('exit status must be non-zero if and only if a FAIL finding exists')
  return errors
}

let failed = false
const reports = []
const reportErrors = []
let reporter
try {
  reporter = parseReporterOptions(process.argv.slice(3))
} catch (error) {
  console.error('error: ' + error.message)
  process.exit(2)
}
if (reporter.skill) {
  if (!checkers.includes(reporter.skill)) {
    console.error('error: no vendored checker for ' + reporter.skill)
    process.exit(2)
  }
  checkers = [reporter.skill]
}
const progress = createProgressTracker(reporter.progress)
progress.initialise()
const plannedItemsBySkill = new Map()
for (const [index, skill] of checkers.entries()) {
  const scriptPath = join(checkersDir, skill, 'scripts', verb + '.ts')
  if (!safeCheckerFile(scriptPath)) {
    plannedItemsBySkill.set(skill, 1)
    progress.discover(index + 1, checkers.length)
    continue
  }
  const preflight = runCheckerProcess(scriptPath, verb === 'conform' ? ['--dry-run'] : [], { ...process.env, KI_CHECKER_PLAN: '1' })
  let plan
  try {
    plan = JSON.parse((preflight.stdout ?? '').trim())
  } catch {
    // A legacy or malformed child must still take the normal validation path
    // below, where its actual output is diagnosed. Count it conservatively.
    plannedItemsBySkill.set(skill, 1)
    progress.discover(index + 1, checkers.length)
    continue
  }
  if (preflight.status !== 0 || (preflight.stderr ?? '').trim() || !isRecord(plan) || plan.version !== 1 || plan.record !== 'plan' || !Number.isInteger(plan.items) || plan.items < 0) {
    plannedItemsBySkill.set(skill, 1)
    progress.discover(index + 1, checkers.length)
    continue
  }
  plannedItemsBySkill.set(skill, plan.items)
  progress.discover(index + 1, checkers.length)
}
progress.planned([...plannedItemsBySkill.values()].reduce((total, items) => total + items, 0))
progress.start()
let completed = 0
for (const skill of checkers) {
  progress.active(completed, skill)
  const dir = join(checkersDir, skill)
  const entry = 'scripts/' + verb + '.ts'
  const scriptPath = join(dir, entry)
  if (!existsSync(scriptPath)) {
    failed = true
    reportErrors.push({ skill, errors: ['checker entry is missing: ' + entry] })
    completed = progress.advance(completed, plannedItemsBySkill.get(skill) ?? 1, skill)
    continue
  }
  if (!safeCheckerFile(scriptPath)) {
    failed = true
    reportErrors.push({ skill, errors: ['checker entry is unsafe: ' + entry] })
    completed = progress.advance(completed, plannedItemsBySkill.get(skill) ?? 1, skill)
    continue
  }
  // The renderer consumes --reporter-levels itself. All other flags (for example
  // --dry-run) forward to every child, whose canonical JSONL stays complete.
  const res = runCheckerProcess(scriptPath, reporter.childArgs)
  const parsed = parseJsonl(res.stdout ?? '')
  const errors = [...parsed.errors, ...validateReport(parsed.events, res.status ?? 1, verb)]
  if (res.error) errors.push('process failed to start: ' + res.error.message)
  if ((res.stderr ?? '').trim()) errors.push('checker wrote to stderr: ' + (res.stderr ?? '').trim().split('\n')[0])
  if (errors.length) {
    failed = true
    reportErrors.push({ skill, errors })
    completed = progress.advance(completed, plannedItemsBySkill.get(skill) ?? 1, skill)
    continue
  }
  const findings = parsed.events.slice(1, -1)
  reports.push({ skill, key: 'ki:' + skill.replace(/^ki-/, '') + ':' + verb, findings, summary: parsed.events.at(-1).summary })
  if ((res.status ?? 0) !== 0) failed = true
  completed = progress.advance(completed, plannedItemsBySkill.get(skill) ?? 1, skill)
}
progress.complete()
for (const report of reports) {
  const visible = report.findings.filter((finding) => reporter.levels.has(finding.level))
  if (!visible.length) continue
  console.log('\n\x1b[36m==> ' + report.key + '\x1b[0m')
  for (const finding of visible) {
    const level = finding.level
    console.log(
      findingLine(
        ICON[level],
        level,
        finding.code,
        finding.title,
        finding.subject ?? '',
        finding.message,
        '',
        true
      )
    )
  }
  const summary = report.summary
  const sicon = summary.fail ? ICON.FAIL : summary.warn ? ICON.WARN : ICON.PASS
  console.log(
    '  ' + sicon + ' \x1b[2msummary: FAIL=' + summary.fail + ' WARN=' + summary.warn + ' FIXED=' + summary.fixed +
    ' JUDGMENT_UNEVALUATED=' + summary.judgment.unevaluated + '\x1b[0m'
  )
}
console.log('\n\x1b[36m==> recap\x1b[0m')
const allFindings = reports.flatMap((report) =>
  report.findings.map((finding) => ({
    skill: report.skill,
    level: finding.level,
    code: finding.code,
    title: finding.title,
    msg: finding.message,
    subject: finding.subject ?? ''
  }))
)
const recap = allFindings.filter((finding) => reporter.levels.has(finding.level))
if (recap.length === 0) {
  console.log('  \x1b[32m\u2705 no ' + [...reporter.levels].join(' / ') + ' findings across ' + verbed + ' skills\x1b[0m')
} else {
  console.log('  \x1b[1mselected findings\x1b[0m')
  for (const level of LEVELS)
    for (const h of recap.filter((finding) => finding.level === level))
      console.log(findingLine(ICON[level], level, h.code, h.title, h.subject, h.msg, h.skill, false))
}
const count = (level) => allFindings.filter((finding) => finding.level === level).length
const ticon = count('FAIL') ? ICON.FAIL : count('WARN') ? ICON.WARN : ICON.PASS
const suppressed = LEVELS.filter((level) => !reporter.levels.has(level))
const suppressedCounts = suppressed.map((level) => level + '=' + count(level)).join(' ')
const judgmentUnevaluated = reports.reduce((total, report) => total + report.summary.judgment.unevaluated, 0)
console.log(
  '  ' +
    ticon +
    ' \x1b[2mtotals: FAIL=' +
    count('FAIL') +
    ' WARN=' +
    count('WARN') +
    ' FIXED=' +
    count('FIXED') +
    ' JUDGMENT_UNEVALUATED=' +
    judgmentUnevaluated +
    (suppressed.length ? ' (suppressed: ' + suppressedCounts + ')' : ' (all levels shown)') +
    '\x1b[0m'
)
if (reportErrors.length) {
  console.log('  \x1b[1minvalid checker reports\x1b[0m')
  for (const item of reportErrors) {
    const shown = item.errors.slice(0, 3)
    const remaining = item.errors.length - shown.length
    console.log('  ' + ICON.FAIL + ' fail ' + item.skill + ': ' + shown.join('; ') + (remaining ? '; +' + remaining + ' more' : ''))
  }
}
process.exit(failed ? 1 : 0)
