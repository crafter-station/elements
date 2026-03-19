#!/usr/bin/env bash
[[ -z "$CLAUDE_HOOK_SLACK_WEBHOOK" ]] && exit 0

INPUT=$(cat)
EVENT=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('hook_event_name',''))" 2>/dev/null)
MESSAGE=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('notification_message','Needs attention'))" 2>/dev/null)
CWD=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('cwd',''))" 2>/dev/null)
PROJECT=$(basename "$CWD")

curl -s -X POST "$CLAUDE_HOOK_SLACK_WEBHOOK" \
  -H 'Content-Type: application/json' \
  -d "{\"text\":\"*Claude Code* (${PROJECT})\\n${EVENT}: ${MESSAGE}\"}" \
  >/dev/null 2>&1 &
