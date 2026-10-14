/**
 * The skill nodes every generated harness skill diagram draws: each canonical `SKILL.md` read into its
 * concern, shape and declared relationships, with the shared shape vocabulary and node naming the skill
 * map and the area diagrams both use. Shared-module packaging and coverage detection are not drawn.
 */
import { type CapabilityApplicability, type CapabilitySource, parseCapabilitySource } from './capability-publication.ts'
import type { SkillGroup } from './skill-groups.ts'

export type SkillGraphNode = {
  path: string
  domain: string
  name: string
  kind: 'governance' | 'process'
  applicability: CapabilityApplicability
  dependsOn: readonly string[]
  optionalDependsOn: readonly string[]
}

export type SkillGraphOptions = {
  /** The repository's public remote, recorded in `meta.repository`; omitted when unknown. */
  repositoryUrl?: string
  /** The 40-character commit the graph was traced at; omitted when unknown. */
  revision?: string
  /** The capability groups to nest in each concern; the harness's own table when omitted. */
  groups?: Readonly<Record<string, readonly SkillGroup[]>>
}

export const DOMAIN_LABELS: Readonly<Record<string, string>> = {
  acquire: 'acquire',
  environment: 'environment',
  'repo-structure': 'repository structure',
  'agentic-systems': 'agentic systems',
  keystone: 'keystone',
  'change-management': 'change management',
  governance: 'governance',
  design: 'design'
}

export const domainLabel = (domain: string): string => DOMAIN_LABELS[domain] ?? domain.replace(/-/g, ' ')

/**
 * A skill's shape is its applicability, which also fixes its kind: every process skill is
 * invocation-only and no governance skill is. Every diagram draws each shape as one Archify node
 * type, so the legend reads the same on both, and names it in a plain word so meaning never rests
 * on colour alone: governance that is always on (`baseline`), automatic where its structure is
 * detected (`detected`), or opt-in by declaration (`declaration-only`), and processes run as a
 * command (`invocation-only`).
 */
export const SKILL_SHAPES: Readonly<
  Record<
    CapabilityApplicability,
    { type: 'security' | 'backend' | 'database' | 'frontend'; word: string; legend: string }
  >
> = {
  baseline: { type: 'security', word: 'always on', legend: 'Governance · always on' },
  detected: { type: 'backend', word: 'automatic', legend: 'Governance · automatic' },
  'declaration-only': { type: 'database', word: 'opt-in', legend: 'Governance · opt-in' },
  'invocation-only': { type: 'frontend', word: 'command', legend: 'Process · command' }
}

export const shapeLegend = (): Record<string, { label: string }> =>
  Object.fromEntries(Object.values(SKILL_SHAPES).map((shape) => [shape.type, { label: shape.legend }]))

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

export const componentId = (name: string): string => name.replace(/[^a-zA-Z0-9_-]/g, '-')

/** The committed text form of a generated diagram. */
export const renderSkillGraph = (graph: unknown): string => `${JSON.stringify(graph, null, 2)}\n`
