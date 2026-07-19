import type { AuditOutcome, ConformOutcome, RubricItem, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import type { AuthoringRubricContext, OwnedFile } from '../contexts/authoring.ts'

const ownedAudit = (context: AuthoringRubricContext, name: OwnedFile): RubricOutcomes<AuditOutcome> => {
  if (!context.exists) return [{ status: 'NOT_APPLICABLE', message: 'target does not exist', subject: name }]
  const state = context.owned(name)
  if (state === 'canonical') return [{ status: 'PASS', message: `${name} matches the house template`, subject: name }]
  return [
    {
      status: 'VIOLATION',
      message:
        state === 'missing'
          ? `${name} is missing — run ki:authoring:conform to scaffold it from the house template`
          : `${name} has drifted from the house template — run ki:authoring:conform to correct it`,
      subject: name
    }
  ]
}

const ownedConform = (context: AuthoringRubricContext, name: OwnedFile): RubricOutcomes<ConformOutcome> => {
  if (!context.exists) return [{ status: 'NOT_APPLICABLE', message: 'target does not exist', subject: name }]
  const result = context.syncOwned(name)
  if (result === 'canonical') return [{ status: 'PASS', message: `${name} already canonical`, subject: name }]
  return [
    {
      status: 'FIXED',
      message: `${name} ${result === 'scaffolded' ? 'scaffolded from the house template (was missing)' : context.dryRun ? 'would be overwritten' : 'overwritten'}${context.dryRun ? ' (dry run)' : ''}`,
      subject: name
    }
  ]
}

export const OWN_1: RubricItem<AuthoringRubricContext> = {
  code: 'OWN-1',
  title: 'owned authoring configuration matches the house templates',
  description:
    'The skill owns `.prettierrc.json`, `.editorconfig`, and `.markdownlint-cli2.jsonc` wholly (SHAPE-16 `owns:`): AUDIT warns on hash drift from the house templates, while CONFORM scaffolds missing files and overwrites drift.',
  sources: ['owns:'],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        const files: OwnedFile[] = ['.prettierrc.json', '.editorconfig', '.markdownlint-cli2.jsonc']
        const outcomes = files.flatMap((name) => ownedAudit(context, name))
        return [outcomes[0] as AuditOutcome, ...outcomes.slice(1)]
      }
    },
    conform: {
      phase: 'PRIMARY',
      run: (context) => {
        const files: OwnedFile[] = ['.prettierrc.json', '.editorconfig', '.markdownlint-cli2.jsonc']
        const outcomes = files.flatMap((name) => ownedConform(context, name))
        return [outcomes[0] as ConformOutcome, ...outcomes.slice(1)]
      }
    }
  }
}

export const OWNED = [OWN_1] as const
