import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { DiagramsRubricContext } from '../contexts/diagrams.ts'

const COMMITTED = 'standards-diagrams.md#committed-forms'
const MANIFEST = 'standards-diagrams.md#the-manifest'
const PRIVACY = 'standards-diagrams.md#privacy'
const FRESHNESS = 'standards-diagrams.md#regeneration-and-freshness'
const CHOOSING = 'standards-diagrams.md#choosing-a-diagram-type'
const TOOL = 'standards-diagrams.md#the-tool-archify'

const DIAG_1: RubricItem<DiagramsRubricContext> = {
  code: 'DIAG-1',
  title: 'the manifest and the committed files agree both ways',
  description:
    "`docs/diagrams/diagrams.toml` is valid and complete, each `traced` entry a repository-relative path, a pathspec glob or a private repository's `path:revision:lines` citation; every listed diagram has its source, its SVG and an embed in `docs/diagrams/README.md`, and a diagram with `commit_html = true` also has its `<slug>.html`, linked from the README; and every file under `docs/diagrams/` belongs to a listed diagram, an HTML file and its `<slug>.receipt.json` only under that opt-in.",
  sources: [MANIFEST, COMMITTED],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'List each diagram in `diagrams.toml` with every field, commit its `<slug>.<type>.json` source and `<slug>.svg`, embed the SVG in `README.md`, commit and link `<slug>.html` only where `commit_html = true`, and remove or list any stray file, then rerun the audit.'
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
  title: 'no committed diagram file carries private information',
  description:
    'No committed diagram source, SVG or interactive HTML contains a local absolute path, a `file://` URL or an email address, and none names a private repository or a person. A repository URL appears in a citation only where the remote is public; a private repository cites `path:revision:lines` with no URL, and the audit accepts either form.',
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
    scope: 'Every committed diagram source, SVG and HTML under docs/diagrams.',
    prompt:
      'Does any label, card, citation or repository URL name a private repository, a person, note content or a commit subject that a public reader of this repository should not see, and does any citation carry a repository URL where the remote is private rather than the URL-free `path:revision:lines` form?',
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

const DIAG_6: RubricItem<DiagramsRubricContext> = {
  code: 'DIAG-6',
  title: 'each committed viewer carries a receipt that matches its source',
  description:
    "Every diagram with `commit_html = true` has a `docs/diagrams/<slug>.receipt.json` naming its slug, type, source and HTML, whose SHA-256 hashes and byte counts match the committed source and viewer, with the renderer's name and version; it is read from committed files alone, and `last_checked` plays no part.",
  sources: [COMMITTED, FRESHNESS],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Re-render the diagram with the build command, which writes its viewer and receipt together, and commit both with the source; never hand-edit a receipt. Then rerun the audit.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ receipts }) => {
        if (receipts.viewerCount === 0)
          return [{ status: 'NOT_APPLICABLE', message: 'No diagram commits its interactive HTML.' }]
        return receipts.findings.length === 0
          ? [
              {
                status: 'PASS',
                message: `All ${receipts.viewerCount} committed viewers carry a receipt matching their source.`
              }
            ]
          : receipts.findings.map((subject) => ({
              status: 'VIOLATION',
              message: 'A committed viewer must carry a receipt matching its current source and HTML.',
              subject
            }))
      }
    }
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

const DIAG_7: RubricItem<DiagramsRubricContext> = {
  code: 'DIAG-7',
  title: 'no Mermaid diagram is left in tracked Markdown unless kept',
  description:
    "Each fenced block whose info string is `mermaid` in the repository's tracked Markdown, backtick or tilde, warns with its file and line until it is replaced by an Archify diagram or the owner decides to keep it, recorded by `<!-- ki-diagrams: keep mermaid -->` on the line before the fence; a fence shown inside a longer fence is an example and is not counted.",
  sources: [TOOL],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Replace the diagram with an Archify diagram under Mode REFRESH, or, where the owner decides to keep it, put `<!-- ki-diagrams: keep mermaid -->` on the line before the fence; then rerun the audit.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ mermaid }) => {
        if (!mermaid.gitAvailable)
          return [{ status: 'NOT_APPLICABLE', message: 'Tracked Markdown cannot be listed outside a Git checkout.' }]
        return mermaid.fences.length === 0
          ? [
              {
                status: 'PASS',
                message:
                  mermaid.kept === 0
                    ? 'No tracked Markdown holds a Mermaid fence.'
                    : `No tracked Markdown holds a Mermaid fence beyond the ${mermaid.kept} the owner kept.`
              }
            ]
          : mermaid.fences.map((subject) => ({
              status: 'VIOLATION',
              message: 'A Mermaid diagram is replaced by an Archify diagram or marked as kept by the owner.',
              subject
            }))
      }
    }
  }
}

const DIAG_8: RubricItem<DiagramsRubricContext> = {
  code: 'DIAG-8',
  title: 'each working folder under `+/diagrams/` carries a well-formed mark',
  description:
    "Each folder under `+/diagrams/` carries a `mark.toml` at its root naming the work, the run and agent or the session that wrote it, and `written_at`, under the `ki-delegation` background-run standard's working-area marks; a folder without one, or whose mark is not well formed, warns.",
  sources: [FRESHNESS],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Rebuild the diagram with `scripts/build-html.ts`, which writes the mark, passing `--work <id>` from an interactive session; or delete a folder no one owns; rerun the audit.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ marks }) => {
        if (marks.folderCount === 0)
          return [{ status: 'NOT_APPLICABLE', message: 'No working folder under `+/diagrams/`.' }]
        return marks.findings.length === 0
          ? [{ status: 'PASS', message: `${marks.folderCount} working folders carry a well-formed mark.` }]
          : marks.findings.map((subject) => ({
              status: 'VIOLATION',
              message: 'A working folder should carry a well-formed `mark.toml`.',
              subject
            }))
      }
    }
  }
}

export const DIAG: RubricFamily<DiagramsRubricContext, DiagramsRubricContext> = {
  code: 'DIAG',
  title: 'living diagrams',
  description: 'A repository keeps traced, self-contained, current Archify diagrams under one manifest.',
  standard: MANIFEST,
  selectContext: (context) => context,
  items: [DIAG_1, DIAG_2, DIAG_3, DIAG_4, DIAG_5, DIAG_6, DIAG_7, DIAG_8]
}
