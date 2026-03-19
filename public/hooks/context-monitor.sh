#!/usr/bin/env bash
INPUT=$(cat)

TRANSCRIPT=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('transcript_path',''))" 2>/dev/null)
[[ -z "$TRANSCRIPT" || ! -f "$TRANSCRIPT" ]] && exit 0

SIZE=$(wc -c < "$TRANSCRIPT" 2>/dev/null | tr -d ' ')
MAX_BYTES=600000

PERCENT=$(( (SIZE * 100) / MAX_BYTES ))
REMAINING=$(( 100 - PERCENT ))

STATE_FILE="/tmp/claude-context-monitor-$$"

if [[ $REMAINING -le 15 ]]; then
  [[ -f "${STATE_FILE}-15" ]] && exit 0
  touch "${STATE_FILE}-15"
  echo '{"hookSpecificOutput":{"additionalContext":"WARNING: Context window critically low (~15% remaining). Consider compacting with /compact."}}'
elif [[ $REMAINING -le 25 ]]; then
  [[ -f "${STATE_FILE}-25" ]] && exit 0
  touch "${STATE_FILE}-25"
  echo '{"hookSpecificOutput":{"additionalContext":"NOTICE: Context window getting low (~25% remaining). Consider wrapping up or compacting soon."}}'
elif [[ $REMAINING -le 40 ]]; then
  [[ -f "${STATE_FILE}-40" ]] && exit 0
  touch "${STATE_FILE}-40"
  echo '{"hookSpecificOutput":{"additionalContext":"INFO: Context window at ~40% remaining."}}'
fi
