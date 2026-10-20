import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { AssembledToolsContext } from '../contexts/assembled.ts'
import type { ToolsRubricContext } from '../contexts/tools.ts'

const STANDARD = 'standards-tool-repositories.md'

const ASSEMBLE_1: RubricItem<AssembledToolsContext> = {
  code: 'ASSEMBLE-1',
  title: 'Assembled artefact matches its sources',
  description:
    'Each artefact declared under `[[skills.ki-repo-tools.assembled]]` passes its repository-owned check, run from the repository root without a shell, so a committed artefact never drifts from the sources it is assembled from. The finding is reported against the artefact and each source, so the focused staged audit in the commit gate catches a source staged without its reassembled artefact. Not applicable where nothing is declared.',
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
