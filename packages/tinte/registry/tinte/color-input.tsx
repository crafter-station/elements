"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { HsvaColor } from "@uiw/color-convert";
import {
  hexToHsva,
  hsvaToHex,
  hsvaToHslString,
  hsvaToRgbaString,
} from "@uiw/color-convert";
import Wheel from "@uiw/react-color-wheel";
import { formatCss, formatHex, parse } from "culori";

interface ColorInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
}

type ColorFormat = "hex" | "rgb" | "hsl" | "oklch" | "lch";

export default function ColorInput({ id, value, onChange }: ColorInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hsva, setHsva] = useState<HsvaColor>({ h: 0, s: 0, v: 100, a: 1 });
  const [format, setFormat] = useState<ColorFormat>("hex");
  const containerRef = useRef<HTMLDivElement>(null);

  const detectFormat = useCallback((colorValue: string): ColorFormat => {
    const trimmed = colorValue.trim();
    if (trimmed.startsWith("oklch(")) return "oklch";
    if (trimmed.startsWith("lch(")) return "lch";
    if (trimmed.startsWith("rgb(") || trimmed.startsWith("rgba(")) return "rgb";
    if (trimmed.startsWith("hsl(") || trimmed.startsWith("hsla(")) return "hsl";
    return "hex";
  }, []);

  useEffect(() => {
    const detectedFormat = detectFormat(value);
    setFormat(detectedFormat);

    const parsedColor = parse(value.trim());
    if (parsedColor) {
      const hex = formatHex(parsedColor);
      const newHsva = hexToHsva(hex);
      setHsva(newHsva);
    }
  }, [value, detectFormat]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleColorChange = (newHsva: HsvaColor) => {
    setHsva(newHsva);

    let formattedValue: string;

    switch (format) {
      case "hex": {
        formattedValue = hsvaToHex(newHsva);
        break;
      }
      case "rgb": {
        formattedValue = hsvaToRgbaString(newHsva);
        break;
      }
      case "hsl": {
        formattedValue = hsvaToHslString(newHsva);
        break;
      }
      case "oklch":
      case "lch": {
        const hex = hsvaToHex(newHsva);
        const parsed = parse(hex);
        if (parsed) {
          formattedValue =
            formatCss(
              format === "oklch"
                ? { mode: "oklch", ...parsed }
                : { mode: "lch", ...parsed },
            ) || value;
        } else {
          formattedValue = value;
        }
        break;
      }
      default:
        formattedValue = hsvaToHex(newHsva);
    }

    onChange(formattedValue);
  };

  const handleFormatToggle = () => {
    const formats: ColorFormat[] = ["hex", "rgb", "hsl", "oklch", "lch"];
    const currentIndex = formats.indexOf(format);
    const nextFormat = formats[(currentIndex + 1) % formats.length];
    setFormat(nextFormat);

    let formattedValue: string;

    switch (nextFormat) {
      case "hex": {
        formattedValue = hsvaToHex(hsva);
        break;
      }
      case "rgb": {
        formattedValue = hsvaToRgbaString(hsva);
        break;
      }
      case "hsl": {
        formattedValue = hsvaToHslString(hsva);
        break;
      }
      case "oklch": {
        const hex = hsvaToHex(hsva);
        const parsed = parse(hex);
        if (parsed) {
          formattedValue = formatCss({ mode: "oklch", ...parsed }) || value;
        } else {
          formattedValue = value;
        }
        break;
      }
      case "lch": {
        const hex = hsvaToHex(hsva);
        const parsed = parse(hex);
        if (parsed) {
          formattedValue = formatCss({ mode: "lch", ...parsed }) || value;
        } else {
          formattedValue = value;
        }
        break;
      }
      default:
        formattedValue = hsvaToHex(hsva);
    }

    onChange(formattedValue);
  };

  const previewColor = hsvaToHex(hsva);

  return (
    <div ref={containerRef} className="relative flex items-center gap-2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 rounded border shadow-sm transition-transform hover:scale-110"
        style={{ backgroundColor: previewColor }}
        aria-label="Open color picker"
      />
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm font-mono"
      />
      <button
        type="button"
        onClick={handleFormatToggle}
        className="rounded-md border px-3 py-1.5 text-xs font-medium uppercase transition-colors hover:bg-accent"
      >
        {format}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-12 z-50 rounded-lg border bg-popover p-4 shadow-lg">
          <Wheel
            color={hsva}
            onChange={(color) => handleColorChange(color.hsva)}
            width={200}
            height={200}
          />
        </div>
      )}
    </div>
  );
}
