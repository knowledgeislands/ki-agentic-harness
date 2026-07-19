const DOC_ITEMS = [
  ['DOC-1', '`feedback` and `project` memories carry the rule/fact, then a **Why:** line and a **How to apply:** line — not just a bare assertion.'], ['DOC-2', '`project` memories use absolute dates, not relative ones ("2026-03-05", not "Thursday").'], ['DOC-3', 'No memory duplicates content that belongs in a `CLAUDE.md` (codebase conventions, file layout, architecture, anything derivable from the repo or git history). Flag promotion candidates instead of leaving them to drift from the code.'], ['DOC-4', '`user`-type memories describe role/preferences/knowledge neutrally — no content that reads as a negative judgment of the user.'], ['DOC-5', 'No memory is stale — a `project` memory whose fact or decision has visibly been superseded by current repo state (check against `git log`/current files, not the memory’s own text).'], ['DOC-6', '`MEMORY.md` entries are organized semantically by topic, not chronologically.']
].map(([code, description]) => ({ code, title: code === 'DOC-6' ? 'Semantic index ordering' : 'Content doctrine', description, sources: ['rubric.md'], judgment: { prompt: description } }))

export const DOC_1 = DOC_ITEMS[0]
export const DOC_2 = DOC_ITEMS[1]
export const DOC_3 = DOC_ITEMS[2]
export const DOC_4 = DOC_ITEMS[3]
export const DOC_5 = DOC_ITEMS[4]
export const DOC_6 = DOC_ITEMS[5]

export const DOC = [DOC_1, DOC_2, DOC_3, DOC_4, DOC_5, DOC_6] as const
