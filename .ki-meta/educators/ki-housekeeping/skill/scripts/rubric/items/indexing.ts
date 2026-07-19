import type { AuditOutcome, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import { type HousekeepingRubricContext, INDEX_FILE } from '../contexts/housekeeping.ts'

const one = <Result>(outcome: Result): RubricOutcomes<Result> => [outcome]
const indexEntries = (index: string): string[] => [...index.matchAll(/^-\s*\[.+\]\(([^)]+\.md)\)/gm)].map((match) => match[1] as string)

const INDEX_ITEMS = [
  {
    code: 'IDX-1',
    title: 'Memory index exists',
    description:
      '`MEMORY.md` exists in the resolved memory directory. Missing is a FAIL (a non-empty `memory/` with no index is unusable).',
    sources: ['memory-format.md'],
    mechanical: {
      level: 'FAIL' as const,
      audit: {
        phase: 'INSPECT' as const,
        run: (c: HousekeepingRubricContext) =>
          one(
            !c.memoryExists
              ? { status: 'NOT_APPLICABLE', message: 'No memory directory for this repo yet.', subject: c.memoryDir }
              : {
                  status: c.index === null ? 'VIOLATION' : 'PASS',
                  message: c.index === null ? `${INDEX_FILE} not found in ${c.memoryDir}` : `${INDEX_FILE} exists`,
                  subject: INDEX_FILE
                }
          )
      },
      conform: {
        phase: 'PREPARE' as const,
        run: (c: HousekeepingRubricContext) =>
          one(
            c.index === null
              ? { status: 'NOT_APPLICABLE', message: 'MEMORY.md is missing; author the index manually.', subject: INDEX_FILE }
              : { status: 'PASS', message: 'MEMORY.md already exists.', subject: INDEX_FILE }
          )
      }
    }
  },
  {
    code: 'IDX-2',
    title: 'Index entries resolve',
    description:
      'Every `MEMORY.md` entry (`- [Title](file.md) — hook`) resolves to a file that exists in the directory. A dangling entry is a FAIL.',
    sources: ['memory-format.md'],
    mechanical: {
      level: 'FAIL' as const,
      audit: {
        phase: 'INSPECT' as const,
        run: (c: HousekeepingRubricContext) => {
          if (c.index === null) return one({ status: 'NOT_APPLICABLE', message: 'MEMORY.md is absent.', subject: INDEX_FILE })
          const names = new Set(c.memoryFiles.map((file) => file.file))
          const bad = indexEntries(c.index).filter((entry) => !names.has(entry))
          return bad.length
            ? (bad.map((entry) => ({
                status: 'VIOLATION' as const,
                message: `index entry points to missing file: ${entry}`,
                subject: INDEX_FILE
              })) as unknown as RubricOutcomes<AuditOutcome>)
            : one({ status: 'PASS', message: 'Every index entry resolves.', subject: INDEX_FILE })
        }
      }
    }
  },
  {
    code: 'IDX-3',
    title: 'Memory files are indexed',
    description:
      'Every `memory/*.md` file (other than `MEMORY.md` itself) appears as an entry in the index. An unindexed file is a WARN (it’s invisible to future recall until indexed).',
    sources: ['memory-format.md'],
    mechanical: {
      level: 'WARN' as const,
      audit: {
        phase: 'INSPECT' as const,
        run: (c: HousekeepingRubricContext) => {
          if (c.index === null) return one({ status: 'NOT_APPLICABLE', message: 'MEMORY.md is absent.', subject: INDEX_FILE })
          const indexed = new Set(indexEntries(c.index))
          const missing = c.memoryFiles.filter((file) => !indexed.has(file.file))
          return missing.length
            ? (missing.map((file) => ({
                status: 'VIOLATION' as const,
                message: `${file.file} is not listed in ${INDEX_FILE}`,
                subject: file.file
              })) as unknown as RubricOutcomes<AuditOutcome>)
            : one({ status: 'PASS', message: 'Every memory file is indexed.', subject: INDEX_FILE })
        }
      },
      conform: { phase: 'PRIMARY' as const, run: (c: HousekeepingRubricContext) => c.appendUnindexed() }
    }
  },
  {
    code: 'IDX-4',
    title: 'Index line length',
    description: 'Each index line stays at or under 150 characters. Over is a POLISH.',
    sources: ['memory-format.md'],
    mechanical: {
      level: 'WARN' as const,
      overrideLevels: ['WARN' as const],
      heuristic: true,
      audit: {
        phase: 'INSPECT' as const,
        run: (c: HousekeepingRubricContext) => {
          if (c.index === null) return one({ status: 'NOT_APPLICABLE', message: 'MEMORY.md is absent.', subject: INDEX_FILE })
          const long = c.index.split('\n').filter((line) => /^-\s*\[.+\]\(.+\.md\)/.test(line) && line.length > 150)
          return long.length
            ? (long.map((line) => ({
                status: 'VIOLATION' as const,
                message: `index line exceeds 150 chars: ${line.slice(0, 60)}...`,
                subject: INDEX_FILE
              })) as unknown as RubricOutcomes<AuditOutcome>)
            : one({ status: 'PASS', message: 'Index lines stay within 150 characters.', subject: INDEX_FILE })
        }
      }
    }
  },
  {
    code: 'IDX-5',
    title: 'Headroom block markers',
    description:
      'The Headroom auto-generated block, if present, has both `<!-- headroom:learn:start -->` and `<!-- headroom:learn:end -->` markers, in order. A malformed pair is a WARN.',
    sources: ['memory-format.md'],
    mechanical: {
      level: 'WARN' as const,
      audit: {
        phase: 'INSPECT' as const,
        run: (c: HousekeepingRubricContext) => {
          if (c.index === null) return one({ status: 'NOT_APPLICABLE', message: 'MEMORY.md is absent.', subject: INDEX_FILE })
          const start = c.index.indexOf('<!-- headroom:learn:start -->')
          const end = c.index.indexOf('<!-- headroom:learn:end -->')
          return one(
            start === -1 && end === -1
              ? { status: 'PASS', message: 'No headroom:learn block is present.', subject: INDEX_FILE }
              : start === -1 || end === -1 || end < start
                ? { status: 'VIOLATION', message: 'headroom:learn block has malformed markers', subject: INDEX_FILE }
                : { status: 'PASS', message: 'headroom:learn block markers well-formed', subject: INDEX_FILE }
          )
        }
      }
    }
  },
  {
    code: 'IDX-6',
    title: 'Headroom learned entries are local',
    description:
      'Entries _inside_ the `headroom:learn` block are not rooted in another repo. `headroom learn` captures patterns from whatever island the session ran in, so an absolute `knowledgeislands/<repo>` path whose `<repo>` differs from the audited repo is a stale cross-repo capture — dead weight in the always-on prefix. Any such line is a WARN and routes to CONFORM. Do not treat a hand-edit of the generated block as durable: select the Headroom database explicitly, locate the USER-scope record with `headroom memory list --db-path`, verify it with `memory show`, then remove the confirmed source with `memory delete`; re-learn in the correct repo when the pattern remains useful. The full show-before-delete procedure is in [memory-format.md](memory-format.md#repairing-a-regenerated-cross-repo-learned-pattern). Scoped to inside the markers, the heuristic keys on absolute KI-sibling roots and deliberately leaves relative `../sibling` refs alone, because a cross-repo governance repo uses those legitimately.',
    sources: ['memory-format.md'],
    mechanical: {
      level: 'WARN' as const,
      audit: {
        phase: 'INSPECT' as const,
        run: (c: HousekeepingRubricContext) => {
          if (c.index === null) return one({ status: 'NOT_APPLICABLE', message: 'MEMORY.md is absent.', subject: INDEX_FILE })
          const start = c.index.indexOf('<!-- headroom:learn:start -->')
          const end = c.index.indexOf('<!-- headroom:learn:end -->')
          if (start === -1 || end === -1 || end < start)
            return one({ status: 'NOT_APPLICABLE', message: 'No well-formed headroom:learn block to inspect.', subject: INDEX_FILE })
          const lines = c.index.slice(start, end).split('\n')
          const foreign = new Set<string>()
          let count = 0
          for (const line of lines) {
            const names = [...line.matchAll(/knowledgeislands\/([A-Za-z0-9_-]+)/g)]
              .map((match) => match[1])
              .filter((name) => name !== c.repoName)
            if (names.length) {
              count++
              names.forEach((name) => {
                foreign.add(name)
              })
            }
          }
          return one(
            foreign.size
              ? {
                  status: 'VIOLATION',
                  message: `headroom:learn block has ${count} line(s) rooted in other repo(s) (${[...foreign].join(', ')}) — remove the source with headroom memory list/show/delete --db-path; re-learn here if still useful`,
                  subject: INDEX_FILE
                }
              : { status: 'PASS', message: 'headroom:learn block contains no foreign-repository entries.', subject: INDEX_FILE }
          )
        }
      }
    }
  }
] as const

export const IDX_1 = INDEX_ITEMS[0]
export const IDX_2 = INDEX_ITEMS[1]
export const IDX_3 = INDEX_ITEMS[2]
export const IDX_4 = INDEX_ITEMS[3]
export const IDX_5 = INDEX_ITEMS[4]
export const IDX_6 = INDEX_ITEMS[5]
export const INDEX_1 = INDEX_ITEMS[0]
export const INDEX_2 = INDEX_ITEMS[1]
export const INDEX_3 = INDEX_ITEMS[2]
export const INDEX_4 = INDEX_ITEMS[3]
export const INDEX_5 = INDEX_ITEMS[4]
export const INDEX_6 = INDEX_ITEMS[5]

export const INDEX = [INDEX_1, INDEX_2, INDEX_3, INDEX_4, INDEX_5, INDEX_6] as const
