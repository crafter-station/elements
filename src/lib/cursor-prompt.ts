interface CursorPromptOptions {
  componentName: string;
  installUrl: string;
  description?: string;
  category?: string;
}

/**
 * Generates a Cursor-compatible prompt for installing an Elements component.
 * The prompt includes installation instructions and basic usage guidance.
 */
export function generateCursorPrompt({
  componentName,
  installUrl,
  description,
  category,
}: CursorPromptOptions): string {
  const kebabName = componentName
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();

  const pascalName = componentName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  const docsUrl = category
    ? `https://tryelements.dev/docs/components/${category.toLowerCase()}/${kebabName}`
    : `https://tryelements.dev/docs/components/${kebabName}`;

  return `# Install ${componentName} from Elements

${description ? `**Purpose:** ${description}\n` : ""}
## Installation

Install the component using your preferred package manager:

\`\`\`bash
bunx shadcn@latest add ${installUrl}
# or
npx shadcn@latest add ${installUrl}
# or
pnpm dlx shadcn@latest add ${installUrl}
\`\`\`

## Usage

\`\`\`tsx
import { ${pascalName} } from "@/components/elements/${kebabName}";

export function Example() {
  return <${pascalName} />;
}
\`\`\`

## Documentation

For complete props, examples, and API reference, visit:
${docsUrl}

---

**Note:** This component is from the Elements registry (tryelements.dev).
If you're able to use a web tool to access a URL, visit the documentation link above to get the latest usage instructions.`;
}

/**
 * Creates a Cursor deep link URL with the encoded prompt.
 */
export function createCursorUrl(prompt: string): string {
  const encodedPrompt = encodeURIComponent(prompt);
  return `https://cursor.com/link/prompt?text=${encodedPrompt}`;
}

/**
 * Generates a complete Cursor URL for a component.
 */
export function generateCursorUrl(options: CursorPromptOptions): string {
  const prompt = generateCursorPrompt(options);
  return createCursorUrl(prompt);
}
