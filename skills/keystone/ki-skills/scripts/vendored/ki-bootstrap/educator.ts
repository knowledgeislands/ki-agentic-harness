import {
  chmodSync,
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync
} from 'node:fs'
import { isAbsolute, join, relative, resolve, sep } from 'node:path'

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

const ensurePhysicalDirectory = (path: string, label: string): void => {
  if (!existsSync(path)) mkdirSync(path)
  const stat = lstatSync(path)
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error(`${label} must be a physical directory: ${path}`)
}

const entryKind = (path: string): SkillEducationUnit['kind'] => {
  const stat = lstatSync(path)
  if (stat.isSymbolicLink()) throw new Error(`skill education payload must not contain a symlink: ${path}`)
  if (stat.isFile()) return 'file'
  if (stat.isDirectory()) return 'directory'
  throw new Error(`skill education payload must contain only regular files and directories: ${path}`)
}

const copyPayload = (source: string, destination: string): void => {
  const kind = entryKind(source)
  if (kind === 'file') {
    mkdirSync(resolve(destination, '..'), { recursive: true })
    copyFileSync(source, destination)
    chmodSync(destination, lstatSync(source).mode & 0o777)
    return
  }
  mkdirSync(destination, { recursive: true })
  for (const name of readdirSync(source).sort()) copyPayload(join(source, name), join(destination, name))
}

const escapes = (root: string, path: string): boolean => {
  const rel = relative(root, path)
  return rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)
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
    if (escapes(target, unit.destination)) {
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

export const publishSkillEducation = (plan: SkillEducationPlan): void => {
  if (plan.dryRun) return

  const meta = join(plan.target, '.ki-meta')
  ensurePhysicalDirectory(meta, 'governance directory')
  const checkers = join(meta, 'checkers')
  const educators = join(meta, 'educators')
  ensurePhysicalDirectory(checkers, 'checker directory')
  ensurePhysicalDirectory(educators, 'educator directory')

  const staging = mkdtempSync(join(meta, `.educate-${plan.skill}-`))
  const candidateRoot = join(staging, 'candidate')
  const backupRoot = join(staging, 'backup')
  const destinations = [
    {
      candidate: join(candidateRoot, '.ki-meta', 'checkers', plan.skill),
      destination: join(checkers, plan.skill),
      backup: join(backupRoot, 'checker')
    },
    {
      candidate: join(candidateRoot, '.ki-meta', 'educators', plan.skill),
      destination: join(educators, plan.skill),
      backup: join(backupRoot, 'educator')
    }
  ] as const
  const published: { destination: string; backup: string | null }[] = []

  try {
    for (const unit of plan.units) {
      const rel = relative(plan.target, unit.destination)
      if (escapes(plan.target, unit.destination))
        throw new Error(`skill education destination escapes the target repository: ${unit.destination}`)
      copyPayload(unit.source, join(candidateRoot, rel))
    }

    mkdirSync(backupRoot)
    for (const entry of destinations) {
      let backup: string | null = null
      if (existsSync(entry.destination)) {
        const stat = lstatSync(entry.destination)
        if (!stat.isDirectory() || stat.isSymbolicLink())
          throw new Error(`owned education payload must be a physical directory: ${entry.destination}`)
        renameSync(entry.destination, entry.backup)
        backup = entry.backup
      }
      try {
        renameSync(entry.candidate, entry.destination)
      } catch (error) {
        if (backup) renameSync(backup, entry.destination)
        throw error
      }
      published.push({ destination: entry.destination, backup })
    }
  } catch (error) {
    for (const entry of published.reverse()) {
      rmSync(entry.destination, { recursive: true, force: true })
      if (entry.backup) renameSync(entry.backup, entry.destination)
    }
    throw error
  } finally {
    rmSync(staging, { recursive: true, force: true })
  }
}

export const educateSkill = (request: SkillEducationRequest): SkillEducationPlan => {
  const plan = createSkillEducationPlan(request)
  publishSkillEducation(plan)
  return plan
}
