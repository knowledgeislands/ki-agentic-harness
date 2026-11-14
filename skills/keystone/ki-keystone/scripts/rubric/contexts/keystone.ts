import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  type Guild,
  type GuildSkill,
  guilds,
  keystoneLead,
  readCollection,
  spliceGuildMap
} from '../../internal/guild-map.ts'
import type { RubricContextOptions, RubricPublicationContext, RubricSession } from '../../shared/rubric.ts'

/** The guild-map evidence: absent where no skill holds the map, or a problem, or whether it is current. */
export type GuildMapEvidence =
  | { readonly state: 'absent' }
  | { readonly state: 'invalid'; readonly path: string; readonly problem: string }
  | { readonly state: 'in-sync' | 'stale'; readonly path: string }

export type KeystoneContext = {
  readonly rubric: RubricPublicationContext
  /** Every skill in the repository's `skills/` collection; empty where it holds none. */
  readonly skills: readonly GuildSkill[]
  /** True once any skill in the collection declares or leads a guild. */
  readonly organised: boolean
  readonly guilds: readonly Guild[]
  readonly map: GuildMapEvidence
}

const mapEvidence = (repository: string, skills: readonly GuildSkill[]): GuildMapEvidence => {
  const lead = keystoneLead(skills)
  if (!lead) return { state: 'absent' }
  let text: string
  try {
    text = readFileSync(join(repository, lead.path), 'utf8')
  } catch {
    return { state: 'invalid', path: lead.path, problem: 'cannot be read' }
  }
  const spliced = spliceGuildMap(text, skills)
  if ('error' in spliced) return { state: 'invalid', path: lead.path, problem: spliced.error }
  return { state: spliced.text === text ? 'in-sync' : 'stale', path: lead.path }
}

export const createKeystoneContext = (repository: string, publication?: RubricPublicationContext['publication']) => {
  const skills = readCollection(repository)
  const context: KeystoneContext = {
    rubric: { publication },
    skills,
    organised: skills.some((skill) => skill.guild !== undefined || skill.leads !== undefined),
    guilds: guilds(skills),
    map: mapEvidence(repository, skills)
  }
  return context
}

export const createKeystoneSession = ({
  repository,
  publication
}: RubricContextOptions): RubricSession<KeystoneContext> => {
  const context = createKeystoneContext(repository, publication)
  return {
    subjects: [
      { families: ['RUBRIC'], context: () => context },
      { families: ['KEYSTONE'], context: () => context }
    ],
    proposal: () => ({ writes: [] })
  }
}
