import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { basename, join, resolve } from 'node:path'

export type BindingChezMoiContext = { repo: string; present: boolean; data: string | null; template: string | null; wired: string | null }
const walk = (directory: string, visit: (path: string) => void, depth = 0): void => {
  if (depth > 6) return
  let entries: string[]
  try {
    entries = readdirSync(directory)
  } catch {
    return
  }
  for (const entry of entries) {
    if (entry === '.git' || entry === 'node_modules') continue
    const path = join(directory, entry)
    try {
      if (statSync(path).isDirectory()) walk(path, visit, depth + 1)
      else visit(path)
    } catch {
      /* skip */
    }
  }
}
export const createBindingChezMoiContext = (repo?: string): BindingChezMoiContext => {
  const root = resolve(repo ?? join(process.env.XDG_DATA_HOME ?? join(homedir(), '.local', 'share'), 'chezmoi'))
  if (!existsSync(root)) return { repo: root, present: false, data: null, template: null, wired: null }
  let data: string | null = null,
    template: string | null = null,
    wired: string | null = null
  const dataDir = join(root, '.chezmoidata')
  if (existsSync(dataDir))
    for (const entry of readdirSync(dataDir))
      if (/mcp/i.test(entry) && /\.(ya?ml|toml|json)$/.test(entry)) data = join('.chezmoidata', entry)
  walk(root, (path) => {
    const relative = path.slice(root.length + 1)
    if (!data && /mcp-servers\.ya?ml$/i.test(basename(path)) && !path.endsWith('.tmpl')) data = relative
    if (/mcp-servers-json/i.test(basename(path))) template = relative
    if (path.endsWith('.tmpl'))
      try {
        if (/mcp-servers-json/i.test(readFileSync(path, 'utf8'))) wired = relative
      } catch {
        /* skip */
      }
  })
  return { repo: root, present: true, data, template, wired }
}
