/**
 * The harness skill graph: a deterministic Archify `architecture` source derived from canonical
 * `SKILL.md` frontmatter. Nodes are skills grouped into one region per source concern; solid
 * edges are `ki-depends-on` composition and dashed edges are `ki-optional-depends-on`
 * augmentation. Shared-module packaging and coverage detection are not drawn.
 */
import { type CapabilitySource, parseCapabilitySource } from './capability-publication.ts'

export const SKILL_GRAPH_PATH = 'docs/diagrams/skill-graph.architecture.json'
export const SKILL_GRAPH_OUTPUT = '+/diagrams/skill-graph/skill-graph.html'

export type SkillGraphNode = {
  path: string
  domain: string
  name: string
  kind: 'governance' | 'process'
  applicability: string
  runtimeBinding: boolean
  dependsOn: readonly string[]
  optionalDependsOn: readonly string[]
}

export type SkillGraphOptions = {
  /** The repository's public remote, recorded in `meta.repository`; omitted when unknown. */
  repositoryUrl?: string
  /** The 40-character commit the graph was traced at; omitted when unknown. */
  revision?: string
}

export type SkillGraphDraft =
  | { state: 'in-sync' | 'missing' | 'stale'; issues: readonly string[]; expected: string }
  | { state: 'unsafe'; issues: readonly string[]; expected?: undefined }

const DOMAIN_LABELS: Readonly<Record<string, string>> = {
  acquire: 'acquire',
  environment: 'environment',
  'repo-structure': 'repository structure',
  'agentic-systems': 'agentic systems',
  keystone: 'keystone',
  'change-management': 'change management',
  governance: 'governance',
  design: 'design'
}

/**
 * Geometry, in SVG pixels. Every coordinate is a multiple of 16 so a horizontal jog is never a
 * micro-segment, and lanes sit 24px apart, Archify's showcase corridor-ambiguity distance.
 */
const NODE_WIDTH = 196
const NODE_HEIGHT = 48
const SLOT_GAP = 20
const LANE = 24
const MIN_GAP = 48
const ORIGIN_X = 32
const ORIGIN_Y = 48
const ISOLATED_GAP = 144
const ISOLATED_COLUMNS = 6
const REGION_PAD = 24

const domainLabel = (domain: string): string => DOMAIN_LABELS[domain] ?? domain.replace(/-/g, ' ')

const optionalList = (content: string): readonly string[] | null => {
  const document = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1]
  if (document === undefined) return null
  let parsed: unknown
  try {
    parsed = Bun.YAML.parse(document)
  } catch {
    return null
  }
  const value = (parsed as Record<string, unknown> | null)?.['ki-optional-depends-on']
  if (value === undefined) return []
  return Array.isArray(value) && value.every((item) => typeof item === 'string') ? value.map((v) => v.trim()) : null
}

/** Read graph nodes from canonical skill sources; any unparseable source is an issue, not a node. */
export const readSkillGraphNodes = (
  sources: readonly CapabilitySource[]
): { nodes: SkillGraphNode[]; issues: string[] } => {
  const nodes: SkillGraphNode[] = []
  const issues: string[] = []
  for (const source of sources) {
    const parsed = parseCapabilitySource(source)
    if (parsed.issue !== undefined) {
      issues.push(parsed.issue)
      continue
    }
    const optional = optionalList(source.content)
    if (optional === null) {
      issues.push(`${source.path}: ki-optional-depends-on must be a list of skill names`)
      continue
    }
    const { entry } = parsed
    nodes.push({
      path: entry.path,
      domain: entry.domain,
      name: entry.name,
      kind: entry.kind,
      applicability: entry.applicability,
      runtimeBinding: entry.runtimeBinding,
      dependsOn: entry.dependencies,
      optionalDependsOn: optional
    })
  }
  nodes.sort((left, right) => left.name.localeCompare(right.name))
  const names = new Set(nodes.map((node) => node.name))
  for (const node of nodes)
    for (const name of [...node.dependsOn, ...node.optionalDependsOn])
      if (!names.has(name)) issues.push(`${node.path}: depends on unknown skill \`${name}\``)
  return { nodes, issues: issues.sort() }
}

type Edge = { from: string; to: string; optional: boolean }

const componentId = (name: string): string => name.replace(/[^a-zA-Z0-9_-]/g, '-')

/**
 * A rooted view of one connected component. Every component of the skill graph is a tree, so each
 * node other than the root has one parent; a `below` child is a prerequisite of its parent and an
 * `above` child is a dependent of it. Children on a side are packed into bands that stack away
 * from the parent, so a subtree never needs more columns than the budget allows.
 */
type Band = { members: TreeNode[]; height: number }
type TreeNode = {
  name: string
  side: 'root' | 'below' | 'above'
  below: TreeNode[]
  above: TreeNode[]
  belowBands: Band[]
  aboveBands: Band[]
  /** Rows the subtree extends above and below this node, and columns it occupies. */
  up: number
  down: number
  width: number
  col: number
  row: number
  /** Sits straight below or above its parent in the parent's own column. */
  shared: boolean
}

/** Archify keeps 9px sublabels readable on a tall canvas only up to 1395px: five of these columns. */
const COLUMN_BUDGET = 6

const rootTree = (
  root: string,
  adjacency: ReadonlyMap<string, readonly string[]>,
  edgeKeys: ReadonlySet<string>
): TreeNode => {
  const build = (name: string, parent: string | null, side: TreeNode['side']): TreeNode => {
    const node: TreeNode = {
      name,
      side,
      below: [],
      above: [],
      belowBands: [],
      aboveBands: [],
      up: 0,
      down: 0,
      width: 1,
      col: 0,
      row: 0,
      shared: false
    }
    for (const next of [...(adjacency.get(name) ?? [])].sort()) {
      if (next === parent) continue
      if (edgeKeys.has(`${name}\u0000${next}`)) node.below.push(build(next, name, 'below'))
      else node.above.push(build(next, name, 'above'))
    }
    return node
  }
  return build(root, null, 'root')
}

/** Pack children into bands no wider than the budget, widest first, and measure the subtree. */
const packBands = (children: TreeNode[], budget: number): Band[] => {
  for (const child of children) measure(child, budget)
  const ordered = [...children].sort((p, q) => q.width - p.width || p.name.localeCompare(q.name))
  const bands: Band[] = []
  let remaining = 0
  for (const child of ordered) {
    const current = bands[bands.length - 1]
    if (current && child.width <= remaining) {
      current.members.push(child)
      remaining -= child.width
    } else {
      bands.push({ members: [child], height: 0 })
      remaining = budget - child.width
    }
  }
  for (const band of bands) band.height = Math.max(...band.members.map((m) => m.up + 1 + m.down))
  return bands
}

/**
 * The band farthest from the node may start in the node's own column, because the trunk ends at
 * that band: its first member hangs straight below (or above) the node. Only the side away from
 * the node's own parent qualifies, so a straight edge never runs through a straight child.
 */
const sharesColumn = (node: TreeNode, side: 'below' | 'above'): boolean => node.side === 'root' || node.side === side

const measure = (node: TreeNode, budget: number): void => {
  node.belowBands = packBands(node.below, budget - 1)
  node.aboveBands = packBands(node.above, budget - 1)
  for (const [side, bands] of [
    ['below', node.belowBands],
    ['above', node.aboveBands]
  ] as const) {
    const last = bands[bands.length - 1]?.members[0]
    if (last) last.shared = sharesColumn(node, side)
  }
  const bandWidth = (band: Band): number =>
    (band.members[0]?.shared ? 0 : 1) + band.members.reduce((sum, m) => sum + m.width, 0)
  node.width = Math.max(1, ...[...node.belowBands, ...node.aboveBands].map(bandWidth))
  node.down = node.belowBands.reduce((sum, band) => sum + band.height, 0)
  node.up = node.aboveBands.reduce((sum, band) => sum + band.height, 0)
}

/** Place a measured tree: the node takes the strip's first column; bands of children stack away from it. */
const placeTree = (node: TreeNode, col: number, row: number): void => {
  node.col = col
  node.row = row
  let top = row + 1
  for (const band of node.belowBands) {
    let cursor = col + (band.members[0]?.shared ? 0 : 1)
    for (const child of band.members) {
      placeTree(child, cursor, top + child.up)
      cursor += child.width
    }
    top += band.height
  }
  let bottom = row - 1
  for (const band of node.aboveBands) {
    let cursor = col + (band.members[0]?.shared ? 0 : 1)
    for (const child of band.members) {
      placeTree(child, cursor, bottom - child.down)
      cursor += child.width
    }
    bottom -= band.height
  }
}

const flatten = (node: TreeNode): TreeNode[] => [node, ...node.below.flatMap(flatten), ...node.above.flatMap(flatten)]

/**
 * Lay the connected skills out as trees: each node owns a column that stays clear of the rest of
 * its subtree, prerequisites hang in bands below it and dependents in bands above it, and an edge
 * runs along the parent's column to the gap beside the child's band, across to the child's column,
 * then into the child. Subtrees occupy disjoint column strips or disjoint rows, so no two edges
 * cross and no edge passes through a node, whatever the frontmatter declares.
 */
const layoutTrees = (names: readonly string[], edges: readonly Edge[]): TreeNode[] => {
  const adjacency = new Map<string, string[]>()
  for (const edge of edges) {
    adjacency.set(edge.from, [...(adjacency.get(edge.from) ?? []), edge.to])
    adjacency.set(edge.to, [...(adjacency.get(edge.to) ?? []), edge.from])
  }
  const edgeKeys = new Set(edges.map((edge) => `${edge.from}\u0000${edge.to}`))
  const seen = new Set<string>()
  const trees: TreeNode[] = []
  for (const name of [...names].sort()) {
    if (seen.has(name)) continue
    const members = flatten(rootTree(name, adjacency, edgeKeys)).map((n) => n.name)
    for (const member of members) seen.add(member)
    /* Root wherever the tree needs the fewest columns, then the fewest rows. */
    const candidates = members.sort().map((member) => rootTree(member, adjacency, edgeKeys))
    for (const candidate of candidates) measure(candidate, COLUMN_BUDGET)
    candidates.sort((p, q) => p.width - q.width || p.up + p.down - (q.up + q.down) || p.name.localeCompare(q.name))
    trees.push(candidates[0] as TreeNode)
  }
  /* Components are themselves packed into bands under the same column budget. */
  trees.sort((p, q) => flatten(q).length - flatten(p).length || q.width - p.width || p.name.localeCompare(q.name))
  let row = 0
  let cursor = 0
  let bandHeight = 0
  for (const tree of trees) {
    if (cursor > 0 && cursor + tree.width > COLUMN_BUDGET) {
      row += bandHeight
      cursor = 0
      bandHeight = 0
    }
    placeTree(tree, cursor, row + tree.up)
    cursor += tree.width
    bandHeight = Math.max(bandHeight, tree.up + 1 + tree.down)
  }
  return trees
}

type Point = [number, number]

/** Build the Archify architecture source for the given skill nodes. */
export const buildSkillGraph = (nodes: readonly SkillGraphNode[], options: SkillGraphOptions = {}): unknown => {
  const edges: Edge[] = nodes.flatMap((node) => [
    ...node.dependsOn.map((to) => ({ from: node.name, to, optional: false })),
    ...node.optionalDependsOn.map((to) => ({ from: node.name, to, optional: true }))
  ])
  const byName = new Map(nodes.map((node) => [node.name, node]))
  const connected = new Set(edges.flatMap((edge) => [edge.from, edge.to]))
  const trees = layoutTrees(
    nodes.filter((node) => connected.has(node.name)).map((node) => node.name),
    edges
  )
  const placed = trees.flatMap(flatten)
  const treeNode = new Map(placed.map((node) => [node.name, node]))
  const rowCount = Math.max(0, ...placed.map((node) => node.row + 1))

  /* Lanes live in the gap beside each band: the nearest child takes the lane closest to the band,
     farther children take lanes closer to the parent, so no jog crosses a sibling's drop. */
  type LaneRef = { gap: number; index: number; from: 'band-top' | 'band-bottom' }
  const lanes = new Map<string, LaneRef>()
  const laneCounts = Array.from({ length: Math.max(0, rowCount - 1) }, () => 0)
  for (const node of placed) {
    let top = node.row + 1
    for (const band of node.belowBands) {
      const gap = top - 1
      const jogging = band.members
        .filter((child) => child.col !== node.col)
        .sort((p, q) => Math.abs(p.col - node.col) - Math.abs(q.col - node.col))
      jogging.forEach((child, index) => {
        lanes.set(`${node.name}\u0000${child.name}`, { gap, index, from: 'band-top' })
      })
      laneCounts[gap] = Math.max(laneCounts[gap] ?? 0, jogging.length)
      top += band.height
    }
    let bottom = node.row - 1
    for (const band of node.aboveBands) {
      const gap = bottom
      const jogging = band.members
        .filter((child) => child.col !== node.col)
        .sort((p, q) => Math.abs(p.col - node.col) - Math.abs(q.col - node.col))
      jogging.forEach((child, index) => {
        lanes.set(`${node.name}\u0000${child.name}`, { gap, index, from: 'band-bottom' })
      })
      laneCounts[gap] = Math.max(laneCounts[gap] ?? 0, jogging.length)
      bottom -= band.height
    }
  }
  const rowY: number[] = []
  let y = ORIGIN_Y
  for (let r = 0; r < rowCount; r += 1) {
    rowY.push(y)
    y += NODE_HEIGHT + Math.max(MIN_GAP, LANE * ((laneCounts[r] ?? 0) + 1))
  }
  const columnX = (col: number): number => ORIGIN_X + col * (NODE_WIDTH + SLOT_GAP)
  const centreX = (col: number): number => columnX(col) + NODE_WIDTH / 2
  const laneY = (ref: LaneRef): number =>
    ref.from === 'band-top'
      ? (rowY[ref.gap + 1] ?? 0) - LANE * (ref.index + 1)
      : (rowY[ref.gap] ?? 0) + NODE_HEIGHT + LANE * (ref.index + 1)

  const component = (node: SkillGraphNode, pos: Point): unknown => ({
    id: componentId(node.name),
    type: node.kind === 'governance' ? 'backend' : 'frontend',
    label: node.name.replace(/^ki-/, ''),
    sublabel: `${domainLabel(node.domain)} · ${node.kind}`,
    ...(node.runtimeBinding ? { tag: 'runtime-bound' } : {}),
    sources: [{ path: node.path }],
    pos,
    size: [NODE_WIDTH, NODE_HEIGHT]
  })
  const components: unknown[] = []
  for (const tree of [...placed].sort((p, q) => p.row - q.row || p.col - q.col)) {
    const node = byName.get(tree.name)
    if (node) components.push(component(node, [columnX(tree.col), rowY[tree.row] ?? 0]))
  }

  const isolated = nodes
    .filter((node) => !connected.has(node.name))
    .sort((a, b) => a.domain.localeCompare(b.domain) || a.name.localeCompare(b.name))
  const isolatedTop = (rowY[rowCount - 1] ?? ORIGIN_Y - NODE_HEIGHT) + NODE_HEIGHT + ISOLATED_GAP
  isolated.forEach((node, index) => {
    components.push(
      component(node, [
        columnX(index % ISOLATED_COLUMNS),
        isolatedTop + Math.floor(index / ISOLATED_COLUMNS) * (NODE_HEIGHT + MIN_GAP)
      ])
    )
  })
  const boundaries =
    isolated.length > 0
      ? [
          {
            kind: 'region',
            label: 'No declared dependencies',
            wraps: isolated.map((node) => componentId(node.name)),
            pad: REGION_PAD
          }
        ]
      : []

  const connections = [...edges]
    .sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to))
    .flatMap((edge) => {
      const [from, to] = [treeNode.get(edge.from), treeNode.get(edge.to)]
      if (!from || !to) return []
      /* The parent is whichever end the other hangs from; the lane sits beside the child's band. */
      const parent = from.below.includes(to) ? from : to
      const child = parent === from ? to : from
      const ref = lanes.get(`${parent.name}\u0000${child.name}`)
      const [sx, tx] = [centreX(from.col), centreX(to.col)]
      const via: Point[] =
        ref === undefined
          ? []
          : [
              [sx, laneY(ref)],
              [tx, laneY(ref)]
            ]
      return [
        {
          id: `${componentId(edge.from)}--${componentId(edge.to)}`,
          from: componentId(edge.from),
          to: componentId(edge.to),
          variant: edge.optional ? 'dashed' : 'default',
          fromSide: 'bottom',
          toSide: 'top',
          ...(via.length > 0 ? { via } : { route: 'straight' })
        }
      ]
    })

  const hard = edges.filter((edge) => !edge.optional).length
  const optional = edges.length - hard
  return {
    schema_version: 1,
    diagram_type: 'architecture',
    meta: {
      title: 'Knowledge Islands skill graph',
      output: SKILL_GRAPH_OUTPUT,
      quality_profile: 'showcase',
      ...(options.repositoryUrl && options.revision
        ? { repository: { url: options.repositoryUrl, provider: 'github', revision: options.revision } }
        : {}),
      legend: { mode: 'all', entries: { backend: { label: 'Governance skill' }, frontend: { label: 'Process skill' } } }
    },
    components,
    boundaries,
    connections,
    cards: [
      {
        dot: 'cyan',
        title: 'Reading the graph',
        items: [
          'An arrow runs downward from a skill to the skill it relies on; every skill sits above everything it relies on.',
          'A solid arrow is composition declared in ki-depends-on: selecting the skill selects its prerequisite.',
          'A dashed arrow is optional augmentation declared in ki-optional-depends-on: used only when both are active.',
          'Every label drops the shared ki- prefix; the sublabel names the source concern under skills/ and the kind, and the region at the foot holds skills with no declared relationship either way.'
        ]
      },
      {
        dot: 'slate',
        title: 'Generated, not drawn',
        items: [
          `${nodes.length} skills, ${hard} composition edges, ${optional} optional edges, read from SKILL.md frontmatter.`,
          'Regenerate with ki repo conform --skill ki-repo-harness; ki-skills KI-SHAPE-20 keeps the edges resolvable and acyclic.',
          'Shared-module packaging (ki-shared-dependencies) and coverage detection (ki-detects) are not relationships and are not drawn.'
        ]
      }
    ]
  }
}

/** The committed text form of the graph. */
export const renderSkillGraph = (graph: unknown): string => `${JSON.stringify(graph, null, 2)}\n`

const withoutRevision = (text: string): string => text.replace(/"revision": "[0-9a-f]{40}"/, '"revision": "<revision>"')

/**
 * Compare the committed graph with the expected rendering. The traced revision changes on every
 * commit without changing the graph, so it is ignored; everything else must match byte for byte.
 */
export const prepareSkillGraph = (
  committed: string | undefined,
  sources: readonly CapabilitySource[],
  options: SkillGraphOptions = {}
): SkillGraphDraft => {
  const { nodes, issues } = readSkillGraphNodes(sources)
  if (issues.length > 0) return { state: 'unsafe', issues }
  const expected = renderSkillGraph(buildSkillGraph(nodes, options))
  if (committed === undefined) return { state: 'missing', issues: [], expected }
  return {
    state: withoutRevision(committed) === withoutRevision(expected) ? 'in-sync' : 'stale',
    issues: [],
    expected
  }
}
