# Mode CONFORM - bring a design system into line

**Precondition:** run [AUDIT](mode-audit.md) first and retain the gap list.

CONFORM moves knowledge to its home; it never redesigns the interface or changes a token's value.

1. Run `ki repo conform --skill ki-design-system --repo <repo> --dry-run`. The host owns only generated-publication repair; DSYS findings are diagnostic.
2. Fix the declaration: add the missing keys to `[skills.ki-design-system]`, or point them at the files the repository actually uses.
3. Where the guide repeats a value the token source holds, replace it with the token's name. A colour value with no token gets one first, with the owner's agreement; any other value without a token may stay in the guide until it gets one.
4. Move misplaced knowledge to its home: rationale to a Decision Record, stable behaviour something depends on to a Specification, future work to a work record, and procedure back to the guide. Preserve the conclusion before removing the source.
5. For each checkable rule without a check, add the check or list the rule as a review step in the guide's merge section.
6. Re-run AUDIT.
