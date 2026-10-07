const RULE = '# -----------------------------------------------------------------------------'

export const CONFIGURATION_NEIGHBOURHOODS = [
  'Foundation',
  'Repository shape',
  'Governance and runtime',
  'Change management',
  'Relationships'
] as const

type Neighbourhood = (typeof CONFIGURATION_NEIGHBOURHOODS)[number]
type MultilineDelimiter = '"""' | "'''"

type SourceLine = {
  readonly line: number
  readonly raw: string
  readonly code: string
}

type SkillTable = {
  readonly line: number
  readonly owner: string
  readonly root: boolean
}

type Banner = {
  readonly line: number
  readonly name: Neighbourhood
}

export type ConfigurationPresentation = {
  readonly substantial: boolean
  readonly issues: readonly string[]
}

const tripleClose = (line: string, delimiter: MultilineDelimiter, from: number): number => {
  let at = line.indexOf(delimiter, from)
  while (at !== -1) {
    const backslashes = line.slice(0, at).match(/\\+$/)?.[0].length ?? 0
    if (delimiter === "'''" || backslashes % 2 === 0) return at
    at = line.indexOf(delimiter, at + delimiter.length)
  }
  return -1
}

const sourceLines = (text: string): readonly SourceLine[] => {
  const lines: SourceLine[] = []
  let multiline: MultilineDelimiter | null = null
  for (const [index, raw] of text.split(/\r?\n/).entries()) {
    if (multiline) {
      if (tripleClose(raw, multiline, 0) !== -1) multiline = null
      lines.push({ line: index + 1, raw, code: '' })
      continue
    }

    let code = ''
    let quote: '"' | "'" | null = null
    let escaped = false
    for (let at = 0; at < raw.length; at++) {
      const delimiter = raw.startsWith('"""', at) ? '"""' : raw.startsWith("'''", at) ? "'''" : null
      if (!quote && delimiter) {
        if (tripleClose(raw, delimiter, at + delimiter.length) === -1) multiline = delimiter
        break
      }
      const character = raw[at] as string
      if (!quote && character === '#') break
      code += character
      if (quote === '"') {
        if (!escaped && character === '"') quote = null
        escaped = !escaped && character === '\\'
      } else if (quote === "'") {
        if (character === "'") quote = null
      } else if (character === '"' || character === "'") {
        quote = character
        escaped = false
      }
    }
    lines.push({ line: index + 1, raw, code: code.trim() })
  }
  return lines
}

const skillTables = (lines: readonly SourceLine[]): readonly SkillTable[] =>
  lines.flatMap(({ code, line }) => {
    const match = code.match(/^\[\s*skills\s*\.\s*(?:"([^"\\]+)"|'([^']+)'|([A-Za-z0-9_-]+))\s*(\.|\])/)
    const owner = match?.[1] ?? match?.[2] ?? match?.[3]
    return owner ? [{ line, owner, root: match?.[4] === ']' }] : []
  })

const banners = (lines: readonly SourceLine[], issues: string[]): readonly Banner[] => {
  const found: Banner[] = []
  for (let index = 0; index < lines.length; index++) {
    const name = CONFIGURATION_NEIGHBOURHOODS.find((candidate) => lines[index]?.raw.trim() === `# ${candidate}`)
    if (!name) continue
    if (lines[index - 1]?.raw.trim() !== RULE || lines[index + 1]?.raw.trim() !== RULE) {
      issues.push(`line ${lines[index]?.line}: ${name} banner must use the exact three-line comment form`)
      continue
    }
    found.push({ line: lines[index - 1]?.line ?? lines[index]?.line ?? 0, name })
  }
  return found
}

const bannerGroup = (line: number, found: readonly Banner[]): string => {
  const banner = [...found].reverse().find((candidate) => candidate.line < line)
  return banner?.name ?? '<unbannered>'
}

export const inspectConfigurationPresentation = (text: string): ConfigurationPresentation => {
  const lines = sourceLines(text)
  const tables = skillTables(lines)
  const roots = tables.filter((table) => table.root)
  const extraRoots = roots.filter((table) => !['ki-repo', 'ki-authoring'].includes(table.owner))
  const substantial = extraRoots.length >= 3
  const issues: string[] = []
  const foundBanners = banners(lines, issues)

  const firstTable = lines.find(({ code }) => /^\[\[?/.test(code))
  if (firstTable && firstTable.code !== '[repo]') issues.push(`line ${firstTable.line}: [repo] must be the first table`)

  if (roots[0] && roots[0].owner !== 'ki-repo')
    issues.push(`line ${roots[0].line}: [skills.ki-repo] must be the first skill root`)
  const authoringRoot = roots.find((table) => table.owner === 'ki-authoring')
  if (authoringRoot && roots[1]?.owner !== 'ki-authoring')
    issues.push(`line ${authoringRoot.line}: [skills.ki-authoring] must follow [skills.ki-repo]`)

  for (const child of tables.filter((table) => !table.root)) {
    const root = roots.find((candidate) => candidate.owner === child.owner && candidate.line < child.line)
    if (!root) issues.push(`line ${child.line}: [skills.${child.owner}] must be declared before its child tables`)
  }

  const ownerGroups = new Map<string, Set<string>>()
  for (const table of tables) {
    const groups = ownerGroups.get(table.owner) ?? new Set<string>()
    groups.add(bannerGroup(table.line, foundBanners))
    ownerGroups.set(table.owner, groups)
  }
  for (const [owner, groups] of ownerGroups) {
    if (groups.size > 1) issues.push(`[skills.${owner}] is split across neighbourhood banners`)
  }

  const seen = new Set<Neighbourhood>()
  let previous = -1
  for (const banner of foundBanners) {
    if (seen.has(banner.name)) issues.push(`line ${banner.line}: ${banner.name} banner is duplicated`)
    seen.add(banner.name)
    const order = CONFIGURATION_NEIGHBOURHOODS.indexOf(banner.name)
    if (order < previous) issues.push(`line ${banner.line}: ${banner.name} banner is out of canonical order`)
    previous = Math.max(previous, order)
  }

  for (const [index, banner] of foundBanners.entries()) {
    const nextLine = foundBanners[index + 1]?.line ?? Number.POSITIVE_INFINITY
    if (!lines.some(({ code, line }) => line > banner.line + 2 && line < nextLine && /^\[\[?/.test(code)))
      issues.push(`line ${banner.line}: ${banner.name} banner introduces no configuration tables`)
  }

  if (substantial) {
    if (foundBanners[0]?.name !== 'Foundation')
      issues.push('substantial .ki.toml must begin its declarations with the exact Foundation banner')
    if (foundBanners.length < 2)
      issues.push('substantial .ki.toml must use Foundation and at least one additional neighbourhood banner')
    if (firstTable && foundBanners[0] && foundBanners[0].line > firstTable.line)
      issues.push('the Foundation banner must precede [repo]')
  }

  return { substantial, issues }
}

const isHeading = (code: string): boolean => /^\[\[?/.test(code)

const isBannerOpening = (lines: readonly SourceLine[], index: number): boolean =>
  lines[index]?.raw.trim() === RULE &&
  CONFIGURATION_NEIGHBOURHOODS.some((name) => lines[index + 1]?.raw.trim() === `# ${name}`)

/** The first line of a heading's attached comment run, which the blank-line rule measures from. */
const attachedStart = (lines: readonly SourceLine[], index: number): number => {
  let start = index
  while (start > 0) {
    const previous = lines[start - 1] as SourceLine
    if (previous.code !== '' || !previous.raw.trim().startsWith('#') || previous.raw.trim() === RULE) break
    start--
  }
  return start
}

const arrayElements = (code: string): number => {
  try {
    const parsed = Bun.TOML.parse(`x = [${code}]`) as { x?: unknown }
    return Array.isArray(parsed.x) ? parsed.x.length : 1
  } catch {
    return 1
  }
}

/** Skill subtables whose keys are data: area codes, Agora names, check names, zones, sites, tiers and states. */
const DATA_MAPS = new Set([
  'ki-agora.*',
  'ki-binding.clients',
  'ki-engineering.checks',
  'ki-repo.checks',
  'ki-repo-kb.templates',
  'ki-repo-kb.zones',
  'ki-repo-website.sites',
  'ki-tokenomics.budgets',
  'ki-tokenomics.model_tier_bindings',
  'ki-work-github-issues.lifecycle',
  'ki-work-linear.lifecycle',
  'ki-work-roadmap.areas'
])

/** Territory tables stay outside the subtable rule while their model is under separate review. */
const EXEMPT_SUBTABLES = new Set(['ki-repo.territory', 'ki-trades.territory'])

const KEY = String.raw`(?:"([^"\\]+)"|'([^']+)'|([A-Za-z0-9_-]+))`
const SUBTABLE = new RegExp(String.raw`^\[\[?\s*skills\s*\.\s*${KEY}\s*\.\s*${KEY}`)

const subtableIssue = ({ code, line }: SourceLine): string | undefined => {
  const match = code.match(SUBTABLE)
  if (!match) return undefined
  const owner = match[1] ?? match[2] ?? match[3]
  const key = match[4] ?? match[5] ?? match[6]
  const path = `${owner}.${key}`
  if (DATA_MAPS.has(path) || DATA_MAPS.has(`${owner}.*`) || EXEMPT_SUBTABLES.has(path)) return undefined
  return `line ${line}: [skills.${path}] groups fields in a subtable; use a subtable only for a data map, and put fixed keys in [skills.${owner}]`
}

/**
 * Mechanical layout rules every `.ki.toml` shares: exactly one blank line before each table heading
 * and banner, arrays written one element per line with a trailing comma, and `[skills.ki-trades]` last
 * with `[skills.ki-agora]` opening Relationships, and skill subtables reserved for data maps.
 */
export const inspectConfigurationLayout = (text: string): readonly string[] => {
  const lines = sourceLines(text)
  const issues: string[] = []

  for (const [index, entry] of lines.entries()) {
    const heading = isHeading(entry.code)
    if (!heading && !isBannerOpening(lines, index)) continue
    const start = heading ? attachedStart(lines, index) : index
    if (start === 0) continue
    const blank = (at: number): boolean => lines[at]?.raw.trim() === ''
    if (!blank(start - 1) || (start > 1 && blank(start - 2)))
      issues.push(
        `line ${entry.line}: ${heading ? entry.code : 'neighbourhood banner'} must follow exactly one blank line`
      )
  }

  let open: SourceLine | undefined
  for (const entry of lines) {
    if (!open) {
      const match = entry.code.match(/^[^[=]+=\s*\[(.*)$/)
      if (!match) continue
      if ((match[1] as string).trim() === '') open = entry
      else issues.push(`line ${entry.line}: arrays must be multiline, one element per line with a trailing comma`)
      continue
    }
    if (entry.code === '' || entry.code === ']') {
      if (entry.code === ']') open = undefined
      continue
    }
    if (entry.code.endsWith(']')) {
      issues.push(`line ${entry.line}: the closing bracket of the array opened on line ${open.line} needs its own line`)
      open = undefined
    } else if (!entry.code.endsWith(',') || arrayElements(entry.code) > 1)
      issues.push(`line ${entry.line}: write each array element on its own line with a trailing comma`)
  }

  const tables = skillTables(lines)
  const firstTrades = tables.find((table) => table.owner === 'ki-trades')
  const afterTrades = firstTrades
    ? lines.find(
        ({ code, line }) =>
          line > firstTrades.line &&
          isHeading(code) &&
          skillTables([{ line, raw: code, code }])[0]?.owner !== 'ki-trades'
      )
    : undefined
  if (afterTrades) issues.push(`line ${afterTrades.line}: [skills.ki-trades] must be the last table in the file`)

  const relationships = lines.findIndex((_, index) => lines[index + 1]?.raw.trim() === '# Relationships')
  const agora = tables.find((table) => table.owner === 'ki-agora' && table.root)
  if (agora && relationships >= 0) {
    const first = lines.find(({ code, line }) => line > (lines[relationships]?.line ?? 0) && isHeading(code))
    if (first && first.line !== agora.line)
      issues.push(`line ${agora.line}: [skills.ki-agora] must be the first table under Relationships`)
  }

  for (const entry of lines) {
    const issue = isHeading(entry.code) ? subtableIssue(entry) : undefined
    if (issue) issues.push(issue)
  }

  return issues
}
