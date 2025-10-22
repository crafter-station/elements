import { track } from "@vercel/analytics";

import { Button } from "@/components/ui/button";
import { V0Logo } from "@/components/ui/logos/v0";

export interface OpenInV0ButtonProps {
  url: string;
  componentKey?: string;
  source?: string;
}

export function OpenInV0Button({
  url,
  componentKey = "unknown",
  source = "unknown",
}: OpenInV0ButtonProps) {
  const handleClick = () => {
    track("Open in v0 Click", {
      component_key: componentKey,
      registry_url: url,
      source: source,
      action: "external_tool_integration",
    });
  };

  return (
    <Button
      aria-label="Open in v0"
      size="sm"
      className="h-8 gap-1 bg-black px-3 text-xs text-white hover:bg-black hover:text-white dark:bg-white dark:text-black"
      asChild
    >
      <a
        href={`https://v0.dev/chat/api/open?url=${url}&via=hugo-railly`}
        target="_blank"
        rel="noreferrer"
        onClick={handleClick}
      >
        Open in <V0Logo className="h-3 w-6" />
      </a>
    </Button>
  );
}
