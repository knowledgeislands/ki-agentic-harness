import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { WebsiteContext } from '../contexts/website.ts'
import { inactive, judgment, mechanical } from './shared.ts'

const configRule = (
  code: string,
  title: string,
  description: string,
  level: 'FAIL' | 'WARN',
  pass: RegExp,
  passMessage: string,
  failMessage: string
) =>
  mechanical(
    code,
    title,
    description,
    level,
    (c) =>
      inactive(c) ?? [
        {
          status: pass.test(c.config) ? 'PASS' : 'VIOLATION',
          message: pass.test(c.config) ? passMessage : failMessage,
          subject: c.siteAt(c.cfgName)
        }
      ]
  )
export const WEB_12 = configRule(
  'WEB-12',
  'portable URL transform',
  'a transform rewrites absolute internal URLs to relative (the portable-`dist/` transform; `toRelativeOutputUrl` / `explicit-index-links` per the standard).',
  'FAIL',
  /toRelativeOutputUrl|explicit-index-links|addTransform[\s\S]*\brelative\(/,
  'portable-dist/ URL transform present',
  'no absolute→relative URL transform (dist/ will not be portable)'
)
export const WEB_13 = configRule(
  'WEB-13',
  'TypeScript data extension',
  "`addDataExtension('ts', …)` registered, calling a function default export.",
  'WARN',
  /addDataExtension\(\s*["']ts["']/,
  "addDataExtension('ts') registered",
  "no addDataExtension('ts') (TypeScript data files)"
)
export const WEB_14 = configRule(
  'WEB-14',
  'JSON5 data extension',
  "`addDataExtension('json5', …)` registered.",
  'WARN',
  /addDataExtension\(\s*["']json5["']/,
  "addDataExtension('json5') registered",
  "no addDataExtension('json5')"
)
export const WEB_15 = configRule(
  'WEB-15',
  'Tailwind lifecycle hook',
  "`eleventyConfig.on('eleventy.before', …)` compiles Tailwind in build mode (CLI invoked), guarded off `serve`/`watch`.",
  'WARN',
  /on\(\s*["']eleventy\.before["'][\s\S]*tailwindcss/,
  'Tailwind compiled via eleventy.before hook',
  'no eleventy.before hook invoking the Tailwind CLI'
)
export const WEB_16 = configRule(
  'WEB-16',
  'CSS watch target',
  '`addWatchTarget` on the compiled `dist/assets/css/main.css` (mechanically checked); Lucide + `external-link-icons` transform present (judged).',
  'WARN',
  /addWatchTarget/,
  'addWatchTarget present (dev reload on CSS)',
  'no addWatchTarget for the compiled CSS'
)
export const WEB_17 = judgment(
  'WEB-17',
  'configuration helpers',
  'filters (`jsonDump`/`unique`/`groupBy`) and ordered collections where a section needs them.',
  'Where the content needs them, do filters and ordered collections use the documented patterns?'
)
export const CONFIG: readonly RubricItem<WebsiteContext>[] = [WEB_12, WEB_13, WEB_14, WEB_15, WEB_16, WEB_17]
