# Skill rubric — the full criteria catalogue

The checkable criteria behind `knowledgeislands-skills`. Each is tagged **[M] mechanical** (the bundled [linter](../scripts/lint-skills.ts) checks it) or **[J] judgment** (you assess it by reading). The **code** in bold (`B7`, `C14`, …) is what the linter prints and what an audit should cite. Source abbreviations resolve in [the source list](sources.md); exact numbers are collected in the table at the end.

A criterion's tag is a contract with the linter: if you find yourself eyeballing an **[M]** check, run the linter instead; if the linter ever starts enforcing a **[J]** check, move its tag here.

## Contents

- [A. File existence & layout](#a-file-existence--layout)
- [B. Frontmatter — name](#b-frontmatter--name)
- [C. Frontmatter — description](#c-frontmatter--description)
- [D. Frontmatter — optional fields](#d-frontmatter--optional-fields)
- [E. Body — size & conciseness](#e-body--size--conciseness)
- [F. Progressive disclosure & references](#f-progressive-disclosure--references)
- [G. Body content quality](#g-body-content-quality)
- [H. Scripts & executable code](#h-scripts--executable-code)
- [I. Linking & portability](#i-linking--portability-knowledge-islands-house-rules)
- [J. Knowledge Islands skill shape](#j-knowledge-islands-skill-shape)
- [K. Process / meta](#k-process--meta-not-checkable-from-files-alone)
- [Disagreements & moving targets](#disagreements--moving-targets)
- [Exact numbers](#exact-numbers)

## A. File existence & layout

- **A1 [M]** `SKILL.md` exists at the skill root — the required entrypoint; everything else is optional. (SPEC, CC)
- **A2 [M]** The skill is a **directory** named after the skill, with `SKILL.md` inside — not a bare `.md`. (SPEC, CC)
- **A3 [M]** Optional subdirs use the standard names: `references/` (docs), `scripts/` (executables), `assets/` (templates/data). Other files are allowed; these names are the convention. (SPEC)
- **A4 [M]** File references use forward slashes (`scripts/helper.ts`), never backslashes — backslashes break on Unix. (BP)
- **A5 [J]** Reference files are **one level deep** from `SKILL.md` — every supporting file links directly from it; no nested chains (SKILL → a → b → c), which cause partial reads that miss content. (BP, SPEC)
- **A6 [J]** Supporting files are named by content (`form-validation-rules.md`, not `doc2.md`). (BP)

## B. Frontmatter — name

- **B7 [M]** `name` present. The open spec requires it; in Claude Code it defaults to the directory name, but a portable skill states it. (SPEC, CC — see ※1)
- **B8 [M]** `name` ≤ 64 characters. (SPEC, BP)
- **B9 [M]** `name` is lowercase letters, digits, hyphens only — no uppercase, spaces, or underscores. (SPEC, BP)
- **B10 [M]** `name` has no leading/trailing hyphen and no consecutive hyphens. (SPEC)
- **B11 [M]** `name` matches the parent directory name exactly. (SPEC)
- **B12 [M]** `name` contains no XML tags and no reserved words (`anthropic`, `claude`). (BP)
- **B13 [J]** `name` is specific, not generic — avoid `helper`, `utils`, `tools`, `data`. Gerund (`processing-pdfs`), noun phrase (`pdf-processing`), or action form (`process-pdfs`) all read well. (BP)

## C. Frontmatter — description

- **C14 [M]** `description` present and non-empty. (SPEC; "recommended" in CC, which else falls back to the first paragraph.)
- **C15 [M]** `description` ≤ 1024 characters (spec hard cap). (SPEC, BP — see ※2)
- **C16 [M]** `description` contains no XML tags (angle-bracket placeholders inside backticks are fine). (BP)
- **C17 [J]** States **both** what the skill does **and** when to use it — capability + trigger, not one alone. (SPEC, BP)
- **C18 [J]** Written in the **third person** ("Audits skills…"), never first/second ("I can…", "You can…"); it is injected into the system prompt. (BP, COMMUNITY)
- **C19 [J]** Includes concrete **trigger keywords/phrases** a user would actually say — file types, verbs, nouns. It is the only signal at selection time among potentially 100+ skills. (SPEC, BP, CC)
- **C20 [J]** Leans toward firing (Claude tends to _under_-trigger), and front-loads the most important trigger (the listing truncates). (ENG, COMMUNITY, CC)
- **C21 [J]** Avoids vague phrasing ("helps with documents", "does stuff with files"). (SPEC, BP)
- **C22 [J]** _(Advanced)_ Where skill-collision is likely, may end with explicit non-triggers ("Do NOT use for…"). Community pattern. (COMMUNITY)

## D. Frontmatter — optional fields

- **D23 [M]** `compatibility`, if present, is 1–500 chars; include only for real environment requirements. (SPEC)
- **D24 [M]** `metadata`, if present, is a string→string map. (SPEC)
- **D25 [M]** `allowed-tools` / `disallowed-tools`, if present, are valid tool specs. `allowed-tools` is **experimental** in the open spec. (SPEC, CC)
- **D26 [M]** `license`, if present, is a short license name or bundled-file reference. (SPEC)
- **D27 [J]** Claude-Code-only fields (`disable-model-invocation`, `user-invocable`, `context`, `agent`, `paths`, `model`, `effort`, `when_to_use`, `argument-hint`, `arguments`, `hooks`, `shell`) are CC extensions, not in the open spec — flag them when cross-platform portability matters. `shell` sets the interpreter (`bash` or `powershell`) for CC's dynamic context injection (`` !`cmd` `` blocks). (CC — see ※3)
- **D28 [J]** Side-effecting / manually-timed workflows (deploy, commit, send) set `disable-model-invocation: true` so they can't auto-fire. Note: this also removes the skill's description from Claude's context listing entirely (the description is never injected), unlike the default where description is always in context. Contrast `user-invocable: false`, which hides the skill from the `/` menu while keeping the description in context for Claude. (CC)

## E. Body — size & conciseness

- **E29 [M]** `SKILL.md` body is under **500 lines**. Split into reference files as it approaches the cap. (SPEC, BP, CC)
- **E30 [M]** Body instructions stay under **~5,000 tokens** (recommended progressive-disclosure budget; ~100 tokens for metadata). (SPEC)
- **E31 [J]** No token spent on what a competent Claude already knows — apply the "does Claude need this?" test to every paragraph. (BP)
- **E32 [J]** `SKILL.md` reads as an **overview that routes to detail**, not all detail inlined; once loaded it persists across turns as recurring cost. (BP, SPEC, CC)

## F. Progressive disclosure & references

- **F33 [J]** Detailed or rarely-used material lives in separate files loaded on demand; mutually-exclusive domains are split (`references/finance.md` vs `references/sales.md`) so irrelevant context isn't loaded. (BP, ENG, SPEC)
- **F34 [J]** Every supporting file is referenced from `SKILL.md` with a note on what it holds and when to load it — no orphan files. (BP, CC, SPEC)
- **F35 [M]** Reference files longer than 100 lines open with a table of contents, so a partial read still shows full scope. (BP, COMMUNITY)
- **F36 [J]** Execution intent is explicit per script: "Run `x.ts`" (execute) vs "see `x.ts` for the algorithm" (read). (BP, ENG)

## G. Body content quality

- **G37 [J]** Degrees of freedom match task fragility: prose + judgment for open-ended; parameterised scripts for preferred-but-flexible; exact commands + "do not modify" for fragile/destructive. (BP, COMMUNITY)
- **G38 [J]** No time-sensitive content in the main body ("before August 2025…"); legacy goes in a collapsed "old patterns" note. (BP)
- **G39 [J]** Consistent terminology — one term per concept, reused (always "field", never field/box/element). (BP, COMMUNITY)
- **G40 [J]** Concrete examples (2–3 input/output pairs) where output quality depends on style. (BP, COMMUNITY)
- **G41 [J]** One default approach with an escape hatch, not a menu of options. (BP)
- **G42 [J]** Templates match required strictness — "use this exact structure" for data contracts; "sensible default, adapt" for flexible documents. (BP, COMMUNITY)
- **G43 [J]** Multi-step tasks provide a copyable checklist; quality-critical tasks include a feedback loop (run validator → fix → repeat). (BP, COMMUNITY)
- **G44 [J]** Rules state the _why_ alongside the rule, not bare MUST/NEVER. (COMMUNITY)

## H. Scripts & executable code

- **H45 [J]** Scripts solve problems rather than punt to Claude — handle expected errors (missing file, permissions) explicitly. (BP)
- **H46 [J]** No unexplained magic numbers — every config value is justified in a comment. (BP)
- **H47 [J]** Required packages are listed and verified for the target runtime; don't assume tools are installed (the Claude API has no network/runtime install). When the skill invokes MCP tools, use fully-qualified `ServerName:tool_name` names — without the server prefix, Claude may fail to locate the tool when multiple MCP servers are loaded. (BP)
- **H48 [J]** Deterministic, frequently-reused logic is pre-written as a script, not regenerated each run. (BP)
- **H49 [J]** Validation scripts are verbose — error messages name the problem and the valid options. (BP)
- **H50 [J]** Plan-validate-execute for batch/destructive ops: produce a verifiable intermediate artifact, validate it, then act. (BP, COMMUNITY)

## I. Linking & portability (Knowledge Islands house rules)

- **I51 [M]** Internal links are **standard relative markdown links**, not Obsidian wikilinks — they must survive relocation and symlinking. (arcadia-skills README)
- **I52 [M]** Links resolve — every relative link target exists on disk (angle-bracket form for paths with spaces). (arcadia-skills README)
- **I53 [J]** Other skills are referenced by their `name` ("the `knowledgeislands-kb` skill"), never by file path — a skill's on-disk location is not stable. (arcadia-skills README)
- **I54 [J]** The house toolchain passes: Biome (TS/JSON), Prettier + markdownlint-cli2 (markdown). (arcadia-skills README)

## J. Knowledge Islands skill shape

- **J55 [J]** A **standard** Knowledge Islands skill carries reusable mode logic and resolves base-level bindings (store aliases, scope, writing standards) at runtime from the host base's `CLAUDE.md` and memory index — it hard-codes **no single base**. (arcadia-skills README, `knowledgeislands-kb`)
- **J56 [J]** A **base-coupled extension** supplies only base-specific pre-flight/bindings and delegates the shared modes to a standard skill **by name** — both load into the session. (arcadia-skills README)
- **J57 [J]** The skill declares its **kind** (Knowledge Islands / process / scoped) clearly enough that a reader can place it. (arcadia-skills README)

## K. Process / meta (not checkable from files alone)

- **K58 [J]** Built evaluation-first — at least three evaluation scenarios against a no-skill baseline before extensive docs. (BP, ENG)
- **K59 [J]** Tested across the models it will run on (Haiku/Sonnet/Opus) and with real usage. (BP)

## Disagreements & moving targets

- **※1 `name` required vs optional.** Open spec: required, must match the directory. Claude Code: optional (defaults to directory name). For portable skills, always state it and match the directory.
- **※2 Description length.** Authoring cap is **1024 chars** (spec, BP). Claude Code's _runtime_ listing truncates `description` + `when_to_use` at **1,536 chars** (configurable; budget scales ~1% of context). Author to 1024; the larger number is a display limit, not an authoring target.
- **※3 CC-only frontmatter.** Many Claude Code fields aren't in the open spec; valid in CC, may not port to Cowork/other platforms. CC also adds non-frontmatter extensions: dynamic context injection (`` !`cmd` `` or ` ```! ` fenced blocks — run shell commands whose output is inlined before Claude sees the skill) and string substitutions (`$ARGUMENTS`, `$ARGUMENTS[N]`, `$N`, `$name`, `${CLAUDE_SESSION_ID}`, `${CLAUDE_EFFORT}`, `${CLAUDE_SKILL_DIR}`). These are CC runtime features, not part of the open spec. (CC)
- **※4 Commands → skills.** In Claude Code, `.claude/commands/*.md` and `.claude/skills/<name>/SKILL.md` both yield `/<name>`; skills are the recommended form. Suggest migrating old command files.
- **※5 Budgets are soft.** "< 500 lines" and "< 5,000 tokens" are performance recommendations, not enforced — the linter reports them as WARN, never FAIL. The reference validator (`skills-ref validate`) checks frontmatter/naming only.

## Exact numbers

| Item                               | Value               | Hard/Soft | Source     |
| ---------------------------------- | ------------------- | --------- | ---------- |
| `name` max length                  | 64 chars            | hard      | SPEC, BP   |
| `description` max length           | 1024 chars          | hard      | SPEC, BP   |
| `compatibility` length             | 1–500 chars         | hard      | SPEC       |
| `SKILL.md` body                    | < 500 lines         | soft      | SPEC,BP,CC |
| `SKILL.md` instructions            | < 5,000 tokens      | soft      | SPEC       |
| Metadata (name+desc) load cost     | ≈ 100 tokens        | info      | SPEC       |
| Reference-file ToC threshold       | > 100 lines         | soft      | BP         |
| Evaluations before sharing         | ≥ 3                 | rec.      | BP         |
| CC listing truncation (desc+when)  | 1,536 chars †       | runtime   | CC         |
| CC post-compaction per-skill keep  | first 5,000 tok     | runtime   | CC         |
| CC combined post-compaction budget | 25,000 tok combined | runtime   | CC         |

† Claude-Code-specific runtime limit, configurable; distinct from the portable 1024-char authoring cap.
