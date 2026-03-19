#!/usr/bin/env bash
INPUT=$(cat)

STOP_HOOK_ACTIVE=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('stop_hook_active', False))" 2>/dev/null)
[[ "$STOP_HOOK_ACTIVE" == "True" ]] && exit 0

SESSION_ID=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('session_id','unknown'))" 2>/dev/null)
TRANSCRIPT=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('transcript_path',''))" 2>/dev/null)
CWD=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('cwd',''))" 2>/dev/null)

LOG_DIR="$HOME/.claude/session-summaries"
mkdir -p "$LOG_DIR"

TIMESTAMP=$(date +%Y-%m-%dT%H:%M:%S)
PROJECT=$(basename "$CWD")
TRANSCRIPT_SIZE=$(wc -c < "$TRANSCRIPT" 2>/dev/null | tr -d ' ')

cat > "$LOG_DIR/${SESSION_ID}.md" << EOF
# Session: ${SESSION_ID}
- Project: ${PROJECT}
- Ended: ${TIMESTAMP}
- Transcript size: ${TRANSCRIPT_SIZE} bytes
- Working directory: ${CWD}
EOF
