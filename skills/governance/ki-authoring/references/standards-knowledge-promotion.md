# Knowledge promotion

Useful knowledge starts as a local observation and becomes durable only when its scope and evidence warrant it.

This is a manual routing standard, not a transcript miner or a reason to create a new guide area.

## Placement ladder

Choose the narrowest durable home that reaches the people and agents who need the knowledge.

| Place | What belongs there | Promotion evidence | Durable destination | Reconciliation |
| --- | --- | --- | --- | --- |
| Session context | Tentative observations and the current work state | It remains useful after the session, or recurs in another task | Promote using the rows below; do not treat runtime memory as the canonical record | Leave transient context behind once its durable owner exists |
| Runtime memory | A stable personal retrieval aid for one runtime, not a standing repository rule | An explicit, narrowly scoped opt-in and review show it is useful beyond the session but has no shared owner | The selected runtime's memory, only while that opt-in remains effective | Promote durable value to its reviewed repository or KB owner; do not keep a divergent local copy |
| Repository orientation | A standing rule needed for most work in one repository | It is always-on, stable, and repository-wide | Portable guidance in `AGENTS.md`; runtime-specific guidance only in that runtime's file, such as `CLAUDE.md` | Replace lower-layer copies with a concise pointer or remove them |
| On-demand guide | A bounded procedure with a known reader that need not be loaded every session | A repeatable task needs detail but not standing context | An existing appropriate `docs/guides/` area | Keep orientation to a one-line pointer; do not create a guide area by default |
| Shared standard or reference | A rule, source, decision, or method used by more than one repository or skill | It has cross-repository reach, is normative, or needs authoritative provenance | The owning `ki-*` skill's standard/reference, a decision record, or a source list | Replace repository copies with a pointer to the shared owner |
| Reusable skill | A reusable agent operation that needs selection-time discovery, a procedure, or a checker | The same operation recurs across contexts and has a clear capability owner | The owning skill and its supporting references | Keep the standard normative; make the skill point to it rather than duplicate it |
| Personal cross-project configuration | A durable user preference or machine convention, not a repository rule | It applies across repositories for one user | The user's synchronised configuration | Remove repository copies unless the repository has an independent reason to state it |
| Roadmap or plan | Unfinished work, a dependency, or a future decision | It needs prioritisation or execution, not merely recall | The owning repository's roadmap or plan | Do not disguise open work as a convention or memory |

## Promotion loop

1. Capture the observation with enough context to judge it, but do not make a durable write by default.
2. Classify its scope: session, repository, shared governance, reusable operation, personal configuration, or unfinished work.
3. Test the evidence in the placement ladder and choose one owner.
4. Write or update that owner only with the appropriate confirmation and verification.
5. Reconcile the source layer: remove a duplicate, replace it with a pointer, or explicitly retain it only when it serves a different audience.
6. Revisit the placement when its scope changes; promotion is not a reason to preserve obsolete lower-layer copies.

## Classifying user-level instructions

Use this method when an owner asks for an existing user-level instruction file, such as a rendered personal runtime instruction file or one it imports, to be reviewed for content that belongs elsewhere. The input is prose the owner supplies or a tracked source the owner points to, never a scan of a home directory.

1. Take one section at a time.
2. Compare it with the current standard of the skill or repository that would own it.
3. Classify it as exactly one of:
   - **Already owned:** the owning standard already states it. Remove it from the user file or leave a pointer.
   - **Missing portable doctrine:** reusable doctrine its owner lacks. Generalise it into the owning skill through that skill's change route rather than copying personal prose.
   - **Conflicting:** it contradicts the current portable standard. Retire it; do not promote it.
   - **Repository fact:** it applies to one repository. Route it to that repository's `AGENTS.md`.
   - **Personal or machine-specific:** an interaction preference or local binding. Retain it in user scope.
4. Verify each affected skill without the user file: in a session that loads no user-level instructions, confirm that the skill's tracked files state every rule the reviewed sections relied on. Route a gap to the owning skill, not back to user scope. When user-level evidence is unavailable, report that as a limit rather than a pass.

The `ki-repo-dotfiles-chezmoi` agent-instruction layering rule points here; `ki-skills`' `KI-SHAPE-10` remains the skill-level portability judgment.

## Replaceable execution environments

An agent runtime or coordination system is additive, not the durable owner of a repository's knowledge or operating model. Preserve purpose, procedures, authority, accepted decisions, work state, verification evidence, and residual learning in their repository-owned homes. Runtime memory, task conversations, and scheduler history may aid execution but must not be the only record needed to understand or continue the work.

The continuity test is practical: with the repository, its referenced durable sources, and verified declared skills and tooling, can a person or another execution environment determine what matters, what happened, what remains, what authority is required, and how to proceed? This is not a promise of dependency-free or offline operation. Keep secrets outside Git, declare external dependencies and access prerequisites, and retain non-secret evidence locators. Changing the executor neither changes repository authority nor permits replaying uncertain work; reconcile in-flight claims, holds, and returned evidence before handover.

## Boundaries

- `AGENTS.md` holds portable repository guidance; runtime files hold only genuinely runtime-specific detail.
- A reference holds the detailed rule or evidence; a skill owns reusable execution. Neither should restate the other wholesale.
- Existing guides are destinations when appropriate; this process does not automatically invent documentation structures.
- User confirmation governs durable learning writes. This standard decides where an approved learning goes; it does not grant permission to write it.
- Agent-local auto-memory is off by default. Route candidate learning through existing repository intake and approval rules into reviewed guidance or an appropriate KB note; a runtime's auto-memory is never the canonical store. A KB's tracked `Admin/MEMORY.md` remains its repository index, not agent-local auto-memory.
