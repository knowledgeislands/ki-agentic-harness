/**
 * Repository-local coordination evidence: the selected checkout's work records and its own Git
 * object store and worktree registry. Nothing here reads the coordination plane, fetches, or
 * writes, and nothing reads a sibling worktree, so a result depends only on the selected checkout.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import type { AuditOutcome } from '../../shared/rubric.ts'

const ADAPTER_ROOTS: Readonly<Record<string, string>> = { roadmap: 'docs/roadmap', 'kb-streams': 'Streams/Roadmap' }

const PLANE_NOT_EVALUATED = 'the coordination plane side was not evaluated'

type Git = (...args: string[]) => { ok: boolean; stdout: string }

const gitIn =
  (repository: string): Git =>
  (...args) => {
    const result = spawnSync('git', ['-C', repository, ...args], {
      encoding: 'utf8',
      env: { ...process.env, GIT_OPTIONAL_LOCKS: '0', GIT_TERMINAL_PROMPT: '0' }
    })
    return { ok: result.status === 0, stdout: (result.stdout ?? '').trim() }
  }

const readTable = (repository: string, table: string): Record<string, unknown> | undefined => {
  const path = join(repository, '.ki.toml')
  if (!existsSync(path)) return undefined
  try {
    const skills = (Bun.TOML.parse(readFileSync(path, 'utf8')) as { skills?: Record<string, unknown> }).skills
    const value = skills?.[table]
    return value && typeof value === 'object' ? (value as Record<string, unknown>) : undefined
  } catch {
    return undefined
  }
}

type TaskLink = { authority: string; scope: string; id: string; relation: string }

type LinkedRecord = { file: string; id: string; baselineRef: string | null; links: readonly TaskLink[] }

const frontmatter = (source: string): Record<string, unknown> | undefined => {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source)
  if (!match) return undefined
  try {
    const value = Bun.YAML.parse(match[1] ?? '')
    return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : undefined
  } catch {
    return undefined
  }
}

/** Paperclip task links whose identity fields are strings; shape validation belongs to the work adapter. */
const paperclipLinks = (values: Record<string, unknown>): TaskLink[] => {
  const providers = values.task_links
  if (!providers || typeof providers !== 'object') return []
  const references = (providers as Record<string, unknown>).paperclip
  if (!Array.isArray(references)) return []
  return references.flatMap((reference) => {
    if (!reference || typeof reference !== 'object') return []
    const { authority, scope, id, relation } = reference as Record<string, unknown>
    return typeof authority === 'string' &&
      typeof scope === 'string' &&
      typeof id === 'string' &&
      typeof relation === 'string'
      ? [{ authority, scope, id, relation }]
      : []
  })
}

const linkedRecords = (repository: string, root: string): LinkedRecord[] => {
  const directory = join(repository, root)
  if (!existsSync(directory)) return []
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort()
    .flatMap((name) => {
      const values = frontmatter(readFileSync(join(directory, name), 'utf8'))
      if (!values || typeof values.id !== 'string') return []
      const links = paperclipLinks(values)
      if (links.length === 0) return []
      const baselineRef = typeof values.baseline_ref === 'string' && values.baseline_ref ? values.baseline_ref : null
      return [{ file: `${root}/${name}`, id: values.id, baselineRef, links }]
    })
}

/** Why a record's repository, identifier and baseline triple does not resolve, or undefined when it does. */
const unresolvedTriple = (git: Git, root: string, record: LinkedRecord, ref: string): string | undefined => {
  if (!git('cat-file', '-e', `${ref}^{commit}`).ok) return 'is not a commit in the local object store'
  if (!git('merge-base', '--is-ancestor', ref, 'HEAD').ok) return 'is not an ancestor of HEAD'
  const names = git('ls-tree', '--name-only', ref, '--', `${root}/`)
    .stdout.split('\n')
    .map((path) => path.slice(path.lastIndexOf('/') + 1))
  if (!names.some((name) => name === `${record.id}.md` || name.startsWith(`${record.id}-`)))
    return `contains no record for ${record.id} under ${root}`
  return undefined
}

/**
 * `COORD-3` repository-side linkage: each governing Paperclip link's baseline triple resolves, and
 * each delivery task identity is claimed as governing by at most one record.
 */
export const linkageOutcomes = (repository: string): AuditOutcome[] => {
  const adapter = readTable(repository, 'ki-work')?.adapter
  const root = typeof adapter === 'string' ? ADAPTER_ROOTS[adapter] : undefined
  if (!root)
    return [
      {
        status: 'NOT_APPLICABLE',
        message: `the repository selects no local work adapter (${typeof adapter === 'string' ? adapter : 'none declared'}), so no work record is readable here`
      }
    ]
  const records = linkedRecords(repository, root)
  if (records.length === 0)
    return [{ status: 'NOT_APPLICABLE', message: `no work record under ${root} carries a Paperclip task link` }]
  const git = gitIn(repository)
  const outcomes: AuditOutcome[] = []
  const claimants = new Map<string, { label: string; files: string[] }>()
  let triples = 0
  for (const record of records) {
    const governing = record.links.filter((link) => link.relation === 'implementation')
    for (const link of governing) {
      const key = JSON.stringify([link.authority, link.scope, link.id])
      const entry = claimants.get(key) ?? { label: `${link.authority} ${link.scope} ${link.id}`, files: [] }
      if (!entry.files.includes(record.file)) entry.files.push(record.file)
      claimants.set(key, entry)
    }
    if (governing.length === 0 || !record.baselineRef) continue
    triples += 1
    const failure = unresolvedTriple(git, root, record, record.baselineRef)
    if (failure)
      outcomes.push({
        status: 'VIOLATION',
        subject: record.file,
        message: `${record.id} governs a Paperclip task but its baseline_ref ${record.baselineRef} ${failure}; correct the record, and reconcile the task side by judgment`
      })
  }
  for (const { label, files } of claimants.values())
    if (files.length > 1)
      outcomes.push({
        status: 'VIOLATION',
        subject: files[0],
        message: `Paperclip task ${label} is claimed as governing by ${files.length} records (${files.join(', ')}); a delivery task has at most one governing KI item`
      })
  if (outcomes.length) return outcomes
  return [
    {
      status: 'PASS',
      message: `${claimants.size} governing Paperclip task link${claimants.size === 1 ? '' : 's'} and ${triples} baseline triple${triples === 1 ? '' : 's'} checked across ${records.length} linked record${records.length === 1 ? '' : 's'}; ${PLANE_NOT_EVALUATED}`
    }
  ]
}

const contains = (parent: string, candidate: string): boolean => {
  const inside = relative(parent, candidate)
  return inside === '' || (!inside.startsWith('..') && !isAbsolute(inside))
}

/** The destination branch: the remote default branch when recorded locally, otherwise `main`. */
const destination = (git: Git): { branch: string; ref: string } | undefined => {
  const remoteHead = git('symbolic-ref', '--quiet', '--short', 'refs/remotes/origin/HEAD')
  const branch = remoteHead.ok && remoteHead.stdout.startsWith('origin/') ? remoteHead.stdout.slice(7) : 'main'
  for (const ref of [`refs/remotes/origin/${branch}`, `refs/heads/${branch}`])
    if (git('rev-parse', '--verify', '--quiet', `${ref}^{commit}`).ok) return { branch, ref }
  return undefined
}

/**
 * `COORD-15` selected worktree: when the selected checkout is a linked worktree, it lies outside the
 * primary working tree and the Git common directory, and the destination tip is an ancestor of its head.
 */
export const worktreeBaseOutcomes = (repository: string): AuditOutcome[] => {
  const git = gitIn(repository)
  const paths = git('rev-parse', '--path-format=absolute', '--show-toplevel', '--git-dir', '--git-common-dir')
  if (!paths.ok) return [{ status: 'NOT_APPLICABLE', message: 'the selected checkout is not a Git working tree' }]
  const [top = '', gitDirectory = '', commonDirectory = ''] = paths.stdout.split('\n').map((path) => resolve(path))
  if (gitDirectory === commonDirectory)
    return [
      {
        status: 'NOT_APPLICABLE',
        message: "the selected checkout is the repository's own working tree, not a linked worktree"
      }
    ]
  const primary = git('worktree', 'list', '--porcelain')
    .stdout.split('\n')[0]
    ?.replace(/^worktree /, '')
  const workingTree = primary ? resolve(primary) : dirname(commonDirectory)
  const outcomes: AuditOutcome[] = []
  const boundaries = [
    ...(contains(workingTree, top) ? ['working tree'] : []),
    ...(contains(commonDirectory, top) ? ['Git common directory'] : [])
  ]
  outcomes.push(
    boundaries.length
      ? {
          status: 'VIOLATION',
          subject: top,
          message: `the linked worktree ${top} is registered inside the ${boundaries.join(' and ')} of ${workingTree}; provision it again outside both`
        }
      : { status: 'PASS', subject: top, message: `${top} lies outside the working tree and Git common directory` }
  )
  const target = destination(git)
  const head = git('rev-parse', 'HEAD').stdout
  if (!target) {
    outcomes.push({
      status: 'NOT_APPLICABLE',
      subject: top,
      message: 'no local destination branch ref is recorded, so the base cannot be compared'
    })
    return outcomes
  }
  const tip = git('rev-parse', target.ref).stdout
  if (git('merge-base', '--is-ancestor', target.ref, 'HEAD').ok)
    outcomes.push({
      status: 'PASS',
      subject: top,
      message: `${top} contains the tip of ${target.branch} (${tip.slice(0, 12)})`
    })
  else {
    const behind = Number(git('rev-list', '--count', `HEAD..${target.ref}`).stdout) || 0
    outcomes.push({
      status: 'VIOLATION',
      subject: top,
      message: `the linked worktree ${top} is at ${head.slice(0, 12)}, behind ${target.branch} (${tip.slice(0, 12)}) by ${behind} commit${behind === 1 ? '' : 's'}, so its base is superseded; re-admit it at the current tip before its work lands`
    })
  }
  return outcomes
}

type RegisteredWorktree = { path: string; head?: string; branch?: string; detached: boolean }

const registeredWorktrees = (git: Git): RegisteredWorktree[] =>
  git('worktree', 'list', '--porcelain')
    .stdout.split(/\n\n+/)
    .flatMap((block) => {
      const lines = block.split('\n')
      const path = lines.find((line) => line.startsWith('worktree '))?.slice(9)
      if (!path || lines.includes('bare')) return []
      const head = lines.find((line) => line.startsWith('HEAD '))?.slice(5)
      const branch = lines.find((line) => line.startsWith('branch '))?.slice(7)
      return [{ path, head, branch, detached: lines.includes('detached') }]
    })

const DAY = 86_400

/**
 * `COORD-9` held-workspace listing: the linked worktrees whose merge gate cannot pass on local
 * evidence, a detached `HEAD` or a branch head that is not an ancestor of the primary worktree's
 * branch. Outcomes are `INFO` only, so the selected checkout's verdict never depends on a sibling.
 */
export const heldWorkspaceOutcomes = (repository: string, now = Date.now()): AuditOutcome[] => {
  const git = gitIn(repository)
  if (!git('rev-parse', '--git-dir').ok)
    return [{ status: 'NOT_APPLICABLE', message: 'the selected checkout is not a Git working tree' }]
  const [primary, ...linked] = registeredWorktrees(git)
  if (!primary?.branch)
    return [
      {
        status: 'NOT_APPLICABLE',
        message: 'the primary worktree has no branch checked out, so no destination is readable'
      }
    ]
  const destination = primary.branch.replace(/^refs\/heads\//, '')
  const held = linked.flatMap((worktree): AuditOutcome[] => {
    const head = worktree.head
    if (!head) return []
    const branch = worktree.branch?.replace(/^refs\/heads\//, '')
    if (branch && git('merge-base', '--is-ancestor', head, primary.branch ?? '').ok) return []
    const [ahead = '?', behind = '?'] = git(
      'rev-list',
      '--left-right',
      '--count',
      `${head}...${primary.branch}`
    ).stdout.split(/\s+/)
    const committed = Number(git('log', '-1', '--format=%ct', head).stdout)
    const age = Number.isFinite(committed) && committed > 0 ? Math.floor((now / 1000 - committed) / DAY) : undefined
    const status = gitIn(worktree.path)('status', '--porcelain')
    const dirty = !status.ok ? 'working tree unreadable' : status.stdout ? 'dirty' : 'clean'
    return [
      {
        status: 'INFO',
        subject: worktree.path,
        message: `held workspace ${worktree.path}: ${branch ? `branch ${branch}` : 'detached HEAD'} at ${head.slice(0, 12)}, ${ahead} ahead and ${behind} behind ${destination}, head committed ${age === undefined ? 'at an unknown time' : `${age} day${age === 1 ? '' : 's'} ago`}, ${dirty}; plane-side gates (task-tree terminality, cooldown, active runs) were not evaluated. Next: confirm close-readiness in Paperclip, then capture a Triage item through ki-next to land, discard or record it as duplicate`
      }
    ]
  })
  if (held.length) return held
  return [
    {
      status: 'INFO',
      message: `no linked worktree is held: ${linked.length} linked worktree${linked.length === 1 ? '' : 's'} on branches merged into ${destination}`
    }
  ]
}
