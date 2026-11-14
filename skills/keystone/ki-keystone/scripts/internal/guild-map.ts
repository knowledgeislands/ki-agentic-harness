/**
 * Reads a skill collection's guild declarations from each skill's frontmatter and renders the guild map
 * `ki-keystone` holds: each guild with its lead and members, read from `ki-guild` and `ki-leads`, never from the
 * folder a skill is stored in.
 *
 * Boundary: reads each SKILL.md under a root's `skills/` folder and returns data or text; it never writes.
 */
import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

export type GuildSkill = {
  readonly name: string
  readonly path: string
  readonly guild?: string
  readonly leads?: string
}

export type Guild = {
  readonly name: string
  readonly leads: readonly string[]
  readonly members: readonly string[]
}

export const KEYSTONE = 'keystone'
export const MAP_START = '<!-- ki-keystone:guild-map:start -->'
export const MAP_END = '<!-- ki-keystone:guild-map:end -->'

const SKILL_FILE = 'SKILL.md'
const MAX_DEPTH = 3

const scalar = (frontmatter: string, key: string): string | undefined => {
  const match = new RegExp(`^${key}:[ \\t]*(.*)$`, 'm').exec(frontmatter)
  const value = match?.[1]
    ?.trim()
    .replace(/^(?:"(.*)"|'(.*)')$/, '$1$2')
    .trim()
  return value ? value : undefined
}

/** The frontmatter between the opening `---` and the next, or none. */
const frontmatter = (text: string): string | undefined => {
  if (!text.startsWith('---\n')) return undefined
  const end = text.indexOf('\n---', 4)
  return end < 0 ? undefined : text.slice(4, end)
}

const directory = (path: string): boolean => {
  try {
    const stat = lstatSync(path)
    return stat.isDirectory() && !stat.isSymbolicLink()
  } catch {
    return false
  }
}

/** Every SKILL.md below `<root>/skills`, a skill folder or a guild folder deep, in path order. */
export const readCollection = (root: string): readonly GuildSkill[] => {
  const skillsRoot = join(root, 'skills')
  if (!directory(skillsRoot)) return []
  const found: GuildSkill[] = []
  const walk = (folder: string, depth: number): void => {
    for (const entry of readdirSync(folder).sort()) {
      const path = join(folder, entry)
      if (!directory(path) || entry.startsWith('.') || entry === 'node_modules') continue
      const skillFile = join(path, SKILL_FILE)
      if (existsSync(skillFile)) {
        const fields = frontmatter(readFileSync(skillFile, 'utf8')) ?? ''
        const guild = scalar(fields, 'ki-guild')
        const leads = scalar(fields, 'ki-leads')
        found.push({
          name: scalar(fields, 'name') ?? entry,
          path: relative(root, skillFile),
          ...(guild ? { guild } : {}),
          ...(leads ? { leads } : {})
        })
      } else if (depth < MAX_DEPTH) walk(path, depth + 1)
    }
  }
  walk(skillsRoot, 1)
  return found
}

/** Each guild a skill declares or leads, Keystone first and the rest by name. */
export const guilds = (skills: readonly GuildSkill[]): readonly Guild[] => {
  const names = new Set<string>()
  for (const skill of skills) {
    if (skill.guild) names.add(skill.guild)
    if (skill.leads) names.add(skill.leads)
  }
  return [...names]
    .sort((left, right) => (left === KEYSTONE ? -1 : right === KEYSTONE ? 1 : left.localeCompare(right)))
    .map((name) => {
      const leads = skills.filter((skill) => skill.leads === name).map((skill) => skill.name)
      return {
        name,
        leads: leads.sort(),
        members: skills
          .filter((skill) => skill.guild === name && !leads.includes(skill.name))
          .map((skill) => skill.name)
          .sort()
      }
    })
}

/** A guild's machine name as a reader sees it: `agentic-systems` reads as Agentic systems. */
export const guildTitle = (name: string): string => {
  const words = name.replace(/-/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

const code = (name: string): string => `\`${name}\``

/** The guild map's Markdown table, without its markers. */
export const renderGuildMap = (skills: readonly GuildSkill[]): string => {
  const rows = guilds(skills).map(
    (guild) =>
      `| ${guildTitle(guild.name)} | ${guild.leads.map(code).join(', ') || 'None'} | ${guild.members.map(code).join(', ') || 'None'} |`
  )
  return ['| Guild | Lead | Members |', '| --- | --- | --- |', ...rows].join('\n')
}

/** The lead of Keystone in a collection, the skill whose SKILL.md holds the guild map. */
export const keystoneLead = (skills: readonly GuildSkill[]): GuildSkill | undefined =>
  skills.find((skill) => skill.leads === KEYSTONE)

/**
 * The SKILL.md text with its guild map replaced by the map rendered from the collection, or an error when the file
 * does not hold exactly one pair of markers.
 */
export const spliceGuildMap = (
  text: string,
  skills: readonly GuildSkill[]
): { readonly text: string } | { readonly error: string } => {
  const start = text.indexOf(MAP_START)
  const end = text.indexOf(MAP_END)
  if (start < 0 || end < start || text.indexOf(MAP_START, start + 1) >= 0 || text.indexOf(MAP_END, end + 1) >= 0)
    return { error: `must hold exactly one ${MAP_START} … ${MAP_END} block` }
  return {
    text: `${text.slice(0, start)}${MAP_START}\n\n${renderGuildMap(skills)}\n\n${text.slice(end)}`
  }
}
