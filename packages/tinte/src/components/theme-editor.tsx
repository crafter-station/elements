"use client";

import { useCallback, useEffect, useState } from "react";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { formatHex, oklch } from "culori";
import { RefreshCw } from "lucide-react";

import { ChatInput } from "./chat/chat-input";
import { Message } from "./chat/message";
import { ColorInput } from "./color-input";
import Logo from "./logo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";

type ShadcnTokens = Record<string, string>;

interface ShadcnTheme {
  light: ShadcnTokens;
  dark: ShadcnTokens;
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

interface ThemeEditorProps {
  onChange?: (theme: ShadcnTheme) => void;
}

export default function ThemeEditor({ onChange }: ThemeEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<ShadcnTheme>({ light: {}, dark: {} });
  const [_originalFormats, setOriginalFormats] = useState<
    Record<string, Record<string, string>>
  >({ light: {}, dark: {} });
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [loading, setLoading] = useState(false);
  const [rawCss, setRawCss] = useState("");

  // Chat functionality
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/tinte/chat",
    }),
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  // Handle theme application from the Message component
  const handleApplyTheme = useCallback(
    (newTheme: { light: ShadcnTokens; dark: ShadcnTokens }) => {
      console.log("Applying theme:", newTheme);

      setTheme(newTheme);
      onChange?.(newTheme);

      // Update original formats
      setOriginalFormats({
        light: { ...newTheme.light },
        dark: { ...newTheme.dark },
      });
    },
    [onChange],
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

  // Convert any color to hex for color picker
  const _convertToHex = useCallback((colorValue: string): string => {
    try {
      const trimmed = colorValue.trim();

      // If it's already hex, return it
      if (trimmed.startsWith("#")) {
        return trimmed;
      }

      // For oklch, rgb, hsl - use culori to convert
      const colorObj = oklch(trimmed);
      if (colorObj) {
        const hex = formatHex(colorObj);
        return hex || "#000000";
      }

      return "#000000";
    } catch {
      return "#000000";
    }
  }, []);

  // Convert hex back to original format
  const _convertFromHex = useCallback(
    (hexColor: string, originalValue: string): string => {
      try {
        const format = detectColorFormat(originalValue);

        switch (format) {
          case "hex":
            return hexColor;

          case "oklch": {
            const oklchColor = oklch(hexColor);
            if (oklchColor) {
              const l = oklchColor.l || 0;
              const c = oklchColor.c || 0;
              const h = oklchColor.h || 0;

              // Match the original format style
              if (originalValue.includes(" / ")) {
                // Handle alpha values like "oklch(1 0 0 / 10%)"
                const alphaMatch = originalValue.match(/\/\s*([\d.]+%?)/);
                const alpha = alphaMatch ? ` / ${alphaMatch[1]}` : "";
                return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(3)}${alpha})`;
              }
              return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(3)})`;
            }
            return originalValue;
          }

          default:
            return hexColor;
        }
      } catch {
        return originalValue;
      }
    },
    [detectColorFormat],
  );

  // Load theme from globals.css
  const loadTheme = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tinte/read-globals");
      if (response.ok) {
        const data = await response.json();
        setTheme(data.theme);

        // Store original formats for each token
        const lightFormats: Record<string, string> = {};
        const darkFormats: Record<string, string> = {};

        Object.entries(data.theme.light).forEach(([key, value]) => {
          lightFormats[key] = value as string;
        });

        Object.entries(data.theme.dark).forEach(([key, value]) => {
          darkFormats[key] = value as string;
        });

        setOriginalFormats({ light: lightFormats, dark: darkFormats });
      } else {
        console.error("Failed to load theme from globals.css");
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
    setLoading(false);
  }, []);

  // Initialize theme
  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    setMode(isDark ? "dark" : "light");
    loadTheme();
  }, [loadTheme]);

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
  }, [theme, generateRawCss]);

  // Write to globals.css file
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const writeToGlobals = useCallback(async () => {
    setSaveStatus("saving");
    try {
      const lightTokens = Object.entries(theme.light)
        .map(([key, value]) => `  --${key}: ${value};`)
        .join("\n");

      const darkTokens = Object.entries(theme.dark)
        .map(([key, value]) => `  --${key}: ${value};`)
        .join("\n");

      const cssContent = `:root {\n${lightTokens}\n}\n\n.dark {\n${darkTokens}\n}`;

      const response = await fetch("/api/tinte/write-globals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ css: cssContent }),
      });

      if (response.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to write globals.css");
      }
    } catch (error) {
      console.error("Failed to write globals.css:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  }, [theme]);

  const availableTokens = TOKEN_GROUPS.flatMap((group) =>
    group.tokens.filter((token) => theme[mode][token] !== undefined),
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
            <Logo size={28} className="drop-shadow-sm" />
          </button>
        </DialogTrigger>
      </div>

      {/* Dialog Content */}
      <DialogContent showCloseButton={false}>
        {/* Header */}
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Logo size={24} />
            <div>
              <DialogTitle>Theme Editor</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Live editing • {availableTokens.length} tokens • {mode} mode
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadTheme}
              disabled={loading}
              className="p-1.5 hover:bg-accent rounded-md transition-colors disabled:opacity-50"
              title="Reload from globals.css"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <span className="px-3 py-1.5 text-sm text-muted-foreground border border-border rounded-md">
              Editing: {mode === "light" ? "☀️ Light" : "🌙 Dark"}
            </span>
            <button
              type="button"
              onClick={writeToGlobals}
              disabled={saveStatus === "saving"}
              className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveStatus === "saving" && "Saving..."}
              {saveStatus === "success" && "✅ Saved!"}
              {saveStatus === "error" && "❌ Error"}
              {saveStatus === "idle" && "Save CSS"}
            </button>
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
                <TabsTrigger value="raw">Raw CSS</TabsTrigger>
                <TabsTrigger value="agent">Agent</TabsTrigger>
              </TabsList>

              <TabsContent
                value="editor"
                className="flex-1 h-0 flex flex-col overflow-hidden px-4 pb-4"
              >
                <div className="flex-1 border rounded-md bg-muted/20 overflow-y-auto p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-2"
                    defaultValue="Background & Text"
                  >
                    {TOKEN_GROUPS.map((group) => {
                      const groupTokens = group.tokens.filter(
                        (token) => theme[mode][token] !== undefined,
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
                value="raw"
                className="flex-1 h-0 flex flex-col overflow-hidden px-4 pb-4"
              >
                <Textarea
                  value={rawCss}
                  onChange={(e) => {
                    setRawCss(e.target.value);
                    parseRawCss(e.target.value);
                  }}
                  className="w-full bg-muted/40 font-mono text-xs resize-none border border-border focus-visible:ring-0 p-4"
                  placeholder="Paste your CSS here..."
                  spellCheck={false}
                  rows={25}
                />
              </TabsContent>

              <TabsContent
                value="agent"
                className="flex-1 h-0 flex flex-col gap-3 overflow-hidden px-4 pb-4"
              >
                <div className="h-[500px] border rounded-md bg-muted/20 overflow-y-auto p-4 space-y-2">
                  {messages.length === 0 ? (
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
                      <Message
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
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
