import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import { HOOK_BINDING, type HooksRubricContext, PRE_COMMIT_HOOK } from '../contexts/hooks.ts'
import type { RepoRubricContext } from '../contexts/repository.ts'

const SOURCE = 'standards-repository.md'

const HOOK_1: RubricItem<HooksRubricContext> = {
  code: 'HOOK-1',
  title: 'Committed commit gate',
  description: `A tracked, executable \`${PRE_COMMIT_HOOK}\` exists; what it runs belongs to the repository's shape skills.`,
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance: `Commit an executable \`${PRE_COMMIT_HOOK}\` that runs the repository's check-only gate, then bind it with \`${HOOK_BINDING}\`.`
    },
    audit: { phase: 'INSPECT', run: (context) => context.hook1 }
  }
}

const HOOK_2: RubricItem<HooksRubricContext> = {
  code: 'HOOK-2',
  title: 'Commit gate bound',
  description: 'The clone’s `core.hooksPath` resolves to `.githooks`, so the committed gate runs on every commit.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: { class: 'diagnostic', guidance: `Run \`${HOOK_BINDING}\` in the clone, then rerun the audit.` },
    audit: { phase: 'INSPECT', run: (context) => context.hook2 }
  }
}

const HOOK_J1: RubricItem<HooksRubricContext> = {
  code: 'HOOK-J1',
  title: 'Stated gate matches the hook',
  description: 'The gate root orientation tells a writer to run matches what the committed pre-commit hook runs.',
  sources: [SOURCE],
  judgment: {
    scope: `Root orientation (\`AGENTS.md\`, \`README.md\`) and \`${PRE_COMMIT_HOOK}\`.`,
    prompt:
      'Compare the checks root orientation says run before a commit with the commands the committed hook runs, including any hook it delegates to.',
    outcomes: ['conforming', 'gap', 'exclusion'],
    guidance: 'Align the orientation or the hook, or record why a stated check cannot run at commit time.'
  }
}

export const HOOK: RubricFamily<RepoRubricContext, HooksRubricContext> = {
  code: 'HOOK',
  title: 'Commit gate',
  description: 'Existence and binding of the committed pre-commit gate; its content belongs to shape skills.',
  standard: SOURCE,
  selectContext: (context) => context.hooks,
  items: [HOOK_1, HOOK_2, HOOK_J1]
}
