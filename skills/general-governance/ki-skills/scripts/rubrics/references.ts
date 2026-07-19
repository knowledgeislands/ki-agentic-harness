import type { RubricItem } from '../lib/rubric/rubric.ts'

const TOC_LINE_THRESHOLD = 100

export type ReferencesRubricContext = {
  lineCount: number
  content: string
}

const hasTableOfContents = (markdown: string): boolean => {
  const head = markdown.split(/\r?\n/).slice(0, 40).join('\n').toLowerCase()
  if (/^#{1,3}\s+(table of )?contents\b/m.test(head)) return true
  return (head.match(/^\s*[-*]\s+\[[^\]]+\]\(/gm) || []).length >= 3
}

export const REF_1: RubricItem<ReferencesRubricContext> = {
  code: 'REF-1',
  title: 'rarely used detail is separated into on-demand files',
  description: 'Detailed material and mutually exclusive domains are split into supporting files when appropriate.',
  sources: ['BP', 'ENG', 'SPEC'],
  judgment: { prompt: 'Is detailed or rarely used material routed to on-demand files, with mutually exclusive domains split?' }
}

export const REF_2: RubricItem<ReferencesRubricContext> = {
  code: 'REF-2',
  title: 'supporting files are referenced from SKILL.md with a loading cue',
  description: 'Each supporting file is reachable from SKILL.md and says when it should be read.',
  sources: ['BP', 'CC', 'SPEC'],
  judgment: { prompt: 'Is every supporting file referenced from SKILL.md with clear guidance on when to load it?' }
}

export const REF_3: RubricItem<ReferencesRubricContext> = {
  code: 'REF-3',
  title: 'long reference files open with a table of contents',
  description: 'A reference file over 100 lines has a table of contents near its beginning.',
  sources: ['BP', 'COMMUNITY'],
  audit: ({ lineCount, content }) =>
    lineCount > TOC_LINE_THRESHOLD && !hasTableOfContents(content)
      ? [
          {
            type: 'M',
            level: 'WARN',
            code: REF_3.code,
            message: `${lineCount} lines but no table of contents near the top`
          }
        ]
      : []
}

export const REF_4: RubricItem<ReferencesRubricContext> = {
  code: 'REF-4',
  title: 'script execution intent is explicit',
  description: 'Supporting guidance says whether each script should be run or read.',
  sources: ['BP', 'ENG'],
  judgment: { prompt: 'Is the execution intent for each script explicit: run it or read it?' }
}

export const REF_5: RubricItem<ReferencesRubricContext> = {
  code: 'REF-5',
  title: 'many-moded skills route independently invoked procedures',
  description:
    'A skill with many independent modes retains its shared model and dispatch in SKILL.md, routing procedures to flat mode files.',
  sources: ['BP', 'SPEC'],
  judgment: {
    prompt:
      'Where this skill has many independently invoked modes, does SKILL.md retain the shared model and dispatch while flat mode files hold their procedures?'
  }
}

export const REFERENCES: readonly RubricItem<ReferencesRubricContext>[] = [REF_1, REF_2, REF_3, REF_4, REF_5]
