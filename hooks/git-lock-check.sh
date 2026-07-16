#!/usr/bin/env bash
# Stop hook: remove stale lock files from the current worktree's Git directory.

# This hook is deliberately fail-safe: every ambiguity leaves the filesystem
# unchanged and the Stop event unblocked.
set -u

inside_worktree=$(git rev-parse --is-inside-work-tree 2>/dev/null) || exit 0
[ "$inside_worktree" = true ] || exit 0

git_dir_candidate=$(git rev-parse --absolute-git-dir 2>/dev/null) || exit 0
worktree_candidate=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
git_dir=$(cd -- "$git_dir_candidate" 2>/dev/null && pwd -P) || exit 0
worktree=$(cd -- "$worktree_candidate" 2>/dev/null && pwd -P) || exit 0
[ -d "$git_dir" ] || exit 0
[ -d "$worktree" ] || exit 0

path_is_within() {
  case "$1" in
    "$2" | "$2"/*) return 0 ;;
    *) return 1 ;;
  esac
}

# Return success when PID is relevant to this worktree, or when inspecting it
# is inconclusive. A false positive merely preserves a stale lock; a false
# negative could corrupt an active Git operation.
process_is_relevant() {
  pid=$1

  if [ -d "/proc/$pid" ]; then
    process_cwd=$(readlink "/proc/$pid/cwd" 2>/dev/null) || return 0
    process_cwd=$(cd -- "$process_cwd" 2>/dev/null && pwd -P) || return 0
    path_is_within "$process_cwd" "$worktree" && return 0
    path_is_within "$process_cwd" "$git_dir" && return 0

    for descriptor in "/proc/$pid/fd/"*; do
      [ -e "$descriptor" ] || continue
      target=$(readlink "$descriptor" 2>/dev/null) || continue
      path_is_within "$target" "$git_dir" && return 0
    done
    return 1
  fi

  command -v lsof >/dev/null 2>&1 || return 0

  process_cwd=
  while IFS= read -r -d '' field; do
    case "$field" in
      n*) process_cwd=${field#n} ;;
    esac
  done < <(lsof -a -p "$pid" -d cwd -F0n 2>/dev/null)

  [ -n "$process_cwd" ] || return 0
  process_cwd=$(cd -- "$process_cwd" 2>/dev/null && pwd -P) || return 0
  path_is_within "$process_cwd" "$worktree" && return 0
  path_is_within "$process_cwd" "$git_dir" && return 0

  # Covers `git -C <worktree>` and `git --git-dir=<dir>` processes whose cwd is
  # elsewhere, without treating unrelated Git activity as a global veto.
  lsof -a -p "$pid" +D "$git_dir" >/dev/null 2>&1 && return 0
  return 1
}

relevant_git_process_running() {
  command -v pgrep >/dev/null 2>&1 || return 0
  git_pids=$(pgrep -x 'git|git-.*' 2>/dev/null)
  pgrep_status=$?
  case "$pgrep_status" in
    0) ;;
    1) return 1 ;;
    *) return 0 ;;
  esac

  # pgrep output is numeric, so shell word splitting cannot corrupt a path.
  for pid in $git_pids; do
    case "$pid" in
      '' | *[!0-9]*) return 0 ;;
    esac
    process_is_relevant "$pid" && return 0
  done
  return 1
}

# `find -P` and `-type f` exclude symlinked directories and lock leaves. The
# NUL-delimited loop preserves every byte Bash paths can contain, including
# spaces and newlines.
while IFS= read -r -d '' lock; do
  path_is_within "$lock" "$git_dir" || continue
  [ -f "$lock" ] || continue
  [ ! -L "$lock" ] || continue

  # Re-check immediately before each removal to narrow the process-start race.
  relevant_git_process_running && exit 0

  # Resolve the parent at deletion time. If an ancestor was exchanged for a
  # symlink after find(1), it must still resolve beneath the same Git directory.
  lock_parent=${lock%/*}
  resolved_parent=$(cd -- "$lock_parent" 2>/dev/null && pwd -P) || continue
  path_is_within "$resolved_parent" "$git_dir" || continue
  [ ! -L "$lock" ] || continue
  [ -f "$lock" ] || continue

  rm -f -- "$lock" 2>/dev/null || continue
  printf 'Removed stale git lock: %q\n' "$lock"
done < <(
  find -P "$git_dir" \
    \( -path "$git_dir/worktrees" -o -path "$git_dir/modules" \) -prune -o \
    -type f -name '*.lock' -print0 2>/dev/null
)

exit 0
