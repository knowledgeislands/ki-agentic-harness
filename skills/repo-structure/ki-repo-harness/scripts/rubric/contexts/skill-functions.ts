/**
 * The functional areas the generated skill diagrams draw. A skill's source concern says where it lives; its
 * functional area says what it is for, read from what the skill does and from the declared edges between skills.
 * Each area has a diagram of its own, and the skill map overlays the areas on the concern layout. A skill may serve
 * more than one area: its first area, in table order, is its home, where the map nests it and where outside
 * regions file it. An area may split into capability groups, each a labelled region inside the area's region; an
 * untitled group sits in the area's region without one. The table lives here, not in `SKILL.md` frontmatter,
 * because the areas are a reading aid for these diagrams rather than a published fact about the skill.
 */
import type { SkillGraphNode } from './skill-graph.ts'

export type SkillGroup = { title?: string; skills: readonly string[] }

export type FunctionalArea = {
  slug: string
  title: string
  /** The area's name in a skill-map sublabel, short enough for two areas and a shape word to stay legible. */
  short: string
  /** What the area's skills are for, in one plain clause that completes "skills that …". */
  purpose: string
  groups: readonly SkillGroup[]
}

/** Every functional area, in drawing order; each harness skill appears in at least one. */
export const FUNCTIONAL_AREAS: readonly FunctionalArea[] = [
  {
    slug: 'fundamentals',
    title: 'Fundamentals',
    short: 'fundamentals',
    purpose: 'every repository and every skill builds on',
    groups: [
      { title: 'Repository and writing', skills: ['ki-repo', 'ki-authoring', 'ki-diagrams', 'ki-git'] },
      { title: 'Skills and harness', skills: ['ki-skills', 'ki-repo-harness'] },
      { skills: ['ki-bootstrap'] }
    ]
  },
  {
    slug: 'records-and-code',
    title: 'Records and code',
    short: 'records',
    purpose: 'govern what a repository records, explains and builds',
    groups: [
      { title: 'Records', skills: ['ki-decision-records', 'ki-specs', 'ki-guides'] },
      { title: 'Writing and figures', skills: ['ki-authoring', 'ki-diagrams'] },
      { title: 'Code', skills: ['ki-engineering'] }
    ]
  },
  {
    slug: 'coordination',
    title: 'Coordination',
    short: 'coordination',
    purpose: 'hand work between agents, threads and repositories',
    groups: [
      {
        title: 'Delegation and programme',
        skills: ['ki-delegation', 'ki-work-folder', 'ki-coordination', 'ki-work-design']
      },
      { title: 'Trades', skills: ['ki-trades', 'ki-trade'] }
    ]
  },
  {
    slug: 'work-and-delivery',
    title: 'Work and delivery',
    short: 'work',
    purpose: 'record work and move it from capture to acceptance',
    groups: [
      {
        title: 'Work items',
        skills: ['ki-work', 'ki-work-roadmap', 'ki-work-github-issues', 'ki-work-linear', 'ki-work-recurring']
      },
      { title: 'Delivery cycle', skills: ['ki-next', 'ki-plan', 'ki-batch', 'ki-implement', 'ki-accept', 'ki-recap'] }
    ]
  },
  {
    slug: 'repository-types',
    title: 'Repository types',
    short: 'repo types',
    purpose: 'shape one kind of repository each',
    groups: [
      {
        title: 'Websites',
        skills: ['ki-repo-website', 'ki-repo-website-content', 'ki-repo-website-app', 'ki-repo-website-cloudflare']
      },
      {
        title: 'Knowledge bases',
        skills: [
          'ki-repo-kb',
          'ki-repo-kb-streams',
          'ki-repo-kb-activities',
          'ki-repo-kb-live-artifacts',
          'ki-repo-kb-principal'
        ]
      },
      { title: 'Projects', skills: ['ki-repo-project'] },
      {
        title: 'Single-type repositories',
        skills: [
          'ki-repo-specifications',
          'ki-repo-mcp',
          'ki-repo-harness',
          'ki-repo-tools',
          'ki-repo-homebrew-tap',
          'ki-repo-dotfiles-chezmoi'
        ]
      }
    ]
  },
  {
    slug: 'agentic-systems',
    title: 'Agentic systems',
    short: 'agentic',
    purpose: 'define agent roles and coordinate agents',
    groups: [
      {
        skills: ['ki-subagents', 'ki-subagents-claude', 'ki-subagents-chatgpt', 'ki-agent-coordination-paperclip']
      }
    ]
  },
  {
    slug: 'environment',
    title: 'Environment',
    short: 'environment',
    purpose: 'bind, budget and clean the agent runtimes',
    groups: [
      { title: 'MCP binding', skills: ['ki-binding', 'ki-binding-claude', 'ki-binding-chatgpt', 'ki-binding-chezmoi'] },
      { title: 'Tokenomics', skills: ['ki-tokenomics', 'ki-tokenomics-claude', 'ki-tokenomics-chatgpt'] },
      { title: 'Housekeeping', skills: ['ki-housekeeping-claude', 'ki-housekeeping-chatgpt'] }
    ]
  },
  {
    slug: 'acquire',
    title: 'Acquire',
    short: 'acquire',
    purpose: 'bring outside sources into a knowledge base',
    groups: [{ skills: ['ki-acquire-chatgpt', 'ki-acquire-granola'] }]
  },
  {
    slug: 'signals',
    title: 'Signals',
    short: 'signals',
    purpose: 'watch the field and keep its radars current',
    groups: [{ skills: ['ki-pulse', 'ki-agentic-radar', 'ki-model-radar'] }]
  },
  {
    slug: 'design',
    title: 'Design',
    short: 'design',
    purpose: 'shape how products look and feel',
    groups: [{ skills: ['ki-design-system', 'ki-design-inspiration'] }]
  }
]

export const areaSkills = (area: FunctionalArea): string[] => [...new Set(area.groups.flatMap((g) => g.skills))]

/** The areas a skill serves, in table order; its home is the first. */
export const areasOf = (name: string, table: readonly FunctionalArea[] = FUNCTIONAL_AREAS): FunctionalArea[] =>
  table.filter((area) => areaSkills(area).includes(name))

/** A region title for one of an area's groups: the area, then the group where the area is split. */
export const areaGroupTitle = (area: FunctionalArea, group: SkillGroup): string =>
  group.title === undefined ? area.title : `${area.title} · ${group.title}`

/** An area's groups with their present members, in table order; empty groups are dropped. */
export const groupsOf = (
  area: FunctionalArea,
  nodes: readonly SkillGraphNode[]
): { title?: string; members: SkillGraphNode[] }[] =>
  area.groups
    .map((group) => ({
      ...(group.title === undefined ? {} : { title: group.title }),
      members: group.skills.flatMap((name) => nodes.filter((node) => node.name === name))
    }))
    .filter((group) => group.members.length > 0)

/** Each skill's home: its first area and the group it sits in there. */
export const homeOf = (
  name: string,
  table: readonly FunctionalArea[] = FUNCTIONAL_AREAS
): { area: FunctionalArea; group: SkillGroup } | undefined => {
  const area = areasOf(name, table)[0]
  const group = area?.groups.find((each) => each.skills.includes(name))
  return area && group ? { area, group } : undefined
}

/** Where the table and the skills disagree: a skill in no area, an entry naming no skill, or a skill twice in one area. */
export const functionalAreaIssues = (
  nodes: readonly SkillGraphNode[],
  table: readonly FunctionalArea[] = FUNCTIONAL_AREAS
): string[] => {
  const issues: string[] = []
  const names = new Set(nodes.map((node) => node.name))
  const listed = new Set(table.flatMap(areaSkills))
  for (const name of names) if (!listed.has(name)) issues.push(`${name} is in no functional area`)
  for (const area of table) {
    const entries = area.groups.flatMap((group) => group.skills)
    for (const name of new Set(entries)) {
      if (!names.has(name)) issues.push(`${area.slug}: lists unknown skill ${name}`)
      if (entries.filter((each) => each === name).length > 1)
        issues.push(`${area.slug}: ${name} is in more than one group`)
    }
  }
  return issues.sort()
}
