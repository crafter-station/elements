"use client";

import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { hexToHsva, hsvaToHex } from "@uiw/color-convert";
import { Colorful } from "@uiw/react-color";
import { hsl as culoriHsl, formatHex, lch, oklch, rgb } from "culori";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
}

const getContrastColor = (hexColor: string): string => {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#ffffff";
};

const toHex = (colorValue: string): string => {
  try {
    if (colorValue.startsWith("#")) return colorValue;
    if (colorValue.startsWith("oklch(")) {
      const parsed = oklch(colorValue);
      return parsed ? formatHex(parsed) : "#000000";
    }
    if (colorValue.startsWith("lch(")) {
      const parsed = lch(colorValue);
      return parsed ? formatHex(parsed) : "#000000";
    }
    if (colorValue.startsWith("hsl(")) {
      const parsed = culoriHsl(colorValue);
      return parsed ? formatHex(parsed) : "#000000";
    }
    if (colorValue.startsWith("rgb(")) {
      const parsed = rgb(colorValue);
      return parsed ? formatHex(parsed) : "#000000";
    }
    return "#000000";
  } catch {
    return "#000000";
  }
};

const detectFormat = (
  colorValue: string,
): "hex" | "rgb" | "hsl" | "oklch" | "lch" => {
  if (colorValue.startsWith("oklch(")) return "oklch";
  if (colorValue.startsWith("lch(")) return "lch";
  if (colorValue.startsWith("hsl(")) return "hsl";
  if (colorValue.startsWith("rgb(")) return "rgb";
  return "hex";
};

const fromHex = (
  hexValue: string,
  format: "hex" | "rgb" | "hsl" | "oklch" | "lch",
): string => {
  try {
    const rgbColor = rgb(hexValue);
    if (!rgbColor) return hexValue;
    switch (format) {
      case "hex":
        return hexValue;
      case "rgb": {
        const r = Math.round(rgbColor.r * 255);
        const g = Math.round(rgbColor.g * 255);
        const b = Math.round(rgbColor.b * 255);
        return `rgb(${r} ${g} ${b})`;
      }
      case "hsl": {
        const hslColor = culoriHsl(hexValue);
        if (!hslColor) return hexValue;
        const h = Math.round(hslColor.h || 0);
        const s = Math.round((hslColor.s || 0) * 100);
        const l = Math.round((hslColor.l || 0) * 100);
        return `hsl(${h} ${s}% ${l}%)`;
      }
      case "oklch": {
        const oklchColor = oklch(hexValue);
        if (!oklchColor) return hexValue;
        const l = (oklchColor.l || 0).toFixed(3);
        const c = (oklchColor.c || 0).toFixed(3);
        const h = Math.round(oklchColor.h || 0);
        return `oklch(${l} ${c} ${h})`;
      }
      case "lch": {
        const lchColor = lch(hexValue);
        if (!lchColor) return hexValue;
        const l = Math.round(lchColor.l || 0);
        const c = Math.round(lchColor.c || 0);
        const h = Math.round(lchColor.h || 0);
        return `lch(${l} ${c} ${h})`;
      }
      default:
        return hexValue;
    }
  } catch {
    return hexValue;
  }
};

export function ColorInput({
  value,
  onChange,
  label,
  disabled = false,
}: ColorInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [activeTab, setActiveTab] = useState("hex");
  const originalFormat = useMemo(() => detectFormat(value), [value]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const hexColor = useMemo(() => toHex(inputValue), [inputValue]);
  const contrastColor = useMemo(() => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(hexColor)) return "#000000";
    return getContrastColor(hexColor);
  }, [hexColor]);

  const colorValues = useMemo(() => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(hexColor)) {
      return {
        hex: "#000000",
        rgb: { r: 0, g: 0, b: 0 },
        hsl: { h: 0, s: 0, l: 0 },
        oklch: { l: 0, c: 0, h: 0 },
        lch: { l: 0, c: 0, h: 0 },
      };
    }
    const rgbColor = rgb(hexColor);
    const hslColor = culoriHsl(hexColor);
    const oklchColor = oklch(hexColor);
    const lchColor = lch(hexColor);
    return {
      hex: hexColor,
      rgb: rgbColor
        ? {
            r: Math.round(rgbColor.r * 255),
            g: Math.round(rgbColor.g * 255),
            b: Math.round(rgbColor.b * 255),
          }
        : { r: 0, g: 0, b: 0 },
      hsl: hslColor
        ? {
            h: Math.round(hslColor.h || 0),
            s: Math.round((hslColor.s || 0) * 100),
            l: Math.round((hslColor.l || 0) * 100),
          }
        : { h: 0, s: 0, l: 0 },
      oklch: oklchColor
        ? {
            l: Math.round((oklchColor.l || 0) * 100),
            c: Math.round((oklchColor.c || 0) * 100),
            h: Math.round(oklchColor.h || 0),
          }
        : { l: 0, c: 0, h: 0 },
      lch: lchColor
        ? {
            l: Math.round(lchColor.l || 0),
            c: Math.round(lchColor.c || 0),
            h: Math.round(lchColor.h || 0),
          }
        : { l: 0, c: 0, h: 0 },
    };
  }, [hexColor]);

  // Compute display value based on active tab
  const displayValue = useMemo(() => {
    switch (activeTab) {
      case "hex":
        return colorValues.hex;
      case "rgb":
        return `rgb(${colorValues.rgb.r} ${colorValues.rgb.g} ${colorValues.rgb.b})`;
      case "hsl":
        return `hsl(${colorValues.hsl.h} ${colorValues.hsl.s}% ${colorValues.hsl.l}%)`;
      case "oklch":
        return `oklch(${(colorValues.oklch.l / 100).toFixed(3)} ${(colorValues.oklch.c / 100).toFixed(3)} ${colorValues.oklch.h})`;
      case "lch":
        return `lch(${colorValues.lch.l} ${colorValues.lch.c} ${colorValues.lch.h})`;
      default:
        return colorValues.hex;
    }
  }, [activeTab, colorValues]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
        onChange(fromHex(newValue, originalFormat));
      }
    },
    [onChange, originalFormat],
  );

  const handleInputBlur = useCallback(() => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(inputValue)) {
      setInputValue(value);
    }
  }, [inputValue, value]);

  const handleColorfulChange = useCallback(
    (newColor: { hsva: { h: number; s: number; v: number; a: number } }) => {
      const hex = hsvaToHex(newColor.hsva);
      setInputValue(hex);
      onChange(fromHex(hex, originalFormat));
    },
    [onChange, originalFormat],
  );

  const handleQuickColorClick = useCallback(
    (quickColor: string) => {
      setInputValue(quickColor);
      onChange(fromHex(quickColor, originalFormat));
    },
    [onChange, originalFormat],
  );

  const handleColorSpaceChange = useCallback(
    (values: Record<string, number>, colorSpace: string) => {
      let newHex: string | undefined;
      switch (colorSpace) {
        case "rgb":
          newHex = formatHex(
            rgb({
              mode: "rgb",
              r: values.r / 255,
              g: values.g / 255,
              b: values.b / 255,
            }),
          );
          break;
        case "hsl":
          newHex = formatHex(
            culoriHsl({
              mode: "hsl",
              h: values.h,
              s: values.s / 100,
              l: values.l / 100,
            }),
          );
          break;
        case "oklch":
          newHex = formatHex(
            oklch({
              mode: "oklch",
              l: values.l / 100,
              c: values.c / 100,
              h: values.h,
            }),
          );
          break;
        case "lch":
          newHex = formatHex(
            lch({ mode: "lch", l: values.l, c: values.c, h: values.h }),
          );
          break;
        default:
          return;
      }
      if (newHex && /^#[0-9A-Fa-f]{6}$/.test(newHex)) {
        setInputValue(newHex);
        onChange(fromHex(newHex, originalFormat));
      }
    },
    [onChange, originalFormat],
  );

  const hsvaColor = useMemo(() => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(hexColor)) {
      return { h: 0, s: 0, v: 0, a: 1 };
    }
    return hexToHsva(hexColor);
  }, [hexColor]);

  const quickColors = useMemo(
    () => [
      "#000000",
      "#ffffff",
      "#ef4444",
      "#22c55e",
      "#3b82f6",
      "#f59e0b",
      "#a855f7",
      "#ec4899",
    ],
    [],
  );

  return (
    <div className="flex items-center gap-3 py-2">
      <Popover
        open={isOpen && !disabled}
        onOpenChange={(open) => !disabled && setIsOpen(open)}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-10 justify-between font-mono text-sm w-full",
              disabled && "opacity-50 cursor-not-allowed",
            )}
            disabled={disabled}
            style={{ backgroundColor: hexColor, color: contrastColor }}
          >
            <span className="truncate">{displayValue}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-70" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0" align="end" sideOffset={8}>
          <div className="p-4 space-y-4">
            <Colorful
              color={hsvaColor}
              onChange={handleColorfulChange}
              disableAlpha={true}
              style={{ width: "100%" }}
            />

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-5 h-9">
                <TabsTrigger value="hex" className="text-xs">
                  HEX
                </TabsTrigger>
                <TabsTrigger value="rgb" className="text-xs">
                  RGB
                </TabsTrigger>
                <TabsTrigger value="hsl" className="text-xs">
                  HSL
                </TabsTrigger>
                <TabsTrigger value="oklch" className="text-xs">
                  OKLCH
                </TabsTrigger>
                <TabsTrigger value="lch" className="text-xs">
                  LCH
                </TabsTrigger>
              </TabsList>

              <TabsContent value="hex" className="mt-3 space-y-0">
                <Input
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="#000000"
                  className="font-mono text-sm h-9"
                  disabled={disabled}
                />
              </TabsContent>

              <TabsContent value="rgb" className="mt-3 space-y-0">
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">R</Label>
                    <Input
                      type="number"
                      value={colorValues.rgb.r}
                      onChange={(e) =>
                        handleColorSpaceChange(
                          { ...colorValues.rgb, r: Number(e.target.value) },
                          "rgb",
                        )
                      }
                      min="0"
                      max="255"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">G</Label>
                    <Input
                      type="number"
                      value={colorValues.rgb.g}
                      onChange={(e) =>
                        handleColorSpaceChange(
                          { ...colorValues.rgb, g: Number(e.target.value) },
                          "rgb",
                        )
                      }
                      min="0"
                      max="255"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">B</Label>
                    <Input
                      type="number"
                      value={colorValues.rgb.b}
                      onChange={(e) =>
                        handleColorSpaceChange(
                          { ...colorValues.rgb, b: Number(e.target.value) },
                          "rgb",
                        )
                      }
                      min="0"
                      max="255"
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hsl" className="mt-3 space-y-0">
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">H</Label>
                    <Input
                      type="number"
                      value={colorValues.hsl.h}
                      onChange={(e) =>
                        handleColorSpaceChange(
                          { ...colorValues.hsl, h: Number(e.target.value) },
                          "hsl",
                        )
                      }
                      min="0"
                      max="360"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">S</Label>
                    <Input
                      type="number"
                      value={colorValues.hsl.s}
                      onChange={(e) =>
                        handleColorSpaceChange(
                          { ...colorValues.hsl, s: Number(e.target.value) },
                          "hsl",
                        )
                      }
                      min="0"
                      max="100"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">L</Label>
                    <Input
                      type="number"
                      value={colorValues.hsl.l}
                      onChange={(e) =>
                        handleColorSpaceChange(
                          { ...colorValues.hsl, l: Number(e.target.value) },
                          "hsl",
                        )
                      }
                      min="0"
                      max="100"
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="oklch" className="mt-3 space-y-0">
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">L</Label>
                    <Input
                      type="number"
                      value={colorValues.oklch.l}
                      onChange={(e) =>
                        handleColorSpaceChange(
                          { ...colorValues.oklch, l: Number(e.target.value) },
                          "oklch",
                        )
                      }
                      min="0"
                      max="100"
                      step="0.1"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">C</Label>
                    <Input
                      type="number"
                      value={colorValues.oklch.c}
                      onChange={(e) =>
                        handleColorSpaceChange(
                          { ...colorValues.oklch, c: Number(e.target.value) },
                          "oklch",
                        )
                      }
                      min="0"
                      max="100"
                      step="0.1"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">H</Label>
                    <Input
                      type="number"
                      value={colorValues.oklch.h}
                      onChange={(e) =>
                        handleColorSpaceChange(
                          { ...colorValues.oklch, h: Number(e.target.value) },
                          "oklch",
                        )
                      }
                      min="0"
                      max="360"
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="lch" className="mt-3 space-y-0">
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">L</Label>
                    <Input
                      type="number"
                      value={colorValues.lch.l}
                      onChange={(e) =>
                        handleColorSpaceChange(
                          { ...colorValues.lch, l: Number(e.target.value) },
                          "lch",
                        )
                      }
                      min="0"
                      max="100"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">C</Label>
                    <Input
                      type="number"
                      value={colorValues.lch.c}
                      onChange={(e) =>
                        handleColorSpaceChange(
                          { ...colorValues.lch, c: Number(e.target.value) },
                          "lch",
                        )
                      }
                      min="0"
                      max="150"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">H</Label>
                    <Input
                      type="number"
                      value={colorValues.lch.h}
                      onChange={(e) =>
                        handleColorSpaceChange(
                          { ...colorValues.lch, h: Number(e.target.value) },
                          "lch",
                        )
                      }
                      min="0"
                      max="360"
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Quick Colors
              </Label>
              <div className="grid grid-cols-8 gap-2">
                {quickColors.map((quickColor) => (
                  <button
                    key={quickColor}
                    type="button"
                    className="w-full aspect-square rounded border-2 border-border hover:border-foreground hover:scale-110 transition-all"
                    style={{ backgroundColor: quickColor }}
                    onClick={() => handleQuickColorClick(quickColor)}
                    disabled={disabled}
                    aria-label={`Quick color ${quickColor}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
