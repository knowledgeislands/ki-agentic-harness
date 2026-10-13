/**
 * Pure evidence helpers for inter-skill dependency declarations: the declared edge set of a
 * skill collection, body mentions of sibling skills, and cycle detection over declared edges.
 */

/** One skill's declared dependency edges, as read from its `SKILL.md` frontmatter. */
export type SkillDependencyNode = {
  name: string
  dependsOn: readonly string[]
  optionalDependsOn: readonly string[]
}

/** A backticked `ki-*` skill name found in a `SKILL.md` body. */
export type SkillMention = {
  name: string
  line: number
  /** The mention is preceded by a reliance cue such as "composes" or "follow". */
  reliance: boolean
}

/**
 * Phrases that, immediately before a backticked skill name, express reliance on that skill's
 * standard rather than routing to it. Ownership and routing phrases ("owned by", "governed by",
 * "through", "use") are deliberately absent: they describe where something lives, not what the
 * current skill applies.
 */
export const RELIANCE_CUES: readonly string[] = [
  'composes',
  'composing',
  'composed',
  'follow',
  'follows',
  'per',
  'apply',
  'applies',
  'applying',
  'according to',
  'defined by',
  'as defined in',
  'as set in',
  'as described in',
  'consult',
  'consults'
]

const RELIANCE_RE = new RegExp(
  `(?:^|[^\\w])(?:${RELIANCE_CUES.map((cue) => cue.replace(/ /g, '\\s+')).join('|')})\\s+(?:(?:the|its|root|a|an)\\s+)?$`,
  'i'
)

const SKILL_NAME_RE = /`(ki-[a-z0-9]+(?:-[a-z0-9]+)*)`/g

const stripFences = (markdown: string): string =>
  markdown.replace(/```[\s\S]*?```/g, (block) => block.replace(/[^\n]/g, ' '))

/** Every backticked `ki-*` token in a body, with line number and reliance-cue classification. */
export const skillMentions = (body: string): SkillMention[] => {
  const mentions: SkillMention[] = []
  stripFences(body)
    .split(/\r?\n/)
    .forEach((line, index) => {
      for (const match of line.matchAll(SKILL_NAME_RE)) {
        const before = line.slice(Math.max(0, (match.index ?? 0) - 40), match.index)
        mentions.push({ name: match[1] as string, line: index + 1, reliance: RELIANCE_RE.test(before) })
      }
    })
  return mentions
}

/**
 * The first cycle through `start` over hard and optional edges, as the ordered list of names
 * from `start` back to `start`, or `null` when none exists.
 */
export const findDependencyCycle = (graph: readonly SkillDependencyNode[], start: string): string[] | null => {
  const edges = new Map(graph.map((node) => [node.name, [...node.dependsOn, ...node.optionalDependsOn]]))
  const visited = new Set<string>()
  const walk = (current: string, path: string[]): string[] | null => {
    for (const next of edges.get(current) ?? []) {
      if (next === start) return [...path, next]
      if (visited.has(next)) continue
      visited.add(next)
      const found = walk(next, [...path, next])
      if (found) return found
    }
    return null
  }
  return walk(start, [start])
}
