#!/bin/sh
# Forwarding stub: retire once no binding on either Mac names hooks/coordinator-reminder.sh.
exec "$(dirname "$0")/coordinator-reminder/coordinator-reminder.sh" "$@"
