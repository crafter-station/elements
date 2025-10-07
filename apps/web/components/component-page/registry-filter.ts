import type { RegistryItem } from "./types";

export function filterRegistryItems(
  items: RegistryItem[],
  name: string,
  category: string,
): RegistryItem[] {
  const searchName = name.toLowerCase().replace(/\s+/g, "-");
  const searchCategory = category.toLowerCase();

  return items.filter((item) => {
    const itemName = item.name.toLowerCase();

    if (itemName.includes(searchName)) return true;
    if (itemName.startsWith(searchName)) return true;
    if (searchCategory.includes(itemName) || itemName.includes(searchCategory))
      return true;

    const nameParts = searchName.split("-").filter((part) => part.length > 2);
    const itemParts = itemName.split("-").filter((part) => part.length > 2);
    const commonParts = nameParts.filter((part) => itemParts.includes(part));

    return commonParts.length > 0;
  });
}
