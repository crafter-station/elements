interface TerminalLine {
  type: "command" | "output" | "error" | "success" | "info" | "blocked";
  text: string;
}

export const hookPreviewData: Record<
  string,
  { title: string; lines: TerminalLine[] }
> = {
  install: {
    title: "terminal",
    lines: [
      { type: "command", text: "npx @tryelements/cli add-hook guard-branch" },
      { type: "output", text: "" },
      { type: "success", text: "Downloaded guard-branch.sh" },
      {
        type: "success",
        text: "Written to ~/.claude/hooks/elements/guard-branch.sh",
      },
      { type: "success", text: "Registered in ~/.claude/settings.json" },
      { type: "output", text: "" },
      {
        type: "info",
        text: "Hook guard-branch installed for PreToolUse (Bash)",
      },
    ],
  },
  "hook-guard-branch": {
    title: "PreToolUse — Bash",
    lines: [
      { type: "command", text: "git push origin main" },
      { type: "blocked", text: "Blocked: direct push to protected branch" },
      { type: "info", text: "Exit code 2 — action prevented" },
      { type: "output", text: "" },
      { type: "command", text: "git push --force origin feat/new-ui" },
      { type: "blocked", text: "Blocked: force push detected" },
      { type: "info", text: "Exit code 2 — action prevented" },
      { type: "output", text: "" },
      { type: "command", text: "git push origin feat/new-ui" },
      { type: "success", text: "Allowed — not a protected branch" },
    ],
  },
  "hook-guard-secrets": {
    title: "PreToolUse — Edit / Write",
    lines: [
      { type: "command", text: "claude: Edit .env.local" },
      { type: "blocked", text: "Blocked: editing sensitive file .env.local" },
      { type: "info", text: "Exit code 2 — action prevented" },
      { type: "output", text: "" },
      { type: "command", text: "claude: Write credentials.json" },
      {
        type: "blocked",
        text: "Blocked: editing sensitive file credentials.json",
      },
      { type: "output", text: "" },
      { type: "command", text: "claude: Edit src/utils.ts" },
      { type: "success", text: "Allowed — not a sensitive file" },
    ],
  },
  "hook-guard-destructive": {
    title: "PreToolUse — Bash",
    lines: [
      { type: "command", text: "rm -rf /" },
      {
        type: "blocked",
        text: "Blocked: destructive rm targeting sensitive path",
      },
      { type: "info", text: "Exit code 2 — action prevented" },
      { type: "output", text: "" },
      { type: "command", text: "git reset --hard" },
      { type: "blocked", text: "Blocked: git reset --hard" },
      { type: "output", text: "" },
      { type: "command", text: "DROP TABLE users;" },
      { type: "blocked", text: "Blocked: DROP TABLE/DATABASE" },
      { type: "output", text: "" },
      { type: "command", text: "git clean -fd" },
      { type: "blocked", text: "Blocked: git clean -fd" },
    ],
  },
  "hook-notify-macos": {
    title: "Notification event",
    lines: [
      { type: "info", text: "Claude Code fires Notification event..." },
      { type: "output", text: "" },
      { type: "success", text: "macOS Notification Center:" },
      { type: "output", text: "  Claude Code" },
      { type: "output", text: "  idle_prompt" },
      { type: "output", text: '  "Claude is waiting for input"' },
      { type: "output", text: "  Sound: Ping" },
    ],
  },
  "hook-notify-sound": {
    title: "Notification event",
    lines: [
      { type: "info", text: "Claude Code fires Notification event..." },
      { type: "output", text: "" },
      {
        type: "success",
        text: "macOS: afplay /System/Library/Sounds/Ping.aiff",
      },
      {
        type: "success",
        text: "Linux: paplay /usr/share/sounds/.../complete.oga",
      },
      { type: "success", text: "Linux (fallback): aplay trumpet-12.wav" },
    ],
  },
  "hook-notify-slack": {
    title: "Notification event → Slack",
    lines: [
      { type: "info", text: "Claude Code fires Notification event..." },
      { type: "output", text: "" },
      { type: "command", text: "curl -X POST $CLAUDE_HOOK_SLACK_WEBHOOK" },
      { type: "success", text: "Slack message sent:" },
      { type: "output", text: "  *Claude Code* (my-project)" },
      { type: "output", text: "  idle_prompt: Claude is waiting for input" },
    ],
  },
  "hook-notify-discord": {
    title: "Notification event → Discord",
    lines: [
      { type: "info", text: "Claude Code fires Notification event..." },
      { type: "output", text: "" },
      { type: "command", text: "curl -X POST $CLAUDE_HOOK_DISCORD_WEBHOOK" },
      { type: "success", text: "Discord message sent:" },
      { type: "output", text: "  **Claude Code** (my-project)" },
      { type: "output", text: "  idle_prompt: Claude is waiting for input" },
    ],
  },
  "hook-notify-telegram": {
    title: "Notification event → Telegram",
    lines: [
      { type: "info", text: "Claude Code fires Notification event..." },
      { type: "output", text: "" },
      {
        type: "command",
        text: "curl -X POST api.telegram.org/bot.../sendMessage",
      },
      { type: "success", text: "Telegram message sent:" },
      { type: "output", text: "  *Claude Code* (my-project)" },
      { type: "output", text: "  idle_prompt: Claude is waiting for input" },
    ],
  },
  "hook-auto-format": {
    title: "PostToolUse — Edit / Write",
    lines: [
      { type: "info", text: "Claude edits src/components/button.tsx..." },
      { type: "output", text: "" },
      { type: "command", text: "Detecting formatter..." },
      { type: "success", text: "Found biome.json — running Biome" },
      {
        type: "command",
        text: "npx @biomejs/biome check --write src/components/button.tsx",
      },
      { type: "success", text: "Formatted successfully" },
    ],
  },
  "hook-context-monitor": {
    title: "PostToolUse — context tracking",
    lines: [
      { type: "info", text: "Transcript: 360KB / 600KB" },
      { type: "output", text: "INFO: Context window at ~40% remaining." },
      { type: "output", text: "" },
      { type: "info", text: "Transcript: 450KB / 600KB" },
      {
        type: "blocked",
        text: "NOTICE: Context getting low (~25% remaining). Consider compacting soon.",
      },
      { type: "output", text: "" },
      { type: "info", text: "Transcript: 510KB / 600KB" },
      {
        type: "error",
        text: "WARNING: Context critically low (~15%). Use /compact now.",
      },
    ],
  },
  "hook-session-summary": {
    title: "Stop event — session log",
    lines: [
      { type: "info", text: "Claude Code session ending..." },
      { type: "output", text: "" },
      {
        type: "command",
        text: "Writing summary to ~/.claude/session-summaries/",
      },
      { type: "success", text: "Created abc123.md:" },
      { type: "output", text: "  # Session: abc123" },
      { type: "output", text: "  - Project: my-app" },
      { type: "output", text: "  - Ended: 2026-03-18T14:30:00" },
      { type: "output", text: "  - Transcript size: 245,312 bytes" },
    ],
  },
  "hook-cat-sounds": {
    title: "Notification event",
    lines: [
      { type: "info", text: "Claude Code fires Notification event..." },
      { type: "output", text: "" },
      { type: "command", text: "afplay ~/.cache/tryelements/cat-meow.mp3" },
      { type: "success", text: "meow! (real cat sound)" },
    ],
  },
};
