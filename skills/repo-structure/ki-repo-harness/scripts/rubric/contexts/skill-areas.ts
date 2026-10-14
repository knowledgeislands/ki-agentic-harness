/**
 * The harness area diagrams: one deterministic Archify `architecture` source per source concern under
 * `skills/`, derived from canonical `SKILL.md` frontmatter. The concern's skills sit in one region; the
 * outside skills they rely on are grouped by concern below it, and the outside skills that rely on them
 * are grouped by concern above it. Solid edges are `ki-depends-on` composition and dashed edges are
 * `ki-optional-depends-on` augmentation, each drawn downward from dependent to prerequisite.
 */
import {
  componentId,
  domainLabel,
  SKILL_SHAPES,
  type SkillGraphNode,
  type SkillGraphOptions,
  shapeLegend
} from './skill-graph.ts'
import { CONCERN_ORDER, concernRank, concernTitle, SHAPE_ORDER } from './skill-map.ts'

export const skillAreaSlug = (concern: string): string => `skill-area-${concern}`
export const skillAreaPath = (concern: string): string => `docs/diagrams/${skillAreaSlug(concern)}.architecture.json`
const skillAreaOutput = (concern: string): string =>
  `+/diagrams/${skillAreaSlug(concern)}/${skillAreaSlug(concern)}.html`

/** The concerns that each have an area diagram, in the skill map's order. */
export const SKILL_AREAS: readonly string[] = CONCERN_ORDER

/**
 * Geometry, in SVG pixels, on a 16px grid. Columns sit far enough apart for a route to pass between two
 * nodes, and tiers far enough apart for the lanes their edges need.
 */
const NODE_WIDTH = 196
const NODE_HEIGHT = 48
const COLUMN_GAP = 48
const ROW_GAP = 64
const REGION_PAD = 32
const REGION_GAP_X = 112
const REGION_GAP_Y = 112
const TIER_GAP = 128
const AREA_COLUMNS = 5
const ORIGIN_X = 32
const ORIGIN_Y = 64

type Edge = { from: string; to: string; optional: boolean }
type Point = [number, number]

const count = (size: number, noun: string): string => `${size} ${noun}${size === 1 ? '' : 's'}`

const byShapeThenName = (left: SkillGraphNode, right: SkillGraphNode): number =>
  SHAPE_ORDER.indexOf(left.applicability) - SHAPE_ORDER.indexOf(right.applicability) ||
  left.name.localeCompare(right.name)

/**
 * Internal layers: a skill sits one layer below the lowest of the area's skills that rely on it, so an
 * internal edge always runs downward, as the outside edges do. Within a layer, skills that outside skills
 * rely on come first, nearest the tier above; skills that rely on outside skills come last, nearest the
 * tier below; then governance before processes, as on the skill map.
 */
const internalLayers = (members: readonly SkillGraphNode[], edges: readonly Edge[]): SkillGraphNode[][] => {
  const names = new Set(members.map((member) => member.name))
  const internal = edges.filter((edge) => names.has(edge.from) && names.has(edge.to))
  const layer = new Map<string, number>()
  const depth = (name: string, trail: ReadonlySet<string>): number => {
    const known = layer.get(name)
    if (known !== undefined) return known
    const parents = internal.filter((edge) => edge.to === name && !trail.has(edge.from))
    const value =
      parents.length === 0 ? 0 : 1 + Math.max(...parents.map((edge) => depth(edge.from, new Set([...trail, name]))))
    layer.set(name, value)
    return value
  }
  const layers: SkillGraphNode[][] = []
  for (const member of members) {
    const index = depth(member.name, new Set())
    layers[index] = [...(layers[index] ?? []), member]
  }
  const band = (name: string): number => {
    const reliedOn = edges.some((edge) => edge.to === name && !names.has(edge.from))
    const relies = edges.some((edge) => edge.from === name && !names.has(edge.to))
    return reliedOn && !relies ? 0 : relies && !reliedOn ? 2 : 1
  }
  return layers
    .filter((group) => group !== undefined)
    .map((group) => [...group].sort((p, q) => band(p.name) - band(q.name) || byShapeThenName(p, q)))
}

/** Build the Archify architecture source for one concern's area diagram. */
export const buildSkillArea =
  (concern: string) =>
  (nodes: readonly SkillGraphNode[], options: SkillGraphOptions = {}): unknown => {
    const edges: Edge[] = nodes.flatMap((node) => [
      ...node.dependsOn.map((to) => ({ from: node.name, to, optional: false })),
      ...node.optionalDependsOn.map((to) => ({ from: node.name, to, optional: true }))
    ])
    const byName = new Map(nodes.map((node) => [node.name, node]))
    const inArea = (name: string): boolean => byName.get(name)?.domain === concern
    const members = nodes.filter((node) => node.domain === concern)
    const shown = edges.filter((edge) => inArea(edge.from) || inArea(edge.to))
    const prerequisites = [...new Set(shown.filter((edge) => !inArea(edge.to)).map((edge) => edge.to))]
    const dependents = [...new Set(shown.filter((edge) => !inArea(edge.from)).map((edge) => edge.from))]

    const components: unknown[] = []
    const boundaries: unknown[] = []
    const position = new Map<string, Point>()
    const place = (node: SkillGraphNode, pos: Point): void => {
      position.set(node.name, pos)
      const shape = SKILL_SHAPES[node.applicability]
      components.push({
        id: componentId(node.name),
        type: shape.type,
        label: node.name.replace(/^ki-/, ''),
        sublabel: `${domainLabel(node.domain)} · ${shape.word}`,
        sources: [{ path: node.path }],
        pos,
        size: [NODE_WIDTH, NODE_HEIGHT]
      })
    }
    const columnX = (left: number, index: number): number => left + index * (NODE_WIDTH + COLUMN_GAP)
    const regionLabel = (domain: string, size: number): string => `${concernTitle(domain)} · ${count(size, 'skill')}`

    /* The area's own region, layer by layer; a layer wider than the region wraps onto further rows. */
    const layers = internalLayers(members, shown)
    const areaRows = layers.flatMap((layer) =>
      Array.from({ length: Math.ceil(layer.length / AREA_COLUMNS) }, (_, row) =>
        layer.slice(row * AREA_COLUMNS, (row + 1) * AREA_COLUMNS)
      )
    )

    /* An outside tier: one region per concern, each a single row, regions wrapping under the row budget. */
    const tier = (names: readonly string[], top: number, side: 'above' | 'below'): number => {
      if (names.length === 0) return top
      const neighbourX = (name: string): number => {
        const linked = shown
          .filter((edge) => (side === 'above' ? edge.from === name : edge.to === name))
          .map((edge) => position.get(side === 'above' ? edge.to : edge.from)?.[0] ?? 0)
        return linked.reduce((sum, x) => sum + x, 0) / Math.max(1, linked.length)
      }
      const groups = [...new Set(names.map((name) => byName.get(name)?.domain ?? ''))]
        .map((domain) => ({
          domain,
          members: names
            .map((name) => byName.get(name) as SkillGraphNode)
            .filter((node) => node.domain === domain)
            .sort((p, q) => neighbourX(p.name) - neighbourX(q.name) || p.name.localeCompare(q.name))
        }))
        .sort(
          (p, q) =>
            neighbourX(p.members[0]?.name ?? '') - neighbourX(q.members[0]?.name ?? '') ||
            concernRank(p.domain) - concernRank(q.domain)
        )
      /* Regions sit side by side while they fit the area's width, then wrap into a further band. */
      const right = columnX(ORIGIN_X, AREA_COLUMNS) - COLUMN_GAP
      let bandTop = top
      let bandRows = 0
      let left = ORIGIN_X
      for (const group of groups) {
        const columns = Math.min(group.members.length, AREA_COLUMNS)
        const rows = Math.ceil(group.members.length / AREA_COLUMNS)
        if (left > ORIGIN_X && columnX(left, columns) - COLUMN_GAP > right) {
          bandTop += bandRows * (NODE_HEIGHT + ROW_GAP) - ROW_GAP + REGION_GAP_Y
          bandRows = 0
          left = ORIGIN_X
        }
        group.members.forEach((node, index) => {
          place(node, [
            columnX(left, index % AREA_COLUMNS),
            bandTop + Math.floor(index / AREA_COLUMNS) * (NODE_HEIGHT + ROW_GAP)
          ])
        })
        boundaries.push({
          kind: 'region',
          label: regionLabel(group.domain, group.members.length),
          wraps: group.members.map((node) => componentId(node.name)),
          pad: REGION_PAD
        })
        bandRows = Math.max(bandRows, rows)
        left = columnX(left, columns) - COLUMN_GAP + REGION_GAP_X
      }
      return bandTop + bandRows * (NODE_HEIGHT + ROW_GAP) - ROW_GAP
    }

    /* The area is placed first, at its final columns, so each outside tier can order itself against it;
       its rows then move down below the dependents' tier, and the prerequisites' tier goes beneath. */
    areaRows.forEach((row, rowIndex) => {
      row.forEach((node, index) => {
        place(node, [columnX(ORIGIN_X, index), rowIndex * (NODE_HEIGHT + ROW_GAP)])
      })
    })
    const area = components.splice(0) as { pos: Point }[]
    const dependentsBottom = tier(dependents, ORIGIN_Y, 'above')
    const above = components.splice(0)
    const areaTop = dependents.length === 0 ? ORIGIN_Y : dependentsBottom + TIER_GAP
    for (const component of area) component.pos[1] += areaTop
    const areaBottom = areaTop + areaRows.length * (NODE_HEIGHT + ROW_GAP) - ROW_GAP
    tier(prerequisites, areaBottom + TIER_GAP, 'below')
    components.unshift(...above, ...area)
    boundaries.push({
      kind: 'region',
      label: regionLabel(concern, members.length),
      wraps: members.map((node) => componentId(node.name)),
      pad: REGION_PAD
    })

    const connections = [...shown]
      .sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to))
      .map((edge) => ({
        id: `${componentId(edge.from)}--${componentId(edge.to)}`,
        from: componentId(edge.from),
        to: componentId(edge.to),
        variant: edge.optional ? 'dashed' : 'default'
      }))

    const hard = shown.filter((edge) => !edge.optional).length
    return {
      schema_version: 1,
      diagram_type: 'architecture',
      meta: {
        title: `Knowledge Islands skills · ${concernTitle(concern)}`,
        output: skillAreaOutput(concern),
        quality_profile: 'showcase',
        ...(options.repositoryUrl && options.revision
          ? { repository: { url: options.repositoryUrl, provider: 'github', revision: options.revision } }
          : {}),
        legend: { mode: 'auto', entries: shapeLegend() }
      },
      components,
      boundaries,
      connections,
      cards: [
        {
          dot: 'cyan',
          title: 'Reading the diagram',
          items: [
            `The middle region holds every skill in ${domainLabel(concern)}; the skill map shows where the other concerns sit.`,
            'Regions below hold the outside skills these rely on, and regions above the outside skills that rely on these.',
            'An arrow runs downward from a skill to the skill it relies on: solid is ki-depends-on composition, dashed is ki-optional-depends-on augmentation.'
          ]
        },
        {
          dot: 'slate',
          title: 'Generated, not drawn',
          items: [
            `${count(members.length, 'skill')}, ${count(prerequisites.length, 'outside prerequisite')}, ${count(dependents.length, 'outside dependent')}, ${hard} composition and ${shown.length - hard} optional edges, read from SKILL.md frontmatter.`,
            'Regenerate with ki repo conform --skill ki-repo-harness; ki-skills KI-SHAPE-20 keeps the edges resolvable and acyclic.'
          ]
        }
      ]
    }
  }
