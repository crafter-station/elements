#!/usr/bin/env bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('command',''))" 2>/dev/null)

if echo "$COMMAND" | grep -qE 'git\s+push.*\s+(main|master|production)\b'; then
  echo "Blocked: direct push to protected branch" >&2
  exit 2
fi

if echo "$COMMAND" | grep -qE 'git\s+push\s+--force'; then
  echo "Blocked: force push detected" >&2
  exit 2
fi
