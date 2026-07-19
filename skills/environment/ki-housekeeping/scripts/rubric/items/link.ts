import type { RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import type { HousekeepingRubricContext } from '../contexts/housekeeping.ts'

const one = <Result>(outcome: Result): RubricOutcomes<Result> => [outcome]

export const LINK_1 = {
  code: 'LINK-1', title: 'Unresolved wikilinks are informational',
  description: '`[[wikilink]]` cross-references that don’t resolve to another file’s `name:` slug are counted and reported as INFO only — the doctrine treats these as intentional forward references, not defects.', sources: ['memory-format.md'] as const,
  mechanical: { level: 'WARN' as const, heuristic: true, audit: { phase: 'INSPECT' as const, run: (c: HousekeepingRubricContext) => { const names = new Set(c.memoryFiles.map((file) => file.frontmatter?.name).filter((name): name is string => typeof name === 'string')); let dangling = 0; for (const file of c.memoryFiles) for (const link of file.content.match(/\[\[([a-z0-9-]+)\]\]/g) ?? []) { const target = link.slice(2, -2); if (!names.has(target) && target !== file.file.replace(/\.md$/, '')) dangling++ }; return one(dangling ? { status: 'INFO', message: `${dangling} [[wikilink]] reference(s) point to a memory not yet written — treated as intentional forward references, not errors`, subject: c.memoryDir } : { status: 'PASS', message: 'No unresolved wikilinks.', subject: c.memoryDir }) } }
  }
}
export const LINK = [LINK_1] as const
