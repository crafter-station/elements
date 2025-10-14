import type { HTMLAttributes } from "react";

import type { UIMessage } from "ai";
import { Streamdown } from "streamdown";

import { cn } from "@/lib/utils";

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  message: UIMessage;
  onApplyTheme?: (theme: { light: any; dark: any }) => void;
};

export const Message = ({
  className,
  message,
  onApplyTheme,
  ...props
}: MessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full gap-2 py-2",
        message.role === "user" ? "justify-end" : "justify-start",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex flex-col gap-3 max-w-[85%]",
          message.role === "user" ? "items-end" : "items-start",
        )}
      >
        {message.parts?.map((part, index) => {
          // Handle text parts
          if (part.type === "text") {
            return (
              <Streamdown className="not-prose" key={index}>
                {part.text}
              </Streamdown>
            );
          }

          // Handle tool-generate-theme parts
          if (part.type === "tool-generate-theme") {
            switch (part.state) {
              case "input-streaming":
              case "input-available": {
                // Show live-building preview with partial data
                const input = part.input as any;
                const isStreaming = part.state === "input-streaming";

                return (
                  <div
                    key={index}
                    className="rounded-lg border border-border bg-card p-3 w-full shadow-sm"
                  >
                    {/* Theme Header - Compact */}
                    <div className="mb-2">
                      <div className="flex items-center gap-2">
                        <span className={isStreaming ? "animate-pulse" : ""}>
                          ✨
                        </span>
                        <h4 className="font-semibold text-xs flex-1">
                          {input?.title || (
                            <span className="text-muted-foreground italic">
                              Generating...
                            </span>
                          )}
                        </h4>
                        {isStreaming && (
                          <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                            <span className="animate-spin">⚙️</span>
                          </span>
                        )}
                      </div>
                      {input?.concept && (
                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                          {input.concept}
                        </p>
                      )}
                    </div>

                    {/* Ultra Compact Color Swatches */}
                    <div className="grid grid-cols-2 gap-1.5 mb-2">
                      {/* Light Mode */}
                      <div>
                        <p className="text-[9px] font-medium mb-1 text-muted-foreground">
                          ☀️ Light
                        </p>
                        <div className="grid grid-cols-8 gap-0.5 p-1 rounded border bg-muted/20">
                          {input?.light ? (
                            Object.entries(input.light)
                              .filter(([key]) => key !== "shadow")
                              .slice(0, 32)
                              .map(([key, value]: [string, any]) => (
                                <div
                                  key={key}
                                  className="h-3 w-full rounded-[2px] animate-in fade-in duration-200"
                                  style={{ backgroundColor: value }}
                                  title={key}
                                />
                              ))
                          ) : (
                            <div className="col-span-8 h-3 flex items-center justify-center text-[8px] text-muted-foreground animate-pulse">
                              ...
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Dark Mode */}
                      <div>
                        <p className="text-[9px] font-medium mb-1 text-muted-foreground">
                          🌙 Dark
                        </p>
                        <div className="grid grid-cols-8 gap-0.5 p-1 rounded border bg-muted/20">
                          {input?.dark ? (
                            Object.entries(input.dark)
                              .filter(([key]) => key !== "shadow")
                              .slice(0, 32)
                              .map(([key, value]: [string, any]) => (
                                <div
                                  key={key}
                                  className="h-3 w-full rounded-[2px] animate-in fade-in duration-200"
                                  style={{ backgroundColor: value }}
                                  title={key}
                                />
                              ))
                          ) : (
                            <div className="col-span-8 h-3 flex items-center justify-center text-[8px] text-muted-foreground animate-pulse">
                              ...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Compact Info */}
                    {input?.fonts && (
                      <p className="text-[9px] text-muted-foreground text-center">
                        {input.fonts.sans} • {input.fonts.mono}
                      </p>
                    )}
                  </div>
                );
              }

              case "output-available": {
                const result = part.output as any;

                if (!result?.light || !result?.dark) {
                  return null;
                }

                return (
                  <div
                    key={index}
                    className="rounded-lg border-2 border-primary/20 bg-card p-3 w-full shadow-md"
                  >
                    {/* Theme Header - Compact */}
                    <div className="mb-2">
                      <div className="flex items-center gap-2">
                        <span>✨</span>
                        <h4 className="font-semibold text-xs flex-1">
                          {result.title}
                        </h4>
                        <span className="px-1.5 py-0.5 text-[9px] bg-primary/10 text-primary rounded font-medium">
                          Ready
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                        {result.concept}
                      </p>
                    </div>

                    {/* Ultra Compact Color Swatches */}
                    <div className="grid grid-cols-2 gap-1.5 mb-2">
                      {/* Light Mode */}
                      <div>
                        <p className="text-[9px] font-medium mb-1 text-muted-foreground">
                          ☀️ Light
                        </p>
                        <div className="grid grid-cols-8 gap-0.5 p-1 rounded border bg-muted/20">
                          {Object.entries(result.light)
                            .filter(([key]) => key !== "shadow")
                            .slice(0, 32)
                            .map(([key, value]: [string, any]) => (
                              <div
                                key={key}
                                className="h-3 w-full rounded-[2px]"
                                style={{ backgroundColor: value }}
                                title={key}
                              />
                            ))}
                        </div>
                      </div>

                      {/* Dark Mode */}
                      <div>
                        <p className="text-[9px] font-medium mb-1 text-muted-foreground">
                          🌙 Dark
                        </p>
                        <div className="grid grid-cols-8 gap-0.5 p-1 rounded border bg-muted/20">
                          {Object.entries(result.dark)
                            .filter(([key]) => key !== "shadow")
                            .slice(0, 32)
                            .map(([key, value]: [string, any]) => (
                              <div
                                key={key}
                                className="h-3 w-full rounded-[2px]"
                                style={{ backgroundColor: value }}
                                title={key}
                              />
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Compact Info + Apply Button */}
                    <div className="space-y-1.5">
                      {result.fonts && (
                        <p className="text-[9px] text-muted-foreground text-center">
                          {result.fonts.sans} • {result.fonts.mono} • Radius:{" "}
                          {result.radius?.lg || "0.5rem"}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          onApplyTheme?.({
                            light: result.light,
                            dark: result.dark,
                          })
                        }
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                      >
                        ✨ Apply Theme
                      </button>
                    </div>
                  </div>
                );
              }

              case "output-error":
                return (
                  <div
                    key={index}
                    className="rounded-lg border border-destructive bg-destructive/10 px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span>⚠️</span>
                      <span className="font-medium text-destructive">
                        Error generating theme
                      </span>
                    </div>
                    <p className="text-destructive/80 text-[10px] mt-1">
                      {part.errorText}
                    </p>
                  </div>
                );
            }
          }

          return null;
        })}
      </div>
    </div>
  );
};
