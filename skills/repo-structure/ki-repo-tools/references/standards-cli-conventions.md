# Command-line conventions

Design guidance for the public interface of a Knowledge Islands command-line tool, drawn from the common Unix and Linux conventions. It tells a tool author which syntax, flag letters, streams, exit statuses, terminal behaviour and directories users already expect, so that a new option or command fits them first time. The [tool-repository standard](standards-tool-repositories.md#shared-cli-conventions) keeps the house rules this guidance sits beside; where the two meet, the house rule governs. The external sources are listed in [sources.md](sources.md).

This is guidance for design and review, not a mechanical rubric: hosted audit never runs a tool, so conformance is judged by reading its help, manual and tests. An existing departure is reconciled deliberately, through the tool's own record and changelog, rather than by renaming a shipped flag in passing.

## Contents

- [Syntax](#syntax)
- [Common options](#common-options)
- [Symbolic links](#symbolic-links)
- [Standard streams](#standard-streams)
- [Exit status](#exit-status)
- [Terminal, colour and prompts](#terminal-colour-and-prompts)
- [Configuration, state and cache](#configuration-state-and-cache)
- [Signals](#signals)
- [Choosing a new option](#choosing-a-new-option)

## Syntax

The POSIX Utility Syntax Guidelines and GNU long options together give the shape users type without thinking.

- A short option is one letter or digit after one hyphen: `-v`. Short options without arguments group: `-vW` means `-v -W`.
- A short option's argument may be separate or attached: `-j 4` and `-j4` mean the same.
- A long option is a word after two hyphens: `--verbose`. Its argument may follow an equals sign or stand separately: `--jobs=4` and `--jobs 4` mean the same. A boolean long option may have a `--no-<name>` negation where both states matter.
- `--` ends option processing: everything after it is an operand, even when it starts with a hyphen. A tool that passes arguments through to another program uses `--` to mark where its own options stop.
- A lone `-` as a file operand means standard input, or standard output where the operand names an output.
- Options come before operands. Accepting an option after an operand is a GNU convenience a tool may offer, but scripts and documentation put options first.
- Do not rely on unique-prefix abbreviation of long options (`--verb` for `--verbose`): it makes adding an option a breaking change. Spell every documented option in full.
- An option given twice either accumulates, where repetition is meaningful (`-v -v`, a repeatable `--filter`), or the last one wins. Document which.

## Common options

These letters and names carry an expected meaning across Unix tools. Give an option one of these names only with this meaning, and do not reuse a letter here for something else. A tool need not offer every option; it offers the ones its commands need.

| Option | Meaning | Precedent |
| --- | --- | --- |
| `-h`, `--help` | Print usage to standard output and exit 0. Works at the root and on every subcommand. | GNU, clig.dev |
| `--version`, `-V` | Print `<tool> <version>` on the first line of standard output and exit 0. `-V` is the short form where the tool has one; `-v` is never the version. | GNU |
| `-v`, `--verbose` | More detail. May repeat for more. | widespread |
| `-q`, `--quiet` | Less: suppress non-essential output and progress, keep errors. | `grep -q`, `git fetch -q` |
| `-n`, `--dry-run` | Report what would change without changing anything. | `make -n`, `rsync -n`, `git add -n` |
| `-f`, `--force` | Override a refusal or safety check, such as a dirty tree or an existing file. Some tools use `-f` for `--file`; a tool picks one of those two meanings and never a third. | `rm -f`, `cp -f`, `git push -f` |
| `-y`, `--yes` | Answer a confirmation prompt in advance for non-interactive use. | `apt -y` |
| `-i`, `--interactive` | Ask before each action. | `rm -i`, `cp -i` |
| `-r`, `-R`, `--recursive` | Descend into directories. POSIX spells it `-R`; GNU tools accept both. | `cp -R`, `ls -R`, `grep -r` |
| `-a`, `--all` | Include what is hidden or excluded by default. | `ls -a`, `git branch -a` |
| `-o`, `--output <path>` | Write the result to a file instead of standard output. | `cc -o`, `curl -o` |
| `-C <dir>` | Run as if started in `<dir>`. | `git -C`, `make -C`, `tar -C` |
| `-j`, `--jobs <n>` | Run up to `n` jobs at once. | `make -j` |
| `-0`, `--null` | Separate output records with NUL instead of a newline, for file names that may hold any byte. Pair with `xargs -0`. | `find -print0`, `xargs -0`, `git ls-files -z` |
| `--json` | Print machine-readable JSON on standard output. Use `--format <name>` instead only when a command offers several formats. | `npm ls --json`, `gh pr list --json` |
| `--color[=when]`, `--no-color` | `always`, `auto` (the default) or `never`. | GNU `ls`, `grep`, `diff` |

Two KI house rules refine this table. A command whose writes need review previews by default and writes only with an explicit option such as `--apply`, as the [shared CLI conventions](standards-tool-repositories.md#shared-cli-conventions) require of `repair`; `--dry-run` remains the opt-in preview for a command that acts by default. And within one tool, the same option has the same name and meaning on every subcommand.

## Symbolic links

POSIX gives one family of letters for whether a command follows symbolic links, and a tool that walks directories uses it rather than inventing another.

- In a tree walk, `-P` never follows symbolic links (the physical tree), `-L` follows every symbolic link (the logical tree) and `-H` follows only links named on the command line. When more than one is given, the last wins. This is the meaning in `find`, `cp -R`, `chown -R`, `chgrp -R`, `du` and `ls -R`. Make the default explicit in help; `-P` is the safer default for a tool that writes.
- For a path rather than a walk, `-L` keeps the logical path and `-P` resolves it to the physical one, as `cd`, `pwd` and `realpath` do.
- GNU spells the walk options `--no-dereference`, `--dereference` and `--dereference-command-line`; a KI tool may give clearer long names, such as `--physical` and `--follow-symlinks`, provided the short letters keep the POSIX meanings.
- Detect and stop at link cycles when following links.

## Standard streams

- Standard output carries the result: the data a user asked for, which another program may read. Its shape stays the same whether or not it is a terminal, apart from colour and width.
- Standard error carries everything about the run: errors, warnings, progress, prompts and diagnostic logging. A user can redirect standard output to a file or a pipe and still see what is happening.
- Machine output under `--json` or `-0` is the whole of standard output: no headings, progress, colour or trailing prose. Errors still go to standard error.
- An error names the tool and says what failed and what to do next: `<tool>: error: <what> (<next step>)`. Syntax errors add usage, under the [shared CLI conventions](standards-tool-repositories.md#shared-cli-conventions).
- Help and version, asked for, are results and go to standard output. Usage printed because of a syntax error goes to standard error.

## Exit status

| Status | Meaning |
| --- | --- |
| 0 | Success. A check that finds nothing wrong, and `--help` and `--version`. |
| 1 | An operational failure, or a check that found a problem (`doctor` reporting unhealthy). |
| 2 | Invalid syntax the tool owns: an unknown option, a missing argument, a bad value. |
| 126, 127 | Reserved by the shell: found but not executable, and not found. A tool does not use them for its own meaning. |
| 128 + n | Ended by signal `n`: 130 for an interrupt (Ctrl-C), 143 for `SIGTERM`. |

A tool that passes a command through to another program returns that program's status unchanged where there is one; one that runs a command across many targets documents how it combines their statuses. Use another code only when callers need to tell outcomes apart, and document it in help and the manual. The BSD `sysexits.h` codes are not used.

## Terminal, colour and prompts

- Colour, cursor movement, progress bars and spinners appear only when the stream they go to is a terminal. Check the stream itself: standard output for coloured results, standard error for progress.
- When `NO_COLOR` is set to any non-empty value, print no colour unless the user asks for it with `--color=always`. Treat `TERM=dumb` the same. A command-line option overrides the environment.
- Redirected output is plain and deterministic, under the [human-readable tables](standards-tool-repositories.md#human-readable-tables) rule.
- Prompt only when standard input is a terminal. Without a terminal, never wait for an answer: proceed if the action is safe, or stop with an error naming the option, such as `--yes`, that grants the answer.
- Never read a secret from a command-line option, where it shows in the process list and shell history; read it from a file, standard input or a secret store.

## Configuration, state and cache

A tool keeps its files where the XDG Base Directory Specification says, on macOS as on Linux, rather than in a dotfile in `$HOME` or under `~/Library`.

| Kind | Variable | Default | Holds |
| --- | --- | --- | --- |
| Configuration | `$XDG_CONFIG_HOME` | `~/.config` | What the user edits or a configuration manager tracks. |
| State | `$XDG_STATE_HOME` | `~/.local/state` | What should survive a restart but is not worth tracking: logs, history, last-run records. |
| Cache | `$XDG_CACHE_HOME` | `~/.cache` | What can be deleted and rebuilt. |
| Data | `$XDG_DATA_HOME` | `~/.local/share` | Installed or user data the tool needs and does not rebuild. |
| Runtime | `$XDG_RUNTIME_DIR` | none | Sockets and locks for the session. |

- Each tool uses its own subdirectory, `<base>/<tool>/`.
- A variable that is unset, empty or holds a relative path is ignored and the default used.
- Settle precedence from the most specific to the least: command-line option, then environment variable, then repository or project configuration, then user configuration, then built-in default.
- A tool's own environment variables carry its name as a prefix, `<TOOL>_`, as the installer overrides already do.

## Signals

- On an interrupt, stop promptly, tidy up what the run created, and exit 130. A second interrupt during clean-up ends at once.
- When standard output closes early, as in `tool | head`, exit quietly without an error message.
- Restore the terminal, such as a hidden cursor or a scrolling region, on every exit path.

## Choosing a new option

1. Look for the meaning in [common options](#common-options) and [symbolic links](#symbolic-links) first; if it is there, use that name and letter.
2. Give a short letter only to an option people type often. A rare or dangerous option is long only, so that it is spelt out where it is used.
3. Check the letter against every other subcommand and the global options of the same tool, so that one letter has one meaning throughout.
4. Name long options with lower-case words joined by hyphens, and prefer a word a user already knows from another tool.
5. Update help, the completions, the manual and the README in the same change, under the [shared CLI conventions](standards-tool-repositories.md#shared-cli-conventions).
