/**
 * Renders the guild map in `ki-keystone`'s SKILL.md from the frontmatter of every skill in the harness, so the
 * skills' own `ki-guild` and `ki-leads` declarations are its one source.
 *
 * Boundary: reads the harness's skills and returns the rendered SKILL.md; it never writes. `ki dev skill generate
 * ki-keystone` compares or publishes it, and the generation test checks the committed SKILL.md against it.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { keystoneLead, readCollection, spliceGuildMap } from '../internal/guild-map.ts'

export type GeneratedSurface = { readonly path: string; readonly content: string }

export type SkillGeneration = {
  readonly contract: 1
  readonly name: string
  readonly generate: (harnessRoot: string) => readonly GeneratedSurface[]
}

export const generate = (harnessRoot: string): readonly GeneratedSurface[] => {
  const skills = readCollection(harnessRoot)
  const lead = keystoneLead(skills)
  if (!lead) throw new Error('no skill in the harness declares `ki-leads: keystone`')
  const spliced = spliceGuildMap(readFileSync(join(harnessRoot, lead.path), 'utf8'), skills)
  if ('error' in spliced) throw new Error(`${lead.path} ${spliced.error}`)
  return [{ path: lead.path, content: spliced.text }]
}

export default { contract: 1, name: 'ki-keystone', generate } satisfies SkillGeneration
