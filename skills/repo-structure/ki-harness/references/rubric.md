<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — Knowledge Islands agentic harnesses

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `scripts/rubric/publish.ts`.

## Contents

- [CAP — Capability publication](#cap--capability-publication)
- [LAY — Directory layout and files](#lay--directory-layout-and-files)
- [CLAUDE — Root orientation](#claude--root-orientation)
- [PKG — Package script families](#pkg--package-script-families)
- [CONFIG — Harness configuration](#config--harness-configuration)
- [SKILLS — Skill directory convention](#skills--skill-directory-convention)
- [LONG — Longevity](#long--longevity)
- [COLL — Collision and boundary](#coll--collision-and-boundary)

## CAP — Capability publication

→ [standard](standards.md#capability-publication)

Typed harness capability inventory and kind-specific boundaries.

- **CAP-1 [J] — Capability inventory and boundaries** — Each populated harness shelf makes its typed capabilities discoverable and routes their content and runtime semantics to the owning kind standard. (standards.md#capability-publication)
  - _Review prompt:_ Review each populated shelf: are its capabilities discoverable as a typed harness inventory, and are kind-specific semantics delegated to the appropriate standard?

## LAY — Directory layout and files

→ [standard](standards.md#layout)

The five-part harness container and required root files.

- **LAY-1 [M] — Five-part directory layout** — skills/, agents/, mcp/, evals/, and hooks/ all exist at the harness root. (standards.md#layout)
- **LAY-2 [M] — Shelf descriptions** — Each five-part directory contains a README.md declaring its purpose and status. (standards.md#layout)
- **LAY-3 [M] — Root Claude orientation** — CLAUDE.md exists at the harness root. (standards.md#claudemd)
- **LAY-4 [M] — Root roadmap** — ROADMAP.md exists at the harness root. (standards.md#roadmapmd)
- **LAY-5 [M] — Root Knowledge Islands configuration** — .ki-config.toml exists at the harness root. (standards.md#ki-configtoml)

## CLAUDE — Root orientation

→ [standard](standards.md#claudemd)

Coverage and freshness of the effective root orientation.

- **CLAUDE-1 [J] — Harness introduction** — The root orientation opens by explaining the harness and naming all five parts. (standards.md#claudemd)
  - _Review prompt:_ Read the effective root orientation and assess whether its introduction explains the harness and names all five parts.
- **CLAUDE-2 [J] — Five-part status** — The root orientation gives a current status for every harness part. (standards.md#claudemd)
  - _Review prompt:_ Compare the orientation status table or equivalent block with the five actual harness directories.
- **CLAUDE-3 [J] — Working conventions** — The root orientation routes working conventions for every harness part. (standards.md#claudemd)
  - _Review prompt:_ Assess whether each harness part has concise, usable working guidance or a route to its governing skill.
- **CLAUDE-4 [J] — Toolchain commands** — The root orientation lists the key harness toolchain commands. (standards.md#claudemd)
  - _Review prompt:_ Verify that the documented commands cover the current project-copy and skill-audit entry points.
- **CLAUDE-5 [J] — Orientation freshness** — Counts, shelf statuses, and command names in the orientation match the repository. (standards.md#claudemd)
  - _Review prompt:_ Compare orientation claims with package.json, skills/, and the five harness shelves for stale facts.

## PKG — Package script families

→ [standard](standards.md#packagejson)

Harness-owned package scripts and their target integrity.

- **PKG-1 [M] — Project skill delivery script** — package.json contains the normal ki:skills:copy:project delivery entry. (standards.md#packagejson)
- **PKG-2 [M] — Skill audit script** — package.json contains the ki:skills:audit quality gate. (standards.md#packagejson)
- **PKG-4 [M] — Harness development and evaluation scripts** — package.json carries the repository linking, global linking, refresh-status, and evaluation entries. (standards.md#packagejson)
- **PKG-5 [J] — Checker invocation documentation** — Governed-repository documentation uses generated .ki checker entry points rather than harness-only package aliases. (standards.md#packagejson)
  - _Review prompt:_ Review user-facing documentation and ensure vendored checker invocations are canonical outside harness-only guidance.
- **PKG-6 [M] — Package script target integrity** — Every ki:* bun or bunx script target names a file that exists below the harness root. (standards.md#packagejson)

## CONFIG — Harness configuration

→ [standard](standards.md#ki-configtoml)

Knowledge Islands governance declarations.

- **CONFIG-1 [M] — Harness declaration** — .ki-config.toml contains a ki-harness root table. (standards.md#ki-configtoml)
- **CONFIG-2 [M] — Repository governance declaration** — .ki-config.toml contains a ki-repo root table. (standards.md#ki-configtoml)
- **CONFIG-3 [J] — Skill governance declaration** — A populated skills/ directory is declared through ki-skills. (standards.md#ki-configtoml)
  - _Review prompt:_ When skills/ is populated, verify that .ki-config.toml declares the ki-skills governance root.

## SKILLS — Skill directory convention

→ [standard](standards.md#skills-directory)

Direct skill-name integrity within the harness.

- **SKILLS-1 [M] — Skill directory and name alignment** — Each direct skills/ entry with a SKILL.md matches its name frontmatter. (standards.md#skills-directory)
- **SKILLS-2 [M + J] — Unique skill names** — No two local skill entries share a frontmatter name, and composed surfaces remain unambiguous. (standards.md#skills-directory)
  - _Review prompt:_ Assess whether another installed or composed surface makes an otherwise unique local skill name ambiguous.

## LONG — Longevity

→ [standard](standards.md)

Refresh discipline for the harness standard.

- **LONG-1 [J] — Refresh path** — The ki-harness skill carries REFRESH and a dated source review record. (standards.md)
  - _Review prompt:_ Review the ki-harness REFRESH procedure and sources.md cadence for a usable current refresh path.

## COLL — Collision and boundary

→ [standard](standards.md)

Composition and off-ramp clarity.

- **COLL-1 [J] — Composition boundary** — AUDIT names its composed sibling checks and the description provides contents-governing off-ramps. (standards.md)
  - _Review prompt:_ Review the AUDIT composition list and description off-ramps for complete, non-overlapping ownership.
