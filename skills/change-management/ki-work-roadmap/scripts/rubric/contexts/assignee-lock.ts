/** Read-only Git evidence for the assignee lock: the assignee an `in-progress` record started with. */
import { spawnSync } from 'node:child_process'

/** The work model's holder values a record's `assignee` may take. */
export const ASSIGNEE_RE = /^(?:owner|(?:work|run|person|repo)\/[A-Za-z0-9][A-Za-z0-9._-]*)$/

type Version = { readonly status: string | undefined; readonly assignee: string | undefined }

const field = (frontmatter: string, key: string): string | undefined => {
  const match = new RegExp(`^${key}:[ \\t]*(.*?)[ \\t]*$`, 'm').exec(frontmatter)
  const raw = match?.[1]
  if (!raw || raw === 'null' || raw === '~') return undefined
  return raw.replace(/^(['"])(.*)\1$/, '$2')
}

const version = (text: string): Version | undefined => {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text)?.[1]
  return frontmatter === undefined
    ? undefined
    : { status: field(frontmatter, 'status'), assignee: field(frontmatter, 'assignee') }
}

const git = (repository: string, args: readonly string[]): string | undefined => {
  const result = spawnSync('git', ['-C', repository, ...args], { encoding: 'utf8' })
  return result.status === 0 ? result.stdout : undefined
}

/**
 * The assignee the record held when its current `in-progress` run began: the first assignee named across the
 * consecutive committed versions that are `in-progress`, oldest first, so filling in an absent assignee is not a
 * change. Undefined when the history is unavailable or no committed in-progress version names one.
 */
export const lockedAssignee = (repository: string, path: string): string | undefined => {
  const log = git(repository, ['log', '--format=%H', '--', path])
  if (log === undefined) return undefined
  const run: Version[] = []
  for (const commit of log.split('\n').filter(Boolean)) {
    const text = git(repository, ['show', `${commit}:./${path}`])
    const parsed = text === undefined ? undefined : version(text)
    if (parsed?.status !== 'in-progress') break
    run.push(parsed)
  }
  return run.reverse().find((entry) => entry.assignee !== undefined)?.assignee
}
