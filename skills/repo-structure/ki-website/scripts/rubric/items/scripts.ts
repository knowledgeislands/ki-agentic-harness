import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { WebsiteContext } from '../contexts/website.ts'
import { inactive, mechanical } from './shared.ts'

const script = (c: WebsiteContext, base: string): string | undefined =>
  c.scripts[`ki:site:${base}`] ?? c.scripts[`ki:${base}`] ?? c.scripts[base]
export const WEB_30 = mechanical(
  'WEB-30',
  'site build and development scripts',
  'a build script invokes Eleventy with `--config=eleventy.config.ts`; a dev script runs Tailwind `--watch` + Eleventy `--serve --port 3000` via `concurrently`. (`ki:site:build`, `ki:site:dev`.)',
  'WARN',
  (c) => {
    const stop = inactive(c)
    if (stop) return stop
    const build = script(c, 'build')
    const dev = script(c, 'dev')
    return [
      build && /eleventy/.test(build)
        ? { status: 'PASS' as const, message: 'build script invokes Eleventy', subject: 'package.json' }
        : {
            status: 'VIOLATION' as const,
            level: 'FAIL' as const,
            message: 'no build script invoking Eleventy (ki:site:build)',
            subject: 'package.json'
          },
      dev && /concurrently/.test(dev)
        ? { status: 'PASS' as const, message: 'dev script runs Tailwind watch + Eleventy serve (concurrently)', subject: 'package.json' }
        : { status: 'VIOLATION' as const, message: 'no concurrently dev script (ki:site:dev)', subject: 'package.json' }
    ]
  },
  { overrideLevels: ['FAIL'] }
)
export const WEB_31 = mechanical(
  'WEB-31',
  'development script fan-out',
  'the `concurrently` dev script fans out to `ki:site:dev:css` (the Tailwind watcher) and `ki:site:dev:serve` (the Eleventy server).',
  'WARN',
  (c) => {
    const stop = inactive(c)
    if (stop) return stop
    const dev = script(c, 'dev')
    return dev && /concurrently/.test(dev)
      ? ['dev:css', 'dev:serve'].map((part) => ({
          status: script(c, part) ? ('PASS' as const) : ('VIOLATION' as const),
          message: script(c, part)
            ? `ki:site:${part} present (dev fan-out)`
            : `ki:site:${part} missing — the concurrently dev script fans out to it`,
          subject: 'package.json'
        }))
      : [{ status: 'NOT_APPLICABLE', message: 'development script does not declare concurrently fan-out' }]
  }
)
export const WEB_32 = mechanical(
  'WEB-32',
  'site cleanup script',
  '`ki:site:clean` present. TypeScript checking belongs inside `ki:engineering:audit`; the aggregate gate is `ki:audit`, not a parallel site-specific verify script.',
  'WARN',
  (c) =>
    inactive(c) ?? [
      {
        status: script(c, 'clean') ? 'PASS' : 'VIOLATION',
        message: script(c, 'clean') ? 'clean script present' : 'no ki:site:clean script',
        subject: 'package.json'
      }
    ]
)
export const SCRIPTS: readonly RubricItem<WebsiteContext>[] = [WEB_30, WEB_31, WEB_32]
