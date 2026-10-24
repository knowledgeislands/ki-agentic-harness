import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { AuthoringRubricContext } from '../contexts/authoring.ts'

const ARGUMENT: RubricItem<AuthoringRubricContext> = {
  code: 'WP-argument',
  title: 'white papers serve an outside reader and decision',
  description:
    'Industry white papers build a reader-led argument from problem and scope through approach, findings and meaning to deployment choices and justified action; structure follows purpose.',
  sources: ['standards-whitepapers.md#purpose-and-argument'],
  judgment: {
    scope: 'Industry white-paper authoring and review only; other authored documents are excluded.',
    prompt:
      'Can the intended reader follow the argument and its practical implications, with context before results, proportionate limits and an appropriate institutional voice?',
    outcomes: ['conforming', 'argument revision required', 'not applicable'],
    guidance:
      'Revise around the audience and decision; use only the history and architecture needed to explain the contribution, without requiring fixed chapters.'
  }
}

const EVIDENCE: RubricItem<AuthoringRubricContext> = {
  code: 'WP-evidence',
  title: 'white-paper claims and presentation preserve evidence meaning',
  description:
    'Claims distinguish observation, intention, modelling and future work; material conditions, coherent terms, explanatory figures and publicly usable citations preserve traceability.',
  sources: ['standards-whitepapers.md#evidence-and-presentation'],
  judgment: {
    scope: 'Claims, figures, terminology and public references in industry white papers only.',
    prompt:
      'Do claims retain their source scope and material conditions, and do figures, terms and citations support the practical argument without exaggeration?',
    outcomes: ['conforming', 'evidence correction required', 'not applicable'],
    guidance:
      'Calibrate claims and implications to reviewed sources; align figures and terms, verify public citation suitability, and retain restricted provenance in supporting records.'
  }
}

const REVIEW: RubricItem<AuthoringRubricContext> = {
  code: 'WP-review',
  title: 'white-paper drafting and review validate the resulting argument',
  description:
    'The body supports conclusions and summaries; substantive and line review assess coverage and meaning, including AI restructuring, while editorial instructions stay outside the paper.',
  sources: ['standards-whitepapers.md#lean-authoring-and-review'],
  judgment: {
    scope: 'The drafting and review evidence for an industry white paper, when available.',
    prompt:
      'Are conclusions and summaries grounded in the body, restructuring checked for coverage and meaning, and expert review and citation checks evidenced without editorial bookkeeping in deliverable prose?',
    outcomes: ['conforming', 'review required', 'evidence unavailable', 'not applicable'],
    guidance:
      'Record missing review evidence as unknown; assess substantive coverage and changed claims regardless of tool origin, without imposing review counts or page targets.'
  }
}

export const WHITEPAPERS: RubricFamily<AuthoringRubricContext, AuthoringRubricContext> = {
  code: 'WP',
  title: 'Industry white papers',
  description: 'Judgment for industry white-paper tasks only, not general Markdown authoring.',
  standard: 'standards-whitepapers.md',
  selectContext: (context) => context,
  items: [ARGUMENT, EVIDENCE, REVIEW]
}
