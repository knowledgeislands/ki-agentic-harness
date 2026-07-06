/**
 * Eval scenarios for the `ki-kb-live-artifacts` skill — dynamic dashboards kept
 * as a Markdown source paired with a rendered HTML output.
 *
 * Design note: a baseline treats a missing file as a generic error and invents
 * frontmatter. These scenarios target house-ARBITRARY specifics: the .md↔.html
 * pairing with the "unpublished"/"orphan" vocabulary, the 24-hour sync-threshold
 * direction, and the required `renders` frontmatter key.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-kb-live-artifacts',
    id: 'la-pairing',
    prompt:
      'Our Live Artifacts folder has a `Status Board.md` but no matching HTML file, and a stray `Metrics.html` with no Markdown. What is the state of each, in our terms?',
    assertions: [
      { name: 'lone .md is unpublished', re: /unpublished/i },
      { name: 'lone .html is orphan', re: /orphan/i },
      { name: 'html half', re: /\.html/i },
      { name: 'md half', re: /\.md/i }
    ],
    rubric:
      'House fact: each artifact is a pair `<Name>.md` + `<Name>.html` (same stem, same folder). A lone `.md` with no `.html` is an **unpublished** artifact; a lone `.html` with no `.md` is an **orphan**. The `.md` carries frontmatter; the `.html` does not. A correct answer labels the lone `.md` "unpublished" and the lone `.html` "orphan" rather than treating them as generic missing/extra files.'
  },
  {
    skill: 'ki-kb-live-artifacts',
    id: 'la-sync-threshold',
    prompt:
      'How does the live-artifacts audit decide a dashboard is stale? Give the exact default rule.',
    assertions: [
      { name: 'default 24 hours', re: /\b24\b/ },
      { name: 'sync_threshold_hours binding', re: /sync_threshold_hours/i },
      { name: 'html vs md compared', re: /\.html/i },
      { name: 'direction: html older than md', re: /older|behind|stale|out of date/i }
    ],
    rubric:
      'House fact: the pair is in sync when the `.html` is not older than the `.md` by more than the configured threshold — **default 24 hours**, set by `sync_threshold_hours`. Staleness is specifically the `.html` lagging the `.md`. A correct answer states the direction and the 24-hour default and names `sync_threshold_hours`.'
  },
  {
    skill: 'ki-kb-live-artifacts',
    id: 'la-renders-fm',
    prompt:
      'Scaffold the frontmatter for a new live-artifact Markdown source. What keys are mandatory?',
    assertions: [
      { name: 'renders key', re: /renders/i },
      { name: 'html render type', re: /html/i },
      { name: 'status key', re: /status/i },
      { name: 'author key', re: /author/i }
    ],
    rubric:
      'House fact: the `.md` source requires frontmatter `status` (`active` | `archived`), `renders` (`html`, or a comma-separated list of render types), and `author`. A correct answer includes the non-obvious `renders: html` key alongside `status` and `author`, not just generic tags/date frontmatter.'
  }
]
