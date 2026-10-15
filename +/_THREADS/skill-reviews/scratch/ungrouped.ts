import { readFileSync, writeFileSync } from 'node:fs'
import { readSkillGraphNodes } from '../../../../skills/repo-structure/ki-repo-harness/scripts/rubric/contexts/skill-graph.ts'
import { buildSkillArea } from '../../../../skills/repo-structure/ki-repo-harness/scripts/rubric/contexts/skill-areas.ts'
import { FUNCTIONAL_AREAS, areaSkills } from '../../../../skills/repo-structure/ki-repo-harness/scripts/rubric/contexts/skill-functions.ts'
const out = process.argv[2] as string
const sources = [...new Bun.Glob('skills/*/*/SKILL.md').scanSync({ cwd: '.' })].sort().map((path) => ({ path, content: readFileSync(path, 'utf8') }))
const { nodes } = readSkillGraphNodes(sources)
/* Every area flattened to one untitled group, so no capability grouping shapes the layout. */
const flat = FUNCTIONAL_AREAS.map((area) => ({ ...area, groups: [{ skills: areaSkills(area) }] }))
let toml = ''
for (const slug of ['records-and-code', 'coordination', 'work-and-delivery', 'repository-types']) {
  const area = flat.find((each) => each.slug === slug)!
  const json = buildSkillArea(area)(nodes, { areas: flat, repositoryUrl: 'https://github.com/knowledgeislands/ki-agentic-harness', revision: '58d41cccf5895dfd3ce5f82de0024e5e92180178' }) as { meta: { output: string; repository?: unknown }; components: { sources?: unknown }[] }
  delete json.meta.repository
  for (const c of json.components) delete c.sources
  json.meta.output = `+/diagrams/ungrouped-${slug}/ungrouped-${slug}.html`
  writeFileSync(`${out}/docs/diagrams/ungrouped-${slug}.architecture.json`, JSON.stringify(json, null, 2) + '\n')
  toml += `[ungrouped-${slug}]\nsource = "docs/diagrams/ungrouped-${slug}.architecture.json"\noutput = "${json.meta.output}"\n\n`
}
writeFileSync(`${out}/docs/diagrams/diagrams.toml`, toml)
