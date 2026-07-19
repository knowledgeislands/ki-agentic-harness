import type { AuditOutcome, ConformOutcome, RubricItem, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import type { AuthoringRubricContext, OwnedFile } from '../contexts/authoring.ts'

const markdownAudit = (context: AuthoringRubricContext): RubricOutcomes<AuditOutcome> => {
  if (!context.exists) return [{ status: 'VIOLATION', message: 'audit target is missing or does not exist', subject: context.target }]
  const result = context.markdownAudit()
  return result.clean
    ? [{ status: 'PASS', message: 'Prettier + markdownlint clean', subject: context.target }]
    : [
        {
          status: 'VIOLATION',
          message: `Markdown mechanical check failed — run "bun run ki:authoring:conform" to fix${result.detail ? `\n    ${result.detail}` : ''}`,
          subject: context.target
        }
      ]
}

const markdownConform = (context: AuthoringRubricContext): RubricOutcomes<ConformOutcome> => {
  if (!context.exists) return [{ status: 'VIOLATION', message: 'conform target does not exist', subject: context.target }]
  const clean = context.markdownConform()
  if (clean)
    return [
      {
        status: 'PASS',
        message: `Markdown ${context.dryRun ? 'already conforms' : 'conformed'} (Prettier + markdownlint-cli2)`,
        subject: context.target
      }
    ]
  return [
    {
      status: 'VIOLATION',
      ...(context.dryRun ? { level: 'WARN' as const } : {}),
      message: `Markdown ${context.dryRun ? 'has findings — run without --dry-run to fix' : 'conform pass reported issues'}`,
      subject: context.target
    }
  ]
}

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

export const MD_MECH: RubricItem<AuthoringRubricContext> = {
  code: 'MD-mech',
  title: 'Markdown mechanical gate passes',
  description:
    '`ki:authoring:audit` passes: prose is unwrapped; bullet and quote characters, heading hierarchy, a single H1, spacing, table alignment, resolved links and references, no bare URLs, and descriptive link text satisfy Prettier and markdownlint-cli2, which run directly inside the audit.',
  sources: ['standards/markdown.md'],
  mechanical: {
    level: 'FAIL',
    overrideLevels: ['WARN'],
    audit: { phase: 'INSPECT', run: markdownAudit },
    conform: { phase: 'NORMALISE', run: markdownConform }
  }
}

export const MD_TABLE: RubricItem<AuthoringRubricContext> = {
  code: 'MD-table',
  title: 'wide tables are reshaped',
  description:
    'A table with rows that would exceed `printWidth` (140 chars) is reshaped into subheadings or a bulleted definition list; genuinely tabular data with one long column keeps the table and moves that column to footnotes below it.',
  sources: ['standards/markdown.md'],
  judgment: { prompt: 'Are wide or prose-heavy tables reshaped according to the Markdown convention?' }
}

export const MD_FOOTNOTE: RubricItem<AuthoringRubricContext> = {
  code: 'MD-footnote',
  title: 'table footnotes use the house marker series',
  description:
    'Footnotes use the marker series `† ‡ § ¶ ‖` (then doubled), reset per table, with a distinct second series `※ ❡ ¤ ¥` where needed; each footnote is a separate paragraph.',
  sources: ['standards/markdown.md'],
  judgment: { prompt: 'Do table footnotes use the documented marker series and paragraph layout?' }
}

export const MD_LINK: RubricItem<AuthoringRubricContext> = {
  code: 'MD-link',
  title: 'house-file links are descriptive and portable',
  description:
    'House-file links are descriptive relative Markdown links rather than wikilinks; paths with spaces use angle brackets. KB note content and agent prompts remain explicitly scoped exceptions.',
  sources: ['standards/markdown.md'],
  judgment: { prompt: 'Are the links descriptive, relative Markdown links where this convention applies?' }
}

export const MD_CELL_PROSE: RubricItem<AuthoringRubricContext> = {
  code: 'MD-cell-prose',
  title: 'tables avoid descriptive prose in cells',
  description: 'Tables avoid long descriptive prose in cells — that is the footnote’s job.',
  sources: ['standards/markdown.md'],
  judgment: { prompt: 'Do table cells avoid long descriptive prose?' }
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

export const TOML_KEYS: RubricItem<AuthoringRubricContext> = {
  code: 'TOML-keys',
  title: 'TOML keys are concise lowercase nouns',
  description:
    'Keys are lowercase, use `snake_case` for multiple words, and name the noun their value holds (`visibility`, not `repo_visibility_setting`).',
  sources: ['standards/toml.md'],
  judgment: { prompt: 'Are TOML keys concise lowercase nouns, using snake_case for multiple words?' }
}

export const TOML_VALUES: RubricItem<AuthoringRubricContext> = {
  code: 'TOML-values',
  title: 'TOML values use the house formatting',
  description: 'Strings are double-quoted and short lists remain inline (`["a", "b"]`).',
  sources: ['standards/toml.md'],
  judgment: { prompt: 'Do TOML strings and short lists follow the house formatting?' }
}

export const TOML_TABLES: RubricItem<AuthoringRubricContext> = {
  code: 'TOML-tables',
  title: 'TOML uses one table per skill',
  description:
    'One table appears per skill, named for that skill, with subtables nested under it; `ki-repo` owns the `.ki-config.toml` contract behind this convention.',
  sources: ['standards/toml.md'],
  judgment: { prompt: 'Does the TOML use one table per skill with nested subtables where appropriate?' }
}

export const TOML_COMMENTS: RubricItem<AuthoringRubricContext> = {
  code: 'TOML-comments',
  title: 'non-obvious TOML keys explain their rationale',
  description: 'Non-obvious keys carry a preceding `#` comment explaining why they exist.',
  sources: ['standards/toml.md'],
  judgment: { prompt: 'Do non-obvious TOML keys carry a preceding rationale comment?' }
}

export const SYNC_1: RubricItem<AuthoringRubricContext> = {
  code: 'SYNC-1',
  title: 'conventions, rubric, and source record agree',
  description: 'The convention references, this rubric, and `sources.md` agree; when a convention moves, all three move together.',
  sources: ['sources.md'],
  judgment: { prompt: 'Do the convention references, rubric publication, and source record agree?' }
}
