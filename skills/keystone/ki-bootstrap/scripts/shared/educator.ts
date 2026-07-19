import { existsSync, lstatSync, readFileSync, realpathSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const REQUIRED_MODE_SCRIPTS = ['audit.ts', 'conform.ts', 'educate.ts'] as const
const CHECKER_SUPPORT_PATHS = ['scripts/rubric', 'scripts/shared', 'scripts/vendored', 'references/rubric.md'] as const

export type SkillEducationRequest = {
  skill: string
  source: string
  target: string
  dryRun?: boolean
}

export type SkillEducationUnit = {
  owner: 'checker' | 'educator'
  kind: 'file' | 'directory'
  source: string
  destination: string
}

export type SkillEducationPlan = {
  skill: string
  source: string
  target: string
  dryRun: boolean
  units: readonly SkillEducationUnit[]
}

const physicalDirectory = (path: string, label: string): string => {
  const absolute = resolve(path)
  const physical = realpathSync(absolute)
  const stat = lstatSync(physical)
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error(`${label} must be a physical directory: ${absolute}`)
  return physical
}

const entryKind = (path: string): SkillEducationUnit['kind'] => {
  const stat = lstatSync(path)
  if (stat.isSymbolicLink()) throw new Error(`skill education payload must not contain a symlink: ${path}`)
  if (stat.isFile()) return 'file'
  if (stat.isDirectory()) return 'directory'
  throw new Error(`skill education payload must contain only regular files and directories: ${path}`)
}

const declaredName = (source: string): string => {
  const skillFile = join(source, 'SKILL.md')
  const text = readFileSync(skillFile, 'utf8')
  const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const name = frontmatter?.[1].match(/^name:\s*([^\s#]+)\s*$/m)?.[1]
  if (!name) throw new Error(`SKILL.md does not declare a name: ${skillFile}`)
  return name
}

const checkerUnit = (source: string, destination: string, relativePath: string): SkillEducationUnit => {
  const sourcePath = join(source, relativePath)
  return {
    owner: 'checker',
    kind: entryKind(sourcePath),
    source: sourcePath,
    destination: join(destination, relativePath)
  }
}

export const createSkillEducationPlan = (request: SkillEducationRequest): SkillEducationPlan => {
  if (!/^ki-[a-z0-9][a-z0-9-]*$/.test(request.skill)) throw new Error(`invalid skill name: ${request.skill}`)
  const source = physicalDirectory(request.source, 'skill source')
  const target = physicalDirectory(request.target, 'target repository')
  if (declaredName(source) !== request.skill) throw new Error(`skill source does not declare ${request.skill}: ${source}`)

  for (const script of REQUIRED_MODE_SCRIPTS) {
    const path = join(source, 'scripts', script)
    if (!existsSync(path) || entryKind(path) !== 'file') throw new Error(`${request.skill} does not provide scripts/${script}`)
  }

  const checker = join(target, '.ki-meta', 'checkers', request.skill)
  const educator = join(target, '.ki-meta', 'educators', request.skill)
  const units: SkillEducationUnit[] = [
    {
      owner: 'educator',
      kind: 'directory',
      source,
      destination: educator
    },
    checkerUnit(source, checker, 'SKILL.md'),
    ...REQUIRED_MODE_SCRIPTS.filter((script) => script !== 'educate.ts').map((script) =>
      checkerUnit(source, checker, join('scripts', script))
    ),
    ...CHECKER_SUPPORT_PATHS.filter((path) => existsSync(join(source, path))).map((path) => checkerUnit(source, checker, path))
  ]

  for (const unit of units) {
    if (relative(target, unit.destination).startsWith('..')) {
      throw new Error(`skill education destination escapes the target repository: ${unit.destination}`)
    }
  }

  return {
    skill: request.skill,
    source,
    target,
    dryRun: request.dryRun ?? false,
    units
  }
}
