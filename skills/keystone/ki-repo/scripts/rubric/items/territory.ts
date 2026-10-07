import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { RepoRubricContext, TerritoryRubricContext } from '../contexts/repository.ts'

const SOURCE = 'standards-configuration.md'

const TERR_1: RubricItem<TerritoryRubricContext> = {
  code: 'TERR-1',
  title: 'Capital declared',
  description:
    '[skills.ki-repo].capital names the territory Capital as a full canonical HTTPS GitHub URL; a Capital names itself.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: { class: 'automatic' },
    audit: { phase: 'INSPECT', run: (context) => context.terr1 },
    conform: {
      phase: 'PRIMARY',
      run: (context) => {
        context.ensureCapital?.()
      }
    }
  }
}

const TERR_2: RubricItem<TerritoryRubricContext> = {
  code: 'TERR-2',
  title: 'Territory declaration shape',
  description:
    'Only a Capital declares territory_name, territory_members and optional territory_prefix in [skills.ki-repo]: a non-empty name, sorted unique canonical members including itself, and a lower-case slug prefix when present. The retired [skills.ki-repo.territory] table fails.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'In a Capital, declare territory_name and sorted, unique canonical territory_members including itself in [skills.ki-repo], with an optional lower-case slug territory_prefix; elsewhere remove these keys. Move a retired [skills.ki-repo.territory] table to those keys, then remove it.'
    },
    audit: { phase: 'INSPECT', run: (context) => context.terr2 }
  }
}

const TERR_3: RubricItem<TerritoryRubricContext> = {
  code: 'TERR-3',
  title: 'Capital and membership agree',
  description:
    'Through the local registry, the declared Capital is a unique registered Capital listing this repository, and a Capital is named back by each registered member.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    overrideLevels: ['WARN'],
    remediation: {
      class: 'diagnostic',
      guidance:
        'Correct capital or the Capital territory members so both sides agree; register the Capital checkout locally to verify a WARN.'
    },
    audit: { phase: 'INSPECT', run: (context) => context.terr3 }
  }
}

export const TERR: RubricFamily<RepoRubricContext, TerritoryRubricContext> = {
  code: 'TERR',
  title: 'Territory',
  description: 'Capital declaration, Capital-owned territory membership, and registry-backed agreement.',
  standard: SOURCE,
  selectContext: (context) => context.territory,
  items: [TERR_1, TERR_2, TERR_3]
}
