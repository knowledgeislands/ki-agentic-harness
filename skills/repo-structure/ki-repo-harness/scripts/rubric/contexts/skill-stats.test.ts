import { describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { buildSkillArea } from './skill-areas.ts'
import { readSkillGraphNodes } from './skill-graph.ts'
import { codeBucket, publishedRuleCount, readSkillStats, statsTag } from './skill-stats.ts'

describe('stable skill-area stats', () => {
  test('bucket boundaries and unavailable rubric remain honest', () => {
    expect([0, 1, 10239, 10240, 102399, 102400].map(codeBucket)).toEqual(['0', 'S', 'S', 'M', 'M', 'L'])
    expect(publishedRuleCount(undefined)).toBeNull()
    expect(publishedRuleCount('No published criteria.')).toBe(0)
    expect(
      publishedRuleCount(
        '- **RULE-1 [M] — First**\n- **RULE-1 [J] — Duplicate**\n- **RULE-2 [M + J] — Second**\n## FAMILY\n- prose'
      )
    ).toBe(2)
    expect(statsTag({ rules: null, codeBytes: 0, references: 0 })).toBe('R– · C0 · F0')
  })

  test('physical source snapshot is deterministic and preserves labels, links and layout', () => {
    const root = mkdtempSync(join(tmpdir(), 'gov202-fixture-'))
    try {
      const path = 'skills/governance/ki-example/SKILL.md'
      const home = join(root, 'skills/governance/ki-example')
      mkdirSync(join(home, 'scripts/nested'), { recursive: true })
      mkdirSync(join(home, 'references/nested'), { recursive: true })
      const sources = [
        {
          path,
          content:
            '---\nname: ki-example\nki-kind: governance\nki-applicability: declaration-only\nki-depends-on: []\ndescription: Example\n---\n'
        }
      ]
      writeFileSync(join(home, 'scripts/code.ts'), 'é')
      writeFileSync(join(home, 'scripts/nested/code.test.ts'), 'test')
      writeFileSync(join(home, 'scripts/ignored.json'), 'ignored')
      writeFileSync(join(home, 'references/rubric.md'), '- **EXAMPLE-1 [J] — One**\n')
      writeFileSync(join(home, 'references/nested/guide.md'), 'guide')
      symlinkSync(join(home, 'scripts/code.ts'), join(home, 'scripts/link.ts'))
      symlinkSync(join(home, 'references'), join(home, 'references/nested/link'))
      const stats = readSkillStats(root, sources)
      expect(stats.get(path)).toEqual({ rules: 1, codeBytes: 6, references: 2 })
      expect([...readSkillStats(root, [...sources].reverse())]).toEqual([...stats])
      const nodes = readSkillGraphNodes(sources).nodes
      const area = {
        slug: 'example',
        short: 'Example',
        title: 'Example',
        purpose: 'explain',
        groups: [{ skills: ['ki-example'] }]
      }
      const before = buildSkillArea(area)(nodes) as { components: Record<string, unknown>[] }
      const after = buildSkillArea(area)(nodes, { stats }) as { components: Record<string, unknown>[] }
      expect(after.components).toEqual(before.components.map((component) => ({ ...component, tag: 'R1 · CS · F2' })))
      expect(
        readSkillStats(root, [{ path: 'skills/absent/ki-missing/SKILL.md', content: '' }])
          .values()
          .next().value
      ).toEqual({ rules: null, codeBytes: 0, references: 0 })
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})
