---
id: 'FND-007'
title: Make audit and conform command help conventional
status: open
roadmap: foundation-tooling/make-audit-and-conform-command-help-conventional
blocks: —
blocked-by: —
---

## Context

The public aggregate entrypoint backs `ki:audit`, `ki:conform`, and generated repository aliases.

Passing `-h` or `--help` today reaches governed checkers as if it were a normal run, producing checker output and invalid-report failures instead of command help.

## Current state

`aggregate.ts` parses reporter options before running vendored checkers, but has no help-only branch.

The `ki-bootstrap` source `audit.ts` and `conform.ts` entrypoints already render concise conventional help, so the missing behaviour is at the shared aggregate layer and its generated copies.

## Steps

1. Define the aggregate audit/conform help contract: accepted help flags, conventional Usage, Summary, and Options sections, zero checker execution, and a successful exit.
2. Implement that contract in the source-owned aggregate generator so `audit` and `conform` describe their own verb, supported `--skill`, progress, reporter, and dry-run options accurately.
3. Add focused source and bootstrapped-fixture tests for direct aggregate help and generated `ki-audit` / `ki-conform` aliases, including the no-checker-execution guarantee.
4. Re-vendor the generated aggregate payload, run focused help checks, then run the serial repository gates.

## Files touched

- `skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/`
- focused bootstrap and generated-command tests
- `.ki-meta/` generated payloads after re-vendoring

## Verify

- `audit --help` and `conform --help` exit successfully with conventional command help.
- Help invokes no governed checker and produces no checker report.
- Generated `ki-audit` and `ki-conform` aliases retain the same help behaviour.
- `bun run test`
- `bun run ki:audit`

## Dependencies / blocks

This plan has no external dependency.

It removes a broken public command path before broader checker and conform semantics work.
