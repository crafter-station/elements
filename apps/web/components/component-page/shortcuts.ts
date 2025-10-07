export const KEYBOARD_SHORTCUTS = {
  SEARCH: { key: "k", meta: true, description: "Open search" },
  TOGGLE_PREVIEW: { key: " ", description: "Toggle preview" },
  SELECT_ALL: { key: "a", meta: true, description: "Select all visible" },
  COPY_COMMAND: { key: "c", meta: true, description: "Copy install command" },
  ESCAPE: { key: "Escape", description: "Clear selection/close" },
  ARROW_UP: { key: "ArrowUp", description: "Navigate up" },
  ARROW_DOWN: { key: "ArrowDown", description: "Navigate down" },
  ENTER: { key: "Enter", description: "Select component" },
  TOGGLE_VIEW: {
    key: "v",
    meta: true,
    description: "Toggle view mode",
  },
} as const;

export type ShortcutKey = keyof typeof KEYBOARD_SHORTCUTS;

export function matchesShortcut(
  event: KeyboardEvent,
  shortcut: ShortcutKey,
): boolean {
  const config = KEYBOARD_SHORTCUTS[shortcut];

  // Check if key matches
  if (event.key !== config.key) return false;

  // Check if meta/cmd key is required
  if ("meta" in config && config.meta) {
    return event.metaKey || event.ctrlKey;
  }

  // If no meta required, ensure meta is NOT pressed (to avoid conflicts)
  return !event.metaKey && !event.ctrlKey;
}
