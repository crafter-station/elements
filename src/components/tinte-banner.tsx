import TinteLogo from "./tinte-logo";

export function TinteBanner() {
  return (
    <div className="w-full border-border border-dotted border-b-1">
      <div className="flex items-center justify-center px-4 py-2 mx-auto border-border border-dotted border-r-1 border-l-1 bg-muted/30">
        <p className="text-xs sm:text-sm text-center text-muted-foreground">
          <span className="flex items-center justify-center gap-1.5 flex-wrap">
            <span className="flex items-center gap-1.5">
              <TinteLogo size={16} className="inline-block shrink-0" />
              <span className="hidden md:inline">
                Free AI theme generator for shadcn/ui, Cursor, & Zed —
              </span>
              <span className="md:hidden">AI theme generator —</span>
            </span>
            <a
              href="https://tinte.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-mono hover:text-foreground transition-colors font-medium whitespace-nowrap"
            >
              Try tinte.dev
            </a>
          </span>
        </p>
      </div>
    </div>
  );
}
