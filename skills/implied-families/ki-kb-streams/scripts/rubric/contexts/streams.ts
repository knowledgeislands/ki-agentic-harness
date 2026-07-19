import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import type { ConformOutcome, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'

const FOCI = ['Active', 'Background', 'Dormant', 'Future', 'Settled'] as const
const STATUS = ['draft', 'ready', 'rejected', 'in-progress', 'rolled-out', 'reviewed', 'completed']
const PRIORITY = ['urgent', 'high', 'medium', 'low']
const SUFFIX = ' Proposal'
type Finding = { level: 'FAIL' | 'WARN' | 'INFO' | 'NOT_APPLICABLE' | 'PASS'; code: string; message: string; subject?: string }
type Config = { keys: Record<string, string>; streams: string }
const dir = (path: string): boolean => existsSync(path) && statSync(path).isDirectory()
const file = (path: string): boolean => existsSync(path) && statSync(path).isFile()
const directories = (path: string): string[] =>
  dir(path)
    ? readdirSync(path, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
    : []
const markdown = (path: string, values: string[] = []): string[] => {
  for (const entry of dir(path) ? readdirSync(path, { withFileTypes: true }) : []) {
    if (entry.name.startsWith('.')) continue
    const child = join(path, entry.name)
    if (entry.isDirectory()) markdown(child, values)
    else if (entry.name.endsWith('.md')) values.push(child)
  }
  return values
}
const parse = (text: string): Config => {
  try {
    const doc = Bun.TOML.parse(text) as Record<string, unknown>
    const own = doc['ki-kb-streams'] as Record<string, unknown> | undefined
    const kb = doc['ki-kb'] as Record<string, unknown> | undefined
    const zones = kb?.zones as Record<string, unknown> | undefined
    return {
      keys: Object.fromEntries(
        Object.entries(own ?? {})
          .filter(([key]) => ['process_note', 'note_type_scheme'].includes(key))
          .map(([key, value]) => [key, String(value)])
      ),
      streams: typeof zones?.Streams === 'string' ? zones.Streams : 'Streams'
    }
  } catch {
    return { keys: {}, streams: 'Streams' }
  }
}
const fm = (text: string): { values: Record<string, string>; closed: boolean } | null => {
  const lines = text.split(/\r?\n/)
  if (lines[0]?.trim() !== '---') return null
  const values: Record<string, string> = {}
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i] as string
    if (line.trim() === '---') return { values, closed: true }
    if (/^\s/.test(line)) continue
    const at = line.indexOf(':')
    if (at > 0)
      values[line.slice(0, at).trim()] = line
        .slice(at + 1)
        .trim()
        .replace(/^['"]|['"]$/g, '')
  }
  return { values, closed: false }
}
const sample = (values: string[]): string => values.slice(0, 10).join('; ')
const bare = (value: string, vocabulary: readonly string[]): string | null =>
  vocabulary.includes(value)
    ? null
    : (vocabulary.find((token) => value.startsWith(token) && /[\s,;.()-]/.test(value.charAt(token.length))) ?? null)

export type StreamsContext = {
  root: string
  dryRun: boolean
  auditFindings: readonly Finding[]
  conformRule: (code: string) => RubricOutcomes<ConformOutcome>
}
export const collectStreamsAudit = (target: string): readonly Finding[] => {
  const root = resolve(target),
    findings: Finding[] = []
  const add = (level: Finding['level'], code: string, message: string, subject?: string) =>
    findings.push({ level, code, message, ...(subject ? { subject } : {}) })
  if (!dir(root)) {
    add('FAIL', 'STREAM-1', 'Target is not a directory.', root)
    return findings
  }
  const config = parse(file(join(root, '.ki-config.toml')) ? readFileSync(join(root, '.ki-config.toml'), 'utf8') : '')
  const streams = join(root, config.streams)
  if (!dir(streams)) {
    add('NOT_APPLICABLE', 'STREAM-1', `No ${config.streams}/ zone; its presence is owned by ki-kb.`)
    return findings
  }
  const raw = file(join(root, '.ki-config.toml')) ? readFileSync(join(root, '.ki-config.toml'), 'utf8') : ''
  const own = raw.match(/\[ki-kb-streams\]([\s\S]*?)(?=^\[|$)/m)?.[1] ?? ''
  for (const line of own.split(/\r?\n/)) {
    const key = line.replace(/#.*$/, '').split('=')[0]?.trim()
    if (key && !['process_note', 'note_type_scheme'].includes(key))
      add('WARN', 'CONFIG-1', `Unrecognised ki-kb-streams key: ${key}.`, '.ki-config.toml')
  }
  if (!findings.some((f) => f.code === 'CONFIG-1'))
    add('PASS', 'CONFIG-1', 'Only recognised ki-kb-streams keys are present.', '.ki-config.toml')
  const scheme = config.keys.note_type_scheme
  add(
    scheme && !['type', 'tags'].includes(scheme) ? 'WARN' : 'PASS',
    'CONFIG-2',
    scheme && !['type', 'tags'].includes(scheme) ? `Invalid note_type_scheme: ${scheme}.` : 'Note type scheme is canonical or absent.',
    '.ki-config.toml'
  )
  const present = directories(streams),
    foci = FOCI.filter((focus) => present.includes(focus))
  const stray = present.filter((name) => !FOCI.includes(name as (typeof FOCI)[number]))
  add(
    stray.length ? 'WARN' : 'PASS',
    'STREAM-1',
    stray.length ? `Non-Focus folders: ${sample(stray)}.` : 'All direct folders are Focus folders.',
    config.streams
  )
  for (const focus of foci) {
    const index = join(streams, focus, `${focus}.md`)
    add(
      file(index) ? 'PASS' : 'WARN',
      'STREAM-2',
      file(index) ? 'Focus index is present.' : 'Focus index is missing.',
      `${config.streams}/${focus}/${focus}.md`
    )
  }
  const proposals = markdown(streams).filter((path) => basename(path, '.md').endsWith(SUFFIX)),
    missing: string[] = [],
    badStatus: string[] = [],
    badPriority: string[] = [],
    malformed: string[] = []
  for (const path of proposals) {
    const value = fm(readFileSync(path, 'utf8')),
      relative = path.slice(root.length + 1)
    if (!value || !value.closed) {
      malformed.push(relative)
      continue
    }
    for (const key of ['status', 'priority', 'dependencies']) if (!(key in value.values)) missing.push(`${relative} (${key})`)
    if (value.values.status && !STATUS.includes(value.values.status)) badStatus.push(relative)
    if (value.values.priority && !PRIORITY.includes(value.values.priority)) badPriority.push(relative)
  }
  add(
    malformed.length ? 'FAIL' : missing.length ? 'WARN' : 'PASS',
    'ENACT-1',
    malformed.length
      ? `Malformed proposal frontmatter: ${sample(malformed)}.`
      : missing.length
        ? `Missing proposal frontmatter: ${sample(missing)}.`
        : 'Proposal frontmatter is complete.'
  )
  add(
    badStatus.length || badPriority.length ? 'WARN' : 'PASS',
    'ENACT-2',
    badStatus.length || badPriority.length
      ? `Non-lifecycle status or priority: ${sample([...badStatus, ...badPriority])}.`
      : 'Proposal status and priority use bare lifecycle tokens.'
  )
  const anchor = ['CLAUDE.md', 'AGENTS.md'].find((name) => file(join(root, name)))
  const anchored =
    anchor &&
    /Enactment Process|ki-kb-streams/i.test(readFileSync(join(root, anchor), 'utf8')) &&
    /proposal|canonical/i.test(readFileSync(join(root, anchor), 'utf8'))
  add(
    proposals.length === 0 ? 'NOT_APPLICABLE' : anchored ? 'PASS' : 'WARN',
    'GATE-1',
    proposals.length === 0
      ? 'No proposals yet; the gate is not required.'
      : anchored
        ? 'Enactment gate is anchored.'
        : 'Enactment gate is not anchored in root CLAUDE.md or AGENTS.md.',
    anchor
  )
  return findings
}
const one = (value: ConformOutcome): RubricOutcomes<ConformOutcome> => [value]
export const createStreamsContext = (target: string, dryRun: boolean): StreamsContext => ({
  root: resolve(target),
  dryRun,
  auditFindings: collectStreamsAudit(target),
  conformRule: (code) => {
    if (code !== 'ENACT-2') return one({ status: 'NOT_APPLICABLE', message: 'This criterion has no safe conform action.' })
    const root = resolve(target)
    if (!dir(root)) return one({ status: 'VIOLATION', message: 'Target is not a directory.', subject: root })
    const config = parse(file(join(root, '.ki-config.toml')) ? readFileSync(join(root, '.ki-config.toml'), 'utf8') : ''),
      streams = join(root, config.streams)
    let changed = 0
    for (const path of markdown(streams).filter((item) => basename(item, '.md').endsWith(SUFFIX))) {
      const text = readFileSync(path, 'utf8'),
        lines = text.split('\n')
      let inside = false,
        dirty = false
      for (let index = 0; index < lines.length; index++) {
        const line = lines[index] as string
        if (index === 0 && line.trim() === '---') {
          inside = true
          continue
        }
        if (inside && line.trim() === '---') break
        const match = inside ? line.match(/^(status|priority):\s*(.+)$/) : null
        if (!match) continue
        const value = bare(match[2] as string, match[1] === 'status' ? STATUS : PRIORITY)
        if (value) {
          lines[index] = `${match[1]}: ${value}`
          dirty = true
          changed++
        }
      }
      if (dirty && !dryRun) writeFileSync(path, lines.join('\n'))
    }
    return one(
      changed
        ? { status: 'FIXED', message: `${changed} status or priority value(s) ${dryRun ? 'would be normalised' : 'normalised'}.` }
        : { status: 'PASS', message: 'No safely normalisable status or priority values.' }
    )
  }
})
