# Onboarding a repo to Knowledge Islands governance

How to bring a repository under Knowledge Islands governance so it **governs itself** — running `./.ki-meta/bin/ki-audit` (or `bun run ki:audit` where the repo has a `package.json`) with **zero skills installed** — and how to migrate a legacy repo off old formats. This guide is the operating manual for the bootstrap chain (ADR-KI-HARNESS-007); its fenced command blocks are executable and are exercised by the harness's own test suite, so they cannot drift from what actually works.

## The four modes

Every governance skill carries the same four universal modes (ADR-KI-HARNESS-SKILLS-001):

| Mode        | What it does                                                                           |
| ----------- | -------------------------------------------------------------------------------------- |
| **INIT**    | Bring a repo under governance — vendor the checkers, wire the `ki:*` keys. Onboarding. |
| **AUDIT**   | Report drift against the standard, on the severity ladder. Read-only.                  |
| **CONFORM** | Bring the repo into line — apply the mechanical fixes AUDIT found.                     |
| **REFRESH** | Re-anchor a standard against its tracked sources when the outside world moves.         |

Onboarding is **INIT**. The other three are the day-to-day loop once a repo is governed.

## What INIT does

For every skill in the resolved set — the baseline (`ki-repo`, `ki-authoring`), plus every `[ki-<skill>]` table the target declares in its `.ki-config.toml`, plus their `implies:` closure — INIT:

1. **vendors copies** of the skill's checker scripts into the target's `.ki-meta/skills/<skill>/` (copies, not symlinks, so they run standalone);
2. **writes** the package.json-free runner — a `.ki-meta/bin/aggregate.ts` that discovers those copies and fans out over them, plus a `.ki-meta/bin/ki-audit` wrapper that invokes it and a `.ki-meta/bin/ki-init` wrapper for later re-syncs — and **stamps** a vendoring manifest (`.ki-meta/manifest.json`: the harness ref plus a hash per vendored file);
3. **where the target has a `package.json`**, additionally installs that skill's `ki:<suffix>:{audit,conform}` keys and the repo-wide `ki:audit` / `ki:conform` / `ki:init` aggregates as convenience aliases over the same runner.

After INIT the repo governs itself with `./.ki-meta/bin/ki-audit` — no `package.json` and **no skills installed anywhere** required. A `.ki-meta/` is dot-prefixed and generated-not-authored, so it stays off the repo's own `scripts/`.

## Prerequisites

You need [Bun](https://bun.sh) and a checkout of the harness. The examples reference it through `KI_HARNESS`; set it to your harness path:

```bash
export KI_HARNESS="${KI_HARNESS:-$(pwd)}"
```

## Greenfield: a fresh repo

A new repo needs only a `.ki-config.toml` (declaring at least `[ki-repo]`; the `ki-authoring` baseline is added automatically). A `package.json` is optional — with one you also get the `ki:*` convenience keys, without one the repo self-governs through `./.ki-meta/bin/ki-audit` alone. Bootstrap it, then confirm it self-governs:

```bash
bun "$KI_HARNESS/skills/ki-bootstrap/scripts/bootstrap.ts" "$TARGET"
```

```bash
cd "$TARGET" && bun run ki:audit
```

The first command vendors the baseline checkers into `.ki-meta/`, writes `.ki-meta/bin/ki-audit`, and (since this fixture has a `package.json`) also splices the `ki:*` convenience keys; the second runs the vendored aggregate, which invokes each skill's checker in sequence — with nothing installed in `.claude/skills/`. A repo without a `package.json` runs the identical check with `./.ki-meta/bin/ki-audit`.

## Legacy: migrating an existing repo

A repo carrying old formats migrates by the **same** chain, with one flag. `--legacy` runs INIT and then a full `ki:conform` pass, applying every mechanical fix in one go:

```bash
bun "$KI_HARNESS/skills/ki-bootstrap/scripts/bootstrap.ts" "$TARGET" --legacy
```

Use `--tracking` instead to run INIT and then a read-only `ki:audit` — report the drift without changing anything — when you want to see the gap before committing to the fixes.

## The remote-run transport

The canonical, zero-install form runs the chain straight from the harness on GitHub — no clone, no global install — pinned to a ref (default `main`), in the usual `curl | bash` installer idiom:

```text
curl -fsSL https://raw.githubusercontent.com/knowledgeislands/ki-agentic-harness/main/skills/ki-bootstrap/scripts/bootstrap.sh | bash -s -- <target> [--ref <ref>] [--legacy | --tracking] [--dry-run]
```

The entry point assumes only bash, curl, and tar: it fetches the harness source tarball at the ref, extracts it to a temp dir, and runs the chain engine from that tree. Bun is required as the mechanical layer's runtime (the engine and every vendored checker are TypeScript) — if it is missing the script fails fast with the install instruction rather than installing it silently.

A single skill's INIT is reachable the same way through its own `scripts/init.ts` in the extracted tree, which seeds that skill (plus its `implies:` closure) into the target. This is the primary path for both a greenfield repo and a legacy migration: the mechanics and the vendored result are identical to a local run.

## Day-to-day, once governed

- `./.ki-meta/bin/ki-audit` (or `bun run ki:audit` where a `package.json` exists) — report drift across every governed skill (the aggregate).
- `./.ki-meta/bin/ki-audit conform` (or `bun run ki:conform`) — apply the mechanical fixes.
- `bun run ki:<skill>:audit` — audit one concern (e.g. `ki:repo:audit`), where the `package.json` keys are wired.
- `./.ki-meta/bin/ki-init` (or `bun run ki:init`) — re-sync the vendored copies by re-running the chain at the ref recorded in the manifest (flag to move to a newer ref).

Drift in the vendored copies is handled by the manifest: the audit detects it — offline integrity against the per-file hashes, staleness against the recorded ref when the source is reachable — and conform only prints the advisory ("stale — re-run INIT"), never re-syncs. The repair is the idempotent `ki-init` re-run; that is how a standard's REFRESH propagates to a governed target.
