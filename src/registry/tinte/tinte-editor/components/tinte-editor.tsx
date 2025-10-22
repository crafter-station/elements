"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { formatHex, oklch } from "culori";
import { Loader2, RefreshCw, Search, X } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { TinteLogo } from "@/registry/logos/tinte";
import {
  convertTinteToShadcn,
  type TinteTheme,
} from "../../../lib/elements/tinte/tinte-to-shadcn";
import { ChatInput } from "./chat/chat-input";
import { Message as ChatMessage } from "./chat/chat-message";
import { ColorInput } from "./color-input";

type ShadcnTokens = Record<string, string>;

interface ShadcnTheme {
  light: ShadcnTokens;
  dark: ShadcnTokens;
}

interface TinteThemePreview {
  id: string;
  slug: string;
  name: string;
  concept?: string;
  is_public: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    foreground: string;
    background: string;
  };
  rawTheme?: TinteTheme;
  overrides?: {
    shadcn?: {
      light: ShadcnTokens;
      dark: ShadcnTokens;
    };
  };
}

// Token groups for organized UI
const TOKEN_GROUPS = [
  {
    label: "Background & Text",
    tokens: ["background", "foreground", "muted", "muted-foreground"],
  },
  {
    label: "Cards & Surfaces",
    tokens: ["card", "card-foreground", "popover", "popover-foreground"],
  },
  {
    label: "Interactive Elements",
    tokens: [
      "primary",
      "primary-foreground",
      "secondary",
      "secondary-foreground",
      "accent",
      "accent-foreground",
    ],
  },
  {
    label: "Forms & States",
    tokens: [
      "border",
      "input",
      "ring",
      "destructive",
      "destructive-foreground",
    ],
  },
  {
    label: "Charts",
    tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  },
  {
    label: "Sidebar",
    tokens: [
      "sidebar-background",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ],
  },
] as const;

interface TinteEditorProps {
  onChange?: (theme: ShadcnTheme) => void;
}

export function TinteEditor({ onChange }: TinteEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<ShadcnTheme>({ light: {}, dark: {} });
  const themeRef = useRef<ShadcnTheme>({ light: {}, dark: {} });
  const [_originalFormats, setOriginalFormats] = useState<
    Record<string, Record<string, string>>
  >({ light: {}, dark: {} });
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [loading, setLoading] = useState(false);
  const [rawCss, setRawCss] = useState("");

  // Tinte themes state
  const [tinteThemes, setTinteThemes] = useState<TinteThemePreview[]>([]);
  const [loadingTinteThemes, setLoadingTinteThemes] = useState(false);
  const [tinteError, setTinteError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Keep ref in sync with theme state
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  // Chat functionality
  const [apiKeyError, setApiKeyError] = useState(false);
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/tinte/chat",
    }),
    onError: (error) => {
      console.error("Chat error:", error);
      // Check if it's an API key error
      if (error.message?.includes("OpenAI API key")) {
        setApiKeyError(true);
      }
    },
  });

  // Convert color to hex if it's in another format
  const convertToHex = useCallback((colorValue: string): string => {
    try {
      const trimmed = colorValue.trim();
      if (trimmed.startsWith("#")) {
        return trimmed; // Already hex
      }
      // Use culori to convert any color format to hex
      const colorObj = oklch(trimmed);
      if (colorObj) {
        return formatHex(colorObj);
      }
      return colorValue; // Return original if conversion fails
    } catch {
      return colorValue;
    }
  }, []);

  // Handle theme application from the Message component
  const handleApplyTheme = useCallback(
    (newTheme: { light: ShadcnTokens; dark: ShadcnTokens }) => {
      console.log("Applying theme:", newTheme);

      // Convert all colors to hex format
      const lightHex: ShadcnTokens = {};
      const darkHex: ShadcnTokens = {};

      Object.entries(newTheme.light).forEach(([key, value]) => {
        lightHex[key] = convertToHex(value);
      });

      Object.entries(newTheme.dark).forEach(([key, value]) => {
        darkHex[key] = convertToHex(value);
      });

      const hexTheme = { light: lightHex, dark: darkHex };

      setTheme(hexTheme);
      onChange?.(hexTheme);

      // Update original formats with hex
      setOriginalFormats({
        light: { ...lightHex },
        dark: { ...darkHex },
      });

      // Mark as unsaved and let user save manually
      // Setting to true will trigger the pulsing save button
      setHasUnsavedChanges(true);

      // Apply theme to DOM immediately for instant preview
      setTimeout(() => {
        const root = document.documentElement;
        const isDark = root.classList.contains("dark");
        const activeTheme = isDark ? hexTheme.dark : hexTheme.light;

        // Apply all CSS variables to the root element
        Object.entries(activeTheme).forEach(([key, value]) => {
          root.style.setProperty(`--${key}`, value);
        });

        // Also inject style for both modes
        const styleId = "tinte-dynamic-theme";
        let styleElement = document.getElementById(styleId) as HTMLStyleElement;

        if (!styleElement) {
          styleElement = document.createElement("style");
          styleElement.id = styleId;
          document.head.appendChild(styleElement);
        }

        const lightTokens = Object.entries(hexTheme.light)
          .map(([key, value]) => `  --${key}: ${value};`)
          .join("\n");

        const darkTokens = Object.entries(hexTheme.dark)
          .map(([key, value]) => `  --${key}: ${value};`)
          .join("\n");

        styleElement.textContent = `:root {\n${lightTokens}\n}\n\n.dark {\n${darkTokens}\n}`;
      }, 100);
    },
    [onChange, convertToHex],
  );

  // Detect color format
  const detectColorFormat = useCallback(
    (colorValue: string): "hex" | "oklch" | "rgb" | "hsl" | "unknown" => {
      const trimmed = colorValue.trim();
      if (trimmed.startsWith("#")) return "hex";
      if (trimmed.startsWith("oklch(")) return "oklch";
      if (trimmed.startsWith("rgb(")) return "rgb";
      if (trimmed.startsWith("hsl(")) return "hsl";
      return "unknown";
    },
    [],
  );

  // Load theme from globals.css
  const loadTheme = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/elements/tinte/read-globals");
      if (response.ok) {
        const data = await response.json();

        // Convert all colors to hex format by default
        const lightHex: ShadcnTokens = {};
        const darkHex: ShadcnTokens = {};

        Object.entries(data.theme.light).forEach(([key, value]) => {
          lightHex[key] = convertToHex(value as string);
        });

        Object.entries(data.theme.dark).forEach(([key, value]) => {
          darkHex[key] = convertToHex(value as string);
        });

        setTheme({ light: lightHex, dark: darkHex });

        // Store hex formats as original formats
        setOriginalFormats({ light: lightHex, dark: darkHex });
      } else {
        console.error("Failed to load theme from globals.css");
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
    setLoading(false);
  }, [convertToHex]);

  // Fetch Tinte themes
  const fetchTinteThemes = useCallback(async (page = 1, search?: string) => {
    setLoadingTinteThemes(true);
    setTinteError(null);
    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const response = await fetch(
        `https://www.tinte.dev/api/themes/public?limit=20&page=${page}${searchParam}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch themes from Tinte");
      }
      const data = await response.json();
      setTinteThemes(data.themes || []);
      setCurrentPage(data.pagination.page);
      setHasMore(data.pagination.hasMore);
      setTotalPages(Math.ceil(data.pagination.total / data.pagination.limit));
    } catch (error) {
      console.error("Error fetching Tinte themes:", error);
      setTinteError(
        error instanceof Error ? error.message : "Failed to load themes",
      );
    } finally {
      setLoadingTinteThemes(false);
    }
  }, []);

  // Apply Tinte theme
  const applyTinteTheme = useCallback(
    (tinteTheme: TinteThemePreview) => {
      let shadcnTheme: { light: ShadcnTokens; dark: ShadcnTokens } | null =
        null;

      if (tinteTheme.rawTheme) {
        // Convert Tinte format to shadcn format
        shadcnTheme = convertTinteToShadcn(tinteTheme.rawTheme);
      } else if (
        tinteTheme.overrides?.shadcn?.light &&
        tinteTheme.overrides?.shadcn?.dark
      ) {
        // Use shadcn override only if it has light and dark color objects
        shadcnTheme = tinteTheme.overrides.shadcn;
      }

      if (shadcnTheme) {
        // Convert all colors to hex format
        const lightHex: ShadcnTokens = {};
        const darkHex: ShadcnTokens = {};

        Object.entries(shadcnTheme.light).forEach(([key, value]) => {
          lightHex[key] = convertToHex(value);
        });

        Object.entries(shadcnTheme.dark).forEach(([key, value]) => {
          darkHex[key] = convertToHex(value);
        });

        const hexTheme = { light: lightHex, dark: darkHex };

        setTheme(hexTheme);
        onChange?.(hexTheme);
        setSelectedThemeId(tinteTheme.id);
        setHasUnsavedChanges(true);
      }
    },
    [onChange, convertToHex],
  );

  // Initialize theme
  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    setMode(isDark ? "dark" : "light");
    loadTheme();
  }, [loadTheme]);

  // Fetch Tinte themes when dialog opens
  useEffect(() => {
    if (isOpen && tinteThemes.length === 0) {
      fetchTinteThemes();
    }
  }, [isOpen, tinteThemes.length, fetchTinteThemes]);

  const handleTokenEdit = useCallback(
    (token: string, newValue: string) => {
      setTheme((prev) => {
        const updated = {
          ...prev,
          [mode]: {
            ...prev[mode],
            [token]: newValue,
          },
        };

        onChange?.(updated);
        return updated;
      });

      // Update original formats with new value
      setOriginalFormats((prev) => ({
        ...prev,
        [mode]: {
          ...prev[mode],
          [token]: newValue,
        },
      }));

      // Mark as unsaved
      setHasUnsavedChanges(true);
    },
    [mode, onChange],
  );

  // Sync mode with DOM changes (controlled by next-themes)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setMode(isDark ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Generate raw CSS from theme
  const generateRawCss = useCallback(() => {
    if (!theme.light || !theme.dark) return "";

    const lightTokens = Object.entries(theme.light)
      .map(([key, value]) => `  --${key}: ${value};`)
      .join("\n");

    const darkTokens = Object.entries(theme.dark)
      .map(([key, value]) => `  --${key}: ${value};`)
      .join("\n");

    if (!lightTokens && !darkTokens) return "";

    return `:root {\n${lightTokens}\n}\n\n.dark {\n${darkTokens}\n}`;
  }, [theme]);

  // Parse raw CSS and update theme
  const parseRawCss = useCallback(
    (css: string) => {
      try {
        const light: ShadcnTokens = {};
        const dark: ShadcnTokens = {};

        // Match :root block
        const rootMatch = css.match(/:root\s*\{([^}]+)\}/);
        if (rootMatch) {
          const rootContent = rootMatch[1];
          const variableMatches = rootContent.matchAll(
            /--([^:]+):\s*([^;]+);/g,
          );
          for (const match of variableMatches) {
            const key = match[1].trim();
            const value = match[2].trim();
            light[key] = value;
          }
        }

        // Match .dark block
        const darkMatch = css.match(/\.dark\s*\{([^}]+)\}/);
        if (darkMatch) {
          const darkContent = darkMatch[1];
          const variableMatches = darkContent.matchAll(
            /--([^:]+):\s*([^;]+);/g,
          );
          for (const match of variableMatches) {
            const key = match[1].trim();
            const value = match[2].trim();
            dark[key] = value;
          }
        }

        setTheme({ light, dark });
        onChange?.({ light, dark });
      } catch (error) {
        console.error("Failed to parse CSS:", error);
      }
    },
    [onChange],
  );

  // Update raw CSS when theme changes
  useEffect(() => {
    setRawCss(generateRawCss());
  }, [generateRawCss]);

  // Write to globals.css file
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const writeToGlobals = useCallback(async () => {
    // Use ref to get the latest theme state
    const currentTheme = themeRef.current;

    if (!currentTheme.light || !currentTheme.dark) {
      console.error("Theme is not fully loaded");
      return;
    }

    setSaveStatus("saving");

    // Helper function to apply CSS variables to DOM
    const applyThemeToDOM = () => {
      const root = document.documentElement;
      const isDark = root.classList.contains("dark");
      const activeTheme = isDark ? currentTheme.dark : currentTheme.light;

      // Apply all CSS variables to the root element
      Object.entries(activeTheme).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });

      // Also update the opposite mode by injecting a style element
      // This ensures switching themes works without reload
      const styleId = "tinte-dynamic-theme";
      let styleElement = document.getElementById(styleId) as HTMLStyleElement;

      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }

      const lightTokens = Object.entries(currentTheme.light)
        .map(([key, value]) => `  --${key}: ${value};`)
        .join("\n");

      const darkTokens = Object.entries(currentTheme.dark)
        .map(([key, value]) => `  --${key}: ${value};`)
        .join("\n");

      styleElement.textContent = `:root {\n${lightTokens}\n}\n\n.dark {\n${darkTokens}\n}`;
    };

    try {
      // Ensure all colors are in hex format before saving
      const lightHex: ShadcnTokens = {};
      const darkHex: ShadcnTokens = {};

      Object.entries(currentTheme.light).forEach(([key, value]) => {
        lightHex[key] = convertToHex(value);
      });

      Object.entries(currentTheme.dark).forEach(([key, value]) => {
        darkHex[key] = convertToHex(value);
      });

      const lightTokens = Object.entries(lightHex)
        .map(([key, value]) => `  --${key}: ${value};`)
        .join("\n");

      const darkTokens = Object.entries(darkHex)
        .map(([key, value]) => `  --${key}: ${value};`)
        .join("\n");

      const cssContent = `:root {\n${lightTokens}\n}\n\n.dark {\n${darkTokens}\n}`;

      // Try to write to file (will only work in development)
      const response = await fetch("/api/elements/tinte/write-globals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ css: cssContent }),
      });

      if (response.ok) {
        // Development: File write succeeded
        setSaveStatus("success");
        setHasUnsavedChanges(false);
        applyThemeToDOM();
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        // Production or file write failed: Just apply to DOM
        console.warn(
          "File write failed (expected in production), applying theme to DOM only",
        );
        applyThemeToDOM();
        setSaveStatus("success");
        setHasUnsavedChanges(false);
        setTimeout(() => setSaveStatus("idle"), 2000);
      }
    } catch (error) {
      // Network error or production environment: Apply to DOM only
      console.warn(
        "Could not write to file (expected in production), applying theme to DOM only:",
        error,
      );
      applyThemeToDOM();
      setSaveStatus("success");
      setHasUnsavedChanges(false);
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  }, [convertToHex]);

  const _availableTokens = TOKEN_GROUPS.flatMap((group) =>
    group.tokens.filter((token) => theme[mode]?.[token] !== undefined),
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Floating Ball Trigger */}
      <div className="fixed bottom-4 right-4 z-50">
        <DialogTrigger asChild>
          <button
            type="button"
            className="w-14 h-14 bg-card border-2 border-border rounded-full shadow-lg hover:scale-110 transition-all duration-200 flex items-center justify-center hover:shadow-xl"
            title="Open Theme Editor"
          >
            <TinteLogo className="w-7 h-7 drop-shadow-sm" />
          </button>
        </DialogTrigger>
      </div>

      {/* Dialog Content */}
      <DialogContent showCloseButton={false} className="sm:max-w-2xl">
        {/* Header */}
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <TinteLogo className="w-5 h-5" />
              <DialogTitle className="text-base">Theme Editor</DialogTitle>
              <a
                href="https://tinte.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-1"
              >
                tinte.dev ↗
              </a>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadTheme}
                disabled={loading}
                className="p-1.5 hover:bg-accent rounded-md transition-colors disabled:opacity-50"
                title="Reload from globals.css"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
              <button
                type="button"
                onClick={writeToGlobals}
                disabled={saveStatus === "saving"}
                className={`relative px-3 py-1.5 text-xs rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  hasUnsavedChanges
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse"
                    : "bg-primary/80 text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {hasUnsavedChanges && saveStatus === "idle" && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive" />
                  </span>
                )}
                {saveStatus === "saving" && "Saving..."}
                {saveStatus === "success" && "✅ Saved!"}
                {saveStatus === "error" && "❌ Error"}
                {saveStatus === "idle" &&
                  (hasUnsavedChanges ? "💾 Save" : "Save")}
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="animate-spin mr-2" size={20} />
              <span>Loading theme...</span>
            </div>
          ) : (
            <Tabs
              defaultValue="editor"
              className="flex-1 flex flex-col overflow-hidden"
            >
              <TabsList className="mx-4 mt-4 mb-4">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="browse">Browse</TabsTrigger>
                <TabsTrigger value="raw">Raw CSS</TabsTrigger>
                <TabsTrigger value="agent">Agent</TabsTrigger>
              </TabsList>

              <TabsContent
                value="editor"
                className="flex-1 h-0 flex flex-col overflow-hidden px-4 pb-4"
              >
                <div className="h-[500px] border rounded-md bg-muted/20 overflow-y-auto p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-2"
                    defaultValue="Background & Text"
                  >
                    {TOKEN_GROUPS.map((group) => {
                      const groupTokens = group.tokens.filter(
                        (token) => theme[mode]?.[token] !== undefined,
                      );
                      if (groupTokens.length === 0) return null;

                      return (
                        <AccordionItem
                          value={group.label}
                          key={group.label}
                          className="rounded-md border bg-background px-4 py-1 outline-none last:border-b has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
                        >
                          <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline focus-visible:ring-0">
                            <span className="uppercase tracking-wide">
                              {group.label} ({groupTokens.length})
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="pb-2">
                            <div className="grid gap-3 sm:grid-cols-2">
                              {groupTokens.map((token) => (
                                <div key={token} className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                      {token.replace(/-/g, " ")}
                                    </span>
                                    <span className="text-xs text-muted-foreground font-mono">
                                      {detectColorFormat(theme[mode][token])}
                                    </span>
                                  </div>
                                  <ColorInput
                                    value={theme[mode][token]}
                                    onChange={(color) =>
                                      handleTokenEdit(token, color)
                                    }
                                    label={token}
                                  />
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              </TabsContent>

              <TabsContent
                value="browse"
                className="flex-1 h-0 flex flex-col overflow-hidden px-4 pb-4"
              >
                <div className="flex flex-col gap-4 h-[500px]">
                  <div className="flex-1 border rounded-md bg-muted/20 overflow-y-auto p-4">
                    {loadingTinteThemes ? (
                      <div className="flex flex-col items-center justify-center h-full gap-3">
                        <Loader2 className="animate-spin" size={32} />
                        <p className="text-sm text-muted-foreground">
                          Loading themes from tinte.dev...
                        </p>
                      </div>
                    ) : tinteError ? (
                      <div className="flex flex-col items-center justify-center h-full gap-4">
                        <div className="text-4xl">⚠️</div>
                        <div className="text-center space-y-2 max-w-md">
                          <h3 className="font-semibold text-lg">
                            Failed to Load Themes
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {tinteError}
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => fetchTinteThemes()}
                            className="mt-2"
                          >
                            <RefreshCw size={16} className="mr-2" />
                            Try Again
                          </Button>
                        </div>
                      </div>
                    ) : tinteThemes.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full gap-3">
                        <p className="text-sm text-muted-foreground">
                          No themes available
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => fetchTinteThemes()}
                          size="sm"
                        >
                          <RefreshCw size={16} className="mr-2" />
                          Refresh
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <Input
                                type="text"
                                placeholder="Search themes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    setActiveSearch(searchQuery);
                                    fetchTinteThemes(1, searchQuery);
                                  }
                                }}
                                className="h-9 pr-8"
                              />
                              {searchQuery && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSearchQuery("");
                                    setActiveSearch("");
                                    fetchTinteThemes(1);
                                  }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-sm transition-colors"
                                >
                                  <X className="h-3 w-3 text-muted-foreground" />
                                </button>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setActiveSearch(searchQuery);
                                fetchTinteThemes(1, searchQuery);
                              }}
                              disabled={!searchQuery}
                              className="h-9"
                            >
                              <Search className="h-3.5 w-3.5 mr-1.5" />
                              Search
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                fetchTinteThemes(currentPage, activeSearch)
                              }
                              title="Refresh themes"
                              className="h-9 w-9"
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              {tinteThemes.length} themes
                              {activeSearch
                                ? ` matching "${activeSearch}"`
                                : ""}
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-3">
                          {tinteThemes.map((tinteTheme) => {
                            const isSelected =
                              selectedThemeId === tinteTheme.id;
                            return (
                              <button
                                key={tinteTheme.id}
                                type="button"
                                onClick={() => applyTinteTheme(tinteTheme)}
                                className={`group text-left p-4 border-2 rounded-lg transition-all relative ${
                                  isSelected
                                    ? "border-primary bg-primary/10 shadow-md"
                                    : "border-border hover:border-primary hover:bg-accent/50"
                                }`}
                              >
                                {isSelected && (
                                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-medium">
                                    Selected
                                  </div>
                                )}
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 space-y-1.5">
                                    <h4
                                      className={`font-medium transition-colors ${
                                        isSelected
                                          ? "text-primary"
                                          : "group-hover:text-primary"
                                      }`}
                                    >
                                      {tinteTheme.name}
                                    </h4>
                                    {tinteTheme.concept && (
                                      <p className="text-xs text-muted-foreground line-clamp-2">
                                        {tinteTheme.concept}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex gap-1.5 shrink-0">
                                    {[
                                      tinteTheme.colors.background,
                                      tinteTheme.colors.primary,
                                      tinteTheme.colors.secondary,
                                      tinteTheme.colors.accent,
                                      tinteTheme.colors.foreground,
                                    ].map((color, idx) => (
                                      <div
                                        key={`${tinteTheme.id}-color-${idx}`}
                                        className="w-6 h-6 rounded border border-border/50"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Pagination Controls */}
                  {!loadingTinteThemes &&
                    !tinteError &&
                    tinteThemes.length > 0 && (
                      <div className="flex items-center justify-between px-2 py-3 border-t">
                        <div className="text-xs text-muted-foreground">
                          Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              fetchTinteThemes(currentPage - 1, activeSearch)
                            }
                            disabled={currentPage === 1 || loadingTinteThemes}
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              fetchTinteThemes(currentPage + 1, activeSearch)
                            }
                            disabled={!hasMore || loadingTinteThemes}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                </div>
              </TabsContent>

              <TabsContent
                value="raw"
                className="flex-1 h-0 flex flex-col overflow-hidden px-4 pb-4"
              >
                <Textarea
                  value={rawCss}
                  onChange={(e) => {
                    setRawCss(e.target.value);
                    parseRawCss(e.target.value);
                  }}
                  className="h-[500px] w-full bg-muted/40 font-mono text-xs resize-none border border-border focus-visible:ring-0 p-4"
                  placeholder="Paste your CSS here..."
                  spellCheck={false}
                />
              </TabsContent>

              <TabsContent
                value="agent"
                className="flex-1 h-0 flex flex-col overflow-hidden px-4 pb-4"
              >
                <div className="h-[500px] flex flex-col gap-3">
                  <div className="flex-1 border rounded-md bg-muted/20 overflow-y-auto p-4 space-y-2">
                    {apiKeyError ? (
                      <div className="flex flex-col items-center justify-center h-full gap-4">
                        <div className="text-center space-y-3 max-w-md">
                          <div className="text-4xl">🔑</div>
                          <h3 className="font-semibold text-lg">
                            OpenAI API Key Required
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            To use the AI Theme Generator, you need to configure
                            your OpenAI API key.
                          </p>
                          <div className="bg-muted rounded-lg p-4 text-left space-y-2">
                            <p className="text-xs font-medium">
                              Add to your{" "}
                              <code className="bg-background px-1.5 py-0.5 rounded">
                                .env.local
                              </code>{" "}
                              file:
                            </p>
                            <pre className="bg-background p-2 rounded text-xs overflow-x-auto">
                              <code>OPENAI_API_KEY=your-api-key-here</code>
                            </pre>
                            <p className="text-xs text-muted-foreground">
                              Get your API key from{" "}
                              <a
                                href="https://platform.openai.com/api-keys"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                platform.openai.com/api-keys
                              </a>
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setApiKeyError(false);
                            }}
                            className="mt-2"
                          >
                            I've added the API key
                          </Button>
                        </div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-6">
                        <div className="text-center space-y-2">
                          <h3 className="font-semibold text-lg">
                            AI Theme Generator
                          </h3>
                          <p className="text-muted-foreground text-sm max-w-md">
                            Describe your ideal theme and let AI generate a
                            complete color palette for you
                          </p>
                        </div>
                        <div className="grid gap-2 w-full max-w-md px-4">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                            Suggested prompts:
                          </p>
                          <Button
                            variant="outline"
                            onClick={() =>
                              sendMessage({
                                text: "Create a purple theme with high contrast for accessibility",
                              })
                            }
                            className="justify-start h-auto py-3 whitespace-normal text-left"
                          >
                            Create a purple theme with high contrast
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              sendMessage({
                                text: "Generate a warm autumn theme with orange and brown tones",
                              })
                            }
                            className="justify-start h-auto py-3 whitespace-normal text-left"
                          >
                            Generate a warm autumn theme
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              sendMessage({
                                text: "Create a modern dark theme with blue accents",
                              })
                            }
                            className="justify-start h-auto py-3 whitespace-normal text-left"
                          >
                            Create a modern dark theme with blue accents
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              sendMessage({
                                text: "Design a soft pastel theme perfect for a wellness app",
                              })
                            }
                            className="justify-start h-auto py-3 whitespace-normal text-left"
                          >
                            Design a soft pastel wellness theme
                          </Button>
                        </div>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <ChatMessage
                          key={message.id}
                          message={message}
                          onApplyTheme={handleApplyTheme}
                        />
                      ))
                    )}
                  </div>
                  <ChatInput
                    onSubmit={(msg) => {
                      sendMessage({ text: msg });
                    }}
                    disabled={status === "submitted" || status === "streaming"}
                  />
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
