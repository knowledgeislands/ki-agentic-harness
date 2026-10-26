# KI Specifications repository-structure standard

KI Specifications is a normal Knowledge Islands repository with one additional structural identity. It declares a keyless `[skills.ki-repo-specifications]` table and exposes seven stable top-level areas:

- `proposals/` for deliberative KIPs;
- `specifications/` for normative KIS documents;
- `schemas/` for machine-readable contracts;
- `templates/` for conformant starting points;
- `examples/` for reference packages;
- `docs/` for process, decisions, roadmap, and supporting guidance;
- `tooling/` for validation guidance and later executable tooling.

This is a floor, not a frozen ontology. The checker verifies the areas and marker but does not prescribe their internal layout, numbering, lifecycle, or document semantics. Those remain in the canonical Specifications repository until experience justifies factoring a stable rule into this skill.

## Commit gate

`ki-repo` owns whether a committed hook exists and compares it byte for byte with the canonical text ([ADR-KI-HARNESS-SKILLS-017](../../../../docs/decisions/ADR-KI-HARNESS-SKILLS-017-commit-gate-existence-and-content-are-owned-separately.md)). A Specifications repository's canonical hooks, with and without a `package.json`, are published as worked examples under [`assets/githooks/`](../assets/githooks/); copy them exactly. `GATE-1` checks that the committed `pre-commit` runs only check-only staged lints and never `ki repo audit`, `ki repo conform`, `ki repo repair`, `--fix` or `--write`. It is not applicable without a committed hook. The `ki-repo-specifications` audit, tests and builds belong to the manual gate and CI, as Kris chose COMMIT-VS-CI a) on 26 October 2026.

The skill adds only this structural delta. Coverage selects `ki-repo` separately for universal requirements such as README, LICENSE, `.gitignore`, GitHub configuration, and security settings.
