import { lstatSync, readdirSync, readFileSync } from 'node:fs'
import { isAbsolute, join, resolve } from 'node:path'
import type { AuditOutcome, RubricContextOptions } from '../../shared/rubric.ts'

export type MemoryContext = {
  declaration: readonly AuditOutcome[]
  runtime: readonly AuditOutcome[]
  reconciliation: readonly AuditOutcome[]
}

type MemoryPolicy = 'disabled' | 'transition' | 'enabled'

const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isSymlink = (path: string): boolean => {
  try {
    return lstatSync(path).isSymbolicLink()
  } catch {
    return false
  }
}

const configFlag = (path: string, repository?: string): { value?: boolean; trusted?: boolean; error?: string } => {
  try {
    if (!lstatSync(path).isFile() || lstatSync(path).isSymbolicLink())
      return { error: 'Codex configuration is not a physical file.' }
    const parsed: unknown = Bun.TOML.parse(readFileSync(path, 'utf8'))
    if (!record(parsed)) return { error: 'Codex configuration is not a TOML table.' }
    const features = parsed.features
    if (features !== undefined && !record(features)) return { error: 'Codex features must be a TOML table.' }
    const value = record(features) ? features.memories : undefined
    if (value !== undefined && typeof value !== 'boolean')
      return { error: 'Codex features.memories must be a boolean.' }
    const projects = parsed.projects
    const project = repository && record(projects) ? projects[repository] : undefined
    return {
      ...(typeof value === 'boolean' ? { value } : {}),
      trusted: record(project) && project.trust_level === 'trusted'
    }
  } catch (error) {
    if (record(error) && error.code === 'ENOENT') return {}
    return { error: 'Codex configuration cannot be parsed.' }
  }
}

const memoryFiles = (root: string): { count: number; error?: string } => {
  try {
    lstatSync(root)
  } catch (error) {
    if (record(error) && error.code === 'ENOENT') return { count: 0 }
    return { count: 0, error: 'Selected Codex memory directory is unavailable.' }
  }
  const stack = [root]
  let count = 0
  let visited = 0
  while (stack.length > 0) {
    const directory = stack.pop() as string
    try {
      if (!lstatSync(directory).isDirectory() || lstatSync(directory).isSymbolicLink())
        return { count, error: 'Codex memory contains a non-physical directory.' }
      if (++visited > 1024) return { count, error: 'Codex memory exceeds the bounded directory inventory.' }
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (entry.isSymbolicLink()) return { count, error: 'Codex memory contains a symlink.' }
        if (entry.isDirectory()) stack.push(join(directory, entry.name))
        else if (entry.isFile()) count++
      }
    } catch {
      return { count, error: 'Selected Codex memory directory cannot be inspected.' }
    }
  }
  return { count }
}

export const codexMemoryContext = ({ repository, userHome, configuration }: RubricContextOptions): MemoryContext => {
  const declared = configuration.auto_memory
  const valid = declared === 'disabled' || declared === 'transition' || declared === 'enabled'
  const policy: MemoryPolicy = valid ? declared : 'disabled'
  const rawHome = process.env.CODEX_HOME ?? join(userHome, '.codex')
  const home = resolve(rawHome)
  const subject = join(home, 'memories')
  const declaration: AuditOutcome = {
    status: valid ? 'PASS' : 'VIOLATION',
    message: valid
      ? `Codex auto_memory is explicitly ${policy}.`
      : 'auto_memory must be explicitly disabled, transition, or a human-approved enabled opt-in.',
    subject: repository
  }
  if (!isAbsolute(rawHome) || isSymlink(home)) {
    const unavailable: AuditOutcome = {
      status: 'VIOLATION',
      message: 'CODEX_HOME is not a physical absolute directory; selected memory cannot be inspected.',
      subject
    }
    return { declaration: [declaration], runtime: [unavailable], reconciliation: [unavailable] }
  }
  const projectDirectory = join(repository, '.codex')
  const projectConfig = isSymlink(projectDirectory)
    ? { error: 'Project Codex configuration directory is a symlink.' }
    : configFlag(join(projectDirectory, 'config.toml'))
  const userConfig = configFlag(join(home, 'config.toml'), repository)
  if (projectConfig.error || userConfig.error) {
    return {
      declaration: [declaration],
      runtime: [{ status: 'VIOLATION', message: projectConfig.error ?? userConfig.error ?? '', subject: repository }],
      reconciliation: [{ status: 'NOT_APPLICABLE', message: 'Codex configuration is unavailable.', subject }]
    }
  }
  const enabled = (userConfig.trusted ? projectConfig.value : undefined) ?? userConfig.value ?? false
  const projectOptIn = userConfig.trusted === true && projectConfig.value === true
  const runtimePass =
    policy === 'transition' || (policy === 'disabled' && !enabled) || (policy === 'enabled' && projectOptIn)
  const inventory = memoryFiles(subject)
  const reconciliation: AuditOutcome = inventory.error
    ? { status: 'VIOLATION', message: inventory.error, subject }
    : policy === 'transition' || (policy !== 'enabled' && inventory.count > 0)
      ? {
          status: 'VIOLATION',
          message:
            inventory.count > 0
              ? `${inventory.count} Codex memory file(s) need reviewed reconciliation into repository guidance or KB notes.`
              : 'Codex memory transition remains open; confirm reconciliation before declaring disabled.',
          subject
        }
      : {
          status: 'PASS',
          message: 'No Codex memory files need reconciliation under this policy.',
          subject
        }
  return {
    declaration: [declaration],
    runtime: [
      {
        status: runtimePass ? 'PASS' : 'VIOLATION',
        message: runtimePass
          ? 'Codex configuration agrees with the declared memory policy in the readable layers.'
          : 'Codex memory configuration conflicts with KI policy or lacks a project-scoped enabled opt-in.',
        subject: repository
      }
    ],
    reconciliation: [reconciliation]
  }
}
