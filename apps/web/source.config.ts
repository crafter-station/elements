import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { createGenerator, remarkAutoTypeTable } from "fumadocs-typescript";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

export const docs = defineDocs({
  dir: "content/docs",
});

const generator = createGenerator();

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMath, [remarkAutoTypeTable, { generator }]],
    rehypePlugins: (v) => [rehypeKatex, ...v],
  },
});
