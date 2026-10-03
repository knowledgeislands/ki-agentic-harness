# Tool change readiness

Use this shared checklist before presenting a change to any `tools-*` CLI for review. The repository's `docs/guides/developer/definition-of-done.md` remains a self-contained account of its own commands, risks, and verification gates; it applies this contract rather than defining a competing one. A release also follows the separate release-readiness checklist and the repository's release guide.

## Contract and documentation

- Confirm the change stays within the tool's declared responsibility. Keep personal configuration, credentials, native provider state, and another repository's authority outside the executable and its published output.
- Check the affected public surface together: executable and command-local help, README command overview, user and developer guides, Bash and Zsh completion output, physical manual, and the active changelog baseline or dated entry. Include installer instructions and version output when they changed. A surface may be shorter than another, but none should advertise a retired command or contradict a shipped option, default, or output shape.
- Put accepted observable behaviour in a Specification, durable rationale in a Decision Record, practical operation in a guide, and genuinely future work in the selected work tracker. Do not create a roadmap item merely to perform routine documentation alignment.
- New user-authored configuration has no schema/version field while it has one current shape. Read only recognised legacy shapes, make repair explicit and previewable, and keep ordinary reads non-mutating. Give each generated output contract its own v1 identity before the first stable release; do not renumber internal persisted-state migration markers without a migration.
- When a guide uses a diagram, keep its source, generated artifact, and explanatory prose together and verify that their relationships still match the implementation. A diagram is conditional on helping a reader understand a real boundary, not a required ornament for every CLI.

## Evidence and handoff

- Run `ki repo audit --repo .` and the repository's native lint, build, test, syntax, installer, and packaging gates that apply to the change. Exercise affected commands and failure paths through isolated fixtures. A manual change also needs `mandoc -T lint` and a rendered reading check; a completion change needs emitted Bash and Zsh registration checks.
- Prefer a deterministic check for repeatable public-surface relationships, such as command inventory, generated manual metadata, completion grammar, or release version matching. Keep semantic quality, reader journey, and cross-system authority as explicit human review rather than claiming a string search proves them.
- Inspect the exact staged diff, keep unrelated work out of the commit, and record verification and remaining concerns in the repository's selected review workflow. Acceptance, pruning, push, tag, release publication, personal-machine apply, and receiving-repository changes are separate authority decisions.
