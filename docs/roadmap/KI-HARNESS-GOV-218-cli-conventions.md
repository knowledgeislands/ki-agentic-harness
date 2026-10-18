---
id: KI-HARNESS-GOV-218
area: GOV
title: Command-line conventions
kind: deliver
purpose: governance
project: ways-of-working
component: repo-structure
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 78b04030f1ca8c131a130bd019509a345aa05047
created_at: 2026-10-18T17:55:48Z
updated_at: 2026-10-18T18:38:30Z
---

# KI-HARNESS-GOV-218: Command-Line Conventions

## Goal

`ki-repo-tools` carries the common Unix and Linux command-line conventions as design guidance for KI tools: option syntax, common flag letters, symbolic-link options, standard streams, exit statuses, terminal and colour behaviour, and XDG directories, with their sources cited.

## Context

Kris Brown suggested it on 18 October 2026, recorded in the ways-of-working decisions log under "owner suggestion, CLI conventions": "Can I also suggest that any common params and handling that are unix / linux standards are captured in the `ki-tools` skill so that can act as design guidance." Kris corrected the home a minute later, under "owner correction, CLI conventions home": "I meant the `ki-repo-tools` skill then", read back as a reference linked from its SKILL.md, with no KI-TOOLS-SKILL query.

The `mgit-learn` run's survey of `-P`, `-L` and `-H` across POSIX and GNU tools fed the symbolic-link section. No open harness record covered command-line design, so this one record carries it.

## Boundary

- In: a new `references/standards-cli-conventions.md` in `ki-repo-tools`; links to it from `SKILL.md`, the tool-repository standard's shared CLI conventions, and the audit and scaffold modes; the external sources in `references/sources.md`.
- Out: rubric items, since hosted audit never runs a tool and the guidance is judged by reading help, manuals and tests; any change to `tools-ki`, `tools-mgit` or `tools-rig`, whose departures go to the run report for their owners; a release.

## Current state

The tool-repository standard set house rules for `--help`, exit statuses 0, 1 and 2, the `help`, `completion`, `diag` and `doctor` commands, and XDG directories, but said nothing about option syntax, which letters mean what, symbolic-link options, streams, `NO_COLOR`, prompts or signals.

## Steps

- [x] Write the command-line conventions reference from the POSIX utility conventions, GNU coding standards, Bash exit statuses, clig.dev, `NO_COLOR` and the XDG specification, keeping house rules with the tool-repository standard.
- [x] Link it from `SKILL.md`, the standard's shared CLI conventions, Mode AUDIT's judgement pass and Mode EDUCATE's scaffold.
- [x] Record the sources and the review in `references/sources.md`.
- [x] Compare `tools-ki`, `tools-mgit` and `tools-rig` with it, read-only, and report the departures.
- [x] Run Verify.

## Files touched

- `skills/repo-structure/ki-repo-tools/references/standards-cli-conventions.md` (new)
- `skills/repo-structure/ki-repo-tools/SKILL.md`
- `skills/repo-structure/ki-repo-tools/references/standards-tool-repositories.md`, `mode-audit.md`, `mode-educate.md` and `sources.md`
- `skills/keystone/ki-repo/references/standards-configuration.md`, for the `--filter` house form
- this record and `docs/roadmap/_ISSUES.md`

## Verify

- `bun run test` and `bunx tsc --noEmit` pass.
- `ki dev skill rubric ki-repo-tools` reports the rubric current.
- `ki repo audit --skill ki-skills` and `--skill ki-authoring` report no new failure in the contract under change.

## Dependencies / blocks

None.

## Documentation impact

### Decision Records

None: the guidance is Kris Brown's CLI-CONVENTIONS suggestion and its correction.

### Specifications

None.

### Guides

None: the tools' own developer guides keep their local procedures.

### Roadmap

None in this repository. Tool departures are reported to their owners rather than captured here.

## Review

### Delivered

`ki-repo-tools` has a command-line conventions reference, linked from its SKILL.md, standard, audit judgement pass and scaffold steps, with seven external sources recorded. No rubric item, tool code or release changed.

### Change Summary

- The commit carrying this record: the new reference, its links, the sources, and this record.
- A follow-on commit for CLI-F-FILTER c): the house rule that a working-set name filter is the long `--filter <prefix>` with no short letter, and the shared KI and mgit selection rule in `ki-repo` without `-f`.

### Verification

On 18 October 2026, before commit: `bun run test` passed 1255 tests and `bunx tsc --noEmit` passed; `ki dev skill rubric ki-repo-tools` reports the rubric in sync; `ki repo audit --skill ki-skills` and `--skill ki-authoring` pass. `ki repo audit --skill ki-work-roadmap` passes this record; its two failures are in KI-HARNESS-GOV-210's review packet and another session's uncommitted KI-HARNESS-GOV-219, both outside this record. `ki-repo-tools` is not declared in this repository, so it has no focused audit here.

### Outstanding concerns

- The sources were cited from their published text and not re-fetched in this run; the next external-spec REFRESH re-reads them.

### Post-change review

None.

### Mini recap

KI tools now have one place that says which flags, streams, exit statuses, colour rules and directories users expect.

## Discussion

Captured by the `cli-conventions` run of the ways-of-working Project work as the one harness record for CLI-CONVENTIONS.

Kris answered CLI-F-FILTER c) on 18 October 2026, under "owner answer, CLI-F-FILTER; mark" in the [ways-of-working decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.ways-of-working/decisions.md): "I'm thinking we just go with `--filter` and no short version". The `mgit-filter` run folded it here: the reference records `--filter` with no short letter as the house form, so `-f` stays reserved for force or file and the `-f` filter is no longer a departure. tools-mgit made `-f` a usage error naming `--filter`; tools-ki's change rides in the ki-release run.
