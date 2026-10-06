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
  title: 'Territory table shape',
  description:
    'Only a Capital declares [skills.ki-repo.territory], and a Capital must: a non-empty name and sorted, unique, canonical members that include itself.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'In a Capital, declare [skills.ki-repo.territory] with name and sorted, unique canonical members including itself; elsewhere remove the table.'
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
