"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { track } from "@vercel/analytics";
import { Filter } from "lucide-react";

import { getBrandUrl } from "@/lib/brand-urls";
import { loadLogoComponent } from "@/lib/component-loader";

import { Header } from "@/components/header";
import { GroupIcon } from "@/components/icons/group";
import { SearchIcon } from "@/components/icons/search";
import { InstallCommand } from "@/components/install-command";
import { PixelatedCheckIcon } from "@/components/pixelated-check-icon";
import { ScrambleText } from "@/components/scramble-text";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { LogoContextMenu } from "./logo-context-menu";

interface Logo {
  id: string;
  name: string;
  displayName: string;
  category: string;
}

interface LogoWithComponent extends Logo {
  component: React.ComponentType<{ className?: string }> | null;
}

interface LogosClientProps {
  logos: Logo[];
}

export function LogosClient({ logos: initialLogos }: LogosClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLogos, setSelectedLogos] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [logos, setLogos] = useState<LogoWithComponent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load logo components on mount
  useEffect(() => {
    let isMounted = true;

    async function loadLogos() {
      const loadedLogos = await Promise.all(
        initialLogos.map(async (logo) => {
          const component = await loadLogoComponent(logo.name);
          return {
            ...logo,
            component,
          };
        }),
      );

      if (isMounted) {
        setLogos(loadedLogos.filter((logo) => logo.component !== null));
        setIsLoading(false);
      }
    }

    loadLogos();

    return () => {
      isMounted = false;
    };
  }, [initialLogos]);

  const filteredLogos = useMemo(() => {
    return logos.filter((logo) => {
      // Search filter
      const matchesSearch =
        logo.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        logo.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(logo.category);

      return matchesSearch && matchesCategory;
    });
  }, [logos, searchTerm, selectedCategories]);

  // Get unique categories and counts
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(logos.map((logo) => logo.category))).sort();
  }, [logos]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const logo of logos) {
      counts.set(logo.category, (counts.get(logo.category) || 0) + 1);
    }
    return counts;
  }, [logos]);

  const handleCategoryChange = (checked: boolean, category: string) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, category] : prev.filter((c) => c !== category),
    );

    track("Logo Category Filter", {
      category: category,
      action: checked ? "select" : "deselect",
      source: "logos_page_filter",
    });
  };

  // Track search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchTerm.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        track("Logo Search", {
          search_term: searchTerm.trim(),
          results_count: filteredLogos.length,
          source: "logos_page_search",
        });
      }, 500);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, filteredLogos.length]);

  const handleLogoToggle = (logoId: string) => {
    const logo = logos.find((l) => l.id === logoId);
    const isCurrentlySelected = selectedLogos.has(logoId);

    track("Logo Selection", {
      logo_id: logoId,
      logo_name: logo?.displayName || logoId,
      logo_category: logo?.category || "unknown",
      action: isCurrentlySelected ? "deselect" : "select",
      total_selected_after: isCurrentlySelected
        ? selectedLogos.size - 1
        : selectedLogos.size + 1,
      source: "logos_page_grid",
    });

    const newSelected = new Set(selectedLogos);
    if (newSelected.has(logoId)) {
      newSelected.delete(logoId);
    } else {
      newSelected.add(logoId);
    }
    setSelectedLogos(newSelected);
  };

  const handleSelectAll = () => {
    const isSelectingAll = selectedLogos.size !== filteredLogos.length;

    track("Bulk Logo Selection", {
      action: isSelectingAll ? "select_all" : "deselect_all",
      logos_count: filteredLogos.length,
      search_term: searchTerm || "none",
      source: "logos_page_bulk_action",
    });

    if (selectedLogos.size === filteredLogos.length) {
      setSelectedLogos(new Set());
    } else {
      setSelectedLogos(new Set(filteredLogos.map((logo) => logo.id)));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Loading logos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="flex-1 w-full border-border border-dotted sm:border-x mx-auto">
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div
              className="absolute inset-0 bg-gradient-to-br from-background via-background to-[]"
              style={{
                backgroundColor: "#10B98105",
                backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 8px,
              #10B98115 8px,
              #10B98115 9px
            )`,
              }}
            />
          </div>

          <div className="relative z-10 w-full py-8 md:py-12 px-4 sm:px-6 md:px-8">
            {/* Centered Hero */}
            <div className="text-center max-w-3xl mx-auto space-y-4 md:space-y-6">
              <div className="space-y-3 md:space-y-4">
                <span
                  className="font-mono text-xs sm:text-sm"
                  style={{ color: "#10B981" }}
                >
                  [ BRAND ]
                </span>
                <div className="flex items-center justify-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0">
                    <GroupIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h1 className="font-dotted font-black text-2xl sm:text-3xl md:text-4xl leading-tight">
                    <ScrambleText text="Brand Logos" />
                  </h1>
                </div>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Tech company logos for popular services and platforms. Select
                  the ones you need or Install all {logos.length} logos at once
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <InstallCommand
                  url="@elements/logos"
                  className="max-w-xs"
                  source="logos_page_hero"
                  componentName="Tech Logos"
                  category="Brand"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="border-t border-border border-dotted px-4 sm:px-6 md:px-8 py-6">
          <div className="w-full mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Input
                    type="text"
                    placeholder="Search logos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <SearchIcon className="size-4" />
                  </div>
                </div>

                {/* Category Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter
                        className="-ms-1 opacity-60"
                        size={16}
                        aria-hidden="true"
                      />
                      Categories
                      {selectedCategories.length > 0 && (
                        <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                          {selectedCategories.length}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto min-w-36 p-3" align="start">
                    <div className="space-y-3">
                      <div className="text-muted-foreground text-xs font-medium">
                        Filter by Category
                      </div>
                      <div className="space-y-3">
                        {uniqueCategories.map((category, i) => (
                          <div
                            key={category}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              id={`category-${i}`}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={(checked: boolean) =>
                                handleCategoryChange(checked, category)
                              }
                            />
                            <Label
                              htmlFor={`category-${i}`}
                              className="flex grow justify-between gap-2 font-normal"
                            >
                              {category}{" "}
                              <span className="text-muted-foreground ms-2 text-xs">
                                {categoryCounts.get(category)}
                              </span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="shrink-0"
              >
                {selectedLogos.size === filteredLogos.length
                  ? `Deselect All (${filteredLogos.length})`
                  : `Select All (${filteredLogos.length})`}
              </Button>
            </div>
          </div>
        </div>

        {/* Logo Grid */}
        <div className="border-t border-border border-dotted px-4 sm:px-6 md:px-8 py-8">
          <div className="w-full mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {filteredLogos.map((logo) => {
                const LogoComponent = logo.component;
                const isSelected = selectedLogos.has(logo.id);
                const brandUrl = getBrandUrl(logo.name);

                if (!LogoComponent) return null;

                return (
                  <LogoContextMenu
                    key={logo.id}
                    logoName={logo.name}
                    displayName={logo.displayName}
                    category={logo.category}
                    component={LogoComponent}
                    brandUrl={brandUrl}
                  >
                    <button
                      type="button"
                      onClick={() => handleLogoToggle(logo.id)}
                      className={`
                        group relative p-4 md:p-6 rounded-lg border cursor-context-menu transition-all duration-200
                        hover:shadow-md hover:scale-105
                        ${
                          isSelected
                            ? "bg-primary/10 border-primary ring-2 ring-primary/20"
                            : "bg-card hover:bg-accent/50"
                        }
                      `}
                      title="Right-click for options"
                    >
                      {/* Selection indicator */}
                      <div
                        className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-muted-foreground/30 group-hover:border-primary/50"
                        }`}
                      >
                        {isSelected && (
                          <PixelatedCheckIcon className="w-2 h-2 text-primary-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>

                      {/* Context menu indicator */}
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-70 transition-opacity duration-200">
                        <svg
                          className="w-3 h-3 text-muted-foreground"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <title>Right-click for more options</title>
                          <circle cx="2" cy="8" r="1.5" />
                          <circle cx="8" cy="8" r="1.5" />
                          <circle cx="14" cy="8" r="1.5" />
                        </svg>
                      </div>

                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                          <LogoComponent className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-200 group-hover:scale-110" />
                        </div>

                        <div className="text-center space-y-1">
                          <h3 className="font-medium text-xs md:text-sm">
                            {logo.displayName}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {logo.category}
                          </p>
                        </div>
                      </div>
                    </button>
                  </LogoContextMenu>
                );
              })}
            </div>

            {/* Empty state */}
            {filteredLogos.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <svg
                    className="w-12 h-12 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>No logos found</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.002-5.824-2.625"
                    />
                  </svg>
                  <p className="text-lg font-medium mb-2">No logos found</p>
                  <p className="text-sm">Try adjusting your search term</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dock-style Install Command */}
      {selectedLogos.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="bg-card border rounded-lg shadow-lg w-full p-3 overflow-hidden">
            <InstallCommand
              url={logos
                .filter((logo) => selectedLogos.has(logo.id))
                .map((logo) => `@elements/${logo.name}`)
                .join(" ")}
              className="w-full max-w-none min-w-0"
              source="logos_page_install_dock"
              componentName={`${selectedLogos.size} Logos`}
              category="Brand"
            />
          </div>
        </div>
      )}
    </div>
  );
}
