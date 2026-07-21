import { createHash } from 'node:crypto'
import { lstatSync, readdirSync, readFileSync, readlinkSync, realpathSync } from 'node:fs'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { resolveHarnessSource, sourceHarnessSkill } from '../repo-bootstrap/harness-source.ts'
import {
  isGeneratedRuntimeSkillCopy,
  isLocalKiSelfRuntimeProjection,
  isRuntimeSkillLinkToSource
} from '../repo-bootstrap/project-skill-publisher.ts'
import { declaredSkills } from '../repo-bootstrap/resolve.ts'
import { runtimeSkillsDir, supportedRuntimes } from '../repo-bootstrap/runtime-paths.ts'
import type { DoctorFinding, DoctorReport } from './report.ts'
import { report } from './report.ts'

type EntryKind = 'directory' | 'file' | 'link' | 'other'

function kind(path: string): EntryKind | 'missing' {
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

function contained(root: string, path: string): boolean {
  const rel = relative(root, path)
  return rel === '' || (rel !== '..' && !rel.startsWith('../') && !rel.startsWith('..\\'))
}

function safeSourceLink(target: string, path: string, value: string): boolean {
  if (!value || isAbsolute(value)) return false
  try {
    const resolved = realpathSync(resolve(dirname(path), value))
    return [join(target, 'skills'), join(target, 'agents')].some(
      (root) => kind(root) === 'directory' && contained(realpathSync(root), resolved)
    )
  } catch {
    return false
  }
}

function runtimeRoot(target: string, runtime: string): string | undefined {
  let current = target
  for (const part of runtimeSkillsDir(runtime).split('/')) {
    current = join(current, part)
    const currentKind = kind(current)
    if (currentKind === 'missing') return undefined
    if (currentKind !== 'directory') throw new Error(`managed runtime path is not a real directory: ${current}`)
  }
  return current
}

function generatedState(target: string): { state: 'absent' | 'healthy' | 'unsafe'; evidence: string } {
  const root = join(target, '.ki')
  const rootKind = kind(root)
  if (rootKind === 'missing') return { state: 'absent', evidence: '.ki is absent' }
  if (rootKind !== 'directory') return { state: 'unsafe', evidence: '.ki is not a real directory' }
  const manifestPath = join(root, 'manifest.json')
  const roots = ['bin', 'bootstrap'] as const
  const generatedPresent = roots.some((name) => kind(join(root, name)) !== 'missing')
  const manifestKind = kind(manifestPath)
  if (!generatedPresent && manifestKind === 'missing') return { state: 'absent', evidence: 'generated .ki state is absent' }
  if (manifestKind !== 'file') return { state: 'unsafe', evidence: '.ki/manifest.json is missing or unsafe' }
  try {
    const parsed = JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<string, unknown>
    if (typeof parsed.ref !== 'string' || !parsed.files || typeof parsed.files !== 'object' || Array.isArray(parsed.files))
      throw new Error('manifest shape is invalid')
    if (parsed.links !== undefined && (!parsed.links || typeof parsed.links !== 'object' || Array.isArray(parsed.links)))
      throw new Error('manifest links are invalid')
    const expectedFiles = new Map<string, string>()
    const expectedLinks = new Map<string, string>()
    const expectedDirectories = new Set<string>()
    const registerParents = (path: string): void => {
      let parent = dirname(path)
      while (parent !== '.') {
        expectedDirectories.add(parent)
        parent = dirname(parent)
      }
    }
    for (const [name, hash] of Object.entries(parsed.files as Record<string, unknown>)) {
      if (typeof hash !== 'string' || !/^[a-f0-9]{64}$/.test(hash) || !name.startsWith('.ki/')) throw new Error(`unsafe file entry ${name}`)
      const rel = name.slice(4)
      if (!roots.some((base) => rel === base || rel.startsWith(`${base}/`))) throw new Error(`file entry escapes generated roots ${name}`)
      expectedFiles.set(rel, hash)
      registerParents(rel)
    }
    for (const [name, targetValue] of Object.entries((parsed.links ?? {}) as Record<string, unknown>)) {
      if (typeof targetValue !== 'string' || !name.startsWith('.ki/')) throw new Error(`unsafe link entry ${name}`)
      const rel = name.slice(4)
      if (!roots.some((base) => rel === base || rel.startsWith(`${base}/`)) || expectedFiles.has(rel))
        throw new Error(`link entry escapes generated roots ${name}`)
      expectedLinks.set(rel, targetValue)
      registerParents(rel)
    }
    const actualFiles = new Set<string>()
    const actualLinks = new Set<string>()
    const visit = (path: string): void => {
      const rel = relative(root, path)
      const entryKind = kind(path)
      if (entryKind === 'directory') {
        if (!expectedDirectories.has(rel) && !roots.includes(rel as (typeof roots)[number]))
          throw new Error(`unexpected directory .ki/${rel}`)
        for (const name of readdirSync(path).sort()) visit(join(path, name))
      } else if (entryKind === 'file') {
        const expected = expectedFiles.get(rel)
        const actual = createHash('sha256').update(readFileSync(path)).digest('hex')
        if (!expected || expected !== actual) throw new Error(`unexpected or changed file .ki/${rel}`)
        actualFiles.add(rel)
      } else if (entryKind === 'link') {
        const expected = expectedLinks.get(rel)
        if (!expected || readlinkSync(path) !== expected || !safeSourceLink(target, path, expected))
          throw new Error(`unexpected or unsafe link .ki/${rel}`)
        actualLinks.add(rel)
      } else throw new Error(`unsafe entry .ki/${rel}`)
    }
    for (const name of roots) if (kind(join(root, name)) !== 'missing') visit(join(root, name))
    if (
      actualFiles.size !== expectedFiles.size ||
      [...expectedFiles.keys()].some((name) => !actualFiles.has(name)) ||
      actualLinks.size !== expectedLinks.size ||
      [...expectedLinks.keys()].some((name) => !actualLinks.has(name))
    )
      throw new Error('manifest payload is incomplete')
    return { state: 'healthy', evidence: `${actualFiles.size} files and ${actualLinks.size} links match the manifest` }
  } catch (error) {
    return { state: 'unsafe', evidence: (error as Error).message }
  }
}

function runtimeState(target: string, config: string): { state: 'absent' | 'healthy' | 'recoverable' | 'unsafe'; evidence: string } {
  try {
    const skills = declaredSkills(config).filter((skill) => skill !== 'ki-bootstrap')
    const runtimes = supportedRuntimes(config)
    const harness = /^\[ki-harness\][ \t]*$/m.test(config) ? resolveHarnessSource(target) : undefined
    const roots = new Map(runtimes.map((runtime) => [runtime, runtimeRoot(target, runtime)]))
    const expected = runtimes.flatMap((runtime) => {
      const root = roots.get(runtime)
      return skills.map((skill) => ({ runtime, skill, path: root ? join(root, skill) : undefined }))
    })
    let missing = 0
    for (const item of expected) {
      if (!item.path) {
        missing += 1
        continue
      }
      const entryKind = kind(item.path)
      if (entryKind === 'missing') {
        missing += 1
        continue
      }
      const valid = harness?.skills.has(item.skill)
        ? isRuntimeSkillLinkToSource(item.path, sourceHarnessSkill(harness, item.skill))
        : entryKind === 'directory' && isGeneratedRuntimeSkillCopy(item.path, item.skill)
      if (!valid) return { state: 'unsafe', evidence: `${runtimeSkillsDir(item.runtime)}/${item.skill} is altered or unproven` }
    }
    for (const runtime of runtimes) {
      const root = roots.get(runtime)
      if (!root) continue
      const self = join(root, 'ki-self')
      if (kind(self) !== 'missing' && !isLocalKiSelfRuntimeProjection(self, join(target, '.ki', 'self', 'skill')))
        return { state: 'unsafe', evidence: `${runtimeSkillsDir(runtime)}/ki-self is altered or unproven` }
    }
    if (!expected.length || missing === expected.length) return { state: 'absent', evidence: 'declared runtime payloads are absent' }
    if (missing) return { state: 'recoverable', evidence: `${missing} of ${expected.length} declared runtime payloads are missing` }
    return { state: 'healthy', evidence: `${expected.length} declared runtime payloads are ownership-proven` }
  } catch (error) {
    return { state: 'unsafe', evidence: (error as Error).message }
  }
}

export function inspectRepository(value = '.'): DoctorReport {
  const requested = resolve(value)
  let target: string
  try {
    if (kind(requested) !== 'directory') throw new Error('target must be a real directory')
    target = realpathSync(requested)
  } catch (error) {
    return report(
      'repo',
      requested,
      [{ code: 'REPO_ROOT', status: 'unsafe', message: 'repository root is unsafe', evidence: (error as Error).message }],
      'educate'
    )
  }
  const configPath = join(target, '.ki-config.toml')
  const configKind = kind(configPath)
  const generated = generatedState(target)
  if (configKind === 'missing') {
    const status = generated.state === 'absent' ? 'absent' : 'unsafe'
    return report(
      'repo',
      target,
      [
        {
          code: 'REPO_DECLARATION',
          status,
          message: status === 'absent' ? 'Knowledge Islands adoption is absent' : 'generated state exists without a declaration'
        }
      ],
      'educate'
    )
  }
  if (configKind !== 'file')
    return report(
      'repo',
      target,
      [{ code: 'REPO_DECLARATION', status: 'unsafe', message: '.ki-config.toml is not a regular file' }],
      'educate'
    )
  let config: string
  try {
    config = readFileSync(configPath, 'utf8')
    declaredSkills(config)
    supportedRuntimes(config)
  } catch (error) {
    return report(
      'repo',
      target,
      [
        {
          code: 'REPO_DECLARATION',
          status: 'unsafe',
          message: '.ki-config.toml cannot define a safe scope',
          evidence: (error as Error).message
        }
      ],
      'educate'
    )
  }
  const runtime = runtimeState(target, config)
  const findings: DoctorFinding[] = [
    { code: 'REPO_DECLARATION', status: 'healthy', message: 'repository declaration is readable and scoped' },
    {
      code: 'REPO_GENERATED',
      status: generated.state === 'absent' ? 'recoverable' : generated.state,
      message: generated.state === 'absent' ? 'generated governance state is absent' : 'generated governance state inspected',
      evidence: generated.evidence
    },
    {
      code: 'REPO_RUNTIME',
      status: runtime.state === 'absent' && generated.state === 'absent' ? 'recoverable' : runtime.state,
      message: 'declared runtime payloads inspected',
      evidence: runtime.evidence
    }
  ]
  const needsClean =
    (generated.state === 'healthy' && runtime.state !== 'healthy') ||
    (generated.state === 'absent' && (runtime.state === 'healthy' || runtime.state === 'recoverable'))
  return report('repo', target, findings, needsClean ? 'clean' : 'educate')
}
