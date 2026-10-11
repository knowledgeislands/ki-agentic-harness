import { existsSync, lstatSync, readFileSync } from 'node:fs'
import { basename, isAbsolute, join, relative, resolve } from 'node:path'
import type { RubricContextOptions, RubricPublicationContext, RubricSession } from '../../shared/rubric.ts'

const KEYS = ['tokens', 'guide', 'checks'] as const
const GUIDES_DIRECTORY = 'docs/guides'

/**
 * Literal colour values a design guide must not repeat: a hex colour, or a colour
 * function whose first argument is a number. A function built from custom
 * properties, such as `oklch(var(--l) var(--c) var(--h))`, names tokens and passes.
 * The hex pattern refuses a Markdown fragment such as `#add-a-calendar`.
 */
const LITERAL_COLOURS: readonly RegExp[] = [
  /(?<![\w(/#-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g,
  /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(\s*[+-]?(?:\d|\.\d)/g,
  /\bcolor\(\s*[a-z0-9-]+\s+[+-]?(?:\d|\.\d)/g
]

export type DesignDeclarationContext = {
  /** Problems with the `[skills.ki-design-system]` table itself, each naming the key at fault. */
  readonly issues: readonly string[]
  readonly tokens: readonly string[]
  readonly guide?: string
  readonly checks: readonly string[]
}

export type DesignFilesContext = {
  /** Declared token sources that are not regular files inside the repository. */
  readonly missingTokens: readonly string[]
  /** Why the declared guide is not a guide in an audience folder; empty when it is. */
  readonly guideIssues: readonly string[]
  readonly guideExists: boolean
  /** Declared check files that are not regular files inside the repository. */
  readonly missingChecks: readonly string[]
}

export type LiteralColour = {
  readonly line: number
  readonly value: string
}

export type DesignGuideContext = {
  /** Declared token sources the guide names neither by path nor by file name. */
  readonly unnamedTokens: readonly string[]
  readonly literalColours: readonly LiteralColour[]
}

export type DesignRubricContext = {
  readonly rubric: RubricPublicationContext
  readonly declaration: DesignDeclarationContext
  readonly files: DesignFilesContext
  readonly guide: DesignGuideContext
  readonly judgment: Record<never, never>
}

const isFile = (path: string): boolean =>
  existsSync(path) && !lstatSync(path).isSymbolicLink() && lstatSync(path).isFile()

const inside = (root: string, path: string): boolean => {
  const output = relative(root, resolve(root, path))
  return output !== '' && !isAbsolute(output) && output !== '..' && !output.startsWith('../')
}

const pathList = (key: string, value: unknown, issues: string[]): string[] => {
  if (value === undefined) {
    issues.push(`${key} is missing`)
    return []
  }
  if (!Array.isArray(value) || value.length === 0) {
    issues.push(`${key} must be a non-empty list of repository-relative paths`)
    return []
  }
  const paths: string[] = []
  for (const entry of value) {
    if (typeof entry !== 'string' || entry.trim() === '' || isAbsolute(entry)) {
      issues.push(`${key} entries must be repository-relative paths`)
      continue
    }
    paths.push(entry)
  }
  return paths
}

/** Reads the skill's `.ki.toml` table validate-down: every problem is reported, not just the first. */
export const parseDeclaration = (configuration: Readonly<Record<string, unknown>>): DesignDeclarationContext => {
  const issues: string[] = []
  for (const key of Object.keys(configuration))
    if (!(KEYS as readonly string[]).includes(key)) issues.push(`unrecognised key ${key}`)
  const tokens = pathList('tokens', configuration.tokens, issues)
  const checks = pathList('checks', configuration.checks, issues)
  const guideValue = configuration.guide
  let guide: string | undefined
  if (guideValue === undefined) issues.push('guide is missing')
  else if (typeof guideValue !== 'string' || guideValue.trim() === '' || isAbsolute(guideValue))
    issues.push('guide must be a repository-relative path')
  else guide = guideValue
  return { issues, tokens, guide, checks }
}

/** Each literal colour value in a guide, with its line number. */
export const literalColours = (content: string): LiteralColour[] => {
  const found: LiteralColour[] = []
  content.split('\n').forEach((text, index) => {
    for (const pattern of LITERAL_COLOURS)
      for (const match of text.matchAll(pattern)) found.push({ line: index + 1, value: match[0] })
  })
  return found
}

const guideIssues = (root: string, guide: string | undefined): string[] => {
  if (guide === undefined) return ['declare the design guide as `guide`']
  if (!inside(root, guide)) return [`${guide} is outside the repository`]
  const issues: string[] = []
  const output = relative(root, resolve(root, guide)).split(/[\\/]/).join('/')
  if (!output.endsWith('.md')) issues.push(`${guide} is not a Markdown file`)
  if (!output.startsWith(`${GUIDES_DIRECTORY}/`)) issues.push(`${guide} is not below ${GUIDES_DIRECTORY}/`)
  else if (output.split('/').length < 4) issues.push(`${guide} is not in an audience folder below ${GUIDES_DIRECTORY}/`)
  if (!isFile(join(root, output))) issues.push(`${guide} is not a regular file`)
  return issues
}

export const createDesignSession = ({
  repository,
  configuration,
  publication
}: RubricContextOptions): RubricSession<DesignRubricContext> => {
  const root = resolve(repository)
  const declaration = parseDeclaration(configuration)
  const present = (path: string): boolean => inside(root, path) && isFile(join(root, path))
  const issues = guideIssues(root, declaration.guide)
  const guideExists = declaration.guide !== undefined && present(declaration.guide)
  const content = guideExists ? readFileSync(join(root, declaration.guide as string), 'utf8') : ''
  const names = (path: string): boolean => content.includes(path) || content.includes(basename(path))

  const context: DesignRubricContext = {
    rubric: { publication },
    declaration,
    files: {
      missingTokens: declaration.tokens.filter((path) => !present(path)),
      guideIssues: issues,
      guideExists,
      missingChecks: declaration.checks.filter((path) => !present(path))
    },
    guide: {
      unnamedTokens: guideExists ? declaration.tokens.filter((path) => !names(path)) : [],
      literalColours: guideExists ? literalColours(content) : []
    },
    judgment: {}
  }

  return {
    subjects: [
      { families: ['RUBRIC'], context: () => context },
      { families: ['DSYS'], context: () => context }
    ],
    proposal: () => ({ writes: [] })
  }
}
