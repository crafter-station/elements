#!/usr/bin/env bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('command',''))" 2>/dev/null)

if echo "$COMMAND" | grep -qE 'rm\s+(-rf|-fr)\s+(/|~|\$HOME|\.\.)'; then
  echo "Blocked: destructive rm command targeting sensitive path" >&2
  exit 2
fi

if echo "$COMMAND" | grep -qE 'git\s+reset\s+--hard'; then
  echo "Blocked: git reset --hard" >&2
  exit 2
fi

if echo "$COMMAND" | grep -qiE 'DROP\s+(TABLE|DATABASE)'; then
  echo "Blocked: DROP TABLE/DATABASE" >&2
  exit 2
fi

if echo "$COMMAND" | grep -qE 'git\s+clean\s+-fd'; then
  echo "Blocked: git clean -fd" >&2
  exit 2
fi
