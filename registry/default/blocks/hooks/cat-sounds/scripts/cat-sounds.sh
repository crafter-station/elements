#!/usr/bin/env bash
[[ "$(uname)" != "Darwin" ]] && exit 0

CACHE_DIR="${HOME}/.cache/tryelements"
MEOW_FILE="${CACHE_DIR}/cat-meow.mp3"

if [[ ! -f "$MEOW_FILE" ]]; then
  mkdir -p "$CACHE_DIR"
  curl -sL "https://tryelements.dev/sfx/cat-meow.mp3" -o "$MEOW_FILE" 2>/dev/null
fi

if [[ -f "$MEOW_FILE" ]]; then
  afplay "$MEOW_FILE" &
else
  say -v Samantha "meow" &
fi
