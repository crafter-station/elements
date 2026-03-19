#!/usr/bin/env bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null)

[[ -z "$FILE_PATH" || ! -f "$FILE_PATH" ]] && exit 0

CWD=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('cwd','.'))" 2>/dev/null)

if [[ -f "$CWD/biome.json" || -f "$CWD/biome.jsonc" ]]; then
  npx @biomejs/biome check --write "$FILE_PATH" 2>/dev/null &
elif [[ -f "$CWD/.prettierrc" || -f "$CWD/.prettierrc.json" || -f "$CWD/prettier.config.js" || -f "$CWD/prettier.config.mjs" ]]; then
  npx prettier --write "$FILE_PATH" 2>/dev/null &
elif [[ "$FILE_PATH" == *.py ]]; then
  if command -v ruff &>/dev/null; then
    ruff format "$FILE_PATH" 2>/dev/null &
  elif command -v black &>/dev/null; then
    black "$FILE_PATH" 2>/dev/null &
  fi
elif [[ "$FILE_PATH" == *.rs ]]; then
  rustfmt "$FILE_PATH" 2>/dev/null &
elif [[ "$FILE_PATH" == *.go ]]; then
  gofmt -w "$FILE_PATH" 2>/dev/null &
fi
