# Cut an installable MCP source release

Use this procedure after the server's repository checks pass and the repository owner has chosen the release version.

1. Confirm `package.json` has the intended SemVer version, a `build` script, and the governed MCP entry point.
2. Confirm the Bun lockfile is committed and `bun install --frozen-lockfile`, the build, tests, type-check, and repository audits pass from a clean checkout.
3. Update the server's changelog and commit the complete release state.
4. Create an annotated `v<SemVer>` tag at that commit. Do not tag a different commit from the one containing the matching package version.
5. Push the commit and tag through the repository's normal release process, then create or designate the stable GitHub Release when this version should be selected by an omitted-version install.
6. Record the tag and full commit object ID in the release evidence. Test the named installer once `tools-ki` provides it.

The release must not publish the MCP server package to npm merely to make installation possible. Registry metadata, release assets, MCPB bundles, and compiled executables are optional additions; they do not replace the tag, commit, locked build, entry point, or installer provenance receipt.

The governing contract is the `ki-repo-mcp` source-distribution standard. The repository owner chooses versions and release timing; the Harness audit never creates tags or releases.
