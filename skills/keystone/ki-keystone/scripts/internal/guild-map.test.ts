import { afterEach, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { guilds, guildTitle, MAP_END, MAP_START, readCollection, renderGuildMap, spliceGuildMap } from './guild-map.ts'

const roots: string[] = []
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

const collection = (skills: Record<string, Record<string, string>>): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-keystone-'))
  roots.push(root)
  for (const [path, fields] of Object.entries(skills)) {
    mkdirSync(join(root, 'skills', path), { recursive: true })
    const lines = Object.entries(fields).map(([key, value]) => `${key}: ${value}`)
    writeFileSync(join(root, 'skills', path, 'SKILL.md'), ['---', ...lines, '---', '', '# Skill', ''].join('\n'))
  }
  return root
}

test('membership is read from frontmatter, never from the folder', () => {
  const root = collection({
    'keystone/ki-keystone': { name: 'ki-keystone', 'ki-guild': 'keystone', 'ki-leads': 'keystone' },
    'keystone/ki-work': { name: 'ki-work', 'ki-guild': 'keystone', 'ki-leads': 'work' },
    'elsewhere/ki-work-roadmap': { name: 'ki-work-roadmap', 'ki-guild': 'work' },
    'ki-flat': { name: 'ki-flat' }
  })
  const skills = readCollection(root)
  expect(skills.map((skill) => skill.name)).toEqual(['ki-work-roadmap', 'ki-keystone', 'ki-work', 'ki-flat'])
  expect(guilds(skills)).toEqual([
    { name: 'keystone', leads: ['ki-keystone'], members: ['ki-work'] },
    { name: 'work', leads: ['ki-work'], members: ['ki-work-roadmap'] }
  ])
})

test('a repository without a skill collection reads as empty', () => {
  const root = mkdtempSync(join(tmpdir(), 'ki-keystone-'))
  roots.push(root)
  expect(readCollection(root)).toEqual([])
})

test('the map renders Keystone first, then each guild by name, with its lead and members', () => {
  const map = renderGuildMap([
    { name: 'ki-design', path: 'a', guild: 'keystone', leads: 'design' },
    { name: 'ki-keystone', path: 'b', guild: 'keystone', leads: 'keystone' },
    { name: 'ki-agentic-systems', path: 'c', guild: 'keystone', leads: 'agentic-systems' },
    { name: 'ki-design-system', path: 'd', guild: 'design' }
  ])
  expect(map.split('\n')).toEqual([
    '| Guild | Lead | Members |',
    '| --- | --- | --- |',
    '| Keystone | `ki-keystone` | `ki-agentic-systems`, `ki-design` |',
    '| Agentic systems | `ki-agentic-systems` | None |',
    '| Design | `ki-design` | `ki-design-system` |'
  ])
  expect(guildTitle('agentic-systems')).toBe('Agentic systems')
})

test('the splice replaces exactly one marked block and refuses any other', () => {
  const skills = [{ name: 'ki-keystone', path: 'x', guild: 'keystone', leads: 'keystone' }]
  const text = `# Keystone\n\n${MAP_START}\n\nold\n\n${MAP_END}\n\nAfter.\n`
  const spliced = spliceGuildMap(text, skills)
  expect(spliced).toEqual({
    text: `# Keystone\n\n${MAP_START}\n\n${renderGuildMap(skills)}\n\n${MAP_END}\n\nAfter.\n`
  })
  expect('error' in spliceGuildMap('# Keystone\n', skills)).toBe(true)
  expect('error' in spliceGuildMap(`${text}${MAP_START}\n`, skills)).toBe(true)
})
