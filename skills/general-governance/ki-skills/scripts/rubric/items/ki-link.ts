import type { RubricItem } from '../../lib/rubric/rubric.ts'
import type { KiLinkRubricContext } from '../contexts/contexts.ts'

const relativeLinkTargets = (markdown: string): string[] => {
  const targets: string[] = []
  const links = /\[[^\]]*\]\(([^)]+)\)/g
  let match: RegExpExecArray | null
  // biome-ignore lint/suspicious/noAssignInExpressions: standard regex-exec loop
  while ((match = links.exec(markdown)) !== null) {
    let target = (match[1] as string).trim()
    if (target.startsWith('<') && target.endsWith('>')) target = target.slice(1, -1).trim()
    if (/^[a-z]+:\/\//i.test(target) || target.startsWith('mailto:') || target.startsWith('#')) continue
    const hash = target.indexOf('#')
    if (hash !== -1) target = target.slice(0, hash)
    if (target) targets.push(target)
  }
  return targets
}

const hasWikilink = (markdown: string): boolean => /\[\[[^\]]+\]\]/.test(markdown)

export const KI_LINK_1: RubricItem<KiLinkRubricContext> = {
  code: 'KI-LINK-1',
  title: 'internal links use standard relative Markdown links',
  description: 'Internal links use standard relative Markdown syntax rather than wikilinks.',
  sources: ['KI'],
  audit: ({ markdown }) =>
    hasWikilink(markdown)
      ? [{ type: 'M', level: 'FAIL', code: KI_LINK_1.code, message: 'uses Obsidian wikilinks ([[...]]) — use relative markdown links' }]
      : []
}

export const KI_LINK_2: RubricItem<KiLinkRubricContext> = {
  code: 'KI-LINK-2',
  title: 'relative link targets resolve',
  description: 'Every relative Markdown link target resolves to an existing file.',
  sources: ['KI'],
  audit: ({ markdown, relativeTargetExists }) =>
    relativeLinkTargets(markdown)
      .filter((target) => !relativeTargetExists(target))
      .map((target) => ({
        type: 'M' as const,
        level: 'FAIL' as const,
        code: KI_LINK_2.code,
        message: `broken relative link → "${target}"`
      }))
}

export const KI_LINK_3: RubricItem<KiLinkRubricContext> = {
  code: 'KI-LINK-3',
  title: 'other skills are referred to by name',
  description: 'References to other skills use their public name rather than a source-file path.',
  sources: ['KI'],
  judgment: { prompt: 'Are other skills referred to by their public name rather than by a file path?' }
}

export const KI_LINK_4: RubricItem<KiLinkRubricContext> = {
  code: 'KI-LINK-4',
  title: 'the house toolchain passes',
  description: 'The skill’s repository passes its configured code and Markdown toolchain.',
  sources: ['KI'],
  judgment: { prompt: 'Does the repository pass its configured Biome, Prettier, and markdownlint toolchain?' }
}

export const KI_LINK: readonly RubricItem<KiLinkRubricContext>[] = [KI_LINK_1, KI_LINK_2, KI_LINK_3, KI_LINK_4]
