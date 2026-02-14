"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileCode, Clipboard, X } from "lucide-react";

interface CodeInputProps {
  code: string;
  fileName: string;
  onCodeChange: (code: string) => void;
  onFileNameChange: (fileName: string) => void;
}

export function CodeInput({
  code,
  fileName,
  onCodeChange,
  onFileNameChange,
}: CodeInputProps) {
  const [isPasting, setIsPasting] = useState(false);

  const handlePasteFromClipboard = async () => {
    try {
      setIsPasting(true);
      const text = await navigator.clipboard.readText();
      onCodeChange(text);
    } catch (error) {
      console.error("Failed to paste:", error);
    } finally {
      setIsPasting(false);
    }
  };

  const handleClear = () => {
    onCodeChange("");
    onFileNameChange("");
  };

  const lineCount = code.split("\n").length;
  const charCount = code.length;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fileName" className="flex items-center gap-2">
          <FileCode className="h-4 w-4" />
          File Name (Optional)
        </Label>
        <Input
          id="fileName"
          value={fileName}
          onChange={(e) => onFileNameChange(e.target.value)}
          placeholder="button.tsx"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="code">Component Code</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handlePasteFromClipboard}
              disabled={isPasting}
            >
              <Clipboard className="h-4 w-4 mr-2" />
              Paste
            </Button>
            {code && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>
        <Textarea
          id="code"
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder="Paste your React/TypeScript component here..."
          className="font-mono text-sm min-h-[400px] resize-y"
          spellCheck={false}
        />
        <div className="flex gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary">{lineCount} lines</Badge>
          <Badge variant="secondary">{charCount} characters</Badge>
        </div>
      </div>
    </div>
  );
}
