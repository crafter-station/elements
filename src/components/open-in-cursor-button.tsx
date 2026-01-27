import { track } from "@vercel/analytics";

import { generateCursorUrl } from "@/lib/cursor-prompt";

import { Button } from "@/components/ui/button";
import { CursorLogo } from "@/components/ui/logos/cursor";

export interface OpenInCursorButtonProps {
  installUrl: string;
  componentKey: string;
  componentName?: string;
  description?: string;
  category?: string;
  source?: string;
}

export function OpenInCursorButton({
  installUrl,
  componentKey,
  componentName,
  description,
  category,
  source = "unknown",
}: OpenInCursorButtonProps) {
  const displayName = componentName || componentKey;

  const cursorUrl = generateCursorUrl({
    componentName: displayName,
    installUrl,
    description,
    category,
  });

  const handleClick = () => {
    track("Open in Cursor Click", {
      component_key: componentKey,
      install_url: installUrl,
      source: source,
      action: "cursor_integration",
    });
  };

  return (
    <Button
      aria-label="Open in Cursor"
      size="sm"
      className="h-8 gap-1 bg-black px-3 text-xs text-white hover:bg-black hover:text-white dark:bg-white dark:text-black"
      asChild
    >
      <a
        href={cursorUrl}
        target="_blank"
        rel="noreferrer"
        onClick={handleClick}
      >
        Open in <CursorLogo className="h-3 w-4" />
      </a>
    </Button>
  );
}
