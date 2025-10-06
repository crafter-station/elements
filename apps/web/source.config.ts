import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import type { ThemeRegistration } from "shiki";

import vesperDark from "./public/vesper-dark.json";
import vesperLight from "./public/vesper-light.json";

export const docs = defineDocs({
  dir: "content/docs",
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: vesperLight as ThemeRegistration,
        dark: vesperDark as ThemeRegistration,
      },
    },
  },
});
