/**
 * The capability groups the generated skill diagrams draw inside each source concern. A concern's directory
 * says where a skill lives; its group says what capability it brings, so the diagrams show both: each group is
 * a labelled region nested in its concern's region. A concern too small or cohesive to split has no entry and
 * draws as one region. The table lives here, not in `SKILL.md` frontmatter, because grouping is a reading aid
 * for these diagrams rather than a published fact about the skill.
 */
import type { SkillGraphNode } from './skill-graph.ts'

export type SkillGroup = { title: string; skills: readonly string[] }

/** Each split concern's groups, in drawing order; every skill of a split concern sits in exactly one. */
export const SKILL_GROUPS: Readonly<Record<string, readonly SkillGroup[]>> = {
  governance: [
    {
      title: 'Writing and records',
      skills: ['ki-authoring', 'ki-decision-records', 'ki-specs', 'ki-guides', 'ki-diagrams']
    },
    { title: 'Coordination', skills: ['ki-delegation', 'ki-checkpoint', 'ki-trades', 'ki-trade'] },
    { title: 'Code and Git', skills: ['ki-engineering', 'ki-git'] },
    { title: 'Radars', skills: ['ki-agentic-radar', 'ki-model-radar'] }
  ],
  'change-management': [
    {
      title: 'Work items',
      skills: ['ki-work', 'ki-work-roadmap', 'ki-work-github-issues', 'ki-work-linear', 'ki-work-recurring']
    },
    {
      title: 'Delivery cycle',
      skills: ['ki-next', 'ki-plan', 'ki-batch', 'ki-implement', 'ki-accept', 'ki-recap']
    },
    { title: 'Programme', skills: ['ki-pmo', 'ki-pmo-design'] }
  ],
  'repo-structure': [
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
    {
      title: 'Websites',
      skills: ['ki-repo-website', 'ki-repo-website-content', 'ki-repo-website-app', 'ki-repo-website-cloudflare']
    },
    {
      title: 'Projects and tools',
      skills: [
        'ki-repo-project',
        'ki-repo-specifications',
        'ki-repo-harness',
        'ki-repo-tools',
        'ki-repo-homebrew-tap',
        'ki-repo-mcp',
        'ki-repo-dotfiles-chezmoi'
      ]
    }
  ],
  environment: [
    { title: 'MCP binding', skills: ['ki-binding', 'ki-binding-claude', 'ki-binding-chatgpt', 'ki-binding-chezmoi'] },
    { title: 'Tokenomics', skills: ['ki-tokenomics', 'ki-tokenomics-claude', 'ki-tokenomics-chatgpt'] },
    { title: 'Housekeeping', skills: ['ki-housekeeping-claude', 'ki-housekeeping-chatgpt'] }
  ]
}

/**
 * A concern's skills split into its groups, in table order. A concern with no entry is one untitled group; a
 * skill the table does not list joins a final untitled group, so a harness with other skills still draws.
 */
export const groupsOf = (
  concern: string,
  members: readonly SkillGraphNode[],
  table: Readonly<Record<string, readonly SkillGroup[]>> = SKILL_GROUPS
): { title?: string; members: SkillGraphNode[] }[] => {
  const declared = table[concern] ?? []
  const groups = declared
    .map((group) => ({
      title: group.title,
      members: members.filter((member) => group.skills.includes(member.name))
    }))
    .filter((group) => group.members.length > 0)
  const listed = new Set(declared.flatMap((group) => group.skills))
  const rest = members.filter((member) => !listed.has(member.name))
  return rest.length > 0 ? [...groups, { members: rest }] : groups
}

/** Where the table and the skills disagree: a skill a split concern leaves out, or an entry naming no skill there. */
export const skillGroupIssues = (
  nodes: readonly SkillGraphNode[],
  table: Readonly<Record<string, readonly SkillGroup[]>> = SKILL_GROUPS
): string[] => {
  const issues: string[] = []
  for (const [concern, groups] of Object.entries(table)) {
    const members = nodes.filter((node) => node.domain === concern).map((node) => node.name)
    const listed = groups.flatMap((group) => group.skills)
    for (const name of members) if (!listed.includes(name)) issues.push(`${concern}: ${name} is in no capability group`)
    for (const name of listed)
      if (!members.includes(name)) issues.push(`${concern}: capability group lists unknown skill ${name}`)
    for (const name of new Set(listed))
      if (listed.filter((each) => each === name).length > 1)
        issues.push(`${concern}: ${name} is in more than one capability group`)
  }
  return issues.sort()
}
