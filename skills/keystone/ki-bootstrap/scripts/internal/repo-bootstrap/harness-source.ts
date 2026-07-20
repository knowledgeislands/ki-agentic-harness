/**
 * Physical source-harness provenance.  This deliberately does not use the
 * global harness index: a development link may only name a canonical skill
 * from the same checked-out harness as its consumer.
 */
import { lstatSync, readdirSync, readFileSync, realpathSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

export type HarnessSource = {
  root: string
  skillsRoot: string
  skills: ReadonlyMap<string, string>
}

const HARNESS_MARKER = /^\[ki-harness\][ \t]*$/m
const SKILL_NAME = /^name:\s*(ki-[A-Za-z0-9_-]+)\s*$/m

function lstatOrNull(path: string): ReturnType<typeof lstatSync> | undefined {
  try {
    return lstatSync(path)
  } catch {
    return undefined
  }
}

function isContained(root: string, path: string): boolean {
  const pathRelative = relative(root, path)
  return pathRelative === '' || (pathRelative !== '..' && !pathRelative.startsWith('../') && !pathRelative.startsWith('..\\'))
}

function regularDirectory(path: string, label: string): void {
  const stat = lstatOrNull(path)
  if (!stat?.isDirectory() || stat.isSymbolicLink()) throw new Error(`${label} must be a regular directory: ${path}`)
}

function regularConfig(root: string): string {
  const path = join(root, '.ki-config.toml')
  const stat = lstatOrNull(path)
  if (!stat?.isFile() || stat.isSymbolicLink()) throw new Error(`source harness configuration must be a regular file: ${path}`)
  return readFileSync(path, 'utf8')
}

function scanSkills(skillsRoot: string): Map<string, string> {
  const skills = new Map<string, string>()
  const visit = (directory: string): void => {
    regularDirectory(directory, 'canonical skill source')
    const skill = join(directory, 'SKILL.md')
    const skillStat = lstatOrNull(skill)
    if (skillStat) {
      if (!skillStat.isFile() || skillStat.isSymbolicLink()) throw new Error(`canonical SKILL.md must be a regular file: ${skill}`)
      const name = readFileSync(skill, 'utf8').match(SKILL_NAME)?.[1]
      if (!name) throw new Error(`canonical SKILL.md must declare an exact ki-* name: ${skill}`)
      if (skills.has(name)) throw new Error(`harness source defines duplicate canonical skill: ${name}`)
      skills.set(name, directory)
    }
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const child = join(directory, entry.name)
      const childStat = lstatOrNull(child)
      if (!childStat || childStat.isSymbolicLink()) continue
      // A nested physical repository owns its own canonical tree.  Never fold
      // its identities into the parent harness, even when it lives below
      // `skills/` during a fixture or composite checkout.
      const childConfig = lstatOrNull(join(child, '.ki-config.toml'))
      if (childConfig?.isFile() && !childConfig.isSymbolicLink()) continue
      visit(child)
    }
  }
  visit(skillsRoot)
  return skills
}

function flowList(content: string, key: string): string[] {
  const frontmatter = content.match(/^---\s*\n([\s\S]*?)\n---/)
  const line = frontmatter?.[1].split(/\r?\n/).find((candidate) => candidate.startsWith(`${key}:`))
  if (!line) return []
  const value = line
    .replace(new RegExp(`^${key}:\\s*`), '')
    .trim()
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .trim()
  return value
    ? value
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean)
    : []
}

/** Resolve the one physical canonical source tree owned by a harness root. */
export function resolveHarnessSource(root: string): HarnessSource {
  const requestedRoot = resolve(root)
  regularDirectory(requestedRoot, 'source harness root')
  const physicalRoot = realpathSync(requestedRoot)
  if (!HARNESS_MARKER.test(regularConfig(physicalRoot))) {
    throw new Error(`development links require [ki-harness] in ${join(physicalRoot, '.ki-config.toml')}`)
  }
  const skillsRoot = join(physicalRoot, 'skills')
  regularDirectory(skillsRoot, 'source harness skills')
  return { root: physicalRoot, skillsRoot, skills: scanSkills(skillsRoot) }
}

/**
 * Find the nearest physical source harness around a source skill.  A nearer
 * ordinary repository boundary is authoritative and deliberately prevents a
 * parent harness from lending its source tree to that consumer.
 */
export function nearestHarnessSource(consumerDirectory: string): HarnessSource | undefined {
  const requestedConsumer = resolve(consumerDirectory)
  regularDirectory(requestedConsumer, 'source skill directory')
  const physicalConsumer = realpathSync(requestedConsumer)
  let current = physicalConsumer
  while (true) {
    const config = lstatOrNull(join(current, '.ki-config.toml'))
    if (config?.isFile() && !config.isSymbolicLink()) {
      if (!HARNESS_MARKER.test(readFileSync(join(current, '.ki-config.toml'), 'utf8'))) return undefined
      const source = resolveHarnessSource(current)
      if (!isContained(source.skillsRoot, physicalConsumer)) {
        throw new Error(`source skill must be contained by its harness skills tree: ${consumerDirectory}`)
      }
      return source
    }
    const parent = dirname(current)
    if (parent === current) return undefined
    current = parent
  }
}

/** Return a physical, same-root canonical provider; never consult global skills. */
export function sourceHarnessSkill(source: HarnessSource, name: string): string {
  const directory = source.skills.get(name)
  if (!directory) throw new Error(`source harness lacks canonical skill: ${name}`)
  if (!isContained(source.skillsRoot, directory)) throw new Error(`canonical skill escapes source harness: ${name}`)
  return directory
}

/** Validate one harness's declared names and dependency closure without global fallback. */
export function validateHarnessSkillDeclarations(
  source: HarnessSource,
  declared: Iterable<string>
): {
  unresolved: string[]
  missingDependencies: string[]
} {
  const selected = [...new Set(declared)].sort()
  const selectedSet = new Set(selected)
  const unresolved = selected.filter((name) => !source.skills.has(name))
  const missingDependencies: string[] = []
  for (const name of selected) {
    const directory = source.skills.get(name)
    if (!directory) continue
    for (const dependency of flowList(readFileSync(join(directory, 'SKILL.md'), 'utf8'), 'ki-depends-on')) {
      if (!source.skills.has(dependency)) missingDependencies.push(`${name} → ${dependency} (unknown skill)`)
      else if (!selectedSet.has(dependency)) missingDependencies.push(`${name} → ${dependency}`)
    }
  }
  return { unresolved, missingDependencies: [...new Set(missingDependencies)].sort() }
}
