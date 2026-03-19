#!/usr/bin/env bash
[[ -z "$CLAUDE_HOOK_TELEGRAM_TOKEN" || -z "$CLAUDE_HOOK_TELEGRAM_CHAT_ID" ]] && exit 0

INPUT=$(cat)
EVENT=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('hook_event_name',''))" 2>/dev/null)
MESSAGE=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('notification_message','Needs attention'))" 2>/dev/null)
CWD=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('cwd',''))" 2>/dev/null)
PROJECT=$(basename "$CWD")

curl -s -X POST "https://api.telegram.org/bot${CLAUDE_HOOK_TELEGRAM_TOKEN}/sendMessage" \
  -d "chat_id=${CLAUDE_HOOK_TELEGRAM_CHAT_ID}" \
  -d "text=*Claude Code* (${PROJECT})
${EVENT}: ${MESSAGE}" \
  -d "parse_mode=Markdown" \
  >/dev/null 2>&1 &
