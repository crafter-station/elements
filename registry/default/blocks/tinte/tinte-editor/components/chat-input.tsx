import type { ComponentProps, FormEvent } from "react";
import { useState } from "react";

import { SendIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export type ChatInputProps = Omit<ComponentProps<"form">, "onSubmit"> & {
  onSubmit: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export const ChatInput = ({
  className,
  onSubmit,
  disabled,
  placeholder = "Ask the AI to generate or modify your theme...",
  ...props
}: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSubmit(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      className={cn("flex gap-2 border rounded-md p-2", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 font-sans text-sm resize-none"
        style={{ minHeight: "80px" }}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!input.trim() || disabled}
        className="shrink-0 self-end"
      >
        <SendIcon className="size-4" />
      </Button>
    </form>
  );
};
