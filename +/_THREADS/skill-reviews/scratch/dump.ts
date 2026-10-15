import { readFileSync } from 'node:fs'
import { SKILL_AREAS, skillAreaPath } from '../../../../skills/repo-structure/ki-repo-harness/scripts/rubric/contexts/skill-areas.ts'
for (const c of SKILL_AREAS) {
  const j = JSON.parse(readFileSync(skillAreaPath(c), 'utf8'))
  const own = j.boundaries.at(-1).wraps as string[]
  const ins = (x: string) => own.includes(x)
  console.log(`== ${c} (${own.length}): ${own.join(' ')}`)
  for (const e of j.connections) console.log(`  ${ins(e.from) ? 'A' : 'up'}:${e.from} -> ${ins(e.to) ? 'A' : 'down'}:${e.to}${e.variant === 'dashed' ? ' (opt)' : ''}`)
}
