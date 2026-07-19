import type { RubricItem } from '../lib/rubric/rubric.ts'
import { hasBackslashLink } from './support/links.ts'

export type LayoutRubricContext = {
  markdown?: string
  missingSkillRoot?: boolean
  standaloneMarkdownFile?: boolean
  supportDirectories?: readonly string[]
}

export const LAY_1: RubricItem<LayoutRubricContext> = {
  code: 'LAY-1',
  title: 'SKILL.md exists at the skill root',
  description: 'A skill has a SKILL.md file at its root.',
  sources: ['SPEC', 'CC'],
  audit: ({ missingSkillRoot }) =>
    missingSkillRoot ? [{ type: 'M', level: 'FAIL', code: LAY_1.code, message: 'SKILL.md is missing at the skill root' }] : []
}

export const LAY_2: RubricItem<LayoutRubricContext> = {
  code: 'LAY-2',
  title: 'the skill is a directory named after the skill',
  description: 'A skill is a directory named after its declared skill, rather than a standalone Markdown file.',
  sources: ['SPEC', 'CC'],
  audit: ({ standaloneMarkdownFile }) =>
    standaloneMarkdownFile
      ? [
          {
            type: 'M',
            level: 'FAIL',
            code: LAY_2.code,
            message: 'a standalone Markdown file is not a skill; place SKILL.md in a skill directory'
          }
        ]
      : []
}

export const LAY_3: RubricItem<LayoutRubricContext> = {
  code: 'LAY-3',
  title: 'optional directories use standard names',
  description: 'Optional support directories use the standard references, scripts, and assets names.',
  sources: ['SPEC'],
  audit: ({ supportDirectories = [] }) =>
    supportDirectories
      .filter((directory) => !['references', 'scripts', 'assets'].includes(directory))
      .map((directory) => ({
        type: 'M' as const,
        level: 'FAIL' as const,
        code: LAY_3.code,
        message: `support directory "${directory}" must be named references, scripts, or assets`
      }))
}

export const LAY_4: RubricItem<LayoutRubricContext> = {
  code: 'LAY-4',
  title: 'file references use forward slashes',
  description: 'Markdown link targets use forward slashes, never Windows-style backslashes.',
  sources: ['BP'],
  audit: ({ markdown }) =>
    markdown !== undefined && hasBackslashLink(markdown)
      ? [{ type: 'M', level: 'FAIL', code: LAY_4.code, message: 'a link target uses backslashes — use forward slashes' }]
      : []
}

export const LAY_5: RubricItem<LayoutRubricContext> = {
  code: 'LAY-5',
  title: 'reference chains are shallow',
  description: 'Supporting material is one level deep from SKILL.md rather than creating nested chains.',
  sources: ['BP', 'SPEC'],
  judgment: { prompt: 'Are supporting files one level deep from SKILL.md, without nested reference chains?' }
}

export const LAY_6: RubricItem<LayoutRubricContext> = {
  code: 'LAY-6',
  title: 'supporting files are named by their content',
  description: 'Supporting file names describe their contents rather than using generic sequence names.',
  sources: ['BP'],
  judgment: { prompt: 'Do supporting file names clearly describe their contents?' }
}

export const LAYOUT: readonly RubricItem<LayoutRubricContext>[] = [LAY_1, LAY_2, LAY_3, LAY_4, LAY_5, LAY_6]
