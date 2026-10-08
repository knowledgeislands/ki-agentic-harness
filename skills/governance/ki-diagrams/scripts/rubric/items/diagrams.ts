import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { DiagramsRubricContext } from '../contexts/diagrams.ts'

const COMMITTED = 'standards-diagrams.md#committed-forms'
const MANIFEST = 'standards-diagrams.md#the-manifest'
const PRIVACY = 'standards-diagrams.md#privacy'
const FRESHNESS = 'standards-diagrams.md#regeneration-and-freshness'
const CHOOSING = 'standards-diagrams.md#choosing-a-diagram-type'

const DIAG_1: RubricItem<DiagramsRubricContext> = {
  code: 'DIAG-1',
  title: 'the manifest and the committed files agree both ways',
  description:
    '`docs/diagrams/diagrams.toml` is valid and complete; every listed diagram has its source, its SVG and an embed in `docs/diagrams/README.md`; and every file under `docs/diagrams/` belongs to a listed diagram.',
  sources: [MANIFEST, COMMITTED],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'List each diagram in `diagrams.toml` with every field, commit its `<slug>.<type>.json` source and `<slug>.svg`, embed the SVG in `README.md`, and remove or list any stray file, then rerun the audit.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ layout }) => {
        if (!layout.directoryExists)
          return [
            {
              status: 'VIOLATION',
              message: 'A repository that declares ki-diagrams keeps its diagrams under docs/diagrams.',
              subject: 'docs/diagrams'
            }
          ]
        const problems = [
          ...(layout.manifestExists ? [] : ['docs/diagrams/diagrams.toml is missing']),
          ...(layout.indexExists ? [] : ['docs/diagrams/README.md is missing']),
          ...layout.manifestIssues.map((issue) => `diagrams.toml ${issue}`),
          ...layout.missing.map((path) => `missing: ${path}`),
          ...layout.unlisted.map((path) => `not in the manifest: ${path}`)
        ]
        return problems.length === 0
          ? [{ status: 'PASS', message: `The manifest and the ${layout.diagramCount} committed diagrams agree.` }]
          : problems.map((subject) => ({
              status: 'VIOLATION',
              message: 'The manifest and the committed diagram files must agree both ways.',
              subject
            }))
      }
    }
  }
}

const DIAG_2: RubricItem<DiagramsRubricContext> = {
  code: 'DIAG-2',
  title: 'no committed source or SVG carries private information',
  description:
    'No committed diagram source or SVG contains a local absolute path, a `file://` URL or an email address, and none names a private repository or a person.',
  sources: [PRIVACY],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Replace the local path, URL or address in the source with a repository-relative or generic label, rebuild and re-export the SVG, then rerun the audit.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ privacy }) =>
        privacy.findings.length === 0
          ? [
              {
                status: 'PASS',
                message: `None of the ${privacy.sourceCount} committed diagram files carries a local path or address.`
              }
            ]
          : privacy.findings.map((subject) => ({
              status: 'VIOLATION',
              message: 'A committed diagram must not carry a local path, file URL or personal address.',
              subject
            }))
    }
  },
  judgment: {
    scope: 'Every committed diagram source and SVG under docs/diagrams.',
    prompt:
      'Does any label, card, citation or repository URL name a private repository, a person, note content or a commit subject that a public reader of this repository should not see?',
    outcomes: ['conforming', 'gap', 'exclusion'],
    guidance: 'Record a gap naming the diagram and the label, and rewrite the label generically before the next export.'
  }
}

const DIAG_3: RubricItem<DiagramsRubricContext> = {
  code: 'DIAG-3',
  title: 'each SVG is self-contained',
  description:
    'Every committed `docs/diagrams/*.svg` is an SVG document whose `href` and `url()` references are fragments or inline `data:` URIs only.',
  sources: [COMMITTED],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Re-export the SVG with the ki-diagrams exporter, which refuses an export with an external reference, then rerun the audit.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ svg }) =>
        svg.findings.length === 0
          ? [{ status: 'PASS', message: `All ${svg.svgCount} committed SVGs are self-contained.` }]
          : svg.findings.map((subject) => ({
              status: 'VIOLATION',
              message: 'A committed SVG must carry no external reference.',
              subject
            }))
    }
  }
}

const DIAG_4: RubricItem<DiagramsRubricContext> = {
  code: 'DIAG-4',
  title: 'no traced path changed since the diagram was last checked',
  description:
    "For each listed diagram, read-only Git history shows no change to a `traced` path between its `last_checked` revision and `HEAD`, and that revision exists in the repository's history.",
  sources: [FRESHNESS],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        "Review the change against the diagram's `stale_when`; regenerate it if the change matches, then set `last_checked` to the revision checked, and rerun the audit."
    },
    audit: {
      phase: 'INSPECT',
      run: ({ freshness }) => {
        if (!freshness.gitAvailable)
          return [{ status: 'NOT_APPLICABLE', message: 'Freshness needs the repository Git history.' }]
        return freshness.stale.length === 0
          ? [
              {
                status: 'PASS',
                message: `No traced path of the ${freshness.diagramCount} diagrams changed since last checked.`
              }
            ]
          : freshness.stale.map((subject) => ({
              status: 'VIOLATION',
              message: 'A traced path changed after the diagram was last checked.',
              subject
            }))
      }
    }
  },
  judgment: {
    scope: 'Each diagram DIAG-4 reports, with its stale_when line and the reported changes.',
    prompt:
      "Does the change match the diagram's stale_when line, so that the diagram no longer tells the truth, or is it outside what the diagram draws?",
    outcomes: ['conforming', 'gap', 'exclusion'],
    guidance:
      'A matching change is a gap: regenerate through Mode REFRESH. A non-matching change is conforming once last_checked advances to the revision reviewed.'
  }
}

const DIAG_5: RubricItem<DiagramsRubricContext> = {
  code: 'DIAG-5',
  title: 'each diagram finalizes at showcase quality and its type answers its question',
  description:
    "Each listed source passes Archify's `finalize --quality showcase` gates, and its diagram type is the one the standard maps its question to.",
  sources: [CHOOSING, FRESHNESS],
  judgment: {
    scope: 'Every listed diagram, with Archify installed.',
    prompt:
      'Does `finalize <type> <source> <output.html> --repo-root . --quality showcase` pass all four gates, and does the chosen type answer the manifest question as the standard maps questions to types?',
    outcomes: ['conforming', 'gap', 'exclusion'],
    guidance:
      'Without Archify, record the review as unevaluated with the Rig install instruction. A failing gate or a mismatched type is a gap for Mode REFRESH.'
  }
}

export const DIAG: RubricFamily<DiagramsRubricContext, DiagramsRubricContext> = {
  code: 'DIAG',
  title: 'living diagrams',
  description: 'A repository keeps traced, self-contained, current Archify diagrams under one manifest.',
  standard: MANIFEST,
  selectContext: (context) => context,
  items: [DIAG_1, DIAG_2, DIAG_3, DIAG_4, DIAG_5]
}
