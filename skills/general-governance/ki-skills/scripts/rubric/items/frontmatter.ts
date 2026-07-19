import type { RubricItem } from '../../lib/rubric/rubric.ts'
import type { FrontmatterRubricContext } from '../contexts/contexts.ts'

export const FM_1: RubricItem<FrontmatterRubricContext> = {
  code: 'FM-1',
  title: 'SKILL.md begins with a valid YAML frontmatter mapping',
  description: 'A skill starts with a fenced YAML frontmatter block that parses to a mapping.',
  sources: ['SPEC', 'CC'],
  audit: ({ hasBlock, isMapping }) => {
    if (!hasBlock)
      return [
        {
          type: 'M' as const,
          level: 'FAIL' as const,
          code: FM_1.code,
          message: 'SKILL.md must begin with a YAML frontmatter block (--- ... ---)'
        }
      ]
    if (!isMapping)
      return [
        {
          type: 'M' as const,
          level: 'FAIL' as const,
          code: FM_1.code,
          message: 'YAML frontmatter must parse to a mapping'
        }
      ]
    return []
  },
  conform: ({ hasBlock, isMapping }) => {
    if (hasBlock && isMapping) return []
    const issue = hasBlock ? 'YAML frontmatter is not a mapping' : 'SKILL.md has no YAML frontmatter block'
    return [{ item: FM_1, level: 'ADVISORY', message: `${issue}; author by hand`, file: 'SKILL.md' }]
  }
}

export const FRONTMATTER = [FM_1] as const
