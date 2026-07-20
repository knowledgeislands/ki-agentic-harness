import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'

const DEFAULT_DIR = 'docs/features'
const INDEX_FILE = 'index.md'
const RFC2119 = /\b(MUST NOT|MUST|SHALL NOT|SHALL|SHOULD NOT|SHOULD|MAY|REQUIRED|RECOMMENDED|NOT RECOMMENDED|OPTIONAL)\b/
const REQUIREMENT_HEADING = /^###\s+([A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*)-(\d{3,})\s+—\s+(.+?)\s*$/
const H3 = /^###\s+(.+?)\s*$/
const NEAR_MISS_HEADING = /^###\s+([A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*-\d{3,})\s*(?:[–—-]{1,2})\s*(\S.*?)\s*$/

export type FeatureRequirement = {
  file: string
  id: string
  prefix: string
  owner?: string
  duplicateOf?: string
  deprecated: boolean
  hasNormativeKeyword: boolean
  hasVerify: boolean
}

export type FeatureHeadingIssue = {
  file: string
  heading: string
  canonical?: string
}

export type FeatureDefinitionsContext = {
  directory: string
  dryRun: boolean
  exists: boolean
  indexExists: boolean
  prefixToFile: ReadonlyMap<string, string>
  registeredMissingFiles: readonly { prefix: string; file: string }[]
  unregisteredFiles: readonly string[]
  headingIssues: readonly FeatureHeadingIssue[]
  requirements: readonly FeatureRequirement[]
  normaliseHeadings: () => readonly FeatureHeadingIssue[]
}

const splitRow = (line: string): string[] | null => {
  if (!/^\s*\|/.test(line)) return null
  return line
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim())
}

const parseAreasTables = (indexContent: string): Map<string, string> => {
  const prefixToFile = new Map<string, string>()
  let prefixColumn = -1
  let fileColumn = -1
  for (const line of indexContent.split('\n')) {
    const cells = splitRow(line)
    if (!cells) {
      if (line.trim() === '') {
        prefixColumn = -1
        fileColumn = -1
      }
      continue
    }
    const nextPrefix = cells.findIndex((cell) => /^prefix$/i.test(cell.replace(/`/g, '')))
    const nextFile = cells.findIndex((cell) => /^file$/i.test(cell.replace(/`/g, '')))
    if (nextPrefix >= 0 && nextFile >= 0) {
      prefixColumn = nextPrefix
      fileColumn = nextFile
      continue
    }
    if (prefixColumn < 0 || fileColumn < 0 || /^[-: ]+$/.test(cells.join(''))) continue
    const prefixCell = cells[prefixColumn]?.replace(/`/g, '').trim() ?? ''
    const fileCell = (cells[fileColumn] ?? '')
      .replace(/[`[\]]/g, '')
      .replace(/\(.*?\)/, '')
      .trim()
    if (!prefixCell || !fileCell) continue
    for (const prefix of prefixCell
      .split(/[·,/]|\s+/)
      .map((value) => value.trim())
      .filter(Boolean))
      prefixToFile.set(prefix, fileCell)
  }
  return prefixToFile
}

const resolveFeaturesDirectory = (target: string): string => {
  const absolute = resolve(target)
  const nested = join(absolute, DEFAULT_DIR)
  if (existsSync(nested)) return nested
  if (basename(absolute) === 'features' || existsSync(join(absolute, INDEX_FILE))) return absolute
  return nested
}

export const createFeatureDefinitionsContextFactory = ({
  target,
  dryRun = false
}: {
  target: string
  dryRun?: boolean
}): (() => FeatureDefinitionsContext) => {
  const directory = resolveFeaturesDirectory(target)
  return () => {
    const exists = existsSync(directory) && statSync(directory).isDirectory()
    const entries = exists ? readdirSync(directory) : []
    const indexExists = entries.includes(INDEX_FILE)
    const indexContent = indexExists ? readFileSync(join(directory, INDEX_FILE), 'utf8') : ''
    const prefixToFile = parseAreasTables(indexContent)
    const areaFiles = entries.filter((file) => file.endsWith('.md') && file !== INDEX_FILE).sort()
    const registeredFiles = new Set(prefixToFile.values())
    const registeredMissingFiles = [...prefixToFile]
      .filter(([, file]) => !entries.includes(file))
      .map(([prefix, file]) => ({ prefix, file }))
    const unregisteredFiles = areaFiles.filter((file) => !registeredFiles.has(file))
    const headingIssues: FeatureHeadingIssue[] = []
    const requirements: FeatureRequirement[] = []
    const seenIds = new Map<string, string>()

    for (const file of areaFiles) {
      const lines = readFileSync(join(directory, file), 'utf8').split('\n')
      let inGaps = false
      const fileRequirements: Array<{
        index: number
        id: string
        prefix: string
        title: string
        owner?: string
        duplicateOf?: string
      }> = []
      for (const [index, line] of lines.entries()) {
        const h2 = line.match(/^##\s+(.+?)\s*$/)
        if (h2) {
          inGaps = /^gaps\b/i.test((h2[1] as string).trim())
          continue
        }
        if (inGaps) continue
        const h3 = line.match(H3)
        if (!h3) continue
        const requirement = line.match(REQUIREMENT_HEADING)
        if (!requirement) {
          const near = line.match(NEAR_MISS_HEADING)
          headingIssues.push({ file, heading: h3[1] as string, ...(near ? { canonical: `### ${near[1]} — ${near[2]}` } : {}) })
          continue
        }
        const [, prefix, serial, title] = requirement
        const id = `${prefix}-${serial}`
        const duplicateOf = seenIds.get(id)
        if (!duplicateOf) seenIds.set(id, file)
        fileRequirements.push({ index, id, prefix, title, owner: prefixToFile.get(prefix), ...(duplicateOf ? { duplicateOf } : {}) })
      }
      for (const [position, requirement] of fileRequirements.entries()) {
        const block = lines.slice(requirement.index + 1, fileRequirements[position + 1]?.index ?? lines.length).join('\n')
        requirements.push({
          file,
          id: requirement.id,
          prefix: requirement.prefix,
          ...(requirement.owner ? { owner: requirement.owner } : {}),
          ...(requirement.duplicateOf ? { duplicateOf: requirement.duplicateOf } : {}),
          deprecated: /deprecated/i.test(requirement.title) || /^~~/.test(requirement.title.trim()),
          hasNormativeKeyword: RFC2119.test(block),
          hasVerify: /_Verify:_/.test(block)
        })
      }
    }

    return {
      directory,
      dryRun,
      exists,
      indexExists,
      prefixToFile,
      registeredMissingFiles,
      unregisteredFiles,
      headingIssues,
      requirements,
      normaliseHeadings: () => {
        const fixed = headingIssues.filter((issue) => issue.canonical)
        if (dryRun) return fixed
        for (const file of new Set(fixed.map((issue) => issue.file))) {
          const path = join(directory, file)
          const replacements = new Map(
            fixed.filter((issue) => issue.file === file).map((issue) => [`### ${issue.heading}`, issue.canonical as string])
          )
          const content = readFileSync(path, 'utf8')
          writeFileSync(
            path,
            content
              .split('\n')
              .map((line) => replacements.get(line) ?? line)
              .join('\n')
          )
        }
        return fixed
      }
    }
  }
}
