# Bootstrap — `BOOT`

The behaviour of user bootstrap, harness selection, skill activation, and native repository operations. Part of the Specifications corpus; see [index.md](index.md).

> **Status:** accepted contract; conformance is declared per requirement.

## Retired repository-vendored bootstrap

### BOOT-001 — ~~Self-governing after EDUCATE~~ (deprecated)

Replaced by BOOT-015. Repositories now execute their declared governance through the installed `ki` CLI and compatible harnesses.

### BOOT-002 — ~~Vendored checker copies~~ (deprecated)

Replaced by BOOT-013 and BOOT-015. Repository-local checker copies are not an execution source.

## Declarative repository coverage

### BOOT-003 — Explicit declared skill coverage

A native repository operation MUST select exactly the compatible governance skills declared by `[ki-<skill>]` tables in the target's `.ki.toml`, require every explicit dependency to be declared, and fail before execution when a declaration is missing, incompatible, or ambiguous, per [ADR-KI-HARNESS-012](../decisions/ADR-KI-HARNESS-012-compatible-harness-publication-and-governed-rubric-boundary.md).

_Conformance:_ conforming

_Verify:_ run `ki repo audit` against a fixture with one valid declared catalogue, then remove a required dependency declaration and confirm resolution fails before the catalogue executes.

_Evidence:_ run `ki repo audit` against a fixture with one valid declared catalogue, then remove a required dependency declaration and confirm resolution fails before the catalogue executes.

## Retired repository-local execution

### BOOT-004 — ~~Repository-local aggregate runners~~ (deprecated)

Replaced by BOOT-015. The CLI host owns operation ordering and reporting.

### BOOT-005 — ~~Repository-local command wrappers~~ (deprecated)

Replaced by BOOT-015. Package-free repositories use the installed `ki` executable.

### BOOT-006 — ~~Per-skill EDUCATE delegators~~ (deprecated)

Replaced by BOOT-014 and BOOT-015. Activation and operation dispatch belong to the CLI.

### BOOT-007 — ~~Vendored-set alignment checks~~ (deprecated)

Replaced by BOOT-003. The native resolver checks declared compatible capabilities.

### BOOT-008 — ~~Remote EDUCATE transport~~ (deprecated)

Replaced by BOOT-011. First-time setup uses the installed CLI and verified harness acquisition.

## Repository activation

### BOOT-009 — Runtime publication follows repository scope

`ki repo skill add <skill>` and `ki repo skill remove <skill>` MUST update only the selected repository's `.ki.toml` declaration and managed discovery links for its supported runtimes, without copying executable governance payloads or changing user activation.

_Conformance:_ conforming

_Verify:_ add and remove a declared skill in a two-runtime fixture, then inspect `.ki.toml` and both runtime discovery locations while confirming the user configuration is unchanged.

_Evidence:_ add and remove a declared skill in a two-runtime fixture, then inspect `.ki.toml` and both runtime discovery locations while confirming the user configuration is unchanged.

### BOOT-010 — ~~Generated-state CLEAN entrypoint~~ (deprecated)

Replaced by BOOT-016. Native repository operations preserve unowned state rather than becoming a cleanup command.

## User bootstrap

### BOOT-011 — First-time bootstrap establishes the minimum user environment

`ki bootstrap` MUST detect supported local agent runtimes, create the KI user configuration when absent, install or restore the canonical `knowledgeislands/ki-agentic-harness`, and activate the seven core user skills — `ki-bootstrap`, `ki-next`, `ki-plan`, `ki-implement`, `ki-accept`, `ki-batch`, and `ki-recap` — for every detected runtime. `ki-delegation` is opt-in and augments runtime subagent delegation only when active in the same scope.

_Conformance:_ conforming

_Verify:_ run `ki bootstrap` against isolated empty XDG and runtime homes, then inspect `config.toml`, the canonical harness installation, and the seven managed user-skill links in each detected runtime.

_Evidence:_ run `ki bootstrap` against isolated empty XDG and runtime homes, then inspect `config.toml`, the canonical harness installation, and the seven managed user-skill links in each detected runtime.

### BOOT-012 — Refresh reconciles detected user state

`ki bootstrap --refresh` MUST redetect supported runtimes and rebuild the recorded installed-harness and managed user-skill inventory from current state without declaring governance in a repository.

_Conformance:_ conforming

_Verify:_ change the detectable runtime set in an isolated bootstrapped environment, run `ki bootstrap --refresh`, and confirm the user inventory and managed links reconcile while a repository `.ki.toml` remains unchanged.

_Evidence:_ change the detectable runtime set in an isolated bootstrapped environment, run `ki bootstrap --refresh`, and confirm the user inventory and managed links reconcile while a repository `.ki.toml` remains unchanged.

## Harness authority and activation scopes

### BOOT-013 — Installed compatible harnesses are authoritative

Native capability resolution MUST use verified installed compatible harnesses, treat the canonical harness as non-removable, and MUST NOT implicitly use a nearby checkout, runtime link, or repository-local payload as an execution source.

_Conformance:_ conforming

_Verify:_ run capability resolution with only a nearby harness checkout and confirm it fails, then install the compatible harness and confirm resolution succeeds; confirm `ki harness uninstall knowledgeislands/ki-agentic-harness` is refused.

_Evidence:_ run capability resolution with only a nearby harness checkout and confirm it fails, then install the compatible harness and confirm resolution succeeds; confirm `ki harness uninstall knowledgeislands/ki-agentic-harness` is refused.

### BOOT-014 — User and repository activation remain separate

User skill operations MUST change only configured user runtime spaces, while repository skill operations MUST change only the selected repository declaration and managed runtime links.

_Conformance:_ conforming

_Verify:_ run `ki skill add <skill>` and `ki repo skill add <skill>` in isolated state and confirm each command mutates only its own configuration and discovery scope.

_Evidence:_ run `ki skill add <skill>` and `ki repo skill add <skill>` in isolated state and confirm each command mutates only its own configuration and discovery scope.

## Native operations

### BOOT-015 — Repository governance executes natively

`ki repo educate`, `ki repo audit`, and `ki repo conform` MUST resolve the selected repository's declared compatible catalogues and execute them through the CLI host without invoking `.ki/bin`, copied checkers, standalone `govern.ts`, or a nearby checkout as a fallback.

_Conformance:_ conforming

_Verify:_ run all three operations against a declared fixture and confirm the compatible catalogue executes; add an otherwise runnable legacy wrapper and confirm it is neither read nor invoked.

_Evidence:_ run all three operations against a declared fixture and confirm the compatible catalogue executes; add an otherwise runnable legacy wrapper and confirm it is neither read nor invoked.

### BOOT-016 — Repository operations preserve unowned state

Native repository operations MUST leave unowned repository state unchanged; it is neither an execution source nor a deletion target.

_Conformance:_ conforming

_Verify:_ add an unowned executable-looking repository directory to a declared fixture and confirm that native operations neither read nor remove it.

_Evidence:_ add an unowned executable-looking repository directory to a declared fixture and confirm that native operations neither read nor remove it.
