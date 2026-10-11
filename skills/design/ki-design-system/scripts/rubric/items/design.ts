import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { DesignRubricContext } from '../contexts/design.ts'

const PLACEMENT = 'standards-design-system.md#where-design-knowledge-lives'
const TOKENS = 'standards-design-system.md#the-token-source'
const GUIDE = 'standards-design-system.md#the-design-guide'
const CHECKS = 'standards-design-system.md#checks'
const FLOOR = 'standards-design-system.md#the-floor'
const WORK = 'standards-design-system.md#design-work-from-brief-to-rule'
const PROJECTIONS = 'standards-design-system.md#projections'
const CONFIGURATION = 'standards-design-system.md#configuration'

const DSYS_1: RubricItem<DesignRubricContext> = {
  code: 'DSYS-1',
  title: 'the declaration is valid and its token sources exist',
  description:
    '`[skills.ki-design-system]` in `.ki.toml` declares `tokens`, `guide` and `checks` and no other key, and every declared token source is a regular file inside the repository.',
  sources: [CONFIGURATION, TOKENS],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Declare `tokens`, `guide` and `checks` under `[skills.ki-design-system]`, remove any other key, and point `tokens` at the files that hold the design values, then rerun the audit.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ declaration, files }) => {
        const problems = [
          ...declaration.issues.map((issue) => `.ki.toml [skills.ki-design-system]: ${issue}`),
          ...files.missingTokens.map((path) => `token source missing: ${path}`)
        ]
        return problems.length === 0
          ? [
              {
                status: 'PASS',
                message: `The declaration is valid and its ${declaration.tokens.length} token sources exist.`
              }
            ]
          : problems.map((subject) => ({
              status: 'VIOLATION',
              message: 'The declaration must be valid and name token sources that exist.',
              subject
            }))
      }
    }
  }
}

const DSYS_2: RubricItem<DesignRubricContext> = {
  code: 'DSYS-2',
  title: 'the design guide is a guide in an audience folder',
  description:
    'The declared `guide` is a regular Markdown file inside the repository, below `docs/guides/` in an audience folder.',
  sources: [GUIDE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        "Write the design guide in the audience folder of the people who build the interface, such as `docs/guides/developer/`, from the skill's guide skeleton, declare its path as `guide`, then rerun the audit."
    },
    audit: {
      phase: 'INSPECT',
      run: ({ files }) =>
        files.guideIssues.length === 0
          ? [{ status: 'PASS', message: 'The design guide is a guide in an audience folder.' }]
          : files.guideIssues.map((subject) => ({
              status: 'VIOLATION',
              message: 'The design guide must be an ordinary guide in an audience folder.',
              subject
            }))
    }
  }
}

const DSYS_3: RubricItem<DesignRubricContext> = {
  code: 'DSYS-3',
  title: 'the declared design checks exist',
  description:
    'At least one design check is declared as `checks`, and every declared check is a regular file inside the repository.',
  sources: [CHECKS],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Add at least a contrast check over every theme and mode the product offers, declare the files that hold design checks as `checks`, then rerun the audit.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ declaration, files }) => {
        if (declaration.checks.length === 0)
          return [
            {
              status: 'VIOLATION',
              message: 'A design system declares at least one design check.',
              subject: '.ki.toml [skills.ki-design-system] checks'
            }
          ]
        return files.missingChecks.length === 0
          ? [{ status: 'PASS', message: `The ${declaration.checks.length} declared design checks exist.` }]
          : files.missingChecks.map((path) => ({
              status: 'VIOLATION',
              message: 'Every declared design check must exist.',
              subject: `check missing: ${path}`
            }))
      }
    }
  }
}

const DSYS_4: RubricItem<DesignRubricContext> = {
  code: 'DSYS-4',
  title: 'the guide names its token sources',
  description:
    'The design guide names every declared token source, by its repository path or its file name, so a reader knows where each value lives.',
  sources: [GUIDE, TOKENS],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance: "Name each token source in the guide's opening or Colour section, then rerun the audit."
    },
    audit: {
      phase: 'INSPECT',
      run: ({ files, guide }) => {
        if (!files.guideExists)
          return [{ status: 'NOT_APPLICABLE', message: 'There is no design guide to read; see DSYS-2.' }]
        return guide.unnamedTokens.length === 0
          ? [{ status: 'PASS', message: 'The design guide names every token source.' }]
          : guide.unnamedTokens.map((path) => ({
              status: 'VIOLATION',
              message: 'The design guide does not name this token source.',
              subject: path
            }))
      }
    }
  }
}

const DSYS_5: RubricItem<DesignRubricContext> = {
  code: 'DSYS-5',
  title: 'the guide repeats no literal colour value',
  description:
    'The design guide contains no hex colour and no colour function whose first argument is a number; it names tokens, whose values live in the token source.',
  sources: [TOKENS, GUIDE],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Replace each literal colour with the name of the token that holds it, adding the token first where none exists, then rerun the audit.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ files, guide }) => {
        if (!files.guideExists)
          return [{ status: 'NOT_APPLICABLE', message: 'There is no design guide to read; see DSYS-2.' }]
        return guide.literalColours.length === 0
          ? [{ status: 'PASS', message: 'The design guide repeats no literal colour value.' }]
          : guide.literalColours.map(({ line, value }) => ({
              status: 'VIOLATION',
              message: 'A literal colour value repeats what the token source holds.',
              subject: `line ${line}: ${value}`
            }))
      }
    }
  },
  judgment: {
    scope: 'Each value DSYS-5 reports, read in its sentence or code block.',
    prompt:
      'Does the value repeat what a token holds, or is it an illustration that names no token, such as a colour in a third-party example the guide quotes?',
    outcomes: ['conforming', 'gap'],
    guidance:
      'A repeated value is a gap: name the token instead. An illustration that names no design value is conforming; prefer rewriting it to name a token where one exists.'
  }
}

const DSYS_6: RubricItem<DesignRubricContext> = {
  code: 'DSYS-6',
  title: 'each kind of design knowledge sits in its home',
  description:
    'Values live in the token source, practical rules in the design guide, stable behaviour that something depends on in a Specification, rationale in a Decision Record, and future design work in a work record; nothing is stated in two homes.',
  sources: [PLACEMENT],
  judgment: {
    scope:
      'The token sources, the design guide, design Specifications, design Decision Records and open design work records.',
    prompt:
      'Does the guide carry rationale, history or values that belong elsewhere? Does a Decision Record restate guide procedure or list rejected options? Is there stable, verifiable design behaviour that something depends on with no Specification? Is anything said in two homes?',
    outcomes: ['conforming', 'move', 'gap'],
    guidance:
      'Move each misplaced statement to its home, preserving the conclusion before removing the source, and route a missing Specification to `ki-specs` and a missing decision to `ki-decision-records`. Do not change what the interface does.'
  }
}

const DSYS_7: RubricItem<DesignRubricContext> = {
  code: 'DSYS-7',
  title: 'the floor holds and every checkable rule has a check',
  description:
    'The interface meets the floor: one home for values, readable contrast proved by a check in every theme and mode, meaning never carried by colour alone, and keyboard parity. Every rule in the guide that a machine can check has a check its merge section names.',
  sources: [FLOOR, CHECKS],
  judgment: {
    scope: "The interface's pages in each theme, mode and width it supports, the design guide and the declared checks.",
    prompt:
      'Does every meaningful colour have a second carrier? Can every action be done with the keyboard, with visible focus? Does the contrast check cover every theme and mode offered? Which guide rules could a machine check but do not have a check?',
    outcomes: ['conforming', 'gap'],
    guidance:
      'Record each floor failure as a gap against the page and the rule. For each checkable rule without a check, add the check or list the rule as a review step in the guide.'
  }
}

const DSYS_8: RubricItem<DesignRubricContext> = {
  code: 'DSYS-8',
  title: 'working material is retired and projections follow the source',
  description:
    'Briefs, option boards, canvases and screenshots from finished design work are consolidated and not kept as durable documents, and every design tool outside the repository is refreshed from the token source and the guide.',
  sources: [WORK, PROJECTIONS],
  judgment: {
    scope:
      'Documentation folders and assets that hold design working material, closed design work records, and the projections the guide lists.',
    prompt:
      'Is any brief, option board or canvas kept as a document after its outcome reached the guide, a Specification or a Decision Record? Does any projection, such as a design-system artifact or a design library, disagree with the token source?',
    outcomes: ['conforming', 'retire', 'refresh'],
    guidance:
      'Confirm the outcome is consolidated, then remove the working material; Git history keeps it. Refresh a stale projection from the token source and record the date in the guide.'
  }
}

export const DSYS: RubricFamily<DesignRubricContext, DesignRubricContext> = {
  code: 'DSYS',
  title: 'design system',
  description: "A repository's design knowledge sits in its homes and stays true through checks.",
  standard: PLACEMENT,
  selectContext: (context) => context,
  items: [DSYS_1, DSYS_2, DSYS_3, DSYS_4, DSYS_5, DSYS_6, DSYS_7, DSYS_8]
}
