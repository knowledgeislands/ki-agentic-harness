import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { LiveArtifactsContext } from '../contexts/live-artifacts.ts'

const SOURCE = ['standards.md'] as const

export const LA_S_1: RubricItem<LiveArtifactsContext> = {
  code: 'LA-S-1',
  title: 'artifact index',
  description: 'The index note exists when artifact sources are present.',
  sources: SOURCE,
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        if (!context.artifactsDirectoryExists) return [{ status: 'NOT_APPLICABLE', message: 'The live artifacts directory is absent.' }]
        if (context.sources.length === 0) return [{ status: 'NOT_APPLICABLE', message: 'No artifact sources exist.' }]
        return context.indexText === null
          ? [{ status: 'VIOLATION', message: 'The live artifacts index note is absent.', subject: context.indexRelativePath }]
          : [
              {
                status: 'PASS',
                message: `The index note is present for ${context.sources.length} source(s).`,
                subject: context.indexRelativePath
              }
            ]
      }
    },
    conform: { phase: 'PRIMARY', run: (context) => context.conformIndex() }
  }
}

export const LA_S_2: RubricItem<LiveArtifactsContext> = {
  code: 'LA-S-2',
  title: 'published sources',
  description: 'Every Markdown artifact has a same-stem HTML render.',
  sources: SOURCE,
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        if (!context.artifactsDirectoryExists) return [{ status: 'NOT_APPLICABLE', message: 'The live artifacts directory is absent.' }]
        if (context.sources.length === 0) return [{ status: 'NOT_APPLICABLE', message: 'No artifact sources exist.' }]
        const missing = context.sources
          .filter((source) => !context.htmlPaths.has(source.htmlPath))
          .map((source) => ({
            status: 'VIOLATION' as const,
            message: 'No matching .html render exists; the artifact is unpublished.',
            subject: source.relativePath
          }))
        return missing.length > 0
          ? (missing as [(typeof missing)[number], ...(typeof missing)[number][]])
          : [{ status: 'PASS', message: 'Every artifact source has an HTML render.' }]
      }
    },
    conform: { phase: 'PRIMARY', run: () => [{ status: 'INFO', message: 'Rendering Markdown to HTML requires an authoring decision.' }] }
  }
}

export const LA_S_3: RubricItem<LiveArtifactsContext> = {
  code: 'LA-S-3',
  title: 'orphaned renders',
  description: 'Every HTML render has a same-stem Markdown source.',
  sources: SOURCE,
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        if (!context.artifactsDirectoryExists) return [{ status: 'NOT_APPLICABLE', message: 'The live artifacts directory is absent.' }]
        const expected = new Set(context.sources.map((source) => source.htmlPath))
        const orphans = [...context.htmlPaths]
          .filter((path) => !expected.has(path))
          .map((path) => ({
            status: 'VIOLATION' as const,
            message: 'The .html render has no matching .md source.',
            subject: path.slice(context.target.length + 1)
          }))
        return orphans.length > 0
          ? (orphans as [(typeof orphans)[number], ...(typeof orphans)[number][]])
          : [{ status: 'PASS', message: 'No orphaned HTML renders exist.' }]
      }
    },
    conform: { phase: 'PRIMARY', run: () => [{ status: 'INFO', message: 'Deleting or creating a render requires author confirmation.' }] }
  }
}

export const LA_S_4: RubricItem<LiveArtifactsContext> = {
  code: 'LA-S-4',
  title: 'render freshness',
  description: 'Each HTML render is no older than the configured threshold behind its Markdown source.',
  sources: SOURCE,
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'DERIVED',
      run: (context) => {
        if (!context.artifactsDirectoryExists || context.sources.length === 0)
          return [{ status: 'NOT_APPLICABLE', message: 'No artifact pairs are available for freshness checks.' }]
        const stale = context.sources.flatMap((source) => {
          if (source.htmlMtimeMs === null) return []
          const difference = (source.mtimeMs - source.htmlMtimeMs) / (1000 * 60 * 60)
          return difference > context.thresholdHours
            ? [
                {
                  status: 'VIOLATION' as const,
                  message: `.html is ${Math.round(difference)}h behind .md (threshold: ${context.thresholdHours}h).`,
                  subject: source.relativePath
                }
              ]
            : []
        })
        return stale.length > 0
          ? (stale as [(typeof stale)[number], ...(typeof stale)[number][]])
          : [{ status: 'PASS', message: 'Every rendered pair is within the freshness threshold.' }]
      }
    },
    conform: { phase: 'DERIVED', run: () => [{ status: 'INFO', message: 'Regenerating a stale render requires an authoring decision.' }] }
  }
}

export const LA_J_1: RubricItem<LiveArtifactsContext> = {
  code: 'LA-J-1',
  title: 'useful index descriptions',
  description: 'The index accurately lists active artifacts with useful one-line descriptions.',
  sources: SOURCE,
  judgment: { prompt: 'Does the index accurately list every active artifact with a useful one-line description?' }
}
export const LA_J_2: RubricItem<LiveArtifactsContext> = {
  code: 'LA-J-2',
  title: 'Markdown authority',
  description: 'Markdown is the authoritative source and no content exists only in HTML.',
  sources: SOURCE,
  judgment: { prompt: 'Is each Markdown artifact authoritative, with no essential content present only in its HTML render?' }
}
export const LA_J_3: RubricItem<LiveArtifactsContext> = {
  code: 'LA-J-3',
  title: 'archive rationale',
  description: 'Archived artifacts retain when-and-why context rather than disappearing silently.',
  sources: SOURCE,
  judgment: { prompt: 'Do archived artifacts retain a clear when-and-why rationale rather than disappearing silently?' }
}
export const LA_J_4: RubricItem<LiveArtifactsContext> = {
  code: 'LA-J-4',
  title: 'stable artifact names',
  description: 'Artifact names are descriptive and stable for published links.',
  sources: SOURCE,
  judgment: { prompt: 'Are artifact names descriptive and stable enough to preserve published links?' }
}

export const LA_STRUCTURE = [LA_S_1, LA_S_2, LA_S_3, LA_S_4, LA_J_1, LA_J_2, LA_J_3, LA_J_4] as const
