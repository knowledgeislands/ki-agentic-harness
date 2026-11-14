import { KEYSTONE as KEYSTONE_GUILD } from '../../internal/guild-map.ts'
import {
  type AuditOutcome,
  judgment,
  type RubricFamily,
  type RubricItem,
  type RubricOutcomes
} from '../../shared/rubric.ts'
import type { KeystoneContext } from '../contexts/keystone.ts'

const JOINING = 'standard-keystone.md#41-the-joining-rule'
const LEADS = 'standard-keystone.md#42-one-lead-for-each-guild'
const MAP = 'standard-keystone.md#43-the-guild-map'
const START = 'standard-keystone.md#44-where-a-session-starts'
const GUILDS = '../../ki-skills/references/standard-guilds.md'

const notOrganised = (context: KeystoneContext): RubricOutcomes<AuditOutcome> | null =>
  context.skills.length === 0
    ? [{ status: 'NOT_APPLICABLE', message: 'the repository holds no skill collection under `skills/`' }]
    : context.organised
      ? null
      : [{ status: 'NOT_APPLICABLE', message: 'no skill in the collection declares a guild' }]

const KEYSTONE_1: RubricItem<KeystoneContext> = {
  code: 'KEYSTONE-1',
  title: 'every skill in the collection declares its guild',
  description:
    'Once any skill in the repository’s `skills/` collection declares a guild, every skill there declares one, `ki-guild: <guild>`, so the guild tree is read from frontmatter and never from the folder a skill is stored in.',
  sources: [`${GUILDS}#44-membership`, LEADS],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Add `ki-guild: <guild>` to each named skill, choosing the guild whose purpose it serves, then rerun the audit.'
    },
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        const inactive = notOrganised(context)
        if (inactive) return inactive
        const missing = context.skills.filter((skill) => skill.guild === undefined)
        return missing.length === 0
          ? [{ status: 'PASS', message: `all ${context.skills.length} skills declare their guild` }]
          : missing.map((skill) => ({
              status: 'VIOLATION' as const,
              message: `${skill.name} declares no \`ki-guild\``,
              subject: skill.path
            }))
      }
    }
  }
}

const KEYSTONE_2: RubricItem<KeystoneContext> = {
  code: 'KEYSTONE-2',
  title: 'every guild has one lead, a member of Keystone',
  description:
    'Every guild a skill declares or leads has exactly one lead, which declares `ki-leads: <guild>`, and every lead is a member of Keystone, `ki-guild: keystone`.',
  sources: [LEADS, `${GUILDS}#41-what-a-guild-is`],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Give each guild one lead skill named after it, declaring `ki-guild: keystone` and `ki-leads: <guild>`, and remove `ki-leads` from any second lead, then rerun the audit.'
    },
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        const inactive = notOrganised(context)
        if (inactive) return inactive
        const problems: AuditOutcome[] = []
        for (const guild of context.guilds) {
          if (guild.leads.length === 0)
            problems.push({ status: 'VIOLATION', message: `guild ${guild.name} has no lead`, subject: guild.name })
          if (guild.leads.length > 1)
            problems.push({
              status: 'VIOLATION',
              message: `guild ${guild.name} has more than one lead: ${guild.leads.join(', ')}`,
              subject: guild.name
            })
        }
        for (const skill of context.skills)
          if (skill.leads !== undefined && skill.guild !== KEYSTONE_GUILD)
            problems.push({
              status: 'VIOLATION',
              message: `${skill.name} leads ${skill.leads} but is not a member of ${KEYSTONE_GUILD}`,
              subject: skill.path
            })
        return problems.length === 0
          ? [{ status: 'PASS', message: `each of ${context.guilds.length} guilds has one lead in Keystone` }]
          : problems
      }
    }
  }
}

const KEYSTONE_3: RubricItem<KeystoneContext> = {
  code: 'KEYSTONE-3',
  title: 'the guild map is generated from frontmatter',
  description:
    'Where a skill leads Keystone, its SKILL.md holds one guild map between the `ki-keystone:guild-map` markers, and the map is exactly the one rendered from every skill’s `ki-guild` and `ki-leads`.',
  sources: [MAP],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Regenerate the guild map with `ki dev skill generate ki-keystone`, or restore the one pair of markers it is written between, then rerun the audit.'
    },
    audit: {
      phase: 'DERIVED',
      run: (context) => {
        const inactive = notOrganised(context)
        if (inactive) return inactive
        const { map } = context
        if (map.state === 'absent')
          return [{ status: 'NOT_APPLICABLE', message: 'no skill in the collection leads Keystone' }]
        if (map.state === 'invalid')
          return [{ status: 'VIOLATION', message: `the guild map ${map.problem}`, subject: map.path }]
        return map.state === 'in-sync'
          ? [{ status: 'PASS', message: 'the guild map matches the skills’ frontmatter', subject: map.path }]
          : [{ status: 'VIOLATION', message: 'the guild map differs from the skills’ frontmatter', subject: map.path }]
      }
    }
  }
}

const KEYSTONE_4: RubricItem<KeystoneContext> = {
  code: 'KEYSTONE-4',
  title: 'Keystone holds only leads and what every guild rests on',
  description:
    'Each member of Keystone other than its lead is either a guild’s lead or something every guild rests on, as `ki-skills` and `ki-knowledge-graph` are; a skill that serves one guild belongs to that guild.',
  sources: [JOINING, `${GUILDS}#42-keystone`],
  judgment: judgment(
    'Is every member of Keystone a guild’s lead or something every guild rests on, or does one serve a single guild and belong there?'
  )
}

const KEYSTONE_5: RubricItem<KeystoneContext> = {
  code: 'KEYSTONE-5',
  title: 'each lead discloses its guild',
  description:
    'Each lead says what its guild is for in a line and names each member once with when to use it, naming a family’s lead rather than each runtime skill, and the Keystone lead names where a session starts in a repository.',
  sources: [`${GUILDS}#45-how-a-lead-discloses-its-guild`, START],
  judgment: judgment(
    'Does each lead state its guild’s purpose and name each member with when to use it, and does the Keystone lead name where a session starts?'
  )
}

export const KEYSTONE: RubricFamily<KeystoneContext, KeystoneContext> = {
  code: 'KEYSTONE',
  title: 'Keystone and the guild tree',
  description:
    'A skill collection is grouped into guilds, each led by one lead in Keystone, and its guild map is current.',
  standard: 'standard-keystone.md',
  selectContext: (context) => context,
  items: [KEYSTONE_1, KEYSTONE_2, KEYSTONE_3, KEYSTONE_4, KEYSTONE_5]
}
