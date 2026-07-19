import type { RubricItem } from '../lib/rubric/rubric.ts'

export type FrontmatterRubricContext = {
  hasBlock: boolean
  isMapping: boolean
}

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
  }
}

export const FRONTMATTER = [FM_1] as const
