import { judgment, mechanical } from './common.ts'

export const NOTE_1 = {
  ...mechanical(
    'NOTE-1',
    'declared required frontmatter',
    'When required_frontmatter is declared, each note with frontmatter carries those keys; otherwise key requirements remain a judgment call.',
    'FAIL'
  ),
  judgment: {
    prompt: 'When no required_frontmatter list is declared, are the required keys appropriate to this base and its host guidance?'
  }
} as const
export const NOTE_1A = mechanical('NOTE-1a', 'well-formed frontmatter fences', 'Every opening frontmatter fence closes.', 'FAIL')
export const NOTE_1B = mechanical('NOTE-1b', 'snake_case frontmatter keys', 'Top-level frontmatter keys use snake_case.', 'WARN')
export const NOTE_2 = judgment(
  'NOTE-2',
  'note naming convention',
  'Calendar notes are dated and other note names follow the base convention.',
  'Do note names follow the base-specific naming convention?'
)
export const NOTE_3 = judgment(
  'NOTE-3',
  'source and analysis distinction',
  'Facts are cited to a source path or reference, and analysis is labelled where the base distinguishes it.',
  'Are facts sourced and analysis labelled according to the base convention?'
)
export const NOTE = [NOTE_1, NOTE_1A, NOTE_1B, NOTE_2, NOTE_3] as const
