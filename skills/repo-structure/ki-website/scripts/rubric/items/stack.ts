import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { WebsiteContext } from '../contexts/website.ts'
import { inactive, judgment, mechanical } from './shared.ts'

export const WEB_1 = mechanical(
  'WEB-1',
  'Eleventy dependency',
  '`@11ty/eleventy` `^3.x` is a dependency.',
  'FAIL',
  (c) =>
    inactive(c) ?? [
      {
        status: c.deps['@11ty/eleventy'] ? 'PASS' : 'VIOLATION',
        message: c.deps['@11ty/eleventy'] ? `@11ty/eleventy ${c.deps['@11ty/eleventy']}` : '@11ty/eleventy not a dependency',
        subject: 'package.json'
      }
    ]
)
export const WEB_2 = mechanical(
  'WEB-2',
  'Eleventy rather than SPA stack',
  '**not** an `astro` / `next` / SPA project (those deps absent).',
  'WARN',
  (c) => {
    const stop = inactive(c)
    if (stop) return stop
    const found = ['astro', 'next'].filter((name) => c.deps[name])
    return found.length
      ? found.map((name) => ({
          status: 'VIOLATION' as const,
          message: `${name} present — this skill governs Eleventy sites, not ${name}`,
          subject: 'package.json'
        }))
      : [{ status: 'PASS', message: 'no Astro or Next dependency', subject: 'package.json' }]
  }
)
export const WEB_3 = mechanical(
  'WEB-3',
  'native TypeScript runner',
  'TypeScript runs natively (Bun, or plain `node` on Node ≥ 24 — type stripping stable/unflagged); **no `tsx`** (the `tsx` dep / `tsx/esm` runner is mechanically flagged; the "runs natively" claim is judged).',
  'WARN',
  (c) => {
    const inactiveResult = inactive(c)
    if (inactiveResult) return inactiveResult
    const usesTsx = c.deps.tsx !== undefined || Object.values(c.scripts).some((script) => /tsx\/esm|--import\s+tsx/.test(script))
    return [
      {
        status: usesTsx ? 'VIOLATION' : 'PASS',
        message: usesTsx ? 'tsx detected (legacy TS runner) — run TS natively on Bun / Node' : 'no tsx (TS runs natively)',
        subject: 'package.json'
      }
    ]
  }
)
export const WEB_4 = judgment(
  'WEB-4',
  'Nunjucks template engine',
  "Nunjucks is the template engine (`htmlTemplateEngine`/`markdownTemplateEngine` = `'njk'`); content is `.md`, logic is `.njk`.",
  'Does the configuration use Nunjucks and keep content and template logic in their intended forms?'
)
export const WEB_5 = judgment(
  'WEB-5',
  'Lucide icon source',
  'Lucide is the icon source (passthrough from `node_modules`, initialised client-side).',
  'Is Lucide the icon source and is it wired through the intended passthrough/client pattern?'
)
export const STACK: readonly RubricItem<WebsiteContext>[] = [WEB_1, WEB_2, WEB_3, WEB_4, WEB_5]
