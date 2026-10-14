/**
 * The harness skill map: a deterministic Archify `architecture` source derived from the
 * `skills/<concern>/<skill>/` layout and canonical `SKILL.md` frontmatter. Each source concern is
 * one region, split into nested regions for its capability groups, and each skill is drawn in the
 * shape its applicability declares. Relationships belong to the area diagrams the map indexes, so
 * the map draws no edges.
 */

import type { CapabilityApplicability } from './capability-publication.ts'
import {
  componentId,
  domainLabel,
  SKILL_SHAPES,
  type SkillGraphNode,
  type SkillGraphOptions,
  shapeLegend
} from './skill-graph.ts'
import { groupsOf } from './skill-groups.ts'

export const SKILL_MAP_PATH = 'docs/diagrams/skill-map.architecture.json'
export const SKILL_MAP_OUTPUT = '+/diagrams/skill-map/skill-map.html'

/** Foundations first, then the lifecycle, the repository shapes, and the specialised concerns. */
export const CONCERN_ORDER = [
  'keystone',
  'governance',
  'change-management',
  'repo-structure',
  'agentic-systems',
  'environment',
  'acquire',
  'design'
] as const

/** Within a concern, governance that always applies comes first and invocation-only processes last. */
export const SHAPE_ORDER: readonly CapabilityApplicability[] = [
  'baseline',
  'detected',
  'declaration-only',
  'invocation-only'
]

/**
 * Geometry, in SVG pixels. Two stacks of three-column regions keep the canvas inside Archify's
 * showcase readability width; each concern joins whichever stack is currently shorter.
 */
const NODE_WIDTH = 196
const NODE_HEIGHT = 48
const SLOT_GAP = 12
const ROW_GAP = 24
const REGION_COLUMNS = 3
const REGION_PAD = 24
const GROUP_PAD = 10
const GROUP_GAP_Y = 80
const REGION_GAP_X = 72
const REGION_GAP_Y = 112
const ORIGIN_X = 32
const ORIGIN_Y = 64

export const concernTitle = (domain: string): string =>
  domain.replace(/(^|-)([a-z])/g, (_, gap, letter) => `${gap ? ' ' : ''}${letter.toUpperCase()}`)

/** A nested group's region title: its concern, then the capability it brings. */
export const groupTitle = (domain: string, title: string): string => `${concernTitle(domain)} · ${title}`

export const concernRank = (domain: string): number => {
  const index = (CONCERN_ORDER as readonly string[]).indexOf(domain)
  return index === -1 ? CONCERN_ORDER.length : index
}

/** Build the Archify architecture source for the given skill nodes. */
export const buildSkillMap = (nodes: readonly SkillGraphNode[], options: SkillGraphOptions = {}): unknown => {
  const concerns = [...new Set(nodes.map((node) => node.domain))].sort(
    (left, right) => concernRank(left) - concernRank(right) || left.localeCompare(right)
  )
  const stackX = [ORIGIN_X, ORIGIN_X + REGION_COLUMNS * (NODE_WIDTH + SLOT_GAP) - SLOT_GAP + REGION_GAP_X]
  const stackY = [ORIGIN_Y, ORIGIN_Y]
  const components: unknown[] = []
  const boundaries: unknown[] = []
  for (const concern of concerns) {
    const members = nodes
      .filter((node) => node.domain === concern)
      .sort(
        (left, right) =>
          SHAPE_ORDER.indexOf(left.applicability) - SHAPE_ORDER.indexOf(right.applicability) ||
          left.name.localeCompare(right.name)
      )
    const groups = groupsOf(concern, members, options.groups)
    const nested = groups.length > 1
    const stack = (stackY[1] ?? 0) < (stackY[0] ?? 0) ? 1 : 0
    const left = stackX[stack] ?? ORIGIN_X
    let top = stackY[stack] ?? ORIGIN_Y
    /* Each group fills its own rows, in the concern's shape order, and the next group starts below it. */
    for (const group of groups) {
      group.members.forEach((node, index) => {
        const shape = SKILL_SHAPES[node.applicability]
        components.push({
          id: componentId(node.name),
          type: shape.type,
          label: node.name.replace(/^ki-/, ''),
          sublabel: `${domainLabel(node.domain)} · ${shape.word}`,
          sources: [{ path: node.path }],
          pos: [
            left + (index % REGION_COLUMNS) * (NODE_WIDTH + SLOT_GAP),
            top + Math.floor(index / REGION_COLUMNS) * (NODE_HEIGHT + ROW_GAP)
          ],
          size: [NODE_WIDTH, NODE_HEIGHT]
        })
      })
      if (nested)
        boundaries.push({
          kind: 'region',
          label: groupTitle(concern, group.title ?? 'Other'),
          wraps: group.members.map((node) => componentId(node.name)),
          pad: GROUP_PAD
        })
      const rows = Math.ceil(group.members.length / REGION_COLUMNS)
      top += rows * (NODE_HEIGHT + ROW_GAP) - ROW_GAP + GROUP_GAP_Y
    }
    boundaries.push({
      kind: 'region',
      label: `${concernTitle(concern)} · ${members.length} ${members.length === 1 ? 'skill' : 'skills'}`,
      wraps: groups.flatMap((group) => group.members.map((node) => componentId(node.name))),
      pad: REGION_PAD
    })
    stackY[stack] = top - GROUP_GAP_Y + REGION_GAP_Y
  }

  const count = (applicability: CapabilityApplicability): number =>
    nodes.filter((node) => node.applicability === applicability).length
  return {
    schema_version: 1,
    diagram_type: 'architecture',
    meta: {
      title: 'Knowledge Islands skill map',
      output: SKILL_MAP_OUTPUT,
      quality_profile: 'showcase',
      ...(options.repositoryUrl && options.revision
        ? { repository: { url: options.repositoryUrl, provider: 'github', revision: options.revision } }
        : {}),
      legend: { mode: 'auto', entries: shapeLegend() }
    },
    components,
    boundaries,
    connections: [],
    cards: [
      {
        dot: 'cyan',
        title: 'Reading the map',
        items: [
          'Each outer region is one source concern under skills/; the regions nested in it group its skills by the capability they bring.',
          'Colour and sublabel say when a skill applies: always on in every repository, automatic where its structure is found, opt-in once a repository declares it, or a command you run by name.',
          'The first three are governance standards and a command is a process; each concern has an area diagram showing what its skills rely on and what relies on them.'
        ]
      },
      {
        dot: 'slate',
        title: 'Generated, not drawn',
        items: [
          `${nodes.length} skills in ${concerns.length} concerns: ${count('baseline')} always on, ${count('detected')} automatic, ${count('declaration-only')} opt-in, ${count('invocation-only')} commands.`,
          'Regenerate with ki repo conform --skill ki-repo-harness; ki-skills owns the kind and applicability fields it reads.'
        ]
      }
    ]
  }
}
