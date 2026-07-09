/**
 * Eval scenarios for the `ki-websites-11ty` skill — the site-build delta.
 *
 * Design note: a capable model knows Eleventy and Tailwind generically, so testing that
 * shows "no difference". These scenarios target house-ARBITRARY specifics a baseline
 * cannot derive: the config-less-Tailwind + portable-dist invariants, the run-TS-natively
 * rule (no transpile, tsx legacy), and the flat-vs-`site/` layout with its `site:` prefix.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-websites-11ty',
    id: 'web-invariants',
    prompt:
      'What are the defining invariants of our Knowledge Islands 11ty website standard — specifically how Tailwind is configured, and how the build makes `dist/` portable?',
    assertions: [
      { name: 'config-less Tailwind (no tailwind.config)', re: /config-less|no tailwind\.config|without a tailwind\.config/i },
      { name: 'import tailwindcss in main.css', re: /@import ["']?tailwindcss|tailwindcss["']? (then|import)/i },
      { name: 'portable dist via URL transform', re: /(addTransform|relative)[^.\n]{0,40}(url|link)|absolute[^.\n]{0,20}relative/i }
    ],
    rubric:
      'House invariants: (1) **config-less Tailwind 4** — there is NO `tailwind.config.*`; `main.css` is `@import "tailwindcss"` then `tokens.css`, whose semantic CSS vars reach utilities via `@theme inline`. (2) The build emits a **portable `dist/`** — an `addTransform` rewrites absolute internal URLs to relative ones so `dist/` serves from any root (this is the seam the hosting skill consumes). A correct answer states the no-config-file Tailwind setup and the absolute→relative URL transform that makes dist/ portable.'
  },
  {
    skill: 'ki-websites-11ty',
    id: 'web-ts-native',
    prompt: 'In our 11ty sites, how is the TypeScript (`eleventy.config.ts`, `_data/*.ts`) executed at build time, and what role does `tsc` play?',
    assertions: [
      { name: 'runs natively under Bun, no transpile', re: /nativ|no transpile|without transpil|run.{0,12}under bun/i },
      { name: 'tsc is type-check only', re: /tsc[^.\n]{0,30}(type-check|--noEmit|check only|noEmit)|type-check only/i },
      { name: 'tsx is legacy', re: /tsx[^.\n]{0,20}legacy|legacy[^.\n]{0,12}tsx/i }
    ],
    rubric:
      'House rule: TypeScript **runs natively — no transpile step**. `eleventy.config.ts` and `_data/*.ts` execute directly under Bun, with `.ts` + `.json5` data extensions registered in the config. `tsc` is **type-check only** (`--noEmit`, engineering\'s layer), never a build/transpile step; `tsx` is **legacy**. A correct answer states TS runs natively under Bun (no transpile), tsc is type-check only, and tsx is legacy.'
  },
  {
    skill: 'ki-websites-11ty',
    id: 'web-site-prefix',
    prompt:
      'Our 11ty repo is flat with the site at the repo root. If we add a second deployable (say an ingress Worker) to the same repo, where does the site move, where does its build output go, and what happens to its package.json scripts?',
    assertions: [
      { name: 'site moves under site/', re: /site\//i },
      { name: 'dist becomes ../dist', re: /\.\.\/dist/ },
      { name: 'scripts take a site: prefix', re: /site:[a-z]|site: prefix|`site:`/i }
    ],
    rubric:
      'House convention: the flat layout (site at repo root, `./dist`) is conformant for a single deployable. When the repo also holds **unrelated deployables**, the site moves under **`site/`** (`site/eleventy.config.ts`, `site/src/` building to `../dist`) and its scripts take a **`site:` prefix**. Both layouts are conformant. A correct answer names the `site/` subfolder, the `../dist` output, and the `site:` script prefix.'
  }
]
