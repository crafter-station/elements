#!/usr/bin/env bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null)
BASENAME=$(basename "$FILE_PATH")

BLOCKED_PATTERNS=('.env' '.env.local' '.env.production' 'credentials.json' 'service-account.json' 'id_rsa' 'id_ed25519' '.pem')

for pattern in "${BLOCKED_PATTERNS[@]}"; do
  if [[ "$BASENAME" == "$pattern" || "$BASENAME" == "${pattern}"* ]]; then
    echo "Blocked: editing sensitive file $BASENAME" >&2
    exit 2
  fi
done
