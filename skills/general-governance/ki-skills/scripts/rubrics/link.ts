import type { RubricItem } from '../lib/rubric/rubric.ts'
import { hasWikilink, relativeLinkTargets } from './support/links.ts'

export type LinkRubricContext = {
  markdown: string
  relativeTargetExists: (target: string) => boolean
}

export const LINK_1: RubricItem<LinkRubricContext> = {
  code: 'LINK-1',
  title: 'internal links use standard relative Markdown links',
  description: 'Internal links use standard relative Markdown syntax rather than wikilinks.',
  sources: ['KI'],
  audit: ({ markdown }) =>
    hasWikilink(markdown)
      ? [{ type: 'M', level: 'FAIL', code: LINK_1.code, message: 'uses Obsidian wikilinks ([[...]]) — use relative markdown links' }]
      : []
}

export const LINK_2: RubricItem<LinkRubricContext> = {
  code: 'LINK-2',
  title: 'relative link targets resolve',
  description: 'Every relative Markdown link target resolves to an existing file.',
  sources: ['KI'],
  audit: ({ markdown, relativeTargetExists }) =>
    relativeLinkTargets(markdown)
      .filter((target) => !relativeTargetExists(target))
      .map((target) => ({ type: 'M' as const, level: 'FAIL' as const, code: LINK_2.code, message: `broken relative link → "${target}"` }))
}

export const LINK_3: RubricItem<LinkRubricContext> = {
  code: 'LINK-3',
  title: 'other skills are referred to by name',
  description: 'References to other skills use their public name rather than a source-file path.',
  sources: ['KI'],
  judgment: { prompt: 'Are other skills referred to by their public name rather than by a file path?' }
}

export const LINK_4: RubricItem<LinkRubricContext> = {
  code: 'LINK-4',
  title: 'the house toolchain passes',
  description: 'The skill’s repository passes its configured code and Markdown toolchain.',
  sources: ['KI'],
  judgment: { prompt: 'Does the repository pass its configured Biome, Prettier, and markdownlint toolchain?' }
}

export const LINKS: readonly RubricItem<LinkRubricContext>[] = [LINK_1, LINK_2, LINK_3, LINK_4]
