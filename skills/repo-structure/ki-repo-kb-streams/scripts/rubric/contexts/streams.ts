import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { basename, isAbsolute, join, relative, resolve } from 'node:path'
import type {
  AuditOutcome,
  RubricContextOptions,
  RubricPublication,
  RubricPublicationContext,
  RubricSession,
  ViolationLevel
} from '../../shared/rubric.ts'

const OPERATIONAL_AREAS = ['Roadmap', 'Trades', 'Projects'] as const
const REQUIRED_AREAS = ['Roadmap'] as const
const EXECUTION_FAMILIES = ['STREAM', 'GATE', 'CONFIG'] as const
const LEGACY_FOLDERS = [
  'Active',
  'Background',
  'Dormant',
  'Now',
  'Next',
  'Soon',
  'Waiting for',
  'Parked',
  'Future'
] as const
const STREAMS_TABLE = 'ki-repo-kb-streams'

export type StreamsEvidence = {
  level: 'FAIL' | 'WARN' | 'INFO' | 'NOT_APPLICABLE' | 'PASS'
  message: string
  subject?: string
}

export type StreamRubricContext = {
  operationalAreas: readonly StreamsEvidence[]
  legacyFolders: readonly StreamsEvidence[]
  roadmapIdentity: readonly StreamsEvidence[]
  roadmapFrontmatter: readonly StreamsEvidence[]
}

export type GateRubricContext = {
  anchor: readonly StreamsEvidence[]
}

export type ConfigRubricContext = {
  parseable: readonly StreamsEvidence[]
  knownKeys: readonly StreamsEvidence[]
  processNote: readonly StreamsEvidence[]
}

export type StreamsRubricContext = {
  rubric: RubricPublicationContext
  stream: StreamRubricContext
  gate: GateRubricContext
  config: ConfigRubricContext
}

type StreamsConfiguration = {
  keys: Record<string, string>
  ownKeys: readonly string[]
  streams: string
  malformed: boolean
}

const safeRegularFile = (root: string, path: string): boolean => {
  const output = relative(root, path)
  if (isAbsolute(output) || output === '..' || output.startsWith('../')) return false
  let cursor = root
  for (const segment of output.split(/[\\/]/)) {
    if (!segment) continue
    cursor = join(cursor, segment)
    if (!existsSync(cursor) || lstatSync(cursor).isSymbolicLink()) return false
  }
  return regularFile(path)
}

export const auditEvidence = (
  evidence: readonly StreamsEvidence[],
  defaultLevel: ViolationLevel,
  overrideLevels?: readonly ViolationLevel[]
): readonly AuditOutcome[] =>
  evidence.map((finding): AuditOutcome => {
    if (finding.level === 'FAIL' || finding.level === 'WARN') {
      const level = finding.level
      return {
        status: 'VIOLATION',
        message: finding.message,
        ...(finding.subject ? { subject: finding.subject } : {}),
        ...(level !== defaultLevel && overrideLevels?.includes(level) ? { level } : {})
      }
    }
    return {
      status: finding.level,
      message: finding.message,
      ...(finding.subject ? { subject: finding.subject } : {})
    }
  })

const directory = (path: string): boolean => existsSync(path) && lstatSync(path).isDirectory()
const regularFile = (path: string): boolean =>
  existsSync(path) && lstatSync(path).isFile() && !lstatSync(path).isSymbolicLink()

const directories = (path: string): string[] =>
  directory(path)
    ? readdirSync(path, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
    : []

const markdownPaths = (path: string, values: string[] = []): string[] => {
  for (const entry of directory(path) ? readdirSync(path, { withFileTypes: true }) : []) {
    if (entry.name.startsWith('.')) continue
    const child = join(path, entry.name)
    if (entry.isDirectory()) markdownPaths(child, values)
    else if (entry.isFile() && entry.name.endsWith('.md')) values.push(child)
  }
  return values
}

const parseConfiguration = (text: string): StreamsConfiguration => {
  try {
    const document = Bun.TOML.parse(text) as Record<string, unknown>
    const own = (document.skills as Record<string, unknown> | undefined)?.[STREAMS_TABLE] as
      | Record<string, unknown>
      | undefined
    return {
      keys: Object.fromEntries(
        Object.entries(own ?? {})
          .filter(([key]) => key === 'process_note')
          .map(([key, value]) => [key, String(value)])
      ),
      ownKeys: Object.keys(own ?? {}),
      streams: 'Streams',
      malformed: false
    }
  } catch {
    return { keys: {}, ownKeys: [], streams: 'Streams', malformed: true }
  }
}

// The repository roadmap standard's structural-validity invariant: every direct-child record
// other than the ledger, the ideas list and the KB index note carries parseable frontmatter whose `id` matches
// its filename identifier, and no two records share an `id`. One walk feeds both STREAM-6 and
// STREAM-7, so a record STREAM-6 cannot compare is always reported by STREAM-7. The full record
// format belongs to the roadmap adapter.
const ROADMAP_NON_RECORDS = new Set(['_ISSUES.md', '_IDEAS.md', 'Roadmap.md'])
// Mirrors the roadmap adapter's filename identifier grammar without its slug grammar.
const FILENAME_IDENTIFIER = /^([A-Z0-9][A-Z0-9-]{1,23}-\d{3,})-./
const WORK_ITEM_IDENTIFIER = /^[A-Z0-9][A-Z0-9-]{1,23}-\d{3,}$/

type RoadmapRecord = { path: string; id?: string; defect?: string }

const roadmapRecord = (root: string, path: string, name: string): RoadmapRecord => {
  const display = relative(root, path)
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(readFileSync(path, 'utf8'))
  if (!frontmatter) return { path: display, defect: 'does not begin with YAML frontmatter' }
  let values: unknown
  try {
    values = Bun.YAML.parse(frontmatter[1])
  } catch {
    return { path: display, defect: 'has frontmatter that is not parseable YAML' }
  }
  if (!values || typeof values !== 'object' || Array.isArray(values))
    return { path: display, defect: 'has frontmatter that is not a YAML mapping' }
  const raw = (values as Record<string, unknown>).id
  const id = typeof raw === 'string' ? raw.trim() : ''
  if (!id) return { path: display, defect: 'has no frontmatter id' }
  // A slug may begin with digits, so the identifier grammar alone cannot split every filename;
  // a record conforms when its filename begins with its own well-formed id.
  if (WORK_ITEM_IDENTIFIER.test(id) && name.startsWith(`${id}-`) && name !== `${id}-.md`) return { path: display, id }
  const fileId = FILENAME_IDENTIFIER.exec(name)?.[1]
  if (fileId !== id)
    return {
      path: display,
      id,
      defect: fileId
        ? `has id ${id}, which does not match its filename identifier ${fileId}`
        : `has id ${id}, but its filename is not of the form ${id}-<slug>.md`
    }
  return { path: display, id }
}

const roadmapRecords = (root: string, roadmapPath: string): RoadmapRecord[] =>
  (directory(roadmapPath) ? readdirSync(roadmapPath, { withFileTypes: true }) : [])
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && !ROADMAP_NON_RECORDS.has(entry.name))
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((entry) => roadmapRecord(root, join(roadmapPath, entry.name), entry.name))

const roadmapIdentityEvidence = (
  root: string,
  roadmapPath: string,
  records: readonly RoadmapRecord[]
): StreamsEvidence[] => {
  const byId = new Map<string, string[]>()
  for (const record of records) if (record.id) byId.set(record.id, [...(byId.get(record.id) ?? []), record.path])
  if (byId.size === 0) return [{ level: 'NOT_APPLICABLE', message: 'No identified roadmap records are present.' }]
  const duplicates = [...byId.entries()].filter(([, paths]) => paths.length > 1)
  if (duplicates.length === 0)
    return [
      { level: 'PASS', message: 'Every roadmap record identifier is unique.', subject: relative(root, roadmapPath) }
    ]
  return duplicates.flatMap(([id, paths]) =>
    paths.sort().map((path) => ({
      level: 'FAIL' as const,
      message: `Roadmap identifier ${id} is shared by ${paths.length} records: ${paths.join('; ')}.`,
      subject: path
    }))
  )
}

const roadmapFrontmatterEvidence = (
  root: string,
  roadmapPath: string,
  records: readonly RoadmapRecord[]
): StreamsEvidence[] => {
  if (records.length === 0) return [{ level: 'NOT_APPLICABLE', message: 'No roadmap records are present.' }]
  const defective = records.filter((record) => record.defect)
  if (defective.length === 0)
    return [
      {
        level: 'PASS',
        message: 'Every roadmap record has frontmatter whose id matches its filename identifier.',
        subject: relative(root, roadmapPath)
      }
    ]
  return defective.map((record) => ({
    level: 'FAIL' as const,
    message: `Roadmap record ${record.path} ${record.defect}.`,
    subject: record.path
  }))
}

const sample = (values: readonly string[]): string => values.slice(0, 10).join('; ')

const unavailableContext = (
  publication: RubricPublication | undefined,
  level: 'FAIL' | 'NOT_APPLICABLE',
  message: string,
  subject?: string
): StreamsRubricContext => {
  const evidence: StreamsEvidence = { level, message, ...(subject ? { subject } : {}) }
  const notApplicable: StreamsEvidence[] = [{ level: 'NOT_APPLICABLE', message: 'Streams evidence is unavailable.' }]
  return {
    rubric: { publication },
    stream: {
      operationalAreas: [evidence],
      legacyFolders: notApplicable,
      roadmapIdentity: notApplicable,
      roadmapFrontmatter: notApplicable
    },
    gate: { anchor: notApplicable },
    config: { parseable: notApplicable, knownKeys: notApplicable, processNote: notApplicable }
  }
}

export const createStreamsSession = ({
  repository,
  publication
}: RubricContextOptions): RubricSession<StreamsRubricContext> => {
  const root = resolve(repository)
  if (!directory(root)) {
    const context = unavailableContext(publication, 'FAIL', 'Target is not a directory.', root)
    return {
      subjects: [
        { families: ['RUBRIC'], context: () => context },
        { families: EXECUTION_FAMILIES, context: () => context }
      ],
      proposal: () => ({ writes: [] })
    }
  }

  const configPath = join(root, '.ki.toml')
  const configuration = parseConfiguration(regularFile(configPath) ? readFileSync(configPath, 'utf8') : '')
  const streamsPath = join(root, configuration.streams)
  if (!directory(streamsPath)) {
    const context = unavailableContext(
      publication,
      'NOT_APPLICABLE',
      `No ${configuration.streams}/ zone; its presence is owned by ki-repo-kb.`
    )
    return {
      subjects: [
        { families: ['RUBRIC'], context: () => context },
        { families: EXECUTION_FAMILIES, context: () => context }
      ],
      proposal: () => ({ writes: [] })
    }
  }

  const present = directories(streamsPath)
  const missingAreas = REQUIRED_AREAS.filter((area) => !present.includes(area))
  const unexpectedAreas = present.filter(
    (name) => !OPERATIONAL_AREAS.includes(name as (typeof OPERATIONAL_AREAS)[number])
  )
  const hasTriageDirectory = present.includes('Triage')
  const legacy = present.filter((name) => LEGACY_FOLDERS.includes(name as (typeof LEGACY_FOLDERS)[number]))
  const operationalAreas: StreamsEvidence[] = [
    {
      level: hasTriageDirectory ? 'FAIL' : missingAreas.length || unexpectedAreas.length ? 'WARN' : 'PASS',
      message: hasTriageDirectory
        ? 'Triage is roadmap metadata; Streams/Triage/ must not exist.'
        : missingAreas.length || unexpectedAreas.length
          ? `Streams operational areas need review: missing ${missingAreas.join(', ') || 'none'}; unexpected ${unexpectedAreas.join(', ') || 'none'}.`
          : 'Streams contains the configured Roadmap operational area.',
      subject: configuration.streams
    }
  ]
  if (present.includes('Housekeeping'))
    operationalAreas.push({
      level: 'WARN',
      message:
        'Recurring obligations belong in the configured Activity collection. Reconcile existing Streams/Housekeeping definitions with owner approval; do not automatically move, delete or duplicate them.',
      subject: join(configuration.streams, 'Housekeeping')
    })
  const legacyFolders: StreamsEvidence[] = [
    {
      level: legacy.length ? 'WARN' : 'PASS',
      message: legacy.length
        ? `Legacy Streams state or Focus folders: ${sample(legacy)}.`
        : 'No legacy Streams state or Focus folders are present.',
      subject: configuration.streams
    }
  ]
  const roadmapPath = join(streamsPath, 'Roadmap')
  const hasRoadmapRecords = markdownPaths(roadmapPath).some(
    (path) => !['_ISSUES.md', '_IDEAS.md'].includes(basename(path))
  )
  const anchorFiles = ['CLAUDE.md', 'AGENTS.md'].filter((name) => regularFile(join(root, name)))
  const anchored = anchorFiles.some((name) => {
    const content = readFileSync(join(root, name), 'utf8')
    return /Enactment Process|ki-repo-kb-streams/i.test(content) && /Roadmap|canonical/i.test(content)
  })
  const anchor: StreamsEvidence[] = [
    {
      level: !hasRoadmapRecords ? 'NOT_APPLICABLE' : anchored ? 'PASS' : 'WARN',
      message: !hasRoadmapRecords
        ? 'No roadmap records yet; the gate is not required.'
        : anchored
          ? 'Enactment gate is anchored.'
          : 'Enactment gate is not anchored in root CLAUDE.md or AGENTS.md.',
      ...(anchorFiles.length ? { subject: anchorFiles.join(', ') } : {})
    }
  ]
  const parseable: StreamsEvidence[] = [
    {
      level: configuration.malformed ? 'FAIL' : 'PASS',
      message: configuration.malformed ? 'Cannot parse .ki.toml.' : 'Streams configuration is parseable.',
      subject: '.ki.toml'
    }
  ]
  const unknownKeys = configuration.ownKeys.filter((key) => key !== 'process_note')
  const knownKeys: StreamsEvidence[] = [
    {
      level: unknownKeys.length ? 'WARN' : 'PASS',
      message: unknownKeys.length
        ? `Unrecognised ki-repo-kb-streams key(s): ${unknownKeys.join(', ')}.`
        : 'Only recognised ki-repo-kb-streams keys are present.',
      subject: '.ki.toml'
    }
  ]
  const processNote = configuration.keys.process_note
  const processNotePath = processNote
    ? resolve(root, processNote.endsWith('.md') ? processNote : `${processNote}.md`)
    : undefined
  const processNoteEvidence: StreamsEvidence[] = [
    !processNote
      ? { level: 'PASS', message: 'No optional process_note binding is declared.', subject: '.ki.toml' }
      : safeRegularFile(root, processNotePath as string)
        ? { level: 'PASS', message: 'The declared process_note is a contained regular file.', subject: processNote }
        : {
            level: 'WARN',
            message: 'The declared process_note is missing, unsafe, or outside the base.',
            subject: processNote
          }
  ]
  const records = roadmapRecords(root, roadmapPath)
  const context: StreamsRubricContext = {
    rubric: { publication },
    stream: {
      operationalAreas,
      legacyFolders,
      roadmapIdentity: roadmapIdentityEvidence(root, roadmapPath, records),
      roadmapFrontmatter: roadmapFrontmatterEvidence(root, roadmapPath, records)
    },
    gate: { anchor },
    config: { parseable, knownKeys, processNote: processNoteEvidence }
  }

  return {
    subjects: [
      { families: ['RUBRIC'], context: () => context },
      { families: EXECUTION_FAMILIES, context: () => context }
    ],
    proposal: () => ({ writes: [] })
  }
}
