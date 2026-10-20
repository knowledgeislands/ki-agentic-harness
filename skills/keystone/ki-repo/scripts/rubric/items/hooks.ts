import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import { COMMIT_MSG_HOOK, HOOK_BINDING, type HooksRubricContext, PRE_COMMIT_HOOK } from '../contexts/hooks.ts'
import type { RepoRubricContext } from '../contexts/repository.ts'

const SOURCE = 'standards-repository.md'

const HOOK_1: RubricItem<HooksRubricContext> = {
  code: 'HOOK-1',
  title: 'Committed commit gate',
  description: `A tracked, executable \`${PRE_COMMIT_HOOK}\` exists, unless the repository's primary shape declares no hook.`,
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance: `Copy the shape's canonical \`pre-commit\` from its \`assets/githooks/\`, mark it executable, commit it, then bind it with \`${HOOK_BINDING}\`.`
    },
    audit: { phase: 'INSPECT', run: (context) => context.hook1 }
  }
}

const HOOK_2: RubricItem<HooksRubricContext> = {
  code: 'HOOK-2',
  title: 'Commit gate bound',
  description:
    'The effective `core.hooksPath` of the audited working tree resolves to `.githooks`, so the committed gate runs on every commit; Husky’s `.husky/_` is named as the common wrong value.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: { class: 'diagnostic', guidance: `Run \`${HOOK_BINDING}\` in the clone, then rerun the audit.` },
    audit: { phase: 'INSPECT', run: (context) => context.hook2 }
  }
}

const HOOK_3: RubricItem<HooksRubricContext> = {
  code: 'HOOK-3',
  title: 'Committed commit-message gate',
  description: `A tracked, executable \`${COMMIT_MSG_HOOK}\` exists wherever a commit gate is: Commitlint where a package exists, \`ki git check-message\` where none does.`,
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance: `Copy the shape's canonical \`commit-msg\` from its \`assets/githooks/\`, mark it executable and commit it, then rerun the audit.`
    },
    audit: { phase: 'INSPECT', run: (context) => context.hook3 }
  }
}

const HOOK_4: RubricItem<HooksRubricContext> = {
  code: 'HOOK-4',
  title: 'Hook is the canonical text',
  description:
    'Each committed hook is, byte for byte, the canonical hook `ki-repo` composes for the primary shape and package presence: the frame, with its empty-index exit and missing-tool refusal, then the shape skills’ blocks in a fixed order, with no extension point. Without a resolvable shape only the frame is judged.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Copy the hook named in the finding from the shape skill’s `assets/githooks/<package|no-package>/` byte-exact; move any repository-specific check into a shape-skill criterion run by the focused staged audit.'
    },
    audit: { phase: 'INSPECT', run: (context) => context.hook4 }
  }
}

const HOOK_5: RubricItem<HooksRubricContext> = {
  code: 'HOOK-5',
  title: 'Husky retired',
  description:
    'No tracked `.husky/` path, `husky` dependency, Husky call in `prepare` or hook delegating to `.husky/` remains; locally, no untracked `.husky/_` install is left behind.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance: `Move the hook content into \`.githooks/\`, set \`prepare\` to \`${HOOK_BINDING}\`, remove \`husky\` and \`.husky/\`, rebind the clone and remove \`.husky/_\`.`
    },
    audit: { phase: 'INSPECT', run: (context) => context.hook5 }
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
  description: 'Existence, binding and canonical text of the committed hooks, composed from the shape skills’ blocks.',
  standard: SOURCE,
  selectContext: (context) => context.hooks,
  items: [HOOK_1, HOOK_2, HOOK_3, HOOK_4, HOOK_5, HOOK_J1]
}
