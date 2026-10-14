/**
 * The generated skill diagrams a harness that adopts `ki-diagrams` publishes, and the comparison
 * that keeps each committed source exact against canonical `SKILL.md` frontmatter.
 */
import type { CapabilitySource } from './capability-publication.ts'
import { buildSkillArea, SKILL_AREAS, skillAreaPath } from './skill-areas.ts'
import { readSkillGraphNodes, renderSkillGraph, type SkillGraphNode, type SkillGraphOptions } from './skill-graph.ts'
import { buildSkillMap, SKILL_MAP_PATH } from './skill-map.ts'

export type SkillDiagram = {
  path: string
  build: (nodes: readonly SkillGraphNode[], options: SkillGraphOptions) => unknown
}

/**
 * The skill map answers what exists and where, overlays the functional areas, and indexes their diagrams;
 * each functional-area diagram answers what one area's skills rely on outside it and what relies on them.
 */
export const SKILL_DIAGRAMS: readonly SkillDiagram[] = [
  { path: SKILL_MAP_PATH, build: buildSkillMap },
  ...SKILL_AREAS.map((area) => ({ path: skillAreaPath(area.slug), build: buildSkillArea(area) }))
]

export type SkillDiagramDraft =
  | { state: 'in-sync' | 'missing' | 'stale'; issues: readonly string[]; expected: string }
  | { state: 'unsafe'; issues: readonly string[]; expected?: undefined }

const withoutRevision = (text: string): string => text.replace(/"revision": "[0-9a-f]{40}"/, '"revision": "<revision>"')

/**
 * Compare one committed diagram source with the expected rendering. The traced revision changes on
 * every commit without changing the drawing, so it is ignored; everything else must match byte for byte.
 */
export const prepareSkillDiagram = (
  diagram: SkillDiagram,
  committed: string | undefined,
  sources: readonly CapabilitySource[],
  options: SkillGraphOptions = {}
): SkillDiagramDraft => {
  const { nodes, issues } = readSkillGraphNodes(sources)
  if (issues.length > 0) return { state: 'unsafe', issues }
  const expected = renderSkillGraph(diagram.build(nodes, options))
  if (committed === undefined) return { state: 'missing', issues: [], expected }
  return {
    state: withoutRevision(committed) === withoutRevision(expected) ? 'in-sync' : 'stale',
    issues: [],
    expected
  }
}
