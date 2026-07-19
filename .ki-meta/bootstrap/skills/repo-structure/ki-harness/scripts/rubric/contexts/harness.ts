import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ConformOutcome, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'

export const HARNESS_PARTS = ['skills', 'agents', 'mcp', 'evals', 'hooks'] as const
export type HarnessPart = (typeof HARNESS_PARTS)[number]

export const REQUIRED_HARNESS_SCRIPTS = [
  'ki:skills:copy:project',
  'ki:skills:audit',
  'ki:repo:link-commands',
  'ki:skills:link:global',
  'ki:skills:refresh-status',
  'ki:eval'
] as const

export type HarnessSkillEntry = {
  directory: string
  declaredName: string | null
}

export type HarnessRubricContext = {
  root: string
  rootExists: boolean
  dryRun: boolean
  exists: (relativePath: string) => boolean
  packageJson: Record<string, unknown>
  config: string | null
  skills: readonly HarnessSkillEntry[]
  ensurePart: (part: HarnessPart) => RubricOutcomes<ConformOutcome>
  ensureShelfReadme: (part: HarnessPart) => RubricOutcomes<ConformOutcome>
  ensureHarnessConfig: () => RubricOutcomes<ConformOutcome>
}

export const hasTomlTable = (toml: string, table: string): boolean => new RegExp(`^\\[${table.replace(/-/g, '\\-')}\\]`, 'm').test(toml)

export const hasPackageScript = (pkg: Record<string, unknown>, script: string): boolean => {
  const scripts = pkg.scripts as Record<string, unknown> | undefined
  return typeof scripts === 'object' && scripts !== null && script in scripts
}

const parseFrontmatterName = (content: string): string | null => {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/)
  const nameMatch = match?.[1]?.match(/^name:\s*(.+)$/m)
  return nameMatch ? (nameMatch[1] as string).trim() : null
}

const readPackageJson = (path: string): Record<string, unknown> => {
  if (!existsSync(path)) return {}
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>
  } catch {
    return {}
  }
}

const readSkills = (root: string): HarnessSkillEntry[] => {
  const skillsDirectory = join(root, 'skills')
  if (!existsSync(skillsDirectory)) return []
  const entries: HarnessSkillEntry[] = []
  for (const directory of readdirSync(skillsDirectory)) {
    const entryPath = join(skillsDirectory, directory)
    if (!statSync(entryPath).isDirectory()) continue
    const skillPath = join(entryPath, 'SKILL.md')
    if (!existsSync(skillPath)) continue
    entries.push({ directory, declaredName: parseFrontmatterName(readFileSync(skillPath, 'utf8')) })
  }
  return entries
}

export const createHarnessContext = (root: string, dryRun: boolean): HarnessRubricContext => {
  const rootExists = existsSync(root)
  const exists = (relativePath: string): boolean => rootExists && existsSync(join(root, relativePath))
  const configPath = join(root, '.ki-config.toml')
  return {
    root,
    rootExists,
    dryRun,
    exists,
    packageJson: rootExists ? readPackageJson(join(root, 'package.json')) : {},
    config: rootExists && existsSync(configPath) ? readFileSync(configPath, 'utf8') : null,
    skills: rootExists ? readSkills(root) : [],
    ensurePart: (part) => {
      if (!rootExists) return [{ status: 'VIOLATION', message: `Harness root does not exist: ${root}.`, subject: root }]
      if (exists(`${part}/`)) return [{ status: 'PASS', message: 'Required five-part directory is present.', subject: `${part}/` }]
      if (!dryRun) mkdirSync(join(root, part), { recursive: true })
      return [{ status: 'FIXED', message: `${part}/ ${dryRun ? 'would be created' : 'created'}.`, subject: `${part}/` }]
    },
    ensureShelfReadme: (part) => {
      if (!rootExists) return [{ status: 'NOT_APPLICABLE', message: 'Harness root is absent.', subject: `${part}/README.md` }]
      const readme = join(root, part, 'README.md')
      if (existsSync(readme)) return [{ status: 'PASS', message: 'Required shelf description is present.', subject: `${part}/README.md` }]
      if (!dryRun) {
        mkdirSync(join(root, part), { recursive: true })
        writeFileSync(readme, `# \`${part}/\`\n\nEmpty shelf — no ${part} yet. TODO: describe what this part holds and its status.\n`)
      }
      return [
        {
          status: 'FIXED',
          message: `Shelf description ${dryRun ? 'would be scaffolded' : 'scaffolded'}.`,
          subject: `${part}/README.md`
        }
      ]
    },
    ensureHarnessConfig: () => {
      if (!rootExists || !existsSync(configPath))
        return [{ status: 'VIOLATION', message: 'KI configuration is missing at root — author it by hand.', subject: '.ki-config.toml' }]
      const toml = readFileSync(configPath, 'utf8')
      if (hasTomlTable(toml, 'ki-harness'))
        return [{ status: 'PASS', message: '[ki-harness] table is present.', subject: '.ki-config.toml' }]
      if (!dryRun) writeFileSync(configPath, `${toml.replace(/\n*$/, '\n')}\n[ki-harness]\n`)
      return [
        {
          status: 'FIXED',
          message: `Keyless [ki-harness] table ${dryRun ? 'would be appended' : 'appended'}.`,
          subject: '.ki-config.toml'
        }
      ]
    }
  }
}
