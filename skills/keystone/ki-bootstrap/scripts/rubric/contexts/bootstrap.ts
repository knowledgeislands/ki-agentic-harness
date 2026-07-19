import { spawnSync } from 'node:child_process'
import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
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

export type BootstrapRubricContext = {
  target: string
  projectChecks: readonly ProjectLinkCheck[]
  projectInspectionError?: string
  publishProjectSkills: () => BootstrapPublication
  vendor: BootstrapVendorEvidence
}

const PUBLISHER = fileURLToPath(new URL('../../internal/repo-bootstrap/project-skill-publisher.ts', import.meta.url))

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

const vendorEvidence = (target: string): BootstrapVendorEvidence => {
  const checkersRoot = join(target, '.ki-meta', 'checkers')
  const educatorsRoot = join(target, '.ki-meta', 'educators')
  const base = {
    retiredPayload: existsSync(join(target, '.ki-meta', 'skills')),
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
  let checkedSourceCopies = 0
  for (const skill of expectedCheckers) {
    const localSkill = targetSkillDir(target, skill)
    if (!localSkill) continue
    for (const mode of ['audit', 'conform'] as const) {
      const unit = vendorUnit(skill, mode)
      if (unit?.kind !== 'file') continue
      const source = join(localSkill, unit.path)
      const vendored = join(checkersRoot, skill, 'scripts', `${mode}.ts`)
      checkedSourceCopies += 1
      if (!existsSync(source) || !lstatSync(source).isFile()) {
        driftedSourceCopies.push(`${skill}/${mode}.ts (canonical source missing or not a regular file)`)
      } else if (!existsSync(vendored) || !lstatSync(vendored).isFile()) {
        driftedSourceCopies.push(`${skill}/${mode}.ts (vendored copy missing or not a regular file)`)
      } else if (!readFileSync(source).equals(readFileSync(vendored))) {
        driftedSourceCopies.push(`${skill}/${mode}.ts`)
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
      vendor: vendorEvidence(absoluteTarget)
    }
  }
}
