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
 * The area's own block: a near-square grid, widened only so that each skill outside skills rely on can head
 * a column and each skill that relies on outside skills can end one, keeping its outside edges clear of the
 * block. The skills are read in an order that puts each after the area's skills it relies on, so a hub comes
 * first and what relies on it follows; then skills outside skills rely on, then the rest, then skills that
 * rely on outside skills; then governance before processes, as on the skill map. Skills outside skills rely
 * on take the column heads, left to right; skills that rely on outside skills take the column ends; the rest
 * fill the remaining cells down the first column, up the next and so on, so each sits beside the one before.
 * Returns each skill's column and row.
 */
const areaGrid = (
  members: readonly SkillGraphNode[],
  edges: readonly Edge[]
): { cells: Map<string, Point>; rows: number } => {
  const names = new Set(members.map((member) => member.name))
  const internal = edges.filter((edge) => names.has(edge.from) && names.has(edge.to))
  const step = new Map<string, number>()
  const depth = (name: string, trail: ReadonlySet<string>): number => {
    const known = step.get(name)
    if (known !== undefined) return known
    const prerequisites = internal.filter((edge) => edge.from === name && !trail.has(edge.to))
    const value =
      prerequisites.length === 0
        ? 0
        : 1 + Math.max(...prerequisites.map((edge) => depth(edge.to, new Set([...trail, name]))))
    step.set(name, value)
    return value
  }
  const reliedOn = (name: string): boolean => edges.some((edge) => edge.to === name && !names.has(edge.from))
  const relies = (name: string): boolean => edges.some((edge) => edge.from === name && !names.has(edge.to))
  const band = (name: string): number => (reliedOn(name) ? 0 : relies(name) ? 2 : 1)
  /* Each group of linked skills starts at its hub, the one with the most links inside the area, and then
     takes its neighbours outward, so a family stays together; larger groups come first. */
  const rank = (p: SkillGraphNode, q: SkillGraphNode): number =>
    depth(p.name, new Set()) - depth(q.name, new Set()) || band(p.name) - band(q.name) || byShapeThenName(p, q)
  const links = (name: string): SkillGraphNode[] =>
    members
      .filter((member) =>
        internal.some(
          (edge) => (edge.from === name && edge.to === member.name) || (edge.to === name && edge.from === member.name)
        )
      )
      .sort(rank)
  const groups: SkillGraphNode[][] = []
  const seen = new Set<string>()
  const byHub = [...members].sort((p, q) => links(q.name).length - links(p.name).length || rank(p, q))
  for (const hub of byHub) {
    if (seen.has(hub.name)) continue
    const group = [hub]
    seen.add(hub.name)
    for (let index = 0; index < group.length; index += 1) {
      for (const next of links((group[index] as SkillGraphNode).name)) {
        if (seen.has(next.name)) continue
        seen.add(next.name)
        group.push(next)
      }
    }
    groups.push(group)
  }
  const order = groups
    .sort((p, q) => q.length - p.length || rank(p[0] as SkillGraphNode, q[0] as SkillGraphNode))
    .flat()
  /* A skill with outside links both above and below gets a column of its own at the block's right, so
     neither edge passes another skill. */
  const through = order.filter((node) => reliedOn(node.name) && relies(node.name)).slice(0, AREA_COLUMNS - 1)
  const rest = order.filter((node) => !through.includes(node))
  const heads = rest.filter((node) => reliedOn(node.name))
  const ends = rest.filter((node) => relies(node.name))
  const columns = Math.max(
    1,
    Math.min(AREA_COLUMNS - through.length, Math.max(Math.ceil(Math.sqrt(rest.length)), heads.length, ends.length))
  )
  const rows = Math.max(1, Math.ceil(rest.length / columns))
  /* The cells in reading order, down the first column and up the next, as many as there are skills. */
  const snake: Point[] = rest.map((_, index) => {
    const column = Math.floor(index / rows)
    const offset = index % rows
    return [column, column % 2 === 0 ? offset : rows - 1 - offset]
  })
  const key = ([column, row]: Point): string => `${column},${row}`
  const free = new Set(snake.map(key))
  const cells = new Map<string, Point>()
  const take = (node: SkillGraphNode, wanted: readonly Point[]): void => {
    const chosen = [...wanted, ...snake].find((cell) => free.has(key(cell)))
    if (!chosen) return
    free.delete(key(chosen))
    cells.set(node.name, chosen)
  }
  const used = (column: number): number[] => snake.filter(([each]) => each === column).map(([, row]) => row)
  const columnsUsed = [...new Set(snake.map(([column]) => column))]
  const headCells = columnsUsed.map((column): Point => [column, Math.min(...used(column))])
  const endCells = columnsUsed.map((column): Point => [column, Math.max(...used(column))])
  for (const node of heads) take(node, headCells)
  for (const node of ends) take(node, endCells)
  for (const node of rest) if (!cells.has(node.name)) take(node, [])
  through.forEach((node, index) => {
    cells.set(node.name, [(rest.length === 0 ? 0 : columns) + index, 0])
  })
  return { cells, rows }
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

    /* The area's own region, a compact block. */
    const grid = areaGrid(members, shown)

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
    for (const member of members) {
      const [column, row] = grid.cells.get(member.name) as Point
      place(member, [columnX(ORIGIN_X, column), row * (NODE_HEIGHT + ROW_GAP)])
    }
    const area = components.splice(0) as { pos: Point }[]
    const dependentsBottom = tier(dependents, ORIGIN_Y, 'above')
    const above = components.splice(0)
    const areaTop = dependents.length === 0 ? ORIGIN_Y : dependentsBottom + TIER_GAP
    for (const component of area) component.pos[1] += areaTop
    const areaBottom = areaTop + grid.rows * (NODE_HEIGHT + ROW_GAP) - ROW_GAP
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
