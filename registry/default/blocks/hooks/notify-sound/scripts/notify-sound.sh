#!/usr/bin/env bash
if [[ "$(uname)" == "Darwin" ]]; then
  afplay /System/Library/Sounds/Ping.aiff &
elif command -v paplay &>/dev/null; then
  paplay /usr/share/sounds/freedesktop/stereo/complete.oga &
elif command -v aplay &>/dev/null; then
  aplay /usr/share/sounds/sound-icons/trumpet-12.wav &
fi
