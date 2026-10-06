#!/usr/bin/env bun

/**
 * Purpose: Ground a ki-recap from current repository and eligible runtime transcripts.
 * Run: bun scripts/recap-grounding.ts --help
 * Boundary: Read-only; it reads the selected repository's Git state and eligible Claude
 * or Codex transcript files, then emits evidence for the recap procedure to interpret.
 *
 * This is not a checker, so it has no severity ladder or exit-1 finding contract.
 *
 * Usage: bun scripts/recap-grounding.ts [repo-path] [--json]
 *   [--runtime detect|claude|codex] [--transcripts-dir <dir>] [--transcript <session-file>]
 *
 * Inside an identified Claude Code session (`CLAUDE_CODE_SESSION_ID`), the helper selects
 * that session's own transcript from any Claude project directory, or declines transcript
 * evidence with a reason; it never substitutes another session or runtime. Otherwise it
 * selects the newest eligible transcript for the resolved repository: Claude candidates
 * live directly in its derived project directory; Codex candidates are regular JSONL files
 * below its sessions directory whose session metadata names the same working directory.
 * Discovery reads only a bounded header prefix of at most a bounded number of candidates,
 * newest first, and parses the selected transcript body once. It emits files touched, a
 * tool-call tally, high-cost candidates, selection evidence, and repository evidence for
 * the warm recap procedure to interpret.
 */

import { execFileSync } from 'node:child_process'
import {
  closeSync,
  type Dirent,
  lstatSync,
  openSync,
  readdirSync,
  readFileSync,
  readSync,
  realpathSync,
  statSync
} from 'node:fs'
import { homedir } from 'node:os'
import { basename, isAbsolute, join, resolve } from 'node:path'

type Runtime = 'claude' | 'codex'
type RuntimeSelector = Runtime | 'detect'

type ToolCall = {
  name: string
  input: unknown
}

type WorktreeState = 'clean' | 'dirty'

type RepositoryEvidence = {
  repo: string
  head: string | null
  worktree: WorktreeState
}

type TranscriptEvidence = {
  status: 'unchanged' | 'changed' | 'unavailable'
  baseline: RepositoryEvidence | null
  current: RepositoryEvidence | null
  commitRange?: string
  changedPaths?: string[]
}

type RepositoryGrounding =
  | {
      status: 'available'
      root: string
      evidence: RepositoryEvidence
      filesTouched: string[]
      stagedFiles: string[]
      unstagedFiles: string[]
      untrackedFiles: string[]
      diffStat: string
    }
  | { status: 'unavailable'; root: null; reason: string }

type TranscriptCandidate = {
  runtime: Runtime
  path: string
  mtime: number
}

type TranscriptSelection = {
  method: 'live-session' | 'newest-eligible' | 'explicit' | 'none'
  reason?: string
  examined: number
  limitReached: boolean
}

type Grounding = {
  repo: string
  repository: RepositoryGrounding
  runtime: Runtime | null
  transcript: string | null
  transcriptSelection: TranscriptSelection
  filesTouched: string[]
  stagedFiles: string[]
  unstagedFiles: string[]
  untrackedFiles: string[]
  diffStat: string
  toolTally: Record<string, number>
  highCostCandidates: string[]
  'ki-work-recap-repository-evidence/v1': RepositoryEvidence | null
  transcriptEvidence: TranscriptEvidence
}

type Arguments = {
  jsonMode: boolean
  repoArg: string | undefined
  runtime: RuntimeSelector
  transcriptsDir: string | undefined
  transcriptSelector: string | undefined
}

const REPOSITORY_EVIDENCE_MARKER = 'ki-work-recap-repository-evidence/v1'
const COMMIT = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/

/** Maximum prefix read from one candidate to verify its eligibility metadata. */
const HEADER_BYTES = 64 * 1024
/** Maximum candidate headers inspected per runtime before discovery declines. */
const HEADER_FILE_LIMIT = 256
const SESSION_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/

type RuntimeContext = {
  /** Claude Code's documented `CLAUDE_CODE_SESSION_ID`, when the helper runs inside a Claude Code session. */
  claudeSessionId: string | undefined
  /** Claude Code sets `CLAUDECODE=1` in the subprocesses it spawns. */
  claudeCode: boolean
  claudeProjectsRoot: string
  codexSessionsRoot: string
}

type Discovery = {
  candidates: TranscriptCandidate[]
  examined: number
  limitReached: boolean
}

type Choice = {
  selected: TranscriptCandidate | null
  selection: TranscriptSelection
}

const runtimeContext = (environment: NodeJS.ProcessEnv): RuntimeContext => {
  const configDir = environment.CLAUDE_CONFIG_DIR?.trim()
  const sessionId = environment.CLAUDE_CODE_SESSION_ID?.trim()
  return {
    claudeSessionId: sessionId ? sessionId : undefined,
    claudeCode: environment.CLAUDECODE === '1',
    claudeProjectsRoot: join(configDir ? resolve(configDir) : join(homedir(), '.claude'), 'projects'),
    codexSessionsRoot: join(homedir(), '.codex', 'sessions')
  }
}

/** Claude Code's documented project-directory rule: every non-alphanumeric character becomes `-`. */
const slugifyRepoPath = (absolutePath: string): string => absolutePath.replace(/[^A-Za-z0-9]/g, '-')

const parseJsonLines = (text: string): unknown[] => {
  const records: unknown[] = []
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue
    try {
      records.push(JSON.parse(line) as unknown)
    } catch {
      // Malformed transcript lines are not evidence and must not stop grounding.
    }
  }
  return records
}

const readJsonl = (path: string): unknown[] => {
  try {
    return parseJsonLines(readFileSync(path, 'utf8'))
  } catch {
    return []
  }
}

/**
 * Read only the complete lines inside a bounded prefix. Returns null when the prefix
 * holds no complete line, because eligibility metadata cannot then be verified.
 */
const readHeaderRecords = (path: string): unknown[] | null => {
  let descriptor: number | undefined
  try {
    descriptor = openSync(path, 'r')
    const buffer = Buffer.alloc(HEADER_BYTES)
    const length = readSync(descriptor, buffer, 0, HEADER_BYTES, 0)
    const text = buffer.subarray(0, length).toString('utf8')
    if (length < HEADER_BYTES) return parseJsonLines(text)
    const lastNewline = text.lastIndexOf('\n')
    return lastNewline < 0 ? null : parseJsonLines(text.slice(0, lastNewline))
  } catch {
    return null
  } finally {
    if (descriptor !== undefined) closeSync(descriptor)
  }
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null

const isSessionMeta = (record: unknown): boolean => asRecord(record)?.type === 'session_meta'

const codexTranscriptCwd = (records: readonly unknown[]): string | null => {
  for (const record of records) {
    const event = asRecord(record)
    if (event?.type !== 'session_meta') continue
    const payload = asRecord(event.payload)
    if (typeof payload?.cwd === 'string') {
      try {
        return realpathSync(resolve(payload.cwd))
      } catch {
        return null
      }
    }
  }
  return null
}

const readEntries = (directory: string): Dirent[] => {
  try {
    return readdirSync(directory, { withFileTypes: true })
  } catch {
    return []
  }
}

/** Regular (non-symlink) `.jsonl` files, found from directory metadata alone. */
const regularJsonlFiles = (directory: string, recursive: boolean): string[] => {
  const files: string[] = []
  for (const entry of readEntries(directory)) {
    const path = join(directory, entry.name)
    if (entry.isFile() && entry.name.endsWith('.jsonl')) files.push(path)
    else if (recursive && entry.isDirectory()) files.push(...regularJsonlFiles(path, true))
  }
  return files
}

const candidate = (runtime: Runtime, path: string): TranscriptCandidate | null => {
  try {
    return { runtime, path, mtime: statSync(path).mtimeMs }
  } catch {
    return null
  }
}

/**
 * Inspect candidate headers newest first. Without a selector, the first eligible
 * candidate is the newest eligible one, so discovery stops there. With a selector,
 * only basename matches are inspected and every eligible match is kept so that an
 * ambiguous selector is still rejected.
 */
const discover = (
  runtime: Runtime,
  files: readonly string[],
  eligible: (header: readonly unknown[]) => boolean,
  selector: string | undefined
): Discovery => {
  const ordered = files
    .filter((path) => !selector || basename(path) === selector)
    .map((path) => candidate(runtime, path))
    .filter((candidate_): candidate_ is TranscriptCandidate => candidate_ !== null)
    .sort((left, right) => right.mtime - left.mtime)

  const candidates: TranscriptCandidate[] = []
  let examined = 0
  for (const candidate_ of ordered) {
    if (examined >= HEADER_FILE_LIMIT) return { candidates, examined, limitReached: true }
    examined += 1
    const header = readHeaderRecords(candidate_.path)
    if (!header || !eligible(header)) continue
    candidates.push(candidate_)
    if (!selector) break
  }
  return { candidates, examined, limitReached: false }
}

const discoverClaude = (directory: string, selector: string | undefined): Discovery =>
  discover('claude', regularJsonlFiles(directory, false), (header) => !header.some(isSessionMeta), selector)

const discoverCodex = (directory: string, repo: string, selector: string | undefined): Discovery =>
  discover('codex', regularJsonlFiles(directory, true), (header) => codexTranscriptCwd(header) === repo, selector)

const validateSelector = (selector: string): void => {
  if (
    selector.length <= '.jsonl'.length ||
    !selector.endsWith('.jsonl') ||
    isAbsolute(selector) ||
    basename(selector) !== selector ||
    selector.includes('\\')
  )
    throw new Error('`--transcript` must be a basename ending in .jsonl from the eligible transcript candidates')
}

const isRegularFile = (path: string): boolean => {
  try {
    return lstatSync(path).isFile()
  } catch {
    return false
  }
}

/**
 * Locate the invoking Claude Code session's transcript by its identity. Every project
 * directory is probed rather than deriving the launch slug, so truncated slugs, a named
 * project directory, and `/cd` relocation do not hide it. Only an unambiguous regular
 * file qualifies.
 */
const locateLiveClaude = (
  sessionId: string,
  projectsRoot: string,
  transcriptsDir: string | undefined
): { selected: TranscriptCandidate | null; reason?: string } => {
  if (!SESSION_ID.test(sessionId)) return { selected: null, reason: 'live-session-identity-invalid' }
  const name = `${sessionId}.jsonl`
  const directories = transcriptsDir
    ? [resolve(transcriptsDir)]
    : readEntries(projectsRoot)
        .filter((entry) => entry.isDirectory())
        .map((entry) => join(projectsRoot, entry.name))
  const matches = directories.map((directory) => join(directory, name)).filter(isRegularFile)
  if (matches.length === 0) return { selected: null, reason: 'live-session-transcript-not-found' }
  if (matches.length > 1) return { selected: null, reason: 'live-session-transcript-ambiguous' }
  return { selected: candidate('claude', matches[0] as string) }
}

const chooseExplicit = (discoveries: readonly Discovery[], selector: string): TranscriptCandidate => {
  const matches = discoveries.flatMap((discovery) => discovery.candidates)
  if (matches.length === 0) throw new Error(`selected transcript is not an eligible regular file: ${selector}`)
  if (matches.length > 1)
    throw new Error(`selected transcript basename is ambiguous across eligible candidates: ${selector}`)
  return matches[0] as TranscriptCandidate
}

/**
 * Selection policy:
 * - An identified Claude Code session selects its own transcript, or declines with a
 *   reason; it never substitutes another session or runtime.
 * - A Claude Code runtime without an identity searches only the target's Claude project.
 * - Only an unidentified runtime under `detect` compares both runtimes' newest candidates.
 * - `--runtime codex` and `--transcript` remain explicit repository-matched selections.
 */
const chooseTranscript = ({
  runtime,
  repo,
  transcriptsDir,
  transcriptSelector,
  context
}: Pick<Arguments, 'runtime' | 'transcriptsDir' | 'transcriptSelector'> & {
  repo: string
  context: RuntimeContext
}): Choice => {
  if (transcriptSelector) validateSelector(transcriptSelector)

  if (context.claudeSessionId && !transcriptSelector && runtime !== 'codex') {
    const live = locateLiveClaude(context.claudeSessionId, context.claudeProjectsRoot, transcriptsDir)
    return {
      selected: live.selected,
      selection: live.selected
        ? { method: 'live-session', examined: 0, limitReached: false }
        : {
            method: 'none',
            reason: live.reason ?? 'live-session-transcript-not-found',
            examined: 0,
            limitReached: false
          }
    }
  }

  const effective: RuntimeSelector =
    runtime === 'detect' && (context.claudeCode || context.claudeSessionId) ? 'claude' : runtime
  const claudeDirectory = transcriptsDir
    ? resolve(transcriptsDir)
    : join(context.claudeProjectsRoot, slugifyRepoPath(repo))
  const codexDirectory = transcriptsDir ? resolve(transcriptsDir) : context.codexSessionsRoot
  const discoveries: Discovery[] = []
  if (effective !== 'codex') discoveries.push(discoverClaude(claudeDirectory, transcriptSelector))
  if (effective !== 'claude') discoveries.push(discoverCodex(codexDirectory, repo, transcriptSelector))

  const examined = discoveries.reduce((total, discovery) => total + discovery.examined, 0)
  const limitReached = discoveries.some((discovery) => discovery.limitReached)
  if (transcriptSelector) {
    return {
      selected: chooseExplicit(discoveries, transcriptSelector),
      selection: { method: 'explicit', examined, limitReached }
    }
  }

  const selected =
    discoveries.flatMap((discovery) => discovery.candidates).sort((left, right) => right.mtime - left.mtime)[0] ?? null
  if (selected) return { selected, selection: { method: 'newest-eligible', examined, limitReached } }
  return {
    selected: null,
    selection: {
      method: 'none',
      reason: limitReached ? 'discovery-limit' : 'no-eligible-transcript',
      examined,
      limitReached
    }
  }
}

const printHelp = (): void => {
  console.log(`Usage: recap-grounding.ts [repo-path] [--json] [--runtime detect|claude|codex] [--transcripts-dir <dir>] [--transcript <session-file>]

Ground a live ki-recap with current repository and Claude or Codex transcript data.

Arguments:
  repo-path                  Repository to inspect (default: current directory)

Options:
  --json                     Emit machine-readable JSON
  --runtime <value>          detect (default), claude, or codex
  --transcripts-dir <dir>    Override the selected runtime transcript root
  --transcript <file>        Select one eligible transcript by basename
  -h, --help, ?              Show this help and exit

Inside an identified Claude Code session (CLAUDE_CODE_SESSION_ID), the session's own
transcript is selected, or transcript evidence is declined with a reason. Discovery reads
only bounded candidate headers, newest first, and Git grounding is always reported.`)
}

const parseArguments = (args: string[]): Arguments => {
  let jsonMode = false
  let repoArg: string | undefined
  let runtime: RuntimeSelector = 'detect'
  let transcriptsDir: string | undefined
  let transcriptSelector: string | undefined

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index] as string
    if (argument === '--json') {
      jsonMode = true
      continue
    }
    if (argument === '--runtime' || argument === '--transcripts-dir' || argument === '--transcript') {
      const value = args[index + 1]
      if (!value || value.startsWith('--')) throw new Error(`\`${argument}\` requires a value`)
      if (argument === '--runtime') {
        if (!['detect', 'claude', 'codex'].includes(value))
          throw new Error('`--runtime` accepts detect, claude, or codex')
        runtime = value as RuntimeSelector
      } else if (argument === '--transcripts-dir') transcriptsDir = value
      else transcriptSelector = value
      index += 1
      continue
    }
    if (argument.startsWith('--')) throw new Error(`unknown option: ${argument}`)
    if (repoArg) throw new Error(`unexpected argument: ${argument}`)
    repoArg = argument
  }

  return { jsonMode, repoArg, runtime, transcriptsDir, transcriptSelector }
}

const toolInput = (value: unknown): unknown => {
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value) as unknown
  } catch {
    return value
  }
}

const textValues = (value: unknown): string[] => {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap((entry) => textValues(entry))
  const record = asRecord(value)
  return typeof record?.text === 'string' ? [record.text] : []
}

const repositoryEvidence = (value: unknown, repository: string): RepositoryEvidence | null => {
  const record = asRecord(value)
  const marker = asRecord(record?.[REPOSITORY_EVIDENCE_MARKER])
  if (
    !marker ||
    typeof marker.repo !== 'string' ||
    (marker.head !== null && (typeof marker.head !== 'string' || !COMMIT.test(marker.head)))
  )
    return null
  if (marker.worktree !== 'clean' && marker.worktree !== 'dirty') return null
  try {
    if (realpathSync(marker.repo) !== repository) return null
  } catch {
    return null
  }
  return { repo: repository, head: marker.head as string | null, worktree: marker.worktree }
}

const helperOutputEvidence = (text: string, repository: string): RepositoryEvidence | null => {
  try {
    return repositoryEvidence(JSON.parse(text) as unknown, repository)
  } catch {
    return null
  }
}

const transcriptOutputTexts = (records: readonly unknown[], runtime: Runtime): string[] => {
  const texts: string[] = []
  for (const record of records) {
    const event = asRecord(record)
    if (!event) continue
    if (runtime === 'claude') {
      const message = asRecord(event.message)
      const content = message?.content
      if (!Array.isArray(content)) continue
      for (const block of content) {
        const result = asRecord(block)
        if (result?.type === 'tool_result') texts.push(...textValues(result.content))
      }
      continue
    }
    if (event.type !== 'response_item') continue
    const item = asRecord(event.payload)
    const payload = asRecord(item?.item) ?? item
    if (payload?.type === 'custom_tool_call_output') texts.push(...textValues(payload.output))
  }
  return texts
}

const latestTranscriptEvidence = (
  records: readonly unknown[],
  runtime: Runtime,
  repository: string
): RepositoryEvidence | null =>
  transcriptOutputTexts(records, runtime)
    .map((text) => helperOutputEvidence(text, repository))
    .filter((evidence): evidence is RepositoryEvidence => evidence !== null)
    .at(-1) ?? null

const readToolCalls = (records: readonly unknown[], runtime: Runtime): ToolCall[] => {
  const calls: ToolCall[] = []
  for (const record of records) {
    const event = asRecord(record)
    if (!event) continue

    if (runtime === 'claude') {
      const message = asRecord(event.message)
      const content = message?.content
      if (!Array.isArray(content)) continue
      for (const block of content) {
        const tool = asRecord(block)
        if (tool?.type === 'tool_use' && typeof tool.name === 'string')
          calls.push({ name: tool.name, input: tool.input })
      }
      continue
    }

    if (event.type !== 'response_item') continue
    const item = asRecord(event.payload)
    const payload = asRecord(item?.item) ?? item
    if (
      !payload ||
      (payload.type !== 'function_call' && payload.type !== 'custom_tool_call') ||
      typeof payload.name !== 'string'
    )
      continue
    calls.push({ name: payload.name, input: toolInput(payload.arguments ?? payload.input) })
  }
  return calls
}

const gitOutput = (repo: string, args: string[]): string | null => {
  try {
    return execFileSync('git', args, { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return null
  }
}

const lines = (value: string): string[] => value.split('\n').filter(Boolean)

const resolveRepository = (path: string): string | null => {
  const root = gitOutput(path, ['rev-parse', '--show-toplevel'])
  if (!root) return null
  try {
    return realpathSync(root)
  } catch {
    return null
  }
}

const groundRepository = (path: string): RepositoryGrounding => {
  const root = resolveRepository(path)
  if (!root) return { status: 'unavailable', root: null, reason: 'Git top-level root could not be resolved.' }
  const head = gitOutput(root, ['rev-parse', 'HEAD'])
  const porcelain = gitOutput(root, ['status', '--porcelain'])
  const stagedStat = gitOutput(root, ['diff', '--cached', '--stat'])
  const unstagedStat = gitOutput(root, ['diff', '--stat'])
  const stagedNames = gitOutput(root, ['diff', '--cached', '--name-only'])
  const unstagedNames = gitOutput(root, ['diff', '--name-only'])
  if (head === null || porcelain === null || stagedStat === null || unstagedStat === null)
    return { status: 'unavailable', root: null, reason: 'Git state could not be read completely.' }
  if (stagedNames === null || unstagedNames === null)
    return { status: 'unavailable', root: null, reason: 'Git change paths could not be read completely.' }
  const stagedFiles = lines(stagedNames)
  const unstagedFiles = lines(unstagedNames)
  const untrackedFiles = lines(porcelain)
    .filter((line) => line.startsWith('?? '))
    .map((line) => line.slice(3))
  const filesTouched = lines(porcelain).map((line) => line.trim())
  return {
    status: 'available',
    root,
    evidence: { repo: root, head: head || null, worktree: filesTouched.length ? 'dirty' : 'clean' },
    filesTouched,
    stagedFiles,
    unstagedFiles,
    untrackedFiles,
    diffStat: [stagedStat, unstagedStat].filter(Boolean).join('\n')
  }
}

const compareEvidence = (
  repo: string,
  baseline: RepositoryEvidence | null,
  current: RepositoryEvidence | null
): TranscriptEvidence => {
  if (!current || !baseline?.head || !current.head) return { status: 'unavailable', baseline, current }
  if (
    !gitOutput(repo, ['rev-parse', '--verify', `${baseline.head}^{commit}`]) ||
    !gitOutput(repo, ['rev-parse', '--verify', `${current.head}^{commit}`])
  )
    return { status: 'unavailable', baseline, current }
  if (baseline.head === current.head && baseline.worktree === 'clean' && current.worktree === 'clean')
    return { status: 'unchanged', baseline, current }

  const changed = baseline.head !== current.head || baseline.worktree !== current.worktree
  if (!changed) return { status: 'unavailable', baseline, current }
  if (baseline.head === current.head) return { status: 'changed', baseline, current }

  const commitRange = `${baseline.head}..${current.head}`
  const changedPaths = lines(gitOutput(repo, ['diff', '--name-only', commitRange]) ?? '')
  return { status: 'changed', baseline, current, commitRange, changedPaths }
}

const findHighCostCandidates = (calls: readonly ToolCall[]): string[] => {
  const candidates: string[] = []
  const signatureTally = new Map<string, number>()
  for (const call of calls) {
    const signature = `${call.name}:${JSON.stringify(call.input)}`
    signatureTally.set(signature, (signatureTally.get(signature) ?? 0) + 1)
  }
  for (const [signature, count] of signatureTally) {
    if (count >= 3) candidates.push(`repeated identical ${signature.split(':')[0]} call (${count}x)`)
  }

  const readTally = new Map<string, number>()
  for (const call of calls) {
    if (call.name !== 'Read') continue
    const input = asRecord(call.input)
    if (typeof input?.file_path !== 'string') continue
    readTally.set(input.file_path, (readTally.get(input.file_path) ?? 0) + 1)
  }
  for (const [path, count] of readTally) if (count >= 2) candidates.push(`re-read of ${path} (${count}x)`)
  return candidates
}

const main = (): void => {
  const rawArgs = process.argv.slice(2)
  if (rawArgs.some((argument) => ['-h', '--help', '?'].includes(argument))) {
    printHelp()
    return
  }

  const { jsonMode, repoArg, runtime, transcriptsDir, transcriptSelector } = parseArguments(rawArgs)
  const requestedPath = resolve(repoArg ?? process.cwd())
  const repository = groundRepository(requestedPath)
  const repo = repository.status === 'available' ? repository.root : requestedPath
  const { selected, selection } = chooseTranscript({
    runtime,
    repo,
    transcriptsDir,
    transcriptSelector,
    context: runtimeContext(process.env)
  })
  // Parse the selected transcript body once, and only after selection.
  const records = selected ? readJsonl(selected.path) : []
  const calls = selected ? readToolCalls(records, selected.runtime) : []
  const currentEvidence = repository.status === 'available' ? repository.evidence : null
  const baseline = currentEvidence && selected ? latestTranscriptEvidence(records, selected.runtime, repo) : null
  const toolTally: Record<string, number> = {}
  for (const call of calls) toolTally[call.name] = (toolTally[call.name] ?? 0) + 1

  const grounding: Grounding = {
    repo,
    repository,
    runtime: selected?.runtime ?? null,
    transcript: selected?.path ?? null,
    transcriptSelection: selection,
    filesTouched: repository.status === 'available' ? repository.filesTouched : [],
    stagedFiles: repository.status === 'available' ? repository.stagedFiles : [],
    unstagedFiles: repository.status === 'available' ? repository.unstagedFiles : [],
    untrackedFiles: repository.status === 'available' ? repository.untrackedFiles : [],
    diffStat: repository.status === 'available' ? repository.diffStat : '',
    toolTally,
    highCostCandidates: findHighCostCandidates(calls),
    [REPOSITORY_EVIDENCE_MARKER]: currentEvidence,
    transcriptEvidence: compareEvidence(repo, baseline, currentEvidence)
  }

  if (jsonMode) {
    console.log(JSON.stringify(grounding, null, 2))
    return
  }

  console.log(`repo: ${grounding.repo}`)
  console.log(`runtime: ${grounding.runtime ?? '(none found)'}`)
  console.log(`transcript: ${grounding.transcript ?? '(none found)'}`)
  console.log(
    `transcript selection: ${selection.method}${selection.reason ? ` (${selection.reason})` : ''}; headers examined: ${selection.examined}${selection.limitReached ? '; discovery limit reached' : ''}`
  )
  console.log(`repository: ${grounding.repository.status}`)
  if (grounding.repository.status === 'unavailable') console.log(`repository reason: ${grounding.repository.reason}`)
  console.log(`files touched: ${grounding.filesTouched.length}`)
  console.log(grounding.diffStat || '(no diff)')
  console.log(`tool tally: ${JSON.stringify(grounding.toolTally)}`)
  console.log(`transcript evidence: ${grounding.transcriptEvidence.status}`)
  if (grounding.highCostCandidates.length > 0) {
    console.log('high-cost candidates:')
    for (const candidate_ of grounding.highCostCandidates) console.log(`  - ${candidate_}`)
  }
}

try {
  main()
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`recap-grounding: ${message}`)
  process.exitCode = 1
}
