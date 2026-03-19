#!/usr/bin/env bash
[[ "$(uname)" != "Darwin" ]] && exit 0

INPUT=$(cat)
TITLE=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('hook_event_name','Claude Code'))" 2>/dev/null || echo "Claude Code")
MESSAGE=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('notification_message', d.get('hook_event_name','Needs attention')))" 2>/dev/null || echo "Needs attention")

osascript -e "display notification \"$MESSAGE\" with title \"Claude Code\" subtitle \"$TITLE\" sound name \"Ping\""
