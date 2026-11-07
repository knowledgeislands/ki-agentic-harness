import { lstatSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { RubricContextOptions, RubricPublicationContext, RubricSession } from '../../shared/rubric.ts'

const KNOWN_KEYS = new Set(['package'])
// A consumer register in any of the formats a package repository has used; consumers are found by lock instead.
const REGISTERS = ['consumers.json5', 'consumers.json', 'consumers.yaml', 'consumers.yml', 'consumers.toml'] as const
const VERBS = ['verify', 'drift', 'sync', 'defer'] as const

export type PackageState = 'unset' | 'invalid' | 'missing' | 'physical'

export type PackagesContext = {
  readonly rubric: RubricPublicationContext
  readonly unknownKeys: readonly string[]
  readonly packageName: string | null
  readonly packageState: PackageState
  /** The vendored package's release version, or `null` when its `package.json` carries none. */
  readonly version: string | null
  readonly changelogHasVersion: boolean
  readonly workbench: boolean
  readonly syncParagraph: boolean
  /** Whether the vendored `tsconfig.json` extends another configuration; `null` when it has none. */
  readonly tsconfigExtends: boolean | null
  readonly registers: readonly string[]
}

const pathKind = (path: string): 'missing' | 'file' | 'directory' | 'other' => {
  try {
    const state = lstatSync(path)
    if (state.isSymbolicLink()) return 'other'
    return state.isFile() ? 'file' : state.isDirectory() ? 'directory' : 'other'
  } catch {
    return 'missing'
  }
}

const readText = (path: string): string | null => (pathKind(path) === 'file' ? readFileSync(path, 'utf8') : null)

const escapePattern = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const readVersion = (path: string): string | null => {
  const text = readText(path)
  if (text === null) return null
  try {
    const version = (JSON.parse(text) as { version?: unknown }).version
    return typeof version === 'string' && /^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/.test(version) ? version : null
  } catch {
    return null
  }
}

/** Whether a block quotation in the guidance names the vendored path and every vendoring verb. */
export const publishesSyncParagraph = (guidance: string, packageName: string): boolean => {
  const quotations = guidance
    .split(/\n(?!>)/)
    .map((block) =>
      block
        .split('\n')
        .filter((line) => line.startsWith('>'))
        .join(' ')
    )
    .filter(Boolean)
  return quotations.some(
    (quotation) =>
      quotation.includes(`packages/${packageName}/`) &&
      VERBS.every((verb) => new RegExp(`\\b${verb}\\b`).test(quotation))
  )
}

export const createPackagesSession = ({
  repository,
  configuration,
  publication
}: RubricContextOptions): RubricSession<PackagesContext> => {
  const root = resolve(repository)
  const declared = configuration.package
  const packageName = typeof declared === 'string' && declared.trim() ? declared.trim() : null
  const packageState: PackageState =
    declared === undefined
      ? 'unset'
      : packageName === null || packageName.includes('/') || packageName.startsWith('.')
        ? 'invalid'
        : pathKind(join(root, 'packages', packageName)) === 'directory'
          ? 'physical'
          : 'missing'
  const vendored = packageState === 'physical' && packageName ? join(root, 'packages', packageName) : null
  const version = vendored ? readVersion(join(vendored, 'package.json')) : null
  const changelog = readText(join(root, 'CHANGELOG.md')) ?? ''
  const tsconfig = vendored ? readText(join(vendored, 'tsconfig.json')) : null
  const context: PackagesContext = {
    rubric: { publication },
    unknownKeys: Object.keys(configuration)
      .filter((key) => !KNOWN_KEYS.has(key))
      .sort(),
    packageName,
    packageState,
    version,
    changelogHasVersion:
      version !== null && new RegExp(`^##\\s+\\[?v?${escapePattern(version)}\\]?(?:\\s|$)`, 'm').test(changelog),
    workbench: pathKind(join(root, 'apps', 'workbench')) === 'directory',
    syncParagraph: packageName !== null && publishesSyncParagraph(readText(join(root, 'AGENTS.md')) ?? '', packageName),
    tsconfigExtends: tsconfig === null ? null : /"extends"\s*:/.test(tsconfig),
    registers: REGISTERS.filter((name) => pathKind(join(root, name)) !== 'missing')
  }
  return {
    subjects: [
      { families: ['CONFIG', 'PKG'], context: () => context, subject: root },
      { families: ['RUBRIC'], context: () => context, subject: root }
    ],
    proposal: () => ({ writes: [] })
  }
}
