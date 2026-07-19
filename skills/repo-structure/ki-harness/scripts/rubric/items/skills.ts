import type { AuditOutcome } from '../../vendored/ki-skills/rubric.ts'
import type { HarnessRubricContext } from '../contexts/harness.ts'
import { outcomes, result } from './common.ts'
const SKILLS_ITEMS = [
  {
    code: 'SKILLS-1',
    title: 'Skill directory and name alignment',
    description: 'Each direct skills/ entry with a SKILL.md matches its name frontmatter.',
    sources: ['standards.md#skills-directory'],
    mechanical: {
      level: 'FAIL',
      overrideLevels: ['WARN'],
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) => {
          if (!context.exists('skills/')) return result('NOT_APPLICABLE', 'Skill directory is absent — skipping name checks.', 'skills/')
          if (context.skills.length === 0) return result('PASS', 'No direct skill entries require name alignment.', 'skills/')
          return outcomes<AuditOutcome>(
            context.skills.map((skill) =>
              skill.declaredName === null
                ? {
                    status: 'VIOLATION' as const,
                    level: 'WARN' as const,
                    message: 'No parseable name: frontmatter.',
                    subject: `skills/${skill.directory}/SKILL.md`
                  }
                : {
                    status: skill.declaredName === skill.directory ? ('PASS' as const) : ('VIOLATION' as const),
                    message: `Directory '${skill.directory}' must match name: '${skill.declaredName}'.`,
                    subject: `skills/${skill.directory}`
                  }
            )
          )
        }
      }
    }
  },
  {
    code: 'SKILLS-2',
    title: 'Unique skill names',
    description: 'No two local skill entries share a frontmatter name, and composed surfaces remain unambiguous.',
    sources: ['standards.md#skills-directory'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) => {
          if (!context.exists('skills/'))
            return result('NOT_APPLICABLE', 'Skill directory is absent — skipping duplicate-name checks.', 'skills/')
          const names = new Map<string, string[]>()
          for (const skill of context.skills) {
            if (!skill.declaredName) continue
            names.set(skill.declaredName, [...(names.get(skill.declaredName) ?? []), skill.directory])
          }
          const duplicates = [...names.entries()].filter(([, entries]) => entries.length > 1)
          return duplicates.length > 0
            ? outcomes<AuditOutcome>(
                duplicates.map(([name, entries]) => ({
                  status: 'VIOLATION',
                  message: `Duplicate name '${name}' in ${entries.map((entry) => `skills/${entry}`).join(', ')}.`,
                  subject: 'skills/'
                }))
              )
            : result('PASS', 'Local skill names are unique.', 'skills/')
        }
      }
    },
    judgment: { prompt: 'Assess whether another installed or composed surface makes an otherwise unique local skill name ambiguous.' }
  }
] as const

export const SKILLS_1 = SKILLS_ITEMS[0]
export const SKILLS_2 = SKILLS_ITEMS[1]
export const SKILLS = [SKILLS_1, SKILLS_2] as const
