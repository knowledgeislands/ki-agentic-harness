---
name: knowledgeislands-skills
description: >
  Audit, review, and author Agent Skills against current best practice. Use when creating a new skill, reviewing or critiquing an existing SKILL.md, checking a
  skill before it ships, asking "is this skill any good / well-written / discoverable", or refreshing the house rubric against new community guidance. Carries a
  checkable rubric (split into mechanical checks a bundled linter runs, and judgment checks you apply), the Knowledge Islands skill conventions, and a tracked
  source list it revisits. Triggers: "audit this skill", "review my skill", "is this SKILL.md good", "write a new skill", "scaffold a skill", "lint the skills",
  "check skills against best practice", "refresh the skills rubric", "what do we expect from a skill". Judges a `SKILL.md` itself (frontmatter + body prose) —
  not a repo's code or configuration.
argument-hint: 'audit <skill-or-repo> | author <description> | refresh'
---

# Knowledge Islands Skills

You are helping author or audit **Agent Skills** — directories with a `SKILL.md` (frontmatter + body), per the
[Agent Skills open standard](https://agentskills.io/). This skill is the house rubric for what a _good_ skill looks like, plus the three modes you run over it.

The canonical home for these skills is the **arcadia-skills** repository; its `README.md` covers install, the symlink workflow, and the Knowledge Islands
structure. This skill governs skill _quality_, not installation.

## The two-layer model

Every criterion is one of two kinds — never conflate them:

- **Mechanical** — deterministically checkable. A bundled linter ([`scripts/lint-skills.ts`](scripts/lint-skills.ts)) runs these: file exists, frontmatter
  parses, `name` matches the directory and the charset rules, length caps, link resolution, no wikilinks. **Always run the linter first** — do not eyeball what
  a script checks better.
- **Judgment** — needs a model. You assess these by reading: is the `description` trigger-rich and third-person, is the body at the right altitude, is detail
  correctly pushed into `references/`, does a standard skill avoid hard-coding one base. The linter cannot judge these.

The conventions a good skill follows — what each is and why — live in [the Agent Skills standard](references/agent-skills-standard.md); the line-by-line
checkable criteria (with `[M]`/`[J]` tags and codes) live in [the rubric](references/audit-rubric.md), each citing its standard section. Load both before an
AUDIT or AUTHOR; this body is the routing overview.

## Mode AUDIT — review an existing skill

Review a skill (or every skill in a repo) against the rubric and report.

1. **Run the linter.** `bun scripts/lint-skills.ts <path-to-skill-or-repo>` from this skill's directory (or `bun run skills:lint` at the arcadia-skills repo
   root). It reports the mechanical criteria as PASS / WARN / FAIL and exits non-zero on any FAIL. Capture its output verbatim — do not re-derive what it found.
   Point it at the **repo**, not a lone skill, so the cross-skill collision pass (COLL-1) has the siblings to compare.
2. **Read the `SKILL.md`** (and any `references/`, `scripts/`, `assets/`) and apply the **judgment** ([J]-tagged) criteria from
   [the rubric](references/audit-rubric.md) — the linter owns the [M] ones. Focus on:
   - **Description** — does it state both _what it does_ and _when to use it_, in the third person, with concrete trigger phrases a user would actually say?
     This is the only signal at selection time.
   - **Altitude & conciseness** — is anything in the body something a competent Claude already knows? Is detail that's read rarely pushed into `references/`
     rather than inlined?
   - **Progressive disclosure** — is every bundled file referenced from `SKILL.md` with a note on when to load it? Any orphan files?
   - **Knowledge Islands fit** — is it correctly a _standard_ skill (resolves base bindings at runtime, hard-codes no base) or a _base-coupled extension_
     (delegates shared modes to a standard skill by `name`)? See [the rubric](references/audit-rubric.md) area SHAPE.
   - **Collision & longevity** — for any trigger the linter flags as shared (or that you judge semantically overlapping), does **each** description name the
     other as an off-ramp, or is the guard one-directional? And does the skill hard-code volatile facts (model IDs, API / tool names, URLs, dated specs) without
     resolving them at runtime or carrying a refresh path — the staleness that bites hardest once a skill ships to a cloud catalogue it can't be eyeballed in?
     See [the rubric](references/audit-rubric.md) areas COLL and LONG.
3. **Report** as a table: criterion → verdict (✅ pass / ⚠️ warn / ❌ fail) → the specific fix. Lead with FAILs, then WARNs, then a one-line overall verdict.
   Cite the rubric criterion number. Offer to apply the fixes.

## Mode AUTHOR — write a new skill

1. **Clarify scope first**: what should fire the skill (the triggers), what kind it is (Knowledge Islands / process / scoped — see arcadia-skills `README.md`),
   and whether it's a standard skill or a base-coupled extension.
2. **Scaffold** `<name>/SKILL.md` with `references/`, `scripts/`, `assets/` only as needed. The directory name **is** the `name:` frontmatter (lowercase,
   hyphenated, in sync).
3. **Write to the rubric, not from memory** — open [the rubric](references/audit-rubric.md) and satisfy each criterion as you draft. In particular: trigger-rich
   third-person `description`; body under 500 lines / ~5,000 tokens; one default approach with an escape hatch, not a menu; detail in `references/`; relative
   markdown links (angle-bracket form for paths with spaces), never wikilinks; refer to other skills by `name`, never path.
4. **Self-audit before finishing** — run Mode AUDIT on the new skill. Author and audit share one rubric on purpose.

## Mode REFRESH — re-anchor best practice

Keep the rubric current — the standard and the community move, and this is why the skill tracks its own sources.

1. **Read [the source list](references/sources.md)** — the tracked authoritative + community sources, each with a `last reviewed` date and what it governs.
2. **Re-fetch each source** (WebFetch/WebSearch) and **diff against the current [standard](references/agent-skills-standard.md) +
   [rubric](references/audit-rubric.md)**: new required/optional frontmatter fields, changed caps (length, line, token budgets), new anti-patterns,
   deprecations. Note where sources disagree.
3. **Scan our own skills** in the arcadia-skills repo for emergent patterns that work but aren't yet codified — promote the good ones into the standard +
   rubric; flag drift that contradicts them.
4. **Propose a diff** to [the standard](references/agent-skills-standard.md) and [rubric](references/audit-rubric.md) and, where relevant,
   [the linter](scripts/lint-skills.ts) (a newly-mechanical check should move from judgment into the script). Confirm before writing.
5. **Update [the source list](references/sources.md)** — bump each `last reviewed` date, add any new source, retire any dead one. This step is mandatory: the
   source list is the skill's memory of where best practice comes from.

## Notes

- **Run the linter, then judge.** The linter owns the mechanical layer; you own the judgment layer. Reporting a mechanical failure the linter already catches,
  or hand-waving a judgment call the linter can't make, are both misses.
- A WARN is not a FAIL. Line/token budgets and the third-person description heuristic are _recommendations_ — report them, but a skill can ship over a soft cap
  with a reason.
- This skill audits skills, including itself. When you change the rubric, re-run Mode AUDIT on `knowledgeislands-skills`.
