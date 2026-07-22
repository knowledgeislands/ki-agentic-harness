# `homebrew-tap` release brief for `ki`

**Origin:** `ki-agentic-harness` FND-018

**Receiving repository:** `knowledgeislands/homebrew-tap`

**Blocked by:** a tagged, published, contract-tested `knowledgeislands/tools-ki` release

Add the Knowledge Islands command-line interface (CLI), `ki`, to the tap after the source repository publishes its first stable release. This handoff owns packaging only; it must not patch the executable, select a different harness revision, or redefine the command contract.

## Locked decisions

- Formula name and file: `ki`, `Formula/ki.rb`, class `Ki`.
- Homepage and source: `https://github.com/knowledgeislands/tools-ki`.
- Source: the immutable `vX.Y.Z` GitHub tag tarball and its measured SHA-256.
- Installation: `bin.install "bin/ki"`.
- No package-manager runtime dependency: HELP, version, and completion are zero-package operations; lifecycle leaves check their own `git`, `bun`, `curl`, and `tar` requirements.
- Formula tests are offline and exercise only HELP, version, and completion; they do not bootstrap, install user payloads, write a repository, or use the network.

## Formula shape

```ruby
class Ki < Formula
  desc "Run Knowledge Islands user and repository lifecycle operations"
  homepage "https://github.com/knowledgeislands/tools-ki"
  url "https://github.com/knowledgeislands/tools-ki/archive/refs/tags/vX.Y.Z.tar.gz"
  sha256 "<measured-release-tarball-sha256>"
  license "MIT"

  def install
    bin.install "bin/ki"
  end

  test do
    assert_match "ki #{version}", shell_output("#{bin}/ki --version")
    assert_match "Usage: ki", shell_output("#{bin}/ki --help")
    assert_match "ki", shell_output("#{bin}/ki completion bash")
  end
end
```

Use release values, never placeholders, in the receiving repository.

## Ordered release steps

**Recommended tier:** haiku.

1. Verify source tag, GitHub release, executable asset, digest asset, changelog, and embedded CLI version agree.
2. Download the immutable tag tarball and calculate SHA-256 independently.
3. Add `Formula/ki.rb` using actual release values and add one `ki` README Formulae row linking `tools-ki`.
4. Run `brew style Formula/ki.rb`, strict audit, install-from-formula, and formula test on a clean Homebrew prefix.
5. Run `ki-homebrew-tap` and repository aggregate audits.

## Definition of done

- `brew install knowledgeislands/tap/ki` installs the tagged executable and `ki --version` matches the formula version.
- Formula tests complete offline with no user/repository state change.
- Strict audit and style pass; the tap README lists `ki` once and links the correct source repository.
- Reinstall/upgrade is tested when a preceding release exists.
- No source patch, development ref, `head` stanza, branch tarball, or duplicate lifecycle implementation is present.

## Release update contract

For each later `tools-ki` tag, update only the formula's version-derived URL, SHA-256, and required Homebrew metadata. A CLI release that changes its embedded harness SHA always has a new semantic version, so Homebrew retains an immutable package identity.

## Readiness

Ready once `tools-ki` publishes a stable tag and immutable digest. No lifecycle reasoning remains in this packaging task.
