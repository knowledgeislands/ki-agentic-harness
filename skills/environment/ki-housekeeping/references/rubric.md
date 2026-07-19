<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — housekeeping

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `scripts/rubric/publish.ts`.

## SELF — Repository-local companion

→ [standard](standards.md)

Repository-local ki-self companion requirements.

- **SELF-1 [M] — Repository-local ki-self payloads** — For every recognised runtime declared by `[ki-repo].supported_runtimes`, the repository contains the `ki-self` payload at that runtime’s discovery path: `.claude/skills/ki-self/SKILL.md` for `claude-code`; `.agents/skills/ki-self/SKILL.md` for `codex`. Missing is a WARN. A symlink or non-regular file is a FAIL. (standards.md)
- **SELF-2 [M] — ki-self payload name** — Each present payload declares `name: ki-self`. A mismatch is a FAIL. (standards.md)
- **SELF-3 [M] — Runtime payload parity** — When several recognised runtimes are declared, their `ki-self` payloads are byte-identical. Drift is a FAIL. (standards.md)
- **SELF-4 [J] — Local-concerns contract** — The local skill gives its repository an intelligible local-concerns contract: regular work has a repeatable check or procedure; semi-regular human review has a ledger such as `HOUSEKEEPING.md`; one-off work remains on the roadmap; cross-repository patterns graduate to a named shared skill. (standards.md)
  - _Review prompt:_ The local skill gives its repository an intelligible local-concerns contract: regular work has a repeatable check or procedure; semi-regular human review has a ledger such as `HOUSEKEEPING.md`; one-off work remains on the roadmap; cross-repository patterns graduate to a named shared skill.

## IDX — Index/file agreement

→ [standard](memory-format.md)

Memory index and file agreement.

- **IDX-1 [M] — Memory index exists** — `MEMORY.md` exists in the resolved memory directory. Missing is a FAIL (a non-empty `memory/` with no index is unusable). (memory-format.md)
- **IDX-2 [M] — Index entries resolve** — Every `MEMORY.md` entry (`- [Title](file.md) — hook`) resolves to a file that exists in the directory. A dangling entry is a FAIL. (memory-format.md)
- **IDX-3 [M] — Memory files are indexed** — Every `memory/*.md` file (other than `MEMORY.md` itself) appears as an entry in the index. An unindexed file is a WARN (it’s invisible to future recall until indexed). (memory-format.md)
- **IDX-4 [M-heuristic] — Index line length** — Each index line stays at or under 150 characters. Over is a POLISH. (memory-format.md)
- **IDX-5 [M] — Headroom block markers** — The Headroom auto-generated block, if present, has both `<!-- headroom:learn:start -->` and `<!-- headroom:learn:end -->` markers, in order. A malformed pair is a WARN. (memory-format.md)
- **IDX-6 [M] — Headroom learned entries are local** — Entries _inside_ the `headroom:learn` block are not rooted in another repo. `headroom learn` captures patterns from whatever island the session ran in, so an absolute `knowledgeislands/<repo>` path whose `<repo>` differs from the audited repo is a stale cross-repo capture — dead weight in the always-on prefix. Any such line is a WARN and routes to CONFORM. Do not treat a hand-edit of the generated block as durable: select the Headroom database explicitly, locate the USER-scope record with `headroom memory list --db-path`, verify it with `memory show`, then remove the confirmed source with `memory delete`; re-learn in the correct repo when the pattern remains useful. The full show-before-delete procedure is in [memory-format.md](memory-format.md#repairing-a-regenerated-cross-repo-learned-pattern). Scoped to inside the markers, the heuristic keys on absolute KI-sibling roots and deliberately leaves relative `../sibling` refs alone, because a cross-repo governance repo uses those legitimately. (memory-format.md)

## FM — Frontmatter

→ [standard](memory-format.md)

Memory frontmatter requirements.

- **FM-1 [M] — Frontmatter is present** — Frontmatter block (`---` delimited) is present at the top of every `memory/*.md` file. Missing is a FAIL. (memory-format.md)
- **FM-2 [M] — Frontmatter name matches filename** — `name` field is present and matches the filename (minus `.md`), kebab-case. Mismatch is a FAIL. (memory-format.md)
- **FM-3 [M] — Frontmatter description is present** — `description` field is present and non-empty. Missing is a FAIL. (memory-format.md)
- **FM-4 [M] — Frontmatter type is valid** — `metadata.type` is present and is exactly one of `user`, `feedback`, `project`, `reference`. Missing or invalid is a FAIL. (memory-format.md)
- **FM-5 [M] — Frontmatter names are unique** — No two files share the same `name:` slug. A duplicate is a FAIL. (memory-format.md)

## LINK — Explicitly not checked

→ [standard](memory-format.md)

Informational link treatment.

- **LINK-1 [M-heuristic] — Unresolved wikilinks are informational** — `[[wikilink]]` cross-references that don’t resolve to another file’s `name:` slug are counted and reported as INFO only — the doctrine treats these as intentional forward references, not defects. (memory-format.md)

## DOC — Content doctrine

→ [standard](rubric.md)

Judgment-applied memory content doctrine.

- **DOC-1 [J] — Content doctrine** — `feedback` and `project` memories carry the rule/fact, then a **Why:** line and a **How to apply:** line — not just a bare assertion. (rubric.md)
  - _Review prompt:_ `feedback` and `project` memories carry the rule/fact, then a **Why:** line and a **How to apply:** line — not just a bare assertion.
- **DOC-2 [J] — Content doctrine** — `project` memories use absolute dates, not relative ones ("2026-03-05", not "Thursday"). (rubric.md)
  - _Review prompt:_ `project` memories use absolute dates, not relative ones ("2026-03-05", not "Thursday").
- **DOC-3 [J] — Content doctrine** — No memory duplicates content that belongs in a `CLAUDE.md` (codebase conventions, file layout, architecture, anything derivable from the repo or git history). Flag promotion candidates instead of leaving them to drift from the code. (rubric.md)
  - _Review prompt:_ No memory duplicates content that belongs in a `CLAUDE.md` (codebase conventions, file layout, architecture, anything derivable from the repo or git history). Flag promotion candidates instead of leaving them to drift from the code.
- **DOC-4 [J] — Content doctrine** — `user`-type memories describe role/preferences/knowledge neutrally — no content that reads as a negative judgment of the user. (rubric.md)
  - _Review prompt:_ `user`-type memories describe role/preferences/knowledge neutrally — no content that reads as a negative judgment of the user.
- **DOC-5 [J] — Content doctrine** — No memory is stale — a `project` memory whose fact or decision has visibly been superseded by current repo state (check against `git log`/current files, not the memory’s own text). (rubric.md)
  - _Review prompt:_ No memory is stale — a `project` memory whose fact or decision has visibly been superseded by current repo state (check against `git log`/current files, not the memory’s own text).
- **DOC-6 [J] — Semantic index ordering** — `MEMORY.md` entries are organized semantically by topic, not chronologically. (rubric.md)
  - _Review prompt:_ `MEMORY.md` entries are organized semantically by topic, not chronologically.
