import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, posix } from 'node:path'

const prose = (text: string): string =>
  text.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, '').replace(/`[^`\n]*`|<!--[\s\S]*?-->/g, '')

// Decode spaces only: reserved URI escapes and literal percent signs remain intact.
const localTarget = (target: string): string | null => {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(target)) return null
  return target.split(/[?#]/, 1)[0]!.replace(/%20/gi, ' ')
}

const destinations = (text: string): string[] => [
  ...[
    ...text.matchAll(
      /!?\[[^\]\n]*\]\(\s*(?:<([^>\n]*)>|([^\s)]+(?:\([^\s()]*\)[^\s)]*)*))(?:\s+["'][^\n]*?["'])?\s*\)/g
    )
  ].map((match) => match[1] ?? match[2] ?? ''),
  ...[...text.matchAll(/^ {0,3}\[[^\]\n]+\]:\s*(?:<([^>\n]+)>|([^\s]+))/gm)].map((match) => match[1] ?? match[2] ?? '')
]

/** Resolve file paths only; fragment navigation is verified by the converter's client pilot. */
export const unresolvedInternalLinks = (root: string, notes: readonly string[]): string[] => {
  const paths = new Set<string>(['.'])
  const files: string[] = []
  const walk = (folder: string): void => {
    for (const entry of readdirSync(join(root, folder), { withFileTypes: true })) {
      if (entry.name === '.git' || entry.name === 'node_modules') continue
      const path = posix.join(folder, entry.name)
      if (entry.isDirectory()) {
        paths.add(path)
        walk(path)
      } else if (entry.isFile()) {
        paths.add(path)
        files.push(path)
      }
    }
  }
  walk('')
  const wikiPaths = files.map((path) => ({ path, name: path.replace(/\.md$/i, '') }))
  const failures: string[] = []
  for (const note of notes) {
    const text = prose(readFileSync(join(root, note), 'utf8'))
    for (const raw of destinations(text)) {
      const target = localTarget(raw)
      if (target === null || !target) continue
      const path = target.startsWith('/') ? posix.normalize(target.slice(1)) : posix.join(dirname(note), target)
      if (!paths.has(path)) failures.push(`${note}: ${raw} (missing or wrong case)`)
    }
    for (const match of text.matchAll(/!?\[\[([^\]\n]+)\]\]/g)) {
      const raw = match[1]!.split(/\\?\|/, 1)[0]!.split(/[#^]/, 1)[0]!.trim()
      const target = localTarget(raw)
      if (target === null || !target) continue
      const name = target.replace(/^\//, '').replace(/\.md$/i, '')
      const beside = posix.join(dirname(note), name)
      const equals = (value: string, other: string): boolean => value.toLowerCase() === other.toLowerCase()
      let candidates = wikiPaths.filter((entry) => equals(entry.name, beside))
      let expected = beside
      if (!candidates.length) {
        candidates = wikiPaths.filter((entry) => equals(entry.name, name))
        expected = name
      }
      if (!candidates.length) {
        candidates = wikiPaths.filter((entry) => entry.name.toLowerCase().endsWith(`/${name.toLowerCase()}`))
        expected = candidates[0]?.name.slice(0, -name.length) + name
      }
      const extension = target.match(/\.md$/i)?.[0]
      if (
        candidates.length !== 1 ||
        candidates[0]!.name !== expected ||
        (extension !== undefined && !candidates[0]!.path.endsWith(extension))
      )
        failures.push(`${note}: [[${raw}]] (${candidates.length > 1 ? 'ambiguous' : 'missing or wrong case'})`)
    }
  }
  return [...new Set(failures)]
}
