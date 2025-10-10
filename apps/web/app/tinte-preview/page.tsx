import ThemeEditor from "@/../../packages/tinte/src/components/theme-editor";

export default function TintePreviewPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Tinte Theme Editor Preview
          </h1>
          <p className="text-muted-foreground">
            Click the floating purple ball in the bottom-right corner to open
            the theme editor
          </p>
        </div>

        <div className="grid gap-6">
          {/* Background & Text */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Background & Text</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-lg border bg-background">
                <p className="font-medium mb-2">Background</p>
                <p className="text-sm text-foreground">
                  Foreground text on background
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <p className="font-medium mb-2 text-card-foreground">Card</p>
                <p className="text-sm text-card-foreground">
                  Card foreground text
                </p>
              </div>
            </div>
          </div>

          {/* Cards & Surfaces */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Cards & Surfaces</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-lg bg-muted">
                <p className="font-medium mb-2 text-muted-foreground">Muted</p>
                <p className="text-sm text-muted-foreground">
                  Muted foreground text
                </p>
              </div>
              <div className="p-6 rounded-lg bg-accent">
                <p className="font-medium mb-2 text-accent-foreground">
                  Accent
                </p>
                <p className="text-sm text-accent-foreground">
                  Accent foreground text
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Elements */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Interactive Elements</h2>
            <div className="flex gap-4">
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Primary Button
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                Secondary Button
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Destructive Button
              </button>
            </div>
          </div>

          {/* Forms & States */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Forms & States</h2>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Input field"
                className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="p-4 rounded-md border border-border">
                <p className="text-sm">Border color example</p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Charts</h2>
            <div className="flex gap-2 h-32 items-end">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md"
                  style={{
                    backgroundColor: `var(--chart-${i})`,
                    height: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <ThemeEditor />
    </div>
  );
}
