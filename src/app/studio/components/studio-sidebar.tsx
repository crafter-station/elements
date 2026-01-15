"use client";

import { useState } from "react";

import { MessageSquare } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { StudioChat } from "./studio-chat";

interface StudioSidebarProps {
  className?: string;
}

export function StudioSidebar({ className }: StudioSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "hidden lg:flex flex-col h-full w-[400px] border-r bg-background",
          className,
        )}
      >
        <StudioChat />
      </div>

      <div className="lg:hidden fixed bottom-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="icon" className="h-12 w-12 rounded-full shadow-lg">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-[400px] p-0">
            <StudioChat />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
