import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

const providersDir = path.join(process.cwd(), "content/providers");

export const providersSource = {
  getPage: (slug: string[]) => {
    const providerSlug = slug[0];
    const filePath = path.join(providersDir, `${providerSlug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      data: {
        ...data,
        body: content,
      },
    };
  },
};
