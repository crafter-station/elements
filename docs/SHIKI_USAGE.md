# Shiki Code Blocks - Usage Guide

This guide shows you how to use the enhanced code blocks with diff highlighting, line highlighting, focus modes, and more.

## Features

- **Diff highlighting**: Show added/removed lines with `[!code ++]` and `[!code --]`
- **Line highlighting**: Highlight specific lines with `[!code highlight]`
- **Focus mode**: Focus on specific lines with `[!code focus]`
- **Error/Warning levels**: Mark lines as errors or warnings with `[!code error]` and `[!code warning]`
- **Copy button**: Automatically added to all code blocks

## Examples

### Diff Highlighting

```typescript
// Show code changes
const oldFunction = () => {
  console.log('old code'); // [!code --]
  console.log('new code'); // [!code ++]
}
```

### Line Highlighting

```typescript
// [!code highlight:2]
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

Or highlight a single line:

```typescript
const greeting = "Hello";
console.log(greeting); // [!code highlight]
const farewell = "Goodbye";
```

### Focus Mode

```typescript
// [!code focus:2]
const important = "This is important";
const alsoImportant = "This too";
const lessImportant = "This is dimmed";
```

### Error and Warning Levels

```typescript
const correct = "This is correct";
const hasWarning = "Check this"; // [!code warning]
const hasError = "This is wrong"; // [!code error]
```

### Combining Multiple Features

```typescript
// [!code highlight:2]
function processData(data) {
  const oldWay = data.map(x => x * 2); // [!code --]
  const newWay = data.map(x => x ** 2); // [!code ++]

  if (!data) {
    throw new Error("Invalid data"); // [!code error]
  }

  return newWay;
}
```

## Algorithm Version

All transformers use the new `v3` matching algorithm for more intuitive line counting. In v3, the count starts from the line **after** the comment, not including the comment line itself.

## Copy Button

Every code block automatically includes a copy button in the top-right corner:
- Click to copy the entire code block
- Shows a check icon when copied
- Automatically hides after 2 seconds

## Styling

All styles are defined in `app/globals.css` using OKLCH color space for consistent theming across light and dark modes.
