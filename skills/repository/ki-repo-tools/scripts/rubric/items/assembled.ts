import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { AssembledToolsContext } from '../contexts/assembled.ts'
import type { ToolsRubricContext } from '../contexts/tools.ts'

const STANDARD = 'standards-tool-repositories.md'

const ASSEMBLE_1: RubricItem<AssembledToolsContext> = {
  code: 'ASSEMBLE-1',
  title: 'Assembled artefact matches its sources',
  description:
    'Each artefact declared under `[[skills.ki-repo-tools.assembled]]` passes its git-tracked executable check, contained in the repository after resolving symlinks and run without a shell under a 60-second timeout in a disposable checkout of the Git index. The declaration, checker, artefact and sources are read from that same index, so unstaged edits cannot conceal a staged mismatch. Findings cover the declaration, checker, artefact and each source for the focused staged audit. Not applicable where nothing is declared.',
  sources: [STANDARD],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Reassemble the artefact with the repository’s own command, stage it with its sources, then rerun the audit.'
    },
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        if (!context.applicable)
          return [
            {
              status: 'NOT_APPLICABLE',
              message: 'ki-repo-tools is not applicable: its repository declaration is absent.'
            }
          ]
        const outcomes = context.inspect()
        return outcomes.length
          ? outcomes
          : [{ status: 'NOT_APPLICABLE', message: 'The repository declares no assembled artefact.' }]
      }
    }
  }
}

export const ASSEMBLE: RubricFamily<ToolsRubricContext, AssembledToolsContext> = {
  code: 'ASSEMBLE',
  title: 'assembled artefacts',
  description: 'Committed artefacts assembled from repository sources.',
  standard: STANDARD,
  selectContext: (context) => context.assembled,
  items: [ASSEMBLE_1]
}
