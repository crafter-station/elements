export function TinteBanner() {
  return (
    <div className="w-full border-border border-dotted border-b-1">
      <div className="flex items-center justify-center px-4 py-2 mx-auto border-border border-dotted border-r-1 border-l-1 bg-muted/30">
        <p className="text-xs sm:text-sm text-center text-muted-foreground">
          ✨ Free AI theme generator for ShadCN, VS Code & Zed —{" "}
          <a
            href="https://tinte.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors font-medium"
          >
            Try Tinte.dev
          </a>
        </p>
      </div>
    </div>
  );
}
