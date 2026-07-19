# Testing an individual skill

Use the source checker while developing one skill so its mechanical result is isolated from the repository's vendored `.ki-meta/` state and from unrelated skills.

From the harness repository root, run:

```bash
bun run ./skills/keystone/ki-skills/scripts/audit.ts \
  ./skills/<area>/<skill> \
  --reporter=terminal
```

For example, to test `ki-skills` itself:

```bash
bun run ./skills/keystone/ki-skills/scripts/audit.ts \
  ./skills/keystone/ki-skills \
  --reporter=terminal
```

The terminal reporter shows `FAIL` and `WARN` findings by default, followed by complete summary counts. Add `--reporter-levels=all` when investigating every mechanical outcome.

Omit `--reporter=terminal` when a script or test needs the canonical JSONL response. The checker still runs every selected rubric item; reporter levels filter presentation only.

Always pass the skill path when isolating one skill. With no target, the checker discovers skills from the current directory and may audit the whole harness. Use that repository-wide form when validating cross-skill criteria such as collisions.

Preview the same skill's safe mechanical repairs with:

```bash
bun run ./skills/keystone/ki-skills/scripts/conform.ts \
  ./skills/<area>/<skill> \
  --dry-run \
  --reporter=terminal
```

These commands exercise authored source. Package aliases such as `bun run ki:skills:audit` exercise the repository's vendored `.ki-meta/` checker through the aggregate reporter; re-vendor before using them to verify a source change.
