"use client";

import * as React from "react";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import {
  Brain,
  ChevronDown,
  Clock,
  History,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Trash2,
  User,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

type MemoryType = "working" | "history" | "system";
type MemorySource = "user" | "system" | "conversation";

interface MemoryItem {
  id: string;
  content: string;
  type: MemoryType;
  source?: MemorySource;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

interface AiMemoryViewerContextValue {
  workingMemory: MemoryItem[];
  conversationHistory: MemoryItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAdd?: (content: string, type: string) => void;
  onRemove?: (id: string) => void;
  maxItems?: number;
}

const AiMemoryViewerContext =
  React.createContext<AiMemoryViewerContextValue | null>(null);

function useMemoryViewerContext() {
  const context = React.useContext(AiMemoryViewerContext);
  if (!context) {
    throw new Error(
      "AiMemoryViewer components must be used within <AiMemoryViewer>",
    );
  }
  return context;
}

interface AiMemoryViewerProps {
  workingMemory?: MemoryItem[];
  conversationHistory?: MemoryItem[];
  onAdd?: (content: string, type: string) => void;
  onRemove?: (id: string) => void;
  maxItems?: number;
  children?: React.ReactNode;
  className?: string;
}

function AiMemoryViewer({
  workingMemory = [],
  conversationHistory = [],
  onAdd,
  onRemove,
  maxItems,
  children,
  className,
}: AiMemoryViewerProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const contextValue = React.useMemo(
    () => ({
      workingMemory,
      conversationHistory,
      searchQuery,
      setSearchQuery,
      onAdd,
      onRemove,
      maxItems,
    }),
    [
      workingMemory,
      conversationHistory,
      searchQuery,
      onAdd,
      onRemove,
      maxItems,
    ],
  );

  return (
    <AiMemoryViewerContext.Provider value={contextValue}>
      <div
        data-slot="ai-memory-viewer"
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground overflow-hidden",
          className,
        )}
      >
        {children ?? (
          <>
            <AiMemoryViewerHeader />
            <AiMemoryViewerSearch />
            <AiMemoryViewerContent />
          </>
        )}
      </div>
    </AiMemoryViewerContext.Provider>
  );
}

interface AiMemoryViewerHeaderProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

function AiMemoryViewerHeader({
  title = "Memory",
  children,
  className,
}: AiMemoryViewerHeaderProps) {
  const { workingMemory, conversationHistory, maxItems } =
    useMemoryViewerContext();

  const totalItems = workingMemory.length + conversationHistory.length;

  return (
    <div
      data-slot="ai-memory-viewer-header"
      className={cn(
        "flex items-center justify-between gap-3 px-4 py-3 border-b border-border",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-purple-100 dark:bg-purple-950">
          <Brain className="size-4 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">{title}</h3>
          <span className="text-xs text-muted-foreground">
            {totalItems} items
            {maxItems && ` / ${maxItems} max`}
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}

interface AiMemoryViewerSearchProps {
  placeholder?: string;
  className?: string;
}

function AiMemoryViewerSearch({
  placeholder = "Search memory...",
  className,
}: AiMemoryViewerSearchProps) {
  const { searchQuery, setSearchQuery } = useMemoryViewerContext();

  return (
    <div
      data-slot="ai-memory-viewer-search"
      className={cn("px-4 py-2 border-b border-border", className)}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-md border border-input bg-background px-9 py-2 text-sm",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

interface AiMemoryViewerContentProps {
  className?: string;
}

function AiMemoryViewerContent({ className }: AiMemoryViewerContentProps) {
  return (
    <div
      data-slot="ai-memory-viewer-content"
      className={cn("p-4 space-y-4", className)}
    >
      <AiMemoryViewerSection type="working" />
      <AiMemoryViewerSection type="history" />
    </div>
  );
}

interface AiMemoryViewerSectionProps {
  type: "working" | "history";
  defaultOpen?: boolean;
  className?: string;
}

function AiMemoryViewerSection({
  type,
  defaultOpen = true,
  className,
}: AiMemoryViewerSectionProps) {
  const { workingMemory, conversationHistory, searchQuery, onAdd } =
    useMemoryViewerContext();
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const items = type === "working" ? workingMemory : conversationHistory;

  const filteredItems = React.useMemo(() => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter((item) => item.content.toLowerCase().includes(query));
  }, [items, searchQuery]);

  const sectionConfig = React.useMemo(() => {
    if (type === "working") {
      return {
        title: "Working Memory",
        description: "Active context for current conversation",
        icon: <Brain className="size-4" />,
        iconBg: "bg-purple-100 dark:bg-purple-950",
        iconColor: "text-purple-600 dark:text-purple-400",
      };
    }
    return {
      title: "Conversation History",
      description: "Past interactions and context",
      icon: <History className="size-4" />,
      iconBg: "bg-blue-100 dark:bg-blue-950",
      iconColor: "text-blue-600 dark:text-blue-400",
    };
  }, [type]);

  return (
    <CollapsiblePrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <div
        data-slot="ai-memory-viewer-section"
        data-type={type}
        className={cn(
          "rounded-lg border border-border overflow-hidden",
          className,
        )}
      >
        <CollapsiblePrimitive.Trigger
          className={cn(
            "flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-colors",
            "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-md",
              sectionConfig.iconBg,
            )}
          >
            <span className={sectionConfig.iconColor}>
              {sectionConfig.icon}
            </span>
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <span className="font-medium">{sectionConfig.title}</span>
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {filteredItems.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {sectionConfig.description}
            </p>
          </div>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </CollapsiblePrimitive.Trigger>
        <CollapsiblePrimitive.Content className="border-t border-border data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="p-4 space-y-2">
            {filteredItems.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                {searchQuery ? "No matching items" : "No items yet"}
              </div>
            ) : (
              filteredItems.map((item) => (
                <AiMemoryViewerItem key={item.id} item={item} />
              ))
            )}
            {onAdd && type === "working" && (
              <AiMemoryViewerAddButton type={type} />
            )}
          </div>
        </CollapsiblePrimitive.Content>
      </div>
    </CollapsiblePrimitive.Root>
  );
}

interface AiMemoryViewerItemProps {
  item: MemoryItem;
  className?: string;
}

function AiMemoryViewerItem({ item, className }: AiMemoryViewerItemProps) {
  const { onRemove } = useMemoryViewerContext();

  const sourceConfig = React.useMemo(() => {
    const configs: Record<
      MemorySource,
      { icon: React.ReactNode; label: string; className: string }
    > = {
      user: {
        icon: <User className="size-3" />,
        label: "User",
        className:
          "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      },
      system: {
        icon: <Settings className="size-3" />,
        label: "System",
        className:
          "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      },
      conversation: {
        icon: <MessageSquare className="size-3" />,
        label: "Conversation",
        className:
          "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
      },
    };
    return item.source ? configs[item.source] : null;
  }, [item.source]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div
      data-slot="ai-memory-viewer-item"
      data-type={item.type}
      className={cn(
        "group relative rounded-md border border-border bg-muted/30 p-3 transition-colors hover:bg-muted/50",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-foreground flex-1 min-w-0 pr-8">
          {item.content}
        </p>
        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className={cn(
              "absolute right-2 top-2 flex size-6 items-center justify-center rounded-md transition-colors",
              "text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400",
              "opacity-0 group-hover:opacity-100 focus:opacity-100",
            )}
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        {sourceConfig && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
              sourceConfig.className,
            )}
          >
            {sourceConfig.icon}
            {sourceConfig.label}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3" />
          {formatTime(item.createdAt)}
        </span>
      </div>
    </div>
  );
}

interface AiMemoryViewerAddButtonProps {
  type: MemoryType;
  className?: string;
}

function AiMemoryViewerAddButton({
  type,
  className,
}: AiMemoryViewerAddButtonProps) {
  const { onAdd } = useMemoryViewerContext();
  const [isAdding, setIsAdding] = React.useState(false);
  const [content, setContent] = React.useState("");
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (content.trim() && onAdd) {
        onAdd(content.trim(), type);
        setContent("");
        setIsAdding(false);
      }
    },
    [content, onAdd, type],
  );

  const handleCancel = React.useCallback(() => {
    setContent("");
    setIsAdding(false);
  }, []);

  React.useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  if (!isAdding) {
    return (
      <button
        type="button"
        onClick={() => setIsAdding(true)}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border p-3 text-sm text-muted-foreground transition-colors",
          "hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
      >
        <Plus className="size-4" />
        Add memory
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-2", className)}>
      <textarea
        ref={inputRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter memory content..."
        rows={3}
        className={cn(
          "w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      />
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={handleCancel}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors",
            "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!content.trim()}
          className={cn(
            "rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors",
            "hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          Add
        </button>
      </div>
    </form>
  );
}

interface AiMemoryViewerCompactProps {
  workingMemory?: MemoryItem[];
  conversationHistory?: MemoryItem[];
  className?: string;
}

function AiMemoryViewerCompact({
  workingMemory = [],
  conversationHistory = [],
  className,
}: AiMemoryViewerCompactProps) {
  const totalItems = workingMemory.length + conversationHistory.length;

  return (
    <div
      data-slot="ai-memory-viewer-compact"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm",
        className,
      )}
    >
      <Brain className="size-4 text-purple-600 dark:text-purple-400" />
      <span className="text-xs">
        <span className="font-medium">{workingMemory.length}</span> working
      </span>
      <span className="text-muted-foreground">/</span>
      <span className="text-xs">
        <span className="font-medium">{conversationHistory.length}</span>{" "}
        history
      </span>
      <span className="text-xs text-muted-foreground">
        ({totalItems} total)
      </span>
    </div>
  );
}

export {
  AiMemoryViewer,
  AiMemoryViewerHeader,
  AiMemoryViewerSearch,
  AiMemoryViewerContent,
  AiMemoryViewerSection,
  AiMemoryViewerItem,
  AiMemoryViewerAddButton,
  AiMemoryViewerCompact,
};
export type { AiMemoryViewerProps, MemoryItem, MemoryType, MemorySource };
