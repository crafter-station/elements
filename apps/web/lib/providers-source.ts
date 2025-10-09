import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";

import { providers } from "@/.source";

export const providersSource = loader({
  baseUrl: "/l",
  source: createMDXSource(providers, []),
});
