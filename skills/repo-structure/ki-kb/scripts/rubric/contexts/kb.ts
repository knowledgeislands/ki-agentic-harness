import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import type { ConformOutcome, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'

export const ZONES = ['Calendar', 'Pillars', 'Resources', 'Streams', 'Admin'] as const
export const STAGING = ['+', '-'] as const
const CONFIG = '.ki-config.toml'
const DEFAULT_CONFIG = `# ki-kb — opt-in marker: this table declares the base governed by the KB standard.
[ki-kb]
`
const SNAKE_CASE = /^[a-z][a-z0-9_]*$/

type KiKbConfig = { keys: Record<string, string>; zones: Record<string, string>; requiredFrontmatter: string[]; preflight: string[] }
export type KbEvidenceFinding = {
  level: 'FAIL' | 'WARN' | 'INFO' | 'NOT_APPLICABLE' | 'PASS'
  code: string
  message: string
  subject?: string
}

const isDirectory = (path: string): boolean => existsSync(path) && statSync(path).isDirectory()
const isFile = (path: string): boolean => existsSync(path) && statSync(path).isFile()
const sample = (values: readonly string[], maximum = 10): string =>
  `${values.slice(0, maximum).join('; ')}${values.length > maximum ? `; …+${values.length - maximum} more` : ''}`

const parseConfig = (text: string): { value: KiKbConfig | null; malformed: boolean } => {
  try {
    const document = (Bun.TOML.parse(text) ?? {}) as Record<string, unknown>
    const table = document['ki-kb']
    if (!table || typeof table !== 'object' || Array.isArray(table)) return { value: null, malformed: false }
    const record = table as Record<string, unknown>
    const zones =
      record.zones && typeof record.zones === 'object' && !Array.isArray(record.zones)
        ? Object.fromEntries(Object.entries(record.zones as Record<string, unknown>).filter(([, value]) => typeof value === 'string'))
        : {}
    return {
      value: {
        keys: Object.fromEntries(
          Object.entries(record)
            .filter(([key]) => !['zones', 'required_frontmatter', 'preflight'].includes(key))
            .map(([key, value]) => [key, String(value)])
        ),
        zones,
        requiredFrontmatter: Array.isArray(record.required_frontmatter)
          ? record.required_frontmatter.filter((value): value is string => typeof value === 'string')
          : [],
        preflight: Array.isArray(record.preflight) ? record.preflight.filter((value): value is string => typeof value === 'string') : []
      },
      malformed: false
    }
  } catch {
    return { value: null, malformed: true }
  }
}

const markdownFiles = (directory: string, files: string[] = []): string[] => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) markdownFiles(path, files)
    else if (entry.name.endsWith('.md')) files.push(path)
  }
  return files
}

const frontmatter = (text: string): { keys: string[]; terminated: boolean; type: string | null } | null => {
  const lines = text.split(/\r?\n/)
  if (lines[0]?.trim() !== '---') return null
  const keys: string[] = []
  let type: string | null = null
  for (let index = 1; index < lines.length; index++) {
    const line = lines[index] as string
    if (line.trim() === '---') return { keys, terminated: true, type }
    if (/^\s/.test(line)) continue
    const separator = line.indexOf(':')
    if (separator <= 0) continue
    const key = line.slice(0, separator).trim()
    const value = line
      .slice(separator + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '')
    keys.push(key)
    if (key === 'type') type = value
  }
  return { keys, terminated: false, type }
}

export type KbRubricContext = {
  root: string
  dryRun: boolean
  auditFindings: readonly KbEvidenceFinding[]
  conformRule: (code: string) => RubricOutcomes<ConformOutcome>
}

export const collectKbAuditEvidence = (target: string): readonly KbEvidenceFinding[] => {
  const root = resolve(target)
  const findings: KbEvidenceFinding[] = []
  const add = (level: KbEvidenceFinding['level'], code: string, message: string, subject?: string): void =>
    void findings.push({ level, code, message, ...(subject ? { subject } : {}) })
  if (!isDirectory(root)) {
    add('FAIL', 'ZONE-1', 'Target is not a directory.', root)
    return findings
  }
  const configPath = join(root, CONFIG)
  const parsed = isFile(configPath) ? parseConfig(readFileSync(configPath, 'utf8')) : { value: null, malformed: false }
  const hasCanonicalZone = ZONES.some((zone) => isDirectory(join(root, zone)))
  if (!parsed.value && !parsed.malformed && !hasCanonicalZone) {
    add('NOT_APPLICABLE', 'ZONE-1', 'ki-kb is not applicable: no [ki-kb] declaration or canonical KB zone structural marker.')
    return findings
  }
  const config = parsed.value
  const zoneOf = (zone: string): string => config?.zones[zone] ?? zone
  if (!config) {
    for (const code of ['CONFIG-1', 'CONFIG-2', 'CONFIG-3', 'CONFIG-4', 'CONFIG-5'])
      add(
        'NOT_APPLICABLE',
        code,
        parsed.malformed ? 'Configuration is malformed; the table cannot be inspected.' : '[ki-kb] is not declared.'
      )
  } else {
    for (const key of Object.keys(config.keys)) add('WARN', 'CONFIG-1', `Unrecognised scalar [ki-kb] key: ${key}.`, CONFIG)
    if (Object.keys(config.keys).length === 0) add('PASS', 'CONFIG-1', 'No unrecognised scalar [ki-kb] keys.', CONFIG)
    const aliasable = new Set<string>([...ZONES, ...STAGING])
    for (const [zone, folder] of Object.entries(config.zones)) {
      if (!aliasable.has(zone)) add('WARN', 'CONFIG-3', `Zone alias ${zone} is not a canonical zone or staging area.`, CONFIG)
      else if (zone === folder) add('INFO', 'CONFIG-2', `Zone alias ${zone} restates its canonical folder name.`, CONFIG)
      else add('PASS', 'CONFIG-4', `Zone alias resolves ${zone} to ${folder}/.`, CONFIG)
    }
    if (Object.keys(config.zones).length === 0) {
      add('PASS', 'CONFIG-2', 'No redundant zone aliases.', CONFIG)
      add('PASS', 'CONFIG-3', 'All zone aliases are canonical.', CONFIG)
      add('PASS', 'CONFIG-4', 'Only the ki-kb table was inspected.', CONFIG)
    }
    const missing = config.preflight.filter((path) => !/[*?[\]]/.test(path) && !existsSync(join(root, path)))
    if (missing.length) add('WARN', 'CONFIG-5', `Declared preflight paths are missing: ${sample(missing)}.`, CONFIG)
    else
      add(
        'PASS',
        'CONFIG-5',
        config.preflight.length ? 'Declared literal preflight paths resolve.' : 'No preflight paths are declared.',
        CONFIG
      )
  }
  for (const zone of ZONES) {
    const folder = zoneOf(zone)
    if (!isDirectory(join(root, folder))) {
      add('FAIL', 'ZONE-1', `Required zone ${zone} is missing.`, `${folder}/`)
      continue
    }
    add('PASS', 'ZONE-1', `Required zone ${zone} is present.`, `${folder}/`)
    const index = join(root, folder, `${folder}.md`)
    add(
      isFile(index) ? 'PASS' : 'WARN',
      'ZONE-2',
      isFile(index) ? 'Same-name zone index is present.' : 'Same-name zone index is missing.',
      `${folder}/${folder}.md`
    )
  }
  const admin = zoneOf('Admin')
  if (isDirectory(join(root, admin))) {
    const memory = join(root, admin, 'MEMORY.md')
    add(
      isFile(memory) ? 'PASS' : 'FAIL',
      'ZONE-3',
      isFile(memory) ? 'Root memory index is present.' : 'Root memory index is missing.',
      `${admin}/MEMORY.md`
    )
    for (const subdivision of ['Governance', 'Operations']) {
      const directory = join(root, admin, subdivision)
      const index = join(directory, `${subdivision}.md`)
      add(
        isDirectory(directory) && isFile(index) ? 'PASS' : 'WARN',
        'ADMIN-1',
        isDirectory(directory) ? 'Admin subdivision index is present.' : 'Admin subdivision is absent.',
        `${admin}/${subdivision}/`
      )
    }
    const governance = join(root, admin, 'Governance')
    for (const [code, name, message] of [
      ['ADMIN-2', 'Charter.md', 'Governance charter is present.'],
      ['ADMIN-3', 'Conformance.md', 'Governance conformance record is present.']
    ] as const) {
      const path = join(governance, name)
      add(
        !isDirectory(governance) ? 'NOT_APPLICABLE' : isFile(path) ? 'PASS' : 'WARN',
        code,
        isFile(path) ? message : `${name} is absent.`,
        `${admin}/Governance/${name}`
      )
    }
  } else add('NOT_APPLICABLE', 'ZONE-3', 'Admin zone is absent.')
  for (const staging of STAGING) {
    const folder = zoneOf(staging)
    add('INFO', 'ZONE-4', `${folder}/ is ${isDirectory(join(root, folder)) ? 'present' : 'absent'} staging, not a zone.`, `${folder}/`)
  }
  const anchor = ['CLAUDE.md', 'AGENTS.md'].find((name) => isFile(join(root, name)))
  if (!anchor) add('WARN', 'MEM-2', 'No root CLAUDE.md or AGENTS.md anchors the memory cascade.')
  else {
    const text = readFileSync(join(root, anchor), 'utf8')
    add(
      /memory|ki-kb/i.test(text) ? 'PASS' : 'WARN',
      'MEM-2',
      /memory|ki-kb/i.test(text) ? 'Memory cascade has an always-loaded anchor.' : 'Root orientation does not anchor the memory cascade.',
      anchor
    )
  }
  const required = config?.requiredFrontmatter ?? []
  const unterminated: string[] = []
  const badKeys: string[] = []
  const missingRequired: string[] = []
  const misplacedOutputs: string[] = []
  const outbound = `${zoneOf('-')}/`
  for (const path of markdownFiles(root)) {
    const value = frontmatter(readFileSync(path, 'utf8'))
    if (!value) continue
    const relative = path.slice(root.length + 1)
    if (!value.terminated) {
      unterminated.push(relative)
      continue
    }
    for (const key of value.keys) if (!SNAKE_CASE.test(key)) badKeys.push(`${relative}: ${key}`)
    for (const key of required) if (!value.keys.includes(key)) missingRequired.push(`${relative} (${key})`)
    if ((value.type === 'session-digest' || value.type === 'handoff') && !relative.startsWith(outbound)) misplacedOutputs.push(relative)
  }
  add(
    unterminated.length ? 'FAIL' : 'PASS',
    'NOTE-1a',
    unterminated.length ? `Unterminated frontmatter: ${sample(unterminated)}.` : 'Frontmatter fences are well formed.'
  )
  add(
    missingRequired.length ? 'FAIL' : 'PASS',
    'NOTE-1',
    missingRequired.length
      ? `Required frontmatter is missing: ${sample(missingRequired)}.`
      : required.length
        ? 'Declared required frontmatter is present.'
        : 'No required frontmatter is declared.'
  )
  add(
    badKeys.length ? 'WARN' : 'PASS',
    'NOTE-1b',
    badKeys.length ? `Non-snake_case frontmatter keys: ${sample(badKeys)}.` : 'Frontmatter keys use snake_case.'
  )
  add(
    misplacedOutputs.length ? 'FAIL' : 'PASS',
    'ZONE-5',
    misplacedOutputs.length
      ? `Produced outputs outside ${outbound}: ${sample(misplacedOutputs)}.`
      : 'Produced outputs are routed to outbound staging.'
  )
  return findings
}

const outcomes = (values: ConformOutcome[]): RubricOutcomes<ConformOutcome> => values as RubricOutcomes<ConformOutcome>
export const createKbContext = (target: string, dryRun: boolean): KbRubricContext => {
  const root = resolve(target)
  return {
    root,
    dryRun,
    auditFindings: collectKbAuditEvidence(root),
    conformRule: (code) => {
      if (!isDirectory(root)) return outcomes([{ status: 'VIOLATION', message: 'Target is not a directory.', subject: root }])
      const configPath = join(root, CONFIG)
      const parsed = isFile(configPath) ? parseConfig(readFileSync(configPath, 'utf8')) : { value: null, malformed: false }
      const zoneOf = (zone: string): string => parsed.value?.zones[zone] ?? zone
      if (code === 'CONFIG-4') {
        if (parsed.value) return outcomes([{ status: 'PASS', message: '[ki-kb] table is already present.', subject: CONFIG }])
        if (!dryRun)
          writeFileSync(
            configPath,
            `${isFile(configPath) ? `${readFileSync(configPath, 'utf8').replace(/\n*$/, '\n')}\n` : ''}${DEFAULT_CONFIG}`
          )
        return outcomes([
          { status: 'FIXED', message: `Keyless [ki-kb] table ${dryRun ? 'would be appended' : 'was appended'}.`, subject: CONFIG }
        ])
      }
      if (code === 'ZONE-2') {
        const values: ConformOutcome[] = []
        for (const zone of ZONES) {
          const folder = zoneOf(zone)
          const directory = join(root, folder)
          const index = join(directory, `${folder}.md`)
          if (!isDirectory(directory))
            values.push({
              status: 'NOT_APPLICABLE',
              message: 'Zone folder is absent; creating it needs a judgment call.',
              subject: `${folder}/`
            })
          else if (isFile(index))
            values.push({ status: 'PASS', message: 'Same-name zone index is already present.', subject: `${folder}/${folder}.md` })
          else {
            if (!dryRun) writeFileSync(index, `# ${folder}\n`)
            values.push({
              status: 'FIXED',
              message: `Same-name zone index ${dryRun ? 'would be scaffolded' : 'was scaffolded'}.`,
              subject: `${folder}/${folder}.md`
            })
          }
        }
        return outcomes(values)
      }
      if (code === 'ZONE-3') {
        const admin = zoneOf('Admin')
        const directory = join(root, admin)
        const memory = join(directory, 'MEMORY.md')
        if (!isDirectory(directory))
          return outcomes([
            { status: 'NOT_APPLICABLE', message: 'Admin zone is absent; creating it needs a judgment call.', subject: `${admin}/` }
          ])
        if (isFile(memory))
          return outcomes([{ status: 'PASS', message: 'Root memory index is already present.', subject: `${admin}/MEMORY.md` }])
        if (!dryRun) {
          mkdirSync(dirname(memory), { recursive: true })
          writeFileSync(memory, '# MEMORY\n\n## Active Pillars\n\n<!-- list active Pillars here -->\n')
        }
        return outcomes([
          {
            status: 'FIXED',
            message: `Root memory index ${dryRun ? 'would be scaffolded' : 'was scaffolded'}.`,
            subject: `${admin}/MEMORY.md`
          }
        ])
      }
      return outcomes([{ status: 'NOT_APPLICABLE', message: 'This criterion has no safe conform action.' }])
    }
  }
}
