"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ComponentIcon, FileTextIcon, SearchIcon } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface SearchItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: "page" | "component" | "provider";
  category?: string;
}

// Mock search data - in production this would come from a search index
const SEARCH_DATA: SearchItem[] = [
  // New MDX-based documentation
  {
    id: "ai-sdk",
    title: "AI SDK",
    description: "AI-powered components with Vercel's AI SDK",
    url: "/t/ai-sdk",
    type: "provider",
    category: "AI & Machine Learning",
  },
  {
    id: "stripe",
    title: "Stripe",
    description: "Complete payment components with Stripe",
    url: "/t/stripe",
    type: "provider",
    category: "Payments & Billing",
  },
  // Legacy routes (still accessible)
  {
    id: "clerk",
    title: "Clerk Authentication",
    description: "Complete authentication flows with Clerk",
    url: "/t/clerk",
    type: "provider",
    category: "Authentication",
  },
  {
    id: "uploadthing",
    title: "UploadThing",
    description: "File upload components with UploadThing",
    url: "/t/uploadthing",
    type: "provider",
    category: "File Upload",
  },
  {
    id: "theme-switcher",
    title: "Theme Switcher",
    description: "Dark/light mode toggle component",
    url: "/t/theme-switcher",
    type: "component",
    category: "UI",
  },
  {
    id: "logos",
    title: "Logos",
    description: "Company and product logos collection",
    url: "/t/logos",
    type: "component",
    category: "Branding",
  },
  {
    id: "trigger",
    title: "Trigger",
    description: "Trigger integration components",
    url: "/t/trigger",
    type: "provider",
    category: "Automation",
  },
  {
    id: "polar",
    title: "Polar",
    description: "Polar integration for subscriptions",
    url: "/t/polar",
    type: "provider",
    category: "Payments",
  },
];

interface CommandSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandSearch({ open, onOpenChange }: CommandSearchProps) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredItems = SEARCH_DATA.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (url: string) => {
    onOpenChange(false);
    router.push(url);
  };

  const getIcon = (type: SearchItem["type"]) => {
    switch (type) {
      case "provider":
        return <ComponentIcon className="h-4 w-4" />;
      case "component":
        return <ComponentIcon className="h-4 w-4" />;
      case "page":
        return <FileTextIcon className="h-4 w-4" />;
      default:
        return <SearchIcon className="h-4 w-4" />;
    }
  };

  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      const group =
        item.type === "provider"
          ? "Providers"
          : item.type === "component"
            ? "Components"
            : "Pages";
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    },
    {} as Record<string, SearchItem[]>,
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search documentation..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.entries(groupedItems).map(([group, items]) => (
          <CommandGroup key={group} heading={group}>
            {items.map((item) => (
              <CommandItem
                key={item.id}
                value={item.title}
                onSelect={() => handleSelect(item.url)}
                className="flex items-center gap-3"
              >
                {getIcon(item.type)}
                <div className="flex flex-col">
                  <span className="font-medium">{item.title}</span>
                  {item.description && (
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  )}
                </div>
                {item.category && (
                  <span className="ml-auto text-xs text-muted-foreground bg-accent px-2 py-1 rounded">
                    {item.category}
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

export function useCommandSearch() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return { open, setOpen };
}
