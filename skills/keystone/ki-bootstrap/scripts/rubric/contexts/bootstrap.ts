import { spawnSync } from 'node:child_process'
import { existsSync, lstatSync, readdirSync, readFileSync, readlinkSync, realpathSync } from 'node:fs'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { type HarnessSource, resolveHarnessSource } from '../../internal/repo-bootstrap/harness-source.ts'
import { inspectProjectLinks, type ProjectLinkCheck } from '../../internal/repo-bootstrap/project-skill-publisher.ts'
import {
  assertExplicitDependencies,
  checkerScript,
  DependencyDeclarationError,
  resolveSet,
  SkillResolutionError,
  vendorModesOf,
  vendorUnit
} from '../../internal/repo-bootstrap/resolve.ts'

export type BootstrapPublication = {
  status: number
  dryRun: boolean
  before: readonly ProjectLinkCheck[]
  after: readonly ProjectLinkCheck[]
  error?: string
}

export type BootstrapVendorEvidence = {
  resolutionError?: string
  retiredPayload: boolean
  expectedCheckers: readonly string[]
  actualCheckers: readonly string[]
  checkedSourceCopies: number
  driftedSourceCopies: readonly string[]
  expectedEducators: readonly string[]
  actualEducators: readonly string[]
  unsafeEducators: readonly string[]
}

export type SourceSharedModuleEvidence = {
  applicable: boolean
  error?: string
}

export type BootstrapRubricContext = {
  target: string
  projectChecks: readonly ProjectLinkCheck[]
  projectInspectionError?: string
  publishProjectSkills: () => BootstrapPublication
  vendor: BootstrapVendorEvidence
  sourceSharedModules: SourceSharedModuleEvidence
}

const PUBLISHER = fileURLToPath(new URL('../../internal/repo-bootstrap/project-skill-publisher.ts', import.meta.url))
const SHARED_MODULE_SYNC = fileURLToPath(new URL('../../internal/repo-bootstrap/sync-shared-modules.ts', import.meta.url))

const inspectProject = (target: string): { checks: ProjectLinkCheck[]; error?: string } => {
  try {
    return { checks: inspectProjectLinks(target, 'all') }
  } catch (error) {
    return { checks: [], error: error instanceof Error ? error.message : String(error) }
  }
}

const targetSkillDir = (target: string, skill: string): string | null => {
  const root = join(target, 'skills')
  if (!existsSync(root)) return null
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const direct = join(root, entry.name)
    if (entry.name === skill && existsSync(join(direct, 'SKILL.md'))) return direct
    const nested = join(direct, skill)
    if (existsSync(join(nested, 'SKILL.md'))) return nested
  }
  return null
}

const directoryNames = (path: string): string[] =>
  existsSync(path)
    ? readdirSync(path, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort()
    : []

const isHarnessConfig = (target: string): boolean => {
  const config = join(target, '.ki-config.toml')
  const stat = existsSync(config) ? lstatSync(config) : undefined
  return Boolean(stat?.isFile() && !stat.isSymbolicLink() && /^\[ki-harness\][ \t]*$/m.test(readFileSync(config, 'utf8')))
}

const manifestLinkTarget = (target: string, path: string): string | undefined => {
  const manifest = join(target, '.ki', 'manifest.json')
  const stat = existsSync(manifest) ? lstatSync(manifest) : undefined
  if (!stat?.isFile() || stat.isSymbolicLink()) return undefined
  try {
    const parsed = JSON.parse(readFileSync(manifest, 'utf8')) as { links?: unknown }
    if (!parsed.links || typeof parsed.links !== 'object' || Array.isArray(parsed.links)) return undefined
    const value = (parsed.links as Record<string, unknown>)[path]
    return typeof value === 'string' ? value : undefined
  } catch {
    return undefined
  }
}

const canonicalSourceLink = (target: string, source: string, vendored: string, manifestPath: string): boolean => {
  const expectedTarget = manifestLinkTarget(target, manifestPath)
  const stat = existsSync(vendored) ? lstatSync(vendored) : undefined
  if (!expectedTarget || !stat?.isSymbolicLink()) return false
  const actualTarget = readlinkSync(vendored)
  if (isAbsolute(actualTarget) || actualTarget !== expectedTarget) return false
  try {
    return realpathSync(resolve(dirname(vendored), actualTarget)) === realpathSync(source)
  } catch {
    return false
  }
}

const vendorEvidence = (target: string): BootstrapVendorEvidence => {
  const checkersRoot = join(target, '.ki', 'bootstrap', 'checkers')
  const educatorsRoot = join(target, '.ki', 'bootstrap', 'educators')
  const base = {
    retiredPayload: false,
    actualCheckers: directoryNames(checkersRoot),
    actualEducators: directoryNames(educatorsRoot)
  }

  let resolved: string[]
  try {
    resolved = resolveSet(target, false, [])
    assertExplicitDependencies(target, resolved)
  } catch (error) {
    if (!(error instanceof SkillResolutionError) && !(error instanceof DependencyDeclarationError)) throw error
    return {
      ...base,
      resolutionError: error.message,
      expectedCheckers: [],
      checkedSourceCopies: 0,
      driftedSourceCopies: [],
      expectedEducators: [],
      unsafeEducators: []
    }
  }

  const expectedCheckers = resolved.filter((skill) => checkerScript(skill) !== null)
  const driftedSourceCopies: string[] = []
  let harness: HarnessSource | undefined
  if (isHarnessConfig(target)) {
    try {
      harness = resolveHarnessSource(target)
    } catch (error) {
      driftedSourceCopies.push(`source harness is invalid (${error instanceof Error ? error.message : String(error)})`)
    }
  }
  let checkedSourceCopies = 0
  for (const skill of expectedCheckers) {
    const localSkill = harness?.skills.get(skill) ?? targetSkillDir(target, skill)
    if (!localSkill) continue
    for (const mode of ['audit', 'conform'] as const) {
      const unit = vendorUnit(skill, mode)
      if (unit?.kind !== 'file') continue
      const source = join(localSkill, unit.path)
      const vendored = join(checkersRoot, skill, 'scripts', `${mode}.ts`)
      const manifestPath = join('.ki', 'bootstrap', 'checkers', skill, 'scripts', `${mode}.ts`)
      checkedSourceCopies += 1
      if (!existsSync(source) || !lstatSync(source).isFile()) {
        driftedSourceCopies.push(`${skill}/${mode}.ts (canonical source missing or not a regular file)`)
      } else if (!harness || !canonicalSourceLink(target, source, vendored, manifestPath)) {
        if (!existsSync(vendored) || !lstatSync(vendored).isFile()) {
          driftedSourceCopies.push(
            `${skill}/${mode}.ts (${harness ? 'source-harness link missing or not manifest-proven' : 'vendored copy missing or not a regular file'})`
          )
        } else if (harness) {
          driftedSourceCopies.push(`${skill}/${mode}.ts (source harness requires a manifest-proven canonical link)`)
        } else if (!readFileSync(source).equals(readFileSync(vendored))) {
          driftedSourceCopies.push(`${skill}/${mode}.ts`)
        }
      }
    }
  }

  const expectedEducators = resolved.filter((skill) => vendorModesOf(skill)?.includes('educate'))
  const unsafeEducators = expectedEducators.filter((skill) => {
    const payload = join(educatorsRoot, skill, 'educate.ts')
    if (!existsSync(payload)) return false
    const stat = lstatSync(payload)
    return !stat.isFile() || stat.isSymbolicLink()
  })

  return {
    ...base,
    expectedCheckers,
    checkedSourceCopies,
    driftedSourceCopies,
    expectedEducators,
    unsafeEducators
  }
}

const sourceSharedModuleEvidence = (target: string): SourceSharedModuleEvidence => {
  const config = join(target, '.ki-config.toml')
  const skills = join(target, 'skills')
  if (!existsSync(config) || !existsSync(skills) || !/^\[ki-harness\][ \t]*$/m.test(readFileSync(config, 'utf8')))
    return { applicable: false }
  const result = spawnSync('bun', [SHARED_MODULE_SYNC, target, '--check', '--quiet'], { encoding: 'utf8' })
  if (result.status === 0) return { applicable: true }
  const error = `${result.stderr ?? ''}${result.stdout ?? ''}`.trim().split('\n')[0]
  return { applicable: true, error: error || 'source shared-module check failed' }
}

export const createBootstrapContextFactory = ({
  target,
  dryRun = false
}: {
  target: string
  dryRun?: boolean
}): (() => BootstrapRubricContext) => {
  const absoluteTarget = resolve(target)
  let publication: BootstrapPublication | undefined

  const publishProjectSkills = (): BootstrapPublication => {
    if (publication) return publication
    const before = inspectProject(absoluteTarget)
    const result = spawnSync('bun', [PUBLISHER, absoluteTarget, ...(dryRun ? ['--dry-run'] : []), '--quiet'], { encoding: 'utf8' })
    const after = dryRun ? before : inspectProject(absoluteTarget)
    publication = {
      status: result.status ?? 1,
      dryRun,
      before: before.checks,
      after: after.checks,
      ...(after.error || (result.stderr ?? '').trim() ? { error: after.error ?? (result.stderr ?? '').trim().split('\n')[0] } : {})
    }
    return publication
  }

  return () => {
    const project = inspectProject(absoluteTarget)
    return {
      target: absoluteTarget,
      projectChecks: project.checks,
      ...(project.error ? { projectInspectionError: project.error } : {}),
      publishProjectSkills,
      vendor: vendorEvidence(absoluteTarget),
      sourceSharedModules: sourceSharedModuleEvidence(absoluteTarget)
    }
  }
}
