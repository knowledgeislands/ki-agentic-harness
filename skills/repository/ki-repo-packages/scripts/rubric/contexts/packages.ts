import { lstatSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { RubricContextOptions, RubricPublicationContext, RubricSession } from '../../shared/rubric.ts'

const KNOWN_KEYS = new Set(['package', 'packages'])
// A consumer register in any of the formats a package repository has used; consumers are found by lock instead.
const REGISTERS = ['consumers.json5', 'consumers.json', 'consumers.yaml', 'consumers.yml', 'consumers.toml'] as const
const VERBS = ['verify', 'drift', 'sync', 'defer'] as const

/** Whether the declaration names the vendored packages: unset, malformed, or a list of single folder names. */
export type DeclarationState = 'unset' | 'invalid' | 'named'

/** One vendored package the declaration names. */
export type VendoredPackage = {
  readonly name: string
  /** Whether `packages/<name>/` is a physical folder. */
  readonly physical: boolean
  /** The package's release version, or `null` when its `package.json` carries none. */
  readonly version: string | null
  /** Whether its `tsconfig.json` extends another configuration; `null` when it has none. */
  readonly tsconfigExtends: boolean | null
  /** Whether `AGENTS.md` quotes a sync paragraph naming its path and every vendoring tool. */
  readonly syncParagraph: boolean
}

export type PackagesContext = {
  readonly rubric: RubricPublicationContext
  readonly unknownKeys: readonly string[]
  readonly declaration: DeclarationState
  /** Why a malformed declaration is malformed. */
  readonly declarationFault: string | null
  readonly packages: readonly VendoredPackage[]
  /** The version every present package carries, or `null` when one carries none or they differ. */
  readonly releaseVersion: string | null
  readonly changelogHasVersion: boolean
  /** Whether `apps/storybook/` is a folder, and whether its `package.json` has a `build` script. */
  readonly storybook: boolean
  readonly storybookBuild: boolean
  /** Whether the retired `apps/workbench/` is still present. */
  readonly workbench: boolean
  readonly registers: readonly string[]
}

const validName = (name: unknown): name is string =>
  typeof name === 'string' && name.trim() === name && name !== '' && !name.includes('/') && !name.startsWith('.')

/** Read `package = "<name>"` or `packages = ["<name>", ...]`, exactly one of them. */
export const readDeclaration = (
  configuration: Readonly<Record<string, unknown>>
): { state: DeclarationState; fault: string | null; names: readonly string[] } => {
  const one = configuration.package
  const several = configuration.packages
  if (one === undefined && several === undefined) return { state: 'unset', fault: null, names: [] }
  if (one !== undefined && several !== undefined)
    return { state: 'invalid', fault: 'Declare `package` or `packages`, not both.', names: [] }
  const names = one !== undefined ? [one] : Array.isArray(several) ? several : null
  if (!names || names.length === 0)
    return { state: 'invalid', fault: 'The `packages` key is not a non-empty list of folder names.', names: [] }
  if (!names.every(validName))
    return { state: 'invalid', fault: 'Each vendored package must be a single folder name.', names: [] }
  if (new Set(names).size !== names.length)
    return { state: 'invalid', fault: 'A vendored package is named twice.', names: [] }
  return { state: 'named', fault: null, names }
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

const readBuildScript = (path: string): boolean => {
  const text = readText(path)
  if (text === null) return false
  try {
    const scripts = (JSON.parse(text) as { scripts?: Record<string, unknown> }).scripts
    return typeof scripts?.build === 'string' && scripts.build.trim() !== ''
  } catch {
    return false
  }
}

export const createPackagesSession = ({
  repository,
  configuration,
  publication
}: RubricContextOptions): RubricSession<PackagesContext> => {
  const root = resolve(repository)
  const declaration = readDeclaration(configuration)
  const guidance = readText(join(root, 'AGENTS.md')) ?? ''
  const packages: VendoredPackage[] = declaration.names.map((name) => {
    const folder = join(root, 'packages', name)
    const physical = pathKind(folder) === 'directory'
    const tsconfig = physical ? readText(join(folder, 'tsconfig.json')) : null
    return {
      name,
      physical,
      version: physical ? readVersion(join(folder, 'package.json')) : null,
      tsconfigExtends: tsconfig === null ? null : /"extends"\s*:/.test(tsconfig),
      syncParagraph: publishesSyncParagraph(guidance, name)
    }
  })
  const present = packages.filter((entry) => entry.physical)
  const versions = new Set(present.map((entry) => entry.version))
  const releaseVersion = present.length && versions.size === 1 ? (present[0]?.version ?? null) : null
  const changelog = readText(join(root, 'CHANGELOG.md')) ?? ''
  const context: PackagesContext = {
    rubric: { publication },
    unknownKeys: Object.keys(configuration)
      .filter((key) => !KNOWN_KEYS.has(key))
      .sort(),
    declaration: declaration.state,
    declarationFault: declaration.fault,
    packages,
    releaseVersion,
    changelogHasVersion:
      releaseVersion !== null &&
      new RegExp(`^##\\s+\\[?v?${escapePattern(releaseVersion)}\\]?(?:\\s|$)`, 'm').test(changelog),
    storybook: pathKind(join(root, 'apps', 'storybook')) === 'directory',
    storybookBuild: readBuildScript(join(root, 'apps', 'storybook', 'package.json')),
    workbench: pathKind(join(root, 'apps', 'workbench')) === 'directory',
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
