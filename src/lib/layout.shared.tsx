import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { ElementsLogo } from "@/components/elements-logo";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2 mb-2">
          <ElementsLogo className="size-6" />
          <span className="font-medium text-lg">Elements</span>
        </div>
      ),
    },
    // @ts-expect-error
    sidebar: {
      collapsible: false,
    },
  };
}
