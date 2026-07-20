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
  rmSync,
  writeFileSync
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
  destination: string
  source?: string
  content?: string
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

const copyPayload = (source: string, destination: string, sourceRoot = source): void => {
  const stat = lstatSync(source)
  if (stat.isSymbolicLink()) {
    const localPath = relative(sourceRoot, source)
    if (!localPath.startsWith(`scripts${sep}vendored${sep}`)) {
      throw new Error(`skill education payload contains an unsafe symlink: ${source}`)
    }
    copyPayload(realpathSync(source), destination)
    return
  }
  const kind = entryKind(source)
  if (kind === 'file') {
    mkdirSync(resolve(destination, '..'), { recursive: true })
    copyFileSync(source, destination)
    chmodSync(destination, lstatSync(source).mode & 0o777)
    return
  }
  mkdirSync(destination, { recursive: true })
  for (const name of readdirSync(source).sort()) copyPayload(join(source, name), join(destination, name), sourceRoot)
}

const writePayload = (unit: SkillEducationUnit, destination: string, sourceRoot: string): void => {
  if (unit.content !== undefined) {
    mkdirSync(resolve(destination, '..'), { recursive: true })
    writeFileSync(destination, unit.content)
    return
  }
  if (!unit.source) throw new Error(`skill education unit has no source: ${unit.destination}`)
  copyPayload(unit.source, destination, sourceRoot)
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

const educatorModuleSource = (): string => join(import.meta.dirname, 'educator.ts')

const unquote = (value: string): string => {
  const singleQuoted = value.startsWith("'") && value.endsWith("'")
  const doubleQuoted = value.startsWith('"') && value.endsWith('"')
  return singleQuoted || doubleQuoted ? value.slice(1, -1) : value
}

const frontmatterValue = (frontmatter: string, key: string): string | null => {
  const lines = frontmatter.split(/\r?\n/)
  const index = lines.findIndex((line) => new RegExp(`^${key}:`).test(line))
  if (index === -1) return null
  const value = lines[index].replace(new RegExp(`^${key}:\\s*`), '')
  if (!['>', '|', '>-', '|-', ''].includes(value.trim())) return unquote(value.trim())
  const linesAfter: string[] = []
  for (let cursor = index + 1; cursor < lines.length && !/^\S/.test(lines[cursor]); cursor += 1) linesAfter.push(lines[cursor].trim())
  return linesAfter.join(' ').replace(/\s+/g, ' ').trim()
}

const firstSentence = (value: string): string => {
  const sentence = value.match(/^(.*?[.!?])(?:\s|$)/)
  return (sentence ? sentence[1] : value).trim()
}

const helpModes = (body: string, argumentHint: string | null): readonly { name: string; gloss: string }[] => {
  const modes = [...body.matchAll(/^#{2,3}\s+Mode\s+([A-Z][A-Z]+)\b\s*(?:[—-]\s*(.*))?$/gm)].map((match) => ({
    name: match[1],
    gloss: (match[2] ?? '').trim()
  }))
  if (modes.length === 0 && argumentHint) {
    for (const token of argumentHint.split(/[\s|]+/)) {
      if (/^[a-z][a-z-]+$/.test(token)) modes.push({ name: token.toUpperCase(), gloss: '' })
    }
  }
  if (!modes.some((mode) => mode.name === 'HELP')) modes.push({ name: 'HELP', gloss: 'explain this skill and stop' })
  return modes.sort((left, right) => left.name.localeCompare(right.name))
}

/** Render a standalone HELP snapshot from the source skill, without a bootstrap-private dependency. */
const helpSnapshot = (source: string): string => {
  const markdown = readFileSync(join(source, 'SKILL.md'), 'utf8')
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) throw new Error(`SKILL.md has no frontmatter: ${join(source, 'SKILL.md')}`)
  const name = frontmatterValue(match[1], 'name') ?? declaredName(source)
  const description = frontmatterValue(match[1], 'description') ?? ''
  const argumentHint = frontmatterValue(match[1], 'argument-hint')
  const body = markdown.slice(markdown.indexOf('\n---', 3))
  const output = [`# ${name}`, '', firstSentence(description), '']
  if (argumentHint) output.push(`**Invoke:** \`${name} ${argumentHint}\``, '')
  output.push('**Modes:**', '')
  for (const mode of helpModes(body, argumentHint)) output.push(`- \`${mode.name}\`${mode.gloss ? ` — ${mode.gloss}` : ''}`)
  return `${output.join('\n').trimEnd()}\n`
}

const helpSnapshotUnit = (source: string, destination: string): SkillEducationUnit => ({
  owner: 'checker',
  kind: 'file',
  content: helpSnapshot(source),
  destination: join(destination, 'help.md')
})

export const educatorLauncher = (skill: string): string => `#!/usr/bin/env bun
import { resolve } from 'node:path'
import { runSkillEducator } from './educator.ts'

runSkillEducator({ skill: ${JSON.stringify(skill)}, source: resolve(import.meta.dirname, 'skill') })
`

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
      destination: join(educator, 'skill')
    },
    {
      owner: 'educator',
      kind: 'file',
      source: educatorModuleSource(),
      destination: join(educator, 'educator.ts')
    },
    {
      owner: 'educator',
      kind: 'file',
      content: educatorLauncher(request.skill),
      destination: join(educator, 'educate.ts')
    },
    checkerUnit(source, checker, 'SKILL.md'),
    helpSnapshotUnit(source, checker),
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
      writePayload(unit, join(candidateRoot, rel), plan.source)
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

export const runSkillEducator = ({
  skill,
  source,
  argv = process.argv.slice(2)
}: {
  skill: string
  source: string
  argv?: readonly string[]
}): void => {
  if (argv.includes('-h') || argv.includes('--help')) {
    process.stdout.write(`Usage: bun scripts/educate.ts [target-repo] [--dry-run] [--verbose]

Refresh only ${skill} under the target repository's .ki-meta/checkers and
.ki-meta/educators directories. Aggregate runners remain owned by ki-bootstrap.

Options:
  --dry-run   Report the planned payload without writing it.
  --verbose   List each copied payload unit.
  -h, --help  Show this help and exit.
`)
    return
  }

  let targetArgument: string | undefined
  let dryRun = false
  let verbose = false
  for (const argument of argv) {
    if (argument === '--dry-run') dryRun = true
    else if (argument === '--verbose') verbose = true
    else if (argument.startsWith('-')) throw new Error(`unsupported option: ${argument}`)
    else if (targetArgument) throw new Error(`unexpected argument: ${argument}`)
    else targetArgument = argument
  }

  const plan = educateSkill({ skill, source, target: resolve(targetArgument ?? '.'), dryRun })
  if (verbose) {
    for (const unit of plan.units) process.stdout.write(`${dryRun ? 'would copy' : 'copied'} ${relative(plan.target, unit.destination)}\n`)
  }
  process.stdout.write(`${dryRun ? 'EDUCATE dry run' : 'EDUCATE complete'} — ${skill}\n`)
}
