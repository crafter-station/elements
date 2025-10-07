"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { track } from "@vercel/analytics";
import { FileCode, Layers } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";

interface QuickSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  components: string[];
  onSelectComponent: (key: string) => void;
  category: string;
  pageName: string;
}

export function QuickSearch({
  open,
  onOpenChange,
  components,
  onSelectComponent,
  category,
  pageName,
}: QuickSearchProps) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredComponents = components.filter((key) =>
    key.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (componentKey: string) => {
    track("Quick Search Component Select", {
      component_key: componentKey,
      category,
      page_name: pageName,
      source: "quick_search",
    });
    onSelectComponent(componentKey);
    onOpenChange(false);
  };

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Component Search"
      description="Search and navigate to components quickly"
    >
      <CommandInput
        placeholder="Search components..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>
          <div className="py-6 text-center text-sm">
            <p className="text-muted-foreground">No components found.</p>
          </div>
        </CommandEmpty>

        {filteredComponents.length > 0 && (
          <CommandGroup heading="Components">
            {filteredComponents.map((componentKey) => (
              <CommandItem
                key={componentKey}
                value={componentKey}
                onSelect={() => handleSelect(componentKey)}
                className="flex items-center gap-3"
              >
                <Layers className="h-4 w-4" />
                <div className="flex flex-col flex-1">
                  <span className="font-medium capitalize">
                    {componentKey.replace(/-/g, " ")}
                  </span>
                </div>
                <CommandShortcut>↵</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => {
              track("Quick Search Action", {
                action: "view_docs",
                category,
                page_name: pageName,
                source: "quick_search",
              });
              router.push("/docs");
              onOpenChange(false);
            }}
          >
            <FileCode className="h-4 w-4" />
            <span>View Documentation</span>
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function useQuickSearch() {
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
