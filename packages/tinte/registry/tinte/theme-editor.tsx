"use client";

import { useCallback, useEffect, useState } from "react";

import { RotateCw, Save, X } from "lucide-react";
import { toast } from "sonner";

import ColorInput from "./color-input";
import Logo from "./logo";

interface ThemeVariable {
  name: string;
  value: string;
}

interface ThemeGroup {
  title: string;
  variables: ThemeVariable[];
}

export default function ThemeEditor() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [groups, setGroups] = useState<ThemeGroup[]>([]);
  const [originalCss, setOriginalCss] = useState("");

  const tokenGroups = {
    "Background & Text": [
      "background",
      "foreground",
      "card",
      "card-foreground",
      "popover",
      "popover-foreground",
    ],
    "Cards & Surfaces": [
      "muted",
      "muted-foreground",
      "accent",
      "accent-foreground",
    ],
    "Interactive Elements": [
      "primary",
      "primary-foreground",
      "secondary",
      "secondary-foreground",
    ],
    "Forms & States": [
      "destructive",
      "destructive-foreground",
      "input",
      "ring",
      "border",
    ],
    Charts: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
    Sidebar: [
      "sidebar-background",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ],
  };

  const extractCSSVariables = useCallback((css: string, selector: string) => {
    const vars = new Map<string, string>();
    const regex = new RegExp(`${selector}\\s*\\{([^}]+)\\}`, "s");
    const match = css.match(regex);

    if (match?.[1]) {
      const lines = match[1].split(";");
      for (const line of lines) {
        const [key, value] = line.split(":").map((s) => s.trim());
        if (key?.startsWith("--") && value) {
          vars.set(key, value);
        }
      }
    }

    return vars;
  }, []);

  const loadThemeVariables = useCallback(async () => {
    try {
      const response = await fetch("/api/tinte/read-globals");
      const data = await response.json();

      if (!data.success) {
        toast.error("Failed to load theme variables");
        return;
      }

      setOriginalCss(data.content);

      const rootVars = extractCSSVariables(data.content, ":root");
      const darkVars = extractCSSVariables(data.content, ".dark");

      const currentVars = theme === "light" ? rootVars : darkVars;

      const newGroups: ThemeGroup[] = Object.entries(tokenGroups).map(
        ([title, varNames]) => ({
          title,
          variables: varNames
            .map((name) => {
              const cssVar = `--${name}`;
              const value = currentVars.get(cssVar) || "";
              return { name, value };
            })
            .filter((v) => v.value),
        }),
      );

      setGroups(newGroups);
    } catch (error) {
      toast.error("Error loading theme variables");
      console.error(error);
    }
  }, [theme, extractCSSVariables]);

  useEffect(() => {
    if (isOpen) {
      loadThemeVariables();
    }
  }, [isOpen, loadThemeVariables]);

  const handleColorChange = (
    groupIndex: number,
    varIndex: number,
    newValue: string,
  ) => {
    setGroups((prev) => {
      const updated = [...prev];
      updated[groupIndex].variables[varIndex].value = newValue;
      return updated;
    });

    const cssVar = `--${groups[groupIndex].variables[varIndex].name}`;
    const root =
      theme === "light" ? document.documentElement : document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    }

    root.style.setProperty(cssVar, newValue);
  };

  const handleSave = async () => {
    try {
      let updatedCss = originalCss;

      const rootVars = new Map<string, string>();
      const darkVars = new Map<string, string>();

      for (const group of groups) {
        for (const variable of group.variables) {
          const cssVar = `--${variable.name}`;
          if (theme === "light") {
            rootVars.set(cssVar, variable.value);
          } else {
            darkVars.set(cssVar, variable.value);
          }
        }
      }

      if (theme === "light") {
        updatedCss = updateCSSBlock(updatedCss, ":root", rootVars);
      } else {
        updatedCss = updateCSSBlock(updatedCss, ".dark", darkVars);
      }

      const response = await fetch("/api/tinte/write-globals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: updatedCss }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Theme saved successfully!");
        setOriginalCss(updatedCss);
      } else {
        toast.error("Failed to save theme");
      }
    } catch (error) {
      toast.error("Error saving theme");
      console.error(error);
    }
  };

  const updateCSSBlock = (
    css: string,
    selector: string,
    vars: Map<string, string>,
  ) => {
    const regex = new RegExp(`(${selector}\\s*\\{)([^}]+)(\\})`, "s");
    const match = css.match(regex);

    if (!match) return css;

    const existingVars = new Map<string, string>();
    const lines = match[2].split(";");

    for (const line of lines) {
      const [key, value] = line.split(":").map((s) => s.trim());
      if (key?.startsWith("--") && value) {
        existingVars.set(key, value);
      }
    }

    for (const [key, value] of vars) {
      existingVars.set(key, value);
    }

    const newBlock = Array.from(existingVars.entries())
      .map(([key, value]) => `    ${key}: ${value};`)
      .join("\n");

    return css.replace(regex, `${match[1]}\n${newBlock}\n  ${match[3]}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 shadow-lg transition-transform hover:scale-110 active:scale-95"
        aria-label="Open theme editor"
      >
        <Logo size={28} className="text-white" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-lg border bg-background shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-6 py-4">
              <div className="flex items-center gap-3">
                <Logo size={32} />
                <h2 className="text-xl font-semibold">Theme Editor</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
                >
                  {theme === "light" ? "🌙 Dark" : "☀️ Light"}
                </button>
                <button
                  type="button"
                  onClick={loadThemeVariables}
                  className="rounded-md border p-2 transition-colors hover:bg-accent"
                  aria-label="Reload theme"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md border p-2 transition-colors hover:bg-accent"
                  aria-label="Close theme editor"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              className="overflow-y-auto p-6"
              style={{ maxHeight: "calc(90vh - 80px)" }}
            >
              {groups.map((group, groupIndex) => (
                <div key={group.title} className="mb-6">
                  <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                    {group.title}
                  </h3>
                  <div className="space-y-3">
                    {group.variables.map((variable, varIndex) => (
                      <div
                        key={variable.name}
                        className="flex items-center gap-3"
                      >
                        <label
                          htmlFor={`var-${groupIndex}-${varIndex}`}
                          className="min-w-[200px] text-sm font-mono"
                        >
                          --{variable.name}
                        </label>
                        <ColorInput
                          id={`var-${groupIndex}-${varIndex}`}
                          value={variable.value}
                          onChange={(newValue) =>
                            handleColorChange(groupIndex, varIndex, newValue)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
