import { readFileSync } from 'node:fs'
import { readSkillGraphNodes } from '../../../../skills/repo-structure/ki-repo-harness/scripts/rubric/contexts/skill-graph.ts'
const root = process.cwd()
const sources = [...new Bun.Glob('skills/*/*/SKILL.md').scanSync({ cwd: root })].sort().map((path) => ({ path, content: readFileSync(path, 'utf8') }))
const { nodes, issues } = readSkillGraphNodes(sources)
for (const n of nodes) console.log([n.domain, n.name, n.applicability, n.dependsOn.join(','), n.optionalDependsOn.join(',')].join('\t'))
console.log(nodes.length, issues)
