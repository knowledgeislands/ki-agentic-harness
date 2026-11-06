#!/bin/sh
# Forwarding stub: retire once no binding on either Mac names hooks/git-lock-check.sh.
exec "$(dirname "$0")/git-lock-check/git-lock-check.sh" "$@"
