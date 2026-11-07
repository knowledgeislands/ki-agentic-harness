import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { type AnalysisIssue, isAnalysisDocument, validateAnalysis } from '../../internal/analysis.ts'
import type { RubricContextOptions, RubricPublicationContext, RubricSession } from '../../shared/rubric.ts'

/** One analysis found in the repository, with what the validator found in it. */
export type DiscoveredAnalysis = {
  readonly path: string
  readonly issues: readonly AnalysisIssue[]
}

export type ExchangeDynamicsContext = {
  readonly configurationKeys: readonly string[]
  readonly analyses: () => readonly DiscoveredAnalysis[]
  readonly rubric: RubricPublicationContext
}

const ANALYSIS_FILE = 'analysis.json'

const analysisFiles = (root: string, directory = root): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') return []
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return analysisFiles(root, path)
    return entry.isFile() && entry.name === ANALYSIS_FILE ? [path] : []
  })

/** Find every committed exchange dynamics analysis beneath the repository root and validate it. */
export const discoverAnalyses = (repository: string): readonly DiscoveredAnalysis[] =>
  analysisFiles(repository).flatMap((path) => {
    let document: unknown
    try {
      document = JSON.parse(readFileSync(path, 'utf8'))
    } catch {
      return []
    }
    if (!isAnalysisDocument(document)) return []
    const exchange = (document as { exchange: { source?: unknown } }).exchange
    const sourcePath = typeof exchange.source === 'string' ? join(dirname(path), exchange.source) : undefined
    const source = sourcePath && existsSync(sourcePath) ? readFileSync(sourcePath, 'utf8') : undefined
    const issues = validateAnalysis(document, { source })
    return [
      {
        path: relative(repository, path),
        issues:
          sourcePath && source === undefined
            ? [...issues, { path: '$.exchange.source', message: 'names a source that does not exist' }]
            : issues
      }
    ]
  })

export const createExchangeDynamicsSession = ({
  repository,
  configuration,
  publication
}: RubricContextOptions): RubricSession<ExchangeDynamicsContext> => {
  let analyses: readonly DiscoveredAnalysis[] | undefined
  const context: ExchangeDynamicsContext = {
    configurationKeys: Object.keys(configuration).sort(),
    analyses: () => {
      analyses ??= discoverAnalyses(repository)
      return analyses
    },
    rubric: { publication }
  }
  return {
    subjects: [
      { families: ['CONFIG'], context: () => context },
      { families: ['ANALYSIS'], context: () => context },
      { families: ['SAFE'], context: () => context },
      { families: ['RENDER'], context: () => context },
      { families: ['RUBRIC'], context: () => context }
    ],
    proposal: () => ({ writes: [] })
  }
}
