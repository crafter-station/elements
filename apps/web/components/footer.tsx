import Link from "next/link";

import { ElementWrapper } from "@/components/element-wrapper";
import { ThemeSwitcherElement } from "@/components/elements/theme-switcher";

export function Footer() {
  return (
    <div className="w-full border-border border-dotted border-t-1 bg-background">
      <div className="flex items-center justify-between px-4 sm:px-8 mx-auto border-border border-dotted border-r-1 border-l-1 py-2.5 sm:py-3">
        <div className="text-balance text-xs sm:text-sm leading-loose text-muted-foreground">
          By{" "}
          <Link
            href="https://github.com/crafter-station"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Crafter Station
          </Link>
          {" · "}
          <Link
            href="https://github.com/crafter-station/elements"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 hover:text-foreground transition-colors"
          >
            GitHub
          </Link>
          {" · "}
          <Link
            href="/contributors"
            className="font-medium underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Contributors
          </Link>
        </div>
        <div className="flex items-center">
          <ElementWrapper className="max-w-fit">
            <ThemeSwitcherElement />
          </ElementWrapper>
        </div>
      </div>
    </div>
  );
}
