import type { AuditOutcome, ConformOutcome, RubricItem, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import type { WebsiteContext } from '../contexts/website.ts'
import { inactive, judgment, mechanical } from './shared.ts'

const conformOptIn = (c: WebsiteContext): RubricOutcomes<ConformOutcome> => {
  if (!c.available) return [{ status: 'VIOLATION', message: `target path is not a directory: ${c.target}` }]
  return [
    {
      status: c.ensureOptIn() === 'canonical' ? 'PASS' : 'FIXED',
      message: c.kiWebsiteTable
        ? '[ki-website] table already present'
        : `${c.dryRun ? 'would append' : 'appended'} the canonical [ki-website] opt-in table`,
      subject: '.ki-config.toml'
    }
  ]
}
const auditSiteWorkspace = (c: WebsiteContext): RubricOutcomes<AuditOutcome> => {
  const stop = inactive(c)
  if (stop) return stop
  if (!c.cfgName)
    return [
      {
        status: 'VIOLATION',
        message: 'no eleventy.config.{ts,js,mjs,cjs} at repo root or site/ — not an Eleventy site'
      }
    ]
  if (c.siteRoot)
    return [
      {
        status: 'PASS',
        message: `site/${c.cfgName} present (site/ subfolder layout)`,
        subject: c.siteAt(c.cfgName)
      }
    ]
  return [
    {
      status: 'VIOLATION',
      level: 'WARN',
      message: `${c.cfgName} present at repo root (flat layout) — standard §2 requires the site/ workspace; move it under site/`,
      subject: c.siteAt(c.cfgName)
    }
  ]
}
export const WEB_6 = mechanical(
  'WEB-6',
  'site workspace configuration',
  'exactly one `eleventy.config.ts`, under `site/` (the workspace package — every house site is a monorepo, never flat; a flat repo-root config is WARN).',
  'FAIL',
  auditSiteWorkspace
)
export const WEB_7 = mechanical(
  'WEB-7',
  'roadmap',
  '`ROADMAP.md` present.',
  'WARN',
  (c) =>
    inactive(c) ?? [
      {
        status: c.has('ROADMAP.md') ? 'PASS' : 'VIOLATION',
        message: c.has('ROADMAP.md') ? 'ROADMAP.md present' : 'no ROADMAP.md',
        subject: 'ROADMAP.md'
      }
    ]
)
export const WEB_8 = judgment(
  'WEB-8',
  'workspace declaration',
  'the root `package.json` declares a `workspaces` array that includes `site` (the monorepo shape, engineering §0; not yet mechanically checked).',
  'Does the root workspace declaration include `site`?'
)
export const WEB_9 = mechanical(
  'WEB-9',
  'source layout',
  '`src/` (under `site/`) has `_data/`, `_includes/layouts/`, `_includes/partials/`, `assets/css/`.',
  'FAIL',
  (c) =>
    inactive(c) ??
    ['_data', '_includes/layouts', '_includes/partials', 'assets/css'].map((path) => ({
      status: c.isDir(c.siteAt('src', ...path.split('/'))) ? ('PASS' as const) : ('VIOLATION' as const),
      message: c.isDir(c.siteAt('src', ...path.split('/'))) ? `src/${path}/ present` : `src/${path}/ missing`,
      subject: c.siteAt('src', ...path.split('/'))
    }))
)
export const WEB_10 = judgment(
  'WEB-10',
  'site script prefix',
  'every site script carries the `site:` prefix (driven by the monorepo shape, not by observing the folder).',
  'Do site scripts carry the required `site:` prefix?'
)
export const WEB_11 = judgment(
  'WEB-11',
  'typed structure data',
  'structure (nav, ordering) lives in a typed `_data/*.ts` single source, not hard-coded across templates.',
  'Does typed `_data` own navigation and ordering rather than repeated template literals?'
)
export const WEB_39 = mechanical(
  'WEB-39',
  'parseable package manifest',
  '`package.json` is present and parseable (foundational — the stack/scripts checks read it).',
  'FAIL',
  (c) =>
    inactive(c) ?? [
      {
        status: c.packageOk ? 'PASS' : 'VIOLATION',
        message: c.packageOk ? 'package.json present and parseable' : 'package.json missing or unparseable',
        subject: 'package.json'
      }
    ]
)
export const WEB_41: RubricItem<WebsiteContext> = {
  ...mechanical(
    'WEB-41',
    'website opt-in',
    'on an applicable site, the `[ki-website]` opt-in table is present in `.ki-config.toml` (`audit.ts --educate` scaffolds it).',
    'WARN',
    (c) =>
      inactive(c) ?? [
        {
          status: c.kiWebsiteTable ? 'PASS' : 'VIOLATION',
          message: c.kiWebsiteTable
            ? '[ki-website] table present in .ki-config.toml'
            : 'no [ki-website] table in .ki-config.toml (run --educate to scaffold it)',
          subject: '.ki-config.toml'
        }
      ]
  ),
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (c) =>
        inactive(c) ?? [
          {
            status: c.kiWebsiteTable ? 'PASS' : 'VIOLATION',
            message: c.kiWebsiteTable
              ? '[ki-website] table present in .ki-config.toml'
              : 'no [ki-website] table in .ki-config.toml (run --educate to scaffold it)',
            subject: '.ki-config.toml'
          }
        ]
    },
    conform: { phase: 'PRIMARY', run: conformOptIn }
  }
}
export const WEB_42 = mechanical(
  'WEB-42',
  'website opt-in validation',
  'no unknown keys under `[ki-website]` (validate-down — the marker table takes no keys today).',
  'WARN',
  (c) =>
    (inactive(c) ?? !c.kiWebsiteTable)
      ? [{ status: 'NOT_APPLICABLE', message: '[ki-website] table is absent' }]
      : Object.keys(c.kiWebsiteTable).length
        ? Object.keys(c.kiWebsiteTable).map((key) => ({
            status: 'VIOLATION' as const,
            message: `unknown key under [ki-website]: ${key} (validate-down — this table takes no keys today)`,
            subject: '.ki-config.toml'
          }))
        : [{ status: 'PASS', message: '[ki-website] contains no unknown keys', subject: '.ki-config.toml' }]
)
export const LAYOUT: readonly RubricItem<WebsiteContext>[] = [WEB_6, WEB_7, WEB_8, WEB_9, WEB_10, WEB_11, WEB_39, WEB_41, WEB_42]
