/**
 * The harness area diagrams: one deterministic Archify `architecture` source per source concern under
 * `skills/`, derived from canonical `SKILL.md` frontmatter. The concern's skills sit in one region, its
 * capability groups nested inside it; the outside skills they rely on are grouped by concern and capability
 * group below it, and the outside skills that rely on them are grouped the same way above it. Solid edges are `ki-depends-on` composition and dashed edges are
 * `ki-optional-depends-on` augmentation, each drawn from dependent to prerequisite: downward between regions,
 * and inside the concern's region from what relies on a hub back to the hub it sits beside.
 */
import {
  componentId,
  domainLabel,
  SKILL_SHAPES,
  type SkillGraphNode,
  type SkillGraphOptions,
  shapeLegend
} from './skill-graph.ts'
import { groupsOf } from './skill-groups.ts'
import { CONCERN_ORDER, concernRank, concernTitle, groupTitle, SHAPE_ORDER } from './skill-map.ts'

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
const GROUP_PAD = 28
const NESTED_PAD = 44
const GROUP_GAP_X = 80
const GROUP_GAP_Y = 112
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
 * The area's own block: a compact, near-square grid in which each skill's outside edges stay clear of the
 * others. Each group of linked skills starts at its hub, the skill with the most links inside the area, and
 * takes its neighbours outward, so a family stays together and what relies on the hub sits beside it; larger
 * groups come first, and ties put a skill after the area's skills it relies on. The grid widens, up to the
 * area's width, only so that each skill outside skills rely on can head a column and each skill that relies on
 * outside skills can end one; a skill with both gets a column of its own at the right. Those skills take
 * their cells first, left to right; the rest follow the order down the first column, up the next and so on,
 * so each sits beside the one before. Returns each skill's column and row, and the block's row count.
 */
const areaGrid = (
  members: readonly SkillGraphNode[],
  edges: readonly Edge[],
  maxColumns: number = AREA_COLUMNS
): { cells: Map<string, Point>; rows: number; columns: number } => {
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
  const through = order.filter((node) => reliedOn(node.name) && relies(node.name)).slice(0, maxColumns - 1)
  const rest = order.filter((node) => !through.includes(node))
  const heads = rest.filter((node) => reliedOn(node.name))
  const ends = rest.filter((node) => relies(node.name))
  const columns = Math.max(
    1,
    Math.min(maxColumns - through.length, Math.max(Math.ceil(Math.sqrt(rest.length)), heads.length, ends.length))
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
  const restColumns = rest.length === 0 ? 0 : columns
  through.forEach((node, index) => {
    cells.set(node.name, [restColumns + index, 0])
  })
  return { cells, rows, columns: restColumns + through.length }
}

/**
 * Arrange the area's capability groups: each a compact block of its own, side by side in bands, with each
 * band's columns shared between its groups. Every order of the groups, every cut of that order into bands
 * and every share of a band's columns is tried, and the arrangement kept is the one in which the fewest
 * skills have another of the area's skills between them and the tier their outside links run to; then the
 * shortest, the narrowest, the one with fewest bands, and the one keeping closest to the table's order.
 * Returns each skill's offset from the block's top-left corner and the block's height and width.
 */
const arrangeGroups = (
  groups: readonly (readonly SkillGraphNode[])[],
  edges: readonly Edge[]
): { offsets: Map<string, Point>; height: number; width: number } => {
  const names = new Set(groups.flat().map((member) => member.name))
  const reliedOn = (name: string): boolean => edges.some((edge) => edge.to === name && !names.has(edge.from))
  const relies = (name: string): boolean => edges.some((edge) => edge.from === name && !names.has(edge.to))
  const wanted = groups.map((members) => areaGrid(members, edges).columns)
  const rowsTall = (rows: number): number => rows * (NODE_HEIGHT + ROW_GAP) - ROW_GAP
  const shares = (band: readonly number[]): number[][] => {
    const out: number[][] = []
    const visit = (split: number[], budget: number): void => {
      if (split.length === band.length) return void out.push(split)
      const left = band.length - split.length - 1
      for (let columns = 1; columns <= Math.min(wanted[band[split.length] ?? 0] ?? 1, budget - left); columns += 1)
        visit([...split, columns], budget - columns)
    }
    visit([], Math.max(AREA_COLUMNS, band.length))
    return out
  }
  const permutations = (items: readonly number[]): number[][] =>
    items.length <= 1
      ? [[...items]]
      : items.flatMap((item, index) =>
          permutations(items.filter((_, at) => at !== index)).map((rest) => [item, ...rest])
        )
  const cuts = (order: readonly number[]): number[][][] =>
    order.length === 0
      ? [[]]
      : order.flatMap((_, index) =>
          index + 1 > AREA_COLUMNS
            ? []
            : cuts(order.slice(index + 1)).map((rest) => [order.slice(0, index + 1), ...rest])
        )
  const layout = (bands: readonly (readonly number[])[], split: readonly (readonly number[])[]) => {
    const offsets = new Map<string, Point>()
    let top = 0
    let width = 0
    bands.forEach((band, bandIndex) => {
      let left = 0
      let rows = 1
      band.forEach((group, index) => {
        const columns = split[bandIndex]?.[index] ?? 1
        const grid = areaGrid(groups[group] ?? [], edges, columns)
        for (const [name, [column, row]] of grid.cells)
          offsets.set(name, [left + column * (NODE_WIDTH + COLUMN_GAP), top + row * (NODE_HEIGHT + ROW_GAP)])
        rows = Math.max(rows, grid.rows)
        width = Math.max(width, left + grid.columns * (NODE_WIDTH + COLUMN_GAP) - COLUMN_GAP)
        left += grid.columns * (NODE_WIDTH + COLUMN_GAP) - COLUMN_GAP + GROUP_GAP_X
      })
      top += rowsTall(rows) + GROUP_GAP_Y
    })
    const height = top - GROUP_GAP_Y
    const placed = [...offsets]
    const under = (x: number, ox: number): boolean => Math.abs(ox - x) < NODE_WIDTH
    const blocked = placed.filter(
      ([name, [x, y]]) =>
        (reliedOn(name) && placed.some(([other, [ox, oy]]) => other !== name && under(x, ox) && oy < y)) ||
        (relies(name) && placed.some(([other, [ox, oy]]) => other !== name && under(x, ox) && oy > y))
    ).length
    return { offsets, height, width, score: [blocked, height, width, bands.length] }
  }
  const better = (q: readonly number[], p: readonly number[]): boolean => {
    const index = q.findIndex((value, at) => value !== p[at])
    return index !== -1 && (q[index] ?? 0) < (p[index] ?? 0)
  }
  let best: { offsets: Map<string, Point>; height: number; width: number; score: number[] } | undefined
  for (const order of permutations(groups.map((_, index) => index)))
    for (const bands of cuts(order)) {
      const options = bands.map(shares)
      const choose = (at: number, chosen: number[][]): void => {
        if (at === bands.length) {
          const candidate = layout(bands, chosen)
          const score = [...candidate.score, ...order, ...chosen.flat().map((columns) => -columns)]
          if (!best || better(score, best.score)) best = { ...candidate, score }
          return
        }
        for (const split of options[at] ?? []) choose(at + 1, [...chosen, split])
      }
      choose(0, [])
    }
  return best ?? { offsets: new Map(), height: 0, width: 0 }
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
    /* Each skill's capability group: the region an outside skill joins, and the block an area skill sits in. */
    const groupOf = new Map<string, { key: string; label?: string }>()
    for (const domain of new Set(nodes.map((node) => node.domain))) {
      const split = groupsOf(
        domain,
        nodes.filter((node) => node.domain === domain),
        options.groups
      )
      for (const group of split)
        for (const node of group.members)
          groupOf.set(node.name, {
            key: `${domain}/${group.title ?? ''}`,
            ...(split.length > 1 ? { label: groupTitle(domain, group.title ?? 'Other') } : {})
          })
    }

    /* The area's own region: its capability groups side by side, each a compact block of its own. */
    const blocks = groupsOf(concern, members, options.groups)
    const arranged = arrangeGroups(
      blocks.map((block) => block.members),
      shown
    )
    /* A split area's outer region pads wider round its groups, so the whole drawing moves right to match. */
    const originX = ORIGIN_X + (blocks.length > 1 ? NESTED_PAD - REGION_PAD : 0)

    /* An outside tier: one region per capability group, each a single row, regions wrapping under the row budget. */
    const tier = (names: readonly string[], top: number, side: 'above' | 'below'): number => {
      if (names.length === 0) return top
      const neighbourX = (name: string): number => {
        const linked = shown
          .filter((edge) => (side === 'above' ? edge.from === name : edge.to === name))
          .map((edge) => position.get(side === 'above' ? edge.to : edge.from)?.[0] ?? 0)
        return linked.reduce((sum, x) => sum + x, 0) / Math.max(1, linked.length)
      }
      const groups = [...new Set(names.map((name) => groupOf.get(name)?.key ?? ''))]
        .map((key) => {
          const members = names
            .map((name) => byName.get(name) as SkillGraphNode)
            .filter((node) => groupOf.get(node.name)?.key === key)
            .sort((p, q) => neighbourX(p.name) - neighbourX(q.name) || p.name.localeCompare(q.name))
          const first = members[0] as SkillGraphNode
          return { domain: first.domain, label: groupOf.get(first.name)?.label, members }
        })
        .sort(
          (p, q) =>
            neighbourX(p.members[0]?.name ?? '') - neighbourX(q.members[0]?.name ?? '') ||
            concernRank(p.domain) - concernRank(q.domain)
        )
      /* Regions sit side by side while they fit the area's width, then wrap into a further band. */
      const right = Math.max(columnX(originX, AREA_COLUMNS) - COLUMN_GAP, originX + arranged.width)
      let bandTop = top
      let bandRows = 0
      let left = originX
      for (const group of groups) {
        const columns = Math.min(group.members.length, AREA_COLUMNS)
        const rows = Math.ceil(group.members.length / AREA_COLUMNS)
        if (left > originX && columnX(left, columns) - COLUMN_GAP > right) {
          bandTop += bandRows * (NODE_HEIGHT + ROW_GAP) - ROW_GAP + REGION_GAP_Y
          bandRows = 0
          left = originX
        }
        group.members.forEach((node, index) => {
          place(node, [
            columnX(left, index % AREA_COLUMNS),
            bandTop + Math.floor(index / AREA_COLUMNS) * (NODE_HEIGHT + ROW_GAP)
          ])
        })
        boundaries.push({
          kind: 'region',
          label: group.label ?? regionLabel(group.domain, group.members.length),
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
      const [x, y] = arranged.offsets.get(member.name) as Point
      place(member, [originX + x, y])
    }
    const area = components.splice(0) as { pos: Point }[]
    const dependentsBottom = tier(dependents, ORIGIN_Y, 'above')
    const above = components.splice(0)
    const areaTop = dependents.length === 0 ? ORIGIN_Y : dependentsBottom + TIER_GAP
    for (const component of area) component.pos[1] += areaTop
    const areaBottom = areaTop + arranged.height
    tier(prerequisites, areaBottom + TIER_GAP, 'below')
    components.unshift(...above, ...area)
    if (blocks.length > 1)
      for (const block of blocks)
        boundaries.push({
          kind: 'region',
          label: groupTitle(concern, block.title ?? 'Other'),
          wraps: block.members.map((node) => componentId(node.name)),
          pad: GROUP_PAD
        })
    boundaries.push({
      kind: 'region',
      label: regionLabel(concern, members.length),
      wraps: blocks.flatMap((block) => block.members.map((node) => componentId(node.name))),
      pad: blocks.length > 1 ? NESTED_PAD : REGION_PAD
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
            `The middle region holds every skill in ${domainLabel(concern)}, nested by the capability each brings where the concern is split; the skill map shows where the other concerns sit.`,
            'Regions below hold the outside skills these rely on, and regions above the outside skills that rely on these, each titled by concern and capability group.',
            'An arrow runs from a skill to the skill it relies on, downward between regions: solid is ki-depends-on composition, dashed is ki-optional-depends-on augmentation.'
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
