# Skill rubric — the full criteria catalogue

The checkable criteria behind `knowledgeislands-skills`. Each is tagged **[M] mechanical** (the bundled [linter](../scripts/lint-skills.ts) checks it) or **[J]
judgment** (you assess it by reading). The **code** in bold (`NAME-1`, `DESC-2`, …) is an area's short code plus its number _within that area_ — it's what the
linter prints and what an audit should cite. Numbering restarts at 1 in each area, so inserting a criterion only renumbers its own area. Source abbreviations
resolve in [the source list](sources.md); exact numbers are collected in the table at the end.

A criterion's tag is a contract with the linter: if you find yourself eyeballing an **[M]** check, run the linter instead; if the linter ever starts enforcing a
**[J]** check, move its tag here.

## Contents

- [LAY — File existence & layout](#lay--file-existence--layout)
- [NAME — Frontmatter: name](#name--frontmatter-name)
- [DESC — Frontmatter: description](#desc--frontmatter-description)
- [OPT — Frontmatter: optional fields](#opt--frontmatter-optional-fields)
- [SIZE — Body: size & conciseness](#size--body-size--conciseness)
- [REF — Progressive disclosure & references](#ref--progressive-disclosure--references)
- [BODY — Body content quality](#body--body-content-quality)
- [SCRIPT — Scripts & executable code](#script--scripts--executable-code)
- [LINK — Linking & portability](#link--linking--portability-knowledge-islands-house-rules)
- [SHAPE — Knowledge Islands skill shape](#shape--knowledge-islands-skill-shape)
- [PROC — Process / meta](#proc--process--meta-not-checkable-from-files-alone)
- [COLL — Cross-skill collision](#coll--cross-skill-collision)
- [LONG — Longevity](#long--longevity)
- [Disagreements & moving targets](#disagreements--moving-targets)
- [Exact numbers](#exact-numbers)

## LAY — File existence & layout

- **LAY-1 [M]** `SKILL.md` exists at the skill root — the required entrypoint; everything else is optional. (SPEC, CC)
- **LAY-2 [M]** The skill is a **directory** named after the skill, with `SKILL.md` inside — not a bare `.md`. (SPEC, CC)
- **LAY-3 [M]** Optional subdirs use the standard names: `references/` (docs), `scripts/` (executables), `assets/` (templates/data). Other files are allowed;
  these names are the convention. (SPEC)
- **LAY-4 [M]** File references use forward slashes (`scripts/helper.ts`), never backslashes — backslashes break on Unix. (BP)
- **LAY-5 [J]** Reference files are **one level deep** from `SKILL.md` — every supporting file links directly from it; no nested chains (SKILL → a → b → c),
  which cause partial reads that miss content. (BP, SPEC)
- **LAY-6 [J]** Supporting files are named by content (`form-validation-rules.md`, not `doc2.md`). (BP)

## NAME — Frontmatter: name

- **NAME-1 [M]** `name` present. The open spec requires it; in Claude Code it defaults to the directory name, but a portable skill states it. (SPEC, CC — see
  ※1)
- **NAME-2 [M]** `name` ≤ 64 characters. (SPEC, BP)
- **NAME-3 [M]** `name` is lowercase letters, digits, hyphens only — no uppercase, spaces, or underscores. (SPEC, BP)
- **NAME-4 [M]** `name` has no leading/trailing hyphen and no consecutive hyphens. (SPEC)
- **NAME-5 [M]** `name` matches the parent directory name exactly. (SPEC)
- **NAME-6 [M]** `name` contains no XML tags and no reserved words (`anthropic`, `claude`). (BP)
- **NAME-7 [J]** `name` is specific, not generic — avoid `helper`, `utils`, `tools`, `data`. Gerund (`processing-pdfs`), noun phrase (`pdf-processing`), or
  action form (`process-pdfs`) all read well. (BP)

## DESC — Frontmatter: description

- **DESC-1 [M]** `description` present and non-empty. (SPEC; "recommended" in CC, which else falls back to the first paragraph.)
- **DESC-2 [M]** `description` ≤ 1024 characters (spec hard cap). (SPEC, BP — see ※2)
- **DESC-3 [M]** `description` contains no XML tags (angle-bracket placeholders inside backticks are fine). (BP)
- **DESC-4 [J]** States **both** what the skill does **and** when to use it — capability + trigger, not one alone. (SPEC, BP)
- **DESC-5 [J]** Written in the **third person** ("Audits skills…"), never first/second ("I can…", "You can…"); it is injected into the system prompt. (BP,
  COMMUNITY)
- **DESC-6 [J]** Includes concrete **trigger keywords/phrases** a user would actually say — file types, verbs, nouns. It is the only signal at selection time
  among potentially 100+ skills. (SPEC, BP, CC)
- **DESC-7 [J]** Leans toward firing (Claude tends to _under_-trigger), and front-loads the most important trigger (the listing truncates). (ENG, COMMUNITY, CC)
- **DESC-8 [J]** Avoids vague phrasing ("helps with documents", "does stuff with files"). (SPEC, BP)
- **DESC-9 [J]** _(Advanced)_ Where skill-collision is likely, may end with explicit non-triggers ("Do NOT use for…"). Community pattern. (COMMUNITY)

## OPT — Frontmatter: optional fields

- **OPT-1 [M]** `compatibility`, if present, is 1–500 chars; include only for real environment requirements. (SPEC)
- **OPT-2 [M]** `metadata`, if present, is a string→string map. (SPEC)
- **OPT-3 [M]** `allowed-tools` / `disallowed-tools`, if present, are valid tool specs. `allowed-tools` is **experimental** in the open spec. (SPEC, CC)
- **OPT-4 [M]** `license`, if present, is a short license name or bundled-file reference. (SPEC)
- **OPT-5 [J]** Claude-Code-only fields (`disable-model-invocation`, `user-invocable`, `context`, `agent`, `paths`, `model`, `effort`, `when_to_use`,
  `argument-hint`, `arguments`, `hooks`, `shell`) are CC extensions, not in the open spec — flag them when cross-platform portability matters. `shell` sets the
  interpreter (`bash` or `powershell`) for CC's dynamic context injection (`` !`cmd` `` blocks). (CC — see ※3)
- **OPT-6 [J]** Side-effecting / manually-timed workflows (deploy, commit, send) set `disable-model-invocation: true` so they can't auto-fire. Note: this also
  removes the skill's description from Claude's context listing entirely (the description is never injected), unlike the default where description is always in
  context. Contrast `user-invocable: false`, which hides the skill from the `/` menu while keeping the description in context for Claude. (CC)
- **OPT-7 [J]** A skill with **discrete operating modes** (e.g. AUDIT / AUTHOR / REFRESH) sets `argument-hint` so the modes surface in the `/` menu and a user
  can route to one as `/<name> <mode>` without reading the body — preferred over splitting one cohesive skill into a slash command per mode, which multiplies
  the resident description cost (~100 tokens each) and fragments the trigger surface. **Name the modes (`AUDIT`, `REFRESH`), don't letter them** — named modes
  keep cross-references stable when a mode is inserted, and read consistently across the skill set (a shared `REFRESH` mode means the same thing everywhere).
  **Order the modes alphabetically** in both the body and the `argument-hint` — a new mode then has one obvious insertion point, and diffs stay localised
  instead of renumbering a sequence. CC-only field (see OPT-5); omit where the skill has a single mode or no meaningful argument. (CC, COMMUNITY)

## SIZE — Body: size & conciseness

- **SIZE-1 [M]** `SKILL.md` body is under **500 lines**. Split into reference files as it approaches the cap. (SPEC, BP, CC)
- **SIZE-2 [M]** Body instructions stay under **~5,000 tokens** (recommended progressive-disclosure budget; ~100 tokens for metadata). (SPEC)
- **SIZE-3 [J]** No token spent on what a competent Claude already knows — apply the "does Claude need this?" test to every paragraph. (BP)
- **SIZE-4 [J]** `SKILL.md` reads as an **overview that routes to detail**, not all detail inlined; once loaded it persists across turns as recurring cost. (BP,
  SPEC, CC)

## REF — Progressive disclosure & references

- **REF-1 [J]** Detailed or rarely-used material lives in separate files loaded on demand; mutually-exclusive domains are split (`references/finance.md` vs
  `references/sales.md`) so irrelevant context isn't loaded. (BP, ENG, SPEC)
- **REF-2 [J]** Every supporting file is referenced from `SKILL.md` with a note on what it holds and when to load it — no orphan files. (BP, CC, SPEC)
- **REF-3 [M]** Reference files longer than 100 lines open with a table of contents, so a partial read still shows full scope. (BP, COMMUNITY)
- **REF-4 [J]** Execution intent is explicit per script: "Run `x.ts`" (execute) vs "see `x.ts` for the algorithm" (read). (BP, ENG)

## BODY — Body content quality

- **BODY-1 [J]** Degrees of freedom match task fragility: prose + judgment for open-ended; parameterised scripts for preferred-but-flexible; exact commands +
  "do not modify" for fragile/destructive. (BP, COMMUNITY)
- **BODY-2 [J]** No time-sensitive content in the main body ("before August 2025…"); legacy goes in a collapsed "old patterns" note. (BP)
- **BODY-3 [J]** Consistent terminology — one term per concept, reused (always "field", never field/box/element). (BP, COMMUNITY)
- **BODY-4 [J]** Concrete examples (2–3 input/output pairs) where output quality depends on style. (BP, COMMUNITY)
- **BODY-5 [J]** One default approach with an escape hatch, not a menu of options. (BP)
- **BODY-6 [J]** Templates match required strictness — "use this exact structure" for data contracts; "sensible default, adapt" for flexible documents. (BP,
  COMMUNITY)
- **BODY-7 [J]** Multi-step tasks provide a copyable checklist; quality-critical tasks include a feedback loop (run validator → fix → repeat). (BP, COMMUNITY)
- **BODY-8 [J]** Rules state the _why_ alongside the rule, not bare MUST/NEVER. (COMMUNITY)

## SCRIPT — Scripts & executable code

- **SCRIPT-1 [J]** Scripts solve problems rather than punt to Claude — handle expected errors (missing file, permissions) explicitly. (BP)
- **SCRIPT-2 [J]** No unexplained magic numbers — every config value is justified in a comment. (BP)
- **SCRIPT-3 [J]** Required packages are listed and verified for the target runtime; don't assume tools are installed (the Claude API has no network/runtime
  install). When the skill invokes MCP tools, use fully-qualified `ServerName:tool_name` names — without the server prefix, Claude may fail to locate the tool
  when multiple MCP servers are loaded. (BP)
- **SCRIPT-4 [J]** Deterministic, frequently-reused logic is pre-written as a script, not regenerated each run. (BP)
- **SCRIPT-5 [J]** Validation scripts are verbose — error messages name the problem and the valid options. (BP)
- **SCRIPT-6 [J]** Plan-validate-execute for batch/destructive ops: produce a verifiable intermediate artifact, validate it, then act. (BP, COMMUNITY)

## LINK — Linking & portability (Knowledge Islands house rules)

- **LINK-1 [M]** Internal links are **standard relative markdown links**, not Obsidian wikilinks — they must survive relocation and symlinking. (arcadia-skills
  README)
- **LINK-2 [M]** Links resolve — every relative link target exists on disk (angle-bracket form for paths with spaces). (arcadia-skills README)
- **LINK-3 [J]** Other skills are referenced by their `name` ("the `knowledgeislands-kb` skill"), never by file path — a skill's on-disk location is not stable.
  (arcadia-skills README)
- **LINK-4 [J]** The house toolchain passes: Biome (TS/JSON), Prettier + markdownlint-cli2 (markdown). (arcadia-skills README)

## SHAPE — Knowledge Islands skill shape

- **SHAPE-1 [J]** A **standard** Knowledge Islands skill carries reusable mode logic and resolves base-level bindings (store aliases, scope, writing standards)
  at runtime from the host base's `CLAUDE.md` and memory index — it hard-codes **no single base**. (arcadia-skills README, `knowledgeislands-kb`)
- **SHAPE-2 [J]** A **base-coupled extension** supplies only base-specific pre-flight/bindings and delegates the shared modes to a standard skill **by name** —
  both load into the session. (arcadia-skills README)
- **SHAPE-3 [J]** The skill declares its **kind** (Knowledge Islands / process / scoped) clearly enough that a reader can place it. (arcadia-skills README)

## PROC — Process / meta (not checkable from files alone)

- **PROC-1 [J]** Built evaluation-first — at least three evaluation scenarios against a no-skill baseline before extensive docs. (BP, ENG)
- **PROC-2 [J]** Tested across the models it will run on (Haiku/Sonnet/Opus) and with real usage. (BP)

## COLL — Cross-skill collision

Most criteria above audit **one** `SKILL.md` in isolation; these check it against its **siblings**. Run the linter over the **whole set** (point it at the repo,
not one skill) so the collision pass has the siblings to compare.

- **COLL-1 [M]** _Shared triggers._ Within an audited set of ≥ 2 skills, no two `description`s declare the **same quoted trigger phrase**. The linter extracts
  the quoted phrases from each description and WARNs on any shared one. Two skills that fire on the identical phrase compete at selection time; an explicit
  off-ramp in the prose (COLL-2) can make it acceptable, which is why this is a WARN, not a FAIL. (COMMUNITY, arcadia-skills README)
- **COLL-2 [J]** _Semantic overlap & reciprocal off-ramps._ Beyond exact-string sharing, read sibling descriptions for overlapping _capability scope_. Where two
  skills could plausibly fire on one request, **each** description must name the other as the off-ramp — the reciprocal `knowledgeislands-mcp` ↔
  `knowledgeislands-skills` pattern ("…to audit an MCP server, use the `knowledgeislands-mcp` skill instead"). A one-directional guard is a half-fix. This
  promotes DESC-9 from a per-skill _option_ ("may add non-triggers") to a **set-level requirement** wherever real overlap exists. (COMMUNITY, arcadia-skills
  README)

## LONG — Longevity

These check the skill against **time** — they matter most once it ships into a shared or cloud catalogue, where it is long-lived and far from its author.

- **LONG-1 [J]** _Volatile facts & a refresh path._ A skill that hard-codes facts that drift — model IDs/prices, API or SDK versions, tool / MCP-server names,
  CLI flags, dated spec numbers, third-party URLs — rots silently, and a skill installed into a cloud/Cowork catalogue is remote from its author and cannot be
  eyeballed when the world moves. Such a skill must either **(a)** resolve the volatile fact at runtime rather than hard-code it, or **(b)** carry a tracked
  source list with `last reviewed` dates **and** a REFRESH mode that re-anchors it (as `knowledgeislands-skills` and `knowledgeislands-mcp` do). Audit:
  enumerate the volatile references; for each, confirm a runtime resolution or a refresh mechanism, and that the refresh path names what to re-fetch and how to
  tell it has gone stale. This extends BODY-2 (no time-sensitive content in the body) from prose hygiene to a durability guarantee. (BP, COMMUNITY)
- **LONG-2 [J]** _A cadence, not just a capability._ A REFRESH mode nobody runs decays as surely as no refresh at all — and a skill in a cloud/Cowork catalogue
  has no author watching it. So a skill that ships a refresh path should also state a **cadence** (periodic, or a clear "run when X" trigger) and, where the
  host supports it, register a scheduled run (in Claude Code, a `/schedule` routine that invokes the REFRESH mode) so staying current doesn't depend on someone
  remembering. Audit: a refresh mode exists (LONG-1) **and** the skill says how often it should run and how that run is initiated. Treat the schedule as a
  recommendation, not a hard requirement — but flag a refresh capability with no stated cadence as a half-measure. (COMMUNITY)

## Disagreements & moving targets

- **※1 `name` required vs optional.** Open spec: required, must match the directory. Claude Code: optional (defaults to directory name). For portable skills,
  always state it and match the directory.
- **※2 Description length.** Authoring cap is **1024 chars** (spec, BP). Claude Code's _runtime_ listing truncates `description` + `when_to_use` at **1,536
  chars** (configurable; budget scales ~1% of context). Author to 1024; the larger number is a display limit, not an authoring target.
- **※3 CC-only frontmatter.** Many Claude Code fields aren't in the open spec; valid in CC, may not port to Cowork/other platforms. CC also adds non-frontmatter
  extensions: dynamic context injection (`` !`cmd` `` or ` ```! ` fenced blocks — run shell commands whose output is inlined before Claude sees the skill) and
  string substitutions (`$ARGUMENTS`, `$ARGUMENTS[N]`, `$N`, `$name`, `${CLAUDE_SESSION_ID}`, `${CLAUDE_EFFORT}`, `${CLAUDE_SKILL_DIR}`). These are CC runtime
  features, not part of the open spec. (CC)
- **※4 Commands → skills.** In Claude Code, `.claude/commands/*.md` and `.claude/skills/<name>/SKILL.md` both yield `/<name>`; skills are the recommended form.
  Suggest migrating old command files.
- **※5 Budgets are soft.** "< 500 lines" and "< 5,000 tokens" are performance recommendations, not enforced — the linter reports them as WARN, never FAIL. The
  reference validator (`skills-ref validate`) checks frontmatter/naming only.

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
