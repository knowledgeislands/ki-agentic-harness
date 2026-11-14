import { expect, test } from 'bun:test'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

// The standard is one core and purpose files under the staged split Kris authorised with STAGING a) on 7 November
// 2026. These tests keep the set navigable and prove the move lost no hard token of the single-file standard.

const skillRoot = resolve(import.meta.dir, '..')
const harnessRoot = resolve(skillRoot, '..', '..', '..')
const references = join(skillRoot, 'references')
const referenceFiles = readdirSync(references).filter((name) => name.endsWith('.md'))
const standardFiles = referenceFiles.filter((name) => /^standards-.*\.md$/.test(name))
const read = (path: string): string => readFileSync(path, 'utf8')

/** Lines outside fenced blocks, so example headings and links are not read as the document's own. */
const prose = (text: string): string[] => {
  let fence = ''
  return text.split('\n').filter((line) => {
    const opening = /^\s*(`{3,}|~{3,})/.exec(line)?.[1]
    if (opening && !fence) fence = opening
    else if (fence && line.trim() === fence) fence = ''
    else return !fence
    return false
  })
}

const slug = (heading: string): string =>
  heading
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[`*_]/g, '')
    .replace(/[^\p{L}\p{N} -]/gu, '')
    .trim()
    .replace(/ /g, '-')

/** Every anchor a Markdown file defines: heading slugs, numbered on repeats, and `<a id>` targets. */
const anchors = (text: string): Set<string> => {
  const found = new Set<string>()
  const seen = new Map<string, number>()
  for (const line of prose(text)) {
    const heading = /^#{1,6} (.+)$/.exec(line)?.[1]
    if (heading) {
      const base = slug(heading)
      const count = seen.get(base) ?? 0
      seen.set(base, count + 1)
      found.add(count ? `${base}-${count}` : base)
    }
    for (const match of line.matchAll(/<a id="([^"]+)"><\/a>/g)) if (match[1]) found.add(match[1])
  }
  return found
}

test('SKILL.md links every reference file', () => {
  const skill = read(join(skillRoot, 'SKILL.md'))
  for (const name of referenceFiles) expect(skill).toContain(`](references/${name}`)
})

test('every standard file over 100 lines opens with a contents list', () => {
  for (const name of standardFiles) {
    const text = read(join(references, name))
    if (text.split('\n').length <= 100) continue
    const sections = prose(text).filter((line) => line.startsWith('## '))
    expect({ name, first: sections[0] }).toEqual({ name, first: '## Contents' })
  }
})

test('every link to a section of a ki-coordination standard file resolves', () => {
  const tracked = Bun.spawnSync(['git', 'ls-files', '*.md'], { cwd: harnessRoot })
    .stdout.toString()
    .split('\n')
    .filter((path) => path && !path.startsWith('+/') && !path.startsWith('-/'))
  const cache = new Map<string, Set<string>>()
  const broken: string[] = []
  for (const path of tracked) {
    const text = read(join(harnessRoot, path))
    if (!text.includes('standards-')) continue
    for (const line of prose(text))
      for (const match of line.matchAll(/\]\(((?:[^()\s#]*\/)?(standards-[a-z-]+\.md))#([^)\s]+)\)/g)) {
        const [, target = '', , anchor = ''] = match
        if (target.includes('://')) continue
        const file = resolve(harnessRoot, dirname(path), target)
        if (relative(references, dirname(file)) !== '') continue
        if (!cache.has(file)) cache.set(file, anchors(read(file)))
        if (!cache.get(file)?.has(anchor)) broken.push(`${path} → ${target}#${anchor}`)
      }
  }
  expect(broken).toEqual([])
})

test('the split keeps every hard token of the single-file standard', () => {
  const tokens = JSON.parse(read(join(import.meta.dir, 'standard-split.tokens.json'))) as {
    code: string[]
    numbers: string[]
    glyphLines: string[]
    allowlist: string[]
  }
  const set = [...standardFiles, 'sources.md'].map((name) => read(join(references, name))).join('\n')
  const lower = set.toLowerCase()
  const allowed = new Set(tokens.allowlist)
  const missing = [
    ...tokens.code.filter((token) => !set.includes(`\`${token}\``)),
    ...tokens.numbers.filter((token) => !lower.includes(token.toLowerCase())),
    ...tokens.glyphLines.filter((token) => !set.includes(token))
  ].filter((token) => !allowed.has(token))
  expect(missing).toEqual([])
})
