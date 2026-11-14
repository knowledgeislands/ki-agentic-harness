import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { GuidesLayoutContext, GuidesRubricContext } from '../contexts/guides.ts'

const SOURCE = 'standards-guides.md#guide-root-and-index'

const GUIDE_1: RubricItem<GuidesLayoutContext> = {
  code: 'GUIDE-1',
  title: 'docs/guides is a regular directory',
  description: '`docs/guides/` exists as a regular directory inside the repository.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance: 'Create a regular `docs/guides/` directory inside the repository, then rerun the audit.'
    },
    audit: {
      phase: 'INSPECT',
      run: (context) => [
        context.directoryExists
          ? { status: 'PASS', message: 'The controlled docs/guides directory exists.', subject: 'docs/guides' }
          : {
              status: 'VIOLATION',
              message: 'The controlled docs/guides directory is missing or unsafe.',
              subject: 'docs/guides'
            }
      ]
    }
  }
}

const GUIDE_2: RubricItem<GuidesLayoutContext> = {
  code: 'GUIDE-2',
  title: 'docs/guides/README.md is the collection entry point',
  description: '`docs/guides/README.md` exists as a regular file and is the collection entry point.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance: 'Add a regular `docs/guides/README.md` collection entry point, then rerun the audit.'
    },
    audit: {
      phase: 'INSPECT',
      run: (context) => [
        !context.directoryExists
          ? {
              status: 'NOT_APPLICABLE',
              message: 'The collection entry point cannot exist until docs/guides exists.',
              subject: 'docs/guides/README.md'
            }
          : context.indexExists
            ? { status: 'PASS', message: 'The Guides collection entry point exists.', subject: 'docs/guides/README.md' }
            : {
                status: 'VIOLATION',
                message: 'The Guides collection entry point is missing or unsafe.',
                subject: 'docs/guides/README.md'
              }
      ]
    }
  }
}

const GUIDE_3: RubricItem<GuidesLayoutContext> = {
  code: 'GUIDE-3',
  title: 'each guide has exactly one H1',
  description: 'Every Markdown guide below `docs/guides/`, except its root `README.md`, has exactly one H1.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: { class: 'diagnostic', guidance: 'Give each affected guide exactly one H1, then rerun the audit.' },
    audit: {
      phase: 'INSPECT',
      run: (context) =>
        context.headingIssues.length === 0
          ? [{ status: 'PASS', message: 'Every guide has exactly one H1.' }]
          : context.headingIssues.map((file) => ({
              status: 'VIOLATION',
              message: 'A guide must have exactly one H1.',
              subject: file
            }))
    }
  }
}

const GUIDE_4: RubricItem<GuidesLayoutContext> = {
  code: 'GUIDE-4',
  title: 'a guide links no document outside its collection',
  description:
    'No guide below `docs/guides/` links a Markdown document outside the collection; code paths and sibling guides are unaffected.',
  sources: ['standards-guides.md#a-guide-is-self-contained'],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Name the document in prose instead of linking it, or move the material the guide needs into docs/guides/references/, then rerun the audit.'
    },
    audit: {
      phase: 'INSPECT',
      run: (context) =>
        context.escapingLinks.length === 0
          ? [{ status: 'PASS', message: 'No guide links a document outside the collection.' }]
          : context.escapingLinks.map((link) => ({
              status: 'VIOLATION',
              message: 'A guide must read completely without following a link outside its collection.',
              subject: link
            }))
    }
  }
}

const GUIDE_5: RubricItem<GuidesLayoutContext> = {
  code: 'GUIDE-5',
  title: 'every guide lives in an audience folder',
  description:
    'No guide sits directly below `docs/guides/`; apart from the root `README.md`, every guide lives in a folder named for its audience.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        "Move each named guide into its primary audience's folder below `docs/guides/`, update every inbound link, then rerun the audit."
    },
    audit: {
      phase: 'INSPECT',
      run: (context) =>
        context.rootGuides.length === 0
          ? [{ status: 'PASS', message: 'Every guide lives in an audience folder.' }]
          : context.rootGuides.map((file) => ({
              status: 'VIOLATION',
              message: 'A guide must live in a folder named for its audience, not directly below docs/guides.',
              subject: file
            }))
    }
  }
}

const GUIDE_6: RubricItem<GuidesLayoutContext> = {
  code: 'GUIDE-6',
  title: 'a guide opens with its outcome',
  description:
    'Every guide below `docs/guides/`, except its root `README.md`, has at least 120 characters of prose before its first `##`; front matter, the H1, and HTML lines do not count.',
  sources: ['standards-guides.md#a-guide-opens-with-its-outcome'],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Open each affected guide, before its first `##`, with prose saying what the reader will be able to do once they have read it, then rerun the audit.'
    },
    audit: {
      phase: 'INSPECT',
      run: (context) =>
        context.openingIssues.length === 0
          ? [{ status: 'PASS', message: 'Every guide opens with at least 120 characters of prose.' }]
          : context.openingIssues.map(({ file, length }) => ({
              status: 'VIOLATION',
              message: `A guide must open with at least 120 characters of prose before its first section; this one has ${length}.`,
              subject: file
            }))
    }
  }
}

export const GUIDE: RubricFamily<GuidesRubricContext, GuidesLayoutContext> = {
  code: 'GUIDE',
  title: 'guide layout',
  description: 'The controlled guide root has an entry point and identifiable guide documents.',
  standard: SOURCE,
  selectContext: (context) => context.layout,
  items: [GUIDE_1, GUIDE_2, GUIDE_3, GUIDE_4, GUIDE_5, GUIDE_6]
}
