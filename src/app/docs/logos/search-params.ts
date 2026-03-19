import { createLoader, parseAsArrayOf, parseAsString } from "nuqs/server";

export const logosSearchParams = {
  q: parseAsString.withDefault(""),
  categories: parseAsArrayOf(parseAsString, ",").withDefault([]),
  view: parseAsString.withDefault("individual"),
};

export const loadSearchParams = createLoader(logosSearchParams);
