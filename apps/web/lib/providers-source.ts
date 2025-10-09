import { loader } from "fumadocs-core/source";

import { providers } from "@/.source";

export const providersSource = loader({
  baseUrl: "/l",
  source: providers.toFumadocsSource(),
});
