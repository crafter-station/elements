export interface ParsedCodeBlock {
  language: string;
  code: string;
  imports: string[];
}

const CODE_BLOCK_REGEX = /```(\w+)?\n([\s\S]*?)```/g;
const IMPORT_REGEX =
  /import\s+(?:{[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/g;

export function extractCodeBlocks(content: string): ParsedCodeBlock[] {
  const blocks: ParsedCodeBlock[] = [];
  let match: RegExpExecArray | null = CODE_BLOCK_REGEX.exec(content);

  while (match !== null) {
    const language = match[1] || "tsx";
    const code = match[2].trim();
    const imports = extractImports(code);

    blocks.push({ language, code, imports });
    match = CODE_BLOCK_REGEX.exec(content);
  }

  return blocks;
}

export function extractImports(code: string): string[] {
  const imports: string[] = [];
  let match: RegExpExecArray | null;

  const importRegex = new RegExp(IMPORT_REGEX.source, "g");
  match = importRegex.exec(code);
  while (match !== null) {
    imports.push(match[1]);
    match = importRegex.exec(code);
  }

  return imports;
}

export function extractPartialCodeBlocks(content: string): ParsedCodeBlock[] {
  const blocks: ParsedCodeBlock[] = [];

  const completeBlocks = extractCodeBlocks(content);
  blocks.push(...completeBlocks);

  const lastBlockStart = content.lastIndexOf("```");
  const lastBlockEnd = content.lastIndexOf("```", content.length - 4);

  if (lastBlockStart > lastBlockEnd && lastBlockStart !== -1) {
    const partialMatch = content
      .slice(lastBlockStart)
      .match(/```(\w+)?\n([\s\S]*)/);
    if (partialMatch) {
      const language = partialMatch[1] || "tsx";
      const code = partialMatch[2].trim();
      const imports = extractImports(code);
      blocks.push({ language, code, imports });
    }
  }

  return blocks;
}

export function isValidReactComponent(code: string): boolean {
  return (
    code.includes("export default function") ||
    code.includes("export function") ||
    code.includes("export const")
  );
}
