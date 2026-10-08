import { expect, test } from 'bun:test'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

/**
 * Holds every vendored copy of the shared identifier grammar to its provider, and keeps the restating skills from
 * spelling the grammar by hand again. The test only reads files, so it adds no cross-skill import.
 */
const SKILLS = resolve(import.meta.dir, '../../../..')
const PROVIDER = resolve(import.meta.dir, 'work-identifiers.ts')
const DEPENDENCY = 'ki-work-roadmap:work-identifiers'

/**
 * The provider and the skills that restated the grammar before the shared module existed. `ki-accept` and `ki-batch`
 * join once KI-CHECKER-4 no longer reads any shared dependency as a structured rubric (KI-HARNESS-GOV-165).
 */
const RESTATING = [
  'change-management/ki-work-roadmap',
  'keystone/ki-repo',
  'change-management/ki-work-housekeeping',
  'governance/ki-decision-records',
  'governance/ki-specs'
] as const

/** The grammar's shapes, in any spelling a restating skill has used: a repository code, and a scope segment. */
const HAND_WRITTEN = [/\[A-Z0-9\]\[A-Z0-9-\]/, /\[A-Z\]\[A-Z0-9-\]\*-/, /\[A-Z0-9\]\*\[A-Z\]\[A-Z0-9-?\]\*/]

const skillDirectories = (): string[] =>
  readdirSync(SKILLS, { withFileTypes: true })
    .filter((group) => group.isDirectory())
    .flatMap((group) =>
      readdirSync(join(SKILLS, group.name), { withFileTypes: true })
        .filter((skill) => skill.isDirectory() && existsSync(join(SKILLS, group.name, skill.name, 'SKILL.md')))
        .map((skill) => `${group.name}/${skill.name}`)
    )

const sourceFiles = (directory: string): string[] => {
  if (!existsSync(directory)) return []
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    return entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts') ? [path] : []
  })
}

test('every declaring skill carries a byte-identical copy of the provider', () => {
  const provider = readFileSync(PROVIDER, 'utf8')
  const problems: string[] = []
  const declaring = skillDirectories().filter((skill) =>
    readFileSync(join(SKILLS, skill, 'SKILL.md'), 'utf8').includes(DEPENDENCY)
  )
  for (const skill of declaring) {
    const copy = join(SKILLS, skill, 'scripts/shared/work-identifiers.ts')
    if (!existsSync(copy))
      problems.push(`${skill}: declares ${DEPENDENCY} but has no scripts/shared/work-identifiers.ts`)
    else if (readFileSync(copy, 'utf8') !== provider)
      problems.push(`${relative(SKILLS, copy)} diverges from the provider`)
  }
  for (const skill of skillDirectories()) {
    const copy = join(SKILLS, skill, 'scripts/shared/work-identifiers.ts')
    if (existsSync(copy) && copy !== PROVIDER && !declaring.includes(skill)) {
      problems.push(`${skill}: carries a copy without declaring ${DEPENDENCY}`)
    }
  }
  expect(problems).toEqual([])
  for (const skill of RESTATING.slice(1)) expect(declaring).toContain(skill)
})

test('no restating or declaring skill spells the identifier grammar by hand', () => {
  const declaring = skillDirectories().filter((skill) =>
    readFileSync(join(SKILLS, skill, 'SKILL.md'), 'utf8').includes(DEPENDENCY)
  )
  const problems = [...new Set([...RESTATING, ...declaring])].flatMap((skill) =>
    sourceFiles(join(SKILLS, skill, 'scripts'))
      .filter((file) => !file.endsWith('/scripts/shared/work-identifiers.ts'))
      .flatMap((file) => {
        const lines = readFileSync(file, 'utf8').split('\n')
        return lines.flatMap((line, index) =>
          HAND_WRITTEN.some((pattern) => pattern.test(line)) ? [`${relative(SKILLS, file)}:${index + 1}`] : []
        )
      })
  )
  expect(problems).toEqual([])
})
