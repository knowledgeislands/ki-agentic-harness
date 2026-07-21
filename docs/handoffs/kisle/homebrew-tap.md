# `homebrew-tap` release brief for `kisle`

**Origin:** `ki-agentic-harness` FND-018

**Receiving repository:** `knowledgeislands/homebrew-tap`

**Blocked by:** a tagged, published, and contract-tested `knowledgeislands/tools-kisle` release

Add `kisle` to the Knowledge Islands tap after the source repository publishes its first stable release. This handoff owns packaging only; it must not patch the executable, select a different harness revision, or redefine the command contract.

## Locked decisions

- Formula name and file: `kisle`, `Formula/kisle.rb`, class `Kisle`.
- Homepage and source repository: `https://github.com/knowledgeislands/tools-kisle`.
- Source: the immutable `vX.Y.Z` GitHub tag tarball with its measured SHA-256.
- Installation: `bin.install "bin/kisle"`.
- The formula declares no package-manager runtime dependency. HELP, version, and completion are zero-package operations; lifecycle leaves perform their own targeted checks for `git`, `bun`, `curl`, and `tar`.
- Formula tests are offline and exercise only the installed artifact's HELP, version, and completion surface. They do not bootstrap, install user payloads, write a repository, or use the network.

## Formula shape

```ruby
class Kisle < Formula
  desc "Run Knowledge Islands user and repository lifecycle operations"
  homepage "https://github.com/knowledgeislands/tools-kisle"
  url "https://github.com/knowledgeislands/tools-kisle/archive/refs/tags/vX.Y.Z.tar.gz"
  sha256 "<measured-release-tarball-sha256>"
  license "MIT"

  def install
    bin.install "bin/kisle"
  end

  test do
    assert_match "kisle #{version}", shell_output("#{bin}/kisle --version")
    assert_match "Usage: kisle", shell_output("#{bin}/kisle --help")
    assert_match "kisle", shell_output("#{bin}/kisle completion bash")
  end
end
```

Use the released version and actual tarball digest; do not copy placeholders into the receiving repository.

## Ordered release steps

**Recommended tier:** haiku — the formula and index changes are mechanical once the source release exists.

1. Verify that the source tag, GitHub release, executable asset, digest asset, changelog entry, and embedded `kisle` version all agree.
2. Download the immutable tag tarball and calculate its SHA-256 independently.
3. Add `Formula/kisle.rb` using the shape above and the release's actual values.
4. Add a `kisle` row to the README Formulae table, describing it as the Knowledge Islands lifecycle CLI and linking `tools-kisle`.
5. Run `brew style Formula/kisle.rb`, strict formula audit, install-from-formula, and the formula test on a clean Homebrew prefix.
6. Run the `ki-homebrew-tap` and repository aggregate audits.

## Definition of done

- `brew install knowledgeislands/tap/kisle` installs the tagged executable and `kisle --version` exactly matches the formula version.
- Formula tests complete without network access or user/repository state changes.
- `brew audit --strict` and `brew style` pass for the formula.
- The tap README lists `kisle` once and links the correct source repository.
- Reinstall and upgrade from the preceding released formula are tested when a preceding version exists.
- No source patch, development ref, `head` stanza, branch tarball, or duplicate lifecycle implementation is present.

## Release update contract

For every later `tools-kisle` tag, update only the formula URL/version-derived value, SHA-256, and any Homebrew-required metadata change. A `kisle` release that changes the embedded harness SHA but not the CLI version is impossible: the source project must issue a new semantic version first, so Homebrew always has an immutable package identity.

## Readiness

Ready for execution as soon as `tools-kisle` publishes a stable tag and immutable digest. No lifecycle reasoning remains in this packaging task.
