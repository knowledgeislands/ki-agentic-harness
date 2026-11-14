import { existsSync, lstatSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type {
  ConformWrite,
  RubricContextOptions,
  RubricPublicationContext,
  RubricSession
} from '../../shared/rubric.ts'

const ACQUIRED_PATH = '+/_ACQUIRED/README.md'
const ACQUIRED_TEMPLATE = readFileSync(new URL('../../../assets/templates/acquired/README.md', import.meta.url), 'utf8')
type ScaffoldState = 'missing' | 'canonical' | 'drifted' | 'unsafe'

const scaffoldState = (root: string): ScaffoldState => {
  const parts = ['+', '_ACQUIRED', 'README.md']
  for (let index = 0; index < parts.length; index++) {
    const path = join(root, ...parts.slice(0, index + 1))
    let metadata: ReturnType<typeof lstatSync>
    try {
      metadata = lstatSync(path)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return 'missing'
      throw error
    }
    const leaf = index === parts.length - 1
    if (metadata.isSymbolicLink() || (leaf ? !metadata.isFile() : !metadata.isDirectory())) return 'unsafe'
    if (leaf) return readFileSync(path).equals(Buffer.from(ACQUIRED_TEMPLATE)) ? 'canonical' : 'drifted'
  }
  return 'missing'
}

const REQUIRED = [
  'Admin/MEMORY.md',
  'Admin/Governance/Charter.md',
  'Admin/Governance/Known Lands.md',
  'Admin/Governance/Conventions/Conventions.md',
  'Admin/Operations/Processes/Enactment Process.md'
] as const

export type PrincipalContext = {
  readonly rubric: RubricPublicationContext
  readonly missing: readonly string[]
  readonly empty: readonly string[]
  readonly enactmentAnchor: boolean
  readonly acquired: {
    readonly state: ScaffoldState
    readonly synchronise?: () => void
  }
}

const regular = (path: string): boolean =>
  existsSync(path) && !lstatSync(path).isSymbolicLink() && lstatSync(path).isFile()

export const createPrincipalSession = ({
  mode,
  repository,
  publication
}: RubricContextOptions): RubricSession<PrincipalContext> => {
  const root = resolve(repository)
  const state = scaffoldState(root)
  let requested = false
  const orientation = ['CLAUDE.md', 'AGENTS.md']
    .filter((file) => regular(join(root, file)))
    .map((file) => readFileSync(join(root, file), 'utf8'))
    .join('\n')
  const context: PrincipalContext = {
    rubric: { publication },
    missing: REQUIRED.filter((path) => !regular(join(root, path))),
    empty: REQUIRED.filter((path) => regular(join(root, path)) && !readFileSync(join(root, path), 'utf8').trim()),
    acquired: {
      state,
      ...(mode === 'conform' && state !== 'unsafe'
        ? {
            synchronise: () => {
              requested = true
            }
          }
        : {})
    },
    enactmentAnchor:
      /(?:must|require|do not|go through)[^.\n]*(?:Enactment Process|Streams\/Roadmap|canonical)/i.test(orientation) &&
      /(?:Enactment Process|Streams\/Roadmap)/i.test(orientation) &&
      /(?:Admin|Pillars|Resources)/i.test(orientation)
  }
  return {
    subjects: [
      { families: ['RUBRIC'], context: () => context },
      { families: ['PRINCIPAL'], context: () => context }
    ],
    proposal: () => {
      const writes: ConformWrite[] =
        requested && state !== 'canonical'
          ? [{ path: ACQUIRED_PATH, content: ACQUIRED_TEMPLATE, ...(state === 'missing' ? { create: true } : {}) }]
          : []
      return { writes }
    }
  }
}
