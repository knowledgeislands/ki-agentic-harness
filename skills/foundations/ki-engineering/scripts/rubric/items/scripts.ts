import { judgment, mechanical } from './common.ts'

export const SCR_1 = mechanical(
  'SCR-1',
  'ki script naming law',
  'Every script is a permitted bare lifecycle idiom or carries the `ki:` prefix; a bare non-idiom name is drift.',
  'FAIL'
)
export const SCR_2 = mechanical(
  'SCR-2',
  'aggregate audit and conform entrypoints',
  'Both `ki:audit` and `ki:conform` fan out over the vendored per-skill modes.',
  'FAIL'
)
export const SCR_3 = mechanical(
  'SCR-3',
  'retired script families absent',
  'Retired `ki:lint:*`, `ki:deps:*`, `ki:knip`, `ki:verify`, and per-skill lint keys are absent.',
  'FAIL'
)
export const SCR_4 = mechanical(
  'SCR-4',
  'derived checker entrypoints',
  'Every checker payload in `.ki-meta/checkers/<skill>/` is reachable through derived `ki:<suffix>:audit` and `ki:<suffix>:conform` keys.',
  'FAIL'
)
export const SCR_5 = mechanical(
  'SCR-5',
  'lifecycle clean and prepare scripts',
  '`clean` removes `node_modules` (and `dist` where built), and `prepare` is `husky`.',
  'FAIL',
  ['WARN']
)
export const SCR_6 = mechanical(
  'SCR-6',
  'no direct Bun test runner',
  'No script value contains `bun test`; use `bun run test` so the governed package script runs.',
  'FAIL'
)
export const SCR_7 = mechanical(
  'SCR-7',
  'runner-neutral test and build entrypoints',
  'Test-capable repos expose bare `test`; compiled repos expose bare `build`; neither is appended to aggregate entrypoints.',
  'FAIL'
)
export const SCR_8 = judgment(
  'SCR-8',
  'repo-specific scripts retain clear ownership',
  'Repo-specific scripts beyond the governance surface are valid only when an owning skill governs them and they do not shadow a governed entrypoint.',
  'Do repo-specific scripts have a clear owner and avoid divergent shadows of governed entrypoints?'
)
export const SCR = [SCR_1, SCR_2, SCR_3, SCR_4, SCR_5, SCR_6, SCR_7, SCR_8] as const
