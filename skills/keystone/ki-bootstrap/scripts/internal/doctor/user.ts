import { lstatSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { isManagedClaudeHookNamespace } from '../user-install/install-claude-hook-payload.ts'
import { CORE_USER_SKILLS, isCurrentUserInstalledSkill } from '../user-install/user-install.ts'
import type { DoctorFinding, DoctorReport } from './report.ts'
import { report } from './report.ts'

export type UserDoctorRuntime = 'claude-code' | 'codex'

const RUNTIME_ROOT: Record<UserDoctorRuntime, string> = {
  'claude-code': join('.claude', 'skills'),
  codex: join('.agents', 'skills')
}

function kind(path: string): 'missing' | 'directory' | 'file' | 'link' | 'other' {
  try {
    const value = lstatSync(path)
    if (value.isSymbolicLink()) return 'link'
    if (value.isDirectory()) return 'directory'
    if (value.isFile()) return 'file'
    return 'other'
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return 'missing'
    throw error
  }
}

function realDirectoryBelow(home: string, relativePath: string): string | undefined {
  let current = home
  for (const part of relativePath.split('/')) {
    current = join(current, part)
    const currentKind = kind(current)
    if (currentKind === 'missing') return undefined
    if (currentKind !== 'directory') throw new Error(`managed user path is not a real directory: ${current}`)
  }
  return current
}

export function inspectUser(homeValue = homedir(), requested: UserDoctorRuntime[] = []): DoctorReport {
  const home = resolve(homeValue)
  if (kind(home) !== 'directory')
    return report('user', home, [{ code: 'USER_ROOT', status: 'unsafe', message: 'user home is not a real directory' }], 'user-uninstall')
  const runtimes = [
    ...new Set(
      requested.length
        ? requested
        : (Object.keys(RUNTIME_ROOT) as UserDoctorRuntime[]).filter(
            (runtime) => kind(join(home, runtime === 'claude-code' ? '.claude' : '.agents')) !== 'missing'
          )
    )
  ]
  if (!runtimes.length)
    return report(
      'user',
      home,
      [{ code: 'USER_INSTALL', status: 'absent', message: 'managed user installation is absent' }],
      'user-uninstall'
    )
  const findings: DoctorFinding[] = []
  const runtimePresence = new Map<UserDoctorRuntime, number>()
  for (const runtime of runtimes) {
    let root: string | undefined
    try {
      root = realDirectoryBelow(home, RUNTIME_ROOT[runtime])
    } catch (error) {
      findings.push({ code: 'USER_RUNTIME', status: 'unsafe', message: (error as Error).message })
      continue
    }
    let present = 0
    let valid = 0
    for (const skill of CORE_USER_SKILLS) {
      if (!root) continue
      const path = join(root, skill)
      if (kind(path) === 'missing') continue
      present += 1
      if (isCurrentUserInstalledSkill(path, skill)) valid += 1
      else findings.push({ code: 'USER_SKILL', status: 'unsafe', message: `${RUNTIME_ROOT[runtime]}/${skill} is altered or unproven` })
    }
    runtimePresence.set(runtime, present)
    if (present === 0) findings.push({ code: 'USER_RUNTIME', status: 'absent', message: `${runtime} managed skills are absent` })
    else if (present === CORE_USER_SKILLS.length && valid === present)
      findings.push({ code: 'USER_RUNTIME', status: 'healthy', message: `${runtime} managed skills are ownership-proven` })
    else if (valid === present)
      findings.push({ code: 'USER_RUNTIME', status: 'recoverable', message: `${runtime} managed skill set is incomplete` })
  }
  if (runtimes.includes('claude-code')) {
    const namespace = join(home, '.claude', 'hooks', 'knowledgeislands', 'ki-agentic-harness')
    const namespaceKind = kind(namespace)
    if (namespaceKind === 'missing') {
      findings.push({
        code: 'USER_HOOKS',
        status: (runtimePresence.get('claude-code') ?? 0) === 0 ? 'absent' : 'recoverable',
        message: 'managed Claude hook namespace is absent'
      })
    } else if (namespaceKind !== 'directory')
      findings.push({ code: 'USER_HOOKS', status: 'unsafe', message: 'managed Claude hook namespace is altered or unproven' })
    else {
      try {
        realDirectoryBelow(home, join('.claude', 'hooks', 'knowledgeislands', 'ki-agentic-harness'))
        if (!isManagedClaudeHookNamespace(namespace)) throw new Error('managed Claude hook namespace is altered or unproven')
        findings.push({
          code: 'USER_HOOKS',
          status: (runtimePresence.get('claude-code') ?? 0) === 0 ? 'recoverable' : 'healthy',
          message: 'managed Claude hook namespace is ownership-proven'
        })
      } catch (error) {
        findings.push({ code: 'USER_HOOKS', status: 'unsafe', message: (error as Error).message })
      }
    }
  }
  return report('user', home, findings, 'user-uninstall')
}
