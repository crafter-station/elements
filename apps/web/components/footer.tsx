import Link from "next/link";

import { ElementWrapper } from "@/components/element-wrapper";
import { ThemeSwitcherElement } from "@/components/elements/theme-switcher";

export function Footer() {
  return (
    <div className="border-border border-dotted border-t-1">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-8 border-border border-dotted border-r-1 border-l-1">
        <footer className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 sm:py-5">
          <div className="text-balance text-xs sm:text-sm leading-loose text-muted-foreground order-2 sm:order-1">
            Built by{" "}
            <Link
              href="https://github.com/crafter-station"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Crafter Station
            </Link>{" "}
            and{" "}
            <Link
              href="/contributors"
              className="font-medium underline underline-offset-4"
            >
              contributors
            </Link>
            . The source code is available on{" "}
            <Link
              href="https://github.com/crafter-station/elements"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </div>
          <div className="flex items-center order-1 sm:order-2">
            <ElementWrapper className="max-w-fit">
              <ThemeSwitcherElement />
            </ElementWrapper>
          </div>
        </footer>
      </div>
    </div>
  );
}
