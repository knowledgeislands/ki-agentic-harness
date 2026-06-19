# Harness Audit Rubric

Line-by-line criteria for auditing a Knowledge Islands agentic harness. Each criterion is tagged **[M]** (mechanical — the checker
[`scripts/audit-harness.ts`](../scripts/audit-harness.ts) enforces it deterministically) or **[J]** (judgment — a reader/model assesses it).
Each cites its standard section.

Severity ladder: FAIL / WARN / POLISH / ADVISORY / INFO / SKIP / PASS  
(defined in `knowledgeislands-engineering`'s enforcement-framework §2)

## Contents

- [LAY — Directory layout and file presence](#lay--directory-layout-and-file-presence)
- [CLAUDE — CLAUDE.md coverage and freshness](#claude--claudemd-coverage-and-freshness)
- [PKG — package.json script families](#pkg--packagejson-script-families)
- [CONFIG — .ki-config.toml declarations](#config--ki-configtoml-declarations)
- [SKILLS — skills/ directory convention](#skills--skills-directory-convention)
- [ROAD — ROADMAP.md discipline](#road--roadmapmd-discipline)
- [LONG — Longevity and refresh path](#long--longevity-and-refresh-path)
- [COLL — Collision and boundary](#coll--collision-and-boundary)

---

## LAY — Directory layout and file presence

**LAY-1 [M]** `skills/`, `agents/`, `mcp/`, `evals/` all exist as directories at the repo root. Source: standard §Layout. _Severity: FAIL —
missing directory breaks the four-part contract._

**LAY-2 [M]** Each of the four directories contains a `README.md`. Source: standard §Layout. _Severity: WARN — README.md absent means no
shelf/status declaration._

**LAY-3 [M]** `CLAUDE.md` exists at the repo root. Source: standard §CLAUDE.md. _Severity: FAIL — CLAUDE.md is the always-loaded
orientation; its absence means agents navigate blind._

**LAY-4 [M]** `ROADMAP.md` exists at the repo root. Source: standard §ROADMAP.md. _Severity: WARN — harnesses without a roadmap lose the
open-work signal._

**LAY-5 [M]** `.ki-config.toml` exists at the repo root. Source: standard §.ki-config.toml. _Severity: FAIL — no config means no KI
compliance declaration._

---

## CLAUDE — CLAUDE.md coverage and freshness

**CLAUDE-1 [J]** `CLAUDE.md` opens with a what-the-harness-is paragraph that names all four parts (`skills/`, `agents/`, `mcp/`, `evals/`).
Source: standard §CLAUDE.md §1. _Severity: WARN — a CLAUDE.md that doesn't describe the harness contract fails its orientation purpose._

**CLAUDE-2 [J]** `CLAUDE.md` has a four-part directory table (or equivalent block) with current status for each part (populated / empty
shelf). Source: standard §CLAUDE.md §2. _Severity: WARN._

**CLAUDE-3 [J]** `CLAUDE.md` documents working conventions for each part (which command runs it, which skill governs it, any install step).
May be brief with routes to `docs/` or the relevant skill. Source: standard §CLAUDE.md §3. _Severity: POLISH — missing conventions degrade
developer UX but don't break correctness._

**CLAUDE-4 [J]** `CLAUDE.md` lists the key `bun run *` toolchain commands (at minimum `skills:link` and `skills:lint`). Source: standard
§CLAUDE.md §4. _Severity: POLISH._

**CLAUDE-5 [J]** `CLAUDE.md` reflects current state: skill counts, shelf statuses, and command names match the actual repo. Check against
`package.json` and `skills/` directory listing. Source: standard §CLAUDE.md freshness rule. _Severity: WARN if counts or statuses are wrong;
POLISH for minor drift (a deprecated command listed but present)._

---

## PKG — package.json script families

**PKG-1 [M]** `package.json` contains a `skills:link` script. Source: standard §package.json §skills:link. _Severity: FAIL — the primary
install mechanism is absent._

**PKG-2 [M]** `package.json` contains a `skills:lint` script. Source: standard §package.json §skills:lint. _Severity: FAIL — the skill
quality gate is absent._

**PKG-3 [M]** `package.json` contains the common engineering families: `lint:check`, `lint:types`, `lint:md`, `lint:md:check`. Source:
standard §package.json, `knowledgeislands-engineering`'s toolchain standard. _Severity: WARN per missing script. (A harness with no
TypeScript may omit `lint:check` / `lint:types` with a documented reason — check `.ki-config.toml` for an override before reporting.)_

---

## CONFIG — .ki-config.toml declarations

**CONFIG-1 [M]** `.ki-config.toml` contains a `[knowledgeislands-harness]` table. Source: standard §.ki-config.toml. _Severity: FAIL — the
harness compliance marker is absent; `knowledgeislands-repo`'s coverage cascade will WARN on this._

**CONFIG-2 [M]** `.ki-config.toml` contains a `[knowledgeislands-repo]` table. Source: standard §.ki-config.toml. _Severity: WARN — the repo
opted into KI governance at all._

**CONFIG-3 [J]** If `skills/` is populated, `.ki-config.toml` contains `[knowledgeislands-skills]`. Source: `knowledgeislands-repo`'s
coverage cascade. _Severity: WARN — detected artifact without opt-in._

---

## SKILLS — skills/ directory convention

**SKILLS-1 [M]** For each `skills/<dir>` that contains a `SKILL.md`: the directory name exactly matches the `name:` frontmatter field in
that `SKILL.md`. Source: standard §Skills directory. _Severity: FAIL — name/path mismatch breaks agent skill discovery._

**SKILLS-2 [J]** No two `skills/` entries share a `name:` frontmatter value. (The `knowledgeislands-skills` cross-skill linter pass — COLL-1
— also checks this; don't double-report what it surfaces.) Source: Agent Skills specification; standard §Skills directory. _Severity: FAIL —
duplicate names are ambiguous at selection time._

---

## ROAD — ROADMAP.md discipline

**ROAD-1 [J]** `ROADMAP.md` contains only open work. No completed items, no ticked checkboxes, no "~~done~~" entries. Items are removed when
done, not checked off. Source: standard §ROADMAP.md rule 1. _Severity: WARN — closed items obscure the open-work signal._

**ROAD-2 [J]** `ROADMAP.md` does not list continuous practices (standing audits, monthly REFRESH runs, ongoing toolchain maintenance) as
roadmap items. Source: standard §ROADMAP.md rule 2. _Severity: POLISH — continuous practices belong in `docs/design.md` or `CLAUDE.md`._

---

## LONG — Longevity and refresh path

**LONG-1 [J]** This skill itself has a REFRESH mode and a `references/sources.md` with a `## Last review` block and `last reviewed` dates.
Source: `knowledgeislands-skills` rubric LONG-1/LONG-2; `knowledgeislands-engineering` enforcement-framework. _Severity: WARN on the skill,
not the harness under audit — report separately._

---

## COLL — Collision and boundary

**COLL-1 [J]** The harness AUDIT mode names each sibling skill it composes on, and the harness `SKILL.md` description names the off-ramps
for all four contents-governing skills (`knowledgeislands-skills`, `knowledgeislands-agents`, `knowledgeislands-mcp`,
`knowledgeislands-engineering`, `knowledgeislands-repo`). Source: `knowledgeislands-skills` rubric COLL-2; `docs/design.md` _No silent
collisions_. _Severity: WARN on the skill — check this when auditing the skill itself via `skills:lint`._
