# Mode EDUCATE - establish a design system

1. Confirm the repository has a user interface and a token source. Without a token source, stop: establish one first, with `ki-repo-website-content` for a content site or the repository's own toolchain otherwise.
2. Activate the skill with `ki repo skill add ki-design-system`, then add the `tokens`, `guide` and `checks` keys to `[skills.ki-design-system]` in `.ki.toml`, as [the standard](standards-design-system.md#configuration) shows.
3. Write the design guide from [the guide skeleton](../assets/design-guide.md) in the audience folder of the people who build the interface, usually `docs/guides/developer/`. Fill each section from what the interface already does; name tokens, never their values. Link it from `docs/guides/README.md`.
4. Write or adopt the checks for [the floor](standards-design-system.md#the-floor): at least a contrast check over every theme and mode the product offers. Name each check in the guide's merge section.
5. Record the design system's existing structural decisions, such as how tokens are composed, as Decision Records with `ki-decision-records`, refining any record that already owns the concern.
6. Run [AUDIT](mode-audit.md).
