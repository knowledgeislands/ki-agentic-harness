# Onboarding a repo to Knowledge Islands governance

How to bring a repository under Knowledge Islands governance so it **governs itself** — running `bun run ki:audit` with **zero skills installed** — and how to migrate a legacy repo off old formats. This guide is the operating manual for the bootstrap chain (ADR-KI-HARNESS-008); its fenced command blocks are executable and are exercised by the harness's own test suite, so they cannot drift from what actually works.

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

1. **vendors copies** of the skill's checker scripts into the target's `scripts/ki/<skill>/` (copies, not symlinks, so they run standalone);
2. **installs** that skill's `ki:<suffix>:{audit,conform}` package.json keys pointing at the copies;
3. **installs/refreshes** the repo-wide `ki:audit` / `ki:conform` / `ki:init` aggregates that fan out over every vendored key.

After INIT the repo governs itself with `bun run ki:audit` and **no skills installed anywhere**.

## Prerequisites

You need [Bun](https://bun.sh) and a checkout of the harness. The examples reference it through `KI_HARNESS`; set it to your harness path:

```bash
export KI_HARNESS="${KI_HARNESS:-$(pwd)}"
```

## Greenfield: a fresh repo

A new repo needs only a `package.json` and a `.ki-config.toml` (declaring at least `[ki-repo]`). Bootstrap it, then confirm it self-governs:

```bash
bun "$KI_HARNESS/skills/ki-bootstrap/scripts/bootstrap.ts" "$TARGET"
```

```bash
cd "$TARGET" && bun run ki:audit
```

The first command vendors the baseline checkers and writes the `ki:*` keys into the target's `package.json`; the second runs the vendored aggregate, which invokes each skill's checker in sequence — with nothing installed in `.claude/skills/`.

## Legacy: migrating an existing repo

A repo carrying old formats migrates by the **same** chain, with one flag. `--legacy` runs INIT and then a full `ki:conform` pass, applying every mechanical fix in one go:

```bash
bun "$KI_HARNESS/skills/ki-bootstrap/scripts/bootstrap.ts" "$TARGET" --legacy
```

Use `--tracking` instead to run INIT and then a read-only `ki:audit` — report the drift without changing anything — when you want to see the gap before committing to the fixes.

## The remote-run transport

The canonical, zero-install form runs the chain straight from the harness on GitHub — no clone, no global install — pinned to a ref:

```text
bun run https://raw.githubusercontent.com/knowledgeislands/ki-agentic-harness/<ref>/skills/ki-bootstrap/scripts/bootstrap.ts <target>
```

A single skill's INIT is reachable the same way through its own `scripts/bootstrap.ts`, which seeds that skill (plus its `implies:` closure) into the target. This is the primary path for both a greenfield repo and a legacy migration: the mechanics and the vendored result are identical to a local run.

## Day-to-day, once governed

- `bun run ki:audit` — report drift across every governed skill (the aggregate).
- `bun run ki:conform` — apply the mechanical fixes.
- `bun run ki:<skill>:audit` — audit one concern (e.g. `ki:repo:audit`).

Re-running the chain (or `ki:conform`) re-syncs the vendored script copies, so a standard's REFRESH propagates to the target on its next run.
