"use client";

import { useEffect, useRef, useState } from "react";

import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { type StudioElement, useStudioStore } from "../stores/studio-store";
import { StudioSidebar } from "./studio-sidebar";

interface CodePreviewProps {
  element: StudioElement;
  isPending?: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

function CodePreview({
  element,
  isPending = false,
  isSelected,
  onSelect,
}: CodePreviewProps) {
  return (
    <div
      className="absolute"
      style={{
        left: element.position.x,
        top: element.position.y,
      }}
    >
      <div
        className={cn(
          "relative cursor-pointer rounded-lg border bg-background p-4 shadow-sm transition-all",
          isPending && "opacity-50 border-dashed border-primary",
          isSelected &&
            "ring-2 ring-primary ring-offset-2 ring-offset-background",
        )}
        onClick={onSelect}
      >
        <div className="absolute -top-6 left-0 font-mono text-xs text-muted-foreground">
          {element.id}
        </div>
        <pre className="text-xs overflow-x-auto max-w-[400px] max-h-[300px]">
          <code className="text-muted-foreground">{element.code}</code>
        </pre>
      </div>
    </div>
  );
}

export function StudioEditor() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const scale = 1;

  const {
    elements,
    pendingElements,
    selectedId,
    selectElement,
    commitPendingElements,
    clearPendingElements,
  } = useStudioStore();

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.code === "Space" && !isSpacePressed && e.target === document.body) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: globalThis.KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isSpacePressed]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSpacePressed) {
      setIsPanning(true);
      setDragStart({
        x: e.clientX - canvasOffset.x,
        y: e.clientY - canvasOffset.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setCanvasOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const hasPendingElements = pendingElements.length > 0;

  return (
    <div className="flex h-[calc(100svh-1px)] overflow-hidden">
      <StudioSidebar />

      <div className="relative flex-1 bg-muted/30">
        <div
          ref={canvasRef}
          className={cn(
            "absolute inset-0",
            isSpacePressed ? "cursor-grab" : "cursor-default",
            isPanning && "cursor-grabbing",
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={(e) => {
            if (e.target === canvasRef.current) {
              selectElement(null);
            }
          }}
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`,
          }}
        >
          <div
            className="relative"
            style={{
              transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${scale})`,
              transformOrigin: "0 0",
            }}
          >
            {elements.map((element) => (
              <CodePreview
                key={element.id}
                element={element}
                isSelected={element.id === selectedId}
                onSelect={() => selectElement(element.id)}
              />
            ))}

            {pendingElements.map((element) => (
              <CodePreview
                key={element.id}
                element={element}
                isPending
                isSelected={false}
                onSelect={() => {}}
              />
            ))}
          </div>
        </div>

        {hasPendingElements && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <Button onClick={commitPendingElements} className="shadow-lg">
              <Check className="h-4 w-4 mr-2" />
              Apply Changes
            </Button>
            <Button
              variant="outline"
              onClick={clearPendingElements}
              className="shadow-lg"
            >
              <X className="h-4 w-4 mr-2" />
              Discard
            </Button>
          </div>
        )}

        {isSpacePressed && (
          <div className="absolute bottom-8 right-8 rounded-lg bg-background/80 backdrop-blur px-3 py-1.5 text-sm text-muted-foreground border">
            Hold and drag to pan
          </div>
        )}
      </div>
    </div>
  );
}
