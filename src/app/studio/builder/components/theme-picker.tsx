"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Palette, Search, Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TinteBlock {
  bg: string;
  bg_2: string;
  ui: string;
  ui_2: string;
  ui_3: string;
  tx_3: string;
  tx_2: string;
  tx: string;
  pr: string;
  sc: string;
  ac_1: string;
  ac_2: string;
  ac_3: string;
}

interface TinteTheme {
  id: string;
  name: string;
  light: TinteBlock;
  dark: TinteBlock;
}

interface ThemePickerProps {
  selectedThemeId: string | null;
  onSelectTheme: (themeId: string | null, cssVars: { light: Record<string, string>; dark: Record<string, string> } | null) => void;
}

function ThemePreviewSwatch({ theme }: { theme: TinteTheme }) {
  return (
    <div className="flex gap-0.5">
      {[theme.light.bg, theme.light.pr, theme.light.ac_1, theme.dark.bg, theme.dark.pr].map(
        (color, i) => (
          <div
            key={`${theme.id}-${i}`}
            className="size-4 rounded-sm border"
            style={{ backgroundColor: color }}
          />
        ),
      )}
    </div>
  );
}

function ThemeCard({
  theme,
  isSelected,
  onSelect,
}: {
  theme: TinteTheme;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent/50",
        isSelected && "border-primary bg-primary/5",
      )}
    >
      <div className="flex gap-0.5 shrink-0">
        <div className="flex flex-col gap-0.5">
          <div className="size-5 rounded-sm" style={{ backgroundColor: theme.light.bg }} />
          <div className="size-5 rounded-sm" style={{ backgroundColor: theme.light.pr }} />
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="size-5 rounded-sm" style={{ backgroundColor: theme.dark.bg }} />
          <div className="size-5 rounded-sm" style={{ backgroundColor: theme.dark.pr }} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{theme.name}</p>
        <ThemePreviewSwatch theme={theme} />
      </div>
      {isSelected && <Check className="size-4 text-primary shrink-0" />}
    </button>
  );
}

export function ThemePicker({ selectedThemeId, onSelectTheme }: ThemePickerProps) {
  const [themes, setThemes] = useState<TinteTheme[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchThemes = useCallback(async (pageNum: number, searchQuery: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "20",
      });
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`https://tinte.dev/api/themes?${params}`);
      if (!res.ok) throw new Error("Failed to fetch themes");
      const data = await res.json();

      const fetched: TinteTheme[] = (data.themes || data || []).map((t: any) => ({
        id: t.id || t.slug || t.name,
        name: t.name || t.displayName || "Untitled",
        light: t.light || t.colorSchemes?.light || {},
        dark: t.dark || t.colorSchemes?.dark || {},
      }));

      if (pageNum === 1) {
        setThemes(fetched);
      } else {
        setThemes((prev) => [...prev, ...fetched]);
      }
      setHasMore(fetched.length >= 20);
    } catch {
      setError("Could not load themes from tinte.dev");
      if (pageNum === 1) setThemes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThemes(1, search);
    setPage(1);
  }, [search, fetchThemes]);

  function handleSelect(theme: TinteTheme) {
    if (selectedThemeId === theme.id) {
      onSelectTheme(null, null);
      return;
    }

    const lightVars = mapBlockToVars(theme.light, "light");
    const darkVars = mapBlockToVars(theme.dark, "dark");
    onSelectTheme(theme.id, { light: lightVars, dark: darkVars });
  }

  function handleClear() {
    onSelectTheme(null, null);
  }

  const selectedTheme = themes.find((t) => t.id === selectedThemeId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Palette className="size-4" />
          Theme
        </CardTitle>
        {selectedTheme && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              {selectedTheme.name}
              <button
                type="button"
                onClick={handleClear}
                className="rounded-full hover:bg-muted"
              >
                <X className="size-3" />
              </button>
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Palette className="size-4" />
              {selectedTheme ? (
                <span className="flex items-center gap-2">
                  <ThemePreviewSwatch theme={selectedTheme} />
                  {selectedTheme.name}
                </span>
              ) : (
                "Browse Tinte themes..."
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search themes..."
                  className="pl-8 text-sm"
                />
              </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
              {error && (
                <p className="text-sm text-destructive p-2">{error}</p>
              )}

              {themes.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isSelected={selectedThemeId === theme.id}
                  onSelect={() => handleSelect(theme)}
                />
              ))}

              {isLoading && (
                <div className="flex justify-center py-4">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              )}

              {!isLoading && themes.length === 0 && !error && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No themes found
                </p>
              )}

              {hasMore && !isLoading && themes.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    const next = page + 1;
                    setPage(next);
                    fetchThemes(next, search);
                  }}
                >
                  Load more
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {selectedTheme && (
          <div className="mt-3 space-y-2">
            <Label className="text-xs text-muted-foreground">Preview</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border p-3" style={{ backgroundColor: selectedTheme.light.bg }}>
                <p className="text-xs font-medium" style={{ color: selectedTheme.light.tx }}>
                  Light
                </p>
                <div className="mt-2 flex gap-1">
                  <div className="size-4 rounded" style={{ backgroundColor: selectedTheme.light.pr }} />
                  <div className="size-4 rounded" style={{ backgroundColor: selectedTheme.light.sc }} />
                  <div className="size-4 rounded" style={{ backgroundColor: selectedTheme.light.ac_1 }} />
                </div>
              </div>
              <div className="rounded-lg border p-3" style={{ backgroundColor: selectedTheme.dark.bg }}>
                <p className="text-xs font-medium" style={{ color: selectedTheme.dark.tx }}>
                  Dark
                </p>
                <div className="mt-2 flex gap-1">
                  <div className="size-4 rounded" style={{ backgroundColor: selectedTheme.dark.pr }} />
                  <div className="size-4 rounded" style={{ backgroundColor: selectedTheme.dark.sc }} />
                  <div className="size-4 rounded" style={{ backgroundColor: selectedTheme.dark.ac_1 }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function mapBlockToVars(block: TinteBlock, mode: "light" | "dark"): Record<string, string> {
  const bg = block.bg || (mode === "light" ? "#ffffff" : "#0b0b0f");
  const fg = block.tx || (mode === "light" ? "#0b0b0f" : "#ffffff");

  return {
    background: bg,
    foreground: fg,
    card: block.bg_2 || bg,
    "card-foreground": fg,
    popover: block.bg_2 || bg,
    "popover-foreground": fg,
    primary: block.pr || (mode === "light" ? "#0f172a" : "#f8fafc"),
    "primary-foreground": mode === "light" ? "#ffffff" : "#0b0b0f",
    secondary: block.sc || block.ui || "#64748b",
    "secondary-foreground": fg,
    muted: block.ui || (mode === "light" ? "#f1f5f9" : "#1e293b"),
    "muted-foreground": block.tx_3 || "#94a3b8",
    accent: block.ac_1 || block.ui_2 || "#f1f5f9",
    "accent-foreground": fg,
    destructive: block.ac_3 || "#ef4444",
    "destructive-foreground": "#ffffff",
    border: block.ui_2 || (mode === "light" ? "#e2e8f0" : "#334155"),
    input: block.ui_3 || block.ui_2 || "#e2e8f0",
    ring: block.pr || "#0f172a",
    "chart-1": block.pr || "#2563eb",
    "chart-2": block.ac_1 || "#10b981",
    "chart-3": block.sc || "#f59e0b",
    "chart-4": block.ac_2 || "#8b5cf6",
    "chart-5": block.ac_3 || "#ef4444",
  };
}
