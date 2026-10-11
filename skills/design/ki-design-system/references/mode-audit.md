# Mode AUDIT - check a design system

Read [the Design System standard](standards-design-system.md) and [the rubric](rubric.md) first.

1. Run `ki repo audit --skill ki-design-system --repo <repo>`. It checks the `.ki.toml` declaration and that its token sources exist (DSYS-1), that the design guide is a guide in an audience folder (DSYS-2), that the declared checks exist (DSYS-3), that the guide names every token source (DSYS-4), and warns where the guide repeats a literal colour value (DSYS-5). It writes nothing.
2. Review DSYS-6: does each kind of design knowledge sit in its home? Look for rationale or history in the guide, values outside the token source, guide procedure inside a Decision Record, and stable behaviour with no Specification that something depends on.
3. Review DSYS-7 against the interface itself: does [the floor](standards-design-system.md#the-floor) hold, and does every rule in the guide that a machine could check have a check named in its merge section?
4. Review DSYS-8: is any brief, option board, canvas or screenshot kept as a durable document after its outcome was consolidated, and is every projection outside the repository refreshed from the token source?
5. Report gaps by criterion. Route a guide's form to `ki-guides`, a missing Specification to `ki-specs`, a decision to `ki-decision-records`, and prose to `ki-authoring`.
