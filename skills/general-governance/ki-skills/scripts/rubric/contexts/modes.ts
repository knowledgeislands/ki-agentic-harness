import { stripCode } from './text.ts'

export const isProcessSkill = (description: string): boolean => /\(kind:\s*process\b/i.test(description)

export const extractSection = (body: string, heading: string): string | null => {
  const match = new RegExp(`^##\\s+${heading}\\s*$`, 'im').exec(body)
  if (!match) return null
  const rest = body.slice((match.index ?? 0) + match[0].length)
  const next = rest.search(/^##\s+/m)
  return next === -1 ? rest : rest.slice(0, next)
}

export const extractBodyModes = (section: string | null): Set<string> => {
  const modes = new Set<string>()
  if (!section) return modes
  for (const match of section.matchAll(/^###\s+Mode\s+(\w+)/gim)) modes.add((match[1] as string).toUpperCase())
  let headerSeen = false
  for (const rawLine of section.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line.startsWith('|')) {
      headerSeen = false
      continue
    }
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim())
    if (!headerSeen) {
      if (/^mode$/i.test(cells[0] ?? '')) headerSeen = true
      continue
    }
    const mode = (cells[0] ?? '').replace(/`/g, '').trim()
    if (!/^:?-+:?$/.test(mode) && mode) modes.add(mode.toUpperCase())
  }
  return modes
}

export const hintVerbs = (hint: string): string[] =>
  hint
    .split('|')
    .map((segment) =>
      segment
        .trim()
        .match(/^[a-zA-Z][a-zA-Z0-9-]*/)?.[0]
        ?.toUpperCase()
    )
    .filter((verb): verb is string => verb !== undefined)

const ENDORSE_EXTENSION_RES = [/\bprefer that (extension )?skill\b/i, /delegat\w*[^.\n]*\bmodes?\b[^.\n]*\bback\b/i, /\bextends this one\b/i]
const DISAVOWAL_CUE = /retir|never|forbid|\bflag|heurist|anti-pattern|disavow|must not|do not/i

export const endorsesRetiredExtension = (markdown: string): boolean => {
  const stripped = stripCode(markdown).replace(/"[^"\n]*"/g, '')
  return stripped.split(/\r?\n/).some((line) => !DISAVOWAL_CUE.test(line) && ENDORSE_EXTENSION_RES.some((pattern) => pattern.test(line)))
}
