import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { WebsiteContext } from '../contexts/website.ts'
import { inactive, judgment, mechanical } from './shared.ts'
export const WEB_18 = mechanical(
  'WEB-18',
  'config-less Tailwind',
  '**no `tailwind.config.*`** anywhere (config-less Tailwind 4).',
  'FAIL',
  (c) => {
    const stop = inactive(c)
    if (stop) return stop
    const files = ['tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.cjs', 'tailwind.config.mjs'].filter(
      (file) => c.has(file) || Boolean(c.siteRoot && c.has(c.siteRoot, file))
    )
    return [
      {
        status: files.length ? 'VIOLATION' : 'PASS',
        message: files.length
          ? `config-less Tailwind 4 expected, found ${files.join(', ')}`
          : 'no tailwind.config.* (config-less Tailwind 4)'
      }
    ]
  }
)
export const WEB_19 = mechanical(
  'WEB-19',
  'Tailwind import pair',
  '`main.css` begins `@import "tailwindcss"`, then imports `tokens.css` (+ page partials).',
  'WARN',
  (c) => {
    const stop = inactive(c)
    if (stop) return stop
    const path = c.siteAt('src', 'assets', 'css', 'main.css')
    const css = c.read(path)
    if (!css) return [{ status: 'VIOLATION', level: 'FAIL', message: 'main.css missing', subject: path }]
    return [
      /@import\s+["']tailwindcss["']/.test(css)
        ? { status: 'PASS' as const, message: 'main.css imports "tailwindcss"', subject: path }
        : { status: 'VIOLATION' as const, message: 'main.css does not @import "tailwindcss"', subject: path },
      /@import\s+["']\.\/tokens\.css["']/.test(css)
        ? { status: 'PASS' as const, message: 'main.css imports tokens.css', subject: path }
        : {
            status: 'VIOLATION' as const,
            message: 'main.css does not import ./tokens.css (design tokens expected alongside)',
            subject: path
          }
    ]
  },
  { overrideLevels: ['FAIL'] }
)
export const WEB_20 = mechanical(
  'WEB-20',
  'token utility exposure',
  '`tokens.css` exposes its vars to utilities via `@theme inline`.',
  'WARN',
  (c) => {
    const stop = inactive(c)
    if (stop) return stop
    const path = c.siteAt('src', 'assets', 'css', 'tokens.css')
    const css = c.read(path)
    return [
      {
        status: /@theme\s+inline/.test(css) ? 'PASS' : 'VIOLATION',
        message: css
          ? /@theme\s+inline/.test(css)
            ? 'tokens.css exposes vars via @theme inline'
            : 'tokens.css present but no @theme inline (tokens not exposed to utilities)'
          : 'tokens.css missing (no design-token layer)',
        subject: path
      }
    ]
  }
)
export const WEB_21 = judgment(
  'WEB-21',
  'semantic design tokens',
  "tokens.css defines the semantic palette in `@layer base :root {}` (`--background`/`--foreground`/`--primary`/… + brand/layout vars), sampled from the site's imagery; self-hosted fonts use `@font-face` + `font-display: swap`.",
  'Do semantic tokens and self-hosted fonts follow the standard rather than embedding arbitrary presentation values?'
)
export const WEB_22 = judgment(
  'WEB-22',
  'template token use',
  'templates use the tokens; no hard-coded hex values in templates.',
  'Do templates consume semantic tokens without hard-coded hex colours?'
)
export const WEB_40 = mechanical(
  'WEB-40',
  'Tailwind CLI dependency',
  '`@tailwindcss/cli` is a dependency (the config-less Tailwind 4 build tool).',
  'WARN',
  (c) =>
    inactive(c) ?? [
      {
        status: c.deps['@tailwindcss/cli'] ? 'PASS' : 'VIOLATION',
        message: c.deps['@tailwindcss/cli'] ? `@tailwindcss/cli ${c.deps['@tailwindcss/cli']}` : '@tailwindcss/cli not a dependency',
        subject: 'package.json'
      }
    ]
)
export const TAILWIND: readonly RubricItem<WebsiteContext>[] = [WEB_18, WEB_19, WEB_20, WEB_21, WEB_22, WEB_40]
