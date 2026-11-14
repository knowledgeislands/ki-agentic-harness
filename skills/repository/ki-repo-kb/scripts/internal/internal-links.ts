import { readdirSync, readFileSync, realpathSync, statSync } from 'node:fs'
import { dirname, isAbsolute, join, posix, relative, resolve, sep } from 'node:path'

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
  const canonicalRoot = realpathSync(root)
  const contained = (base: string, target: string): boolean => {
    const path = relative(base, target)
    return path !== '..' && !path.startsWith(`..${sep}`) && !isAbsolute(path)
  }
  const walk = (folder: string, ancestors: ReadonlySet<string>): void => {
    const directory = realpathSync(join(root, folder))
    if (!contained(canonicalRoot, directory) || ancestors.has(directory)) return
    const visited = new Set([...ancestors, directory])
    for (const entry of readdirSync(join(root, folder), { withFileTypes: true })) {
      if (entry.name === '.git' || entry.name === 'node_modules') continue
      const path = posix.join(folder, entry.name)
      let kind: { isDirectory(): boolean; isFile(): boolean } = entry
      if (entry.isSymbolicLink()) {
        try {
          // Inspect identity only, never traverse an alias into another audit root.
          if (!contained(canonicalRoot, realpathSync(join(root, path)))) continue
          kind = statSync(join(root, path))
        } catch (error) {
          if (['ENOENT', 'ELOOP'].includes((error as NodeJS.ErrnoException).code ?? '')) continue
          throw error
        }
      }
      if (kind.isDirectory()) {
        paths.add(path)
        walk(path, visited)
      } else if (kind.isFile()) {
        paths.add(path)
        files.push(path)
      }
    }
  }
  walk('', new Set())
  const rootRelative = (target: string): string => {
    // Keep literal case: realpath would conceal wrong-case destinations on macOS.
    const base = [resolve(root), canonicalRoot].find((base) => isAbsolute(target) && contained(base, target))
    return base === undefined ? target : `/${relative(base, target)}`
  }
  const wikiPaths = files.map((path) => ({ path, name: path.replace(/\.md$/i, '') }))
  const failures: string[] = []
  for (const note of notes) {
    const text = prose(readFileSync(join(root, note), 'utf8'))
    for (const raw of destinations(text)) {
      const target = localTarget(raw)
      if (target === null || !target) continue
      const destination = rootRelative(target)
      const path = destination.startsWith('/')
        ? posix.normalize(destination.slice(1))
        : posix.join(dirname(note), destination)
      if (!paths.has(path)) failures.push(`${note}: ${raw} (missing or wrong case)`)
    }
    for (const match of text.matchAll(/!?\[\[([^\]\n]+)\]\]/g)) {
      const raw = match[1]!.split(/\\?\|/, 1)[0]!.split(/[#^]/, 1)[0]!.trim()
      const target = localTarget(raw)
      if (target === null || !target) continue
      const name = rootRelative(target).replace(/^\//, '').replace(/\.md$/i, '')
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

// Preserve the pre-resolution audit boundary, including its note inventory and syntax.
const WIKILINK = /!?\[\[([^\]|#^\n]*)(?:[#^][^\]|\n]*)?(?:\\?\|[^\]\n]*)?\]\]/g
const CODE = /```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`/g

/**
 * Bare or partial-path wikilinks that Obsidian could resolve to more than one note. Obsidian
 * resolves a link first beside the linking note, then as a full path, and otherwise matches it
 * case-insensitively against the end of every note path, so a second note with the same leaf
 * name silently makes each existing bare link that falls through to that match ambiguous.
 */
export const ambiguousWikilinks = (root: string, notes: readonly string[]): string[] => {
  const byLeaf = new Map<string, string[]>()
  for (const note of notes) {
    const key = note.slice(0, -'.md'.length).toLowerCase()
    const leaf = key.slice(key.lastIndexOf('/') + 1)
    byLeaf.set(leaf, [...(byLeaf.get(leaf) ?? []), key])
  }
  const ambiguous: string[] = []
  for (const note of notes) {
    const text = readFileSync(join(root, note), 'utf8')
    const folder = note.includes('/') ? `${note.slice(0, note.lastIndexOf('/')).toLowerCase()}/` : ''
    for (const match of text.replace(CODE, '').matchAll(WIKILINK)) {
      const name = (match[1] ?? '').replace(/\\$/, '').trim()
      const target = name.replace(/\.md$/i, '').toLowerCase()
      if (!target || /\.[a-z0-9]+$/.test(target) || target.startsWith('/')) continue
      const candidates = byLeaf.get(target.slice(target.lastIndexOf('/') + 1)) ?? []
      if (candidates.some((path) => path === target || path === `${folder}${target}`)) continue
      const matches = candidates.filter((path) => path.endsWith(`/${target}`))
      if (matches.length > 1) ambiguous.push(`${note}: [[${name}]]`)
    }
  }
  return [...new Set(ambiguous)]
}
