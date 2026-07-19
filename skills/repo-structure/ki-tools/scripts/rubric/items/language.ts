import { mechanical, one } from './shared.ts'
export const LANG_DEFER = mechanical('LANG-DEFER', 'JavaScript toolchain deferral', 'A package.json-bearing tool defers lint and test to ki-engineering.', 'WARN', (c) => one(c.packageJson ? { status: 'INFO', message: 'package.json is present; lint and test defer to ki-engineering', subject: 'package.json' } : { status: 'NOT_APPLICABLE', message: 'package.json is absent.' }))
export const LANG = [LANG_DEFER] as const
